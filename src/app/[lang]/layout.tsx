import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RootShell } from "@/components/site/root-shell";
import { isLang, localeInfo, translatedLocales } from "@/i18n/config";
import { indexable, siteUrl } from "@/lib/site";
import "../globals.css";

/** Only the editions that exist; any other first segment is a 404. */
export const dynamicParams = false;

export function generateStaticParams() {
  return translatedLocales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  return {
    metadataBase: siteUrl,
    applicationName: "Acharya Shanti Sagar Foundation",
    robots: indexable ? undefined : { index: false, follow: false },
    openGraph: {
      siteName: "Acharya Shanti Sagar Foundation",
      locale: isLang(lang) ? localeInfo[lang].ogLocale : "en_IN",
      type: "website",
    },
  };
}

/** The Hindi and Kannada editions' root: `/hi/…`, `/kn/…`. */
export default async function EditionLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLang(lang) || lang === "en") notFound();
  return <RootShell lang={lang}>{children}</RootShell>;
}
