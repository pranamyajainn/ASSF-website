import type { CSSProperties } from "react";
import Image from "next/image";
import {
  Gloss,
  Heading,
  InlineLink,
  Leaf,
  Lede,
  Plate,
  Prose,
  Register,
} from "./primitives";
import { LeafPanels } from "./leaf-panels";
import { ScaleLines } from "./scale-lines";
import { getContent } from "@/i18n/content";
import { fill } from "@/i18n/ui";

/**
 * Why it cannot wait. The argument in words, then the evidence at full
 * width: a manuscript photographed before treatment, a loss torn through its
 * lines, its accession slip beside it. The only plate on the page that is
 * allowed to run past the margin to the edge of the screen.
 */
export async function Mission() {
  const { home } = await getContent();
  const { mission } = home;
  return (
    <Leaf id="mission" label={mission.label}>
      <Heading>{mission.heading}</Heading>
      <p className="mt-7 max-w-[34ch] font-display text-[clamp(1.45rem,1.15rem+1.1vw,2rem)] leading-[1.3] text-ink">
        {mission.lede}
      </p>
      <Prose className="mt-8">
        <Gloss label={mission.gloss.label}>{mission.gloss.text}</Gloss>
        {mission.paragraphs.map((p) => (
          <p key={p.slice(0, 24)}>{p}</p>
        ))}
      </Prose>

      <figure data-plate className="bleed-right mt-14">
        <div className="relative aspect-[4/3] overflow-hidden bg-leaf-deep sm:aspect-[16/9] lg:aspect-[21/10]">
          <Image
            src={mission.plate.src}
            alt={mission.plate.alt}
            fill
            sizes="100vw"
            className="object-cover object-[50%_62%]"
          />
        </div>
        <figcaption className="mt-3 max-w-[60ch] pr-5 font-mono text-register text-ink-faint">
          {mission.plate.caption}
        </figcaption>
      </figure>

      <InlineLink href={mission.link.href}>{mission.link.label}</InlineLink>
    </Leaf>
  );
}

export async function PillarsIntro() {
  const { home, shared, ui, href } = await getContent();
  const { pillarsIntro } = home;
  return (
    <Leaf id="pillars" label={pillarsIntro.label}>
      <Heading>{pillarsIntro.heading}</Heading>
      <Lede>{pillarsIntro.body}</Lede>
      <LeafPanels
        panels={shared.pillars.map((pillar, i) => ({
          key: pillar.slug,
          number: String(i + 1).padStart(2, "0"),
          title: pillar.label,
          tagline: pillar.tagline,
          body: pillar.body,
          note: i === 0 ? pillarsIntro.principal : undefined,
          link: { label: fill(ui.common.explore, { name: pillar.label }), href: href(`/${pillar.slug}`) },
        }))}
      />
    </Leaf>
  );
}

/** The register of work done, then the same quantities drawn to scale. */
export async function Ledger() {
  const { home } = await getContent();
  const { ledger, scale } = home;
  return (
    <Leaf id="ledger" label={ledger.label}>
      <Heading>{ledger.heading}</Heading>
      <Prose>
        <p>{ledger.intro}</p>
      </Prose>
      <Register entries={ledger.metrics} />

      <div className="mt-20">
        <Heading as="h3" size="sub">
          {scale.heading}
        </Heading>
        <p className="mt-5 max-w-[30ch] text-lede text-ink">
          {scale.statement[0]}{" "}
          <span className="text-cinnabar">{scale.statement[1]}</span>
        </p>
        <ScaleLines lines={scale.lines} note={scale.note} />
        <InlineLink href={scale.link.href}>{scale.link.label}</InlineLink>
      </div>
    </Leaf>
  );
}

/**
 * The two other pillars, as the two facing pages of an opened bundle: the
 * gutter between them carries the string-holes. They are presented as a
 * pair because they are one kind of work — serving the present — beside the
 * conservation work that leads the page.
 */
export async function Spread() {
  const { home, ui } = await getContent();
  const { ruralTeaser, communityTeaser } = home;
  return (
    <Leaf id="community" label={ui.home.spreadLabel}>
      <div className="bleed-margin grid gap-y-16 lg:grid-cols-[minmax(0,1fr)_4.5rem_minmax(0,1fr)]">
        <div id="rural" className="min-w-0 scroll-mt-6">
          <p className="font-mono text-register text-cinnabar">{ruralTeaser.label}</p>
          <Heading className="mt-3" size="sub">
            {ruralTeaser.heading}
          </Heading>
          <p className="mt-5 max-w-[48ch] text-[1.0625rem] leading-relaxed text-ink-soft">
            {ruralTeaser.body}
          </p>
          <div className="mt-8 grid grid-cols-2 gap-3">
            {ruralTeaser.sequence.map((step) => (
              <Plate
                key={step.src}
                src={step.src}
                alt={step.alt}
                caption={step.caption}
                ratio="4 / 3"
                sizes="(min-width: 1024px) 20vw, 50vw"
              />
            ))}
          </div>
          <dl className="mt-8 border-t border-ink/15">
            {ruralTeaser.highlights.map((item) => (
              <div key={item.name} className="border-b border-ink/15 py-3.5">
                <dt className="font-display text-[1.15rem] font-medium text-ink">{item.name}</dt>
                <dd className="mt-1 text-[1rem] leading-snug text-ink-soft">{item.detail}</dd>
              </div>
            ))}
          </dl>
          <InlineLink href={ruralTeaser.link.href}>{ruralTeaser.link.label}</InlineLink>
        </div>

        {/* The gutter of the opened bundle: the fold, and the two string-holes. */}
        <div
          data-ornament
          aria-hidden="true"
          className="relative hidden lg:block"
          style={{ "--hole-ground": "var(--color-leaf)" } as CSSProperties}
        >
          <span className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-ink/15" />
          <span className="string-hole absolute left-1/2 top-[28%] -translate-x-1/2" />
          <span className="string-hole absolute left-1/2 top-[68%] -translate-x-1/2" />
        </div>

        <div className="min-w-0">
          <p className="font-mono text-register text-cinnabar">{communityTeaser.label}</p>
          <Heading className="mt-3" size="sub">
            {communityTeaser.heading}
          </Heading>
          <p className="mt-5 max-w-[48ch] text-[1.0625rem] leading-relaxed text-ink-soft">
            {communityTeaser.body}
          </p>
          <Plate
            className="mt-8"
            src={communityTeaser.plate.src}
            alt={communityTeaser.plate.alt}
            caption={communityTeaser.plate.caption}
            ratio="16 / 9"
            sizes="(min-width: 1024px) 40vw, 100vw"
          />
          <dl className="mt-8 border-t border-ink/15">
            {communityTeaser.highlights.map((item) => (
              <div key={item.label} className="grid grid-cols-[1fr_auto] items-baseline gap-x-4 border-b border-ink/15 py-3.5">
                <dt className="text-[1.0625rem] text-ink">{item.label}</dt>
                <dd className="font-display text-[1.6rem] font-medium leading-none tabular-nums text-ink">
                  {item.value}
                </dd>
                <dd className="col-span-2 mt-1.5 font-mono text-register text-ink-faint">{item.note}</dd>
              </div>
            ))}
          </dl>
          <InlineLink href={communityTeaser.link.href}>{communityTeaser.link.label}</InlineLink>
        </div>
      </div>
    </Leaf>
  );
}
