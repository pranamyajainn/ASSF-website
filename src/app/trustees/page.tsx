import type { Metadata } from "next";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { Heading, Leaf, PageHero, PersonGrid, Prose } from "@/components/site/primitives";
import { advisors, pageHero, trustees } from "@/content/trustees";

export const metadata: Metadata = {
  title: "Trustees — Acharya Shanti Sagar Foundation",
  description: pageHero.body,
};

/**
 * Governance, in order: the trustees who carry a named role first, then the
 * founder trustees, then the advisors. The portrait wall keeps the
 * cursor-tilt; the grouping carries the hierarchy, not the photo size.
 */
export default function TrusteesPage() {
  const officeBearers = trustees.filter((t) => t.rank !== "Founder Trustee");
  const founders = trustees.filter((t) => t.rank === "Founder Trustee");

  return (
    <>
      <Header />
      <main>
        <PageHero label="Leadership" {...pageHero} />

        <Leaf id="trustees" label="Trustees">
          <Heading>Founder trustees</Heading>
          <Prose>
            <p>
              {trustees.length} founder trustees. {officeBearers.length} carry a named role —
              Param Samrakshak Margadarshak, Settlor, President, Working President and
              Secretary — and {founders.length} serve as founder trustees.
            </p>
          </Prose>
          <div className="bleed-margin">
            <PersonGrid people={officeBearers} columns={5} />
            <PersonGrid people={founders} columns={5} className="mt-14 border-t border-ink/15 pt-12" />
          </div>
        </Leaf>

        <Leaf id="advisors" label="Advisors">
          <Heading>Advisors</Heading>
          <div className="bleed-margin">
            <PersonGrid people={advisors} columns={5} />
          </div>
        </Leaf>
      </main>
      <Footer />
    </>
  );
}
