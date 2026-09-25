import {
  Button,
  Container,
  EditorialNote,
  Heading,
  InlineLink,
  Leaf,
  Pending,
  PersonGrid,
  Plate,
  Prose,
} from "./primitives";
import { FolioWall } from "./folio-wall";
import { getContent } from "@/i18n/content";
import { scriptLang } from "@/lib/deva";

/**
 * Join the work. Giving is one way in among several, never the loudest thing
 * on the page: the four ways sit as equals in one register, custodians
 * first. Folio adoption follows as a quieter sub-section — its price stated
 * once, in a sentence, beside the folio bundle on its wrapping cloth.
 */
export async function Join() {
  const { home, ui } = await getContent();
  const { join, adopt } = home;
  return (
    <Leaf id="join" label={join.label} question={ui.steps.help}>
      <Heading>{join.heading}</Heading>
      <Prose>
        {join.body.map((p) => (
          <p key={p.slice(0, 24)}>{p}</p>
        ))}
      </Prose>

      <ul className="bleed-margin mt-12 grid border-t border-ink/20 sm:grid-cols-2">
        {join.ways.map((way, i) => (
          <li
            key={way.title}
            className={`flex flex-col border-b border-ink/20 py-8 sm:pr-10 ${
              i % 2 === 1 ? "sm:border-l sm:border-ink/20 sm:pl-10" : ""
            }`}
          >
            <h3 className="font-display text-[1.55rem] font-medium leading-tight text-ink">{way.title}</h3>
            <p className="mt-2.5 max-w-[40ch] text-[1.0625rem] leading-relaxed text-ink-soft">{way.body}</p>
            <InlineLink href={way.link.href} className="mt-auto pt-5">
              {way.link.label}
            </InlineLink>
          </li>
        ))}
      </ul>

      <div id="adopt" className="bleed-margin mt-20 scroll-mt-6 grid gap-x-16 gap-y-12 border-t border-ink/20 pt-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div>
          <Heading as="h3" size="sub">
            {adopt.heading}
          </Heading>
          <p className="mt-5 max-w-[48ch] text-[1.0625rem] leading-relaxed text-ink-soft">{adopt.body}</p>
          <InlineLink href={adopt.link.href} className="mt-5">
            {adopt.link.label}
          </InlineLink>
        </div>

        <div className="lg:pt-2">
          <p className="font-mono text-register text-ink-faint">{ui.home.bundleLabel}</p>
          <FolioWall label={ui.home.bundleAria} note={adopt.wall.note} clothLabel={adopt.wall.clothLabel} />
        </div>
      </div>
    </Leaf>
  );
}

/**
 * Lineage. The Foundation's namesake, in a real photograph — small, as a
 * photograph of that age should be shown, not blown up to fill a banner —
 * beside his full name in Devanagari, the script it is written in.
 */
export async function Lineage() {
  const { home, ui } = await getContent();
  const { lineage } = home;
  return (
    <Leaf id="lineage" label={lineage.label} question={ui.steps.whose}>
      <div className="bleed-margin grid gap-x-14 gap-y-10 lg:grid-cols-[15rem_minmax(0,1fr)]">
        <div>
          <Plate
            src={lineage.portrait.src}
            alt={lineage.portrait.alt}
            caption={lineage.portrait.caption}
            ratio="297 / 402"
            className="max-w-[15rem]"
            sizes="15rem"
            imageClassName="object-cover grayscale"
          />
        </div>

        <div className="min-w-0">
          <p
            lang={scriptLang(lineage.nameDeva)}
            className="max-w-[20ch] font-display text-[clamp(1.6rem,1.2rem+1.5vw,2.4rem)] leading-[1.25] text-cinnabar"
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

          <blockquote className="mt-10 max-w-[36ch] border-l border-cinnabar/60 pl-5">
            <p lang="hi" className="font-display text-[1.5rem] leading-snug text-ink">
              {lineage.epigraph}
            </p>
          </blockquote>

          {lineage.note ? <EditorialNote className="mt-10">{lineage.note}</EditorialNote> : null}

          <Plate
            className="mt-10 max-w-xl"
            src={lineage.plate.src}
            alt={lineage.plate.alt}
            caption={lineage.plate.caption}
            ratio="768 / 398"
            sizes="(min-width: 1024px) 36rem, 100vw"
          />
        </div>
      </div>
    </Leaf>
  );
}

export async function Board() {
  const { home, ui } = await getContent();
  const { board, standing } = home;
  return (
    <Leaf id="board" label={board.label} question={ui.steps.guides}>
      <Heading>{board.heading}</Heading>
      <Prose>
        <p>{board.intro}</p>
      </Prose>
      <p className="mt-6 flex max-w-[60ch] items-start gap-3 font-mono text-register text-ink">
        <span aria-hidden="true" className="mt-1 size-2.5 shrink-0 rounded-full bg-cinnabar" />
        {standing.body}
      </p>
      <div className="bleed-margin">
        <PersonGrid
          people={board.members.map((m) => ({
            name: m.name,
            rank: m.rank,
            body: m.affiliation,
            image: m.image,
          }))}
          columns={4}
        />
      </div>
      <InlineLink href={board.link.href}>{board.link.label}</InlineLink>
    </Leaf>
  );
}

/**
 * From the field: dispatches as a register of entries — date and place
 * typed in the margin of each entry, the Foundation's own Hindi headline
 * set large, the English summary beneath. An undated dispatch shows its
 * date as a lacuna rather than picking one of two conflicting dates.
 */
export async function Field() {
  const { home, ui } = await getContent();
  const { field } = home;
  return (
    <Leaf id="field" label={field.label} question={ui.steps.news}>
      <Heading>{field.heading}</Heading>
      <Prose>
        <p>{field.lede}</p>
      </Prose>
      <ol className="bleed-margin mt-10 border-t border-ink/20">
        {field.items.map((item) => (
          <li
            key={item.title}
            className="grid gap-x-10 gap-y-3 border-b border-ink/20 py-7 md:grid-cols-[11rem_minmax(0,1fr)]"
          >
            <p className="font-mono text-register text-ink-faint">
              {item.date ?? <Pending width="3rem" label={ui.common.dateToVerify} />}
              <span className="block">{item.place}</span>
            </p>
            <div>
              <h3
                lang="hi"
                className="max-w-[34ch] text-pretty font-display text-[clamp(1.35rem,1.15rem+0.7vw,1.75rem)] leading-[1.35] text-ink"
              >
                {item.title}
              </h3>
              <p className="mt-2.5 max-w-[60ch] text-[1.0625rem] leading-relaxed text-ink-soft">
                {item.body}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </Leaf>
  );
}

export async function Standing() {
  const { home, ui } = await getContent();
  const { standing } = home;
  const states = ui.home.standingStates;
  return (
    <Leaf id="standing" label={standing.label}>
      <Heading>{ui.home.standingHeading}</Heading>
      <Prose>
        <p>{standing.body}</p>
      </Prose>
      <ul className="mt-10 max-w-[46rem] border-t border-ink/20">
        {standing.badges.map((badge) => (
          <li
            key={badge.label}
            className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-ink/20 py-4"
          >
            <span className="text-[1.0625rem] text-ink">{badge.label}</span>
            <span aria-hidden="true" className="leader hidden sm:block" />
            {badge.state === "recognised" ? (
              <span className="ml-auto inline-flex items-center gap-2 font-mono text-register text-ink">
                <span
                  aria-hidden="true"
                  className="size-2.5 rounded-full bg-cinnabar"
                />
                {badge.note ?? states.recognised}
              </span>
            ) : (
              <span className="ml-auto">
                <Pending width="3rem" label={badge.note ?? states[badge.state]} />
              </span>
            )}
          </li>
        ))}
      </ul>
      <EditorialNote className="mt-8">{standing.note}</EditorialNote>
    </Leaf>
  );
}

/**
 * The survey call, addressed to custodians — temple committees, maths,
 * families holding a bundle. It is set on the red cloth a bundle is wrapped
 * in, and the phone number is the largest thing in it: for this reader, a
 * call is the likeliest way in.
 */
export async function Survey() {
  const { home, shared } = await getContent();
  const { survey } = home;
  const { org } = shared;
  const tel = `tel:${org.phone.replace(/\s/g, "")}`;
  return (
    <section
      id="survey"
      className="on-dark scroll-mt-6 bg-cloth text-leaf"
      style={{ backgroundImage: "var(--weave)" }}
    >
      <Container>
        <div className="grid gap-x-16 gap-y-10 py-16 md:grid-cols-[5.5rem_minmax(0,1fr)] md:py-20 lg:grid-cols-[7.5rem_minmax(0,1fr)_minmax(0,22rem)] lg:py-24">
          <p aria-hidden="true" className="hidden font-display text-[2.4rem] leading-none text-orpiment md:block">
            ॥
          </p>
          <div className="min-w-0">
            <h2 className="max-w-[16ch] text-balance font-display text-title font-medium">
              {survey.heading}
            </h2>
            <p className="mt-6 max-w-[54ch] text-lede text-leaf/90">{survey.body}</p>
            <div className="mt-9">
              <Button href={survey.primary.href} variant="outline-dark">
                {survey.primary.label}
              </Button>
            </div>
          </div>
          <div className="self-end md:col-start-2 lg:col-start-auto">
            <p className="font-mono text-register text-orpiment">{survey.callLabel}</p>
            <a
              href={tel}
              className="mt-3 block font-display text-[clamp(2rem,1.4rem+2.2vw,3rem)] font-medium leading-none tracking-[-0.01em] underline decoration-leaf/30 decoration-2 underline-offset-[10px] hover:decoration-orpiment"
            >
              {org.phone}
            </a>
            <p className="mt-5 font-mono text-register text-leaf/85">{org.email}</p>
          </div>
        </div>
      </Container>
    </section>
  );
}
