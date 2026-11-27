import "server-only";
import { after } from "next/server";
import { appendLine, readLines } from "@/lib/data/lines";

/**
 * What happens in the site editor, kept for good: who signed in, opened the
 * editor, published (or tried to), scheduled, restored or sent an email, and
 * when. Server logs on the current Vercel plan last about an hour; this is
 * the lasting record, so "who changed what, last month" has an answer.
 *
 * Sealed day files on the private-data branch (`activity/`), like visitor
 * questions, and never deleted. Every editor sees it under History, and the
 * AI connector reads it (get_editor_activity).
 */
const DIR = "activity";

export type Activity = { at: string; who: string; did: string; detail?: string };

/** Records an action once the response has gone, so it never slows or fails the action itself. */
export function logActivity(who: string, did: string, detail?: string): void {
  const entry: Activity = { at: new Date().toISOString(), who, did, ...(detail ? { detail: detail.slice(0, 300) } : {}) };
  const write = () => appendLine(DIR, entry, "Editor activity");
  try {
    after(write);
  } catch {
    // Outside a request (a script, a test): write it now.
    void write();
  }
}

/** The last `days` days, newest first. */
export async function readActivity(days: number): Promise<Activity[]> {
  return (await readLines<Activity>(DIR, days)).sort((a, b) => b.at.localeCompare(a.at));
}
