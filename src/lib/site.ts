/**
 * Where the site lives, and whether search engines may index it.
 *
 * The address comes from Vercel: `VERCEL_PROJECT_PRODUCTION_URL` is the
 * project's production domain — the Foundation's own domain once one is
 * attached, `assf-website.vercel.app` until then. `NEXT_PUBLIC_SITE_URL`
 * overrides it (e.g. to prefer `www.` when both are attached).
 *
 * The site is indexed only on a real domain in production. While it is
 * reviewed on `*.vercel.app` — and on every preview deployment — every
 * response carries `X-Robots-Tag: noindex`, so no draft address or copy
 * ends up in search results. Attaching the domain and redeploying is the
 * whole switch; nothing in the code changes.
 */
const fromVercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;

export const siteUrl = new URL(
  process.env.NEXT_PUBLIC_SITE_URL ?? (fromVercel ? `https://${fromVercel}` : "http://localhost:3000"),
);

export const indexable =
  process.env.VERCEL_ENV === "production" && !siteUrl.hostname.endsWith(".vercel.app") && siteUrl.hostname !== "localhost";
