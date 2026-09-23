import { Header } from "@/components/site/header";
import { Hero } from "@/components/site/hero";
import { Ledger, Mission, PillarsIntro, Spread } from "@/components/site/sections";
import { Sites } from "@/components/site/sites";
import { Board, Field, Join, Lineage, Standing, Survey } from "@/components/site/sections-b";
import { Voices } from "@/components/site/voices";
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
        {/* WHO — identity, each claim glossed with its evidence. */}
        <Hero />
        {/* WHY — the urgency, and the damage it describes. */}
        <Mission />
        {/* WHAT — three pillars on one leaf. */}
        <PillarsIntro />
        {/* PROOF — the register, the scale, then the sites behind them. */}
        <Ledger />
        <Sites />
        {/* MOMENTUM — the work is current, not archival. */}
        <Field />
        {/* WHAT, continued — the two pillars that serve the present. */}
        <Spread />
        {/* VOICES — the people the work reaches, in their own words. */}
        <Voices />
        {/* WHO, deepened — origin, leadership, standing. */}
        <Lineage />
        <Board />
        <Standing />
        {/* ACTION — many ways in, giving one of them; the custodian's call
            closes the bundle, because the mission is the manuscripts. */}
        <Join />
        <Survey />
      </main>
      <Footer />
    </>
  );
}
