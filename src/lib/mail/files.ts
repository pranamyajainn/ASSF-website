import "server-only";
import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";
import { readDataFile, withRetry, writeDataFile } from "@/lib/cms/store";
import { verify } from "@/lib/mcp/jwt";
import { key } from "./data";

/**
 * Reports shared by link — for WhatsApp, which can carry words but not
 * files. The file is encrypted (the same key as the mailing list) and kept
 * on the private-data branch, with its title and expiry inside the
 * encryption. The link is short (/r/<12 characters>, about 71 random bits)
 * and opens a small page in the Foundation's look, which WhatsApp shows as
 * a proper preview card. Anyone with the link can open the report for
 * ninety days, so it goes only where the Foundation sends it.
 */
export const FILE_TYPES = new Set([
  "application/pdf",
  "image/jpeg",
  "image/png",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/msword",
]);
export const MAX_FILE = 3 * 1024 * 1024;
const TTL_MS = 1000 * 60 * 60 * 24 * 90;
const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
export const SHARE_ID = /^[A-Za-z0-9]{12}$/;

export type SharedFile = { bytes: Buffer; name: string; type: string; title: string; shared: string; expires: string };

function shortId(): string {
  return [...randomBytes(12)].map((b) => ALPHABET[b % ALPHABET.length]).join("");
}

function seal(plain: Buffer): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key(), iv);
  const data = Buffer.concat([cipher.update(plain), cipher.final()]);
  return `${JSON.stringify({ v: 2, iv: iv.toString("base64"), tag: cipher.getAuthTag().toString("base64"), data: data.toString("base64") })}\n`;
}

function unseal(text: string): Buffer {
  const box = JSON.parse(text) as { iv: string; tag: string; data: string };
  const decipher = createDecipheriv("aes-256-gcm", key(), Buffer.from(box.iv, "base64"));
  decipher.setAuthTag(Buffer.from(box.tag, "base64"));
  return Buffer.concat([decipher.update(Buffer.from(box.data, "base64")), decipher.final()]);
}

/** Keeps a report to share, and returns its short link. */
export async function saveFile(bytes: Buffer, name: string, type: string, title: string, site: string): Promise<string> {
  const id = shortId();
  const now = new Date();
  const record = { name, type, title, shared: now.toISOString(), expires: new Date(now.getTime() + TTL_MS).toISOString(), content: bytes.toString("base64") };
  const path = `files/${id}.enc.json`;
  await withRetry(async () => {
    const { head } = await readDataFile(path);
    await writeDataFile(path, seal(Buffer.from(JSON.stringify(record))), "Shared a file", head);
  });
  return `${site}/r/${id}`;
}

/** The report behind a short link, if it exists and hasn't expired. */
export async function openShared(id: string): Promise<SharedFile | null> {
  if (!SHARE_ID.test(id)) return null;
  const { text } = await readDataFile(`files/${id}.enc.json`);
  if (!text) return null;
  const r = JSON.parse(unseal(text).toString("utf8")) as Omit<SharedFile, "bytes"> & { content: string };
  if (Date.parse(r.expires) < Date.now()) return null;
  return { bytes: Buffer.from(r.content, "base64"), name: r.name, type: r.type, title: r.title, shared: r.shared, expires: r.expires };
}

/** Links sent before short links (/files/<signed token>): the file bytes alone. */
export async function openLegacy(token: string): Promise<{ bytes: Buffer; name: string; type: string } | null> {
  const claims = verify<{ id: string; name: string; type: string }>("file", token);
  if (!claims || !/^[0-9a-f-]{36}$/.test(claims.id)) return null;
  const { text } = await readDataFile(`files/${claims.id}.enc.json`);
  if (!text) return null;
  return { bytes: unseal(text), name: claims.name, type: claims.type };
}
