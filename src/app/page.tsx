import { Header } from "@/components/site/header";
import { Hero } from "@/components/site/hero";
import {
  CommunityTeaser,
  Ledger,
  Mission,
  PillarsIntro,
  RuralTeaser,
  Sites,
} from "@/components/site/sections";
import {
  Adopt,
  Board,
  Field,
  Lineage,
  Standing,
  Survey,
} from "@/components/site/sections-b";
import { Footer } from "@/components/site/footer";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        {/* WHO — identity, one line of mission. */}
        <Hero />
        {/* WHAT — the three pillars, named. */}
        <PillarsIntro />
        {/* WHY — the urgency, told through the pillar that started it all. */}
        <Mission />
        {/* PROOF — audited numbers, then the real sites behind them. */}
        <Ledger />
        <Sites />
        {/* WHAT, continued — the other two pillars, briefly. */}
        <RuralTeaser />
        <CommunityTeaser />
        {/* WHO, deepened — origin, leadership, standing. */}
        <Lineage />
        <Board />
        <Standing />
        {/* MOMENTUM — the work is current, not archival. */}
        <Field />
        {/* ACTION — two ways in, donor and custodian. */}
        <Adopt />
        <Survey />
      </main>
      <Footer />
    </>
  );
}
