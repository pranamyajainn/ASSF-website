"use client";

import { createContext, useContext, useId, useRef, useState, type ReactNode } from "react";
import { localeInfo, locales, type Lang } from "@/i18n/config";
import { getAt, pathKey, type Json, type Path, type Scope } from "@/lib/cms/edits";
import { ENUM_KEYS, isHidden, isImagePath, isLongText, isMediaPath, isOpenList, labelAt, labelFor, schemaPath } from "@/lib/cms/schema";
import { blankLike, enumOptions, itemTitle, NEWEST_FIRST, type Trees } from "./model";

export type EditorApi = {
  /** The edition being edited, or "all" to see the three side by side. */
  lang: Lang | "all";
  base: Trees;
  published: Trees;
  current: Trees;
  translated: Set<string>;
  /** Schema paths holding numbers, and those that may be empty (null). */
  numeric: Set<string>;
  nullable: Set<string>;
  split: Set<string>;
  splitField: (path: Path) => void;
  changed: (path: Path) => boolean;
  setField: (path: Path, scope: Scope, value: Json) => void;
  changeList: (path: Path, change: (list: Json[], lang: Lang) => Json[]) => void;
  previews: Record<string, string>;
  upload: (file: File) => Promise<{ path: string; width: number; height: number }>;
  /** Fills a field's Hindi and Kannada from its English, by machine translation. */
  translate: (path: Path) => Promise<void>;
  isOpen: (path: Path) => boolean;
  toggle: (path: Path, open?: boolean) => void;
  focused: string | null;
};

const Ctx = createContext<EditorApi | null>(null);
export const EditorProvider = Ctx.Provider;
export function useEditor(): EditorApi {
  const api = useContext(Ctx);
  if (!api) throw new Error("EditorProvider missing");
  return api;
}

export const fieldId = (path: Path) => `f:${pathKey(path)}`;

/**
 * Whether a field sits in a list that has gained or lost items (a new news
 * entry shifts every entry after it). There, "edited" and "put back the
 * original" would compare a field with a different item's, so they're left out.
 */
function inReshapedList(api: EditorApi, path: Path, against: Trees): boolean {
  for (let i = 1; i < path.length; i++) {
    if (typeof path[i] !== "number") continue;
    const now = getAt(api.current.en, path.slice(0, i));
    const then = getAt(against.en, path.slice(0, i));
    if (!Array.isArray(now) || !Array.isArray(then) || now.length !== then.length) return true;
  }
  return false;
}

const LANG_LABEL: Record<Lang, string> = { en: "English", hi: localeInfo.hi.label, kn: localeInfo.kn.label };

/* ------------------------------------------------------------------ inputs */

/**
 * A text field that keeps its own value while it's being typed in, and hands
 * it to the draft a moment after typing stops (and on leaving the field), so
 * a keystroke never waits for the whole draft to be recomputed.
 */
function TextInput({
  id,
  value,
  onCommit,
  long,
  lang,
  label,
  placeholder,
}: {
  id?: string;
  value: string;
  onCommit: (v: string) => void;
  long: boolean;
  lang?: Lang;
  label: string;
  placeholder?: string;
}) {
  const [local, setLocal] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const commit = (v: string) => {
    if (timer.current) clearTimeout(timer.current);
    if (v !== value) onCommit(v);
  };
  const handlers = {
    onFocus: () => setLocal(value),
    onChange: (e: { target: { value: string } }) => {
      const v = e.target.value;
      setLocal(v);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => commit(v), 500);
    },
    onBlur: () => {
      if (local !== null) commit(local);
      setLocal(null);
    },
  };
  const style = `w-full rounded-md border border-ink/20 bg-white/80 px-3 py-2 text-[0.98rem] leading-relaxed text-ink shadow-[inset_0_1px_2px_rgb(29_24_18/0.06)] outline-none transition-colors placeholder:text-ink/35 focus:border-cinnabar focus:bg-white ${lang === "kn" ? "font-kannada" : ""}`;
  return long ? (
    <textarea
      id={id}
      lang={lang}
      aria-label={label}
      rows={3}
      value={local ?? value}
      placeholder={placeholder}
      {...handlers}
      className={`${style} min-h-[5.5rem] [field-sizing:content]`}
    />
  ) : (
    <input id={id} lang={lang} aria-label={label} type="text" value={local ?? value} placeholder={placeholder} {...handlers} className={style} />
  );
}

function FieldShell({
  path,
  label,
  hint,
  children,
  actions,
  after,
}: {
  path: Path;
  label: string;
  hint?: ReactNode;
  children: ReactNode;
  actions?: ReactNode;
  after?: ReactNode;
}) {
  const api = useEditor();
  const changed = api.changed(path) && !inReshapedList(api, path, api.published);
  const focused = api.focused === pathKey(path);
  return (
    <div
      id={fieldId(path)}
      className={`relative scroll-mt-28 rounded-md py-3 pl-4 pr-1 transition-colors ${focused ? "bg-orpiment/20" : ""}`}
    >
      <span
        aria-hidden="true"
        className={`absolute inset-y-3 left-0 w-[3px] rounded-full ${changed ? "bg-cinnabar" : "bg-transparent"}`}
      />
      <div className="mb-1.5 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <span className="text-[0.95rem] font-medium text-ink">
          {label}
          {changed ? <span className="ml-2 rounded-full bg-cinnabar/12 px-2 py-0.5 text-[0.75rem] font-normal text-cinnabar-deep">edited</span> : null}
        </span>
        {actions ? <span className="flex flex-wrap gap-x-4 text-[0.82rem]">{actions}</span> : null}
      </div>
      {children}
      {hint ? <p className="mt-1.5 text-[0.82rem] leading-snug text-ink-faint">{hint}</p> : null}
      {after}
    </div>
  );
}

/**
 * After the English of a translated field changes: the Hindi and Kannada
 * still say the old thing, so offer to bring them up to date in one step.
 */
function TranslateOffer({ path, behind }: { path: Path; behind: boolean }) {
  const api = useEditor();
  const [state, setState] = useState<{ busy: boolean; error: string | null }>({ busy: false, error: null });
  if (!behind) {
    return <p className="mt-2 text-[0.85rem] text-emerald-800">✓ हिन्दी and ಕನ್ನಡ updated too. Switch the language at the top to read them.</p>;
  }
  return (
    <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5 rounded-md bg-orpiment/15 px-3 py-2 text-[0.88rem] text-ink-soft">
      <span>The हिन्दी and ಕನ್ನಡ pages still say the old words.</span>
      <button
        type="button"
        disabled={state.busy}
        onClick={async () => {
          setState({ busy: true, error: null });
          try {
            await api.translate(path);
            setState({ busy: false, error: null });
          } catch (err) {
            setState({ busy: false, error: err instanceof Error ? err.message : "Translation didn't work." });
          }
        }}
        className="cursor-pointer rounded-md bg-ink px-3 py-1 text-leaf transition-colors hover:bg-cinnabar-deep disabled:opacity-60"
      >
        {state.busy ? "Translating…" : "Translate for me"}
      </button>
      <span className="w-full text-[0.78rem] text-ink-faint">Automatic translation — worth a quick check by someone who reads Hindi and Kannada.</span>
      {state.error ? <span className="w-full text-cinnabar-deep">{state.error}</span> : null}
    </div>
  );
}

const linkButton = "cursor-pointer text-cinnabar-deep underline decoration-cinnabar/40 underline-offset-2 hover:text-cinnabar";

/* ------------------------------------------------------------------ leaves */

function TextField({ path, label }: { path: Path; label: string }) {
  const api = useEditor();
  const key = path[path.length - 1];
  const values = locales.map((l) => getAt(api.current[l], path));
  const bases = locales.map((l) => getAt(api.base[l], path));
  const asText = (v: unknown) => (typeof v === "string" ? v : "");
  const long = values.some((v) => isLongText(key, asText(v)));
  const separate =
    api.translated.has(schemaPath(path)) || api.split.has(pathKey(path)) || values.some((v) => v !== values[0]);
  const tokens = values.some((v) => asText(v).includes("{"));
  const hint = tokens ? "Words in {curly brackets} fill themselves in — for example {folioPrice} becomes the price. Leave them as they are." : undefined;

  // One edition at a time: the usual way to edit.
  if (api.lang !== "all") {
    const lang = api.lang;
    const i = locales.indexOf(lang);
    // Text written once for all three (a name, a place) stays shared when
    // edited in English; in Hindi or Kannada it becomes that edition's own.
    const scope: Scope = !separate && lang === "en" ? "all" : lang;
    const original = bases[i];
    const edited = original !== undefined && values[i] !== original && !inReshapedList(api, path, api.base);
    const published = locales.map((l) => getAt(api.published[l], path));
    const englishChanged =
      lang === "en" && separate && asText(values[0]).trim() !== "" && (values[0] !== published[0] || inReshapedList(api, path, api.published));
    const othersBehind = [1, 2].every((j) => !asText(values[j]) || (values[j] === published[j] && !inReshapedList(api, path, api.published)));
    return (
      <FieldShell
        path={path}
        label={label}
        hint={hint}
        after={englishChanged ? <TranslateOffer path={path} behind={othersBehind} /> : null}
        actions={
          edited ? (
            <button type="button" className={linkButton} onClick={() => api.setField(path, scope, original as Json)}>
              Put back the original
            </button>
          ) : null
        }
      >
        <TextInput
          label={label}
          lang={lang}
          value={asText(values[i])}
          long={long}
          placeholder={lang === "en" ? "" : "Empty — the English shows here until this is written"}
          onCommit={(v) => api.setField(path, scope, v)}
        />
      </FieldShell>
    );
  }

  // All three side by side.
  return (
    <FieldShell path={path} label={label} hint={hint}>
      {separate ? (
        <div className="grid gap-3 lg:grid-cols-3">
          {locales.map((lang, i) => (
            <label key={lang} className="block">
              <span className="mb-1 block text-[0.8rem] text-ink-soft">{LANG_LABEL[lang]}</span>
              <TextInput
                label={`${label} — ${LANG_LABEL[lang]}`}
                lang={lang}
                value={asText(values[i])}
                long={long}
                placeholder={lang === "en" ? "" : "Empty — the English shows here"}
                onCommit={(v) => api.setField(path, lang, v)}
              />
            </label>
          ))}
        </div>
      ) : (
        <>
          <TextInput label={label} value={asText(values[0])} long={long} onCommit={(v) => api.setField(path, "all", v)} />
          <p className="mt-1 text-[0.8rem] text-ink-faint">The same in all three languages.</p>
        </>
      )}
    </FieldShell>
  );
}

function NumberField({ path, label, nullable }: { path: Path; label: string; nullable: boolean }) {
  const api = useEditor();
  const value = getAt(api.current.en, path) as number | null;
  return (
    <FieldShell
      path={path}
      label={label}
      hint={nullable ? "Leave empty while the figure is awaiting the Foundation — the site says so instead of showing a number." : undefined}
    >
      <TextInput
        label={label}
        long={false}
        value={value === null || value === undefined ? "" : String(value)}
        onCommit={(v) => {
          const clean = v.replace(/[,\s₹]/g, "");
          if (!clean) return nullable ? api.setField(path, "all", null) : undefined;
          const n = Number(clean);
          if (Number.isFinite(n)) api.setField(path, "all", n);
        }}
      />
    </FieldShell>
  );
}

/** A figure shown as text ("3,65,520") with its number kept in step behind it. */
function DisplayField({ path, label }: { path: Path; label: string }) {
  const api = useEditor();
  const valuePath = [...path.slice(0, -1), "value"];
  const value = getAt(api.current.en, path) as string;
  return (
    <FieldShell path={path} label={label} hint="Write the figure as it should appear, e.g. 1,34,545.">
      <TextInput
        label={label}
        long={false}
        value={value ?? ""}
        onCommit={(v) => {
          api.setField(path, "all", v);
          const n = Number(v.replace(/[^\d.]/g, ""));
          if (v.trim() && Number.isFinite(n)) api.setField(valuePath, "all", n);
        }}
      />
    </FieldShell>
  );
}

function EnumField({ path, label }: { path: Path; label: string }) {
  const api = useEditor();
  const id = useId();
  const value = getAt(api.current.en, path) as string;
  const options = enumOptions(api.base, path);
  return (
    <FieldShell path={path} label={label}>
      <select
        id={id}
        aria-label={label}
        value={value}
        onChange={(e) => api.setField(path, "all", e.target.value)}
        className="rounded-md border border-ink/20 bg-white/80 px-3 py-2 text-ink outline-none focus:border-cinnabar"
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o === "done" ? "Done" : o === "working" ? "In progress" : o}
          </option>
        ))}
      </select>
    </FieldShell>
  );
}

function PhotoField({ path, label }: { path: Path; label: string }) {
  const api = useEditor();
  const [state, setState] = useState<{ busy: boolean; error: string | null }>({ busy: false, error: null });
  const input = useRef<HTMLInputElement>(null);
  const src = getAt(api.current.en, path) as string;
  const preview = src ? (api.previews[src] ?? src) : null;
  const ratioPath = [...path.slice(0, -1), "ratio"];
  const hasRatio = typeof getAt(api.current.en, ratioPath) === "string";

  async function choose(file: File | undefined) {
    if (!file) return;
    setState({ busy: true, error: null });
    try {
      const uploaded = await api.upload(file);
      api.setField(path, "all", uploaded.path);
      if (hasRatio) api.setField(ratioPath, "all", `${uploaded.width} / ${uploaded.height}`);
      setState({ busy: false, error: null });
    } catch (err) {
      setState({ busy: false, error: err instanceof Error ? err.message : "The photo couldn't be uploaded." });
    } finally {
      if (input.current) input.current.value = "";
    }
  }

  return (
    <FieldShell path={path} label={label} hint="Photos are resized and their location data removed before upload.">
      <div className="flex flex-wrap items-center gap-4">
        <div className="grid h-28 w-40 place-items-center overflow-hidden rounded-md border border-ink/15 bg-leaf-deep">
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element -- a preview of a file not yet on the site
            <img src={preview} alt="" className="size-full object-cover" />
          ) : (
            <span className="px-3 text-center text-[0.82rem] text-cinnabar-deep">No photo yet</span>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <label className="inline-flex w-fit cursor-pointer items-center gap-2 rounded-md border border-ink/25 bg-white/80 px-3.5 py-2 text-[0.92rem] text-ink transition-colors hover:border-cinnabar focus-within:border-cinnabar">
            {state.busy ? "Uploading…" : src ? "Replace photo" : "Choose a photo"}
            <input
              ref={input}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/heic"
              className="sr-only"
              disabled={state.busy}
              onChange={(e) => choose(e.target.files?.[0])}
            />
          </label>
          {state.error ? <span className="text-[0.85rem] text-cinnabar-deep">{state.error}</span> : null}
        </div>
      </div>
    </FieldShell>
  );
}

function Leaf({ path }: { path: Path }) {
  const api = useEditor();
  const key = path[path.length - 1];
  const parent = path[path.length - 2];
  const label =
    typeof key === "number"
      ? `${typeof parent === "string" && ["paragraphs", "bio", "body", "statement"].includes(parent) ? "Paragraph" : "Item"} ${key + 1}`
      : labelAt(path);
  const value = getAt(api.current.en, path);
  const schema = schemaPath(path);

  if (isMediaPath(value)) {
    return (
      <FieldShell path={path} label={label}>
        <p className="text-[0.9rem] text-ink-soft">A film or share card — the web team changes these.</p>
      </FieldShell>
    );
  }
  if (isImagePath(value) || (typeof key === "string" && ["src", "image", "portrait"].includes(key) && value === "")) {
    return <PhotoField path={path} label={label} />;
  }
  if (typeof value === "boolean") {
    return (
      <FieldShell path={path} label={label}>
        <input type="checkbox" checked={value} onChange={(e) => api.setField(path, "all", e.target.checked)} />
      </FieldShell>
    );
  }
  if (typeof value === "number" || (value === null && api.numeric.has(schema))) {
    return <NumberField path={path} label={label} nullable={value === null || api.nullable.has(schema)} />;
  }
  if (typeof key === "string" && ENUM_KEYS.has(key)) return <EnumField path={path} label={label} />;
  return <TextField path={path} label={label} />;
}

/* ------------------------------------------------------------------ groups */

function Group({ path }: { path: Path }) {
  const api = useEditor();
  const value = getAt(api.current.en, path) as Record<string, unknown>;
  const figure = typeof value.display === "string" && (typeof value.value === "number" || value.value === null);
  return (
    <div className="space-y-1">
      {Object.keys(value).map((k) => {
        if (figure && k === "value") return null;
        const child = [...path, k];
        if (figure && k === "display") return <DisplayField key={k} path={child} label={labelFor("value")} />;
        return <Node key={k} path={child} />;
      })}
    </div>
  );
}

function Nested({ path, children }: { path: Path; children: ReactNode }) {
  return (
    <fieldset className="my-2 rounded-md border border-ink/10 bg-leaf/40 px-3 pb-2 pt-1">
      <legend className="px-1 font-display text-[1.02rem] text-ink">{labelFor(path[path.length - 1])}</legend>
      {children}
    </fieldset>
  );
}

const iconButton =
  "grid size-8 cursor-pointer place-items-center rounded-md border border-ink/15 bg-white/70 text-[0.95rem] text-ink-soft transition-colors hover:border-cinnabar hover:text-cinnabar disabled:cursor-default disabled:opacity-30 disabled:hover:border-ink/15 disabled:hover:text-ink-soft";

function List({ path }: { path: Path }) {
  const api = useEditor();
  const list = getAt(api.current.en, path) as unknown[];
  const open = isOpenList(path, list);
  const strings = list.every((v) => typeof v === "string");
  const newestFirst = NEWEST_FIRST.has(schemaPath(path));

  const move = (from: number, to: number) =>
    api.changeList(path, (l) => {
      const [item] = l.splice(from, 1);
      l.splice(to, 0, item);
      return l;
    });
  const remove = (i: number) => {
    const name = itemTitle(list[i], i);
    if (window.confirm(`Remove “${name}”? It leaves the site when you publish.`)) api.changeList(path, (l) => l.filter((_, j) => j !== i));
  };
  const add = () => {
    api.changeList(path, (l) => {
      const model = (newestFirst ? l[0] : l[l.length - 1]) ?? "";
      const item = blankLike(model as Json);
      return newestFirst ? [item, ...l] : [...l, item];
    });
    api.toggle([...path, newestFirst ? 0 : list.length], true);
  };

  const controls = (i: number) =>
    open ? (
      <span className="flex shrink-0 gap-1.5">
        <button type="button" className={iconButton} aria-label="Move up" title="Move up" disabled={i === 0} onClick={() => move(i, i - 1)}>
          ↑
        </button>
        <button type="button" className={iconButton} aria-label="Move down" title="Move down" disabled={i === list.length - 1} onClick={() => move(i, i + 1)}>
          ↓
        </button>
        <button type="button" className={iconButton} aria-label="Remove" title="Remove" onClick={() => remove(i)}>
          ✕
        </button>
      </span>
    ) : null;

  return (
    <div className="my-2">
      <p className="mb-2 font-display text-[1.02rem] text-ink">
        {labelAt(path)}
        <span className="ml-2 font-mono text-[0.75rem] text-ink-faint">{list.length}</span>
      </p>
      <ol className="space-y-2">
        {list.map((item, i) => {
          const itemPath = [...path, i];
          if (strings) {
            return (
              <li key={i} className="flex items-start gap-2">
                <div className="min-w-0 flex-1">
                  <Leaf path={itemPath} />
                </div>
                <div className="pt-10">{controls(i)}</div>
              </li>
            );
          }
          const isOpen = api.isOpen(itemPath);
          return (
            <li key={i} className="rounded-md border border-ink/12 bg-white/45">
              <div className="flex items-center gap-2 px-3 py-2">
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => api.toggle(itemPath)}
                  className="flex min-w-0 flex-1 cursor-pointer items-center gap-2 text-left"
                >
                  <span aria-hidden="true" className={`text-cinnabar transition-transform ${isOpen ? "rotate-90" : ""}`}>
                    ›
                  </span>
                  <span className="truncate text-[0.98rem] text-ink">{itemTitle(item, i)}</span>
                  {api.changed(itemPath) ? <span className="shrink-0 text-[0.78rem] text-cinnabar">· changed</span> : null}
                </button>
                {controls(i)}
              </div>
              {isOpen ? (
                <div className="border-t border-ink/10 px-2 pb-2">
                  <Node path={itemPath} />
                </div>
              ) : null}
            </li>
          );
        })}
      </ol>
      {open ? (
        <button
          type="button"
          onClick={add}
          className="mt-2 inline-flex cursor-pointer items-center gap-2 rounded-md border border-dashed border-cinnabar/50 px-3.5 py-2 text-[0.92rem] text-cinnabar-deep transition-colors hover:border-cinnabar hover:bg-white/60"
        >
          + {strings ? "Add a paragraph" : newestFirst ? "Add a new update (it goes at the top)" : `Add ${addNoun(path)}`}
        </button>
      ) : null}
    </div>
  );
}

/** "a trustee", "a photo"… for the add button. */
function addNoun(path: Path): string {
  const schema = schemaPath(path);
  if (schema.endsWith("trustees.trustees")) return "a trustee";
  if (schema.endsWith("trustees.advisors")) return "an advisor";
  if (schema.endsWith("board.members")) return "a board member";
  if (schema.endsWith("camps")) return "a health camp";
  if (schema.endsWith("stats")) return "a figure";
  if (/images|album|upClose\.items|illuminated\.items/.test(schema)) return "a photo";
  if (schema.endsWith("voices.items")) return "a visitor's words";
  return "another";
}

/** Any part of the content: a list, a group of fields, or a single field. */
export function Node({ path }: { path: Path }) {
  const api = useEditor();
  if (isHidden(path)) return null;
  const value = getAt(api.current.en, path);
  if (value === undefined) return null;
  if (Array.isArray(value)) return <List path={path} />;
  if (value && typeof value === "object") {
    const last = path[path.length - 1];
    return path.length > 2 && typeof last === "string" ? (
      <Nested path={path}>
        <Group path={path} />
      </Nested>
    ) : (
      <Group path={path} />
    );
  }
  return <Leaf path={path} />;
}
