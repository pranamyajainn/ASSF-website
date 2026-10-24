/**
 * The vault's four groups and how a document's place in the store is
 * written. Safe to import anywhere: the upload page builds a path with
 * `newPath`, and the server accepts only paths `isVaultPath` agrees with.
 */
export const GROUPS = ["trust-deed", "financials", "balance-sheets", "approvals"] as const;
export type Group = (typeof GROUPS)[number];

/** What may be kept: PDFs, scans and photographs, Word and Excel files. */
export const ALLOWED_TYPES: Record<string, string> = {
  "application/pdf": "pdf",
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "application/msword": "doc",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
  "application/vnd.ms-excel": "xls",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "xlsx",
};
export const MAX_BYTES = 100 * 1024 * 1024;

const PATH = new RegExp(`^vault/(${GROUPS.join("|")})/\\d{13}-[a-z0-9]{6}/[^/\\\\]{1,140}$`);

export function isVaultPath(path: unknown): path is string {
  return typeof path === "string" && PATH.test(path) && !path.includes("..");
}

/** A file's name as it can be kept: letters in any script, digits, spaces, dots, dashes. */
export function safeName(name: string): string {
  const cleaned = name
    .normalize("NFC")
    .replace(/[^\p{L}\p{M}\p{N} ._()-]+/gu, "-")
    .replace(/\s+/g, " ")
    .replace(/^[\s.-]+|[\s.-]+$/g, "");
  return (cleaned || "document").slice(-140);
}

/** Where a new upload goes: its group, a unique folder, and its own name. */
export function newPath(group: Group, fileName: string): string {
  const id = Math.random().toString(36).slice(2, 8).padEnd(6, "0");
  return `vault/${group}/${Date.now()}-${id}/${safeName(fileName)}`;
}
