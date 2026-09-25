"use client";

import { useEffect, useMemo, useState } from "react";
import { getAt, pathKey, type Json, type Path } from "@/lib/cms/edits";
import { describePath, isOpenList, PAGES, schemaPath, sectionLabel } from "@/lib/cms/schema";
import { fieldId, Node, useEditor } from "./fields";
import { blankLike, itemTitle, NEWEST_FIRST, searchIndex, type Trees } from "./model";

export type Selection = { path: Path } | { contact: true } | null;

/** The item a field belongs to (a trustee, a news entry, a photo), if any. */
export function itemOf(tree: unknown, path: Path): Path | null {
  for (let i = path.length - 1; i > 0; i--) {
    if (typeof path[i] !== "number") continue;
    const value = getAt(tree, path.slice(0, i + 1));
    if (value && typeof value === "object" && !Array.isArray(value)) return path.slice(0, i + 1);
  }
  return null;
}

/** "Trustees › Trustees › “Shri Rakesh Kumar Jain”" — where a thing is, as a reader would say it. */
function whereIs(tree: unknown, path: Path, item: Path | null): string {
  const page = PAGES.find((p) => p.module === path[0])?.title ?? String(path[0]);
  const section = typeof path[1] === "string" ? sectionLabel(String(path[0]), path[1]) : "";
  const parts = [page];
  if (section && section !== page) parts.push(section);
  if (item) parts.push(`“${itemTitle(getAt(tree, item), item[item.length - 1] as number)}”`);
  return parts.join(" › ");
}

/**
 * The editor's right-hand side. With nothing selected: how it works, and the
 * few things people come to do. With something selected: that thing alone —
 * a trustee's name, designation, profile and photo; a photo and its
 * description; a figure — and, for items in a list, move, remove, add.
 */
export function Panel({
  selection,
  onSelect,
  onFind,
  onAddNews,
  onAddTrustee,
  onList,
}: {
  selection: Selection;
  onSelect: (selection: Selection) => void;
  onFind: (path: Path) => void;
  onAddNews: () => void;
  onAddTrustee: () => void;
  onList: () => void;
}) {
  const api = useEditor();

  // Put the cursor in the field that was clicked.
  const focusKey = selection && "path" in selection ? pathKey(selection.path) : null;
  useEffect(() => {
    if (!focusKey) return;
    const t = setTimeout(() => {
      const shell = document.getElementById(fieldId(JSON.parse(focusKey) as Path));
      shell?.scrollIntoView({ block: "nearest" });
      shell?.querySelector<HTMLElement>("input[type=text], textarea")?.focus({ preventScroll: true });
    }, 50);
    return () => clearTimeout(t);
  }, [focusKey]);

  if (!selection) {
    return (
      <div className="space-y-7 p-6">
        <div>
          <h2 className="font-display text-[1.6rem] leading-snug">Click anything on the page to change it.</h2>
          <p className="mt-2 text-[0.98rem] leading-relaxed text-ink-soft">
            Words, figures and photos are outlined as you point at them. Click one, change it here, and watch the page update.
          </p>
        </div>
        <Find onFind={onFind} />
        <div>
          <p className="mb-2 font-display text-[1.05rem]">Or start with</p>
          <div className="grid gap-2">
            <Task title="Add a news update" body="A new dated entry on the home page" onClick={onAddNews} />
            <Task title="Add a trustee" body="Name, designation, profile and photo" onClick={onAddTrustee} />
            <Task title="Prices & contact details" body="Folio prices, phone, email, address" onClick={() => onSelect({ contact: true })} />
          </div>
        </div>
        <ol className="space-y-1.5 rounded-lg bg-white/50 p-4 text-[0.92rem] text-ink-soft">
          <li>
            <b className="text-cinnabar">1.</b> Make your changes — they&apos;re kept in this browser.
          </li>
          <li>
            <b className="text-cinnabar">2.</b> Press <b className="font-medium text-ink">Review &amp; publish</b> at the top.
          </li>
          <li>
            <b className="text-cinnabar">3.</b> The site updates in about two minutes. Anything can be undone from History.
          </li>
        </ol>
        <button type="button" onClick={onList} className="cursor-pointer text-[0.9rem] text-ink-faint underline decoration-ink/25 underline-offset-2 hover:text-ink">
          See all the site&apos;s content as a list instead
        </button>
      </div>
    );
  }

  if ("contact" in selection) {
    return (
      <Frame title="Prices & contact details" onBack={() => onSelect(null)}>
        <p className="mb-2 text-[0.92rem] text-ink-soft">These are set once and used everywhere on the site, in all three languages.</p>
        <Node path={["shared", "folioPrice"]} />
        <Node path={["shared", "granthaPrice"]} />
        <Node path={["shared", "org", "phone"]} />
        <Node path={["shared", "org", "email"]} />
        <Node path={["shared", "org", "office"]} />
        <Node path={["shared", "org", "bank"]} />
      </Frame>
    );
  }

  const path = selection.path;
  const item = itemOf(api.current.en, path);
  const parent = path.slice(0, -1);
  return (
    <Frame title={whereIs(api.current.en, path, item)} onBack={() => onSelect(null)}>
      {item ? <ItemActions item={item} onSelect={onSelect} /> : null}
      {item ? <Node path={item} /> : <Single path={path} parent={parent} />}
    </Frame>
  );
}

function Frame({ title, onBack, children }: { title: string; onBack: () => void; children: React.ReactNode }) {
  return (
    <div className="flex min-h-full flex-col">
      <div className="sticky top-0 z-10 border-b border-ink/10 bg-leaf/95 px-5 py-3 backdrop-blur">
        <button type="button" onClick={onBack} className="cursor-pointer text-[0.9rem] text-cinnabar-deep hover:text-cinnabar">
          ← Back
        </button>
        <p className="mt-1 font-display text-[1.15rem] leading-snug">{title}</p>
      </div>
      <div className="flex-1 px-3 pb-6 pt-2">{children}</div>
      <div className="sticky bottom-0 border-t border-ink/10 bg-leaf/95 px-5 py-3 backdrop-blur">
        <button type="button" onClick={onBack} className="w-full cursor-pointer rounded-md bg-ink py-2.5 text-leaf transition-colors hover:bg-board">
          Done
        </button>
        <p className="mt-2 text-center text-[0.78rem] text-ink-faint">Changes are kept here until you press Review &amp; publish.</p>
      </div>
    </div>
  );
}

/** A field that isn't part of a list item: it alone, and the rest of its part on request. */
function Single({ path, parent }: { path: Path; parent: Path }) {
  const [all, setAll] = useState(false);
  return all ? (
    <Node path={parent} />
  ) : (
    <>
      <Node path={path} />
      {parent.length > 1 ? (
        <button type="button" onClick={() => setAll(true)} className="ml-4 mt-2 cursor-pointer text-[0.88rem] text-ink-faint underline decoration-ink/25 underline-offset-2 hover:text-ink">
          Show everything else in this part
        </button>
      ) : null}
    </>
  );
}

function ItemActions({ item, onSelect }: { item: Path; onSelect: (selection: Selection) => void }) {
  const api = useEditor();
  const listPath = item.slice(0, -1);
  const index = item[item.length - 1] as number;
  const list = getAt(api.current.en, listPath) as unknown[];
  if (!Array.isArray(list) || !isOpenList(listPath, list)) return null;
  const noun = itemTitle(list[index], index);
  const reshaped = list.length !== ((getAt(api.published.en, listPath) as unknown[] | undefined)?.length ?? 0);
  const move = (to: number) => {
    api.changeList(listPath, (l) => {
      const [x] = l.splice(index, 1);
      l.splice(to, 0, x);
      return l;
    });
    onSelect({ path: [...listPath, to] });
  };
  const button =
    "cursor-pointer rounded-md border border-ink/20 bg-white/70 px-3 py-1.5 text-[0.86rem] text-ink transition-colors hover:border-cinnabar hover:text-cinnabar disabled:cursor-default disabled:opacity-40 disabled:hover:border-ink/20 disabled:hover:text-ink";
  return (
    <div className="mb-2 flex flex-wrap gap-2 px-2 pt-1">
      <button type="button" className={button} disabled={index === 0} onClick={() => move(index - 1)}>
        ↑ Move earlier
      </button>
      <button type="button" className={button} disabled={index === list.length - 1} onClick={() => move(index + 1)}>
        ↓ Move later
      </button>
      <button
        type="button"
        className={button}
        onClick={() => {
          const at = NEWEST_FIRST.has(schemaPath(listPath)) ? index : index + 1;
          api.changeList(listPath, (l) => {
            l.splice(at, 0, blankLike(l[index] as Json));
            return l;
          });
          onSelect({ path: [...listPath, at] });
        }}
      >
        + Add another
      </button>
      <button
        type="button"
        className={`${button} ml-auto`}
        onClick={() => {
          if (!window.confirm(`Remove “${noun}” from the site? It goes when you publish.`)) return;
          api.changeList(listPath, (l) => l.filter((_, i) => i !== index));
          onSelect(null);
        }}
      >
        Remove
      </button>
      {reshaped ? (
        <p className="w-full rounded-md bg-white/60 px-3 py-2 text-[0.84rem] text-ink-soft">
          New, removed and moved items appear on the page once you publish. Changes to words show straight away.
        </p>
      ) : null}
    </div>
  );
}

function Task({ title, body, onClick }: { title: string; body: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group cursor-pointer rounded-lg border border-ink/12 bg-white/60 px-4 py-3 text-left transition-colors hover:border-cinnabar/60 hover:bg-white"
    >
      <span className="block font-display text-[1.08rem] group-hover:text-cinnabar-deep">{title} →</span>
      <span className="block text-[0.88rem] text-ink-soft">{body}</span>
    </button>
  );
}

/** "Find words on the site": type what you see, jump to where it's written. */
export function Find({ onFind }: { onFind: (path: Path) => void }) {
  const api = useEditor();
  const trees: Trees = api.current;
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();
  const enabled = q.length >= 2;
  const index = useMemo(() => (enabled ? searchIndex(trees) : []), [trees, enabled]);
  const hits = q.length >= 2 ? index.filter((h) => h.text.toLowerCase().includes(q)).slice(0, 30) : [];
  return (
    <div className="relative">
      <label className="block">
        <span className="mb-1 block font-display text-[1.05rem]">Find words on the site</span>
        <input
          id="editor-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g. a typo, a name, a figure"
          className="w-full rounded-md border border-ink/20 bg-white/85 px-3 py-2.5 outline-none focus:border-cinnabar"
        />
      </label>
      {q.length >= 2 ? (
        <ul className="absolute inset-x-0 top-full z-20 mt-1 max-h-[55vh] overflow-auto rounded-md border border-ink/15 bg-white shadow-lg">
          {hits.length ? (
            hits.map((h) => (
              <li key={pathKey(h.path)}>
                <button
                  type="button"
                  className="block w-full cursor-pointer border-b border-ink/5 px-3 py-2 text-left hover:bg-leaf"
                  onClick={() => {
                    onFind(h.path);
                    setQuery("");
                  }}
                >
                  <span className="block text-[0.75rem] text-ink-faint">{describePath(h.path)}</span>
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
