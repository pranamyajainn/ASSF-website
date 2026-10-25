/**
 * About page copy, in the order and words of the Foundation's "About Us —
 * Final Website Copy & Content Structure" document (Oct 2026): who ASSF is,
 * what inspires it, what guides it, who leads it, its three areas of work,
 * the work in practice, and what lies ahead. Programme detail and survey
 * data stay on the programme pages and on Impact, as that document asks.
 */
export const pageHero = {
  eyebrow: "About the Foundation",
  title: "In Service of Heritage and Humanity",
  body: "Acharya Shanti Sagar Foundation (ASSF) is a non-profit charitable trust established in 2019, inspired by the teachings and legacy of Acharya Shri 108 Shanti Sagar Ji Maharaj. Guided by the values of non-violence, truth, restraint, compassion and service, the Foundation works to preserve India's manuscript heritage, strengthen rural infrastructure and respond to community needs.",
  supporting: "Guarding what is ancient. Serving what is present. Building what is needed.",
  plate: {
    src: "/images/sites/shravanabelagola.jpeg",
    alt: "Palm-leaf and paper manuscripts laid out on red cloth at Shravanabelagola, with monks and Foundation members looking on.",
    caption: "Shravanabelagola, where conservation began on 11 July 2025.",
    position: "50% 50%",
  },
} as const;

/** §02, Our Inspiration. */
export const inspiration = {
  label: "Our inspiration",
  heading: "Acharya Shri 108 Shanti Sagar Ji Maharaj",
  dates: "1872 – 1955",
  paragraphs: [
    "The Foundation carries the name of Acharya Shri 108 Shanti Sagar Ji Maharaj, a revered Digambar Jain Acharya whose life and teachings continue to inspire a commitment to spiritual discipline, non-violence, restraint and service. Remembered as a leading figure in the revival of the Digambar Jain ascetic tradition in the twentieth century, he represents a way of life grounded in principle, humility and responsibility.",
    "For ASSF, his legacy is not only a source of inspiration; it is a guide to action. The Foundation seeks to honour that legacy by safeguarding knowledge passed down through generations and by serving communities with care, dignity and compassion.",
  ],
  quote: {
    deva: "परस्परोपग्रहो जीवानाम्",
    latin: "Parasparopagraho Jivanam",
    translation: "Living beings support one another.",
  },
} as const;

/** §03, About the Foundation. */
export const foundation = {
  label: "About the Foundation",
  heading: "An institution rooted in values, working for people",
  paragraphs: [
    "Established in 2019, Acharya Shanti Sagar Foundation is a charitable trust working at the intersection of cultural preservation and community service. Its work reflects a simple conviction: safeguarding the knowledge inherited from the past and strengthening the conditions in which people live today are connected responsibilities.",
    "The Foundation's work has developed across three areas: manuscript conservation, rural infrastructure and community services. Together, these areas bring its guiding values into practice — preserving fragile cultural resources, supporting essential community needs and contributing to a more compassionate and resilient society.",
    "ASSF works with custodians, local institutions, specialists and communities, recognising that lasting results depend on respect for local knowledge, careful stewardship of resources and sustained engagement.",
  ],
} as const;

/** §05, Our Leadership. The people are the trustees and advisors on /trustees. */
export const leadership = {
  label: "Our leadership",
  heading: "Trustees and Advisory Board",
  paragraphs: [
    "The Foundation is guided by its Board of Trustees, who provide governance, institutional stewardship and strategic direction. An Advisory Board brings relevant experience and specialist perspectives to support the Foundation's work and long-term priorities.",
    "Together, they help ensure that the Foundation's programmes remain aligned with its purpose, are informed by appropriate expertise and are carried out with responsibility and care.",
  ],
  trusteesLabel: "Board of Trustees",
  advisorsLabel: "Advisory Board",
  link: { label: "Read every trustee's and advisor's profile", href: "/trustees" },
} as const;

/** §06, Our Areas of Work: three equal cards, one photograph each. */
export const areas = {
  label: "Our areas of work",
  heading: "Three areas. One commitment.",
  intro: "Our work takes shape through three connected areas. Each responds to a different need, while reflecting the same commitment to heritage, dignity and service.",
  items: [
    {
      title: "Manuscript Conservation",
      tagline: "Preserving knowledge written by hand",
      body: "We work to preserve fragile palm-leaf and handwritten-paper manuscripts, protecting the knowledge they carry for future generations.",
      link: { label: "Explore Manuscript Conservation", href: "/manuscript-conservation" },
      image: { src: "/images/conservation/palm-leaf-before.jpeg", alt: "A damaged handwritten manuscript with a loss torn through its lower lines, photographed beside a slip marked BEFORE.", position: "50% 40%" },
    },
    {
      title: "Rural Infrastructure",
      tagline: "Creating spaces that serve communities",
      body: "We support rural communities through essential facilities and infrastructure that strengthen access, dignity and everyday community life.",
      link: { label: "Explore Rural Infrastructure", href: "/rural-infrastructure" },
      image: { src: "/images/rural/samudaya-bhavan-3-completed.jpeg", alt: "The completed Samudaya Bhavan at Yarnal: long, whitewashed wings with blue railings around a paved courtyard.", position: "40% 50%" },
    },
    {
      title: "Community Services",
      tagline: "Responding where the need is immediate",
      body: "We support communities through initiatives such as healthcare, education assistance and emergency relief, shaped by local needs.",
      link: { label: "Explore Community Services", href: "/community-services" },
      image: { src: "/images/community/health-camp-team.jpg", alt: "Doctors, nurses and volunteers standing in rows behind an Acharya Shanti Sagar Foundation banner at a free health camp.", position: "52% 50%" },
    },
  ],
} as const;

/**
 * §07, Our Work in Practice: one film, a small gallery and a few figures,
 * as the document's layout direction asks. The figures are the Impact
 * page's own.
 */
export const practice = {
  label: "Our work in practice",
  heading: "Our work in practice",
  figures: [
    { value: "1,66,500+", label: "folios conserved by hand" },
    { value: "3,500+", label: "people screened at free health camps" },
    { value: "7,77,534", label: "meals served, COVID-19 response" },
    { value: "3", label: "community spaces built or renovated" },
  ],
  link: { label: "See the full impact", href: "/impact" },
} as const;

/** §08, Looking Ahead. */
export const ahead = {
  label: "Looking ahead",
  heading: "Preserving the past. Serving the present. Preparing for the future.",
  paragraphs: [
    "Much remains to be done. Fragile manuscripts continue to require careful preservation, communities continue to need essential support, and the knowledge carried across generations deserves to remain accessible to those who follow.",
    "Acharya Shanti Sagar Foundation will continue to build on its experience, work alongside custodians and communities, and pursue its mission with care, responsibility and a long-term view.",
  ],
  closing: "Preserving the wisdom of the past. Empowering the communities of today. Inspiring a more compassionate tomorrow.",
  links: [
    { label: "Explore our work", href: "/#pillars" },
    { label: "View our projects", href: "/manuscript-conservation#sites" },
    { label: "Contact the Foundation", href: "#contact" },
  ],
  image: {
    src: "/images/work/kumbhoj-munis.jpg",
    alt: "A large group of munis gathered close around a conservation table.",
    caption: "Munis visiting the conservation work at Kumbhoj.",
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

/** §04, Our Mission, Vision and Values. */
export const mvv = {
  label: "What guides us",
  heading: "What guides us",
  mission: {
    label: "Mission",
    body: "To preserve India's manuscript heritage through scientific conservation and digitisation, strengthen rural communities through essential infrastructure, and respond to community needs through compassionate and practical service.",
  },
  vision: {
    label: "Vision",
    body: "To build a future where India's civilizational wisdom and social responsibility coexist as living forces — where knowledge is preserved, communities are empowered, and heritage becomes a foundation for sustainable and inclusive progress.",
  },
  valuesLabel: "Our values",
  values: [
    { deva: "अहिंसा", name: "Ahimsa", meaning: "Non-violence", body: "We seek to minimise harm and act with care in our decisions, relationships and programmes." },
    { deva: "सत्य", name: "Satya", meaning: "Truth", body: "We value integrity, accuracy and transparency in preserving knowledge, serving communities and stewarding entrusted resources." },
    { deva: "अपरिग्रह", name: "Aparigraha", meaning: "Responsible restraint", body: "We use resources thoughtfully and responsibly, keeping our purpose and the needs of communities at the centre of our work." },
    { deva: "अनेकान्तवाद", name: "Anekantavada", meaning: "Many-sided understanding", body: "We approach people, institutions and traditions with humility, recognising that different perspectives can deepen understanding." },
    { deva: "करुणा एवं सेवा", name: "Karuna & Seva", meaning: "Compassion and service", body: "We put our values into action through practical work that protects heritage, supports dignity and responds to human need." },
  ],
  principle: {
    label: "Our guiding principle",
    body: "“Parasparopagraho Jivanam” — living beings support one another. It expresses the interconnectedness that underlies both our commitment to heritage and our commitment to humanity.",
  },
} as const;

/** The survey, state by state: shown on Impact ("Where it began"). */
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
