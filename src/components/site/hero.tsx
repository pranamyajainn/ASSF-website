import { Fragment, type CSSProperties } from "react";
import { Button, Leaf } from "./primitives";
import { HeroBanners, type Banner } from "./hero-banners";
import { getContent } from "@/i18n/content";

/**
 * The first leaf. The Foundation's approved headline inks in one clause
 * after another, and directly under it the work is shown the way the
 * Foundation's own hero banners show it: one banner per part of the work —
 * manuscripts, community, villages, and the Acharya whose name it carries —
 * each a single line over its own photographs, so a first-time visitor knows
 * what the Foundation does within a few seconds of landing.
 *
 * The banners are assembled here from the rest of the site: each clause's
 * figure (formerly its interlinear gloss) becomes its banner's proof line,
 * and every photograph keeps the caption and alt text it has elsewhere, so
 * nothing is stated twice in two different ways.
 */
export async function Hero() {
  const { home, about, conservation, community, rural, shared, ui } = await getContent();
  const { hero, lineage } = home;
  const { org } = shared;

  const [cons, comm, vill, acharya] = hero.banners;
  const relief = community.relief.items[1];
  const banners: Banner[] = [
    {
      ...cons,
      key: "conservation",
      fact: hero.lines[0].gloss,
      link: home.mission.link,
      images: [about.pageHero.plate, about.plates.rows[0][0], conservation.illuminated.items[2]],
    },
    {
      ...comm,
      key: "community",
      fact: hero.lines[1].gloss,
      link: home.communityTeaser.link,
      images: [
        about.plates.rows[0][1],
        community.healthcare.images[0],
        { src: relief.image, alt: relief.imageAlt, position: "42% 50%" },
        about.plates.rows[1][2],
      ],
    },
    {
      ...vill,
      key: "rural",
      fact: hero.lines[2].gloss,
      link: home.ruralTeaser.link,
      images: rural.projects.items[0].images,
    },
    {
      ...acharya,
      key: "acharya",
      titleLang: "hi",
      fact: `${lineage.heading}, ${lineage.dates}`,
      link: { label: acharya.link, href: "#lineage" },
      images: [lineage.portrait, about.namesake.album[0]],
    },
  ];

  return (
    <Leaf id="top" label={hero.label} question={ui.steps.glance} innerClassName="!pt-8 md:!pt-10 lg:!pt-12">
      <p className="font-display text-[1.2rem] leading-none text-ink-soft">{org.nameNative}</p>

      <h1 className="mt-4 font-display text-[clamp(2.05rem,1.2rem+2.5vw,3.35rem)] font-medium leading-[1.08] tracking-[-0.012em]">
        {hero.lines.map((line, i) => (
          <Fragment key={line.text}>
            <span className="inked ink-on-load inline-block" style={{ "--line": i } as CSSProperties}>
              {line.text}
            </span>
            {i < hero.lines.length - 1 ? " " : null}
          </Fragment>
        ))}
      </h1>

      <div className="bleed-margin mt-6 lg:mt-7">
        <HeroBanners banners={banners} strings={ui.home.reel} />
      </div>

      <div className="mt-10 lg:mt-12 lg:flex lg:items-end lg:justify-between lg:gap-10">
        <p className="max-w-[46ch] text-lede text-ink">{hero.body}</p>
        <div className="mt-7 flex flex-wrap gap-3 lg:mt-0 lg:shrink-0">
          <Button href={hero.primary.href}>{hero.primary.label}</Button>
          <Button href={hero.secondary.href} variant="outline">
            {hero.secondary.label}
          </Button>
        </div>
      </div>

      <p className="mt-8 font-mono text-register text-ink-faint">{hero.registration}</p>
    </Leaf>
  );
}
