import "server-only";
import { get, list } from "@vercel/blob";
import { ALLOWED_TYPES, GROUPS, isVaultPath, type Group } from "./paths";

/**
 * The Foundation's private documents live in a private Vercel Blob store
 * (BLOB_READ_WRITE_TOKEN, set when the store is connected to the project).
 * A private blob can't be fetched by its address; only this server, holding
 * the store's token, can read it — and it hands a file over only through
 * /api/vault/file, to someone on the vault's list. Nothing here is imported
 * by the public pages, the assistant (/api/chat) or the AI connector.
 *
 * There is no database: each document is one blob, its folder naming its
 * group, so the store itself is the list.
 *
 *   vault/financials/1761300000000-k3j9qz/Audit report 2024-25.pdf
 */
export const storeConnected = () => !!process.env.BLOB_READ_WRITE_TOKEN;

export type VaultDocument = { path: string; name: string; size: number; uploadedAt: string };

export async function listDocuments(): Promise<Record<Group, VaultDocument[]>> {
  const out = Object.fromEntries(GROUPS.map((g) => [g, [] as VaultDocument[]])) as Record<Group, VaultDocument[]>;
  let cursor: string | undefined;
  do {
    const page = await list({ prefix: "vault/", limit: 1000, cursor });
    for (const blob of page.blobs) {
      if (!isVaultPath(blob.pathname)) continue;
      const [, group, , name] = blob.pathname.split("/");
      out[group as Group].push({ path: blob.pathname, name, size: blob.size, uploadedAt: new Date(blob.uploadedAt).toISOString() });
    }
    cursor = page.hasMore ? page.cursor : undefined;
  } while (cursor);
  for (const docs of Object.values(out)) docs.sort((a, b) => b.uploadedAt.localeCompare(a.uploadedAt));
  return out;
}

/** One document's contents, streamed — or null if there is no such document. */
export async function openDocument(path: string) {
  if (!isVaultPath(path)) return null;
  const result = await get(path, { access: "private", useCache: false });
  if (!result || result.statusCode !== 200) return null;
  // Only the kinds of file the vault accepts are shown in the browser; anything else is only ever downloaded.
  const type = result.blob.contentType in ALLOWED_TYPES ? result.blob.contentType : "application/octet-stream";
  return { stream: result.stream, type, size: result.blob.size, name: path.split("/").at(-1)! };
}
