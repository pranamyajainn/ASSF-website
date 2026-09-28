import type { Metadata } from "next";
import Image from "next/image";
import { cache } from "react";
import { openShared } from "@/lib/mail/files";
import { siteUrl } from "@/lib/site";

const load = cache((id: string) => openShared(id).catch(() => null));

const kind = (type: string) =>
  type === "application/pdf" ? "PDF document" : type.startsWith("image/") ? "Photo" : type.includes("word") ? "Word document" : "File";

/**
 * A shared report's page. It's what WhatsApp previews — the Foundation's
 * card, the report's title — so the message reads as the Foundation's own,
 * and what opens when the link is tapped.
 */
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const file = await load(id);
  const title = file ? file.title : "Report — Acharya Shanti Sagar Foundation";
  const card = new URL("/og/en/home.jpg", siteUrl).href;
  return {
    title: `${title} — Acharya Shanti Sagar Foundation`,
    description: "Shared by Acharya Shanti Sagar Foundation, Bengaluru.",
    robots: { index: false, follow: false },
    openGraph: {
      title,
      description: "Shared by Acharya Shanti Sagar Foundation, Bengaluru.",
      siteName: "Acharya Shanti Sagar Foundation",
      type: "website",
      images: [{ url: card, width: 1200, height: 630, alt: "Acharya Shanti Sagar Foundation" }],
    },
  };
}

export default async function SharedReport({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const file = await load(id);
  const date = (iso: string) => new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Kolkata" });
  return (
    <main className="flex min-h-dvh items-center justify-center bg-board-deep px-5 py-14">
      <div className="w-full max-w-md text-center">
        <Image src="/icon.png" alt="" width={56} height={56} className="mx-auto size-14" />
        <p className="mt-4 font-mono text-[0.75rem] uppercase tracking-[0.08em] text-board-soft">Acharya Shanti Sagar Foundation</p>
        {file ? (
          <>
            <h1 className="mt-2 font-display text-[1.7rem] leading-snug text-board-ink">{file.title}</h1>
            <p className="mt-2 text-[0.92rem] text-board-soft">Shared {date(file.shared)}</p>
            <div className="mt-7 border border-board-ink/15 bg-board p-6">
              {file.type.startsWith("image/") ? (
                // eslint-disable-next-line @next/next/no-img-element -- the shared photo itself, served privately
                <img src={`/r/${id}/file`} alt={file.title} className="mb-5 w-full rounded-sm" />
              ) : null}
              <p className="text-[0.95rem] text-board-ink/85">{kind(file.type)}</p>
              <a href={`/r/${id}/file`} className="mt-4 block bg-board-ink px-5 py-3 text-ink transition-colors hover:bg-leaf">
                Open the report
              </a>
              <a href={`/r/${id}/file?download`} className="mt-3 block text-[0.88rem] text-board-soft underline underline-offset-4 hover:text-board-ink">
                Download
              </a>
            </div>
            <p className="mt-5 text-[0.8rem] text-board-ink/45">Available until {date(file.expires)}.</p>
          </>
        ) : (
          <>
            <h1 className="mt-2 font-display text-2xl text-board-ink">This link has expired</h1>
            <p className="mt-4 text-[0.95rem] leading-relaxed text-board-ink/75">Shared reports stay available for ninety days. Please ask the Foundation to share it again.</p>
          </>
        )}
        <a href={siteUrl.origin} className="mt-8 inline-block text-[0.85rem] text-board-soft underline underline-offset-4 hover:text-board-ink">
          Visit the Foundation&apos;s website
        </a>
      </div>
    </main>
  );
}
