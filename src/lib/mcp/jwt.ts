import "server-only";
import { createHash, createHmac, hkdfSync, timingSafeEqual } from "node:crypto";

/**
 * Small signed tokens (JWS, HS256) for the AI connector's sign-in: client
 * registrations, authorization codes, access and refresh tokens, and the
 * review links of proposed changes. Signed with a key derived from
 * AUTH_SECRET, so nothing needs to be stored: a token is valid because the
 * site signed it, and rotating AUTH_SECRET retires every one at once.
 *
 * Each kind of token carries its own `typ`, and verification insists on it,
 * so a token of one kind can never be used as another.
 */
export type TokenType = "client" | "code" | "access" | "refresh" | "proposal";

const b64 = (data: Buffer | string) => Buffer.from(data).toString("base64url");

function key(): Buffer {
  const secret = process.env.AUTH_SECRET;
  if (!secret) throw new Error("AUTH_SECRET is not set");
  return Buffer.from(hkdfSync("sha256", secret, "assf-mcp", "assf-mcp-tokens-v1", 32));
}

export function sign(typ: TokenType, claims: Record<string, unknown>, ttlSeconds: number): string {
  const now = Math.floor(Date.now() / 1000);
  const header = b64(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const body = b64(JSON.stringify({ ...claims, typ, iat: now, exp: now + ttlSeconds }));
  const signature = createHmac("sha256", key()).update(`${header}.${body}`).digest("base64url");
  return `${header}.${body}.${signature}`;
}

/** The token's claims, if it is ours, of this kind, and unexpired; otherwise null. */
export function verify<T extends Record<string, unknown>>(typ: TokenType, token: string | null | undefined): (T & { exp: number }) | null {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [header, body, signature] = parts;
  try {
    const expected = createHmac("sha256", key()).update(`${header}.${body}`).digest();
    const given = Buffer.from(signature, "base64url");
    if (given.length !== expected.length || !timingSafeEqual(given, expected)) return null;
    if (JSON.parse(Buffer.from(header, "base64url").toString()).alg !== "HS256") return null;
    const claims = JSON.parse(Buffer.from(body, "base64url").toString()) as T & { typ: string; exp: number };
    if (claims.typ !== typ || typeof claims.exp !== "number" || claims.exp < Math.floor(Date.now() / 1000)) return null;
    return claims;
  } catch {
    return null;
  }
}

/** PKCE (S256): does this verifier answer this challenge? */
export function pkceMatches(verifier: string, challenge: string): boolean {
  if (!/^[A-Za-z0-9\-._~]{43,128}$/.test(verifier)) return false;
  const digest = createHash("sha256").update(verifier).digest("base64url");
  return digest.length === challenge.length && timingSafeEqual(Buffer.from(digest), Buffer.from(challenge));
}
