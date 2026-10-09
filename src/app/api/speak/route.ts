import { createHash } from "node:crypto";
import { clientKey, overLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

/**
 * A sentence of the site, spoken in a natural, cheerful English voice
 * (Orpheus on Groq, the assistant's provider) — for "Listen" and for
 * reading the assistant's answers aloud. Devices' own English voices are
 * often robotic; Hindi and Kannada stay with the device's voices, which
 * Groq doesn't offer.
 *
 * GET, so the CDN keeps each sentence once spoken: the site's text is the
 * same for everyone, so a page read aloud costs nothing the second time.
 * Only this site's pages may ask, and only for short sentences.
 */
const ENDPOINT = "https://api.groq.com/openai/v1/audio/speech";
const MODEL = "canopylabs/orpheus-v1-english";
const VOICE = process.env.TTS_VOICE || "hannah";
const MAX = 300;

const windows = [
  { ms: 60_000, max: 40 },
  { ms: 60 * 60_000, max: 600 },
] as const;

export async function GET(req: Request) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return new Response("Not configured.", { status: 503 });

  // A request from this site's own pages: the browser says so (Sec-Fetch-Site), or the Referer does.
  const site = req.headers.get("sec-fetch-site");
  let sameSite = site === "same-origin";
  if (!site) {
    try {
      sameSite = new URL(req.headers.get("referer") ?? "").host === new URL(req.url).host;
    } catch {
      sameSite = false;
    }
  }
  if (!sameSite) return new Response("Forbidden.", { status: 403 });

  const text = (new URL(req.url).searchParams.get("text") ?? "").replace(/\s+/g, " ").trim();
  if (!text || text.length > MAX) return new Response("Bad text.", { status: 400 });

  const wait = overLimit(`speak:${clientKey(req)}`, windows);
  if (wait) return new Response("Too many.", { status: 429, headers: { "Retry-After": String(wait) } });

  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    // [cheerful]: Orpheus's vocal direction — warm and bright, as a guide would read.
    body: JSON.stringify({ model: MODEL, voice: VOICE, input: `[cheerful] ${text}`, response_format: "wav" }),
  }).catch(() => null);
  if (!res?.ok) {
    const detail = await res?.text().catch(() => "");
    console.error("Speech unavailable", res?.status, detail?.slice(0, 200));
    // The browser falls back to the device's own voice.
    return new Response("Unavailable.", { status: 503, headers: { "Cache-Control": "no-store" } });
  }
  const audio = await res.arrayBuffer();
  return new Response(audio, {
    headers: {
      "Content-Type": "audio/wav",
      "Cache-Control": "public, max-age=86400, s-maxage=31536000, immutable",
      ETag: `"${createHash("sha256").update(VOICE).update(text).digest("hex").slice(0, 24)}"`,
    },
  });
}
