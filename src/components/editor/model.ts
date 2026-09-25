/**
 * The editor's working model, apart from any screen: three editions of the
 * content as published, the draft of unpublished changes over them, and the
 * rules for turning a field's new value into an edit (see lib/cms/edits.ts).
 */
import { locales, type Lang } from "@/i18n/config";
import { applyOps, clone, getAt, mergeOps, pathKey, setAt, type Json, type Op, type Path, type Scope } from "@/lib/cms/edits";
import { ENUM_KEYS, HIDDEN_KEYS, isHidden, isImagePath, schemaPath } from "@/lib/cms/schema";

export type Trees = Record<Lang, unknown>;

export function withOps(trees: Trees, ops: readonly Op[]): Trees {
  const out = {} as Trees;
  for (const lang of locales) {
    out[lang] = clone(trees[lang]);
    applyOps(out[lang], ops, lang);
  }
  return out;
}

const same = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);

/** Fields written differently in each edition (by schema path, so new items follow suit). */
export function translatedFields(base: Trees): Set<string> {
  const out = new Set<string>();
  const walk = (path: Path) => {
    const values = locales.map((l) => getAt(base[l], path));
    const first = values[0];
    if (Array.isArray(first)) first.forEach((_, i) => walk([...path, i]));
    else if (first && typeof first === "object") for (const k of Object.keys(first)) walk([...path, k]);
    else if (typeof first === "string" && values.some((v) => v !== first)) out.add(schemaPath(path));
  };
  for (const k of Object.keys(base.en as object)) walk([k]);
  return out;
}

/** The values a pick-list field may take, from every edition's content. */
export function enumOptions(trees: Trees, path: Path): string[] {
  const schema = schemaPath(path);
  const found = new Set<string>();
  const walk = (node: unknown, at: Path) => {
    if (schemaPath(at) === schema && typeof node === "string") found.add(node);
    if (Array.isArray(node)) node.forEach((v, i) => walk(v, [...at, i]));
    else if (node && typeof node === "object") for (const [k, v] of Object.entries(node)) walk(v, [...at, k]);
  };
  walk(getAt(trees.en, [path[0]]), [path[0]]);
  return [...found];
}

/** The nearest list above `path` that the draft saves whole, per edition. */
function wholeListAbove(draft: readonly Op[], path: Path, lang: Lang): Op | undefined {
  return draft
    .filter((o) => o.scope === lang && Array.isArray(o.value) && o.path.length < path.length && o.path.every((s, i) => s === path[i]))
    .sort((a, b) => b.path.length - a.path.length)[0];
}

/**
 * The draft after setting one field. Inside a list the draft already saves
 * whole, the change goes into that list; otherwise it becomes (or replaces)
 * an edit — and a field set back to its published value drops its edit.
 */
export function setField(draft: readonly Op[], published: Trees, path: Path, scope: Scope, value: Json): Op[] {
  const langs = scope === "all" ? locales : [scope];
  const lists = langs.map((l) => wholeListAbove(draft, path, l));
  if (lists.every(Boolean)) {
    return draft.map((op) => {
      const i = lists.indexOf(op);
      if (i < 0) return op;
      const list = clone(op.value);
      setAt(list, path.slice(op.path.length), value);
      return { ...op, value: list };
    });
  }
  const without = draft.filter((o) => !(pathKey(o.path) === pathKey(path) && (o.scope === scope || scope === "all")));
  const unchanged = langs.every((l) => same(getAt(published[l], path), value));
  return unchanged ? without : mergeOps(without, [{ path, scope, value }]);
}

/** The draft after changing a list in all three editions at once. */
export function changeList(draft: readonly Op[], current: Trees, path: Path, change: (list: Json[], lang: Lang) => Json[]): Op[] {
  const ops = locales.map((lang) => ({
    path,
    scope: lang as Scope,
    value: change(clone((getAt(current[lang], path) as Json[]) ?? []), lang) as Json,
  }));
  return mergeOps(draft, ops);
}

/** An empty item shaped like `model`: text and photos cleared, wiring and figures kept. */
export function blankLike(model: Json, key?: string | number): Json {
  if (Array.isArray(model)) return model.length ? [blankLike(model[0])] : [];
  if (model && typeof model === "object") {
    const out: Record<string, Json> = {};
    for (const [k, v] of Object.entries(model)) out[k] = HIDDEN_KEYS.has(k) || ENUM_KEYS.has(k) ? v : blankLike(v, k);
    return out;
  }
  if (typeof model === "string") return isImagePath(model) || typeof key !== "string" || !HIDDEN_KEYS.has(key) ? "" : model;
  // Figures and switches keep the model's value, to be corrected in place.
  return model;
}

/** Collections where the newest item leads (a news timeline). */
export const NEWEST_FIRST = new Set(["home.field.items"]);

/** What an item in a list is called: its name, title or heading, or its number. */
export function itemTitle(item: unknown, index: number): string {
  const clip = (s: string) => (s.length > 60 ? `${s.slice(0, 57).trimEnd()}…` : s);
  if (typeof item === "string") return clip(item) || `Paragraph ${index + 1}`;
  if (item && typeof item === "object") {
    const o = item as Record<string, unknown>;
    for (const k of ["name", "title", "heading", "label", "place", "caption", "text", "alt", "tab"]) {
      if (typeof o[k] === "string" && o[k]) return clip(o[k] as string);
    }
  }
  return `Item ${index + 1}`;
}

export type Problem = { path: Path; message: string };

/**
 * What must be fixed before publishing: photos not yet chosen, and new items
 * with no English name or title (the English is what the other editions fall
 * back to).
 */
export function problems(draft: readonly Op[]): Problem[] {
  const out: Problem[] = [];
  for (const op of draft) {
    if (op.scope !== "en" || !Array.isArray(op.value)) continue;
    op.value.forEach((item, i) => {
      if (item && typeof item === "object" && !Array.isArray(item) && itemTitle(item, i) === `Item ${i + 1}`) {
        out.push({ path: [...op.path, i], message: "Write its English name or title" });
      }
    });
  }
  const walk = (node: unknown, path: Path) => {
    const key = path[path.length - 1];
    if (typeof key === "string" && ["src", "image", "portrait"].includes(key) && node === "") out.push({ path, message: "Choose a photo" });
    if (Array.isArray(node)) node.forEach((v, i) => walk(v, [...path, i]));
    else if (node && typeof node === "object") for (const [k, v] of Object.entries(node)) walk(v, [...path, k]);
  };
  for (const op of draft) if (op.scope === "en" || op.scope === "all") walk(op.value, op.path);
  return out;
}

export type Hit = { path: Path; text: string };

/** Every visible piece of text, for "find on the site". */
export function searchIndex(trees: Trees): Hit[] {
  const hits: Hit[] = [];
  const walk = (path: Path) => {
    if (isHidden(path)) return;
    const node = getAt(trees.en, path);
    if (Array.isArray(node)) node.forEach((_, i) => walk([...path, i]));
    else if (node && typeof node === "object") for (const k of Object.keys(node)) walk([...path, k]);
    else if (typeof node === "string" && node && !isImagePath(node)) {
      const text = [...new Set(locales.map((l) => getAt(trees[l], path)).filter((v): v is string => typeof v === "string"))].join("  ·  ");
      hits.push({ path, text });
    } else if (typeof node === "number") hits.push({ path, text: String(node) });
  };
  for (const k of Object.keys(trees.en as object)) walk([k]);
  return hits;
}
