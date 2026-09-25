import Image from "next/image";
import Link from "next/link";
import { Container } from "./container";
import { getContent } from "@/i18n/content";

/**
 * The colophon, on the back board. A scribe closes a manuscript with who
 * made it, where and when; the site closes with who the Foundation is,
 * where it is registered, and how to reach and support it. `#contact` and
 * `#give` are the targets for the "survey" and "support" links above.
 */
export async function Footer() {
  const { shared, ui, href } = await getContent();
  const { org, nav } = shared;
  const t = ui.footer;
  const tel = `tel:${org.phone.replace(/\s/g, "")}`;

  return (
    <footer className="on-dark bg-board text-board-ink">
      <Container>
        <div className="border-b border-board-ink/15 py-14 lg:py-20">
          <div className="flex items-center gap-4">
            <Image
              src="/images/logo/assf-icon-square.png"
              alt=""
              width={56}
              height={56}
              className="size-12"
            />
            <p className="font-mono text-register text-board-soft">{t.colophon}</p>
          </div>

          <p className="mt-8 max-w-[30ch] font-display text-[clamp(1.7rem,1.2rem+1.8vw,2.6rem)] font-medium leading-[1.12]">
            {org.displayName}
          </p>
          <p className="mt-3 font-display text-[1.35rem] text-board-soft">
            {org.secondaryName} <span className="text-orpiment">।</span>{" "}
            <span lang="hi">{org.tagline}</span>
          </p>
          <p className="mt-6 font-mono text-register text-board-soft">
            {t.registered}, {org.founded} — {org.registration}
          </p>
        </div>

        <div className="grid gap-x-12 gap-y-12 border-b border-board-ink/15 py-12 md:grid-cols-3">
          <section id="contact" className="scroll-mt-8">
            <h2 className="font-mono text-register text-orpiment">{t.contact}</h2>
            <p className="mt-4">
              <a href={tel} className="font-display text-[1.5rem] leading-none hover:text-orpiment">
                {org.phone}
              </a>
            </p>
            <p className="mt-3">
              <a
                href={`mailto:${org.email}`}
                className="break-all text-[1.0625rem] underline decoration-board-ink/35 underline-offset-[5px] hover:decoration-orpiment"
              >
                {org.email}
              </a>
            </p>
          </section>

          <section>
            <h2 className="font-mono text-register text-orpiment">{t.office}</h2>
            <address className="mt-4 max-w-[34ch] text-[1.0625rem] not-italic leading-relaxed text-board-ink/90">
              {org.office}
            </address>
          </section>

          <section id="give" className="scroll-mt-8">
            <h2 className="font-mono text-register text-orpiment">{t.support}</h2>
            <dl className="mt-4 space-y-1 font-mono text-register text-board-ink/90">
              <div>
                <dt className="sr-only">{t.bank}</dt>
                <dd>{org.bank.branch}</dd>
              </div>
              <div>
                <dt className="sr-only">{t.account}</dt>
                <dd>{org.bank.account}</dd>
              </div>
              <div>
                <dt className="sr-only">{t.ifsc}</dt>
                <dd>{org.bank.ifsc}</dd>
              </div>
            </dl>
          </section>
        </div>

        {/* Bottom padding clears the fixed "Ask AI" launcher, so at the very
            end of the page it never sits over the scribe's line. */}
        <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-8 pb-28 pt-10 sm:pb-32">
          <nav aria-label={t.nav}>
            <ul className="flex flex-wrap gap-x-7 gap-y-3">
              {[{ label: t.home, href: href("/home") }, ...nav].map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-[1rem] text-board-soft transition-colors hover:text-board-ink"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          {/* The scribe's line. A manuscript's colophon closes by naming who
              wrote the copy — लिखितं, "written by" — so this one does too. */}
          <div className="flex flex-col items-start gap-2 sm:items-end">
            <p lang="sa" aria-hidden="true" className="font-display text-[1.4rem] text-orpiment">
              ॥ इति ॥
            </p>
            <p className="font-mono text-register text-board-soft">
              <span lang="sa" className="font-serif text-[0.95rem] text-board-ink">
                लिखितं
              </span>{" "}
              — {t.scribedBy}{" "}
              <a
                href="https://sahajta.com/"
                title={t.scribeTitle}
                className="text-board-ink underline decoration-orpiment/50 underline-offset-4 transition-colors hover:text-orpiment hover:decoration-orpiment"
              >
                Sahajta AI
              </a>
            </p>
          </div>
        </div>
      </Container>
    </footer>
  );
}
