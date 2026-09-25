import type { Metadata } from "next";
import Link from "next/link";
import { fontVariables } from "@/components/site/fonts";
import { LostLeaf, lostActionClass, lostCopy } from "@/components/site/lost-leaf";
import { localeInfo, locales } from "@/i18n/config";
import "./globals.css";

export const metadata: Metadata = {
  title: "Page not found — Acharya Shanti Sagar Foundation",
  robots: { index: false, follow: false },
};

/**
 * Every address that matches no page, in any edition. It renders before any
 * layout, so it can't tell which edition the reader was in: it says so in
 * all three, each with the way back to its own homepage.
 */
export default function GlobalNotFound() {
  return (
    <html lang="en" className={fontVariables}>
      <body>
        <LostLeaf
          lines={locales.map((lang) => ({
            lang,
            title: lostCopy[lang].missingTitle,
            body: lostCopy[lang].missingBody,
            action: (
              <Link href={localeInfo[lang].prefix || "/"} className={lostActionClass}>
                {lostCopy[lang].home} <span aria-hidden="true">→</span>
              </Link>
            ),
          }))}
        />
      </body>
    </html>
  );
}
