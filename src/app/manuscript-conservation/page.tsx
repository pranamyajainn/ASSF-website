import type { Metadata } from "next";
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
import { ledger, mission } from "@/content/home";
import { capacity, film, pageHero, process, whatWeConserve } from "@/content/manuscript-conservation";

export const metadata: Metadata = {
  title: "Manuscript Conservation — Acharya Shanti Sagar Foundation",
  description: pageHero.body,
};

export default function ManuscriptConservationPage() {
  return (
    <>
      <Header />
      <main>
        <PageHero label="Conservation" {...pageHero} plate={{ ...pageHero.plate, position: "50% 55%" }} />

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
            caption="Documentation comes first: this manuscript was recorded as KBJ/PM/047, and photographed, before treatment."
            ratio="16 / 10"
            imageClassName="object-cover object-[50%_60%]"
            sizes="(min-width: 1024px) 44rem, 100vw"
          />
        </Leaf>

        <Leaf id="film" label={film.label}>
          <Heading>{film.heading}</Heading>
          <Prose>
            <p>{film.body}</p>
          </Prose>
          <VideoLoop className="bleed-margin mt-10" youtubeId={film.youtubeId} title={film.heading} />
        </Leaf>

        <Sites />

        <Leaf id="capacity" label={capacity.label}>
          <Heading>{capacity.heading}</Heading>
          <Prose>
            <Gloss label="Recognition">{capacity.recognition}</Gloss>
            <p>{capacity.body}</p>
          </Prose>
          <InlineLink href="/#join">Ways to join the work</InlineLink>
        </Leaf>
      </main>
      <Footer />
    </>
  );
}
