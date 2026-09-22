import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { isAuthorizedEmail } from "@/lib/trustee-directory";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [Google],
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
