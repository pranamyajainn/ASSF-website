"use client";

import { useState } from "react";

/**
 * Newsletter sign-up as an email: it opens the reader's mail app with their
 * name and contact already written, addressed to the Foundation. Nothing is
 * stored by the site.
 * shortcut: no one-click sign-up; that needs a privacy page and a confirmation email first.
 */
export function NewsletterForm({
  to,
  labels,
}: {
  to: string;
  labels: { name: string; contact: string; button: string; subject: string; thanks: string };
}) {
  const [sent, setSent] = useState(false);
  const field = "mt-1.5 w-full rounded-md border border-board-soft/40 bg-board-deep/60 px-3.5 py-3 text-[1.05rem] text-board-ink outline-none focus:border-orpiment";
  return (
    <form
      className="min-w-0"
      onSubmit={(e) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        const body = `${labels.name}: ${data.get("name")}\n${labels.contact}: ${data.get("contact")}`;
        window.location.href = `mailto:${to}?subject=${encodeURIComponent(labels.subject)}&body=${encodeURIComponent(body)}`;
        setSent(true);
      }}
    >
      <label className="block font-mono text-[0.75rem] text-orpiment">
        {labels.name}
        <input name="name" required maxLength={100} autoComplete="name" className={field} />
      </label>
      <label className="mt-4 block font-mono text-[0.75rem] text-orpiment">
        {labels.contact}
        <input name="contact" required maxLength={200} autoComplete="email" className={field} />
      </label>
      <button type="submit" className="mt-5 inline-flex min-h-12 cursor-pointer items-center bg-cinnabar px-6 py-3 text-[1.0625rem] text-leaf hover:bg-cinnabar-deep">
        {labels.button}
      </button>
      {sent ? (
        <p role="status" className="mt-4 text-[1.02rem] text-board-ink">
          {labels.thanks}
        </p>
      ) : null}
    </form>
  );
}
