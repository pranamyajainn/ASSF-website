import type { Metadata } from "next";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { Heading, PageHero, PersonGrid, Section } from "@/components/site/primitives";
import { advisors, pageHero, trustees } from "@/content/trustees";

export const metadata: Metadata = {
  title: "Trustees — Acharya Shanti Sagar Foundation",
  description: pageHero.body,
};

export default function TrusteesPage() {
  return (
    <>
      <Header />
      <main>
        <PageHero {...pageHero} />

        <Section id="trustees" gutter="Trustees">
          <Heading>Founder trustees</Heading>
          <PersonGrid people={trustees} columns={4} />
        </Section>

        <Section id="advisors" gutter="Advisors">
          <Heading>Advisors</Heading>
          <PersonGrid people={advisors} columns={3} />
        </Section>
      </main>
      <Footer />
    </>
  );
}
