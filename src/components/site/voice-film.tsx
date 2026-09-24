"use client";

import Image from "next/image";
import { useState } from "react";

export type FilmTrack = { src: string; srclang: string; label: string; default?: boolean };

/**
 * A recorded voice, mounted as a plate at the shape it was filmed — an
 * upright phone video stands upright, like a leaf held up to be read; it is
 * never cropped to fit a layout.
 *
 * At rest it is the speaker's photograph with one control: a cinnabar seal
 * to listen, and how long it runs. Nothing is fetched until that is pressed
 * (`preload="none"`, and the poster is an optimised image), so a page of
 * voices costs a page of photographs. Pressed, the plate becomes the
 * browser's own player — pause, scrub, volume, fullscreen, and the caption
 * tracks, with the edition's language chosen by default.
 */
export function VoiceFilm({
  src,
  poster,
  width,
  height,
  duration,
  title,
  playLabel,
  tracks,
  sizes,
  className = "",
}: {
  src: string;
  poster: string;
  width: number;
  height: number;
  /** "1:28" */
  duration: string;
  /** Who is speaking, for the control's accessible name. */
  title: string;
  /** "Listen", in the page's language. */
  playLabel: string;
  tracks: readonly FilmTrack[];
  sizes: string;
  className?: string;
}) {
  const [started, setStarted] = useState(false);

  return (
    <div
      className={`relative w-full overflow-hidden bg-board-deep ${className}`}
      style={{ aspectRatio: `${width} / ${height}` }}
    >
      {started ? (
        <video
          controls
          autoPlay
          playsInline
          preload="auto"
          poster={poster}
          className="absolute inset-0 size-full object-contain"
        >
          <source src={src} type="video/mp4" />
          {tracks.map((t) => (
            <track key={t.src} kind="captions" src={t.src} srcLang={t.srclang} label={t.label} default={t.default} />
          ))}
        </video>
      ) : (
        <button
          type="button"
          onClick={() => setStarted(true)}
          aria-label={`${playLabel} — ${title} (${duration})`}
          className="group absolute inset-0 block size-full cursor-pointer"
        >
          <Image
            src={poster}
            alt=""
            fill
            sizes={sizes}
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.025]"
          />
          <span
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-board-deep/85 via-board-deep/35 to-transparent"
          />
          <span aria-hidden="true" className="absolute bottom-4 left-4 flex items-center gap-3 sm:bottom-5 sm:left-5">
            <span className="grid size-12 place-items-center rounded-full bg-cinnabar text-leaf shadow-[0_0_0_4px_rgb(240_231_208/0.18)] transition-transform duration-300 group-hover:scale-110 sm:size-14">
              <svg viewBox="0 0 16 16" className="ml-0.5 size-4 sm:size-5" fill="currentColor">
                <path d="M4.5 2.75v10.5L13 8z" />
              </svg>
            </span>
            <span className="font-mono text-register leading-tight text-board-ink">
              {playLabel}
              <span className="block text-board-soft">{duration}</span>
            </span>
          </span>
        </button>
      )}
    </div>
  );
}
