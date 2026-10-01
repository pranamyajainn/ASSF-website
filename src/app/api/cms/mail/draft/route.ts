import { resolveContent } from "@/i18n/content";
import { editorRequest } from "@/lib/cms/access";
import { history } from "@/lib/cms/store";
import { readAnalysis, summarise } from "@/lib/insights/analyse";
import { readQuestions } from "@/lib/insights/questions";
import { readMail } from "@/lib/mail/data";

export const runtime = "nodejs";
export const maxDuration = 60;

const GROQ_ENDPOINT = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "openai/gpt-oss-120b";

/**
 * "Draft it for me": a first draft of an update, written by the AI from
 * what the site itself knows — its published figures, its news, what was
 * changed on it and what visitors asked since the last email. It is told to
 * use those facts only and to leave a [bracketed gap] wherever the
 * Foundation must add something, so a draft can be wrong only in tone,
 * never in its facts. The editor reads and edits it before anything is sent.
 */
const VOICE = `You write email updates for Acharya Shanti Sagar Foundation (आचार्य शांति सागर फाउंडेशन), a Jain charitable trust in Bengaluru, est. 2019, that conserves palm-leaf and handwritten paper manuscripts and serves rural communities, in the name of Acharya Shri 108 Shanti Sagar Ji Maharaj.

Voice: warm, plain, respectful and unhurried — like a letter from the Foundation's office, never like marketing. No exclamation marks, no emoji, no superlatives, no "free". Giving is mentioned at most once, quietly, at the end.

Format (plain text, laid out automatically): a blank line between paragraphs; a line starting with "- " is a list item. No headings, no markdown other than that. Under 250 words. Begin with a greeting line ("Dear friends," for a newsletter; "Respected trustees," for trustees) and end with "With regards,\\nAcharya Shanti Sagar Foundation".

Facts: use ONLY the facts given below. Copy figures, names, dates and places exactly as written. Never add a number, date, name, event, plan or quotation that isn't given. Where the update needs something only the Foundation knows, write a gap in square brackets, e.g. [add: date of the next camp]. It is better to leave a gap than to guess.

Subject: specific and calm, naming the main news and the month, e.g. "Conservation at Shravanabelagola — October update". Never "Newsletter Update".

Reply with JSON only: {"subject": "…", "body": "…"}`;

const LANGUAGE: Record<string, string> = {
  en: "Write in English.",
  hi: "Write in Hindi (Devanagari), keeping figures in international digits exactly as given (e.g. 1,34,545). Use the website's words: folio पत्र, grantha ग्रंथ, palm leaf ताड़पत्र, manuscript पांडुलिपि, trustee न्यासी. Greeting: \"प्रिय मित्रों,\" or \"आदरणीय न्यासीगण,\"; close: \"सादर,\\nआचार्य शांति सागर फाउंडेशन\".",
  kn: "Write in Kannada (Kannada script), keeping figures in international digits exactly as given (e.g. 1,34,545). Use the website's words: folio ಪತ್ರ, grantha ಗ್ರಂಥ, palm leaf ತಾಳೆಗರಿ, manuscript ಹಸ್ತಪ್ರತಿ, trustee ಟ್ರಸ್ಟಿ. Greeting: \"ಆತ್ಮೀಯ ಸ್ನೇಹಿತರೇ,\" or \"ಗೌರವಾನ್ವಿತ ಟ್ರಸ್ಟಿಗಳೇ,\"; close: \"ವಂದನೆಗಳೊಂದಿಗೆ,\\nಆಚಾರ್ಯ ಶಾಂತಿ ಸಾಗರ ಫೌಂಡೇಶನ್\".",
};

export async function POST(req: Request) {
  const editor = await editorRequest(req);
  if (editor instanceof Response) return editor;
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return new Response("The AI isn't available.", { status: 503 });

  const b = (await req.json().catch(() => null)) as { kind?: unknown; lang?: unknown; notes?: unknown } | null;
  const kind = b?.kind === "trustees" ? "trustees" : "newsletter";
  const lang = b?.lang === "hi" || b?.lang === "kn" ? b.lang : "en";
  const notes = typeof b?.notes === "string" ? b.notes.slice(0, 1500).trim() : "";

  try {
    const [mail, publishes] = await Promise.all([readMail(), history().catch(() => [])]);
    const since = mail.sent[0]?.at ?? new Date(Date.now() - 30 * 86_400_000).toISOString();
    const days = Math.min(90, Math.max(1, Math.ceil((Date.now() - Date.parse(since)) / 86_400_000)));
    const [asked, analysis] = await Promise.all([readQuestions(days).catch(() => []), readAnalysis().catch(() => null)]);
    const summary = summarise(asked, days);
    const { home, shared } = resolveContent("en");
    const sinceText = new Date(since).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });

    const facts = [
      `Writing for: ${kind === "trustees" ? "the Foundation's trustees — a short report on the work and the website" : "the newsletter list — friends and supporters of the Foundation"}.`,
      `Today is ${new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Kolkata" })}. The last email went out on ${sinceText}.`,
      "",
      "The Foundation's published figures:",
      ...home.ledger.metrics.filter((m) => m.value).map((m) => `- ${m.label}: ${m.value} (${m.note})`),
      ...home.scale.lines.map((l) => `- ${l.label}: ${l.display} — ${l.detail}`),
      `- Conserving one folio: ₹${shared.folioPrice.toLocaleString("en-IN")}; one grantha of about 100 folios: ₹${shared.granthaPrice.toLocaleString("en-IN")}.`,
      "",
      "News on the website, newest first:",
      ...home.field.items.slice(0, 5).map((n) => `- ${n.date ?? "(date not given)"}, ${n.place}: ${n.title} — ${n.body}`),
      "",
      `Changes published on the website since ${sinceText}:`,
      ...(publishes.filter((p) => p.date > since && p.message.startsWith("Site edit: ")).map((p) => `- ${p.message.split("\n")[0].slice(11)}`).slice(0, 12)),
      ...(kind === "trustees"
        ? [
            "",
            `The website's AI assistant since ${sinceText}: ${summary.total} questions from visitors (${summary.byLang.en ?? 0} in English, ${summary.byLang.hi ?? 0} in Hindi, ${summary.byLang.kn ?? 0} in Kannada; ${summary.spoken} spoken aloud); ${summary.deflected} were about things the website doesn't yet say.`,
            ...(analysis?.themes.length ? ["What visitors asked about most:", ...analysis.themes.slice(0, 5).map((t) => `- ${t.title} (${t.questions.length})`)] : []),
          ]
        : []),
      ...(notes ? ["", "Notes from the Foundation's office — include these:", notes] : []),
      "",
      `Contact: ${shared.org.email}, ${shared.org.phone}. Website: the Foundation's site.`,
    ].join("\n");

    const res = await fetch(GROQ_ENDPOINT, {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: MODEL,
        temperature: 0.4,
        reasoning_effort: "low",
        max_tokens: 1800,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: `${VOICE}\n\n${LANGUAGE[lang]}` },
          { role: "user", content: facts },
        ],
      }),
    }).catch(() => null);
    if (!res?.ok) {
      return new Response(res?.status === 429 ? "The AI is busy — try again in a minute." : "The AI isn't available right now.", { status: res?.status === 429 ? 429 : 502 });
    }
    const data = (await res.json()) as { choices?: { message?: { content?: string } }[] };
    const out = JSON.parse(data.choices?.[0]?.message?.content ?? "{}") as { subject?: unknown; body?: unknown };
    if (typeof out.subject !== "string" || typeof out.body !== "string") throw new Error("shape");
    return Response.json({ subject: out.subject.trim().slice(0, 200), body: out.body.trim() });
  } catch (err) {
    console.error("Draft failed", err);
    return new Response("The draft didn't come out right — please try again.", { status: 502 });
  }
}
