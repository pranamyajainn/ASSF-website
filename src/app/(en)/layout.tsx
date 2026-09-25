import type { Metadata } from "next";
import { RootShell } from "@/components/site/root-shell";
import { indexable, siteUrl } from "@/lib/site";
import "../globals.css";

export const metadata: Metadata = {
  metadataBase: siteUrl,
  applicationName: "Acharya Shanti Sagar Foundation",
  robots: indexable ? undefined : { index: false, follow: false },
  openGraph: { siteName: "Acharya Shanti Sagar Foundation", locale: "en_IN", type: "website" },
};

/** The English edition's root: `/`, `/about`, … and the trustee portal. */
export default function EnglishLayout({ children }: { children: React.ReactNode }) {
  return <RootShell lang="en">{children}</RootShell>;
}
