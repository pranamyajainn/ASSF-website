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
 * Films of the Foundation's work. A film is either one of the site's own
 * recordings — played as the Voices play it, with its captions in all three
 * languages (its poster, size and captions come from the Voices, so they
 * have one source) — or a YouTube link the Foundation added in the site
 * editor. A link that is neither is left off rather than shown broken.
 */
export default async function VideoGalleryPage() {
  const { videos, home, lang, ui } = await getContent();
  const { gallery, pageHero } = videos;
  const recordings = home.voices.heard.items;

  type Shown = { key: string; film: (typeof gallery.items)[number]; own: (typeof recordings)[number] | null; youtube: string | null };
  const films = gallery.items.flatMap((film, i): Shown[] => {
    // (A bare YouTube id is tagged in the editor's preview, like any text; links aren't.)
    const url = stripTags(film.url).trim();
    const own = recordings.find((r) => r.video.src === url);
    if (own) return [{ key: `own-${i}`, film, own, youtube: null }];
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
                const upright = own ? own.video.height > own.video.width : film.url.includes("/shorts/");
                return (
                  <figure key={key} className="min-w-0">
                    <div className={upright ? "max-w-[20rem]" : ""}>
                      {own ? (
                        <VoiceFilm
                          src={own.video.src}
                          poster={own.video.poster}
                          width={own.video.width}
                          height={own.video.height}
                          duration={own.video.duration}
                          title={film.title}
                          playLabel={ui.gallery.play}
                          tracks={tracksFor(own.video.captions, lang)}
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
