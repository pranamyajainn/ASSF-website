import { Heading, Leaf, Prose } from "./primitives";
import { voices, type Voice } from "@/content/home";

/**
 * Voices from the work. A supplied testimonial is set large — the speaker's
 * own words are the one place on the page allowed to be louder than the
 * Foundation's — with the quotation mark hung in the margin. A place the
 * Foundation has not yet filled is drawn as a lost passage: rows of dots
 * where the lines would be, as a scribe marks a lacuna in the exemplar.
 */
export function Voices() {
  const [lead, ...rest] = voices.items;

  return (
    <Leaf id="voices" label={voices.label}>
      <Heading>{voices.heading}</Heading>
      <Prose>
        <p>{voices.lede}</p>
      </Prose>

      <div className="bleed-margin mt-12 border-t border-ink/20 pt-10">
        <VoiceEntry voice={lead} featured />
      </div>
      <div className="bleed-margin mt-10 grid gap-x-14 gap-y-10 border-t border-ink/20 pt-10 md:grid-cols-2">
        {rest.map((voice) => (
          <VoiceEntry key={voice.kind} voice={voice} />
        ))}
      </div>

      <p className="mt-10 font-mono text-register text-ink-faint">{voices.consentNote}</p>
    </Leaf>
  );
}

function VoiceEntry({ voice, featured = false }: { voice: Voice; featured?: boolean }) {
  const quoteSize = featured
    ? "text-[clamp(1.7rem,1.2rem+1.9vw,2.7rem)] leading-[1.25]"
    : "text-[clamp(1.35rem,1.15rem+0.8vw,1.75rem)] leading-[1.35]";

  if (!voice.quote) {
    return (
      <figure
        role="img"
        aria-label={`Not yet published: a testimonial from ${voice.kind.toLowerCase()}.`}
      >
        <p aria-hidden="true" className="font-mono text-register text-cinnabar">
          {voice.kind}
        </p>
        <LostPassage lines={featured ? [100, 94, 97, 58] : [100, 92, 64]} featured={featured} />
        <figcaption aria-hidden="true" className="mt-5 font-mono text-register text-ink-faint">
          — {voices.pendingNote}
        </figcaption>
      </figure>
    );
  }

  return (
    <figure className={voice.video && featured ? "grid gap-x-12 gap-y-8 lg:grid-cols-[minmax(0,1fr)_15rem]" : ""}>
      <div>
        <p className="font-mono text-register text-cinnabar">{voice.kind}</p>
        <blockquote className={`relative mt-4 max-w-[34ch] font-display text-ink ${quoteSize}`}>
          <span
            aria-hidden="true"
            className="absolute -left-[0.55em] top-0 text-cinnabar"
          >
            “
          </span>
          {voice.quote}
          <span aria-hidden="true" className="text-cinnabar">
            ”
          </span>
        </blockquote>
        <figcaption className="mt-5 font-mono text-register text-ink-soft">
          — {voice.name}
          {voice.role ? `, ${voice.role}` : ""}
          {voice.place ? ` · ${voice.place}` : ""}
        </figcaption>
      </div>
      {voice.video ? (
        <video
          controls
          playsInline
          preload="none"
          poster={voice.video.poster}
          className="aspect-[9/16] w-full max-w-[15rem] bg-board-deep"
        >
          <source src={voice.video.src} type="video/mp4" />
          <track kind="captions" src={voice.video.captions} srcLang="en" label="English" default />
        </video>
      ) : null}
    </figure>
  );
}

/** Rows of dots at the measure of the missing lines. */
function LostPassage({ lines, featured }: { lines: number[]; featured: boolean }) {
  return (
    <div aria-hidden="true" className={`mt-5 max-w-[34ch] ${featured ? "space-y-[1.15rem]" : "space-y-3.5"}`}>
      {lines.map((width, i) => (
        <span
          key={i}
          className={`lacuna block ${featured ? "h-3" : "h-2.5"}`}
          style={{ width: `${width}%`, animationDelay: `${i * 180}ms` }}
        />
      ))}
    </div>
  );
}
