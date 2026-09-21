"use client";

import { useState } from "react";
import { Container } from "./primitives";
import { Seal } from "./seal";
import { folioPrice, languages, nav, org } from "@/content/home";

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
            <a href="#top" className="flex min-w-0 items-center gap-3 sm:gap-4">
              <Seal className="size-10 shrink-0 text-gold sm:size-12" />
              <span className="min-w-0">
                <span className="block text-xl leading-tight text-parchment-bright sm:text-2xl">
                  {org.nameDeva}
                </span>
                <span className="mt-0.5 block font-sans text-[0.6rem] tracking-[0.12em] text-parchment/65 sm:text-xs sm:tracking-[0.18em]">
                  {org.nameLatin.toUpperCase()}
                </span>
              </span>
            </a>

            <nav aria-label="Primary" className="ml-auto hidden lg:block">
              <ul className="flex items-center gap-9">
                {nav.map((item) => (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      className="text-lg text-parchment/85 transition-colors hover:text-parchment-bright"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <a
              href="#adopt"
              className="ml-auto shrink-0 bg-rust px-5 py-3 font-sans text-base text-parchment-bright transition-colors hover:bg-rust/85 sm:px-6 lg:ml-0"
            >
              Give — ₹{folioPrice}
            </a>
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
