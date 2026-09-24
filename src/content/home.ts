/**
 * Homepage copy and data.
 *
 * Sourced from the Foundation's own "About Us", "Final Homepage Content",
 * "Impact", "Mission, Vision & Values" and "Community Services" documents
 * (Sept 2026) — see docs/ASSF Website context/. Figures are the ones those
 * documents state; anything they don't supply stays `Pending` rather than
 * guessed. Known source discrepancies are flagged in place with
 * `EditorialNote` rather than silently resolved — see `altName` on `sites`
 * and the notes on `lineage` and `standing`.
 */
import { folioPrice, org, tributePrice, type Pending } from "./shared";

/**
 * The headline is the Foundation's approved one ("Final Homepage Content",
 * §1). Each clause carries an interlinear gloss — the figure that makes the
 * claim specific — the way a commented manuscript glosses its main text.
 */
export const hero = {
  label: "The Foundation",
  lines: [
    { text: "Preserving Wisdom.", gloss: "1,34,545 folios conserved at Kumbhoj and Karanja Lad" },
    { text: "Serving People.", gloss: "7,77,534 cooked meals, Bengaluru, 1 April – 3 May 2020" },
    { text: "Building for the Future.", gloss: "14 rooms of staff quarters at Hosur; a Samudaya Bhavan at Yarnal" },
  ],
  body: `Acharya Shanti Sagar Foundation is a charitable foundation established in ${org.founded}, working to preserve India's manuscript heritage, strengthen rural communities and respond to practical human needs.`,
  registration: `Registered trust, Bengaluru — ${org.registration}`,
  /** The Foundation's own hero actions ("Final Homepage Content", §1). */
  primary: { label: "Explore our work", href: "#pillars" },
  secondary: { label: "Support the mission", href: "#join" },
  plate: {
    src: "/images/survey-in-progress.jpeg",
    alt: "A handwritten Devanagari folio on a conservator's blotting paper, beside a pH indicator strip held in tweezers.",
    caption: "Survey in progress. A folio's acidity is tested before any treatment begins.",
  },
} as const;

export const mission = {
  label: "Why it cannot wait",
  heading: "Palm leaf does not wait",
  lede: "Manuscripts do not announce when they are dying. The deterioration is quiet — a crack in a palm leaf, a folio that crumbles at the edge, ink that fades to nothing over a season.",
  paragraphs: [
    "A tadpatra is a palm leaf, incised with a stylus and inked with lampblack. It is organic: it embrittles, darkens, grows fungus, and is eaten. A folio left untreated this decade may not exist in the next.",
    "The Foundation surveys collections held by bhandars, mandirs, mathas and traditional institutions, treats folio by folio at the custodian's own site, and digitises what it treats. Conservation is free to the custodian, and the manuscripts never change hands.",
  ],
  gloss: {
    label: "What the Foundation's field survey found",
    text: "Brittle palm leaves breaking at touch, insects consuming pages, moisture causing deterioration, ink fading beyond legibility, fragile bindings failing.",
  },
  plate: {
    src: "/images/conservation/palm-leaf-before.jpeg",
    alt: "A damaged handwritten manuscript with a loss torn through its lower lines, photographed beside a slip marked BEFORE and an accession label reading KBJ/PM/047.",
    caption: "Before treatment. Every manuscript is recorded before it is touched — this one as KBJ/PM/047.",
  },
  link: { label: "How a manuscript is conserved", href: "/manuscript-conservation#process" },
} as const;

/** Condensed intro to the three pillars — full detail lives on their own pages. */
export const pillarsIntro = {
  label: "What we do",
  heading: "Three pillars, one purpose",
  body: "Heritage and humanity are bound together: preserving a manuscript protects knowledge carried across generations; strengthening a village helps people live, learn and grow with dignity.",
  principal: "Today, manuscript conservation is the Foundation's principal programme.",
} as const;

export const ledger = {
  label: "Ledger",
  heading: "Our work so far",
  intro:
    "Counts from the Foundation's two completed conservation projects and its survey of 18 repositories. Where a figure has not been supplied, the space is left open — not estimated.",
  metrics: [
    { label: "Manuscripts conserved", value: "1,620+", note: "Kumbhoj 1,399 · Karanja Lad 221 — two completed projects." },
    { label: "Folios conserved", value: "1,34,545+", note: "Kumbhoj 1,06,277 · Karanja Lad 28,268 — assessed, treated and rehoused folio by folio." },
    { label: "Repositories surveyed", value: "18", note: "Karnataka 3 · Maharashtra 6 · Tamil Nadu 9." },
    { label: "Folios documented by survey", value: "17,14,928", note: "In 12,681 manuscripts — the measure of what remains to be protected." },
  ] as { label: string; value: Pending<string>; note: string }[],
} as const;

/**
 * The three quantities of manuscript work, drawn as lines at one scale. They
 * are not presented as fractions of one another — the documents don't say
 * whether the survey counts overlap the conserved collections.
 */
export const scale = {
  heading: "The scale ahead",
  statement: ["What we have conserved is significant.", "What remains to be protected is far greater."],
  lines: [
    { label: "Folios conserved", detail: "Kumbhoj and Karanja Lad, completed", value: 134545, display: "1,34,545", state: "done" },
    { label: "Folios under conservation", detail: "Shravanabelagola, since 11 July 2025", value: 365520, display: "3,65,520", state: "working" },
    { label: "Folios documented by survey", detail: "18 repositories in Karnataka, Maharashtra and Tamil Nadu", value: 1714928, display: "17,14,928", state: "open" },
  ] as { label: string; detail: string; value: number; display: string; state: "done" | "working" | "open" }[],
  note: "Each line is drawn to the same scale.",
  link: { label: "See the survey, state by state", href: "/about#scale" },
} as const;

export const conservationStages = [
  "Surveyed",
  "Fumigated",
  "Dry-cleaned",
  "Deacidified",
  "Mended",
  "Flattened",
  "Digitised",
  "Rehoused",
  "Returned",
] as const;

/**
 * `start`/`end` are "YYYY-MM" and drive the timeline. `null` start means the
 * Foundation has not supplied one (drawn as a lacuna); `null` end means the
 * work is ongoing. Only Shravanabelagola has a photograph of its own — the
 * two "Heritage Restoration Program" banners previously used for Kumbhoj
 * and Karanja Lad were title graphics, not pictures of either site.
 */
export const sites = {
  label: "Sites",
  heading: "From completed work to ongoing work",
  items: [
    {
      name: "Kumbhoj",
      institution: "Bahubali Siddhopeth Granthalaya",
      place: "Kolhapur district, Maharashtra",
      status: "Completed",
      start: "2022-02",
      end: "2024-09",
      figures: { manuscripts: "1,399", folios: "1,06,277" },
      footnote: "Conserved and fully digitised, February 2022 – September 2024.",
      altName: "Also recorded elsewhere as Anekant Shodh Peeth Granthalaya — flagged for the Foundation to confirm.",
    },
    {
      name: "Karanja Lad",
      institution: "Mahaveer Gurukul Ashram",
      place: "Washim district, Maharashtra",
      status: "Completed",
      start: "2024-10",
      end: "2025-08",
      figures: { manuscripts: "221", folios: "28,268" },
      footnote: "Conserved October 2024 – August 2025. A further 866 folios have since been entrusted to the Foundation for the next phase.",
      altName: "Also recorded elsewhere as Shri Mahaveer Brahmacharyashram — flagged for the Foundation to confirm.",
    },
    {
      name: "Shravanabelagola",
      institution: "Bahubali Prakrit Bhawan, NIPSAR",
      place: "Hassan district, Karnataka",
      status: "Ongoing",
      start: "2025-07",
      end: null,
      image: "/images/sites/shravanabelagola.jpeg",
      imageAlt: "Palm-leaf and paper manuscripts laid out on red cloth at Shravanabelagola, with monks and Foundation members looking on.",
      figures: { manuscripts: "2,695 granthas", folios: "3,65,520" },
      footnote: "Conservation began 11 July 2025 — one of the Foundation's largest continuing efforts.",
    },
    {
      name: "Karanja Lad — continuing work",
      institution: "Shri Mulsang Balatkar Gan Mandir",
      place: "Washim district, Maharashtra",
      status: "Ongoing",
      start: null,
      end: null,
      figures: { manuscripts: null, folios: null },
      footnote: "Building on the completed Karanja Lad project, extending conservation to further repositories in the area.",
    },
  ] as {
    name: string;
    institution: string;
    place: string;
    status: "Completed" | "Ongoing";
    start: string | null;
    end: string | null;
    image?: string;
    imageAlt?: string;
    figures: { manuscripts: Pending<string>; folios: Pending<string> };
    footnote: string;
    altName?: string;
  }[],
} as const;

export const ruralTeaser = {
  label: "Rural infrastructure",
  heading: "Building for community life",
  body: "A missing community hall limits gatherings. Distant staff housing keeps teachers from their schools. Poor sanitation affects public health. The work starts with what a space needs to enable, not with the structure itself.",
  sequence: [
    { src: "/images/rural/samudaya-bhavan-1-site.jpeg", alt: "Bare, levelled ground beside a village road at Yarnal.", caption: "Yarnal: the site before development." },
    { src: "/images/rural/samudaya-bhavan-3-completed.jpeg", alt: "The completed Samudaya Bhavan at Yarnal: long, whitewashed wings with blue railings around a paved courtyard.", caption: "The completed Samudaya Bhavan." },
  ],
  highlights: [
    { name: "Samudaya Bhavan, Yarnal", detail: "A multi-purpose community hall — gatherings, cultural programmes and guest accommodation — built on donated land." },
    { name: "Staff quarters, Hosur", detail: "14 rooms for school and institutional staff who previously commuted from distant towns." },
    { name: "Public sanitation, Yarnal", detail: "Toilet blocks facilitated with the Zilla Panchayat, on land provided by the local Jain Mandir committee." },
  ],
  link: { label: "See Rural Infrastructure", href: "/rural-infrastructure" },
} as const;

export const communityTeaser = {
  label: "Community services",
  heading: "Service where it is needed",
  body: "Alongside heritage work, the Foundation responds to healthcare, education and emergency needs — understanding what a community requires, then responding directly.",
  highlights: [
    { label: "Healthcare", value: "3,500+", note: "Screened at free medical camps, with 251+ cataract surgeries and 5 heart bypasses." },
    { label: "Education support", value: "c. 500", note: "Students given books and stationery, across three schools near Yarnal." },
    { label: "Emergency relief", value: "7,77,534", note: "Meals in Bengaluru's 2020 COVID-19 response; flood relief for 262 families in 2019." },
  ],
  plate: {
    src: "/images/community/health-camp-team.jpg",
    alt: "Doctors, nurses and volunteers standing in rows behind an Acharya Shanti Sagar Foundation banner at a free health camp.",
    caption: "The team at a free health camp.",
  },
  link: { label: "See Community Services", href: "/community-services" },
} as const;

/**
 * Join the work ("Final Homepage Content", §14). Giving is one way in among
 * several, and deliberately not the loudest: custodians, partners and
 * professionals are listed first, and folio adoption sits beneath them as a
 * sub-section, its price stated once in running text.
 */
export const join = {
  label: "Join the work",
  heading: "Join the work",
  body: [
    "Preserving knowledge and serving communities are long-term responsibilities. They require people, expertise, institutions, resources and partnerships.",
    "Whether through support, institutional collaboration, professional expertise or participation, there are many ways to contribute to work that protects heritage and creates lasting value for communities.",
  ],
  ways: [
    {
      title: "Hold manuscripts?",
      body: "Ask for a survey. It costs the custodian nothing, and the manuscripts never leave your premises.",
      link: { label: "Ask us to survey your collection", href: "#survey" },
    },
    {
      title: "Partner with us",
      body: "Institutional collaboration — with custodial institutions, hospitals, schools, community organisations and public authorities.",
      link: { label: "Write to the Foundation", href: `mailto:${org.email}?subject=${encodeURIComponent("Partnership")}` },
    },
    {
      title: "Work with us",
      body: "Professional expertise and participation, in conservation and in the Foundation's community work.",
      link: { label: "Write to the Foundation", href: `mailto:${org.email}?subject=${encodeURIComponent("Working with the Foundation")}` },
    },
    {
      title: "Support the work",
      body: "Fund the conservation of a folio, or support the Foundation's programmes.",
      link: { label: "Adopting a folio", href: "#adopt" },
    },
  ],
} as const;

export const adopt = {
  heading: "Adopting a folio",
  body: `Conserving one folio costs ₹${folioPrice}. If you fund one, you receive the image of that folio, its archive record, and — if you want it — a permanent credit in that record. Dedications in memory of, or in honour of, a family member are recorded the same way, including tribute gifts of ₹${tributePrice.toLocaleString("en-IN")}.`,
  link: { label: "Bank transfer details", href: "#give" },
  ranksLabel: "Giving ranks, in the Foundation's own vocabulary",
  ranks: [
    { deva: "उद्भव", latin: "Udbhav" },
    { deva: "उदीयमान", latin: "Udiyman" },
    { deva: "वैभव", latin: "Vaibhav" },
    { deva: "परम संरक्षक", latin: "Param Sanrakshak" },
    { deva: "परम शिरोमणि", latin: "Param Shiromani", highest: true },
  ] as { deva: string; latin: string; highest?: boolean }[],
  thresholdNote: "threshold awaiting Foundation",
  wall: {
    /** Leaves stay blank until real folio records exist. */
    filled: 0,
    total: 92,
    note: "The bundle fills as folios are adopted: each leaf is one conserved folio, linkable and searchable. It stays blank until real folio records exist.",
  },
} as const;

export type Voice = {
  /** Where the voice comes from, and who is speaking. */
  kind: string;
  /** The words exactly as written — never paraphrased or tidied. */
  quote: Pending<string>;
  name: Pending<string>;
  role?: string;
  place?: string;
  /** Others who signed the same entry. */
  alongside?: string;
  /** Translated editions only: the quote in the edition's language, shown
      beneath the original rather than in place of it. */
  translation?: string;
  /** A photograph of the original, set beside the transcription. */
  facsimile?: { src: string; alt: string; ratio: string; caption: string };
  /** A vertical phone video of the speaker, optional. Captions are required
      before a video is published: `captions` is a WebVTT file in /public. */
  video?: { src: string; poster: string; captions: string };
};

/**
 * Voices from the work ("Final Homepage Content", §11). Entries from the
 * Foundation's visitors' book, supplied by the Foundation (Sept 2026). Each
 * is transcribed word for word and set beside a photograph of the
 * handwritten page — a facsimile facing its transcription, as a critical
 * edition prints them. A voice with `quote: null` renders as a lacuna, for
 * places the Foundation wants reserved but has not yet filled.
 */
export const voices = {
  label: "Voices",
  heading: "Voices from the work",
  lede: "The impact of this work is best understood through the people and institutions who experience it directly.",
  pendingNote: "testimonial awaiting Foundation",
  translationLabel: "Translation",
  zoomLabel: "Open the handwritten page at full size",
  sourceNote: "From the Foundation's visitors' book. Each entry is transcribed as written, beside a photograph of the page.",
  items: [
    {
      kind: "From the visitors' book — Government of Maharashtra",
      quote:
        "The work of conservation and preservation of “Jinvani” is an excellent and priceless work. This work will definitely increase the life span of all texts which are rarely available. All the best for noble work.",
      name: "Dr. Jyotsna Padiyar, IAS",
      role: "Commissioner, Economics & Statistics, Planning Department, Government of Maharashtra",
      alongside: "Signed with Shri Krishna Phirke, Special Commissioner, and Amol Khandare, Additional Commissioner.",
      facsimile: {
        src: "/images/voices/visitors-book-maharashtra-officials.jpg",
        alt: "The handwritten entry in the Foundation's visitors' book: the names of Dr. Jyotsna Padiyar, Shri Krishna Phirke and Amol Khandare, and their remarks, with a signature.",
        ratio: "1280 / 724",
        caption: "The entry in the Foundation's visitors' book.",
      },
    },
    {
      kind: "From the visitors' book — a visitor from Washim",
      quote:
        "Seeing the restoration work of more than 1000 granths of our Jainism, filled me with immense pride and happiness. It made me realize the greatness of our saints who worked hard for the betterment of society and spiritual upliftment. I am deeply grateful for the restoration team, the trust and everyone involved for their initiative and extremely happy for all the work that has been done and is still going on. Thank you for reviving the gems of Jainism.",
      name: "Rishabh Jitendra Chhabda",
      place: "Washim, Maharashtra",
      facsimile: {
        src: "/images/voices/visitors-book-washim.jpg",
        alt: "A handwritten page of the Foundation's visitors' book: Rishabh Jitendra Chhabda of Washim, Maharashtra, and his remarks.",
        ratio: "1280 / 1231",
        caption: "The entry in the Foundation's visitors' book.",
      },
    },
  ] as Voice[],
} as const;

export const lineage = {
  label: "Lineage",
  nameDeva: "चारित्र चक्रवर्ती आचार्य श्री १०८ शांति सागर जी महाराज",
  heading: "Charitra Chakravarti Acharya Shri 108 Shanti Sagar Ji Maharaj",
  dates: "1872 – 1955",
  paragraphs: [
    "The Foundation carries the name and upholds the tradition of Acharya Shri 108 Shanti Sagar Ji Maharaj, the first Acharya of the twentieth-century Digambar revival — the figure whose teachings shaped ASSF's founding philosophy.",
    "India Post issued a ₹5 commemorative stamp and first-day cover in his honour. The centenaries of his Muni Deeksha and of his Acharya Pad Pratishthapana are the occasion for the current conservation programme.",
  ],
  /** The line carried on the Foundation's own banner beside his portrait. */
  epigraph: "क्रिया करनी चाहिए तब अपना कार्य सिद्ध होता है।",
  note: "The current site carries two conflicting dates for the stamp release. The date is left out here until the Foundation confirms it.",
  portrait: {
    src: "/images/lineage/acharya-shantisagar-1955.jpg",
    alt: "Black-and-white close-up of Acharya Shanti Sagar Ji Maharaj in old age.",
    caption: "Kunthalgiri, 1955, during his Sallekhana. Public domain, via Wikimedia Commons.",
  },
  plate: {
    src: "/images/stamp-first-day-cover.jpeg",
    alt: "India Post first-day cover bearing the ₹5 commemorative stamp for Acharya Shanti Sagar Ji Maharaj.",
    caption: "The India Post ₹5 commemorative stamp and first-day cover. Date to be confirmed.",
  },
} as const;

export const board = {
  label: "Board",
  heading: "Guided by trustees and advisors",
  intro:
    "Eight founder trustees and three advisors guide the Foundation's work. A separate honorific ladder — Param Shiromani, Param Sanrakshak, Vaibhav, Udiyman, Udbhav — names the giving tiers, in the Foundation's own vocabulary.",
  members: [
    { name: "Dr. D. Veerendra Heggade", rank: "Param Samrakshak Margadarshak & Founder Trustee", affiliation: "Hereditary Dharmadhikari, Shri Kshetra Dharmasthala; Padma Vibhushan (2015); Member of Parliament, Rajya Sabha", image: "/images/trustees/veerendra-heggade.jpeg" },
    { name: "Shri Ashok Patni", rank: "Settlor, Visionary & Founder Trustee", affiliation: "Chairman Emeritus, R.K. Group; R.K. Marble; Wonder Cement", image: "/images/trustees/ashok-patni.jpeg" },
    { name: "Shri Anil Kumar Sethi", rank: "President & Founder Trustee", affiliation: "Chairman, ADD Group; founder, Pump Academy and iPUMPNET", image: "/images/trustees/anil-kumar-sethi.png" },
    { name: "Shri Rajendra Kumar Kataria", rank: "Working President & Founder Trustee", affiliation: "Kataria Automobiles, India's leading Maruti-Suzuki dealership", image: "/images/trustees/rajendra-kumar-kataria.jpeg" },
    { name: "Shri Rakesh Kumar Jain", rank: "Secretary & Founder Trustee", affiliation: "FCA, FCS; National Secretary, Bahubali Mahamastakabhisheka 2018", image: "/images/trustees/rakesh-kumar-jain.jpeg" },
    { name: "Shri Suresh Sablawat", rank: "Founder Trustee", affiliation: "Readiprint International", image: "/images/trustees/suresh-sablawat.jpeg" },
    { name: "Shri Vinod Doddanavar", rank: "Founder Trustee", affiliation: "Secretary, Bharatesh Education Trust", image: "/images/trustees/vinod-doddanavar.jpeg" },
    { name: "Shri Ashok Kumar Jain", rank: "Founder Trustee", affiliation: "Community and cultural-institution leadership", image: "/images/trustees/ashok-kumar-jain.jpeg" },
  ],
  link: { label: "Meet all our trustees and advisors", href: "/trustees" },
} as const;

export const field = {
  label: "From the field",
  heading: "From the field",
  lede: "The work continues beyond completed projects. Conservation teams are in the field now, at Shravanabelagola and Karanja Lad.",
  items: [
    {
      date: "11 July 2025",
      place: "Shravanabelagola",
      title: "श्रवणबेलगोला में अति प्राचीन ताड़ पत्र व हस्त लिखित शास्त्रों के संरक्षण एवं संवर्धन का कार्य प्रारंभ।",
      body: "Conservation begins at Bahubali Prakrit Bhawan, Shravanabelagola — 2,695 granthas and 3,65,520 folios, one of the Foundation's largest continuing programmes.",
    },
    {
      date: "15 November 2024",
      place: "Parsola, Rajasthan",
      title: "अदृश्य भक्ति के दर्शन: शांति सागर महोत्सव का आलोक",
      body: "The Mahotsav procession at Parsola, 13 October 2024.",
    },
    {
      date: null,
      place: "India Post",
      title: "आचार्य श्री शांति सागर जी पर विशेष ₹5 डाक टिकट का शुभ विमोचन",
      body: "Release of the ₹5 commemorative stamp and first-day cover for Acharya Shri Shanti Sagar Ji. Two conflicting dates exist for this release.",
    },
  ] as { date: Pending<string>; place: string; title: string; body: string }[],
} as const;

export const survey = {
  heading: "Do you hold tadpatras?",
  body: "Bhandars, mandirs, mathas and families across Karnataka, Maharashtra, Rajasthan, Gujarat and Madhya Pradesh hold folios that are deteriorating now. A survey costs the custodian nothing and the manuscripts never leave your premises. Send photographs from a phone, or call.",
  callLabel: "Call the Foundation",
  primary: {
    label: "Ask us to survey your collection",
    href: `mailto:${org.email}?subject=${encodeURIComponent("Manuscript survey request")}`,
  },
} as const;

export const standing = {
  label: "Standing",
  body: "Recognised as a Manuscript Conservation Centre under Gyan Bharatam (formerly the National Mission for Manuscripts) — the second such centre certified in Karnataka. Monthly and annual reporting.",
  badges: [
    { label: "Manuscript Conservation Centre, Gyan Bharatam", state: "recognised" as const },
    { label: "12A / 80G", state: "pending" as const },
    { label: "CSR-1", state: "pending" as const },
    { label: "NGO Darpan", state: "pending" as const },
    { label: "FCRA", state: "pending" as const },
    { label: "Audited financials", state: "pending" as const },
  ] as { label: string; state: "recognised" | "verify" | "pending"; note?: string }[],
  note: "The pending items are what a serious donor and a CSR officer check before giving. They are blockers, not decoration: each is a document the Foundation holds and must supply before launch.",
} as const;
