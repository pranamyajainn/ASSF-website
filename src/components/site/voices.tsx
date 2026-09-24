import { Heading, Leaf, Plate, Prose } from "./primitives";
import { VoiceFilm, type FilmTrack } from "./voice-film";
import type { HeardVoice, Voice } from "@/content/home";
import { getContent } from "@/i18n/content";
import type { Lang } from "@/i18n/config";

type VoicesContent = Awaited<ReturnType<typeof getContent>>["home"]["voices"];

/** Caption tracks sit beside each video as `<name>.<lang>.vtt`. */
const trackLabels: Record<Lang, string> = { hi: "हिन्दी", en: "English", kn: "ಕನ್ನಡ" };
function tracksFor(base: string, lang: Lang): FilmTrack[] {
  return (["hi", "en", "kn"] as const).map((l) => ({
    src: `${base}.${l}.vtt`,
    srclang: l,
    label: trackLabels[l],
    default: l === lang,
  }));
}

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
 *
 * The voices come in two registers, as the tradition itself does: śruta,
 * what was heard — the Jain canon was carried by the ear before it was ever
 * written — and likhita, what was written. Recordings come first.
 */
export async function Voices() {
  const { home, lang } = await getContent();
  const { voices } = home;
  const { heard, written } = voices;

  return (
    <Leaf id="voices" label={voices.label}>
      <Heading>{voices.heading}</Heading>
      <Prose>
        <p>{voices.lede}</p>
      </Prose>

      <div className="bleed-margin mt-12">
        <Register native={heard.native} label={heard.label} note={heard.note} />
        {heard.items.map((voice, i) => (
          <HeardEntry key={voice.key} voice={voice} voices={voices} lang={lang} upright={voice.video.height > voice.video.width} mirrored={i % 2 === 1} first={i === 0} />
        ))}

        <Register native={written.native} label={written.label} note={voices.sourceNote} className="mt-10" />
        {voices.items.map((voice, i) => (
          <VoiceEntry key={voice.kind} voice={voice} voices={voices} featured={i === 0} mirrored={i % 2 === 1} first={i === 0} />
        ))}
      </div>
    </Leaf>
  );
}

/** The head of a register: its name in the script of the tradition, cinnabar. */
function Register({ native, label, note, className = "" }: { native: string; label: string; note: string; className?: string }) {
  return (
    <div className={`flex flex-wrap items-baseline gap-x-4 gap-y-1.5 border-b border-cinnabar/45 pb-3 ${className}`}>
      <span lang="hi" className="font-display text-[1.75rem] leading-none text-cinnabar">
        {native}
      </span>
      <span className="font-mono text-register text-ink">{label}</span>
      <span className="basis-full font-mono text-register text-ink-faint sm:basis-auto">— {note}</span>
    </div>
  );
}

/**
 * A recorded voice: the film at the shape it was shot, and beside it the
 * line that carries it — in the speaker's own words and script, with the
 * edition's translation under it — then who is speaking, and the whole
 * recording written out for anyone who would rather read than listen.
 */
function HeardEntry({
  voice,
  voices,
  lang,
  upright,
  mirrored,
  first,
}: {
  voice: HeardVoice;
  voices: VoicesContent;
  lang: Lang;
  upright: boolean;
  mirrored: boolean;
  /** The register's head already rules the top of the first entry. */
  first: boolean;
}) {
  const { heard } = voices;
  const speaker = voice.name ?? heard.nameAwaited;

  const film = (
    <div className={upright ? "w-full max-w-[16rem] sm:max-w-[19rem]" : "w-full"}>
      <VoiceFilm
        src={voice.video.src}
        poster={voice.video.poster}
        width={voice.video.width}
        height={voice.video.height}
        duration={voice.video.duration}
        title={voice.name ?? voice.kind}
        playLabel={heard.listen}
        tracks={tracksFor(voice.video.captions, lang)}
        sizes={upright ? "(min-width: 640px) 19rem, 16rem" : "(min-width: 1024px) 32rem, 100vw"}
      />
    </div>
  );

  const words = (
    <figure className="min-w-0">
      <p className="font-mono text-register text-cinnabar">{voice.kind}</p>
      <blockquote
        lang={voice.lang}
        className="relative mt-5 max-w-[30ch] font-display text-[clamp(1.45rem,1.05rem+1.25vw,2.15rem)] leading-[1.4] text-ink"
      >
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
        <span className={voice.name ? "text-ink" : "text-ink-faint"}>— {speaker}</span>
        {voice.role ? <span className="block">{voice.role}</span> : null}
      </figcaption>

      <details className="group mt-6 max-w-[60ch]">
        <summary className="cursor-pointer list-none font-mono text-register text-ink underline decoration-cinnabar/70 underline-offset-4 transition-colors hover:text-cinnabar [&::-webkit-details-marker]:hidden">
          <span aria-hidden="true" className="mr-2 inline-block text-cinnabar transition-transform group-open:rotate-90">
            ›
          </span>
          {heard.transcriptLabel}
        </summary>
        <div className="mt-4 space-y-4 border-l border-ink/15 pl-4">
          <p lang={voice.lang} className="text-[1.0625rem] leading-relaxed text-ink">
            {voice.transcript}
          </p>
          {voice.transcriptTranslation ? (
            <p className="text-[1rem] leading-relaxed text-ink-soft">{voice.transcriptTranslation}</p>
          ) : null}
          <p className="font-mono text-register text-ink-faint">{heard.transcriptNote}</p>
        </div>
      </details>
    </figure>
  );

  // Upright films take a narrow column; landscape ones a wide one. The
  // second entry mirrors the first, so the column of films zigzags.
  const cols = upright
    ? mirrored
      ? "lg:grid-cols-[minmax(0,1fr)_minmax(0,19rem)]"
      : "lg:grid-cols-[minmax(0,19rem)_minmax(0,1fr)]"
    : mirrored
      ? "lg:grid-cols-[minmax(0,1fr)_minmax(0,32rem)]"
      : "lg:grid-cols-[minmax(0,32rem)_minmax(0,1fr)]";

  return (
    <div className={`grid items-center gap-x-14 gap-y-8 py-12 ${first ? "" : "border-t border-ink/20"} ${cols}`}>
      {mirrored ? (
        <>
          <div className="lg:order-2">{film}</div>
          <div className="lg:order-1">{words}</div>
        </>
      ) : (
        <>
          {film}
          {words}
        </>
      )}
    </div>
  );
}

function VoiceEntry({
  voice,
  voices,
  featured,
  mirrored,
  first,
}: {
  voice: Voice;
  voices: VoicesContent;
  featured: boolean;
  mirrored: boolean;
  first: boolean;
}) {
  const rule = first ? "" : "border-t border-ink/20";
  if (!voice.quote) {
    return (
      <figure
        role="img"
        aria-label={`${voices.pendingNote}: ${voice.kind}`}
        className={`py-10 ${rule}`}
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
      className={`grid items-start gap-x-14 gap-y-8 py-12 ${rule} ${
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
