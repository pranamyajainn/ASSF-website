import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { DonateForm } from "@/components/site/donate-form";
import { Leaf, PageHero } from "@/components/site/primitives";
import { getContent } from "@/i18n/content";
import { pageMetadata } from "@/i18n/metadata";
import { DONATE_PATH, THANKS_PATH } from "@/lib/donate/config";

export async function generateMetadata() {
  const { ui } = await getContent();
  return pageMetadata("donate", DONATE_PATH, ui.donate.lede);
}

/**
 * Giving online. Reached quietly — from "Adopting a folio" and the footer's
 * "Support the work", never from the masthead — and kept to one task: what
 * the gift is for, who is giving, then Apna Dharm's secure checkout. Bank
 * transfer stays beside it for those who prefer it.
 */
export default async function DonatePage() {
  const { ui, shared, conservation, lang, href } = await getContent();
  const t = ui.donate;
  const { bank } = shared.org;
  return (
    <>
      <Header />
      <main id="main">
        <PageHero
          label={t.label}
          eyebrow={ui.footer.support}
          title={t.heading}
          body={t.lede}
          plate={{ ...conservation.pageHero.plate, position: "50% 40%" }}
        />
        <Leaf id="give" label={t.steps[0]} innerClassName="!pt-4 md:!pt-6 lg:!pt-8">
          <DonateForm
            lang={lang}
            t={t}
            thanksPath={href(THANKS_PATH)}
            bank={{ ...bank, labels: { bank: ui.footer.bank, account: ui.footer.account, ifsc: ui.footer.ifsc } }}
          />
        </Leaf>
      </main>
      <Footer />
    </>
  );
}
