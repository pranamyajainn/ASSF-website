"use client";

import { useState } from "react";

/**
 * Allow / Don't allow. The decision comes back as the address to return to
 * (the AI app, with a sign-in code or a refusal), and the browser goes there.
 */
export function Consent({ decide }: { decide: (allow: boolean) => Promise<string> }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const go = async (allow: boolean) => {
    setBusy(true);
    setError(null);
    try {
      window.location.assign(await decide(allow));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try connecting again.");
      setBusy(false);
    }
  };
  return (
    <div className="mt-6">
      <div className="flex gap-3">
        <button
          type="button"
          disabled={busy}
          onClick={() => go(true)}
          className="flex-1 cursor-pointer bg-board-ink px-5 py-3 text-ink transition-colors hover:bg-leaf disabled:opacity-60"
        >
          {busy ? "Connecting…" : "Allow"}
        </button>
        <button
          type="button"
          disabled={busy}
          onClick={() => go(false)}
          className="flex-1 cursor-pointer border border-board-ink/25 px-5 py-3 text-board-ink transition-colors hover:bg-white/5 disabled:opacity-60"
        >
          Don&apos;t allow
        </button>
      </div>
      {error ? <p className="mt-3 text-sm text-orpiment">{error}</p> : null}
    </div>
  );
}
