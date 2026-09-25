import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { fontVariables } from "@/components/site/fonts";
import { isLang } from "@/i18n/config";
import "../../../globals.css";

export const metadata: Metadata = {
  title: "Preview — Acharya Shanti Sagar Foundation",
  robots: { index: false, follow: false },
};

/** The editor's preview of one edition: the site's own document, without the assistant. */
export default async function PreviewLayout({ children, params }: { children: React.ReactNode; params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  return (
    <html lang={lang} className={fontVariables}>
      <body>{children}</body>
    </html>
  );
}
