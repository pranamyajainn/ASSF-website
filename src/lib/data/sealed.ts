import "server-only";
import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";
import { readDataFile, withRetry, writeDataFile } from "@/lib/cms/store";
import { key } from "@/lib/mail/data";

/**
 * A JSON file on the private-data branch, encrypted (AES-256-GCM, the
 * mailing list's key): the repository is public, so anything kept there —
 * scheduled changes, visitor-question summaries — is sealed first.
 */
export function seal(value: unknown): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key(), iv);
  const data = Buffer.concat([cipher.update(JSON.stringify(value), "utf8"), cipher.final()]);
  return `${JSON.stringify({ v: 1, iv: iv.toString("base64"), tag: cipher.getAuthTag().toString("base64"), data: data.toString("base64") })}\n`;
}

export function unseal<T>(text: string): T {
  const box = JSON.parse(text) as { iv: string; tag: string; data: string };
  const decipher = createDecipheriv("aes-256-gcm", key(), Buffer.from(box.iv, "base64"));
  decipher.setAuthTag(Buffer.from(box.tag, "base64"));
  return JSON.parse(Buffer.concat([decipher.update(Buffer.from(box.data, "base64")), decipher.final()]).toString("utf8")) as T;
}

export async function readSealed<T>(path: string, fallback: T): Promise<T> {
  const { text } = await readDataFile(path);
  return text ? unseal<T>(text) : fallback;
}

/** Reads, changes and writes a sealed file, starting over if someone else wrote in between. */
export async function updateSealed<T>(path: string, fallback: T, change: (value: T) => T, message: string): Promise<T> {
  return withRetry(async () => {
    const { text, head } = await readDataFile(path);
    const next = change(text ? unseal<T>(text) : fallback);
    await writeDataFile(path, seal(next), message, head);
    return next;
  });
}
