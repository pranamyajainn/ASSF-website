import type { Metadata } from "next";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import {
  Container,
  Heading,
  InlineLink,
  Lede,
  PageHero,
  Section,
} from "@/components/site/primitives";
import { Reveal } from "@/components/site/reveal";
import { pillars } from "@/content/shared";
import { mvv, pageHero, philosophy, scale } from "@/content/about";

export const metadata: Metadata = {
  title: "About Us — Acharya Shanti Sagar Foundation",
  description: pageHero.body,
};

export default function AboutPage() {
  return (
    <>
      <Header />
      <main>
        <PageHero {...pageHero} />

        <Section id="philosophy" gutter={philosophy.gutter}>
          <Heading>{philosophy.heading}</Heading>
          {philosophy.paragraphs.map((p) => (
            <Lede key={p.slice(0, 24)}>{p}</Lede>
          ))}
          <blockquote className="mt-8 max-w-xl border-l-2 border-rust pl-6">
            <p className="text-2xl leading-snug text-ink">
              {philosophy.quote.deva}
            </p>
            <p className="mt-2 font-sans text-base text-ink/70">
              {philosophy.quote.translation}
            </p>
          </blockquote>
        </Section>

        <Section id="mvv" gutter={mvv.gutter}>
          <Heading>{mvv.heading}</Heading>

          <div className="mt-8 grid gap-8 sm:grid-cols-2">
            <div className="border-t border-ink/25 pt-4">
              <p className="font-sans text-sm text-rust">{mvv.mission.label}</p>
              <p className="mt-2 text-2xl leading-snug text-ink">{mvv.mission.body}</p>
            </div>
            <div className="border-t border-ink/25 pt-4">
              <p className="font-sans text-sm text-rust">{mvv.vision.label}</p>
              <p className="mt-2 text-lg leading-snug text-ink/85">{mvv.vision.body}</p>
            </div>
          </div>

          <ul className="mt-12 grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {mvv.values.map((value) => (
              <li key={value.name}>
                <h3 className="text-xl text-ink">
                  {value.name} <span className="font-sans text-sm text-ink/55">— {value.meaning}</span>
                </h3>
                <p className="mt-2 text-lg leading-snug text-ink/80">{value.body}</p>
              </li>
            ))}
          </ul>
        </Section>

        <Section id="pillars" gutter="Three Pillars">
          <Heading>How the mission takes shape</Heading>
          <ul className="mt-10 grid gap-x-10 gap-y-10 sm:grid-cols-3">
            {pillars.map((pillar) => (
              <li key={pillar.slug} className="border-t border-ink/25 pt-5">
                <h3 className="text-2xl text-ink">{pillar.label}</h3>
                <p className="mt-3 text-lg leading-snug text-ink/80">{pillar.body}</p>
                <InlineLink href={`/${pillar.slug}`}>Explore {pillar.label}</InlineLink>
              </li>
            ))}
          </ul>
        </Section>

        <Section id="scale" gutter={scale.gutter}>
          <Heading>{scale.heading}</Heading>
          <Lede>{scale.body}</Lede>

          <div className="mt-10 overflow-x-auto">
            <table className="w-full min-w-[36rem] border-collapse font-sans text-base">
              <thead>
                <tr>
                  <th className="border-b border-ink/25 pb-3 pr-4 text-left text-ink/60">Measure</th>
                  {scale.table.columns.map((col) => (
                    <th key={col} className="border-b border-ink/25 pb-3 px-4 text-left text-ink/60">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {scale.table.rows.map((row) => (
                  <tr key={row.label}>
                    <td className="border-b border-ink/10 py-3 pr-4 text-ink/90">{row.label}</td>
                    {row.values.map((v, i) => (
                      <td
                        key={i}
                        className={`border-b border-ink/10 py-3 px-4 ${
                          i === row.values.length - 1 ? "text-rust" : "text-ink/85"
                        }`}
                      >
                        {v}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-8 max-w-[64ch] text-lg leading-relaxed text-ink/80">{scale.note}</p>
        </Section>

        <section className="py-14 sm:py-20">
          <Container>
            <Reveal>
              <div className="border-t-2 border-rust bg-ink px-6 py-12 text-center sm:px-14">
                <p className="text-2xl text-parchment-bright sm:text-3xl">In Service of Heritage and Humanity</p>
              </div>
            </Reveal>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
