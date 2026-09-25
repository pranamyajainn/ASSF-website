import { editorRequest } from "@/lib/cms/access";
import { stageImage, storage } from "@/lib/cms/store";

export const runtime = "nodejs";

/** A photograph from the editor, already resized and re-encoded in the browser. */
const MAX_BYTES = 4 * 1024 * 1024;

export async function POST(req: Request) {
  const editor = await editorRequest(req);
  if (editor instanceof Response) return editor;
  if (storage === "none") return new Response("Publishing isn't connected yet.", { status: 503 });

  const bytes = Buffer.from(await req.arrayBuffer());
  if (!bytes.length || bytes.length > MAX_BYTES) return new Response("That photo is too large.", { status: 413 });
  // JPEG only: the editor re-encodes every photo, which also drops its
  // metadata (camera, GPS location) before it leaves the reader's device.
  if (!(bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff)) {
    return new Response("That file isn't a photo the editor can use.", { status: 415 });
  }
  const name = decodeURIComponent(req.headers.get("x-file-name") ?? "photo").slice(0, 120);
  try {
    return Response.json(await stageImage(bytes, name));
  } catch (err) {
    console.error("CMS image upload failed", err);
    return new Response("The photo couldn't be uploaded. Please try again.", { status: 502 });
  }
}
