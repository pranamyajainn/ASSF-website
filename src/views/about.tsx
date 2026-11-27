import Image from "next/image";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { Figures } from "@/components/site/page-sections";
import { Button, Heading, InlineLink, Leaf, Lede } from "@/components/site/primitives";
import { VideoLoop } from "@/components/site/video-loop";
import { getContent } from "@/i18n/content";
import { pageMetadata } from "@/i18n/metadata";

export async function generateMetadata() {
  const { about } = await getContent();
  return pageMetadata("about", "/about", about.pageHero.paragraphs[0]);
}

const PILLARS = ["manuscripts", "community", "villages"] as const;
const BAR = { manuscripts: "border-orpiment", community: "border-cinnabar", villages: "border-ink-soft" } as const;

/** About Us, after the Foundation's page designs (Nov 2026). */
export default async function AboutPage() {
  const { about, conservation, ui } = await getContent();
  const { pageHero, guides, who, pillars, journey, ahead } = about;
  const { film } = conservation.process;
  const row = (r: { year: string; manuscripts: readonly string[]; community: readonly string[]; villages: readonly string[] }, today = false) => (
    <li key={r.year} className={`grid grid-cols-[4rem_minmax(0,1fr)] gap-x-4 gap-y-2 border-b border-ink/15 py-4 md:grid-cols-[6rem_repeat(3,minmax(0,1fr))] ${today ? "rounded-md border-b-0 bg-leaf-deep/80 px-3" : ""}`}>
      <p className="font-display text-[1.35rem] font-semibold leading-tight text-cinnabar">{r.year}</p>
      {PILLARS.map((pillar) => (
        <ul key={pillar} className={`col-start-2 space-y-2 md:col-start-auto ${r[pillar].length ? "" : "hidden md:block"}`}>
          {r[pillar].map((text) => (
            <li key={text} className={`border-l-[3px] pl-3 text-[1.02rem] leading-snug text-ink ${BAR[pillar]}`}>
              <span className="sr-only">{journey.columns[pillar]}: </span>
              {text}
            </li>
          ))}
        </ul>
      ))}
    </li>
  );
  return (
    <>
      <Header />
      <main id="main">
        <Leaf id="top" label={pageHero.label} question={pageHero.question} innerClassName="!pt-10 md:!pt-14 lg:!pt-16">
          <div className="bleed-margin grid items-start gap-x-12 gap-y-10 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
            <div className="min-w-0">
              <p className="font-mono text-register text-cinnabar">{pageHero.eyebrow}</p>
              <h1 className="inked ink-on-load mt-4 text-balance font-display text-title font-medium tracking-[-0.015em]">
                {pageHero.title}
                <span className="text-cinnabar" aria-hidden="true">
                  {" "}॥
                </span>
              </h1>
              {pageHero.paragraphs.map((p, i) => (
                <p key={i} className="mt-5 max-w-[56ch] text-[1.125rem] leading-[1.65] text-ink">
                  {p}
                </p>
              ))}
            </div>
            <figure className="mx-auto w-full max-w-[20rem] rounded-xl border-[3px] border-double border-cinnabar/70 bg-leaf-deep/60 p-4">
              <div className="relative aspect-[3/4] overflow-hidden rounded-md">
                <Image src={pageHero.image.src} alt={pageHero.image.alt} fill priority sizes="20rem" className="object-cover" />
              </div>
              <figcaption className="mt-3 text-center font-mono text-register text-ink-soft">{pageHero.image.caption}</figcaption>
            </figure>
          </div>
        </Leaf>

        <Leaf id="guides" label={guides.label} question={guides.question}>
          <Heading>{guides.heading}</Heading>
          <div className="bleed-margin mt-10 grid gap-x-12 gap-y-8 border-t border-ink/15 pt-8 md:grid-cols-2">
            <div className="min-w-0">
              <p className="font-mono text-register text-cinnabar">{guides.missionLabel}</p>
              <p className="mt-3 text-balance font-display text-[clamp(1.5rem,1.2rem+1vw,2.1rem)] font-semibold leading-[1.25] text-ink">{guides.mission}</p>
              <p className="mt-4 font-display text-[1.3rem] font-semibold text-cinnabar">{guides.motto}</p>
            </div>
            <div className="min-w-0">
              <p className="font-mono text-register text-cinnabar">{guides.visionLabel}</p>
              <p className="mt-3 text-[1.2rem] leading-[1.55] text-ink">{guides.vision}</p>
            </div>
          </div>
          <p className="bleed-margin mt-12 border-t border-ink/15 pt-6 font-mono text-register text-cinnabar">{guides.principlesLabel}</p>
          <ul className="bleed-margin mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {guides.principles.map((principle) => (
              <li key={principle.name} className="min-w-0 rounded-xl border border-leaf-edge/70 bg-leaf-deep/70 p-5">
                <p lang="sa" className="font-display text-[1.2rem] leading-snug text-cinnabar">
                  {principle.deva}
                </p>
                <h3 className="mt-1 font-display text-[1.2rem] font-semibold text-ink">{principle.name}</h3>
                <p className="mt-1 font-mono text-[0.75rem] text-ink-soft">{principle.meaning}</p>
                <p className="mt-2 text-[1rem] leading-snug text-ink-soft">{principle.body}</p>
              </li>
            ))}
          </ul>
        </Leaf>

        <Leaf id="who" label={who.label} question={who.question}>
          <Heading>{who.heading}</Heading>
          <div className="bleed-margin mt-8 grid items-start gap-x-10 gap-y-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
            <div className="min-w-0">
              <p className="text-[1.125rem] leading-[1.65] text-ink">{who.body}</p>
              <blockquote className="mt-6 border-l-4 border-orpiment pl-5">
                <p lang="hi" className="font-display text-[1.3rem] leading-snug text-cinnabar">
                  {who.quote}
                </p>
                <p className="mt-1 font-display text-[1.35rem] font-semibold leading-snug text-ink">{who.translation}</p>
              </blockquote>
            </div>
            <figure className="min-w-0">
              <div className="relative aspect-[900/762] overflow-hidden rounded-lg bg-leaf-deep">
                <Image src={who.image.src} alt={who.image.alt} fill sizes="(min-width: 1024px) 30rem, 92vw" className="object-cover" />
              </div>
              <figcaption className="mt-2 grid grid-cols-3 gap-2 font-mono text-[0.78rem] text-cinnabar">
                {who.captions.map((caption) => (
                  <span key={caption}>{caption}</span>
                ))}
              </figcaption>
            </figure>
          </div>
        </Leaf>

        <Leaf id="pillars" label={pillars.label} question={pillars.question}>
          <Heading>{pillars.heading}</Heading>
          <Lede>{pillars.lede}</Lede>
          <ol className="bleed-margin mt-10 grid border-y border-ink/15 md:grid-cols-3">
            {pillars.items.map((item, i) => (
              <li key={item.title} className={`flex min-w-0 flex-col py-6 md:pr-6 ${i > 0 ? "border-t border-ink/15 md:border-l md:border-t-0 md:pl-6" : ""}`}>
                <p className="font-mono text-[0.78rem] text-cinnabar">{String(i + 1).padStart(2, "0")}</p>
                <h3 className="mt-2 font-display text-[1.45rem] font-semibold leading-tight text-ink">{item.title}</h3>
                <p className="mt-2 text-[1.02rem] leading-relaxed text-ink-soft">{item.body}</p>
                <InlineLink href={item.href} className="mt-auto pt-4">
                  {pillars.more} →
                </InlineLink>
              </li>
            ))}
          </ol>
        </Leaf>

        <Leaf id="journey" label={journey.label} question={journey.question}>
          <Heading>{journey.heading}</Heading>
          <Lede>{journey.lede}</Lede>
          <div className="bleed-margin mt-10">
            <div className="hidden grid-cols-[6rem_repeat(3,minmax(0,1fr))] gap-x-4 border-y border-ink/15 py-3 font-mono text-[0.75rem] uppercase tracking-[0.1em] text-ink-soft md:grid">
              <span />
              {PILLARS.map((pillar) => (
                <span key={pillar}>{journey.columns[pillar]}</span>
              ))}
            </div>
            <p className="border-b border-ink/15 py-3 font-mono text-[0.8rem] text-ink-soft">{journey.founded}</p>
            <ol>
              {journey.years.map((r) => row(r))}
              {row(journey.today, true)}
            </ol>
          </div>
          <Figures items={journey.figures} className="mt-8" />
        </Leaf>

        <Leaf id="ahead" label={ahead.label} question={ahead.question}>
          <Heading>{ahead.heading}</Heading>
          <Lede>{ahead.lede}</Lede>
          <Figures items={ahead.figures} className="mt-10" />
          <div className="bleed-margin mt-10 grid items-center gap-x-10 gap-y-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <div className="min-w-0">
              {ahead.paragraphs.map((p, i) => (
                <p key={i} className={`text-[1.125rem] leading-[1.6] text-ink ${i > 0 ? "mt-4" : ""}`}>
                  {p}
                </p>
              ))}
            </div>
            <div className="min-w-0">
              <VideoLoop youtubeId={film.youtubeId} title={film.heading} watchLabel={ui.common.watchWithSound} />
              <p className="mt-2 font-mono text-register text-ink-soft">{film.heading}</p>
            </div>
          </div>
          <div className="mt-16 text-center">
            <p className="mx-auto max-w-[34ch] text-balance font-display text-[clamp(1.4rem,1.1rem+1.2vw,2rem)] font-semibold leading-[1.3] text-ink">
              <span aria-hidden="true" className="text-cinnabar">
                ॥{" "}
              </span>
              {ahead.closing}
              <span aria-hidden="true" className="text-cinnabar">
                {" "}॥
              </span>
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              {ahead.links.map((link, i) => (
                <Button key={link.label} href={link.href} variant={i === 0 ? undefined : "outline"}>
                  {link.label}
                </Button>
              ))}
            </div>
          </div>
        </Leaf>
      </main>
      <Footer />
    </>
  );
}
