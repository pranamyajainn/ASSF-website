/**
 * The Foundation's seal: a bound palm-leaf bundle seen face on — the binding
 * holes above, the stacked folios below, inside a struck circle.
 */
export function Seal({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
    >
      <circle cx="24" cy="24" r="21" />
      <circle cx="24" cy="24" r="17.5" strokeWidth="0.7" opacity="0.55" />
      <circle cx="18.5" cy="18.5" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="29.5" cy="18.5" r="1.5" fill="currentColor" stroke="none" />
      <path d="M13 25.5h22" />
      <path d="M14.5 29.5h19" opacity="0.8" />
      <path d="M16.5 33h15" opacity="0.6" />
    </svg>
  );
}
