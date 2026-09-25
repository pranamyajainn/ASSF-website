import "server-only";
import { sign, verify } from "./jwt";

/**
 * Sign-in for AI apps (Claude, ChatGPT) connecting to the site's MCP server,
 * following the MCP authorization spec: the site is both the protected
 * resource (/api/mcp) and its own OAuth 2.1 authorization server, and the
 * person signing in proves who they are with the same Google account and
 * editor allowlist as the site editor.
 *
 * Nothing is stored. A registered client's id is a signed token carrying its
 * name and redirect addresses; codes and tokens are signed too (see jwt.ts).
 */

export const SCOPE = "site";
export const ACCESS_TTL = 60 * 60; // an hour
export const REFRESH_TTL = 60 * 60 * 24 * 60; // sixty days
const CODE_TTL = 120;
const CLIENT_TTL = 60 * 60 * 24 * 365 * 5;

/**
 * Where a sign-in may send its code back to: the AI apps people actually
 * use, and the person's own computer (Claude Desktop, Claude Code, the MCP
 * Inspector). Anything else is refused, so a look-alike app can't collect
 * an editor's access. MCP_REDIRECT_HOSTS adds more, comma-separated.
 */
const REDIRECT_HOSTS = new Set([
  "claude.ai",
  "claude.com",
  "chatgpt.com",
  "chat.openai.com",
  ...(process.env.MCP_REDIRECT_HOSTS ?? "")
    .split(",")
    .map((h) => h.trim().toLowerCase())
    .filter(Boolean),
]);

const isLoopback = (url: URL) => url.protocol === "http:" && ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname);

export function redirectAllowed(uri: string): boolean {
  try {
    const url = new URL(uri);
    if (url.hash) return false;
    if (url.protocol === "http:") return isLoopback(url);
    return url.protocol === "https:" && [...REDIRECT_HOSTS].some((h) => url.hostname === h || url.hostname.endsWith(`.${h}`));
  } catch {
    return false;
  }
}

/**
 * Whether a sign-in may return to `requested`, given an address the client
 * registered. Exactly the same — or, for an app on the person's own computer
 * (Codex, Claude Code), the same loopback address and path on whatever port
 * it happens to be listening on (RFC 8252 §7.3).
 */
export function redirectMatches(registered: string, requested: string): boolean {
  if (registered === requested) return true;
  try {
    const a = new URL(registered);
    const b = new URL(requested);
    return isLoopback(a) && isLoopback(b) && a.hostname === b.hostname && a.pathname === b.pathname && a.search === b.search;
  } catch {
    return false;
  }
}

export type Client = { name: string; redirectUris: string[] };

/** Registers a client (RFC 7591) by signing its details into its id. */
export function registerClient(name: string, redirectUris: string[]): string {
  return sign("client", { name, redirect_uris: redirectUris }, CLIENT_TTL);
}

/**
 * The client behind an id: one this site registered, or — a Client ID
 * Metadata Document — an https URL that publishes its own details.
 */
export async function lookupClient(clientId: string): Promise<Client | null> {
  const registered = verify<{ name: string; redirect_uris: string[] }>("client", clientId);
  if (registered) return { name: registered.name, redirectUris: registered.redirect_uris };
  if (!/^https:\/\/[^/]+\/.+/.test(clientId)) return null;
  try {
    const res = await fetch(clientId, { headers: { Accept: "application/json" }, signal: AbortSignal.timeout(5000) });
    if (!res.ok) return null;
    const doc = (await res.json()) as { client_id?: string; client_name?: string; redirect_uris?: unknown };
    if (doc.client_id !== clientId || !Array.isArray(doc.redirect_uris)) return null;
    const redirectUris = doc.redirect_uris.filter((u): u is string => typeof u === "string");
    return { name: doc.client_name || new URL(clientId).hostname, redirectUris };
  } catch {
    return null;
  }
}

export type CodeClaims = { client_id: string; redirect_uri: string; code_challenge: string; email: string; client_name: string };
export type AccessClaims = { sub: string; client_id: string; client_name: string; aud: string; scope: string };

export function issueCode(claims: CodeClaims): string {
  return sign("code", claims, CODE_TTL);
}

export function issueTokens(email: string, client: { id: string; name: string }, resource: string) {
  const claims = { sub: email, client_id: client.id, client_name: client.name, aud: resource, scope: SCOPE };
  return {
    access_token: sign("access", claims, ACCESS_TTL),
    refresh_token: sign("refresh", claims, REFRESH_TTL),
    token_type: "Bearer",
    expires_in: ACCESS_TTL,
    scope: SCOPE,
  };
}

/** The site's origin as the request reached it (the Vercel address now, the Foundation's domain later). */
export function originOf(req: Request): string {
  return new URL(req.url).origin;
}

export const resourceOf = (origin: string) => `${origin}/api/mcp`;

export function authorizationServerMetadata(origin: string) {
  return {
    issuer: origin,
    authorization_endpoint: `${origin}/oauth/authorize`,
    token_endpoint: `${origin}/api/oauth/token`,
    registration_endpoint: `${origin}/api/oauth/register`,
    scopes_supported: [SCOPE],
    response_types_supported: ["code"],
    response_modes_supported: ["query"],
    grant_types_supported: ["authorization_code", "refresh_token"],
    token_endpoint_auth_methods_supported: ["none"],
    code_challenge_methods_supported: ["S256"],
    client_id_metadata_document_supported: true,
    service_documentation: `${origin}/editor`,
  };
}

export function protectedResourceMetadata(origin: string) {
  return {
    resource: resourceOf(origin),
    authorization_servers: [origin],
    scopes_supported: [SCOPE],
    bearer_methods_supported: ["header"],
    resource_name: "Acharya Shanti Sagar Foundation website",
    resource_documentation: `${origin}/editor`,
  };
}

/** For endpoints that browser-based MCP clients call directly. */
export const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Authorization, Content-Type, Mcp-Protocol-Version, Mcp-Session-Id",
  "Access-Control-Expose-Headers": "WWW-Authenticate, Mcp-Session-Id",
  "Access-Control-Max-Age": "86400",
};
