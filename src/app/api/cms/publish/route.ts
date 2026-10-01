import { editorRequest } from "@/lib/cms/access";
import type { Op } from "@/lib/cms/edits";
import { BLOB, Invalid, publishOps, Stale, UPLOAD } from "@/lib/cms/publish";
import { Conflict, storage } from "@/lib/cms/store";

export const runtime = "nodejs";

const MAX_BODY = 3 * 1024 * 1024;

type Body = { baseRevision?: unknown; ops?: unknown; images?: unknown; note?: unknown; proposals?: unknown };

/**
 * Publishes the editor's changes: checked against the content as it stands
 * on GitHub now, merged into the published edits, and committed (with any
 * new photographs) as one commit, which Vercel then deploys.
 */
export async function POST(req: Request) {
  const editor = await editorRequest(req);
  if (editor instanceof Response) return editor;
  if (storage === "none") return new Response("Publishing isn't connected yet.", { status: 503 });

  const raw = await req.text();
  if (raw.length > MAX_BODY) return new Response("Too much in one publish — publish in smaller parts.", { status: 413 });
  let body: Body;
  try {
    body = JSON.parse(raw) as Body;
  } catch {
    return new Response("Invalid request.", { status: 400 });
  }
  const baseRevision = typeof body.baseRevision === "number" ? body.baseRevision : -1;
  const ops = body.ops as Op[];
  const note = typeof body.note === "string" ? body.note.replace(/\s+/g, " ").trim().slice(0, 140) : "";
  // AI-prepared proposals this draft includes, recorded so they can't be published again from a chat.
  const proposals = (Array.isArray(body.proposals) ? body.proposals : []).filter((id): id is string => typeof id === "string" && /^[\w-]{8,64}$/.test(id)).slice(0, 20);
  const images = (Array.isArray(body.images) ? body.images : []).filter(
    (i): i is { path: string; blob: string | null } =>
      !!i && typeof i.path === "string" && UPLOAD.test(i.path) && (storage === "local" || (typeof i.blob === "string" && BLOB.test(i.blob))),
  );
  if (!Array.isArray(ops) || !ops.length) return new Response("There's nothing to publish.", { status: 400 });

  try {
    const { edits, commit } = await publishOps(ops, images, { note, proposals, expect: baseRevision });
    // Who published stays in the server logs, not in the public history.
    console.info("CMS publish", { revision: edits.revision, commit, editor: editor.email, changes: ops.length });
    return Response.json({ edits, commit });
  } catch (err) {
    if (err instanceof Stale) {
      return Response.json(
        { error: "Someone else published changes while you were editing. Reload to see them — your changes are kept.", revision: err.revision },
        { status: 409 },
      );
    }
    if (err instanceof Invalid) return new Response(err.message, { status: 400 });
    if (err instanceof Conflict) return new Response("The site changed while publishing. Please try again.", { status: 409 });
    console.error("CMS publish failed", err);
    return new Response("Publishing failed. Please try again in a moment.", { status: 502 });
  }
}
