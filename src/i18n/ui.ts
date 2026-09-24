/**
 * Interface words — every string that is not the Foundation's content but
 * the site's own: labels, captions, table headers, the assistant's chrome.
 * English is the source; `hi.ts` and `kn.ts` translate the same keys.
 */
export const ui = {
  edition: {
    /** Shown on translated editions only. */
    note: "",
    original: "",
  },
  header: {
    language: "Language",
    cleanFolio: "Clean the folio",
    cleanShort: "Clean",
    ask: "Ask",
    askSr: "— open the Foundation's AI assistant",
    home: "home",
    homeLink: "Home",
    primary: "Primary",
    contents: "Contents",
    closeMenu: "Close menu",
    join: "Join the work",
  },
  footer: {
    colophon: "Colophon",
    registered: "Registered trust, Bengaluru",
    contact: "Contact",
    office: "Registered office",
    support: "Support the work",
    bank: "Bank",
    account: "Account",
    ifsc: "IFSC",
    nav: "Footer",
    home: "Home",
    /** The colophon names its scribe, as a manuscript's does (लिखितं, "written by"). */
    scribedBy: "scribed by",
    scribeTitle: "Sahajta AI — designed and built this site",
  },
  common: {
    awaiting: "awaiting Foundation",
    notPublished: "Not yet published",
    editorialNote: "Editorial note",
    variantReading: "Variant reading",
    dateToVerify: "date to verify",
    explore: "Explore {name}",
    sameScale: "Each line is drawn to the same scale.",
    watchWithSound: "Watch with sound",
  },
  sites: {
    timeline: "Timeline of conservation projects",
    startAwaiting: "start date awaiting Foundation",
    startNotSupplied: "start date not yet supplied",
    from: "from",
    to: "to",
    completed: "completed",
    ongoing: "ongoing",
    status: { Completed: "Completed", Ongoing: "Ongoing" },
    manuscripts: "Manuscripts",
    folios: "Folios",
  },
  home: {
    reel: {
      label: "What the Foundation does",
      pause: "Pause",
      play: "Play",
      previous: "Previous",
      next: "Next",
      show: "Show {name}",
      position: "{n} of {total}",
    },
    spreadLabel: "Rural · Community",
    standingHeading: "Standing",
    standingStates: { recognised: "recognised", verify: "to verify", pending: "pending" },
    bundleLabel: "Folio bundle — {filled} of {total} leaves adopted",
    bundleAria: "Folio bundle: {filled} of {total} leaves funded. It stays blank until real folio records exist.",
  },
  about: {
    heroLabel: "About",
    pillarsLabel: "Three pillars",
    pillarsHeading: "How the mission takes shape",
    alsoRecorded: "Also recorded, not counted",
    tableCaption: "Survey of manuscript repositories, by state",
    measure: "Measure",
    foliosBySurvey: "Folios documented by survey",
  },
  conservation: {
    heroLabel: "Conservation",
    documentationCaption:
      "Documentation comes first: this manuscript was recorded as KBJ/PM/047, and photographed, before treatment.",
    joinLink: "Ways to join the work",
    recognition: "Recognition",
  },
  rural: {
    heroLabel: "Rural infrastructure",
    heroAlt:
      "The completed Samudaya Bhavan at Yarnal: long, whitewashed wings with blue railings around a paved courtyard.",
    heroCaption: "The completed Samudaya Bhavan, Yarnal.",
    stambhAlt:
      "Drawing of the Shanti Stambh: a pillar on a stepped base, a standing figure within its upper frame, a wheel at the top.",
  },
  community: {
    heroLabel: "Community services",
    also: "Also",
    campsCaption: "Free medical camps",
    camp: "Camp",
    beneficiaries: "Beneficiaries",
    specialties: "Specialties and outcomes",
    educationCaption: "Education support near Yarnal.",
  },
  impact: {
    heroLabel: "Impact",
    streamsLabel: "Three streams",
    fullPicture: "See the full picture",
  },
  trustees: {
    heroLabel: "Leadership",
    trusteesLabel: "Trustees",
    trusteesHeading: "Founder trustees",
    intro:
      "{total} founder trustees. {named} carry a named role — Param Samrakshak Margadarshak, Settlor, President, Working President and Secretary — and {founders} serve as founder trustees.",
    advisorsLabel: "Advisors",
    advisorsHeading: "Advisors",
  },
  meta: {
    home: "Acharya Shanti Sagar Foundation — जीवन धरोहर संरक्षण",
    homeDescription:
      "The Acharya Shanti Sagar Foundation conserves tadpatra — palm-leaf folios carrying Jain scripture, Ayurvedic texts, grammars and commentaries. Conservation is free to the custodian and the manuscripts never leave their premises.",
    suffix: "Acharya Shanti Sagar Foundation",
    about: "About Us",
    conservation: "Manuscript Conservation",
    rural: "Rural Infrastructure",
    community: "Community Services",
    impact: "Impact",
    trustees: "Trustees",
  },
  chat: {
    greeting:
      "I'm the Foundation's AI assistant. I answer from its published pages — on manuscript conservation, rural infrastructure and community services, or about Acharya Shri Shantisagar Ji himself. What would you like to know?",
    starters: [
      "What does ASSF do?",
      "How can I support the work?",
      "Tell me about Acharya Shantisagar Ji",
      "How do I get manuscripts surveyed?",
    ],
    teaser: "A question about the Foundation's work? Ask our",
    teaserAssistant: "AI assistant",
    teaserStart: "Start a conversation",
    dismiss: "Dismiss",
    title: "Ask the Foundation",
    subtitle: "AI assistant · answers from its published pages",
    reset: "Start a new conversation",
    close: "Close",
    closeChat: "Close the AI assistant",
    openChat: "Ask the Foundation's AI assistant",
    ask: "Ask",
    placeholder: "Ask about the Foundation's work…",
    message: "Message",
    send: "Send message",
    disclaimer: "Drawn from the Foundation's published work; may be incomplete.",
    typing: "Assistant is typing",
    reading: "Reading the Foundation's pages…",
    unavailable: "The assistant is temporarily unavailable. Please try again shortly.",
    failed: "Something went wrong. Please try again, or reach us at",
  },
};

export type UI = typeof ui;

/** Fill "{name}" slots in an interface string. */
export function fill(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => String(values[key] ?? `{${key}}`));
}
