import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { isEditorEmail } from "@/lib/cms/editors";
import { isAuthorizedEmail } from "@/lib/trustee-directory";

export const { handlers, auth, signIn, signOut } = NextAuth({
  // Auth.js reads AUTH_GOOGLE_ID / AUTH_GOOGLE_SECRET; the Google console's
  // own names (GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET) are accepted too.
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID || process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET || process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  session: { strategy: "jwt" },
  pages: {
    signIn: "/trustee-portal/login",
    // Sends a refused sign-in back to the page it started from — the trustee
    // portal's or the site editor's.
    error: "/sign-in/error",
  },
  callbacks: {
    // Google only confirms *who* someone is — this decides whether that
    // person is a trustee or advisor, or one of the Foundation's site
    // editors. Anyone on neither allowlist is refused here, before a session
    // is ever created. (Each area re-checks its own list on every request.)
    async signIn({ user }) {
      return isAuthorizedEmail(user.email) || isEditorEmail(user.email);
    },
  },
});
