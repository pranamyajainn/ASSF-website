/**
 * About Us, in the words and order of the Foundation's page designs (Nov
 * 2026): our inspiration, what guides us, who we are, what we do, our
 * journey and what lies ahead. The trustees, advisors and team are on
 * Our Guiding Lights (content/trustees.ts).
 */
const P = "/images/pages/about/";

/** §1, Our Inspiration: Acharya Shri, with his portrait. */
export const pageHero = {
  question: "Our",
  label: "Inspiration",
  eyebrow: "About Us · Our Inspiration",
  title: "Pratham Acharya Shri 108 Shanti Sagar Ji Maharaj (1872–1955)",
  paragraphs: [
    "Revered as the first Acharya of the twentieth-century revival of the Digambar Jain monastic tradition, Acharya Shri lived a life of rare discipline, non-violence and restraint.",
    "He cherished the written word. Learning that ancient scriptures, written on palm leaves a thousand years before, were growing fragile and falling prey to insects, he called upon the community to save them. With its devotion, the sacred texts were inscribed on copper sheets to endure for thousands of years.",
    "His compassion reached every living being and every person in need. That care is the seed of our Foundation, and the light we work by.",
  ],
  image: {
    src: `${P}acharya-shri.jpg`,
    alt: "Pratham Acharya Shri 108 Shanti Sagar Ji Maharaj, seated in meditation",
    caption: "Pratham Acharya Shri 108 Shanti Sagar Ji Maharaj",
  },
} as const;

/** §2, What Guides Us: mission, vision and the five principles. */
export const guides = {
  question: "What",
  label: "guides us",
  heading: "What Guides Us",
  missionLabel: "Our mission",
  mission: "To preserve the wisdom of the past, serve the people of the present, and build for the future.",
  motto: "Preserve. Serve. Build.",
  visionLabel: "Our vision",
  vision: "A future in which India's handwritten heritage is safe, read and alive, and the communities who hold it thrive.",
  principlesLabel: "Our five principles, drawn from Acharya Shri's teaching",
  principles: [
    { deva: "अहिंसा", name: "Ahimsa", meaning: "Non-violence", body: "We touch every life, and every fragile leaf, with care that does no harm." },
    { deva: "सत्य", name: "Satya", meaning: "Truth", body: "Honest work, accurate records and open accounts." },
    { deva: "अपरिग्रह", name: "Aparigraha", meaning: "Restraint", body: "We use only what the work needs, and pass the rest forward." },
    { deva: "अनेकान्तवाद", name: "Anekantavada", meaning: "Many-sided understanding", body: "We listen to custodians, scholars and communities before we act." },
    { deva: "करुणा एवं सेवा", name: "Karuna and Seva", meaning: "Compassion and service", body: "Compassion that becomes action, in a laboratory, a health camp or a village hall." },
  ],
} as const;

/** §3, Who we are. */
export const who = {
  question: "Who",
  label: "we are",
  heading: "In Service of Heritage and Humanity",
  body: "Acharya Shanti Sagar Foundation is a charitable trust, founded in Bengaluru in 2019 and guided by trustees from public life, industry and Jain institutions. We conserve the manuscripts that carry India's written heritage, stand beside communities wherever they need us, and build the spaces villages ask for. Next, through Swavalamban Yojana, we will help families build livelihoods of their own. Our own team carries every project, from the first visit to the final handover, side by side with the people we serve.",
  quote: "जीवन धरोहर संरक्षण",
  translation: "Caring for the wisdom of the past, the people of today and the villages of tomorrow.",
  image: {
    src: `${P}three-pillars.jpg`,
    alt: "Three views of our work: manuscripts conserved and shown to the community, schoolchildren receiving books, and the Samudaya Bhavan at Yarnal",
  },
  captions: ["Manuscript Conservation", "Community Services", "Rural Infrastructure"],
} as const;

/** §4, What We Do: the three pillars. */
export const pillars = {
  question: "What",
  label: "we do",
  heading: "What We Do",
  lede: "Three pillars, growing from one root of care.",
  more: "Read more",
  items: [
    { title: "Manuscript Conservation", body: "Bringing fragile palm-leaf and paper manuscripts back to health, folio by folio, in the care of their own custodians.", href: "/manuscript-conservation" },
    { title: "Community Services", body: "Health camps, support for schoolchildren and relief in hard times, offered with dignity wherever the need arises.", href: "/community-services" },
    { title: "Rural Infrastructure", body: "Community halls, a resting space for rural teachers and clean sanitation, built with the villages that asked for them.", href: "/rural-infrastructure" },
  ],
} as const;

/** §5, Our Journey: a year-by-year timeline in three columns, one per pillar. */
export const journey = {
  question: "Our",
  label: "Journey",
  heading: "Seven Years of Growing Service",
  lede: "Three pillars, growing side by side. Each step grew from the one before.",
  columns: { manuscripts: "Manuscripts", community: "Community", villages: "Villages" },
  founded: "6 February 2019 · Acharya Shanti Sagar Foundation is constituted in Bengaluru",
  years: [
    { year: "2019", manuscripts: [], community: ["Five free health camps", "Flood relief for six villages", "Books for 500 schoolchildren"], villages: ["Teachers' resting space, Hosur", "Samudaya Bhavan, Yarnal"] },
    { year: "2020", manuscripts: [], community: ["7,77,534 meals shared in the lockdown"], villages: ["Shanti Stambh inaugurated"] },
    { year: "2022", manuscripts: ["First laboratory opens at Kumbhoj"], community: [], villages: [] },
    { year: "2024", manuscripts: ["Kumbhoj completed: 1,399 objects, fully digitized", "Karanja Lad laboratory opens"], community: [], villages: [] },
    { year: "2025", manuscripts: ["Shravanabelagola begins: 2,695 granthas", "Gurukul Ashram collection completed"], community: [], villages: [] },
    { year: "2026", manuscripts: ["MOU with the Shravanabelagola Matha trust", "Balatkar Gan Mandir collection completed", "MoU with the Sengan Temple", "Plans placed before the Government of Karnataka"], community: [], villages: [] },
  ] as { year: string; manuscripts: string[]; community: string[]; villages: string[] }[],
  today: {
    year: "Today",
    manuscripts: ["Two laboratories at work"],
    community: ["Swavalamban Yojana, coming next"],
    villages: ["Ready for the next village"],
  },
  figures: [
    { value: "2,49,896+", label: "folios conserved by hand" },
    { value: "7,77,534", label: "meals shared in the lockdown" },
    { value: "3,500+", label: "people cared for at free health camps" },
    { value: "14", label: "rooms for rural teachers to rest" },
  ],
} as const;

/** §6, Looking Ahead: the survey, the next sites, the film and the closing line. */
export const ahead = {
  question: "Looking",
  label: "Ahead",
  heading: "The Pages Yet to Turn",
  lede: "Manuscripts are the heart of our work because they cannot wait. Written by hand centuries ago, each one is the only copy of its kind, and time, damp and insects work on it every day. Our field survey of Jain collections across three states shows how much is still in our hands to save.",
  figures: [
    { value: "18", label: "repositories surveyed in Karnataka, Maharashtra and Tamil Nadu" },
    { value: "12,681", label: "manuscripts recorded" },
    { value: "17,14,928", label: "folios recorded" },
    { value: "2,560", label: "manuscripts already safe in our care" },
  ],
  paragraphs: [
    "At Shravanabelagola, our laboratory will carry all 2,695 palm-leaf granthas through to safety. At Karanja Lad, our laboratory now turns to the Sengan Temple collection, under an MoU signed on 24 October 2026. At Moodbidri and Karkala, where our journey first began, 4,472 granthas are ready for care.",
    "And the circle of care keeps widening. Through Swavalamban Yojana, our coming scheme, we will help families build livelihoods of their own and stand on their own feet with dignity.",
    "There is a place on this road for you.",
  ],
  closing: "Preserving the wisdom of the past. Empowering the communities of today. Inspiring a more compassionate tomorrow.",
  links: [
    { label: "Support the mission", href: "/donate" },
    { label: "Explore our work", href: "/#pillars" },
    { label: "Write to us", href: "#contact" },
  ],
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
