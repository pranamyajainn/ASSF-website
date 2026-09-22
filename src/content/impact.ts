/**
 * Impact page: the numbers from all three pillars, gathered in one place.
 * Every figure here already appears, sourced, on its own pillar page —
 * this page exists so a visitor (or a CSR officer) can see the whole
 * picture without hunting for it.
 */
export const pageHero = {
  eyebrow: "Impact",
  title: "What the work has moved",
  body: "Three streams, one measure: knowledge preserved, spaces built, and people reached. Every number below is audited or it is not shown.",
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
