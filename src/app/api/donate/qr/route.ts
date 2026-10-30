import { randomBytes } from "node:crypto";
import { isLang } from "@/i18n/config";
import { EMAIL, MOBILE, taxIdKind } from "@/lib/donate/checkout";
import { MIN_GIFT, qrGiving } from "@/lib/donate/config";
import { recordQrGift } from "@/lib/donate/qr";
import { clientKey, overLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

/**
 * A donor's details, sent just before the UPI QR code is shown: kept for
 * the Foundation (lib/donate/qr.ts), with a short reference the donor sees.
 */
export async function POST(req: Request) {
  if (!qrGiving.on) return new Response("Not in use.", { status: 404 });
  const origin = req.headers.get("origin");
  const site = req.headers.get("sec-fetch-site");
  // Browsers always send Origin with a POST; a request without one didn't come from the donate page.
  let sameOrigin = false;
  try {
    if (origin) sameOrigin = new URL(origin).host === new URL(req.url).host;
  } catch {
    sameOrigin = false;
  }
  if (!sameOrigin || (site && site !== "same-origin")) return new Response("Forbidden.", { status: 403 });
  if (overLimit(`qr:${clientKey(req)}`, [{ ms: 60 * 60_000, max: 12 }])) return new Response("Too many.", { status: 429 });
  if (Number(req.headers.get("content-length") ?? 0) > 4000) return new Response("Too large.", { status: 413 });

  const b = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  const str = (k: string, max: number) => (typeof b?.[k] === "string" ? (b[k] as string).replace(/\s+/g, " ").trim().slice(0, max) : "");
  const amount = Math.round(Number(b?.amount) || 0);
  const name = str("name", 100);
  const mobile = str("mobile", 10);
  const email = str("email", 200);
  const taxId = str("taxId", 12).toUpperCase();
  if (amount < MIN_GIFT || amount > 10_000_000 || !name || !MOBILE.test(mobile) || (email && !EMAIL.test(email)) || (taxId && !taxIdKind(taxId))) {
    return new Response("Invalid.", { status: 400 });
  }
  const lang = typeof b?.lang === "string" && isLang(b.lang) ? b.lang : "en";
  const ref = `QR-${randomBytes(4).toString("hex").toUpperCase().slice(0, 6)}`;

  await recordQrGift({
    ref,
    amount,
    category: str("category", 120),
    quantity: Math.max(1, Math.min(100_000, Math.floor(Number(b?.quantity) || 1))),
    name,
    mobile,
    email,
    taxId,
    address: str("address", 300),
    remarks: str("remarks", 300),
    updates: b?.updates === true && !!email,
    lang,
  });
  return Response.json({ ref });
}
