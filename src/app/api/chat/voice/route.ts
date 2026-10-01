import { isLang } from "@/i18n/config";
import { clientKey, overLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

/**
 * A spoken question, written down: the visitor's recording goes to Whisper
 * (on Groq, like the assistant) and comes back as text in the edition's
 * script, which the assistant then answers like any typed question. The
 * recording itself is not kept.
 */
const ENDPOINT = "https://api.groq.com/openai/v1/audio/transcriptions";
const MODEL = "whisper-large-v3-turbo";
/** About two minutes of speech in any browser's recording format — a question is far shorter. */
const MAX_BYTES = 3 * 1024 * 1024;
const TYPES = /^audio\/(webm|ogg|mp4|mpeg|mp3|wav|x-wav|x-m4a|aac)(;.*)?$/;

/**
 * Words the Foundation's visitors say, in each script, so Whisper spells
 * them as the site does. Kept short: Whisper sometimes returns its prompt
 * for a silent recording, which the check below catches.
 */
const VOCABULARY: Record<string, string> = {
  en: "Acharya Shanti Sagar Foundation, palm-leaf manuscripts, folio, grantha.",
  hi: "आचार्य शांति सागर फाउंडेशन, ताड़पत्र पांडुलिपि, ग्रंथ।",
  kn: "ಆಚಾರ್ಯ ಶಾಂತಿ ಸಾಗರ ಫೌಂಡೇಶನ್, ತಾಳೆಗರಿ ಹಸ್ತಪ್ರತಿ, ಗ್ರಂಥ.",
};

const voiceWindows = [
  { ms: 60_000, max: 6 },
  { ms: 60 * 60_000, max: 40 },
] as const;

const bare = (s: string) => s.toLowerCase().replace(/[\s.,!?।॥'"-]+/g, "");

export async function POST(req: Request) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return new Response("Not configured.", { status: 503 });

  const origin = req.headers.get("origin");
  const site = req.headers.get("sec-fetch-site");
  let sameOrigin = true;
  try {
    if (origin) sameOrigin = new URL(origin).host === new URL(req.url).host;
  } catch {
    sameOrigin = false;
  }
  if (!sameOrigin || (site && site !== "same-origin")) return new Response("Forbidden.", { status: 403 });

  const wait = overLimit(`voice:${clientKey(req)}`, voiceWindows);
  if (wait) return new Response("Too many at once.", { status: 429, headers: { "Retry-After": String(wait) } });

  const type = req.headers.get("content-type") ?? "";
  if (!TYPES.test(type)) return new Response("Unsupported recording.", { status: 415 });
  if (Number(req.headers.get("content-length") ?? 0) > MAX_BYTES) return new Response("Too long.", { status: 413 });
  const audio = await req.arrayBuffer();
  if (audio.byteLength > MAX_BYTES) return new Response("Too long.", { status: 413 });
  if (audio.byteLength < 1500) return Response.json({ text: "" });

  const rawLang = new URL(req.url).searchParams.get("lang") ?? "en";
  const lang = isLang(rawLang) ? rawLang : "en";
  const extension = /mp4|m4a|aac/.test(type) ? "m4a" : /ogg/.test(type) ? "ogg" : /wav/.test(type) ? "wav" : /mpeg|mp3/.test(type) ? "mp3" : "webm";

  const form = new FormData();
  form.set("file", new File([audio], `question.${extension}`, { type: type.split(";")[0] }));
  form.set("model", MODEL);
  form.set("language", lang);
  form.set("prompt", VOCABULARY[lang]);
  form.set("temperature", "0");
  form.set("response_format", "verbose_json");

  const res = await fetch(ENDPOINT, { method: "POST", headers: { Authorization: `Bearer ${apiKey}` }, body: form }).catch(() => null);
  if (!res?.ok) {
    if (res?.status === 429) return new Response("Busy.", { status: 429 });
    console.error("Whisper upstream error", res?.status, await res?.text().catch(() => ""));
    return new Response("Unavailable.", { status: 502 });
  }
  const data = (await res.json().catch(() => null)) as {
    text?: string;
    segments?: { no_speech_prob?: number; avg_logprob?: number; compression_ratio?: number }[];
  } | null;
  const text = (data?.text ?? "").replace(/\s+/g, " ").trim();
  // Heard nothing it was sure of: Whisper invents words for silence and
  // hiss, with low confidence (a clearly spoken question scores about -0.1,
  // silence about -1.5, hiss about -0.5) or in loops (a high compression
  // ratio). The browser also holds back recordings that stayed quiet.
  const confidence = Math.min(...(data?.segments ?? []).map((s) => s.avg_logprob ?? 0), 0);
  const silent =
    !!data?.segments?.length &&
    (data.segments.every((s) => (s.no_speech_prob ?? 0) > 0.6 || (s.compression_ratio ?? 0) > 2.4) ||
      confidence < -0.9 ||
      (confidence < -0.4 && text.replace(/[\s\p{P}]/gu, "").length < 6));
  // Whisper, given nothing to hear, can hand back its prompt.
  const echo = !!text && bare(VOCABULARY[lang]).includes(bare(text));
  return Response.json({ text: silent || echo ? "" : text.slice(0, 600) });
}
