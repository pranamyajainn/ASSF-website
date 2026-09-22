import type { Metadata } from "next";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import {
  Heading,
  Lede,
  PageHero,
  Plate,
  Section,
  StepList,
} from "@/components/site/primitives";
import { method, pageHero, projects, shantiStambh } from "@/content/rural-infrastructure";

export const metadata: Metadata = {
  title: "Rural Infrastructure — Acharya Shanti Sagar Foundation",
  description: pageHero.body,
};

export default function RuralInfrastructurePage() {
  return (
    <>
      <Header />
      <main>
        <PageHero {...pageHero} />

        <Section id="projects" gutter={projects.gutter}>
          <Heading>{projects.heading}</Heading>
          <ul className="mt-10 grid gap-x-10 gap-y-14 sm:grid-cols-2">
            {projects.items.map((project) => (
              <li key={project.name}>
                <Plate src={project.image} alt={project.name} ratio="4 / 3" />
                <h3 className="mt-4 text-2xl text-ink">{project.name}</h3>
                <p className="mt-2 text-lg leading-relaxed text-ink/85">{project.body}</p>
              </li>
            ))}
          </ul>
        </Section>

        <Section id="shanti-stambh" gutter={shantiStambh.gutter}>
          <Heading>{shantiStambh.heading}</Heading>
          {shantiStambh.paragraphs.map((p) => (
            <Lede key={p.slice(0, 24)}>{p}</Lede>
          ))}
          <Plate
            className="mt-10 max-w-md"
            src={shantiStambh.image}
            alt="The Shanti Stambh memorial at Yarnal."
            ratio="3 / 4"
          />
        </Section>

        <Section id="method" gutter={method.gutter}>
          <Heading>{method.heading}</Heading>
          <StepList steps={method.steps} />
        </Section>
      </main>
      <Footer />
    </>
  );
}
