import { Header } from "@/components/site/header";
import { Hero } from "@/components/site/hero";
import { Ledger, Mission, PillarsIntro, Spread } from "@/components/site/sections";
import { Sites } from "@/components/site/sites";
import { Board, Field, Join, Lineage, Survey } from "@/components/site/sections-b";
import { Voices } from "@/components/site/voices";
import { UpClose } from "@/components/site/up-close";
import { Footer } from "@/components/site/footer";
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
      <Header />
      <main>
        {/* AT A GLANCE — who the Foundation is, and what it does, in banners. */}
        <Hero />
        {/* WHY — the urgency, and the damage it describes. */}
        <Mission />
        {/* WHAT — three pillars on one leaf. */}
        <PillarsIntro />
        {/* HOW — the work itself, in the Foundation's own photographs. */}
        <UpClose />
        {/* HOW MUCH, then WHERE & WHEN — the register, then the sites. */}
        <Ledger />
        <Sites />
        {/* WHAT ELSE — the two pillars that serve the present. */}
        <Spread />
        {/* WHAT'S NEW — the work is current, not archival. */}
        <Field />
        {/* VOICES — the people the work reaches, in their own words. */}
        <Voices />
        {/* WHO — whose name the Foundation carries, and who guides it. */}
        <Lineage />
        <Board />
        {/* ACTION — many ways in, giving one of them; the custodian's call
            closes the bundle, because the mission is the manuscripts. */}
        <Join />
        <Survey />
      </main>
      <Footer />
    </>
  );
}
