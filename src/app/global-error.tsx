"use client";

import { usePathname } from "next/navigation";
import { BrokenLeaf } from "@/components/site/broken-leaf";
import { fontVariables } from "@/components/site/fonts";
import { langFromPath } from "@/i18n/config";
import "./globals.css";

/**
 * If a root layout itself fails, this replaces the whole document. It reads
 * the edition from the address, since no layout is left to say.
 */
export default function GlobalError({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  const lang = langFromPath(usePathname());
  return (
    <html lang={lang} className={fontVariables}>
      <body>
        <title>Acharya Shanti Sagar Foundation</title>
        <BrokenLeaf lang={lang} error={error} retry={retry} />
      </body>
    </html>
  );
}
