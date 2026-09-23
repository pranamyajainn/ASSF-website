const DEVANAGARI = "०१२३४५६७८९";
const KANNADA = "೦೧೨೩೪೫೬೭೮೯";

/** Write Western digits as Devanagari numerals: 12 → "१२". */
export function toDeva(value: number | string): string {
  return String(value).replace(/\d/g, (d) => DEVANAGARI[Number(d)]);
}

/**
 * Ornamental numbering in the script of the edition: Kannada numerals in
 * the Kannada edition, Devanagari (the manuscript tradition's) otherwise.
 * Figures and data always stay in international digits.
 */
export function toScriptNumerals(value: number | string, lang: string): string {
  const digits = lang === "kn" ? KANNADA : DEVANAGARI;
  return String(value).replace(/\d/g, (d) => digits[Number(d)]);
}

/**
 * The language tag for a piece of text by the script it is written in, so
 * screen readers switch voice correctly whichever edition supplied it.
 * Devanagari is tagged Hindi (the Foundation's usage), Kannada as Kannada.
 */
export function scriptLang(text: string): "hi" | "kn" | "en" {
  if (/[ಀ-೿]/.test(text)) return "kn";
  if (/[ऀ-ॿ]/.test(text)) return "hi";
  return "en";
}
