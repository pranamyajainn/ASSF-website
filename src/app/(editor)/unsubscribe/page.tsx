import Image from "next/image";
import { verify } from "@/lib/mcp/jwt";
import { unsubscribe } from "@/lib/mail/unsubscribe";

export const metadata = { title: "Unsubscribe — Acharya Shanti Sagar Foundation", robots: { index: false, follow: false } };

const mask = (email: string) => email.replace(/^(.)(.*)(@.*)$/, (_, a: string, b: string, c: string) => `${a}${"•".repeat(Math.min(b.length, 6))}${c}`);

/** Where an email's "Unsubscribe" link leads: one button, then done. */
export default async function Unsubscribe({ searchParams }: { searchParams: Promise<{ t?: string; done?: string }> }) {
  const { t, done } = await searchParams;
  const claims = verify<{ email: string }>("unsubscribe", t);

  async function leave() {
    "use server";
    await unsubscribe(t);
    const { redirect } = await import("next/navigation");
    redirect(`/unsubscribe?t=${encodeURIComponent(t ?? "")}&done=1`);
  }

  let title = "Unsubscribe";
  let body: React.ReactNode;
  if (t === "preview") {
    body = <p>This link comes from a test email, so there&apos;s nothing to unsubscribe from.</p>;
  } else if (!claims) {
    body = <p>This unsubscribe link isn&apos;t valid. To stop receiving updates, reply to any of the Foundation&apos;s emails and ask to be removed.</p>;
  } else if (done) {
    title = "You're unsubscribed";
    body = <p>{mask(claims.email)} won&apos;t receive the Foundation&apos;s updates any more. Thank you for having followed the work.</p>;
  } else {
    body = (
      <>
        <p>Stop sending the Foundation&apos;s email updates to {mask(claims.email)}?</p>
        <form action={leave} className="mt-6">
          <button type="submit" className="w-full cursor-pointer bg-board-ink px-5 py-3 text-ink hover:bg-leaf">
            Unsubscribe
          </button>
        </form>
      </>
    );
  }
  return (
    <main className="flex min-h-dvh items-center justify-center bg-board-deep px-5 py-16">
      <div className="w-full max-w-sm text-center">
        <Image src="/icon.png" alt="" width={56} height={56} className="mx-auto size-14" />
        <p className="mt-4 font-mono text-[0.75rem] uppercase tracking-[0.08em] text-board-soft">Acharya Shanti Sagar Foundation</p>
        <h1 className="mt-2 font-display text-2xl text-board-ink">{title}</h1>
        <div className="mt-6 border border-board-ink/15 bg-board p-6 text-[0.95rem] leading-relaxed text-board-ink/80">{body}</div>
      </div>
    </main>
  );
}
