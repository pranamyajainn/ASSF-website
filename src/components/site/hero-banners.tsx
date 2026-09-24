"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore, type TouchEvent } from "react";

export type BannerImage = { src: string; alt: string; caption?: string; position?: string };
export type Banner = {
  key: "conservation" | "community" | "rural" | "acharya";
  tab: string;
  eyebrow: string;
  title: string;
  em: string;
  titleLang?: string;
  body: string;
  translation?: string;
  fact: string;
  link: { label: string; href: string };
  images: readonly BannerImage[];
};
type Strings = { label: string; pause: string; play: string; previous: string; next: string; show: string; position: string };
type Dir = "fwd" | "back";

/** How long each banner holds before the next is laid over it. */
const DWELL = "7s";

const fill = (template: string, values: Record<string, string | number>) =>
  template.replace(/\{(\w+)\}/g, (_, key: string) => String(values[key] ?? ""));

const REDUCED = "(prefers-reduced-motion: reduce)";
function subscribeReduced(onChange: () => void) {
  const mq = window.matchMedia(REDUCED);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}
const readReduced = () => window.matchMedia(REDUCED).matches;

/**
 * What the Foundation does, told the way its own hero banners tell it: one
 * banner per part of the work, each a single line you can read in a few
 * seconds over the Foundation's own photographs of that work. Every banner
 * is a palm leaf, the text inscribed at the string-hole end and the
 * photographs mounted at the other; each new leaf slides in across the last.
 *
 * Unlike an image banner, every word is live text — translated in each
 * edition, read by screen readers, found by search — and the leaf sits
 * inside the page's margins rather than across the whole screen.
 *
 * The clock is the progress line on the active tab: when it fills, the next
 * leaf comes in. It pauses on hover, off screen and in a background tab; it
 * stops for good once someone takes the controls; and it never starts on
 * its own for readers who have asked for reduced motion.
 */
export function HeroBanners({ banners, strings }: { banners: readonly Banner[]; strings: Strings }) {
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

  const userStopped = stopped ?? reduced;
  const running = !userStopped && !hovered && onScreen && tabVisible;
  const total = banners.length;

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
    const io = new IntersectionObserver(([entry]) => setOnScreen(entry.isIntersecting), { threshold: 0.4 });
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

  const current = banners[active];

  return (
    <div
      ref={root}
      role="region"
      aria-roledescription="carousel"
      aria-label={strings.label}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={(e) => {
        // Keyboard focus inside the banners stops them — except on the
        // play/pause control, which has to be able to restart them.
        const target = e.target as HTMLElement;
        if (!target.closest("[data-rotation]") && target.matches(":focus-visible")) setStopped(true);
      }}
    >
      <p aria-live={userStopped ? "polite" : "off"} className="sr-only">
        {`${current.eyebrow}: ${current.title} ${current.em}`}
      </p>

      <div className="grid overflow-hidden" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        {banners.map((banner, i) => {
          const state = i === active ? (prev === null ? "current" : "in") : i === prev ? "out" : "idle";
          return (
            <div
              key={banner.key}
              role="group"
              aria-roledescription="slide"
              aria-label={fill(strings.position, { n: i + 1, total })}
              aria-hidden={i !== active}
              inert={i !== active}
              data-state={state}
              data-dir={dir}
              className="reel-slide [grid-area:1/1]"
            >
              <BannerLeaf banner={banner} eager={i === 0} />
            </div>
          );
        })}
      </div>

      {/* The controls, then one tab per banner, so the whole story is named
          at a glance; the active tab's line is the clock. The controls sit
          at the left, clear of the assistant's button in the corner. */}
      <div className="mt-2 flex items-start gap-3 sm:gap-5">
        <div className="flex shrink-0 gap-1 pt-1">
          <ReelButton label={strings.previous} onClick={() => step(-1, true)} className="hidden sm:grid">
            <path d="M10 3.5 5.5 8l4.5 4.5" />
          </ReelButton>
          <ReelButton label={userStopped ? strings.play : strings.pause} onClick={() => setStopped(!userStopped)} rotation>
            {userStopped ? <path d="M5.5 3.5v9l7-4.5z" fill="currentColor" /> : <path d="M5.75 4v8M10.25 4v8" />}
          </ReelButton>
          <ReelButton label={strings.next} onClick={() => step(1, true)} className="hidden sm:grid">
            <path d="M6 3.5 10.5 8 6 12.5" />
          </ReelButton>
        </div>
        <div className="grid flex-1 grid-cols-4 gap-2 sm:gap-3">
          {banners.map((banner, i) => (
            <button
              key={banner.key}
              type="button"
              aria-label={fill(strings.show, { name: banner.tab })}
              aria-current={i === active ? "true" : undefined}
              onClick={() => {
                setStopped(true);
                go(i, i > active ? "fwd" : "back");
              }}
              className="group min-w-0 cursor-pointer pt-2 text-left"
            >
              <span className="relative block h-0.5 overflow-hidden bg-ink/15 transition-colors group-hover:bg-ink/30">
                {i === active ? (
                  <span
                    key={`${active}-${prev}`}
                    className="reel-fill absolute inset-0 origin-left bg-cinnabar"
                    style={{ animationPlayState: running ? "running" : "paused", "--dwell": DWELL } as React.CSSProperties}
                    onAnimationEnd={() => step(1, false)}
                  />
                ) : i < active ? (
                  <span className="absolute inset-0 bg-cinnabar/45" />
                ) : null}
              </span>
              <span
                className={`mt-2 block truncate font-mono text-register transition-colors ${
                  i === active ? "text-ink" : "text-ink-soft group-hover:text-ink"
                }`}
              >
                {banner.tab}
              </span>
            </button>
          ))}
        </div>

      </div>
    </div>
  );
}

/** One banner: a palm leaf with its words at the string-hole end. */
function BannerLeaf({ banner, eager }: { banner: Banner; eager: boolean }) {
  return (
    <div className="leaf-panel grid h-full overflow-hidden lg:min-h-[27rem] lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] xl:min-h-[28rem]">
      <div className="relative flex min-w-0 flex-col justify-center px-6 pb-7 pt-6 sm:px-9 lg:py-8 lg:pl-16 lg:pr-8">
        <span aria-hidden="true" className="string-hole absolute left-6 top-1/2 hidden -translate-y-1/2 lg:block" />

        <p className="flex items-center gap-3 font-mono text-register text-cinnabar">
          <span aria-hidden="true" className="h-px w-5 bg-cinnabar/60" />
          {banner.eyebrow}
        </p>

        <p
          lang={banner.titleLang}
          className="mt-3 text-balance font-display text-[clamp(1.65rem,1.05rem+1.6vw,2.65rem)] font-medium leading-[1.1] tracking-[-0.01em] text-ink"
        >
          {banner.title} <span className="block text-cinnabar">{banner.em}</span>
        </p>

        {banner.translation ? (
          <p className="mt-2 font-mono text-register text-ink-soft">“{banner.translation}”</p>
        ) : null}

        <p className="mt-3 max-w-[38ch] text-[1.0625rem] leading-relaxed text-ink-soft lg:text-lg">{banner.body}</p>

        <p className="mt-4 flex max-w-[44ch] items-baseline gap-3 font-mono text-register text-cinnabar">
          <span aria-hidden="true" className="h-px w-5 shrink-0 -translate-y-[0.3em] bg-cinnabar/60" />
          {banner.fact}
        </p>

        <a
          href={banner.link.href}
          className="mt-5 self-start font-mono text-register text-ink underline decoration-cinnabar/70 decoration-1 underline-offset-4 transition-colors hover:text-cinnabar"
        >
          {banner.link.label} →
        </a>
      </div>

      <Collage banner={banner} eager={eager} />
    </div>
  );
}

const tile = "relative min-h-0 overflow-hidden bg-leaf";

/** The photographs, mounted on the leaf, composed for what each shows. */
function Collage({ banner, eager }: { banner: Banner; eager: boolean }) {
  const [a, b, c, d] = banner.images;
  const img = (image: BannerImage | undefined, sizes: string, extra?: React.CSSProperties) =>
    image ? (
      <Image
        src={image.src}
        alt={image.alt}
        fill
        loading={eager ? "eager" : "lazy"}
        sizes={sizes}
        className="object-cover"
        style={{ objectPosition: image.position ?? "center", ...extra }}
      />
    ) : null;

  const frame = "order-first grid h-52 gap-1.5 p-1.5 sm:h-72 lg:order-none lg:h-auto lg:gap-2 lg:p-2";

  if (banner.key === "conservation") {
    return (
      <div className={`${frame} grid-cols-[3fr_2fr] grid-rows-2`}>
        <div className={`${tile} row-span-2`}>{img(a, "(min-width: 1024px) 22rem, 60vw")}</div>
        <div className={tile}>{img(b, "(min-width: 1024px) 14rem, 40vw")}</div>
        <div className={tile}>{img(c, "(min-width: 1024px) 14rem, 40vw")}</div>
      </div>
    );
  }

  if (banner.key === "community") {
    return (
      <div className={`${frame} grid-cols-2 grid-rows-2`}>
        {[a, b, c, d].map((image, i) => (
          <div key={image?.src ?? i} className={tile}>
            {img(image, "(min-width: 1024px) 18rem, 50vw")}
          </div>
        ))}
      </div>
    );
  }

  if (banner.key === "rural") {
    // Before, during, after: the same ground at Yarnal three times.
    return (
      <div className={`${frame} grid-cols-3`}>
        {[a, b, c].map((image, i) => (
          <div key={image?.src ?? i} className={tile}>
            {img(image, "(min-width: 1024px) 13rem, 33vw")}
            {image?.caption ? (
              <span className="absolute inset-x-1.5 bottom-1.5 bg-leaf/92 px-2 py-1 font-mono text-[0.72rem] leading-snug text-ink lg:inset-x-2 lg:bottom-2 lg:text-register">
                {image.caption}
              </span>
            ) : null}
          </div>
        ))}
      </div>
    );
  }

  // The Acharya: his portrait and a photograph from his lifetime, mounted
  // on the dark board of a bundle's cover.
  return (
    <div className={`${frame} grid-cols-[2fr_3fr] bg-board lg:grid-cols-[4fr_5fr]`}>
      <div className={tile}>{img(a, "(min-width: 1024px) 16rem, 36vw", { filter: "sepia(0.25)", objectPosition: "50% 20%" })}</div>
      <div className={tile}>{img(b, "(min-width: 1024px) 20rem, 54vw", { filter: "sepia(0.25)", objectPosition: "55% 40%" })}</div>
    </div>
  );
}

function ReelButton({
  label,
  onClick,
  rotation,
  className = "grid",
  children,
}: {
  label: string;
  onClick: () => void;
  rotation?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      data-rotation={rotation ? "" : undefined}
      className={`${className} size-8 cursor-pointer place-items-center border border-ink/25 text-ink-soft transition-colors hover:border-cinnabar hover:text-cinnabar`}
    >
      <svg aria-hidden="true" viewBox="0 0 16 16" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.5">
        {children}
      </svg>
    </button>
  );
}
