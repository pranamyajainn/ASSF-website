import "server-only";
import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";
import { listDataFiles, readDataBlob, readDataFile, storage, withRetry, writeDataFile } from "@/lib/cms/store";
import { key } from "@/lib/mail/data";
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
const fileFor = (d: string) => `${DIR}/${d}.jsonl`;

function sealLine(value: unknown): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key(), iv);
  const data = Buffer.concat([cipher.update(JSON.stringify(value), "utf8"), cipher.final()]);
  return [iv, cipher.getAuthTag(), data].map((b) => b.toString("base64")).join(".");
}

function openLine(line: string): unknown {
  const [iv, tag, data] = line.split(".").map((p) => Buffer.from(p, "base64"));
  const decipher = createDecipheriv("aes-256-gcm", key(), iv);
  decipher.setAuthTag(tag);
  return JSON.parse(Buffer.concat([decipher.update(data), decipher.final()]).toString("utf8"));
}

/** Keeps one question. Never throws: a lost log line must not cost a visitor their answer. */
export async function logQuestion(entry: Omit<Asked, "at">): Promise<void> {
  if (storage === "none") return;
  const now = new Date();
  const line = sealLine({ ...entry, at: now.toISOString() } satisfies Asked);
  try {
    await withRetry(async () => {
      const path = fileFor(day(now));
      const { text, head } = await readDataFile(path);
      await writeDataFile(path, `${text ?? ""}${line}\n`, "Visitor question", head);
    }, 4);
  } catch (err) {
    console.error("Couldn't keep a visitor question", err instanceof Error ? err.message : err);
  }
}

/** The questions of the last `days` days, newest first. */
export async function readQuestions(days: number): Promise<Asked[]> {
  if (storage === "none") return [];
  const from = day(new Date(Date.now() - (Math.min(days, KEEP_DAYS) - 1) * 86_400_000));
  const { files } = await listDataFiles(DIR);
  const wanted = files.filter((f) => (/(\d{4}-\d{2}-\d{2})\.jsonl$/.exec(f.path)?.[1] ?? "") >= from);
  const out: Asked[] = [];
  // A few files at a time: GitHub doesn't like a burst of reads.
  for (let i = 0; i < wanted.length; i += 8) {
    const texts = await Promise.all(wanted.slice(i, i + 8).map((f) => readDataBlob(f.sha).catch(() => null)));
    for (const text of texts) {
      for (const line of (text ?? "").split("\n")) {
        if (!line.trim()) continue;
        try {
          out.push(openLine(line) as Asked);
        } catch {
          // A line sealed under an older key: skip it.
        }
      }
    }
  }
  return out.sort((a, b) => b.at.localeCompare(a.at));
}

/** Day files past the keeping period, for the daily job to remove. */
export function expiredQuestionFiles(paths: readonly string[], now = new Date()): string[] {
  const cutoff = day(new Date(now.getTime() - KEEP_DAYS * 86_400_000));
  return paths.filter((p) => {
    const m = /^questions\/(\d{4}-\d{2}-\d{2})\.jsonl$/.exec(p);
    return m && m[1] < cutoff;
  });
}
