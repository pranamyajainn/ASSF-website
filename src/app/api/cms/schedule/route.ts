import { editorRequest } from "@/lib/cms/access";
import type { Op } from "@/lib/cms/edits";
import { BLOB, checkOps, UPLOAD } from "@/lib/cms/publish";
import { PAGES } from "@/lib/cms/schema";
import { cancelScheduled, listScheduled, scheduleEmail, scheduleSite, todayInIndia, type Scheduled } from "@/lib/cms/schedule";
import { storage } from "@/lib/cms/store";
import { FILE_TYPES, MAX_FILE } from "@/lib/mail/files";
import { GROUPS } from "@/lib/mail/data";

export const runtime = "nodejs";

const MAX_BODY = 5 * 1024 * 1024;
const DATE = /^\d{4}-\d{2}-\d{2}$/;

/** What the editor shows of a scheduled item: enough to recognise it, not the whole change. */
function view(item: Scheduled) {
  const common = { id: item.id, kind: item.kind, date: item.date, status: item.status, result: item.result ?? null, created: item.created, finished: item.finished ?? null };
  if (item.kind === "site") {
    const pages = [...new Set(item.ops.map((o) => PAGES.find((p) => p.module === o.path[0])?.title ?? String(o.path[0])))];
    return { ...common, title: item.note || `${pages.join(", ")} (${new Set(item.ops.map((o) => JSON.stringify(o.path))).size} changes)` };
  }
  const groups = GROUPS.filter((g) => item.groups.includes(g.id)).map((g) => g.name);
  return { ...common, title: item.subject, detail: [...groups, ...(item.people.length ? [`${item.people.length} chosen`] : [])].join(" + ") };
}

function validDate(date: unknown): date is string {
  if (typeof date !== "string" || !DATE.test(date) || Number.isNaN(Date.parse(date))) return false;
  const today = todayInIndia();
  const limit = todayInIndia(new Date(Date.now() + 366 * 86_400_000));
  return date > today && date <= limit;
}

export async function GET(req: Request) {
  const editor = await editorRequest(req);
  if (editor instanceof Response) return editor;
  if (storage === "none") return Response.json({ items: [] });
  try {
    return Response.json({ items: (await listScheduled()).map(view) });
  } catch (err) {
    console.error("Schedule read failed", err);
    return new Response("The schedule couldn't be read.", { status: 502 });
  }
}

/** Schedules a site change ({kind: "site", ops, images, note, proposals, date}) or an email ({kind: "email", …}). */
export async function POST(req: Request) {
  const editor = await editorRequest(req);
  if (editor instanceof Response) return editor;
  if (storage === "none") return new Response("Scheduling isn't connected yet.", { status: 503 });
  const raw = await req.text();
  if (raw.length > MAX_BODY) return new Response("That's too large to schedule.", { status: 413 });
  let b: Record<string, unknown>;
  try {
    b = JSON.parse(raw);
  } catch {
    return new Response("Invalid request.", { status: 400 });
  }
  if (!validDate(b.date)) return new Response("Choose a day after today, within a year.", { status: 400 });

  try {
    if (b.kind === "site") {
      const ops = b.ops as Op[];
      if (!Array.isArray(ops) || !ops.length) return new Response("There's nothing to schedule.", { status: 400 });
      const images = (Array.isArray(b.images) ? b.images : []).filter(
        (i): i is { path: string; blob: string | null } =>
          !!i && typeof i.path === "string" && UPLOAD.test(i.path) && (storage === "local" || (typeof i.blob === "string" && BLOB.test(i.blob))),
      );
      const problem = await checkOps(ops, images);
      if (problem) return new Response(problem, { status: 400 });
      const note = typeof b.note === "string" ? b.note.replace(/\s+/g, " ").trim().slice(0, 140) : "";
      const proposals = (Array.isArray(b.proposals) ? b.proposals : []).filter((id): id is string => typeof id === "string" && /^[\w-]{8,64}$/.test(id)).slice(0, 20);
      const items = await scheduleSite({ ops, images, note, proposals, date: b.date, by: editor.email });
      console.info("CMS scheduled", { editor: editor.email, date: b.date, changes: ops.length });
      return Response.json({ items: items.map(view) });
    }
    if (b.kind === "email") {
      const subject = typeof b.subject === "string" ? b.subject.replace(/\s+/g, " ").trim().slice(0, 200) : "";
      const body = typeof b.body === "string" ? b.body.slice(0, 20_000) : "";
      if (!subject || !body.trim()) return new Response("Write a subject and a message first.", { status: 400 });
      const groups = (Array.isArray(b.groups) ? b.groups : []).filter((g): g is string => GROUPS.some((x) => x.id === g));
      const people = (Array.isArray(b.people) ? b.people : []).filter((p): p is string => typeof p === "string").slice(0, 2000);
      if (!groups.length && !people.length) return new Response("Choose who to send it to.", { status: 400 });
      const a = b.attachment as { name?: unknown; type?: unknown; data?: unknown } | null;
      let attachment: { name: string; type: string; data: string } | null = null;
      if (a && typeof a.data === "string") {
        if (Buffer.byteLength(a.data, "base64") > MAX_FILE) return new Response("The attachment is larger than 3 MB.", { status: 413 });
        if (!FILE_TYPES.has(String(a.type))) return new Response("Attach a PDF, Word document or photo.", { status: 415 });
        attachment = { name: String(a.name ?? "report").slice(0, 100), type: String(a.type), data: a.data };
      }
      const items = await scheduleEmail({ subject, body, groups, people, attachment, date: b.date, by: editor.email });
      return Response.json({ items: items.map(view) });
    }
    return new Response("Invalid request.", { status: 400 });
  } catch (err) {
    console.error("Scheduling failed", err);
    return new Response("It couldn't be scheduled. Please try again.", { status: 502 });
  }
}

export async function DELETE(req: Request) {
  const editor = await editorRequest(req);
  if (editor instanceof Response) return editor;
  const id = new URL(req.url).searchParams.get("id") ?? "";
  if (!/^[0-9a-f-]{36}$/.test(id)) return new Response("Invalid request.", { status: 400 });
  try {
    return Response.json({ items: (await cancelScheduled(id)).map(view) });
  } catch (err) {
    console.error("Cancel failed", err);
    return new Response("It couldn't be cancelled. Please try again.", { status: 502 });
  }
}
