"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { FilmTrack } from "./voice-film";

/** A film, already resolved on the server: one of the site's own clips, or a YouTube id. */
export type GalleryFilm = { title: string; caption: string; poster: string; duration: string; src?: string; youtube?: string; tracks: FilmTrack[] };
export type GalleryPhoto = { src: string; alt: string };
export type GallerySub = { name: string; sub: string; note: string; photos: GalleryPhoto[]; videos: GalleryFilm[] };
export type GalleryFolder = { name: string; line: string; subs: GallerySub[] };
export type GalleryLabels = {
  folder: string;
  folders: string;
  photo: string;
  photos: string;
  video: string;
  videos: string;
  back: string;
  close: string;
  previous: string;
  next: string;
  play: string;
  youtube: string;
};

type Shown = { kind: "photo"; photo: GalleryPhoto } | { kind: "film"; film: GalleryFilm };

const OPEN = "gallery:open";

/** A button that opens one of the gallery's folders. */
export function SeeAll({ folder = 0, children, className }: { folder?: number; children: React.ReactNode; className?: string }) {
  return (
    <button type="button" onClick={() => window.dispatchEvent(new CustomEvent(OPEN, { detail: folder }))} className={className}>
      {children}
    </button>
  );
}

const posterOf = (film: GalleryFilm) => film.poster || (film.youtube ? `https://i.ytimg.com/vi/${film.youtube}/hqdefault.jpg` : "");
const count = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;

function Cover({ src, sizes, play = false, className = "" }: { src: string; sizes: string; play?: boolean; className?: string }) {
  return (
    <span className={`relative block overflow-hidden rounded-lg bg-leaf-deep ${className}`}>
      {src ? <Image src={src} alt="" fill sizes={sizes} className="object-cover transition-transform duration-700 group-hover:scale-[1.03]" unoptimized={src.startsWith("https://")} /> : null}
      {play ? (
        <span aria-hidden="true" className="absolute inset-0 grid place-items-center">
          <span className="grid size-11 place-items-center rounded-full bg-cinnabar text-leaf shadow-[0_0_0_4px_rgb(240_231_208/0.2)]">
            <svg viewBox="0 0 16 16" className="ml-0.5 size-4" fill="currentColor">
              <path d="M4.5 2.75v10.5L13 8z" />
            </svg>
          </span>
        </span>
      ) : null}
    </span>
  );
}

const closeIcon = (
  <svg aria-hidden="true" viewBox="0 0 16 16" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.6">
    <path d="M3.5 3.5l9 9M12.5 3.5l-9 9" />
  </svg>
);

/**
 * The gallery's folders: a folder opens a sheet of its sub-folders (or the
 * sub-folder itself when it has only one); a sub-folder shows its films and
 * photos; any of them opens full size in the viewer, whose arrows (and the
 * keyboard's) step through that sub-folder. Both are native modal dialogs,
 * so Escape and focus behave as the browser makes them.
 */
export function GalleryBrowser({ folders, labels }: { folders: GalleryFolder[]; labels: GalleryLabels }) {
  const sheet = useRef<HTMLDialogElement>(null);
  const viewer = useRef<HTMLDialogElement>(null);
  const [at, setAt] = useState<{ folder: number; sub: number | null }>({ folder: 0, sub: null });
  const [items, setItems] = useState<Shown[]>([]);
  const [k, setK] = useState(0);
  const [title, setTitle] = useState("");

  const folder = folders[at.folder];
  const sub = at.sub === null ? null : folder?.subs[at.sub];
  const only = folder?.subs.length === 1;

  function openFolder(i: number) {
    setAt({ folder: i, sub: folders[i].subs.length === 1 ? 0 : null });
    sheet.current?.showModal();
    sheet.current?.scrollTo(0, 0);
  }
  // "See all photos" in the latest event opens a folder from outside (see SeeAll).
  useEffect(() => {
    const open = (e: Event) => openFolder((e as CustomEvent<number>).detail);
    window.addEventListener(OPEN, open);
    return () => window.removeEventListener(OPEN, open);
  });

  function openViewer(list: Shown[], name: string, i: number) {
    setItems(list);
    setTitle(name);
    setK(i);
    viewer.current?.showModal();
  }
  const step = (d: number) => setK((n) => (n + d + items.length) % items.length);
  const shown = items[k];

  return (
    <>
      <ul className="bleed-margin mt-8 grid grid-cols-2 gap-x-5 gap-y-8 lg:grid-cols-4">
        {folders.map((f, i) => {
          const photos = f.subs.reduce((n, s) => n + s.photos.length, 0);
          const videos = f.subs.reduce((n, s) => n + s.videos.length, 0);
          const first = f.subs.find((s) => s.photos.length)?.photos[0]?.src ?? posterOf(f.subs[0]?.videos[0] ?? ({} as GalleryFilm));
          return (
            <li key={f.name} className="min-w-0">
              <button type="button" onClick={() => openFolder(i)} className="group block w-full cursor-pointer text-left">
                <span className="relative block">
                  <Cover src={first} sizes="(min-width: 1024px) 16rem, 46vw" className="aspect-[4/5] shadow-[0_18px_34px_-24px_rgb(0_0_0/0.65)]" />
                  <svg aria-hidden="true" viewBox="0 0 24 20" className="absolute bottom-3 left-3 h-7 w-8 text-orpiment drop-shadow">
                    <path fill="currentColor" d="M0 3a3 3 0 0 1 3-3h6l2.5 3H21a3 3 0 0 1 3 3v11a3 3 0 0 1-3 3H3a3 3 0 0 1-3-3z" />
                  </svg>
                </span>
                <span className="mt-3 block font-display text-[1.35rem] font-semibold leading-tight text-ink group-hover:text-cinnabar">{f.name}</span>
                <span className="mt-1 block text-[1rem] leading-snug text-ink-soft">{f.line}</span>
                <span className="mt-2 block font-mono text-[0.75rem] text-cinnabar">
                  {[count(f.subs.length, labels.folder, labels.folders), photos ? count(photos, labels.photo, labels.photos) : "", videos ? count(videos, labels.video, labels.videos) : ""].filter(Boolean).join(" · ")}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      <dialog
        ref={sheet}
        aria-label={sub?.name ?? folder?.name}
        onClick={(e) => e.target === e.currentTarget && e.currentTarget.close()}
        className="m-auto max-h-[90dvh] w-[min(64rem,calc(100vw-1.5rem))] overflow-y-auto rounded-xl bg-leaf p-0 text-ink shadow-2xl [background-image:var(--fibre)]"
      >
        <div className="sticky top-0 z-10 flex items-center justify-between bg-leaf/95 px-3 py-2">
          {sub && !only ? (
            <button type="button" onClick={() => setAt({ ...at, sub: null })} className="cursor-pointer px-2 py-1 font-mono text-register text-cinnabar hover:underline">
              ← {labels.back}
            </button>
          ) : (
            <span />
          )}
          <button type="button" onClick={() => sheet.current?.close()} aria-label={labels.close} className="grid size-10 cursor-pointer place-items-center text-ink-soft hover:text-cinnabar">
            {closeIcon}
          </button>
        </div>
        {folder ? (
          <div className="px-5 pb-8 sm:px-8">
            <p className="font-mono text-[0.78rem] text-cinnabar">{sub ? `${folder.name} · ${sub.sub}` : folder.name}</p>
            <h2 className="mt-1 font-display text-[clamp(1.7rem,1.3rem+1.2vw,2.4rem)] font-semibold leading-tight">{sub ? sub.name : folder.name}</h2>
            <p className="mt-2 max-w-[60ch] text-[1.05rem] leading-relaxed text-ink-soft">{sub ? sub.note : folder.line}</p>
            {sub ? (
              <>
                {sub.videos.length ? (
                  <>
                    <h3 className="mt-6 font-mono text-[0.75rem] uppercase tracking-[0.1em] text-ink-soft">{labels.videos}</h3>
                    <ul className="mt-3 grid grid-cols-2 gap-4 md:grid-cols-3">
                      {sub.videos.map((film, n) => (
                        <li key={`${film.title}-${n}`} className="min-w-0">
                          <button
                            type="button"
                            onClick={() => openViewer(sub.videos.map((f) => ({ kind: "film", film: f })), sub.name, n)}
                            className="group block w-full cursor-pointer text-left"
                            aria-label={`${labels.play} — ${film.title}`}
                          >
                            <span className="relative block">
                              <Cover src={posterOf(film)} sizes="(min-width: 768px) 19rem, 46vw" play className="aspect-video" />
                              {film.duration ? <span className="absolute bottom-2 right-2 rounded bg-board/80 px-1.5 font-mono text-[0.7rem] text-board-ink">{film.duration}</span> : null}
                            </span>
                            <span className="mt-2 block text-[1rem] leading-snug text-ink">{film.title}</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                    {sub.photos.length ? <h3 className="mt-8 font-mono text-[0.75rem] uppercase tracking-[0.1em] text-ink-soft">{labels.photos}</h3> : null}
                  </>
                ) : null}
                <ul className="mt-3 grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-4">
                  {sub.photos.map((photo, n) => (
                    <li key={`${photo.src}-${n}`}>
                      <button
                        type="button"
                        onClick={() => openViewer(sub.photos.map((p) => ({ kind: "photo", photo: p })), sub.name, n)}
                        className="group block w-full cursor-pointer"
                        aria-label={photo.alt}
                      >
                        <Cover src={photo.src} sizes="(min-width: 768px) 14rem, 46vw" className="aspect-[4/3] rounded-md" />
                      </button>
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <ul className="mt-6 grid grid-cols-2 gap-x-5 gap-y-7 md:grid-cols-3">
                {folder.subs.map((s, j) => (
                  <li key={s.name} className="min-w-0">
                    <button type="button" onClick={() => setAt({ ...at, sub: j })} className="group block w-full cursor-pointer text-left">
                      <Cover src={s.photos[0]?.src ?? posterOf(s.videos[0] ?? ({} as GalleryFilm))} sizes="(min-width: 768px) 19rem, 46vw" play={s.videos.length > 0} className="aspect-[4/3]" />
                      <span className="mt-2 block font-display text-[1.2rem] font-semibold leading-tight group-hover:text-cinnabar">{s.name}</span>
                      <span className="mt-0.5 block text-[0.95rem] leading-snug text-ink-soft">{s.sub}</span>
                      <span className="mt-1 block font-mono text-[0.72rem] text-cinnabar">
                        {[s.photos.length ? count(s.photos.length, labels.photo, labels.photos) : "", s.videos.length ? count(s.videos.length, labels.video, labels.videos) : ""].filter(Boolean).join(" · ")}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ) : null}
      </dialog>

      <dialog
        ref={viewer}
        aria-label={title}
        onClick={(e) => e.target === e.currentTarget && e.currentTarget.close()}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") step(-1);
          if (e.key === "ArrowRight") step(1);
        }}
        onClose={() => setItems([])}
        className="m-auto h-[92dvh] w-[min(72rem,calc(100vw-1rem))] max-w-none overflow-hidden rounded-xl bg-board-deep p-0 text-board-ink backdrop:bg-board-deep/80"
      >
        {shown ? (
          <div className="flex h-full flex-col">
            <div className="flex justify-end p-2">
              <button type="button" onClick={() => viewer.current?.close()} aria-label={labels.close} className="grid size-10 cursor-pointer place-items-center text-board-soft hover:text-leaf">
                {closeIcon}
              </button>
            </div>
            <div className="relative min-h-0 flex-1">
              {shown.kind === "photo" ? (
                <Image src={shown.photo.src} alt={shown.photo.alt} fill sizes="100vw" className="object-contain" />
              ) : shown.film.youtube ? (
                <iframe
                  key={shown.film.youtube}
                  src={`https://www.youtube-nocookie.com/embed/${shown.film.youtube}?autoplay=1&rel=0`}
                  title={shown.film.title}
                  allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                  allowFullScreen
                  className="absolute inset-0 size-full border-0"
                />
              ) : (
                <video key={shown.film.src} controls autoPlay playsInline poster={shown.film.poster} className="absolute inset-0 size-full object-contain">
                  <source src={shown.film.src} type="video/mp4" />
                  {shown.film.tracks.map((t) => (
                    <track key={t.src} kind="captions" src={t.src} srcLang={t.srclang} label={t.label} default={t.default} />
                  ))}
                </video>
              )}
              {items.length > 1 ? (
                <>
                  <button type="button" onClick={() => step(-1)} aria-label={labels.previous} className="absolute left-2 top-1/2 grid size-11 -translate-y-1/2 cursor-pointer place-items-center rounded-full bg-board/70 text-[1.6rem] leading-none text-leaf hover:bg-cinnabar">
                    ‹
                  </button>
                  <button type="button" onClick={() => step(1)} aria-label={labels.next} className="absolute right-2 top-1/2 grid size-11 -translate-y-1/2 cursor-pointer place-items-center rounded-full bg-board/70 text-[1.6rem] leading-none text-leaf hover:bg-cinnabar">
                    ›
                  </button>
                </>
              ) : null}
            </div>
            <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 px-5 py-4">
              <p className="min-w-0">
                <b className="block font-display text-[1.15rem]">{title}</b>
                <span className="text-[1rem] text-board-ink/85">{shown.kind === "photo" ? shown.photo.alt : shown.film.title}</span>
              </p>
              <small className="font-mono text-[0.78rem] text-board-soft">
                {k + 1} / {items.length}
              </small>
            </div>
          </div>
        ) : null}
      </dialog>
    </>
  );
}

/** The latest event: its photos turn every few seconds (not when motion is reduced, nor while pointed at); the dots choose one. */
export function LatestSlides({ slides, labels }: { slides: GalleryPhoto[]; labels: { photo: string } }) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused || slides.length < 2 || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setI((n) => (n + 1) % slides.length), 4500);
    return () => clearInterval(t);
  }, [paused, slides.length]);
  return (
    <div className="absolute inset-0" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      {slides.map((slide, n) => (
        <Image
          key={`${slide.src}-${n}`}
          src={slide.src}
          alt={n === i ? slide.alt : ""}
          fill
          priority={n === 0}
          sizes="(min-width: 1024px) 66rem, 100vw"
          className={`object-cover transition-opacity duration-1000 ${n === i ? "opacity-100" : "opacity-0"}`}
        />
      ))}
      <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-board-deep/90 via-board-deep/55 to-board-deep/10" />
      <div className="absolute bottom-6 left-6 z-10 flex gap-2 sm:left-10">
        {slides.map((_, n) => (
          <button
            key={n}
            type="button"
            aria-label={`${labels.photo} ${n + 1}`}
            aria-pressed={n === i}
            onClick={() => setI(n)}
            className={`h-1.5 w-7 cursor-pointer rounded-full ${n === i ? "bg-orpiment" : "bg-board-soft/50"}`}
          />
        ))}
      </div>
    </div>
  );
}
