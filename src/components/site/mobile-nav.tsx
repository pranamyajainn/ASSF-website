"use client";

import { useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { toScriptNumerals } from "@/lib/deva";
import type { UI } from "@/i18n/ui";

/**
 * Below `xl` the primary nav in the header is hidden — this is the way in.
 * A native modal <dialog> supplies the focus trap, Escape-to-close, the
 * inert page behind it and focus return, with no library shipped to every
 * visitor for it. The panel is the bundle's wooden board; each destination
 * is listed like the contents of a bundle, numbered in the edition's script.
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
  const dialogRef = useRef<HTMLDialogElement>(null);
  const pathname = usePathname();
  const close = () => dialogRef.current?.close();

  return (
    <>
      <button
        type="button"
        onClick={() => dialogRef.current?.showModal()}
        aria-haspopup="dialog"
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

      <dialog
        ref={dialogRef}
        aria-label={t.contents}
        // A click on the backdrop lands on the <dialog> itself; close then.
        onClick={(e) => {
          if (e.target === e.currentTarget) close();
        }}
        className="sheet on-dark fixed inset-y-0 left-auto right-0 m-0 h-dvh max-h-none w-full max-w-sm overflow-y-auto bg-board p-0 text-board-ink backdrop:bg-board-deep/70 xl:hidden"
      >
        <div className="flex min-h-full flex-col px-6 py-6">
          <div className="flex items-center justify-between">
            <p className="font-mono text-register text-board-soft">{t.contents}</p>
            <button
              type="button"
              onClick={close}
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
                    onClick={close}
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
            onClick={close}
            className="mt-10 self-start text-[1.0625rem] text-board-ink underline decoration-orpiment/50 underline-offset-[6px] hover:decoration-orpiment"
          >
            {t.join}
          </Link>
          <p className="mt-4 font-mono text-register text-board-soft">
            <a href={`tel:${phone.replace(/\s/g, "")}`} className="hover:text-board-ink">
              {phone}
            </a>
          </p>
        </div>
      </dialog>
    </>
  );
}
