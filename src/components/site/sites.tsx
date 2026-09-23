import Image from "next/image";
import { EditorialNote, Heading, Leaf, Pending } from "./primitives";
import { getContent, type Content } from "@/i18n/content";

type Site = Content["home"]["sites"]["items"][number];
type SitesUI = Content["ui"]["sites"];

const FIRST_YEAR = 2022;

/**
 * "From completed work to ongoing work", told as a time axis first: the
 * dated projects laid end to end show the work handing from one site to the
 * next without a gap since February 2022. Then the catalogue — one record
 * per site, the current and largest project given the photograph and the
 * room, the others set as register entries.
 */
export async function Sites() {
  const { home, ui } = await getContent();
  const { sites } = home;
  const t = ui.sites;
  const featured = sites.items.find((s) => s.image);
  const rest = sites.items.filter((s) => s !== featured);

  return (
    <Leaf id="sites" label={sites.label}>
      <Heading>{sites.heading}</Heading>
      <Timeline items={sites.items} t={t} />

      {featured ? <FeaturedSite site={featured} t={t} /> : null}

      <ul className="bleed-margin mt-14 grid gap-x-10 gap-y-12 border-t border-ink/20 pt-10 md:grid-cols-3">
        {rest.map((site) => (
          <li key={site.name}>
            <SiteRecord site={site} t={t} variantLabel={ui.common.variantReading} awaiting={ui.common.awaiting} />
          </li>
        ))}
      </ul>
    </Leaf>
  );
}

function Timeline({ items, t }: { items: readonly Site[]; t: SitesUI }) {
  const lastYear = Math.max(2026, new Date().getFullYear());
  const months = (lastYear - FIRST_YEAR + 1) * 12;
  const at = (ym: string) => {
    const [y, m] = ym.split("-").map(Number);
    return (((y - FIRST_YEAR) * 12 + (m - 1)) / months) * 100;
  };
  const years = Array.from({ length: lastYear - FIRST_YEAR + 1 }, (_, i) => FIRST_YEAR + i);

  return (
    <figure className="bleed-margin mt-12">
      <figcaption className="sr-only">
        {t.timeline}, {FIRST_YEAR}–{lastYear}.
      </figcaption>
      <div className="relative">
        {/* Year rules behind the rows. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 right-0 md:left-[13rem]"
        >
          {years.map((year) => (
            <span
              key={year}
              className="absolute inset-y-0 border-l border-dashed border-ink/15"
              style={{ left: `${((year - FIRST_YEAR) / (lastYear - FIRST_YEAR + 1)) * 100}%` }}
            />
          ))}
        </div>

        <ol className="relative">
        {items.map((site) => {
          const left = site.start ? at(site.start) : 0;
          const right = site.end ? at(site.end) + 100 / months : 100;
          return (
            <li
              key={site.name}
              className="relative grid gap-y-2 border-b border-ink/15 py-3.5 md:grid-cols-[13rem_minmax(0,1fr)] md:items-center"
            >
              <p className="pr-4 text-[1rem] leading-snug text-ink">
                {site.name}
                <span className="sr-only">
                  {site.start ? `, ${t.from} ${site.start}` : `, ${t.startNotSupplied}`}
                  {site.end ? ` ${t.to} ${site.end}` : `, ${t.ongoing}`}
                </span>
              </p>
              <div aria-hidden="true" className="relative h-4">
                {site.start ? (
                  <span
                    className={`absolute inset-y-0 rounded-[999px] ${
                      site.end
                        ? "bg-ink"
                        : "bg-[linear-gradient(90deg,var(--color-cinnabar)_70%,transparent)]"
                    }`}
                    style={{ left: `${left}%`, width: `${right - left}%` }}
                  />
                ) : (
                  <span className="absolute inset-y-0 left-0 flex items-center">
                    <Pending width="9rem" label={t.startAwaiting} />
                  </span>
                )}
              </div>
            </li>
          );
        })}
        </ol>
      </div>
      <div aria-hidden="true" className="relative mt-2 h-5 md:ml-[13rem]">
        {years.map((year) => (
          <span
            key={year}
            className="absolute top-0 font-mono text-register text-ink-faint"
            style={{ left: `${((year - FIRST_YEAR) / (lastYear - FIRST_YEAR + 1)) * 100}%` }}
          >
            <span className="pl-1.5">{year}</span>
          </span>
        ))}
      </div>
      <p aria-hidden="true" className="mt-4 flex flex-wrap gap-x-6 gap-y-1 font-mono text-register text-ink-faint">
        <span className="flex items-center gap-2">
          <span className="inline-block h-2 w-5 rounded-full bg-ink" /> {t.completed}
        </span>
        <span className="flex items-center gap-2">
          <span className="inline-block h-2 w-5 rounded-full bg-cinnabar" /> {t.ongoing}
        </span>
      </p>
    </figure>
  );
}

function Status({ status, t }: { status: Site["status"]; t: SitesUI }) {
  return (
    <span className="inline-flex items-center gap-2 font-mono text-register text-cinnabar">
      <span
        aria-hidden="true"
        className={`size-2.5 rounded-full border border-cinnabar ${
          status === "Completed" ? "bg-cinnabar" : ""
        }`}
      />
      {t.status[status]}
    </span>
  );
}

function Figures({
  site,
  t,
  awaiting,
  large = false,
}: {
  site: Site;
  t: SitesUI;
  awaiting?: string;
  large?: boolean;
}) {
  const figure = large
    ? "font-display text-[clamp(2rem,1.5rem+1.8vw,3rem)] font-medium leading-none"
    : "font-display text-[1.6rem] font-medium leading-none";
  return (
    <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-3 border-t border-ink/15 pt-4">
      <div>
        <dt className="font-mono text-register text-ink-faint">{t.manuscripts}</dt>
        <dd className={`mt-2 tabular-nums text-ink ${figure}`}>
          {site.figures.manuscripts ?? <Pending width="4rem" label={awaiting} />}
        </dd>
      </div>
      <div>
        <dt className="font-mono text-register text-ink-faint">{t.folios}</dt>
        <dd className={`mt-2 tabular-nums text-ink ${figure}`}>
          {site.figures.folios ?? <Pending width="4rem" />}
        </dd>
      </div>
    </dl>
  );
}

function SiteRecord({
  site,
  t,
  variantLabel,
  awaiting,
}: {
  site: Site;
  t: SitesUI;
  variantLabel: string;
  awaiting: string;
}) {
  return (
    <article>
      <Status status={site.status} t={t} />
      <h3 className="mt-3 font-display text-[1.7rem] font-medium leading-[1.1] text-ink">
        {site.name}
      </h3>
      <p className="mt-2 text-[1rem] leading-snug text-ink-soft">
        {site.institution}
        <br />
        {site.place}
      </p>
      <Figures site={site} t={t} awaiting={awaiting} />
      <p className="mt-4 text-[1rem] leading-relaxed text-ink-soft">{site.footnote}</p>
      {site.altName ? (
        <EditorialNote label={variantLabel} className="mt-5">
          {site.altName}
        </EditorialNote>
      ) : null}
    </article>
  );
}

function FeaturedSite({ site, t }: { site: Site; t: SitesUI }) {
  return (
    <article className="bleed-margin mt-16 grid gap-x-12 gap-y-8 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]">
      <figure data-plate>
        <div className="relative aspect-[3/2] overflow-hidden bg-leaf-deep outline outline-1 -outline-offset-1 outline-ink/15">
          <Image
            src={site.image!}
            alt={site.imageAlt ?? ""}
            fill
            sizes="(min-width: 1024px) 45vw, 100vw"
            className="object-cover"
          />
        </div>
        <figcaption className="mt-3 font-mono text-register text-ink-faint">
          {site.name}, {site.place}.
        </figcaption>
      </figure>
      <div className="lg:pt-2">
        <Status status={site.status} t={t} />
        <h3 className="mt-3 font-display text-[clamp(2.1rem,1.5rem+2.2vw,3.2rem)] font-medium leading-[1.02] text-ink">
          {site.name}
        </h3>
        <p className="mt-3 text-[1.0625rem] leading-snug text-ink-soft">
          {site.institution}
          <br />
          {site.place}
        </p>
        <Figures site={site} t={t} large />
        <p className="mt-5 max-w-[40ch] text-[1.0625rem] leading-relaxed text-ink-soft">
          {site.footnote}
        </p>
      </div>
    </article>
  );
}
