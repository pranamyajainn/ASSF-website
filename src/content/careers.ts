/**
 * Careers: the Foundation's open positions, in the words of its "Career
 * Opportunities" posting (sent by Alka, 28 Oct 2026, for Shri Anil Sethi
 * ji). Vacancies are added, changed and removed in the site editor
 * (Careers → Open positions); with none listed, the page shows its "no
 * openings" note. Applications go by email to `apply.email`.
 */
export type Vacancy = {
  role: string;
  location: string;
  /** How many places are open in this role, as the Foundation states it. */
  openings: string;
  pay: string;
  /** The role in a paragraph. */
  description: string;
  responsibilities: string[];
  qualifications: string[];
  whyJoin: string[];
};

export const pageHero = {
  eyebrow: "Careers",
  title: "Work with the Foundation",
  body: "Join us in preserving India's manuscript heritage for future generations.",
} as const;

/** The posting's summary line: how many places, where, and on what. */
export const summary = [
  { label: "Total openings", value: "31 positions" },
  { label: "Work locations", value: "Karanja Lad, Maharashtra · Shravanabelagola, Karnataka" },
  { label: "Focus area", value: "Palm-leaf & paper manuscripts" },
];

export const about = {
  heading: "About Acharya Shanti Sagar Foundation (ASSF)",
  body: "Acharya Shanti Sagar Foundation (ASSF) is dedicated to the preservation, conservation and digitisation of ancient manuscripts and historical archives. Through conservation projects across heritage repositories, the Foundation works to safeguard India's handwritten manuscripts, palm-leaf texts and paper collections for future generations. ASSF also supports community services and rural infrastructure development.",
} as const;

const sites = "Karanja Lad, Maharashtra · Shravanabelagola, Karnataka";

export const openings = {
  label: "Openings",
  heading: "Open positions",
  labels: {
    openings: "Openings",
    pay: "Monthly remuneration",
    responsibilities: "Key responsibilities",
    qualifications: "Qualifications and experience",
    whyJoin: "Why join ASSF?",
  },
  items: [
    {
      role: "Conservator – Manuscript Conservation",
      location: sites,
      openings: "4 openings",
      pay: "₹30,000–₹40,000, depending on qualifications and relevant experience.",
      description: "We are seeking experienced conservators to undertake and guide the conservation of palm-leaf and paper manuscripts at ASSF project sites. Candidates should bring sound practical judgement, careful treatment practices and a commitment to ethical conservation.",
      responsibilities: [
        "Examine manuscripts and contribute to condition assessment, treatment planning and prioritisation.",
        "Carry out appropriate conservation treatments on palm-leaf and paper manuscripts in accordance with approved methods and protocols.",
        "Maintain accurate treatment records, condition notes, photographs and progress reports.",
        "Support curative conservation, safe handling, storage, packing and movement of manuscripts.",
        "Guide assistant conservators and interns and support quality control and safe laboratory practices.",
        "Help manage conservation materials, tools, equipment and laboratory inventories.",
      ],
      qualifications: [
        "Relevant qualification or recognised training in conservation, art conservation, conservation science, museology or a related field.",
        "Practical experience in paper and/or palm-leaf manuscript conservation is strongly preferred.",
        "Knowledge of condition assessment, preventive conservation, treatment documentation and safe material handling.",
        "Ability to work collaboratively, support team learning and maintain high standards of care.",
      ],
      whyJoin: [
        "Contribute directly to the preservation of rare manuscripts and India's cultural heritage.",
        "Work on conservation projects across heritage repositories and collaborate with a multidisciplinary team.",
      ],
    },
    {
      role: "Assistant Conservator – Manuscript Conservation",
      location: sites,
      openings: "7 openings",
      pay: "₹25,000–₹30,000, depending on qualifications and relevant experience.",
      description: "We are looking for careful and motivated team members to support the conservation of palm-leaf and paper manuscripts under the guidance of the Lead Conservator or Conservator.",
      responsibilities: [
        "Assist with manuscript examination, condition assessment and preparation for treatment.",
        "Carry out assigned conservation procedures under appropriate supervision and in line with laboratory protocols.",
        "Record condition details, treatment steps, photographs and work completed accurately.",
        "Assist with safe handling, arrangement, storage, packing and preventive conservation activities.",
        "Help maintain a clean, organised laboratory and track the use of conservation materials and tools.",
        "Work closely with conservators and interns to meet project quality and output requirements.",
      ],
      qualifications: [
        "Relevant education or training in conservation, museology, fine arts, heritage studies or a related discipline.",
        "Experience in manuscript, paper or art conservation is desirable.",
        "Patience, attention to detail, willingness to learn and the ability to work effectively in a team.",
      ],
      whyJoin: [
        "Develop practical skills while contributing to meaningful heritage preservation work.",
        "Learn from experienced conservation professionals and work with historic manuscript collections.",
      ],
    },
    {
      role: "Intern – Manuscript Conservation",
      location: sites,
      openings: "20 openings",
      pay: "₹15,000–₹20,000 per month, depending on qualifications and internship profile.",
      description: "ASSF invites applications from enthusiastic early-career candidates who want supervised, practical exposure to manuscript conservation and preventive care.",
      responsibilities: [
        "Assist with the careful handling and organisation of palm-leaf and paper manuscripts under supervision.",
        "Support condition recording, photography, labelling and maintenance of conservation records.",
        "Help prepare workspaces and organise conservation tools and materials.",
        "Learn and follow safe handling, storage, laboratory hygiene and preventive conservation procedures.",
        "Participate in training, team briefings and other project activities assigned by the supervisor.",
      ],
      qualifications: [
        "Students, recent graduates or early-career applicants in conservation, fine arts, museology, history, archaeology, heritage studies, library and information science or related fields may apply.",
        "Prior conservation experience is not essential.",
        "Careful handling, patience, reliability and willingness to learn are important.",
      ],
      whyJoin: [
        "Gain supervised, hands-on exposure to manuscript conservation.",
        "Build foundational skills while helping protect valuable cultural heritage.",
      ],
    },
  ] as Vacancy[],
  empty: "There are no openings right now. Thank you for your interest — please look in again later.",
};

export const locations = {
  heading: "Work locations",
  body: [
    "ASSF conservation project sites at Karanja Lad, Maharashtra, and Shravanabelagola, Karnataka.",
    "Please mention your preferred location in your application. Final site allocation will depend on project requirements.",
    "The work requires careful handling of fragile cultural materials, attention to detail, teamwork and adherence to conservation protocols.",
  ],
} as const;

export const apply = {
  label: "Applying",
  heading: "How to apply",
  body: "Send your updated CV/resume and a brief cover note stating the position applied for, relevant qualifications or experience, and preferred location.",
  /** Where applications go, as the posting gives it. */
  email: "operations@shantisagarfoundation.org",
  subjectNote: "Email subject: Application – [Position] – [Preferred Location]",
  enquiries: { label: "For enquiries", phone: "+91 95915 87728" },
} as const;
