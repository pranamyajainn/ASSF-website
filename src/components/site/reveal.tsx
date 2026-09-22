"use client";

import { useLayoutEffect, useRef, useState, type ReactNode } from "react";

/**
 * A single, restrained entrance: content sits 16px low and faded, then
 * settles into place the first time it crosses into view. Applied once,
 * inside `Section`, so every section on every page paces the same way —
 * the one motion decision on this site, made in one place.
 *
 * Safety rule: content that is ALREADY on screen when this mounts is never
 * hidden. It renders visible immediately — matching the server-rendered
 * markup exactly — and only elements confirmed to start off-screen get the
 * hidden-then-reveal treatment. This matters for a direct link to an
 * in-page anchor (the browser jumps straight to that section before
 * hydration finishes) and for slow or failed JS: worst case, everything is
 * simply visible, never a section stuck invisible.
 *
 * `prefers-reduced-motion` is already forced to near-zero duration globally
 * (see globals.css), so this degrades to an instant, non-animated reveal
 * for anyone who has asked for that.
 */
export function Reveal({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  // Starts visible, matching SSR output. Only flips to a hidden starting
  // state if the element is confirmed off-screen on mount (see below).
  const [hiddenUntilSeen, setHiddenUntilSeen] = useState(false);
  const [shown, setShown] = useState(false);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const inView = rect.top < window.innerHeight * 0.92 && rect.bottom > 0;
    if (inView) return; // Already visible — leave it alone, animate nothing.

    setHiddenUntilSeen(true);
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={
        hiddenUntilSeen
          ? `transition-[opacity,transform] duration-700 ease-out ${
              shown ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            }`
          : ""
      }
    >
      {children}
    </div>
  );
}
