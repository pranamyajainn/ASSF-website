"use client";

import { useRef } from "react";
import Image from "next/image";

type Person = { name: string; rank: string; body?: string; bio?: readonly string[]; image: string };
export type ProfileLabels = { open: string; close: string };

/**
 * One portrait in the wall. Full colour, always — the photo is the point.
 *
 * Moving the cursor across the mounted photo tilts it gently in 3D toward
 * the pointer and sweeps a soft light across the surface, the way light
 * catches a photograph under glass as you shift where you're standing. Both
 * are driven by CSS custom properties written directly to the element on
 * `mousemove` (no React state, no re-render per pixel of cursor travel);
 * the `transition` on `transform`/opacity is what turns the raw pointer
 * position into a motion that eases and settles rather than snapping.
 * Touch devices simply never fire `mousemove`, so the card sits still and
 * legible there — nothing is lost, only the flourish.
 */
export function PersonCard({ person, labels }: { person: Person; labels?: ProfileLabels }) {
  const mountRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDialogElement>(null);
  const hasProfile = Boolean(labels && person.bio && person.bio.length > 0);

  function handleMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = mountRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    const maxTilt = 10;
    el.style.setProperty("--tilt-x", `${((0.5 - py) * 2 * maxTilt).toFixed(2)}deg`);
    el.style.setProperty("--tilt-y", `${((px - 0.5) * 2 * maxTilt).toFixed(2)}deg`);
    el.style.setProperty("--glow-x", `${(px * 100).toFixed(1)}%`);
    el.style.setProperty("--glow-y", `${(py * 100).toFixed(1)}%`);
    el.style.setProperty("--glow-o", "1");
    el.style.setProperty("--lift", "1");
  }

  function handleLeave() {
    const el = mountRef.current;
    if (!el) return;
    el.style.setProperty("--tilt-x", "0deg");
    el.style.setProperty("--tilt-y", "0deg");
    el.style.setProperty("--glow-o", "0");
    el.style.setProperty("--lift", "0");
  }

  return (
    <li className="group">
      <div className="outline outline-1 -outline-offset-1 outline-ink/15" style={{ perspective: "1000px" }}>
        <div
          ref={mountRef}
          onMouseMove={handleMove}
          onMouseLeave={handleLeave}
          className="person-tilt relative aspect-[4/5] w-full overflow-hidden bg-leaf-deep"
        >
          <Image
            src={person.image}
            alt={person.name}
            fill
            sizes="(min-width: 1024px) 22vw, 45vw"
            className="object-cover"
          />
          <div className="person-glow" aria-hidden="true" />
        </div>
      </div>
      <div className="mt-4 border-t border-ink/20 pt-3 transition-colors duration-300 group-hover:border-cinnabar">
        <h3 className="font-display text-[1.2rem] font-medium leading-snug text-ink">{person.name}</h3>
        <p className="mt-1.5 font-mono text-register text-cinnabar">{person.rank}</p>
      </div>
      {person.body ? <p className="mt-2.5 text-[0.98rem] leading-snug text-ink-soft">{person.body}</p> : null}

      {hasProfile && labels ? (
        <>
          <button
            type="button"
            onClick={() => profileRef.current?.showModal()}
            className="mt-3 cursor-pointer font-mono text-register text-ink underline decoration-cinnabar/70 decoration-1 underline-offset-4 transition-colors hover:text-cinnabar"
          >
            {labels.open} →
          </button>
          <Profile ref={profileRef} person={person} labels={labels} />
        </>
      ) : null}
    </li>
  );
}

/**
 * The whole profile, as the Foundation wrote it: a leaf laid over the page
 * with the portrait, the role and every paragraph. A native modal <dialog>,
 * so focus is held inside it and Escape closes it; a click on the dimmed
 * page behind closes it too.
 */
function Profile({
  ref,
  person,
  labels,
}: {
  ref: React.Ref<HTMLDialogElement>;
  person: Person;
  labels: ProfileLabels;
}) {
  return (
    <dialog
      ref={ref}
      aria-label={person.name}
      onClick={(e) => {
        if (e.target === e.currentTarget) e.currentTarget.close();
      }}
      className="profile m-auto max-h-[88dvh] w-[min(56rem,calc(100vw-2rem))] overflow-y-auto bg-leaf p-0 text-ink shadow-2xl [background-image:var(--fibre)]"
    >
      <form method="dialog" className="sticky top-0 z-10 flex justify-end">
        <button
          type="submit"
          aria-label={labels.close}
          className="m-2 grid size-10 cursor-pointer place-items-center bg-leaf/90 text-ink-soft transition-colors hover:text-cinnabar"
        >
          <svg aria-hidden="true" viewBox="0 0 16 16" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d="M3.5 3.5l9 9M12.5 3.5l-9 9" />
          </svg>
        </button>
      </form>
      <div className="-mt-10 grid gap-x-10 gap-y-6 p-6 sm:p-10 md:grid-cols-[15rem_minmax(0,1fr)]">
        <div className="relative aspect-[4/5] w-full max-w-[9rem] overflow-hidden sm:max-w-[12rem] md:max-w-[15rem] bg-leaf-deep outline outline-1 -outline-offset-1 outline-ink/15">
          <Image src={person.image} alt="" fill sizes="15rem" className="object-cover" />
        </div>
        <div className="min-w-0">
          <p className="font-mono text-register text-cinnabar">{person.rank}</p>
          <h3 className="mt-2 font-display text-[clamp(1.6rem,1.2rem+1vw,2.2rem)] font-medium leading-tight">
            {person.name}
          </h3>
          <div className="mt-5 space-y-4 border-t border-ink/20 pt-5 text-[1.0625rem] leading-relaxed text-ink-soft">
            {person.bio?.map((para) => <p key={para.slice(0, 32)}>{para}</p>)}
          </div>
          <form method="dialog" className="mt-8">
            <button
              type="submit"
              className="cursor-pointer border border-ink/30 px-4 py-2 font-mono text-register text-ink transition-colors hover:border-cinnabar hover:text-cinnabar"
            >
              {labels.close}
            </button>
          </form>
        </div>
      </div>
    </dialog>
  );
}
