import { Header } from "@/components/site/header";
import { Hero } from "@/components/site/hero";
import { Survey } from "@/components/site/sections-b";
import { Figures, JoinBrief, LiveSites, News, Purpose, WhatWeDo } from "@/components/site/home-sections";
import { Voices } from "@/components/site/voices";
import { Footer } from "@/components/site/footer";
import { OrgSchema } from "@/components/site/org-schema";
import { pageMetadata } from "@/i18n/metadata";

export function generateMetadata() {
  return pageMetadata("home", "/");
}

/**
 * The homepage is read as one bundle, leaf by leaf; the margin numbers them
 * in order (१, २, ३… — or ೧, ೨, ೩… in the Kannada edition) on their own.
 */
export default function Home() {
  return (
    <>
      <OrgSchema />
      <Header />
      <main id="main">
        {/* The home page opens the book; the other pages tell the rest. One
            thing per section, in the order the Foundation's Website Changes
            sheet (Oct 2026) asks for: who (the hero, closing on the "One
            life, one page" card), why (mission and vision), what (three
            pillars, three photographs), how much (all three pillars
            counted), where the work is live now, then people's voices
            straight after it (all four, as the Foundation asked: two
            recorded, two written), what's new, and the ways in — closing on the
            custodian's call, because the mission is the manuscripts. */}
        <Hero />
        <Purpose />
        <WhatWeDo />
        <Figures />
        <LiveSites />
        <Voices />
        <News />
        <JoinBrief />
        <Survey />
      </main>
      <Footer />
    </>
  );
}
