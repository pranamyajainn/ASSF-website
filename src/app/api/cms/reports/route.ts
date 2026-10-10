import { editorRequest } from "@/lib/cms/access";
import { GROUPS } from "@/lib/mail/data";
import { orgForEmail } from "@/lib/mail/org";
import { renderEmail } from "@/lib/mail/render";
import { mailMode } from "@/lib/mail/send";
import { buildReport, periodFor, readReportSettings, recipients, sendReport, updateReportSettings, type ReportSettings } from "@/lib/reports/report";
import { siteUrl } from "@/lib/site";

export const runtime = "nodejs";
export const maxDuration = 60;

/** The next day a report would go out, in India time. */
function nextDue(s: ReportSettings, now = new Date()): string | null {
  if (!s.enabled) return null;
  for (let i = 1; i <= 35; i++) {
    const d = new Date(now.getTime() + i * 86_400_000).toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
    if (s.frequency === "weekly" ? new Date(`${d}T12:00:00+05:30`).getUTCDay() === 1 : d.endsWith("-01")) return d;
  }
  return null;
}

/** The automatic report's settings, who it would reach, and when it goes next. */
export async function GET(req: Request) {
  const editor = await editorRequest(req);
  if (editor instanceof Response) return editor;
  try {
    const settings = await readReportSettings();
    return Response.json({ settings, groups: GROUPS, recipients: (await recipients(settings)).length, nextDue: nextDue(settings), mode: mailMode });
  } catch (err) {
    console.error("Report settings unreadable", err);
    return new Response("The report settings couldn't be loaded.", { status: 502 });
  }
}

/** Changes the settings: on/off, how often, and who receives it. */
export async function PUT(req: Request) {
  const editor = await editorRequest(req);
  if (editor instanceof Response) return editor;
  const b = (await req.json().catch(() => null)) as Partial<ReportSettings> | null;
  if (!b) return new Response("Invalid request.", { status: 400 });
  try {
    const settings = await updateReportSettings((s) => ({
      ...s,
      ...(typeof b.enabled === "boolean" ? { enabled: b.enabled } : {}),
      ...(b.frequency === "weekly" || b.frequency === "monthly" ? { frequency: b.frequency } : {}),
      ...(Array.isArray(b.groups) ? { groups: b.groups.filter((g) => GROUPS.some((x) => x.id === g)) } : {}),
      ...(typeof b.editors === "boolean" ? { editors: b.editors } : {}),
    }));
    return Response.json({ settings, recipients: (await recipients(settings)).length, nextDue: nextDue(settings) });
  } catch (err) {
    console.error("Report settings not saved", err);
    return new Response("The settings couldn't be saved. Please try again.", { status: 502 });
  }
}

/** { action: "preview" } — the report as it would go out today; { action: "test" } — the same, sent to you. */
export async function POST(req: Request) {
  const editor = await editorRequest(req);
  if (editor instanceof Response) return editor;
  const b = (await req.json().catch(() => null)) as { action?: unknown; frequency?: unknown } | null;
  const settings = await readReportSettings();
  const frequency = b?.frequency === "weekly" || b?.frequency === "monthly" ? b.frequency : settings.frequency;
  // The period that has just ended: a preview shows what the next report will look like, from today's records.
  const { from, to, label } = frequency === "weekly" ? periodFor("weekly") : { ...periodFor("monthly"), ...thisMonthSoFar() };
  try {
    const report = await buildReport(from, to, label, frequency);
    if (b?.action === "test") {
      const { sent } = await sendReport(report, [{ email: editor.email, listed: false }]);
      return sent ? Response.json({ sent: editor.email }) : new Response("The test couldn't be sent.", { status: 502 });
    }
    const { html } = renderEmail({ subject: report.subject, body: report.body, site: siteUrl.origin, unsubscribe: "#", org: orgForEmail() });
    return Response.json({ subject: report.subject, html });
  } catch (err) {
    if (err instanceof Error && /isn't connected/.test(err.message)) return new Response(err.message, { status: 503 });
    console.error("Report preview failed", err);
    return new Response("The report couldn't be made just now.", { status: 502 });
  }
}

/** A monthly preview covers this month so far — the month that ends next. */
function thisMonthSoFar(now = new Date()) {
  const ymd = now.toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
  const from = new Date(`${ymd.slice(0, 8)}01T00:00:00+05:30`);
  return { from, to: now, label: `${from.toLocaleDateString("en-IN", { month: "long", year: "numeric", timeZone: "Asia/Kolkata" })} (so far)` };
}
