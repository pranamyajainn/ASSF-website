import type { Metadata } from "next";
import { RootShell } from "@/components/site/root-shell";
import "../globals.css";

export const metadata: Metadata = {
  openGraph: { siteName: "Acharya Shanti Sagar Foundation", locale: "en_IN", type: "website" },
};

/** The English edition's root: `/`, `/about`, … and the trustee portal. */
export default function EnglishLayout({ children }: { children: React.ReactNode }) {
  return <RootShell lang="en">{children}</RootShell>;
}
