"use client";

import { useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Container } from "./container";
import { MobileNav } from "./mobile-nav";
import { AiStamp, OPEN_CHAT_EVENT } from "@/components/chat/chat-widget";
import { localeInfo, localizeHref, locales, unlocalizePath, type Lang } from "@/i18n/config";
import type { UI } from "@/i18n/ui";
import { CLEAN_EVENT, CLEAN_KEY } from "./reading-mode";

/** Reading mode lives on <html data-clean>, set before paint by RootShell. */
function subscribeClean(onChange: () => void) {
  window.addEventListener(CLEAN_EVENT, onChange);
  return () => window.removeEventListener(CLEAN_EVENT, onChange);
}
const readClean = () => document.documentElement.hasAttribute("data-clean");
const readCleanOnServer = () => false;

function setClean(next: boolean) {
  document.documentElement.toggleAttribute("data-clean", next);
  try {
    localStorage.setItem(CLEAN_KEY, next ? "1" : "0");
  } catch {
    // Storage blocked: the choice holds for this page only.
  }
  window.dispatchEvent(new Event(CLEAN_EVENT));
}

/**
 * The front board of the bundle, then the masthead. Its controls are real
 * rather than decoration:
 *
 * - The language switcher moves between the three editions of the same
 *   page. Each name is written in its own script; switching is a full page
 *   load into the other edition, so the headline inks itself in afresh, as
 *   if the scribe had written the leaf again in the new script.
 * - "Clean the folio" strips the leaf's fibre and every ornament marked
 *   `data-ornament`, the way a conservator dry-cleans a leaf to read it.
 *   The choice is remembered: it stays on across pages and editions until
 *   the reader turns it off.
 * - "Ask AI" opens the Foundation's AI assistant from anywhere.
 */
export function HeaderClient({
  lang,
  nav,
  tagline,
  brandLine,
  name,
  phone,
  t,
  edition,
  homeHref,
  joinHref,
}: {
  lang: Lang;
  nav: readonly { label: string; href: string }[];
  tagline: string;
  brandLine: string;
  name: string;
  phone: string;
  t: UI["header"];
  edition: UI["edition"];
  homeHref: string;
  joinHref: string;
}) {
  const clean = useSyncExternalStore(subscribeClean, readClean, readCleanOnServer);
  const pathname = usePathname() ?? "/";
  const basePath = unlocalizePath(pathname);

  return (
    <>
      <div className="on-dark bg-board-deep text-board-ink">
        <Container>
          <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 py-2">
            <p className="hidden font-mono text-register text-board-soft md:block">
              <span lang="hi" className="font-serif text-[0.95rem] text-board-ink">
                {tagline}
              </span>
              <span aria-hidden="true" className="mx-2.5 text-cinnabar">
                ।
              </span>
              {brandLine}
            </p>

            <div className="flex items-center gap-x-4 sm:gap-x-5">
              <button
                type="button"
                onClick={() => window.dispatchEvent(new Event(OPEN_CHAT_EVENT))}
                className="flex items-center gap-2 py-1 text-[0.95rem] text-board-ink transition-colors hover:text-orpiment"
              >
                {t.ask} <AiStamp className="text-orpiment" />
                <span className="sr-only">{t.askSr}</span>
              </button>
              <span aria-hidden="true" className="h-4 w-px bg-board-soft/30" />

              <nav aria-label={t.language}>
                <ul className="flex items-center">
                  {locales.map((code) => {
                    const active = code === lang;
                    return (
                      <li key={code}>
                        <a
                          href={localizeHref(basePath, code)}
                          hrefLang={code}
                          lang={code}
                          aria-current={active ? "true" : undefined}
                          className={[
                            "block px-2 py-1 text-[0.95rem] transition-colors sm:px-2.5",
                            code === "kn" ? "font-kannada" : "",
                            active
                              ? "text-board-ink underline decoration-cinnabar decoration-2 underline-offset-[5px]"
                              : "text-board-soft hover:text-board-ink",
                          ].join(" ")}
                        >
                          {localeInfo[code].label}
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </nav>

              <button
                type="button"
                onClick={() => setClean(!clean)}
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
                  {t.cleanShort}
                </span>
                <span className="sr-only sm:not-sr-only">{t.cleanFolio}</span>
              </button>
            </div>
          </div>
        </Container>
      </div>

      <header className="border-b border-ink/15">
        <Container>
          <div className="flex items-center gap-x-8 py-4 lg:py-5">
            <Link href={homeHref} className="shrink-0" aria-label={`${name} — ${t.home}`}>
              <Image
                src="/images/logo/assf-logo.png"
                alt=""
                width={502}
                height={236}
                loading="eager"
                className="h-12 w-auto sm:h-14"
              />
            </Link>

            <nav aria-label={t.primary} className="ml-auto hidden xl:block">
              {/* Home first, so the reader always sees which page they are on:
                  the current one is underlined in red. */}
              <ul className="flex items-center gap-6 2xl:gap-7">
                {[{ label: t.homeLink, href: homeHref }, ...nav].map((item) => {
                  const current = pathname === item.href;
                  return (
                    <li key={item.href}>
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

            <MobileNav
              nav={nav}
              homeHref={homeHref}
              joinHref={joinHref}
              phone={phone}
              t={t}
              lang={lang}
            />
          </div>
        </Container>

        {/* A translated edition says so, and points back to the original. */}
        {lang !== "en" && edition.note ? (
          <div className="border-t border-ink/10 bg-leaf-deep/60">
            <Container>
              <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1 py-2 font-mono text-register text-ink-soft">
                <span aria-hidden="true" className="text-cinnabar">
                  ‸
                </span>
                {edition.note}
                <a
                  href={localizeHref(basePath, "en")}
                  hrefLang="en"
                  className="text-cinnabar underline decoration-cinnabar/40 underline-offset-4 hover:decoration-cinnabar"
                >
                  {edition.original}
                </a>
              </p>
            </Container>
          </div>
        ) : null}
      </header>
    </>
  );
}
