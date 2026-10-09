import type { Metadata } from "next";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { DonateOutcome } from "@/components/site/donate-outcome";
import { Leaf } from "@/components/site/primitives";
import { getContent } from "@/i18n/content";
import { DONATE_PATH } from "@/lib/donate/config";

export async function generateMetadata(): Promise<Metadata> {
  const { ui } = await getContent();
  return { title: `${ui.meta.donateThanks} — ${ui.meta.suffix}`, robots: { index: false, follow: false } };
}

/** Where the checkout returns a donor (see components/site/donate-outcome.tsx). */
export default async function DonateThanksPage() {
  const { ui, shared, lang, href } = await getContent();
  return (
    <>
      <Header />
      <main id="main">
        <Leaf label={ui.donate.thanksLabel} innerClassName="!pt-10 md:!pt-14 lg:!pt-20 min-h-[60vh]">
          <DonateOutcome lang={lang} t={ui.donate} donatePath={href(DONATE_PATH)} homePath={href("/")} email={shared.org.email} phone={shared.org.phone} />
        </Leaf>
      </main>
      <Footer />
    </>
  );
}
