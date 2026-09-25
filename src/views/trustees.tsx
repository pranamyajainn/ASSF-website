import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { Heading, Leaf, PageHero, PersonGrid, Prose } from "@/components/site/primitives";
import { getContent } from "@/i18n/content";
import { pageMetadata } from "@/i18n/metadata";
import { fill } from "@/i18n/ui";
import { trustees as sourceTrustees } from "@/content/trustees";

export async function generateMetadata() {
  const { trustees } = await getContent();
  return pageMetadata("trustees", "/trustees", trustees.pageHero.body);
}

/**
 * Governance, in order: the trustees who carry a named role first, then the
 * founder trustees, then the advisors. The portrait wall keeps the
 * cursor-tilt; the grouping carries the hierarchy, not the photo size.
 */
export default async function TrusteesPage() {
  const content = await getContent();
  const { ui } = content;
  const { advisors, pageHero, trustees } = content.trustees;
  const t = content.ui.trustees;
  // Grouped by the English rank, so the grouping holds in every edition.
  const officeBearers = trustees.filter((_, i) => sourceTrustees[i].rank !== "Founder Trustee");
  const founders = trustees.filter((_, i) => sourceTrustees[i].rank === "Founder Trustee");

  const profile = { open: t.readProfile, close: t.closeProfile };

  return (
    <>
      <Header />
      <main id="main">
        <PageHero
          question={ui.steps.glance}
          thread={{
            title: ui.steps.thread,
            items: [
              { id: "trustees", question: ui.steps.who },
              { id: "advisors", question: ui.steps.advises },
            ],
          }}
          label={t.heroLabel}
          {...pageHero}
        />

        <Leaf id="trustees" label={t.trusteesLabel} question={ui.steps.who}>
          <Heading>{t.trusteesHeading}</Heading>
          <Prose>
            <p>
              {fill(t.intro, {
                total: trustees.length,
                named: officeBearers.length,
                founders: founders.length,
              })}
            </p>
          </Prose>
          <div className="bleed-margin">
            <PersonGrid people={officeBearers} columns={5} profileLabels={profile} />
            <PersonGrid people={founders} columns={5} className="mt-14 border-t border-ink/15 pt-12" profileLabels={profile} />
          </div>
        </Leaf>

        <Leaf id="advisors" label={t.advisorsLabel} question={ui.steps.advises}>
          <Heading>{t.advisorsHeading}</Heading>
          <div className="bleed-margin">
            <PersonGrid people={advisors} columns={5} profileLabels={profile} />
          </div>
        </Leaf>
      </main>
      <Footer />
    </>
  );
}
