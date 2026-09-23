"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Container } from "./primitives";
import { MobileNav } from "./mobile-nav";
import { AiStamp, OPEN_CHAT_EVENT } from "@/components/chat/chat-widget";
import { languages, nav, org } from "@/content/shared";

/**
 * The front board of the bundle, then the masthead. The design's two
 * utility controls are real rather than decoration:
 *
 * - "Clean the folio" strips the leaf's fibre and every ornament marked
 *   `data-ornament`, the way a conservator dry-cleans a leaf to read it. A
 *   reading mode, not a theme switch.
 * - The language switcher marks हिन्दी and ಕನ್ನಡ unavailable instead of
 *   linking to editions that do not exist yet. Same rule as the ledger: do
 *   not present something the Foundation has not supplied.
 */
export function Header() {
  const [clean, setClean] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    document.documentElement.toggleAttribute("data-clean", clean);
  }, [clean]);

  return (
    <>
      <div className="on-dark bg-board-deep text-board-ink">
        <Container>
          <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 py-2">
            <p className="hidden font-mono text-register text-board-soft sm:block">
              <span lang="hi" className="font-serif text-[0.95rem] text-board-ink">
                {org.tagline}
              </span>
              <span aria-hidden="true" className="mx-2.5 text-cinnabar">
                ।
              </span>
              {org.brandLine}
            </p>

            <div className="flex items-center gap-x-5">
              <button
                type="button"
                onClick={() => window.dispatchEvent(new Event(OPEN_CHAT_EVENT))}
                className="flex items-center gap-2 py-1 text-[0.95rem] text-board-ink transition-colors hover:text-orpiment"
              >
                Ask <AiStamp className="text-orpiment" />
                <span className="sr-only">— open the Foundation&apos;s AI assistant</span>
              </button>
              <span aria-hidden="true" className="h-4 w-px bg-board-soft/30" />
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
                      title={active ? undefined : "This edition has not been published yet."}
                      className={[
                        "px-2.5 py-1 text-[0.9rem] transition-colors",
                        lang.code === "kn" ? "font-kannada" : "",
                        active
                          ? "text-board-ink underline decoration-cinnabar decoration-2 underline-offset-[5px]"
                          : "cursor-not-allowed text-board-soft/70",
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
                className="flex items-center gap-2 whitespace-nowrap py-1 font-mono text-register text-board-soft transition-colors hover:text-board-ink"
              >
                <span
                  aria-hidden="true"
                  className={`size-2.5 rounded-full border transition-colors ${
                    clean ? "border-orpiment bg-orpiment" : "border-board-soft"
                  }`}
                />
                <span aria-hidden="true" className="sm:hidden">
                  Clean
                </span>
                <span className="sr-only sm:not-sr-only">Clean the folio</span>
              </button>
            </div>
          </div>
        </Container>
      </div>

      <header className="border-b border-ink/15">
        <Container>
          <div className="flex items-center gap-x-8 py-4 lg:py-5">
            <Link href="/" className="shrink-0" aria-label={`${org.nameLatin} — home`}>
              <Image
                src="/images/logo/assf-logo.png"
                alt=""
                width={502}
                height={236}
                loading="eager"
                className="h-12 w-auto sm:h-14"
              />
            </Link>

            <nav aria-label="Primary" className="ml-auto hidden xl:block">
              <ul className="flex items-center gap-7">
                {nav.map((item) => {
                  const current = pathname === item.href;
                  return (
                    <li key={item.label}>
                      <Link
                        href={item.href}
                        aria-current={current ? "page" : undefined}
                        className={`text-[1.0625rem] transition-colors hover:text-cinnabar ${
                          current
                            ? "text-ink underline decoration-cinnabar decoration-2 underline-offset-[7px]"
                            : "text-ink-soft"
                        }`}
                      >
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <MobileNav />
          </div>
        </Container>
      </header>
    </>
  );
}
