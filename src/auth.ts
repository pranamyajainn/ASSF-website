import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { isAuthorizedEmail } from "@/lib/trustee-directory";

export const { handlers, auth, signIn, signOut } = NextAuth({
  // Auth.js reads AUTH_GOOGLE_ID / AUTH_GOOGLE_SECRET; the Google console's
  // own names (GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET) are accepted too.
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID ?? process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET ?? process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  session: { strategy: "jwt" },
  pages: {
    signIn: "/trustee-portal/login",
    error: "/trustee-portal/login",
  },
  callbacks: {
    // Google only confirms *who* someone is — this decides whether that
    // person is actually a trustee or advisor. Anyone not on the allowlist
    // is refused here, before a session is ever created.
    async signIn({ user }) {
      return isAuthorizedEmail(user.email);
    },
  },
});
