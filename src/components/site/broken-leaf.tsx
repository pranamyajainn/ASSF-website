"use client";

import Link from "next/link";
import { useEffect } from "react";
import { localeInfo, type Lang } from "@/i18n/config";
import { LostLeaf, lostActionClass, lostCopy } from "./lost-leaf";

/**
 * What a page shows if it fails while rendering: the edition's own words,
 * a retry (which re-fetches the page — most failures are passing ones), and
 * the way home. The error itself goes to the console, where Vercel's logs
 * pick it up by its digest.
 */
export function BrokenLeaf({ lang, error, retry }: { lang: Lang; error: Error & { digest?: string }; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  const t = lostCopy[lang];
  return (
    <LostLeaf
      lines={[
        {
          lang,
          title: t.brokenTitle,
          body: t.brokenBody,
          action: (
            <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
              <button type="button" onClick={() => retry()} className={`${lostActionClass} cursor-pointer`}>
                {t.retry} <span aria-hidden="true">↻</span>
              </button>
              <Link href={localeInfo[lang].prefix || "/"} className={lostActionClass}>
                {t.home} <span aria-hidden="true">→</span>
              </Link>
            </div>
          ),
        },
      ]}
    />
  );
}
