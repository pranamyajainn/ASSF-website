import type { CSSProperties } from "react";
import { Button, Leaf } from "./primitives";
import { HeroReel } from "./hero-reel";
import { getContent } from "@/i18n/content";

/**
 * The first leaf. The headline is the Foundation's approved one; on its own
 * it could belong to any charity, so each clause carries an interlinear
 * gloss — the figure that makes it true — the way a commented manuscript
 * writes its gloss between the lines of the main text. The lines ink in one
 * after another on load, as lampblack is rubbed across an incised leaf.
 *
 * Beside it, in the margin and off the edge of the page, the work itself in
 * the Foundation's own photographs, one after another — in a frame the size
 * of a single plate, not a banner across the page. On narrow screens the
 * pictures come straight after the headline, before the paragraph, so a
 * first-time visitor sees what the Foundation does on the first screen.
 */
export async function Hero() {
  const { home, shared, ui } = await getContent();
  const { hero } = home;
  const { org } = shared;
  return (
    <Leaf id="top" label={hero.label} innerClassName="!pt-10 md:!pt-14 lg:!pt-20">
      <div className="xl:grid xl:grid-cols-[minmax(0,1fr)_4rem] xl:gap-x-12">
        <div className="min-w-0 xl:col-start-1">
          <p className="font-display text-[1.35rem] leading-none text-ink-soft">{org.nameNative}</p>

          <h1 className="mt-7 font-display text-display font-medium tracking-[-0.015em]">
            {hero.lines.map((line, i) => (
              <span key={line.text} className="block">
                <span
                  className="inked ink-on-load inline-block text-balance"
                  style={{ "--line": i } as CSSProperties}
                >
                  {line.text}
                </span>
                <small className="mb-5 mt-2.5 flex max-w-[44ch] items-baseline gap-3 font-mono text-register font-normal tracking-normal text-cinnabar sm:mb-6">
                  <span aria-hidden="true" className="h-px w-5 shrink-0 -translate-y-[0.3em] bg-cinnabar/60" />
                  {line.gloss}
                </small>
              </span>
            ))}
          </h1>
        </div>

        <div className="mb-8 mt-2 max-w-[26rem] xl:col-start-2 xl:row-span-2 xl:row-start-1 xl:mb-0 xl:mt-[3.1rem] xl:max-w-none xl:self-start xl:bleed-right">
          <HeroReel slides={hero.slides} strings={ui.home.reel} />
        </div>

        <div className="min-w-0 xl:col-start-1">
          <p className="max-w-[46ch] text-lede text-ink xl:mt-4">{hero.body}</p>

          <div className="mt-9 flex flex-wrap gap-3">
            <Button href={hero.primary.href}>{hero.primary.label}</Button>
            <Button href={hero.secondary.href} variant="outline">
              {hero.secondary.label}
            </Button>
          </div>

          <p className="mt-9 font-mono text-register text-ink-faint">{hero.registration}</p>
        </div>
      </div>
    </Leaf>
  );
}
