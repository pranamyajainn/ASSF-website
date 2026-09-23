import type { Metadata } from "next";
import Image from "next/image";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { Heading, Leaf, PageHero, Plate, Prose, Verses } from "@/components/site/primitives";
import { method, pageHero, projects, shantiStambh } from "@/content/rural-infrastructure";

export const metadata: Metadata = {
  title: "Rural Infrastructure — Acharya Shanti Sagar Foundation",
  description: pageHero.body,
};

export default function RuralInfrastructurePage() {
  const [lead, ...rest] = projects.items;

  return (
    <>
      <Header />
      <main>
        <PageHero
          label="Rural infrastructure"
          {...pageHero}
          plate={{
            src: "/images/rural/samudaya-bhavan-3-completed.jpeg",
            alt: "The completed Samudaya Bhavan at Yarnal: long, whitewashed wings with blue railings around a paved courtyard.",
            caption: "The completed Samudaya Bhavan, Yarnal.",
            position: "40% 50%",
          }}
        />

        <Leaf id="projects" label={projects.label}>
          <Heading>{projects.heading}</Heading>

          {/* The one project photographed at every stage leads, as a
              sequence read left to right: ground, walls, a building in use. */}
          <article className="bleed-margin mt-12">
            <h3 className="font-display text-[clamp(1.7rem,1.3rem+1.3vw,2.3rem)] font-medium text-ink">
              {lead.name}
            </h3>
            <p className="mt-3 max-w-[60ch] text-[1.0625rem] leading-relaxed text-ink-soft">{lead.body}</p>
            <ol className="mt-8 grid gap-4 sm:grid-cols-3">
              {lead.images.map((img) => (
                <li key={img.src}>
                  <Plate
                    src={img.src}
                    alt={img.alt}
                    caption={img.caption}
                    ratio="4 / 3"
                    sizes="(min-width: 640px) 30vw, 100vw"
                  />
                </li>
              ))}
            </ol>
          </article>

          <ul className="bleed-margin mt-16 border-t border-ink/20">
            {rest.map((project) => (
              <li
                key={project.name}
                className="grid gap-x-12 gap-y-6 border-b border-ink/20 py-10 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]"
              >
                <div>
                  <h3 className="font-display text-[1.7rem] font-medium leading-tight text-ink">
                    {project.name}
                  </h3>
                  <p className="mt-3 max-w-[48ch] text-[1.0625rem] leading-relaxed text-ink-soft">
                    {project.body}
                  </p>
                </div>
                {project.images.map((img) => (
                  <Plate
                    key={img.src}
                    src={img.src}
                    alt={img.alt}
                    caption={img.caption}
                    ratio="4 / 3"
                    sizes="(min-width: 768px) 35vw, 100vw"
                  />
                ))}
              </li>
            ))}
          </ul>
        </Leaf>

        <Leaf id="shanti-stambh" label={shantiStambh.label}>
          <Heading>{shantiStambh.heading}</Heading>
          <Prose>
            {/* A small drawing, shown at its own size in the margin. */}
            <figure data-plate className="float-right mb-4 ml-6 w-[6.5rem] lg:-mr-[16rem] lg:ml-0 lg:w-[13rem]">
              <Image
                src={shantiStambh.image}
                alt="Drawing of the Shanti Stambh: a pillar on a stepped base, a standing figure within its upper frame, a wheel at the top."
                width={134}
                height={411}
                className="h-auto w-[6.5rem] mix-blend-multiply lg:w-[8.4rem]"
              />
              <figcaption className="mt-3 font-mono text-register text-ink-faint">
                {shantiStambh.caption}
              </figcaption>
            </figure>
            {shantiStambh.paragraphs.map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
          </Prose>
        </Leaf>

        <Leaf id="method" label={method.label}>
          <Heading>{method.heading}</Heading>
          <Verses steps={method.steps} />
        </Leaf>
      </main>
      <Footer />
    </>
  );
}
