import type { CSSProperties } from "react";
import { Button, Leaf } from "./primitives";
import { HeroBanners, type Banner } from "./hero-banners";
import { getContent } from "@/i18n/content";

/**
 * The first leaf: the Foundation's headline, then its banners — six parts of
 * the work, each in a line a visitor reads in a few seconds over its own
 * photographs. Each banner carries its own words, figures, link and
 * photographs in content/home.ts, so the Foundation edits each in one place.
 */
export async function Hero() {
  const { home, shared, ui } = await getContent();
  const { hero } = home;
  const { org } = shared;
  const banners = hero.banners as readonly Banner[];

  return (
    <Leaf id="top" label={hero.label} question={ui.steps.glance} innerClassName="!pt-8 md:!pt-10 lg:!pt-12">
      <p className="font-display text-[1.2rem] leading-none text-ink-soft">{org.nameNative}</p>

      <h1 className="mt-4 font-display text-[clamp(2.05rem,1.2rem+2.5vw,3.35rem)] font-medium leading-[1.08] tracking-[-0.012em]">
        {hero.lines.map((line, i) => (
          <span key={line.text} className="inked ink-on-load block" style={{ "--line": i } as CSSProperties}>
            {line.text}
          </span>
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
