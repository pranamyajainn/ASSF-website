import type { Metadata } from "next";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import {
  Heading,
  Lede,
  PageHero,
  Plate,
  Section,
  StatGrid,
  StepList,
} from "@/components/site/primitives";
import { education, healthcare, method, pageHero, relief } from "@/content/community-services";

export const metadata: Metadata = {
  title: "Community Services — Acharya Shanti Sagar Foundation",
  description: pageHero.body,
};

export default function CommunityServicesPage() {
  return (
    <>
      <Header />
      <main>
        <PageHero {...pageHero} />

        <Section id="healthcare" gutter={healthcare.gutter}>
          <Heading>{healthcare.heading}</Heading>
          <Lede>{healthcare.body}</Lede>
          <StatGrid metrics={healthcare.totals} />

          <ul className="mt-12 grid gap-x-10 gap-y-8 border-t border-parchment/25 pt-8 sm:grid-cols-3">
            {healthcare.camps.map((camp) => (
              <li key={camp.place}>
                <h3 className="text-xl text-parchment-bright">{camp.place}</h3>
                <p className="mt-1 font-sans text-sm text-accent">{camp.beneficiaries} beneficiaries</p>
                <p className="mt-2 text-lg leading-snug text-parchment/80">{camp.detail}</p>
              </li>
            ))}
          </ul>
          <p className="mt-8 max-w-[62ch] text-lg leading-relaxed text-parchment/80">{healthcare.note}</p>
        </Section>

        <Section id="education" gutter={education.gutter}>
          <Heading>{education.heading}</Heading>
          <Lede>{education.body}</Lede>
          <Plate className="mt-10 max-w-lg" src={education.image} alt="Students receiving books and stationery." ratio="4 / 3" />
        </Section>

        <Section id="relief" gutter={relief.gutter}>
          <Heading>Standing with communities in crisis</Heading>
          <ul className="mt-10 grid gap-x-10 gap-y-14 sm:grid-cols-2">
            {relief.items.map((item) => (
              <li key={item.name}>
                <Plate src={item.image} alt={item.name} ratio="4 / 3" />
                <h3 className="mt-4 text-2xl text-parchment-bright">{item.name}</h3>
                <p className="mt-2 text-lg leading-relaxed text-parchment/85">{item.body}</p>
              </li>
            ))}
          </ul>
        </Section>

        <Section id="method" gutter={method.gutter}>
          <Heading>{method.heading}</Heading>
          <StepList steps={method.steps} />
        </Section>
      </main>
      <Footer />
    </>
  );
}
