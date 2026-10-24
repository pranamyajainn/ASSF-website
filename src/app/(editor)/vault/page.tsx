import Image from "next/image";
import Link from "next/link";
import { forbidden, unauthorized } from "next/navigation";
import { signOut } from "@/auth";
import { isLang, localeInfo, locales, type Lang } from "@/i18n/config";
import { isEditorEmail } from "@/lib/cms/editors";
import { vaultAccess } from "@/lib/vault/access";
import { GROUPS } from "@/lib/vault/paths";
import { listDocuments, storeConnected, type VaultDocument } from "@/lib/vault/store";
import { vaultStrings } from "@/lib/vault/strings";
import { VaultUpload } from "./vault-upload";

const fill = (template: string, values: Record<string, string>) => template.replace(/\{(\w+)\}/g, (m, k: string) => values[k] ?? m);

function size(bytes: number): string {
  return bytes >= 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

/**
 * The Foundation's document vault: its trust deed, financials, balance
 * sheets and approvals, for the people it has authorised — in any of the
 * site's three languages. Signed out, the page answers 401 with the Google
 * sign-in (unauthorized.tsx); signed in with an account not on the list, 403
 * (forbidden.tsx). Never linked from the public site, never in the sitemap.
 */
export default async function VaultPage({ searchParams }: { searchParams: Promise<{ lang?: string }> }) {
  const access = await vaultAccess();
  if (access.state === "signed-out") unauthorized();
  if (access.state === "refused") forbidden();
  const { user } = access;

  const { lang: asked } = await searchParams;
  const lang: Lang = isLang(asked) ? asked : "en";
  const t = vaultStrings[lang];

  let documents: Record<string, VaultDocument[]> | null = null;
  let problem: string | null = null;
  if (!storeConnected()) problem = t.notConnected;
  else {
    try {
      documents = await listDocuments();
    } catch (err) {
      console.error("Vault list failed", err);
      problem = t.unreadable;
    }
  }

  const date = (iso: string) => new Date(iso).toLocaleDateString(`${lang}-IN`, { day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Kolkata" });

  async function leave() {
    "use server";
    await signOut({ redirectTo: "/vault" });
  }

  return (
    <div lang={lang} className={`min-h-dvh bg-leaf text-ink ${lang === "kn" ? "font-kannada" : ""}`}>
      <header className="border-b border-black/30 bg-board-deep text-board-ink">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center gap-x-5 gap-y-3 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <Image src="/icon.png" alt="" width={32} height={32} className="size-8" />
            <p className="font-display text-[1.1rem] leading-tight">{t.title}</p>
          </div>
          <nav aria-label={t.language} className="flex items-center gap-1 rounded-full bg-white/8 p-1 text-[0.9rem]">
            {locales.map((l) => (
              <a
                key={l}
                href={l === "en" ? "/vault" : `/vault?lang=${l}`}
                lang={l}
                aria-current={l === lang ? "true" : undefined}
                className={`rounded-full px-3 py-1 transition-colors ${l === lang ? "bg-leaf text-ink" : "text-board-ink/80 hover:bg-white/10"} ${l === "kn" ? "font-kannada" : ""}`}
              >
                {localeInfo[l].label}
              </a>
            ))}
          </nav>
          <div className="ml-auto flex flex-wrap items-center gap-1.5 text-[0.88rem]">
            {isEditorEmail(user.email) ? (
              <Link href="/editor" className="rounded-md px-3 py-2 text-board-ink/85 hover:bg-white/10">
                {t.editor}
              </Link>
            ) : null}
            <form action={leave}>
              <button type="submit" title={fill(t.signedInAs, { email: user.email })} className="cursor-pointer rounded-md px-3 py-2 text-board-soft hover:bg-white/10 hover:text-board-ink">
                {t.signOut}
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 pb-20 pt-8 sm:px-6 sm:pt-10">
        <h1 className="font-display text-[clamp(1.8rem,1.4rem+1.5vw,2.4rem)] font-medium leading-tight">{t.title}</h1>
        <p className="mt-3 max-w-[60ch] text-[1rem] leading-relaxed text-ink-soft">{t.lede}</p>
        <p className="mt-2 font-mono text-register text-ink-faint">{fill(t.signedInAs, { email: user.email })}</p>

        {problem ? (
          <p role="alert" className="mt-8 border-l-2 border-cinnabar pl-4 text-ink-soft">
            {problem}
          </p>
        ) : null}

        {documents
          ? GROUPS.map((group) => {
              const docs = documents[group];
              return (
                <section key={group} aria-labelledby={`group-${group}`} className="mt-10 border-t border-ink/20 pt-6">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-3">
                    <h2 id={`group-${group}`} className="font-display text-[1.45rem] leading-tight">
                      {t.groups[group]}
                      <span className="ml-2 font-mono text-[0.8rem] text-ink-faint">{docs.length}</span>
                    </h2>
                    <VaultUpload group={group} t={t} />
                  </div>
                  {docs.length ? (
                    <ul className="mt-4 divide-y divide-ink/10 border-y border-ink/10">
                      {docs.map((doc) => {
                        const href = `/api/vault/file?p=${encodeURIComponent(doc.path)}`;
                        return (
                          <li key={doc.path} className="flex flex-wrap items-center gap-x-4 gap-y-2 py-3">
                            <div className="min-w-0 flex-1 basis-60">
                              <a href={href} target="_blank" rel="noopener" className="break-words text-[1.02rem] text-ink underline decoration-ink/25 underline-offset-4 hover:text-cinnabar hover:decoration-cinnabar">
                                {doc.name}
                              </a>
                              <p className="mt-0.5 font-mono text-register text-ink-faint">
                                {fill(t.uploadedOn, { date: date(doc.uploadedAt) })} · {size(doc.size)}
                              </p>
                            </div>
                            <div className="flex shrink-0 gap-2 text-[0.92rem]">
                              <a href={href} target="_blank" rel="noopener" className="inline-flex min-h-10 items-center border border-ink/30 px-3.5 hover:border-ink hover:bg-ink/[0.04]">
                                {t.view}
                              </a>
                              <a href={`${href}&download`} className="inline-flex min-h-10 items-center border border-ink/30 px-3.5 hover:border-ink hover:bg-ink/[0.04]">
                                {t.download}
                              </a>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  ) : (
                    <p className="mt-4 border border-dashed border-ink/25 px-4 py-5 text-ink-faint">{t.empty}</p>
                  )}
                </section>
              );
            })
          : null}
      </main>
    </div>
  );
}
