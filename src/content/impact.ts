/**
 * Impact, in the words and order of the Foundation's page designs (Nov
 * 2026): the headline count, a manuscript's journey from fragile to
 * forever, the careers the work creates, the work beyond manuscripts, and
 * the road ahead. The survey's state-by-state counts stay in about.ts.
 */
const P = "/images/pages/impact/";

/** §1, Impact at a glance. */
export const pageHero = {
  question: "Impact",
  label: "at a glance",
  eyebrow: "Our Impact",
  value: "2,49,896",
  title: "pages of India's handwritten heritage, given a second life.",
  figures: [
    { value: "2,560", label: "manuscripts" },
    { value: "1,06,277", label: "folios digitised" },
    { value: "2", label: "laboratories at work" },
  ],
  image: { src: `${P}sbg-granthas.jpg`, alt: "Visitors looking over conserved palm-leaf granthas, wrapped in red and saffron cloth, at Shravanabelagola" },
} as const;

/** §2, From Fragile to Forever: one manuscript's four stages, and the survey's progress bar. */
export const forever = {
  question: "Fragile to",
  label: "forever",
  heading: "From Fragile to Forever",
  image: { src: `${P}fragile-forever.jpg`, alt: "The same paper manuscript before conservation, torn into fragments, and after, made whole again as a single scroll" },
  caption: "One manuscript, before and after conservation in our laboratory.",
  stages: [
    { title: "Fragile", body: "Torn, holed and falling apart into fragments." },
    { title: "Restored", body: "Mended piece by piece and made whole again, one complete scroll." },
  ],
  later: [
    { title: "Digitised", body: "Every word captured, readable by scholars anywhere, without touching the leaf.", image: { src: `${P}digitised.jpg`, alt: "A conserved folio being digitised on screen" } },
    { title: "For generations", body: "Stored safely in archival boxes, ready to outlive us all.", image: { src: `${P}boxes-shelf.jpg`, alt: "Conserved manuscripts stored in archival boxes on a shelf" } },
  ],
  /** The bar's length is `safe` out of `total`. */
  survey: {
    before: "Our survey found",
    total: "17,14,928",
    after: "folios waiting in 18 repositories.",
    safe: "2,49,896",
    safeText: "are already safe.",
  },
} as const;

/** §3, Livelihoods created: the career ladder. */
export const careers = {
  question: "Livelihoods",
  label: "created",
  heading: "A Rare Craft, a New Career",
  lede: "Every manuscript we save also builds a livelihood. Young people are choosing a path in heritage, and growing in it.",
  image: { src: `${P}lab-at-work.jpg`, alt: "Conservators at work on palm-leaf folios in our Shravanabelagola laboratory" },
  caption: "Our conservators at work, Shravanabelagola laboratory",
  steps: [
    { title: "Intern", body: "learns on real collections" },
    { title: "Assistant Conservator", body: "treats folios with growing skill" },
    { title: "Conservator", body: "leads the care of whole collections" },
    { title: "Lead Conservator", body: "runs a laboratory and trains the next" },
  ],
  hiring: "We are hiring",
  link: { label: "See open positions", href: "/careers" },
} as const;

/** §4, And Beyond the Manuscripts. */
export const beyond = {
  question: "Beyond",
  label: "manuscripts",
  heading: "And Beyond the Manuscripts",
  cards: [
    {
      title: "Community Services",
      image: { src: `${P}camp-mandya.jpg`, alt: "Children at the free health camp in Mandya" },
      stats: [
        { value: "3,500+", label: "cared for at health camps" },
        { value: "7,77,534", label: "meals in the lockdown" },
        { value: "500", label: "children with books" },
      ],
      link: { label: "See Community Services", href: "/community-services" },
    },
    {
      title: "Rural Infrastructure",
      image: { src: `${P}hero-infrastructure.jpg`, alt: "The Samudaya Bhavan at Yarnal" },
      stats: [
        { value: "5", label: "spaces built or renewed" },
        { value: "27", label: "guntas of land given by the community" },
        { value: "14", label: "rooms for teachers to rest" },
      ],
      link: { label: "See Rural Infrastructure", href: "/rural-infrastructure" },
    },
  ],
} as const;

/** §5, The road ahead. */
export const ahead = {
  question: "The road",
  label: "ahead",
  heading: "The Pages Yet to Turn",
  figures: [
    { value: "3,26,000+", label: "palm-leaf folios waiting at Shravanabelagola, where our laboratory is already at work" },
    { value: "Sengan Temple", label: "Karanja Lad's third repository, MoU signed 24 October 2026" },
    { value: "7 lakh+", label: "folios waiting at Moodbidri and Karkala" },
  ],
  closing: "What we care for today shapes who we are tomorrow.",
  buttons: [
    { label: "Support the mission", href: "/donate" },
    { label: "Join our team", href: "/careers" },
    { label: "Write to us", href: "#contact" },
  ],
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
