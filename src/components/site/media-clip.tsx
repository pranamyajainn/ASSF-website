"use client";

import Image from "next/image";
import { useState } from "react";
import { youtubeId } from "@/lib/youtube";

/**
 * A card's photograph — or, when the card has a short video, that photograph
 * as its cover with a play seal ("Watch · 1 min"). Nothing loads until it is
 * pressed; then the video plays in place with its sound off, which the
 * visitor can turn on (page designs, Nov 2026). `clip` is a YouTube link, or
 * one of the site's own recordings in /videos.
 */
export function MediaClip({
  image,
  clip,
  length,
  watchLabel,
  sizes,
  className = "aspect-[4/3]",
}: {
  image: { src: string; alt: string };
  clip?: string;
  length?: string;
  watchLabel: string;
  sizes: string;
  className?: string;
}) {
  const [playing, setPlaying] = useState(false);
  const yt = clip ? youtubeId(clip) : null;
  const own = clip && /^\/videos\/[\w\-./]+\.(mp4|webm)$/.test(clip.trim()) ? clip.trim() : null;
  const frame = `relative overflow-hidden rounded-[3px] bg-leaf-deep outline outline-1 -outline-offset-1 outline-ink/15 ${className}`;

  if (playing && yt) {
    return (
      <div className={frame}>
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${yt}?autoplay=1&mute=1&rel=0`}
          title={image.alt}
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
          className="absolute inset-0 size-full border-0"
        />
      </div>
    );
  }
  if (playing && own) {
    return (
      <div className={frame}>
        <video src={own} poster={image.src} autoPlay muted controls playsInline className="absolute inset-0 size-full bg-board-deep object-contain" />
      </div>
    );
  }

  const photo = image.src ? <Image src={image.src} alt={yt || own ? "" : image.alt} fill sizes={sizes} className="object-cover" /> : null;
  if (!yt && !own) return <div className={frame}>{photo}</div>;
  return (
    <button type="button" onClick={() => setPlaying(true)} aria-label={`${watchLabel}${length ? ` · ${length}` : ""} — ${image.alt}`} className={`group block w-full cursor-pointer ${frame}`}>
      {photo}
      <span aria-hidden="true" className="absolute inset-0 grid place-items-center bg-board-deep/15 transition-colors group-hover:bg-board-deep/5">
        <span className="flex flex-col items-center gap-2">
          <span className="grid size-12 place-items-center rounded-full bg-cinnabar text-leaf shadow-[0_0_0_4px_rgb(240_231_208/0.25)] transition-transform duration-300 group-hover:scale-110">
            <svg viewBox="0 0 16 16" className="ml-0.5 size-4" fill="currentColor">
              <path d="M4.5 2.75v10.5L13 8z" />
            </svg>
          </span>
          <span className="bg-board-deep/55 px-2 py-0.5 font-mono text-register text-board-ink">
            {watchLabel}
            {length ? ` · ${length}` : ""}
          </span>
        </span>
      </span>
    </button>
  );
}
