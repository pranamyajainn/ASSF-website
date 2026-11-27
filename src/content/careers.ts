/**
 * Careers, in the words and order of the Foundation's page designs (Nov
 * 2026). Vacancies are added, changed and removed in the site editor
 * (Careers → Open positions); with none listed, the page shows its "no
 * openings" note. Each "Apply by email" writes to `apply.email`, with the
 * role in the subject. In the opening figures, {openings} and {roles} are
 * counted from the vacancies.
 */
export type Vacancy = {
  role: string;
  /** How many places are open in this role, as the Foundation states it ("4 openings"). */
  openings: string;
  pay: string;
  /** The role in one line. */
  description: string;
  location: string;
  responsibilities: string[];
  qualifications: string[];
};

const P = "/images/pages/careers/";

export const pageHero = {
  question: "Careers",
  label: "with ASSF",
  tag: "We are hiring",
  title: "A Career That Keeps History Alive",
  body: "Join the hands that bring India's handwritten heritage back to health, one folio at a time.",
  button: "See open positions",
  image: { src: `${P}lab-at-work.jpg`, alt: "Conservators at work on palm-leaf folios in our Shravanabelagola laboratory" },
  figures: [
    { value: "{openings}", label: "open positions" },
    { value: "{roles}", label: "roles, from intern to conservator" },
    { value: "2", label: "laboratories, in Maharashtra and Karnataka" },
    { value: "2,49,896+", label: "folios already cared for by our team" },
  ],
} as const;

export const why = {
  question: "Why",
  label: "join us",
  heading: "Work That Outlives Us",
  reasons: [
    { title: "Meaningful", body: "Every folio you mend is a teaching saved for the generations after us." },
    { title: "Hands-on", body: "Learn on real palm-leaf and paper collections, centuries old." },
    { title: "Guided", body: "Grow beside experienced conservators, in a team that teaches." },
    { title: "A path ahead", body: "A rare craft, with room to rise from intern to lead conservator." },
  ],
  path: ["Intern", "Assistant Conservator", "Conservator", "Lead Conservator"],
} as const;

const sites = "Karanja Lad, Maharashtra · Shravanabelagola, Karnataka";

export const openings = {
  question: "Open",
  label: "positions",
  heading: "Open Positions",
  lede: "Manuscript conservation, at our laboratories in Karanja Lad and Shravanabelagola. Remuneration depends on qualifications and experience.",
  apply: "Apply by email",
  more: "See the role in full",
  labels: { responsibilities: "What you will do", qualifications: "What you bring" },
  items: [
    {
      role: "Conservator",
      openings: "4 openings",
      pay: "₹30,000 to ₹40,000 a month",
      description: "Lead the careful treatment of palm-leaf and paper manuscripts, and guide the team around you.",
      location: sites,
      responsibilities: [
        "Examine manuscripts and help assess condition, plan treatment and set priorities",
        "Carry out conservation treatments on palm-leaf and paper manuscripts by approved methods",
        "Keep accurate treatment records, condition notes, photographs and progress reports",
        "Support safe handling, storage, packing and movement of manuscripts",
        "Guide assistant conservators and interns, and uphold quality and safe laboratory practice",
        "Help manage conservation materials, tools, equipment and inventories",
      ],
      qualifications: [
        "A qualification or recognised training in conservation, art conservation, conservation science, museology or a related field",
        "Practical experience in paper or palm-leaf manuscript conservation, strongly preferred",
        "Knowledge of condition assessment, preventive conservation, documentation and safe handling",
        "A collaborative spirit and high standards of care",
      ],
    },
    {
      role: "Assistant Conservator",
      openings: "7 openings",
      pay: "₹25,000 to ₹30,000 a month",
      description: "Work beside our conservators, treating folios with growing skill and care.",
      location: sites,
      responsibilities: [
        "Assist with examination, condition assessment and preparation for treatment",
        "Carry out assigned conservation procedures under supervision and laboratory protocols",
        "Record condition details, treatment steps, photographs and work completed",
        "Help with safe handling, arrangement, storage, packing and preventive care",
        "Keep the laboratory clean and organised, and track materials and tools",
        "Work closely with conservators and interns to meet quality and output goals",
      ],
      qualifications: [
        "Education or training in conservation, museology, fine arts, heritage studies or a related field",
        "Experience in manuscript, paper or art conservation is welcome",
        "Patience, attention to detail, a wish to learn and a team spirit",
      ],
    },
    {
      role: "Intern",
      openings: "20 openings",
      pay: "₹15,000 to ₹20,000 a month",
      description: "Begin your journey in heritage with supervised, hands-on work on real manuscripts.",
      location: sites,
      responsibilities: [
        "Handle and organise palm-leaf and paper manuscripts under supervision",
        "Support condition recording, photography, labelling and record-keeping",
        "Prepare workspaces and organise conservation tools and materials",
        "Learn safe handling, storage, laboratory hygiene and preventive care",
        "Take part in training, team briefings and project activities",
      ],
      qualifications: [
        "Students, recent graduates or early-career applicants in conservation, fine arts, museology, history, archaeology, heritage studies, library science or related fields",
        "Prior conservation experience is welcome, and not required",
        "Careful hands, patience, reliability and a wish to learn",
      ],
    },
  ] as Vacancy[],
  empty: "There are no openings right now. Thank you for your interest — please look in again later.",
};

export const locations = {
  question: "Where you",
  label: "will work",
  heading: "Where You Will Work",
  sites: [
    { name: "Karanja Lad, Maharashtra", body: "Our laboratory at the Shri Mahaveer Gurukul Brahmacharya Ashram, caring for the town's historic temple collections.", image: { src: `${P}team-karanja.jpg`, alt: "Our conservation team at Karanja Lad" } },
    { name: "Shravanabelagola, Karnataka", body: "Our laboratory at Bahubali Prakrit Bhawan, home to 2,695 palm-leaf granthas in our care.", image: { src: `${P}lab-shravanabelagola.jpg`, alt: "Our laboratory at Shravanabelagola" } },
  ],
  note: "Mention your preferred location when you apply. The final site is decided by project needs. The work asks for careful hands, attention to detail and respect for conservation practice.",
} as const;

export const apply = {
  question: "How to",
  label: "apply",
  heading: "How to Apply",
  body: "Send your CV with a short note on the role, your qualifications or experience, and your preferred location.",
  emailLabel: "Email",
  /** Where applications go. */
  email: "operations@shantisagarfoundation.org",
  subjectLabel: "Subject",
  subject: "Application · [Position] · [Preferred Location]",
  enquiriesLabel: "Enquiries",
  phone: "+91 95915 87728",
} as const;
