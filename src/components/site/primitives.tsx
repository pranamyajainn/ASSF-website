import Image from "next/image";
import type { ReactNode } from "react";

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
          <div className="min-w-0">{children}</div>
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
