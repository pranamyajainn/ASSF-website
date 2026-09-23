"use client";

import { useRef } from "react";
import Image from "next/image";

type Person = { name: string; rank: string; body?: string; image: string };

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
export function PersonCard({ person }: { person: Person }) {
  const mountRef = useRef<HTMLDivElement>(null);

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
      {person.body ? (
        <p className="mt-2.5 line-clamp-3 text-[0.98rem] leading-snug text-ink-soft">{person.body}</p>
      ) : null}
    </li>
  );
}
