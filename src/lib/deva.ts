const DIGITS = "०१२३४५६७८९";

/** Write Western digits as Devanagari numerals: 12 → "१२". */
export function toDeva(value: number | string): string {
  return String(value).replace(/\d/g, (d) => DIGITS[Number(d)]);
}
