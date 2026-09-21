import Image from "next/image";
import {
  Container,
  EditorialNote,
  Heading,
  Lede,
  Pending,
  Plate,
  Section,
} from "./primitives";
import { conservationStages, film, ledger, mission, plates, sites } from "@/content/home";

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
        alt="A palm-leaf folio laid out for survey beside a colour reference strip."
        caption={mission.plate.caption}
        ratio="4 / 3"
      />
    </Section>
  );
}

export function Ledger() {
  return (
    <Section id="ledger" gutter={ledger.gutter}>
      <Heading>{ledger.heading}</Heading>
      <Lede>{ledger.intro}</Lede>

      <dl className="mt-12 grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {ledger.metrics.map((metric) => (
          <div key={metric.label} className="border-t border-parchment/25 pt-4">
            <dt className="font-sans text-base text-parchment/90">{metric.label}</dt>
            <dd className="mt-5">
              {metric.value ? (
                <span className="text-3xl text-gold">{metric.value}</span>
              ) : (
                <Pending label="awaiting Foundation" width="7rem" />
              )}
              <p className="mt-4 max-w-[26ch] text-lg leading-snug text-parchment/80">
                {metric.note}
              </p>
            </dd>
          </div>
        ))}
      </dl>
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

              <div className="mt-6 border-t border-ink/20 pt-6">
                <dl className="grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-3 lg:grid-cols-5">
                  {conservationStages.map((stage) => {
                    const count = site.stages[stage];
                    return (
                      <div key={stage}>
                        <dt className="font-sans text-sm text-ink/75">{stage}</dt>
                        <dd className="mt-2.5">
                          {count == null ? (
                            <span
                              className="block h-0 w-20 border-t-2 border-dashed border-ink/40"
                              role="img"
                              aria-label={`${stage}: count not yet published`}
                            />
                          ) : (
                            <span className="text-xl text-ink">{count}</span>
                          )}
                        </dd>
                      </div>
                    );
                  })}
                </dl>
              </div>

              <div className="mt-7 flex flex-wrap items-center gap-x-8 gap-y-3">
                <p className="text-lg text-ink/80">{site.footnote}</p>
                <a
                  href={`#project-${site.name.toLowerCase()}`}
                  className="font-sans text-base text-rust underline decoration-rust/40 underline-offset-[6px] hover:decoration-rust"
                >
                  Project record
                </a>
              </div>
            </div>
          </article>
        ))}
      </div>
    </Section>
  );
}

export function Film() {
  return (
    <Section id="film" gutter={film.gutter}>
      <div className="plate">
        <div className="flex aspect-video w-full items-center justify-center bg-ink">
          {film.embedUrl ? (
            <iframe
              src={film.embedUrl}
              title={film.heading}
              allowFullScreen
              className="size-full"
            />
          ) : (
            <p className="max-w-[32ch] px-6 text-center font-sans text-sm text-parchment/45">
              The film is not embedded until it is hosted on the Foundation&rsquo;s
              own channel.
            </p>
          )}
        </div>
      </div>

      <Heading className="mt-10">{film.heading}</Heading>
      <Lede>{film.body}</Lede>
      <p className="mt-6 max-w-[54ch] font-sans text-[0.95rem] leading-relaxed text-accent">
        {film.note}
      </p>
    </Section>
  );
}

export function Plates() {
  return (
    <Section id="plates" gutter={plates.gutter}>
      <Heading>{plates.heading}</Heading>
      <Lede>{plates.intro}</Lede>

      <div className="mt-10 grid gap-x-10 gap-y-10 sm:grid-cols-2">
        {plates.items.map((plate, i) => (
          <Plate
            key={plate.src}
            src={plate.src}
            alt={`Programme plate ${i + 1}`}
            caption={plates.caption}
            ratio="8 / 5"
          />
        ))}
      </div>
    </Section>
  );
}

export { Container, EditorialNote };
