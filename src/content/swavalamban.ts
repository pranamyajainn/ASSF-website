/**
 * Swavalamban Yojana, the Foundation's coming scheme (page designs, Nov
 * 2026). Who can apply and how are added here at the launch.
 */
import { org } from "./shared";

const P = "/images/pages/swavalamban/";

export const pageHero = {
  question: "Swavalamban",
  label: "Yojana",
  eyebrow: "Our Work · Launching soon",
  title: "Swavalamban Yojana",
  subtitle: "Helping families stand on their own feet",
  quote: "जिन्हें भाग्य ने कम दिया, उन्हें समाज के हाथ थाम लें।",
  translation: "Where fortune has given less, let the hands of the community hold on.",
  body: "Swavalamban Yojana is our coming scheme for members of the Jain community who need a helping hand. It is rooted in Sadharmik Vatsalya, the loving care we owe one another, and it offers what lasts longest: a skill, a livelihood and an education.",
  image: { src: `${P}lamp.png`, alt: "Illustration of one large lamp lighting many small lamps" },
  badge: "Launching soon",
} as const;

export const why = {
  question: "Why",
  label: "Swavalamban",
  heading: "From Support to Self-Reliance",
  lede: "A meal helps for a day. A skill helps for a lifetime.",
  body: "Through floods, the lockdown and our village camps, we have stood beside families in their hardest hours. Swavalamban Yojana takes the next step: helping them build an income of their own, so that help received today becomes strength they carry forward and, one day, share with others.",
} as const;

export const offers = {
  question: "What it",
  label: "offers",
  heading: "Three Doors to a Stronger Future",
  lede: "For women, for men and for students, each door opens onto the same road: a life of dignity and independence.",
  doors: [
    { icon: `${P}icon-women.png`, label: "For women", title: "Skills and a Business of Her Own", body: "Short training in practical skills, and help to start a small business from home or in the neighbourhood, so she can earn with confidence." },
    { icon: `${P}icon-men.png`, label: "For men", title: "A Trade in Skilled Hands", body: "Skill development that opens the way to steady work or a small enterprise, with support to take the first confident steps." },
    { icon: `${P}icon-students.png`, label: "For students", title: "An Education That Opens Doors", body: "Education loans for deserving students, so that a bright mind is never held back on its way to college and a career." },
  ],
} as const;

export const launch = {
  question: "Launching",
  label: "soon",
  heading: "Be the First to Know",
  body: "Details of who can apply and how will be shared at the launch. If you, or a family you know, could walk through one of these doors, write to us and we will reach out as soon as the Yojana opens.",
  steps: [
    { title: "Write to us with your interest", body: "" },
    { title: "We share the details at launch", body: "" },
    { title: "We walk with you, step by step", body: "" },
  ],
} as const;

export const give = {
  question: "Be part",
  label: "of it",
  heading: "Hands That Lift Each Other",
  body: "When the community holds one family's hand, that family will one day hold another's. Join us in lighting this lamp.",
  tiers: [
    { value: "Give", label: "towards training, a small business or a student's education" },
    { value: "Mentor", label: "share your skill, trade or business wisdom" },
    { value: "Refer", label: "tell us about a family who could benefit" },
  ],
  buttons: [
    { label: "Support the mission", href: "/donate" },
    { label: "Offer your skills", href: `mailto:${org.email}` },
    { label: "Write to us", href: `mailto:${org.email}` },
  ],
  next: { text: "Preserve. Serve. Build. And now, help every family stand tall.", label: "Next: Our Impact", href: "/impact" },
} as const;
