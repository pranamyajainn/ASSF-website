/**
 * The photo gallery: the Foundation's own photographs of its work. It opens
 * with every photograph of the work already on the site — each with the
 * description and caption it has on its own page — and the Foundation adds,
 * removes and reorders photographs in the site editor (Photo Gallery).
 * Portraits (the Acharya, trustees) stay on their own pages.
 */
export const pageHero = {
  eyebrow: "Photo Gallery",
  title: "The work in photographs",
  body: "The Foundation's own photographs of its work: manuscripts in conservation, buildings raised in villages, health camps, help for schools, and relief.",
} as const;

export type Photo = { src: string; ratio: string; alt: string; caption: string };

export const gallery = {
  label: "Photographs",
  items: [
    { src: "/images/work/inauguration-bundles.jpg", ratio: "1600 / 1067", alt: "Munis and Foundation members around tables of palm-leaf bundles and cloth-wrapped manuscripts on red cloth.", caption: "The first manuscripts laid out for conservation at Shravanabelagola, July 2025." },
    { src: "/images/work/bundles-red-cloth.jpg", ratio: "1600 / 1066", alt: "Palm-leaf bundles and cloth-wrapped manuscripts laid out in rows on red cloth.", caption: "Palm-leaf bundles and wrapped manuscripts laid out at the start of the Shravanabelagola programme, July 2025." },
    { src: "/images/work/mending-palm-leaf.jpg", ratio: "1333 / 1800", alt: "A man in a white shirt working on a palm leaf laid on a padded board.", caption: "Working on a palm leaf, Shravanabelagola workshop." },
    { src: "/images/work/munis-reading.jpg", ratio: "1429 / 1800", alt: "Three munis bending over an open paper manuscript in a tray.", caption: "Munis reading a paper manuscript at the Shravanabelagola inauguration." },
    { src: "/images/work/workshop-table.jpg", ratio: "1600 / 1067", alt: "Conservators in white coats and visitors gathered around a table of palm leaves.", caption: "Conservators and visitors at the palm-leaf table, Shravanabelagola workshop." },
    { src: "/images/sites/shravanabelagola.jpeg", ratio: "768 / 512", alt: "Palm-leaf and paper manuscripts laid out on red cloth at Shravanabelagola, with monks and Foundation members looking on.", caption: "Shravanabelagola, where conservation began on 11 July 2025." },
    { src: "/images/work/karanja-exhibition.jpg", ratio: "1600 / 1201", alt: "A building entrance under a maroon Foundation banner announcing an exhibition of palm-leaf and paper Jinvani.", caption: "The Foundation's exhibition of palm-leaf and paper Jinvani, Karanja Lad." },
    { src: "/images/work/karanja-visitors.jpg", ratio: "1200 / 1520", alt: "Three men examining handwritten folios spread on a table beside a camera.", caption: "Visitors examining folios at Karanja Lad." },
    { src: "/images/work/lab-rolls.jpg", ratio: "1351 / 1800", alt: "Rolls of paper laid on a blue cloth in a bright conservation room.", caption: "The conservation room at the Karanja Lad exhibition." },
    { src: "/images/work/kumbhoj-munis.jpg", ratio: "1600 / 1201", alt: "A large group of munis gathered close around a conservation table.", caption: "Munis visiting the conservation work at Kumbhoj." },
    { src: "/images/conservation/palm-leaf-before.jpeg", ratio: "2000 / 1501", alt: "A damaged handwritten manuscript with a loss torn through its lower lines, photographed beside a slip marked BEFORE and an accession label reading KBJ/PM/047.", caption: "Before treatment. Every manuscript is recorded before it is touched — this one as KBJ/PM/047." },
    { src: "/images/conservation/manuscript-detail.png", ratio: "892 / 576", alt: "An opened volume of handwritten Devanagari paper folios, with ruled margins and red highlighting.", caption: "Handwritten paper folios, ruled and numbered in the margin." },
    { src: "/images/survey-in-progress.jpeg", ratio: "2560 / 1922", alt: "A handwritten Devanagari folio on blotting paper, beside a pH indicator strip held in tweezers.", caption: "A folio's acidity tested before treatment." },
    { src: "/images/illuminated/cosmology.jpg", ratio: "1237 / 1800", alt: "A painted diagram on cloth shaped like an hourglass, divided into tiers filled with small figures.", caption: "The Jain cosmos (loka), drawn as an hourglass of tiered worlds." },
    { src: "/images/illuminated/procession-folio.jpg", ratio: "1408 / 725", alt: "A paper folio with lines of Devanagari text above a yellow painted band of elephants, riders and animals.", caption: "A folio with a procession painted beneath its text." },
    { src: "/images/illuminated/painted-leaf.jpg", ratio: "1536 / 971", alt: "An orange painted leaf showing an elephant, a white bull, a lion, a crescent moon, fish and vessels.", caption: "Elephant, bull, lion, moon and vessel — emblems of the auspicious dreams in Jain tradition." },
    { src: "/images/illuminated/painted-panel.jpg", ratio: "1223 / 1800", alt: "A painted panel of a crowned, many-armed figure seated above an elephant, on an orange ground.", caption: "A crowned, many-armed figure above an elephant." },
    { src: "/images/illuminated/assembly-folio.jpg", ratio: "1456 / 747", alt: "A paper folio with text above a turquoise painted band of standing figures beside a tree.", caption: "A folio with an assembly of figures painted beneath its text." },
    { src: "/images/illuminated/damage-detail.jpg", ratio: "1200 / 1800", alt: "Close view of painted cloth, the paint cracked and lifting along a fold.", caption: "Paint cracking along a fold — the damage conservation stabilises." },
    { src: "/images/rural/samudaya-bhavan-1-site.jpeg", ratio: "670 / 502", alt: "Bare, levelled ground beside a village road at Yarnal.", caption: "Yarnal: the site before development." },
    { src: "/images/rural/samudaya-bhavan-2-construction.jpeg", ratio: "635 / 476", alt: "Brick walls and red shuttering of the hall under construction, a worker on the wall.", caption: "Samudaya Bhavan, Yarnal — under construction" },
    { src: "/images/rural/samudaya-bhavan-3-completed.jpeg", ratio: "504 / 378", alt: "The completed Samudaya Bhavan at Yarnal: long, whitewashed wings with blue railings around a paved courtyard.", caption: "The completed Samudaya Bhavan." },
    { src: "/images/rural/samudaya-bhavan-wide.jpg", ratio: "1600 / 1067", alt: "The completed Samudaya Bhavan at Yarnal: long whitewashed wings with blue railings around a paved courtyard.", caption: "The completed Samudaya Bhavan, Yarnal." },
    { src: "/images/rural/community-hall-complete.jpeg", ratio: "611 / 458", alt: "A long concrete building, its walls still unpainted, during the works.", caption: "Community hall renovation, Yarnal — during the works" },
    { src: "/images/rural/staff-quarters-1.jpeg", ratio: "502 / 377", alt: "A long, whitewashed single-storey building behind a fence.", caption: "Staff quarters, Hosur" },
    { src: "/images/rural/sanitation-block-2.jpeg", ratio: "620 / 440", alt: "A whitewashed toilet block with signboards on its wall.", caption: "Public toilet block, Yarnal" },
    { src: "/images/community/students-rural-health-centre.jpg", ratio: "1685 / 934", alt: "A long line of students and health workers, most in white coats, standing on open ground outside a rural health centre.", caption: "Students at a rural health centre." },
    { src: "/images/community/health-screening.jpeg", ratio: "611 / 370", alt: "A nurse recording an ECG for a man lying on a camp bed.", caption: "Diagnostic screening at a camp." },
    { src: "/images/community/health-consultation.jpeg", ratio: "571 / 319", alt: "A doctor consulting patients at a table beneath Kannada camp banners.", caption: "Specialist consultation, free of charge." },
    { src: "/images/community/education-support-1.jpeg", ratio: "549 / 426", alt: "Children in a school courtyard receiving workbooks from Foundation volunteers seated at a table.", caption: "Workbooks for schoolchildren near Yarnal." },
    { src: "/images/community/education-support-2.jpeg", ratio: "1152 / 648", alt: "Schoolchildren in uniform holding their new books, with teachers and Foundation members, in front of a school banner.", caption: "Books and stationery, handed over at school." },
    { src: "/images/community/relief-distribution-3.jpeg", ratio: "1032 / 502", alt: "Masked volunteers handing a food packet to a woman at her doorway.", caption: "The COVID-19 response, Bengaluru, 2020." },
    { src: "/images/community/health-camp-outreach.jpg", ratio: "1480 / 1063", alt: "Health workers seated at tables checking blood pressure and taking down details for women and children at a community health camp.", caption: "Community health camp outreach." },
  ] as Photo[],
};
