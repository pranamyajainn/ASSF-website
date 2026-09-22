"use client";

import { useState } from "react";
import Link from "next/link";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { folioPrice, nav } from "@/content/shared";

/**
 * Below `lg` the primary nav in `Header` is hidden with nowhere else to go —
 * this is the way in. Headless UI supplies the focus trap, Escape-to-close
 * and ARIA wiring; every visual choice here is the site's own (ink-deep
 * panel, parchment type, the same rust "Give" treatment as the header).
 */
export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        className="ml-auto flex size-11 shrink-0 items-center justify-center border border-parchment/25 text-parchment lg:hidden"
      >
        <svg
          viewBox="0 0 24 24"
          width="20"
          height="20"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          aria-hidden="true"
        >
          <path d="M3 6h18" />
          <path d="M3 12h18" />
          <path d="M3 18h18" />
        </svg>
      </button>

      <Dialog open={open} onClose={setOpen} className="relative z-50 lg:hidden">
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-ink-deep/70 transition-opacity duration-200 data-[closed]:opacity-0"
        />
        <div className="fixed inset-0 flex justify-end">
          <DialogPanel
            transition
            className="flex h-full w-full max-w-xs flex-col bg-ground-deep px-6 py-6 transition-transform duration-200 ease-out data-[closed]:translate-x-full"
          >
            <div className="flex items-center justify-between">
              <p className="font-sans text-sm tracking-wide text-parchment/55">Menu</p>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="flex size-10 items-center justify-center text-parchment"
              >
                <svg
                  viewBox="0 0 24 24"
                  width="18"
                  height="18"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  aria-hidden="true"
                >
                  <path d="M5 5l14 14M19 5L5 19" />
                </svg>
              </button>
            </div>

            <ul className="mt-10 flex flex-col gap-6">
              {nav.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="text-2xl text-parchment-bright"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>

            <Link
              href="/#adopt"
              onClick={() => setOpen(false)}
              className="mt-auto bg-rust px-5 py-3 text-center font-sans text-base text-parchment-bright transition-colors hover:bg-rust/85"
            >
              Give — ₹{folioPrice}
            </Link>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
}
