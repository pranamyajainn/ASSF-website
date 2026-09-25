import { CORS, redirectAllowed, registerClient } from "@/lib/mcp/oauth";
import { clientKey, overLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

const error = (description: string, status = 400) =>
  Response.json({ error: "invalid_client_metadata", error_description: description }, { status, headers: CORS });

/**
 * Dynamic client registration (RFC 7591): how Claude, ChatGPT and other MCP
 * clients introduce themselves. Only public clients (PKCE, no secret) and
 * only redirect addresses of known AI apps or the person's own computer.
 */
export async function POST(req: Request) {
  if (overLimit(`register:${clientKey(req)}`)) return error("Too many registrations — try again shortly.", 429);
  const body = (await req.json().catch(() => null)) as { redirect_uris?: unknown; client_name?: unknown } | null;
  const uris = Array.isArray(body?.redirect_uris) ? body.redirect_uris.filter((u): u is string => typeof u === "string") : [];
  if (!uris.length || uris.length > 10) return error("Give between one and ten redirect_uris.");
  const refused = uris.find((u) => !redirectAllowed(u));
  if (refused) return error(`This site only signs in Claude, ChatGPT or apps on your own computer (refused: ${refused}).`);
  const name = typeof body?.client_name === "string" && body.client_name.trim() ? body.client_name.trim().slice(0, 80) : "AI assistant";
  return Response.json(
    {
      client_id: registerClient(name, uris),
      client_id_issued_at: Math.floor(Date.now() / 1000),
      client_name: name,
      redirect_uris: uris,
      grant_types: ["authorization_code", "refresh_token"],
      response_types: ["code"],
      token_endpoint_auth_method: "none",
    },
    { status: 201, headers: CORS },
  );
}

export function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS });
}
