/**
 * Emailed sign-in links for the document vault, for trustees whose address
 * isn't a Google account (Yahoo, Rediff, a company domain). The link carries
 * a token the site signed (HMAC-SHA256, a key derived from AUTH_SECRET) with
 * the address and a fifteen-minute expiry: opening it proves the reader holds
 * that inbox, and the vault's list decides the rest. Nothing is stored.
 *
 * No server-only import: auth.ts (which the proxy loads) verifies these.
 */
import { createHmac, hkdfSync, timingSafeEqual } from "node:crypto";

/** How long an emailed link works. */
export const LINK_MINUTES = 15;

function key(): Buffer {
  const secret = process.env.AUTH_SECRET;
  if (!secret) throw new Error("AUTH_SECRET is not set");
  return Buffer.from(hkdfSync("sha256", secret, "assf-vault", "assf-vault-sign-in-link-v1", 32));
}

export function signLink(email: string, now = Date.now()): string {
  const body = Buffer.from(JSON.stringify({ e: email.trim().toLowerCase(), x: Math.floor(now / 1000) + LINK_MINUTES * 60 })).toString("base64url");
  return `${body}.${createHmac("sha256", key()).update(body).digest("base64url")}`;
}

/** The address a link was made for, if the site signed it and it hasn't expired; otherwise null. */
export function linkAddress(token: unknown, now = Date.now()): string | null {
  if (typeof token !== "string" || token.length > 600) return null;
  const [body, signature, extra] = token.split(".");
  if (!body || !signature || extra !== undefined) return null;
  try {
    const expected = createHmac("sha256", key()).update(body).digest();
    const given = Buffer.from(signature, "base64url");
    if (given.length !== expected.length || !timingSafeEqual(given, expected)) return null;
    const { e, x } = JSON.parse(Buffer.from(body, "base64url").toString()) as { e?: unknown; x?: unknown };
    if (typeof e !== "string" || typeof x !== "number" || x < Math.floor(now / 1000)) return null;
    return e;
  } catch {
    return null;
  }
}
