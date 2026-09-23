"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { toScriptNumerals } from "@/lib/deva";
import type { UI } from "@/i18n/ui";

/**
 * Below `xl` the primary nav in `Header` is hidden — this is the way in.
 * Headless UI supplies the focus trap, Escape-to-close and ARIA wiring. The
 * panel is the bundle's wooden board; each destination is listed like the
 * contents of a bundle, numbered in Devanagari.
 */
export function MobileNav({
  nav,
  homeHref,
  joinHref,
  phone,
  t,
  lang,
}: {
  lang: string;
  nav: readonly { label: string; href: string }[];
  homeHref: string;
  joinHref: string;
  phone: string;
  t: UI["header"];
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="ml-auto flex h-11 shrink-0 items-center gap-2.5 border border-ink/30 px-3.5 text-ink xl:hidden"
      >
        <svg
          viewBox="0 0 24 24"
          width="18"
          height="18"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          aria-hidden="true"
        >
          <path d="M3 7h18M3 12h18M3 17h18" />
        </svg>
        <span className="font-mono text-register">{t.contents}</span>
      </button>

      <Dialog open={open} onClose={setOpen} className="relative z-50 xl:hidden">
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-board-deep/70 transition-opacity duration-200 data-[closed]:opacity-0"
        />
        <div className="fixed inset-0 flex justify-end">
          <DialogPanel
            transition
            className="on-dark flex h-full w-full max-w-sm flex-col overflow-y-auto bg-board px-6 py-6 text-board-ink transition-transform duration-200 ease-out data-[closed]:translate-x-full"
          >
            <div className="flex items-center justify-between">
              <p className="font-mono text-register text-board-soft">{t.contents}</p>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label={t.closeMenu}
                className="flex size-11 items-center justify-center text-board-ink"
              >
                <svg
                  viewBox="0 0 24 24"
                  width="18"
                  height="18"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  aria-hidden="true"
                >
                  <path d="M5 5l14 14M19 5L5 19" />
                </svg>
              </button>
            </div>

            <ol className="mt-8 border-t border-board-ink/15">
              {[{ label: t.homeLink, href: homeHref }, ...nav].map((item, i) => {
                const current = pathname === item.href;
                return (
                  <li key={item.href} className="border-b border-board-ink/15">
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      aria-current={current ? "page" : undefined}
                      className="flex items-baseline gap-4 py-4"
                    >
                      <span aria-hidden="true" className="w-6 font-display text-[1.1rem] text-orpiment">
                        {toScriptNumerals(i + 1, lang)}
                      </span>
                      <span
                        className={`font-display text-[1.45rem] leading-tight ${
                          current ? "text-orpiment" : "text-board-ink"
                        }`}
                      >
                        {item.label}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ol>

            <Link
              href={joinHref}
              onClick={() => setOpen(false)}
              className="mt-10 self-start text-[1.0625rem] text-board-ink underline decoration-orpiment/50 underline-offset-[6px] hover:decoration-orpiment"
            >
              {t.join}
            </Link>
            <p className="mt-4 font-mono text-register text-board-soft">
              <a href={`tel:${phone.replace(/\s/g, "")}`} className="hover:text-board-ink">
                {phone}
              </a>
            </p>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
}
