"use client";

import { useEffect, useMemo, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { localeInfo, locales, type Lang } from "@/i18n/config";
import { getAt, pathKey, type Edits, type Json, type Op, type Path } from "@/lib/cms/edits";
import { describePath, isHidden, PAGES, SECTION_ORDER, schemaPath, sectionLabel, type ModuleName } from "@/lib/cms/schema";
import { EditorProvider, fieldId, Node, type EditorApi } from "./fields";
import { changeList, problems, searchIndex, setField, translatedFields, withOps, type Trees } from "./model";
import { preparePhoto } from "./photo";

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
const LANG_LABEL: Record<Lang, string> = { en: "English", hi: localeInfo.hi.label, kn: localeInfo.kn.label };
const same = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);

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

function EditorApp({ base, initial, deployed, storage, editor, signOut }: Props) {
  const [published, setPublished] = useState<Edits>(initial);
  const [saved] = useState(loadSaved);
  const [draft, setDraft] = useState<Op[]>(() => saved?.ops ?? []);
  const [split, setSplit] = useState<Set<string>>(() => new Set(saved?.split ?? []));
  const [staged, setStaged] = useState<Staged>(() => saved?.staged ?? {});
  const [olderDraft] = useState(() => !!saved?.ops.length && saved.revision !== initial.revision);
  const [page, setPage] = useState<ModuleName>("home");
  const [open, setOpen] = useState<Set<string>>(new Set());
  const [focused, setFocused] = useState<string | null>(null);
  const [panel, setPanel] = useState<"review" | "history" | null>(null);
  const [status, setStatus] = useState<Status>(() => (deployed < initial.revision ? { kind: "deploying", revision: initial.revision } : { kind: "idle" }));

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
    for (const lang of locales) walk(base[lang], []);
    return { numeric, nullable };
  }, [base]);

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

  // Bring a field found by search into view.
  useEffect(() => {
    if (!focused) return;
    document.getElementById(fieldId(JSON.parse(focused) as Path))?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [focused, page]);

  const api: EditorApi = {
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
    isOpen: (path) => open.has(pathKey(path)),
    toggle: (path, value) =>
      setOpen((s) => {
        const next = new Set(s);
        const key = pathKey(path);
        if (value ?? !next.has(key)) next.add(key);
        else next.delete(key);
        return next;
      }),
    focused,
  };

  function reveal(path: Path) {
    setPage(path[0] as ModuleName);
    setOpen((s) => {
      const next = new Set(s);
      if (path.length === 2) next.add(pathKey([path[0], "_"]));
      for (let i = 2; i < path.length; i++) next.add(pathKey(path.slice(0, i)));
      return next;
    });
    setFocused(pathKey(path));
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
      setPanel(null);
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
    setPanel(null);
    setStatus({ kind: "deploying", revision: data.edits.revision });
  }

  const pageInfo = PAGES.find((p) => p.module === page)!;
  const moduleValue = getAt(current.en, [page]) as Record<string, unknown>;
  const order = SECTION_ORDER[page] ?? [];
  const keys = Object.keys(moduleValue)
    .filter((k) => !isHidden([page, k]))
    .sort((a, b) => (order.indexOf(a) + 1 || 999) - (order.indexOf(b) + 1 || 999));
  const leaves = keys.filter((k) => getAt(current.en, [page, k]) === null || typeof getAt(current.en, [page, k]) !== "object");
  const groups = keys.filter((k) => !leaves.includes(k));
  const changedIn = (module: string) => new Set(draft.filter((o) => o.path[0] === module).map((o) => pathKey(o.path))).size;
  const draftCount = useMemo(() => new Set(draft.map((o) => pathKey(o.path))).size, [draft]);

  return (
    <EditorProvider value={api}>
      <div className="min-h-dvh bg-leaf text-ink">
        <header className="sticky top-0 z-30 border-b border-black/30 bg-board-deep text-board-ink">
          <div className="mx-auto flex max-w-[112rem] flex-wrap items-center gap-x-6 gap-y-3 px-4 py-3 lg:px-8">
            <div className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element -- the site's own mark */}
              <img src="/icon.png" alt="" className="size-8" />
              <div className="leading-tight">
                <p className="font-display text-[1.1rem]">Site editor</p>
                <p className="font-mono text-[0.72rem] text-board-soft">Acharya Shanti Sagar Foundation</p>
              </div>
            </div>
            <StatusPill status={status} count={draftCount} storage={storage} onRetry={() => setPanel("review")} />
            <div className="ml-auto flex flex-wrap items-center gap-2">
              {storage === "github" ? (
                <button type="button" onClick={() => setPanel("history")} className="cursor-pointer rounded-md px-3 py-2 text-[0.92rem] text-board-ink/85 hover:bg-white/10">
                  History
                </button>
              ) : null}
              <button
                type="button"
                onClick={() => setPanel("review")}
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
        </header>

        {olderDraft && draft.length ? (
          <p className="mx-auto mt-4 max-w-[112rem] px-4 text-[0.92rem] text-cinnabar-deep lg:px-8">
            Your unpublished changes were started before someone published. They&apos;re kept — check them under Review before publishing.
          </p>
        ) : null}

        <div className="mx-auto grid max-w-[112rem] grid-cols-[minmax(0,1fr)] gap-6 px-4 py-6 lg:grid-cols-[17rem_minmax(0,1fr)] lg:gap-10 lg:px-8">
          <aside className="min-w-0 lg:sticky lg:top-24 lg:self-start">
            <Search trees={current} onPick={reveal} />
            <nav aria-label="Pages" className="mt-5">
              <ul className="flex gap-1.5 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0">
                {PAGES.map((p) => (
                  <li key={p.module} className="shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        setPage(p.module);
                        setFocused(null);
                      }}
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
            <p className="mt-6 hidden text-[0.85rem] leading-relaxed text-ink-faint lg:block">
              Changes stay in this browser until you publish them. Publishing updates the site in a minute or two, and every publish can be undone from History.
            </p>
          </aside>

          <main id="main" className="min-w-0">
            <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
              <h1 className="font-display text-[clamp(1.8rem,1.4rem+1.2vw,2.5rem)] leading-tight">{pageInfo.title}</h1>
              {page !== "shared" && page !== "ui" ? (
                <p className="flex gap-3 text-[0.9rem]">
                  {locales.map((l) => (
                    <a
                      key={l}
                      href={`${localeInfo[l].prefix}${pageInfo.href === "/" && l !== "en" ? "" : pageInfo.href}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-cinnabar-deep underline decoration-cinnabar/40 underline-offset-2 hover:text-cinnabar"
                    >
                      View{l === "en" ? " page" : ""} in {LANG_LABEL[l]} ↗
                    </a>
                  ))}
                </p>
              ) : null}
            </div>

            <div className="space-y-3">
              {leaves.length ? (
                <Section
                  title={page === "shared" ? "Prices" : "General"}
                  subtitle=""
                  open={api.isOpen([page, "_"])}
                  onToggle={() => api.toggle([page, "_"])}
                  changed={leaves.some((k) => api.changed([page, k]))}
                >
                  {leaves.map((k) => (
                    <Node key={k} path={[page, k]} />
                  ))}
                </Section>
              ) : null}
              {groups.map((k) => {
                const value = getAt(current.en, [page, k]) as Record<string, unknown>;
                const subtitle = ["heading", "title", "label", "eyebrow"].map((f) => value?.[f]).find((v) => typeof v === "string") as string | undefined;
                return (
                  <Section
                    key={k}
                    title={sectionLabel(page, k)}
                    subtitle={subtitle ?? ""}
                    open={api.isOpen([page, k])}
                    onToggle={() => api.toggle([page, k])}
                    changed={api.changed([page, k])}
                  >
                    <Node path={[page, k]} />
                  </Section>
                );
              })}
            </div>
          </main>
        </div>

        {panel === "review" ? (
          <Review
            draft={draft}
            published={publishedTrees}
            current={current}
            status={status}
            onClose={() => setPanel(null)}
            onUndo={(key) => setDraft((d) => d.filter((o) => pathKey(o.path) !== key))}
            onDiscard={() => {
              if (window.confirm("Discard all unpublished changes? This can't be undone.")) {
                setDraft([]);
                setSplit(new Set());
                setPanel(null);
              }
            }}
            onReveal={(path) => {
              setPanel(null);
              reveal(path);
            }}
            onPublish={publish}
          />
        ) : null}
        {panel === "history" ? <History onClose={() => setPanel(null)} onRestore={restore} /> : null}
      </div>
    </EditorProvider>
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

function Search({ trees, onPick }: { trees: Trees; onPick: (path: Path) => void }) {
  const [query, setQuery] = useState("");
  const index = useMemo(() => (query.trim().length >= 2 ? searchIndex(trees) : []), [trees, query]);
  const q = query.trim().toLowerCase();
  const hits = q.length >= 2 ? index.filter((h) => h.text.toLowerCase().includes(q)).slice(0, 40) : [];
  return (
    <div className="relative">
      <label className="block">
        <span className="mb-1 block font-mono text-[0.75rem] uppercase tracking-[0.06em] text-ink-faint">Find text on the site</span>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g. a typo, a name, a figure"
          className="w-full rounded-md border border-ink/20 bg-white/80 px-3 py-2 outline-none focus:border-cinnabar"
        />
      </label>
      {q.length >= 2 ? (
        <ul className="absolute inset-x-0 top-full z-20 mt-1 max-h-[60vh] overflow-auto rounded-md border border-ink/15 bg-white shadow-lg">
          {hits.length ? (
            hits.map((h) => (
              <li key={pathKey(h.path)}>
                <button
                  type="button"
                  className="block w-full cursor-pointer border-b border-ink/5 px-3 py-2 text-left hover:bg-leaf"
                  onClick={() => {
                    onPick(h.path);
                    setQuery("");
                  }}
                >
                  <span className="block font-mono text-[0.72rem] text-ink-faint">{describePath(h.path)}</span>
                  <span className="line-clamp-2 text-[0.9rem]">{h.text}</span>
                </button>
              </li>
            ))
          ) : (
            <li className="px-3 py-2 text-[0.9rem] text-ink-faint">Nothing on the site matches.</li>
          )}
        </ul>
      ) : null}
    </div>
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

const short = (v: unknown) => {
  if (v === null || v === undefined || v === "") return "—";
  const text = typeof v === "string" ? v : typeof v === "number" ? v.toLocaleString("en-IN") : Array.isArray(v) ? `${v.length} items` : "…";
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
                          <span className="text-ink-faint line-through decoration-ink/30">{short(getAt(published[lang], path))}</span>
                          <span className="mx-1.5 text-cinnabar">→</span>
                          <span>{short(op.value as Json)}</span>
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

