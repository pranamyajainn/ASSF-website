import { editorRequest } from "@/lib/cms/access";
import { GROUPS, readMail } from "@/lib/mail/data";
import { orgForEmail } from "@/lib/mail/org";
import { DAILY_LIMIT, mailMode, sender } from "@/lib/mail/send";

export const runtime = "nodejs";

/** The mailing list, what was sent, and how sending is set up — for the editor's Email updates. */
export async function GET(req: Request) {
  const editor = await editorRequest(req);
  if (editor instanceof Response) return editor;
  try {
    const data = await readMail();
    return Response.json(
      { ...data, groups: GROUPS, mode: mailMode, sender: mailMode === "smtp" ? sender : null, dailyLimit: DAILY_LIMIT, org: orgForEmail(), me: editor.email },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (err) {
    console.error("Mail data read failed", err);
    return new Response("The mailing list couldn't be loaded.", { status: 502 });
  }
}
