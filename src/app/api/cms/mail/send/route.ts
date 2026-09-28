import { editorRequest } from "@/lib/cms/access";
import { normalise, readMail } from "@/lib/mail/data";
import { orgForEmail } from "@/lib/mail/org";
import { renderEmail } from "@/lib/mail/render";
import { deliver, mailMode, unsubscribeLink } from "@/lib/mail/send";
import { originOf } from "@/lib/mcp/oauth";
import { siteUrl } from "@/lib/site";

export const runtime = "nodejs";
export const maxDuration = 60;

/** At most this many people per request: the editor sends a long list in batches, with progress. */
const BATCH = 20;
const MAX_ATTACHMENT = 3 * 1024 * 1024;
const TYPES = new Set(["application/pdf", "image/jpeg", "image/png", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/msword"]);

type Body = {
  subject?: unknown;
  body?: unknown;
  to?: unknown;
  test?: unknown;
  attachment?: { name?: unknown; type?: unknown; data?: unknown } | null;
};

/**
 * Sends an update to a batch of people on the mailing list — or, as a
 * test, to the editor alone. Only addresses on the list can be sent to,
 * and anyone who unsubscribed is skipped.
 */
export async function POST(req: Request) {
  const editor = await editorRequest(req);
  if (editor instanceof Response) return editor;
  if (mailMode === "none") return new Response("Email sending isn't connected yet.", { status: 503 });

  const b = (await req.json().catch(() => null)) as Body | null;
  const subject = typeof b?.subject === "string" ? b.subject.replace(/\s+/g, " ").trim().slice(0, 200) : "";
  const text = typeof b?.body === "string" ? b.body.slice(0, 20_000) : "";
  if (!subject || !text.trim()) return new Response("Write a subject and a message first.", { status: 400 });

  let attachment: { filename: string; contentType: string; content: Buffer } | null = null;
  if (b?.attachment && typeof b.attachment.data === "string") {
    const content = Buffer.from(b.attachment.data, "base64");
    const contentType = String(b.attachment.type ?? "");
    if (content.length > MAX_ATTACHMENT) return new Response("The attachment is larger than 3 MB.", { status: 413 });
    if (!TYPES.has(contentType)) return new Response("Attach a PDF, Word document or photo.", { status: 415 });
    const filename = String(b.attachment.name ?? "report").replace(/[^\w.\- ()]/g, "_").slice(0, 100);
    attachment = { filename, contentType, content };
  }

  const site = mailMode === "smtp" ? siteUrl.origin : originOf(req);
  const org = orgForEmail();
  const send = async (to: string, unsubscribe: string | null) => {
    const { html, text: plain } = renderEmail({ subject, body: text, site, unsubscribe, attachment: attachment?.filename, org });
    await deliver({ to, subject, html, text: plain, replyTo: org.email, unsubscribe, attachment });
  };

  if (b?.test === true) {
    try {
      await send(editor.email, `${site}/unsubscribe?t=preview`);
      return Response.json({ sent: [editor.email], skipped: [], failed: [] });
    } catch (err) {
      console.error("Mail test failed", err);
      return new Response(`The test couldn't be sent: ${err instanceof Error ? err.message : "unknown error"}`, { status: 502 });
    }
  }

  const to = (Array.isArray(b?.to) ? b.to : []).filter((e): e is string => typeof e === "string").map(normalise);
  if (!to.length) return new Response("Choose who to send it to.", { status: 400 });
  if (to.length > BATCH) return new Response(`Send at most ${BATCH} at a time.`, { status: 413 });

  const { contacts } = await readMail();
  const byEmail = new Map(contacts.map((c) => [c.email, c]));
  const sent: string[] = [];
  const skipped: string[] = [];
  const failed: { email: string; error: string }[] = [];
  for (const email of [...new Set(to)]) {
    const contact = byEmail.get(email);
    if (!contact || contact.unsubscribed) {
      skipped.push(email);
      continue;
    }
    try {
      await send(email, unsubscribeLink(site, email));
      sent.push(email);
    } catch (err) {
      failed.push({ email, error: err instanceof Error ? err.message.slice(0, 160) : "failed" });
    }
  }
  console.info("Mail batch", { editor: editor.email, sent: sent.length, skipped: skipped.length, failed: failed.length });
  return Response.json({ sent, skipped, failed });
}
