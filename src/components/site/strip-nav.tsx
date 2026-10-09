"use client";

/**
 * Previous / next for a sideways strip of photographs: a mouse has no easy
 * way to scroll sideways, so these move it by most of its width.
 */
export function StripNav({ target, previous, next }: { target: string; previous: string; next: string }) {
  const move = (direction: 1 | -1) => {
    const strip = document.getElementById(target);
    strip?.scrollBy({ left: direction * strip.clientWidth * 0.8, behavior: "smooth" });
  };
  const button = "flex size-11 items-center justify-center border border-ink/30 text-[1.2rem] text-ink transition-colors hover:border-cinnabar hover:text-cinnabar";
  return (
    <div className="hidden gap-2 sm:flex">
      <button type="button" aria-label={previous} aria-controls={target} onClick={() => move(-1)} className={button}>
        ←
      </button>
      <button type="button" aria-label={next} aria-controls={target} onClick={() => move(1)} className={button}>
        →
      </button>
    </div>
  );
}
