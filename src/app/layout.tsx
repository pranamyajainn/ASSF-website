import type { Metadata } from "next";
import { Courier_Prime, Eczar, Tiro_Devanagari_Hindi, Tiro_Kannada } from "next/font/google";
import { org } from "@/content/shared";
import { ChatWidget } from "@/components/chat/chat-widget";
import "./globals.css";

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
 * Tiro Kannada is only ever used for the word ಕನ್ನಡ in the language
 * switcher, so it is not preloaded.
 */
const eczar = Eczar({
  subsets: ["latin", "devanagari"],
  display: "swap",
  variable: "--font-eczar",
});

const tiroDeva = Tiro_Devanagari_Hindi({
  subsets: ["devanagari", "latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-tiro-deva",
});

const courier = Courier_Prime({
  subsets: ["latin"],
  weight: ["400", "700"],
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

export const metadata: Metadata = {
  title: `${org.nameLatin} — ${org.tagline}`,
  description:
    "The Acharya Shanti Sagar Foundation conserves tadpatra — palm-leaf folios carrying Jain scripture, Ayurvedic texts, grammars and commentaries. Conservation is free to the custodian and the manuscripts never leave their premises.",
  openGraph: {
    title: org.nameLatin,
    description:
      "Palm leaf does not wait. Folio-by-folio conservation of tadpatra manuscripts, at the custodian's own site.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${eczar.variable} ${tiroDeva.variable} ${courier.variable} ${tiroKannada.variable}`}
    >
      <body>
        {children}
        <ChatWidget />
      </body>
    </html>
  );
}
