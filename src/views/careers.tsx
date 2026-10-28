import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { Heading, Leaf, PageHero, Prose } from "@/components/site/primitives";
import { getContent } from "@/i18n/content";
import { pageMetadata } from "@/i18n/metadata";
import { fill } from "@/i18n/ui";

export async function generateMetadata() {
  const { careers } = await getContent();
  return pageMetadata("careers", "/careers", careers.pageHero.body);
}

/**
 * The Foundation's open positions as its posting sets them out: each
 * role with its openings, pay, place, overview, responsibilities,
 * qualifications and reasons to join, and one way to apply, an email with
 * the position already in its subject line. With none open, the page says
 * so plainly. Vacancies are added and removed in the site editor.
 */
export default async function CareersPage() {
  const { careers, shared, ui } = await getContent();
  const { about, apply, locations, openings, pageHero, summary } = careers;
  const t = ui.careers;
  const email = apply.email || shared.org.email;
  const mailto = (role?: string) => `mailto:${email}${role ? `?subject=${encodeURIComponent(fill(t.subject, { role }))}` : ""}`;

  return (
    <>
      <Header />
      <main id="main">
        <PageHero
          question={ui.steps.glance}
          thread={{
            title: ui.steps.thread,
            items: [
              { id: "openings", question: ui.steps.open },
              { id: "locations", question: ui.steps.where },
              { id: "apply", question: ui.steps.apply },
            ],
          }}
          {...pageHero}
        >
          <dl className="mt-10 grid gap-3 sm:grid-cols-3">
            {summary.map((s) => (
              <div key={s.label} className="flex min-w-0 flex-col border border-ink/20 px-5 py-4">
                <dt className="order-2 mt-1 font-mono text-register text-ink-faint">{s.label}</dt>
                <dd className="order-1 font-display text-[1.25rem] leading-snug text-ink">{s.value}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-10 max-w-[60ch]">
            <h2 className="font-display text-[1.35rem] font-medium leading-tight text-ink">{about.heading}</h2>
            <p className="mt-3 text-[1.0625rem] leading-relaxed text-ink-soft">{about.body}</p>
          </div>
        </PageHero>

        <Leaf id="openings" label={openings.label} question={ui.steps.open}>
          <Heading>{openings.heading}</Heading>
          {openings.items.length ? (
            <ul className="mt-10 border-t border-ink/20">
              {openings.items.map((vacancy, i) => (
                <li key={`${vacancy.role}-${i}`} className="border-b border-ink/20 py-8">
                  <h3 className="font-display text-[clamp(1.4rem,1.15rem+0.9vw,1.9rem)] font-medium leading-tight">
                    {i + 1}. {vacancy.role}
                    {vacancy.openings ? <span className="ml-3 align-middle font-mono text-register font-normal text-cinnabar">{vacancy.openings}</span> : null}
                  </h3>
                  {vacancy.pay ? (
                    <p className="mt-2 font-mono text-register text-ink">
                      <span className="text-ink-faint">{openings.labels.pay}: </span>
                      {vacancy.pay}
                    </p>
                  ) : null}
                  {vacancy.location ? (
                    <p className="mt-2 font-mono text-register text-cinnabar">
                      <span className="text-ink-faint">{t.location}: </span>
                      {vacancy.location}
                    </p>
                  ) : null}
                  {vacancy.description ? <p className="mt-4 max-w-[60ch] text-[1.125rem] leading-[1.65] text-ink-soft">{vacancy.description}</p> : null}
                  {([
                    [openings.labels.responsibilities, vacancy.responsibilities],
                    [openings.labels.qualifications, vacancy.qualifications],
                    [openings.labels.whyJoin, vacancy.whyJoin],
                  ] as const).map(([label, list]) =>
                    list?.length ? (
                      <div key={label} className="mt-6 max-w-[64ch]">
                        <p className="font-mono text-register text-cinnabar">{label}</p>
                        <ul className="mt-2 list-disc space-y-1.5 pl-5 text-[1.0625rem] leading-relaxed text-ink-soft marker:text-cinnabar/60">
                          {list.map((line) => (
                            <li key={line}>{line}</li>
                          ))}
                        </ul>
                      </div>
                    ) : null,
                  )}
                  <a
                    href={mailto(vacancy.role)}
                    className="mt-6 inline-flex min-h-12 items-center justify-center bg-cinnabar px-6 py-3 text-[1.0625rem] leading-tight text-leaf transition-colors duration-150 hover:bg-cinnabar-deep"
                  >
                    {t.apply}
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-8 max-w-[56ch] border-l-2 border-cinnabar/60 pl-5 text-lede text-ink">{openings.empty}</p>
          )}
        </Leaf>

        <Leaf id="locations" label={locations.heading} question={ui.steps.where}>
          <Heading>{locations.heading}</Heading>
          <Prose>
            {locations.body.map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
          </Prose>
        </Leaf>

        <Leaf id="apply" label={apply.label} question={ui.steps.apply}>
          <Heading>{apply.heading}</Heading>
          <Prose>
            <p>{apply.body}</p>
            <p className="font-mono text-register text-ink">{apply.subjectNote}</p>
          </Prose>
          <a
            href={mailto()}
            className="mt-6 inline-block break-all text-[1.0625rem] text-cinnabar underline decoration-cinnabar/35 decoration-1 underline-offset-[6px] transition-colors hover:decoration-cinnabar"
          >
            {fill(t.write, { email })}
          </a>
          <p className="mt-4 font-mono text-register text-ink-soft">
            {apply.enquiries.label}:{" "}
            <a href={`tel:${apply.enquiries.phone.replace(/\s/g, "")}`} className="text-ink underline decoration-ink/25 underline-offset-4">
              {apply.enquiries.phone}
            </a>
          </p>
        </Leaf>
      </main>
      <Footer />
    </>
  );
}
