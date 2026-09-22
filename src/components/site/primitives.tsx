import Image from "next/image";
import type { ReactNode } from "react";
import type { Pending as PendingValue } from "@/content/shared";
import { Reveal } from "./reveal";

/** Page gutter + max width, shared by every band so the columns line up. */
export function Container({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto w-full max-w-[82rem] px-5 sm:px-8 ${className}`}>
      {children}
    </div>
  );
}

/**
 * A section of the page. The left gutter carries the folio marker the way a
 * manuscript carries its leaf number; on narrow screens it sits above the
 * heading instead of beside it.
 */
export function Section({
  id,
  gutter,
  folio,
  children,
  className = "",
}: {
  id?: string;
  gutter?: string;
  folio?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={`scroll-mt-24 py-14 sm:py-20 ${className}`}>
      <Container>
        <div className="grid gap-6 lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-10">
          <div className="lg:pt-1">
            {folio ? (
              <p className="font-sans text-sm text-parchment/70">
                <span className="inline-block border-b border-parchment/30 pb-1">
                  {folio}
                </span>
              </p>
            ) : null}
            {gutter ? (
              <p className="mt-3 font-sans text-sm tracking-wide text-parchment/55">
                {gutter}
              </p>
            ) : null}
          </div>
          <div className="min-w-0">
            <Reveal>{children}</Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
}

/** Section heading, closed by a danda in gold as in the design. */
export function Heading({
  children,
  as: Tag = "h2",
  className = "",
}: {
  children: ReactNode;
  as?: "h1" | "h2" | "h3";
  className?: string;
}) {
  return (
    <Tag
      className={`text-balance text-3xl leading-tight text-accent sm:text-4xl ${className}`}
    >
      {children} <span className="text-gold">॥</span>
    </Tag>
  );
}

export function Lede({ children }: { children: ReactNode }) {
  return (
    <p className="mt-6 max-w-[54ch] text-lg leading-relaxed text-parchment/90 sm:text-xl">
      {children}
    </p>
  );
}

/**
 * A number the Foundation has not supplied yet.
 *
 * The design is explicit that the site this replaces printed zeroes, and that
 * nothing ships until real counts arrive — so an absent figure is drawn as a
 * dashed rule and labelled, never rendered as 0.
 */
export function Pending({
  width = "5rem",
  label,
}: {
  width?: string;
  label?: string;
}) {
  return (
    <span className="inline-flex items-baseline gap-3">
      <span
        className="pending-rule"
        style={{ width }}
        role="img"
        aria-label={label ? `Not yet published — ${label}` : "Not yet published"}
      />
      {label ? (
        <span className="font-sans text-sm text-accent">{label}</span>
      ) : null}
    </span>
  );
}

/** Salmon-ruled note recording a discrepancy rather than papering over it. */
export function EditorialNote({ children }: { children: ReactNode }) {
  return (
    <div className="mt-8 border-l-2 border-accent pl-5">
      <p className="max-w-[58ch] font-sans text-[0.95rem] leading-relaxed text-accent">
        {children}
      </p>
    </div>
  );
}

export function Button({
  href,
  children,
  variant = "primary",
}: {
  href: string;
  children: ReactNode;
  variant?: "primary" | "outline" | "outline-dark";
}) {
  const base =
    "inline-flex items-center justify-center px-6 py-3.5 font-sans text-base transition-colors duration-150";
  const styles = {
    primary: "bg-rust text-parchment-bright hover:bg-rust/85",
    outline:
      "border border-ink/35 text-ink hover:bg-ink/5 bg-parchment-bright/40",
    "outline-dark":
      "border border-parchment/45 text-parchment hover:bg-parchment/10",
  } as const;
  return (
    <a href={href} className={`${base} ${styles[variant]}`}>
      {children}
    </a>
  );
}

/**
 * The header band for every inner page: eyebrow, title and a short intro on
 * the parchment ground, echoing the homepage hero without repeating its
 * folio-panel photo treatment.
 */
export function PageHero({
  eyebrow,
  title,
  body,
}: {
  eyebrow: string;
  title: string;
  body: string;
}) {
  return (
    <section id="top" className="border-b border-parchment/10 py-14 sm:py-20">
      <Container>
        <p className="font-sans text-sm tracking-wide text-parchment/55">{eyebrow}</p>
        <h1 className="mt-4 max-w-[26ch] text-balance text-5xl leading-[1.08] text-parchment-bright sm:text-6xl">
          {title}
        </h1>
        <p className="mt-7 max-w-[54ch] text-lg leading-relaxed text-parchment/90 sm:text-xl">
          {body}
        </p>
      </Container>
    </section>
  );
}

/** An inline text link in the accent colour, underlined — used for in-page "explore X" links. */
export function InlineLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      className="mt-6 inline-block border-b border-accent/40 pb-1 font-sans text-base text-accent transition-colors hover:border-accent"
    >
      {children}
    </a>
  );
}

/**
 * A grid of labelled figures with a supporting note — the shape every
 * "our work so far" style stat block takes across the site. A `null` value
 * renders as the `Pending` placeholder rather than a guess.
 */
export function StatGrid({
  metrics,
  columns = 4,
}: {
  metrics: readonly { label: string; value: PendingValue<string>; note?: string }[];
  columns?: 2 | 3 | 4;
}) {
  const cols = { 2: "sm:grid-cols-2", 3: "sm:grid-cols-2 lg:grid-cols-3", 4: "sm:grid-cols-2 lg:grid-cols-4" }[columns];
  return (
    <dl className={`mt-10 grid gap-x-10 gap-y-10 ${cols}`}>
      {metrics.map((metric) => (
        <div key={metric.label} className="border-t border-parchment/25 pt-4">
          <dt className="font-sans text-base text-parchment/90">{metric.label}</dt>
          <dd className="mt-4">
            {metric.value ? (
              <span className="text-3xl text-gold">{metric.value}</span>
            ) : (
              <Pending label="awaiting Foundation" width="7rem" />
            )}
            {metric.note ? (
              <p className="mt-3 max-w-[28ch] text-lg leading-snug text-parchment/80">{metric.note}</p>
            ) : null}
          </dd>
        </div>
      ))}
    </dl>
  );
}

/**
 * A numbered method — the "how we work" pattern every pillar page uses
 * (Understand → Respond → Collaborate…, or Listen & Assess → Define the
 * Purpose…). Keeps that recurring shape in one place.
 */
export function StepList({ steps }: { steps: readonly { title: string; body: string }[] }) {
  return (
    <ol className="mt-10 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
      {steps.map((step, i) => (
        <li key={step.title} className="border-t border-parchment/25 pt-4">
          <span className="font-sans text-sm text-accent">{String(i + 1).padStart(2, "0")}</span>
          <h3 className="mt-2 text-xl text-parchment-bright">{step.title}</h3>
          <p className="mt-2 max-w-[32ch] text-lg leading-snug text-parchment/80">{step.body}</p>
        </li>
      ))}
    </ol>
  );
}

type Person = { name: string; rank: string; body?: string; image: string };

/**
 * A wall of people: trustees, advisors, anyone the site introduces by
 * portrait. Every source photo arrives in a different light, crop and
 * background — a scanned headshot next to a studio portrait next to a
 * phone photo. A single treatment (desaturated toward sepia, full colour
 * only on interaction) makes them read as one considered set instead of a
 * patchwork, the way a printed annual report unifies submitted photos with
 * one duotone rather than reproducing each as shot.
 *
 * Name and rank sit in the type, not as text laid over the photo — so
 * nothing here depends on hover to be legible, only to feel alive.
 */
export function PersonGrid({
  people,
  columns = 3,
}: {
  people: readonly Person[];
  columns?: 3 | 4;
}) {
  const cols =
    columns === 4 ? "sm:grid-cols-2 lg:grid-cols-4" : "sm:grid-cols-2 lg:grid-cols-3";
  return (
    <ul className={`mt-10 grid gap-x-8 gap-y-14 ${cols}`}>
      {people.map((person) => (
        <li key={person.name} className="group">
          <div className="plate">
            <div className="relative aspect-[4/5] w-full overflow-hidden">
              <Image
                src={person.image}
                alt={person.name}
                fill
                sizes="(min-width: 1024px) 24vw, 45vw"
                className="object-cover [filter:grayscale(0.85)_sepia(0.18)_contrast(1.05)] transition-[filter,transform] duration-500 ease-out group-hover:scale-[1.035] group-hover:[filter:grayscale(0)_sepia(0)_contrast(1)]"
              />
            </div>
          </div>
          <div className="mt-5 border-t border-parchment/20 pt-3 transition-colors duration-300 group-hover:border-gold/70">
            <h3 className="text-xl text-parchment-bright">{person.name}</h3>
            <p className="mt-1 font-sans text-sm tracking-wide text-accent">{person.rank}</p>
          </div>
          {person.body ? (
            <p className="mt-3 line-clamp-3 text-base leading-snug text-parchment/75">
              {person.body}
            </p>
          ) : null}
        </li>
      ))}
    </ul>
  );
}

/**
 * A photograph mounted on a parchment mat. Every image in the design is
 * presented this way — as a plate, with the mat's shadow falling down-right.
 */
export function Plate({
  src,
  alt,
  caption,
  ratio = "4 / 3",
  className = "",
  priority = false,
}: {
  src: string;
  alt: string;
  caption?: string;
  ratio?: string;
  className?: string;
  priority?: boolean;
}) {
  return (
    <figure className={className}>
      <div className="plate">
        <div className="relative w-full overflow-hidden" style={{ aspectRatio: ratio }}>
          <Image
            src={src}
            alt={alt}
            fill
            priority={priority}
            sizes="(min-width: 1024px) 40vw, 100vw"
            className="object-cover"
          />
        </div>
      </div>
      {caption ? (
        <figcaption className="mt-3 max-w-[46ch] text-[0.95rem] leading-relaxed text-parchment/70">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
