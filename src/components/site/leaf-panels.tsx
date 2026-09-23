import { Fragment, type CSSProperties, type ReactNode } from "react";

export type Panel = {
  key: string;
  number: string;
  title: string;
  tagline?: string;
  body?: string;
  stats?: readonly { label: string; value: string }[];
  note?: string;
  link?: { label: string; href: string };
};

/**
 * One palm leaf, three texts. A long leaf is written in panels, divided by
 * the holes its binding cord passes through; here the three pillars (or the
 * three impact streams) share a single leaf, split at the string-holes — one
 * object, one cord, three parts. The first panel is wider because it is the
 * Foundation's principal programme, not because the grid came out that way.
 *
 * Flat on wide screens; turned upright, holes between the panels, on narrow.
 */
export function LeafPanels({
  panels,
  className = "mt-12",
  leadWeight = 1.45,
}: {
  panels: readonly Panel[];
  className?: string;
  /** How much wider the first panel is than the others. */
  leadWeight?: number;
}) {
  return (
    <div className={`leaf-panel bleed-margin px-7 py-12 sm:px-10 lg:px-14 lg:py-14 ${className}`}>
      <div className="flex flex-col lg:flex-row lg:items-stretch">
        {panels.map((panel, i) => (
          <Fragment key={panel.key}>
            {i > 0 ? <StringHole /> : null}
            <div
              className="min-w-0 lg:[flex:var(--grow)_1_0%]"
              style={{ "--grow": i === 0 ? leadWeight : 1 } as CSSProperties}
            >
              <PanelBody panel={panel} lead={i === 0} />
            </div>
          </Fragment>
        ))}
      </div>
    </div>
  );
}

function StringHole() {
  return (
    <div
      data-ornament
      aria-hidden="true"
      className="flex items-center justify-center py-9 lg:px-9 lg:py-0"
    >
      <span className="string-hole" />
    </div>
  );
}

function PanelBody({ panel, lead }: { panel: Panel; lead: boolean }) {
  return (
    <div className="flex h-full flex-col">
      <p className="font-mono text-register text-cinnabar">{panel.number}</p>
      <h3
        className={`mt-3 font-display font-medium leading-[1.08] text-ink ${
          lead ? "text-[clamp(1.7rem,1.3rem+1.3vw,2.35rem)]" : "text-[clamp(1.45rem,1.2rem+0.8vw,1.8rem)]"
        }`}
      >
        {panel.title}
      </h3>
      {panel.tagline ? (
        <p className="mt-2 font-mono text-register text-ink-soft">{panel.tagline}</p>
      ) : null}
      {panel.body ? (
        <p className="mt-4 max-w-[44ch] text-[1.0625rem] leading-relaxed text-ink-soft">{panel.body}</p>
      ) : null}
      {panel.stats ? <PanelStats stats={panel.stats} /> : null}
      {panel.note ? (
        <p className="mt-5 border-l border-cinnabar/60 pl-3 font-mono text-register text-ink-soft">
          {panel.note}
        </p>
      ) : null}
      {panel.link ? (
        <PanelLink href={panel.link.href}>{panel.link.label}</PanelLink>
      ) : null}
    </div>
  );
}

function PanelStats({ stats }: { stats: readonly { label: string; value: string }[] }) {
  return (
    <dl className="mt-6 space-y-5">
      {stats.map((stat) => (
        <div key={stat.label}>
          <dt className="sr-only">{stat.label}</dt>
          <dd className="font-display text-[clamp(2rem,1.5rem+1.6vw,2.9rem)] font-medium leading-none tabular-nums text-ink">
            {stat.value}
          </dd>
          <dd aria-hidden="true" className="mt-1.5 max-w-[26ch] font-mono text-register text-ink-soft">
            {stat.label}
          </dd>
        </div>
      ))}
    </dl>
  );
}

function PanelLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      className="mt-auto inline-block self-start pt-7 text-[1.0625rem] text-cinnabar underline decoration-cinnabar/35 underline-offset-[6px] transition-colors hover:decoration-cinnabar"
    >
      {children}
    </a>
  );
}
