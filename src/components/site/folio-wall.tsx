"use client";

import { useLayoutEffect, useRef, useState, type CSSProperties } from "react";

/** Leaves drawn in the bundle — enough to read as a pothi, not a count. */
const LEAVES = 16;

/**
 * The folio bundle, drawn as the object itself: a pothi of palm leaves
 * between two painted wooden covers, the binding cord through the
 * string-hole and a tassel hanging free. When it comes into view the cord
 * slackens and the leaves fan open around it, one after another — the way
 * a bundle is opened to be read.
 *
 * An adopted folio will carry a red slip at its edge, as a reader marks a
 * leaf. None has been adopted yet, and the bundle says so rather than
 * inventing a tally.
 *
 * If the bundle is already on screen when this mounts (a direct link to
 * #adopt, or slow JavaScript) it opens at once. Under reduced motion it
 * rests open, without moving.
 */
export function FolioWall({ filled, label, note }: { filled: number; label: string; note: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.85 && rect.bottom > 0) {
      setOpen(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setOpen(true);
          observer.disconnect();
        }
      },
      { threshold: 0.45 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <figure className="mt-10 max-w-[40rem]">
      <div
        ref={ref}
        role="img"
        aria-label={label}
        data-open={open ? "" : undefined}
        className="pothi relative mx-auto aspect-[16/9] w-full"
      >
        {/* Lower cover. */}
        <span aria-hidden="true" className="pothi-cover absolute bottom-[7%] left-[2%] right-[2%] h-[7%]" />

        {Array.from({ length: LEAVES }, (_, i) => (
          <span
            key={i}
            aria-hidden="true"
            className="pothi-leaf absolute left-[5%] right-[5%] h-[8%]"
            style={
              {
                "--i": i,
                "--k": LEAVES - 1 - i,
                bottom: `calc(14% + ${i} * 2.3%)`,
                "--tone": `${(i * 37) % 11}%`,
              } as CSSProperties
            }
          >
            {i < filled ? <span className="pothi-slip" /> : null}
          </span>
        ))}

        {/* Upper cover, painted. */}
        <span
          aria-hidden="true"
          className="pothi-cover pothi-cover-top absolute left-[2%] right-[2%] h-[7%]"
          style={{ bottom: `calc(14% + ${LEAVES} * 2.3% + 1%)` }}
        />

        {/* The cord through the string-hole, and its tassel. */}
        <span data-ornament aria-hidden="true" className="pothi-cord absolute bottom-[3%] left-[29.6%] top-[30%] w-[2px]" />
        <span data-ornament aria-hidden="true" className="pothi-tassel absolute bottom-0 left-[28.4%] h-[9%] w-[2.4%]" />
      </div>

      <figcaption className="mt-5 flex items-start gap-3 font-mono text-register text-ink-soft">
        <span aria-hidden="true" className="mt-1 inline-block h-3 w-1.5 shrink-0 bg-cinnabar" />
        <span>{note}</span>
      </figcaption>
    </figure>
  );
}
