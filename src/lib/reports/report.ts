import "server-only";
import { baseContent, editedContent } from "@/i18n/content";
import { locales, type Lang } from "@/i18n/config";
import { checkSite } from "@/components/editor/health";
import { translatedFields, type Trees } from "@/components/editor/model";
import { listScheduled } from "@/lib/cms/schedule";
import { history, readEdits, storage } from "@/lib/cms/store";
import { readSealed, updateSealed } from "@/lib/data/sealed";
import { readGifts } from "@/lib/donate/apnadharm";
import { readAnalysis, summarise } from "@/lib/insights/analyse";
import { readQuestions } from "@/lib/insights/questions";
import { readMail, updateMail } from "@/lib/mail/data";
import { orgForEmail } from "@/lib/mail/org";
import { renderEmail } from "@/lib/mail/render";
import { deliver, mailMode, unsubscribeLink } from "@/lib/mail/send";
import { editorEmails } from "@/lib/cms/editors";
import { siteUrl } from "@/lib/site";

/**
 * Automatic reports: every week or month, the daily job sends the people
 * the Foundation chooses a plain account of the website — what visitors
 * asked the assistant, the gifts made online, what was published and is
 * coming up, what the site check finds, and the emails sent. Every line is
 * counted from the site's own records; nothing is written by AI, so it can
 * go out without anyone checking it first.
 */
export type ReportSettings = {
  enabled: boolean;
  frequency: "weekly" | "monthly";
  /** Mailing-list groups (see lib/mail/data.ts) that receive it. */
  groups: string[];
  /** The site's editors (EDITOR_EMAILS) receive it too. */
  editors: boolean;
  /** When the last one went out (ISO), so a period is never sent twice. */
  lastSent: string | null;
};

const FILE = "reports.enc.json";
export const DEFAULTS: ReportSettings = { enabled: false, frequency: "monthly", groups: ["trustees"], editors: true, lastSent: null };

export const readReportSettings = () => readSealed<ReportSettings>(FILE, DEFAULTS).then((s) => ({ ...DEFAULTS, ...s }));
export const updateReportSettings = (change: (s: ReportSettings) => ReportSettings) =>
  updateSealed<ReportSettings>(FILE, DEFAULTS, (s) => change({ ...DEFAULTS, ...s }), "Automatic report settings");

const IST = "Asia/Kolkata";
const day = (d: Date) => d.toLocaleDateString("en-CA", { timeZone: IST });
const nice = (d: Date) => d.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric", timeZone: IST });
const n = (x: number) => x.toLocaleString("en-IN");
const plural = (x: number, one: string, many = `${one}s`) => `${n(x)} ${x === 1 ? one : many}`;

/** The period a report sent at `now` covers: the past week, or the month that just ended. */
export function periodFor(frequency: ReportSettings["frequency"], now = new Date()): { from: Date; to: Date; label: string } {
  if (frequency === "weekly") {
    const from = new Date(now.getTime() - 7 * 86_400_000);
    return { from, to: now, label: `${nice(from)} – ${nice(new Date(now.getTime() - 86_400_000))}` };
  }
  const [y, m] = day(now).split("-").map(Number);
  // The calendar month before this one, in India time.
  const from = new Date(`${m === 1 ? y - 1 : y}-${String(m === 1 ? 12 : m - 1).padStart(2, "0")}-01T00:00:00+05:30`);
  const to = new Date(`${y}-${String(m).padStart(2, "0")}-01T00:00:00+05:30`);
  return { from, to, label: from.toLocaleDateString("en-IN", { month: "long", year: "numeric", timeZone: IST }) };
}

/** Whether a report is due today: Mondays for weekly, the 1st for monthly — once each. */
export function isDue(s: ReportSettings, now = new Date()): boolean {
  if (!s.enabled) return false;
  const today = day(now);
  if (s.lastSent && day(new Date(s.lastSent)) === today) return false;
  if (s.frequency === "weekly") return new Date(`${today}T12:00:00+05:30`).getUTCDay() === 1;
  return today.endsWith("-01");
}

export type Report = { subject: string; body: string; period: string };

/** The report for a period, from the site's own records. */
export async function buildReport(from: Date, to: Date, label: string, frequency: ReportSettings["frequency"]): Promise<Report> {
  const days = Math.max(1, Math.ceil((Date.now() - from.getTime()) / 86_400_000));
  const inPeriod = (iso: string) => iso >= from.toISOString() && iso < to.toISOString();
  const [asked, analysis, gifts, publishes, scheduled, mail] = await Promise.all([
    readQuestions(days).catch(() => []),
    readAnalysis().catch(() => null),
    readGifts(days).catch(() => []),
    history().catch(() => []),
    listScheduled().catch(() => []),
    readMail().catch(() => ({ contacts: [], sent: [] })),
  ]);
  const questions = asked.filter((a) => inPeriod(a.at));
  const q = summarise(questions, 1);
  const periodGifts = gifts.filter((g) => inPeriod(g.at));
  const completed = periodGifts.filter((g) => g.status === "success");
  const published = publishes.filter((p) => inPeriod(p.date) && p.message.startsWith("Site edit: "));
  const coming = scheduled.filter((s) => s.status === "waiting");
  const sent = mail.sent.filter((s) => inPeriod(s.at));

  // The site check, as the editor's Insights computes it.
  let health: ReturnType<typeof checkSite> | null = null;
  try {
    const { edits } = await readEdits();
    const base = Object.fromEntries(locales.map((l) => [l, baseContent(l as Lang)])) as Trees;
    const published = Object.fromEntries(locales.map((l) => [l, editedContent(l as Lang, edits)])) as Trees;
    health = checkSite(base, published, translatedFields(base));
  } catch {
    health = null;
  }

  const lines: string[] = [`Dear all,`, `Here is the website's ${frequency === "weekly" ? "weekly" : "monthly"} report, for ${label}. Every figure is counted from the website's own records.`];

  lines.push(
    [
      "**Visitors' questions to the AI assistant**",
      questions.length
        ? `- ${plural(questions.length, "question")} — ${n(q.byLang.en ?? 0)} in English, ${n(q.byLang.hi ?? 0)} in Hindi, ${n(q.byLang.kn ?? 0)} in Kannada; ${n(q.spoken)} asked by voice`
        : "- No questions in this period.",
      ...(questions.length ? [`- ${plural(q.deflected, "question")} the website doesn't yet answer (the assistant pointed to the Foundation's email or phone)`] : []),
      ...(analysis?.themes.length ? [`- Asked about most: ${analysis.themes.slice(0, 4).map((t) => `${t.title} (${t.questions.length})`).join("; ")}`] : []),
    ].join("\n"),
  );

  lines.push(
    [
      "**Gifts made on the website**",
      completed.length
        ? `- ${plural(completed.length, "completed gift")} — ₹${n(completed.reduce((sum, g) => sum + g.amount, 0))} in all, as donors' browsers heard from the bank`
        : "- No completed gifts in this period.",
      ...(periodGifts.length - completed.length ? [`- ${plural(periodGifts.length - completed.length, "gift")} started but not completed`] : []),
      "- The Foundation's Apna Dharm account is the record of every gift.",
    ].join("\n"),
  );

  lines.push(
    [
      "**The website**",
      published.length ? `- ${plural(published.length, "change")} published:` : "- No changes published in this period.",
      ...published.slice(0, 8).map((p) => `- ${new Date(p.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", timeZone: IST })}: ${p.message.split("\n")[0].slice(11)}`),
      ...coming.map((c) => `- Coming up on ${new Date(c.date).toLocaleDateString("en-IN", { day: "numeric", month: "long", timeZone: IST })}: ${c.kind === "site" ? c.note || "a scheduled change" : `email “${c.subject}”`}`),
    ].join("\n"),
  );

  if (health) {
    lines.push(
      [
        "**Site check**",
        `- ${plural(health.waiting.length, "fact")} still awaiting the Foundation`,
        `- ${plural(health.behind.length, "translation")} behind the English; ${plural(health.english.length, "field")} showing English on the Hindi or Kannada site`,
        `- ${plural(health.undescribed.length, "photo")} without a description`,
      ].join("\n"),
    );
  }

  lines.push(
    [
      "**Emails sent from the editor**",
      sent.length ? `- ${plural(sent.length, "email")} to ${plural(sent.reduce((sum, s) => sum + s.count, 0), "person", "people")}` : "- None in this period.",
      `- ${plural(mail.contacts.filter((c) => !c.unsubscribed).length, "person", "people")} on the mailing list`,
    ].join("\n"),
  );

  lines.push(`The details are in the site editor's Insights: ${siteUrl.origin}/editor`);
  lines.push(`This report is sent automatically ${frequency === "weekly" ? "every Monday" : "on the 1st of each month"}. It can be changed or turned off in the site editor, under Email updates → Automatic reports.`);
  lines.push("With regards,\nAcharya Shanti Sagar Foundation");

  return { subject: `Website report — ${label}`, body: lines.join("\n\n"), period: label };
}

/** Everyone a report goes to: the chosen groups' subscribers, and the editors if chosen. */
export async function recipients(s: ReportSettings): Promise<{ email: string; listed: boolean }[]> {
  const { contacts } = await readMail();
  const out = new Map<string, boolean>();
  for (const c of contacts) if (!c.unsubscribed && c.groups.some((g) => s.groups.includes(g))) out.set(c.email, true);
  if (s.editors) for (const e of editorEmails()) if (!out.has(e)) out.set(e, false);
  return [...out].map(([email, listed]) => ({ email, listed }));
}

/** Sends a report to `to`. Mailing-list readers get their unsubscribe link; editors turn it off in the editor. */
export async function sendReport(report: Report, to: { email: string; listed: boolean }[]): Promise<{ sent: number; failed: number }> {
  if (mailMode === "none") throw new Error("Email sending isn't connected yet.");
  const site = siteUrl.origin;
  const org = orgForEmail();
  let sent = 0;
  let failed = 0;
  for (const r of to) {
    const unsubscribe = r.listed ? unsubscribeLink(site, r.email) : null;
    const { html, text } = renderEmail({ subject: report.subject, body: report.body, site, unsubscribe, org });
    try {
      await deliver({ to: r.email, subject: report.subject, html, text, replyTo: org.email, unsubscribe, attachment: null });
      sent++;
    } catch {
      failed++;
    }
  }
  return { sent, failed };
}

/** For the daily job: sends the report if one is due today. */
export async function sendDueReport(now = new Date()): Promise<string | null> {
  if (storage === "none" || mailMode === "none") return null;
  const settings = await readReportSettings();
  if (!isDue(settings, now)) return null;
  const { from, to, label } = periodFor(settings.frequency, now);
  const report = await buildReport(from, to, label, settings.frequency);
  const people = await recipients(settings);
  if (!people.length) return "report: nobody to send to";
  const { sent, failed } = await sendReport(report, people);
  await updateReportSettings((s) => ({ ...s, lastSent: now.toISOString() }));
  if (sent) {
    await updateMail(
      (d) => ({ ...d, sent: [{ at: now.toISOString(), subject: report.subject, to: "Automatic report", count: sent, attachment: null }, ...d.sent].slice(0, 200) }),
      "Automatic report sent",
    ).catch(() => {});
  }
  return `report ${label}: sent to ${sent}${failed ? `, ${failed} failed` : ""}`;
}
