import type { MetadataRoute } from "next";
import { localizeHref, locales } from "@/i18n/config";
import { siteUrl } from "@/lib/site";

/** Every public page, in each edition, each listing its other two editions. */
const PAGES = [
  "/",
  "/about",
  "/manuscript-conservation",
  "/rural-infrastructure",
  "/community-services",
  "/impact",
  "/trustees",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const url = (path: string) => new URL(path, siteUrl).href;
  return PAGES.flatMap((path) => {
    const languages = Object.fromEntries(locales.map((l) => [l, url(localizeHref(path, l))]));
    return locales.map((lang) => ({ url: url(localizeHref(path, lang)), alternates: { languages } }));
  });
}
