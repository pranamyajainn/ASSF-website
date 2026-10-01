import "server-only";
import { randomUUID } from "node:crypto";
import { seal, unseal } from "@/lib/data/sealed";
import { GROUPS, normalise, readMail, updateMail } from "@/lib/mail/data";
import { orgForEmail } from "@/lib/mail/org";
import { renderEmail } from "@/lib/mail/render";
import { DAILY_LIMIT, deliver, mailMode, unsubscribeLink } from "@/lib/mail/send";
import { siteUrl } from "@/lib/site";
import type { Op } from "./edits";
import { Invalid, publishOps } from "./publish";
import { readDataFile, storage, withRetry, writeDataFiles, type DataChange } from "./store";

/**
 * Things set to happen on a later day: changes to the site (an announcement
 * for the morning of an event) and emails (a newsletter for the first of
 * the month). Kept, encrypted, on the private-data branch; the daily job
 * (app/api/cron/daily) carries out whatever is due at about 6 a.m. India
 * time. A scheduled change is checked again when it publishes, against the
 * site as it is by then.
 */
type Common = { id: string; date: string; by: string; created: string; status: "waiting" | "done" | "failed"; result?: string; finished?: string };
export type ScheduledSite = Common & {
  kind: "site";
  ops: Op[];
  images: { path: string; blob: string | null }[];
  note: string;
  proposals: string[];
};
export type ScheduledEmail = Common & {
  kind: "email";
  subject: string;
  body: string;
  groups: string[];
  people: string[];
  /** The attachment is kept in a file of its own (`scheduled/<id>.enc.json`). */
  attachment: { name: string; type: string } | null;
  /** Addresses already sent to, when a long list spans more than one day. */
  sentTo: string[];
};
export type Scheduled = ScheduledSite | ScheduledEmail;

const FILE = "schedule.enc.json";
const attachmentFile = (id: string) => `scheduled/${id}.enc.json`;
const photoFile = (id: string, path: string) => `scheduled/${id}/${path.split("/").pop()}`;
/** Gmail sends about one a second; a daily run sends at most this many, and carries on the next day. */
const PER_RUN = 200;

/** Today, in India: "2026-10-05". */
export function todayInIndia(now = new Date()): string {
  return now.toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
}

async function read(): Promise<{ items: Scheduled[]; head: string | null }> {
  const { text, head } = await readDataFile(FILE);
  return { items: text ? unseal<{ items: Scheduled[] }>(text).items : [], head };
}

export async function listScheduled(): Promise<Scheduled[]> {
  return (await read()).items;
}

/** Changes the list, and writes any files that go with it, as one commit. */
async function change(edit: (items: Scheduled[]) => { items: Scheduled[]; files?: DataChange[] }, message: string): Promise<Scheduled[]> {
  return withRetry(async () => {
    const { items, head } = await read();
    const next = edit(items);
    // Finished items are kept a while, to show what happened.
    const kept = [...next.items.filter((i) => i.status === "waiting"), ...next.items.filter((i) => i.status !== "waiting").slice(-30)];
    await writeDataFiles([{ path: FILE, text: seal({ items: kept }) }, ...(next.files ?? [])], message, head);
    return kept;
  });
}

const sorted = (items: Scheduled[]) => [...items].sort((a, b) => a.date.localeCompare(b.date) || a.created.localeCompare(b.created));

export async function scheduleSite(input: Omit<ScheduledSite, keyof Common | "kind"> & { date: string; by: string }): Promise<Scheduled[]> {
  const item: ScheduledSite = { kind: "site", id: randomUUID(), status: "waiting", created: new Date().toISOString(), ...input };
  // New photographs are held on the private branch until the day, so GitHub keeps them.
  const files: DataChange[] = storage === "github" ? item.images.filter((i) => i.blob).map((i) => ({ path: photoFile(item.id, i.path), blob: i.blob! })) : [];
  return sorted(await change((items) => ({ items: [...items, item], files }), "Scheduled a site change"));
}

export async function scheduleEmail(
  input: Omit<ScheduledEmail, keyof Common | "kind" | "sentTo" | "attachment"> & {
    date: string;
    by: string;
    attachment: { name: string; type: string; data: string } | null;
  },
): Promise<Scheduled[]> {
  const { attachment, ...rest } = input;
  const item: ScheduledEmail = {
    kind: "email",
    id: randomUUID(),
    status: "waiting",
    created: new Date().toISOString(),
    sentTo: [],
    ...rest,
    attachment: attachment ? { name: attachment.name, type: attachment.type } : null,
  };
  const files: DataChange[] = attachment ? [{ path: attachmentFile(item.id), text: seal(attachment) }] : [];
  return sorted(await change((items) => ({ items: [...items, item], files }), "Scheduled an email"));
}

function filesOf(item: Scheduled): DataChange[] {
  if (item.kind === "email") return item.attachment ? [{ path: attachmentFile(item.id), remove: true }] : [];
  return storage === "github" ? item.images.filter((i) => i.blob).map((i) => ({ path: photoFile(item.id, i.path), remove: true as const })) : [];
}

export async function cancelScheduled(id: string): Promise<Scheduled[]> {
  return sorted(
    await change((items) => {
      const item = items.find((i) => i.id === id && i.status === "waiting");
      return { items: items.filter((i) => i !== item), files: item ? filesOf(item) : [] };
    }, "Cancelled a scheduled item"),
  );
}

/** "Newsletter + 3 chosen (scheduled)", for the Sent list. */
function audience(item: ScheduledEmail): string {
  const names = [...GROUPS.filter((g) => item.groups.includes(g.id)).map((g) => g.name), ...(item.people.length ? [`${item.people.length} chosen`] : [])];
  return `${names.join(" + ")} (scheduled)`;
}

async function sendEmail(item: ScheduledEmail): Promise<{ done: boolean; sent: string[]; failed: string[] }> {
  if (mailMode === "none") throw new Error("Email sending isn't connected yet.");
  const { contacts } = await readMail();
  const already = new Set(item.sentTo);
  const recipients = contacts
    .filter((c) => !c.unsubscribed && (c.groups.some((g) => item.groups.includes(g)) || item.people.map(normalise).includes(c.email)))
    .map((c) => c.email)
    .filter((e) => !already.has(e));
  let attachment: { filename: string; contentType: string; content: Buffer } | null = null;
  if (item.attachment) {
    const { text } = await readDataFile(attachmentFile(item.id));
    if (text) {
      const a = unseal<{ name: string; type: string; data: string }>(text);
      attachment = { filename: a.name.replace(/[^\w.\- ()]/g, "_").slice(0, 100), contentType: a.type, content: Buffer.from(a.data, "base64") };
    }
  }
  const site = siteUrl.origin;
  const org = orgForEmail();
  const batch = recipients.slice(0, Math.min(PER_RUN, DAILY_LIMIT));
  const sent: string[] = [];
  const failed: string[] = [];
  for (const to of batch) {
    const unsubscribe = unsubscribeLink(site, to);
    const { html, text } = renderEmail({ subject: item.subject, body: item.body, site, unsubscribe, attachment: attachment?.filename, org });
    try {
      await deliver({ to, subject: item.subject, html, text, replyTo: org.email, unsubscribe, attachment });
      sent.push(to);
    } catch {
      failed.push(to);
    }
  }
  return { done: recipients.length <= batch.length, sent, failed };
}

/**
 * Carries out everything due by today, one at a time, and records how each
 * went. Returns a short account for the job's log.
 */
export async function runDue(now = new Date()): Promise<string[]> {
  const today = todayInIndia(now);
  const due = (await listScheduled()).filter((i) => i.status === "waiting" && i.date <= today);
  const log: string[] = [];
  for (const item of due) {
    let update: Partial<Scheduled> = {};
    let finished = true;
    try {
      if (item.kind === "site") {
        const { edits } = await publishOps(item.ops, item.images, { note: item.note, proposals: item.proposals, scheduled: item.date });
        update = { status: "done", result: `Published (revision ${edits.revision}).` };
      } else {
        const { done, sent, failed } = await sendEmail(item);
        const total = item.sentTo.length + sent.length;
        if (sent.length) {
          await updateMail(
            (d) => ({
              ...d,
              sent: [
                { at: new Date().toISOString(), subject: item.subject, to: audience(item), count: sent.length, attachment: item.attachment?.name ?? null },
                ...d.sent,
              ].slice(0, 200),
            }),
            "Scheduled email sent",
          );
        }
        finished = done;
        update = {
          sentTo: [...item.sentTo, ...sent],
          status: done ? (failed.length && !total ? "failed" : "done") : "waiting",
          result: done
            ? `Sent to ${total} ${total === 1 ? "person" : "people"}${failed.length ? `; couldn't reach ${failed.length}` : ""}.`
            : `Sent to ${total} so far; the rest go out tomorrow (the account's daily limit).`,
        };
      }
    } catch (err) {
      update = { status: "failed", result: err instanceof Invalid ? `Not published: ${err.message}` : err instanceof Error ? err.message.slice(0, 200) : "Failed." };
    }
    const at = new Date().toISOString();
    await change(
      (items) => ({
        items: items.map((i) => (i.id === item.id ? ({ ...i, ...update, ...(finished ? { finished: at } : {}) } as Scheduled) : i)),
        files: finished ? filesOf(item) : [],
      }),
      `Scheduled ${item.kind === "site" ? "change" : "email"}: ${update.status}`,
    );
    log.push(`${item.kind} ${item.id}: ${update.result}`);
  }
  return log;
}
