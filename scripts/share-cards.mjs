// Renders the link-preview cards (WhatsApp, social, search) for every page in
// every edition, into public/og/<lang>/<page>.jpg at 1200×630.
//
// Each card is drawn by the site itself: the script opens the page on a
// running server, reads its own eyebrow, heading and hero photograph, and
// lays them out as a leaf beside a plate — in the page's fonts and colours,
// with Devanagari and Kannada shaped by the browser. Re-run it whenever a
// page's heading or hero photograph changes:
//
//   npm run dev                       (in another terminal)
//   node scripts/share-cards.mjs http://localhost:3000
//
// Needs Google Chrome installed (macOS path below; set CHROME to override).
import { spawn } from "node:child_process";
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const base = (process.argv[2] ?? "http://localhost:3000").replace(/\/$/, "");
const CHROME = process.env.CHROME ?? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const OUT = new URL("../public/og/", import.meta.url).pathname;

const PAGES = [
  { slug: "home", path: "/" },
  { slug: "about", path: "/about" },
  { slug: "manuscript-conservation", path: "/manuscript-conservation" },
  { slug: "rural-infrastructure", path: "/rural-infrastructure" },
  { slug: "community-services", path: "/community-services" },
  { slug: "impact", path: "/impact" },
  { slug: "trustees", path: "/trustees" },
];
const EDITIONS = { en: "", hi: "/hi", kn: "/kn" };

/** The homepage card's signature line: the brand line, as each edition gives it (content/shared.ts, i18n). */
const BRAND_LINES = {
  en: "In Service of Heritage and Humanity",
  hi: "विरासत और मानवता की सेवा में",
  kn: "ಪರಂಪರೆ ಮತ್ತು ಮಾನವತೆಯ ಸೇವೆಯಲ್ಲಿ",
};

/** The homepage has no page hero; its card names the three pillars instead. */
const HOME_PLATES = [
  { src: "/images/sites/shravanabelagola.jpeg", href: "/manuscript-conservation" },
  { src: "/images/rural/samudaya-bhavan-wide.jpg", href: "/rural-infrastructure" },
  { src: "/images/community/health-camp-team.jpg", href: "/community-services" },
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const port = 9400 + Math.floor(Math.random() * 400);
const profile = join(tmpdir(), `assf-cards-${port}`);
const chrome = spawn(
  CHROME,
  ["--headless=new", `--remote-debugging-port=${port}`, "--hide-scrollbars", "--no-first-run", `--user-data-dir=${profile}`, "about:blank"],
  { stdio: "ignore" },
);

let targets;
for (let i = 0; i < 60 && !targets; i++) {
  try {
    targets = await (await fetch(`http://127.0.0.1:${port}/json`)).json();
  } catch {
    await sleep(250);
  }
}
const ws = new WebSocket(targets.find((t) => t.type === "page").webSocketDebuggerUrl);
await new Promise((r) => (ws.onopen = r));
let seq = 0;
const pending = new Map();
ws.onmessage = (e) => {
  const m = JSON.parse(e.data);
  if (m.id && pending.has(m.id)) {
    pending.get(m.id)(m);
    pending.delete(m.id);
  }
};
const send = (method, params = {}) =>
  new Promise((r) => {
    const id = ++seq;
    pending.set(id, r);
    ws.send(JSON.stringify({ id, method, params }));
  });
const evaluate = async (expression) => {
  const r = await send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true });
  if (r.result?.exceptionDetails) throw new Error(JSON.stringify(r.result.exceptionDetails));
  return r.result?.result?.value;
};

await send("Emulation.setDeviceMetricsOverride", { width: 1200, height: 630, deviceScaleFactor: 1, mobile: false });
await send("Emulation.setEmulatedMedia", { features: [{ name: "prefers-reduced-motion", value: "reduce" }] });
await send("Page.enable");

/** Reads what the card needs from the live page, then redraws the page as the card. */
const draw = (home, homePlates) => `(async () => {
  const unlocal = (u) => { try { const p = new URL(u, location.href); return p.pathname.startsWith('/_next/image') ? decodeURIComponent(p.searchParams.get('url')) : p.pathname; } catch { return u; } };
  const title = document.title;
  const site = title.includes(' — ') ? title.split(' — ').pop() : title;
  let eyebrow, heading, plates, sign = site;
  if (${home}) {
    const nav = [...document.querySelectorAll('header a[href]')];
    const label = (href) => nav.find((a) => a.getAttribute('href').replace(/^\\/(hi|kn)(?=\\/)/, '') === href)?.innerText.trim() ?? '';
    const [name, line] = title.split(' — ');
    eyebrow = line;
    heading = name;
    sign = ${JSON.stringify(BRAND_LINES)}[document.documentElement.lang];
    plates = ${JSON.stringify(homePlates)}.map((p) => ({ src: p.src, label: label(p.href) }));
  } else {
    const top = document.querySelector('main #top');
    eyebrow = top.querySelector('p').innerText.trim();
    heading = top.querySelector('h1').innerText.replace(/\\s*॥\\s*$/, '').trim();
    const img = top.querySelector('img');
    const all = [...new Set([...document.querySelectorAll('main img')].map((i) => unlocal(i.currentSrc || i.src)))];
    plates = img ? [{ src: unlocal(img.currentSrc || img.src) }] : all.slice(0, 8).map((src) => ({ src }));
  }
  const lang = document.documentElement.lang;
  const second = lang === 'en' ? 'आचार्य शांति सागर फाउंडेशन' : 'Acharya Shanti Sagar Foundation';
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
  const script = lang === 'kn' ? 'var(--font-noto-kannada), var(--font-tiro-kannada)' : 'var(--font-eczar)';
  const text = lang === 'kn' ? 'var(--font-tiro-kannada)' : 'var(--font-tiro-deva)';
  const portraits = plates.length > 3;
  const plateHtml = portraits
    ? '<div class="c-grid">' + plates.map((p) => '<img src="' + esc(p.src) + '">').join('') + '</div>'
    : plates.length === 3
      ? '<div class="c-trio">' + plates.map((p) => '<figure><img src="' + esc(p.src) + '"><figcaption>' + esc(p.label) + '</figcaption></figure>').join('') + '</div>'
      : '<img class="c-one" src="' + esc(plates[0].src) + '">';
  document.querySelector('.c-card')?.remove();
  document.body.insertAdjacentHTML('beforeend', \`
    <style>
      html, body { margin: 0; background: #17110c; overflow: hidden; }
      body > *:not(.c-card) { visibility: hidden !important; }
      .c { visibility: visible; position: fixed; inset: 0; width: 1200px; height: 630px; display: grid; grid-template-columns: 660px 1fr; background: #17110c; overflow: hidden; }
      .c-leaf { position: relative; margin: 34px 0 34px 34px; padding: 54px 54px 44px 92px; display: flex; flex-direction: column;
        background: #f0e7d0; border-radius: 22px 6px 6px 22px;
        background-image: repeating-linear-gradient(0deg, transparent 0 7px, rgb(205 187 143 / .22) 7px 8px);
        box-shadow: inset 0 0 0 1px rgb(29 24 18 / .08), inset -18px 0 30px -18px rgb(118 92 50 / .35); }
      .c-leaf::before { content: ''; position: absolute; left: 62px; top: 0; bottom: 0; width: 2px; background: #a82e17; opacity: .75; }
      .c-hole { position: absolute; left: 22px; top: 50%; width: 18px; height: 18px; margin-top: -9px; border-radius: 50%; background: #17110c; box-shadow: inset 0 0 0 3px #cdbb8f; }
      .c-eyebrow { font-family: var(--font-courier), \${text}, monospace; font-size: 22px; letter-spacing: .02em; color: #a82e17; margin: 0; }
      .c-title { font-family: \${script}; font-weight: 500; color: #1d1812; margin: 22px 0 0; font-size: \${heading.length > 42 ? 56 : heading.length > 28 ? 64 : 74}px; line-height: 1.06; letter-spacing: -.012em; text-wrap: balance; }
      .c-title span { color: #a82e17; }
      .c-sig { margin-top: auto; display: flex; align-items: center; gap: 18px; padding-top: 22px; border-top: 1px solid rgb(29 24 18 / .16); }
      .c-sig img { width: 58px; height: 58px; }
      .c-sig b { display: block; font-family: \${script}; font-weight: 500; font-size: 25px; color: #1d1812; line-height: 1.2; }
      .c-sig i { display: block; font-style: normal; font-family: var(--font-eczar), \${text}; font-size: 19px; color: #5f5443; margin-top: 3px; }
      .c-plate { position: relative; margin: 34px 34px 34px 22px; overflow: hidden; border-radius: 4px; background: #241b14; }
      .c-one { width: 100%; height: 100%; object-fit: cover; display: block; }
      .c-trio { display: grid; grid-template-rows: repeat(3, 1fr); gap: 10px; height: 100%; }
      .c-trio figure { position: relative; margin: 0; overflow: hidden; }
      .c-trio img { width: 100%; height: 100%; object-fit: cover; display: block; }
      .c-trio figcaption { position: absolute; left: 0; bottom: 0; padding: 7px 14px; background: rgb(23 17 12 / .82); color: #eadfc6; font-family: \${script}; font-size: 21px; }
      .c-grid { display: grid; grid-template-columns: repeat(4, 1fr); grid-template-rows: repeat(2, 1fr); gap: 8px; height: 100%; }
      .c-grid img { width: 100%; height: 100%; object-fit: cover; object-position: 50% 22%; display: block; filter: sepia(.12); }
    </style>
    <div class="c c-card">
      <div class="c-leaf">
        <span class="c-hole"></span>
        <p class="c-eyebrow">\${esc(eyebrow)}</p>
        <h1 class="c-title">\${esc(heading)}<span> ॥</span></h1>
        <div class="c-sig"><img src="/icon.png" alt=""><div><b>\${esc(sign)}</b><i>\${esc(second)}</i></div></div>
      </div>
      <div class="c-plate">\${plateHtml}</div>
    </div>\`);
  window.scrollTo(0, 0);
  const loaded = Promise.all([...document.querySelectorAll('.c-card img')].map((i) => i.complete ? 0 : new Promise((r) => { i.onload = i.onerror = r; })));
  await Promise.race([Promise.all([loaded, document.fonts.ready]), new Promise((r) => setTimeout(r, 10000))]);
  // The development server's own badge, if the cards are drawn from \`next dev\`.
  document.querySelectorAll('nextjs-portal').forEach((n) => n.remove());
  // Long headings (Kannada runs wide) step down until the leaf holds them.
  const leaf = document.querySelector('.c-card .c-leaf');
  const h = leaf.querySelector('.c-title');
  for (let size = parseFloat(getComputedStyle(h).fontSize); leaf.scrollHeight > leaf.clientHeight + 1 && size > 40; size -= 2) h.style.fontSize = size - 2 + 'px';
  return { eyebrow, heading, plates: plates.length };
})()`;

try {
  for (const [lang, prefix] of Object.entries(EDITIONS)) {
    mkdirSync(join(OUT, lang), { recursive: true });
    for (const page of PAGES) {
      const url = base + (prefix + (page.path === "/" ? "" : page.path) || "/");
      await send("Page.navigate", { url });
      await sleep(3500);
      const info = await evaluate(draw(page.slug === "home", HOME_PLATES));
      await sleep(600);
      const shot = await send("Page.captureScreenshot", {
        format: "jpeg",
        quality: 84,
        clip: { x: 0, y: 0, width: 1200, height: 630, scale: 1 },
      });
      const file = join(OUT, lang, `${page.slug}.jpg`);
      writeFileSync(file, Buffer.from(shot.result.data, "base64"));
      console.log(`${lang}/${page.slug}.jpg  ${info.eyebrow} — ${info.heading} (${info.plates} plate${info.plates === 1 ? "" : "s"})`);
    }
  }
} finally {
  chrome.kill();
  rmSync(profile, { recursive: true, force: true });
}
process.exit(0);
