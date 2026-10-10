import { timingSafeEqual } from "node:crypto";
import { runDue } from "@/lib/cms/schedule";
import { sendDueReport } from "@/lib/reports/report";
import { listDataFiles, storage, withRetry, writeDataFiles } from "@/lib/cms/store";
import { expiredQuestionFiles } from "@/lib/insights/questions";

export const runtime = "nodejs";
export const maxDuration = 300;

/**
 * The daily job (vercel.json → crons), at about 6 a.m. India time:
 * publishes scheduled changes and sends scheduled emails that are due,
 * sends the automatic website report when one is due, and removes visitor
 * questions older than a year. Vercel calls it with
 * CRON_SECRET; anything else is turned away.
 */
function authorised(req: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return process.env.NODE_ENV === "development";
  const given = Buffer.from(req.headers.get("authorization") ?? "");
  const expected = Buffer.from(`Bearer ${secret}`);
  return given.length === expected.length && timingSafeEqual(given, expected);
}

export async function GET(req: Request) {
  if (!authorised(req)) return new Response("Unauthorised.", { status: 401 });
  if (storage === "none") return Response.json({ ok: true, skipped: "no storage" });
  const log: string[] = [];
  // On a developer's machine, ?now=2026-10-05 runs the job as of that morning.
  const asOf = process.env.NODE_ENV === "development" && new URL(req.url).searchParams.get("now");
  const now = asOf ? new Date(`${asOf}T06:00:00+05:30`) : undefined;
  try {
    log.push(...(await runDue(now)));
  } catch (err) {
    console.error("Daily job: scheduled items failed", err);
    log.push(`schedule: ${err instanceof Error ? err.message : "failed"}`);
  }
  try {
    const report = await sendDueReport(now);
    if (report) log.push(report);
  } catch (err) {
    console.error("Daily job: automatic report failed", err);
    log.push(`report: ${err instanceof Error ? err.message : "failed"}`);
  }
  try {
    const removed = await withRetry(async () => {
      const { head, files } = await listDataFiles("questions");
      const old = expiredQuestionFiles(files.map((f) => f.path));
      if (old.length) await writeDataFiles(old.map((path) => ({ path, remove: true as const })), `Removed ${old.length} days of visitor questions older than a year`, head);
      return old.length;
    });
    if (removed) log.push(`questions: removed ${removed} old day files`);
  } catch (err) {
    console.error("Daily job: pruning failed", err);
  }
  console.info("Daily job", log);
  return Response.json({ ok: true, log });
}
