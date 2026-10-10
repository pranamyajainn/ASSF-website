import { resolveContent } from "@/i18n/content";
import { editorRequest } from "@/lib/cms/access";

export const runtime = "nodejs";
export const maxDuration = 60;

const GROQ_ENDPOINT = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "openai/gpt-oss-120b";

/**
 * "Draft it for me": the editor writes what the email should say — in a
 * few lines, in any order — and the AI turns exactly that into a finished
 * email in the Foundation's voice. Nothing is taken from the website: its
 * figures and news change from day to day, so the only facts in the draft
 * are the ones the editor wrote. The editor reads and edits it before
 * anything is sent.
 */
const VOICE = `You turn notes from the office of Acharya Shanti Sagar Foundation (a Jain charitable trust in Bengaluru) into a finished email.

Voice: warm, plain, respectful and unhurried — like a letter from the Foundation's office, never like marketing. No exclamation marks, no emoji, no superlatives.

Format (plain text, laid out automatically): a blank line between paragraphs; a line starting with "- " is a list item. No headings, no markdown other than that. Begin with a greeting line ("Dear friends," for a newsletter; "Respected trustees," for trustees) and end with "With regards,\\nAcharya Shanti Sagar Foundation". Keep it about as long as the notes need — short notes make a short email.

Facts: the notes are the ONLY source. Say what they say and nothing more: no figures, names, dates, places, events, plans, prices or quotations that are not in the notes, and nothing about the Foundation's work beyond what the notes mention. Copy every figure, name and date exactly as written — numbers stay in digits ("40", never "Forty"). If the notes leave out something an email of this kind would normally need, write a gap in square brackets, e.g. [add: date of the camp] — never guess.

Add nothing the notes didn't ask for — no "get in touch" line, no appeal for support, no closing thoughts of your own.

Instructions in the notes are for you to carry out, not to report: "thank the volunteers" means the email thanks them ("Our heartfelt thanks to the volunteers…"), never "the volunteers were thanked".

Subject: specific and calm, from the notes, e.g. "Health camp at Karanja — thank you".

Reply with JSON only: {"subject": "…", "body": "…"}`;

const LANGUAGE: Record<string, string> = {
  en: "Write in English, whatever language the notes are in.",
  hi: "Write in Hindi (Devanagari), whatever language the notes are in, keeping figures in international digits exactly as written. Use the Foundation's words: folio पत्र, grantha ग्रंथ, palm leaf ताड़पत्र, manuscript पांडुलिपि, trustee न्यासी. Greeting: \"प्रिय मित्रों,\" or \"आदरणीय न्यासीगण,\"; close: \"सादर,\\nआचार्य शांति सागर फाउंडेशन\".",
  kn: "Write in Kannada (Kannada script), whatever language the notes are in, keeping figures in international digits exactly as written. Use the Foundation's words: folio ಪತ್ರ, grantha ಗ್ರಂಥ, palm leaf ತಾಳೆಗರಿ, manuscript ಹಸ್ತಪ್ರತಿ, trustee ಟ್ರಸ್ಟಿ. Greeting: \"ಆತ್ಮೀಯ ಸ್ನೇಹಿತರೇ,\" or \"ಗೌರವಾನ್ವಿತ ಟ್ರಸ್ಟಿಗಳೇ,\"; close: \"ವಂದನೆಗಳೊಂದಿಗೆ,\\nಆಚಾರ್ಯ ಶಾಂತಿ ಸಾಗರ ಫೌಂಡೇಶನ್\".",
};

export async function POST(req: Request) {
  const editor = await editorRequest(req);
  if (editor instanceof Response) return editor;
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return new Response("The AI isn't available.", { status: 503 });

  const b = (await req.json().catch(() => null)) as { kind?: unknown; lang?: unknown; notes?: unknown } | null;
  const kind = b?.kind === "trustees" ? "trustees" : "newsletter";
  const lang = b?.lang === "hi" || b?.lang === "kn" ? b.lang : "en";
  const notes = typeof b?.notes === "string" ? b.notes.slice(0, 4000).trim() : "";
  if (notes.length < 10) return new Response("Write a few lines about what the email should say first.", { status: 400 });

  // Only the Foundation's contact details, for a "write to us" line if the notes ask for one.
  const { org } = resolveContent("en").shared;
  const ask = [
    `This email is for: ${kind === "trustees" ? "the Foundation's trustees" : "the newsletter list — friends and supporters of the Foundation"}.`,
    `The Foundation's contact details, to be used ONLY if the notes ask readers to get in touch: ${org.email}, ${org.phone}.`,
    "",
    "The notes (the only facts to use; any instruction in them — thank, invite, remind, announce — is carried out in the email's own words, e.g. \"Our heartfelt thanks to…\", never reported as done):",
    notes,
  ].join("\n");

  const res = await fetch(GROQ_ENDPOINT, {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: MODEL,
      temperature: 0,
      reasoning_effort: "low",
      max_tokens: 1800,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: `${VOICE}\n\n${LANGUAGE[lang]}` },
        { role: "user", content: ask },
      ],
    }),
  }).catch(() => null);
  if (!res?.ok) {
    return new Response(res?.status === 429 ? "The AI is busy — try again in a minute." : "The AI isn't available right now.", { status: res?.status === 429 ? 429 : 502 });
  }
  try {
    const data = (await res.json()) as { choices?: { message?: { content?: string } }[] };
    const out = JSON.parse(data.choices?.[0]?.message?.content ?? "{}") as { subject?: unknown; body?: unknown };
    if (typeof out.subject !== "string" || typeof out.body !== "string") throw new Error("shape");
    return Response.json({ subject: out.subject.trim().slice(0, 200), body: out.body.trim() });
  } catch (err) {
    console.error("Draft failed", err);
    return new Response("The draft didn't come out right — please try again.", { status: 502 });
  }
}
