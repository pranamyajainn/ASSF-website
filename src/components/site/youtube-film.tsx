"use client";

import { useState } from "react";

/**
 * A YouTube film, at rest as its thumbnail with the same cinnabar seal as
 * the site's own recordings: nothing from YouTube runs until it is pressed,
 * and then it plays in YouTube's privacy-enhanced (no-cookie) player.
 */
export function YouTubeFilm({ id, title, playLabel, note, upright = false }: { id: string; title: string; playLabel: string; note: string; upright?: boolean }) {
  const [started, setStarted] = useState(false);
  return (
    <div className="relative w-full overflow-hidden bg-board-deep" style={{ aspectRatio: upright ? "9 / 16" : "16 / 9" }}>
      {started ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
          title={title}
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
          className="absolute inset-0 size-full border-0"
        />
      ) : (
        <button type="button" onClick={() => setStarted(true)} aria-label={`${playLabel} — ${title}`} className="group absolute inset-0 block size-full cursor-pointer">
          {/* eslint-disable-next-line @next/next/no-img-element -- YouTube's own thumbnail, not ours to optimise */}
          <img src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`} alt="" loading="lazy" className="absolute inset-0 size-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.025]" />
          <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-board-deep/85 via-board-deep/35 to-transparent" />
          <span aria-hidden="true" className="absolute bottom-4 left-4 flex items-center gap-3 sm:bottom-5 sm:left-5">
            <span className="grid size-12 place-items-center rounded-full bg-cinnabar text-leaf shadow-[0_0_0_4px_rgb(240_231_208/0.18)] transition-transform duration-300 group-hover:scale-110 sm:size-14">
              <svg viewBox="0 0 16 16" className="ml-0.5 size-4 sm:size-5" fill="currentColor">
                <path d="M4.5 2.75v10.5L13 8z" />
              </svg>
            </span>
            <span className="font-mono text-register leading-tight text-board-ink">
              {playLabel}
              <span className="block text-board-soft">{note}</span>
            </span>
          </span>
        </button>
      )}
    </div>
  );
}
