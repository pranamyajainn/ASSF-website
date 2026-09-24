import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { Sites } from "@/components/site/sites";
import {
  Gloss,
  Heading,
  InlineLink,
  Leaf,
  PageHero,
  Plate,
  Prose,
  Register,
  Verses,
} from "@/components/site/primitives";
import { VideoLoop } from "@/components/site/video-loop";
import Image from "next/image";
import { getContent } from "@/i18n/content";
import { pageMetadata } from "@/i18n/metadata";

export async function generateMetadata() {
  const { conservation } = await getContent();
  return pageMetadata("conservation", "/manuscript-conservation", conservation.pageHero.body);
}

export default async function ManuscriptConservationPage() {
  const { conservation, home, ui, href } = await getContent();
  const { capacity, film, illuminated, pageHero, process, whatWeConserve } = conservation;
  const { ledger, mission } = home;
  const t = ui.conservation;
  return (
    <>
      <Header />
      <main>
        <PageHero label={t.heroLabel} {...pageHero} plate={{ ...pageHero.plate, position: "50% 55%" }} />

        <Leaf id="ledger" label={ledger.label}>
          <Heading>{ledger.heading}</Heading>
          <Prose>
            <p>{ledger.intro}</p>
          </Prose>
          <Register entries={ledger.metrics} />
        </Leaf>

        {/* Two materials, set as the two facing pages of an opened bundle. */}
        <Leaf id="what-we-conserve" label={whatWeConserve.label}>
          <Heading>{whatWeConserve.heading}</Heading>
          <div className="bleed-margin mt-10 grid border-y border-ink/20 md:grid-cols-2">
            {whatWeConserve.items.map((item, i) => (
              <div
                key={item.name}
                className={`py-8 ${i === 0 ? "md:border-r md:border-ink/20 md:pr-10" : "border-t border-ink/20 md:border-t-0 md:pl-10"}`}
              >
                <h3 className="font-display text-[1.7rem] font-medium leading-tight text-ink">{item.name}</h3>
                <p className="mt-3 max-w-[46ch] text-[1.0625rem] leading-relaxed text-ink-soft">{item.body}</p>
              </div>
            ))}
          </div>
          <Prose className="mt-8">
            <p>{whatWeConserve.note}</p>
          </Prose>
          <ul className="bleed-margin mt-8 flex flex-wrap gap-x-3 gap-y-2 font-mono text-register text-ink-soft">
            {whatWeConserve.subjects.map((subject, i) => (
              <li key={subject} className="flex items-center gap-3">
                {i > 0 ? <span aria-hidden="true" className="text-cinnabar">।</span> : null}
                {subject}
              </li>
            ))}
          </ul>
        </Leaf>

        <Leaf id="process" label={process.label}>
          <Heading>{process.heading}</Heading>
          <Prose>
            <p>{process.intro}</p>
          </Prose>
          <dl className="mt-8 grid max-w-[52rem] gap-x-10 gap-y-6 md:grid-cols-2">
            {process.approaches.map((a) => (
              <div key={a.name} className="border-l border-cinnabar/60 pl-4">
                <dt className="font-display text-[1.3rem] font-medium text-ink">{a.name}</dt>
                <dd className="mt-1 text-[1.0625rem] leading-relaxed text-ink-soft">{a.body}</dd>
              </div>
            ))}
          </dl>

          <p className="mt-16 font-mono text-register text-cinnabar">{process.curativeLabel}</p>
          <Verses steps={process.steps} className="mt-5" />

          <Plate
            className="mt-10 max-w-[44rem]"
            src={mission.plate.src}
            alt={mission.plate.alt}
            caption={t.documentationCaption}
            ratio="16 / 10"
            imageClassName="object-cover object-[50%_60%]"
            sizes="(min-width: 1024px) 44rem, 100vw"
          />
        </Leaf>

        {/* Painted pages, shown as they would be in a museum case: on the
            dark board of a bundle's cover, each with its own caption. */}
        <Leaf id="painted" label={illuminated.label}>
          <Heading>{illuminated.heading}</Heading>
          <Prose>
            <p>{illuminated.body}</p>
          </Prose>
          <div className="on-dark bleed-margin mt-12 bg-board px-5 pb-4 pt-8 [background-image:var(--weave)] sm:px-8 lg:px-10 lg:pt-10">
            <div className="columns-1 gap-6 sm:columns-2 lg:columns-3 lg:gap-8">
              {illuminated.items.map((item) => (
                <figure key={item.src} className="rise-on-scroll mb-8 break-inside-avoid">
                  <div className="relative w-full overflow-hidden bg-board-deep shadow-[0_0.6rem_1.6rem_-0.6rem_rgb(0_0_0/0.6)]" style={{ aspectRatio: item.ratio }}>
                    <Image
                      src={item.src}
                      alt={item.alt}
                      fill
                      sizes="(min-width: 1024px) 26vw, (min-width: 640px) 44vw, 90vw"
                      className="object-cover"
                    />
                  </div>
                  <figcaption className="mt-3 font-mono text-register text-board-soft">{item.caption}</figcaption>
                </figure>
              ))}
            </div>
            <p className="border-t border-board-soft/25 py-4 font-mono text-register text-board-soft">{illuminated.source}</p>
          </div>
        </Leaf>

        <Leaf id="film" label={film.label}>
          <Heading>{film.heading}</Heading>
          <Prose>
            <p>{film.body}</p>
          </Prose>
          <VideoLoop
            className="bleed-margin mt-10"
            youtubeId={film.youtubeId}
            title={film.heading}
            watchLabel={ui.common.watchWithSound}
          />
        </Leaf>

        <Sites />

        <Leaf id="capacity" label={capacity.label}>
          <Heading>{capacity.heading}</Heading>
          <Prose>
            <Gloss label={t.recognition}>{capacity.recognition}</Gloss>
            <p>{capacity.body}</p>
          </Prose>
          <InlineLink href={href("/#join")}>{t.joinLink}</InlineLink>
        </Leaf>
      </main>
      <Footer />
    </>
  );
}
