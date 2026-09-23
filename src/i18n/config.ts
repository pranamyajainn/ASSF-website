/**
 * The three editions of the site. English lives at the root (`/about`);
 * the Hindi and Kannada editions under a prefix (`/hi/about`, `/kn/about`).
 * Safe to import from client components — no content, no server APIs.
 */
export const locales = ["en", "hi", "kn"] as const;
export type Lang = (typeof locales)[number];
export const translatedLocales = ["hi", "kn"] as const;

export const localeInfo: Record<
  Lang,
  { label: string; english: string; prefix: string; ogLocale: string }
> = {
  en: { label: "English", english: "English", prefix: "", ogLocale: "en_IN" },
  hi: { label: "हिन्दी", english: "Hindi", prefix: "/hi", ogLocale: "hi_IN" },
  kn: { label: "ಕನ್ನಡ", english: "Kannada", prefix: "/kn", ogLocale: "kn_IN" },
};

export function isLang(value: unknown): value is Lang {
  return typeof value === "string" && (locales as readonly string[]).includes(value);
}

/** Put an internal path into an edition: ("/about#scale", "hi") → "/hi/about#scale". */
export function localizeHref(href: string, lang: Lang): string {
  if (lang === "en" || !href.startsWith("/") || href.startsWith("//")) return href;
  if (href.startsWith("/api") || href.startsWith("/trustee-portal") || href.startsWith("/images")) {
    return href;
  }
  const prefix = localeInfo[lang].prefix;
  if (href === "/") return prefix;
  if (href.startsWith("/#")) return `${prefix}${href.slice(1)}`;
  return `${prefix}${href}`;
}

/** Strip any edition prefix from a pathname: "/kn/about" → "/about". */
export function unlocalizePath(pathname: string): string {
  for (const lang of translatedLocales) {
    const prefix = localeInfo[lang].prefix;
    if (pathname === prefix) return "/";
    if (pathname.startsWith(`${prefix}/`)) return pathname.slice(prefix.length);
  }
  return pathname;
}

export function langFromPath(pathname: string | null | undefined): Lang {
  const first = pathname?.split("/")[1];
  return isLang(first) && first !== "en" ? first : "en";
}
