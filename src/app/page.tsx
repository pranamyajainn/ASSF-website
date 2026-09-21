import { Header } from "@/components/site/header";
import { Hero } from "@/components/site/hero";
import { Film, Ledger, Mission, Plates, Sites } from "@/components/site/sections";
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
        <Hero />
        <Mission />
        <Ledger />
        <Sites />
        <Film />
        <Plates />
        <Adopt />
        <Lineage />
        <Board />
        <Field />
        <Survey />
        <Standing />
      </main>
      <Footer />
    </>
  );
}
