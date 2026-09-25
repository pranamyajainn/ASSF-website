import { editorRequest } from "@/lib/cms/access";
import { history } from "@/lib/cms/store";

export async function GET(req: Request) {
  const editor = await editorRequest(req);
  if (editor instanceof Response) return editor;
  try {
    return Response.json(await history(), { headers: { "Cache-Control": "no-store" } });
  } catch (err) {
    console.error("CMS history failed", err);
    return new Response("The history couldn't be loaded.", { status: 502 });
  }
}
