import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { Heading, Leaf, PageHero, Prose } from "@/components/site/primitives";
import { LeafPanels } from "@/components/site/leaf-panels";
import { getContent } from "@/i18n/content";
import { pageMetadata } from "@/i18n/metadata";

export async function generateMetadata() {
  const { impact } = await getContent();
  return pageMetadata("impact", "/impact", impact.pageHero.body);
}

/**
 * The three streams on one leaf — the same leaf the homepage uses for the
 * three pillars, because they are the same three things, now counted.
 */
export default async function ImpactPage() {
  const { impact, ui } = await getContent();
  const { closing, pageHero, streams } = impact;
  const t = ui.impact;
  return (
    <>
      <Header />
      <main>
        <PageHero label={t.heroLabel} {...pageHero} />

        <Leaf id="streams" label={t.streamsLabel}>
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
              link: { label: t.fullPicture, href: stream.href },
            }))}
            leadWeight={1.2}
          />
        </Leaf>
      </main>
      <Footer />
    </>
  );
}
