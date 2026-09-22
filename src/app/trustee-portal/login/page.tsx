import Image from "next/image";
import Link from "next/link";
import { signIn } from "@/auth";
import { authorizedMembers } from "@/lib/trustee-directory";
import { org } from "@/content/shared";

export const metadata = {
  title: `Trustee Portal — ${org.nameLatin}`,
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
    <main className="flex min-h-screen items-center justify-center bg-ink-deep px-5 py-16">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center text-center">
          <Image
            src="/icon.png"
            alt=""
            width={56}
            height={56}
            className="size-14"
          />
          <h1 className="mt-5 text-2xl text-parchment-bright">Trustee Portal</h1>
          <p className="mt-2 font-sans text-[0.95rem] leading-relaxed text-parchment/70">
            Board access for {org.nameLatin} trustees and advisors.
          </p>
        </div>

        <div className="mt-9 border border-parchment/15 bg-ink p-6">
          {notConfigured ? (
            <p className="font-sans text-sm leading-relaxed text-accent">
              Portal access hasn&apos;t been configured yet — no trustee accounts have been
              added. Please check back once the Foundation sets this up.
            </p>
          ) : (
            <>
              {errorMessage ? (
                <p className="mb-5 font-sans text-sm leading-relaxed text-accent">{errorMessage}</p>
              ) : null}
              <form
                action={async () => {
                  "use server";
                  await signIn("google", { redirectTo: callbackUrl || "/trustee-portal" });
                }}
              >
                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-3 border border-parchment/25 bg-parchment-bright px-5 py-3.5 font-sans text-base text-ink transition-colors hover:bg-parchment"
                >
                  <GoogleMark className="size-5" />
                  Continue with Google
                </button>
              </form>
              <p className="mt-4 font-sans text-xs leading-relaxed text-parchment/45">
                Access is limited to Google accounts the Foundation has registered for the
                board. Signing in with any other account will be refused.
              </p>
            </>
          )}
        </div>

        <p className="mt-6 text-center font-sans text-sm text-parchment/45">
          <Link href="/" className="underline decoration-parchment/30 underline-offset-4 hover:text-parchment/70">
            Back to the public site
          </Link>
        </p>
      </div>
    </main>
  );
}

function GoogleMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <path
        fill="#EA4335"
        d="M24 9.5c3.4 0 6.4 1.17 8.8 3.46l6.55-6.55C35.4 2.7 30.1 0.5 24 0.5 14.86 0.5 6.98 5.74 3.13 13.36l7.6 5.9C12.6 13.36 17.8 9.5 24 9.5z"
      />
      <path
        fill="#4285F4"
        d="M46.5 24.5c0-1.6-.15-3.15-.42-4.64H24v9.3h12.65c-.55 2.9-2.2 5.36-4.7 7.02l7.4 5.75C43.9 37.9 46.5 31.7 46.5 24.5z"
      />
      <path
        fill="#FBBC05"
        d="M10.73 27.98a14.5 14.5 0 0 1 0-9.3l-7.6-5.9a24 24 0 0 0 0 21.1z"
      />
      <path
        fill="#34A853"
        d="M24 47.5c6.1 0 11.4-2 15.2-5.5l-7.4-5.75c-2.05 1.38-4.7 2.2-7.8 2.2-6.2 0-11.4-3.86-13.27-9.27l-7.6 5.9C6.98 42.26 14.86 47.5 24 47.5z"
      />
    </svg>
  );
}
