import Image from "next/image";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { Figures, GiveBand, Opener, PhotoGrid, Press, Steps } from "@/components/site/page-sections";
import { Heading, Leaf, Lede } from "@/components/site/primitives";
import { getContent } from "@/i18n/content";
import { pageMetadata } from "@/i18n/metadata";

export async function generateMetadata() {
  const { community } = await getContent();
  return pageMetadata("community", "/community-services", community.pageHero.paragraphs[0]);
}

/** Community Services, after the Foundation's page designs (Nov 2026). */
export default async function CommunityServicesPage() {
  const { community } = await getContent();
  const { pageHero, method, healthcare, education, relief, give } = community;
  return (
    <>
      <Header />
      <main id="main">
        <Opener {...pageHero} />

        <Leaf id="method" label={method.label} question={method.question}>
          <Heading>{method.heading}</Heading>
          <Lede>{method.lede}</Lede>
          <Steps items={method.steps} className="mt-10" />
        </Leaf>

        <Leaf id="healthcare" label={healthcare.label} question={healthcare.question}>
          <Heading>{healthcare.heading}</Heading>
          <div className="bleed-margin mt-8 grid items-start gap-x-10 gap-y-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <div className="min-w-0">
              <p className="text-lede text-ink">{healthcare.lede}</p>
              <p className="mt-4 text-[1.0625rem] leading-[1.65] text-ink">{healthcare.body}</p>
            </div>
            <PhotoGrid items={healthcare.images} />
          </div>
          <ol className="bleed-margin mt-12 grid border-t-[3px] border-double border-cinnabar/70 sm:grid-cols-2 lg:grid-cols-5">
            {healthcare.camps.map((camp, i) => (
              <li key={`${camp.date}-${i}`} className={`min-w-0 border-b border-ink/15 py-5 pr-4 lg:border-b-0 ${i > 0 ? "lg:border-l lg:border-ink/15 lg:pl-4" : ""}`}>
                <p className="font-mono text-[0.75rem] text-cinnabar">{camp.date}</p>
                <p className="mt-1 font-display text-[1.15rem] font-semibold leading-snug text-ink">{camp.place}</p>
                <p className="mt-2 font-display text-[1.9rem] font-semibold leading-none text-cinnabar">{camp.value}</p>
                <p className="mt-1 text-[0.98rem] text-ink-soft">{camp.unit}</p>
                <p className="mt-3 border-t border-dashed border-ink/25 pt-3 text-[0.95rem] leading-snug text-ink-soft">{camp.detail}</p>
              </li>
            ))}
          </ol>
          <p className="bleed-margin mt-2 border-t border-ink/15 pt-4 text-[1rem] leading-relaxed text-ink-soft">
            <span className="mr-2 font-mono text-[0.75rem] uppercase tracking-[0.1em] text-cinnabar">{healthcare.partnersLabel}</span>
            {healthcare.partners}
          </p>
        </Leaf>

        <Leaf id="education" label={education.label} question={education.question}>
          <div className="bleed-margin grid items-start gap-x-10 gap-y-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
            <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-leaf-deep">
              <Image src={education.image.src} alt={education.image.alt} fill sizes="(min-width: 1024px) 32rem, 92vw" className="object-cover" />
            </div>
            <div className="min-w-0">
              <Heading>{education.heading}</Heading>
              {education.paragraphs.map((p, i) => (
                <p key={i} className={`text-ink ${i === 0 ? "mt-6 text-lede" : "mt-4 text-[1.0625rem] leading-[1.65]"}`}>
                  {p}
                </p>
              ))}
            </div>
          </div>
          <Figures items={education.figures} className="mt-10" />
          <figure className="bleed-margin mt-8">
            <PhotoGrid items={education.strip} columns={3} />
            <figcaption className="mt-3 font-mono text-register text-ink-soft">{education.stripCaption}</figcaption>
          </figure>
        </Leaf>

        <Leaf id="relief" label={relief.label} question={relief.question}>
          <Heading>{relief.heading}</Heading>
          <Lede>{relief.lede}</Lede>
          <div className="bleed-margin mt-10 grid gap-6 lg:grid-cols-2">
            {relief.items.map((item) => (
              <article key={item.title} className="min-w-0 rounded-xl border border-leaf-edge/70 bg-leaf-deep/60 p-5">
                <PhotoGrid items={item.images} />
                <p className="mt-5 font-mono text-[0.78rem] text-cinnabar">{item.date}</p>
                <h3 className="mt-1.5 font-display text-[1.6rem] font-semibold leading-tight text-ink">{item.title}</h3>
                <p className="mt-2 text-[1.02rem] leading-relaxed text-ink-soft">{item.body}</p>
                <dl className="mt-5 grid grid-cols-3 border-t border-ink/15 pt-4">
                  {item.stats.map((stat, i) => (
                    <div key={stat.label} className={`min-w-0 pr-2 ${i > 0 ? "border-l border-ink/15 pl-3" : ""}`}>
                      <dt className="sr-only">{stat.label}</dt>
                      <dd className="font-display text-[1.6rem] font-semibold leading-none text-cinnabar">{stat.value}</dd>
                      <dd className="mt-1.5 text-[0.95rem] leading-snug text-ink-soft">{stat.label}</dd>
                    </div>
                  ))}
                </dl>
              </article>
            ))}
          </div>
          <Press label={relief.pressLabel} items={relief.press} caption={relief.pressCaption} className="mt-10" />
        </Leaf>

        <GiveBand {...give} />
      </main>
      <Footer />
    </>
  );
}
