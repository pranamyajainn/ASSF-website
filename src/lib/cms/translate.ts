import "server-only";

/**
 * English → Hindi and Kannada, for the site editor's "Translate for me" and
 * the AI connector. The Groq model the site assistant uses, held to the
 * site's own spellings and to leaving names, figures and {tokens} alone.
 */
const GROQ_ENDPOINT = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "openai/gpt-oss-120b";

const SYSTEM = `You translate short pieces of text for the website of Acharya Shanti Sagar Foundation, a Jain charitable trust in Bengaluru that conserves palm-leaf and handwritten paper manuscripts and serves communities.

Translate the English text into Hindi (Devanagari) and Kannada (Kannada script), in the same plain, respectful register the site uses.

Rules:
- Keep every number, ₹ amount and figure exactly as written (digits stay international: 1,34,545).
- Write names of people, places and institutions in the target script, as the site does (Shri Rakesh Kumar Jain → श्री राकेश कुमार जैन / ಶ್ರೀ ರಾಕೇಶ್ ಕುಮಾರ್ ಜೈನ್; Karanja Lad → कारंजा लाड / ಕಾರಂಜಾ ಲಾಡ್). Month names are translated; the digits of dates stay.
- Keep anything in {curly brackets} exactly as it is, untranslated.
- Use these spellings: आचार्य शांति सागर फाउंडेशन / ಆಚಾರ್ಯ ಶಾಂತಿ ಸಾಗರ ಫೌಂಡೇಶನ್; आचार्य श्री 108 शांति सागर जी महाराज / ಆಚಾರ್ಯ ಶ್ರೀ 108 ಶಾಂತಿ ಸಾಗರ ಮಹಾರಾಜರು; ताड़पत्र / ತಾಳೆಗರಿ (palm leaf); पत्र / ಪತ್ರ (folio); ग्रंथ / ಗ್ರಂಥ (grantha); न्यासी / ಟ್ರಸ್ಟಿ (trustee); संस्थापक न्यासी / ಸಂಸ್ಥಾಪಕ ಟ್ರಸ್ಟಿ (founder trustee); सलाहकार / ಸಲಹೆಗಾರ (advisor).
- Titles and roles are exact — never swap one for another (Joint is not Assistant, Working President is not Vice President). Use the site's terms: President अध्यक्ष / ಅಧ್ಯಕ್ಷ; Working President कार्याध्यक्ष / ಕಾರ್ಯಾಧ್ಯಕ್ಷ; Vice President उपाध्यक्ष / ಉಪಾಧ್ಯಕ್ಷ; Secretary सचिव / ಕಾರ್ಯದರ್ಶಿ; Joint Secretary संयुक्त सचिव / ಜಂಟಿ ಕಾರ್ಯದರ್ಶಿ; Treasurer कोषाध्यक्ष / ಖಜಾಂಚಿ; Settlor न्यास-प्रवर्तक / ಟ್ರಸ್ಟ್ ಸ್ಥಾಪಕ; Param Samrakshak Margadarshak परम संरक्षक मार्गदर्शक / ಪರಮ ಸಂರಕ್ಷಕ ಮಾರ್ಗದರ್ಶಕ.
- Translate meaning, not word by word. Add nothing, leave nothing out.
- Reply with JSON only: {"hi": "…", "kn": "…"}`;

export class TranslationError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
  }
}

export type Reference = { en: string; hi: string; kn: string };

/**
 * `reference`: the field as the site has it now, in all three languages —
 * so a changed designation keeps the site's words for what didn't change.
 */
export async function translate(text: string, reference?: Reference | null): Promise<{ hi: string; kn: string }> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new TranslationError("Translation isn't available.", 503);
  if (!text.trim()) throw new TranslationError("Nothing to translate.", 400);
  if (text.length > 4000) throw new TranslationError("That's too long to translate at once.", 413);

  const res = await fetch(GROQ_ENDPOINT, {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: MODEL,
      temperature: 0,
      reasoning_effort: "low",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: reference
            ? `${SYSTEM}\n\nThe site's current version of this text, for its words and style — reuse them wherever the meaning is unchanged:\nEnglish: ${reference.en}\nHindi: ${reference.hi}\nKannada: ${reference.kn}`
            : SYSTEM,
        },
        { role: "user", content: text },
      ],
    }),
  }).catch(() => null);
  if (!res?.ok) {
    if (res?.status === 429) throw new TranslationError("Too many translations at once — try again in a few seconds.", 429);
    throw new TranslationError("Translation isn't available right now.", 502);
  }
  try {
    const data = (await res.json()) as { choices?: { message?: { content?: string } }[] };
    const out = JSON.parse(data.choices?.[0]?.message?.content ?? "{}") as { hi?: unknown; kn?: unknown };
    if (typeof out.hi !== "string" || typeof out.kn !== "string") throw new Error("shape");
    return { hi: out.hi.trim(), kn: out.kn.trim() };
  } catch {
    throw new TranslationError("The translation came back garbled — please try again.", 502);
  }
}
