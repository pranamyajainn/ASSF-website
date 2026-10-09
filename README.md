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
| `SMTP_USER`, `SMTP_PASS` | Email updates: the Foundation's Gmail / Google Workspace address and a 16-letter **app password** for it (Google Account → Security → 2-Step Verification → App passwords). Optional: `MAIL_FROM_NAME`, `SMTP_HOST`/`SMTP_PORT` for another provider, `SMTP_DAILY_LIMIT`. |
| `MAIL_DATA_KEY` | Optional. Encrypts the mailing list; defaults to a key derived from `AUTH_SECRET`. Set it to the old `AUTH_SECRET` before rotating that secret, or the list becomes unreadable. |
| `CRON_SECRET` | The daily job (`/api/cron/daily`, `vercel.json` → `crons`): Vercel sends it, and the job refuses calls without it. Any long random string. |
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
sign-in are allowed off-site), frame, referrer and permissions headers (the microphone only for
the site itself, for spoken questions). The assistant accepts requests only from the site's own
pages, caps request size, and rate-limits each visitor.

**Voice.** Visitors can ask the assistant out loud: the recording goes to Whisper on Groq
(`/api/chat/voice`, the same `GROQ_API_KEY`), comes back as text in the edition's script, and is
answered like a typed question, then read aloud. Recordings aren't kept; quiet recordings and
Whisper's guesses at silence are discarded. "Listen" in the masthead reads any page aloud with the
device's own Hindi, Kannada or English voice (`src/lib/speech.ts`), marking each passage — offered
only where the device has a voice for that language. A link ending in `#ask` opens the site with
the assistant ready (the QR cards use it).

**Visitor questions.** Each question and answer is kept — not who asked, and visitors are told so
under the assistant — one encrypted line per question in a day file under `questions/` on the
`cms-data` branch (`src/lib/insights/questions.ts`), for the editor's **Insights**. The daily job
removes them after a year.

**Online giving (`/donate`).** Gifts go to the Foundation's **Apna Dharm** account (its
donation system — an ERP for trusts) and are paid on **NTT DATA Payment Services'** checkout
(formerly Atom). The page is the site's own, in three languages: the gift's category (Apna
Dharm's, fetched and translated by `/api/donate/categories`), the donor's details, then Apna
Dharm's script (`payment-sdk-1.0.8.js`, loaded only on Pay) creates the order and replaces the
page with the checkout. The bank reports to Apna Dharm, which keeps the donor record and is the
record of every gift; the donor returns to `/donate/thank-you?txn=…`, which reads the bank's
status code (`OTS0000` = paid) rather than trusting the script, and reports the outcome — without
the donor's details — for the editor's **Insights → Online gifts**. A donor who ticks "email
updates" joins the newsletter list (after a completed gift only).

- The account: `NEXT_PUBLIC_APNADHARM_VENDOR_ID` and `NEXT_PUBLIC_APNADHARM_TRUST_ID` (defaults in
  `src/lib/donate/config.ts`). Categories, amounts and receipts are managed in Apna Dharm's portal;
  the page shows changes within five minutes.
- **Apna Dharm serves its script only to approved sites** — the Foundation's domain and
  `localhost:3000` (it answers others "CORS: Host not allowed"). On the `vercel.app` review
  address the form shows but says payment opens on the Foundation's domain
  (`PAYMENT_READY_HOSTS`; more via `NEXT_PUBLIC_DONATE_HOSTS` once Apna Dharm approves them).
  For local work, run `next dev -p 3000`.
- Only the donate page may load Apna Dharm's and NTT DATA's scripts and frames (its own
  Content-Security-Policy in `next.config.ts`). Nothing the donor types is stored in the browser
  (Apna Dharm's own form keeps it all, PAN included); the tab keeps only the amount and outcome.
- Apna Dharm's script listens for the checkout's answer only once, so an earlier message can
  leave a paid donor on "Please wait…"; `followCheckout` (`src/lib/donate/checkout.ts`) listens
  too and takes them to the thank-you page.
- The earlier site's `/donation.html` and `/success.php` redirect to `/donate` and its thank-you page.

**Daily job.** `/api/cron/daily`, about 6 a.m. India time: publishes scheduled changes and sends
scheduled emails that are due (`src/lib/cms/schedule.ts`), and prunes old visitor questions.
Locally, `curl "localhost:3000/api/cron/daily?now=2026-10-05"` runs it as of that morning.

**Site watch.** `.github/workflows/site-watch.yml` opens the main pages, the editor sign-in and
the connector metadata every half hour; if any fails twice it opens a `site-down` issue (GitHub
emails the watchers) and closes it when the site answers again. Set the repository variable
`SITE_URL` to watch another address.

## Site editor (`/editor`)

The Foundation edits the site itself at `/editor`: every page's words in English, हिन्दी and
ಕನ್ನಡ side by side, figures, prices and contact details, photographs, news entries, trustees and
advisors. Editors sign in with Google (`EDITOR_EMAILS`); changes stay in their browser until they
press **Publish**, which commits `src/content/edits.json` (and any new photos under
`public/images/uploads/`) to `main`. Vercel deploys it like any other commit, so the site
updates in a minute or two, and **History** can restore any earlier publish.

On a computer the editor is the site itself: pages open on the left (served by `/preview/…`,
signed-in editors only), anything on them can be clicked, and the right-hand panel shows just
that thing — a trustee, a photo, a figure — with changes showing on the page as they're typed.
Editing is one language at a time; after changing English, **Translate for me** fills the
Hindi and Kannada by machine translation (`/api/cms/translate`, the assistant's Groq model) for
review. On a phone, or via "All content as a list", the same content is a list of pages and parts.

How it fits the code:

- The TypeScript content (`src/content/*.ts`, `src/i18n/{hi,kn}.ts`) stays the source. The
  editor's changes are a layer on top — `edits.json` — applied when each edition is built
  (`src/i18n/content.ts`, `src/lib/cms/edits.ts`). Edits whose path no longer exists, or whose
  value no longer fits, are skipped, never crash a page.
- The editor reads the content's own shape; `src/lib/cms/schema.ts` only says what is wiring
  (hidden), which lists can grow (news, trustees, photo albums…), and plain names for fields.
- Every publish is validated on the server (`src/lib/cms/validate.ts`): existing paths only,
  the same kind of value, no wiring changed, photos from the site or this upload.
- The preview tags every piece of text with its field using invisible characters
  (`src/lib/cms/stega.ts`) — only on `/preview`, never on the public pages — which is how a
  click on the page finds its field.
- Photos are resized to 2,000 px and re-encoded as JPEG in the browser, which strips GPS and
  camera metadata before upload.
- **Publish on a later day:** Review & publish can pick a day. The change is kept (encrypted, its
  new photos held on `cms-data` so GitHub keeps them) and the daily job publishes it that
  morning, after checking it again against the site as it is then. History lists what's coming
  up, with Cancel.

**Insights** (top bar): *Visitors' questions* counts what visitors asked (by language, spoken or
typed, from which page, and how many the assistant had to send to the Foundation's email or phone
because the site doesn't say), and **Group the questions** has the AI sort them into themes with
what the site could add — the "answered / not on the site" mark is counted from what the
assistant actually did, not judged. *Site check* (`src/components/editor/health.ts`) lists Hindi
or Kannada left behind when the English was changed, editions falling back to English, photos
without a description, links and photos that don't open (checked live; other websites via
`/api/cms/links`), and facts still "awaiting Foundation" — each with a **Fix** that opens the
field.

**More** (top bar): **Print QR cards** (`/editor/qr`) — A6 table cards or A4 posters for a page or
the assistant, in one language or all three side by side; **Download a backup**
(`/api/cms/backup`) — a zip of the published site in all three languages, the editor's changes,
the mailing list and sent log as spreadsheets, and the visitor questions.

### AI connector (MCP) — `/api/mcp`

Claude, ChatGPT and any MCP client can connect to the site as a **remote MCP server** at
`https://<domain>/api/mcp` (Streamable HTTP). People sign in with the same Google account and
`EDITOR_EMAILS` list as the editor, through the site's own OAuth 2.1 server (discovery at
`/.well-known/oauth-protected-resource` and `/.well-known/oauth-authorization-server`, dynamic
client registration, PKCE). Nothing is stored: client ids, codes and tokens are signed with a key
derived from `AUTH_SECRET` (`src/lib/mcp/jwt.ts`); rotating `AUTH_SECRET` disconnects every app,
and removing someone from `EDITOR_EMAILS` cuts them off on their next call. Sign-ins may only
return to claude.ai / claude.com / chatgpt.com or the person's own computer (`MCP_REDIRECT_HOSTS`
adds more).

Tools (`src/lib/mcp/tools.ts`): `get_site_overview`, `search_site`, `read_section`,
`propose_changes`, `publish_changes`, `undo_last_publish`, `translate_text`,
`get_publish_history`, `get_visitor_questions`, `check_site`. `propose_changes` checks the changes against the content (same
validation as publishing), translates English into Hindi and Kannada with the site's glossary,
and returns a summary plus a signed review link (`/editor?proposal=…`, valid 30 days).
**`publish_changes` publishes exactly that proposal — only after the person confirms in the
chat** (the tools tell the AI so, and both write tools are marked destructive, so clients ask
before running them). Each proposal publishes once (`applied` in `edits.json`), whether from a
chat or the editor; a change needing a new photo must be published from the editor.
`publish_changes` with `on_date` schedules the change for that morning instead.
`undo_last_publish` restores the version before the latest publish. The editor's "Use it from
Claude or ChatGPT" card shows people how to connect.

### Email updates (newsletters, reports to trustees)

In the editor, **✉ Email updates**: the Foundation keeps its list of people (groups: Newsletter,
Trustees), writes a subject and plain text — laid out in the site's style automatically
(`src/lib/mail/render.ts`) — optionally attaches a report (PDF/Word/photo, 3 MB), sends a test to
itself, then sends in batches of 20 through its own Gmail/Workspace account (SMTP, nodemailer).
"Share on WhatsApp" opens the same words in WhatsApp for a group; WhatsApp links can't carry files,
so an attached report travels as a short link (`/r/<12 characters>`: the file encrypted on the
`cms-data` branch, valid 90 days) that opens a small page in the Foundation's look — which WhatsApp
shows as a proper preview card — with "Open the report". (Older `/files/…` links keep working.) On phones and Safari, "Share with the file attached" hands
the file itself to WhatsApp through the device's share menu.

- The list lives **encrypted** (AES-256-GCM) in `mail.enc.json` on the `cms-data` branch, which
  holds no site and never deploys (it carries its own `vercel.json` turning deployments off — Vercel reads the one in the commit it builds) — the repository is public, and addresses must
  not be readable there. Locally, `.cms-data/` (git-ignored); without SMTP credentials `next dev`
  writes messages to `.cms-data/outbox.jsonl` instead of sending.
- Every message has a personal unsubscribe link (`/unsubscribe`) and one-click unsubscribe headers
  (`/api/unsubscribe`, RFC 8058). Someone who unsubscribes stays unsubscribed even if added again.
- Only people on the list can be sent to; Gmail allows about 500 a day, Workspace about 2,000.
- **Draft it for me** (`/api/cms/mail/draft`): an AI first draft — newsletter or trustees' update,
  in English, Hindi or Kannada — written only from the site's figures and news, what was published
  since the last email and (for trustees) the visitor-question counts. Anything only the
  Foundation knows comes back as a `[gap]`.
- **Send later**: an email can be scheduled for a day; the daily job sends it that morning to the
  list as it is then, at most 200 a run (a longer list carries on the next day). Upcoming emails
  show under Sent, with Cancel.

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
