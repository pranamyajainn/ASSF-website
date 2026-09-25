/**
 * What the site editor shows, and how — read from the content itself, not
 * declared field by field, so a new section or field on the site appears in
 * the editor without anyone describing it.
 *
 * The few rules here say what the content can't: which values are wiring
 * (links, layout ratios, keys) and stay hidden; which lists are collections
 * the Foundation may add to, remove from and reorder; and what each field is
 * called in plain words. Safe to import anywhere.
 */
import type { Path } from "./edits";

/** Values that wire the page together rather than say anything. */
export const HIDDEN_KEYS = new Set([
  "href",
  "ratio",
  "position",
  "span",
  "key",
  "code",
  "slug",
  "lang",
  "width",
  "height",
  "captions",
  "video",
  "id",
  "youtubeId",
]);

/** Whole branches the editor leaves alone (schema paths, see `schemaPath`). */
export const HIDDEN_BRANCHES = new Set([
  "shared.languages",
  // Only the trustee portal reads this list; it isn't shown on the site.
  "home.conservationStages",
]);

/**
 * Lists the Foundation can grow, shrink and reorder. Every other list keeps
 * its length, because the page lays out exactly that many (four hero
 * banners, eight process steps…). Lists of paragraphs are always open.
 */
export const COLLECTIONS = new Set([
  "home.field.items",
  "home.upClose.items",
  "home.voices.items",
  "home.board.members",
  "about.namesake.album",
  "conservation.illuminated.items",
  "rural.projects.items",
  "rural.projects.items[].images",
  "community.healthcare.images",
  "community.healthcare.camps",
  "community.relief.items",
  "community.relief.items[].stats",
  "trustees.trustees",
  "trustees.advisors",
]);

/** Paragraph lists: open, whatever their path. */
const TEXT_LISTS = new Set(["paragraphs", "bio", "body", "statement", "subjects"]);

/** "home.sites.items[].figures" for ["home", "sites", "items", 2, "figures"]. */
export function schemaPath(path: Path): string {
  return path.reduce<string>((acc, step) => (typeof step === "number" ? `${acc}[]` : acc ? `${acc}.${step}` : step), "");
}

export function isHidden(path: Path): boolean {
  const last = path[path.length - 1];
  if (typeof last === "string" && HIDDEN_KEYS.has(last)) return true;
  const schema = schemaPath(path);
  for (const branch of HIDDEN_BRANCHES) if (schema === branch || schema.startsWith(`${branch}.`) || schema.startsWith(`${branch}[`)) return true;
  return false;
}

export function isOpenList(path: Path, value: unknown[]): boolean {
  const last = path[path.length - 1];
  if (COLLECTIONS.has(schemaPath(path))) return true;
  return typeof last === "string" && TEXT_LISTS.has(last) && value.every((v) => typeof v === "string");
}

const IMAGE = /^\/images\/[\w\-./]+\.(jpe?g|png|webp|avif|gif)$/i;
const MEDIA = /^\/(videos|og)\//;

export function isImagePath(value: unknown): value is string {
  return typeof value === "string" && IMAGE.test(value);
}

export function isMediaPath(value: unknown): boolean {
  return typeof value === "string" && MEDIA.test(value);
}

/** Pick-lists: a field whose every value is one of a few machine words. */
export const ENUM_KEYS = new Set(["state"]);

/** Plain names for the fields that recur across the site. */
const LABELS: Record<string, string> = {
  alt: "Photo description",
  src: "Photo",
  image: "Photo",
  portrait: "Photo",
  plate: "Photo",
  poster: "Poster",
  body: "Text",
  bio: "Full profile",
  lede: "Introduction",
  eyebrow: "Small heading above",
  heading: "Heading",
  title: "Title",
  label: "Label",
  caption: "Caption",
  captionDeva: "Caption (Devanagari)",
  gloss: "Note beneath",
  note: "Note",
  quote: "Quote",
  translation: "Translation of the quote",
  transcript: "Transcript",
  transcriptTranslation: "Transcript, translated",
  rank: "Designation",
  affiliation: "Affiliation",
  name: "Name",
  role: "Role",
  kind: "What it is",
  place: "Place",
  date: "Date",
  detail: "Detail",
  value: "Figure",
  display: "Figure as shown",
  state: "Status",
  status: "Status",
  start: "Started (year-month)",
  end: "Finished (year-month)",
  folios: "Folios",
  manuscripts: "Manuscripts",
  footnote: "Footnote",
  institution: "Institution",
  paragraphs: "Paragraphs",
  items: "Items",
  steps: "Steps",
  stats: "Figures",
  images: "Photos",
  link: "Link",
  tab: "Tab",
  em: "Emphasised words",
  deva: "In Devanagari",
  meaning: "Meaning",
  intro: "Introduction",
  text: "Text",
  folioPrice: "Price of one folio (₹)",
  granthaPrice: "Price of a whole grantha (₹)",
  phone: "Phone",
  email: "Email",
  office: "Office address",
  founded: "Founded (year)",
  registration: "Registration number",
  beneficiaries: "Beneficiaries",
  pageHero: "Top of the page",
  primary: "Main button",
  secondary: "Second button",
};

/** "communityTeaser" → "Community teaser". */
export function humanize(key: string): string {
  const words = key.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/[_-]+/g, " ").toLowerCase();
  return words.charAt(0).toUpperCase() + words.slice(1);
}

export function labelFor(key: string | number): string {
  if (typeof key === "number") return `#${key + 1}`;
  return LABELS[key] ?? humanize(key);
}

/** Long-form fields get a text box, not a line. */
export function isLongText(key: string | number, value: string): boolean {
  return value.length > 90 || (typeof key === "string" && ["body", "bio", "quote", "transcript", "transcriptTranslation", "lede", "paragraphs", "text", "translation"].includes(key));
}

/** The pages of the editor, in the site's order, and where each lives on the site. */
export const PAGES = [
  { module: "home", title: "Home", href: "/" },
  { module: "about", title: "About", href: "/about" },
  { module: "conservation", title: "Manuscript Conservation", href: "/manuscript-conservation" },
  { module: "rural", title: "Rural Infrastructure", href: "/rural-infrastructure" },
  { module: "community", title: "Community Services", href: "/community-services" },
  { module: "impact", title: "Impact", href: "/impact" },
  { module: "trustees", title: "Trustees", href: "/trustees" },
  { module: "shared", title: "Site-wide", href: "/" },
  { module: "ui", title: "Buttons & labels", href: "/" },
] as const;

export type ModuleName = (typeof PAGES)[number]["module"];

/** Sections in the order the page shows them; any not listed follow. */
export const SECTION_ORDER: Partial<Record<ModuleName, string[]>> = {
  home: ["hero", "mission", "pillarsIntro", "upClose", "ledger", "scale", "sites", "ruralTeaser", "communityTeaser", "field", "voices", "lineage", "board", "standing", "join", "adopt", "survey"],
  shared: ["org", "folioPrice", "granthaPrice", "pillars", "nav"],
};

/** Plain names for sections whose code names say little to a reader. */
const SECTION_LABELS: Record<string, string> = {
  "home.hero": "Top of the page & banners",
  "home.pillarsIntro": "Three pillars",
  "home.upClose": "Photo album",
  "home.ledger": "Figures: our work so far",
  "home.scale": "Figures: the scale ahead",
  "home.ruralTeaser": "Rural infrastructure",
  "home.communityTeaser": "Community services",
  "home.field": "News & updates",
  "home.voices": "Voices & films",
  "home.lineage": "The Acharya",
  "home.board": "Board (home page)",
  "home.standing": "Registrations",
  "home.join": "Join the work",
  "home.adopt": "Adopt a folio",
  "home.survey": "Manuscript survey",
  "shared.org": "Name, contact & bank details",
  "shared.nav": "Menu",
  "shared.pillars": "Three pillars (everywhere)",
  "trustees.trustees": "Trustees",
  "trustees.advisors": "Advisors",
};

export function sectionLabel(module: string, key: string): string {
  return SECTION_LABELS[`${module}.${key}`] ?? labelFor(key);
}

/** What a single edit is worth being called, for the review list. */
export function describePath(path: Path): string {
  const page = PAGES.find((p) => p.module === path[0])?.title ?? String(path[0]);
  const rest = path.slice(1).map((step, i) => (i === 0 && typeof step === "string" ? sectionLabel(String(path[0]), step) : labelFor(step)));
  return [page, ...rest].join(" › ");
}
