/**
 * Reports & Newsletter, in the words and order of the Foundation's page
 * designs (Nov 2026): the latest report, every project report with its
 * state, the newsletter (Shanti Sagar Patrika) and the press. Only reports
 * without financial figures are published: the Foundation has asked that
 * no expenditure be published until all trustees approve it.
 *
 * A report's `state` is "available" (with its PDF in /reports, `href`) or
 * "preparing" (no PDF yet).
 */
const P = "/images/pages/reports/";

export type Report = { state: string; place: string; facts: string; image: { src: string; alt: string }; href: string };

export const pageHero = {
  question: "Reports",
  label: "and newsletter",
  eyebrow: "Reports & Newsletter",
  title: "Our Work, on the Record",
  body: "Every project we complete is written up in full: what we found, how we cared for it, and what we handed back. Read our reports, follow our news, and see our work in the papers.",
  /** The latest report, shown as a cover. */
  latest: {
    tag: "Latest report",
    coverLabel: "Closing report",
    coverTitle: "Manuscripts Conservation and Restoration Project",
    coverPlace: "Shri Mahaveer Brahmacharyashram, Jain Gurukul, Karanja Lad",
    coverBy: "Acharya Shanti Sagar Foundation",
    title: "Karanja Lad · Gurukul Ashram Collection",
    body: "The full story of our conservation of the Gurukul Ashram collection: 221 manuscripts and archival books, 28,268 folios, from first assessment to final handover.",
    facts: [
      { label: "Period", value: "October 2024 to 9 August 2025" },
      { label: "Format", value: "PDF · 12 pages · 1.5 MB" },
    ],
    button: "Read the report (PDF)",
    href: "/reports/karanja-lad-closing-report.pdf",
  },
} as const;

export const list = {
  question: "Project",
  label: "reports",
  heading: "Project Reports",
  states: { available: "Available", preparing: "Being prepared" },
  open: "Read the report (PDF)",
  soon: "Arriving soon",
  items: [
    {
      state: "available",
      place: "Karanja Lad · Gurukul Ashram",
      facts: "Closing report · October 2024 to August 2025 · 221 objects · 28,268 folios",
      image: { src: `${P}karanja-ashram.jpg`, alt: "Shri Mahaveer Gurukul Brahmacharya Ashram, Karanja Lad" },
      href: "/reports/karanja-lad-closing-report.pdf",
    },
    {
      state: "preparing",
      place: "Kumbhoj, Kolhapur",
      facts: "Closing report · February 2022 to September 2024 · 1,399 objects · 1,06,277 folios",
      image: { src: `${P}kumbhoj-site.jpg`, alt: "Kumbhoj Bahubali, Kolhapur" },
      href: "",
    },
    {
      state: "preparing",
      place: "Karanja Lad · Balatkar Gan Mandir",
      facts: "Closing report · 940 manuscripts · 76,761 folios",
      image: { src: `${P}team-karanja.jpg`, alt: "Our conservation team at Karanja Lad" },
      href: "",
    },
  ] as Report[],
};

/**
 * The newsletter. "Send me the newsletter" opens an email to the
 * Foundation with the reader's name and contact filled in; the Foundation
 * adds them to its list in the site editor (Mail).
 */
export const newsletter = {
  question: "News",
  label: "letter",
  heading: "Shanti Sagar Patrika",
  body: "News from our laboratories, villages and community, a few times a year. Our first issue is on its way. Leave your details and it will reach you first.",
  nameLabel: "Name",
  contactLabel: "Email or WhatsApp number",
  button: "Send me the newsletter",
  subject: "Please send me Shanti Sagar Patrika",
  thanks: "Thank you. Please send the email that has opened, and the first issue will reach you soon.",
} as const;

export const press = {
  question: "In the",
  label: "news",
  heading: "In the News",
  lede: "Our relief work and health camps, as reported in the papers.",
  items: [
    { src: `${P}press-6.jpg`, alt: "Vijayavani report on lockdown relief", paper: "Vijayavani", caption: "Lockdown relief, Bengaluru, 2020" },
    { src: `${P}press-8.jpg`, alt: "Kannada Prabha report on lockdown relief", paper: "Kannada Prabha", caption: "Lockdown relief, Bengaluru, 2020" },
    { src: `${P}press-7.jpg`, alt: "Newspaper report on community kitchens", paper: "Local press", caption: "Community kitchens, 2020" },
    { src: `${P}press-78.jpg`, alt: "Mandya newspaper report on the health camp", paper: "Mandya press", caption: "Free health camp, June 2019" },
  ],
  closing: "Written down, so it is never forgotten.",
  buttons: [
    { label: "Support the mission", href: "/donate" },
    { label: "See our impact", href: "/impact" },
    { label: "Write to us", href: "#contact" },
  ],
} as const;
