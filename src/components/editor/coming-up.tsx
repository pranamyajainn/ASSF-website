"use client";

import { useEffect, useState } from "react";

type ScheduledView = { id: string; kind: "site" | "email"; date: string; status: "waiting" | "done" | "failed"; result: string | null; title: string; detail?: string };

/** What's set for a later day, with a way to call it off. */
export function ComingUp({ kind }: { kind?: "site" | "email" }) {
  const [items, setItems] = useState<ScheduledView[] | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  useEffect(() => {
    fetch("/api/cms/schedule", { cache: "no-store" })
      .then(async (res) => (res.ok ? setItems(((await res.json()) as { items: ScheduledView[] }).items) : setItems([])))
      .catch(() => setItems([]));
  }, []);
  const day = (d: string) => new Date(d).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "long" });
  const shown = (items ?? []).filter((i) => !kind || i.kind === kind);
  const waiting = shown.filter((i) => i.status === "waiting");
  const recent = shown.filter((i) => i.status !== "waiting").slice(-5).reverse();
  if (!waiting.length && !recent.length) return null;
  return (
    <div className="mb-6 rounded-lg border border-ink/12 bg-white/55 p-4">
      <p className="font-display text-[1.1rem]">Coming up</p>
      {waiting.length ? (
        <ul className="mt-2 divide-y divide-ink/10">
          {waiting.map((i) => (
            <li key={i.id} className="flex flex-wrap items-center justify-between gap-3 py-2.5">
              <span className="min-w-0">
                <span className="block text-[0.96rem]">
                  {i.kind === "email" ? "✉ " : ""}
                  {i.title}
                </span>
                <span className="font-mono text-[0.75rem] text-ink-faint">
                  {day(i.date)}, early morning{i.detail ? ` · to ${i.detail}` : ""}
                  {i.result ? ` · ${i.result}` : ""}
                </span>
              </span>
              <button
                type="button"
                disabled={busy === i.id}
                onClick={async () => {
                  if (!window.confirm(`Cancel “${i.title}”? It won't ${i.kind === "email" ? "be sent" : "be published"}.`)) return;
                  setBusy(i.id);
                  const res = await fetch(`/api/cms/schedule?id=${i.id}`, { method: "DELETE" }).catch(() => null);
                  if (res?.ok) setItems(((await res.json()) as { items: ScheduledView[] }).items);
                  setBusy(null);
                }}
                className="cursor-pointer rounded-md border border-ink/20 px-3 py-1.5 text-[0.85rem] hover:border-cinnabar hover:text-cinnabar disabled:opacity-50"
              >
                Cancel
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-1 text-[0.9rem] text-ink-soft">Nothing is scheduled.</p>
      )}
      {recent.length ? (
        <ul className="mt-3 space-y-1 border-t border-ink/10 pt-3 text-[0.85rem] text-ink-soft">
          {recent.map((i) => (
            <li key={i.id}>
              <span className={i.status === "failed" ? "text-cinnabar-deep" : "text-emerald-800"}>{i.status === "failed" ? "✕" : "✓"}</span> {day(i.date)} — {i.title}
              {i.result ? ` · ${i.result}` : ""}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
