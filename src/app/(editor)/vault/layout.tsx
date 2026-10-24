import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Trust documents — Acharya Shanti Sagar Foundation",
  robots: { index: false, follow: false },
};

/** The vault's own title, on its sign-in screens as well as the page. */
export default function VaultLayout({ children }: { children: React.ReactNode }) {
  return children;
}
