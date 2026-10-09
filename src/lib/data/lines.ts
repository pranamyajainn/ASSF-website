import "server-only";
import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";
import { listDataFiles, readDataBlob, readDataFile, storage, withRetry, writeDataFile } from "@/lib/cms/store";
import { key } from "@/lib/mail/data";

/**
 * Day files of encrypted lines on the private-data branch (`<dir>/YYYY-MM-DD.jsonl`):
 * each line sealed on its own (AES-256-GCM, the mailing list's key), so
 * adding one leaves the rest untouched. Visitor questions and gift
 * outcomes are kept this way.
 */
const day = (d: Date) => d.toISOString().slice(0, 10);

export function sealLine(value: unknown): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key(), iv);
  const data = Buffer.concat([cipher.update(JSON.stringify(value), "utf8"), cipher.final()]);
  return [iv, cipher.getAuthTag(), data].map((b) => b.toString("base64")).join(".");
}

export function openLine(line: string): unknown {
  const [iv, tag, data] = line.split(".").map((p) => Buffer.from(p, "base64"));
  const decipher = createDecipheriv("aes-256-gcm", key(), iv);
  decipher.setAuthTag(tag);
  return JSON.parse(Buffer.concat([decipher.update(data), decipher.final()]).toString("utf8"));
}

/** Adds one line to today's file. Never throws: a lost line must not cost a visitor anything. */
export async function appendLine(dir: string, value: unknown, message: string): Promise<void> {
  if (storage === "none") return;
  const line = sealLine(value);
  try {
    await withRetry(async () => {
      const path = `${dir}/${day(new Date())}.jsonl`;
      const { text, head } = await readDataFile(path);
      await writeDataFile(path, `${text ?? ""}${line}\n`, message, head);
    }, 4);
  } catch (err) {
    console.error(`Couldn't keep a line in ${dir}`, err instanceof Error ? err.message : err);
  }
}

/** The lines of the last `days` days. */
export async function readLines<T>(dir: string, days: number): Promise<T[]> {
  if (storage === "none") return [];
  const from = day(new Date(Date.now() - (days - 1) * 86_400_000));
  const { files } = await listDataFiles(dir);
  const wanted = files.filter((f) => (/(\d{4}-\d{2}-\d{2})\.jsonl$/.exec(f.path)?.[1] ?? "") >= from);
  const out: T[] = [];
  // A few files at a time: GitHub doesn't like a burst of reads.
  for (let i = 0; i < wanted.length; i += 8) {
    const texts = await Promise.all(wanted.slice(i, i + 8).map((f) => readDataBlob(f.sha).catch(() => null)));
    for (const text of texts) {
      for (const line of (text ?? "").split("\n")) {
        if (!line.trim()) continue;
        try {
          out.push(openLine(line) as T);
        } catch {
          // A line sealed under an older key: skip it.
        }
      }
    }
  }
  return out;
}
