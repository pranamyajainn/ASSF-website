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
 * Mission and vision: the Foundation's two statements beside a photograph
 * of the work, second on the page, before the pillars that carry them out.
 */
export async function Purpose() {
  const { home, ui } = await getContent();
  const { purpose } = home;
  return (
    <Leaf id="purpose" label={purpose.label} question={ui.steps.why}>
      <Heading>{purpose.heading}</Heading>
      <div className="bleed-margin mt-12 grid items-start gap-x-12 gap-y-10 border-t border-ink/20 pt-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
        <div className="grid gap-y-10">
          {[purpose.mission, purpose.vision].map((part) => (
            <div key={part.label} className="min-w-0">
              <p className="font-mono text-register text-cinnabar">{part.label}</p>
              <p className="mt-4 text-pretty font-display text-[clamp(1.3rem,1.1rem+0.7vw,1.7rem)] leading-[1.4] text-ink">{part.body}</p>
            </div>
          ))}
        </div>
        <figure className="min-w-0">
          <div className="relative aspect-[4/3] overflow-hidden bg-leaf-deep outline outline-1 -outline-offset-1 outline-ink/15">
            <Image src={purpose.plate.src} alt={purpose.plate.alt} fill sizes="(min-width: 1024px) 34vw, 92vw" className="object-cover" style={{ objectPosition: "50% 45%" }} />
          </div>
          <figcaption className="mt-3 font-mono text-register text-ink-faint">{purpose.plate.caption}</figcaption>
        </figure>
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

type LedgerIconName = "folios" | "manuscripts" | "repositories" | "meals" | "health" | "education" | "hall" | "quarters";

/** A small drawing for each figure, in the page's ink, cinnabar and orpiment. */
function LedgerIcon({ name }: { name: LedgerIconName }) {
  const ink = { stroke: "var(--color-ink)", strokeWidth: 1.6, strokeLinecap: "round", strokeLinejoin: "round" } as const;
  const red = "var(--color-cinnabar)";
  const gold = "var(--color-orpiment)";
  const art = {
    // Palm-leaf folios, stacked and tied with a cord.
    folios: (
      <>
        <rect x="10" y="30" width="60" height="7" rx="3.5" fill={gold} fillOpacity=".35" {...ink} />
        <rect x="14" y="23" width="56" height="7" rx="3.5" fill={gold} fillOpacity=".55" {...ink} />
        <rect x="8" y="16" width="58" height="7" rx="3.5" fill={gold} fillOpacity=".8" {...ink} />
        <path d="M24 13v27M56 13v27" {...ink} stroke={red} />
        <path d="M14 44h52" {...ink} strokeDasharray="2 4" />
      </>
    ),
    // A manuscript wrapped in red cloth, knotted.
    manuscripts: (
      <>
        <rect x="12" y="18" width="56" height="24" rx="3" fill={red} {...ink} />
        <path d="M12 26h56M12 34h56" {...ink} stroke="var(--color-leaf)" strokeOpacity=".5" />
        <path d="M40 18v24" {...ink} stroke={gold} strokeWidth={3} />
        <path d="M40 18c-6-7-12-6-10 0M40 18c6-7 12-6 10 0" {...ink} stroke={gold} strokeWidth={2} />
      </>
    ),
    // Three pins on a dotted route.
    repositories: (
      <>
        <path d="M8 42c10-10 18 4 30-4s20-6 34-2" {...ink} strokeDasharray="2 4" />
        {[16, 40, 62].map((x, k) => (
          <g key={x} transform={`translate(${x} ${k === 1 ? 10 : 18})`}>
            <path d="M0 18s-7-7-7-12a7 7 0 0 1 14 0c0 5-7 12-7 12Z" fill={red} {...ink} />
            <circle cx="0" cy="6" r="2.4" fill="var(--color-leaf)" />
          </g>
        ))}
      </>
    ),
    // A bowl of rice, steaming.
    meals: (
      <>
        <path d="M14 30c4-9 16-12 26-12s22 3 26 12" fill={gold} fillOpacity=".55" {...ink} />
        <path d="M10 30h60c0 10-12 16-30 16S10 40 10 30Z" fill="var(--color-ink-soft)" fillOpacity=".15" {...ink} />
        <path d="M30 46l-3 4h26l-3-4" {...ink} />
        <path d="M32 13c0-3 3-4 3-7M44 13c0-3 3-4 3-7" {...ink} stroke={red} />
      </>
    ),
    // A stethoscope over a heartbeat.
    health: (
      <>
        <path d="M6 40h12l4-8 5 14 5-10h6" {...ink} stroke={red} />
        <path d="M46 8v10a10 10 0 0 0 20 0V8" {...ink} />
        <path d="M56 28v6a10 10 0 0 1-20 0v-2" {...ink} />
        <circle cx="36" cy="28" r="4.5" fill={gold} {...ink} />
        <circle cx="46" cy="8" r="1.6" fill="var(--color-ink)" />
        <circle cx="66" cy="8" r="1.6" fill="var(--color-ink)" />
      </>
    ),
    // An open book and a pen.
    education: (
      <>
        <path d="M40 18c-8-5-18-5-28-2v28c10-3 20-3 28 2 8-5 18-5 28-2V16c-10-3-20-3-28 2Z" fill="var(--color-leaf)" {...ink} />
        <path d="M40 18v28" {...ink} />
        <path d="M18 24h14M18 30h14M48 24h14M48 30h10" {...ink} strokeWidth={1.2} stroke="var(--color-ink-soft)" />
        <path d="M58 4l8 8-14 14-9 2 2-9Z" fill={red} {...ink} />
      </>
    ),
    // A community hall: a pediment over columns.
    hall: (
      <>
        <path d="M10 22 40 8l30 14Z" fill={red} {...ink} />
        <path d="M14 22h52v4H14Z" fill={gold} {...ink} />
        <path d="M20 26v16M32 26v16M48 26v16M60 26v16" {...ink} />
        <path d="M10 42h60v5H10Z" fill="var(--color-ink-soft)" fillOpacity=".25" {...ink} />
      </>
    ),
    // Staff quarters: a long block of rooms.
    quarters: (
      <>
        <path d="M8 16h64v30H8Z" fill="var(--color-leaf)" {...ink} />
        <path d="M6 16h68l-4-6H10Z" fill={red} {...ink} />
        {[14, 26, 38, 50, 62].map((x) => (
          <g key={x}>
            <rect x={x} y="21" width="6" height="7" fill={gold} fillOpacity=".7" {...ink} strokeWidth={1.2} />
            <rect x={x} y="33" width="6" height="7" fill={gold} fillOpacity=".7" {...ink} strokeWidth={1.2} />
          </g>
        ))}
      </>
    ),
  }[name];
  return (
    <svg aria-hidden="true" viewBox="0 0 80 52" fill="none" className="h-14 w-auto">
      {art}
    </svg>
  );
}

/**
 * Our work so far: eight figures across the three pillars, each with its
 * drawing, in two rows of four (the layout the Foundation sent on 26 Oct
 * 2026), standing on one line for what the survey found still waiting.
 */
export async function Figures() {
  const { home, ui, href } = await getContent();
  const { ledger } = home;
  return (
    <Leaf id="ledger" label={ledger.label} question={ui.steps.much}>
      <Heading>{ledger.heading}</Heading>
      <dl className="bleed-margin mt-12 grid grid-cols-2 gap-x-6 gap-y-12 border-t border-ink/20 pt-10 lg:grid-cols-4 lg:gap-x-8">
        {ledger.figures.map((f) => (
          // A term, then its values (as a definition list must be); the drawing and figure come first.
          <div key={f.icon} className="flex min-w-0 flex-col">
            <dt className="order-3 mt-2 text-[1rem] leading-snug text-ink">{f.label}</dt>
            <dd className="order-1">
              <LedgerIcon name={f.icon} />
            </dd>
            <dd className="order-2 mt-4 font-display text-[clamp(1.9rem,1.5rem+1.4vw,2.8rem)] font-medium leading-none tracking-[-0.02em] text-ink">
              {f.value ?? <Pending width="5rem" label={ui.common.awaiting} />}
            </dd>
            <dd className="order-4 mt-1.5 font-mono text-register leading-relaxed text-ink-faint">{f.note}</dd>
          </div>
        ))}
      </dl>
      <div className="bleed-margin mt-12 flex flex-wrap items-baseline justify-between gap-x-8 gap-y-4 border-t border-ink/20 pt-6">
        <p className="max-w-[60ch] font-display text-[clamp(1.15rem,1rem+0.5vw,1.4rem)] leading-snug text-ink">
          <span className="font-medium text-cinnabar">{ledger.survey.value}</span> {ledger.survey.text}
        </p>
        <InlineLink href={href("/impact")} className="">
          {ui.home.seeImpact} →
        </InlineLink>
      </div>
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
              {site.since ? <span className="text-ink-faint">{site.since}</span> : null}
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

/** From the field: the three latest notes, side by side, short, each with its photograph. */
export async function News() {
  const { home, ui } = await getContent();
  const { field } = home;
  return (
    <Leaf id="field" label={field.label} question={ui.steps.news}>
      <Heading>{field.heading}</Heading>
      <ol className="bleed-margin mt-10 grid gap-x-8 gap-y-8 border-t border-ink/20 pt-8 md:grid-cols-3">
        {field.items.slice(0, 3).map((item) => (
          <li key={item.title} className="min-w-0">
            {item.image ? (
              <div className="relative mb-5 aspect-[4/3] overflow-hidden bg-leaf-deep outline outline-1 -outline-offset-1 outline-ink/15">
                <Image src={item.image.src} alt={item.image.alt} fill sizes="(min-width: 768px) 30vw, 92vw" className="object-cover" />
              </div>
            ) : null}
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
