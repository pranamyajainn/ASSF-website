"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { localeInfo, type Lang } from "@/i18n/config";
import type { Path } from "@/lib/cms/edits";
import { PAGES, type ModuleName } from "@/lib/cms/schema";
import { useEditor } from "./fields";
import { checkSite } from "./health";
import { describeAt } from "./model";

/**
 * Insights: what visitors ask the assistant, and what on the site needs
 * attention. Everything here is counted from what happened or read from the
 * content; only the grouping of questions into themes is the AI's, and it is
 * labelled so.
 */
type Asked = { at: string; lang: Lang; page: string | null; q: string; a: string; spoken: boolean; deflected: boolean };
type Theme = { title: string; questions: { q: string; lang: string; at: string }[]; covered: "yes" | "partly" | "no"; note: string; pages: string[] };
type Analysis = { at: string; days: number; count: number; themes: Theme[] };
type Data = {
  days: number;
  summary: {
    total: number;
    byLang: Record<string, number>;
    spoken: number;
    deflected: number;
    pages: { page: string; count: number }[];
    perDay: { day: string; count: number }[];
  };
  recent: Asked[];
  analysis: Analysis | null;
};

const LANG_NAME: Record<string, string> = { en: "English", hi: localeInfo.hi.label, kn: localeInfo.kn.label };
const card = "rounded-xl border border-ink/10 bg-white/55 p-5 shadow-[0_1px_2px_rgb(29_24_18/0.05)]";
const kicker = "font-mono text-[0.72rem] uppercase tracking-[0.08em] text-ink-faint";
const when = (iso: string) => new Date(iso).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Kolkata" });

/** "/hi/manuscript-conservation" → the editor's page for it. */
function pageFor(path: string | null): (typeof PAGES)[number] | undefined {
  const bare = (path ?? "/").replace(/^\/(hi|kn)(?=\/|$)/, "").replace(/\/$/, "") || "/";
  return PAGES.find((p) => p.module !== "shared" && p.module !== "ui" && (p.href === bare || (bare === "/home" && p.href === "/")));
}

export function InsightsView({ onOpenPage, onReveal }: { onOpenPage: (module: ModuleName) => void; onReveal: (path: Path, lang?: Lang) => void }) {
  const [tab, setTab] = useState<"questions" | "gifts" | "check">("questions");
  return (
    <div className="mx-auto max-w-[80rem] px-4 py-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-[clamp(1.8rem,1.4rem+1.2vw,2.5rem)] leading-tight">Insights</h1>
          <p className="mt-1 max-w-2xl text-[0.95rem] text-ink-soft">
            What visitors ask the website&apos;s AI assistant — and what on the site needs looking after.
          </p>
        </div>
        <div role="tablist" className="flex gap-1 rounded-full bg-ink/5 p-1">
          {(
            [
              ["questions", "Visitors' questions"],
              ["gifts", "Online gifts"],
              ["check", "Site check"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              role="tab"
              aria-selected={tab === id}
              type="button"
              onClick={() => setTab(id)}
              className={`cursor-pointer rounded-full px-4 py-1.5 text-[0.92rem] ${tab === id ? "bg-board text-board-ink" : "text-ink hover:bg-ink/5"}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-6">
        {tab === "questions" ? <Questions onOpenPage={onOpenPage} /> : tab === "gifts" ? <Gifts /> : <SiteCheck onReveal={onReveal} />}
      </div>
    </div>
  );
}

function Questions({ onOpenPage }: { onOpenPage: (module: ModuleName) => void }) {
  const [days, setDays] = useState(30);
  const [data, setData] = useState<Data | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [grouping, setGrouping] = useState<{ busy: boolean; error: string | null }>({ busy: false, error: null });

  useEffect(() => {
    let live = true;
    fetch(`/api/cms/insights?days=${days}`, { cache: "no-store" })
      .then(async (res) => {
        if (!live) return;
        if (res.ok) {
          setData((await res.json()) as Data);
          setError(null);
        } else setError(await res.text());
      })
      .catch(() => live && setError("Insights couldn't be loaded."));
    return () => {
      live = false;
    };
  }, [days]);

  async function group() {
    setGrouping({ busy: true, error: null });
    const res = await fetch(`/api/cms/insights?days=${days}`, { method: "POST" }).catch(() => null);
    if (!res?.ok) {
      setGrouping({ busy: false, error: (await res?.text().catch(() => "")) || "Couldn't group the questions — try again." });
      return;
    }
    const { analysis } = (await res.json()) as { analysis: Analysis };
    setData((d) => (d ? { ...d, analysis } : d));
    setGrouping({ busy: false, error: null });
  }

  if (error) return <p className="text-cinnabar-deep">{error}</p>;
  if (!data) return <p className="font-display text-xl text-ink-soft">Reading the visitors&apos; questions…</p>;

  const { summary } = data;
  const pct = (n: number) => (summary.total ? Math.round((n / summary.total) * 100) : 0);
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-[0.92rem] text-ink-soft">
          Visitors are told their questions are kept, but not who asked. Questions are kept for a year.
        </p>
        <div role="group" aria-label="Period" className="flex gap-1 rounded-full border border-ink/15 bg-white/60 p-1 text-[0.88rem]">
          {[7, 30, 90].map((d) => (
            <button
              key={d}
              type="button"
              aria-pressed={days === d}
              onClick={() => setDays(d)}
              className={`cursor-pointer rounded-full px-3 py-1 ${days === d ? "bg-ink text-leaf" : "text-ink-soft hover:bg-ink/5"}`}
            >
              {d} days
            </button>
          ))}
        </div>
      </div>

      {!summary.total ? (
        <div className={`${card} py-12 text-center`}>
          <p className="font-display text-[1.4rem]">No questions in the last {days} days yet</p>
          <p className="mx-auto mt-2 max-w-xl text-[0.95rem] text-ink-soft">
            When visitors ask the assistant something — typed or spoken, in any of the three languages — it appears here, with what the site could say better.
          </p>
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <Stat label="Questions asked" value={summary.total.toLocaleString("en-IN")} note={`in the last ${days} days`} />
            <div className={card}>
              <p className={kicker}>Asked in</p>
              <ul className="mt-3 space-y-2">
                {(["en", "hi", "kn"] as const).map((l) => (
                  <li key={l} className="grid grid-cols-[4.5rem_minmax(0,1fr)_2.5rem] items-center gap-2 text-[0.9rem]">
                    <span lang={l} className={l === "kn" ? "font-kannada" : ""}>
                      {LANG_NAME[l]}
                    </span>
                    <span className="h-2 overflow-hidden rounded-full bg-ink/8">
                      <span className="block h-full rounded-full bg-cinnabar/80" style={{ width: `${pct(summary.byLang[l] ?? 0)}%` }} />
                    </span>
                    <span className="text-right font-mono text-[0.8rem] text-ink-soft">{summary.byLang[l] ?? 0}</span>
                  </li>
                ))}
              </ul>
            </div>
            <Stat label="Asked by voice" value={summary.spoken.toLocaleString("en-IN")} note={`${pct(summary.spoken)}% of questions were spoken`} />
            <Stat
              label="The site didn't say"
              value={summary.deflected.toLocaleString("en-IN")}
              note={`${pct(summary.deflected)}% were pointed to your email or phone`}
              tone={summary.deflected ? "warn" : undefined}
            />
          </div>

          <div className="grid gap-4 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
            <div className={card}>
              <p className={kicker}>Questions a day</p>
              <DayChart perDay={summary.perDay} />
            </div>
            <div className={card}>
              <p className={kicker}>Asked from</p>
              <ul className="mt-3 space-y-2">
                {summary.pages.map((p) => {
                  const page = pageFor(p.page);
                  return (
                    <li key={p.page} className="flex items-center justify-between gap-3 text-[0.92rem]">
                      {page ? (
                        <button type="button" onClick={() => onOpenPage(page.module)} className="cursor-pointer truncate text-left underline decoration-ink/20 underline-offset-2 hover:text-cinnabar">
                          {page.title}
                        </button>
                      ) : (
                        <span className="truncate text-ink-soft">{p.page}</span>
                      )}
                      <span className="font-mono text-[0.8rem] text-ink-soft">{p.count}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          <section className={card}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="flex items-center gap-2 font-display text-[1.4rem]">
                  What visitors want to know
                  <span className="border border-current px-1 py-px font-mono text-[0.66rem] leading-none tracking-[0.08em] text-cinnabar">AI</span>
                </h2>
                <p className="mt-1 max-w-2xl text-[0.9rem] text-ink-soft">
                  The questions, grouped by the AI into themes, with what the site already answers and what it could add. It never supplies the answers itself — those
                  are the Foundation&apos;s to write.
                </p>
              </div>
              <button
                type="button"
                onClick={group}
                disabled={grouping.busy}
                className="cursor-pointer rounded-md bg-ink px-4 py-2 text-[0.9rem] text-leaf hover:bg-board disabled:cursor-default disabled:opacity-60"
              >
                {grouping.busy ? "Reading the questions…" : data.analysis ? "Group again" : "Group the questions"}
              </button>
            </div>
            {grouping.error ? <p className="mt-3 text-[0.9rem] text-cinnabar-deep">{grouping.error}</p> : null}
            {data.analysis ? (
              <>
                <p className="mt-2 font-mono text-[0.75rem] text-ink-faint">
                  {data.analysis.count} questions from the last {data.analysis.days} days, grouped {when(data.analysis.at)}
                </p>
                {data.analysis.themes.length ? (
                  <div className="mt-4 grid gap-3 md:grid-cols-2">
                    {data.analysis.themes.map((t) => (
                      <ThemeCard key={t.title} theme={t} onOpenPage={onOpenPage} />
                    ))}
                  </div>
                ) : (
                  <p className="mt-4 text-ink-soft">Nothing to group — the questions so far were greetings or tests.</p>
                )}
              </>
            ) : null}
          </section>

          <section className={card}>
            <h2 className="font-display text-[1.4rem]">Latest questions</h2>
            <ul className="mt-3 divide-y divide-ink/10">
              {data.recent.map((a) => (
                <li key={a.at + a.q} className="py-3">
                  <details className="group">
                    <summary className="cursor-pointer list-none">
                      <span lang={a.lang} className={`block text-[1rem] ${a.lang === "kn" ? "font-kannada" : ""}`}>
                        {a.q}
                      </span>
                      <span className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[0.74rem] text-ink-faint">
                        <span>{when(a.at)}</span>
                        <span>{LANG_NAME[a.lang] ?? a.lang}</span>
                        {pageFor(a.page) ? <span>{pageFor(a.page)!.title}</span> : null}
                        {a.spoken ? <span>🎙 spoken</span> : null}
                        {a.deflected ? <span className="rounded-full bg-orpiment/30 px-2 text-ink-soft">sent to email/phone</span> : null}
                        <span className="text-cinnabar-deep group-open:hidden">Show the answer</span>
                      </span>
                    </summary>
                    <p lang={a.lang} className={`mt-2 whitespace-pre-wrap border-l border-cinnabar/50 pl-3 text-[0.92rem] text-ink-soft ${a.lang === "kn" ? "font-kannada" : ""}`}>
                      {a.a}
                    </p>
                  </details>
                </li>
              ))}
            </ul>
          </section>
        </>
      )}
    </div>
  );
}

type GiftData = {
  days: number;
  completed: number;
  total: number;
  unfinished: number;
  gifts: { at: string; txn: string; status: string; amount: number; category: string; lang: string }[];
};

const GIFT_STATUS: Record<string, { label: string; tone: string }> = {
  success: { label: "Completed", tone: "bg-emerald-900/10 text-emerald-900" },
  failed: { label: "Didn't go through", tone: "bg-cinnabar/12 text-cinnabar-deep" },
  cancelled: { label: "Cancelled", tone: "bg-ink/6 text-ink-soft" },
  timeout: { label: "Timed out", tone: "bg-ink/6 text-ink-soft" },
  unclear: { label: "Unclear — check Apna Dharm", tone: "bg-orpiment/30 text-ink" },
};

/** Gifts made on the website's donate page, as donors' browsers reported them. */
function Gifts() {
  const [days, setDays] = useState(30);
  const [data, setData] = useState<GiftData | null>(null);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    let live = true;
    fetch(`/api/cms/gifts?days=${days}`, { cache: "no-store" })
      .then(async (res) => {
        if (!live) return;
        if (res.ok) {
          setData((await res.json()) as GiftData);
          setError(null);
        } else setError(await res.text());
      })
      .catch(() => live && setError("Online gifts couldn't be loaded."));
    return () => {
      live = false;
    };
  }, [days]);
  if (error) return <p className="text-cinnabar-deep">{error}</p>;
  if (!data) return <p className="font-display text-xl text-ink-soft">Reading the gifts…</p>;
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="max-w-3xl text-[0.92rem] text-ink-soft">
          Gifts made on the website&apos;s donate page, as each donor&apos;s browser heard from the bank. The Foundation&apos;s Apna Dharm account is the record of
          every gift — donors&apos; names, receipts and settlements are there.
        </p>
        <div role="group" aria-label="Period" className="flex gap-1 rounded-full border border-ink/15 bg-white/60 p-1 text-[0.88rem]">
          {[7, 30, 90, 365].map((d) => (
            <button
              key={d}
              type="button"
              aria-pressed={days === d}
              onClick={() => setDays(d)}
              className={`cursor-pointer rounded-full px-3 py-1 ${days === d ? "bg-ink text-leaf" : "text-ink-soft hover:bg-ink/5"}`}
            >
              {d === 365 ? "A year" : `${d} days`}
            </button>
          ))}
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <Stat label="Completed gifts" value={data.completed.toLocaleString("en-IN")} note={`in the last ${data.days} days`} />
        <Stat label="Given online" value={`₹${data.total.toLocaleString("en-IN")}`} note="the completed gifts together" />
        <Stat label="Started, not completed" value={data.unfinished.toLocaleString("en-IN")} note="cancelled, failed or unclear" />
      </div>
      <section className={card}>
        <h2 className="font-display text-[1.4rem]">Latest</h2>
        {data.gifts.length ? (
          <ul className="mt-3 divide-y divide-ink/10">
            {data.gifts.map((g) => (
              <li key={g.txn + g.at} className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 py-2.5">
                <span className="min-w-0">
                  <span className="block text-[1rem]">
                    ₹{g.amount.toLocaleString("en-IN")} <span className="text-ink-soft">· {g.category || "—"}</span>
                  </span>
                  <span className="font-mono text-[0.74rem] text-ink-faint">
                    {when(g.at)} · {LANG_NAME[g.lang] ?? g.lang} · ref {g.txn}
                  </span>
                </span>
                <span className={`rounded-full px-2.5 py-0.5 text-[0.78rem] ${(GIFT_STATUS[g.status] ?? GIFT_STATUS.unclear).tone}`}>
                  {(GIFT_STATUS[g.status] ?? GIFT_STATUS.unclear).label}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-ink-soft">No gifts on the website in this period yet.</p>
        )}
      </section>
    </div>
  );
}

function Stat({ label, value, note, tone }: { label: string; value: string; note: string; tone?: "warn" }) {
  return (
    <div className={card}>
      <p className={kicker}>{label}</p>
      <p className={`mt-2 font-display text-[2.4rem] leading-none ${tone === "warn" ? "text-cinnabar-deep" : ""}`}>{value}</p>
      <p className="mt-2 text-[0.85rem] text-ink-soft">{note}</p>
    </div>
  );
}

/** One bar a day, ruled like a ledger. */
function DayChart({ perDay }: { perDay: { day: string; count: number }[] }) {
  const max = Math.max(1, ...perDay.map((d) => d.count));
  const w = 600;
  const h = 120;
  const gap = perDay.length > 40 ? 1 : 3;
  const bar = (w - gap * (perDay.length - 1)) / perDay.length;
  return (
    <svg viewBox={`0 0 ${w} ${h + 18}`} className="mt-3 w-full" role="img" aria-label="Questions a day">
      <line x1="0" x2={w} y1={h} y2={h} stroke="currentColor" strokeOpacity="0.2" />
      {perDay.map((d, i) => {
        const bh = d.count ? Math.max(3, (d.count / max) * (h - 8)) : 0;
        return (
          <g key={d.day}>
            <title>{`${new Date(d.day).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}: ${d.count}`}</title>
            <rect x={i * (bar + gap)} y={h - bh} width={bar} height={bh} rx="1.5" className="fill-cinnabar/80" />
            <rect x={i * (bar + gap)} y="0" width={bar} height={h} fill="transparent" />
          </g>
        );
      })}
      <text x="0" y={h + 15} className="fill-ink-faint font-mono text-[11px]">
        {perDay[0] ? new Date(perDay[0].day).toLocaleDateString("en-IN", { day: "numeric", month: "short" }) : ""}
      </text>
      <text x={w} y={h + 15} textAnchor="end" className="fill-ink-faint font-mono text-[11px]">
        today
      </text>
    </svg>
  );
}

const COVERED = {
  yes: { label: "The site answers this", tone: "bg-emerald-900/10 text-emerald-900" },
  partly: { label: "Partly answered", tone: "bg-orpiment/30 text-ink" },
  no: { label: "Not on the site yet", tone: "bg-cinnabar/12 text-cinnabar-deep" },
} as const;

function ThemeCard({ theme, onOpenPage }: { theme: Theme; onOpenPage: (module: ModuleName) => void }) {
  const [all, setAll] = useState(false);
  const shown = all ? theme.questions : theme.questions.slice(0, 3);
  const pages = [...new Map(theme.pages.map((p) => pageFor(p)).filter((p) => !!p).map((p) => [p!.module, p!])).values()];
  return (
    <article className="rounded-lg border border-ink/10 bg-leaf/70 p-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="font-display text-[1.15rem] leading-snug">{theme.title}</h3>
        <span className="font-mono text-[0.75rem] text-ink-faint">
          {theme.questions.length} question{theme.questions.length === 1 ? "" : "s"}
        </span>
      </div>
      <span className={`mt-2 inline-block rounded-full px-2.5 py-0.5 text-[0.78rem] ${COVERED[theme.covered].tone}`}>{COVERED[theme.covered].label}</span>
      {theme.note ? <p className="mt-2 text-[0.92rem] leading-relaxed text-ink-soft">{theme.note}</p> : null}
      <ul className="mt-3 space-y-1.5 border-l border-ink/15 pl-3">
        {shown.map((q) => (
          <li key={q.at + q.q} lang={q.lang} className={`text-[0.9rem] ${q.lang === "kn" ? "font-kannada" : ""}`}>
            “{q.q}”
          </li>
        ))}
      </ul>
      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[0.85rem]">
        {theme.questions.length > 3 ? (
          <button type="button" onClick={() => setAll(!all)} className="cursor-pointer text-ink-soft underline decoration-ink/25 underline-offset-2">
            {all ? "Show fewer" : `Show all ${theme.questions.length}`}
          </button>
        ) : null}
        {pages.map((p) => (
          <button key={p.module} type="button" onClick={() => onOpenPage(p.module)} className="cursor-pointer text-cinnabar-deep underline decoration-cinnabar/40 underline-offset-2">
            Edit {p.title} →
          </button>
        ))}
      </div>
    </article>
  );
}

type Live = { state: "checking" | "done"; broken: { url: string; path: Path; status: number }[]; checked: number };

function SiteCheck({ onReveal }: { onReveal: (path: Path, lang?: Lang) => void }) {
  const api = useEditor();
  const health = useMemo(() => checkSite(api.base, api.published, api.translated), [api.base, api.published, api.translated]);
  const [live, setLive] = useState<Live>({ state: "checking", broken: [], checked: 0 });

  async function checkLinks() {
    const broken: Live["broken"] = [];
    // Photos and pages on this site: the browser asks for each, a few at a time.
    const queue = [...health.local];
    const worker = async () => {
      for (let item = queue.shift(); item; item = queue.shift()) {
        const res = await fetch(item.url, { method: "HEAD", cache: "no-store" }).catch(() => null);
        if (!res || (!res.ok && res.status !== 405)) broken.push({ ...item, status: res?.status ?? 0 });
      }
    };
    await Promise.all(Array.from({ length: 6 }, worker));
    // Other websites: the server asks, since a browser may not.
    const res = await fetch("/api/cms/links", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ urls: health.links.map((l) => l.url) }),
    }).catch(() => null);
    if (res?.ok) {
      const { results } = (await res.json()) as { results: { url: string; ok: boolean; status: number }[] };
      for (const r of results) if (!r.ok) broken.push({ url: r.url, path: health.links.find((l) => l.url === r.url)!.path, status: r.status });
    }
    setLive({ state: "done", broken, checked: health.local.length + health.links.length });
  }

  // Run the live check once, when the tab opens.
  useEffect(() => {
    // The state changes only once the checks come back.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    checkLinks();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function checkAgain() {
    setLive({ state: "checking", broken: [], checked: 0 });
    checkLinks();
  }

  const attention = live.broken.length + health.behind.length + health.english.length + health.undescribed.length;
  const name = (path: Path) => describeAt(api.published.en, path);
  return (
    <div className="space-y-5">
      <div className={`${card} flex flex-wrap items-center justify-between gap-4`}>
        <div className="flex items-center gap-4">
          <span
            aria-hidden="true"
            className={`grid size-14 place-items-center rounded-full font-display text-[1.6rem] ${attention ? "bg-orpiment/30 text-ink" : "bg-emerald-900/10 text-emerald-900"}`}
          >
            {attention ? attention : "✓"}
          </span>
          <div>
            <p className="font-display text-[1.35rem] leading-tight">
              {live.state === "checking" ? "Checking the site…" : attention ? `${attention} thing${attention === 1 ? "" : "s"} to look at` : "Everything is in order"}
            </p>
            <p className="text-[0.88rem] text-ink-soft">
              {live.state === "done"
                ? `${live.checked} photos and links opened just now · translations and descriptions read from the published site`
                : "Opening every photo and link on the site…"}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={checkAgain}
          disabled={live.state === "checking"}
          className="cursor-pointer rounded-md border border-ink/25 bg-white/80 px-4 py-2 text-[0.9rem] hover:border-cinnabar disabled:cursor-default disabled:opacity-50"
        >
          Check again
        </button>
      </div>

      <Group
        title="Links and photos that don't open"
        tone="bad"
        empty={live.state === "done" ? "Every link and photo opens." : "Checking…"}
        items={live.broken.map((b) => ({
          key: b.url,
          text: (
            <>
              {name(b.path)} <span className="break-all font-mono text-[0.78rem] text-ink-faint">{b.url}</span>
            </>
          ),
          badge: b.status ? `error ${b.status}` : "no answer",
          onFix: () => onReveal(b.path),
        }))}
      />
      <Group
        title="Hindi or Kannada behind the English"
        note="The English was changed in the editor, but this edition still has the old wording. Open it and press “Translate for me”, or write it."
        tone="warn"
        empty="Every translation is up to date."
        items={health.behind.map((f) => ({
          key: JSON.stringify(f),
          text: name(f.path),
          badge: LANG_NAME[f.lang!],
          onFix: () => onReveal(f.path, f.lang),
        }))}
      />
      <Group
        title="Shown in English on the Hindi or Kannada site"
        note="This edition has nothing written here, so readers see the English."
        tone="warn"
        empty="Nothing falls back to English."
        items={health.english.map((f) => ({
          key: JSON.stringify(f),
          text: name(f.path),
          badge: LANG_NAME[f.lang!],
          onFix: () => onReveal(f.path, f.lang),
        }))}
      />
      <Group
        title="Photos without a description"
        note="A description is read aloud to readers who can't see the photo, and helps search engines."
        tone="warn"
        empty="Every photo is described."
        items={health.undescribed.map((f) => ({ key: JSON.stringify(f), text: name(f.path), onFix: () => onReveal(f.path) }))}
      />
      <Group
        title="Waiting on the Foundation"
        note="These show as “awaiting Foundation” on the site until they're filled in — the site never shows a guess."
        tone="info"
        empty="Nothing is waiting."
        items={health.waiting.map((f) => ({ key: JSON.stringify(f), text: name(f.path), onFix: () => onReveal(f.path), fixLabel: "Fill in" }))}
      />
    </div>
  );
}

function Group({
  title,
  note,
  tone,
  empty,
  items,
}: {
  title: string;
  note?: string;
  tone: "bad" | "warn" | "info";
  empty: string;
  items: { key: string; text: ReactNode; badge?: string; onFix: () => void; fixLabel?: string }[];
}) {
  const [open, setOpen] = useState(false);
  const shown = open ? items : items.slice(0, 6);
  const dot = items.length ? (tone === "bad" ? "bg-cinnabar" : tone === "warn" ? "bg-orpiment" : "bg-ink/30") : "bg-emerald-700";
  return (
    <section className={card}>
      <div className="flex items-start gap-3">
        <span aria-hidden="true" className={`mt-2 size-2.5 shrink-0 rounded-full ${dot}`} />
        <div className="min-w-0 flex-1">
          <h2 className="font-display text-[1.2rem] leading-snug">
            {title} <span className="font-mono text-[0.8rem] text-ink-faint">{items.length || ""}</span>
          </h2>
          {note && items.length ? <p className="mt-0.5 text-[0.88rem] text-ink-soft">{note}</p> : null}
          {items.length ? (
            <ul className="mt-3 divide-y divide-ink/8">
              {shown.map((item) => (
                <li key={item.key} className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 py-2 text-[0.92rem]">
                  <span className="min-w-0 flex-1">{item.text}</span>
                  {item.badge ? <span className="rounded-full bg-ink/6 px-2.5 py-0.5 text-[0.78rem] text-ink-soft">{item.badge}</span> : null}
                  <button type="button" onClick={item.onFix} className="cursor-pointer text-[0.88rem] text-cinnabar-deep underline decoration-cinnabar/40 underline-offset-2">
                    {item.fixLabel ?? "Fix"} →
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-0.5 text-[0.9rem] text-ink-soft">{empty}</p>
          )}
          {items.length > 6 ? (
            <button type="button" onClick={() => setOpen(!open)} className="mt-2 cursor-pointer text-[0.85rem] text-ink-soft underline decoration-ink/25 underline-offset-2">
              {open ? "Show fewer" : `Show all ${items.length}`}
            </button>
          ) : null}
        </div>
      </div>
    </section>
  );
}
