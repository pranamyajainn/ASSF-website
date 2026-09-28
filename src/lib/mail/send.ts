import "server-only";
import { appendFile, mkdir } from "node:fs/promises";
import { join } from "node:path";
import nodemailer from "nodemailer";
import { sign } from "@/lib/mcp/jwt";

/**
 * Sending the Foundation's updates through its own Gmail or Google
 * Workspace account (SMTP with an app password): SMTP_USER is the address,
 * SMTP_PASS the sixteen-letter app password. Gmail allows about 500
 * messages a day, Workspace about 2,000.
 *
 * Without them, `next dev` writes each message to .cms-data/outbox.jsonl
 * instead of sending it; production says sending isn't connected.
 */
const user = process.env.SMTP_USER;
const pass = process.env.SMTP_PASS?.replace(/\s+/g, "");
export const mailMode: "smtp" | "outbox" | "none" = user && pass ? "smtp" : process.env.NODE_ENV === "development" ? "outbox" : "none";
export const sender = user ?? "outbox@localhost";
export const DAILY_LIMIT = Number(process.env.SMTP_DAILY_LIMIT) || (sender.endsWith("@gmail.com") ? 500 : 2000);

const transport =
  mailMode === "smtp"
    ? nodemailer.createTransport({
        host: process.env.SMTP_HOST || "smtp.gmail.com",
        port: Number(process.env.SMTP_PORT) || 465,
        secure: (Number(process.env.SMTP_PORT) || 465) === 465,
        auth: { user, pass },
        disableFileAccess: true,
        disableUrlAccess: true,
      })
    : null;

/** A reader's own unsubscribe link: a signed token naming them, valid for years. */
export function unsubscribeLink(site: string, email: string): string {
  return `${site}/unsubscribe?t=${sign("unsubscribe", { email }, 60 * 60 * 24 * 365 * 5)}`;
}

export type Outgoing = {
  to: string;
  subject: string;
  html: string;
  text: string;
  replyTo: string;
  unsubscribe: string | null;
  attachment: { filename: string; contentType: string; content: Buffer } | null;
};

export async function deliver(m: Outgoing): Promise<void> {
  const message = {
    from: { name: process.env.MAIL_FROM_NAME || "Acharya Shanti Sagar Foundation", address: sender },
    to: m.to,
    replyTo: m.replyTo,
    subject: m.subject,
    html: m.html,
    text: m.text,
    attachments: m.attachment ? [m.attachment] : [],
    // One-click unsubscribe (RFC 8058), which Gmail and Yahoo expect of mailing lists.
    // The link in the text opens a page; the header points where mail apps POST.
    headers: m.unsubscribe
      ? { "List-Unsubscribe": `<${m.unsubscribe.replace("/unsubscribe?", "/api/unsubscribe?")}>`, "List-Unsubscribe-Post": "List-Unsubscribe=One-Click" }
      : {},
  };
  if (transport) {
    await transport.sendMail(message);
    return;
  }
  if (mailMode === "outbox") {
    const dir = join(process.cwd(), ".cms-data");
    await mkdir(dir, { recursive: true });
    const { html: _html, ...rest } = message;
    void _html;
    await appendFile(
      join(dir, "outbox.jsonl"),
      `${JSON.stringify({ ...rest, attachments: rest.attachments.map((a) => ({ filename: a.filename, bytes: a.content.length })), at: new Date().toISOString() })}\n`,
    );
    return;
  }
  throw new Error("Email sending isn't connected yet.");
}
