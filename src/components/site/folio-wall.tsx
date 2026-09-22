"use client";

import { useLayoutEffect, useRef, useState } from "react";

/**
 * The folio wall: one cell per conserved folio. Cells materialise
 * left-to-right, top-to-bottom, the first time the wall scrolls into view —
 * the ledger filling in one leaf at a time, not appearing all at once as a
 * finished grid. Filled cells (rust) and empty ones (bark outline) both take
 * part; today `filled` is 0, so the whole wall arrives empty and waiting.
 *
 * Same safety rule as `Reveal`: if the wall is already on screen when this
 * mounts (a direct link to #adopt, or slow JS), it renders in its final
 * state immediately rather than risking a stuck-invisible grid.
 */
export function FolioWall({
  total,
  filled,
}: {
  total: number;
  filled: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [animate, setAnimate] = useState(false);
  const [shown, setShown] = useState(false);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const inView = rect.top < window.innerHeight * 0.92 && rect.bottom > 0;
    if (inView) return; // Already visible — render the final grid, no animation.

    setAnimate(true);
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
      className="mt-12 grid grid-cols-[repeat(auto-fill,minmax(1.5rem,1fr))] gap-1.5 sm:grid-cols-[repeat(20,minmax(0,1fr))]"
      role="img"
      aria-label={`Folio wall: ${filled} of ${total} cells filled. It stays empty until real folio records exist.`}
    >
      {Array.from({ length: total }, (_, i) => (
        <span
          key={i}
          aria-hidden="true"
          style={animate ? { transitionDelay: `${Math.min(i * 8, 650)}ms` } : undefined}
          className={`aspect-[2/3] border ${
            i < filled ? "border-rust bg-rust/20" : "border-bark/55 bg-transparent"
          } ${
            animate
              ? `transition-[opacity,transform] duration-500 ease-out ${
                  shown ? "scale-100 opacity-100" : "scale-90 opacity-0"
                }`
              : ""
          }`}
        />
      ))}
    </div>
  );
}
