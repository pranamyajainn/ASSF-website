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
