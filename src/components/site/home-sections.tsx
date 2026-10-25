import Image from "next/image";
import { Heading, InlineLink, Leaf, Lede, Pending } from "./primitives";
import { getContent } from "@/i18n/content";
import { fill } from "@/i18n/ui";

/**
 * The home page as the opening of a book rather than the whole book: each
 * section says one thing, with a photograph doing most of the saying, and
 * hands the reader to the page that tells the rest. The full accounts — the
 * sites, the scale ahead, the trustees, the Acharya, every voice — live on
 * their own pages.
 */

/**
 * Mission and vision: the Foundation's two statements side by side, second
 * on the page, before the pillars that carry them out.
 */
export async function Purpose() {
  const { home, ui } = await getContent();
  const { purpose } = home;
  return (
    <Leaf id="purpose" label={purpose.label} question={ui.steps.why}>
      <Heading>{purpose.heading}</Heading>
      <div className="bleed-margin mt-12 grid gap-x-12 gap-y-10 border-t border-ink/20 pt-10 md:grid-cols-2">
        {[purpose.mission, purpose.vision].map((part) => (
          <div key={part.label} className="min-w-0">
            <p className="font-mono text-register text-cinnabar">{part.label}</p>
            <p className="mt-4 text-pretty font-display text-[clamp(1.3rem,1.1rem+0.7vw,1.7rem)] leading-[1.4] text-ink">{part.body}</p>
          </div>
        ))}
      </div>
      <InlineLink href={purpose.link.href} className="mt-10">
        {purpose.link.label} →
      </InlineLink>
    </Leaf>
  );
}

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

/**
 * Our work so far: the four manuscript figures, large, in one row, then the
 * other two pillars counted beneath them — the breakdowns and the scale
 * ahead are on Impact.
 */
export async function Figures() {
  const { home, ui, href } = await getContent();
  const { ledger } = home;
  return (
    <Leaf id="ledger" label={ledger.label} question={ui.steps.much}>
      <Heading>{ledger.heading}</Heading>
      <dl className="bleed-margin mt-12 grid gap-x-8 gap-y-10 border-t border-ink/20 pt-10 sm:grid-cols-2 lg:grid-cols-4">
        {ledger.metrics.map((m) => (
          // A term, then its values (as a definition list must be); the figure is shown first.
          <div key={m.label} className="flex min-w-0 flex-col">
            <dt className="order-2 mt-3 text-[1.0625rem] leading-snug text-ink">{m.label}</dt>
            <dd className="order-1 inked ink-on-scroll font-display text-[clamp(2.4rem,1.8rem+2vw,3.6rem)] font-medium leading-none tracking-[-0.02em] text-ink">
              {m.value ?? <Pending width="5rem" label={ui.common.awaiting} />}
            </dd>
            <dd className="order-3 mt-1.5 font-mono text-register leading-relaxed text-ink-faint">{m.note}</dd>
          </div>
        ))}
      </dl>
      <div className="bleed-margin mt-14 grid gap-x-12 gap-y-12 lg:grid-cols-2">
        {ledger.more.map((group) => (
          <div key={group.label} className="min-w-0">
            <p className="font-mono text-register text-cinnabar">{group.label}</p>
            <dl className="mt-4 grid gap-x-8 gap-y-8 border-t border-ink/20 pt-6 sm:grid-cols-3 lg:grid-cols-[repeat(auto-fit,minmax(9rem,1fr))]">
              {group.metrics.map((m) => (
                <div key={m.label} className="flex min-w-0 flex-col">
                  <dt className="order-2 mt-2 text-[1rem] leading-snug text-ink">{m.label}</dt>
                  <dd className="order-1 font-display text-[clamp(1.9rem,1.5rem+1.2vw,2.6rem)] font-medium leading-none tracking-[-0.02em] text-ink">{m.value}</dd>
                  <dd className="order-3 mt-1.5 font-mono text-register leading-relaxed text-ink-faint">{m.note}</dd>
                </div>
              ))}
            </dl>
          </div>
        ))}
      </div>
      <InlineLink href={href("/impact")} className="mt-10">
        {ui.home.seeImpact} →
      </InlineLink>
    </Leaf>
  );
}

/**
 * Where the work is live now: the two running conservation sites, each with
 * its place, its institution, one line on the collection, and two of the
 * Foundation's own photographs from it.
 */
export async function LiveSites() {
  const { home, ui } = await getContent();
  const { liveSites } = home;
  return (
    <Leaf id="live-sites" label={liveSites.label} question={ui.steps.where}>
      <Heading>{liveSites.heading}</Heading>
      <Lede>{liveSites.lede}</Lede>
      <div className="bleed-margin mt-12 grid gap-x-10 gap-y-14 lg:grid-cols-2">
        {liveSites.sites.map((site) => (
          <article key={site.name} className="min-w-0 border-t border-ink/20 pt-6">
            <p className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-register">
              <span className="inline-flex items-center gap-1.5 text-cinnabar">
                <span aria-hidden="true" className="size-2 rounded-full bg-cinnabar" />
                {liveSites.status}
              </span>
              <span className="text-ink-faint">{site.since}</span>
            </p>
            <h3 className="mt-3 font-display text-[clamp(1.6rem,1.3rem+1vw,2.2rem)] font-medium leading-tight text-ink">{site.name}</h3>
            <p className="mt-1 font-mono text-register text-ink-soft">
              {site.institution} · {site.region}
            </p>
            <p className="mt-4 max-w-[52ch] text-[1.0625rem] leading-relaxed text-ink-soft">{site.body}</p>
            <div className="mt-6 grid grid-cols-[3fr_2fr] gap-3">
              {site.photos.map((photo) => (
                <figure key={photo.src} className="min-w-0">
                  <div className="relative aspect-[5/6] overflow-hidden bg-leaf-deep outline outline-1 -outline-offset-1 outline-ink/15">
                    <Image src={photo.src} alt={photo.alt} fill sizes="(min-width: 1024px) 22rem, 60vw" className="object-cover" />
                  </div>
                  <figcaption className="mt-2 font-mono text-[0.75rem] leading-snug text-ink-faint">{photo.caption}</figcaption>
                </figure>
              ))}
            </div>
          </article>
        ))}
      </div>
      <InlineLink href={liveSites.link.href} className="mt-10">
        {liveSites.link.label} →
      </InlineLink>
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
      <figure className="bleed-margin mt-10">
        <div className="relative aspect-[16/9] overflow-hidden bg-leaf-deep outline outline-1 -outline-offset-1 outline-ink/15 sm:aspect-[21/8]">
          <Image src={join.plate.src} alt={join.plate.alt} fill sizes="(min-width: 1024px) 70rem, 100vw" className="object-cover" style={{ objectPosition: "50% 45%" }} />
        </div>
        <figcaption className="mt-3 font-mono text-register text-ink-faint">{join.plate.caption}</figcaption>
      </figure>
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
