import type { Metadata } from "next";
import { fontVariables } from "@/components/site/fonts";
import "../globals.css";

export const metadata: Metadata = {
  title: "Site editor — Acharya Shanti Sagar Foundation",
  robots: { index: false, follow: false },
};

/** The site editor's own document: the site's type and colours, none of its furniture. */
export default function EditorLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={fontVariables}>
      <body>{children}</body>
    </html>
  );
}
