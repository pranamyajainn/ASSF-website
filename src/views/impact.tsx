import Image from "next/image";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { Button, Heading, Leaf, Lede, PageHero, PageThread, Prose } from "@/components/site/primitives";
import { getContent } from "@/i18n/content";
import { pageMetadata } from "@/i18n/metadata";

export async function generateMetadata() {
  const { impact } = await getContent();
  return pageMetadata("impact", "/impact", impact.pageHero.body);
}

/** Each section's eyebrow, set above its headline on every screen size. */
function Eyebrow({ children }: { children: string }) {
  return <p className="mb-4 font-mono text-register text-cinnabar">{children}</p>;
}

/** Line icons for the figures: a palm leaf, a heart, a bowl, a building, a book, a map pin. */
function Icon({ name }: { name: "leaf" | "health" | "meal" | "building" | "book" | "pin" }) {
  const paths = {
    leaf: <path d="M3 17C7 8 13 5 21 4c-1 8-4 14-13 18M3 17l5-5m-5 5 3 4" />,
    health: <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10ZM9.5 11h5M12 8.5v5" />,
    meal: <path d="M3 11h18a9 9 0 0 1-18 0Zm3 9h12M9 7c0-1.5 1-2 1-3.5M13 7c0-1.5 1-2 1-3.5" />,
    building: <path d="M3 21h18M5 21V9l7-5 7 5v12M9 21v-6h6v6M9 11h.01M15 11h.01" />,
    book: <path d="M4 5a2 2 0 0 1 2-2h6v17H6a2 2 0 0 0-2 2V5Zm16 0a2 2 0 0 0-2-2h-6v17h6a2 2 0 0 1 2 2V5Z" />,
    pin: <path d="M12 21s-6-5.6-6-11a6 6 0 0 1 12 0c0 5.4-6 11-6 11Zm0-8.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />,
  };
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-7 text-cinnabar" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      {paths[name]}
    </svg>
  );
}

/** Figures in a row of boxes, the number first. */
function Stats({ stats, className = "" }: { stats: readonly { value: string; label: string }[]; className?: string }) {
  return (
    <dl className={`bleed-margin grid gap-3 sm:grid-cols-3 ${className}`}>
      {stats.map((s) => (
        <div key={s.label} className="flex min-w-0 flex-col border border-ink/20 px-5 py-6">
          <dt className="order-2 mt-2 text-[1.0625rem] leading-snug text-ink-soft">{s.label}</dt>
          <dd className="order-1 font-display text-[clamp(2rem,1.6rem+1.4vw,2.8rem)] font-medium leading-none tracking-[-0.02em] text-ink">{s.value}</dd>
        </div>
      ))}
    </dl>
  );
}

/** A line the section stands on, beside a photograph of the work it speaks for. */
function PullQuote({ text, image }: { text: string; image: { src: string; ratio: string; alt: string; caption: string } }) {
  return (
    <div className="bleed-margin mt-14 grid items-center gap-x-12 gap-y-6 border-t border-ink/20 pt-12 lg:grid-cols-2">
      <figure data-plate className="min-w-0">
        <div className="relative w-full overflow-hidden bg-leaf-deep" style={{ aspectRatio: image.ratio }}>
          <Image src={image.src} alt={image.alt} fill sizes="(min-width: 1024px) 40vw, 90vw" className="object-cover" />
        </div>
        <figcaption className="mt-3 font-mono text-register text-ink-faint">{image.caption}</figcaption>
      </figure>
      <blockquote className="min-w-0 border-l-2 border-cinnabar/60 pl-6">
        <p className="text-balance font-display text-[clamp(1.6rem,1.2rem+1.4vw,2.4rem)] leading-[1.3] text-ink">“{text}”</p>
      </blockquote>
    </div>
  );
}

/**
 * Impact, in the Foundation's revised structure (Oct 2026): the four
 * headline figures, where the work began, each stream counted with its
 * projects and a line it stands on, how it is sustained, and what comes
 * next.
 */
export default async function ImpactPage() {
  const { impact, about, ui } = await getContent();
  const { began, built, next, pageHero, preserved, reached, strip, sustained, thread } = impact;
  const survey = about.scale.table;
  const states = survey.columns.slice(0, -1).map((state, i) => ({
    state,
    repositories: survey.rows[0].values[i],
    manuscripts: survey.rows[1].values[i],
    folios: survey.rows[2].values[i],
  }));
  const share = (next.progress.done / next.progress.total) * 100;
  return (
    <>
      <Header />
      <main id="main">
        <PageHero
          question={ui.steps.glance}
          label={ui.impact.heroLabel}
          {...pageHero}
          plate={{ ...pageHero.plate, position: "50% 45%" }}
        >
          <dl className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {strip.map((s) => (
              <div key={s.label} className="flex min-w-0 flex-col border border-ink/20 bg-leaf/60 px-5 py-5">
                <dt className="order-3 mt-2 text-[1rem] leading-snug text-ink-soft">{s.label}</dt>
                <dd className="order-1">
                  <Icon name={s.icon} />
                </dd>
                <dd className="order-2 mt-3 font-display text-[clamp(1.9rem,1.5rem+1.2vw,2.5rem)] font-medium leading-none text-ink">{s.value}</dd>
              </div>
            ))}
          </dl>
          <PageThread
            title={ui.steps.thread}
            items={[
              { id: "began", question: thread.began },
              { id: "preserved", question: thread.preserved },
              { id: "reached", question: thread.reached },
              { id: "built", question: thread.built },
              { id: "next", question: thread.next },
            ]}
          />
        </PageHero>

        <Leaf id="began" label={began.eyebrow} question={thread.began}>
          <Eyebrow>{began.eyebrow}</Eyebrow>
          <Heading>{began.heading}</Heading>
          <Prose>
            <p>{began.body}</p>
          </Prose>
          <p className="bleed-margin mt-12 text-center font-display text-[clamp(1.5rem,1rem+2.2vw,2.8rem)] font-medium leading-tight text-ink">
            {began.total.map((t, i) => (
              <span key={t.label} className="inline-block whitespace-nowrap">
                {i > 0 ? <span className="mx-3 text-cinnabar">·</span> : null}
                <span className="inked ink-on-scroll">{t.value}</span> <span className="text-ink-soft">{t.label}</span>
              </span>
            ))}
          </p>
          <ul className="bleed-margin mt-10 grid gap-3 md:grid-cols-3">
            {states.map((s) => (
              <li key={s.state} className="min-w-0 border border-ink/20 px-5 py-6">
                <Icon name="pin" />
                <p className="mt-3 font-display text-[1.5rem] font-medium text-ink">{s.state}</p>
                <dl className="mt-4 space-y-2 font-mono text-register">
                  {(["repositories", "manuscripts", "folios"] as const).map((k) => (
                    <div key={k} className="flex justify-between gap-4 border-b border-ink/10 pb-2">
                      <dt className="text-ink-faint">{began.stateLabels[k]}</dt>
                      <dd className="text-ink">{s[k]}</dd>
                    </div>
                  ))}
                </dl>
              </li>
            ))}
          </ul>
          <p className="mt-10 max-w-[56ch] border-l-2 border-orpiment pl-5 text-lede text-ink">{began.bridge}</p>
        </Leaf>

        <Leaf id="preserved" label={preserved.eyebrow} question={thread.preserved}>
          <Eyebrow>{preserved.eyebrow}</Eyebrow>
          <Heading>{preserved.heading}</Heading>
          <Prose>
            <p>{preserved.body}</p>
          </Prose>
          <Stats stats={preserved.stats} className="mt-10" />
          <ul className="bleed-margin mt-10 grid gap-3 md:grid-cols-2">
            {preserved.projects.map((p) => (
              <li key={p.name} className="min-w-0 border border-ink/20 px-5 py-6">
                <p className={`inline-block px-2 py-0.5 font-mono text-register ${p.done ? "bg-ink/10 text-ink" : "bg-cinnabar/10 text-cinnabar"}`}>{p.status}</p>
                <h3 className="mt-3 font-display text-[1.35rem] font-medium leading-tight text-ink">{p.name}</h3>
                <p className="mt-2 text-[1.0625rem] leading-relaxed text-ink-soft">{p.body}</p>
              </li>
            ))}
          </ul>
          <PullQuote {...preserved.quote} />
          <div className="mt-10">
            <Button href={preserved.link.href} variant="outline">
              {preserved.link.label} →
            </Button>
          </div>
        </Leaf>

        <Leaf id="reached" label={reached.eyebrow} question={thread.reached}>
          <Eyebrow>{reached.eyebrow}</Eyebrow>
          <Heading>{reached.heading}</Heading>
          <Prose>
            <p>{reached.body}</p>
          </Prose>
          <ul className="bleed-margin mt-10 grid gap-3 md:grid-cols-3">
            {reached.cards.map((c) => (
              <li key={c.title} className="min-w-0 border border-ink/20 px-5 py-6">
                <Icon name={c.icon} />
                <p className="mt-4 font-mono text-register text-cinnabar">{c.title}</p>
                <p className="mt-2 font-display text-[1.6rem] font-medium leading-tight text-ink">{c.headline}</p>
                <ul className="mt-4 space-y-2 text-[1rem] leading-relaxed text-ink-soft">
                  {c.lines.map((line) => (
                    <li key={line} className="border-t border-ink/10 pt-2">
                      {line}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
          <PullQuote {...reached.quote} />
          <div className="mt-10">
            <Button href={reached.link.href} variant="outline">
              {reached.link.label} →
            </Button>
          </div>
        </Leaf>

        <Leaf id="built" label={built.eyebrow} question={thread.built}>
          <Eyebrow>{built.eyebrow}</Eyebrow>
          <Heading>{built.heading}</Heading>
          <Prose>
            <p>{built.body}</p>
          </Prose>
          <div className="bleed-margin mt-10 grid gap-3 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
            <figure className="min-w-0 border border-ink/20">
              <div className="relative aspect-[3/2] overflow-hidden bg-leaf-deep">
                <Image src={built.feature.image.src} alt={built.feature.image.alt} fill sizes="(min-width: 1024px) 45vw, 92vw" className="object-cover" />
              </div>
              <figcaption className="px-5 py-6">
                <span className="block font-display text-[1.5rem] font-medium text-ink">{built.feature.title}</span>
                <span className="mt-2 block text-[1.0625rem] leading-relaxed text-ink-soft">{built.feature.body}</span>
              </figcaption>
            </figure>
            <ul className="grid gap-3">
              {built.cards.map((c) => (
                <li key={c.title} className="flex min-w-0 flex-col justify-center border border-ink/20 px-5 py-6">
                  <Icon name="building" />
                  <p className="mt-4 font-display text-[2rem] font-medium leading-none text-ink">{c.value}</p>
                  <p className="mt-2 font-mono text-register text-cinnabar">{c.title}</p>
                  <p className="mt-2 text-[1rem] leading-relaxed text-ink-soft">{c.body}</p>
                </li>
              ))}
            </ul>
          </div>
          <p className="bleed-margin mt-3 bg-white/55 px-5 py-4 text-[1.0625rem] leading-relaxed text-ink">{built.advocacy}</p>
          <div className="mt-10">
            <Button href={built.link.href} variant="outline">
              {built.link.label} →
            </Button>
          </div>
        </Leaf>

        <Leaf id="sustained" label={sustained.eyebrow} question={thread.sustained}>
          <Eyebrow>{sustained.eyebrow}</Eyebrow>
          <Heading>{sustained.heading}</Heading>
          <Prose>
            <p>{sustained.body}</p>
          </Prose>
          <Stats stats={sustained.stats} className="mt-10 [&>div]:bg-leaf-deep/50" />
          <Lede className="mt-8">{sustained.supporting}</Lede>
        </Leaf>

        <Leaf id="next" label={next.eyebrow} question={thread.next}>
          <Eyebrow>{next.eyebrow}</Eyebrow>
          <Heading>{next.heading}</Heading>
          <Prose>
            <p>{next.body}</p>
          </Prose>
          <figure className="bleed-margin mt-12">
            <div
              role="img"
              aria-label={`${next.progress.doneLabel} of ${next.progress.totalLabel}`}
              className="relative h-5 overflow-hidden bg-ink/10 outline outline-1 -outline-offset-1 outline-ink/20"
            >
              <span className="absolute inset-y-0 left-0 bg-cinnabar" style={{ width: `${Math.max(share, 1)}%` }} />
            </div>
            <div className="mt-3 flex flex-wrap justify-between gap-x-6 gap-y-1 font-mono text-register">
              <span className="text-cinnabar">{next.progress.doneLabel}</span>
              <span className="text-ink-faint">{next.progress.totalLabel}</span>
            </div>
            <figcaption className="mt-4 text-lede text-ink">{next.progress.caption}</figcaption>
          </figure>
          <ul className="bleed-margin mt-12 grid gap-3 md:grid-cols-2">
            {next.giving.map((g) => (
              <li key={g.title} className="min-w-0">
                <a href={g.href} className="group block h-full border border-ink/20 px-5 py-6 transition-colors hover:border-cinnabar">
                  <p className="font-mono text-register text-cinnabar">{g.title}</p>
                  <p className="mt-2 font-display text-[2.2rem] font-medium leading-none text-ink">{g.amount}</p>
                  <p className="mt-3 text-[1.0625rem] leading-relaxed text-ink-soft">{g.body}</p>
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-10">
            <Button href={next.button.href}>{next.button.label}</Button>
          </div>
        </Leaf>
        <section className="py-20 text-center lg:py-28">
          <p className="mx-auto max-w-[64ch] px-5 font-display text-[1.7rem] tracking-[0.04em] text-ink-soft [font-variant-caps:all-small-caps]">
            {next.closing.latin} · {next.closing.translation}
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}
