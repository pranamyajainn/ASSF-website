import {
  Courier_Prime,
  Eczar,
  Noto_Serif_Kannada,
  Tiro_Devanagari_Hindi,
  Tiro_Kannada,
} from "next/font/google";

/**
 * Three voices, no sans-serif:
 *
 * - Eczar — display, Latin and Devanagari. Designed by Vaibhav Singh from
 *   broad-nib Devanagari, the pen that wrote the paper pothis this site is
 *   about; it carries headings, figures and every Devanagari headline.
 * - Tiro Devanagari Hindi — running text in both scripts, one baseline.
 * - Courier Prime — the conservator's record: accession numbers, dates,
 *   counts, captions. Typed, like the slip in the Foundation's own
 *   before-treatment photograph.
 *
 * The Kannada edition swaps in Noto Serif Kannada for display and Tiro
 * Kannada (Tiro Devanagari's sibling) for text. Neither is preloaded: only
 * the Kannada edition — and the ಕನ್ನಡ label in the switcher — uses them.
 */
const eczar = Eczar({
  subsets: ["latin", "devanagari"],
  display: "swap",
  variable: "--font-eczar",
});

const tiroDeva = Tiro_Devanagari_Hindi({
  subsets: ["devanagari", "latin"],
  weight: "400",
  display: "swap",
  variable: "--font-tiro-deva",
});

const courier = Courier_Prime({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  variable: "--font-courier",
});

const tiroKannada = Tiro_Kannada({
  subsets: ["kannada"],
  weight: "400",
  display: "swap",
  preload: false,
  variable: "--font-tiro-kannada",
});

const notoKannada = Noto_Serif_Kannada({
  subsets: ["kannada"],
  display: "swap",
  preload: false,
  variable: "--font-noto-kannada",
});

/** The five faces' CSS variables, for a document's <html>. */
export const fontVariables = [eczar, tiroDeva, courier, tiroKannada, notoKannada].map((f) => f.variable).join(" ");
