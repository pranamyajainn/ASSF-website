import type { Metadata } from "next";
import { getContent } from "./content";
import { localizeHref, locales } from "./config";
import type { UI } from "./ui";

/**
 * Title, description, canonical URL and the three editions as hreflang
 * alternates, for one page in the current edition.
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
  return {
    title,
    description: desc,
    alternates: { canonical: localizeHref(path, lang), languages },
    openGraph: { title, description: desc },
  };
}
