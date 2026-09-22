/**
 * The portal's data access layer. The proxy (src/proxy.ts) only does an
 * optimistic redirect for page loads; every protected page and action calls
 * this too, so access is re-checked against the current allowlist rather
 * than trusted from whenever the session was issued. See Next.js's
 * authentication guide: Proxy is not sufficient on its own.
 */
import "server-only";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getMemberProfile, isAuthorizedEmail, type MemberProfile } from "@/lib/trustee-directory";

export async function requireTrusteeSession(): Promise<MemberProfile> {
  const session = await auth();
  const email = session?.user?.email;

  if (!email || !isAuthorizedEmail(email)) {
    redirect("/trustee-portal/login");
  }

  return (
    getMemberProfile(email) ?? {
      name: session.user?.name ?? "Trustee",
      rank: "Trustee",
      body: "",
      image: session.user?.image ?? null,
      role: "trustee",
      email,
    }
  );
}
