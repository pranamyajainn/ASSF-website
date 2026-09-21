import Image from "next/image";
import { Button, Container } from "./primitives";
import { hero, heroStats } from "@/content/home";

/**
 * The hero panel is drawn as a folio: parchment ground, a verse held faintly
 * in the leaf, and the two binding holes a tadpatra is strung through. The
 * photograph sits behind it and shows only at the bound edge.
 */
export function Hero() {
  return (
    <section id="top">
      <Container>
        <div className="relative isolate overflow-hidden">
          <Image
            src="/images/hero-acharya.png"
            alt=""
            aria-hidden="true"
            fill
            priority
            sizes="100vw"
            className="object-cover object-left"
          />

          <div className="relative ml-8 bg-gradient-to-br from-parchment-bright via-parchment-dim to-parchment-shade sm:ml-[4.5rem] lg:ml-[6rem]">
            {/* Binding holes. */}
            <span
              data-ornament
              aria-hidden="true"
              className="absolute right-[22%] top-1/2 hidden size-6 -translate-y-1/2 rounded-full bg-ink/85 lg:block"
            />
            <span
              data-ornament
              aria-hidden="true"
              className="absolute right-[6%] top-1/2 hidden size-6 -translate-y-1/2 rounded-full bg-ink/85 lg:block"
            />

            {/* The verse held in the leaf. */}
            <div
              data-ornament
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 right-0 hidden w-[52%] items-center px-10 lg:flex"
            >
              <p className="text-center text-4xl leading-relaxed text-ink/[0.08]">
                {hero.watermark}
              </p>
            </div>

            <div className="relative max-w-[42rem] px-6 py-12 sm:px-12 sm:py-16 lg:py-20">
              <p className="text-base text-ink/70">{hero.eyebrow}</p>
              <h1 className="mt-4 text-5xl leading-[1.08] text-ink sm:text-6xl lg:text-7xl">
                {hero.title.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </h1>
              <p className="mt-7 max-w-[40ch] text-lg leading-relaxed text-ink/85 sm:text-xl">
                {hero.body}
              </p>
              <div className="mt-9 flex flex-wrap gap-4">
                <Button href={hero.primary.href}>{hero.primary.label}</Button>
                <Button href={hero.secondary.href} variant="outline">
                  {hero.secondary.label}
                </Button>
              </div>
            </div>
          </div>
        </div>

        <dl className="grid gap-x-10 gap-y-7 border-b border-parchment/15 py-10 sm:grid-cols-2 lg:grid-cols-3">
          {heroStats.map((stat) => (
            <div key={stat.figure} className="flex items-baseline gap-4">
              <dt className="shrink-0 text-4xl text-gold">{stat.figure}</dt>
              <dd className="max-w-[24ch] text-lg leading-snug text-parchment/85">
                {stat.note}
              </dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}
