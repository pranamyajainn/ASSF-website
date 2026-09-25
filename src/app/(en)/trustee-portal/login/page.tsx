import Image from "next/image";
import Link from "next/link";
import { signIn } from "@/auth";
import { authorizedMembers } from "@/lib/trustee-directory";
import { org } from "@/content/shared";
import { GoogleMark } from "@/components/portal/google-mark";

export const metadata = {
  title: `Trustee Portal — ${org.nameLatin}`,
  robots: { index: false, follow: false },
};

const ERROR_COPY: Record<string, string> = {
  AccessDenied:
    "That Google account isn't registered for portal access. If you're a trustee or advisor, ask the Foundation to add your email.",
  Configuration:
    "The portal's sign-in isn't fully configured yet. Please check back shortly.",
};

export default async function TrusteePortalLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string; error?: string }>;
}) {
  const { callbackUrl, error } = await searchParams;
  const errorMessage = error ? (ERROR_COPY[error] ?? "Something went wrong signing you in. Please try again.") : null;
  const notConfigured = authorizedMembers.length === 0;

  return (
    <main className="flex min-h-screen items-center justify-center bg-board-deep px-5 py-16">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center text-center">
          <Image
            src="/icon.png"
            alt=""
            width={56}
            height={56}
            className="size-14"
          />
          <h1 className="mt-5 text-2xl text-board-ink">Trustee Portal</h1>
          <p className="mt-2 text-[0.95rem] leading-relaxed text-board-ink/70">
            Board access for {org.nameLatin} trustees and advisors.
          </p>
        </div>

        <div className="mt-9 border border-board-ink/15 bg-board p-6">
          {notConfigured ? (
            <p className="text-sm leading-relaxed text-orpiment">
              Portal access hasn&apos;t been configured yet — no trustee accounts have been
              added. Please check back once the Foundation sets this up.
            </p>
          ) : (
            <>
              {errorMessage ? (
                <p className="mb-5 text-sm leading-relaxed text-orpiment">{errorMessage}</p>
              ) : null}
              <form
                action={async () => {
                  "use server";
                  await signIn("google", { redirectTo: callbackUrl || "/trustee-portal" });
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
              <p className="mt-4 text-xs leading-relaxed text-board-ink/45">
                Access is limited to Google accounts the Foundation has registered for the
                board. Signing in with any other account will be refused.
              </p>
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
