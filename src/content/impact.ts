/**
 * Impact page, in the structure and words of the Foundation's "ASSF Website
 * – Impact Page: revised content and structure" document (Alka Mehta,
 * 20 October 2026): where the work began, then each stream counted, how
 * the work is sustained, and what comes next. Figures are the ones that
 * document supplies; the survey's state-by-state counts are read from
 * about.ts, so each number has one source. Prices come from shared.ts
 * through the {folioPrice} and {granthaPrice} tokens, so they always match
 * what online giving charges.
 */
export const pageHero = {
  eyebrow: "Impact",
  title: "Knowledge preserved. Spaces built. People reached.",
  body: "Since 2019, the Foundation has carried its work from palm-leaf folios in temple libraries to health camps in rural Karnataka and meals in the streets of Bengaluru during the lockdown. Three streams of work, held together by one belief: what we care for today shapes who we are tomorrow.",
  plate: {
    src: "/images/work/inauguration-bundles.jpg",
    alt: "Munis and Foundation members around tables of palm-leaf bundles and cloth-wrapped manuscripts on red cloth.",
    caption: "The first manuscripts laid out for conservation at Shravanabelagola, July 2025.",
  },
} as const;

/** The impact strip: four figures, one per stream (and one for the spaces). */
export const strip = [
  { icon: "leaf", value: "1,66,500+", label: "folios conserved by hand" },
  { icon: "health", value: "3,500+", label: "people screened at free health camps" },
  { icon: "meal", value: "7,77,534", label: "meals served, COVID-19 response" },
  { icon: "building", value: "3", label: "community spaces built or renovated" },
] as { icon: "leaf" | "health" | "meal" | "building"; value: string; label: string }[];

/** The page’s jump links, in order; each names a section below. */
export const thread = {
  began: "Where it began",
  preserved: "Knowledge preserved",
  reached: "People reached",
  built: "Spaces built",
  sustained: "How the work is sustained",
  next: "What comes next",
} as const;

export const began = {
  eyebrow: "The starting point",
  heading: "Before we could protect, we had to know what was there",
  body: "Our teams travelled to 18 manuscript repositories across three states, opened the cupboards, counted the bundles and recorded the condition of every collection. What they found was a living library, vast in scale and in urgent need of care.",
  total: [
    { value: "17,14,928", label: "folios" },
    { value: "12,681", label: "manuscripts" },
    { value: "18", label: "repositories" },
  ],
  stateLabels: { repositories: "Repositories", manuscripts: "Manuscripts", folios: "Folios" },
  bridge: "This survey became our roadmap. Every project that follows began with a name on this list.",
} as const;

export const preserved = {
  eyebrow: "01 · Manuscript Conservation",
  heading: "One folio at a time, by hand",
  body: "Each folio is assessed on its own, cleaned, stabilised, repaired where needed and rehoused in archival-quality covers. It is slow, careful work, and it is the reason a text written centuries ago can be read by the next generation.",
  stats: [
    { value: "1,66,500+", label: "folios conserved" },
    { value: "1,900+", label: "manuscripts and archival volumes treated" },
    { value: "4", label: "conservation projects, 2 completed and 2 under way" },
  ],
  projects: [
    { name: "Bahubali Siddhopeth Granthalaya, Kumbhoj, Maharashtra", status: "Completed 2024", done: true, body: "1,140 manuscripts and 259 archival books, 1,06,277 folios, treated over two and a half years." },
    { name: "Jinvani, Mahaveer Brahmacharyashram, Karanja Lad", status: "Completed 2025", done: true, body: "193 manuscripts and 28 archival books, 28,268 folios, including postcards and handwritten letters." },
    { name: "Bahubali Prakrit Bhawan, Shravanabelagola, Hassan District, Karnataka", status: "Under way since July 2025", done: false, body: "A collection of 2,695 palm-leaf granthas. 309 granthas and 31,987 folios conserved so far." },
    { name: "Balatkar Gan Mandir, Karanja Lad", status: "Under way", done: false, body: "Conservation of the temple’s collection, carried out in the lab we built at Karanja Lad." },
  ],
  quote: {
    text: "When a folio leaves our hands, it is ready for the next hundred years.",
    image: { src: "/images/work/kumbhoj-munis.jpg", ratio: "1600 / 1201", alt: "A large group of munis gathered close around a conservation table.", caption: "Munis visiting the conservation work at Kumbhoj." },
  },
  link: { label: "See the full picture", href: "/manuscript-conservation" },
} as const;

export const reached = {
  eyebrow: "02 · Community Services",
  heading: "Care that arrives when it is needed most",
  body: "From village health camps to flood-hit homes and a city in lockdown, our community work goes where families need a hand. Much of it is done together with hospitals, associations and volunteers, and every partner makes the reach wider.",
  cards: [
    {
      icon: "health",
      title: "Healthcare",
      headline: "3,500+ people screened",
      lines: ["5 free camps across Bengaluru, Mandya, Raichur and Belagavi", "463 pairs of free spectacles", "250+ cataract cases taken to free surgery", "78 units of blood collected"],
    },
    {
      icon: "meal",
      title: "Relief in a crisis",
      headline: "7,77,534 meals",
      lines: ["Bengaluru, 1 April to 3 May 2020, with 2,795 food grain kits, alongside 15 partner organisations", "2019 floods in Athani, Gokak, Sangli, Bagalkot, Raibag, Bhoj, Chikkodi and Mudlagi (Belgaum District) and in Kolhapur District, Maharashtra: 2,500 survival kits across 6 villages and ₹10,000 each to 262 families rebuilding their homes"],
    },
    {
      icon: "book",
      title: "Education",
      headline: "500+ children supported",
      lines: ["Education support for 500+ children over six years", "Books and stationery for students in 3 Yarnal schools"],
    },
  ] as { icon: "health" | "meal" | "book"; title: string; headline: string; lines: string[] }[],
  quote: {
    text: "A meal delivered during a lockdown meant a family did not go to sleep hungry.",
    image: { src: "/images/community/relief-distribution-3.jpeg", ratio: "1032 / 502", alt: "Masked volunteers handing a food packet to a woman at her doorway.", caption: "The COVID-19 response, Bengaluru, 2020." },
  },
  link: { label: "See the full picture", href: "/community-services" },
} as const;

export const built = {
  eyebrow: "03 · Rural Infrastructure",
  heading: "Buildings that let a community do more",
  body: "The question is never only what we build, but what the space makes possible. A hall where a village gathers, a room where a teacher can stay close to her school, a clean and safe place for children: each one changes daily life.",
  feature: {
    title: "Samudaya Bhavan, Yarnal",
    body: "Built at the request of the Hosur Gram Panchayat, on land given by three members of the community. A community hall, dining hall, kitchen and guest rooms for visitors, now the gathering place for the village.",
    image: { src: "/images/rural/samudaya-bhavan-wide.jpg", alt: "The completed Samudaya Bhavan at Yarnal: long whitewashed wings with blue railings around a paved courtyard.", caption: "The completed Samudaya Bhavan, Yarnal." },
  },
  cards: [
    { title: "Staff quarters, Hosur", value: "14 rooms", body: "An old building converted into homes for teachers serving two schools with over 400 students." },
    { title: "Community hall, Yarnal", value: "1 hall", body: "Renovated and returned to the village for meetings and celebrations." },
  ],
  advocacy: "We also worked with the Zilla Panchayat to bring public toilet blocks to Yarnal, built with government funds on land given by the local temple committee.",
  link: { label: "See the full picture", href: "/rural-infrastructure" },
} as const;

export const sustained = {
  eyebrow: "Our commitment",
  heading: "We build the capacity, then we do the work",
  body: "The Foundation sets up its own labs, trains its own conservators and carries each project through from survey to the final archival box. Most of this has been made possible by the Foundation’s own resources, a commitment we renew every year.",
  stats: [
    { value: "2", label: "conservation labs running, at Karanja Lad and Shravanabelagola" },
  ],
  supporting: "Grant support under the national manuscripts framework has stood beside us on two projects, and we welcome every hand that joins this work.",
} as const;

export const next = {
  eyebrow: "The road ahead",
  heading: "The next chapter is written together",
  body: "At Shravanabelagola alone, 2,386 palm-leaf granthas holding 3,33,533 folios are next in line for care. Beyond them, Moodbidri and Karkala are the next collections on our roadmap. Every folio we reach is a page of shared heritage kept for our children, and each one is carried forward by many hands, not one.",
  progress: {
    done: 166500,
    total: 1714928,
    doneLabel: "1,66,500+ folios conserved",
    totalLabel: "17,14,928 folios found in the survey",
    caption: "Every folio counts. Here is how far we have come together.",
  },
  giving: [
    { title: "Care for a page", amount: "₹{folioPrice}", body: "Conserves one folio, from cleaning to archival rehousing.", href: "/donate?pages=1" },
    { title: "Care for a manuscript", amount: "₹{granthaPrice}", body: "Carries a complete manuscript through conservation.", href: "/donate" },
  ],
  button: { label: "Be part of the work", href: "/donate" },
  reports: { label: "Read our reports", href: "/reports" },
  closing: {
    latin: "Parasparopagraho Jivanam",
    translation: "All life is bound together in mutual support.",
  },
} as const;

/** Each stream in brief, read by the trustee portal. */
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
