/**
 * Homepage copy and data.
 *
 * Sourced from the Foundation's own "About Us", "Final Homepage Content" and
 * impact documents (Sept 2026) — see docs/ASSF Website context/. Figures are
 * the ones those documents state as final; anything they don't supply stays
 * `Pending` rather than guessed. Two known source discrepancies are flagged
 * in place with `EditorialNote` rather than silently resolved — see the
 * `altName` field on `sites` and the note on `board`.
 */
import { folioPrice, org, tributePrice, type Pending } from "./shared";

export const hero = {
  eyebrow: org.brandLine,
  title: ["Heritage preserved.", "Communities strengthened."],
  body: `Acharya Shanti Sagar Foundation is a charitable trust, established in ${org.founded}, working to conserve India's manuscript heritage, build essential rural infrastructure and respond to communities in need.`,
  watermark: "क्रिया करनी चाहिए तब अपना कार्य सिद्ध होता है।",
  primary: { label: `Conserve one folio — ₹${folioPrice}`, href: "#adopt" },
  secondary: { label: "Ask us to survey your collection", href: "#survey" },
} as const;

export const heroStats = [
  { figure: String(org.founded), note: `registered trust, Bengaluru — ${org.registration}` },
  { figure: "1,620+", note: "manuscripts conserved across two completed projects" },
  { figure: "1,34,545+", note: "folios preserved and digitised" },
] as const;

/** Condensed intro to the three pillars — full detail lives on their own pages. */
export const pillarsIntro = {
  gutter: "What We Do",
  heading: "Three pillars, one purpose",
  body: "Heritage and humanity are bound together: preserving a manuscript protects knowledge carried across generations; strengthening a village helps people live, learn and grow with dignity.",
} as const;

export const mission = {
  marker: "1r",
  gutter: "Mission",
  heading: "What we treat, and why it cannot wait",
  paragraphs: [
    "A tadpatra is a palm leaf, incised with a stylus and inked with lampblack. It is organic: it embrittles, darkens, grows fungus, and is eaten. A folio left untreated this decade may not exist in the next.",
    "The Foundation surveys collections held by bhandars, mandirs, mathas and traditional institutions, treats folio by folio at the custodian's own site, and digitises what it treats. Conservation is free to the custodian, and the manuscripts never change hands.",
  ],
  plate: {
    src: "/images/community/health-consultation.jpeg",
    caption: "Field survey and assessment work, part of the Foundation's manuscript conservation programme.",
  },
  link: { label: "Explore Manuscript Conservation", href: "/manuscript-conservation" },
} as const;

export const ledger = {
  gutter: "Ledger",
  heading: "Our work so far",
  intro:
    "Every figure here is an audited count, or it carries the period it covers. Nothing here is estimated.",
  metrics: [
    { label: "Manuscripts conserved", value: "1,620+", note: "Across two completed projects, Kumbhoj and Karanja Lad." },
    { label: "Folios preserved", value: "1,34,545+", note: "Assessed, treated and rehoused folio by folio." },
    { label: "Repositories surveyed", value: "18", note: "Across Karnataka, Maharashtra and Tamil Nadu." },
    { label: "Folios documented by survey", value: "17,14,928", note: "The scale of what remains to be conserved." },
  ] as { label: string; value: Pending<string>; note: string }[],
  link: { label: "See the full scale of the work", href: "/manuscript-conservation#scale" },
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

export const sites = {
  gutter: "Sites",
  heading: "From completed work to ongoing work",
  items: [
    {
      name: "Kumbhoj",
      institution: "Bahubali Siddhopeth Granthalaya",
      place: "Kolhapur district, Maharashtra",
      status: "Completed",
      image: "/images/sites/kumbhoj.png",
      figures: { manuscripts: "1,399", folios: "1,06,277" },
      footnote: "Conserved and fully digitised, February 2022 – September 2024.",
      altName: "Also recorded elsewhere as Anekant Shodh Peeth Granthalaya — flagged for the Foundation to confirm.",
    },
    {
      name: "Karanja Lad",
      institution: "Mahaveer Gurukul Ashram",
      place: "Washim district, Maharashtra",
      status: "Completed",
      image: "/images/sites/karanja.png",
      figures: { manuscripts: "221", folios: "28,268" },
      footnote: "Conserved October 2024 – August 2025. A further 866 folios have since been entrusted to the Foundation for the next phase.",
      altName: "Also recorded elsewhere as Shri Mahaveer Brahmacharyashram — flagged for the Foundation to confirm.",
    },
    {
      name: "Shravanabelagola",
      institution: "Bahubali Prakrit Bhawan, NIPSAR",
      place: "Hassan district, Karnataka",
      status: "Ongoing",
      image: "/images/sites/shravanabelagola.jpeg",
      figures: { manuscripts: "2,695 granthas", folios: "3,65,520" },
      footnote: "Conservation began 11 July 2025 — one of the Foundation's largest continuing efforts.",
    },
    {
      name: "Karanja Lad — continuing work",
      institution: "Shri Mulsang Balatkar Gan Mandir",
      place: "Washim district, Maharashtra",
      status: "Ongoing",
      image: "/images/sites/karanja.png",
      figures: { manuscripts: null, folios: null },
      footnote: "Building on the completed Karanja Lad project, extending conservation to further repositories in the area.",
    },
  ] as {
    name: string;
    institution: string;
    place: string;
    status: string;
    image: string;
    figures: { manuscripts: Pending<string>; folios: Pending<string> };
    footnote: string;
    altName?: string;
  }[],
} as const;

export const ruralTeaser = {
  gutter: "Rural Infrastructure",
  heading: "Building for community life",
  body: "A missing community hall limits gatherings. Distant staff housing keeps teachers from their schools. Poor sanitation affects public health. ASSF's rural infrastructure work starts with what a space needs to enable, not with the structure itself.",
  highlights: [
    { name: "Samudaya Bhavan, Yarnal", detail: "A multi-purpose community hall — gatherings, cultural programmes and guest accommodation — built on donated land.", image: "/images/rural/samudaya-bhavan-complete.jpeg" },
    { name: "Staff quarters, Hosur", detail: "14 rooms created for school and institutional staff who previously commuted from distant towns.", image: "/images/rural/staff-quarters-1.jpeg" },
    { name: "Public sanitation, Yarnal", detail: "Toilet blocks facilitated with the Zilla Panchayat, on land provided by the local Jain Mandir committee.", image: "/images/rural/sanitation-block-1.jpeg" },
  ],
  link: { label: "See Rural Infrastructure", href: "/rural-infrastructure" },
} as const;

export const communityTeaser = {
  gutter: "Community Services",
  heading: "Service where it is needed",
  body: "Alongside heritage work, ASSF responds to healthcare, education and emergency needs — understanding what a community requires, then responding directly.",
  highlights: [
    { label: "Healthcare", stat: "3,500+", note: "beneficiaries screened across free medical camps, including 251+ cataract surgeries and 5 heart bypasses" },
    { label: "Education support", stat: "500", note: "students given books and stationery across three schools near Yarnal" },
    { label: "Emergency relief", stat: "7,77,534", note: "meals distributed in Bengaluru's 2020 COVID-19 response, plus flood relief for 262 families" },
  ],
  link: { label: "See Community Services", href: "/community-services" },
} as const;

export const adopt = {
  gutter: "Adopt a folio",
  heading: "Adopt a folio",
  body: `₹${folioPrice} conserves one folio. You receive the image of the folio you funded, its archive record, and — if you want it — a permanent credit in that record. Dedications in memory of, or in honour of, a family member are recorded the same way.`,
  primary: { label: `Conserve one folio — ₹${folioPrice}`, href: "#give" },
  secondary: { label: `Tribute gift — ₹${tributePrice.toLocaleString("en-IN")}`, href: "#give" },
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
    /** Cells stay empty until real folio records exist. */
    filled: 0,
    total: 92,
    note: "The folio wall fills as gifts land. Each cell is one conserved folio, linkable and searchable. It stays empty until real folio records exist.",
  },
} as const;

export const lineage = {
  gutter: "Lineage",
  heading: "Charitra Chakravarti Acharya Shri 108 Shanti Sagar Ji Maharaj",
  paragraphs: [
    "The Foundation carries the name and upholds the tradition of Acharya Shri 108 Shanti Sagar Ji Maharaj, the first Acharya of the twentieth-century Digambar revival — the figure whose teachings shaped ASSF's founding philosophy.",
    "India Post issued a ₹5 commemorative stamp and first-day cover in his honour. The centenaries of his Muni Deeksha and of his Acharya Pad Pratishthapana are the occasion for the current conservation programme.",
  ],
  note: "The current site carries two conflicting dates for the stamp release. The date is left out here until the Foundation confirms it.",
  plate: {
    src: "/images/stamp-first-day-cover.jpeg",
    caption: "Release of the India Post ₹5 commemorative stamp and first-day cover. Date to be confirmed.",
  },
} as const;

export const board = {
  gutter: "Board",
  heading: "Guided by trustees and advisors",
  intro:
    "Eight founder trustees and three advisors guide the Foundation's work. A separate honorific ladder — Param Shiromani, Param Sanrakshak, Vaibhav, Udiyman, Udbhav — is used above for giving tiers, in the Foundation's own vocabulary.",
  members: [
    { name: "Dr. D. Veerendra Heggade", rank: "Param Samrakshak Margadarshak & Founder Trustee", affiliation: "Hereditary Dharmadhikari, Shri Kshetra Dharmasthala; Padma Vibhushan (2015); Member of Parliament, Rajya Sabha", image: "/images/trustees/veerendra-heggade.jpeg" },
    { name: "Shri Ashok Patni", rank: "Settlor, Visionary & Founder Trustee", affiliation: "Chairman Emeritus, R.K. Group; R.K. Marble; Wonder Cement", image: "/images/trustees/ashok-patni.jpeg" },
    { name: "Shri Anil Kumar Sethi", rank: "President & Founder Trustee", affiliation: "Chairman, ADD Group; founder, Pump Academy and iPUMPNET", image: "/images/trustees/anil-kumar-sethi.png" },
    { name: "Shri Rajendra Kumar Kataria", rank: "Working President & Founder Trustee", affiliation: "Kataria Automobiles, India's leading Maruti-Suzuki dealership", image: "/images/trustees/rajendra-kumar-kataria.jpeg" },
    { name: "Shri Rakesh Kumar Jain", rank: "Secretary & Founder Trustee", affiliation: "FCA, FCS; National Secretary, Bahubali Mahamastakabhisheka 2018", image: "/images/trustees/rakesh-kumar-jain.jpeg" },
    { name: "Shri Suresh Sablawat", rank: "Founder Trustee", affiliation: "Readiprint International", image: "/images/trustees/suresh-sablawat.jpeg" },
    { name: "Shri Vinod Doddanavar", rank: "Founder Trustee", affiliation: "Secretary, Bharatesh Education Trust", image: "/images/trustees/vinod-doddanavar.jpeg" },
    { name: "Shri Ashok Kumar Jain", rank: "Founder Trustee", affiliation: "Community and cultural-institution leadership", image: "/images/trustees/ashok-kumar-jain.jpeg" },
    { name: "Prof. Devagonda Appa Patil", rank: "Trustee", affiliation: "Maharashtra Jain Sahitya Parishad; Dakshin Bharat Jain Sabha", image: "/images/board/devagonda-appa-patil.png" },
  ],
  link: { label: "Meet all our trustees and advisors", href: "/trustees" },
} as const;

export const field = {
  gutter: "From the field",
  heading: "From the field",
  items: [
    {
      meta: "11 July 2025 · Shravanabelagola",
      title: "श्रवणबेलगोला में अति प्राचीन ताड़ पत्र व हस्त लिखित शास्त्रों के संरक्षण एवं संवर्धन का कार्य प्रारंभ।",
      body: "Conservation begins at Bahubali Prakrit Bhawan, Shravanabelagola — 2,695 granthas and 3,65,520 folios, one of the Foundation's largest continuing programmes.",
      image: "/images/sites/shravanabelagola.jpeg",
      href: "#dispatch-shravanabelagola",
    },
    {
      meta: "15 November 2024 · Parsola, Rajasthan",
      title: "अदृश्य भक्ति के दर्शन: शांति सागर महोत्सव का आलोक",
      body: "The Mahotsav procession at Parsola, 13 October 2024.",
      image: "/images/field/parsola-procession.jpeg",
      href: "#dispatch-parsola",
    },
    {
      meta: "India Post · date to verify",
      title: "आचार्य श्री शांति सागर जी पर विशेष ₹5 डाक टिकट का शुभ विमोचन",
      body: "Release of the ₹5 commemorative stamp and first-day cover for Acharya Shri Shanti Sagar Ji. Two conflicting dates exist for this release.",
      image: "/images/stamp-first-day-cover.jpeg",
      href: "#dispatch-stamp",
    },
  ],
  linkLabel: "Read the dispatch",
} as const;

export const survey = {
  heading: "Do you hold tadpatras?",
  body: "Bhandars, mandirs, mathas and families across Karnataka, Maharashtra, Rajasthan, Gujarat and Madhya Pradesh hold folios that are deteriorating now. A survey costs the custodian nothing and the manuscripts never leave your premises. Send photographs from a phone, or call.",
  primary: { label: "Ask us to survey your collection", href: "#contact" },
} as const;

export const standing = {
  gutter: "Standing",
  body: "Recognised as a Manuscript Conservation Centre under Gyan Bharatam (formerly the National Mission for Manuscripts) — the second such centre certified in Karnataka. Monthly and annual reporting; audited financials.",
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
