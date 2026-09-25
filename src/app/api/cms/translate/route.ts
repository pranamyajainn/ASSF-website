import { editorRequest } from "@/lib/cms/access";

export const runtime = "nodejs";

const GROQ_ENDPOINT = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "openai/gpt-oss-120b";

const SYSTEM = `You translate short pieces of text for the website of Acharya Shanti Sagar Foundation, a Jain charitable trust in Bengaluru that conserves palm-leaf and handwritten paper manuscripts and serves communities.

Translate the English text into Hindi (Devanagari) and Kannada (Kannada script), in the same plain, respectful register the site uses.

Rules:
- Keep every name, number, date, ₹ amount and figure exactly as written (digits stay international: 1,34,545).
- Keep anything in {curly brackets} exactly as it is, untranslated.
- Use these spellings: आचार्य शांति सागर फाउंडेशन / ಆಚಾರ್ಯ ಶಾಂತಿ ಸಾಗರ ಫೌಂಡೇಶನ್; आचार्य श्री 108 शांति सागर जी महाराज / ಆಚಾರ್ಯ ಶ್ರೀ 108 ಶಾಂತಿ ಸಾಗರ ಮಹಾರಾಜರು; ताड़पत्र / ತಾಳೆಗರಿ (palm leaf); पत्र / ಪತ್ರ (folio); ग्रंथ / ಗ್ರಂಥ (grantha); न्यासी / ಟ್ರಸ್ಟಿ (trustee); संस्थापक न्यासी / ಸಂಸ್ಥಾಪಕ ಟ್ರಸ್ಟಿ (founder trustee); सलाहकार / ಸಲಹೆಗಾರ (advisor).
- Translate meaning, not word by word. Add nothing, leave nothing out.
- Reply with JSON only: {"hi": "…", "kn": "…"}`;

/**
 * The editor's "Translate for me": English in, Hindi and Kannada out, for
 * the editor to review before publishing. Signed-in editors only.
 */
export async function POST(req: Request) {
  const editor = await editorRequest(req);
  if (editor instanceof Response) return editor;
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return new Response("Translation isn't available.", { status: 503 });

  const { text } = (await req.json().catch(() => ({}))) as { text?: unknown };
  if (typeof text !== "string" || !text.trim()) return new Response("Nothing to translate.", { status: 400 });
  if (text.length > 4000) return new Response("That's too long to translate at once.", { status: 413 });

  const res = await fetch(GROQ_ENDPOINT, {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: MODEL,
      temperature: 0.1,
      reasoning_effort: "low",
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: SYSTEM },
        { role: "user", content: text },
      ],
    }),
  }).catch(() => null);
  if (!res?.ok) {
    if (res?.status === 429) return new Response("Too many translations at once — try again in a few seconds.", { status: 429 });
    return new Response("Translation isn't available right now.", { status: 502 });
  }
  try {
    const data = (await res.json()) as { choices?: { message?: { content?: string } }[] };
    const out = JSON.parse(data.choices?.[0]?.message?.content ?? "{}") as { hi?: unknown; kn?: unknown };
    if (typeof out.hi !== "string" || typeof out.kn !== "string") throw new Error("shape");
    return Response.json({ hi: out.hi.trim(), kn: out.kn.trim() });
  } catch {
    return new Response("The translation came back garbled — please try again.", { status: 502 });
  }
}
