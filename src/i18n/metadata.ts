import type { Metadata } from "next";
import { getContent } from "./content";
import { localeInfo, localizeHref, locales } from "./config";
import type { UI } from "./ui";

/**
 * Title, description, canonical URL and the three editions as hreflang
 * alternates, for one page in the current edition — and its link-preview
 * card (public/og/<lang>/<page>.jpg, drawn by scripts/share-cards.mjs), so a
 * page shared on WhatsApp shows its own heading and photograph in the
 * reader's language. URLs are made absolute by `metadataBase` in the root
 * layouts.
 */
export async function pageMetadata(
  page: Exclude<keyof UI["meta"], "home" | "homeDescription" | "suffix"> | "home",
  path: string,
  description?: string,
): Promise<Metadata> {
  const { ui, lang } = await getContent();
  const title = page === "home" ? ui.meta.home : `${ui.meta[page]} — ${ui.meta.suffix}`;
  const desc = description ?? ui.meta.homeDescription;
  const languages: Record<string, string> = { "x-default": path };
  for (const l of locales) languages[l] = localizeHref(path, l);
  const canonical = localizeHref(path, lang);
  const card = { url: `/og/${lang}/${path === "/" ? "home" : path.slice(1)}.jpg`, width: 1200, height: 630, alt: title };
  return {
    title,
    description: desc,
    alternates: { canonical, languages },
    openGraph: {
      title,
      description: desc,
      url: canonical,
      siteName: ui.meta.suffix,
      locale: localeInfo[lang].ogLocale,
      alternateLocale: locales.filter((l) => l !== lang).map((l) => localeInfo[l].ogLocale),
      type: "website",
      images: [card],
    },
    twitter: { card: "summary_large_image", title, description: desc, images: [card] },
  };
}
