/**
 * Quantities drawn as leaves at one scale: an inked leaf for what is
 * conserved, a leaf being worked (hatched in red) for what is under
 * treatment, a bare leaf for what the survey found. The figures are written
 * out beside each line, so the drawing is never the only carrier of the
 * number. Lines draw out to their true length as they scroll into view.
 */
export function ScaleLines({
  lines,
  note,
  className = "mt-10",
}: {
  lines: readonly {
    label: string;
    detail: string;
    value: number;
    display: string;
    state: "done" | "working" | "open";
  }[];
  note?: string;
  className?: string;
}) {
  const max = Math.max(...lines.map((l) => l.value));
  const fills = {
    done: "bg-ink",
    working:
      "bg-[repeating-linear-gradient(135deg,var(--color-cinnabar)_0_2px,transparent_2px_6px)] outline outline-1 -outline-offset-1 outline-cinnabar",
    open: "bg-leaf-deep outline outline-1 -outline-offset-1 outline-ink/30",
  } as const;

  return (
    <div className={`bleed-margin ${className}`}>
      <ul className="border-t border-ink/20">
        {lines.map((line) => (
          <li
            key={line.label}
            className="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-x-6 gap-y-3 border-b border-ink/20 py-5 md:grid-cols-[15rem_minmax(0,1fr)_6.5rem] md:items-center"
          >
            <div className="col-start-1 row-start-1">
              <p className="text-[1.0625rem] leading-snug text-ink">{line.label}</p>
              <p className="mt-1 font-mono text-register text-ink-faint">{line.detail}</p>
            </div>
            <span className="col-start-2 row-start-1 text-right font-display text-[clamp(1.35rem,1.1rem+0.8vw,1.75rem)] font-medium leading-none tabular-nums text-ink md:col-start-3">
              {line.display}
            </span>
            {/* Full width under the label on narrow screens, so even the
                shortest line stays legible as a length. */}
            <div
              aria-hidden="true"
              className="relative col-span-2 row-start-2 h-3.5 md:col-span-1 md:col-start-2 md:row-start-1"
            >
              <span
                className={`draw-on-scroll absolute inset-y-0 left-0 rounded-[999px] ${fills[line.state]}`}
                style={{ width: `${Math.max((line.value / max) * 100, 1.5)}%` }}
              />
            </div>
          </li>
        ))}
      </ul>
      {note ? <p className="mt-3 font-mono text-register text-ink-faint">{note}</p> : null}
    </div>
  );
}
