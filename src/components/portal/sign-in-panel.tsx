import Image from "next/image";
import Link from "next/link";
import { auth, signIn, signOut } from "@/auth";
import { GoogleMark } from "@/components/portal/google-mark";
import { editorsConfigured } from "@/lib/cms/editors";
import { vaultConfigured } from "@/lib/vault/people";
import { vaultGate } from "@/lib/vault/strings";

/**
 * The Google sign-in for the Foundation's private areas: the site editor,
 * and the document vault. Both use the same sign-in and the same session;
 * each area keeps its own list of who may enter. The vault's lines are
 * given in all three languages at once, since its reader hasn't chosen one.
 */
const AREAS = {
  editor: {
    title: ["Site editor"],
    lede: ["Edit the words, figures and photographs of the Foundation's website."],
    footnote: ["Only Google accounts the Foundation has registered as editors can sign in."],
    refused: ["You're signed in as {email}, which isn't a site editor account."],
    denied: ["That Google account isn't on the list of site editors. Ask the web team to add it, then try again."],
    switchAccount: ["Sign out and use another account"],
    none: "No editors have been added yet. The web team adds editors' Google accounts in the site's settings.",
    configured: editorsConfigured,
  },
  vault: { ...vaultGate, none: "No one has been given access yet. The web team adds Google accounts in the site's settings.", configured: vaultConfigured },
} as const;

const SCRIPT = ["", "font-serif", "font-kannada"];

/** Each line in every language the area gives it, one beneath the other. */
function Lines({ lines, email, className = "" }: { lines: readonly string[]; email?: string; className?: string }) {
  return lines.map((line, i) => (
    <span key={i} className={`block ${i ? "mt-1.5" : ""} ${SCRIPT[i]} ${className}`} lang={["en", "hi", "kn"][i]}>
      {email ? line.replace("{email}", email) : line}
    </span>
  ));
}

export async function SignInPanel({ area, next, error }: { area: keyof typeof AREAS; next: string; error?: string }) {
  const copy = AREAS[area];
  const session = await auth().catch(() => null);
  const email = session?.user?.email;
  const ready = !!process.env.AUTH_SECRET && !!(process.env.AUTH_GOOGLE_ID || process.env.GOOGLE_CLIENT_ID);
  const back = area === "vault" ? next : "/editor/sign-in";

  return (
    <main className="flex min-h-dvh items-center justify-center bg-board-deep px-5 py-16">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center text-center">
          <Image src="/icon.png" alt="" width={56} height={56} className="size-14" />
          <h1 className="mt-5 font-display text-2xl text-board-ink">
            <Lines lines={copy.title.slice(0, 1)} />
          </h1>
          {copy.title.length > 1 ? (
            <p className="mt-1 text-[1.05rem] text-board-ink/80">
              <Lines lines={copy.title.slice(1)} />
            </p>
          ) : null}
          <p className="mt-3 text-[0.95rem] leading-relaxed text-board-ink/70">
            <Lines lines={copy.lede} />
          </p>
        </div>

        <div className="mt-9 border border-board-ink/15 bg-board p-6">
          {!ready ? (
            <p className="text-sm leading-relaxed text-orpiment">Google sign-in isn&apos;t set up for this site yet. The web team adds it in the site&apos;s settings.</p>
          ) : !copy.configured() ? (
            <p className="text-sm leading-relaxed text-orpiment">{copy.none}</p>
          ) : email ? (
            <>
              <p className="text-sm leading-relaxed text-orpiment">
                <Lines lines={copy.refused} email={email} />
              </p>
              <form
                className="mt-5"
                action={async () => {
                  "use server";
                  await signOut({ redirectTo: back });
                }}
              >
                <button type="submit" className="w-full border border-board-ink/25 px-5 py-3 text-board-ink hover:bg-white/5">
                  <Lines lines={copy.switchAccount} />
                </button>
              </form>
            </>
          ) : (
            <>
              {error ? (
                <p className="mb-5 text-sm leading-relaxed text-orpiment">
                  {error === "AccessDenied" ? <Lines lines={copy.denied} /> : error === "Configuration" ? "Sign-in isn't fully set up yet. Please check back shortly." : "Something went wrong signing you in. Please try again."}
                </p>
              ) : null}
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
              <p className="mt-4 text-xs leading-relaxed text-board-ink/45">
                <Lines lines={copy.footnote} />
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
