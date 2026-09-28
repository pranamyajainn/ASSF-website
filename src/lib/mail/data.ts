import "server-only";
import { createCipheriv, createDecipheriv, hkdfSync, randomBytes } from "node:crypto";
import { Conflict, readDataFile, withRetry, writeDataFile } from "@/lib/cms/store";

/**
 * The Foundation's mailing list and the record of what was sent.
 *
 * Kept encrypted (AES-256-GCM) in a file on the private-data branch
 * (lib/cms/store.ts → cms-data): the repository is public, and people's
 * email addresses must not be readable there. The key comes from
 * MAIL_DATA_KEY, or else from AUTH_SECRET — rotating that secret without
 * setting MAIL_DATA_KEY to the old value would make the list unreadable.
 */
export type Contact = { email: string; name: string; groups: string[]; unsubscribed: string | null; added: string };
export type SentRecord = { at: string; subject: string; to: string; count: number; attachment: string | null };
export type MailData = { contacts: Contact[]; sent: SentRecord[] };

const FILE = "mail.enc.json";
export const GROUPS = [
  { id: "newsletter", name: "Newsletter" },
  { id: "trustees", name: "Trustees" },
] as const;

function key(): Buffer {
  const secret = process.env.MAIL_DATA_KEY || process.env.AUTH_SECRET;
  if (!secret) throw new Error("No key for the mailing list (AUTH_SECRET is not set).");
  return Buffer.from(hkdfSync("sha256", secret, "assf-mail", "assf-mail-data-v1", 32));
}

function seal(data: MailData): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key(), iv);
  const body = Buffer.concat([cipher.update(JSON.stringify(data), "utf8"), cipher.final()]);
  return `${JSON.stringify({ v: 1, iv: iv.toString("base64"), tag: cipher.getAuthTag().toString("base64"), data: body.toString("base64") })}\n`;
}

function open(text: string): MailData {
  const box = JSON.parse(text) as { iv: string; tag: string; data: string };
  const decipher = createDecipheriv("aes-256-gcm", key(), Buffer.from(box.iv, "base64"));
  decipher.setAuthTag(Buffer.from(box.tag, "base64"));
  const plain = Buffer.concat([decipher.update(Buffer.from(box.data, "base64")), decipher.final()]).toString("utf8");
  const data = JSON.parse(plain) as Partial<MailData>;
  return { contacts: data.contacts ?? [], sent: data.sent ?? [] };
}

export async function readMail(): Promise<MailData> {
  const { text } = await readDataFile(FILE);
  return text ? open(text) : { contacts: [], sent: [] };
}

/** Reads, changes and writes the list, starting over if someone else wrote in between. */
export async function updateMail(change: (data: MailData) => MailData, message: string): Promise<MailData> {
  return withRetry(async () => {
    const { text, head } = await readDataFile(FILE);
    const next = change(text ? open(text) : { contacts: [], sent: [] });
    try {
      await writeDataFile(FILE, seal(next), message, head);
    } catch (err) {
      // Two writers starting the branch at once: the loser starts over.
      if (!head && err instanceof Error && /GitHub 422|Reference already exists/.test(err.message)) throw new Conflict("branch exists");
      throw err;
    }
    return next;
  });
}

export const EMAIL = /^[^\s@<>,;"]+@[^\s@<>,;"]+\.[^\s@<>,;"]{2,}$/;
export const normalise = (email: string) => email.trim().toLowerCase();
