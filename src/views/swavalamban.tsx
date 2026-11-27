import Image from "next/image";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { GiveBand } from "@/components/site/page-sections";
import { Heading, Leaf, Lede } from "@/components/site/primitives";
import { getContent } from "@/i18n/content";
import { pageMetadata } from "@/i18n/metadata";

export async function generateMetadata() {
  const { swavalamban } = await getContent();
  return pageMetadata("swavalamban", "/swavalamban-yojana", swavalamban.pageHero.body);
}

/** Swavalamban Yojana, the Foundation's coming scheme, after its page designs (Nov 2026). */
export default async function SwavalambanPage() {
  const { swavalamban } = await getContent();
  const { pageHero, why, offers, launch, give } = swavalamban;
  return (
    <>
      <Header />
      <main id="main">
        <Leaf id="top" label={pageHero.label} question={pageHero.question} innerClassName="!pt-10 md:!pt-14 lg:!pt-16">
          <div className="bleed-margin grid items-center gap-x-10 gap-y-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
            <div className="min-w-0">
              <p className="font-mono text-register text-cinnabar">{pageHero.eyebrow}</p>
              <h1 className="inked ink-on-load mt-4 text-balance font-display text-title font-medium tracking-[-0.015em]">
                {pageHero.title}
                <span className="text-cinnabar" aria-hidden="true">
                  {" "}॥
                </span>
              </h1>
              <p className="mt-4 font-display text-[clamp(1.3rem,1.1rem+0.8vw,1.75rem)] font-medium text-ink-soft">{pageHero.subtitle}</p>
              <blockquote className="mt-6 border-l-4 border-orpiment bg-leaf-deep/70 px-6 py-4">
                <p lang="hi" className="font-display text-[1.25rem] leading-snug text-cinnabar">
                  {pageHero.quote}
                </p>
                <p className="mt-2 text-[1.05rem] italic leading-snug text-ink-soft">{pageHero.translation}</p>
              </blockquote>
              <p className="mt-6 max-w-[50ch] text-[1.125rem] leading-[1.6] text-ink">{pageHero.body}</p>
            </div>
            <figure className="relative mx-auto w-full max-w-[24rem]">
              <div className="relative aspect-[5/6]">
                <Image src={pageHero.image.src} alt={pageHero.image.alt} fill priority sizes="24rem" className="object-contain" />
              </div>
              {pageHero.badge ? (
                <figcaption className="absolute inset-x-0 bottom-[8%] text-center">
                  <span className="rounded-full bg-cinnabar px-4 py-1.5 font-mono text-[0.8rem] text-leaf">{pageHero.badge}</span>
                </figcaption>
              ) : null}
            </figure>
          </div>
        </Leaf>

        <Leaf id="why" label={why.label} question={why.question}>
          <Heading>{why.heading}</Heading>
          <Lede>{why.lede}</Lede>
          <p className="mt-5 max-w-[62ch] text-[1.0625rem] leading-[1.65] text-ink">{why.body}</p>
        </Leaf>

        <Leaf id="offers" label={offers.label} question={offers.question}>
          <Heading>{offers.heading}</Heading>
          <Lede>{offers.lede}</Lede>
          <ul className="bleed-margin mt-10 grid gap-5 md:grid-cols-3">
            {offers.doors.map((door) => (
              <li key={door.title} className="flex flex-col items-center rounded-t-[10rem] rounded-b-xl border border-leaf-edge/70 bg-leaf-deep/70 px-6 pb-8 pt-8 text-center">
                <div className="relative size-28 overflow-hidden rounded-full">
                  <Image src={door.icon} alt="" fill sizes="7rem" className="object-contain" />
                </div>
                <p className="mt-5 font-mono text-register text-cinnabar">{door.label}</p>
                <h3 className="mt-2 font-display text-[1.4rem] font-semibold leading-tight text-ink">{door.title}</h3>
                <p className="mt-2.5 text-[1.02rem] leading-relaxed text-ink-soft">{door.body}</p>
              </li>
            ))}
          </ul>
        </Leaf>

        <Leaf id="launch" label={launch.label} question={launch.question}>
          <div className="bleed-margin grid items-start gap-x-12 gap-y-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <div className="min-w-0">
              <Heading>{launch.heading}</Heading>
              <p className="mt-6 text-[1.125rem] leading-[1.6] text-ink">{launch.body}</p>
            </div>
            <ol className="divide-y divide-ink/15 border-y border-ink/15">
              {launch.steps.map((step, i) => (
                <li key={step.title} className="flex items-baseline gap-4 py-4">
                  <span className="font-mono text-register text-cinnabar">{String(i + 1).padStart(2, "0")}</span>
                  <span className="font-display text-[1.25rem] font-medium leading-snug text-ink">{step.title}</span>
                </li>
              ))}
            </ol>
          </div>
        </Leaf>

        <GiveBand {...give} />
      </main>
      <Footer />
    </>
  );
}
