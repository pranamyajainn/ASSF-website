"use client";

import { useState } from "react";

/**
 * The Foundation's restoration film, in two states.
 *
 * At rest it is an ambient loop: muted, no chrome, no click-through — it
 * reads as a clip mounted on the page, not as "a YouTube embed". A clear
 * "Watch with sound" control sits on it; choosing it restarts the film from
 * the beginning with sound and the full player (pause, scrub, volume,
 * captions, fullscreen), because the film is narrated and was made to be
 * heard.
 *
 * The iframe is lazy-loaded: YouTube's player is about a megabyte of script,
 * and nobody should pay for it before they scroll near the film.
 */
export function VideoLoop({
  youtubeId,
  title,
  watchLabel,
  className = "",
  ratio = "16 / 9",
}: {
  youtubeId: string;
  title: string;
  /** "Watch with sound", in the page's language. */
  watchLabel: string;
  className?: string;
  ratio?: string;
}) {
  const [withSound, setWithSound] = useState(false);

  const loop = new URLSearchParams({
    autoplay: "1",
    mute: "1",
    loop: "1",
    playlist: youtubeId,
    controls: "0",
    modestbranding: "1",
    rel: "0",
    disablekb: "1",
    iv_load_policy: "3",
    playsinline: "1",
  });
  const full = new URLSearchParams({
    autoplay: "1",
    mute: "0",
    start: "0",
    controls: "1",
    modestbranding: "1",
    rel: "0",
    playsinline: "1",
    cc_load_policy: "1",
  });

  return (
    <div className={className}>
      <div className="relative w-full overflow-hidden bg-board-deep" style={{ aspectRatio: ratio }}>
        {withSound ? (
          <iframe
            key="full"
            src={`https://www.youtube-nocookie.com/embed/${youtubeId}?${full.toString()}`}
            title={title}
            allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 size-full"
          />
        ) : (
          <>
            <iframe
              key="loop"
              src={`https://www.youtube-nocookie.com/embed/${youtubeId}?${loop.toString()}`}
              title={title}
              loading="lazy"
              allow="autoplay; encrypted-media"
              aria-hidden="true"
              tabIndex={-1}
              className="pointer-events-none absolute inset-0 size-full"
            />
            {/* Blocks the player's own chrome — at rest this is a loop. */}
            <div className="absolute inset-0" aria-hidden="true" />
            <button
              type="button"
              onClick={() => setWithSound(true)}
              className="on-dark absolute bottom-4 left-4 flex items-center gap-2.5 bg-board/90 px-4 py-2.5 text-[1rem] text-board-ink transition-colors hover:bg-board sm:bottom-6 sm:left-6"
            >
              <SoundIcon />
              {watchLabel}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function SoundIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
      <path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M15.5 9a4.5 4.5 0 0 1 0 6M18 6.5a8 8 0 0 1 0 11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
