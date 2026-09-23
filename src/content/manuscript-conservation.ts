/**
 * Manuscript Conservation page copy. Methodology from "Waht we do —
 * Manuscript Conservation"; recognition line from About Us / Mission,
 * Vision & Values. Project figures and the survey scale live in
 * `content/home.ts` (`sites`, `ledger`) and are reused here rather than
 * duplicated.
 */
export const pageHero = {
  eyebrow: "Manuscript Conservation",
  title: "Preserving Knowledge Written by Hand",
  body: "Many manuscripts have survived for centuries, but age, insects and storage conditions are making them fragile faster than they can be studied. ASSF conserves, documents and digitises palm-leaf and handwritten-paper collections, folio by folio.",
  plate: {
    src: "/images/conservation/manuscript-detail.png",
    alt: "An opened volume of handwritten Devanagari paper folios, with ruled margins, red highlighting and folio numbers in the margin.",
    caption: "Handwritten paper folios: ruled margins, red highlighting, and the folio number written in the margin.",
  },
} as const;

export const whatWeConserve = {
  label: "What we conserve",
  heading: "Two materials, one urgency",
  items: [
    {
      name: "Palm-leaf manuscripts",
      body: "Text inscribed into prepared palm leaves and bound into units. Over time the leaf itself becomes brittle, cracks and splits — conservation has to work with, not against, that material.",
    },
    {
      name: "Handwritten paper manuscripts",
      body: "Handmade paper develops tears, folds, losses and staining, often unevenly across a single manuscript. Every folio starts with its own condition assessment.",
    },
  ],
  note: "Beyond scripture, these collections hold philosophy, mathematics, astronomy, medicine, grammar and literature — material records of an intellectual tradition, not only a religious one.",
  subjects: [
    "Philosophy & spiritual thought",
    "Mathematics & numeracy",
    "Astronomy & cosmology",
    "Medicine & health",
    "Literature & language",
    "History, art & illustrated traditions",
  ],
} as const;

export const process = {
  label: "How we conserve",
  heading: "From assessment to a durable record",
  intro: "No two manuscripts are alike — sometimes no two folios. Assessment decides the approach before anything is treated.",
  approaches: [
    { name: "Preventive conservation", body: "When the manuscript is sufficiently stable and the priority is to prevent or slow further deterioration." },
    { name: "Curative conservation", body: "When deterioration has already affected the manuscript and active intervention is required to stabilise, repair or strengthen it." },
  ],
  curativeLabel: "The curative process",
  steps: [
    { title: "Documentation", body: "Recording material, structure and condition before anything is touched." },
    { title: "Preparation", body: "Preliminary measures that make safe treatment possible." },
    { title: "Surface cleaning", body: "Removing accumulated dirt with methods suited to the material." },
    { title: "Treatment", body: "Deacidification and chemical stabilisation, matched to the deterioration found." },
    { title: "Repair & strengthening", body: "Mending cracks, tears and structural loss, folio by folio." },
    { title: "Stabilisation", body: "Ensuring the material is safe for handling and long-term storage." },
    { title: "Protective enclosure", body: "Archival-quality housing for the conserved manuscript." },
    { title: "Digitisation", body: "A high-resolution digital record, so the original need not be handled again." },
  ],
} as const;

export const film = {
  label: "The work, filmed",
  heading: "Restoration of Tadpatras",
  body: "The Foundation's own short film on the Kumbhoj Bahubali programme — documentation, treatment and digitisation, filmed during the conservation work itself. In Hindi.",
  youtubeId: "m6tPodN-8YY",
} as const;

export const capacity = {
  label: "Capacity",
  heading: "Building conservation capacity, not just completing projects",
  body: "ASSF employs lead conservators, assistant conservators and trainees at industry-standard terms — building long-term capacity in a field where trained conservators are scarce in India. Local institutions are trained in safe handling and preventive care, so custodians can continue looking after their own collections.",
  recognition: "Recognised as a Manuscript Conservation Centre under Gyan Bharatam (formerly the National Mission for Manuscripts) — the second such centre certified in Karnataka.",
} as const;
