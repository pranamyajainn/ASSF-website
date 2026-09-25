import { editorRequest } from "@/lib/cms/access";
import { translate, TranslationError } from "@/lib/cms/translate";

export const runtime = "nodejs";

/**
 * The editor's "Translate for me": English in, Hindi and Kannada out, for
 * the editor to review before publishing. Signed-in editors only.
 */
export async function POST(req: Request) {
  const editor = await editorRequest(req);
  if (editor instanceof Response) return editor;
  const { text, reference } = (await req.json().catch(() => ({}))) as { text?: unknown; reference?: unknown };
  if (typeof text !== "string") return new Response("Nothing to translate.", { status: 400 });
  const ref = reference as { en?: unknown; hi?: unknown; kn?: unknown } | undefined;
  const usable = ref && [ref.en, ref.hi, ref.kn].every((v) => typeof v === "string" && v.length < 4000) ? (ref as { en: string; hi: string; kn: string }) : null;
  try {
    return Response.json(await translate(text, usable));
  } catch (err) {
    if (err instanceof TranslationError) return new Response(err.message, { status: err.status });
    throw err;
  }
}
