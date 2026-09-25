/**
 * Invisible tags that say which field a piece of text on the page came from,
 * so the editor's preview can be clicked: "this sentence is
 * home › adopt › body". Used only in the editor's preview (/preview/…);
 * the public site never carries them.
 *
 * A tag is the field's path, as JSON bytes, written in four invisible
 * "default ignorable" characters (U+2061–U+2064) between two word joiners
 * (U+2060). Browsers draw none of them, and — unlike zero-width joiners —
 * they never change how a Devanagari or Kannada word is shaped.
 */
import type { Path } from "./edits";
import { ENUM_KEYS, isHidden, isImagePath, isMediaPath } from "./schema";

const EDGE = "⁠";
const DIGITS = ["⁡", "⁢", "⁣", "⁤"];
export const TAG = /⁠([⁡-⁤]+)⁠/g;

/**
 * Text a component reads rather than shows — a site's "2022-02" is split
 * into year and month, its status is compared with "Completed" — stays
 * untagged, as do links, photos and pick-list values.
 */
const UNTAGGED = new Set(["start", "end", "status"]);

export function tagFor(path: Path): string {
  let out = EDGE;
  for (const byte of new TextEncoder().encode(JSON.stringify(path))) {
    out += DIGITS[byte >> 6] + DIGITS[(byte >> 4) & 3] + DIGITS[(byte >> 2) & 3] + DIGITS[byte & 3];
  }
  return out + EDGE;
}

export function readTag(digits: string): Path | null {
  if (digits.length % 4) return null;
  const bytes = new Uint8Array(digits.length / 4);
  for (let i = 0; i < bytes.length; i++) {
    let byte = 0;
    for (let j = 0; j < 4; j++) byte = (byte << 2) | (digits.charCodeAt(i * 4 + j) - 0x2061);
    bytes[i] = byte;
  }
  try {
    const path = JSON.parse(new TextDecoder().decode(bytes));
    return Array.isArray(path) ? (path as Path) : null;
  } catch {
    return null;
  }
}

export function stripTags(text: string): string {
  return text.replace(TAG, "");
}

/** A copy of `tree` with every piece of shown text tagged with its path. */
export function tagTree(tree: unknown, path: Path = []): unknown {
  if (typeof tree === "string") {
    const key = path[path.length - 1];
    const plain =
      !tree ||
      isHidden(path) ||
      (typeof key === "string" && (ENUM_KEYS.has(key) || UNTAGGED.has(key))) ||
      isImagePath(tree) ||
      isMediaPath(tree) ||
      /^(\/|https?:|mailto:|tel:|#)/.test(tree);
    return plain ? tree : tree + tagFor(path);
  }
  if (Array.isArray(tree)) return tree.map((v, i) => tagTree(v, [...path, i]));
  if (tree && typeof tree === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(tree)) out[k] = tagTree(v, [...path, k]);
    return out;
  }
  return tree;
}
