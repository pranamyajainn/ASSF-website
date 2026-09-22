/**
 * About page copy — philosophy, mission/vision/values and the statewide
 * survey that sets the scale of the work ahead. Sourced from the
 * Foundation's "About Us" and "Mission, Vision & Values" documents (Sept
 * 2026); the survey scale uses the About Us / Homepage figures, per the
 * Foundation's confirmation that those are the ones to publish.
 */
export const pageHero = {
  eyebrow: "About the Foundation",
  title: "Guarding what is ancient, serving what is present",
  body: "Acharya Shanti Sagar Foundation is a non-profit trust, established in 2019, working across manuscript conservation, rural infrastructure and community services — heritage and humanity, treated as one commitment.",
} as const;

export const philosophy = {
  gutter: "Philosophy",
  heading: "Heritage and humanity, bound together",
  paragraphs: [
    "Preserving an ancient manuscript protects knowledge carried across generations. Strengthening a rural community helps create the conditions in which people can live, learn and grow with dignity. For the Foundation, these are not two missions — they are one.",
  ],
  quote: {
    deva: "“Parasparopagraho Jivanam”",
    translation: "All life is bound together in mutual support.",
  },
} as const;

export const mvv = {
  gutter: "What Guides Us",
  heading: "Mission, vision and values",
  mission: {
    label: "Mission",
    body: "To guard what is ancient, serve what is present, and build what is needed.",
  },
  vision: {
    label: "Vision",
    body: "A society that cares for its knowledge, its institutions and its people — where preservation and service are treated as the same responsibility.",
  },
  values: [
    { name: "Ahimsa", meaning: "Non-violence", body: "Every programme begins with the same question: does this cause harm?" },
    { name: "Satya", meaning: "Truth", body: "Knowledge is preserved without distortion, and figures are published only once they are audited." },
    { name: "Aparigraha", meaning: "Responsible restraint", body: "Resources entrusted to the Foundation flow directly to conservation and community work." },
    { name: "Anekantavada", meaning: "Many-sided truth", body: "Custodians, communities and institutions are engaged with humility, across sects, regions and backgrounds." },
    { name: "Karuna & Seva", meaning: "Compassion and service", body: "Serving the present is how the Foundation earns the trust that makes preservation possible." },
  ],
} as const;

export const scale = {
  gutter: "The Scale Ahead",
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
  note: "These collections are held by temples, maths and traditional institutions that have safeguarded them for generations. A further 49 copper-plate records (Moodbidri), 28 archival books (Karanja Lad) and 125 printed books (Nandani) were recorded separately, as they are not manuscripts.",
} as const;
