import { editorRequest } from "@/lib/cms/access";
import { FILE_TYPES, MAX_FILE, saveFile } from "@/lib/mail/files";
import { originOf } from "@/lib/mcp/oauth";
import { siteUrl } from "@/lib/site";

export const runtime = "nodejs";

/** Keeps a report to share by link, and returns the link (for WhatsApp). */
export async function POST(req: Request) {
  const editor = await editorRequest(req);
  if (editor instanceof Response) return editor;
  const b = (await req.json().catch(() => null)) as { name?: unknown; type?: unknown; data?: unknown } | null;
  if (typeof b?.data !== "string") return new Response("No file sent.", { status: 400 });
  const bytes = Buffer.from(b.data, "base64");
  const type = String(b.type ?? "");
  if (!bytes.length || bytes.length > MAX_FILE) return new Response("The file must be under 3 MB.", { status: 413 });
  if (!FILE_TYPES.has(type)) return new Response("Share a PDF, Word document or photo.", { status: 415 });
  const name = String(b.name ?? "report").replace(/[^\w.\- ()]/g, "_").slice(0, 100);
  try {
    const site = process.env.NODE_ENV === "development" ? originOf(req) : siteUrl.origin;
    const url = await saveFile(bytes, name, type, site);
    console.info("Shared file", { editor: editor.email, name, bytes: bytes.length });
    return Response.json({ url });
  } catch (err) {
    console.error("Shared file failed", err);
    return new Response("The file couldn't be prepared for sharing. Please try again.", { status: 502 });
  }
}
