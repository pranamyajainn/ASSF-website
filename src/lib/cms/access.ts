import "server-only";
import { auth } from "@/auth";
import { devEditor, isEditorEmail } from "./editors";

export type Editor = { email: string; name: string };

/** The signed-in editor, re-checked against the allowlist on every call — or null. */
export async function currentEditor(): Promise<Editor | null> {
  if (devEditor) return { email: devEditor, name: "Local editor" };
  // Without AUTH_SECRET Auth.js throws; that just means nobody is signed in.
  const session = await auth().catch(() => null);
  const email = session?.user?.email;
  if (!email || !isEditorEmail(email)) return null;
  return { email, name: session.user?.name ?? email };
}

/**
 * For the editor's API routes: the editor, or a response to send instead.
 * Requests must come from the site's own pages (the session cookie alone
 * isn't taken as intent).
 */
export async function editorRequest(req: Request): Promise<Editor | Response> {
  const origin = req.headers.get("origin");
  const site = req.headers.get("sec-fetch-site");
  let sameOrigin = true;
  try {
    if (origin) sameOrigin = new URL(origin).host === new URL(req.url).host;
  } catch {
    sameOrigin = false;
  }
  if (!sameOrigin || (site && site !== "same-origin")) return new Response("Forbidden.", { status: 403 });
  const editor = await currentEditor();
  if (!editor) return new Response("Please sign in again.", { status: 401 });
  return editor;
}
