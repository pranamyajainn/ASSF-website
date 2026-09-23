import "server-only";
import * as shared from "@/content/shared";
import * as home from "@/content/home";
import * as about from "@/content/about";
import * as conservation from "@/content/manuscript-conservation";
import * as rural from "@/content/rural-infrastructure";
import * as community from "@/content/community-services";
import * as impact from "@/content/impact";
import * as trustees from "@/content/trustees";
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

const cache = new Map<Lang, Content>();

export function resolveContent(lang: Lang): Content {
  let content = cache.get(lang);
  if (!content) {
    const merged = lang === "en" ? source : overlay(source, translations[lang]);
    content = localizeLinks(merged, lang) as Content;
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
