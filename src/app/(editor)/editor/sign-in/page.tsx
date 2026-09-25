import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth, signIn, signOut } from "@/auth";
import { GoogleMark } from "@/components/portal/google-mark";
import { devEditor, editorsConfigured, isEditorEmail } from "@/lib/cms/editors";

const ERRORS: Record<string, string> = {
  AccessDenied: "That Google account isn't on the list of site editors. Ask the web team to add it, then try again.",
  Configuration: "Sign-in isn't fully set up yet. Please check back shortly.",
};

export default async function EditorSignIn({ searchParams }: { searchParams: Promise<{ error?: string; next?: string }> }) {
  const [{ error, next: asked }, session] = await Promise.all([searchParams, auth().catch(() => null)]);
  // Only back into the editor — never to another site.
  const next = asked && /^\/editor(\?|$|\/)/.test(asked) ? asked : "/editor";
  if (devEditor) redirect(next);
  const ready = !!process.env.AUTH_SECRET && !!(process.env.AUTH_GOOGLE_ID || process.env.GOOGLE_CLIENT_ID);
  const email = session?.user?.email;
  if (isEditorEmail(email)) redirect(next);

  return (
    <main className="flex min-h-dvh items-center justify-center bg-board-deep px-5 py-16">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center text-center">
          <Image src="/icon.png" alt="" width={56} height={56} className="size-14" />
          <h1 className="mt-5 font-display text-2xl text-board-ink">Site editor</h1>
          <p className="mt-2 text-[0.95rem] leading-relaxed text-board-ink/70">Edit the words, figures and photographs of the Foundation&apos;s website.</p>
        </div>

        <div className="mt-9 border border-board-ink/15 bg-board p-6">
          {!ready ? (
            <p className="text-sm leading-relaxed text-orpiment">Google sign-in isn&apos;t set up for this site yet. The web team adds it in the site&apos;s settings.</p>
          ) : !editorsConfigured() ? (
            <p className="text-sm leading-relaxed text-orpiment">No editors have been added yet. The web team adds editors&apos; Google accounts in the site&apos;s settings.</p>
          ) : email ? (
            <>
              <p className="text-sm leading-relaxed text-orpiment">
                You&apos;re signed in as {email}, which isn&apos;t a site editor account.
              </p>
              <form
                className="mt-5"
                action={async () => {
                  "use server";
                  await signOut({ redirectTo: "/editor/sign-in" });
                }}
              >
                <button type="submit" className="w-full border border-board-ink/25 px-5 py-3 text-board-ink hover:bg-white/5">
                  Sign out and use another account
                </button>
              </form>
            </>
          ) : (
            <>
              {error ? <p className="mb-5 text-sm leading-relaxed text-orpiment">{ERRORS[error] ?? "Something went wrong signing you in. Please try again."}</p> : null}
              <form
                action={async () => {
                  "use server";
                  await signIn("google", { redirectTo: next });
                }}
              >
                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-3 border border-board-ink/25 bg-board-ink px-5 py-3.5 text-base text-ink transition-colors hover:bg-leaf"
                >
                  <GoogleMark className="size-5" />
                  Continue with Google
                </button>
              </form>
              <p className="mt-4 text-xs leading-relaxed text-board-ink/45">Only Google accounts the Foundation has registered as editors can sign in.</p>
            </>
          )}
        </div>

        <p className="mt-6 text-center text-sm text-board-ink/45">
          <Link href="/" className="underline decoration-board-ink/30 underline-offset-4 hover:text-board-ink/70">
            Back to the public site
          </Link>
        </p>
      </div>
    </main>
  );
}
