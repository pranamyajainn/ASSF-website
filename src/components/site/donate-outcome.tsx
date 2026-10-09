"use client";

import { useEffect, useState } from "react";
import type { Lang } from "@/i18n/config";
import { fill, type UI } from "@/i18n/ui";
import { readPending, writePending, type Pending } from "@/lib/donate/checkout";
import type { Outcome } from "@/lib/donate/config";

/**
 * Where a donor lands after the checkout: what happened to their payment,
 * in their language, with the reference to quote. The outcome comes from the
 * bank's reply, which the donate form kept in this tab; a cancelled payment
 * says so in the address. The outcome is reported once (without the
 * donor's details) for the editor's Insights.
 */
type Seen = { txn: string | null; outcome: Outcome | "pending" | null; pending: Pending | null };

export function DonateOutcome({ lang, t, donatePath, homePath, email, phone }: { lang: Lang; t: UI["donate"]; donatePath: string; homePath: string; email: string; phone: string }) {
  const [seen, setSeen] = useState<Seen | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const raw = params.get("txn");
    const txn = raw && /^[a-z0-9]{6,24}$/.test(raw) ? raw : null;
    const pending = txn ? readPending(txn) : null;
    const outcome: Seen["outcome"] = params.get("status") === "cancelled" ? "cancelled" : (pending?.status ?? null);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- the outcome is only known in the browser
    setSeen({ txn, outcome, pending });
    try {
      localStorage.removeItem("payment_callback"); // Apna Dharm's script leaves its return address behind
    } catch {}

    if (txn && !pending?.reported) {
      const status: Outcome = outcome && outcome !== "pending" ? outcome : "unclear";
      fetch("/api/donate/outcome", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        keepalive: true,
        body: JSON.stringify({ txn, status, amount: pending?.amount ?? 0, category: pending?.category ?? "", lang, newsletter: pending?.updates ?? null }),
      })
        .then((res) => {
          // Reported once; the donor's email isn't kept in the tab any longer than that.
          if (res.ok) writePending(txn, { ...(pending ?? { amount: 0, category: "", lang }), status, updates: null, reported: true });
        })
        .catch(() => {});
    }
  }, [lang]);

  if (!seen) return <p className="font-mono text-register text-ink-faint">…</p>;

  const kind = seen.outcome === "success" ? "thanks" : seen.outcome === "failed" || seen.outcome === "timeout" ? "failed" : seen.outcome === "cancelled" ? "cancelled" : "unknown";
  const heading = { thanks: t.thanksHeading, failed: t.failedHeading, cancelled: t.cancelledHeading, unknown: t.unknownHeading }[kind];
  const body = { thanks: t.thanksBody, failed: t.failedBody, cancelled: t.cancelledBody, unknown: fill(t.unknownBody, { email, phone }) }[kind];
  const amount = seen.pending?.amount ? `₹${seen.pending.amount.toLocaleString("en-IN", { maximumFractionDigits: 2 })}` : null;

  return (
    <div className="max-w-[46rem]">
      <h1 className="inked ink-on-load max-w-[18ch] text-balance font-display text-display font-medium tracking-[-0.015em]">
        {heading}
        <span className="text-cinnabar" aria-hidden="true">
          {" "}॥
        </span>
      </h1>
      <p className="mt-8 max-w-[52ch] text-lede text-ink">{body}</p>

      {seen.txn ? (
        <dl className="mt-10 grid max-w-[30rem] grid-cols-[auto_minmax(0,1fr)] gap-x-8 gap-y-2 border-y border-ink/20 py-5 font-mono text-register">
          {amount ? (
            <>
              <dt className="text-ink-faint">{t.total}</dt>
              <dd className="text-ink">{amount}</dd>
            </>
          ) : null}
          {seen.pending?.category ? (
            <>
              <dt className="text-ink-faint" aria-hidden="true">
                ·
              </dt>
              <dd className="text-ink-soft">{seen.pending.category}</dd>
            </>
          ) : null}
          <dt className="text-ink-faint">{t.reference}</dt>
          <dd className="select-all text-ink">{seen.txn}</dd>
        </dl>
      ) : null}

      <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
        <a href={donatePath} className="inline-flex min-h-[3rem] items-center bg-cinnabar px-6 text-[1.0625rem] text-leaf transition-colors hover:bg-cinnabar-deep">
          {kind === "thanks" || kind === "unknown" ? t.again : t.tryAgain}
        </a>
        <a href={homePath} className="text-[1.0625rem] text-cinnabar underline decoration-cinnabar/35 underline-offset-[6px] hover:decoration-cinnabar">
          {t.back}
        </a>
      </div>
    </div>
  );
}
