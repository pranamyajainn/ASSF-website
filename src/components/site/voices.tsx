import { Heading, Leaf, Plate, Prose } from "./primitives";
import type { Voice } from "@/content/home";
import { getContent } from "@/i18n/content";

type VoicesContent = Awaited<ReturnType<typeof getContent>>["home"]["voices"];

/**
 * Voices from the work. Each entry is set as a critical edition sets a
 * source: the facsimile — a photograph of the handwritten page in the
 * visitors' book — facing its transcription, the words exactly as written,
 * with the quotation mark hung in the margin. The speaker's words are the
 * one thing on the page allowed to be louder than the Foundation's.
 *
 * Quotes stay in the language they were written in, in every edition; the
 * Hindi and Kannada editions add a marked translation beneath rather than
 * putting new words in the writer's mouth.
 *
 * A place the Foundation has reserved but not filled (`quote: null`) is
 * drawn as a lost passage: rows of dots where the lines would be.
 */
export async function Voices() {
  const { home } = await getContent();
  const { voices } = home;

  return (
    <Leaf id="voices" label={voices.label}>
      <Heading>{voices.heading}</Heading>
      <Prose>
        <p>{voices.lede}</p>
      </Prose>

      <div className="bleed-margin mt-12">
        {voices.items.map((voice, i) => (
          <VoiceEntry key={voice.kind} voice={voice} voices={voices} featured={i === 0} mirrored={i % 2 === 1} />
        ))}
      </div>

      <p className="mt-10 max-w-[60ch] font-mono text-register text-ink-faint">{voices.sourceNote}</p>
    </Leaf>
  );
}

function VoiceEntry({
  voice,
  voices,
  featured,
  mirrored,
}: {
  voice: Voice;
  voices: VoicesContent;
  featured: boolean;
  mirrored: boolean;
}) {
  if (!voice.quote) {
    return (
      <figure
        role="img"
        aria-label={`${voices.pendingNote}: ${voice.kind}`}
        className="border-t border-ink/20 py-10"
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

  const quoteSize = featured
    ? "text-[clamp(1.5rem,1.1rem+1.3vw,2.2rem)] leading-[1.3]"
    : "text-[clamp(1.25rem,1.1rem+0.6vw,1.6rem)] leading-[1.45]";

  const transcription = (
    <figure className="min-w-0">
      <p className="font-mono text-register text-cinnabar">{voice.kind}</p>
      <blockquote lang="en" className={`relative mt-5 max-w-[38ch] font-display text-ink ${quoteSize}`}>
        <span aria-hidden="true" className="absolute -left-[0.55em] top-0 text-cinnabar">
          “
        </span>
        {voice.quote}
        <span aria-hidden="true" className="text-cinnabar">
          ”
        </span>
      </blockquote>

      {voice.translation ? (
        <div className="mt-5 max-w-[52ch] border-l border-cinnabar/50 pl-4">
          <p className="font-mono text-register text-cinnabar">{voices.translationLabel}</p>
          <p className="mt-1 text-[1.0625rem] leading-relaxed text-ink-soft">{voice.translation}</p>
        </div>
      ) : null}

      <figcaption className="mt-6 max-w-[52ch] font-mono text-register text-ink-soft">
        <span className="text-ink">— {voice.name}</span>
        {voice.role ? <span className="block">{voice.role}</span> : null}
        {voice.place ? <span className="block">{voice.place}</span> : null}
        {voice.alongside ? <span className="mt-1 block text-ink-faint">{voice.alongside}</span> : null}
      </figcaption>
    </figure>
  );

  // The handwriting is the evidence: a click opens the page at full size.
  const facsimile = voice.facsimile ? (
    <a
      href={voice.facsimile.src}
      target="_blank"
      rel="noopener"
      title={voices.zoomLabel}
      className="group block cursor-zoom-in"
    >
      <Plate
        src={voice.facsimile.src}
        alt={voice.facsimile.alt}
        caption={voice.facsimile.caption}
        ratio={voice.facsimile.ratio}
        sizes="(min-width: 1024px) 24rem, 100vw"
        className="w-full transition-opacity group-hover:opacity-90"
      />
      <span className="sr-only">{voices.zoomLabel}</span>
    </a>
  ) : null;

  return (
    <div
      className={`grid items-start gap-x-14 gap-y-8 border-t border-ink/20 py-12 ${
        !facsimile
          ? ""
          : mirrored
            ? "lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)]"
            : "lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)]"
      }`}
    >
      {mirrored && facsimile ? (
        <>
          <div className="order-2 lg:order-1">{facsimile}</div>
          <div className="order-1 lg:order-2">{transcription}</div>
        </>
      ) : (
        <>
          {transcription}
          {facsimile}
        </>
      )}
    </div>
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
