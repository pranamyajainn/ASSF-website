import type { MetadataRoute } from "next";
import { indexable, siteUrl } from "@/lib/site";

/**
 * On the Foundation's own domain: everything public is open to crawl, the
 * trustee portal and the API are not, and the sitemap is announced.
 *
 * Anywhere else (the review address on vercel.app, previews) crawling stays
 * allowed on purpose — the pages there carry `noindex`, and a crawler has
 * to be able to read a page to see that it must not index it.
 */
export default function robots(): MetadataRoute.Robots {
  if (!indexable) return { rules: { userAgent: "*", allow: "/" } };
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/", "/trustee-portal"] },
    sitemap: new URL("/sitemap.xml", siteUrl).href,
    host: siteUrl.origin,
  };
}
