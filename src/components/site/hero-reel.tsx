"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore, type TouchEvent } from "react";

/** `{n} of {total}` style labels, filled on the client. */
const fill = (template: string, values: Record<string, number>) =>
  template.replace(/\{(\w+)\}/g, (_, key: string) => String(values[key] ?? ""));

type Slide = { src: string; alt: string; pillar: string; caption: string; position: string };
type Strings = { label: string; pause: string; play: string; previous: string; next: string; show: string; position: string };
type Dir = "fwd" | "back";

const REDUCED = "(prefers-reduced-motion: reduce)";
function subscribeReduced(onChange: () => void) {
  const mq = window.matchMedia(REDUCED);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}
const readReduced = () => window.matchMedia(REDUCED).matches;

/**
 * The work in pictures, beside the headline: one photograph after another,
 * each sliding in across the last the way leaves are laid one on another
 * when a bundle is read. The frame is the size of the single photograph it
 * replaced, never the width of the page.
 *
 * The clock is the progress bar under the frame: when the active segment
 * finishes filling, the next picture comes in. Pausing the bar pauses the
 * pictures, so it stops on hover, while off screen, in a background tab,
 * and for good once someone takes the controls. It never starts on its own
 * for readers who have asked for reduced motion.
 */
export function HeroReel({ slides, strings }: { slides: readonly Slide[]; strings: Strings }) {
  const reduced = useSyncExternalStore(subscribeReduced, readReduced, () => false);
  const [active, setActive] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const [dir, setDir] = useState<Dir>("fwd");
  const [stopped, setStopped] = useState<boolean | null>(null);
  const [hovered, setHovered] = useState(false);
  const [onScreen, setOnScreen] = useState(true);
  const [tabVisible, setTabVisible] = useState(true);
  const root = useRef<HTMLDivElement>(null);
  const touchX = useRef<number | null>(null);

  // Until someone presses play or pause, reduced motion decides.
  const userStopped = stopped ?? reduced;
  const running = !userStopped && !hovered && onScreen && tabVisible;
  const total = slides.length;

  const go = useCallback(
    (next: number, direction: Dir) => {
      if (next === active) return;
      setPrev(active);
      setActive(next);
      setDir(direction);
    },
    [active],
  );

  const step = useCallback(
    (delta: 1 | -1, byHand: boolean) => {
      if (byHand) setStopped(true);
      go((active + delta + total) % total, delta === 1 ? "fwd" : "back");
    },
    [active, go, total],
  );

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setOnScreen(entry.isIntersecting), { threshold: 0.35 });
    io.observe(el);
    const onVis = () => setTabVisible(document.visibilityState === "visible");
    document.addEventListener("visibilitychange", onVis);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  function onTouchStart(e: TouchEvent) {
    touchX.current = e.touches[0]?.clientX ?? null;
  }
  function onTouchEnd(e: TouchEvent) {
    const start = touchX.current;
    touchX.current = null;
    const end = e.changedTouches[0]?.clientX;
    if (start == null || end == null || Math.abs(end - start) < 40) return;
    step(end < start ? 1 : -1, true);
  }

  const slide = slides[active];

  return (
    <div
      ref={root}
      role="region"
      aria-roledescription="carousel"
      aria-label={strings.label}
      className="min-w-0"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={(e) => {
        // Keyboard focus inside the pictures stops them, except on the
        // play/pause control itself, which has to be able to restart them.
        if (!(e.target as HTMLElement).closest("[data-rotation]") && (e.target as HTMLElement).matches(":focus-visible")) {
          setStopped(true);
        }
      }}
    >
      <div
        className="relative aspect-[4/3] w-full overflow-hidden bg-leaf-deep"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {slides.map((s, i) => {
          const state = i === active ? (prev === null ? "current" : "in") : i === prev ? "out" : "idle";
          return (
            <div
              key={s.src}
              role="group"
              aria-roledescription="slide"
              aria-label={fill(strings.position, { n: i + 1, total })}
              aria-hidden={i !== active}
              inert={i !== active}
              data-state={state}
              data-dir={dir}
              className="reel-slide absolute inset-0"
            >
              <Image
                src={s.src}
                alt={s.alt}
                fill
                loading={i === 0 ? "eager" : "lazy"}
                fetchPriority={i === 0 ? "high" : "auto"}
                sizes="(min-width: 1376px) calc(50vw - 20rem), (min-width: 1280px) 23rem, (min-width: 460px) 26rem, calc(100vw - 5rem)"
                className="object-cover"
                style={{ objectPosition: s.position }}
              />
            </div>
          );
        })}
      </div>

      {/* Progress, one segment per picture; the active one is the clock. */}
      <div className="mt-1 flex gap-1.5 xl:pr-6">
        {slides.map((s, i) => (
          <button
            key={s.src}
            type="button"
            aria-label={fill(strings.show, { n: i + 1 })}
            aria-current={i === active ? "true" : undefined}
            onClick={() => {
              setStopped(true);
              go(i, i > active ? "fwd" : "back");
            }}
            className="group flex h-6 flex-1 cursor-pointer items-center"
          >
            <span className="relative block h-0.5 w-full overflow-hidden bg-ink/15 transition-colors group-hover:bg-ink/30">
              {i === active ? (
                <span
                  key={`${active}-${prev}`}
                  className="reel-fill absolute inset-0 origin-left bg-cinnabar"
                  style={{ animationPlayState: running ? "running" : "paused" }}
                  onAnimationEnd={() => step(1, false)}
                />
              ) : i < active ? (
                <span className="absolute inset-0 bg-cinnabar/45" />
              ) : null}
            </span>
          </button>
        ))}
      </div>

      <div className="mt-1.5 flex items-start justify-between gap-4 xl:pr-6">
        <p aria-live={userStopped ? "polite" : "off"} className="min-h-[4.5rem] min-w-0 font-mono text-register">
          <span className="block text-cinnabar">{slide.pillar}</span>
          <span className="block text-ink-faint">{slide.caption}</span>
        </p>

        <div className="flex shrink-0 gap-1">
          <ReelButton label={strings.previous} onClick={() => step(-1, true)}>
            <path d="M10 3.5 5.5 8l4.5 4.5" />
          </ReelButton>
          <ReelButton
            label={userStopped ? strings.play : strings.pause}
            onClick={() => setStopped(!userStopped)}
            rotation
          >
            {userStopped ? <path d="M5.5 3.5v9l7-4.5z" fill="currentColor" /> : <path d="M5.75 4v8M10.25 4v8" />}
          </ReelButton>
          <ReelButton label={strings.next} onClick={() => step(1, true)}>
            <path d="M6 3.5 10.5 8 6 12.5" />
          </ReelButton>
        </div>
      </div>
    </div>
  );
}

function ReelButton({
  label,
  onClick,
  rotation,
  children,
}: {
  label: string;
  onClick: () => void;
  rotation?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      data-rotation={rotation ? "" : undefined}
      className="grid size-8 cursor-pointer place-items-center border border-ink/25 text-ink-soft transition-colors hover:border-cinnabar hover:text-cinnabar"
    >
      <svg aria-hidden="true" viewBox="0 0 16 16" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.5">
        {children}
      </svg>
    </button>
  );
}
