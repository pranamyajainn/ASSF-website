import Image from "next/image";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { Figures } from "@/components/site/page-sections";
import { Heading, Leaf, Lede } from "@/components/site/primitives";
import { getContent } from "@/i18n/content";
import { pageMetadata } from "@/i18n/metadata";
import { fill } from "@/i18n/ui";

export async function generateMetadata() {
  const { careers } = await getContent();
  return pageMetadata("careers", "/careers", careers.pageHero.body);
}

/** Careers, after the Foundation's page designs (Nov 2026). Each role opens in full on demand; "Apply by email" carries the role in its subject. */
export default async function CareersPage() {
  const { careers, shared, ui } = await getContent();
  const { pageHero, why, openings, locations, apply } = careers;
  const email = apply.email || shared.org.email;
  const mailto = (role?: string) => `mailto:${email}${role ? `?subject=${encodeURIComponent(fill(ui.careers.subject, { role }))}` : ""}`;
  const places = openings.items.reduce((n, v) => n + (Number(v.openings.replace(/[^\d]/g, "")) || 0), 0);
  const figures = pageHero.figures.map((f) => ({ ...f, value: fill(f.value, { openings: String(places), roles: String(openings.items.length) }) }));

  return (
    <>
      <Header />
      <main id="main">
        <Leaf id="top" label={pageHero.label} question={pageHero.question} innerClassName="!pt-10 md:!pt-14 lg:!pt-16">
          <div className="bleed-margin relative min-h-[26rem] overflow-hidden rounded-[28px] bg-board-deep text-board-ink shadow-[0_18px_34px_-24px_rgb(0_0_0/0.65)] lg:rounded-l-[12rem]">
            <Image src={pageHero.image.src} alt={pageHero.image.alt} fill priority sizes="(min-width: 1024px) 66rem, 100vw" className="object-cover" />
            <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-board-deep/90 via-board-deep/60 to-board-deep/10" />
            <div className="relative z-10 max-w-[36rem] px-7 py-12 sm:px-10 lg:py-14 lg:pl-24">
              <span className="rounded-full bg-orpiment px-3 py-1 font-mono text-[0.75rem] text-ink">{pageHero.tag}</span>
              <h1 className="mt-4 text-balance font-display text-[clamp(2.3rem,1.6rem+2.6vw,3.8rem)] font-semibold leading-[1.05]">
                {pageHero.title}
                <span className="text-orpiment" aria-hidden="true">
                  {" "}॥
                </span>
              </h1>
              <p className="mt-4 text-[1.15rem] leading-snug text-board-ink/90">{pageHero.body}</p>
              <a href="#openings" className="mt-6 inline-flex min-h-12 items-center bg-cinnabar px-6 py-3 text-[1.0625rem] text-leaf hover:bg-cinnabar-deep">
                {pageHero.button} ↓
              </a>
            </div>
          </div>
          <Figures items={figures} className="mt-8" />
        </Leaf>

        <Leaf id="why" label={why.label} question={why.question}>
          <Heading>{why.heading}</Heading>
          <ul className="bleed-margin mt-8 grid border-y-[3px] border-double border-y-ink/60 sm:grid-cols-2 lg:grid-cols-4">
            {why.reasons.map((reason, i) => (
              <li key={reason.title} className={`min-w-0 py-5 pr-5 ${i > 0 ? "border-t border-ink/15 sm:border-t-0 lg:border-l lg:pl-5" : ""} ${i % 2 ? "sm:border-l sm:pl-5" : ""}`}>
                <h3 className="font-display text-[1.3rem] font-semibold text-cinnabar">{reason.title}</h3>
                <p className="mt-2 text-[1.02rem] leading-snug text-ink-soft">{reason.body}</p>
              </li>
            ))}
          </ul>
          <ol className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2">
            {why.path.map((step, i) => (
              <li key={step} className="flex items-center gap-3">
                {i > 0 ? (
                  <span aria-hidden="true" className="text-cinnabar">
                    →
                  </span>
                ) : null}
                <span className={`rounded-t-md border-t-4 border-orpiment px-4 py-2.5 font-display text-[1.05rem] font-semibold ${i === why.path.length - 1 ? "bg-cinnabar text-leaf" : "bg-leaf-deep/80 text-ink"}`}>{step}</span>
              </li>
            ))}
          </ol>
        </Leaf>

        <Leaf id="openings" label={openings.label} question={openings.question}>
          <Heading>{openings.heading}</Heading>
          <Lede>{openings.lede}</Lede>
          {openings.items.length ? (
            <ul className="bleed-margin mt-8 space-y-5">
              {openings.items.map((vacancy) => (
                <li key={vacancy.role} className="rounded-xl border border-l-4 border-leaf-edge/70 border-l-cinnabar bg-leaf-deep/70 p-5 sm:p-7">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="min-w-0">
                      <span className="rounded-full bg-cinnabar px-2.5 py-0.5 font-mono text-[0.72rem] text-leaf">{vacancy.openings}</span>
                      <h3 className="mt-3 font-display text-[clamp(1.6rem,1.4rem+0.8vw,2.1rem)] font-semibold leading-tight text-ink">{vacancy.role}</h3>
                      <p className="mt-2 font-display text-[1.15rem] font-semibold text-cinnabar">{vacancy.pay}</p>
                    </div>
                    <a href={mailto(vacancy.role)} className="inline-flex min-h-12 items-center bg-cinnabar px-6 py-3 text-[1.0625rem] text-leaf hover:bg-cinnabar-deep">
                      {openings.apply}
                    </a>
                  </div>
                  <p className="mt-4 text-[1.08rem] leading-snug text-ink">{vacancy.description}</p>
                  <p className="mt-2 font-mono text-[0.78rem] text-ink-soft">{vacancy.location}</p>
                  <details className="group mt-4 border-t border-ink/15 pt-4">
                    <summary className="cursor-pointer list-none font-mono text-[0.8rem] text-cinnabar [&::-webkit-details-marker]:hidden">
                      <span aria-hidden="true" className="mr-1.5 inline-block group-open:rotate-45">
                        +
                      </span>
                      {openings.more}
                    </summary>
                    <div className="mt-5 grid gap-x-10 gap-y-6 md:grid-cols-2">
                      {(["responsibilities", "qualifications"] as const).map((part) => (
                        <div key={part} className="min-w-0">
                          <h4 className="font-mono text-[0.75rem] uppercase tracking-[0.1em] text-ink-soft">{openings.labels[part]}</h4>
                          <ul className="mt-3 space-y-2">
                            {vacancy[part].map((line) => (
                              <li key={line} className="border-l-[3px] border-orpiment pl-3 text-[1rem] leading-snug text-ink">
                                {line}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </details>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-8 max-w-[56ch] border-l-2 border-cinnabar/60 pl-5 text-lede text-ink">{openings.empty}</p>
          )}
        </Leaf>

        <Leaf id="locations" label={locations.label} question={locations.question}>
          <Heading>{locations.heading}</Heading>
          <ul className="bleed-margin mt-8 grid gap-6 md:grid-cols-2">
            {locations.sites.map((site) => (
              <li key={site.name} className="min-w-0">
                <div className="relative aspect-[16/10] overflow-hidden rounded-lg bg-leaf-deep">
                  <Image src={site.image.src} alt={site.image.alt} fill sizes="(min-width: 768px) 32rem, 92vw" className="object-cover" />
                </div>
                <h3 className="mt-4 font-display text-[1.4rem] font-semibold leading-tight text-ink">{site.name}</h3>
                <p className="mt-1.5 text-[1.02rem] leading-snug text-ink-soft">{site.body}</p>
              </li>
            ))}
          </ul>
          <p className="bleed-margin mt-8 rounded-xl border border-leaf-edge/70 bg-leaf-deep/70 px-6 py-5 text-[1.05rem] leading-relaxed text-ink">{locations.note}</p>
        </Leaf>

        <Leaf id="apply" label={apply.label} question={apply.question}>
          <div className="bleed-margin grid items-center gap-x-10 gap-y-8 rounded-[28px] bg-board px-7 py-10 text-board-ink sm:px-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:rounded-l-[9rem] lg:pl-20">
            <div className="min-w-0">
              <h2 className="font-display text-[clamp(2rem,1.5rem+1.8vw,3rem)] font-semibold leading-[1.08]">
                {apply.heading}
                <span className="text-cinnabar" aria-hidden="true">
                  {" "}॥
                </span>
              </h2>
              <p className="mt-4 text-[1.125rem] leading-relaxed text-board-ink/90">{apply.body}</p>
            </div>
            <dl className="divide-y divide-board-soft/30 border-b border-board-soft/30">
              {[
                { label: apply.emailLabel, value: email, href: mailto() },
                { label: apply.subjectLabel, value: apply.subject },
                { label: apply.enquiriesLabel, value: apply.phone, href: `tel:${apply.phone.replace(/[^\d+]/g, "")}` },
              ].map((row) => (
                <div key={row.label} className="grid grid-cols-[6.5rem_minmax(0,1fr)] items-baseline gap-4 py-3.5">
                  <dt className="font-mono text-[0.72rem] uppercase tracking-[0.1em] text-orpiment">{row.label}</dt>
                  <dd className="break-words text-[1.05rem]">{row.href ? <a href={row.href} className="underline underline-offset-4 hover:text-orpiment">{row.value}</a> : row.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </Leaf>
      </main>
      <Footer />
    </>
  );
}
