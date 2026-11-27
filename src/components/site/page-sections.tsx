import Image from "next/image";
import { Button, Leaf } from "./primitives";

/**
 * The building blocks the Foundation's page designs (Nov 2026) repeat from
 * page to page: an opener, a row of figures, photographs with captions,
 * subject tags, photo cards, numbered steps, and the dark "be part of it"
 * band. Each takes its words from the page's content module, so every
 * piece stays editable in the site editor.
 */

type Photo = { src: string; alt: string; caption?: string };
type Figure = { value: string; label: string };

/** The first leaf of a page: a small line, the title, a few paragraphs, a photograph beside them, then figures. */
export function Opener({
  question,
  label,
  eyebrow,
  title,
  paragraphs,
  image,
  images,
  figures,
}: {
  question?: string;
  label?: string;
  eyebrow?: string;
  title: string;
  paragraphs: readonly string[];
  /** One photograph with its caption — or `images`: two (an arched one beside a wide one) or three (a mosaic). */
  image?: Photo;
  images?: readonly Photo[];
  figures?: readonly Figure[];
}) {
  const pictured = !!image?.src || !!images?.length;
  return (
    <Leaf id="top" label={label} question={question} innerClassName="!pt-10 md:!pt-14 lg:!pt-16">
      <div className={`bleed-margin grid items-center gap-x-10 gap-y-10 ${pictured ? "lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]" : ""}`}>
        <div className="min-w-0">
          {eyebrow ? <p className="font-mono text-register text-cinnabar">{eyebrow}</p> : null}
          <h1 className="inked ink-on-load mt-4 max-w-[16ch] text-balance font-display text-title font-medium tracking-[-0.015em]">
            {title}
            <span className="text-cinnabar" aria-hidden="true">
              {" "}॥
            </span>
          </h1>
          {paragraphs.map((p, i) => (
            <p key={i} className={`max-w-[52ch] text-ink ${i === 0 ? "mt-6 text-lede" : "mt-4 text-[1.125rem] leading-[1.6]"}`}>
              {p}
            </p>
          ))}
        </div>
        {image?.src ? (
          <figure className="min-w-0">
            <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-leaf-deep shadow-[0_18px_34px_-24px_rgb(0_0_0/0.65)]">
              <Image src={image.src} alt={image.alt} fill priority sizes="(min-width: 1024px) 34rem, 92vw" className="object-cover" />
            </div>
            {image.caption ? <figcaption className="mt-3 font-mono text-register text-ink-soft">{image.caption}</figcaption> : null}
          </figure>
        ) : images?.length ? (
          <Collage images={images} />
        ) : null}
      </div>
      {figures?.length ? <Figures items={figures} className="mt-12" /> : null}
    </Leaf>
  );
}

/** Two photographs side by side (the first arched), or three as a mosaic: one tall, two stacked. */
function Collage({ images }: { images: readonly Photo[] }) {
  const pic = (photo: Photo, className: string, sizes: string) => (
    <div className={`relative overflow-hidden bg-leaf-deep shadow-[0_18px_34px_-24px_rgb(0_0_0/0.65)] ${className}`}>
      <Image src={photo.src} alt={photo.alt} fill priority sizes={sizes} className="object-cover" />
    </div>
  );
  if (images.length >= 3) {
    const [a, b, c] = images;
    return (
      <div className="grid min-w-0 grid-cols-[3fr_2fr] grid-rows-2 gap-3">
        {pic(a, "row-span-2 aspect-[3/4] rounded-t-full rounded-b-lg", "(min-width: 1024px) 20rem, 55vw")}
        {pic(b, "rounded-lg", "(min-width: 1024px) 13rem, 38vw")}
        {pic(c, "rounded-lg", "(min-width: 1024px) 13rem, 38vw")}
      </div>
    );
  }
  const [a, b] = images;
  return (
    <div className="grid min-w-0 grid-cols-[1.1fr_1fr] items-center gap-3">
      {pic(a, "aspect-[4/5] rounded-t-[10rem] rounded-b-lg", "(min-width: 1024px) 18rem, 48vw")}
      {b ? pic(b, "aspect-[4/5] rounded-lg", "(min-width: 1024px) 16rem, 44vw") : null}
    </div>
  );
}

/** A row of figures, each a large number and what it counts, between hairlines. */
export function Figures({ items, className = "" }: { items: readonly Figure[]; className?: string }) {
  return (
    <dl className={`bleed-margin grid grid-cols-2 border-y border-ink/15 ${["", "lg:grid-cols-1", "lg:grid-cols-2", "lg:grid-cols-3", "lg:grid-cols-4"][Math.min(items.length, 4)]} ${className}`}>
      {items.map((figure, i) => (
        <div key={`${figure.value}-${i}`} className={`py-5 pr-4 ${i % 2 === 1 ? "border-l border-ink/15 pl-4" : ""} ${i > 0 ? "lg:border-l lg:border-ink/15 lg:pl-5" : ""}`}>
          <dt className="sr-only">{figure.label}</dt>
          <dd className="font-display text-[clamp(1.8rem,1.4rem+1.2vw,2.5rem)] font-semibold leading-none text-cinnabar">{figure.value}</dd>
          <dd className="mt-2 text-[1rem] leading-snug text-ink">{figure.label}</dd>
        </div>
      ))}
    </dl>
  );
}

/** Photographs in a grid, each with its caption underneath. */
export function PhotoGrid({ items, columns = 2, className = "" }: { items: readonly Photo[]; columns?: 2 | 3 | 4; className?: string }) {
  const cols = { 2: "grid-cols-2", 3: "grid-cols-2 md:grid-cols-3", 4: "grid-cols-2 lg:grid-cols-4" }[columns];
  return (
    <div className={`grid gap-3 ${cols} ${className}`}>
      {items.map((photo) => (
        <figure key={photo.src} className="min-w-0">
          <div className="relative aspect-[4/3] overflow-hidden rounded-[3px] bg-leaf-deep">
            <Image src={photo.src} alt={photo.alt} fill sizes={columns === 4 ? "(min-width: 1024px) 16rem, 46vw" : "(min-width: 1024px) 18rem, 46vw"} className="object-cover" />
          </div>
          {photo.caption ? <figcaption className="mt-2 font-mono text-[0.78rem] leading-snug text-ink-soft">{photo.caption}</figcaption> : null}
        </figure>
      ))}
    </div>
  );
}

/** Small rounded tags: the subjects a collection holds. */
export function Tags({ items, className = "" }: { items: readonly string[]; className?: string }) {
  return (
    <ul className={`flex flex-wrap gap-2 ${className}`}>
      {items.map((tag) => (
        <li key={tag} className="rounded-full border border-ink/30 px-3 py-1 font-mono text-[0.78rem] text-ink-soft">
          {tag}
        </li>
      ))}
    </ul>
  );
}

/** Cards side by side: a photograph, a small label, a title and a few lines. */
export function PhotoCards({ items }: { items: readonly { image: Photo; label: string; title: string; body: string }[] }) {
  return (
    <ul className="bleed-margin mt-10 grid gap-x-7 gap-y-10 md:grid-cols-3">
      {items.map((card) => (
        <li key={card.title} className="min-w-0">
          <div className="relative aspect-[4/3] overflow-hidden rounded-[3px] bg-leaf-deep">
            <Image src={card.image.src} alt={card.image.alt} fill sizes="(min-width: 768px) 30vw, 92vw" className="object-cover" />
          </div>
          <p className="mt-4 font-mono text-register text-cinnabar">{card.label}</p>
          <h3 className="mt-1.5 font-display text-[1.45rem] font-medium leading-tight text-ink">{card.title}</h3>
          <p className="mt-2 text-[1.0313rem] leading-relaxed text-ink-soft">{card.body}</p>
        </li>
      ))}
    </ul>
  );
}

/** Numbered steps in a grid of hairline cells: 01, 02… */
export function Steps({ items, columns = 4, className = "" }: { items: readonly { title: string; body: string }[]; columns?: 3 | 4 | 5; className?: string }) {
  // Literal class strings, so Tailwind sees them: the columns, and a hairline between cells except at a row's start.
  const cols = { 3: "md:grid-cols-3", 4: "sm:grid-cols-2 lg:grid-cols-4", 5: "sm:grid-cols-2 lg:grid-cols-5" }[columns];
  const cell = {
    3: "md:border-l md:pl-5 md:[&:nth-child(3n+1)]:border-l-0 md:[&:nth-child(3n+1)]:pl-0",
    4: "lg:border-l lg:pl-5 lg:[&:nth-child(4n+1)]:border-l-0 lg:[&:nth-child(4n+1)]:pl-0",
    5: "lg:border-l lg:pl-5 lg:[&:nth-child(5n+1)]:border-l-0 lg:[&:nth-child(5n+1)]:pl-0",
  }[columns];
  return (
    <ol className={`bleed-margin grid border-t border-ink/15 ${cols} ${className}`}>
      {items.map((step, i) => (
        <li key={step.title} className={`border-b border-ink/15 py-5 pr-5 lg:border-ink/15 ${cell}`}>
          <span className="font-mono text-[0.75rem] text-cinnabar">{String(i + 1).padStart(2, "0")}</span>
          <p className="mt-1.5 font-display text-[1.25rem] font-semibold leading-snug text-ink">{step.title}</p>
          <p className="mt-1.5 text-[1rem] leading-relaxed text-ink-soft">{step.body}</p>
        </li>
      ))}
    </ol>
  );
}

/**
 * Be part of it: a dark band with the heading, a line and three tiers
 * (₹370 a page, and so on), then the ways in, then the next page.
 */
export function GiveBand({
  question,
  label,
  heading,
  body,
  tiers,
  buttons,
  next,
}: {
  question?: string;
  label?: string;
  heading: string;
  body: string;
  tiers: readonly Figure[];
  buttons: readonly { label: string; href: string }[];
  next?: { text: string; label: string; href: string };
}) {
  return (
    <Leaf id="be-part" label={label} question={question}>
      <div className="bleed-margin grid items-center gap-x-10 gap-y-8 rounded-[28px] bg-board px-7 py-10 text-board-ink sm:px-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:rounded-l-[9rem] lg:py-12 lg:pl-20">
        <div className="min-w-0">
          <h2 className="text-balance font-display text-[clamp(2rem,1.5rem+1.8vw,3rem)] font-semibold leading-[1.08]">
            {heading}
            <span className="text-cinnabar" aria-hidden="true">
              {" "}॥
            </span>
          </h2>
          <p className="mt-5 max-w-[44ch] text-[1.125rem] leading-relaxed text-board-ink/90">{body}</p>
        </div>
        <dl className="grid grid-cols-3">
          {tiers.map((tier, i) => (
            <div key={tier.label} className={`min-w-0 pr-3 ${i > 0 ? "border-l border-board-soft/30 pl-4" : ""}`}>
              <dt className="sr-only">{tier.label}</dt>
              <dd className="font-display text-[clamp(1.35rem,1rem+1.2vw,2.1rem)] font-semibold leading-none text-orpiment">{tier.value}</dd>
              <dd className="mt-2 text-[0.95rem] leading-snug">{tier.label}</dd>
            </div>
          ))}
        </dl>
      </div>
      <div className="mt-8 flex flex-wrap gap-3">
        {buttons.map((button, i) => (
          <Button key={button.label} href={button.href} variant={i === 0 ? undefined : "outline"}>
            {button.label}
          </Button>
        ))}
      </div>
      {next ? (
        <div className="bleed-margin mt-12 flex flex-wrap items-baseline justify-between gap-x-8 gap-y-3 border-y-[3px] border-double border-cinnabar/70 py-6">
          <p className="font-display text-[clamp(1.2rem,1.05rem+0.5vw,1.5rem)] font-medium text-ink">{next.text}</p>
          <a href={next.href} className="font-mono text-register text-cinnabar underline-offset-4 hover:underline">
            {next.label} →
          </a>
        </div>
      ) : null}
    </Leaf>
  );
}

/** Newspaper clippings in a row, each opening full size; a vertical label at the left. */
export function Press({ label, items, caption, className = "" }: { label: string; items: readonly { src: string; alt: string }[]; caption?: string; className?: string }) {
  return (
    <figure className={`bleed-margin ${className}`}>
      <div className="flex gap-4 border-t border-ink/15 pt-5">
        <p className="hidden shrink-0 font-mono text-[0.75rem] uppercase tracking-[0.12em] text-cinnabar [writing-mode:vertical-rl] [transform:rotate(180deg)] sm:block">{label}</p>
        <ul className="grid flex-1 grid-cols-2 gap-3 md:grid-cols-4">
          {items.map((clip) => (
            <li key={clip.src}>
              <a href={clip.src} target="_blank" rel="noopener" className="block">
                <div className="relative aspect-[3/4] overflow-hidden bg-white shadow-[0_10px_24px_-14px_rgb(0_0_0/0.55)] transition-transform hover:-translate-y-0.5">
                  <Image src={clip.src} alt={clip.alt} fill sizes="(min-width: 768px) 16rem, 46vw" className="object-cover object-top" />
                </div>
              </a>
            </li>
          ))}
        </ul>
      </div>
      {caption ? <figcaption className="mt-3 font-mono text-register text-ink-soft">{caption}</figcaption> : null}
    </figure>
  );
}
