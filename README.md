# ASSF Website

Website for ASSF, implemented from the Claude Design project
[`Shanti Sagar Home`](https://claude.ai/design/p/9646caf9-1d4c-4625-b7e3-e029b0dcfe30).

## Stack

- [Next.js](https://nextjs.org) 16 (App Router, Turbopack)
- React 19 + TypeScript (strict)
- Tailwind CSS v4 (via `@tailwindcss/postcss`, tokens declared in `src/app/globals.css`)

## Getting started

```bash
npm install
npm run dev     # http://localhost:3000
```

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run lint` | Lint with ESLint |

## Layout

```
src/app/         App Router routes, layouts, 404/error pages, robots, sitemap, manifest
src/content/     The English source of every page's words and figures
src/i18n/        Hindi and Kannada editions, overlaid on the English source
public/          Photographs, films, share cards (public/og)
scripts/         share-cards.mjs — redraws the link-preview cards
```

## Production

Pushing `main` deploys to Vercel (project `assf-website`).

**Environment variables** (Vercel → Settings → Environment Variables, Production):

| Variable | Needed for |
| --- | --- |
| `GROQ_API_KEY` | The website assistant (`/api/chat`). Without it the assistant says it isn't configured. |
| `AUTH_SECRET` | The trustee portal's sessions (`npx auth secret` generates one). |
| `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET` | The trustee portal's Google sign-in. Authorised redirect URI in Google Cloud: `https://<domain>/api/auth/callback/google`. |
| `NEXT_PUBLIC_SITE_URL` | Optional. Only if the canonical address should differ from Vercel's production domain (e.g. to prefer `https://www.…`). |

**Indexing.** The site tells search engines to stay away (`X-Robots-Tag: noindex`) everywhere
except production on a real domain — so the `*.vercel.app` review address and previews never
show up in results. Attaching the Foundation's domain in Vercel and redeploying is the whole
switch: canonical URLs, hreflang, the sitemap, `robots.txt` and the share cards all follow
`VERCEL_PROJECT_PRODUCTION_URL` (see `src/lib/site.ts`). Then submit
`https://<domain>/sitemap.xml` in Google Search Console.

**Share cards.** Each page has a 1200×630 preview card per edition in `public/og/`, drawn from
the page itself. After changing a page's heading or hero photograph, redraw them:

```bash
npm run dev
node scripts/share-cards.mjs http://localhost:3000
```

**Security.** `next.config.ts` sets a Content-Security-Policy (only the YouTube film and Google
sign-in are allowed off-site), frame, referrer and permissions headers. The assistant accepts
requests only from the site's own pages, caps request size, and rate-limits each visitor.

## Design source

The page design lives in the Claude Design project above
(`Shanti Sagar Home.dc.html`, plus the `support.js` it imports). Reading it
requires design-system authorization — run `/design-login` once from an
interactive Claude Code session on this machine before importing updates.
