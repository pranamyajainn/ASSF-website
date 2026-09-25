/**
 * A small per-visitor limit for the assistant, so one script can't spend the
 * Groq key's minute budget and lock every reader out.
 *
 * Counts live in the function instance's memory: Vercel reuses a warm
 * instance across requests, so this catches a burst from one address, which
 * is the common case. It is not a global quota — a distributed flood would
 * need a shared store (Vercel KV / Upstash) or Vercel's firewall rules.
 */
type Window = { ms: number; max: number };

/** The assistant's limits: a few questions a minute, sixty an hour. */
const WINDOWS: readonly Window[] = [
  { ms: 60_000, max: 8 },
  { ms: 60 * 60_000, max: 60 },
];

const hits = new Map<string, number[]>();

/** Records a request from `key`; returns seconds to wait if it's over a limit, else 0. */
export function overLimit(key: string, windows: readonly Window[] = WINDOWS, now = Date.now()): number {
  const longest = windows[windows.length - 1].ms;
  const recent = (hits.get(key) ?? []).filter((t) => now - t < longest);
  for (const { ms, max } of windows) {
    const inWindow = recent.filter((t) => now - t < ms);
    if (inWindow.length >= max) {
      hits.set(key, recent);
      return Math.ceil((inWindow[0] + ms - now) / 1000);
    }
  }
  recent.push(now);
  hits.set(key, recent);
  // Keep the map from growing without bound on a long-lived instance.
  if (hits.size > 5000) {
    for (const [k, times] of hits) if (!times.some((t) => now - t < longest)) hits.delete(k);
  }
  return 0;
}

/** The visitor's address as Vercel reports it. */
export function clientKey(req: Request): string {
  return (
    req.headers.get("x-real-ip") ??
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown"
  );
}
