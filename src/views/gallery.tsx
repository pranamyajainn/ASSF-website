import Image from "next/image";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { GalleryBrowser, LatestSlides, SeeAll, type GalleryFilm } from "@/components/site/gallery-browser";
import { tracksFor } from "@/components/site/voices";
import { Heading, Leaf } from "@/components/site/primitives";
import type { Film } from "@/content/photo-gallery";
import { getContent } from "@/i18n/content";
import { pageMetadata } from "@/i18n/metadata";
import { stripTags } from "@/lib/cms/stega";
import { youtubeId } from "@/lib/youtube";

export async function generateMetadata() {
  const { photos } = await getContent();
  return pageMetadata("gallery", "/gallery", photos.pageHero.body);
}

/** Gallery (photos and films together), after the Foundation's page designs (Nov 2026). */
export default async function GalleryPage() {
  const { photos, lang, ui } = await getContent();
  const { pageHero, gallery } = photos;

  // A film is one of the site's own clips or a YouTube link; anything else is left off rather than shown broken.
  const resolve = (film: Film): GalleryFilm[] => {
    const url = stripTags(film.url).trim();
    const tracks = film.captions ? tracksFor(stripTags(film.captions), lang) : [];
    if (url.startsWith("/videos/") && film.poster) return [{ ...film, src: url, tracks }];
    const id = youtubeId(url);
    return id ? [{ ...film, youtube: id, tracks: [] }] : [];
  };
  const folders = gallery.folders.map((f) => ({ ...f, subs: f.subs.map((s) => ({ ...s, photos: [...s.photos], videos: s.videos.flatMap(resolve) })) }));
  const [film] = resolve(pageHero.film);

  return (
    <>
      <Header />
      <main id="main">
        <Leaf id="top" label={pageHero.label} question={pageHero.question} innerClassName="!pt-10 md:!pt-14 lg:!pt-16">
          <div className="bleed-margin relative min-h-[30rem] overflow-hidden rounded-xl bg-board-deep text-board-ink shadow-[0_18px_34px_-24px_rgb(0_0_0/0.65)] md:min-h-[32rem]">
            <LatestSlides slides={[...pageHero.slides]} labels={{ photo: ui.gallery.photo }} />
            <div className="relative z-10 flex min-h-[30rem] max-w-[40rem] flex-col justify-end px-6 pb-16 pt-10 sm:px-10 md:min-h-[32rem]">
              <p>
                <span className="rounded-full bg-cinnabar px-3 py-1 font-mono text-[0.72rem] uppercase tracking-[0.08em] text-leaf">{pageHero.tag}</span>
              </p>
              <p className="mt-4 font-mono text-[0.8rem] text-orpiment">{pageHero.date}</p>
              <h1 className="mt-2 text-balance font-display text-[clamp(2.2rem,1.6rem+2.4vw,3.6rem)] font-semibold leading-[1.05]">{pageHero.title}</h1>
              <p className="mt-3 text-[1.15rem] leading-snug text-board-ink/90">{pageHero.body}</p>
              <p className="mt-6">
                <SeeAll className="inline-flex min-h-12 cursor-pointer items-center bg-cinnabar px-6 py-3 text-[1.0625rem] text-leaf hover:bg-cinnabar-deep">{pageHero.button} →</SeeAll>
              </p>
            </div>
            {film?.src ? (
              <figure className="absolute right-4 top-4 z-10 hidden w-60 overflow-hidden rounded-lg border-[3px] border-leaf/80 bg-board shadow-xl md:block">
                <video muted loop playsInline autoPlay preload="metadata" poster={film.poster} aria-label={film.title} className="aspect-video w-full object-cover">
                  <source src={film.src} type="video/mp4" />
                </video>
                <span className="absolute left-2 top-2 flex items-center gap-1.5 rounded-full bg-board/80 px-2 py-0.5 font-mono text-[0.7rem] text-board-ink">
                  <i className="size-1.5 rounded-full bg-cinnabar" aria-hidden="true" />
                  {pageHero.filmLabel}
                </span>
                <figcaption className="px-2.5 py-1.5 font-mono text-[0.72rem] text-board-ink">{film.title}</figcaption>
              </figure>
            ) : film?.youtube ? (
              <figure className="absolute right-4 top-4 z-10 hidden w-60 overflow-hidden rounded-lg border-[3px] border-leaf/80 bg-board shadow-xl md:block">
                <div className="relative aspect-video">
                  <Image src={`https://i.ytimg.com/vi/${film.youtube}/hqdefault.jpg`} alt="" fill unoptimized className="object-cover" />
                </div>
                <figcaption className="px-2.5 py-1.5 font-mono text-[0.72rem] text-board-ink">{film.title}</figcaption>
              </figure>
            ) : null}
          </div>
        </Leaf>

        <Leaf id="folders" label={gallery.label} question={gallery.question}>
          <Heading>{gallery.heading}</Heading>
          <GalleryBrowser folders={folders} labels={ui.gallery} />
        </Leaf>
      </main>
      <Footer />
    </>
  );
}
