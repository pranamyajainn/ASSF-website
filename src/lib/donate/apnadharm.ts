import "server-only";
import type { Lang } from "@/i18n/config";
import { translate } from "@/lib/cms/translate";
import { appendLine, readLines } from "@/lib/data/lines";
import { apnaDharm, type Category, type Outcome } from "./config";

/**
 * The server's side of online giving: the Foundation's donation categories
 * as Apna Dharm keeps them, and a private record of how each payment ended.
 */

type Raw = {
  _id?: string;
  id?: string;
  name?: string;
  amount?: number;
  isFixedAmount?: boolean;
  enableQuantity?: boolean;
  quantityLabel?: string;
  minQuantity?: number;
  maxQuantity?: number;
  quantityStep?: number;
};

/** Names translated once per server instance: Apna Dharm keeps them in English. */
const translated = new Map<string, { hi: string; kn: string }>();

async function inEdition(text: string, lang: Lang): Promise<string> {
  if (lang === "en" || !text.trim()) return text;
  let both = translated.get(text);
  if (!both) {
    // A failed translation shows the English this time, and is tried again next time.
    both = await translate(text).catch(() => null) ?? undefined;
    if (!both) return text;
    translated.set(text, both);
  }
  return both[lang] || text;
}

export class CategoriesUnavailable extends Error {}

/**
 * The categories a gift can be for, in the edition's language. Apna Dharm
 * is asked at most every five minutes; a change made in its portal shows
 * here within that.
 */
export async function donationCategories(lang: Lang): Promise<Category[]> {
  const res = await fetch(`${apnaDharm.api}/category/sub-category/${apnaDharm.trustId}/${apnaDharm.donationParent}`, {
    next: { revalidate: 300 },
    signal: AbortSignal.timeout(8000),
  }).catch(() => null);
  if (!res?.ok) throw new CategoriesUnavailable(`Apna Dharm answered ${res?.status ?? "nothing"}`);
  const data = (await res.json().catch(() => null)) as { data?: { results?: Raw[] } } | null;
  const raw = Array.isArray(data?.data?.results) ? data.data.results : [];
  const out: Category[] = [];
  // One at a time: the translation model takes a few requests a second at most.
  for (const c of raw.filter((c) => (c._id || c.id) && c.name)) {
    const perUnit = !!c.enableQuantity && (c.amount ?? 0) > 0;
    out.push({
      id: String(c._id || c.id),
      original: String(c.name),
      // "Taadpatra Restoration (₹414/Page)": the bracket repeats what the card already says, in the reader's language.
      name: await inEdition(String(c.name).replace(/\s*\([^)]*\)\s*$/, "") || String(c.name), lang),
      amount: Math.max(0, Number(c.amount) || 0),
      perUnit,
      fixed: !perUnit && !!c.isFixedAmount && (c.amount ?? 0) > 0,
      unitLabel: perUnit ? await inEdition(c.quantityLabel || "Quantity", lang) : "",
      min: Math.max(1, Number(c.minQuantity) || 1),
      max: Math.max(0, Number(c.maxQuantity) || 0),
      step: Math.max(1, Number(c.quantityStep) || 1),
    });
  }
  return out;
}

/**
 * How a payment ended, as the donor's browser heard it from the checkout —
 * for the editor's Insights. No name, number or PAN is kept here; the
 * donor's details are in the Foundation's Apna Dharm account, which is the
 * record of every gift.
 */
export type Gift = { at: string; txn: string; status: Outcome; amount: number; category: string; lang: Lang };

const DIR = "donations";

export async function recordGift(gift: Omit<Gift, "at">): Promise<void> {
  await appendLine(DIR, { ...gift, at: new Date().toISOString() } satisfies Gift, "Gift outcome");
}

export async function readGifts(days: number): Promise<Gift[]> {
  const latest = new Map<string, Gift>();
  for (const g of (await readLines<Gift>(DIR, days)).sort((a, b) => b.at.localeCompare(a.at))) if (!latest.has(g.txn)) latest.set(g.txn, g);
  return [...latest.values()];
}
