import Image from "next/image";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { GiveBand, Opener, Steps } from "@/components/site/page-sections";
import { Heading, Leaf, Lede } from "@/components/site/primitives";
import { getContent } from "@/i18n/content";
import { pageMetadata } from "@/i18n/metadata";

export async function generateMetadata() {
  const { rural } = await getContent();
  return pageMetadata("rural", "/rural-infrastructure", rural.pageHero.paragraphs[0]);
}

/** Rural Infrastructure, after the Foundation's page designs (Nov 2026). */
export default async function RuralInfrastructurePage() {
  const { rural } = await getContent();
  const { pageHero, method, projects, shantiStambh, give } = rural;
  const { feature } = projects;
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

        <Leaf id="projects" label={projects.label} question={projects.question}>
          <Heading>{projects.heading}</Heading>
          <article className="bleed-margin mt-10 grid items-center gap-x-10 gap-y-8 rounded-xl border border-leaf-edge/70 bg-leaf-deep/60 p-5 sm:p-7 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <div className="grid grid-cols-2 gap-2.5">
              {feature.images.map((image, i) => (
                <div key={image.src} className={`relative aspect-[3/4] overflow-hidden bg-leaf ${i === 1 ? "rounded-t-[8rem] rounded-b-lg" : "rounded-lg"}`}>
                  <Image src={image.src} alt={image.alt} fill sizes="(min-width: 1024px) 15rem, 46vw" className="object-cover" />
                  {image.caption ? (
                    <span className={`absolute bottom-3 left-3 rounded-full px-2.5 py-0.5 font-mono text-[0.72rem] text-leaf ${i === 1 ? "bg-cinnabar" : "bg-board"}`}>{image.caption}</span>
                  ) : null}
                </div>
              ))}
            </div>
            <div className="min-w-0">
              <p className="font-mono text-[0.78rem] text-cinnabar">{feature.place}</p>
              <h3 className="mt-2 font-display text-[clamp(1.8rem,1.5rem+1vw,2.3rem)] font-semibold leading-tight text-ink">{feature.title}</h3>
              {feature.paragraphs.map((p, i) => (
                <p key={i} className="mt-3 text-[1.0625rem] leading-relaxed text-ink">
                  {p}
                </p>
              ))}
              <dl className="mt-4 space-y-1 border-t border-dashed border-ink/25 pt-3 text-[1rem] text-ink-soft">
                {feature.credits.map((credit) => (
                  <div key={credit.label}>
                    <dt className="mr-2 inline font-mono text-[0.72rem] uppercase tracking-[0.1em] text-cinnabar">{credit.label}</dt>
                    <dd className="inline">{credit.text}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </article>
          <ul className="bleed-margin mt-8 grid gap-x-7 gap-y-10 md:grid-cols-3">
            {projects.items.map((item) =>
              item.images.length ? (
                <li key={item.title} className="min-w-0">
                  <div className="grid grid-cols-2 gap-2">
                    {item.images.slice(0, 2).map((image) => (
                      <div key={image.src} className="relative aspect-[3/4] overflow-hidden rounded-[3px] bg-leaf-deep">
                        <Image src={image.src} alt={image.alt} fill sizes="(min-width: 768px) 11rem, 46vw" className="object-cover" />
                      </div>
                    ))}
                  </div>
                  <p className="mt-4 font-mono text-[0.78rem] text-cinnabar">{item.place}</p>
                  <h3 className="mt-1.5 font-display text-[1.45rem] font-semibold leading-tight text-ink">{item.title}</h3>
                  <p className="mt-2 text-[1.02rem] leading-relaxed text-ink-soft">{item.body}</p>
                </li>
              ) : (
                <li key={item.title} className="min-w-0 self-start rounded-lg bg-board p-6 text-board-ink">
                  <p className="font-mono text-[0.78rem] text-orpiment">{item.place}</p>
                  <h3 className="mt-2 font-display text-[1.45rem] font-semibold leading-tight">{item.title}</h3>
                  <p className="mt-2 text-[1.02rem] leading-relaxed text-board-ink/85">{item.body}</p>
                </li>
              ),
            )}
          </ul>
        </Leaf>

        <Leaf id="shanti-stambh" label={shantiStambh.label} question={shantiStambh.question}>
          <div className="bleed-margin grid items-start gap-x-12 gap-y-8 lg:grid-cols-[minmax(0,1fr)_16rem]">
            <div className="min-w-0">
              <Heading>{shantiStambh.heading}</Heading>
              <p className="mt-5 text-lede text-ink">{shantiStambh.lede}</p>
              {shantiStambh.paragraphs.map((p, i) => (
                <p key={i} className="mt-4 text-[1.0625rem] leading-[1.65] text-ink">
                  {p}
                </p>
              ))}
              <p className="mt-4 border-t border-dashed border-ink/25 pt-3 text-[1rem] text-ink-soft">
                <span className="mr-2 font-mono text-[0.72rem] uppercase tracking-[0.1em] text-cinnabar">{shantiStambh.creditLabel}</span>
                {shantiStambh.credit}
              </p>
            </div>
            <figure className="rounded-xl border-[3px] border-double border-cinnabar/70 bg-leaf-deep/60 p-3">
              <div className="relative aspect-[2/3] overflow-hidden">
                <Image src={shantiStambh.image.src} alt={shantiStambh.image.alt} fill sizes="16rem" className="object-contain" />
              </div>
              <figcaption className="mt-2 text-center font-mono text-[0.78rem] text-ink-soft">{shantiStambh.image.caption}</figcaption>
            </figure>
          </div>
        </Leaf>

        <GiveBand {...give} />
      </main>
      <Footer />
    </>
  );
}
