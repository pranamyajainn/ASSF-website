import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { isEditorEmail } from "@/lib/cms/editors";
import { isAuthorizedEmail } from "@/lib/trustee-directory";
import { linkAddress } from "@/lib/vault/link-token";
import { isVaultEmail } from "@/lib/vault/people";

export const { handlers, auth, signIn, signOut } = NextAuth({
  // Auth.js reads AUTH_GOOGLE_ID / AUTH_GOOGLE_SECRET; the Google console's
  // own names (GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET) are accepted too.
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID || process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET || process.env.GOOGLE_CLIENT_SECRET,
    }),
    // The document vault's emailed link (lib/vault/link-token.ts), for
    // trustees whose address isn't a Google account. Only the vault's list
    // can sign in this way.
    Credentials({
      id: "email-link",
      name: "Emailed link",
      credentials: { token: {} },
      authorize(credentials) {
        const email = linkAddress(credentials?.token);
        return email && isVaultEmail(email) ? { id: email, email, name: email } : null;
      },
    }),
  ],
  // A week, renewed while it's in use: a laptop left signed in somewhere
  // stops being a way in after seven days away (Auth.js's default is thirty).
  session: { strategy: "jwt", maxAge: 7 * 24 * 60 * 60, updateAge: 24 * 60 * 60 },
  pages: {
    signIn: "/trustee-portal/login",
    // Sends a refused sign-in back to the page it started from — the trustee
    // portal's or the site editor's.
    error: "/sign-in/error",
  },
  callbacks: {
    // Google only confirms *who* someone is — this decides whether that
    // person is a trustee or advisor, one of the Foundation's site editors,
    // or someone who may open its document vault. Anyone on no allowlist is
    // refused here, before a session is ever created. (Each area re-checks
    // its own list on every request.)
    // Google must also have verified the address: a Google account can be
    // opened under someone else's email, and that must never count as them.
    async signIn({ user, account, profile }) {
      if (account?.provider === "email-link") return isVaultEmail(user.email);
      if (profile?.email_verified !== true) return false;
      return isAuthorizedEmail(user.email) || isEditorEmail(user.email) || isVaultEmail(user.email);
    },
  },
});
