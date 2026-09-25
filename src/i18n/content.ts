import "server-only";
import * as shared from "@/content/shared";
import * as home from "@/content/home";
import * as about from "@/content/about";
import * as conservation from "@/content/manuscript-conservation";
import * as rural from "@/content/rural-infrastructure";
import * as community from "@/content/community-services";
import * as impact from "@/content/impact";
import * as trustees from "@/content/trustees";
import editsFile from "@/content/edits.json";
import { applyOps, clone, fillBlanks, fillTokens, type Edits } from "@/lib/cms/edits";
import { localizeHref, type Lang } from "./config";
import { getLang } from "./get-lang";
import { ui } from "./ui";
import { hi } from "./hi";
import { kn } from "./kn";

/**
 * Every edition is the English source with its strings overlaid. Figures,
 * image paths, dates and state flags are never translated — they come from
 * the English modules, so a number corrected there is corrected in all
 * three editions at once. The English modules stay the source of truth
 * (the trustee portal and the assistant still read them directly).
 */
const source = {
  shared: { ...shared },
  home: { ...home },
  about: { ...about },
  conservation: { ...conservation },
  rural: { ...rural },
  community: { ...community },
  impact: { ...impact },
  trustees: { ...trustees },
  ui,
};

export type Content = typeof source;

/** The shape of a translation: any string may be replaced, nothing else. */
export type Translation = Tr<Content>;
type Tr<T> = T extends string
  ? string
  : T extends number | boolean
    ? T
    : T extends null
      ? string | null
      : T extends readonly (infer U)[]
        ? ReadonlyArray<Tr<U> | undefined>
        : T extends object
          ? { [K in keyof T]?: Tr<T[K]> }
          : T;

const translations: Record<Exclude<Lang, "en">, Translation> = { hi, kn };

function overlay(base: unknown, over: unknown): unknown {
  if (over === undefined) return base;
  if (Array.isArray(base)) {
    const list = Array.isArray(over) ? over : [];
    return base.map((item, i) => overlay(item, list[i]));
  }
  if (base && typeof base === "object") {
    const out: Record<string, unknown> = {};
    const o = (over ?? {}) as Record<string, unknown>;
    for (const key of Object.keys(base)) {
      out[key] = overlay((base as Record<string, unknown>)[key], o[key]);
    }
    // Optional fields only an edition supplies (a quote's `translation`, say)
    // have no English counterpart to overlay; carry strings across as-is.
    for (const key of Object.keys(o)) {
      if (!(key in out) && typeof o[key] === "string") out[key] = o[key];
    }
    return out;
  }
  // Leaves: only a string may replace a string (or fill a null).
  if (typeof over === "string" && (typeof base === "string" || base === null)) return over;
  return base;
}

function localizeLinks(value: unknown, lang: Lang): unknown {
  if (Array.isArray(value)) return value.map((v) => localizeLinks(v, lang));
  if (value && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [key, v] of Object.entries(value)) {
      out[key] = key === "href" && typeof v === "string" ? localizeHref(v, lang) : localizeLinks(v, lang);
    }
    return out;
  }
  return value;
}

/** What the Foundation has changed in the site editor (see lib/cms/edits.ts). */
export const publishedEdits = editsFile as Edits;

/**
 * An edition before the site editor's changes, links not yet localised —
 * the base the editor shows and validates against.
 */
export function baseContent(lang: Lang): Content {
  return clone(lang === "en" ? source : (overlay(source, translations[lang]) as Content));
}

/** An edition with a given set of edits applied, before tokens and links. */
export function editedContent(lang: Lang, edits: Edits = publishedEdits): Content {
  const tree = baseContent(lang);
  applyOps(tree, edits.ops, lang);
  return tree;
}

const cache = new Map<Lang, Content>();

export function resolveContent(lang: Lang): Content {
  let content = cache.get(lang);
  if (!content) {
    const own = editedContent(lang);
    const edited = (lang === "en" ? own : fillBlanks(own, editedContent("en"))) as Content;
    const { folioPrice, granthaPrice } = edited.shared;
    const filled = fillTokens(edited, {
      folioPrice: folioPrice.toLocaleString("en-IN"),
      granthaPrice: granthaPrice.toLocaleString("en-IN"),
    });
    content = localizeLinks(filled, lang) as Content;
    cache.set(lang, content);
  }
  return content;
}

/** The current edition's content, plus a link helper bound to it. */
export async function getContent() {
  const lang = await getLang();
  return {
    ...resolveContent(lang),
    lang,
    href: (path: string) => localizeHref(path, lang),
  };
}
