"use client";

import { useEffect, useMemo, useState } from "react";
import { renderEmail, type Email } from "@/lib/mail/render";

/**
 * Email updates: the Foundation writes to the people it chooses — the
 * newsletter list, the trustees, or anyone on its list — in its own words,
 * set in the site's look, with a report attached if there is one. The same
 * words can go to a WhatsApp group with one button.
 */
type Contact = { email: string; name: string; groups: string[]; unsubscribed: string | null; added: string };
type Sent = { at: string; subject: string; to: string; count: number; attachment: string | null };
type Data = {
  contacts: Contact[];
  sent: Sent[];
  groups: { id: string; name: string }[];
  mode: "smtp" | "outbox" | "none";
  sender: string | null;
  dailyLimit: number;
  org: Email["org"];
  me: string;
};
type Attachment = { name: string; type: string; data: string; size: number; link?: string; linkTitle?: string };

const DRAFT_KEY = "assf-editor:mail-draft";
const BATCH = 20;
const field = "w-full rounded-md border border-ink/20 bg-white/85 px-3 py-2.5 text-[0.98rem] outline-none focus:border-cinnabar";
const button = "cursor-pointer rounded-md px-4 py-2 text-[0.92rem] transition-colors disabled:cursor-default disabled:opacity-50";

function loadDraft(): { subject: string; body: string; groups: string[]; people: string[] } {
  try {
    return { subject: "", body: "", groups: ["newsletter"], people: [], ...JSON.parse(localStorage.getItem(DRAFT_KEY) ?? "{}") };
  } catch {
    return { subject: "", body: "", groups: ["newsletter"], people: [] };
  }
}

/** "Anil Sethi <anil@example.com>", "anil@example.com", or several per line, separated by commas. */
function parseAddresses(text: string): { name: string; email: string }[] {
  const out: { name: string; email: string }[] = [];
  for (const part of text.split(/[\n,;]+/)) {
    const m = /^\s*"?([^"<]*?)"?\s*<\s*([^>\s]+@[^>\s]+)\s*>\s*$/.exec(part) ?? /^\s*()([^\s<>]+@[^\s<>]+\.[^\s<>]{2,})\s*$/.exec(part);
    if (m) out.push({ name: m[1].trim(), email: m[2].trim().toLowerCase() });
  }
  return out;
}

export function MailView() {
  const [data, setData] = useState<Data | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<"write" | "people" | "sent">("write");

  useEffect(() => {
    fetch("/api/cms/mail", { cache: "no-store" })
      .then(async (res) => (res.ok ? setData((await res.json()) as Data) : setError(await res.text())))
      .catch(() => setError("The mailing list couldn't be loaded."));
  }, []);

  if (error) return <p className="p-8 text-cinnabar-deep">{error}</p>;
  if (!data) return <p className="p-8 font-display text-xl text-ink-soft">Opening email updates…</p>;

  const active = data.contacts.filter((c) => !c.unsubscribed);
  return (
    <div className="mx-auto max-w-[80rem] px-4 py-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-[clamp(1.8rem,1.4rem+1.2vw,2.5rem)] leading-tight">Email updates</h1>
          <p className="mt-1 text-[0.95rem] text-ink-soft">
            Newsletters, reports to the trustees, or a note to anyone on your list — written here, sent from the Foundation&apos;s own email.
          </p>
        </div>
        <div role="tablist" className="flex gap-1 rounded-full bg-ink/5 p-1">
          {(
            [
              ["write", "Write"],
              ["people", `People (${active.length})`],
              ["sent", "Sent"],
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

      {data.mode === "none" ? (
        <p className="mt-5 rounded-md bg-orpiment/20 px-4 py-3 text-[0.92rem]">
          Sending isn&apos;t connected yet — the web team adds the Foundation&apos;s Gmail app password. You can already add people and write.
        </p>
      ) : data.mode === "outbox" ? (
        <p className="mt-5 rounded-md bg-white/60 px-4 py-3 text-[0.9rem] text-ink-soft">Local mode: emails are written to .cms-data/outbox.jsonl on this computer, not sent.</p>
      ) : null}

      <div className="mt-6">
        {tab === "write" ? <Write data={data} onSent={(sent) => setData({ ...data, sent })} onPeople={() => setTab("people")} /> : null}
        {tab === "people" ? <People data={data} onSaved={(contacts) => setData({ ...data, contacts })} /> : null}
        {tab === "sent" ? <SentList sent={data.sent} /> : null}
      </div>
    </div>
  );
}

function Write({ data, onSent, onPeople }: { data: Data; onSent: (sent: Sent[]) => void; onPeople: () => void }) {
  const [draft, setDraft] = useState(loadDraft);
  const [attachment, setAttachment] = useState<Attachment | null>(null);
  const [choosing, setChoosing] = useState(draft.people.length > 0);
  const [filter, setFilter] = useState("");
  const [status, setStatus] = useState<{ kind: "idle" | "busy" | "done" | "error"; text: string }>({ kind: "idle", text: "" });

  useEffect(() => {
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
    } catch {}
  }, [draft]);

  const active = data.contacts.filter((c) => !c.unsubscribed);
  const recipients = useMemo(() => {
    const set = new Set<string>();
    for (const c of active) if (c.groups.some((g) => draft.groups.includes(g)) || draft.people.includes(c.email)) set.add(c.email);
    return [...set];
  }, [active, draft.groups, draft.people]);
  const audience = [
    ...data.groups.filter((g) => draft.groups.includes(g.id)).map((g) => g.name),
    ...(draft.people.length ? [`${draft.people.length} chosen`] : []),
  ].join(" + ");

  const preview = useMemo(
    () =>
      renderEmail({
        subject: draft.subject || "Your subject",
        body: draft.body || "Your message appears here, in the Foundation's style.",
        site: window.location.origin,
        unsubscribe: "#",
        attachment: attachment?.name,
        org: data.org,
      }).html,
    [draft.subject, draft.body, attachment, data.org],
  );

  const ready = draft.subject.trim() && draft.body.trim();
  /**
   * The WhatsApp message: bold title (WhatsApp's *…* breaks on inner spaces
   * at the edges, so it's trimmed), the words, the report's short link, and
   * the Foundation's name. No emoji — some phones mangle them in share links.
   */
  const whatsappText = (link?: string) =>
    [`*${draft.subject.trim()}*`, draft.body.trim(), link ? `View the report:\n${link}` : "", "— Acharya Shanti Sagar Foundation"].filter(Boolean).join("\n\n");
  const file = useMemo(
    () => (attachment ? new File([Uint8Array.from(atob(attachment.data), (c) => c.charCodeAt(0))], attachment.name, { type: attachment.type }) : null),
    [attachment?.data, attachment?.name, attachment?.type], // eslint-disable-line react-hooks/exhaustive-deps
  );
  // Phones (and Safari) can hand the file itself to WhatsApp through the share menu.
  const canShareFile = !!file && typeof navigator.canShare === "function" && navigator.canShare({ files: [file] });

  /**
   * WhatsApp links carry words only, so an attached report is kept privately
   * and its link goes into the message (once per file).
   */
  async function shareOnWhatsApp() {
    // Open the window now, while the click still counts, and point it at WhatsApp once the link is ready.
    const win = window.open("", "_blank");
    // A link made under another title would preview with the old title: make a fresh one.
    let link = attachment?.linkTitle === draft.subject.trim() ? attachment?.link : undefined;
    try {
      if (attachment && !link) {
        setStatus({ kind: "busy", text: "Preparing a link to the file…" });
        const res = await fetch("/api/cms/mail/file", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: attachment.name, type: attachment.type, data: attachment.data, title: draft.subject.trim() }),
        });
        if (!res.ok) throw new Error((await res.text()) || "The file couldn't be prepared.");
        link = ((await res.json()) as { url: string }).url;
        setAttachment({ ...attachment, link, linkTitle: draft.subject.trim() });
      }
      const url = `https://wa.me/?text=${encodeURIComponent(whatsappText(link))}`;
      if (win) {
        win.opener = null;
        win.location.href = url;
      } else window.location.href = url;
      setStatus({ kind: "done", text: attachment ? "Opened WhatsApp — the message links to the report, shown as the Foundation's card (valid for 90 days)." : "Opened WhatsApp." });
    } catch (err) {
      win?.close();
      setStatus({ kind: "error", text: err instanceof Error ? err.message : "Couldn't open WhatsApp." });
    }
  }

  async function shareWithFile() {
    if (!file) return;
    try {
      await navigator.share({ files: [file], title: draft.subject, text: whatsappText() });
      setStatus({ kind: "done", text: "Shared." });
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") return;
      setStatus({ kind: "error", text: "This device couldn't share the file — use Share on WhatsApp instead." });
    }
  }
  const post = async (payload: object) => {
    const res = await fetch("/api/cms/mail/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subject: draft.subject, body: draft.body, attachment, ...payload }),
    });
    if (!res.ok) throw new Error((await res.text()) || "Sending failed.");
    return (await res.json()) as { sent: string[]; skipped: string[]; failed: { email: string; error: string }[] };
  };

  async function test() {
    setStatus({ kind: "busy", text: "Sending a test to you…" });
    try {
      await post({ test: true });
      setStatus({ kind: "done", text: `Test sent to ${data.me}. Check your inbox (and the spam folder, the first time).` });
    } catch (err) {
      setStatus({ kind: "error", text: err instanceof Error ? err.message : "The test didn't send." });
    }
  }

  async function sendAll() {
    if (!window.confirm(`Send “${draft.subject}” to ${recipients.length} ${recipients.length === 1 ? "person" : "people"}?`)) return;
    let sent = 0;
    const failed: string[] = [];
    for (let i = 0; i < recipients.length; i += BATCH) {
      setStatus({ kind: "busy", text: `Sending… ${sent} of ${recipients.length}` });
      try {
        const r = await post({ to: recipients.slice(i, i + BATCH) });
        sent += r.sent.length;
        failed.push(...r.failed.map((f) => f.email));
      } catch (err) {
        setStatus({ kind: "error", text: `${err instanceof Error ? err.message : "Sending stopped."} ${sent} were sent before it stopped.` });
        return;
      }
    }
    const log = await fetch("/api/cms/mail/log", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subject: draft.subject, to: audience, count: sent, attachment: attachment?.name ?? null }),
    }).catch(() => null);
    if (log?.ok) onSent(((await log.json()) as { sent: Sent[] }).sent);
    setStatus({
      kind: failed.length ? "error" : "done",
      text: failed.length ? `Sent to ${sent}. Couldn't reach: ${failed.join(", ")}.` : `Sent to ${sent} ${sent === 1 ? "person" : "people"} ✓`,
    });
    if (!failed.length) {
      setDraft({ ...draft, subject: "", body: "" });
      setAttachment(null);
    }
  }

  const toggleGroup = (id: string) =>
    setDraft((d) => ({ ...d, groups: d.groups.includes(id) ? d.groups.filter((g) => g !== id) : [...d.groups, id] }));

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <div className="space-y-5">
        <div>
          <p className="mb-2 font-display text-[1.1rem]">Send to</p>
          <div className="flex flex-wrap gap-2">
            {data.groups.map((g) => {
              const n = active.filter((c) => c.groups.includes(g.id)).length;
              const on = draft.groups.includes(g.id);
              return (
                <button
                  key={g.id}
                  type="button"
                  aria-pressed={on}
                  onClick={() => toggleGroup(g.id)}
                  className={`cursor-pointer rounded-full border px-4 py-1.5 text-[0.92rem] ${on ? "border-board bg-board text-board-ink" : "border-ink/20 bg-white/70 hover:border-cinnabar"}`}
                >
                  {on ? "✓ " : ""}
                  {g.name} ({n})
                </button>
              );
            })}
            <button
              type="button"
              aria-pressed={choosing}
              onClick={() => setChoosing(!choosing)}
              className={`cursor-pointer rounded-full border px-4 py-1.5 text-[0.92rem] ${draft.people.length ? "border-board bg-board text-board-ink" : "border-ink/20 bg-white/70 hover:border-cinnabar"}`}
            >
              Choose people{draft.people.length ? ` (${draft.people.length})` : ""}
            </button>
          </div>
          {choosing ? (
            <div className="mt-3 rounded-md border border-ink/15 bg-white/60 p-3">
              <input value={filter} onChange={(e) => setFilter(e.target.value)} placeholder="Find a name or email" className={field} />
              <ul className="mt-2 max-h-56 overflow-auto">
                {active
                  .filter((c) => `${c.name} ${c.email}`.toLowerCase().includes(filter.toLowerCase()))
                  .map((c) => (
                    <li key={c.email}>
                      <label className="flex cursor-pointer items-center gap-2 px-1 py-1 text-[0.92rem] hover:bg-leaf">
                        <input
                          type="checkbox"
                          checked={draft.people.includes(c.email)}
                          onChange={(e) =>
                            setDraft((d) => ({ ...d, people: e.target.checked ? [...d.people, c.email] : d.people.filter((p) => p !== c.email) }))
                          }
                        />
                        {c.name ? `${c.name} — ` : ""}
                        <span className="text-ink-soft">{c.email}</span>
                      </label>
                    </li>
                  ))}
              </ul>
            </div>
          ) : null}
          <p className="mt-2 text-[0.88rem] text-ink-faint">
            {recipients.length ? `${recipients.length} ${recipients.length === 1 ? "person" : "people"} will receive this.` : "Nobody chosen yet."}{" "}
            {!active.length ? (
              <button type="button" onClick={onPeople} className="cursor-pointer underline">
                Add people first
              </button>
            ) : null}
            {recipients.length > data.dailyLimit ? ` That's more than the ${data.dailyLimit} emails a day the account allows — send part of it tomorrow.` : ""}
          </p>
        </div>

        <label className="block">
          <span className="mb-1 block font-display text-[1.1rem]">Subject</span>
          <input value={draft.subject} onChange={(e) => setDraft({ ...draft, subject: e.target.value })} placeholder="e.g. Conservation at Shravanabelagola — September update" className={field} />
        </label>

        <label className="block">
          <span className="mb-1 block font-display text-[1.1rem]">Message</span>
          <textarea
            value={draft.body}
            onChange={(e) => setDraft({ ...draft, body: e.target.value })}
            rows={12}
            placeholder={"Dear friends,\n\nWrite as you would in any email.\n\n- A line starting with a dash becomes a list\n- Web addresses become links"}
            className={`${field} leading-relaxed`}
          />
          <span className="mt-1 block text-[0.85rem] text-ink-faint">
            Leave a blank line between paragraphs. It&apos;s laid out in the Foundation&apos;s style automatically — see the right.
          </span>
        </label>

        <div>
          <span className="mb-1 block font-display text-[1.1rem]">Attach a report (optional)</span>
          {attachment ? (
            <p className="flex items-center gap-3 text-[0.95rem]">
              📎 {attachment.name} <span className="text-ink-faint">({Math.round(attachment.size / 1024)} KB)</span>
              <button type="button" onClick={() => setAttachment(null)} className="cursor-pointer text-cinnabar-deep underline">
                Remove
              </button>
            </p>
          ) : (
            <label className="inline-flex cursor-pointer rounded-md border border-ink/25 bg-white/80 px-3.5 py-2 text-[0.92rem] hover:border-cinnabar">
              Choose a file (PDF, Word or photo, up to 3 MB)
              <input
                type="file"
                accept=".pdf,.doc,.docx,image/jpeg,image/png"
                className="sr-only"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  if (file.size > 3 * 1024 * 1024) {
                    setStatus({ kind: "error", text: "That file is larger than 3 MB — share a smaller copy, or a link to it." });
                    return;
                  }
                  const reader = new FileReader();
                  reader.onload = () =>
                    setAttachment({ name: file.name, type: file.type || "application/pdf", data: String(reader.result).split(",")[1] ?? "", size: file.size });
                  reader.readAsDataURL(file);
                }}
              />
            </label>
          )}
        </div>

        <div className="flex flex-wrap gap-2 border-t border-ink/10 pt-5">
          <button type="button" disabled={!ready || status.kind === "busy" || data.mode === "none"} onClick={test} className={`${button} border border-ink/25 bg-white/80 hover:border-cinnabar`}>
            Send me a test
          </button>
          <button
            type="button"
            disabled={!ready || !recipients.length || status.kind === "busy" || data.mode === "none"}
            onClick={sendAll}
            className={`${button} bg-cinnabar text-leaf hover:bg-cinnabar-deep`}
          >
            Send to {recipients.length} {recipients.length === 1 ? "person" : "people"}
          </button>
          <button
            type="button"
            disabled={!ready || status.kind === "busy"}
            onClick={shareOnWhatsApp}
            className={`${button} border border-emerald-800/40 bg-white/80 text-emerald-900 hover:bg-emerald-50`}
          >
            Share on WhatsApp
          </button>
          {canShareFile ? (
            <button
              type="button"
              disabled={!ready || status.kind === "busy"}
              onClick={shareWithFile}
              className={`${button} border border-emerald-800/40 bg-white/80 text-emerald-900 hover:bg-emerald-50`}
            >
              Share with the file attached
            </button>
          ) : null}
        </div>
        {attachment ? (
          <p className="text-[0.82rem] text-ink-faint">
            On WhatsApp the report travels as a short link that shows the Foundation&apos;s card{canShareFile ? " — or use “Share with the file attached” to send the file itself" : ""}.
          </p>
        ) : null}
        {status.text ? (
          <p role="status" className={`text-[0.95rem] ${status.kind === "error" ? "text-cinnabar-deep" : status.kind === "done" ? "text-emerald-800" : "text-ink-soft"}`}>
            {status.text}
          </p>
        ) : null}
      </div>

      <div>
        <p className="mb-2 font-display text-[1.1rem]">How it arrives</p>
        <iframe title="The email, as it arrives" srcDoc={preview} sandbox="" className="h-[44rem] w-full rounded-md border border-ink/15 bg-white" />
        {data.sender ? <p className="mt-2 text-[0.85rem] text-ink-faint">Sent from {data.sender}; replies go to {data.org.email}.</p> : null}
      </div>
    </div>
  );
}

function People({ data, onSaved }: { data: Data; onSaved: (contacts: Contact[]) => void }) {
  const [text, setText] = useState("");
  const [groups, setGroups] = useState<string[]>(["newsletter"]);
  const [filter, setFilter] = useState("");
  const [state, setState] = useState<{ kind: "idle" | "saving" | "saved" | "error"; text: string }>({ kind: "idle", text: "" });

  async function save(contacts: Contact[], done: string) {
    setState({ kind: "saving", text: "Saving…" });
    const res = await fetch("/api/cms/mail/contacts", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contacts }),
    }).catch(() => null);
    if (!res?.ok) {
      setState({ kind: "error", text: (await res?.text().catch(() => "")) || "Couldn't save — check the connection and try again." });
      return false;
    }
    onSaved(((await res.json()) as { contacts: Contact[] }).contacts);
    setState({ kind: "saved", text: done });
    return true;
  }

  async function add() {
    const found = parseAddresses(text);
    if (!found.length) {
      setState({ kind: "error", text: "No email addresses found there." });
      return;
    }
    const byEmail = new Map(data.contacts.map((c) => [c.email, { ...c }]));
    let added = 0;
    for (const f of found) {
      const existing = byEmail.get(f.email);
      if (existing) {
        existing.groups = [...new Set([...existing.groups, ...groups])];
        if (!existing.name && f.name) existing.name = f.name;
      } else {
        byEmail.set(f.email, { email: f.email, name: f.name, groups: [...groups], unsubscribed: null, added: new Date().toISOString() });
        added++;
      }
    }
    if (await save([...byEmail.values()], `Added ${added} new ${added === 1 ? "person" : "people"}${found.length > added ? `; ${found.length - added} were already on the list` : ""} ✓`)) setText("");
  }

  const shown = data.contacts.filter((c) => `${c.name} ${c.email}`.toLowerCase().includes(filter.toLowerCase()));
  return (
    <div className="grid gap-8 lg:grid-cols-[22rem_minmax(0,1fr)]">
      <div className="space-y-3">
        <p className="font-display text-[1.1rem]">Add people</p>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={8}
          placeholder={"Paste email addresses, one per line.\nA name can go first:\nAnil Sethi <anil@example.com>"}
          className={field}
        />
        <div className="flex flex-wrap gap-3 text-[0.92rem]">
          <span className="text-ink-soft">Add to:</span>
          {data.groups.map((g) => (
            <label key={g.id} className="flex cursor-pointer items-center gap-1.5">
              <input
                type="checkbox"
                checked={groups.includes(g.id)}
                onChange={(e) => setGroups(e.target.checked ? [...groups, g.id] : groups.filter((x) => x !== g.id))}
              />
              {g.name}
            </label>
          ))}
        </div>
        <button type="button" onClick={add} disabled={state.kind === "saving" || !text.trim()} className={`${button} bg-ink text-leaf hover:bg-board`}>
          Add to the list
        </button>
        {state.text ? <p className={`text-[0.9rem] ${state.kind === "error" ? "text-cinnabar-deep" : "text-emerald-800"}`}>{state.text}</p> : null}
        <p className="text-[0.82rem] leading-relaxed text-ink-faint">
          Every email carries an unsubscribe link. Anyone who unsubscribes stays off the list, even if they&apos;re added again. The list is stored encrypted — not in the
          website&apos;s code.
        </p>
      </div>
      <div>
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <p className="font-display text-[1.1rem]">
            {data.contacts.length} {data.contacts.length === 1 ? "person" : "people"}
          </p>
          <input value={filter} onChange={(e) => setFilter(e.target.value)} placeholder="Find…" className={`${field} max-w-xs`} />
        </div>
        {shown.length ? (
          <ul className="divide-y divide-ink/10 rounded-md border border-ink/12 bg-white/50">
            {shown.map((c) => (
              <li key={c.email} className="flex flex-wrap items-center gap-x-4 gap-y-2 px-4 py-2.5">
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[0.95rem]">{c.name || c.email}</span>
                  {c.name ? <span className="block truncate text-[0.82rem] text-ink-faint">{c.email}</span> : null}
                </span>
                {c.unsubscribed ? (
                  <span className="rounded-full bg-ink/8 px-2.5 py-0.5 text-[0.78rem] text-ink-soft">Unsubscribed</span>
                ) : (
                  data.groups.map((g) => {
                    const on = c.groups.includes(g.id);
                    return (
                      <button
                        key={g.id}
                        type="button"
                        aria-pressed={on}
                        onClick={() =>
                          save(
                            data.contacts.map((x) => (x.email === c.email ? { ...x, groups: on ? x.groups.filter((y) => y !== g.id) : [...x.groups, g.id] } : x)),
                            "Saved ✓",
                          )
                        }
                        className={`cursor-pointer rounded-full border px-2.5 py-0.5 text-[0.8rem] ${on ? "border-board bg-board text-board-ink" : "border-ink/20 text-ink-faint hover:border-cinnabar"}`}
                      >
                        {g.name}
                      </button>
                    );
                  })
                )}
                <button
                  type="button"
                  aria-label={`Remove ${c.email}`}
                  title="Remove"
                  onClick={() => {
                    if (window.confirm(`Remove ${c.email} from the list?`)) save(data.contacts.filter((x) => x.email !== c.email), "Removed ✓");
                  }}
                  className="cursor-pointer rounded-md px-2 py-1 text-ink-faint hover:bg-ink/5 hover:text-cinnabar"
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="rounded-md bg-white/50 px-4 py-6 text-center text-ink-faint">{data.contacts.length ? "Nobody matches." : "No one on the list yet — paste some addresses on the left."}</p>
        )}
      </div>
    </div>
  );
}

function SentList({ sent }: { sent: Sent[] }) {
  if (!sent.length) return <p className="rounded-md bg-white/50 px-4 py-6 text-center text-ink-faint">Nothing sent yet.</p>;
  return (
    <ul className="divide-y divide-ink/10 rounded-md border border-ink/12 bg-white/50">
      {sent.map((s) => (
        <li key={s.at} className="flex flex-wrap items-baseline justify-between gap-2 px-4 py-3">
          <span>
            <span className="block text-[0.98rem]">{s.subject}</span>
            <span className="text-[0.84rem] text-ink-faint">
              To {s.to || "chosen people"} · {s.count} {s.count === 1 ? "person" : "people"}
              {s.attachment ? ` · 📎 ${s.attachment}` : ""}
            </span>
          </span>
          <span className="font-mono text-[0.78rem] text-ink-faint">
            {new Date(s.at).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Kolkata" })}
          </span>
        </li>
      ))}
    </ul>
  );
}
