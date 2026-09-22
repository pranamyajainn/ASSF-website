import type { Metadata } from "next";
import { Inter, Tiro_Devanagari_Hindi, Tiro_Kannada } from "next/font/google";
import { org } from "@/content/shared";
import "./globals.css";

/**
 * Tiro Devanagari Hindi carries both the Devanagari and the Latin of the
 * design — one family for the running text keeps the two scripts on the same
 * baseline and colour. Inter handles labels, badges and UI chrome; Tiro
 * Kannada exists for the ಕನ್ನಡ switcher and Kannada place names.
 */
const tiroDeva = Tiro_Devanagari_Hindi({
  subsets: ["devanagari", "latin"],
  weight: "400",
  display: "swap",
  variable: "--font-tiro-deva",
});

const tiroKannada = Tiro_Kannada({
  subsets: ["kannada", "latin"],
  weight: "400",
  display: "swap",
  variable: "--font-tiro-kannada",
});

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
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
      className={`${tiroDeva.variable} ${tiroKannada.variable} ${inter.variable}`}
    >
      <body className="antialiased">{children}</body>
    </html>
  );
}
