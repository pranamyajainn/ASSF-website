/**
 * The site editor's changes, and how they are laid over the content.
 *
 * The words, figures and photographs of every page are written in
 * `src/content/*.ts` (English) and `src/i18n/{hi,kn}.ts` (translations).
 * What the Foundation changes in the site editor is not written back into
 * those files; it is kept as a list of edits in `src/content/edits.json`,
 * and each edition is built as: source → translation → edits.
 *
 * An edit sets one value at one path, for one edition or for all three:
 *
 *   { path: ["home", "adopt", "heading"], scope: "hi", value: "…" }
 *   { path: ["trustees", "trustees", 2, "image"], scope: "all", value: "/images/uploads/…" }
 *
 * A list the editor can grow, shrink or reorder (news, trustees, photos)
 * is saved whole, once per edition, so its items and their translations
 * travel together.
 *
 * Edits are applied defensively: one whose path no longer exists, or whose
 * value is not the kind of thing already there, is skipped — so a later
 * change to the content's shape can't break a page, only orphan an edit.
 *
 * Safe to import anywhere (no server APIs).
 */
import type { Lang } from "@/i18n/config";

export type Json = string | number | boolean | null | Json[] | { [key: string]: Json };
export type Path = (string | number)[];
export type Scope = Lang | "all";
export type Op = { path: Path; scope: Scope; value: Json };
export type Edits = { revision: number; updatedAt: string | null; ops: Op[] };

export const emptyEdits: Edits = { revision: 0, updatedAt: null, ops: [] };

const isObject = (v: unknown): v is Record<string, unknown> => !!v && typeof v === "object" && !Array.isArray(v);

/** A copy of plain content data (strings, numbers, arrays, objects). */
export function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

export function pathKey(path: Path): string {
  return JSON.stringify(path);
}

/** The value at `path`, or undefined if the path leads nowhere. */
export function getAt(tree: unknown, path: Path): unknown {
  let node = tree;
  for (const step of path) {
    if (Array.isArray(node) && typeof step === "number") node = node[step];
    else if (isObject(node) && typeof step === "string" && Object.hasOwn(node, step)) node = node[step];
    else return undefined;
  }
  return node;
}

/**
 * `incoming` laid over `current`, keeping `current`'s shape: an object keeps
 * only the keys it already has, and a leaf takes a value of the same kind
 * (null may stand in for a missing string or number, and be filled by one).
 * Returns `current` unchanged when the two don't fit.
 */
function fit(current: unknown, incoming: unknown, template?: unknown): unknown {
  if (Array.isArray(current)) {
    if (!Array.isArray(incoming)) return current;
    const model = current[0] ?? template;
    return incoming.map((item, i) => fit(current[i] ?? model, item, model));
  }
  if (isObject(current)) {
    if (!isObject(incoming)) return current;
    const out: Record<string, unknown> = {};
    for (const key of Object.keys(current)) {
      out[key] = key in incoming ? fit(current[key], incoming[key]) : current[key];
    }
    return out;
  }
  if (current === undefined) return incoming;
  if (incoming === null || current === null) return incoming === null || ["string", "number"].includes(typeof incoming) ? incoming : current;
  return typeof incoming === typeof current ? incoming : current;
}

/** Sets `value` at `path` in place, if the path exists and the value fits. */
export function setAt(tree: unknown, path: Path, value: Json): boolean {
  if (!path.length) return false;
  const parent = getAt(tree, path.slice(0, -1));
  const last = path[path.length - 1];
  if (Array.isArray(parent) && typeof last === "number" && last >= 0 && last < parent.length) {
    parent[last] = fit(parent[last], value);
    return true;
  }
  if (isObject(parent) && typeof last === "string" && Object.hasOwn(parent, last)) {
    parent[last] = fit(parent[last], value);
    return true;
  }
  return false;
}

/** Shallow paths first, and "all" before an edition's own edit of the same path. */
function order(a: Op, b: Op): number {
  return a.path.length - b.path.length || (a.scope === "all" ? 0 : 1) - (b.scope === "all" ? 0 : 1);
}

/** Applies the edits for `lang` to `tree` in place. */
export function applyOps(tree: unknown, ops: readonly Op[], lang: Lang): void {
  for (const op of [...ops].filter((o) => o.scope === "all" || o.scope === lang).sort(order)) {
    setAt(tree, op.path, op.value);
  }
}

function isWithin(path: Path, ancestor: Path): boolean {
  return ancestor.length <= path.length && ancestor.every((step, i) => step === path[i]);
}

/**
 * Adds `incoming` edits to `existing`, dropping what they replace:
 *
 * - the same path in the same scope;
 * - for an edit that applies to all editions, that path in any scope;
 * - for a list or object saved whole, everything inside it, in its scope
 *   and in "all" (the saved list already carries those values).
 */
export function mergeOps(existing: readonly Op[], incoming: readonly Op[]): Op[] {
  let ops = [...existing];
  for (const op of incoming) {
    const whole = op.value !== null && typeof op.value === "object";
    ops = ops.filter((o) => {
      const samePath = pathKey(o.path) === pathKey(op.path);
      if (samePath) return !(o.scope === op.scope || op.scope === "all");
      if (whole && isWithin(o.path, op.path)) return !(o.scope === op.scope || o.scope === "all" || op.scope === "all");
      return true;
    });
    ops.push(op);
  }
  return ops;
}

/**
 * Figures written once and used in running text: `{folioPrice}` in a
 * sentence becomes the price, so changing the price changes every sentence
 * that quotes it, in every edition.
 */
export function fillTokens(tree: unknown, tokens: Record<string, string>): unknown {
  if (typeof tree === "string") {
    return tree.includes("{") ? tree.replace(/\{(\w+)\}/g, (m, name: string) => tokens[name] ?? m) : tree;
  }
  if (Array.isArray(tree)) return tree.map((v) => fillTokens(v, tokens));
  if (isObject(tree)) {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(tree)) out[k] = fillTokens(v, tokens);
    return out;
  }
  return tree;
}

/**
 * Where an edition's text was left blank in the editor (a new item not yet
 * translated), the English stands in rather than an empty line.
 */
export function fillBlanks(tree: unknown, english: unknown): unknown {
  if (tree === "" && typeof english === "string") return english;
  if (Array.isArray(tree)) return tree.map((v, i) => fillBlanks(v, Array.isArray(english) ? english[i] : undefined));
  if (isObject(tree)) {
    const en = isObject(english) ? english : {};
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(tree)) out[k] = fillBlanks(v, en[k]);
    return out;
  }
  return tree;
}
