import Image from "next/image";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { Button, Heading, Leaf, Lede, PersonGrid } from "@/components/site/primitives";
import { getContent } from "@/i18n/content";
import { pageMetadata } from "@/i18n/metadata";

export async function generateMetadata() {
  const { trustees } = await getContent();
  return pageMetadata("guidingLights", "/our-guiding-lights", trustees.pageHero.body);
}

/** Our Guiding Lights (it replaces Trustees), after the Foundation's page designs (Nov 2026). */
export default async function GuidingLightsPage() {
  const content = await getContent();
  const { advisors, advisory, board, pageHero, team, trustees } = content.trustees;
  const t = content.ui.trustees;
  const profile = { open: t.readProfile, close: t.closeProfile };
  return (
    <>
      <Header />
      <main id="main">
        <Leaf id="top" label={pageHero.label} question={pageHero.question} innerClassName="!pt-10 md:!pt-14 lg:!pt-16">
          <div className="bleed-margin grid items-center gap-x-10 gap-y-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
            <div className="min-w-0">
              <p className="font-display text-[1.2rem] text-ink">{pageHero.eyebrow}</p>
              <h1 className="inked ink-on-load mt-2 text-balance font-display text-title font-medium tracking-[-0.015em]">
                {pageHero.title}
                <span className="text-cinnabar" aria-hidden="true">
                  {" "}॥
                </span>
              </h1>
              <p className="mt-6 max-w-[52ch] text-[1.125rem] leading-[1.65] text-ink">{pageHero.body}</p>
            </div>
            {/* The first eight portraits, arched, in two staggered rows. */}
            <ul aria-hidden="true" className="grid grid-cols-4 gap-2.5">
              {trustees.slice(0, 8).map((person, i) => (
                <li key={person.name} className={`relative aspect-[4/5] overflow-hidden rounded-t-full rounded-b-md bg-leaf-deep ${i % 2 ? "translate-y-4" : ""}`}>
                  <Image src={person.image} alt="" fill sizes="(min-width: 1024px) 8rem, 22vw" className="object-cover" />
                </li>
              ))}
            </ul>
          </div>
        </Leaf>

        <Leaf id="trustees" label={board.label} question={board.question}>
          <Heading>{board.heading}</Heading>
          <Lede>{board.lede}</Lede>
          <div className="bleed-margin">
            <PersonGrid people={trustees} columns={3} side profileLabels={profile} />
          </div>
        </Leaf>

        <Leaf id="advisors" label={advisory.label} question={advisory.question}>
          <Heading>{advisory.heading}</Heading>
          <Lede>{advisory.lede}</Lede>
          <div className="bleed-margin">
            <PersonGrid people={advisors} columns={3} side profileLabels={profile} />
          </div>
        </Leaf>

        <Leaf id="team" label={team.label} question={team.question}>
          <Heading>{team.heading}</Heading>
          <div className="bleed-margin mt-8 grid items-start gap-x-10 gap-y-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
            <div className="relative aspect-[1380/839] overflow-hidden rounded-lg bg-leaf-deep">
              <Image src={team.image.src} alt={team.image.alt} fill sizes="(min-width: 1024px) 36rem, 92vw" className="object-cover" />
            </div>
            <ul className="divide-y divide-ink/15 border-b border-ink/15">
              {team.members.map((member) => (
                <li key={member.name} className="py-4 first:pt-0">
                  <h3 className="font-display text-[1.3rem] font-semibold leading-tight text-ink">{member.name}</h3>
                  <p className="mt-1 font-mono text-[0.75rem] text-cinnabar">{member.rank}</p>
                  <p className="mt-2 text-[1.02rem] leading-snug text-ink-soft">{member.body}</p>
                </li>
              ))}
            </ul>
          </div>
          <p className="bleed-margin mt-8 rounded-xl border border-leaf-edge/70 bg-leaf-deep/70 px-6 py-6 text-[1.1rem] leading-relaxed text-ink">{team.thanks}</p>
          <div className="mt-14 text-center">
            <p className="font-display text-[clamp(1.4rem,1.15rem+0.8vw,1.85rem)] font-semibold text-ink">{team.invite}</p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              {team.buttons.map((button, i) => (
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
