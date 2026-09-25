import { baseContent, editedContent } from "@/i18n/content";
import { locales, type Lang } from "@/i18n/config";
import { editorRequest } from "@/lib/cms/access";
import { mergeOps, type Edits, type Op } from "@/lib/cms/edits";
import { PAGES } from "@/lib/cms/schema";
import { Conflict, readEdits, storage, withApplied, withRetry, writeEdits } from "@/lib/cms/store";
import { shapeOf, validateOps } from "@/lib/cms/validate";

export const runtime = "nodejs";

const MAX_BODY = 3 * 1024 * 1024;
const UPLOAD = /^\/images\/uploads\/\d{4}\/[a-z0-9-]+\.jpg$/;
const BLOB = /^[0-9a-f]{40}$/;

class Stale extends Error {
  constructor(readonly revision: number) {
    super("stale");
  }
}

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
    return await withRetry(async () => {
      const { edits: head, commit } = await readEdits();
      if (head.revision !== baseRevision) throw new Stale(head.revision);

      const base = Object.fromEntries(locales.map((l) => [l, baseContent(l)])) as Record<Lang, unknown>;
      const published = Object.fromEntries(locales.map((l) => [l, editedContent(l, head)])) as Record<Lang, unknown>;
      const shape = shapeOf([...Object.values(base), ...Object.values(published)]);
      const problem = validateOps(ops, published, shape, new Set(images.map((i) => i.path)));
      if (problem) return new Response(problem, { status: 400 });

      const next: Edits = {
        revision: head.revision + 1,
        updatedAt: new Date().toISOString(),
        ops: mergeOps(head.ops, ops),
        applied: withApplied(head.applied, proposals),
      };
      // Only photographs the published edits actually use are committed.
      const text = JSON.stringify(next.ops);
      const used = images.filter((i) => text.includes(JSON.stringify(i.path)) && i.blob) as { path: string; blob: string }[];

      const pages = [...new Set(ops.map((o) => PAGES.find((p) => p.module === o.path[0])?.title ?? String(o.path[0])))];
      const message = `Site edit: ${note || `${pages.join(", ")} (${ops.length} change${ops.length === 1 ? "" : "s"})`}\n\nPublished from the site editor.`;
      const sha = await writeEdits(next, used, message, commit);
      // Who published stays in the server logs, not in the public history.
      console.info("CMS publish", { revision: next.revision, commit: sha, editor: editor.email, changes: ops.length });
      return Response.json({ edits: next, commit: sha });
    });
  } catch (err) {
    if (err instanceof Stale) {
      return Response.json(
        { error: "Someone else published changes while you were editing. Reload to see them — your changes are kept.", revision: err.revision },
        { status: 409 },
      );
    }
    if (err instanceof Conflict) return new Response("The site changed while publishing. Please try again.", { status: 409 });
    console.error("CMS publish failed", err);
    return new Response("Publishing failed. Please try again in a moment.", { status: 502 });
  }
}
