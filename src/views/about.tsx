import Image from "next/image";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { Container, Heading, InlineLink, Leaf, Lede, PageHero, PageThread, PersonGrid, Plate, Prose } from "@/components/site/primitives";
import { VideoLoop } from "@/components/site/video-loop";
import { getContent } from "@/i18n/content";
import { pageMetadata } from "@/i18n/metadata";

export async function generateMetadata() {
  const { about } = await getContent();
  return pageMetadata("about", "/about", about.pageHero.body);
}

/**
 * About, in the order of the Foundation's "About Us — Final Website Copy"
 * document: inspiration, the Foundation, what guides it, its leadership,
 * its three areas of work, and what lies ahead, closing on the film.
 */
export default async function AboutPage() {
  const { about, conservation, trustees, ui } = await getContent();
  const { ahead, areas, foundation, inspiration, leadership, mvv, namesake, pageHero } = about;
  const { film } = conservation;
  const t = ui.trustees;
  const profile = { open: t.readProfile, close: t.closeProfile };
  return (
    <>
      <Header />
      <main id="main">
        <PageHero question={ui.steps.glance} label={ui.about.heroLabel} {...pageHero} />

        {/* The page's navigation, in her section names — kept out of the
            hero, as her document asks ("avoid placing a long menu of jump
            links above the fold"). */}
        <Container>
          <div className="grid md:grid-cols-[5.5rem_minmax(0,1fr)] lg:grid-cols-[7.5rem_minmax(0,1fr)_16rem]">
            <div className="hidden md:block" />
            <div className="ruled min-w-0 pb-4 pl-5 sm:pl-7 lg:pl-12 [&>nav]:mt-0">
              <PageThread
                title={ui.steps.thread}
                items={[inspiration, foundation, mvv, leadership, areas, ahead].map((section, i) => ({
                  id: ["inspiration", "foundation", "mvv", "leadership", "areas", "ahead"][i],
                  question: section.label,
                }))}
              />
            </div>
          </div>
        </Container>

        {/* The namesake, in the archive's own photographs: the ceremony print
            large, two small portraits beside it, then the sutra. */}
        <Leaf id="inspiration" question={inspiration.label}>
          <Heading>{inspiration.heading}</Heading>
          <Prose className="mt-7">
            {inspiration.paragraphs.map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
          </Prose>

          {/* One principal portrait, then at most two supporting historical
              photographs, as her document directs. */}
          <div className="bleed-margin mt-14 grid items-start gap-x-8 gap-y-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)]">
            <Plate
              src={namesake.album[1].src}
              alt={namesake.album[1].alt}
              caption={namesake.album[1].caption}
              ratio={namesake.album[1].ratio}
              className="max-w-[24rem]"
              sizes="(min-width: 1024px) 24rem, 90vw"
              imageClassName="object-cover grayscale"
            />
            <div className="grid gap-x-6 gap-y-10 sm:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
              <figure data-plate className="min-w-0">
                <div
                  className="relative overflow-hidden bg-board-deep outline outline-1 -outline-offset-1 outline-ink/15"
                  style={{ aspectRatio: namesake.album[0].ratio }}
                >
                  <Image
                    src={namesake.album[0].src}
                    alt={namesake.album[0].alt}
                    fill
                    sizes="(min-width: 1024px) 28vw, 90vw"
                    className="object-cover grayscale"
                  />
                </div>
                <figcaption className="mt-3 font-mono text-register text-ink-faint">
                  <span lang="hi" className="block font-serif text-[1.02rem] leading-snug text-ink">
                    {namesake.album[0].captionDeva}
                  </span>
                  <span className="mt-1.5 block">{namesake.album[0].caption}</span>
                </figcaption>
              </figure>
              <Plate
                src={namesake.album[2].src}
                alt={namesake.album[2].alt}
                caption={namesake.album[2].caption}
                ratio={namesake.album[2].ratio}
                className="max-w-[13rem]"
                sizes="13rem"
                imageClassName="object-cover grayscale"
              />
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

        <Leaf id="foundation" question={foundation.label}>
          <Heading>{foundation.heading}</Heading>
          <Prose>
            {foundation.paragraphs.map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
          </Prose>
        </Leaf>

        <Leaf id="mvv" question={mvv.label}>
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
                  className="grid gap-x-10 gap-y-2 border-b border-ink/20 py-6 md:grid-cols-[19rem_minmax(0,1fr)]"
                >
                  <dt>
                    <span className="block font-display text-[1.45rem] leading-snug text-ink">
                      <span lang="sa">{value.deva}</span> | {value.name} — {value.meaning}
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

        <Leaf id="leadership" question={leadership.label}>
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
        </Leaf>

        <Leaf id="areas" question={areas.label}>
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
                <h3 className="mt-5 text-balance font-display text-[clamp(1.4rem,1.2rem+0.6vw,1.75rem)] leading-tight text-ink">
                  {String(i + 1).padStart(2, "0")} | {area.title}
                </h3>
                <p className="mt-2 font-mono text-register text-cinnabar">{area.tagline}</p>
                <p className="mt-3 text-[1.0625rem] leading-relaxed text-ink-soft">{area.body}</p>
                <InlineLink href={area.link.href} className="mt-auto pt-5">
                  {area.link.label} →
                </InlineLink>
              </li>
            ))}
          </ul>
        </Leaf>

        <Leaf id="ahead" question={ahead.label}>
          <Heading>{ahead.heading}</Heading>
          <Prose>
            {ahead.paragraphs.map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
          </Prose>
          <VideoLoop
            className="bleed-margin mt-12"
            youtubeId={film.youtubeId}
            title={film.heading}
            watchLabel={ui.common.watchWithSound}
          />
          <p className="mt-3 font-mono text-register text-ink-faint">{film.heading}</p>
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
