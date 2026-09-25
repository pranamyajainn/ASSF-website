import { cookies } from "next/headers";
import { redirect } from "next/navigation";

/**
 * Where Auth.js sends a sign-in that went wrong (most often: a Google
 * account that isn't on the list). It doesn't say which area the reader was
 * signing in to, so this reads the callback address Auth.js kept in a cookie
 * and sends them back to that area's own sign-in page, with the reason.
 */
export default async function SignInError({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  const jar = await cookies();
  const callback = jar.get("__Secure-authjs.callback-url")?.value ?? jar.get("authjs.callback-url")?.value ?? "";
  let target = "/trustee-portal/login";
  try {
    if (new URL(decodeURIComponent(callback), "http://x").pathname.startsWith("/editor")) target = "/editor/sign-in";
  } catch {}
  redirect(`${target}?error=${encodeURIComponent(error ?? "Default")}`);
}
