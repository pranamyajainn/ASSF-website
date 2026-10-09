import { editorRequest } from "@/lib/cms/access";
import { readGifts } from "@/lib/donate/apnadharm";

export const runtime = "nodejs";

const PERIODS = new Set([7, 30, 90, 365]);

/** Online gifts as donors' browsers reported them, for the editor's Insights. */
export async function GET(req: Request) {
  const editor = await editorRequest(req);
  if (editor instanceof Response) return editor;
  const asked = Number(new URL(req.url).searchParams.get("days"));
  const days = PERIODS.has(asked) ? asked : 30;
  try {
    const gifts = await readGifts(days);
    const completed = gifts.filter((g) => g.status === "success");
    return Response.json({
      days,
      completed: completed.length,
      total: completed.reduce((sum, g) => sum + g.amount, 0),
      unfinished: gifts.filter((g) => g.status !== "success").length,
      gifts: gifts.slice(0, 100),
    });
  } catch (err) {
    console.error("Gifts couldn't be read", err);
    return new Response("Online gifts couldn't be loaded. Please try again.", { status: 502 });
  }
}
