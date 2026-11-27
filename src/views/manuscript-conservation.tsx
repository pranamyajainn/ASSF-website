import Image from "next/image";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { MediaClip } from "@/components/site/media-clip";
import { Figures, GiveBand, Opener, PhotoCards, PhotoGrid, Steps, Tags } from "@/components/site/page-sections";
import { Heading, Leaf, Lede } from "@/components/site/primitives";
import { VideoLoop } from "@/components/site/video-loop";
import { getContent } from "@/i18n/content";
import { pageMetadata } from "@/i18n/metadata";

export async function generateMetadata() {
  const { conservation } = await getContent();
  return pageMetadata("conservation", "/manuscript-conservation", conservation.pageHero.paragraphs[0]);
}

const badge = { done: "border-ink/40 text-ink", final: "border-cinnabar text-cinnabar", live: "border-cinnabar bg-cinnabar text-leaf" } as const;

/** Numbers in a line set in the scribe's red: "1,399 manuscripts · 1,06,277 folios". */
function Counted({ text }: { text: string }) {
  return (
    <>
      {text.split(/(\d[\d,]*\+?)/).map((part, i) =>
        i % 2 ? (
          <b key={i} className="font-semibold text-cinnabar">
            {part}
          </b>
        ) : (
          part
        ),
      )}
    </>
  );
}

/** Manuscript Conservation, after the Foundation's page designs (Nov 2026). */
export default async function ManuscriptConservationPage() {
  const { conservation, ui } = await getContent();
  const { pageHero, why, conserve, process, sites, give } = conservation;
  return (
    <>
      <Header />
      <main id="main">
        <Opener {...pageHero} />

        <Leaf id="why" label={why.label} question={why.question}>
          <Heading>{why.heading}</Heading>
          <div className="bleed-margin mt-8 grid items-start gap-x-10 gap-y-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <div className="min-w-0">
              <p className="text-lede text-ink">{why.lede}</p>
              {why.paragraphs.map((p, i) => (
                <p key={i} className="mt-4 text-[1.0625rem] leading-[1.65] text-ink">
                  {p}
                </p>
              ))}
              <Tags items={why.subjects} className="mt-6" />
            </div>
            <PhotoGrid items={why.photos} />
          </div>
          <Figures items={why.figures} className="mt-12" />
        </Leaf>

        <Leaf id="what-we-conserve" label={conserve.label} question={conserve.question}>
          <Heading>{conserve.heading}</Heading>
          <Lede>{conserve.lede}</Lede>
          <PhotoCards items={conserve.cards} />
        </Leaf>

        <Leaf id="process" label={process.label} question={process.question}>
          <Heading>{process.heading}</Heading>
          <Lede>{process.lede}</Lede>
          <PhotoGrid items={process.photos} columns={4} className="bleed-margin mt-10" />
          <Steps items={process.steps} className="mt-10" />
          <VideoLoop className="mt-10 max-w-[45rem]" youtubeId={process.film.youtubeId} title={process.film.heading} watchLabel={ui.common.watchWithSound} />
        </Leaf>

        <Leaf id="sites" label={sites.label} question={sites.question}>
          <Heading>{sites.heading}</Heading>
          <Lede>{sites.lede}</Lede>
          <ul className="bleed-margin mt-10 grid gap-x-10 gap-y-12 lg:grid-cols-2">
            {sites.items.map((site) => (
              <li key={site.name} className="grid min-w-0 gap-5 sm:grid-cols-[minmax(0,13rem)_minmax(0,1fr)]">
                <MediaClip
                  image={site.image}
                  clip={site.clip}
                  watchLabel={site.clipLabel || ui.home.watch}
                  sizes="(min-width: 640px) 13rem, 92vw"
                  className="aspect-[4/5] self-start"
                />
                <div className="min-w-0">
                  <span className={`inline-block rounded-full border px-2.5 py-0.5 font-mono text-[0.75rem] ${badge[site.state as keyof typeof badge] ?? badge.done}`}>{site.badge}</span>
                  <h3 className="mt-2 font-display text-[1.55rem] font-semibold leading-tight text-ink">{site.name}</h3>
                  <p className="mt-1.5 font-mono text-[0.78rem] leading-relaxed text-ink-soft">{site.meta}</p>
                  <p className="mt-3 border-t border-dashed border-cinnabar/30 pt-3 text-[1.0625rem] leading-relaxed text-ink">
                    <Counted text={site.facts} />
                  </p>
                  <p className="mt-3 border-t border-dashed border-cinnabar/30 pt-3 text-[1.02rem] leading-relaxed text-ink-soft">{site.body}</p>
                </div>
              </li>
            ))}
          </ul>
          <div className="bleed-margin mt-12 grid gap-8 rounded-[28px] bg-leaf-deep/80 px-7 py-8 md:grid-cols-2 md:rounded-l-[6rem] md:px-12">
            {sites.next.map((item, i) => (
              <div key={item.name} className={`flex min-w-0 items-start gap-5 ${i > 0 ? "md:border-l md:border-ink/15 md:pl-8" : ""}`}>
                {item.image.src ? (
                  <div className="relative size-28 shrink-0 overflow-hidden rounded-full bg-leaf">
                    <Image src={item.image.src} alt={item.image.alt} fill sizes="7rem" className="object-cover" />
                  </div>
                ) : null}
                <div className="min-w-0">
                  <span className="inline-block rounded-full border border-orpiment px-2.5 py-0.5 font-mono text-[0.75rem] text-ink-soft">{item.badge}</span>
                  <p className="mt-2 font-display text-[1.4rem] font-semibold leading-tight text-ink">{item.name}</p>
                  <p className="mt-1.5 text-[1.02rem] leading-relaxed text-ink-soft">{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </Leaf>

        <GiveBand {...give} />
      </main>
      <Footer />
    </>
  );
}
