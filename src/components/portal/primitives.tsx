import type { ReactNode } from "react";
import Link from "next/link";

/** A section of the dashboard: a small caps label, a heading, then content. */
export function PortalSection({
  eyebrow,
  heading,
  children,
  className = "",
}: {
  eyebrow: string;
  heading: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`border-t border-parchment/10 py-10 ${className}`}>
      <p className="font-sans text-sm tracking-wide text-parchment/50">{eyebrow}</p>
      <h2 className="mt-2 text-2xl text-parchment-bright">{heading}</h2>
      <div className="mt-6">{children}</div>
    </section>
  );
}

/**
 * Stat tile — proportional (not tabular) figures for a standalone value,
 * per the dashboard's figure convention. One glance, one number.
 */
export function StatTile({
  label,
  value,
  note,
}: {
  label: string;
  value: string;
  note?: string;
}) {
  return (
    <div className="border-t border-parchment/20 pt-4">
      <p className="font-sans text-sm text-parchment/70">{label}</p>
      <p className="mt-3 font-sans text-3xl font-semibold text-gold">{value}</p>
      {note ? <p className="mt-2 max-w-[26ch] text-base leading-snug text-parchment/60">{note}</p> : null}
    </div>
  );
}

/**
 * A meter: a filled proportion of a whole, fill in gold, track a lighter
 * step of the surface — for "how much of the known scale has been done".
 */
export function Meter({
  label,
  filledLabel,
  totalLabel,
  fraction,
}: {
  label: string;
  filledLabel: string;
  totalLabel: string;
  fraction: number;
}) {
  const pct = Math.max(0, Math.min(1, fraction)) * 100;
  return (
    <div>
      <div className="flex items-baseline justify-between gap-4 font-sans text-sm text-parchment/70">
        <span>{label}</span>
        <span className="text-parchment/50">{pct.toFixed(1)}%</span>
      </div>
      <div className="mt-3 h-2 rounded-full bg-parchment/10">
        <div
          className="h-2 rounded-full bg-gold"
          style={{ width: `${Math.max(pct, 1.5)}%` }}
        />
      </div>
      <div className="mt-2 flex items-baseline justify-between font-sans text-sm">
        <span className="text-parchment-bright">{filledLabel}</span>
        <span className="text-parchment/50">of {totalLabel}</span>
      </div>
    </div>
  );
}

const STATUS_STYLE = {
  recognised: { dot: "bg-sage", text: "text-sage", label: "Recognised" },
  verify: { dot: "bg-gold", text: "text-gold", label: "To verify" },
  pending: { dot: "bg-accent", text: "text-accent", label: "In progress" },
} as const;

export function StatusRow({
  label,
  state,
}: {
  label: string;
  state: "recognised" | "verify" | "pending";
}) {
  const style = STATUS_STYLE[state];
  return (
    <div className="flex items-center justify-between gap-4 border-t border-parchment/10 py-3 first:border-t-0">
      <span className="font-sans text-[0.95rem] text-parchment/85">{label}</span>
      <span className={`flex items-center gap-2 font-sans text-sm ${style.text}`}>
        <span className={`size-1.5 rounded-full ${style.dot}`} aria-hidden="true" />
        {style.label}
      </span>
    </div>
  );
}

export function ReportCard({
  name,
  href,
  stats,
}: {
  name: string;
  href: string;
  stats: readonly { label: string; value: string }[];
}) {
  return (
    <Link
      href={href}
      className="block border border-parchment/15 bg-ink p-5 transition-colors hover:border-accent/40"
    >
      <p className="font-sans text-base text-parchment-bright">{name}</p>
      <dl className="mt-4 space-y-2.5">
        {stats.map((s) => (
          <div key={s.label} className="flex items-baseline justify-between gap-3 font-sans text-sm">
            <dt className="text-parchment/60">{s.label}</dt>
            <dd className="text-parchment-bright">{s.value}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-4 font-sans text-sm text-accent underline decoration-accent/40 underline-offset-4">
        Open full report
      </p>
    </Link>
  );
}
