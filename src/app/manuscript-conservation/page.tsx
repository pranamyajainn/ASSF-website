import type { Metadata } from "next";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { Sites } from "@/components/site/sections";
import {
  Heading,
  InlineLink,
  Lede,
  PageHero,
  Section,
  StatGrid,
  StepList,
} from "@/components/site/primitives";
import { VideoLoop } from "@/components/site/video-loop";
import { ledger } from "@/content/home";
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
        <PageHero {...pageHero} />

        <Section id="ledger" gutter={ledger.gutter}>
          <Heading>{ledger.heading}</Heading>
          <Lede>{ledger.intro}</Lede>
          <StatGrid metrics={ledger.metrics} />
        </Section>

        <Section id="what-we-conserve" gutter={whatWeConserve.gutter}>
          <Heading>{whatWeConserve.heading}</Heading>
          <ul className="mt-8 grid gap-x-10 gap-y-8 sm:grid-cols-2">
            {whatWeConserve.items.map((item) => (
              <li key={item.name} className="border-t border-parchment/25 pt-4">
                <h3 className="text-xl text-parchment-bright">{item.name}</h3>
                <p className="mt-2 text-lg leading-snug text-parchment/80">{item.body}</p>
              </li>
            ))}
          </ul>
          <p className="mt-8 max-w-[62ch] text-lg leading-relaxed text-parchment/80">
            {whatWeConserve.note}
          </p>
        </Section>

        <Section id="process" gutter={process.gutter}>
          <Heading>{process.heading}</Heading>
          <Lede>{process.intro}</Lede>
          <StepList steps={process.steps} />
        </Section>

        <Section id="film" gutter={film.gutter}>
          <Heading>{film.heading}</Heading>
          <Lede>{film.body}</Lede>
          <VideoLoop
            className="mt-10 max-w-3xl"
            youtubeId={film.youtubeId}
            title={film.heading}
          />
        </Section>

        <Sites />

        <Section id="capacity" gutter={capacity.gutter}>
          <Heading>{capacity.heading}</Heading>
          <Lede>{capacity.body}</Lede>
          <p className="mt-6 max-w-[58ch] font-sans text-[0.95rem] leading-relaxed text-accent">
            {capacity.recognition}
          </p>
          <InlineLink href="/#adopt">Conserve one folio</InlineLink>
        </Section>
      </main>
      <Footer />
    </>
  );
}
