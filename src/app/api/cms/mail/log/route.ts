import { editorRequest } from "@/lib/cms/access";
import { updateMail } from "@/lib/mail/data";

export const runtime = "nodejs";

/** Records a finished send (what, to whom, how many) in the Sent list. */
export async function POST(req: Request) {
  const editor = await editorRequest(req);
  if (editor instanceof Response) return editor;
  const b = (await req.json().catch(() => null)) as { subject?: unknown; to?: unknown; count?: unknown; attachment?: unknown } | null;
  if (typeof b?.subject !== "string" || typeof b.count !== "number") return new Response("Invalid record.", { status: 400 });
  const record = {
    at: new Date().toISOString(),
    subject: b.subject.slice(0, 200),
    to: typeof b.to === "string" ? b.to.slice(0, 120) : "",
    count: Math.max(0, Math.floor(b.count)),
    attachment: typeof b.attachment === "string" ? b.attachment.slice(0, 100) : null,
  };
  try {
    const data = await updateMail((d) => ({ ...d, sent: [record, ...d.sent].slice(0, 200) }), "Update sent");
    return Response.json({ sent: data.sent });
  } catch (err) {
    console.error("Mail log failed", err);
    return new Response("Sent, but the record couldn't be saved.", { status: 502 });
  }
}
