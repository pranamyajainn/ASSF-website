import { editedContent } from "@/i18n/content";
import { locales } from "@/i18n/config";
import { editorRequest } from "@/lib/cms/access";
import { readEdits, storage } from "@/lib/cms/store";
import { zip } from "@/lib/data/zip";
import { readQuestions, KEEP_DAYS } from "@/lib/insights/questions";
import { readGifts } from "@/lib/donate/apnadharm";
import { GROUPS, readMail } from "@/lib/mail/data";

export const runtime = "nodejs";
export const maxDuration = 60;

/** A spreadsheet cell: quoted, and never read as a formula. */
const cell = (v: unknown) => {
  const s = v === null || v === undefined ? "" : String(v);
  return `"${(/^[=+\-@]/.test(s) ? `'${s}` : s).replace(/"/g, '""')}"`;
};
const csv = (header: string[], rows: unknown[][]) => `﻿${[header, ...rows].map((r) => r.map(cell).join(",")).join("\r\n")}\r\n`;

/**
 * Everything the Foundation keeps on the site, in one download it can open
 * without us: the site's words in all three languages, the editor's changes,
 * the mailing list, what was sent, and the visitors' questions. So the
 * Foundation always has its own copy, whatever happens to any service.
 */
export async function GET(req: Request) {
  const editor = await editorRequest(req);
  if (editor instanceof Response) return editor;
  if (storage === "none") return new Response("The editor isn't connected to storage.", { status: 503 });

  try {
    const [{ edits }, mail, questions, gifts] = await Promise.all([readEdits(), readMail(), readQuestions(KEEP_DAYS), readGifts(KEEP_DAYS)]);
    const now = new Date();
    const stamp = now.toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
    const groupName = (id: string) => GROUPS.find((g) => g.id === id)?.name ?? id;
    const files = [
      {
        name: "READ ME.txt",
        data: [
          `Acharya Shanti Sagar Foundation — website backup, ${now.toLocaleString("en-IN", { dateStyle: "long", timeStyle: "short", timeZone: "Asia/Kolkata" })} (India time)`,
          "",
          "site-content/english.json, hindi.json, kannada.json — every word on the site, as published, in each language.",
          "site-content/editor-changes.json — the changes made in the site editor, which the web team can restore from.",
          "mailing-list.csv — everyone on the email list, their groups, and whether they unsubscribed. Opens in Excel or Google Sheets.",
          "emails-sent.csv — every newsletter and report sent from the editor.",
          `visitor-questions.csv — what visitors asked the AI assistant in the last ${KEEP_DAYS} days, and its answers. No one's identity is kept.`,
          "online-gifts.csv — gifts started on the website's donate page in the last year, and how each ended, as the donor's browser heard from the bank. The Foundation's Apna Dharm account is the record of every gift.",
          "",
          `Downloaded by ${editor.email}. Keep this file private: the mailing list is personal information.`,
        ].join("\r\n"),
      },
      ...locales.map((l) => ({
        name: `site-content/${{ en: "english", hi: "hindi", kn: "kannada" }[l]}.json`,
        data: JSON.stringify(editedContent(l, edits), null, 2),
      })),
      { name: "site-content/editor-changes.json", data: JSON.stringify(edits, null, 2) },
      {
        name: "mailing-list.csv",
        data: csv(
          ["Email", "Name", "Groups", "Unsubscribed", "Added"],
          mail.contacts.map((c) => [c.email, c.name, c.groups.map(groupName).join("; "), c.unsubscribed ?? "", c.added]),
        ),
      },
      {
        name: "emails-sent.csv",
        data: csv(["Sent", "Subject", "To", "People", "Attachment"], mail.sent.map((s) => [s.at, s.subject, s.to, s.count, s.attachment ?? ""])),
      },
      {
        name: "online-gifts.csv",
        data: csv(["Started", "Reference", "Outcome", "Amount (₹)", "For", "Language"], gifts.map((g) => [g.at, g.txn, g.status, g.amount, g.category, g.lang])),
      },
      {
        name: "visitor-questions.csv",
        data: csv(
          ["Asked", "Language", "Page", "Spoken", "Sent to email/phone", "Question", "Answer"],
          questions.map((q) => [q.at, q.lang, q.page ?? "", q.spoken ? "yes" : "", q.deflected ? "yes" : "", q.q, q.a]),
        ),
      },
    ];
    console.info("CMS backup", { editor: editor.email, contacts: mail.contacts.length, questions: questions.length });
    return new Response(new Uint8Array(zip(files, now)), {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="assf-website-backup-${stamp}.zip"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    console.error("Backup failed", err);
    return new Response("The backup couldn't be made just now. Please try again in a minute.", { status: 502 });
  }
}
