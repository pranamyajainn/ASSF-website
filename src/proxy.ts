/**
 * Optimistic route guard for the trustee portal. This only reads the session
 * cookie and redirects — it's a fast first pass, not the real check. Every
 * protected page still re-verifies via `requireTrusteeSession()` (see
 * lib/trustee-session.ts), since Proxy does not run in front of Server
 * Functions and should never be the only line of defence.
 */
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { devEditor } from "@/lib/cms/editors";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const { pathname } = req.nextUrl;

  // The site editor: the same optimistic redirect; the editor's page and API
  // re-check the editor allowlist themselves.
  if (pathname === "/editor" || pathname.startsWith("/editor/")) {
    if (pathname === "/editor/sign-in" || isLoggedIn || devEditor) return;
    return NextResponse.redirect(new URL("/editor/sign-in", req.nextUrl.origin));
  }

  const isLoginPage = pathname === "/trustee-portal/login";

  if (!isLoggedIn && !isLoginPage) {
    const url = new URL("/trustee-portal/login", req.nextUrl.origin);
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  if (isLoggedIn && isLoginPage) {
    return NextResponse.redirect(new URL("/trustee-portal", req.nextUrl.origin));
  }
});

export const config = {
  matcher: ["/trustee-portal/:path*", "/editor", "/editor/:path*"],
};
