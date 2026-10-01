/**
 * Site check: what on the site needs a person's attention, worked out from
 * the content itself — nothing here is guessed.
 *
 * - Waiting on the Foundation: facts the site shows as "awaiting Foundation".
 * - Translations behind: English was changed in the editor, but the Hindi
 *   or Kannada still has the original wording.
 * - Shown in English: a Hindi or Kannada field left empty, so that edition
 *   falls back to the English.
 * - Photos without a description, for readers who can't see them.
 * - Links and photos that don't open (checked live, see LinkCheck).
 */
import { locales, type Lang } from "@/i18n/config";
import { getAt, type Path } from "@/lib/cms/edits";
import { isHidden, isImagePath, schemaPath } from "@/lib/cms/schema";
import type { Trees } from "./model";

export type Finding = { path: Path; lang?: Lang };
export type Health = {
  waiting: Finding[];
  behind: Finding[];
  english: Finding[];
  undescribed: Finding[];
  /** Links to other websites, checked by the server. */
  links: { url: string; path: Path }[];
  /** Photos and pages on this site, checked by the browser. */
  local: { url: string; path: Path }[];
};

function leaves(tree: unknown, visit: (path: Path, value: unknown) => void, path: Path = []) {
  const node = path.length ? getAt(tree, path) : tree;
  if (Array.isArray(node)) node.forEach((_, i) => leaves(tree, visit, [...path, i]));
  else if (node && typeof node === "object") for (const k of Object.keys(node)) leaves(tree, visit, [...path, k]);
  else visit(path, node);
}

const LINK_KEYS = new Set(["href", "url", "link"]);

export function checkSite(base: Trees, published: Trees, translated: Set<string>): Health {
  const health: Health = { waiting: [], behind: [], english: [], undescribed: [], links: [], local: [] };
  const seenLinks = new Set<string>();
  const seenLocal = new Set<string>();
  leaves(published.en, (path, value) => {
    if (path[0] === "ui" || path[0] === "shared" && path[1] === "languages") return;
    const key = path[path.length - 1];
    // Links are kept out of the editor's view, but they're checked all the same.
    const hidden = isHidden(path);
    if (value === null && !hidden) health.waiting.push({ path });
    if (typeof value === "string" && !hidden && translated.has(schemaPath(path))) {
      const englishChanged = getAt(base.en, path) !== undefined && getAt(base.en, path) !== value;
      for (const lang of locales.slice(1) as Lang[]) {
        const own = getAt(published[lang], path);
        // Left blank in the edition as built is a choice (a Hindi quote needs no Hindi translation).
        const blankByDesign = getAt(base[lang], path) === "";
        if (value && !blankByDesign && (own === "" || own === undefined || own === null)) health.english.push({ path, lang });
        else if (englishChanged && typeof own === "string" && own === getAt(base[lang], path)) health.behind.push({ path, lang });
      }
    }
    const local = typeof value === "string" && (isImagePath(value) || (typeof key === "string" && LINK_KEYS.has(key) && /^\/(?!\/)/.test(value)));
    if (local && !seenLocal.has(value)) {
      seenLocal.add(value);
      health.local.push({ url: value, path });
    }
    if (isImagePath(value) && typeof key === "string" && ["src", "image", "portrait", "plate"].includes(key)) {
      const parent = getAt(published.en, path.slice(0, -1)) as Record<string, unknown> | null;
      if (parent && typeof parent === "object" && "alt" in parent && !String(parent.alt ?? "").trim()) health.undescribed.push({ path: [...path.slice(0, -1), "alt"] });
    }
    if (typeof value === "string" && /^https?:\/\//.test(value) && (typeof key !== "string" || LINK_KEYS.has(key) || !/\s/.test(value)) && !seenLinks.has(value)) {
      seenLinks.add(value);
      health.links.push({ url: value, path });
    }
  });
  return health;
}
