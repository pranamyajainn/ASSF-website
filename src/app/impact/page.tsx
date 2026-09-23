import type { Metadata } from "next";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { Heading, Leaf, PageHero, Prose } from "@/components/site/primitives";
import { LeafPanels } from "@/components/site/leaf-panels";
import { closing, pageHero, streams } from "@/content/impact";

export const metadata: Metadata = {
  title: "Impact — Acharya Shanti Sagar Foundation",
  description: pageHero.body,
};

/**
 * The three streams on one leaf — the same leaf the homepage uses for the
 * three pillars, because they are the same three things, now counted.
 */
export default function ImpactPage() {
  return (
    <>
      <Header />
      <main>
        <PageHero label="Impact" {...pageHero} />

        <Leaf id="streams" label="Three streams">
          <Heading>{closing.heading}</Heading>
          <Prose>
            <p>{closing.body}</p>
          </Prose>
          <LeafPanels
            panels={streams.map((stream, i) => ({
              key: stream.name,
              number: String(i + 1).padStart(2, "0"),
              title: stream.name,
              stats: stream.stats,
              link: { label: "See the full picture", href: stream.href },
            }))}
            leadWeight={1.2}
          />
        </Leaf>
      </main>
      <Footer />
    </>
  );
}
