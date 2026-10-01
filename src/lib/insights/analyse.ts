import "server-only";
import { readSealed, updateSealed } from "@/lib/data/sealed";
import type { Asked } from "./questions";

/**
 * Insights: what the visitors' questions add up to. The counts are counted,
 * never estimated. The themes are grouped by the same Groq model the
 * assistant uses, which is told to say what's missing from the site, never
 * what the answer is — so it can't invent the Foundation's facts.
 */
export type Theme = {
  title: string;
  /** The questions in it, as written. */
  questions: { q: string; lang: string; at: string }[];
  covered: "yes" | "partly" | "no";
  note: string;
  /** The pages the assistant drew on for these questions. */
  pages: string[];
};
export type Analysis = { at: string; days: number; count: number; themes: Theme[] };

export type Summary = {
  total: number;
  byLang: Record<string, number>;
  spoken: number;
  deflected: number;
  pages: { page: string; count: number }[];
  /** Questions a day, oldest first, for the last `days` days. */
  perDay: { day: string; count: number }[];
};

const FILE = "insights/analysis.enc.json";
const GROQ_ENDPOINT = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "openai/gpt-oss-120b";
/** Kept inside the API key's minute budget, with room for the reply. */
const MAX_CHARS = 8000;

export function summarise(asked: readonly Asked[], days: number): Summary {
  const byLang: Record<string, number> = { en: 0, hi: 0, kn: 0 };
  const pages = new Map<string, number>();
  const perDay = new Map<string, number>();
  for (let i = days - 1; i >= 0; i--) perDay.set(new Date(Date.now() - i * 86_400_000).toISOString().slice(0, 10), 0);
  for (const a of asked) {
    byLang[a.lang] = (byLang[a.lang] ?? 0) + 1;
    const page = (a.page ?? "/").replace(/^\/(hi|kn)(?=\/|$)/, "") || "/";
    pages.set(page, (pages.get(page) ?? 0) + 1);
    const d = a.at.slice(0, 10);
    if (perDay.has(d)) perDay.set(d, perDay.get(d)! + 1);
  }
  return {
    total: asked.length,
    byLang,
    spoken: asked.filter((a) => a.spoken).length,
    deflected: asked.filter((a) => a.deflected).length,
    pages: [...pages].map(([page, count]) => ({ page, count })).sort((a, b) => b.count - a.count).slice(0, 6),
    perDay: [...perDay].map(([day, count]) => ({ day, count })),
  };
}

export function readAnalysis(): Promise<Analysis | null> {
  return readSealed<Analysis | null>(FILE, null);
}

const SYSTEM = `You help Acharya Shanti Sagar Foundation (a Jain charitable trust in Bengaluru that conserves palm-leaf manuscripts and serves rural communities) understand what visitors ask its website's AI assistant.

You are given visitors' questions, numbered, in English, Hindi or Kannada. Each is marked with what happened: [answered] — the assistant answered it from the website; [sent away] — the assistant pointed the visitor to the Foundation's email or phone instead, which means the website doesn't say.

Group the questions into at most 8 themes by what the visitor wants to know, largest first. For each theme:
- "title": 2 to 6 plain English words, e.g. "Volunteering at a survey"
- "ids": the numbers of its questions
- "covered": "yes" if its questions were [answered], "no" if they were [sent away], "partly" if some of each
- "note": one or two short sentences for the Foundation's team, in plain English: what visitors want to know, and — if "partly" or "no" — what the website could add. Never state facts, figures, names, dates or prices yourself: say what is missing, not what the answer is.

Put greetings, tests and nonsense in "ignored". Reply with JSON only: {"themes":[{"title":"…","ids":[1,2],"covered":"no","note":"…"}],"ignored":[3]}`;

export class InsightsError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
  }
}

/** Groups the questions into themes and keeps the result. */
export async function analyse(asked: readonly Asked[], days: number): Promise<Analysis> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new InsightsError("The AI isn't available.", 503);

  // Each distinct question once, newest first, within the budget.
  const seen = new Set<string>();
  const picked: Asked[] = [];
  let chars = 0;
  for (const a of asked) {
    const k = a.q.toLowerCase().replace(/\s+/g, " ").trim();
    if (!k || seen.has(k)) continue;
    const line = a.q.slice(0, 160);
    if (chars + line.length > MAX_CHARS) break;
    seen.add(k);
    picked.push(a);
    chars += line.length + 12;
  }
  if (!picked.length) {
    const empty: Analysis = { at: new Date().toISOString(), days, count: 0, themes: [] };
    return empty;
  }

  const list = picked.map((a, i) => `${i + 1}. ${a.deflected ? "[sent away]" : "[answered]"} ${a.q.slice(0, 160).replace(/\s+/g, " ")}`).join("\n");
  const res = await fetch(GROQ_ENDPOINT, {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: MODEL,
      temperature: 0,
      reasoning_effort: "low",
      max_tokens: 2500,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: SYSTEM },
        { role: "user", content: list },
      ],
    }),
  }).catch(() => null);
  if (!res?.ok) {
    if (res?.status === 429) throw new InsightsError("The AI is busy — try again in a minute.", 429);
    throw new InsightsError("The AI isn't available right now.", 502);
  }
  let parsed: { themes?: { title?: unknown; ids?: unknown; covered?: unknown; note?: unknown }[] };
  try {
    const data = (await res.json()) as { choices?: { message?: { content?: string } }[] };
    parsed = JSON.parse(data.choices?.[0]?.message?.content ?? "{}");
  } catch {
    throw new InsightsError("The AI's answer came back garbled — try again.", 502);
  }

  const themes: Theme[] = [];
  for (const t of Array.isArray(parsed.themes) ? parsed.themes : []) {
    const ids = (Array.isArray(t.ids) ? t.ids : []).filter((i): i is number => Number.isInteger(i) && i >= 1 && i <= picked.length);
    if (typeof t.title !== "string" || !ids.length) continue;
    const members = [...new Set(ids)].map((i) => picked[i - 1]);
    themes.push({
      title: t.title.slice(0, 80),
      questions: members.map((a) => ({ q: a.q, lang: a.lang, at: a.at })),
      // Counted, not judged: what the assistant actually did with these questions.
      covered: members.every((a) => !a.deflected) ? "yes" : members.every((a) => a.deflected) ? "no" : "partly",
      note: typeof t.note === "string" ? t.note.slice(0, 400) : "",
      pages: [...new Set(members.flatMap((a) => a.sources))].slice(0, 4),
    });
  }
  themes.sort((a, b) => b.questions.length - a.questions.length);
  const analysis: Analysis = { at: new Date().toISOString(), days, count: picked.length, themes: themes.slice(0, 8) };
  await updateSealed<Analysis | null>(FILE, null, () => analysis, "Insights: grouped visitor questions");
  return analysis;
}
