/**
 * Impact page: the numbers from all three pillars, gathered in one place.
 * Every figure here already appears, sourced, on its own pillar page —
 * this page exists so a visitor (or a CSR officer) can see the whole
 * picture without hunting for it. Framing lines are from the Foundation's
 * "Impact Page" document.
 */
export const pageHero = {
  eyebrow: "Impact",
  title: "What the work has moved",
  body: "Three streams, one measure: knowledge preserved, spaces built, and people reached. Every figure below is taken from the Foundation's own project records; where one has not been supplied, it is left out rather than estimated.",
  plate: {
    src: "/images/work/inauguration-bundles.jpg",
    alt: "Munis and Foundation members around tables of palm-leaf bundles and cloth-wrapped manuscripts on red cloth.",
    caption: "The first manuscripts laid out for conservation at Shravanabelagola, July 2025.",
  },
} as const;

/**
 * Each stream's headline figure, set beside a photograph of the work it
 * counts, with one line from the Foundation's "Impact Page" document or
 * homepage brief.
 */
export const evidence = [
  {
    value: "1,34,545",
    label: "folios preserved at Kumbhoj and Karanja Lad",
    line: "At Kumbhoj, each folio was treated by hand — assessed individually, cleaned, stabilised, repaired where needed, and rehoused in archival-quality protective covers.",
    image: { src: "/images/work/kumbhoj-munis.jpg", ratio: "1600 / 1201", alt: "A large group of munis gathered close around a conservation table.", caption: "Munis visiting the conservation work at Kumbhoj." },
    href: "/manuscript-conservation",
  },
  {
    value: "14",
    label: "rooms of staff quarters at Hosur, and a Samudaya Bhavan at Yarnal",
    line: "The question is not simply what we build, but what the space enables a community to do.",
    image: { src: "/images/rural/samudaya-bhavan-wide.jpg", ratio: "1600 / 1067", alt: "The completed Samudaya Bhavan at Yarnal: long whitewashed wings with blue railings around a paved courtyard.", caption: "The completed Samudaya Bhavan, Yarnal." },
    href: "/rural-infrastructure",
  },
  {
    value: "7,77,534",
    label: "cooked meals, Bengaluru, 1 April – 3 May 2020",
    line: "A meal delivered during a lockdown meant a family did not go to sleep hungry.",
    image: { src: "/images/community/relief-distribution-3.jpeg", ratio: "1032 / 502", alt: "Masked volunteers handing a food packet to a woman at her doorway.", caption: "The COVID-19 response, Bengaluru, 2020." },
    href: "/community-services",
  },
] as const;

export const closing = {
  heading: "One mission, expressed in many forms",
  body: "Numbers tell part of the story. Behind every figure here is a manuscript that came close to being lost, a community that received care it had not expected, and a piece of India's heritage that will now endure.",
} as const;

export const streams = [
  {
    name: "Manuscript Conservation",
    stats: [
      { label: "Manuscripts conserved", value: "1,620+" },
      { label: "Folios preserved", value: "1,34,545+" },
      { label: "Repositories surveyed", value: "18" },
    ],
    href: "/manuscript-conservation",
  },
  {
    name: "Rural Infrastructure",
    stats: [
      { label: "Community facilities built or renovated", value: "3" },
      { label: "Staff rooms created, Hosur", value: "14" },
    ],
    href: "/rural-infrastructure",
  },
  {
    name: "Community Services",
    stats: [
      { label: "Healthcare beneficiaries screened", value: "3,500+" },
      { label: "Meals distributed, COVID-19 response", value: "7,77,534" },
      { label: "Families supported, flood relief", value: "262" },
    ],
    href: "/community-services",
  },
] as const;
