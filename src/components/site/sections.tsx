import Image from "next/image";
import {
  Container,
  EditorialNote,
  Heading,
  InlineLink,
  Lede,
  Plate,
  Section,
  StatGrid,
} from "./primitives";
import { ledger, mission, pillarsIntro, ruralTeaser, communityTeaser, sites } from "@/content/home";
import { pillars } from "@/content/shared";

export function PillarsIntro() {
  return (
    <Section id="pillars" gutter={pillarsIntro.gutter}>
      <Heading>{pillarsIntro.heading}</Heading>
      <Lede>{pillarsIntro.body}</Lede>

      <ul className="mt-10 grid gap-x-10 gap-y-10 sm:grid-cols-3">
        {pillars.map((pillar) => (
          <li key={pillar.slug} className="border-t border-parchment/25 pt-5">
            <h3 className="text-2xl text-parchment-bright">{pillar.label}</h3>
            <p className="mt-1 font-sans text-sm text-accent">{pillar.tagline}</p>
            <p className="mt-3 text-lg leading-snug text-parchment/80">{pillar.body}</p>
            <InlineLink href={`/${pillar.slug}`}>Explore {pillar.label}</InlineLink>
          </li>
        ))}
      </ul>
    </Section>
  );
}

export function Mission() {
  return (
    <Section id="mission" folio={mission.marker} gutter={mission.gutter}>
      <Heading>{mission.heading}</Heading>
      {mission.paragraphs.map((p) => (
        <Lede key={p.slice(0, 24)}>{p}</Lede>
      ))}
      <Plate
        className="mt-12 max-w-xl"
        src={mission.plate.src}
        alt="Foundation staff assessing a manuscript collection in the field."
        caption={mission.plate.caption}
        ratio="4 / 3"
      />
      <InlineLink href={mission.link.href}>{mission.link.label}</InlineLink>
    </Section>
  );
}

export function Ledger() {
  return (
    <Section id="ledger" gutter={ledger.gutter}>
      <Heading>{ledger.heading}</Heading>
      <Lede>{ledger.intro}</Lede>
      <StatGrid metrics={ledger.metrics} />
      <InlineLink href={ledger.link.href}>{ledger.link.label}</InlineLink>
    </Section>
  );
}

function StatusBadge({ children }: { children: string }) {
  return (
    <span className="shrink-0 border border-ink/35 px-4 py-2 font-sans text-sm text-ink/80">
      {children}
    </span>
  );
}

export function Sites() {
  return (
    <Section id="sites" gutter={sites.gutter}>
      <Heading>{sites.heading}</Heading>

      <div className="mt-10 space-y-10">
        {sites.items.map((site) => (
          <article
            key={site.name}
            className="bg-gradient-to-br from-parchment-dim to-parchment-shade shadow-[0.5rem_0.5rem_0_rgba(20,17,11,0.22)]"
          >
            <div className="relative aspect-[16/7] w-[62%] sm:w-[52%]">
              <Image
                src={site.image}
                alt={`${site.name} — conservation site`}
                fill
                sizes="(min-width: 640px) 45vw, 70vw"
                className="object-cover"
              />
            </div>

            <div className="px-6 py-7 sm:px-9 sm:py-8">
              <div className="flex flex-wrap items-baseline gap-x-5 gap-y-3">
                <h3 className="text-3xl text-ink sm:text-4xl">{site.name}</h3>
                <p className="text-lg text-ink/70">{site.place}</p>
                <div className="ml-auto">
                  <StatusBadge>{site.status}</StatusBadge>
                </div>
              </div>
              <p className="mt-1 font-sans text-base text-ink/60">{site.institution}</p>

              <div className="mt-6 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-ink/20 pt-6 sm:w-1/2">
                <div>
                  <dt className="font-sans text-sm text-ink/75">Manuscripts</dt>
                  <dd className="mt-1 text-xl text-ink">{site.figures.manuscripts ?? "—"}</dd>
                </div>
                <div>
                  <dt className="font-sans text-sm text-ink/75">Folios</dt>
                  <dd className="mt-1 text-xl text-ink">{site.figures.folios ?? "—"}</dd>
                </div>
              </div>

              <p className="mt-6 text-lg text-ink/80">{site.footnote}</p>
              {site.altName ? (
                <p className="mt-3 max-w-[52ch] font-sans text-sm leading-relaxed text-rust">
                  {site.altName}
                </p>
              ) : null}
            </div>
          </article>
        ))}
      </div>
    </Section>
  );
}

export function RuralTeaser() {
  return (
    <Section id="rural" gutter={ruralTeaser.gutter}>
      <Heading>{ruralTeaser.heading}</Heading>
      <Lede>{ruralTeaser.body}</Lede>

      <ul className="mt-10 grid gap-x-8 gap-y-10 sm:grid-cols-3">
        {ruralTeaser.highlights.map((item) => (
          <li key={item.name}>
            <Plate src={item.image} alt={item.name} ratio="4 / 3" />
            <h3 className="mt-4 text-xl text-parchment-bright">{item.name}</h3>
            <p className="mt-2 text-lg leading-snug text-parchment/80">{item.detail}</p>
          </li>
        ))}
      </ul>
      <InlineLink href={ruralTeaser.link.href}>{ruralTeaser.link.label}</InlineLink>
    </Section>
  );
}

export function CommunityTeaser() {
  return (
    <Section id="community" gutter={communityTeaser.gutter}>
      <Heading>{communityTeaser.heading}</Heading>
      <Lede>{communityTeaser.body}</Lede>

      <dl className="mt-10 grid gap-x-10 gap-y-10 sm:grid-cols-3">
        {communityTeaser.highlights.map((item) => (
          <div key={item.label} className="border-t border-parchment/25 pt-4">
            <dt className="font-sans text-base text-parchment/90">{item.label}</dt>
            <dd className="mt-4">
              <span className="text-3xl text-gold">{item.stat}</span>
              <p className="mt-3 max-w-[30ch] text-lg leading-snug text-parchment/80">{item.note}</p>
            </dd>
          </div>
        ))}
      </dl>
      <InlineLink href={communityTeaser.link.href}>{communityTeaser.link.label}</InlineLink>
    </Section>
  );
}

export { Container, EditorialNote };
