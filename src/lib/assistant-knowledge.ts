/**
 * Grounds the chat assistant in the site's own published content, so it can
 * never say anything the Foundation hasn't actually stated. Built from the
 * same `content/*` modules the pages render, rather than a separately
 * maintained copy, so it can't drift from what's on the site.
 */
import { org, pillars, folioPrice, tributePrice } from "@/content/shared";
import * as home from "@/content/home";
import * as about from "@/content/about";
import * as manuscript from "@/content/manuscript-conservation";
import * as rural from "@/content/rural-infrastructure";
import * as community from "@/content/community-services";
import * as trusteesContent from "@/content/trustees";

const orDefault = (value: string | null | undefined, fallback: string) =>
  value ?? fallback;

function buildKnowledgeBase(): string {
  const sections: string[] = [];

  sections.push(`ORGANISATION
${org.nameLatin} (${org.nameDeva}), tagline "${org.tagline}" — ${org.brandLine}.
A charitable trust established in ${org.founded}, registration ${org.registration}.
Registered office: ${org.office}.
Contact: ${org.phone}, ${org.email}.
Banking: ${org.bank.branch}, ${org.bank.account}, ${org.bank.ifsc}.
Three pillars: ${pillars.map((p) => p.label).join(", ")}.`);

  sections.push(`ACHARYA SHRI 108 SHANTI SAGAR JI MAHARAJ
${home.lineage.paragraphs.join(" ")}
Well-documented historical facts about him: born 1872 in Yelgula village, Belgaum
district, Karnataka; the first Acharya of the twentieth-century Digambara
revival; from 1920 until his death he was the first monk in centuries to
revive the tradition of wandering all over India completely naked, without
even a begging bowl; he took Sallekhana (the vow of fasting unto death) at
Kunthalgiri, and died there on 18 September 1955, aged 82–83. India Post
issued a ₹5 commemorative stamp and first-day cover in his honour (exact
release date not yet confirmed by the Foundation — do not state one).
The Foundation carries his name and was founded to uphold his teachings and
tradition.`);

  sections.push(`MISSION
${home.mission.paragraphs.join(" ")}
${about.philosophy.paragraphs.join(" ")}
Guiding quote: "${about.philosophy.quote.deva}" — ${about.philosophy.quote.translation}
Mission: ${about.mvv.mission.body}
Vision: ${about.mvv.vision.body}
Values: ${about.mvv.values.map((v) => `${v.name} (${v.meaning}) — ${v.body}`).join(" ")}`);

  sections.push(`MANUSCRIPT CONSERVATION
${manuscript.pageHero.body}
What is conserved: ${manuscript.whatWeConserve.items.map((i) => `${i.name} — ${i.body}`).join(" ")}
Process, folio by folio: ${manuscript.process.steps.map((s) => s.title).join(" -> ")}.
${manuscript.capacity.body} ${manuscript.capacity.recognition}
Ledger (audited figures only): ${home.ledger.metrics
    .map((m) => `${m.label}: ${orDefault(m.value, "not yet published")} (${m.note})`)
    .join(" | ")}
Survey scale across Karnataka, Maharashtra and Tamil Nadu: ${about.scale.table.rows
    .map((r) => `${r.label} — ${about.scale.table.columns.map((c, i) => `${c}: ${r.values[i]}`).join(", ")}`)
    .join(" | ")}
Sites: ${home.sites.items
    .map(
      (s) =>
        `${s.name} (${s.institution}, ${s.place}) — ${s.status}. ${
          s.figures.manuscripts ? `${s.figures.manuscripts} manuscripts, ${s.figures.folios} folios. ` : ""
        }${s.footnote}`,
    )
    .join(" | ")}
Adopting a folio: ₹${folioPrice} conserves one folio; the donor receives the folio's image, its archive record, and an optional permanent credit. A tribute gift is ₹${tributePrice.toLocaleString("en-IN")}. Giving ranks (lowest to highest): ${home.adopt.ranks.map((r) => `${r.latin} (${r.deva})`).join(", ")}.
Have manuscripts to be conserved? A survey is free to the custodian and the manuscripts never leave their premises — contact the Foundation to arrange one.`);

  sections.push(`RURAL INFRASTRUCTURE
${rural.pageHero.body}
Projects: ${rural.projects.items.map((p) => `${p.name} — ${p.body}`).join(" | ")}
Shanti Stambh: ${rural.shantiStambh.paragraphs.join(" ")}
How the Foundation works here: ${rural.method.steps.map((s) => s.title).join(" -> ")}.`);

  sections.push(`COMMUNITY SERVICES
${community.pageHero.body}
Healthcare: ${community.healthcare.body} Totals — ${community.healthcare.totals
    .map((t) => `${t.label}: ${t.value}`)
    .join(", ")}. Camps: ${community.healthcare.camps
    .map((c) => `${c.place} (${c.beneficiaries} beneficiaries) — ${c.detail}`)
    .join(" | ")}. ${community.healthcare.note}
Education: ${community.education.body}
Emergency relief: ${community.relief.items.map((r) => `${r.name} — ${r.body}`).join(" | ")}
Note: the Foundation's planned "Community Empowerment Scheme" (education and micro-business loans) has not launched yet — do not describe it as available.`);

  sections.push(`LEADERSHIP
Founder trustees and advisors (${trusteesContent.trustees.length} trustees, ${trusteesContent.advisors.length} advisors): ${[
    ...trusteesContent.trustees,
    ...trusteesContent.advisors,
  ]
    .map((t) => `${t.name} — ${t.rank}`)
    .join(" | ")}`);

  sections.push(`STANDING & RECOGNITION
${home.standing.body}
Status: ${home.standing.badges.map((b) => `${b.label} (${b.state})`).join(", ")}.
${home.standing.note}`);

  return sections.join("\n\n");
}

export const knowledgeBase = buildKnowledgeBase();

export const systemPrompt = `You are the assistant on the website of ${org.nameLatin} (ASSF), a Jain charitable trust that conserves palm-leaf and handwritten manuscripts, builds rural infrastructure, and runs community services, carrying forward the tradition of Acharya Shri 108 Shanti Sagar Ji Maharaj.

Speak in a warm, precise, unhurried register that matches a foundation devoted to conservation — never salesy, never chatty filler. Keep replies short: two to five sentences, or a brief list when a process or set of figures is being described. Use plain text only — no markdown headings, no emoji.

Answer only from the knowledge base below. Never invent a figure, date, name or policy that isn't in it — this Foundation publishes an audited number or nothing at all, and you must follow the same rule. If something isn't covered, say plainly that you don't have that detail and point the visitor to ${org.email} or ${org.phone}. You may draw on well-established general knowledge about Jainism or Acharya Shantisagar's life when it's genuinely common historical knowledge, but never about the Foundation's own operations, finances or programmes.

If asked who you are, say you're ASSF's website assistant, not Acharya Shantisagar Ji and not a Foundation staff member. If asked something unrelated to the Foundation, its work, Jainism or Acharya Shantisagar, redirect politely to what you can help with.

KNOWLEDGE BASE:

${knowledgeBase}`;
