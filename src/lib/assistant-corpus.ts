import "server-only";
import { resolveContent } from "@/i18n/content";
import { localizeHref, type Lang } from "@/i18n/config";

/**
 * Retrieval for the website assistant.
 *
 * Every passage the site publishes — each page's copy, every trustee's full
 * profile, each site, each recorded voice's transcript — is cut into short
 * passages, in all three editions, straight from the same content the pages
 * render. For each question the passages that best match it are found
 * (BM25 over words, so names, places and figures match exactly) and only
 * those are handed to the model with the instruction to answer from them.
 * The answer therefore says what the site says; and because only the
 * relevant passages travel with each question, the whole site can be
 * searched without breaking the API's per-minute token budget.
 */

export type Passage = { id: string; title: string; page: string; href: string; text: string; lang: Lang };

/** Which page each content module is published on. */
const PAGES: Record<string, { path: string; page: string }> = {
  shared: { path: "/", page: "Home" },
  home: { path: "/", page: "Home" },
  about: { path: "/about", page: "About" },
  conservation: { path: "/manuscript-conservation", page: "Manuscript Conservation" },
  rural: { path: "/rural-infrastructure", page: "Rural Infrastructure" },
  community: { path: "/community-services", page: "Community Services" },
  impact: { path: "/impact", page: "Impact" },
  trustees: { path: "/trustees", page: "Trustees" },
};

/** Keys that hold files, links and layout, not words a reader sees. */
const SKIP = new Set([
  "src", "image", "images", "href", "position", "ratio", "poster", "captions", "youtubeId", "key",
  "width", "height", "lang", "slug", "state", "start", "end", "display", "span", "dir", "titleLang",
  "highest", "alt", "video",
]);
/** A list whose entries each deserve their own passage: they are named. */
const NAME_KEYS = ["name", "title", "heading", "label", "kind"] as const;
const MAX_CHARS = 900;

/**
 * The words in a value. Fields are labelled ("quote: …", "role: …") so the
 * model can tell a person's own words from a caption or a job title.
 */
function strings(value: unknown, out: string[], label?: string) {
  const tag = (t: string) => (label && !NAME_KEYS.includes(label as (typeof NAME_KEYS)[number]) ? `${label}: ${t}` : t);
  if (typeof value === "string") {
    if (value.trim()) out.push(tag(value.trim()));
  } else if (typeof value === "number") {
    out.push(tag(String(value)));
  } else if (Array.isArray(value)) {
    for (const v of value) strings(v, out, label);
  } else if (value && typeof value === "object") {
    for (const [k, v] of Object.entries(value)) if (!SKIP.has(k)) strings(v, out, k);
  }
}

function nameOf(value: unknown): string | null {
  if (!value || typeof value !== "object") return null;
  for (const k of NAME_KEYS) {
    const v = (value as Record<string, unknown>)[k];
    if (typeof v === "string" && v.trim()) return v.trim();
  }
  return null;
}

/** Split long text on sentence ends into passages of at most MAX_CHARS. */
function split(text: string): string[] {
  if (text.length <= MAX_CHARS) return [text];
  const sentences = text.split(/(?<=[.!?।॥])\s+/);
  const out: string[] = [];
  let cur = "";
  for (const s of sentences) {
    if (cur && cur.length + s.length + 1 > MAX_CHARS) {
      out.push(cur);
      cur = "";
    }
    cur = cur ? `${cur} ${s}` : s;
  }
  if (cur) out.push(cur);
  return out;
}

function build(lang: Lang): Passage[] {
  const content = resolveContent(lang) as unknown as Record<string, Record<string, unknown>>;
  const passages: Passage[] = [];
  const push = (module: string, section: string, title: string, text: string) => {
    const { path, page } = PAGES[module];
    split(text).forEach((t, i) =>
      passages.push({
        id: `${lang}:${module}.${section}:${passages.length}:${i}`,
        title,
        page,
        href: localizeHref(path, lang),
        text: t,
        lang,
      }),
    );
  };

  for (const [module, exports] of Object.entries(content)) {
    if (!(module in PAGES) || !exports || typeof exports !== "object") continue;
    for (const [section, value] of Object.entries(exports)) {
      if (SKIP.has(section) || typeof value === "function") continue;
      const sectionTitle = nameOf(value) ?? section;

      // Named entries (trustees, sites, voices, projects…) become passages
      // of their own; whatever else the section says becomes one passage.
      const rest: string[] = [];
      const visit = (v: unknown, parentTitle: string) => {
        if (Array.isArray(v) && v.length > 0 && v.every((x) => nameOf(x))) {
          for (const item of v) {
            const out: string[] = [];
            strings(item, out);
            push(module, section, `${parentTitle} — ${nameOf(item)}`, out.join(" "));
          }
        } else if (v && typeof v === "object" && !Array.isArray(v)) {
          for (const [k, child] of Object.entries(v)) if (!SKIP.has(k)) visit(child, parentTitle);
        } else {
          strings(v, rest);
        }
      };
      visit(value, sectionTitle);
      if (rest.length) push(module, section, sectionTitle, rest.join(" "));
    }
  }
  return passages;
}

// ------------------------------------------------------------------ BM25

// Question words and particles, in the three editions' languages.
const STOP = new Set(
  "में का की के है हैं हुआ हुई हुए था थी क्या कौन कितना कितनी कितने कैसे कहाँ कब और से को पर भी यह वह इस उस आप हम मैं जो ಏನು ಯಾರು ಎಷ್ಟು ಹೇಗೆ ಎಲ್ಲಿ ಯಾವಾಗ ಮತ್ತು ಈ ಆ ಅವರು ನೀವು ನಾವು ಇದೆ ಇವೆ ಆಗಿದೆ a an the of and or to in on at for by with from is are was were be been it its this that these those as who what which when where how why do does did can could will would should about into than then there their his her he she they them you your we our us i me my not no any all some more most very also just only has have had".split(
    " ",
  ),
);

function tokens(text: string): string[] {
  return text
    .toLowerCase()
    .normalize("NFC")
    .split(/[^\p{L}\p{M}\p{N}]+/u)
    .filter((t) => t.length > 1 && !STOP.has(t));
}

type Index = { passages: Passage[]; tf: Map<string, number>[]; len: number[]; df: Map<string, number>; avg: number; vocab: string[] };

function index(passages: Passage[]): Index {
  const tf = passages.map((p) => {
    const m = new Map<string, number>();
    for (const t of tokens(`${p.title} ${p.text}`)) m.set(t, (m.get(t) ?? 0) + 1);
    return m;
  });
  const df = new Map<string, number>();
  for (const m of tf) for (const t of m.keys()) df.set(t, (df.get(t) ?? 0) + 1);
  const len = tf.map((m) => [...m.values()].reduce((a, b) => a + b, 0));
  const avg = len.reduce((a, b) => a + b, 0) / Math.max(1, len.length);
  return { passages, tf, len, df, avg, vocab: [...df.keys()] };
}

const cache = new Map<Lang, Index>();
function indexFor(lang: Lang): Index {
  let idx = cache.get(lang);
  if (!idx) {
    // Translated editions also search the English source, so a question
    // typed in English (or a name in Latin letters) still finds its passage.
    const passages = lang === "en" ? build("en") : [...build(lang), ...build("en")];
    idx = index(passages);
    cache.set(lang, idx);
  }
  return idx;
}

function score(idx: Index, query: { term: string; w: number }[], i: number): number {
  const k1 = 1.4;
  const b = 0.75;
  const N = idx.passages.length;
  let s = 0;
  for (const { term: q, w } of query) {
    const f = idx.tf[i].get(q);
    if (!f) continue;
    const n = idx.df.get(q) ?? 0;
    const idf = Math.log(1 + (N - n + 0.5) / (n + 0.5));
    s += w * idf * ((f * (k1 + 1)) / (f + k1 * (1 - b + (b * idx.len[i]) / idx.avg)));
  }
  return s;
}

/** Rough token cost: Indic scripts take more tokens per character. */
function cost(text: string): number {
  const indic = (text.match(/[ऀ-෿]/g) ?? []).length;
  return Math.ceil((text.length - indic) / 4 + indic / 2);
}

/**
 * A query word, plus the indexed words that share its stem. Kannada and
 * Hindi attach case endings to the word itself (ಶ್ರವಣಬೆಳಗೊಳದಲ್ಲಿ, "at
 * Shravanabelagola"), and English has plurals, so a word also matches any
 * indexed word sharing its stem (blessed ~ blessing); the variants share half weight.
 */
/** Two words share a stem when they share a beginning of all but their last three letters. */
function sameStem(a: string, b: string): boolean {
  const need = Math.max(4, Math.min(a.length, b.length) - 3);
  if (a.length < need || b.length < need) return false;
  for (let i = 0; i < need; i++) if (a[i] !== b[i]) return false;
  return true;
}

function expand(idx: Index, q: string[]): { term: string; w: number }[] {
  const out = new Map<string, number>();
  for (const t of q) {
    out.set(t, 1);
    if (t.length < 4) continue;
    const variants = idx.vocab.filter((v) => v !== t && sameStem(v, t)).slice(0, 6);
    // The variants share half a word's weight, so a common word with many
    // forms cannot outweigh a rare name asked about in the same question.
    for (const v of variants) if (!out.has(v)) out.set(v, 0.5 / variants.length);
  }
  return [...out].map(([term, w]) => ({ term, w }));
}

/**
 * The passages that best answer `question`, within a token budget. The
 * previous question is folded in at lower weight, so a follow-up such as
 * "and who is the secretary?" still finds its subject.
 */
export function retrieve(lang: Lang, question: string, previous = "", budget = 2400): Passage[] {
  const idx = indexFor(lang);
  const asked = tokens(question);
  const q = expand(idx, asked);
  const p = expand(idx, tokens(previous).filter((t) => !asked.includes(t)));
  const ranked = idx.passages
    .map((_, i) => ({ i, s: score(idx, q, i) + 0.35 * score(idx, p, i) }))
    .filter((r) => r.s > 0)
    .sort((a, b) => b.s - a.s);

  const out: Passage[] = [];
  const seen = new Set<string>();
  let spent = 0;
  for (const { i } of ranked) {
    const passage = idx.passages[i];
    const key = passage.text.slice(0, 80);
    if (seen.has(key)) continue;
    const c = cost(passage.text) + 20;
    if (spent + c > budget) {
      if (out.length >= 3) break;
      continue;
    }
    out.push(passage);
    seen.add(key);
    spent += c;
    if (out.length >= 10) break;
  }
  return out;
}

/** Every passage in an edition — for inspecting what the assistant knows. */
export function corpus(lang: Lang): Passage[] {
  return indexFor(lang).passages;
}

