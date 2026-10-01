import { editorRequest } from "@/lib/cms/access";
import { analyse, InsightsError, readAnalysis, summarise } from "@/lib/insights/analyse";
import { readQuestions } from "@/lib/insights/questions";

export const runtime = "nodejs";
export const maxDuration = 60;

const PERIODS = new Set([7, 30, 90]);
const period = (req: Request) => {
  const days = Number(new URL(req.url).searchParams.get("days"));
  return PERIODS.has(days) ? days : 30;
};

/** Insights for the editor: the counts, the latest questions, and the last grouping into themes. */
export async function GET(req: Request) {
  const editor = await editorRequest(req);
  if (editor instanceof Response) return editor;
  const days = period(req);
  try {
    const [asked, analysis] = await Promise.all([readQuestions(days), readAnalysis()]);
    return Response.json({
      days,
      summary: summarise(asked, days),
      recent: asked.slice(0, 60).map(({ at, lang, page, q, a, spoken, deflected }) => ({ at, lang, page, q, a, spoken, deflected })),
      analysis,
    });
  } catch (err) {
    console.error("Insights failed", err);
    return new Response("Insights couldn't be loaded. Please try again.", { status: 502 });
  }
}

/** Groups the period's questions into themes, afresh. */
export async function POST(req: Request) {
  const editor = await editorRequest(req);
  if (editor instanceof Response) return editor;
  const days = period(req);
  try {
    return Response.json({ analysis: await analyse(await readQuestions(days), days) });
  } catch (err) {
    if (err instanceof InsightsError) return new Response(err.message, { status: err.status });
    console.error("Insights analysis failed", err);
    return new Response("The questions couldn't be grouped. Please try again.", { status: 502 });
  }
}
