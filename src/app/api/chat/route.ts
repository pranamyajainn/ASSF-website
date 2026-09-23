import { systemPrompt } from "@/lib/assistant-knowledge";

export const runtime = "nodejs";

const GROQ_ENDPOINT = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "openai/gpt-oss-120b";
// Kept small: the API key in use has an 8,000 token/minute cap, and the
// system prompt alone is a fixed cost on every request.
const MAX_TURNS = 8;
const MAX_MESSAGE_LENGTH = 1500;

type ChatMessage = { role: "user" | "assistant"; content: string };

/**
 * The assistant answers in the edition's language. Names and figures stay
 * as the knowledge base gives them, so a translated answer can never drift
 * from the published numbers.
 */
const LANGUAGE_INSTRUCTIONS: Record<string, string> = {
  hi: "Reply in Hindi, written in Devanagari script, whatever language the question is in. Keep figures in international digits with Indian grouping (e.g. 1,34,545), exactly as the knowledge base gives them.",
  kn: "Reply in Kannada, written in Kannada script, whatever language the question is in. Keep figures in international digits with Indian grouping (e.g. 1,34,545), exactly as the knowledge base gives them.",
};

function isChatMessage(value: unknown): value is ChatMessage {
  if (!value || typeof value !== "object") return false;
  const { role, content } = value as Record<string, unknown>;
  return (role === "user" || role === "assistant") && typeof content === "string";
}

export async function POST(req: Request) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return new Response("The assistant isn't configured yet.", { status: 500 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return new Response("Invalid request body.", { status: 400 });
  }

  const rawMessages =
    body && typeof body === "object" && Array.isArray((body as { messages?: unknown }).messages)
      ? (body as { messages: unknown[] }).messages
      : [];

  const lang = body && typeof body === "object" ? (body as { lang?: unknown }).lang : undefined;
  const languageInstruction = typeof lang === "string" ? LANGUAGE_INSTRUCTIONS[lang] : undefined;
  const system = languageInstruction ? `${systemPrompt}\n\nLANGUAGE: ${languageInstruction}` : systemPrompt;

  const messages = rawMessages
    .filter(isChatMessage)
    .slice(-MAX_TURNS)
    .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_MESSAGE_LENGTH) }));

  if (messages.length === 0) {
    return new Response("No message provided.", { status: 400 });
  }

  let upstream: Response;
  try {
    upstream = await fetch(GROQ_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        stream: true,
        temperature: 0.4,
        // Indic scripts take more tokens per word than English.
        max_tokens: languageInstruction ? 700 : 500,
        reasoning_effort: "low",
        messages: [{ role: "system", content: system }, ...messages],
      }),
    });
  } catch {
    return new Response("Could not reach the assistant right now.", { status: 502 });
  }

  if (!upstream.ok || !upstream.body) {
    if (upstream.status === 429) {
      return new Response(
        "I'm getting a lot of questions right now — please wait a few seconds and try again.",
        { status: 429 },
      );
    }
    const detail = await upstream.text().catch(() => "");
    console.error("Groq upstream error", upstream.status, detail);
    return new Response("The assistant is temporarily unavailable. Please try again shortly.", {
      status: 502,
    });
  }

  const reader = upstream.body.getReader();
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      let buffer = "";
      try {
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });

          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";

          for (const rawLine of lines) {
            const line = rawLine.trim();
            if (!line.startsWith("data:")) continue;
            const data = line.slice(5).trim();
            if (data === "[DONE]") {
              controller.close();
              return;
            }
            try {
              const parsed = JSON.parse(data) as {
                choices?: { delta?: { content?: string } }[];
              };
              const delta = parsed.choices?.[0]?.delta?.content;
              if (delta) controller.enqueue(encoder.encode(delta));
            } catch {
              // Skip malformed SSE chunks rather than aborting the stream.
            }
          }
        }
        controller.close();
      } catch (err) {
        controller.error(err);
      }
    },
    cancel() {
      reader.cancel().catch(() => {});
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache",
    },
  });
}
