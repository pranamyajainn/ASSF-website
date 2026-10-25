import Image from "next/image";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { Heading, InlineLink, Leaf, Lede, PageHero, PersonGrid, Plate, Prose } from "@/components/site/primitives";
import { VideoLoop } from "@/components/site/video-loop";
import { getContent } from "@/i18n/content";
import { pageMetadata } from "@/i18n/metadata";

/** Literal class names, so Tailwind sees every span it has to generate. */
const SPAN = {
  3: "lg:col-span-3",
  4: "lg:col-span-4",
  5: "lg:col-span-5",
  7: "lg:col-span-7",
} as const;

export async function generateMetadata() {
  const { about } = await getContent();
  return pageMetadata("about", "/about", about.pageHero.body);
}

/**
 * About, in the order of the Foundation's "About Us — Final Website Copy"
 * document: inspiration, the Foundation, what guides it, its leadership,
 * its three areas of work, the work in practice, and what lies ahead.
 */
export default async function AboutPage() {
  const { about, conservation, trustees, ui } = await getContent();
  const { ahead, areas, foundation, inspiration, leadership, mvv, namesake, pageHero, plates, practice } = about;
  const { film } = conservation;
  const t = ui.trustees;
  const profile = { open: t.readProfile, close: t.closeProfile };
  return (
    <>
      <Header />
      <main id="main">
        <PageHero
          question={ui.steps.glance}
          thread={{
            title: ui.steps.thread,
            items: [
              { id: "inspiration", question: ui.steps.whose },
              { id: "foundation", question: ui.steps.who },
              { id: "mvv", question: ui.steps.believe },
              { id: "leadership", question: ui.steps.guides },
              { id: "areas", question: ui.steps.what },
              { id: "practice", question: ui.steps.looks },
              { id: "ahead", question: ui.steps.next },
            ],
          }}
          label={ui.about.heroLabel}
          {...pageHero}
        />

        {/* The namesake, in the archive's own photographs: the ceremony print
            large, two small portraits beside it, then the sutra. */}
        <Leaf id="inspiration" label={inspiration.label} question={ui.steps.whose}>
          <Heading>{inspiration.heading}</Heading>
          <p className="mt-3 font-mono text-register text-ink-faint">{inspiration.dates}</p>
          <Prose className="mt-7">
            {inspiration.paragraphs.map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
          </Prose>

          <div className="bleed-margin mt-14 grid gap-x-8 gap-y-10 lg:grid-cols-[minmax(0,1.75fr)_minmax(0,1fr)]">
            <figure data-plate>
              <div
                className="relative overflow-hidden bg-board-deep outline outline-1 -outline-offset-1 outline-ink/15"
                style={{ aspectRatio: namesake.album[0].ratio }}
              >
                <Image
                  src={namesake.album[0].src}
                  alt={namesake.album[0].alt}
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover grayscale"
                />
              </div>
              <figcaption className="mt-3 max-w-[60ch] font-mono text-register text-ink-faint">
                <span lang="hi" className="block font-serif text-[1.02rem] leading-snug text-ink">
                  {namesake.album[0].captionDeva}
                </span>
                <span className="mt-1.5 block">{namesake.album[0].caption}</span>
              </figcaption>
            </figure>

            <div className="grid grid-cols-2 items-start gap-x-6 gap-y-10 lg:grid-cols-1">
              {namesake.album.slice(1).map((photo) => (
                <Plate
                  key={photo.src}
                  src={photo.src}
                  alt={photo.alt}
                  caption={photo.caption}
                  ratio={photo.ratio}
                  className="max-w-[13rem]"
                  sizes="13rem"
                  imageClassName="object-cover grayscale"
                />
              ))}
            </div>
          </div>

          <figure className="mt-16">
            <blockquote>
              <p lang="sa" className="inked ink-on-scroll font-display text-[clamp(2.2rem,1.2rem+4vw,4.6rem)] font-medium leading-[1.15]">
                {inspiration.quote.deva}
              </p>
            </blockquote>
            <figcaption className="mt-4 text-lede text-ink-soft">
              {inspiration.quote.latin}
              <span aria-hidden="true" className="mx-3 text-cinnabar">
                —
              </span>
              <span className="text-ink">“{inspiration.quote.translation}”</span>
            </figcaption>
          </figure>
        </Leaf>

        <Leaf id="foundation" label={foundation.label} question={ui.steps.who}>
          <Heading>{foundation.heading}</Heading>
          <Prose>
            {foundation.paragraphs.map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
          </Prose>
        </Leaf>

        <Leaf id="mvv" label={mvv.label} question={ui.steps.believe}>
          <Heading>{mvv.heading}</Heading>

          <div className="bleed-margin mt-12 grid gap-x-12 gap-y-10 border-t border-ink/20 pt-10 md:grid-cols-2">
            {[mvv.mission, mvv.vision].map((part) => (
              <div key={part.label} className="min-w-0">
                <p className="font-mono text-register text-cinnabar">{part.label}</p>
                <p className="mt-4 text-pretty font-display text-[clamp(1.3rem,1.1rem+0.7vw,1.7rem)] leading-[1.4] text-ink">{part.body}</p>
              </div>
            ))}
          </div>

          <div className="mt-16">
            <p className="font-mono text-register text-ink-faint">{mvv.valuesLabel}</p>
            <dl className="bleed-margin mt-5 border-t border-ink/20">
              {mvv.values.map((value) => (
                <div
                  key={value.name}
                  className="grid gap-x-10 gap-y-2 border-b border-ink/20 py-6 md:grid-cols-[14rem_minmax(0,1fr)]"
                >
                  <dt>
                    <span lang="sa" className="block font-display text-[2rem] leading-tight text-ink">
                      {value.deva}
                    </span>
                    <span className="mt-1 block font-mono text-register text-cinnabar">
                      {value.name} — {value.meaning}
                    </span>
                  </dt>
                  <dd className="max-w-[56ch] self-center text-[1.125rem] leading-relaxed text-ink-soft">
                    {value.body}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="mt-12 max-w-[60ch] border-l-2 border-orpiment pl-5">
            <p className="font-mono text-register text-cinnabar">{mvv.principle.label}</p>
            <Lede className="mt-3">{mvv.principle.body}</Lede>
          </div>
        </Leaf>

        <Leaf id="leadership" label={leadership.label} question={ui.steps.guides}>
          <Heading>{leadership.heading}</Heading>
          <Prose>
            {leadership.paragraphs.map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
          </Prose>
          <div className="bleed-margin">
            <p className="mt-12 font-mono text-register text-cinnabar">{leadership.trusteesLabel}</p>
            <PersonGrid people={trustees.trustees} columns={5} className="mt-6" profileLabels={profile} />
            <p className="mt-14 border-t border-ink/15 pt-12 font-mono text-register text-cinnabar">{leadership.advisorsLabel}</p>
            <PersonGrid people={trustees.advisors} columns={5} className="mt-6" profileLabels={profile} />
          </div>
          <InlineLink href={leadership.link.href} className="mt-12">
            {leadership.link.label} →
          </InlineLink>
        </Leaf>

        <Leaf id="areas" label={areas.label} question={ui.steps.what}>
          <Heading>{areas.heading}</Heading>
          <Lede>{areas.intro}</Lede>
          <ul className="bleed-margin mt-12 grid gap-x-8 gap-y-12 md:grid-cols-3">
            {areas.items.map((area, i) => (
              <li key={area.title} className="flex min-w-0 flex-col">
                <div className="relative aspect-[4/3] overflow-hidden bg-leaf-deep outline outline-1 -outline-offset-1 outline-ink/15">
                  <Image
                    src={area.image.src}
                    alt={area.image.alt}
                    fill
                    sizes="(min-width: 768px) 30vw, 92vw"
                    className="object-cover"
                    style={{ objectPosition: area.image.position }}
                  />
                </div>
                <p className="mt-5 font-mono text-register text-cinnabar">
                  {String(i + 1).padStart(2, "0")} | {area.title}
                </p>
                <h3 className="mt-2 text-balance font-display text-[clamp(1.4rem,1.2rem+0.6vw,1.75rem)] leading-tight text-ink">{area.tagline}</h3>
                <p className="mt-3 text-[1.0625rem] leading-relaxed text-ink-soft">{area.body}</p>
                <InlineLink href={area.link.href} className="mt-auto pt-5">
                  {area.link.label} →
                </InlineLink>
              </li>
            ))}
          </ul>
        </Leaf>

        <Leaf id="practice" label={practice.label} question={ui.steps.looks}>
          <Heading>{practice.heading}</Heading>
          <dl className="bleed-margin mt-10 grid gap-x-8 gap-y-8 border-t border-ink/20 pt-8 sm:grid-cols-2 lg:grid-cols-4">
            {practice.figures.map((f) => (
              <div key={f.label} className="flex min-w-0 flex-col">
                <dt className="order-2 mt-2 text-[1.0625rem] leading-snug text-ink">{f.label}</dt>
                <dd className="order-1 font-display text-[clamp(2.2rem,1.7rem+1.8vw,3.2rem)] font-medium leading-none tracking-[-0.02em] text-ink">{f.value}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-16">
            <p className="font-mono text-register text-cinnabar">{film.heading}</p>
            <Prose className="mt-3">
              <p>{film.body}</p>
            </Prose>
            <VideoLoop
              className="bleed-margin mt-8"
              youtubeId={film.youtubeId}
              title={film.heading}
              watchLabel={ui.common.watchWithSound}
            />
          </div>

          <div className="bleed-margin mt-16 space-y-10">
            {plates.rows.map((row, r) => (
              <div key={r} className="grid gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-12">
                {row.map((plate) => (
                  <figure key={plate.src} data-plate className={SPAN[plate.span]}>
                    <div
                      className="relative overflow-hidden bg-leaf-deep outline outline-1 -outline-offset-1 outline-ink/15"
                      style={{ aspectRatio: plate.ratio }}
                    >
                      <Image
                        src={plate.src}
                        alt={plate.alt}
                        fill
                        sizes="(min-width: 1024px) 45vw, (min-width: 640px) 50vw, 100vw"
                        className="object-cover"
                        style={{ objectPosition: plate.position }}
                      />
                    </div>
                    <figcaption className="mt-3 font-mono text-register text-ink-faint">
                      <span className="text-ink-soft">{plate.pillar}.</span> {plate.caption}
                    </figcaption>
                  </figure>
                ))}
              </div>
            ))}
          </div>
          <InlineLink href={practice.link.href} className="mt-10">
            {practice.link.label} →
          </InlineLink>
        </Leaf>

        <Leaf id="ahead" label={ahead.label} question={ui.steps.next}>
          <Heading>{ahead.heading}</Heading>
          <Prose>
            {ahead.paragraphs.map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
          </Prose>
          <figure className="bleed-margin mt-12">
            <div className="relative aspect-[16/9] overflow-hidden bg-leaf-deep outline outline-1 -outline-offset-1 outline-ink/15 sm:aspect-[21/9]">
              <Image src={ahead.image.src} alt={ahead.image.alt} fill sizes="(min-width: 1024px) 70rem, 100vw" className="object-cover" />
            </div>
            <figcaption className="mt-3 font-mono text-register text-ink-faint">{ahead.image.caption}</figcaption>
          </figure>
        </Leaf>
        <section className="py-20 text-center lg:py-28">
          <p className="mx-auto max-w-[30ch] px-5 font-display text-[clamp(1.6rem,1.1rem+2vw,2.6rem)] font-medium leading-[1.2] text-ink">
            <span aria-hidden="true" className="text-cinnabar">
              ॥{" "}
            </span>
            {ahead.closing}
            <span aria-hidden="true" className="text-cinnabar">
              {" "}॥
            </span>
          </p>
          <ul className="mt-8 flex flex-wrap justify-center gap-x-8 gap-y-3 px-5">
            {ahead.links.map((link) => (
              <li key={link.label}>
                <InlineLink href={link.href} className="">
                  {link.label} →
                </InlineLink>
              </li>
            ))}
          </ul>
        </section>
      </main>
      <Footer />
    </>
  );
}
