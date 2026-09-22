import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { PageHero, Container } from "@/components/site/primitives";
import { Reveal } from "@/components/site/reveal";
import { pageHero, streams } from "@/content/impact";

export const metadata: Metadata = {
  title: "Impact — Acharya Shanti Sagar Foundation",
  description: pageHero.body,
};

export default function ImpactPage() {
  return (
    <>
      <Header />
      <main>
        <PageHero {...pageHero} />

        <section className="py-14 sm:py-20">
          <Container>
            <Reveal>
            <div className="grid gap-px overflow-hidden bg-parchment/15 sm:grid-cols-3">
              {streams.map((stream) => (
                <Link
                  key={stream.name}
                  href={stream.href}
                  className="group flex flex-col bg-ground px-7 py-10 transition-colors hover:bg-ground-deep sm:px-8"
                >
                  <h2 className="text-2xl text-parchment-bright">{stream.name}</h2>
                  <dl className="mt-8 flex-1 space-y-7">
                    {stream.stats.map((stat) => (
                      <div key={stat.label}>
                        <dt className="text-4xl text-gold sm:text-5xl">{stat.value}</dt>
                        <dd className="mt-2 max-w-[22ch] font-sans text-sm text-parchment/70">
                          {stat.label}
                        </dd>
                      </div>
                    ))}
                  </dl>
                  <span className="mt-8 font-sans text-sm text-accent transition-colors group-hover:text-accent/80">
                    See the full picture →
                  </span>
                </Link>
              ))}
            </div>
            </Reveal>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
