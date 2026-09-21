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
src/app/         App Router routes, layout, and global styles
public/          Static assets
```

## Design source

The page design lives in the Claude Design project above
(`Shanti Sagar Home.dc.html`, plus the `support.js` it imports). Reading it
requires design-system authorization — run `/design-login` once from an
interactive Claude Code session on this machine before importing updates.
