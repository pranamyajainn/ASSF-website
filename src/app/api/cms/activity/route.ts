import { editorRequest } from "@/lib/cms/access";
import { readActivity } from "@/lib/cms/activity";

export const runtime = "nodejs";

/** The editor activity record, newest first: ?days=90 by default, a year at most. */
export async function GET(req: Request) {
  const editor = await editorRequest(req);
  if (editor instanceof Response) return editor;
  const days = Math.min(366, Math.max(1, Number(new URL(req.url).searchParams.get("days")) || 90));
  try {
    return Response.json(await readActivity(days), { headers: { "Cache-Control": "no-store" } });
  } catch (err) {
    console.error("CMS activity failed", err);
    return new Response("The activity record couldn't be loaded.", { status: 502 });
  }
}
