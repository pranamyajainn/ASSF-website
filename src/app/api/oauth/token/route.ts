import { isEditorEmail } from "@/lib/cms/editors";
import { pkceMatches, verify } from "@/lib/mcp/jwt";
import { CORS, issueTokens, lookupClient, originOf, resourceOf, type AccessClaims, type CodeClaims } from "@/lib/mcp/oauth";
import { clientKey, overLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

const fail = (error: string, description: string, status = 400) =>
  Response.json({ error, error_description: description }, { status, headers: { ...CORS, "Cache-Control": "no-store" } });

/**
 * The token endpoint: trades a sign-in code (with its PKCE verifier) for an
 * access token, or a refresh token for a fresh pair. The person must still
 * be on the editor list every time.
 */
export async function POST(req: Request) {
  if (overLimit(`token:${clientKey(req)}`)) return fail("slow_down", "Too many requests — try again shortly.", 429);
  const type = req.headers.get("content-type") ?? "";
  const form = type.includes("application/json")
    ? new URLSearchParams(Object.entries((await req.json().catch(() => ({}))) as Record<string, string>))
    : new URLSearchParams(await req.text());
  const grant = form.get("grant_type");
  const resource = resourceOf(originOf(req));

  if (grant === "authorization_code") {
    const code = verify<CodeClaims>("code", form.get("code"));
    if (!code) return fail("invalid_grant", "The sign-in code is invalid or has expired. Please connect again.");
    if (form.get("client_id") && form.get("client_id") !== code.client_id) return fail("invalid_grant", "The code was issued to another app.");
    if (form.get("redirect_uri") !== code.redirect_uri) return fail("invalid_grant", "The redirect address doesn't match.");
    if (!pkceMatches(form.get("code_verifier") ?? "", code.code_challenge)) return fail("invalid_grant", "The PKCE verifier doesn't match.");
    if (!isEditorEmail(code.email)) return fail("access_denied", "This account is no longer a site editor.", 403);
    return Response.json(issueTokens(code.email, { id: code.client_id, name: code.client_name }, resource), {
      headers: { ...CORS, "Cache-Control": "no-store" },
    });
  }

  if (grant === "refresh_token") {
    const refresh = verify<AccessClaims>("refresh", form.get("refresh_token"));
    if (!refresh) return fail("invalid_grant", "The sign-in has expired. Please connect again.");
    if (form.get("client_id") && form.get("client_id") !== refresh.client_id) return fail("invalid_grant", "The token was issued to another app.");
    if (!isEditorEmail(refresh.sub)) return fail("access_denied", "This account is no longer a site editor.", 403);
    if (!(await lookupClient(refresh.client_id))) return fail("invalid_client", "This app's registration is no longer valid.");
    return Response.json(issueTokens(refresh.sub, { id: refresh.client_id, name: refresh.client_name }, resource), {
      headers: { ...CORS, "Cache-Control": "no-store" },
    });
  }

  return fail("unsupported_grant_type", "Use authorization_code or refresh_token.");
}

export function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS });
}
