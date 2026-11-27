import Image from "next/image";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { NewsletterForm } from "@/components/site/newsletter-form";
import { Button, Heading, Leaf, Lede } from "@/components/site/primitives";
import { getContent } from "@/i18n/content";
import { pageMetadata } from "@/i18n/metadata";

export async function generateMetadata() {
  const { reports } = await getContent();
  return pageMetadata("reports", "/reports", reports.pageHero.body);
}

/** Reports & Newsletter, after the Foundation's page designs (Nov 2026). */
export default async function ReportsPage() {
  const { reports, shared } = await getContent();
  const { pageHero, list, newsletter, press } = reports;
  const { latest } = pageHero;
  return (
    <>
      <Header />
      <main id="main">
        <Leaf id="top" label={pageHero.label} question={pageHero.question} innerClassName="!pt-10 md:!pt-14 lg:!pt-16">
          <p className="font-mono text-register text-cinnabar">{pageHero.eyebrow}</p>
          <h1 className="inked ink-on-load mt-3 text-balance font-display text-title font-medium tracking-[-0.015em]">
            {pageHero.title}
            <span className="text-cinnabar" aria-hidden="true">
              {" "}॥
            </span>
          </h1>
          <p className="mt-5 max-w-[60ch] text-[1.125rem] leading-[1.6] text-ink">{pageHero.body}</p>
          <article className="bleed-margin mt-10 grid items-center gap-x-10 gap-y-8 rounded-xl border border-leaf-edge/70 bg-leaf-deep/70 p-6 sm:p-8 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
            <div aria-hidden="true" className="mx-auto w-full max-w-[20rem] -rotate-2 bg-leaf p-3 shadow-[0_18px_34px_-18px_rgb(0_0_0/0.55)]">
              <div className="flex aspect-[3/4] flex-col items-center border-[3px] border-double border-cinnabar/80 px-5 py-8 text-center">
                <p className="font-mono text-[0.72rem] uppercase tracking-[0.12em] text-cinnabar">{latest.coverLabel}</p>
                <p className="mt-auto font-display text-[1.45rem] font-semibold leading-tight text-ink">{latest.coverTitle}</p>
                <p className="mt-6 text-[0.98rem] leading-snug text-ink-soft">{latest.coverPlace}</p>
                <p className="mt-auto font-mono text-[0.7rem] text-ink-soft">{latest.coverBy}</p>
              </div>
            </div>
            <div className="min-w-0">
              <span className="rounded-full bg-cinnabar px-3 py-1 font-mono text-[0.72rem] text-leaf">{latest.tag}</span>
              <h2 className="mt-4 text-balance font-display text-[clamp(1.6rem,1.3rem+1.2vw,2.3rem)] font-semibold leading-tight text-ink">{latest.title}</h2>
              <p className="mt-3 text-[1.08rem] leading-relaxed text-ink">{latest.body}</p>
              <dl className="mt-4 space-y-1.5">
                {latest.facts.map((fact) => (
                  <div key={fact.label} className="grid grid-cols-[6rem_minmax(0,1fr)] items-baseline gap-3">
                    <dt className="font-mono text-[0.72rem] uppercase tracking-[0.08em] text-ink-soft">{fact.label}</dt>
                    <dd className="text-[1.05rem] text-ink">{fact.value}</dd>
                  </div>
                ))}
              </dl>
              <a href={latest.href} target="_blank" rel="noopener" className="mt-6 inline-flex min-h-12 items-center bg-cinnabar px-6 py-3 text-[1.0625rem] text-leaf hover:bg-cinnabar-deep">
                {latest.button}
              </a>
            </div>
          </article>
        </Leaf>

        <Leaf id="reports" label={list.label} question={list.question}>
          <Heading>{list.heading}</Heading>
          <ul className="bleed-margin mt-8 border-t-[3px] border-double border-t-cinnabar/70">
            {list.items.map((report, i) => {
              const ready = report.state === "available" && report.href;
              return (
                <li key={`${report.place}-${i}`} className="grid grid-cols-[6.5rem_minmax(0,1fr)] items-start gap-x-5 border-b border-ink/15 py-5 sm:grid-cols-[9.5rem_minmax(0,1fr)]">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-md bg-leaf-deep">
                    <Image src={report.image.src} alt={report.image.alt} fill sizes="10rem" className="object-cover" />
                  </div>
                  <div className="min-w-0">
                    <span className={`rounded-full px-2.5 py-0.5 font-mono text-[0.7rem] ${ready ? "bg-cinnabar text-leaf" : "border border-orpiment text-ink-soft"}`}>
                      {ready ? list.states.available : list.states.preparing}
                    </span>
                    <h3 className="mt-2 font-display text-[1.35rem] font-semibold leading-tight text-ink">{report.place}</h3>
                    <p className="mt-1.5 text-[1rem] leading-snug text-ink-soft">{report.facts}</p>
                    {ready ? (
                      <a href={report.href} target="_blank" rel="noopener" className="mt-2 inline-block font-mono text-[0.8rem] text-cinnabar underline underline-offset-4">
                        {list.open} →
                      </a>
                    ) : (
                      <p className="mt-2 font-mono text-[0.78rem] text-ink-soft">{list.soon}</p>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </Leaf>

        <Leaf id="newsletter" label={newsletter.label} question={newsletter.question}>
          <div className="bleed-margin grid items-center gap-x-10 gap-y-8 rounded-[28px] bg-board px-7 py-10 text-board-ink sm:px-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:rounded-l-[9rem] lg:pl-20">
            <div className="min-w-0">
              <h2 className="font-display text-[clamp(2rem,1.5rem+1.8vw,3rem)] font-semibold leading-[1.08]">
                {newsletter.heading}
                <span className="text-cinnabar" aria-hidden="true">
                  {" "}॥
                </span>
              </h2>
              <p className="mt-4 text-[1.125rem] leading-relaxed text-board-ink/90">{newsletter.body}</p>
            </div>
            <NewsletterForm
              to={shared.org.email}
              labels={{ name: newsletter.nameLabel, contact: newsletter.contactLabel, button: newsletter.button, subject: newsletter.subject, thanks: newsletter.thanks }}
            />
          </div>
        </Leaf>

        <Leaf id="press" label={press.label} question={press.question}>
          <Heading>{press.heading}</Heading>
          <Lede>{press.lede}</Lede>
          <ul className="bleed-margin mt-8 grid grid-cols-2 gap-5 lg:grid-cols-4">
            {press.items.map((item) => (
              <li key={item.src} className="min-w-0">
                <a href={item.src} target="_blank" rel="noopener" className="group block">
                  <span className="relative block aspect-[4/5] overflow-hidden rounded-md bg-leaf shadow-[0_12px_24px_-18px_rgb(0_0_0/0.6)]">
                    <Image src={item.src} alt={item.alt} fill sizes="(min-width: 1024px) 16rem, 46vw" className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]" />
                  </span>
                  <span className="mt-2 block font-display text-[1.15rem] font-semibold text-ink group-hover:text-cinnabar">{item.paper}</span>
                  <span className="block text-[0.95rem] text-ink-soft">{item.caption}</span>
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-14 text-center">
            <p className="mx-auto max-w-[36ch] text-balance font-display text-[clamp(1.4rem,1.1rem+1.2vw,2rem)] font-semibold leading-[1.3] text-ink">
              <span aria-hidden="true" className="text-cinnabar">
                ॥{" "}
              </span>
              {press.closing}
              <span aria-hidden="true" className="text-cinnabar">
                {" "}॥
              </span>
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              {press.buttons.map((button, i) => (
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
