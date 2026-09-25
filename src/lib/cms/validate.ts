import "server-only";
import { locales, type Lang } from "@/i18n/config";
import { getAt, pathKey, type Json, type Op } from "./edits";
import { ENUM_KEYS, HIDDEN_KEYS, isHidden, isImagePath, isOpenList, schemaPath } from "./schema";

const MODULES = new Set(["shared", "home", "about", "conservation", "rural", "community", "impact", "trustees", "ui"]);
const MAX_OPS = 3000;
const MAX_TEXT = 8000;
const MAX_LIST = 200;
const RATIO = /^\d{1,5} \/ \d{1,5}$/;
const UPLOAD = /^\/images\/uploads\/\d{4}\/[a-z0-9-]+\.jpg$/;

/**
 * Facts about the content's shape: which fields may be empty, and every
 * value each field holds — gathered from the base editions and the published
 * ones, so wiring can only be carried over and photos already on the site
 * (including earlier uploads) are recognised.
 */
export type Shape = {
  nullable: Set<string>;
  values: Map<string, Set<string>>;
};

export function shapeOf(trees: readonly unknown[]): Shape {
  const nullable = new Set<string>();
  const values = new Map<string, Set<string>>();
  const walk = (node: unknown, path: (string | number)[]) => {
    const schema = schemaPath(path);
    if (node === null) nullable.add(schema);
    if (typeof node === "string") {
      const set = values.get(schema) ?? new Set<string>();
      set.add(node);
      values.set(schema, set);
    }
    if (Array.isArray(node)) node.forEach((v, i) => walk(v, [...path, i]));
    else if (node && typeof node === "object") for (const [k, v] of Object.entries(node)) walk(v, [...path, k]);
  };
  for (const tree of trees) walk(tree, []);
  return { nullable, values };
}

type Ctx = { shape: Shape; uploads: Set<string>; lang: Lang };

/** Why `value` can't stand where `current` stands, or null if it can. */
function check(value: Json, current: unknown, path: (string | number)[], ctx: Ctx): string | null {
  const where = path.join(" › ");
  const schema = schemaPath(path);
  const key = path[path.length - 1];

  if (Array.isArray(current)) {
    if (!Array.isArray(value)) return `${where}: expected a list`;
    if (value.length > MAX_LIST) return `${where}: too many items`;
    if (value.length !== current.length && !isOpenList(path, current)) return `${where}: this list can't change length`;
    const model = current[0];
    if (model === undefined) return value.length ? `${where}: no model for new items` : null;
    for (let i = 0; i < value.length; i++) {
      const problem = check(value[i], current[i] ?? model, [...path, i], ctx);
      if (problem) return problem;
    }
    return null;
  }

  if (current && typeof current === "object") {
    if (!value || typeof value !== "object" || Array.isArray(value)) return `${where}: expected a group of fields`;
    for (const k of Object.keys(value)) if (!(k in current)) return `${where}: unknown field "${k}"`;
    for (const [k, v] of Object.entries(current)) {
      if (!(k in value)) return `${where}: missing field "${k}"`;
      const problem = check(value[k], v, [...path, k], ctx);
      if (problem) return problem;
    }
    return null;
  }

  // Leaves.
  if (value === null) {
    return current === null || ctx.shape.nullable.has(schema) ? null : `${where}: can't be left empty`;
  }
  if (typeof value === "number") {
    if (!Number.isFinite(value)) return `${where}: not a number`;
    return typeof current === "number" || (current === null && ctx.shape.nullable.has(schema)) ? null : `${where}: expected ${typeof current}`;
  }
  if (typeof value === "boolean") return typeof current === "boolean" ? null : `${where}: expected ${typeof current}`;
  if (typeof value !== "string") return `${where}: unexpected value`;
  if (typeof current !== "string" && current !== null) return `${where}: expected ${typeof current}`;
  if (value.length > MAX_TEXT) return `${where}: text is too long`;

  if (isImagePath(current) || (typeof key === "string" && ["src", "image", "portrait"].includes(key) && isImagePath(value))) {
    if (!isImagePath(value)) return `${where}: a photo is needed`;
    const known = [...ctx.shape.values.values()].some((s) => s.has(value));
    if (!known && !(UPLOAD.test(value) && ctx.uploads.has(value))) return `${where}: unknown photo`;
    return null;
  }
  if (typeof key === "string" && HIDDEN_KEYS.has(key)) {
    if (key === "ratio" && RATIO.test(value)) return null;
    // Wiring may only be carried over as it is, never invented.
    return ctx.shape.values.get(schema)?.has(value) ? null : `${where}: this can't be edited`;
  }
  if (typeof key === "string" && ENUM_KEYS.has(key) && !ctx.shape.values.get(schema)?.has(value)) {
    return `${where}: not one of the allowed values`;
  }
  return null;
}

/**
 * Checks a publish before anything is written: each edit must land on a
 * path that exists, carry the same kind of value that is there, and leave
 * wiring (links, keys, layout) as it was. Lists saved whole must be saved
 * for all three editions together. Returns the first problem, or null.
 */
export function validateOps(
  ops: unknown,
  published: Record<Lang, unknown>,
  shape: Shape,
  uploads: Set<string>,
): string | null {
  if (!Array.isArray(ops)) return "No changes were sent.";
  if (ops.length > MAX_OPS) return "Too many changes in one publish.";
  const lists = new Map<string, Map<string, number>>();

  for (const raw of ops as Op[]) {
    if (!raw || typeof raw !== "object" || !Array.isArray(raw.path) || !raw.path.length) return "A change is malformed.";
    const { path, scope, value } = raw;
    if (!path.every((s) => typeof s === "string" || (typeof s === "number" && Number.isInteger(s) && s >= 0))) return "A change is malformed.";
    if (!MODULES.has(String(path[0]))) return `${path.join(" › ")}: not an editable page`;
    if (scope !== "all" && !locales.includes(scope)) return "A change names an unknown edition.";
    const leafKey = path[path.length - 1];
    if (isHidden(path) && !(leafKey === "ratio" && typeof value === "string" && RATIO.test(value))) {
      return `${path.join(" › ")}: this can't be edited`;
    }

    const langs = scope === "all" ? locales : [scope];
    for (const lang of langs) {
      const current = getAt(published[lang], path);
      if (current === undefined) return `${path.join(" › ")}: this field no longer exists — reload the editor`;
      const problem = check(value, current, path, { shape, uploads, lang });
      if (problem) return problem;
    }

    if (Array.isArray(value)) {
      if (scope === "all") return `${path.join(" › ")}: lists are saved per edition`;
      const lengths = lists.get(pathKey(path)) ?? new Map<string, number>();
      lengths.set(scope, value.length);
      lists.set(pathKey(path), lengths);
    } else if (value !== null && typeof value === "object") {
      return `${path.join(" › ")}: groups of fields are saved field by field`;
    }
  }

  for (const [key, lengths] of lists) {
    const where = (JSON.parse(key) as string[]).join(" › ");
    if (lengths.size !== locales.length) return `${where}: a changed list must be saved in all three editions`;
    if (new Set(lengths.values()).size !== 1) return `${where}: the editions' lists don't match`;
  }
  return null;
}
