import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { Heading, InlineLink, Leaf, PageHero, Prose } from "@/components/site/primitives";
import Image from "next/image";
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
  const { closing, evidence, pageHero, streams } = impact;
  const t = ui.impact;
  return (
    <>
      <Header />
      <main id="main">
        <PageHero
          question={ui.steps.glance}
          thread={{
            title: ui.steps.thread,
            items: [
              { id: "streams", question: ui.steps.much },
              { id: "evidence", question: ui.steps.means },
            ],
          }}
          label={t.heroLabel}
          {...pageHero}
          plate={{ ...pageHero.plate, position: "50% 45%" }}
        />

        <Leaf id="streams" label={t.streamsLabel} question={ui.steps.much}>
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

        {/* Each stream's figure beside a photograph of the work it counts:
            the number inks in as it scrolls into view, as the headings do. */}
        <Leaf id="evidence" label={t.evidenceLabel} question={ui.steps.means}>
          <Heading>{t.evidenceHeading}</Heading>
          <div className="bleed-margin mt-12">
            {evidence.map((item, i) => (
              <div
                key={item.href}
                className={`grid items-center gap-x-12 gap-y-6 border-t border-ink/20 py-12 lg:grid-cols-2 ${i % 2 ? "lg:[&>figure]:order-2" : ""}`}
              >
                <figure data-plate className="rise-on-scroll min-w-0">
                  <div className="relative w-full overflow-hidden bg-leaf-deep" style={{ aspectRatio: item.image.ratio }}>
                    <Image
                      src={item.image.src}
                      alt={item.image.alt}
                      fill
                      sizes="(min-width: 1024px) 40vw, 90vw"
                      className="object-cover"
                    />
                  </div>
                  <figcaption className="mt-3 font-mono text-register text-ink-faint">{item.image.caption}</figcaption>
                </figure>
                <div className="min-w-0">
                  <p className="inked ink-on-scroll font-display text-[clamp(3rem,2rem+4vw,5.5rem)] font-medium leading-none tracking-[-0.02em]">
                    {item.value}
                  </p>
                  <p className="mt-3 max-w-[36ch] font-mono text-register text-cinnabar">{item.label}</p>
                  <p className="mt-6 max-w-[40ch] text-lede text-ink">{item.line}</p>
                  <InlineLink href={item.href} className="mt-6">
                    {t.fullPicture}
                  </InlineLink>
                </div>
              </div>
            ))}
          </div>
        </Leaf>
      </main>
      <Footer />
    </>
  );
}
