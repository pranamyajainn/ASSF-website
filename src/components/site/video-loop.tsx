/**
 * An ambient video loop: autoplaying, muted, no controls, no click-through —
 * it reads as a looping clip mounted on the page, not as "a YouTube embed".
 *
 * Still the Foundation's official player (youtube-nocookie.com), just
 * configured to strip every piece of chrome the API allows: no controls, no
 * related videos, minimal branding, no keyboard capture. A transparent,
 * non-interactive overlay sits on top so the whole thing behaves like a
 * looping clip rather than a clickable video player — you cannot pause it,
 * scrub it or land on youtube.com by touching it.
 */
export function VideoLoop({
  youtubeId,
  title,
  ratio = "16 / 9",
  className = "",
}: {
  youtubeId: string;
  title: string;
  ratio?: string;
  className?: string;
}) {
  const params = new URLSearchParams({
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

  return (
    <div className={className}>
      <div className="bg-board-deep">
        <div
          className="relative w-full overflow-hidden"
          style={{ aspectRatio: ratio }}
        >
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${youtubeId}?${params.toString()}`}
            title={title}
            allow="autoplay; encrypted-media"
            aria-hidden="true"
            tabIndex={-1}
            className="pointer-events-none absolute inset-0 size-full"
          />
          {/* Blocks all interaction — this reads as a loop, not a player. */}
          <div className="absolute inset-0" aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}
