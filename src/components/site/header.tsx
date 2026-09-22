"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Container } from "./primitives";
import { MobileNav } from "./mobile-nav";
import { folioPrice, languages, nav, org } from "@/content/shared";

/**
 * Masthead, with the design's two utility controls made real rather than
 * left as decoration:
 *
 * - "Clean the folio" strips the woven ground texture and the hero watermark,
 *   the way a conservator dry-cleans a leaf to read it. It is a reading mode,
 *   not a theme switch.
 * - The language switcher marks हिन्दी and ಕನ್ನಡ unavailable instead of
 *   linking to editions that do not exist yet. Same rule as the ledger: do not
 *   present something the Foundation has not supplied.
 */
export function Header() {
  const [clean, setClean] = useState(false);

  return (
    <>
      <div className="bg-ink-deep/85">
        <Container>
          <div className="flex flex-wrap items-center justify-end gap-x-6 gap-y-2 py-2.5">
            <div className="flex items-center" role="group" aria-label="Language">
              {languages.map((lang, i) => {
                const active = i === 0;
                return (
                  <button
                    key={lang.code}
                    type="button"
                    lang={lang.code}
                    aria-current={active ? "true" : undefined}
                    aria-disabled={!active}
                    title={
                      active
                        ? undefined
                        : "This edition has not been published yet."
                    }
                    className={[
                      "px-3 py-1 font-sans text-sm transition-colors",
                      lang.code === "kn" ? "font-kannada" : "",
                      active
                        ? "bg-parchment text-ink"
                        : "text-parchment/45 hover:text-parchment/70",
                    ].join(" ")}
                  >
                    {lang.label}
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => setClean((v) => !v)}
              aria-pressed={clean}
              className="flex items-center gap-2.5 border border-parchment/25 px-3.5 py-1.5 font-sans text-sm text-parchment/85 transition-colors hover:border-parchment/45"
            >
              <span
                aria-hidden="true"
                className={`size-2 rounded-full transition-colors ${
                  clean ? "bg-sage" : "bg-parchment/30"
                }`}
              />
              Clean the folio
            </button>
          </div>
        </Container>
      </div>

      <header className="border-b border-parchment/10">
        <Container>
          <div className="flex flex-wrap items-center gap-x-8 gap-y-5 py-6">
            <Link href="/" className="flex min-w-0 shrink-0 items-center">
              <Image
                src="/images/logo/assf-logo.png"
                alt={org.nameLatin}
                width={502}
                height={236}
                priority
                className="h-12 w-auto bg-parchment-bright/95 px-2 py-1.5 sm:h-14"
              />
            </Link>

            <nav aria-label="Primary" className="ml-auto hidden lg:block">
              <ul className="flex items-center gap-8">
                {nav.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="text-base text-parchment/85 transition-colors hover:text-parchment-bright"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <MobileNav />

            <Link
              href="/#adopt"
              className="ml-auto hidden shrink-0 bg-rust px-5 py-3 font-sans text-base text-parchment-bright transition-colors hover:bg-rust/85 sm:px-6 lg:ml-0 lg:block"
            >
              Give — ₹{folioPrice}
            </Link>
          </div>
        </Container>
      </header>

      {/* Scoped to the document so the toggle can reach the body texture. */}
      {clean ? (
        <style>{`
          body { background-image: none !important; }
          [data-ornament] { opacity: 0 !important; }
        `}</style>
      ) : null}
    </>
  );
}
