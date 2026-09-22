import type { Metadata } from "next";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { Heading, PageHero, Plate, Section } from "@/components/site/primitives";
import { advisors, pageHero, trustees } from "@/content/trustees";

export const metadata: Metadata = {
  title: "Trustees — Acharya Shanti Sagar Foundation",
  description: pageHero.body,
};

function PersonGrid({ people }: { people: readonly { name: string; rank: string; body: string; image: string }[] }) {
  return (
    <ul className="mt-10 grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
      {people.map((person) => (
        <li key={person.name}>
          <Plate src={person.image} alt={person.name} ratio="4 / 5" />
          <h3 className="mt-4 text-xl text-parchment-bright">{person.name}</h3>
          <p className="mt-1 font-sans text-sm text-accent">{person.rank}</p>
          <p className="mt-2 text-lg leading-snug text-parchment/80">{person.body}</p>
        </li>
      ))}
    </ul>
  );
}

export default function TrusteesPage() {
  return (
    <>
      <Header />
      <main>
        <PageHero {...pageHero} />

        <Section id="trustees" gutter="Trustees">
          <Heading>Founder trustees</Heading>
          <PersonGrid people={trustees} />
        </Section>

        <Section id="advisors" gutter="Advisors">
          <Heading>Advisors</Heading>
          <PersonGrid people={advisors} />
        </Section>
      </main>
      <Footer />
    </>
  );
}
