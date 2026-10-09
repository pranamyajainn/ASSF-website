import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { DonateForm } from "@/components/site/donate-form";
import { Leaf } from "@/components/site/primitives";
import { getContent } from "@/i18n/content";
import { pageMetadata } from "@/i18n/metadata";
import { DONATE_PATH, THANKS_PATH } from "@/lib/donate/config";

export async function generateMetadata() {
  const { ui } = await getContent();
  return pageMetadata("donate", DONATE_PATH, ui.donate.lede);
}

/**
 * Giving online. Reached quietly — from "Give" in the top line, a question
 * at the end of each page about the work, and "Adopting a folio" — and kept
 * to one short task: the heading, one line, then the form, already open.
 */
export default async function DonatePage() {
  const { ui, shared, lang, href } = await getContent();
  const t = ui.donate;
  const { bank } = shared.org;
  return (
    <>
      <Header />
      <main id="main">
        <Leaf id="give" label={t.label} innerClassName="!pt-10 md:!pt-14 lg:!pt-16">
          <p className="font-mono text-register text-ink-faint">{ui.footer.support}</p>
          <h1 className="inked ink-on-load mt-4 max-w-[17ch] text-balance font-display text-title font-medium tracking-[-0.015em]">
            {t.heading}
            <span className="text-cinnabar" aria-hidden="true">
              {" "}॥
            </span>
          </h1>
          <p className="mt-5 max-w-[56ch] text-[1.125rem] leading-[1.6] text-ink-soft">{t.lede}</p>
          <div className="mt-10">
            <DonateForm
              lang={lang}
              t={t}
              thanksPath={href(THANKS_PATH)}
              bank={{ ...bank, labels: { bank: ui.footer.bank, account: ui.footer.account, ifsc: ui.footer.ifsc } }}
            />
          </div>
        </Leaf>
      </main>
      <Footer />
    </>
  );
}
