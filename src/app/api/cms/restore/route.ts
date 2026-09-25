import { editorRequest } from "@/lib/cms/access";
import type { Edits } from "@/lib/cms/edits";
import { Conflict, readEdits, storage, withRetry, writeEdits } from "@/lib/cms/store";

export const runtime = "nodejs";

/**
 * Brings back the site as it was after an earlier publish — as a new
 * publish on top, so nothing in the history is lost and it can be undone
 * the same way.
 */
export async function POST(req: Request) {
  const editor = await editorRequest(req);
  if (editor instanceof Response) return editor;
  if (storage !== "github") return new Response("History is only kept when publishing to GitHub.", { status: 503 });

  const { sha, date } = (await req.json().catch(() => ({}))) as { sha?: unknown; date?: unknown };
  if (typeof sha !== "string" || !/^[0-9a-f]{40}$/.test(sha)) return new Response("Invalid version.", { status: 400 });

  try {
    return await withRetry(async () => {
      const [{ edits: head, commit }, { edits: old }] = await Promise.all([readEdits(), readEdits(sha)]);
      const next: Edits = { revision: head.revision + 1, updatedAt: new Date().toISOString(), ops: old.ops };
      const when = typeof date === "string" ? new Date(date).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Kolkata" }) : sha.slice(0, 7);
      const written = await writeEdits(next, [], `Site edit: restored the version of ${when}\n\nPublished from the site editor.`, commit);
      console.info("CMS restore", { revision: next.revision, from: sha, commit: written, editor: editor.email });
      return Response.json({ edits: next, commit: written });
    });
  } catch (err) {
    if (err instanceof Conflict) return new Response("The site changed while restoring. Please try again.", { status: 409 });
    console.error("CMS restore failed", err);
    return new Response("Restoring failed. Please try again in a moment.", { status: 502 });
  }
}
