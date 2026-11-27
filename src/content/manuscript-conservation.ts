/**
 * Manuscript Conservation, after the Foundation's page designs (Nov 2026):
 * why it matters, what is conserved, how, where the laboratories have
 * worked, and how to be part of it. Words and photographs as the
 * Foundation's preview gives them.
 */
import { org } from "./shared";

const P = "/images/pages/conservation/";

export const pageHero = {
  question: "Manuscript",
  label: "Conservation",
  eyebrow: "Our Work · Manuscript Conservation",
  title: "Keeping Ancient Wisdom Alive",
  paragraphs: [
    "Long before print, India's knowledge travelled by hand. Monks and scholars wrote it on palm leaves and handmade paper, and communities guarded it in temples and mathas for centuries.",
    "We set up conservation laboratories beside these collections and bring each manuscript back to health, folio by folio, so it can be read, studied and cherished for generations to come. The manuscripts stay with their own custodians, stronger than we found them.",
  ],
  image: {
    src: `${P}folio-before-after.jpg`,
    alt: "The same palm-leaf folios before and after conservation, side by side",
    caption: "The same palm-leaf folios, before and after conservation in our laboratory.",
  },
  figures: [
    { value: "2,49,896+", label: "folios conserved by hand" },
    { value: "2,560", label: "manuscripts returned to health" },
    { value: "2", label: "laboratories at work today" },
    { value: "4", label: "collections cared for at Kumbhoj, Karanja Lad and Shravanabelagola" },
  ],
} as const;

export const why = {
  question: "Why it",
  label: "matters",
  heading: "Each One the Only Copy of Its Kind",
  lede: "A handwritten manuscript has no second edition. When a folio crumbles, the words on it are gone for good.",
  paragraphs: [
    "These collections hold far more than scripture: philosophy, mathematics, astronomy, medicine, grammar, literature and art, the living record of a great intellectual tradition. Communities have kept them with deep devotion, often in sacks, cloth bundles and steel cupboards, where damp, heat and insects slowly reach them.",
    "Our field survey across Karnataka, Maharashtra and Tamil Nadu showed how much is still in our hands to save.",
  ],
  subjects: ["Philosophy", "Mathematics", "Astronomy", "Medicine", "Grammar", "Literature", "Art"],
  photos: [
    { src: `${P}survey-sacks.jpg`, alt: "Manuscripts stored in sacks", caption: "Kept in sacks" },
    { src: `${P}survey-plastic.jpg`, alt: "Manuscripts wrapped in plastic", caption: "Wrapped in plastic" },
    { src: `${P}survey-insect.jpg`, alt: "Insect damage on a palm-leaf bundle", caption: "Touched by insects" },
    { src: `${P}paper-damaged.jpg`, alt: "A paper manuscript with brittle, torn folios", caption: "Brittle and torn" },
  ],
  figures: [
    { value: "18", label: "repositories surveyed in three states" },
    { value: "12,681", label: "manuscripts recorded" },
    { value: "17,14,928", label: "folios recorded" },
    { value: "2,560", label: "manuscripts already safe in our care" },
  ],
} as const;

export const conserve = {
  question: "What we",
  label: "conserve",
  heading: "Palm Leaf, Paper and Paint",
  lede: "Three kinds of treasure, each asking for its own kind of care.",
  cards: [
    {
      image: { src: `${P}palm-leaf.jpg`, alt: "Leaves of a palm-leaf manuscript fanned open" },
      label: "Palm leaf",
      title: "Words Etched in Leaf",
      body: "Letters inscribed into prepared palm leaves and threaded into bundles. With age the leaf turns brittle and splits, so we clean, relax and strengthen it gently, working with its nature.",
    },
    {
      image: { src: `${P}handmade-paper.jpg`, alt: "Edges of handmade paper folios" },
      label: "Handwritten paper",
      title: "Pages of Handmade Paper",
      body: "Paper manuscripts and archival books, with tears, folds, losses and stains that differ from page to page. Every folio begins with its own condition record.",
    },
    {
      image: { src: `${P}painted-folio.jpg`, alt: "A painted temple motif on a manuscript folio" },
      label: "Painted pages",
      title: "Colour That Tells a Story",
      body: "Folios painted beneath their lines, cloth paintings of the cosmos and whole leaves of colour. At Karanja Lad, 30 large illustrated paintings are now in our final care.",
    },
  ],
} as const;

export const process = {
  question: "How we",
  label: "conserve",
  heading: "From Assessment to a Lasting Record",
  lede: "No two manuscripts are alike, and sometimes no two folios. Each one is studied before it is touched, and every step is written down.",
  photos: [
    { src: `${P}palm-swab.jpg`, alt: "A conservator cleaning a palm leaf with a swab", caption: "Surface cleaning" },
    { src: `${P}treatment-bath.jpg`, alt: "A palm-leaf folio being treated in a bath", caption: "Treatment" },
    { src: `${P}repair-tear.jpg`, alt: "Mending a tear in a paper folio with Japanese tissue", caption: "Repair" },
    { src: `${P}wrapped.jpg`, alt: "A conserved manuscript tied in an acid-free enclosure", caption: "Protective enclosure" },
  ],
  steps: [
    { title: "Documentation", body: "Every folio is numbered, photographed and its condition recorded." },
    { title: "Preparation", body: "The manuscript is unbound with care and its order preserved." },
    { title: "Surface cleaning", body: "Dust, mould and residue are lifted away, gently, by hand." },
    { title: "Treatment", body: "Brittle leaves are relaxed, stains reduced and insects stopped." },
    { title: "Repair", body: "Tears and losses are mended with fine Japanese tissue." },
    { title: "Stabilisation", body: "Palm leaves are re-oiled and faded letters brought back to clarity." },
    { title: "Enclosure", body: "Each manuscript is housed in acid-free wrappers and boxes." },
    { title: "Digitisation", body: "Conserved folios are imaged, so the text can be read without handling." },
  ],
  /** The Foundation's own film on the Kumbhoj programme. */
  film: { heading: "Restoration of Tadpatras", youtubeId: "m6tPodN-8YY" },
} as const;

/**
 * Where the laboratories have worked: each site's state ("done" completed,
 * "final" at its final stage, "live" at work now), then what comes next.
 * A site shows its photograph, or a short walk-through video when `clip`
 * holds a YouTube link.
 */
export const sites = {
  question: "Where",
  label: "we work",
  heading: "Where Our Laboratories Have Worked",
  lede: "Each laboratory is set up beside the collection it serves. When one collection is safe, the laboratory moves on to the next, and the custodians carry on its care, trained by our team.",
  items: [
    {
      state: "done",
      badge: "Completed",
      name: "Kumbhoj, Kolhapur",
      meta: "Bahubali Vidyapeeth · February 2022 to September 2024",
      facts: "1,399 manuscripts and archival books · 1,06,277 folios, all digitised",
      body: "Our first laboratory, where palm-leaf and paper collections were brought back to health together.",
      image: { src: `${P}kumbhoj-site.jpg`, alt: "Kumbhoj Bahubali, Kolhapur" },
      clip: "",
      clipLabel: "",
    },
    {
      state: "done",
      badge: "Completed",
      name: "Karanja Lad · Gurukul Ashram",
      meta: "Shri Mahaveer Gurukul Brahmacharya Ashram · October 2024 to August 2025",
      facts: "221 manuscripts and archival books · 28,268 folios",
      body: "The first of Karanja Lad's four historic repositories, and the home of our Karanja Lad laboratory.",
      image: { src: `${P}karanja-ashram.jpg`, alt: "Shri Mahaveer Gurukul Brahmacharya Ashram, Karanja Lad" },
      clip: "",
      clipLabel: "",
    },
    {
      state: "final",
      badge: "At its final stage",
      name: "Karanja Lad · Balatkar Gan Mandir",
      meta: "Shri Mulsang Balatkar Gan Digamber Jain Mandir",
      facts: "940 manuscripts · 76,761 folios",
      body: "Conserved by October 2026, with 30 large illustrated paintings now in their final care.",
      image: { src: `${P}team-karanja.jpg`, alt: "The conservation team at Karanja Lad" },
      clip: "",
      clipLabel: "Walk through our Karanja Lad laboratory",
    },
    {
      state: "live",
      badge: "At work now",
      name: "Shravanabelagola",
      meta: "Bahubali Prakrit Bhawan, NIPSAR · since 11 July 2025",
      facts: "38,590 folios conserved by September 2026, of 3,65,520 in the collection",
      body: "One of our largest efforts: 2,695 palm-leaf granthas, cared for in partnership with the Shravanabelagola Matha.",
      image: { src: `${P}lab-shravanabelagola.jpg`, alt: "The conservation laboratory at Shravanabelagola" },
      clip: "",
      clipLabel: "Walk through our Shravanabelagola laboratory",
    },
  ],
  next: [
    {
      badge: "Next",
      name: "Karanja Lad · Sengan Temple",
      body: "The third of the town's four repositories. Our MoU was signed on 24 October 2026, and the laboratory turns to it next.",
      image: { src: "", alt: "" },
    },
    {
      badge: "Planned",
      name: "Moodbidri and Karkala",
      body: "4,472 granthas and 7,10,049 folios, where our journey first began. Plans are placed before the Government of Karnataka.",
      image: { src: `${P}moodbidri-temple.jpg`, alt: "Moodbidri" },
    },
  ],
} as const;

export const give = {
  question: "Be part",
  label: "of it",
  heading: "Every Page, Saved Together",
  body: "No single hand can save a library. When many of us join, page by page, whole collections come back to life.",
  tiers: [
    { value: "₹{folioPrice}", label: "conserves one page" },
    { value: "₹{granthaPrice}", label: "conserves a whole manuscript" },
    { value: "Time", label: "volunteer, share and spread the word" },
  ],
  buttons: [
    { label: "Give for a page", href: "/donate?pages=1" },
    { label: "Volunteer with us", href: "/careers" },
    { label: "Write to us", href: `mailto:${org.email}` },
  ],
  next: { text: "The same care that holds a fragile leaf reaches out to people in need.", label: "Next: Community Services", href: "/community-services" },
} as const;
