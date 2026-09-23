"use client";

import { useLayoutEffect, useRef, useState } from "react";

/**
 * The folio wall, drawn as what it is: a bundle. Each leaf is one folio a
 * donor can fund; a funded leaf is inked, a waiting one is bare. Between
 * the two wooden boards, the binding cord runs through the stack at the
 * string-holes. Today `filled` is 0, so the bundle arrives blank.
 *
 * The leaves settle onto the stack one after another the first time the
 * bundle scrolls into view. Same safety rule as before: if it is already on
 * screen when this mounts (a direct link to #adopt, or slow JS), it renders
 * in its final state immediately — never a stuck, invisible bundle.
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
    if (inView) return;

    setAnimate(true);
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      role="img"
      aria-label={`Folio bundle: ${filled} of ${total} leaves funded. It stays blank until real folio records exist.`}
      className="relative mt-12 max-w-[40rem] px-3"
    >
      <Board />
      <div className="flex flex-col-reverse gap-[2px] py-[3px]">
        {Array.from({ length: total }, (_, i) => (
          <span
            key={i}
            aria-hidden="true"
            style={animate ? { transitionDelay: `${Math.min(i * 7, 640)}ms` } : undefined}
            className={`block h-[2px] rounded-full ${
              i < filled ? "bg-ink" : "bg-[color-mix(in_oklab,var(--color-leaf-edge)_85%,var(--color-ink))]"
            } ${
              animate
                ? `transition-[opacity,transform] duration-500 ease-out ${
                    shown ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"
                  }`
                : ""
            }`}
          />
        ))}
      </div>
      <Board />
      {/* The cord, through both string-holes. */}
      <span data-ornament aria-hidden="true" className="absolute -inset-y-3 left-[28%] w-px bg-cinnabar/70" />
      <span data-ornament aria-hidden="true" className="absolute -inset-y-3 left-[72%] w-px bg-cinnabar/70" />
    </div>
  );
}

function Board() {
  return <span aria-hidden="true" className="-mx-3 block h-2.5 rounded-[3px] bg-board" />;
}
