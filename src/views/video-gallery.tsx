import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { Leaf, PageHero } from "@/components/site/primitives";
import { VoiceFilm } from "@/components/site/voice-film";
import { tracksFor } from "@/components/site/voices";
import { YouTubeFilm } from "@/components/site/youtube-film";
import { getContent } from "@/i18n/content";
import { pageMetadata } from "@/i18n/metadata";
import { stripTags } from "@/lib/cms/stega";
import { youtubeId } from "@/lib/youtube";

export async function generateMetadata() {
  const { videos } = await getContent();
  return pageMetadata("videos", "/gallery/videos", videos.pageHero.body);
}

/**
 * Films of the Foundation's work. A film is one of the site's own
 * recordings — played as the Voices play it: a Voices recording takes its
 * poster, size and captions from the Voices, so they have one source; a
 * clip in /videos/gallery carries its own — or a YouTube link the
 * Foundation added in the site editor. A link that is none of these is
 * left off rather than shown broken.
 */
export default async function VideoGalleryPage() {
  const { videos, home, lang, ui } = await getContent();
  const { gallery, pageHero } = videos;
  const recordings = home.voices.heard.items;

  // The site's own clip, from a Voices recording or from the film's own poster, size and length.
  type Clip = { src: string; poster: string; width: number; height: number; duration: string; tracks: ReturnType<typeof tracksFor> };
  type Shown = { key: string; film: (typeof gallery.items)[number]; own: Clip | null; youtube: string | null };
  const films = gallery.items.flatMap((film, i): Shown[] => {
    // (A bare YouTube id is tagged in the editor's preview, like any text; links aren't.)
    const url = stripTags(film.url).trim();
    const voice = recordings.find((r) => r.video.src === url);
    if (voice) {
      const { captions, ...video } = voice.video;
      return [{ key: `own-${i}`, film, own: { ...video, tracks: tracksFor(captions, lang) }, youtube: null }];
    }
    if (url.startsWith("/videos/") && film.poster && film.width && film.height) {
      const clip = { src: url, poster: film.poster, width: film.width, height: film.height, duration: film.duration ?? "" };
      return [{ key: `own-${i}`, film, own: { ...clip, tracks: film.captions ? tracksFor(film.captions, lang) : [] }, youtube: null }];
    }
    const id = youtubeId(url);
    return id ? [{ key: `yt-${i}`, film, own: null, youtube: id }] : [];
  });

  return (
    <>
      <Header />
      <main id="main">
        <PageHero question={ui.steps.glance} {...pageHero} />

        <Leaf id="films" label={gallery.label} question={ui.steps.watch}>
          <h2 className="sr-only">{gallery.label}</h2>
          {films.length ? (
            <div className="bleed-margin grid items-start gap-x-10 gap-y-14 md:grid-cols-2">
              {films.map(({ key, film, own, youtube }) => {
                const upright = own ? own.height > own.width : film.url.includes("/shorts/");
                return (
                  <figure key={key} className="min-w-0">
                    <div className={upright ? "max-w-[20rem]" : ""}>
                      {own ? (
                        <VoiceFilm
                          src={own.src}
                          poster={own.poster}
                          width={own.width}
                          height={own.height}
                          duration={own.duration}
                          title={film.title}
                          playLabel={ui.gallery.play}
                          tracks={own.tracks}
                          sizes={upright ? "20rem" : "(min-width: 768px) 40vw, 90vw"}
                        />
                      ) : (
                        <YouTubeFilm id={youtube!} title={film.title} playLabel={ui.gallery.play} note={ui.gallery.youtube} upright={upright} />
                      )}
                    </div>
                    <figcaption className="mt-4">
                      <span className="block font-display text-[1.3rem] leading-snug text-ink">{film.title}</span>
                      {film.caption ? <span className="mt-1.5 block max-w-[52ch] font-mono text-register text-ink-faint">{film.caption}</span> : null}
                    </figcaption>
                  </figure>
                );
              })}
            </div>
          ) : (
            <p className="max-w-[56ch] border-l-2 border-cinnabar/60 pl-5 text-lede text-ink">{ui.gallery.noFilms}</p>
          )}
        </Leaf>
      </main>
      <Footer />
    </>
  );
}
