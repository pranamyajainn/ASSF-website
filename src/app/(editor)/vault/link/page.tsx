import type { Metadata } from "next";
import Image from "next/image";
import { redirect } from "next/navigation";
import { AuthError } from "next-auth";
import { signIn } from "@/auth";
import { linkAddress } from "@/lib/vault/link-token";
import { isVaultEmail } from "@/lib/vault/people";
import { vaultGate, vaultLink } from "@/lib/vault/strings";

export const metadata: Metadata = { referrer: "no-referrer" };

const SCRIPT = ["", "font-serif", "font-kannada"];
const EXPIRED = "/editor/sign-in?next=/vault&link=expired";

/**
 * Where an emailed sign-in link lands. It asks for one press before signing
 * in, so a mail scanner that opens links on the reader's behalf can't use
 * the link up or sign in for them; the token is checked again when pressed.
 */
export default async function VaultLink({ searchParams }: { searchParams: Promise<{ t?: string }> }) {
  const { t } = await searchParams;
  const email = linkAddress(t);
  if (!email || !isVaultEmail(email)) redirect(EXPIRED);

  async function enter() {
    "use server";
    try {
      await signIn("email-link", { token: t, redirectTo: "/vault" });
    } catch (err) {
      // A refused link comes back as an AuthError; the redirect into the vault must pass through.
      if (err instanceof AuthError) redirect(EXPIRED);
      throw err;
    }
  }

  return (
    <main className="flex min-h-dvh items-center justify-center bg-board-deep px-5 py-16">
      <div className="w-full max-w-sm text-center">
        <Image src="/icon.png" alt="" width={56} height={56} className="mx-auto size-14" />
        <h1 className="mt-5 font-display text-2xl text-board-ink">{vaultGate.title[0]}</h1>
        <div className="mt-9 border border-board-ink/15 bg-board p-6 text-left">
          <p className="text-sm leading-relaxed text-board-ink/85">
            {vaultLink.as.map((line, i) => (
              <span key={i} lang={["en", "hi", "kn"][i]} className={`block ${i ? "mt-1.5" : ""} ${SCRIPT[i]}`}>
                {line.replace("{email}", email)}
              </span>
            ))}
          </p>
          <form action={enter} className="mt-5">
            <button type="submit" className="w-full border border-board-ink/25 bg-board-ink px-5 py-3.5 text-base text-ink transition-colors hover:bg-leaf">
              {vaultLink.enter.map((line, i) => (
                <span key={i} lang={["en", "hi", "kn"][i]} className={`block ${SCRIPT[i]}`}>
                  {line}
                </span>
              ))}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
