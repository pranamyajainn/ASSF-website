import {
  Button,
  Container,
  EditorialNote,
  Heading,
  InlineLink,
  Lede,
  PersonGrid,
  Plate,
  Section,
} from "./primitives";
import { Reveal } from "./reveal";
import { FolioWall } from "./folio-wall";
import { adopt, board, field, lineage, standing, survey } from "@/content/home";

export function Adopt() {
  return (
    <Section id="adopt" gutter={adopt.gutter}>
      <Heading>{adopt.heading}</Heading>
      <Lede>{adopt.body}</Lede>

      <div className="mt-9 flex flex-wrap gap-4">
        <Button href={adopt.primary.href}>{adopt.primary.label}</Button>
        <Button href={adopt.secondary.href} variant="outline-dark">
          {adopt.secondary.label}
        </Button>
      </div>

      <div className="mt-12 border-t border-parchment/20 pt-6">
        <p className="font-sans text-base text-parchment/70">{adopt.ranksLabel}</p>
        <dl className="mt-5 max-w-3xl space-y-3.5">
          {adopt.ranks.map((rank) => (
            <div key={rank.latin} className="flex flex-wrap items-baseline gap-x-4">
              <dt
                className={`text-2xl ${rank.highest ? "text-gold" : "text-parchment"}`}
              >
                {rank.deva} <span className="ml-1">{rank.latin}</span>
              </dt>
              <span
                aria-hidden="true"
                className="hidden min-w-12 flex-1 translate-y-[-0.35rem] border-t border-dashed border-parchment/30 sm:block"
              />
              <dd className="font-sans text-sm text-accent">{adopt.thresholdNote}</dd>
            </div>
          ))}
        </dl>
      </div>

      <FolioWall total={adopt.wall.total} filled={adopt.wall.filled} />
      <p className="mt-5 max-w-[46ch] text-lg leading-snug text-parchment/80">
        {adopt.wall.note}
      </p>
    </Section>
  );
}

export function Lineage() {
  return (
    <Section id="lineage" gutter={lineage.gutter}>
      <Heading>{lineage.heading}</Heading>
      {lineage.paragraphs.map((p) => (
        <Lede key={p.slice(0, 24)}>{p}</Lede>
      ))}
      <EditorialNote>{lineage.note}</EditorialNote>
      <Plate
        className="mt-10 max-w-xl"
        src={lineage.plate.src}
        alt="India Post first-day cover bearing the ₹5 commemorative stamp for Acharya Shanti Sagar Ji Maharaj."
        caption={lineage.plate.caption}
        ratio="16 / 9"
      />
    </Section>
  );
}

export function Board() {
  return (
    <Section id="board" gutter={board.gutter}>
      <Heading>{board.heading}</Heading>
      <Lede>{board.intro}</Lede>

      <PersonGrid
        people={board.members.map((m) => ({
          name: m.name,
          rank: m.rank,
          body: m.affiliation,
          image: m.image,
        }))}
        columns={3}
      />

      <InlineLink href={board.link.href}>{board.link.label}</InlineLink>
    </Section>
  );
}

export function Field() {
  return (
    <Section id="field" gutter={field.gutter}>
      <Heading>{field.heading}</Heading>

      <ul className="mt-10 grid gap-x-10 gap-y-14 sm:grid-cols-2">
        {field.items.map((item) => (
          <li key={item.title} className="flex flex-col">
            <Plate src={item.image} alt="" ratio="16 / 9" />
            <p className="mt-5 font-sans text-sm text-parchment/70">{item.meta}</p>
            <h3
              lang="hi"
              className="mt-3 text-pretty text-2xl leading-snug text-parchment-bright"
            >
              {item.title}
            </h3>
            <p className="mt-4 max-w-[36ch] text-lg leading-relaxed text-parchment/85">
              {item.body}
            </p>
            <a
              href={item.href}
              className="mt-5 self-start border-b border-accent/40 pb-1 font-sans text-base text-accent transition-colors hover:border-accent"
            >
              {field.linkLabel}
            </a>
          </li>
        ))}
      </ul>
    </Section>
  );
}

export function Survey() {
  return (
    <section id="survey" className="scroll-mt-24 py-14 sm:py-20">
      <Container>
        <Reveal>
          <div className="border-t-2 border-rust bg-ink px-6 py-12 sm:px-14 sm:py-14">
            <Heading>{survey.heading}</Heading>
            <p className="mt-6 max-w-[52ch] text-lg leading-relaxed text-parchment/90 sm:text-xl">
              {survey.body}
            </p>
            <div className="mt-9 flex flex-wrap gap-4">
              <Button href={survey.primary.href}>{survey.primary.label}</Button>
              <Button href="tel:+918095588411" variant="outline-dark">
                +91 8095588411
              </Button>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

export function Standing() {
  const stateStyles = {
    recognised: "border-sage/70 text-parchment",
    verify: "border-accent/60 text-parchment",
    pending: "border-parchment/30 text-parchment/90",
  } as const;
  const stateLabels = {
    recognised: "recognised",
    verify: "",
    pending: "pending",
  } as const;

  return (
    <Section id="standing" gutter={standing.gutter}>
      <p className="max-w-[54ch] text-lg leading-relaxed text-parchment/90 sm:text-xl">
        {standing.body}
      </p>

      <ul className="mt-8 flex flex-wrap gap-3.5">
        {standing.badges.map((badge) => (
          <li
            key={badge.label}
            className={`flex items-baseline gap-3 border px-4 py-3 ${stateStyles[badge.state]}`}
          >
            <span className="font-sans text-base">{badge.label}</span>
            <span
              className={`font-sans text-sm ${
                badge.state === "pending" ? "text-rust-bright" : "text-accent"
              }`}
            >
              {badge.note ?? stateLabels[badge.state]}
            </span>
          </li>
        ))}
      </ul>

      <p className="mt-8 max-w-[58ch] text-lg leading-relaxed text-parchment/80">
        {standing.note}
      </p>
    </Section>
  );
}
