import { publishedEdits } from "@/i18n/content";
import { editorRequest } from "@/lib/cms/access";

/** Which publish the live site is showing — the editor waits on this after publishing. */
export async function GET(req: Request) {
  const editor = await editorRequest(req);
  if (editor instanceof Response) return editor;
  return Response.json({ revision: publishedEdits.revision }, { headers: { "Cache-Control": "no-store" } });
}
