import { Header } from "@/components/site/header";
import { Hero } from "@/components/site/hero";
import { Survey } from "@/components/site/sections-b";
import { Album, Figures, JoinBrief, News, WhatWeDo } from "@/components/site/home-sections";
import { VoicesBrief } from "@/components/site/voices";
import { Footer } from "@/components/site/footer";
import { GiveBand } from "@/components/site/give-note";
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
            thing per section: who (the hero), what (three pillars, three
            photographs), how much (four figures), what it looks like (the
            album), the invitation, a voice, what's new, and the ways in —
            closing on the custodian's call, because the mission is the
            manuscripts. */}
        <Hero />
        <WhatWeDo />
        <Figures />
        <Album />
        <GiveBand />
        <VoicesBrief />
        <News />
        <JoinBrief />
        <Survey />
      </main>
      <Footer />
    </>
  );
}
