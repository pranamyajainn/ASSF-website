/**
 * Homepage copy and data.
 *
 * Sourced from the Foundation's own "About Us", "Final Homepage Content",
 * "Impact", "Mission, Vision & Values" and "Community Services" documents
 * (Sept 2026) — see docs/ASSF Website context/. Figures are the ones those
 * documents state; anything they don't supply stays `Pending` rather than
 * guessed. Known source discrepancies are flagged in place with
 * `EditorialNote` rather than silently resolved. Answers the Foundation gave
 * in Sept 2026 (prices, donor acknowledgement, institution names, on-site
 * labs) are applied where they belong.
 */
import { org, type Pending } from "./shared";

/**
 * The first leaf: the Foundation's headline, then six banners, each one part
 * of the work in a line a visitor reads in a few seconds, over one main
 * photograph and a small inset (Foundation's page designs, Nov 2026). Every
 * banner carries its own words, figures, link and photographs, so each is
 * edited in one place.
 */
export const hero = {
  label: "The Foundation",
  lines: [{ text: "Preserving Wisdom." }, { text: "Serving People." }, { text: "Building for the Future." }],
  body: "Inspired by Pratham Acharya Shri Shanti Sagar Ji Maharaj, Acharya Shanti Sagar Foundation began in Bengaluru in 2019 to serve in the same spirit of compassion. From free health camps in Karnataka's villages, to community halls built at a village's request, to laboratories where fragile palm leaves are made whole again, our work has one aim: to leave every community stronger, and its heritage safer, for the generations to come.",
  registration: "Registered charitable trust, Bengaluru · NGO DARPAN KA/2021/0292288",
  primary: { label: "Explore our work", href: "#pillars" },
  secondary: { label: "Support the mission", href: "/donate" },
  banners: [
    {
      key: "community",
      tab: "Community",
      eyebrow: "Serving People",
      title: "Free care for families",
      em: "who need it most.",
      body: "Free health camps with specialist doctors, and books and stationery for schoolchildren in the villages around Yarnal.",
      fact: "3,500+ people cared for at five free health camps · About 500 students given books and stationery",
      link: { label: "See community services", href: "/community-services" },
      images: [
        { src: "/images/pages/home/education.jpg", alt: "ASSF team handing books and stationery to schoolchildren near Yarnal", caption: "Books for schools near Yarnal" },
        { src: "/images/pages/home/camp-banner.jpg", alt: "ASSF volunteers and medical students at a free health camp in Belagavi district", caption: "" },
      ],
    },
    {
      key: "rural",
      tab: "Villages",
      eyebrow: "Building for the Future",
      title: "Spaces built for",
      em: "what villages need.",
      body: "A community hall, a resting space for rural teachers and clean public sanitation, each planned with the people who will use it.",
      fact: "Samudaya Bhavan, Yarnal · a 14-room resting space for teachers at Hosur",
      link: { label: "See rural infrastructure", href: "/rural-infrastructure" },
      images: [
        { src: "/images/pages/home/hero-infrastructure.jpg", alt: "Samudaya Bhavan, Yarnal", caption: "Samudaya Bhavan, Yarnal" },
        { src: "/images/pages/home/yarnal-build.jpg", alt: "The Bhavan under construction", caption: "" },
      ],
    },
    {
      key: "conservation",
      tab: "Manuscripts",
      eyebrow: "Preserving Wisdom",
      title: "Centuries of learning,",
      em: "safe for centuries more.",
      body: "We set up a laboratory beside each collection and conserve every folio by hand, so the manuscripts stay with their custodians.",
      fact: "2,49,896 folios conserved at Kumbhoj, Karanja Lad and Shravanabelagola",
      link: { label: "How a manuscript is conserved", href: "/manuscript-conservation#process" },
      images: [
        { src: "/images/pages/home/hero-conservation.jpg", alt: "Mending a palm leaf, Shravanabelagola", caption: "Mending a palm leaf, Shravanabelagola" },
        { src: "/images/pages/home/sbg-granthas.jpg", alt: "Granthas laid out for assessment", caption: "" },
      ],
    },
    {
      key: "empowerment",
      tab: "Empowerment",
      eyebrow: "Empowerment",
      title: "Helping families",
      em: "stand strong again.",
      body: "Relief for families through the 2019 floods and the 2020 lockdown, reaching their doorsteps when they needed it most.",
      fact: "262 families helped to rebuild after the floods · 2,795 grain kits shared in the lockdown",
      link: { label: "How we support families", href: "/community-services#relief" },
      images: [
        { src: "/images/pages/home/relief-1.jpg", alt: "An ASSF volunteer handing food to a woman during the 2020 lockdown in Bengaluru", caption: "Lockdown relief, Bengaluru, 2020" },
        { src: "/images/pages/home/relief-3.jpg", alt: "Relief reaching a family in need during the lockdown", caption: "" },
      ],
    },
    {
      key: "swavalamban",
      tab: "Swavalamban",
      eyebrow: "Launching soon · Swavalamban Yojana",
      title: "Helping families",
      em: "stand on their own feet.",
      body: "Our coming scheme for members of the Jain community who need a helping hand: skills and small-business support for women and men, and education loans for deserving students.",
      fact: "For women · For men · For students",
      link: { label: "Discover Swavalamban Yojana", href: "/swavalamban-yojana" },
      images: [
        { src: "/images/pages/home/swavalamban-art.jpg", alt: "Illustration of one large lamp lighting many small lamps, with the words Swavalamban Yojana", caption: "" },
        { src: "/images/pages/home/swavalamban-icons.jpg", alt: "Illustrations for skills, livelihood and education", caption: "" },
      ],
    },
    {
      // The Foundation's own campaign card ("One life, one page"). The price is given once, in shared.ts.
      key: "campaign",
      tab: "One Life, One Page",
      eyebrow: "Jain Tadpatra Restoration Mission",
      title: "One life,",
      em: "one page.",
      body: "Conserving one folio costs ₹{folioPrice}. Each page you restore keeps a piece of written knowledge alive for the generations after us.",
      fact: "₹{folioPrice} a page · ₹{granthaPrice} for a whole grantha of about 100 folios",
      link: { label: "Restore a page", href: "/donate?pages=1" },
      images: [
        { src: "/images/pages/home/folio-after.jpg", alt: "A folio after joining and mending", caption: "A folio after joining and mending" },
        { src: "/images/pages/home/paper-conserved.jpg", alt: "A conserved manuscript in its wrapper", caption: "" },
      ],
    },
  ],
} as const;

/**
 * Mission, vision and the five values, second on the home page, in the
 * Foundation's words (page designs, Nov 2026). The five values are tiles;
 * the fifth spans the row.
 */
export const purpose = {
  label: "Mission and vision",
  heading: "What guides us",
  mission: {
    label: "Our mission",
    body: "To preserve the wisdom of the past, serve the people of the present, and build for the future.",
  },
  vision: {
    label: "Our vision",
    body: "A future in which India's handwritten heritage is safe, read and alive, and the communities who hold it thrive.",
  },
  valuesLabel: "Our values",
  values: [
    { deva: "अहिंसा", name: "Ahimsa", body: "We touch every life, and every fragile leaf, with care that does no harm." },
    { deva: "सत्य", name: "Satya", body: "Honest work, accurate records and open accounts." },
    { deva: "अपरिग्रह", name: "Aparigraha", body: "We use only what the work needs, and pass the rest forward." },
    { deva: "अनेकान्तवाद", name: "Anekantavada", body: "We listen to custodians, scholars and communities before we act." },
    { deva: "करुणा एवं सेवा", name: "Karuna and Seva", body: "Compassion that becomes action, in a laboratory, a health camp or a village hall." },
  ],
  link: { label: "Read our story", href: "/about" },
} as const;

export const mission = {
  label: "Why it cannot wait",
  // The collections are palm leaf and handmade paper. The completed projects
  // were mostly paper; most of what the survey found still waiting is palm
  // leaf ("Impact" and "Mission, Vision & Values" documents).
  heading: "Palm leaf and paper do not wait",
  lede: "Manuscripts do not announce when they are dying. The deterioration is quiet — a crack in a palm leaf, a folio that crumbles at the edge, ink that fades to nothing over a season.",
  paragraphs: [
    "The collections the Foundation cares for are written on two materials. A tadpatra is a palm leaf, incised with a stylus and inked; it grows brittle, cracks and splits. Handmade paper tears, stains and weakens, often unevenly from one folio to the next. Most of what has been conserved so far was paper; most of what the survey found still waiting is palm leaf.",
  ],
  /** How the work is done, in three steps — simpler than a paragraph. */
  steps: [
    { title: "Survey", body: "Collections in bhandars, mandirs, mathas and institutions are visited and recorded." },
    { title: "Treat", body: "Folio by folio, in a conservation lab set up at the custodian's own location." },
    { title: "Digitise", body: "A digital record, so the original need not be handled again." },
  ],
  note: "The Foundation puts all its resources to work to save the ancient knowledge kept in mathas and libraries.",
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

/** The three pillars: a line on how they belong together, then one card each (page designs, Nov 2026). */
export const pillarsIntro = {
  label: "What we do",
  heading: "Three pillars, one purpose",
  body: "For us, compassion takes three forms. We keep alive the wisdom our ancestors wrote by hand, we stand beside families when they need it most, and we build the spaces villages ask for. Each one makes the others stronger.",
  principal: "Today, manuscript conservation is the Foundation's principal programme.",
  cards: [
    {
      label: "Manuscript Conservation",
      title: "Keeping Ancient Wisdom Alive",
      body: "Palm leaves and handwritten pages carry centuries of thought, art and science. Our conservators clean, mend and record every folio by hand, so this wisdom reaches the generations to come.",
      fact: "2,49,896 folios conserved at Kumbhoj, Karanja Lad and Shravanabelagola",
      link: { label: "Explore Manuscript Conservation", href: "/manuscript-conservation" },
      image: {
        src: "/images/pages/home/folio-before-after.jpg",
        alt: "Palm-leaf manuscript PL/244 at Shravanabelagola: broken leaves before treatment, and the same leaves mended onto supporting strips after",
      },
    },
    {
      label: "Community Services",
      title: "Standing With Families When It Matters Most",
      body: "When illness, floods or a pandemic strike, we arrive with doctors, food and care. From free medical camps to meals shared at the doorstep, every family is served with dignity.",
      fact: "3,500+ people at five free health camps · 7,77,534 meals shared in 2020",
      link: { label: "Explore Community Services", href: "/community-services" },
      image: { src: "/images/pages/home/relief-2.jpg", alt: "ASSF volunteers handing a meal packet to a woman at her doorstep during the 2020 lockdown" },
    },
    {
      label: "Rural Infrastructure",
      title: "Building What Villages Ask For",
      body: "A hall where a whole village can gather. A place where teachers can rest. Clean, safe sanitation. Spaces built with the community, to serve for generations.",
      fact: "Samudaya Bhavan at Yarnal · a 14-room resting space for teachers at Hosur",
      link: { label: "Explore Rural Infrastructure", href: "/rural-infrastructure" },
      image: { src: "/images/pages/home/sanitation-1.jpg", alt: "The public sanitation block at Yarnal, built with the Zilla Panchayat" },
    },
  ],
} as const;

export const ledger = {
  label: "Ledger",
  heading: "Our work so far",
  intro:
    "Counts from the Foundation's two completed conservation projects and its survey of 18 repositories. Where a figure has not been supplied, the space is left open — not estimated.",
  /** The manuscript figures as the Foundation first published them; the
      trustee portal, the conservation page and the assistant read these. */
  metrics: [
    { label: "Manuscripts conserved", value: "1,620+", note: "Kumbhoj 1,399 · Karanja Lad 221 — two completed projects." },
    { label: "Folios conserved", value: "1,34,545+", note: "Kumbhoj 1,06,277 · Karanja Lad 28,268 — assessed, treated and rehoused folio by folio." },
    { label: "Repositories surveyed", value: "18", note: "Karnataka 3 · Maharashtra 6 · Tamil Nadu 9." },
    { label: "Folios documented by survey", value: "17,14,928", note: "In 12,681 manuscripts — the measure of what remains to be protected." },
  ] as { label: string; value: Pending<string>; note: string }[],
  /**
   * Eight figures in two rows of four, each with its own drawing, after the
   * layout Alka sent on 26 Oct 2026: the manuscript work and the meals
   * first, then health, education and the spaces built. Every figure is the
   * one the pillar pages and Impact already give.
   */
  figures: [
    { icon: "folios", label: "Folios conserved, completed projects", value: "1,34,545+", note: "Kumbhoj 1,06,277 · Karanja Lad 28,268" },
    { icon: "manuscripts", label: "Manuscripts conserved, completed projects", value: "1,620+", note: "Kumbhoj 1,399 · Karanja Lad 221" },
    { icon: "repositories", label: "Repositories surveyed", value: "18", note: "Karnataka 3 · Maharashtra 6 · Tamil Nadu 9" },
    { icon: "meals", label: "Meals served, COVID-19 response", value: "7,77,534", note: "Bengaluru, 1 April – 3 May 2020" },
    { icon: "health", label: "People screened at free health camps", value: "3,500+", note: "5 camps across Bengaluru, Mandya, Raichur and Belagavi" },
    { icon: "education", label: "Children given education support", value: "500+", note: "Over six years, including books and stationery in 3 Yarnal schools" },
    { icon: "hall", label: "Community spaces built or renovated", value: "3", note: "Samudaya Bhavan and community hall, Yarnal; staff quarters, Hosur" },
    { icon: "quarters", label: "Rooms of staff quarters", value: "14", note: "For teachers serving two schools at Hosur, with over 400 students" },
  ] as { icon: "folios" | "manuscripts" | "repositories" | "meals" | "health" | "education" | "hall" | "quarters"; label: string; value: Pending<string>; note: string }[],
  /** The survey, as the line the figures stand on: what remains. */
  survey: { value: "17,14,928 folios", text: "in 12,681 manuscripts, documented by our survey, mark the work ahead." },
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
    { label: "Healthcare", value: "3,500+", note: "Screened at free medical camps, with 250+ cataract surgeries and 5 heart bypasses." },
    { label: "Education support", value: "c. 500", note: "Students given books and stationery, across three schools near Yarnal." },
    { label: "Emergency relief", value: "7,77,534", note: "Meals in Bengaluru's 2020 COVID-19 response; flood relief for 262 families in 2019." },
  ],
  plate: {
    src: "/images/community/students-rural-health-centre.jpg",
    alt: "A long line of students and health workers, most in white coats, standing on open ground outside a rural health centre.",
    caption: "Students at a rural health centre.",
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
  /** A photograph for the section (Website Changes sheet, row 19). */
  plate: {
    src: "/images/work/karanja-visitors.jpg",
    alt: "Three men examining handwritten folios spread on a table beside a camera.",
    caption: "Visitors examining folios at Karanja Lad.",
  },
  body: [
    "Preserving knowledge and serving communities are long-term responsibilities. They require people, expertise, institutions, resources and partnerships.",
    "Whether through support, institutional collaboration, professional expertise or participation, there are many ways to contribute to work that protects heritage and creates lasting value for communities.",
  ],
  ways: [
    {
      title: "Hold manuscripts?",
      body: "Ask for a survey of your collection. For a collection of around 1,000 shastras, the conservation lab is set up at your own premises.",
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
      link: { label: "Restore a folio", href: "/donate" },
    },
  ],
} as const;

export const adopt = {
  heading: "Adopting a folio",
  // {folioPrice} and {granthaPrice} are filled in from shared.ts (and the site editor's Prices).
  body: "Conserving one folio costs ₹{folioPrice}; each donor receives a donation receipt and a letter of thanks. Fund a whole grantha — about 100 folios, ₹{granthaPrice} — and your name is written on the cloth it is wrapped in.",
  link: { label: "Bank transfer details", href: "#give" },
  /** Online giving, through the Foundation's Apna Dharm account (see views/donate.tsx). */
  give: { label: "Give online", href: "/donate" },
  wall: {
    /** Leaves stay blank until real folio records exist. */
    filled: 0,
    note: "A whole grantha's donor is named on the cloth that wraps it.",
    /** Written on the wrapping cloth in the drawing — where a donor's name goes. */
    clothLabel: "your name",
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
 * Foundation's visitors' book, supplied by the Foundation (Sept 2026),
 * transcribed word for word. Photographs of the handwritten pages were
 * supplied too but are not published: one carries an official's signature,
 * and publishing the pages needs the Foundation's explicit consent. Add a
 * `facsimile` to an entry once it is given. A voice with `quote: null`
 * renders as a lacuna, for places reserved but not yet filled.
 */
/** A recorded voice: the words as spoken, never tidied, with captions. */
export type HeardVoice = {
  key: string;
  kind: string;
  name: Pending<string>;
  role?: string;
  /** Language the speaker uses; the quote and transcript are in it. */
  lang: "hi";
  /** A line lifted from the recording, verbatim. */
  quote: string;
  translation: string;
  transcript: string;
  transcriptTranslation: string;
  video: { src: string; poster: string; width: number; height: number; duration: string; captions: string };
};

export const voices = {
  label: "Voices",
  heading: "Voices from the work",
  lede: "The impact of this work is best understood through the people and institutions who experience it directly.",
  pendingNote: "testimonial awaiting Foundation",
  translationLabel: "Translation",
  zoomLabel: "Open the handwritten page at full size",
  sourceNote: "From the Foundation's visitors' book, transcribed as written.",
  /**
   * Spoken appreciation, recorded at Karanja Lad and supplied by the
   * Foundation (Sept 2026). Quotes and transcripts are the words as spoken,
   * transcribed from the recordings; "[…]" marks a word that could not be
   * made out, rather than a guess. Captions for each recording are WebVTT
   * files beside the video, in Hindi, English and Kannada.
   */
  heard: {
    native: "श्रुत",
    label: "Heard",
    note: "Recorded at Karanja Lad, where the Foundation's conservation work is under way.",
    listen: "Listen",
    transcriptLabel: "Read the whole recording",
    transcriptNote: "Transcribed from the recording and translated. […] marks a word that could not be made out.",
    nameAwaited: "name awaiting the Foundation",
    items: [
      {
        key: "maharaj-ji",
        kind: "A blessing, recorded at Karanja",
        name: "Muni Shri 108 Subrat Sagar Ji Maharaj",
        role: "At Shri Mahaveer Brahmacharyashram Gurukul Ashram, Karanja Lad",
        lang: "hi",
        quote: "आप भी इस तरह के जीर्णोद्धार को कराएँ, जिससे ग्रंथ सैकड़ों साल के लिए पुनर्जीवित हो जाएँ।",
        translation: "Have this kind of restoration done too, so that the granthas come back to life for hundreds of years.",
        transcript: "जैन समाज की काशी — महाराष्ट्र का कारंजा नगर। समन्तभद्राचार्य द्वारा स्थापित महावीर दिगंबर जैन गुरुकुल। इसमें प्राचीन जैन साहित्य का जीर्णोद्धार, पुनर्लेखन, आलेखन, व्यवस्था करने का कार्य श्री शान्तिसागर फ़ाउंडेशन, बैंगलोर के द्वारा हो रहा है, जिसे हमारे मंत्रीवर […] जी, जो धन्यकुमार जी के सुपुत्र हैं, उन्होंने समग्र जीर्णोद्धार के कार्यों को दिखाया। देखकर बड़ी प्रसन्नता हुई। और मैं समग्र भारतवासी जैन समाज से एवं प्राचीन ग्रंथवानों से भाव रखता हूँ कि आप भी इस तरह के जीर्णोद्धार को कराएँ, जिससे ग्रंथ सैकड़ों साल के लिए पुनर्जीवित हो जाएँ और धर्म एवं संस्कृति का संरक्षण हो। इस हेतु सकल समाज एवं फ़ाउंडेशन के लिए मेरा बहुत-बहुत आशीर्वाद, आशीर्वाद।",
        transcriptTranslation: "Karanja, in Maharashtra — the Kashi of the Jain community. The Mahavir Digambar Jain Gurukul, founded by Acharya Samantabhadra. Here, the restoration of ancient Jain literature — its recopying, recording and ordering — is being done by the Shri Shanti Sagar Foundation, Bangalore. Our secretary, […] ji, son of Dhanyakumar ji, showed us all of the restoration work. Seeing it brought great joy. And to the Jain community across India, and to all who keep ancient granthas, I say: have this kind of restoration done too, so that the granthas come back to life for hundreds of years and our dharma and culture are preserved. For this, my many, many blessings to the whole community and to the Foundation.",
        video: { src: "/videos/voices/maharaj-ji.mp4", poster: "/videos/voices/maharaj-ji.jpg", width: 478, height: 850, duration: "1:24", captions: "/videos/voices/maharaj-ji" },
      },
      {
        key: "karanja-visit",
        kind: "To a visiting group, at Karanja",
        name: null,
        lang: "hi",
        quote: "एक-एक प्रोसेस इतना नियंत्रित तरीके से होता है… अब मैं जितना बोलूँ, उतना कम है।",
        translation: "Every single process is done in such a controlled way… however much I say, it falls short.",
        transcript: "तो कारंजा का कितना बड़ा महत्व है। और ये धरोहर — पाँच सौ, साढ़े पाँच सौ साल पुरानी धरोहर — आज जिस प्रकार सँभाल के रखना… और समय के साथ वो खंडित तो होती है। तो फिर उसको और आगे ले जाने के लिए ये टीम जूझ रही है, लगातार। ये जो अभी इस तरह से आप देख रहे हैं न, यह ऐसा नहीं होता है। आप यहाँ जब वो काम सारा चलता है, तब वो देखने जैसा है कि किस प्रकार वो एक-एक पत्र को […] सँभालते हैं, उसका कार्य करते हैं। […] इंक डाइल्यूट हो जाती है, तो उसके लिए प्रॉपर सॉल्यूशन बना के… एक-एक प्रोसेस इतना नियंत्रित तरीके से होता है, कि अगर ऐसे ही किया जाए, तो ये और छिन्न-भिन्न होके ख़राब हो जाएगा। और ये एक बार यहाँ से जो ग्रंथ पास होके जाता है, उसकी लाइफ़ और 100–150 साल बढ़ जाती है, क्योंकि उसके ऊपर लेमिनेशन होता है — आपको दिखेगा भी नहीं कि ये लेमिनेशन किया गया है। और सबसे बड़ी बात कि यह सारा प्रोसेस रिवर्सिबल है। कहीं भी कोई ऐसे केमिकल का यूज़ नहीं हुआ है कि वो उसको डैमेज करे, और […] ख़राब करे। कि आप उसको ओरिजिनल में ले जाना चाहते हो, तो आप उसको पूरा रिवर्सिबल कर सकते हो। इस प्रकार का सारा कार्य होता है। मतलब, अब मैं जितना बोलूँ, उतना कम है। आप एक-एक चीज़ में कितना समय देते हो, वही चीज़ बताती है — इसमें गर्व है, इन्वॉल्वमेंट है।",
        transcriptTranslation: "So — how great Karanja's importance is. And this heritage — five hundred, five hundred and fifty years old — keeping it safe the way it is today… and with time, it does break apart. So, to carry it further forward, this team is at it, without a break. What you're seeing now, like this — it isn't like this. When the work is going on here, that is worth seeing — how they handle each single leaf […], how they work on it. […] the ink has thinned, so they make up a proper solution for it… every single process is done in such a controlled way, because done any other way, it would come apart and be ruined. And once a grantha has passed through here, its life grows by another 100–150 years, because it is laminated — and you won't even see that it has been laminated. And the biggest thing: this whole process is reversible. Nowhere is any chemical used that would damage it, or […] ruin it. If you want to take it back to the original, you can reverse it completely. That is the kind of work done here. Honestly — however much I say, it falls short. How much time you give to every single thing says it all — there is pride in it, and involvement.",
        video: { src: "/videos/voices/karanja-visit.mp4", poster: "/videos/voices/karanja-visit.jpg", width: 1280, height: 720, duration: "1:46", captions: "/videos/voices/karanja-visit" },
      },
    ] as HeardVoice[],
  },
  written: { native: "लिखित", label: "Written" },
  items: [
    {
      kind: "From the visitors' book — Government of Maharashtra",
      quote:
        "The work of conservation and preservation of “Jinvani” is an excellent and priceless work. This work will definitely increase the life span of all texts which are rarely available. All the best for noble work.",
      name: "Dr. Jyotsna Padiyar, IAS",
      role: "Commissioner, Economics & Statistics, Planning Department, Government of Maharashtra",
      alongside: "Signed with Shri Krishna Phirke, Special Commissioner, and Amol Khandare, Additional Commissioner.",
    },
    {
      kind: "From the visitors' book — a visitor from Washim",
      quote:
        "Seeing the restoration work of more than 1000 granths of our Jainism, filled me with immense pride and happiness. It made me realize the greatness of our saints who worked hard for the betterment of society and spiritual upliftment. I am deeply grateful for the restoration team, the trust and everyone involved for their initiative and extremely happy for all the work that has been done and is still going on. Thank you for reviving the gems of Jainism.",
      name: "Rishabh Jitendra Chhabda",
      place: "Washim, Maharashtra",
    },
  ] as Voice[],
} as const;

/**
 * The work, up close: the Foundation's own photographs from its field
 * programmes, published on its earlier websites' galleries and captioned
 * only with where and when each was taken (the gallery it appeared in).
 */
export const upClose = {
  label: "Up close",
  heading: "The work, up close",
  lede: "Conservation happens at the custodian's side, in rooms full of visitors, munis and conservators. These are the Foundation's own photographs from Shravanabelagola, Karanja Lad and Kumbhoj.",
  items: [
    { src: "/images/work/bundles-red-cloth.jpg", ratio: "1600 / 1066", alt: "Palm-leaf bundles and cloth-wrapped manuscripts laid out in rows on red cloth.", caption: "Palm-leaf bundles and wrapped manuscripts laid out at the start of the Shravanabelagola programme, July 2025." },
    { src: "/images/work/mending-palm-leaf.jpg", ratio: "1333 / 1800", alt: "A man in a white shirt working on a palm leaf laid on a padded board.", caption: "Working on a palm leaf, Shravanabelagola workshop." },
    { src: "/images/work/munis-reading.jpg", ratio: "1429 / 1800", alt: "Three munis bending over an open paper manuscript in a tray.", caption: "Munis reading a paper manuscript at the Shravanabelagola inauguration." },
    { src: "/images/work/karanja-exhibition.jpg", ratio: "1600 / 1201", alt: "A building entrance under a maroon Foundation banner announcing an exhibition of palm-leaf and paper Jinvani.", caption: "The Foundation's exhibition of palm-leaf and paper Jinvani, Karanja Lad." },
    { src: "/images/work/workshop-table.jpg", ratio: "1600 / 1067", alt: "Conservators in white coats and visitors gathered around a table of palm leaves.", caption: "Conservators and visitors at the palm-leaf table, Shravanabelagola workshop." },
    { src: "/images/work/karanja-visitors.jpg", ratio: "1200 / 1520", alt: "Three men examining handwritten folios spread on a table beside a camera.", caption: "Visitors examining folios at Karanja Lad." },
    { src: "/images/work/kumbhoj-munis.jpg", ratio: "1600 / 1201", alt: "A large group of munis gathered close around a conservation table.", caption: "Munis visiting the conservation work at Kumbhoj." },
    { src: "/images/work/lab-rolls.jpg", ratio: "1351 / 1800", alt: "Rolls of paper laid on a blue cloth in a bright conservation room.", caption: "The conservation room at the Karanja Lad exhibition." },
  ],
} as const;

/**
 * Where the work is live now (Website Changes sheet, row 16): the two sites
 * where conservation is under way today, in the Foundation's own
 * photographs, each captioned only with where it was taken.
 */
export const liveSites = {
  label: "Live sites",
  heading: "Where the work is live now",
  lede: "Right now, in two laboratories, centuries of learning are being carefully handed forward. Each lab sits beside its collection, so the manuscripts heal in the care of the very people who have guarded them for generations.",
  status: "Live",
  sites: [
    {
      name: "Shravanabelagola",
      region: "Hassan district, Karnataka",
      institution: "Bahubali Prakrit Bhawan",
      since: "since 11 July 2025",
      body: "2,695 palm-leaf granthas holding 3,65,520 folios: one of the largest collections we have ever cared for. Every month, around 3,300 more folios are cleaned, mended and safely housed.",
      // The bar under the text: how far along, as two counts.
      progress: { done: 378, total: 2695, label: "378 granthas · 38,590 folios conserved, as of 30 September 2026" },
      photos: [
        { src: "/images/pages/home/lab-shravanabelagola.jpg", ratio: "4 / 3", alt: "The conservation laboratory at Bahubali Prakrit Bhawan", caption: "The laboratory at Bahubali Prakrit Bhawan." },
        { src: "/images/pages/home/swamiji-lab.jpg", ratio: "4 / 3", alt: "Revered visitors arriving at the Shravanabelagola laboratory", caption: "Revered visitors at the lab." },
      ],
    },
    {
      name: "Karanja Lad",
      region: "Washim district, Maharashtra",
      institution: "Shri Mahaveer Gurukul Ashram laboratory",
      since: "since October 2024",
      body: "Karanja Lad holds four historic manuscript repositories. Our laboratory has made two of them whole: the Gurukul Ashram, and the Balatkar Gan Mandir with its 940 manuscripts and 76,761 folios, where only its 30 large illustrated paintings are now receiving their final care. In October 2026, we signed an MoU to conserve the collection of the Sengan Temple.",
      progress: { done: 2, total: 4, label: "2 of 4 repositories completed · Sengan Temple next" },
      photos: [
        { src: "/images/pages/home/munis-lab.jpg", ratio: "4 / 3", alt: "Revered Munis observing treatment at the Karanja Lad laboratory", caption: "Revered Munis at the Karanja Lad lab." },
        { src: "/images/pages/home/paper-cleaning.jpg", ratio: "4 / 3", alt: "A conservator cleaning a paper folio", caption: "Cleaning a paper folio by hand." },
      ],
    },
  ],
  link: { label: "Follow every site", href: "/manuscript-conservation#sites" },
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
  /** Settled from the Foundation's own sources: the first-day cover's postmark (13-11-2024) and its news post of the release. */
  note: "",
  portrait: {
    src: "/images/lineage/acharya-shantisagar-1955.jpg",
    alt: "Black-and-white close-up of Acharya Shanti Sagar Ji Maharaj in old age.",
    caption: "Kunthalgiri, 1955, during his Sallekhana. Public domain, via Wikimedia Commons.",
  },
  plate: {
    src: "/images/stamp-first-day-cover.jpeg",
    alt: "India Post first-day cover bearing the ₹5 commemorative stamp for Acharya Shanti Sagar Ji Maharaj.",
    caption: "The India Post ₹5 commemorative stamp and first-day cover, released 13 November 2024.",
  },
} as const;

export const board = {
  label: "Board",
  heading: "Guided by trustees and advisors",
  intro:
    "Nine founder trustees and four advisors guide the Foundation's work.",
  members: [
    { name: "Rajashri Dharmadhikari Dr. D. Veerendra Heggade", rank: "Param Samrakshak, Margadarshak & Founder Trustee", affiliation: "Hereditary Dharmadhikari, Shri Kshetra Dharmasthala; Padma Vibhushan (2015); Member of Parliament, Rajya Sabha", image: "/images/trustees/oct26/veerendra-heggade.jpg" },
    { name: "Shri Ashok Patni", rank: "Settlor, Visionary & Founder Trustee", affiliation: "Chairman Emeritus, R.K. Group; R.K. Marble; Wonder Cement", image: "/images/trustees/oct26/ashok-patni.jpg" },
    { name: "Shri Rajendra Kumar Kataria", rank: "Working President & Founder Trustee", affiliation: "Kataria Automobiles, India's leading Maruti-Suzuki dealership", image: "/images/trustees/oct26/rajendra-kumar-kataria.jpg" },
    { name: "Shri Anil Kumar Sethi", rank: "President & Founder Trustee", affiliation: "Chairman, ADD Group; founder, Pump Academy and iPUMPNET", image: "/images/trustees/oct26/anil-kumar-sethi.jpg" },
    { name: "Shri Suresh Sablawat", rank: "Founder Trustee", affiliation: "Readiprint International", image: "/images/trustees/oct26/suresh-sablawat.jpg" },
    { name: "Shri Vinod Doddanavar", rank: "Founder Trustee", affiliation: "Secretary, Bharatesh Education Trust", image: "/images/trustees/oct26/vinod-doddanavar.jpg" },
    { name: "Shri Rakesh Kumar Jain", rank: "Secretary, Treasurer & Founder Trustee", affiliation: "FCA, FCS; National Secretary, Bahubali Mahamastakabhisheka 2018", image: "/images/trustees/oct26/rakesh-kumar-jain.jpg" },
    { name: "Shri Ashok Kumar Jain", rank: "Founder Trustee", affiliation: "Community and cultural-institution leadership", image: "/images/trustees/oct26/ashok-kumar-jain.jpg" },
    { name: "Prof. D. A. Appa Patil", rank: "Founder Trustee", affiliation: "Educationist, author and scholar of Jain philosophy, literature and spiritual heritage", image: "/images/trustees/oct26/appa-patil.jpg" },
  ],
  link: { label: "Meet all our trustees and advisors", href: "/our-guiding-lights" },
} as const;

/**
 * News and events: the latest, newest first ("Add a news update" adds here),
 * then a row from the Foundation's journey (page designs, Nov 2026). A card
 * shows its photograph, or a short video when `clip` holds a YouTube link
 * (or one of the site's own recordings in /videos) — the photograph is then
 * its cover. `title` is an optional headline, as the Foundation's own news
 * posts give it (often in Hindi).
 */
export const field = {
  label: "News and events",
  heading: "News and Events",
  lede: "Every season brings a new chapter. Here is the latest from our laboratories, our partners and our community.",
  link: { label: "See all news and events", href: "/gallery/photos" },
  latestLabel: "Latest",
  journeyLabel: "From our journey",
  items: [
    { date: "24 October 2026", place: "Karanja Lad", kind: "Event", title: "", body: "An MoU with the Sengan Temple opens the third of Karanja Lad's four historic collections to conservation, after the Gurukul Ashram and the Balatkar Gan Mandir.", image: { src: "/images/pages/home/team-karanja.jpg", alt: "The ASSF conservation team at Karanja Lad" }, clip: "", length: "1 min" },
    { date: "October 2026", place: "Bengaluru", kind: "", title: "", body: "Our plans to complete the Shravanabelagola collection, and to begin at Moodbidri and Karkala, are placed before the Government of Karnataka.", image: { src: "/images/pages/home/sbg-lab-visit.jpg", alt: "Guests examining a conserved scroll at Shravanabelagola" }, clip: "", length: "" },
    { date: "2 June 2026", place: "Shravanabelagola", kind: "", title: "", body: "An MOU with the Shravanabelagola Matha trust strengthens our shared care for 2,695 palm-leaf granthas.", image: { src: "/images/pages/home/palm-cleaning.jpg", alt: "A palm-leaf folio being cleaned at the laboratory" }, clip: "", length: "" },
    { date: "13 November 2024", place: "India Post", kind: "", title: "आचार्य श्री शांति सागर जी पर विशेष ₹5 डाक टिकट का शुभ विमोचन", body: "A commemorative stamp and first-day cover honour Acharya Shri Shanti Sagar Ji.", image: { src: "/images/pages/home/india-post-stamp.jpg", alt: "₹5 India Post commemorative stamp for Acharya Shri Shanti Sagar Ji" }, clip: "", length: "" },
  ],
  journey: [
    { date: "2019", place: "Belagavi, Mandya, Raichur, Bengaluru", kind: "", title: "", body: "Free health camps with specialist doctors cared for more than 3,500 people, with cataract surgeries, spectacles and medicines given free.", image: { src: "/images/pages/home/camp-banner.jpg", alt: "Volunteers and medical students at a free health camp in Belagavi district" }, clip: "", length: "" },
    { date: "April to May 2020", place: "Bengaluru", kind: "", title: "", body: "Alongside 15 fellow organisations, we shared 7,77,534 meal packets and 2,795 grain kits with families across the city.", image: { src: "/images/pages/home/relief-1.jpg", alt: "A volunteer handing a food packet to a woman during the lockdown" }, clip: "", length: "" },
    { date: "Yarnal", place: "Belagavi district", kind: "", title: "", body: "The Samudaya Bhavan, a community hall and dharamshala built at the request of the village, on land given by its own families.", image: { src: "/images/pages/home/hero-infrastructure.jpg", alt: "Samudaya Bhavan, Yarnal" }, clip: "", length: "" },
    { date: "Hosur", place: "Belagavi district", kind: "", title: "", body: "An old building turned into a 14-room resting space for the teachers of a rural school and training centre.", image: { src: "/images/pages/home/hosur-1.jpg", alt: "The teachers' resting space at Hosur" }, clip: "", length: "" },
  ],
} as const;

export const survey = {
  heading: "Do you hold palm-leaf or paper manuscripts?",
  body: "Bhandars, mandirs, mathas and families hold folios that are deteriorating now — the Foundation's own survey of Karnataka, Maharashtra and Tamil Nadu found far more than has yet been treated. Where a collection runs to around 1,000 shastras (70,000–1,00,000 pages), the conservation lab is set up at the custodian's own location, so the manuscripts never leave it. Send photographs from a phone, or call.",
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
