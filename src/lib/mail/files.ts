import "server-only";
import { createCipheriv, createDecipheriv, randomBytes, randomUUID } from "node:crypto";
import { readDataFile, withRetry, writeDataFile } from "@/lib/cms/store";
import { sign, verify } from "@/lib/mcp/jwt";
import { key } from "./data";

/**
 * Reports shared by link — for WhatsApp, which can carry words but not
 * files. The file is encrypted (the same key as the mailing list) and kept
 * on the private-data branch; the link is a signed token naming it, valid
 * for ninety days. Anyone with the link can open the file, so it goes only
 * where the Foundation sends it.
 */
export const FILE_TYPES = new Set([
  "application/pdf",
  "image/jpeg",
  "image/png",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/msword",
]);
export const MAX_FILE = 3 * 1024 * 1024;
const TTL = 60 * 60 * 24 * 90;

type Claims = { id: string; name: string; type: string };

export async function saveFile(bytes: Buffer, name: string, type: string, site: string): Promise<string> {
  const id = randomUUID();
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key(), iv);
  const data = Buffer.concat([cipher.update(bytes), cipher.final()]);
  const text = `${JSON.stringify({ v: 1, iv: iv.toString("base64"), tag: cipher.getAuthTag().toString("base64"), data: data.toString("base64") })}\n`;
  const path = `files/${id}.enc.json`;
  await withRetry(async () => {
    const { head } = await readDataFile(path);
    await writeDataFile(path, text, "Shared a file", head);
  });
  return `${site}/files/${sign("file", { id, name, type } satisfies Claims, TTL)}`;
}

/** The file a link names, if the link is ours and unexpired. */
export async function openFile(token: string): Promise<{ bytes: Buffer; name: string; type: string } | null> {
  const claims = verify<Claims>("file", token);
  if (!claims || !/^[0-9a-f-]{36}$/.test(claims.id)) return null;
  const { text } = await readDataFile(`files/${claims.id}.enc.json`);
  if (!text) return null;
  const box = JSON.parse(text) as { iv: string; tag: string; data: string };
  const decipher = createDecipheriv("aes-256-gcm", key(), Buffer.from(box.iv, "base64"));
  decipher.setAuthTag(Buffer.from(box.tag, "base64"));
  const bytes = Buffer.concat([decipher.update(Buffer.from(box.data, "base64")), decipher.final()]);
  return { bytes, name: claims.name, type: claims.type };
}
