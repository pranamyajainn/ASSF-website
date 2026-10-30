import "server-only";
import type { Lang } from "@/i18n/config";
import { appendLine, readLines } from "@/lib/data/lines";
import { deliver, mailMode } from "@/lib/mail/send";
import { qrGiving } from "./config";

/**
 * Gifts by the Foundation's UPI QR code. The bank tells the Foundation a
 * payment arrived, but not who made it; so the donor's details, left before
 * the QR is shown, are kept here (sealed, like every line on the
 * private-data branch) for the editor's Insights, where the Foundation
 * matches them to its bank statement, and sends a tax receipt where one is owed.
 */
export type QrGift = {
  at: string;
  ref: string;
  amount: number;
  category: string;
  quantity: number;
  name: string;
  mobile: string;
  email: string;
  taxId: string;
  address: string;
  remarks: string;
  updates: boolean;
  lang: Lang;
};

const DIR = "qr-gifts";

export async function readQrGifts(days: number): Promise<QrGift[]> {
  return (await readLines<QrGift>(DIR, days)).sort((a, b) => b.at.localeCompare(a.at));
}

/** Keeps the gift, then tells the Foundation by email when the site can send it. Never throws. */
export async function recordQrGift(gift: Omit<QrGift, "at">): Promise<void> {
  const at = new Date().toISOString();
  await appendLine(DIR, { ...gift, at } satisfies QrGift, "A gift by QR code");
  if (mailMode === "none") return;
  const when = new Date(at).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Kolkata" });
  const lines = [
    `Amount: ₹${gift.amount.toLocaleString("en-IN")}`,
    `For: ${gift.category}${gift.quantity > 1 ? ` × ${gift.quantity}` : ""}`,
    `Name: ${gift.name}`,
    `WhatsApp: +91 ${gift.mobile}`,
    gift.email ? `Email: ${gift.email}` : "",
    gift.taxId ? `PAN or Aadhaar: ${gift.taxId}` : "",
    gift.address ? `Address: ${gift.address}` : "",
    gift.remarks ? `Note: ${gift.remarks}` : "",
    gift.updates ? "Asked for the Foundation's email updates." : "",
    `Reference: ${gift.ref}`,
    `When: ${when} (India time)`,
  ].filter(Boolean);
  const text = [
    "A donor opened the UPI QR code on the website's donate page. Please check the bank statement for the payment (it may differ from the amount chosen, or not have been made). If the donor gave a PAN or Aadhaar and an address, they are owed a tax receipt.",
    "",
    ...lines,
  ].join("\n");
  const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  try {
    await deliver({
      to: qrGiving.notify,
      subject: `Gift by QR code: ₹${gift.amount.toLocaleString("en-IN")} from ${gift.name}`,
      text,
      html: `<p>${esc(text.split("\n")[0])}</p><p>${lines.map(esc).join("<br>")}</p>`,
      replyTo: gift.email || qrGiving.notify,
      unsubscribe: null,
      attachment: null,
    });
  } catch (err) {
    console.error("Couldn't email a QR gift", err instanceof Error ? err.message : err);
  }
}
