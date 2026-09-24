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

/**
 * Illustrated manuscripts — "some collections also contain richly
 * illustrated manuscripts" ("What we do — Manuscript Conservation"). The
 * Foundation's photographs from the Shravanabelagola inauguration gallery.
 */
export const illuminated = {
  label: "Painted pages",
  heading: "Painted within the collections",
  body: "Some collections hold far more than text: folios painted beneath their lines, cloth paintings of the cosmos, whole leaves of colour. Paint cracks and lifts along every fold, so conservation has to hold the picture as carefully as the word.",
  items: [
    { src: "/images/illuminated/cosmology.jpg", ratio: "1237 / 1800", alt: "A painted diagram on cloth shaped like an hourglass, divided into tiers filled with small figures.", caption: "The Jain cosmos (loka), drawn as an hourglass of tiered worlds." },
    { src: "/images/illuminated/procession-folio.jpg", ratio: "1408 / 725", alt: "A paper folio with lines of Devanagari text above a yellow painted band of elephants, riders and animals.", caption: "A folio with a procession painted beneath its text." },
    { src: "/images/illuminated/painted-leaf.jpg", ratio: "1536 / 971", alt: "An orange painted leaf showing an elephant, a white bull, a lion, a crescent moon, fish and vessels.", caption: "Elephant, bull, lion, moon and vessel — emblems of the auspicious dreams in Jain tradition." },
    { src: "/images/illuminated/painted-panel.jpg", ratio: "1223 / 1800", alt: "A painted panel of a crowned, many-armed figure seated above an elephant, on an orange ground.", caption: "A crowned, many-armed figure above an elephant." },
    { src: "/images/illuminated/assembly-folio.jpg", ratio: "1456 / 747", alt: "A paper folio with text above a turquoise painted band of standing figures beside a tree.", caption: "A folio with an assembly of figures painted beneath its text." },
    { src: "/images/illuminated/damage-detail.jpg", ratio: "1200 / 1800", alt: "Close view of painted cloth, the paint cracked and lifting along a fold.", caption: "Paint cracking along a fold — the damage conservation stabilises." },
  ],
  source: "Photographed at the inauguration of the Shravanabelagola conservation programme, July 2025.",
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
