import Image from "next/image";
import { Heading, InlineLink, Leaf, Lede, Pending } from "./primitives";
import { getContent } from "@/i18n/content";
import { StripNav } from "./strip-nav";
import { fill } from "@/i18n/ui";

/**
 * The home page as the opening of a book rather than the whole book: each
 * section says one thing, with a photograph doing most of the saying, and
 * hands the reader to the page that tells the rest. The full accounts — the
 * sites, the scale ahead, the trustees, the Acharya, every voice — live on
 * their own pages.
 */

/**
 * What we do: the three pillars as three photographs, each with its name,
 * one line, one counted fact (the same fact the hero glosses), and the way
 * to its page. The whole card is the link.
 */
export async function WhatWeDo() {
  const { home, shared, ui, href } = await getContent();
  const { pillarsIntro, mission, ruralTeaser, communityTeaser, hero } = home;
  const plates = [mission.plate, ruralTeaser.sequence[ruralTeaser.sequence.length - 1], communityTeaser.plate];
  // The hero's lines gloss one counted fact per pillar: preserving (conservation), serving (community), building (rural).
  const facts = [hero.lines[0]?.gloss, hero.lines[2]?.gloss, hero.lines[1]?.gloss];
  return (
    <Leaf id="pillars" label={pillarsIntro.label} question={ui.steps.what}>
      <Heading>{pillarsIntro.heading}</Heading>
      <Lede>{pillarsIntro.body}</Lede>
      <ul className="bleed-margin mt-12 grid gap-x-8 gap-y-12 md:grid-cols-3">
        {shared.pillars.map((pillar, i) => {
          const plate = plates[i];
          return (
            <li key={pillar.slug} className="min-w-0">
              <a href={href(`/${pillar.slug}`)} className="group block">
                {plate ? (
                  <div className="relative aspect-[4/3] overflow-hidden bg-leaf-deep outline outline-1 -outline-offset-1 outline-ink/15">
                    <Image
                      src={plate.src}
                      alt={plate.alt}
                      fill
                      sizes="(min-width: 768px) 30vw, 92vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                    />
                  </div>
                ) : null}
                <p className="mt-5 font-mono text-register text-cinnabar">{pillar.label}</p>
                <h3 className="mt-2 text-balance font-display text-[clamp(1.4rem,1.2rem+0.6vw,1.75rem)] leading-tight text-ink">{pillar.tagline}</h3>
                <p className="mt-3 text-[1.0625rem] leading-relaxed text-ink-soft">{pillar.body}</p>
                {facts[i] ? <p className="mt-4 border-l-2 border-orpiment pl-3 font-mono text-register text-ink">{facts[i]}</p> : null}
                <span className="mt-5 inline-block text-[1.0625rem] text-cinnabar underline decoration-cinnabar/35 underline-offset-[6px] transition-colors group-hover:decoration-cinnabar">
                  {fill(ui.common.explore, { name: pillar.label })} →
                </span>
              </a>
            </li>
          );
        })}
      </ul>
    </Leaf>
  );
}

/** Our work so far: the four counted figures, large, in one row — the breakdowns and the scale ahead are on Impact. */
export async function Figures() {
  const { home, ui, href } = await getContent();
  const { ledger } = home;
  return (
    <Leaf id="ledger" label={ledger.label} question={ui.steps.much}>
      <Heading>{ledger.heading}</Heading>
      <dl className="bleed-margin mt-12 grid gap-x-8 gap-y-10 border-t border-ink/20 pt-10 sm:grid-cols-2 lg:grid-cols-4">
        {ledger.metrics.map((m) => (
          <div key={m.label} className="min-w-0">
            <dd className="inked ink-on-scroll font-display text-[clamp(2.4rem,1.8rem+2vw,3.6rem)] font-medium leading-none tracking-[-0.02em] text-ink">
              {m.value ?? <Pending width="5rem" label={ui.common.awaiting} />}
            </dd>
            <dt className="mt-3 text-[1.0625rem] leading-snug text-ink">{m.label}</dt>
            <p className="mt-1.5 font-mono text-register leading-relaxed text-ink-faint">{m.note}</p>
          </div>
        ))}
      </dl>
      <InlineLink href={href("/impact")} className="mt-10">
        {ui.home.seeImpact} →
      </InlineLink>
    </Leaf>
  );
}

/**
 * The work, up close: the Foundation's own photographs as one strip that
 * scrolls sideways, each print at the shape it was taken — a breath between
 * the figures and the invitation, with almost no words.
 */
export async function Album() {
  const { home, ui } = await getContent();
  const { upClose } = home;
  return (
    <Leaf id="up-close" label={upClose.label} question={ui.steps.how}>
      <div className="flex flex-wrap items-end justify-between gap-x-12 gap-y-4">
        <Heading>{upClose.heading}</Heading>
        <p className="max-w-[46ch] text-[1.0625rem] leading-relaxed text-ink-soft">{upClose.lede}</p>
      </div>
      <div className="mt-8 flex justify-end">
        <StripNav target="up-close-strip" previous={ui.home.reel.previous} next={ui.home.reel.next} />
      </div>
      <ul id="up-close-strip" aria-label={upClose.heading} className="bleed-margin mt-4 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4 [scrollbar-width:thin] lg:gap-6">
        {upClose.items.map((item, i) => {
          const [w, h] = String(item.ratio).split("/").map(Number);
          const ratio = w && h ? w / h : 4 / 3;
          return (
            <li key={item.src} className="shrink-0 snap-start">
              <figure className="inline-block">
                <div
                  className="relative h-[15rem] overflow-hidden bg-leaf-deep outline outline-1 -outline-offset-1 outline-ink/15 sm:h-[19rem] lg:h-[21rem]"
                  style={{ aspectRatio: ratio }}
                >
                  <Image src={item.src} alt={item.alt} fill loading={i < 3 ? "eager" : "lazy"} sizes="(min-width: 1024px) 32rem, 80vw" className="object-cover" />
                </div>
                {/* As wide as its print, never wider. */}
                <figcaption className="mt-3 w-0 min-w-full font-mono text-register text-ink-faint">{item.caption}</figcaption>
              </figure>
            </li>
          );
        })}
      </ul>
    </Leaf>
  );
}

/** From the field: the three latest notes, side by side, short. */
export async function News() {
  const { home, ui } = await getContent();
  const { field } = home;
  return (
    <Leaf id="field" label={field.label} question={ui.steps.news}>
      <Heading>{field.heading}</Heading>
      <ol className="bleed-margin mt-10 grid gap-x-8 gap-y-8 border-t border-ink/20 pt-8 md:grid-cols-3">
        {field.items.slice(0, 3).map((item) => (
          <li key={item.title} className="min-w-0">
            <p className="font-mono text-register text-ink-faint">
              {item.date ?? <Pending width="3rem" label={ui.common.dateToVerify} />} · {item.place}
            </p>
            <h3 lang="hi" className="mt-3 line-clamp-3 text-pretty font-display text-[1.3rem] leading-[1.4] text-ink">
              {item.title}
            </h3>
            <p className="mt-2.5 line-clamp-3 text-[1rem] leading-relaxed text-ink-soft">{item.body}</p>
          </li>
        ))}
      </ol>
    </Leaf>
  );
}

/** Join the work: the four ways in, in one row, each one line and a link. Giving has its own band above. */
export async function JoinBrief() {
  const { home, ui } = await getContent();
  const { join } = home;
  return (
    <Leaf id="join" label={join.label} question={ui.steps.help}>
      <Heading>{join.heading}</Heading>
      <ul className="bleed-margin mt-10 grid border-t border-ink/20 sm:grid-cols-2 lg:grid-cols-4">
        {join.ways.map((way, i) => (
          <li
            key={way.title}
            className={`flex flex-col border-b border-ink/20 py-7 sm:pr-6 lg:border-b-0 ${i > 0 ? "lg:border-l lg:border-ink/20 lg:pl-6" : ""} ${i % 2 === 1 ? "sm:border-l sm:border-ink/20 sm:pl-6" : ""}`}
          >
            <h3 className="font-display text-[1.35rem] font-medium leading-tight text-ink">{way.title}</h3>
            <p className="mt-2 text-[1rem] leading-relaxed text-ink-soft">{way.body}</p>
            <InlineLink href={way.link.href} className="mt-auto pt-4">
              {way.link.label}
            </InlineLink>
          </li>
        ))}
      </ul>
    </Leaf>
  );
}
