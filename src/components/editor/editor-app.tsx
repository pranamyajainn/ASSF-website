"use client";

import { useEffect, useMemo, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { localeInfo, locales, type Lang } from "@/i18n/config";
import { fillBlanks, fillTokens, getAt, pathKey, type Edits, type Json, type Op, type Path } from "@/lib/cms/edits";
import { describePath, isHidden, PAGES, SECTION_ORDER, schemaPath, sectionLabel, type ModuleName } from "@/lib/cms/schema";
import { EditorProvider, fieldId, Node, useEditor, type EditorApi } from "./fields";
import { blankLike, changeList, problems, setField, translatedFields, withOps, type Trees } from "./model";
import { Find, Panel, type Selection } from "./panel";
import { preparePhoto } from "./photo";
import { Preview } from "./preview";

type Staged = Record<string, { blob: string | null; preview: string }>;
type Status =
  | { kind: "idle" }
  | { kind: "publishing" }
  | { kind: "deploying"; revision: number }
  | { kind: "live"; revision: number }
  | { kind: "error"; message: string; stale?: boolean };

type Props = {
  base: Trees;
  initial: Edits;
  deployed: number;
  storage: "github" | "local";
  editor: { email: string; name: string };
  signOut: () => Promise<void>;
};

const DRAFT_KEY = "assf-editor:draft";
const LANG_KEY = "assf-editor:lang";
const LANG_LABEL: Record<Lang, string> = { en: "English", hi: localeInfo.hi.label, kn: localeInfo.kn.label };
const same = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);

/** The pages that can be shown and clicked on. */
const SITE_PAGES = PAGES.filter((p) => p.module !== "shared" && p.module !== "ui");
type SitePage = (typeof SITE_PAGES)[number]["module"];

type Saved = { revision: number; ops: Op[]; split: string[]; staged: Staged };
function loadSaved(): Saved | null {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    return raw ? (JSON.parse(raw) as Saved) : null;
  } catch {
    return null;
  }
}

const subscribeNothing = () => () => {};

/**
 * The editor keeps its unpublished draft in this browser, so it renders only
 * in the browser: on the server there is no draft to show.
 */
export function EditorRoot(props: Props) {
  const inBrowser = useSyncExternalStore(subscribeNothing, () => true, () => false);
  if (!inBrowser) {
    return <p className="p-10 text-center font-display text-xl text-ink-soft">Opening the editor…</p>;
  }
  return <EditorApp {...props} />;
}

/**
 * The site editor. On a computer it is the site itself, on the left, where
 * anything can be clicked; and on the right, only what was clicked. Changes
 * show on the page as they're typed, and nothing reaches the public site
 * until Review & publish. On a phone — or on request — the same content is
 * a list of pages and parts instead.
 */
function EditorApp({ base, initial, deployed, storage, editor, signOut }: Props) {
  const [published, setPublished] = useState<Edits>(initial);
  const [saved] = useState(loadSaved);
  const [draft, setDraft] = useState<Op[]>(() => saved?.ops ?? []);
  const [split, setSplit] = useState<Set<string>>(() => new Set(saved?.split ?? []));
  const [staged, setStaged] = useState<Staged>(() => saved?.staged ?? {});
  const [olderDraft] = useState(() => !!saved?.ops.length && saved.revision !== initial.revision);
  const [lang, setLangState] = useState<Lang>(() => {
    try {
      const value = localStorage.getItem(LANG_KEY);
      return value === "hi" || value === "kn" ? value : "en";
    } catch {
      return "en";
    }
  });
  const [mode, setMode] = useState<"page" | "list">(() => (window.matchMedia("(min-width: 1024px)").matches ? "page" : "list"));
  const [sitePage, setSitePage] = useState<SitePage>("home");
  const [selection, setSelection] = useState<Selection>(null);
  const [scrollTo, setScrollTo] = useState<{ path: Path; nonce: number } | null>(null);
  const [listPage, setListPage] = useState<ModuleName>("home");
  const [open, setOpen] = useState<Set<string>>(new Set());
  const [focused, setFocused] = useState<string | null>(null);
  const [dialog, setDialog] = useState<"review" | "history" | null>(null);
  const [status, setStatus] = useState<Status>(() => (deployed < initial.revision ? { kind: "deploying", revision: initial.revision } : { kind: "idle" }));

  const setLang = (next: Lang) => {
    setLangState(next);
    try {
      localStorage.setItem(LANG_KEY, next);
    } catch {}
  };

  const publishedTrees = useMemo(() => withOps(base, published.ops), [base, published.ops]);
  const current = useMemo(() => withOps(publishedTrees, draft), [publishedTrees, draft]);
  const translated = useMemo(() => translatedFields(base), [base]);
  const { numeric, nullable } = useMemo(() => {
    const numeric = new Set<string>();
    const nullable = new Set<string>();
    const walk = (node: unknown, path: Path) => {
      if (typeof node === "number") numeric.add(schemaPath(path));
      if (node === null) nullable.add(schemaPath(path));
      if (Array.isArray(node)) node.forEach((v, i) => walk(v, [...path, i]));
      else if (node && typeof node === "object") for (const [k, v] of Object.entries(node)) walk(v, [...path, k]);
    };
    for (const l of locales) walk(base[l], []);
    return { numeric, nullable };
  }, [base]);

  // What the page shows: an edition with blanks filled from English and prices filled in.
  const asShown = (trees: Trees) => {
    const tree = lang === "en" ? trees.en : fillBlanks(trees[lang], trees.en);
    const shared = (trees.en as { shared: { folioPrice: number; granthaPrice: number } }).shared;
    return fillTokens(tree, {
      folioPrice: shared.folioPrice.toLocaleString("en-IN"),
      granthaPrice: shared.granthaPrice.toLocaleString("en-IN"),
    });
  };
  const shownTree = useMemo(() => asShown(current), [current, lang]); // eslint-disable-line react-hooks/exhaustive-deps
  const renderedTree = useMemo(() => asShown(publishedTrees), [publishedTrees, lang]); // eslint-disable-line react-hooks/exhaustive-deps

  // The draft survives a reload or a closed tab, in this browser only.
  useEffect(() => {
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify({ revision: published.revision, ops: draft, split: [...split], staged } satisfies Saved));
    } catch {
      // Storage full or blocked: the draft still lives until the tab closes.
    }
  }, [draft, split, staged, published.revision]);

  // After publishing, wait for the live site to show it.
  useEffect(() => {
    if (status.kind !== "deploying") return;
    let stopped = false;
    const started = Date.now();
    const tick = async () => {
      try {
        const res = await fetch("/api/cms/status", { cache: "no-store" });
        const data = (await res.json()) as { revision: number };
        if (!stopped && data.revision >= status.revision) {
          setStatus({ kind: "live", revision: status.revision });
          return;
        }
      } catch {}
      if (!stopped && Date.now() - started < 8 * 60_000) setTimeout(tick, 8000);
    };
    const first = setTimeout(tick, 6000);
    return () => {
      stopped = true;
      clearTimeout(first);
    };
  }, [status]);

  // In the list, bring a field found by search into view.
  useEffect(() => {
    if (!focused || mode !== "list") return;
    document.getElementById(fieldId(JSON.parse(focused) as Path))?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [focused, listPage, mode]);

  const api: EditorApi = {
    lang,
    base,
    published: publishedTrees,
    current,
    translated,
    numeric,
    nullable,
    split,
    splitField: (path) => setSplit((s) => new Set(s).add(pathKey(path))),
    changed: (path) => locales.some((l) => !same(getAt(current[l], path), getAt(publishedTrees[l], path))),
    setField: (path, scope, value) => setDraft((d) => setField(d, publishedTrees, path, scope, value)),
    changeList: (path, change) => setDraft((d) => changeList(d, withOps(publishedTrees, d), path, change)),
    previews: Object.fromEntries(Object.entries(staged).map(([path, s]) => [path, s.preview])),
    upload: async (file) => {
      const photo = await preparePhoto(file);
      const res = await fetch("/api/cms/image", {
        method: "POST",
        headers: { "Content-Type": "image/jpeg", "X-File-Name": encodeURIComponent(file.name) },
        body: photo.blob,
      });
      if (!res.ok) throw new Error((await res.text()) || "The photo couldn't be uploaded.");
      const { path, blob } = (await res.json()) as { path: string; blob: string | null };
      setStaged((s) => ({ ...s, [path]: { blob, preview: photo.preview } }));
      return { path, width: photo.width, height: photo.height };
    },
    translate: async (path) => {
      const text = getAt(current.en, path);
      if (typeof text !== "string" || !text.trim()) return;
      const res = await fetch("/api/cms/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      if (!res.ok) throw new Error((await res.text()) || "Translation didn't work — please try again.");
      const out = (await res.json()) as { hi: string; kn: string };
      setDraft((d) => setField(setField(d, publishedTrees, path, "hi", out.hi), publishedTrees, path, "kn", out.kn));
    },
    isOpen: (path) => open.has(pathKey(path)),
    toggle: (path, value) =>
      setOpen((s) => {
        const next = new Set(s);
        const key = pathKey(path);
        if (value ?? !next.has(key)) next.add(key);
        else next.delete(key);
        return next;
      }),
    focused: selection && "path" in selection ? pathKey(selection.path) : focused,
  };

  /** Shows a field: on its page in the preview, or in the list. */
  function reveal(path: Path) {
    const target = path[0] as ModuleName;
    if (mode === "page") {
      const onPage = SITE_PAGES.some((p) => p.module === target);
      if (onPage) setSitePage(target as SitePage);
      setSelection({ path });
      setScrollTo({ path, nonce: Date.now() });
      return;
    }
    setListPage(target);
    setOpen((s) => {
      const next = new Set(s);
      if (path.length === 2) next.add(pathKey([path[0], "_"]));
      for (let i = 2; i < path.length; i++) next.add(pathKey(path.slice(0, i)));
      return next;
    });
    setFocused(pathKey(path));
  }

  function addTo(listPath: Path, page: SitePage, atStart: boolean) {
    const list = getAt(current.en, listPath) as Json[];
    const index = atStart ? 0 : list.length;
    api.changeList(listPath, (l) => {
      const item = blankLike((atStart ? l[0] : l[l.length - 1]) as Json);
      return atStart ? [item, ...l] : [...l, item];
    });
    setSitePage(page);
    setSelection({ path: [...listPath, index] });
    setScrollTo({ path: [...listPath, atStart ? 0 : Math.max(0, list.length - 1)], nonce: Date.now() });
  }

  async function publish(note: string) {
    const text = JSON.stringify(draft);
    const images = Object.entries(staged)
      .filter(([path]) => text.includes(JSON.stringify(path)))
      .map(([path, s]) => ({ path, blob: s.blob }));
    setStatus({ kind: "publishing" });
    try {
      const res = await fetch("/api/cms/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ baseRevision: published.revision, ops: draft, images, note }),
      });
      if (res.status === 409) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        setStatus({ kind: "error", message: data?.error ?? "The site changed while you were editing.", stale: true });
        return;
      }
      if (!res.ok) {
        setStatus({ kind: "error", message: (await res.text()) || "Publishing failed." });
        return;
      }
      const data = (await res.json()) as { edits: Edits };
      setPublished(data.edits);
      setDraft([]);
      setSplit(new Set());
      setDialog(null);
      setSelection(null);
      setStatus(storage === "local" ? { kind: "live", revision: data.edits.revision } : { kind: "deploying", revision: data.edits.revision });
    } catch {
      setStatus({ kind: "error", message: "Couldn't reach the site. Check the connection and try again." });
    }
  }

  async function restore(sha: string, date: string) {
    const res = await fetch("/api/cms/restore", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sha, date }),
    });
    if (!res.ok) {
      setStatus({ kind: "error", message: (await res.text()) || "Restoring failed." });
      return;
    }
    const data = (await res.json()) as { edits: Edits };
    setPublished(data.edits);
    setDialog(null);
    setStatus({ kind: "deploying", revision: data.edits.revision });
  }

  const draftCount = useMemo(() => new Set(draft.map((o) => pathKey(o.path))).size, [draft]);
  const pageInfo = SITE_PAGES.find((p) => p.module === sitePage)!;
  const previewSrc = `/preview/${lang}${pageInfo.href === "/" ? "" : pageInfo.href}`;
  const selectedPath = selection && "path" in selection ? selection.path : null;

  return (
    <EditorProvider value={api}>
      <div className={`bg-leaf text-ink ${mode === "page" ? "flex h-dvh flex-col overflow-hidden" : "min-h-dvh"}`}>
        <header className="sticky top-0 z-30 shrink-0 border-b border-black/30 bg-board-deep text-board-ink">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 px-4 py-2.5 lg:px-6">
            <div className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element -- the site's own mark */}
              <img src="/icon.png" alt="" className="size-8" />
              <p className="font-display text-[1.1rem] leading-tight">Site editor</p>
            </div>
            <div role="group" aria-label="Language" className="flex items-center gap-1 rounded-full bg-white/8 p-1 text-[0.9rem]">
              {locales.map((l) => (
                <button
                  key={l}
                  type="button"
                  aria-pressed={lang === l}
                  onClick={() => setLang(l)}
                  className={`cursor-pointer rounded-full px-3 py-1 transition-colors ${lang === l ? "bg-leaf text-ink" : "text-board-ink/80 hover:bg-white/10"} ${l === "kn" ? "font-kannada" : ""}`}
                >
                  {LANG_LABEL[l]}
                </button>
              ))}
            </div>
            <StatusPill status={status} count={draftCount} storage={storage} onRetry={() => setDialog("review")} />
            <div className="ml-auto flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                onClick={() => setMode(mode === "page" ? "list" : "page")}
                className="hidden cursor-pointer rounded-md px-3 py-2 text-[0.9rem] text-board-ink/85 hover:bg-white/10 lg:block"
              >
                {mode === "page" ? "All content as a list" : "Edit on the page"}
              </button>
              {storage === "github" ? (
                <button type="button" onClick={() => setDialog("history")} className="cursor-pointer rounded-md px-3 py-2 text-[0.9rem] text-board-ink/85 hover:bg-white/10">
                  History
                </button>
              ) : null}
              <button
                type="button"
                onClick={() => setDialog("review")}
                disabled={!draft.length || status.kind === "publishing"}
                className="cursor-pointer rounded-md bg-cinnabar px-4 py-2 text-[0.95rem] text-leaf transition-colors hover:bg-cinnabar-deep disabled:cursor-default disabled:bg-white/10 disabled:text-board-ink/40"
              >
                Review &amp; publish{draftCount ? ` (${draftCount})` : ""}
              </button>
              <form action={signOut}>
                <button type="submit" title={editor.email} className="cursor-pointer rounded-md px-3 py-2 text-[0.85rem] text-board-soft hover:bg-white/10 hover:text-board-ink">
                  Sign out
                </button>
              </form>
            </div>
          </div>
          {mode === "page" ? (
            <nav aria-label="Pages" className="flex gap-1 overflow-x-auto border-t border-white/10 px-3 py-1.5 lg:px-5">
              {SITE_PAGES.map((p) => (
                <button
                  key={p.module}
                  type="button"
                  aria-current={sitePage === p.module ? "page" : undefined}
                  onClick={() => {
                    setSitePage(p.module);
                    setSelection(null);
                  }}
                  className={`shrink-0 cursor-pointer rounded-md px-3 py-1.5 text-[0.9rem] transition-colors ${
                    sitePage === p.module ? "bg-white/15 text-board-ink" : "text-board-soft hover:bg-white/8 hover:text-board-ink"
                  }`}
                >
                  {p.title}
                </button>
              ))}
            </nav>
          ) : null}
        </header>

        {olderDraft && draft.length ? (
          <p className="shrink-0 bg-orpiment/20 px-4 py-2 text-[0.9rem] text-ink lg:px-6">
            Your unpublished changes were started before someone else published. They&apos;re kept — check them under Review &amp; publish.
          </p>
        ) : null}

        {mode === "page" ? (
          <div className="grid min-h-0 flex-1 grid-cols-[minmax(0,1fr)_27rem]">
            <div className="min-h-0 border-r border-ink/15">
              <Preview
                src={previewSrc}
                module={sitePage}
                shown={shownTree}
                rendered={renderedTree}
                previews={api.previews}
                selected={selectedPath}
                scrollTo={scrollTo}
                onPick={(path) => setSelection({ path })}
              />
            </div>
            <aside className="min-h-0 overflow-y-auto bg-leaf">
              <Panel
                selection={selection}
                onSelect={setSelection}
                onFind={reveal}
                onAddNews={() => addTo(["home", "field", "items"], "home", true)}
                onAddTrustee={() => addTo(["trustees", "trustees"], "trustees", false)}
                onList={() => setMode("list")}
              />
            </aside>
          </div>
        ) : (
          <ListView page={listPage} onPage={setListPage} onFind={reveal} changedIn={(m) => new Set(draft.filter((o) => o.path[0] === m).map((o) => pathKey(o.path))).size} />
        )}

        {dialog === "review" ? (
          <Review
            draft={draft}
            published={publishedTrees}
            current={current}
            status={status}
            onClose={() => setDialog(null)}
            onUndo={(key) => setDraft((d) => d.filter((o) => pathKey(o.path) !== key))}
            onDiscard={() => {
              if (window.confirm("Discard all unpublished changes? This can't be undone.")) {
                setDraft([]);
                setSplit(new Set());
                setDialog(null);
                setSelection(null);
              }
            }}
            onReveal={(path) => {
              setDialog(null);
              reveal(path);
            }}
            onPublish={publish}
          />
        ) : null}
        {dialog === "history" ? <History onClose={() => setDialog(null)} onRestore={restore} /> : null}
      </div>
    </EditorProvider>
  );
}

/** All of the content, page by page and part by part — for phones, and for what isn't on a page. */
function ListView({
  page,
  onPage,
  onFind,
  changedIn,
}: {
  page: ModuleName;
  onPage: (page: ModuleName) => void;
  onFind: (path: Path) => void;
  changedIn: (module: string) => number;
}) {
  const [more, setMore] = useState(false);
  return (
    <div className="mx-auto grid max-w-[100rem] grid-cols-[minmax(0,1fr)] gap-6 px-4 py-6 lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-10 lg:px-8">
      <aside className="min-w-0 lg:sticky lg:top-20 lg:self-start">
        <Find onFind={onFind} />
        <nav aria-label="Pages" className="mt-5">
          <ul className="flex gap-1.5 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0">
            {PAGES.filter((p) => more || p.module !== "ui").map((p) => (
              <li key={p.module} className="shrink-0">
                <button
                  type="button"
                  onClick={() => onPage(p.module)}
                  aria-current={page === p.module ? "page" : undefined}
                  className={`flex w-full cursor-pointer items-center justify-between gap-3 rounded-md px-3 py-2 text-left text-[0.98rem] transition-colors ${
                    page === p.module ? "bg-board text-board-ink" : "text-ink hover:bg-ink/5"
                  }`}
                >
                  {p.title}
                  {changedIn(p.module) ? (
                    <span className={`rounded-full px-2 font-mono text-[0.72rem] ${page === p.module ? "bg-cinnabar text-leaf" : "bg-cinnabar/15 text-cinnabar-deep"}`}>
                      {changedIn(p.module)}
                    </span>
                  ) : null}
                </button>
              </li>
            ))}
          </ul>
        </nav>
        <label className="mt-4 hidden cursor-pointer items-center gap-2 px-3 text-[0.85rem] text-ink-faint lg:flex">
          <input type="checkbox" checked={more} onChange={(e) => setMore(e.target.checked)} />
          Show buttons &amp; labels too
        </label>
      </aside>
      <main id="main" className="min-w-0">
        <PageSections module={page} />
      </main>
    </div>
  );
}

function PageSections({ module }: { module: ModuleName }) {
  const api = useEditor();
  const pageInfo = PAGES.find((p) => p.module === module)!;
  const moduleValue = getAt(api.current.en, [module]) as Record<string, unknown>;
  const order = SECTION_ORDER[module] ?? [];
  const keys = Object.keys(moduleValue)
    .filter((k) => !isHidden([module, k]))
    .sort((a, b) => (order.indexOf(a) + 1 || 999) - (order.indexOf(b) + 1 || 999));
  const leaves = keys.filter((k) => getAt(api.current.en, [module, k]) === null || typeof getAt(api.current.en, [module, k]) !== "object");
  const groups = keys.filter((k) => !leaves.includes(k));
  return (
    <>
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <h1 className="font-display text-[clamp(1.8rem,1.4rem+1.2vw,2.5rem)] leading-tight">{pageInfo.title}</h1>
        {module !== "shared" && module !== "ui" ? (
          <a
            href={`${localeInfo[api.lang === "all" ? "en" : api.lang].prefix}${pageInfo.href === "/" && api.lang !== "en" ? "" : pageInfo.href}`}
            target="_blank"
            rel="noreferrer"
            className="text-[0.9rem] text-cinnabar-deep underline decoration-cinnabar/40 underline-offset-2 hover:text-cinnabar"
          >
            Open this page on the site ↗
          </a>
        ) : null}
      </div>
      <div className="space-y-3">
        {leaves.length ? (
          <Section
            title={module === "shared" ? "Prices" : "General"}
            subtitle=""
            open={api.isOpen([module, "_"])}
            onToggle={() => api.toggle([module, "_"])}
            changed={leaves.some((k) => api.changed([module, k]))}
          >
            {leaves.map((k) => (
              <Node key={k} path={[module, k]} />
            ))}
          </Section>
        ) : null}
        {groups.map((k) => {
          const value = getAt(api.current.en, [module, k]) as Record<string, unknown>;
          const subtitle = ["heading", "title", "label", "eyebrow"].map((f) => value?.[f]).find((v) => typeof v === "string") as string | undefined;
          return (
            <Section
              key={k}
              title={sectionLabel(module, k)}
              subtitle={subtitle ?? ""}
              open={api.isOpen([module, k])}
              onToggle={() => api.toggle([module, k])}
              changed={api.changed([module, k])}
            >
              <Node path={[module, k]} />
            </Section>
          );
        })}
      </div>
    </>
  );
}

function Section({
  title,
  subtitle,
  open,
  onToggle,
  changed,
  children,
}: {
  title: string;
  subtitle: string;
  open: boolean;
  onToggle: () => void;
  changed: boolean;
  children: ReactNode;
}) {
  return (
    <section className="rounded-xl border border-ink/10 bg-white/50 shadow-[0_1px_2px_rgb(29_24_18/0.05)]">
      <button type="button" aria-expanded={open} onClick={onToggle} className="flex w-full cursor-pointer items-center gap-3 px-5 py-4 text-left">
        <span aria-hidden="true" className={`text-lg text-cinnabar transition-transform ${open ? "rotate-90" : ""}`}>
          ›
        </span>
        <span className="min-w-0 flex-1">
          <span className="block font-display text-[1.2rem] leading-snug">{title}</span>
          {subtitle ? <span className="block truncate text-[0.88rem] text-ink-faint">{subtitle}</span> : null}
        </span>
        {changed ? <span className="shrink-0 rounded-full bg-cinnabar/12 px-2.5 py-0.5 text-[0.78rem] text-cinnabar-deep">changed</span> : null}
      </button>
      {open ? <div className="border-t border-ink/10 px-3 pb-4 pt-1 sm:px-5">{children}</div> : null}
    </section>
  );
}


function StatusPill({ status, count, storage, onRetry }: { status: Status; count: number; storage: string; onRetry: () => void }) {
  let text: ReactNode;
  let tone = "bg-white/10 text-board-ink/85";
  if (status.kind === "publishing") text = "Publishing…";
  else if (status.kind === "deploying") text = "Published — the site updates in a minute or two…";
  else if (status.kind === "live" && !count) {
    text = (
      <>
        Live on the site ✓{" "}
        <a href="/" target="_blank" rel="noreferrer" className="underline underline-offset-2">
          View
        </a>
      </>
    );
    tone = "bg-emerald-900/60 text-emerald-50";
  } else if (status.kind === "error") {
    text = (
      <>
        {status.message}{" "}
        {status.stale ? (
          <button type="button" className="cursor-pointer underline" onClick={() => window.location.reload()}>
            Reload
          </button>
        ) : (
          <button type="button" className="cursor-pointer underline" onClick={onRetry}>
            Try again
          </button>
        )}
      </>
    );
    tone = "bg-cinnabar/80 text-leaf";
  } else if (count) text = `${count} unpublished change${count === 1 ? "" : "s"}`;
  else text = storage === "local" ? "Local mode — publishing writes to this computer" : "Everything is published";
  return (
    <p role="status" className={`rounded-full px-3.5 py-1.5 text-[0.85rem] ${tone}`}>
      {text}
    </p>
  );
}

function Dialog({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current;
    if (dialog && !dialog.open) dialog.showModal();
  }, []);
  return (
    <dialog
      ref={ref}
      onClose={onClose}
      className="m-auto max-h-[88dvh] w-[min(56rem,calc(100vw-2rem))] overflow-hidden rounded-xl border border-ink/15 bg-leaf p-0 text-ink shadow-2xl backdrop:bg-board-deep/70"
    >
      <div className="flex max-h-[88dvh] flex-col">
        <div className="flex items-center justify-between border-b border-ink/10 px-6 py-4">
          <h2 className="font-display text-[1.4rem]">{title}</h2>
          <button type="button" onClick={() => ref.current?.close()} className="cursor-pointer rounded-md px-3 py-1.5 text-ink-soft hover:bg-ink/5">
            Close
          </button>
        </div>
        <div className="overflow-auto px-6 py-5">{children}</div>
      </div>
    </dialog>
  );
}

/** A value as the review list shows it: short, with prices filled in. */
const short = (v: unknown, prices?: Record<string, string>) => {
  if (v === null || v === undefined || v === "") return "—";
  let text = typeof v === "string" ? v : typeof v === "number" ? v.toLocaleString("en-IN") : Array.isArray(v) ? `${v.length} items` : "…";
  if (prices) text = text.replace(/\{(\w+)\}/g, (m, k: string) => prices[k] ?? m);
  return text.length > 140 ? `${text.slice(0, 140)}…` : text;
};

function Review({
  draft,
  published,
  current,
  status,
  onClose,
  onUndo,
  onDiscard,
  onReveal,
  onPublish,
}: {
  draft: Op[];
  published: Trees;
  current: Trees;
  status: Status;
  onClose: () => void;
  onUndo: (key: string) => void;
  onDiscard: () => void;
  onReveal: (path: Path) => void;
  onPublish: (note: string) => void;
}) {
  const [note, setNote] = useState("");
  const toFix = problems(draft);
  const shared = (current.en as { shared: { folioPrice: number; granthaPrice: number } }).shared;
  const prices = { folioPrice: shared.folioPrice.toLocaleString("en-IN"), granthaPrice: shared.granthaPrice.toLocaleString("en-IN") };
  const groups = new Map<string, Op[]>();
  for (const op of draft) groups.set(pathKey(op.path), [...(groups.get(pathKey(op.path)) ?? []), op]);
  const busy = status.kind === "publishing";
  return (
    <Dialog title="Review & publish" onClose={onClose}>
      {toFix.length ? (
        <div className="mb-5 rounded-md border border-cinnabar/40 bg-cinnabar/8 px-4 py-3">
          <p className="font-display text-[1.05rem] text-cinnabar-deep">Before publishing</p>
          <ul className="mt-1 space-y-1 text-[0.92rem]">
            {toFix.map((p) => (
              <li key={pathKey(p.path)}>
                <button type="button" className="cursor-pointer text-left underline decoration-cinnabar/40 underline-offset-2" onClick={() => onReveal(p.path)}>
                  {describePath(p.path)}
                </button>{" "}
                — {p.message}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      <ol className="divide-y divide-ink/10">
        {[...groups].map(([key, ops]) => {
          const path = ops[0].path;
          const isList = Array.isArray(ops[0].value);
          return (
            <li key={key} className="py-3">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <button type="button" className="cursor-pointer text-left font-display text-[1.02rem] hover:text-cinnabar" onClick={() => onReveal(path)}>
                  {describePath(path)}
                </button>
                <button type="button" className="cursor-pointer text-[0.85rem] text-cinnabar-deep underline decoration-cinnabar/40 underline-offset-2" onClick={() => onUndo(key)}>
                  Undo
                </button>
              </div>
              {isList ? (
                <p className="mt-1 text-[0.9rem] text-ink-soft">
                  List changed: {short(getAt(published.en, path))} → {short(getAt(current.en, path))}
                </p>
              ) : (
                <dl className="mt-1 space-y-1 text-[0.9rem]">
                  {ops.map((op) => {
                    const lang: Lang = op.scope === "all" ? "en" : op.scope;
                    return (
                      <div key={op.scope} className="grid gap-x-3 sm:grid-cols-[7rem_minmax(0,1fr)]">
                        <dt className="font-mono text-[0.75rem] text-ink-faint">{op.scope === "all" ? "All languages" : LANG_LABEL[op.scope]}</dt>
                        <dd lang={lang} className={lang === "kn" ? "font-kannada" : ""}>
                          <span className="text-ink-faint line-through decoration-ink/30">{short(getAt(published[lang], path), prices)}</span>
                          <span className="mx-1.5 text-cinnabar">→</span>
                          <span>{short(op.value as Json, prices)}</span>
                        </dd>
                      </div>
                    );
                  })}
                </dl>
              )}
            </li>
          );
        })}
      </ol>
      <div className="mt-5 border-t border-ink/10 pt-5">
        <label className="block">
          <span className="mb-1 block font-mono text-[0.75rem] uppercase tracking-[0.06em] text-ink-faint">What changed? (optional — shown in History)</span>
          <input
            type="text"
            value={note}
            maxLength={140}
            onChange={(e) => setNote(e.target.value)}
            placeholder="e.g. Updated the conserved-folio count"
            className="w-full rounded-md border border-ink/20 bg-white/80 px-3 py-2 outline-none focus:border-cinnabar"
          />
        </label>
        {status.kind === "error" ? <p className="mt-3 text-[0.92rem] text-cinnabar-deep">{status.message}</p> : null}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <button type="button" onClick={onDiscard} className="cursor-pointer text-[0.9rem] text-ink-soft underline decoration-ink/30 underline-offset-2 hover:text-cinnabar">
            Discard all changes
          </button>
          <button
            type="button"
            disabled={busy || !!toFix.length}
            onClick={() => onPublish(note)}
            className="cursor-pointer rounded-md bg-cinnabar px-5 py-2.5 text-leaf transition-colors hover:bg-cinnabar-deep disabled:cursor-default disabled:opacity-50"
          >
            {busy ? "Publishing…" : "Publish to the site"}
          </button>
        </div>
      </div>
    </Dialog>
  );
}

function History({ onClose, onRestore }: { onClose: () => void; onRestore: (sha: string, date: string) => void }) {
  const [items, setItems] = useState<{ sha: string; message: string; date: string }[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    fetch("/api/cms/history", { cache: "no-store" })
      .then(async (res) => (res.ok ? setItems(await res.json()) : setError(await res.text())))
      .catch(() => setError("The history couldn't be loaded."));
  }, []);
  const when = (date: string) => new Date(date).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Kolkata" });
  return (
    <Dialog title="History" onClose={onClose}>
      <p className="mb-4 text-[0.92rem] text-ink-soft">
        Every publish is kept. Restoring brings the site back to how it was after that publish — as a new publish, so it can be undone too.
      </p>
      {error ? <p className="text-cinnabar-deep">{error}</p> : null}
      {!items && !error ? <p className="text-ink-faint">Loading…</p> : null}
      <ol className="divide-y divide-ink/10">
        {items?.map((item, i) => (
          <li key={item.sha} className="flex flex-wrap items-center justify-between gap-3 py-3">
            <span className="min-w-0">
              <span className="block text-[0.98rem]">
                {item.message.startsWith("Site edit: ") ? item.message.split("\n")[0].slice(11) : "The site as the web team last set it up"}
              </span>
              <span className="font-mono text-[0.75rem] text-ink-faint">
                {when(item.date)}
                {i === 0 ? " · on the site now" : ""}
              </span>
            </span>
            {i > 0 ? (
              <button
                type="button"
                className="cursor-pointer rounded-md border border-ink/20 px-3 py-1.5 text-[0.88rem] hover:border-cinnabar hover:text-cinnabar"
                onClick={() => {
                  if (window.confirm(`Bring the site back to how it was on ${when(item.date)}?`)) onRestore(item.sha, item.date);
                }}
              >
                Restore this version
              </button>
            ) : null}
          </li>
        ))}
      </ol>
    </Dialog>
  );
}

