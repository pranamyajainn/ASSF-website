/**
 * All homepage copy and data.
 *
 * The design's governing rule: the Foundation has not yet supplied audited
 * counts, so nothing numeric is invented here. Every unknown is `null` and
 * renders as a dashed placeholder with an "awaiting Foundation" note. The site
 * this replaces displayed zeroes; that is precisely what these placeholders
 * exist to avoid.
 */

export type Pending<T> = T | null;

export const org = {
  nameDeva: "आचार्य शांति सागर फाउंडेशन",
  nameLatin: "Acharya Shanti Sagar Foundation",
  tagline: "जीवन धरोहर संरक्षण",
  sealDeva: "शांति सागरम्",
  registration: "GAN-4-00431-2018-19",
  phone: "+91 8095588411",
  email: "info@shantisagarfoundation.org",
  office:
    "A1, Office Building, 2nd Floor, Epsilon Residential Villas, Yamlur Main Road, next to CGI, Bengaluru 560037, Karnataka",
  bank: {
    branch: "IndusInd Bank, M G Road, Bengaluru 560001",
    account: "SB A/c 100118813667",
    ifsc: "IFSC INDB0000008",
  },
} as const;

export const folioPrice = 414;
export const tributePrice = 9938;

export const nav = [
  { label: "Archive", href: "#plates" },
  { label: "Conserve", href: "#sites" },
  { label: "Projects", href: "#sites" },
  { label: "Foundation", href: "#board" },
] as const;

export const languages = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिन्दी" },
  { code: "kn", label: "ಕನ್ನಡ" },
] as const;

export const hero = {
  eyebrow: org.tagline,
  title: ["Palm leaf does", "not wait."],
  body: "The Foundation conserves tadpatra — palm-leaf folios carrying Jain scripture, Ayurvedic texts, grammars and commentaries. Some are the only surviving copy of what they contain.",
  watermark: "क्रिया करनी चाहिए तब अपना कार्य सिद्ध होता है।",
  primary: { label: `Conserve one folio — ₹${folioPrice}`, href: "#adopt" },
  secondary: { label: "Ask us to survey your collection", href: "#survey" },
} as const;

export const heroStats = [
  { figure: `₹${folioPrice}`, note: "conserves one folio, end to end" },
  { figure: "NMM", note: "recognised by the National Mission for Manuscripts" },
  { figure: "2018", note: `registered trust, Bengaluru — ${org.registration}` },
] as const;

export const mission = {
  marker: "1r",
  gutter: "Mission",
  heading: "What we treat, and why it cannot wait",
  paragraphs: [
    "A tadpatra is a palm leaf, incised with a stylus and inked with lampblack. It is organic: it embrittles, darkens, grows fungus, and is eaten. A folio left untreated this decade may not exist in the next.",
    "The Foundation surveys collections held by bhandars, mandirs, mathas and families, treats folio by folio at the custodian's own site, and digitises what it treats. Conservation is free to the custodian. The manuscripts never change hands.",
  ],
  plate: {
    src: "/images/survey-in-progress.jpeg",
    caption:
      "Survey in progress. Photograph held by the Foundation — collection, date and photographer to be confirmed before publication.",
  },
} as const;

export const ledger = {
  gutter: "Ledger",
  heading: "Conservation ledger",
  intro:
    "Every figure here carries an audited number and the period it covers, or it does not appear. The site this replaces displayed zeroes; nothing ships until the Foundation supplies the counts.",
  metrics: [
    { label: "Folios conserved", value: null, note: "Audited count with the period it covers." },
    { label: "Collections surveyed", value: null, note: "Custodian institutions, by state." },
    { label: "Sites active", value: null, note: "Projects with work recorded this quarter." },
    { label: "Folios digitised", value: null, note: "Masters captured and checksummed." },
  ] as { label: string; value: Pending<string>; note: string }[],
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
  heading: "Sites under conservation",
  items: [
    {
      name: "Kumbhoj",
      place: "Kolhapur district, Maharashtra",
      status: "Completed",
      image: "/images/sites/kumbhoj.png",
      /** Stage counts stay null until the project manager enters them. */
      stages: {} as Record<string, Pending<number>>,
      footnote: "Closing report to be republished as a web document.",
    },
    {
      name: "Karanja",
      place: "Washim district, Maharashtra",
      status: "Ongoing",
      image: "/images/sites/karanja.png",
      stages: {} as Record<string, Pending<number>>,
      footnote: "Stage counts to be entered by the project manager.",
    },
    {
      name: "Shravanabelagola",
      place: "Hassan district, Karnataka",
      status: "Commenced July 2025",
      image: "/images/sites/shravanabelagola.jpeg",
      stages: {} as Record<string, Pending<number>>,
      footnote: "Survey underway; first dispatch published 28 July 2025.",
    },
  ],
} as const;

export const film = {
  gutter: "Film",
  heading: "The work, filmed",
  body: "The Foundation's own film on the tadpatra mission. It plays from the Foundation's channel; a captioned Hindi and Kannada cut belongs in the library alongside it.",
  note: "Source: the Foundation's existing film — to be re-uploaded under the Foundation's own channel and licence.",
  /** No embed until the Foundation supplies a URL on its own channel. */
  embedUrl: null as Pending<string>,
} as const;

export const plates = {
  gutter: "Plates",
  heading: "Plates from the programme",
  intro:
    "These are the Foundation's own images, carried over from the current site at web resolution. Archival masters must replace them: originals at full resolution, with photographer credit, date and custodian permission recorded.",
  caption: "Programme plate — subject, site and date to be recorded.",
  items: [
    { src: "/images/plates/plate-01.png" },
    { src: "/images/plates/plate-02.png" },
    { src: "/images/plates/plate-03.png" },
  ],
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
    "The Foundation upholds the tradition re-established by Acharya Shri 108 Shanti Sagar Ji Maharaj, the first Acharya of the twentieth-century Digambar revival. It carries the vision of Swasti Shri Charukirti Bhattarak Swamiji and the blessings of Acharya Shri 108 Vardhman Sagar Ji Maharaj.",
    "India Post issued a ₹5 commemorative stamp and first-day cover in his honour. The centenaries of his Muni Deeksha and of his Acharya Pad Pratishthapana are the occasion for the current programme.",
  ],
  note: "The current site carries two conflicting dates for the stamp release. The date is left out here until the Foundation confirms it.",
  plate: {
    src: "/images/stamp-first-day-cover.jpeg",
    caption:
      "Release of the India Post ₹5 commemorative stamp and first-day cover. Date to be confirmed.",
  },
} as const;

export const board = {
  gutter: "Board",
  heading: "The board, and the ranks it carries",
  intro:
    "The trustees hold Sanskrit honorific ranks — Param Shiromani, Param Sanrakshak, Vaibhav, Udiyman, Udbhav. The same ladder is reused as the giving ranks above; it is the Foundation's own language, not a bronze-silver-gold invention.",
  members: [
    {
      name: "Shri Ashok Patni",
      rank: "Settlor · Param Shiromani",
      affiliation: "Chairman Emeritus, R.K. Group; R.K. Marble; Wonder Cement",
      image: "/images/board/ashok-patni.jpeg",
    },
    {
      name: "Dr. D. Veerendra Heggade",
      rank: "Param Sanrakshak Margadarshak",
      affiliation:
        "Dharmadhikari of Dharmasthala; Member of Parliament, Rajya Sabha; Karnataka Ratna",
      image: "/images/board/veerendra-heggade.jpeg",
    },
    {
      name: "Shri Rajendra Kumar Kataria",
      rank: "Param Shiromani",
      affiliation: "Kataria Automobiles, Gujarat",
      image: "/images/board/rajendra-kumar-kataria.png",
    },
    {
      name: "Shri Anil Kumar Sethi",
      rank: "President · Param Sanrakshak",
      affiliation: "Chairman, ADD Group; SPML Infra; Pump Academy",
      image: "/images/board/anil-kumar-sethi.jpeg",
    },
    {
      name: "Shri Suresh Sablawat",
      rank: "Param Sanrakshak",
      affiliation: "Readiprint International; Shri Mahaveerji; Shantiveer Digambar Jain Sansthan",
      image: "/images/board/suresh-sablawat.png",
    },
    {
      name: "Shri Vinod Surendra Doddanavar",
      rank: "Udiyman",
      affiliation: "Secretary, Bharatesh Education Trust; Convener, INTACH Belagavi",
      image: "/images/board/vinod-surendra-doddanavar.jpeg",
    },
    {
      name: "Shri Rakesh Kumar Jain",
      rank: "Vaibhav",
      affiliation: "General Secretary, ASF; FCA, FCS, Insolvency Professional",
      image: "/images/board/rakesh-kumar-jain.jpeg",
    },
    {
      name: "Shri Ashok Kumar Jain",
      rank: "Udbhav",
      affiliation: "Shri Bharatvarshiya Digambar Jain (T.S.) Mahasabha, Delhi",
      image: "/images/board/ashok-kumar-jain.png",
    },
    {
      name: "Prof. Devagonda Appa Patil",
      rank: "Udbhav",
      affiliation: "Maharashtra Jain Sahitya Parishad; Dakshin Bharat Jain Sabha",
      image: "/images/board/devagonda-appa-patil.png",
    },
  ],
  note: "The current site publishes this trustee's biography under the name Shri Ashok Kumar Sethi while the card reads Shri Ashok Kumar Jain. Flagged for the Foundation to resolve; not silently guessed.",
} as const;

export const field = {
  gutter: "From the field",
  heading: "From the field",
  items: [
    {
      meta: "28 July 2025 · Shravanabelagola",
      title:
        "श्रवणबेलगोला में अति प्राचीन ताड़ पत्र व हस्त लिखित शास्त्रों के संरक्षण एवं संवर्धन का कार्य प्रारंभ।",
      body: "Conservation and digitisation of ancient tadpatra and handwritten scriptures begins at Shravanabelagola, under the Acharya Pad Pratishthapana centenary programme.",
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
      body: "Release of the ₹5 commemorative stamp and first-day cover for Acharya Shri Shanti Sagar Ji. The current site carries two conflicting dates.",
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
  body: "Recognised by the National Mission for Manuscripts for folio conservation. Monthly and annual reporting; audited financials.",
  badges: [
    { label: "National Mission for Manuscripts", state: "recognised" as const },
    { label: "NMM sanction ₹12 lakh", state: "verify" as const, note: "sanction year to verify" },
    { label: "12A / 80G", state: "pending" as const },
    { label: "CSR-1", state: "pending" as const },
    { label: "NGO Darpan", state: "pending" as const },
    { label: "FCRA", state: "pending" as const },
    { label: "Audited financials", state: "pending" as const },
  ] as { label: string; state: "recognised" | "verify" | "pending"; note?: string }[],
  note: "The pending items are what a serious donor and a CSR officer check before giving. They are blockers, not decoration: each is a document the Foundation holds and must supply before launch. The NMM figure of ₹12 lakh appears on the current site without a sanction year and is not published here until it is sourced.",
} as const;
