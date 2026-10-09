import "server-only";
import { appendLine, readLines } from "@/lib/data/lines";
import type { Lang } from "@/i18n/config";

/**
 * What visitors ask the AI assistant — kept so the Foundation can see what
 * people want to know, and what the site doesn't yet tell them.
 *
 * Only the question, the answer and the page it was asked from are kept:
 * never an address, a name from the browser, or anything else about who
 * asked. Each day is a file on the private-data branch; each line in it is
 * encrypted on its own (the key of the mailing list), so adding a question
 * leaves the earlier lines untouched. Files older than a year are removed
 * by the daily job (app/api/cron/daily).
 */
export type Asked = {
  at: string;
  lang: Lang;
  /** The page the question was asked from, e.g. "/hi/conservation". */
  page: string | null;
  q: string;
  a: string;
  spoken: boolean;
  /** The pages the answer drew on. */
  sources: string[];
  /** The answer pointed to the Foundation's email or phone: likely the site doesn't say. */
  deflected: boolean;
};

export const KEEP_DAYS = 365;
const DIR = "questions";

const day = (d: Date) => d.toISOString().slice(0, 10);

/** Keeps one question. Never throws: a lost log line must not cost a visitor their answer. */
export async function logQuestion(entry: Omit<Asked, "at">): Promise<void> {
  await appendLine(DIR, { ...entry, at: new Date().toISOString() } satisfies Asked, "Visitor question");
}

/** The questions of the last `days` days, newest first. */
export async function readQuestions(days: number): Promise<Asked[]> {
  return (await readLines<Asked>(DIR, Math.min(days, KEEP_DAYS))).sort((a, b) => b.at.localeCompare(a.at));
}

/** Day files past the keeping period, for the daily job to remove. */
export function expiredQuestionFiles(paths: readonly string[], now = new Date()): string[] {
  const cutoff = day(new Date(now.getTime() - KEEP_DAYS * 86_400_000));
  return paths.filter((p) => {
    const m = /^questions\/(\d{4}-\d{2}-\d{2})\.jsonl$/.exec(p);
    return m && m[1] < cutoff;
  });
}
