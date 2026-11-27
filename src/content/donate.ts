/**
 * The Donate page, after the Foundation's page designs (Nov 2026): why give,
 * the gift, where it goes, and the two ways to give. The giving form's own
 * labels are in i18n/ui.ts (donate); the UPI QR code and its UPI ID in
 * lib/donate/config.ts; the bank details, email and phone in shared.ts —
 * each in one place.
 */
export const pageHero = {
  question: "Give",
  label: "to the work",
  eyebrow: "Support the mission",
  title: "Every Page, Saved Together",
  body: "No single hand can save a library. When many of us give, page by page, whole collections come back to life, and communities are cared for along the way.",
  /** Beside the price of one folio (shared.ts → folioPrice). */
  price: "conserves one folio, from cleaning to its archival wrapper",
  image: {
    src: "/images/pages/donate/fragile-forever.jpg",
    alt: "The same manuscript before conservation, in fragments, and after, made whole",
    caption: "One manuscript, before and after our care.",
  },
} as const;

export const gift = {
  question: "Your",
  label: "gift",
  heading: "Choose Your Gift",
  lede: "Taadpatra Restoration · ₹{folioPrice} a folio. Give by UPI from any UPI app.",
} as const;

export const goes = {
  question: "What it",
  label: "does",
  heading: "Where Your Gift Goes",
  image: { src: "/images/pages/donate/lab-at-work.jpg", alt: "Conservators at work in our laboratory" },
  points: [
    { title: "Into skilled hands", body: "Your gift keeps our conservators at their tables, cleaning, mending and strengthening each folio." },
    { title: "Into fine materials", body: "Japanese tissue, archival boards and wrappers that keep a manuscript safe for generations." },
    { title: "Into lasting care", body: "Each conserved manuscript is documented, housed safely and handed back to its custodians." },
  ],
  figures: [
    { value: "2,49,896+", label: "folios already conserved with the community's support" },
    { value: "2,560", label: "manuscripts returned to health" },
    { value: "2", label: "laboratories at work today" },
    { value: "2019", label: "serving as a registered charitable trust" },
  ],
} as const;

export const ways = {
  question: "Ways",
  label: "to give",
  heading: "Two Simple Ways to Give",
  upi: { eyebrow: "By UPI", title: "Scan and Give", body: "Open any UPI app and scan." },
  bank: {
    eyebrow: "By bank transfer",
    title: "Transfer to Our Account",
    labels: { name: "Account name", bank: "Bank", account: "Account", ifsc: "IFSC" },
  },
  receipt: {
    title: "Your receipt",
    /** {email} is the Foundation's email (shared.ts), shown as a link. */
    body: "After you give by UPI or bank transfer, write to us at {email} with your name and the amount, and we will send your receipt.",
  },
  time: { title: "Give your time", body: "Volunteer at camps, events and community drives.", link: { label: "Volunteer with us", href: "/#join" } },
  questions: { title: "Questions", body: "We are glad to talk through any gift, large or small." },
  closing: "Preserve. Serve. Build. Together.",
} as const;
