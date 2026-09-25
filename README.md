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
| `EDITOR_EMAILS` | The site editor: Google accounts allowed to edit, comma-separated. |
| `CMS_GITHUB_TOKEN` | The site editor: a fine-grained GitHub token for this repository only, with **Contents: Read and write**. Publishing commits with it. |
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

## Site editor (`/editor`)

The Foundation edits the site itself at `/editor`: every page's words in English, हिन्दी and
ಕನ್ನಡ side by side, figures, prices and contact details, photographs, news entries, trustees and
advisors. Editors sign in with Google (`EDITOR_EMAILS`); changes stay in their browser until they
press **Publish**, which commits `src/content/edits.json` (and any new photos under
`public/images/uploads/`) to `main`. Vercel deploys it like any other commit, so the site
updates in a minute or two, and **History** can restore any earlier publish.

How it fits the code:

- The TypeScript content (`src/content/*.ts`, `src/i18n/{hi,kn}.ts`) stays the source. The
  editor's changes are a layer on top — `edits.json` — applied when each edition is built
  (`src/i18n/content.ts`, `src/lib/cms/edits.ts`). Edits whose path no longer exists, or whose
  value no longer fits, are skipped, never crash a page.
- The editor reads the content's own shape; `src/lib/cms/schema.ts` only says what is wiring
  (hidden), which lists can grow (news, trustees, photo albums…), and plain names for fields.
- Every publish is validated on the server (`src/lib/cms/validate.ts`): existing paths only,
  the same kind of value, no wiring changed, photos from the site or this upload.
- Photos are resized to 2,000 px and re-encoded as JPEG in the browser, which strips GPS and
  camera metadata before upload.

**Before pushing code:** the editor commits to `main` too — `git pull --rebase` first. If a
content change moves or renames something the Foundation has edited, check `edits.json`.

**Working on the editor locally:** add `CMS_DEV_EDITOR=you@example.com` to
`.env.development.local`. `next dev` then skips sign-in and publishes to your working tree
instead of GitHub. (It is ignored by production builds.)

## Design source

The page design lives in the Claude Design project above
(`Shanti Sagar Home.dc.html`, plus the `support.js` it imports). Reading it
requires design-system authorization — run `/design-login` once from an
interactive Claude Code session on this machine before importing updates.
