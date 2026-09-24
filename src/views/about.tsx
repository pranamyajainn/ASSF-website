import Image from "next/image";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { Gloss, Heading, Leaf, Lede, PageHero, Plate, Prose } from "@/components/site/primitives";
import { LeafPanels } from "@/components/site/leaf-panels";
import { ScaleLines } from "@/components/site/scale-lines";
import { VideoLoop } from "@/components/site/video-loop";
import { getContent } from "@/i18n/content";
import { pageMetadata } from "@/i18n/metadata";
import { fill } from "@/i18n/ui";
import { scriptLang } from "@/lib/deva";

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

export default async function AboutPage() {
  const { about, home, conservation, shared, ui, href } = await getContent();
  const { closingLine, mvv, namesake, pageHero, philosophy, plates, scale } = about;
  const { lineage } = home;
  const { film } = conservation;
  const t = ui.about;
  return (
    <>
      <Header />
      <main>
        <PageHero
          question={ui.steps.glance}
          thread={{
            title: ui.steps.thread,
            items: [
              { id: "namesake", question: ui.steps.whose },
              { id: "philosophy", question: ui.steps.why },
              { id: "mvv", question: ui.steps.believe },
              { id: "pillars", question: ui.steps.what },
              { id: "plates", question: ui.steps.looks },
              { id: "scale", question: ui.steps.next },
            ],
          }}
          label={t.heroLabel}
          {...pageHero}
        />

        {/* The namesake, in the archive's own photographs: the ceremony print
            large — a garlanded scripture before him, lineage and manuscript
            in one frame — and two small portraits beside it, shown at the
            size old prints can bear. */}
        <Leaf id="namesake" label={namesake.label} question={ui.steps.whose}>
          <p
            lang={scriptLang(lineage.nameDeva)}
            className="max-w-[22ch] font-display text-[clamp(1.6rem,1.2rem+1.5vw,2.4rem)] leading-[1.25] text-cinnabar"
          >
            {lineage.nameDeva}
          </p>
          <Heading className="mt-5" size="sub">
            {lineage.heading}
          </Heading>
          <p className="mt-3 font-mono text-register text-ink-faint">{lineage.dates}</p>
          <Prose className="mt-7">
            {lineage.paragraphs.map((p) => (
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

          <blockquote className="mt-14 max-w-[36ch] border-l border-cinnabar/60 pl-5">
            <p lang="hi" className="font-display text-[1.6rem] leading-snug text-ink">
              {lineage.epigraph}
            </p>
          </blockquote>
        </Leaf>

        {/* The sutra the whole Foundation is built on, set as the page's
            centrepiece in its own script — then the plain-English case. */}
        <Leaf id="philosophy" label={philosophy.label} question={ui.steps.why}>
          <figure className="bleed-margin">
            <blockquote>
              <p
                lang="sa"
                className="inked ink-on-scroll font-display text-[clamp(2.6rem,1.2rem+5.6vw,6.2rem)] font-medium leading-[1.15]"
              >
                {philosophy.quote.deva}
              </p>
              <p className="mt-5 text-lede text-ink-soft">
                {philosophy.quote.latin}
                <span aria-hidden="true" className="mx-3 text-cinnabar">
                  —
                </span>
                <span className="text-ink">{philosophy.quote.translation}</span>
              </p>
            </blockquote>
            <figcaption className="mt-3 font-mono text-register text-cinnabar">
              {philosophy.quote.source}
            </figcaption>
          </figure>

          <Heading className="mt-20">{philosophy.heading}</Heading>
          <Prose>
            {philosophy.paragraphs.map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
          </Prose>
        </Leaf>

        <Leaf id="mvv" label={mvv.label} question={ui.steps.believe}>
          <Heading>{mvv.heading}</Heading>

          <div className="mt-12">
            <p className="font-mono text-register text-cinnabar">{mvv.mission.label}</p>
            <p className="mt-4 font-display text-[clamp(1.9rem,1.3rem+2.2vw,3rem)] font-medium leading-[1.05] text-ink">
              {mvv.mission.lines.map((line) => (
                <span key={line.text} className="block">
                  {line.text}
                  <small className="mb-4 mt-2 flex items-baseline gap-3 font-mono text-register font-normal text-cinnabar">
                    <span aria-hidden="true" className="h-px w-5 shrink-0 -translate-y-[0.3em] bg-cinnabar/60" />
                    {line.gloss}
                  </small>
                </span>
              ))}
            </p>
          </div>

          <div className="mt-12 border-t border-ink/15 pt-8">
            <p className="font-mono text-register text-cinnabar">{mvv.vision.label}</p>
            <Lede className="mt-3">{mvv.vision.body}</Lede>
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
        </Leaf>

        <Leaf id="pillars" label={t.pillarsLabel} question={ui.steps.what}>
          <Heading>{t.pillarsHeading}</Heading>
          <LeafPanels
            panels={shared.pillars.map((pillar, i) => ({
              key: pillar.slug,
              number: String(i + 1).padStart(2, "0"),
              title: pillar.label,
              tagline: pillar.tagline,
              body: pillar.body,
              link: { label: fill(ui.common.explore, { name: pillar.label }), href: href(`/${pillar.slug}`) },
            }))}
          />
        </Leaf>

        <Leaf id="plates" label={plates.label} question={ui.steps.looks}>
          <Heading>{plates.heading}</Heading>
          <div className="bleed-margin mt-12 space-y-10">
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
        </Leaf>

        <Leaf id="film" label={film.label} question={ui.steps.watch}>
          <Heading>{film.heading}</Heading>
          <Prose>
            <p>{film.body}</p>
          </Prose>
          <VideoLoop
            className="bleed-margin mt-10"
            youtubeId={film.youtubeId}
            title={film.heading}
            watchLabel={ui.common.watchWithSound}
          />
        </Leaf>

        <Leaf id="scale" label={scale.label} question={ui.steps.next}>
          <Heading>{scale.heading}</Heading>
          <Prose>
            <Gloss label={t.alsoRecorded}>{scale.note}</Gloss>
            <p>{scale.body}</p>
          </Prose>

          <div className="bleed-margin mt-10 overflow-x-auto">
            <table className="w-full min-w-[38rem] border-collapse">
              <caption className="sr-only">{t.tableCaption}</caption>
              <thead>
                <tr className="border-y border-ink/25">
                  <th scope="col" className="py-3 pr-4 text-left font-mono text-register font-normal text-ink-faint">
                    {t.measure}
                  </th>
                  {scale.table.columns.map((col, i) => (
                    <th
                      key={col}
                      scope="col"
                      className={`px-4 py-3 text-right font-mono text-register font-normal ${
                        i === scale.table.columns.length - 1 ? "text-cinnabar" : "text-ink-faint"
                      }`}
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {scale.table.rows.map((row) => (
                  <tr key={row.label} className="border-b border-ink/15">
                    <th scope="row" className="py-4 pr-4 text-left text-[1.0625rem] font-normal text-ink">
                      {row.label}
                    </th>
                    {row.values.map((v, i) => (
                      <td
                        key={i}
                        className={`px-4 py-4 text-right font-display text-[1.35rem] tabular-nums ${
                          i === row.values.length - 1 ? "font-medium text-cinnabar" : "text-ink"
                        }`}
                      >
                        {v}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <ScaleLines
            className="mt-12"
            lines={scale.folios.map((f) => ({
              label: f.state,
              detail: t.foliosBySurvey,
              value: f.value,
              display: f.display,
              state: "open" as const,
            }))}
            note={ui.common.sameScale}
          />
        </Leaf>
        <section className="py-20 text-center lg:py-28">
          <p className="mx-auto max-w-[24ch] px-5 font-display text-[clamp(1.8rem,1.2rem+2.4vw,3rem)] font-medium leading-[1.15] text-ink">
            <span aria-hidden="true" className="text-cinnabar">
              ॥{" "}
            </span>
            {closingLine}
            <span aria-hidden="true" className="text-cinnabar">
              {" "}॥
            </span>
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}
