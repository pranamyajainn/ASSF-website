import "server-only";
import { auth } from "@/auth";
import { devEditor } from "@/lib/cms/editors";
import { isVaultEmail } from "./people";

export type VaultUser = { email: string; name: string };

/**
 * Who is asking, re-checked against the vault's list on every call: the
 * person ("ok"), someone signed in who isn't on the list ("refused"), or
 * nobody ("signed-out"). The session cookie alone is never taken as access.
 */
export async function vaultAccess(): Promise<{ state: "ok"; user: VaultUser } | { state: "refused"; email: string } | { state: "signed-out" }> {
  if (devEditor) return { state: "ok", user: { email: devEditor, name: "Local editor" } };
  // Without AUTH_SECRET Auth.js throws; that just means nobody is signed in.
  const session = await auth().catch(() => null);
  const email = session?.user?.email;
  if (!email) return { state: "signed-out" };
  if (!isVaultEmail(email)) return { state: "refused", email };
  return { state: "ok", user: { email, name: session.user?.name ?? email } };
}

/**
 * For the vault's API routes: the person, or the response to send instead —
 * 401 signed out, 403 signed in but not on the list, 403 for a request that
 * didn't come from the site's own pages.
 */
export async function vaultRequest(req: Request, { sameOriginOnly = true } = {}): Promise<VaultUser | Response> {
  if (sameOriginOnly) {
    const origin = req.headers.get("origin");
    const site = req.headers.get("sec-fetch-site");
    let sameOrigin = true;
    try {
      if (origin) sameOrigin = new URL(origin).host === new URL(req.url).host;
    } catch {
      sameOrigin = false;
    }
    if (!sameOrigin || (site && site !== "same-origin" && site !== "none")) return refuse(403, "Forbidden.");
  }
  const access = await vaultAccess();
  if (access.state === "signed-out") return refuse(401, "Please sign in.");
  if (access.state === "refused") return refuse(403, "This account can't open the Foundation's documents.");
  return access.user;
}

function refuse(status: number, message: string): Response {
  return new Response(message, {
    status,
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow" },
  });
}
