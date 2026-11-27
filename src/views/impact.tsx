import Image from "next/image";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { Button, Heading, InlineLink, Leaf } from "@/components/site/primitives";
import { getContent } from "@/i18n/content";
import { pageMetadata } from "@/i18n/metadata";

export async function generateMetadata() {
  const { impact } = await getContent();
  return pageMetadata("impact", "/impact", `${impact.pageHero.value} ${impact.pageHero.title}`);
}

const count = (s: string) => Number(s.replace(/[^\d]/g, "")) || 0;
const STEP = ["md:h-[6.5rem]", "md:h-[8rem]", "md:h-[9.5rem]", "md:h-[11rem]"];

/** Impact, after the Foundation's page designs (Nov 2026). */
export default async function ImpactPage() {
  const { impact } = await getContent();
  const { pageHero, forever, careers, beyond, ahead } = impact;
  const { survey } = forever;
  const share = Math.min(100, (100 * count(survey.safe)) / Math.max(1, count(survey.total)));
  const badge = (n: number, gold = false) => (
    <span className={`absolute -bottom-4 left-4 grid size-9 place-items-center rounded-full border-[3px] border-leaf font-mono text-[0.72rem] ${gold ? "bg-orpiment text-ink" : "bg-cinnabar text-leaf"}`}>
      {String(n).padStart(2, "0")}
    </span>
  );
  return (
    <>
      <Header />
      <main id="main">
        <Leaf id="top" label={pageHero.label} question={pageHero.question} innerClassName="!pt-10 md:!pt-14 lg:!pt-16">
          <p className="font-mono text-register text-cinnabar">{pageHero.eyebrow}</p>
          <div className="bleed-margin mt-5 grid overflow-hidden rounded-[28px] bg-board text-board-ink shadow-[0_18px_34px_-24px_rgb(0_0_0/0.65)] lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:rounded-l-[12rem]">
            <div className="min-w-0 px-7 py-10 sm:px-10 lg:py-14 lg:pl-24">
              <p className="font-display text-[clamp(3.2rem,2rem+5vw,6rem)] font-semibold leading-none text-orpiment">{pageHero.value}</p>
              <h1 className="mt-4 max-w-[22ch] text-balance font-display text-[clamp(1.5rem,1.2rem+1vw,2rem)] font-semibold leading-[1.2]">{pageHero.title}</h1>
              <dl className="mt-6 flex flex-wrap gap-x-6 gap-y-3 border-t border-board-soft/30 pt-5">
                {pageHero.figures.map((figure) => (
                  <div key={figure.label} className="flex items-baseline gap-2">
                    <dd className="font-display text-[1.35rem] font-semibold text-orpiment">{figure.value}</dd>
                    <dt className="text-[1rem]">{figure.label}</dt>
                  </div>
                ))}
              </dl>
            </div>
            <div className="relative min-h-[16rem]">
              <Image src={pageHero.image.src} alt={pageHero.image.alt} fill priority sizes="(min-width: 1024px) 34rem, 92vw" className="object-cover" />
            </div>
          </div>
        </Leaf>

        <Leaf id="forever" label={forever.label} question={forever.question}>
          <Heading>{forever.heading}</Heading>
          <div className="bleed-margin mt-8 grid gap-x-6 gap-y-10 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
            <figure className="min-w-0">
              <div className="relative">
                <div className="relative aspect-[1612/1066] overflow-hidden rounded-lg bg-leaf-deep">
                  <Image src={forever.image.src} alt={forever.image.alt} fill sizes="(min-width: 1024px) 44rem, 92vw" className="object-cover" />
                </div>
              </div>
              <div className="mt-7 grid grid-cols-2 gap-6">
                {forever.stages.map((stage, i) => (
                  <div key={stage.title} className="min-w-0">
                    <p className="font-mono text-[0.75rem] text-cinnabar">{String(i + 1).padStart(2, "0")}</p>
                    <h3 className="mt-1 font-display text-[1.45rem] font-semibold leading-tight text-ink">{stage.title}</h3>
                    <p className="mt-1.5 text-[1.02rem] leading-snug text-ink-soft">{stage.body}</p>
                  </div>
                ))}
              </div>
              <figcaption className="mt-4 font-mono text-register text-ink-soft">{forever.caption}</figcaption>
            </figure>
            <div className="grid content-start gap-10 sm:grid-cols-2 lg:grid-cols-1">
              {forever.later.map((stage, i) => (
                <div key={stage.title} className="min-w-0">
                  <div className="relative">
                    <div className="relative aspect-[16/10] overflow-hidden rounded-lg bg-leaf-deep">
                      <Image src={stage.image.src} alt={stage.image.alt} fill sizes="(min-width: 1024px) 21rem, 46vw" className="object-cover" />
                    </div>
                    {badge(i + 3, i === 1)}
                  </div>
                  <h3 className="mt-7 font-display text-[1.45rem] font-semibold leading-tight text-ink">{stage.title}</h3>
                  <p className="mt-1.5 text-[1.02rem] leading-snug text-ink-soft">{stage.body}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="bleed-margin mt-12 rounded-xl bg-board px-6 py-6 text-board-ink sm:px-8">
            <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 text-[1.1rem]">
              <p>
                {survey.before} <strong className="font-semibold text-orpiment">{survey.total}</strong> {survey.after}
              </p>
              <p>
                <strong className="font-semibold text-orpiment">{survey.safe}</strong> {survey.safeText}
              </p>
            </div>
            <div className="mt-4 h-3.5 overflow-hidden rounded-full bg-board-soft/25" role="img" aria-label={`${survey.safe} / ${survey.total}`}>
              <div className="h-full rounded-full bg-gradient-to-r from-orpiment to-cinnabar" style={{ width: `${share}%` }} />
            </div>
          </div>
        </Leaf>

        <Leaf id="careers" label={careers.label} question={careers.question}>
          <div className="bleed-margin grid items-center gap-x-10 gap-y-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
            <figure className="order-2 min-w-0 lg:order-1">
              <div className="relative aspect-[1156/565] overflow-hidden rounded-lg rounded-tr-[8rem] bg-leaf-deep">
                <Image src={careers.image.src} alt={careers.image.alt} fill sizes="(min-width: 1024px) 36rem, 92vw" className="object-cover" />
              </div>
              <figcaption className="mt-2 font-mono text-register text-ink-soft">{careers.caption}</figcaption>
            </figure>
            <div className="order-1 min-w-0 lg:order-2">
              <Heading>{careers.heading}</Heading>
              <p className="mt-5 text-lede text-ink">{careers.lede}</p>
              <ol className="mt-8 grid grid-cols-2 gap-2 md:grid-cols-4 md:items-end">
                {careers.steps.map((step, i) => (
                  <li
                    key={step.title}
                    className={`min-w-0 rounded-t-md border-t-4 border-orpiment p-3 ${STEP[i] ?? ""} ${i === careers.steps.length - 1 ? "bg-cinnabar text-leaf" : "bg-leaf-deep/80 text-ink"}`}
                  >
                    <h3 className="font-display text-[1.05rem] font-semibold leading-tight">{step.title}</h3>
                    <p className="mt-1 text-[0.92rem] leading-snug opacity-85">{step.body}</p>
                  </li>
                ))}
              </ol>
              <p className="mt-6 flex flex-wrap items-center gap-4">
                <span className="rounded-full bg-orpiment px-4 py-2 font-mono text-[0.8rem] text-ink">{careers.hiring}</span>
                <InlineLink href={careers.link.href}>{careers.link.label} →</InlineLink>
              </p>
            </div>
          </div>
        </Leaf>

        <Leaf id="beyond" label={beyond.label} question={beyond.question}>
          <Heading>{beyond.heading}</Heading>
          <div className="bleed-margin mt-8 grid gap-6 lg:grid-cols-2">
            {beyond.cards.map((card) => (
              <article key={card.title} className="grid min-w-0 overflow-hidden rounded-xl border border-leaf-edge/70 bg-leaf-deep/70 sm:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
                <div className="relative min-h-[12rem]">
                  <Image src={card.image.src} alt={card.image.alt} fill sizes="(min-width: 1024px) 13rem, 92vw" className="object-cover" />
                </div>
                <div className="min-w-0 p-5">
                  <h3 className="font-mono text-[0.75rem] uppercase tracking-[0.1em] text-cinnabar">{card.title}</h3>
                  <dl className="mt-2 divide-y divide-ink/15 border-y border-ink/15">
                    {card.stats.map((stat) => (
                      <div key={stat.label} className="grid grid-cols-[5.5rem_minmax(0,1fr)] items-baseline gap-3 py-3">
                        <dd className="font-display text-[1.45rem] font-semibold leading-none text-cinnabar">{stat.value}</dd>
                        <dt className="text-[1rem] leading-snug text-ink-soft">{stat.label}</dt>
                      </div>
                    ))}
                  </dl>
                  <InlineLink href={card.link.href} className="mt-4 inline-block">
                    {card.link.label} →
                  </InlineLink>
                </div>
              </article>
            ))}
          </div>
        </Leaf>

        <Leaf id="ahead" label={ahead.label} question={ahead.question}>
          <Heading>{ahead.heading}</Heading>
          <dl className="bleed-margin mt-8 grid border-y-[3px] border-double border-y-ink/60 md:grid-cols-3">
            {ahead.figures.map((figure, i) => (
              <div key={figure.value} className={`min-w-0 py-5 md:pr-5 ${i > 0 ? "border-t border-ink/15 md:border-l md:border-t-0 md:pl-5" : ""}`}>
                <dt className="sr-only">{figure.label}</dt>
                <dd className="font-display text-[clamp(1.6rem,1.3rem+1vw,2.1rem)] font-semibold leading-tight text-cinnabar">{figure.value}</dd>
                <dd className="mt-1.5 text-[1rem] leading-snug text-ink-soft">{figure.label}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-14 text-center">
            <p className="mx-auto max-w-[36ch] text-balance font-display text-[clamp(1.4rem,1.1rem+1.2vw,2rem)] font-semibold leading-[1.3] text-ink">
              <span aria-hidden="true" className="text-cinnabar">
                ॥{" "}
              </span>
              {ahead.closing}
              <span aria-hidden="true" className="text-cinnabar">
                {" "}॥
              </span>
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              {ahead.buttons.map((button, i) => (
                <Button key={button.label} href={button.href} variant={i === 0 ? undefined : "outline"}>
                  {button.label}
                </Button>
              ))}
            </div>
          </div>
        </Leaf>
      </main>
      <Footer />
    </>
  );
}
