/**
 * About page copy — philosophy, mission/vision/values and the statewide
 * survey that sets the scale of the work ahead. Sourced from the
 * Foundation's "About Us", "Final Homepage Content" (§12, What Guides Us)
 * and "Mission, Vision & Values" documents (Sept 2026). The survey scale
 * uses the About Us / Homepage figures, per the Foundation's confirmation
 * that those are the ones to publish.
 */
export const pageHero = {
  eyebrow: "About the Foundation",
  title: "Guarding what is ancient, serving what is present",
  body: "Acharya Shanti Sagar Foundation is a non-profit trust, established in 2019, working across manuscript conservation, rural infrastructure and community services — heritage and humanity, treated as one commitment.",
  plate: {
    src: "/images/sites/shravanabelagola.jpeg",
    alt: "Palm-leaf and paper manuscripts laid out on red cloth at Shravanabelagola, with monks and Foundation members looking on.",
    caption: "Shravanabelagola, where conservation began on 11 July 2025.",
    position: "50% 50%",
  },
} as const;

/**
 * The Foundation's namesake, in the historical photographs the repo holds
 * (reference/acharya-shantisagar/README.md). The 1955 portrait is public
 * domain; the other two are reproduced from DigJainWiki with credit, as the
 * README directs. The ceremony photograph's caption was printed onto the
 * image in Hindi; it is cropped off and set here as text, with a
 * translation.
 */
export const namesake = {
  label: "The name we carry",
  album: [
    {
      src: "/images/lineage/acharya-shantisagar-mahadhaval-ceremony.jpg",
      ratio: "988 / 778",
      alt: "Black-and-white group photograph: the Acharya seated behind a carved stand that bears a garlanded scripture, with a garlanded man and others standing around him.",
      captionDeva: "ग्रंथराज ‘महाधवल’ के समर्पण पश्चात् आचार्य श्री के समक्ष लेखक को ‘धर्म दिवाकर’ की पदवी से अलंकृत करते हुए",
      caption: "After the dedication of the scripture Mahadhaval, the writer is honoured with the title ‘Dharma Divakar’ in the Acharya's presence. Photograph via DigJainWiki.",
    },
    {
      src: "/images/lineage/acharya-shantisagar-1955.jpg",
      ratio: "297 / 402",
      alt: "Black-and-white close-up of Acharya Shanti Sagar Ji Maharaj in old age.",
      caption: "Kunthalgiri, 1955, during his Sallekhana. Public domain, via Wikimedia Commons.",
    },
    {
      src: "/images/lineage/acharya-shantisagar-seated.jpg",
      ratio: "385 / 548",
      alt: "A worn sepia print of the Acharya seated cross-legged in meditation, outdoors.",
      caption: "Seated in meditation. Photograph via DigJainWiki.",
    },
  ],
} as const;

/**
 * The work in plates: the Foundation's own photographs across the three
 * pillars, composed as a catalogue plate page — two rows of equal height
 * built from unequal widths, not a grid of identical tiles.
 */
export const plates = {
  label: "In plates",
  heading: "The work, as it looks",
  rows: [
    [
      { src: "/images/survey-in-progress.jpeg", alt: "A handwritten Devanagari folio on blotting paper, beside a pH indicator strip held in tweezers.", pillar: "Manuscript conservation", caption: "A folio's acidity tested before treatment.", span: 7, ratio: "4 / 3", position: "20% 20%" },
      { src: "/images/community/health-camp-team.jpg", alt: "Doctors, nurses and volunteers behind an Acharya Shanti Sagar Foundation banner at a free health camp.", pillar: "Community services", caption: "The team at a free health camp.", span: 5, ratio: "20 / 21", position: "52% 50%" },
    ],
    [
      { src: "/images/rural/samudaya-bhavan-3-completed.jpeg", alt: "The completed Samudaya Bhavan: whitewashed wings with blue railings around a paved courtyard.", pillar: "Rural infrastructure", caption: "The Samudaya Bhavan, Yarnal.", span: 3, ratio: "1 / 1", position: "40% 50%" },
      { src: "/images/conservation/manuscript-detail.png", alt: "An opened volume of handwritten Devanagari paper folios, with ruled margins and red highlighting.", pillar: "Manuscript conservation", caption: "Handwritten paper folios, ruled and numbered in the margin.", span: 5, ratio: "5 / 3", position: "50% 55%" },
      { src: "/images/community/education-support-2.jpeg", alt: "Schoolchildren in uniform with teachers and Foundation members, in front of a school banner.", pillar: "Community services", caption: "Education support near Yarnal.", span: 4, ratio: "4 / 3", position: "50% 50%" },
    ],
  ],
} as const;

export const philosophy = {
  label: "Philosophy",
  heading: "Heritage and humanity, bound together",
  paragraphs: [
    "Preserving an ancient manuscript protects knowledge carried across generations. Strengthening a rural community helps create the conditions in which people can live, learn and grow with dignity. For the Foundation, these are not two missions — they are one.",
  ],
  quote: {
    deva: "परस्परोपग्रहो जीवानाम्",
    latin: "Parasparopagraho Jivanam",
    translation: "All life is bound together in mutual support.",
    source: "Tattvārtha Sūtra 5.21",
  },
} as const;

export const mvv = {
  label: "What guides us",
  heading: "Mission, vision and values",
  mission: {
    label: "Mission",
    /** One sentence in three clauses; each clause is one of the pillars. */
    lines: [
      { text: "To guard what is ancient,", gloss: "Manuscript Conservation" },
      { text: "serve what is present,", gloss: "Community Services" },
      { text: "and build what is needed.", gloss: "Rural Infrastructure" },
    ],
  },
  vision: {
    label: "Vision",
    body: "To carry forward a way of living shaped by conscious, compassionate and non-violent values — preserving the knowledge that expresses those values and putting them into practice through service.",
  },
  valuesLabel: "Values — five principles, one way of life",
  values: [
    { deva: "अहिंसा", name: "Ahimsa", meaning: "Non-violence", body: "Every decision, every programme, every relationship begins with the same question: does this cause harm?" },
    { deva: "सत्य", name: "Satya", meaning: "Truth", body: "Ancient knowledge preserved without distortion, communities served without pretence, and complete transparency in how the Foundation works." },
    { deva: "अपरिग्रह", name: "Aparigraha", meaning: "Responsible restraint", body: "Enough is a philosophy. Resources entrusted to the Foundation flow directly toward education, heritage and community upliftment." },
    { deva: "अनेकान्तवाद", name: "Anekantavada", meaning: "The many-sided nature of truth", body: "Custodians, communities and institutions are engaged with humility and openness — across sects, regions and backgrounds." },
    { deva: "करुणा · सेवा", name: "Karuna & Seva", meaning: "Compassion and service", body: "Not withdrawal from the world, but service to it: philosophy put into action in classrooms, communities, and the quiet work of preserving what must not be lost." },
  ],
} as const;

export const scale = {
  label: "The scale ahead",
  heading: "What remains is far greater than what is conserved",
  body: "To understand the scale of the need, the Foundation surveyed repositories across Karnataka, Maharashtra and Tamil Nadu — visiting collections in person, photographing representative material, and recording storage conditions with custodians.",
  table: {
    columns: ["Karnataka", "Maharashtra", "Tamil Nadu", "All States"],
    rows: [
      { label: "Repositories surveyed", values: ["3", "6", "9", "18"] },
      { label: "Manuscripts documented", values: ["7,118", "4,591", "972", "12,681"] },
      { label: "Folios documented", values: ["10,75,520", "4,59,708", "1,79,700", "17,14,928"] },
    ],
  },
  /** Folios per state, for the to-scale lines beneath the table. */
  folios: [
    { state: "Karnataka", value: 1075520, display: "10,75,520" },
    { state: "Maharashtra", value: 459708, display: "4,59,708" },
    { state: "Tamil Nadu", value: 179700, display: "1,79,700" },
  ],
  note: "These collections are held by temples, maths and traditional institutions that have safeguarded them for generations. A further 49 copper-plate records (Moodbidri), 28 archival books (Karanja Lad) and 125 printed books (Nandani) were recorded separately, as they are not manuscripts.",
} as const;

export const closingLine = "In Service of Heritage and Humanity";
