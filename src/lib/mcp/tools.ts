import "server-only";
import { applyActions, blankLike, describeAt, itemTitle, NEWEST_FIRST, searchIndex, translatedFields, type Action, type Trees } from "@/components/editor/model";
import { locales, localeInfo, type Lang } from "@/i18n/config";
import { baseContent, editedContent, publishedEdits } from "@/i18n/content";
import { getAt, type Edits, type Json, type Path, type Scope } from "@/lib/cms/edits";
import {
  COLLECTIONS,
  ENUM_KEYS,
  isHidden,
  isImagePath,
  isMediaPath,
  isOpenList,
  labelAt,
  PAGES,
  schemaPath,
  SECTION_ORDER,
  sectionLabel,
} from "@/lib/cms/schema";
import { history, readEdits, storage } from "@/lib/cms/store";
import { translate, type Reference } from "@/lib/cms/translate";
import { shapeOf, validateOps } from "@/lib/cms/validate";
import { encodeProposal, MAX_TOKEN } from "./proposal";

/**
 * What an AI app can do with the site over MCP: learn its shape, search it,
 * read a section, translate, see what was published — and prepare changes,
 * which come back as a review link for a person to check on the page and
 * publish in the editor. Nothing here writes to the site.
 */

export type ToolContext = { email: string; app: string; origin: string };
export class ToolError extends Error {}

type Tool = {
  name: string;
  title: string;
  description: string;
  inputSchema: Record<string, unknown>;
  annotations: Record<string, boolean | string>;
  run: (args: Record<string, unknown>, ctx: ToolContext) => Promise<string>;
};

/* ------------------------------------------------------------------ content */

let baseCache: Trees | null = null;
const base = (): Trees => (baseCache ??= Object.fromEntries(locales.map((l) => [l, baseContent(l)])) as Trees);

let headCache: { at: number; edits: Edits } | null = null;
/** The edits as they stand on GitHub (a publish may still be deploying), cached briefly. */
async function latestEdits(): Promise<Edits> {
  if (storage === "none") return publishedEdits;
  if (headCache && Date.now() - headCache.at < 10_000) return headCache.edits;
  const { edits } = await readEdits();
  headCache = { at: Date.now(), edits };
  return edits;
}

async function published(): Promise<Trees> {
  const edits = await latestEdits();
  return Object.fromEntries(locales.map((l) => [l, editedContent(l, edits)])) as Trees;
}

/** "trustees.trustees.4.rank" ⇄ ["trustees", "trustees", 4, "rank"] */
const toPath = (text: string): Path =>
  String(text)
    .split(".")
    .filter(Boolean)
    .map((s) => (/^\d+$/.test(s) ? Number(s) : s));
const fromPath = (path: Path) => path.join(".");

const onSite = (module: string) => module !== "shared" && module !== "ui";

function sections(tree: unknown, module: string): string[] {
  const value = getAt(tree, [module]);
  if (!value || typeof value !== "object") return [];
  const order = SECTION_ORDER[module as keyof typeof SECTION_ORDER] ?? [];
  return Object.keys(value)
    .filter((k) => !isHidden([module, k]))
    .sort((a, b) => (order.indexOf(a) + 1 || 999) - (order.indexOf(b) + 1 || 999));
}

const isTranslated = (trees: Trees, path: Path) => {
  const en = getAt(trees.en, path);
  return typeof en === "string" && !isImagePath(en) && (translatedFields(base()).has(schemaPath(path)) || locales.some((l) => getAt(trees[l], path) !== en));
};

function kindOf(path: Path, value: unknown, numeric: boolean): string {
  const key = path[path.length - 1];
  if (isMediaPath(value)) return "film (can't be changed here)";
  if (isImagePath(value) || (typeof key === "string" && ["src", "image", "portrait"].includes(key))) return "photo";
  if (typeof value === "number" || (value === null && numeric)) return "number";
  if (typeof key === "string" && ENUM_KEYS.has(key)) return "choice";
  return "text";
}

const json = (value: unknown) => JSON.stringify(value, null, 2);

/* ------------------------------------------------------------------ tools */

const overview: Tool = {
  name: "get_site_overview",
  title: "Site overview",
  description:
    "Start here. Returns the website's pages and their sections (with ids to pass to read_section), the lists that can gain or lose items, the three languages, and the rules for proposing changes.",
  inputSchema: { type: "object", properties: {}, additionalProperties: false },
  annotations: { readOnlyHint: true, openWorldHint: false },
  async run(_args, ctx) {
    const trees = await published();
    const pages = PAGES.map((p) => ({
      page: p.title,
      url: onSite(p.module) ? `${ctx.origin}${p.href === "/" ? "" : p.href}` : null,
      sections: sections(trees.en, p.module).map((k) => {
        const v = getAt(trees.en, [p.module, k]) as Record<string, unknown> | string | number;
        const heading =
          v && typeof v === "object" ? (["heading", "title", "label", "eyebrow"].map((f) => v[f]).find((x) => typeof x === "string") as string | undefined) : undefined;
        return { id: `${p.module}.${k}`, name: sectionLabel(p.module, k), ...(heading ? { heading } : {}) };
      }),
    }));
    return json({
      site: "Acharya Shanti Sagar Foundation — a Jain charitable trust in Bengaluru: manuscript conservation, rural infrastructure, community services.",
      languages: locales.map((l) => ({ code: l, name: l === "en" ? "English" : localeInfo[l].label, pages_at: `${ctx.origin}${localeInfo[l].prefix}/…` })),
      pages,
      lists_that_can_grow: [...COLLECTIONS].map((c) => c.replace(/\[\]/g, ".<n>")),
      rules: [
        "Everything you prepare is a proposal: propose_changes returns a link, and a person reviews the changes on the page and publishes them in the site editor. Always give the person that link.",
        "Read before you write: use read_section or search_site to find the exact field paths and current wording.",
        "Never invent facts. Figures, names, dates, places and prices must come from the person or from the site itself. If something isn't known, ask.",
        "Text in {curly brackets} (e.g. {folioPrice}) is filled in automatically — keep it exactly. Prices themselves are shared.folioPrice and shared.granthaPrice.",
        "Write in English; Hindi and Kannada are translated automatically unless you supply them. Names, figures and dates stay as written in every language.",
        "Photos can't be uploaded through chat. A new item's photo is left for the person to add in the editor; an existing site photo can be reused by its path.",
        "Keep the site's voice: plain, precise, respectful. No marketing language, no exclamation marks.",
      ],
    });
  },
};

const search: Tool = {
  name: "search_site",
  title: "Search the site",
  description:
    "Find where words, names or figures appear on the website, in any language. Returns each match's field path (for propose_changes), where it is, and its text in English (and Hindi/Kannada if asked).",
  inputSchema: {
    type: "object",
    properties: {
      query: { type: "string", description: "Words to find, e.g. a name, a phrase, a figure like 1,34,545." },
      include_translations: { type: "boolean", description: "Also return the Hindi and Kannada text. Default false." },
    },
    required: ["query"],
    additionalProperties: false,
  },
  annotations: { readOnlyHint: true, openWorldHint: false },
  async run(args) {
    const query = String(args.query ?? "").trim().toLowerCase();
    if (query.length < 2) throw new ToolError("Give at least two characters to search for.");
    const trees = await published();
    const hits = searchIndex(trees)
      .filter((h) => h.text.toLowerCase().includes(query))
      .slice(0, 25)
      .map((h) => ({
        path: fromPath(h.path),
        where: describeAt(trees.en, h.path),
        en: getAt(trees.en, h.path),
        ...(args.include_translations ? { hi: getAt(trees.hi, h.path), kn: getAt(trees.kn, h.path) } : {}),
      }));
    return hits.length ? json({ matches: hits }) : `Nothing on the site matches “${args.query}”.`;
  },
};

const read: Tool = {
  name: "read_section",
  title: "Read a section",
  description:
    "Read one section of the website (an id from get_site_overview, e.g. home.adopt or trustees.trustees), or any part of it (e.g. trustees.trustees.4). Returns every editable field with its path, label, kind and current text, and the section's lists.",
  inputSchema: {
    type: "object",
    properties: {
      section: { type: "string", description: "A section id or field path, e.g. home.field or trustees.trustees.2." },
      languages: {
        type: "array",
        items: { type: "string", enum: ["en", "hi", "kn"] },
        description: "Which languages' text to include. Default: English only.",
      },
    },
    required: ["section"],
    additionalProperties: false,
  },
  annotations: { readOnlyHint: true, openWorldHint: false },
  async run(args) {
    const trees = await published();
    const root = toPath(String(args.section ?? ""));
    if (!root.length || getAt(trees.en, root) === undefined || isHidden(root)) {
      throw new ToolError(`There's no section “${args.section}”. Use get_site_overview for the section ids.`);
    }
    const langs = (Array.isArray(args.languages) && args.languages.length ? args.languages : ["en"]).filter((l): l is Lang =>
      locales.includes(l as Lang),
    );
    const numeric = new Set<string>();
    const walkNumeric = (node: unknown, path: Path) => {
      if (typeof node === "number") numeric.add(schemaPath(path));
      if (Array.isArray(node)) node.forEach((v, i) => walkNumeric(v, [...path, i]));
      else if (node && typeof node === "object") for (const [k, v] of Object.entries(node)) walkNumeric(v, [...path, k]);
    };
    walkNumeric(base().en, []);

    const fields: Record<string, unknown>[] = [];
    const lists: Record<string, unknown>[] = [];
    const walk = (path: Path) => {
      if (isHidden(path)) return;
      const node = getAt(trees.en, path);
      if (Array.isArray(node)) {
        const open = isOpenList(path, node);
        const first = node[0];
        lists.push({
          list: fromPath(path),
          items: node.length,
          can_add_remove_move: open,
          ...(open && first && typeof first === "object" ? { item_fields: Object.keys(first).filter((k) => !isHidden([...path, 0, k])) } : {}),
        });
        node.forEach((_, i) => walk([...path, i]));
        return;
      }
      if (node && typeof node === "object") {
        for (const k of Object.keys(node)) walk([...path, k]);
        return;
      }
      const kind = kindOf(path, node, numeric.has(schemaPath(path)));
      const entry: Record<string, unknown> = { path: fromPath(path), label: labelAt(path), kind };
      if (kind === "text" && isTranslated(trees, path)) for (const l of langs) entry[l] = getAt(trees[l], path);
      else {
        entry.value = node;
        if (kind === "text") entry.same_in_all_languages = true;
      }
      if (kind === "photo") entry.note = "A photo's path. Photos are uploaded in the editor; you may reuse an existing site photo's path.";
      fields.push(entry);
    };
    walk(root);
    const truncated = fields.length > 300;
    return json({
      section: fromPath(root),
      where: describeAt(trees.en, root),
      fields: fields.slice(0, 300),
      lists,
      ...(truncated ? { note: `Showing 300 of ${fields.length} fields — read a smaller part, e.g. ${fromPath(root)}.0` } : {}),
    });
  },
};

const translateTool: Tool = {
  name: "translate_text",
  title: "Translate into Hindi and Kannada",
  description:
    "Translate English text into Hindi and Kannada the way the site writes them (its own spellings; names, figures and {tokens} kept). propose_changes already does this automatically — use this to show the person a translation first.",
  inputSchema: {
    type: "object",
    properties: { text: { type: "string", description: "English text, up to 4,000 characters." } },
    required: ["text"],
    additionalProperties: false,
  },
  annotations: { readOnlyHint: true, openWorldHint: false },
  async run(args) {
    return json(await translate(String(args.text ?? "")));
  },
};

const historyTool: Tool = {
  name: "get_publish_history",
  title: "Recent publishes",
  description: "What was published to the website recently, and whether the latest publish is live yet.",
  inputSchema: { type: "object", properties: {}, additionalProperties: false },
  annotations: { readOnlyHint: true, openWorldHint: false },
  async run() {
    const [edits, publishes] = await Promise.all([latestEdits(), history().catch(() => [])]);
    return json({
      live_on_site: publishedEdits.revision >= edits.revision ? "Everything published is live." : "A publish is still going live (usually within two minutes).",
      publishes: publishes.slice(0, 10).map((p) => ({
        when: new Date(p.date).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Kolkata" }),
        what: p.message.startsWith("Site edit: ") ? p.message.split("\n")[0].slice(11) : "Site update by the web team",
      })),
    });
  },
};

/* ------------------------------------------------------------ proposing */

type Change = {
  type?: string;
  path?: string;
  value?: Json;
  language?: Lang | "all";
  list?: string;
  item?: Record<string, Json>;
  translations?: { hi?: Record<string, Json>; kn?: Record<string, Json> };
  position?: "start" | "end" | number;
  index?: number;
  from?: number;
  to?: number;
};

const propose: Tool = {
  name: "propose_changes",
  title: "Prepare changes for review",
  description: [
    "Prepare changes to the website for a person to review and publish. Nothing goes live: this returns a review link that opens the site editor with the changes shown on the page. Always give the person the link.",
    "Change types:",
    "• set — change one field: {type:'set', path, value}. For translated text, write English; Hindi and Kannada are translated for you (or pass language 'hi'/'kn' to set one directly).",
    "• add_item — add to a growable list (see lists_that_can_grow): {type:'add_item', list, item:{field: English value, …}, position?}. News entries go at the top by default.",
    "• remove_item — {type:'remove_item', list, index}.",
    "• move_item — {type:'move_item', list, from, to}.",
    "Paths and indices always refer to the site as it is now, before this proposal. Use them exactly as read_section or search_site return them. Never invent figures, names or dates.",
  ].join("\n"),
  inputSchema: {
    type: "object",
    properties: {
      summary: { type: "string", description: "One line saying what these changes do, e.g. “Add the Karanja visit to the news”." },
      changes: {
        type: "array",
        minItems: 1,
        maxItems: 40,
        items: {
          type: "object",
          properties: {
            type: { type: "string", enum: ["set", "add_item", "remove_item", "move_item"] },
            path: { type: "string", description: "set: the field's path, e.g. home.adopt.heading or trustees.trustees.4.rank." },
            value: {
              anyOf: [{ type: "string" }, { type: "number" }, { type: "null" }],
              description: "set: the new text or number (null leaves a figure 'awaiting the Foundation').",
            },
            language: { type: "string", enum: ["en", "hi", "kn", "all"], description: "set: which language to change. Default: English (translated for the others), or all for fields shared by all languages." },
            list: { type: "string", description: "add_item / remove_item / move_item: the list's path, e.g. home.field.items or trustees.trustees." },
            item: { type: "object", description: "add_item: the new item's fields in English, e.g. {date, place, title, body}. Lists of paragraphs (e.g. bio) as arrays of strings.", additionalProperties: true },
            translations: {
              type: "object",
              description: "add_item (optional): your own Hindi/Kannada for the item's fields instead of automatic translation.",
              properties: { hi: { type: "object", additionalProperties: true }, kn: { type: "object", additionalProperties: true } },
            },
            position: {
              anyOf: [{ type: "string", enum: ["start", "end"] }, { type: "integer", minimum: 0 }],
              description: "add_item: 'start', 'end', or an index.",
            },
            index: { type: "integer", description: "remove_item: which item (0 is the first)." },
            from: { type: "integer" },
            to: { type: "integer" },
          },
          required: ["type"],
        },
      },
      auto_translate: { type: "boolean", description: "Translate new English text into Hindi and Kannada. Default true." },
    },
    required: ["summary", "changes"],
    additionalProperties: false,
  },
  annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: false, openWorldHint: false },
  async run(args, ctx) {
    const summary = String(args.summary ?? "").trim().slice(0, 200);
    const changes = (Array.isArray(args.changes) ? args.changes : []) as Change[];
    if (!summary) throw new ToolError("Give a one-line summary of the changes.");
    if (!changes.length) throw new ToolError("There are no changes to prepare.");
    const autoTranslate = args.auto_translate !== false;
    const trees = await published();
    const actions: Action[] = [];
    const notes: string[] = [];
    const jobs: { text: string; reference?: Reference | null; done: (hi: string, kn: string) => void }[] = [];
    const bad = (i: number, message: string) => new ToolError(`Change ${i + 1}: ${message}`);

    for (const [i, c] of changes.entries()) {
      if (c.type === "set") {
        const path = toPath(c.path ?? "");
        const current = getAt(trees.en, path);
        if (!path.length || current === undefined) throw bad(i, `there's no field “${c.path}”. Use read_section or search_site for exact paths.`);
        if (isHidden(path) || isMediaPath(current)) throw bad(i, `“${c.path}” can't be changed.`);
        if (current !== null && typeof current === "object") throw bad(i, `“${c.path}” is a group of fields; set its fields one by one.`);
        let value: Json = c.value ?? null;
        const numeric = typeof current === "number" || (current === null && typeof value !== "string");
        if (numeric && typeof value === "string") {
          const n = Number(value.replace(/[,\s₹]/g, ""));
          if (!Number.isFinite(n)) throw bad(i, `“${c.path}” is a number.`);
          value = n;
        }
        const translated = isTranslated(trees, path);
        const scope: Scope = c.language ?? (translated ? "en" : "all");
        actions.push({ set: path, scope, value });
        // A figure shown as text keeps its number in step (as the editor does).
        const last = path[path.length - 1];
        if (last === "display" && typeof value === "string") {
          const sibling = [...path.slice(0, -1), "value"];
          const n = Number(value.replace(/[^\d.]/g, ""));
          if (typeof getAt(trees.en, sibling) === "number" && value.trim() && Number.isFinite(n)) actions.push({ set: sibling, scope: "all", value: n });
        }
        const suppliedOthers = changes.some((o) => o.type === "set" && o.path === c.path && (o.language === "hi" || o.language === "kn"));
        if (translated && scope === "en" && autoTranslate && typeof value === "string" && value.trim() && !suppliedOthers) {
          const was = locales.map((l) => getAt(trees[l], path));
          jobs.push({
            text: value,
            reference: was.every((v) => typeof v === "string" && v) ? { en: was[0] as string, hi: was[1] as string, kn: was[2] as string } : null,
            done: (hi, kn) => actions.push({ set: path, scope: "hi", value: hi }, { set: path, scope: "kn", value: kn }),
          });
        }
        continue;
      }

      const listPath = toPath(c.list ?? "");
      const list = getAt(trees.en, listPath);
      if (!listPath.length || !Array.isArray(list)) throw bad(i, `there's no list “${c.list}”.`);
      if (!isOpenList(listPath, list)) throw bad(i, `“${c.list}” has a fixed number of items; change its items' fields with set instead.`);
      const inRange = (n: unknown, max: number) => typeof n === "number" && Number.isInteger(n) && n >= 0 && n < max;

      if (c.type === "remove_item") {
        if (!inRange(c.index, list.length)) throw bad(i, `index must be between 0 and ${list.length - 1}.`);
        actions.push({ remove: listPath, at: c.index! });
        continue;
      }
      if (c.type === "move_item") {
        if (!inRange(c.from, list.length) || !inRange(c.to, list.length)) throw bad(i, `from and to must be between 0 and ${list.length - 1}.`);
        actions.push({ move: listPath, from: c.from!, to: c.to! });
        continue;
      }
      if (c.type !== "add_item") throw bad(i, "type must be set, add_item, remove_item or move_item.");

      const newestFirst = NEWEST_FIRST.has(schemaPath(listPath));
      const at =
        c.position === "start" ? 0 : c.position === "end" ? list.length : typeof c.position === "number" ? Math.max(0, Math.min(c.position, list.length)) : newestFirst ? 0 : list.length;
      const modelIndex = at === 0 ? 0 : list.length - 1;
      const item = Object.fromEntries(locales.map((l) => [l, blankLike(getAt(trees[l], [...listPath, modelIndex]) as Json)])) as Record<Lang, Json>;
      const given = c.item ?? {};
      if (typeof item.en === "string") {
        // A list of paragraphs: the item is the text itself.
        const text = String(given.text ?? Object.values(given)[0] ?? "");
        for (const l of locales) item[l] = l === "en" ? text : "";
        if (autoTranslate && text.trim()) jobs.push({ text, done: (hi, kn) => ((item.hi = hi), (item.kn = kn)) });
      } else {
        const model = item.en as Record<string, Json>;
        for (const [key, value] of Object.entries(given)) {
          if (!(key in model) || isHidden([...listPath, 0, key])) {
            throw bad(i, `“${key}” isn't a field of this list. Its fields are: ${Object.keys(model).filter((k) => !isHidden([...listPath, 0, k])).join(", ")}.`);
          }
          const fieldPath = [...listPath, modelIndex, key];
          const translated = isTranslated(trees, fieldPath) || (Array.isArray(model[key]) && translatedFields(base()).has(schemaPath([...fieldPath, 0])));
          for (const l of locales) {
            const own = c.translations?.[l as "hi" | "kn"]?.[key];
            (item[l] as Record<string, Json>)[key] = l === "en" || !translated ? value : (own ?? (Array.isArray(value) ? value.map(() => "") : ""));
          }
          if (translated && autoTranslate) {
            const texts = Array.isArray(value) ? value : [value];
            texts.forEach((text, j) => {
              if (typeof text !== "string" || !text.trim()) return;
              if (c.translations?.hi?.[key] !== undefined && c.translations?.kn?.[key] !== undefined) return;
              jobs.push({
                text,
                done: (hi, kn) => {
                  for (const [l, t] of [["hi", hi], ["kn", kn]] as const) {
                    if (c.translations?.[l]?.[key] !== undefined) continue;
                    const target = item[l] as Record<string, Json>;
                    if (Array.isArray(target[key])) (target[key] as Json[])[j] = t;
                    else target[key] = t;
                  }
                },
              });
            });
          }
        }
        for (const [key, value] of Object.entries(model)) {
          if ((["src", "image", "portrait"].includes(key) && value === "") || (value && typeof value === "object" && !Array.isArray(value) && (value as Record<string, Json>).src === "")) {
            notes.push(`The new item in ${describeAt(trees.en, listPath)} needs a photo — add it in the editor before publishing.`);
          }
        }
      }
      actions.push({ add: listPath, at, item });
    }

    // Translate, a few at a time.
    for (let k = 0; k < jobs.length; k += 3) {
      await Promise.all(
        jobs.slice(k, k + 3).map(async (job) => {
          const { hi, kn } = await translate(job.text, job.reference);
          job.done(hi, kn);
        }),
      );
    }

    // Every path and index in a proposal refers to the site as it is now: so
    // fields are set first, then items removed (from the bottom up), moved,
    // and added (at their original positions, from the bottom up). A list
    // takes one kind of reshaping per proposal.
    const kinds = new Map<string, Set<string>>();
    for (const a of actions) {
      if ("set" in a) continue;
      const kind = "add" in a ? "add" : "remove" in a ? "remove" : "move";
      const key = ("add" in a ? a.add : "remove" in a ? a.remove : a.move).join(".");
      const seen = kinds.get(key) ?? new Set<string>();
      if ((seen.size && !seen.has(kind)) || (kind === "move" && seen.has("move"))) {
        throw new ToolError(`This proposal changes the list ${key} in more than one way. Prepare the ${kind} as a separate proposal.`);
      }
      kinds.set(key, seen.add(kind));
    }
    const indexed = actions.map((a, order) => ({ a, order }));
    const ordered = [
      ...indexed.filter(({ a }) => "set" in a),
      ...indexed.filter(({ a }) => "remove" in a).sort((x, y) => (y.a as { at: number }).at - (x.a as { at: number }).at),
      ...indexed.filter(({ a }) => "move" in a),
      ...indexed.filter(({ a }) => "add" in a).sort((x, y) => (y.a as { at: number }).at - (x.a as { at: number }).at || y.order - x.order),
    ].map(({ a }) => a);
    actions.splice(0, actions.length, ...ordered);

    const draft = applyActions([], trees, actions);
    const shape = shapeOf([...Object.values(base()), ...Object.values(trees)]);
    const problem = validateOps(draft, trees, shape, new Set(), { photosLater: true });
    if (problem) throw new ToolError(`These changes can't be applied: ${problem}`);

    const token = encodeProposal({ summary, by: ctx.email, app: ctx.app, actions });
    if (token.length > MAX_TOKEN) throw new ToolError("That's too much for one review link. Split the changes into smaller proposals.");
    const link = `${ctx.origin}/editor?proposal=${token}`;

    const scopeOrder = { all: 0, en: 1, hi: 2, kn: 3 } as const;
    const lines = [...actions]
      .sort((x, y) => ("set" in x && "set" in y ? x.set.join(".").localeCompare(y.set.join(".")) || scopeOrder[x.scope] - scopeOrder[y.scope] : 0))
      .map((a) => {
        if ("set" in a) {
          const lang: Lang = a.scope === "all" ? "en" : a.scope;
          const before = getAt(trees[lang], a.set);
          const label = a.scope === "all" ? "" : ` (${a.scope === "en" ? "English" : localeInfo[a.scope].label})`;
          return `• ${describeAt(trees.en, a.set)}${label}: “${String(before ?? "—").slice(0, 120)}” → “${String(a.value ?? "—").slice(0, 120)}”`;
        }
        if ("add" in a) {
          const title = itemTitle(a.item.en, a.at);
          return `• ${describeAt(trees.en, a.add)}: add “${title}” ${a.at === 0 ? "at the top" : `at position ${a.at + 1}`}`;
        }
        if ("remove" in a) return `• ${describeAt(trees.en, [...a.remove, a.at])}: remove`;
        return `• ${describeAt(trees.en, [...a.move, a.from])}: move to position ${a.to + 1}`;
      });
    console.info("MCP proposal", { editor: ctx.email, app: ctx.app, actions: actions.length });
    return [
      `Prepared: ${summary}`,
      "Nothing is published yet. Open this link to see the changes on the page, adjust anything, and publish:",
      link,
      "",
      "Changes:",
      ...lines,
      ...(notes.length ? ["", "Before publishing:", ...[...new Set(notes)].map((n) => `• ${n}`)] : []),
      ...(jobs.length ? ["", "Hindi and Kannada were translated automatically — worth a check by someone who reads them."] : []),
    ].join("\n");
  },
};

export const TOOLS: Tool[] = [overview, search, read, propose, translateTool, historyTool];

export const INSTRUCTIONS = `This server edits the website of Acharya Shanti Sagar Foundation (a Jain charitable trust in Bengaluru), in English, Hindi and Kannada.
Start with get_site_overview. Read (read_section / search_site) before proposing changes, and use field paths exactly as returned.
propose_changes never publishes: it returns a review link; always give it to the person — they check the changes on the page and publish in the site editor.
Never invent figures, names, dates or prices; ask the person when something isn't known. Keep {tokens} such as {folioPrice} as they are.`;
