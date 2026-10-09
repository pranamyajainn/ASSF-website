import { Container } from "./container";
import { getContent } from "@/i18n/content";

/**
 * The last line of a page about the work: one question, asked once, after
 * the reader has seen what the work is — never before, never in a box or a
 * pop-up. It continues the leaf's ruled margin, like a note at the foot of
 * a folio. "restore" asks about a page of a manuscript; "work" about the
 * Foundation's work in general.
 */
export async function GiveNote({ about }: { about: "restore" | "work" }) {
  const { ui, href } = await getContent();
  const g = ui.give;
  const question = about === "restore" ? g.restoreQuestion : g.workQuestion;
  const link = about === "restore" ? g.restoreLink : g.workLink;
  return (
    <aside aria-label={ui.footer.support}>
      <Container>
        <div className="grid md:grid-cols-[5.5rem_minmax(0,1fr)] lg:grid-cols-[7.5rem_minmax(0,1fr)_16rem]">
          <div className="hidden md:block" />
          <p className="ruled flex min-w-0 flex-wrap items-baseline gap-x-6 gap-y-3 border-t border-ink/15 pb-16 pl-5 pt-10 sm:pl-7 lg:pb-20 lg:pl-12">
            <span className="font-display text-[clamp(1.3rem,1.1rem+0.6vw,1.65rem)] leading-snug text-ink">{question}</span>
            <a
              href={href(about === "restore" ? "/donate?pages=1" : "/donate")}
              className="whitespace-nowrap text-[1.0625rem] text-cinnabar underline decoration-cinnabar/35 underline-offset-[6px] transition-colors hover:decoration-cinnabar"
            >
              {link} →
            </a>
          </p>
        </div>
      </Container>
    </aside>
  );
}

/**
 * The home page's invitation to give — the Foundation's own campaign,
 * "one life, one page" — set after "Our work so far", once the reader has
 * seen what the work is. One tangible thing (a page, at its stated price),
 * a choice of how many in one tap, and the Donate button: nothing more.
 */
export async function GiveBand() {
  const { ui, shared, href } = await getContent();
  const g = ui.give;
  const price = shared.folioPrice;
  return (
    <section id="give-band" aria-labelledby="give-band-heading" className="on-dark scroll-mt-6 bg-board text-board-ink">
      <Container>
        <div className="grid gap-x-16 gap-y-10 py-14 md:grid-cols-[5.5rem_minmax(0,1fr)] md:py-16 lg:grid-cols-[7.5rem_minmax(0,1fr)_minmax(0,24rem)] lg:py-20">
          <p aria-hidden="true" className="hidden font-display text-[2.4rem] leading-none text-orpiment md:block">
            ॥
          </p>
          <div className="min-w-0">
            <p className="font-mono text-register text-orpiment">{g.bandEyebrow}</p>
            <h2 id="give-band-heading" className="mt-4 max-w-[16ch] text-balance font-display text-title font-medium">
              {g.bandHeading}
            </h2>
            <p className="mt-5 max-w-[50ch] text-lede text-board-ink/90">{g.bandBody}</p>
          </div>
          <div className="min-w-0 self-end md:col-start-2 lg:col-start-auto">
            <ul className="grid grid-cols-4 gap-2">
              {[1, 5, 10, 25].map((n) => (
                <li key={n}>
                  <a
                    href={href(`/donate?pages=${n}`)}
                    className="flex min-h-[4.5rem] flex-col items-center justify-center border border-board-ink/30 text-center transition-colors hover:border-orpiment hover:text-orpiment"
                  >
                    <span className="font-display text-[1.6rem] leading-none">{n}</span>
                    <span className="mt-1 font-mono text-[0.7rem] text-board-soft">₹{(price * n).toLocaleString("en-IN")}</span>
                  </a>
                </li>
              ))}
            </ul>
            <p className="mt-2 font-mono text-[0.72rem] text-board-soft">{g.bandPages}</p>
            <a
              href={href("/donate")}
              className="mt-5 flex min-h-12 w-full items-center justify-center bg-cinnabar px-6 text-[1.0625rem] text-leaf transition-colors hover:bg-cinnabar-deep"
            >
              {g.bandButton}
            </a>
          </div>
        </div>
      </Container>
    </section>
  );
}
