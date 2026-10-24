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
 * The Foundation's open positions, each with its role, place and a few
 * lines, and one way to apply: an email to the Foundation, the position
 * already in its subject line. With none open, the page says so plainly.
 * Vacancies are added and removed in the site editor.
 */
export default async function CareersPage() {
  const { careers, shared, ui } = await getContent();
  const { apply, openings, pageHero } = careers;
  const t = ui.careers;
  const email = shared.org.email;
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
              { id: "apply", question: ui.steps.apply },
            ],
          }}
          {...pageHero}
        />

        <Leaf id="openings" label={openings.label} question={ui.steps.open}>
          <Heading>{openings.heading}</Heading>
          {openings.items.length ? (
            <ul className="mt-10 border-t border-ink/20">
              {openings.items.map((vacancy, i) => (
                <li key={`${vacancy.role}-${i}`} className="border-b border-ink/20 py-8">
                  <h3 className="font-display text-[clamp(1.4rem,1.15rem+0.9vw,1.9rem)] font-medium leading-tight">{vacancy.role}</h3>
                  {vacancy.location ? (
                    <p className="mt-2 font-mono text-register text-cinnabar">
                      <span className="text-ink-faint">{t.location}: </span>
                      {vacancy.location}
                    </p>
                  ) : null}
                  {vacancy.description ? <p className="mt-4 max-w-[60ch] text-[1.125rem] leading-[1.65] text-ink-soft">{vacancy.description}</p> : null}
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

        <Leaf id="apply" label={apply.label} question={ui.steps.apply}>
          <Heading>{apply.heading}</Heading>
          <Prose>
            <p>{apply.body}</p>
          </Prose>
          <a
            href={mailto()}
            className="mt-6 inline-block break-all text-[1.0625rem] text-cinnabar underline decoration-cinnabar/35 decoration-1 underline-offset-[6px] transition-colors hover:decoration-cinnabar"
          >
            {fill(t.write, { email })}
          </a>
        </Leaf>
      </main>
      <Footer />
    </>
  );
}
