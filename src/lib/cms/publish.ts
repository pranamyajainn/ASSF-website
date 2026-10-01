import "server-only";
import { baseContent, editedContent } from "@/i18n/content";
import { locales, type Lang } from "@/i18n/config";
import { mergeOps, type Edits, type Op } from "./edits";
import { PAGES } from "./schema";
import { readEdits, withApplied, withRetry, writeEdits } from "./store";
import { shapeOf, validateOps } from "./validate";

/** The site moved on since the editor opened it (only when a revision is expected). */
export class Stale extends Error {
  constructor(readonly revision: number) {
    super("stale");
  }
}

/** The changes don't fit the site as it stands now. */
export class Invalid extends Error {}

/** A photograph uploaded in the editor, and the GitHub blob holding it. */
export const UPLOAD = /^\/images\/uploads\/\d{4}\/[a-z0-9-]+\.jpg$/;
export const BLOB = /^[0-9a-f]{40}$/;

export type Images = readonly { path: string; blob: string | null }[];

/**
 * Publishes changes: checked against the content as it stands on GitHub
 * now, merged into the published edits, and committed (with any new
 * photographs) as one commit, which Vercel then deploys. Used by the
 * editor's Publish (which expects the revision it opened) and by scheduled
 * publishing (which goes on top of whatever is there by then).
 */
export async function publishOps(
  ops: Op[],
  images: Images,
  options: { note: string; proposals?: string[]; expect?: number; scheduled?: string },
): Promise<{ edits: Edits; commit: string | null }> {
  return withRetry(async () => {
    const { edits: head, commit } = await readEdits();
    if (options.expect !== undefined && head.revision !== options.expect) throw new Stale(head.revision);

    const base = Object.fromEntries(locales.map((l) => [l, baseContent(l)])) as Record<Lang, unknown>;
    const published = Object.fromEntries(locales.map((l) => [l, editedContent(l, head)])) as Record<Lang, unknown>;
    const shape = shapeOf([...Object.values(base), ...Object.values(published)]);
    const problem = validateOps(ops, published, shape, new Set(images.map((i) => i.path)));
    if (problem) throw new Invalid(problem);

    const next: Edits = {
      revision: head.revision + 1,
      updatedAt: new Date().toISOString(),
      ops: mergeOps(head.ops, ops),
      applied: withApplied(head.applied, options.proposals ?? []),
    };
    // Only photographs the published edits actually use are committed.
    const text = JSON.stringify(next.ops);
    const used = images.filter((i) => text.includes(JSON.stringify(i.path)) && i.blob) as { path: string; blob: string }[];

    const pages = [...new Set(ops.map((o) => PAGES.find((p) => p.module === o.path[0])?.title ?? String(o.path[0])))];
    const summary = options.note || `${pages.join(", ")} (${ops.length} change${ops.length === 1 ? "" : "s"})`;
    const message = `Site edit: ${summary}\n\n${options.scheduled ? `Scheduled in the site editor for ${options.scheduled}.` : "Published from the site editor."}`;
    const sha = await writeEdits(next, used, message, commit);
    return { edits: next, commit: sha };
  });
}

/** What would stop these changes publishing on the site as it stands now, if anything. */
export async function checkOps(ops: Op[], images: Images): Promise<string | null> {
  const { edits: head } = await readEdits();
  const base = Object.fromEntries(locales.map((l) => [l, baseContent(l)])) as Record<Lang, unknown>;
  const published = Object.fromEntries(locales.map((l) => [l, editedContent(l, head)])) as Record<Lang, unknown>;
  return validateOps(ops, published, shapeOf([...Object.values(base), ...Object.values(published)]), new Set(images.map((i) => i.path)));
}
