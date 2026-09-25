"use client";

import { useEffect, useRef, useState } from "react";
import { getAt, pathKey, type Path } from "@/lib/cms/edits";
import { isImagePath } from "@/lib/cms/schema";
import { readTag, stripTags, TAG, tagFor } from "@/lib/cms/stega";

/**
 * The site itself, inside the editor. The page is the published one, served
 * by /preview with every piece of text invisibly tagged with its field. On
 * top of it, this component:
 *
 * - outlines whatever the pointer is over, and on a click says which field
 *   that was (links and buttons don't navigate here — a click selects);
 * - rewrites the page's text and photos to match the editor's draft as it
 *   is typed, so a change is seen in place before it's published. (Items
 *   added, removed or reordered appear after publishing.)
 */
export function Preview({
  src,
  module,
  shown,
  rendered,
  previews,
  selected,
  scrollTo,
  onPick,
}: {
  src: string;
  /** The content module of the page shown (a photo used on several pages resolves to this one). */
  module: string;
  /** The edition as it would look with the draft: what the page should show. */
  shown: unknown;
  /** The edition as published: what the page was rendered with. */
  rendered: unknown;
  previews: Record<string, string>;
  selected: Path | null;
  scrollTo: { path: Path; nonce: number } | null;
  onPick: (path: Path) => void;
}) {
  const frame = useRef<HTMLIFrameElement>(null);
  const [loadedSrc, setLoadedSrc] = useState<string | null>(null);
  const loaded = loadedSrc === src;
  const state = useRef({ shown, rendered, previews, onPick, selected, module, last: new Map<string, string>() });
  // The page's listeners read the latest props through this.
  useEffect(() => {
    Object.assign(state.current, { shown, rendered, previews, onPick, selected, module });
  });

  // Wire up the page each time it loads.
  useEffect(() => {
    const iframe = frame.current;
    if (!iframe) return;
    let observer: MutationObserver | null = null;
    let timer: ReturnType<typeof setTimeout> | null = null;
    const onLoad = () => {
      const doc = iframe.contentDocument;
      if (!doc?.body) return;
      state.current.last = new Map();
      const style = doc.createElement("style");
      style.textContent = `
        [data-cms-hover]{outline:2px dashed #a82e17 !important;outline-offset:3px;cursor:pointer !important}
        [data-cms-selected]{outline:3px solid #e0b040 !important;outline-offset:3px}
        @keyframes cms-flash{0%{background-color:rgb(224 176 64/.5)}100%{background-color:transparent}}
        [data-cms-flash]{animation:cms-flash 1.8s ease-out}
        *{cursor:default}`;
      doc.head.appendChild(style);

      let hovered: Element | null = null;
      const setHover = (el: Element | null) => {
        if (hovered === el) return;
        hovered?.removeAttribute("data-cms-hover");
        el?.setAttribute("data-cms-hover", "");
        hovered = el;
      };
      doc.addEventListener("mousemove", (e) => setHover(pick(doc, e.clientX, e.clientY, state.current)?.element ?? null));
      doc.addEventListener("mouseleave", () => setHover(null));
      doc.addEventListener(
        "click",
        (e) => {
          e.preventDefault();
          e.stopPropagation();
          const hit = pick(doc, e.clientX, e.clientY, state.current);
          if (hit) state.current.onPick(hit.path);
        },
        true,
      );
      doc.addEventListener("submit", (e) => e.preventDefault(), true);

      const run = () => {
        observer?.disconnect();
        patch(doc, state.current);
        mark(doc, state.current.selected);
        observer?.observe(doc.body, { childList: true, subtree: true, characterData: true });
      };
      observer = new MutationObserver(() => {
        if (timer) clearTimeout(timer);
        timer = setTimeout(run, 250);
      });
      // After React has hydrated the page, then whenever it changes itself.
      setTimeout(run, 600);
      setLoadedSrc(src);
    };
    iframe.addEventListener("load", onLoad);
    // A page that finished loading before this ran.
    const early = iframe.contentDocument;
    const already = early?.readyState === "complete" && early.URL !== "about:blank" ? setTimeout(onLoad, 0) : null;
    return () => {
      iframe.removeEventListener("load", onLoad);
      if (already) clearTimeout(already);
      observer?.disconnect();
      if (timer) clearTimeout(timer);
    };
  }, [src]);

  // The draft changed: show it on the page.
  useEffect(() => {
    const doc = frame.current?.contentDocument;
    if (!doc?.body || !loaded) return;
    const t = setTimeout(() => {
      patch(doc, state.current);
      mark(doc, selected);
    }, 120);
    return () => clearTimeout(t);
  }, [shown, previews, selected, loaded]);

  // Bring a field into view, briefly lit.
  useEffect(() => {
    const doc = frame.current?.contentDocument;
    if (!doc?.body || !scrollTo || !loaded) return;
    const el = elementFor(doc, scrollTo.path, state.current.rendered);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "center" });
    el.removeAttribute("data-cms-flash");
    void (el as HTMLElement).offsetWidth;
    el.setAttribute("data-cms-flash", "");
  }, [scrollTo, loaded]);

  return (
    <div className="relative size-full bg-white">
      <iframe
        key={src}
        ref={frame}
        src={src}
        title="The page, as it will look"
        className="size-full border-0"
      />
      {!loaded ? (
        <div className="absolute inset-0 grid place-items-center bg-leaf/80">
          <p className="font-display text-xl text-ink-soft">Opening the page…</p>
        </div>
      ) : null}
    </div>
  );
}

/* ------------------------------------------------------------ reading the page */

const PHOTO_KEYS = new Set(["src", "image", "portrait"]);

/** The photo an <img> shows, as the content names it ("/images/…"). */
function photoOf(img: HTMLImageElement): string | null {
  const raw = img.getAttribute("data-cms-src") ?? img.getAttribute("src") ?? "";
  try {
    const url = new URL(raw, "http://x");
    const path = url.pathname.startsWith("/_next/image") ? url.searchParams.get("url") : url.pathname;
    return path && isImagePath(path) ? path : null;
  } catch {
    return null;
  }
}

/** Where a photo is used in the content — on the page being shown first. */
function photoPaths(tree: unknown, src: string, module?: string): Path[] {
  const found: Path[] = [];
  const walk = (node: unknown, path: Path) => {
    if (node === src && PHOTO_KEYS.has(String(path[path.length - 1]))) found.push(path);
    else if (Array.isArray(node)) node.forEach((v, i) => walk(v, [...path, i]));
    else if (node && typeof node === "object") for (const [k, v] of Object.entries(node)) walk(v, [...path, k]);
  };
  walk(tree, []);
  return found.sort((a, b) => Number(b[0] === module) - Number(a[0] === module));
}

function firstTag(text: string, from = 0): Path | null {
  TAG.lastIndex = 0;
  let m: RegExpExecArray | null;
  while ((m = TAG.exec(text))) if (m.index >= from) return readTag(m[1]);
  return null;
}

const countTags = (text: string) => (text.match(TAG) ?? []).length;

/** The element that shows the whole of a tagged string (a string split into spans is shown by their parent). */
function holderOf(node: Text, whole: string | null): Element | null {
  let el = node.parentElement;
  for (let i = 0; el && i < 4; i++, el = el.parentElement) {
    const text = el.textContent ?? "";
    if (countTags(text) !== 1) break;
    if (whole === null || stripTags(text).trim() === whole.trim()) return el;
  }
  return node.parentElement;
}

/** What's at a point on the page: the field, and the element to outline. */
function pick(doc: Document, x: number, y: number, s: { rendered: unknown; module: string }): { path: Path; element: Element } | null {
  const { rendered } = s;
  const stack = doc.elementsFromPoint(x, y);
  const top = stack[0];
  if (!top) return null;
  const ownText = [...top.childNodes].some((n) => n.nodeType === 3 && (n.textContent ?? "").trim());
  if (!ownText) {
    const img = stack.find((el): el is HTMLImageElement => el.tagName === "IMG");
    if (img) {
      const photo = photoOf(img);
      const path = photo ? photoPaths(rendered, photo, s.module)[0] : undefined;
      if (path) return { path, element: img };
    }
  }
  // The text under the pointer, and the tag that closes its string.
  type Caret = { offsetNode: Node; offset: number };
  const docWithCaret = doc as Document & { caretPositionFromPoint?: (x: number, y: number) => Caret | null };
  const pos = docWithCaret.caretPositionFromPoint?.(x, y);
  const range = pos ? null : doc.caretRangeFromPoint?.(x, y);
  let node: Node | null = pos?.offsetNode ?? range?.startContainer ?? null;
  if (!node || node.nodeType !== 3) {
    const walker = doc.createTreeWalker(top, NodeFilter.SHOW_TEXT);
    node = walker.nextNode();
  }
  if (!node) return null;
  for (let scope = node.parentElement, depth = 0; scope && depth < 4; scope = scope.parentElement, depth++) {
    const walker = doc.createTreeWalker(scope, NodeFilter.SHOW_TEXT);
    walker.currentNode = node;
    for (let t: Node | null = node; t; t = walker.nextNode()) {
      const path = firstTag(t.textContent ?? "");
      if (path) {
        const whole = getAt(rendered, path);
        return { path, element: holderOf(t as Text, typeof whole === "string" ? whole : null) ?? top };
      }
    }
  }
  return null;
}

/** The element showing a field — or, for an item or a part, its first piece of text. */
function elementFor(doc: Document, path: Path, rendered: unknown): Element | null {
  const walker = doc.createTreeWalker(doc.body, NodeFilter.SHOW_TEXT);
  for (let t = walker.nextNode(); t; t = walker.nextNode()) {
    const found = firstTag(t.textContent ?? "");
    if (found && path.every((step, i) => found[i] === step)) {
      const whole = getAt(rendered, found);
      return holderOf(t as Text, typeof whole === "string" ? whole : null);
    }
  }
  const src = getAt(rendered, path);
  if (typeof src === "string" && isImagePath(src)) {
    return [...doc.images].find((img) => photoOf(img) === src) ?? null;
  }
  return null;
}

/* ------------------------------------------------------------ showing the draft */

type PatchState = { shown: unknown; rendered: unknown; previews: Record<string, string>; module: string; last: Map<string, string> };

/** Rewrites the page's text and photos to what the draft says. */
function patch(doc: Document, s: PatchState) {
  const walker = doc.createTreeWalker(doc.body, NodeFilter.SHOW_TEXT, {
    acceptNode: (n) => ((n.textContent ?? "").includes("⁠") ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP),
  });
  const nodes: Text[] = [];
  for (let t = walker.nextNode(); t; t = walker.nextNode()) nodes.push(t as Text);

  for (const node of nodes) {
    const data = node.data;
    const parts: { text: string; path: Path | null; tag: string }[] = [];
    let cursor = 0;
    TAG.lastIndex = 0;
    let m: RegExpExecArray | null;
    while ((m = TAG.exec(data))) {
      parts.push({ text: data.slice(cursor, m.index), path: readTag(m[1]), tag: m[0] });
      cursor = m.index + m[0].length;
    }
    const tail = data.slice(cursor);
    let changed = false;
    let wholeSwap: { holder: Element; text: string } | null = null;

    for (const part of parts) {
      if (!part.path) continue;
      const key = pathKey(part.path);
      const want = getAt(s.shown, part.path);
      const was = getAt(s.rendered, part.path);
      if (typeof want !== "string" || typeof was !== "string") continue;
      const before = s.last.get(key) ?? was;
      if (want === before) continue;
      s.last.set(key, want);
      if (part.text.trim() === before.trim()) {
        part.text = part.text.replace(before.trim(), want);
        changed = true;
      } else if (parts.length === 1) {
        // A string the page split into pieces: rewrite the element that holds it all.
        const holder = holderOf(node, before);
        if (holder && holder !== node.parentElement) wholeSwap = { holder, text: want + part.tag };
        else {
          part.text = want;
          changed = true;
        }
      }
    }
    if (wholeSwap) wholeSwap.holder.textContent = wholeSwap.text;
    else if (changed) node.data = parts.map((p) => p.text + p.tag).join("") + tail;
  }

  for (const img of [...doc.images]) {
    if (!img.hasAttribute("data-cms-src")) img.setAttribute("data-cms-src", img.getAttribute("src") ?? "");
    const photo = photoOf(img);
    if (!photo) continue;
    const path = photoPaths(s.rendered, photo, s.module)[0];
    if (!path) continue;
    const want = getAt(s.shown, path);
    const target = typeof want === "string" && want && want !== photo ? (s.previews[want] ?? want) : null;
    if (target && img.getAttribute("src") !== target) {
      img.removeAttribute("srcset");
      img.removeAttribute("sizes");
      img.setAttribute("src", target);
    } else if (!target && img.getAttribute("src") !== img.getAttribute("data-cms-src")) {
      img.setAttribute("src", img.getAttribute("data-cms-src") ?? "");
    }
  }
}

/** Outlines the element showing the selected field. */
function mark(doc: Document, selected: Path | null) {
  doc.querySelectorAll("[data-cms-selected]").forEach((el) => el.removeAttribute("data-cms-selected"));
  if (!selected) return;
  const tag = tagFor(selected);
  const walker = doc.createTreeWalker(doc.body, NodeFilter.SHOW_TEXT);
  for (let t = walker.nextNode(); t; t = walker.nextNode()) {
    if ((t.textContent ?? "").includes(tag)) (holderOf(t as Text, null) ?? t.parentElement)?.setAttribute("data-cms-selected", "");
  }
}
