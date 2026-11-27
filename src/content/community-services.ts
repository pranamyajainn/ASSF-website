/**
 * Community Services, after the Foundation's page designs (Nov 2026): how
 * the Foundation serves, its health camps, education support and relief,
 * and how to be part of it. Words and photographs as the Foundation's
 * preview gives them.
 */
import { org } from "./shared";

const P = "/images/pages/community/";

export const pageHero = {
  question: "Community",
  label: "Services",
  eyebrow: "Our Work · Community Services",
  title: "Standing With Families When It Matters Most",
  paragraphs: [
    "The compassion that guards a fragile leaf also reaches out to people. When a village needs a doctor, a school needs books, or a city needs food, we go, and we go together with those who share the same care.",
    "Every effort begins by listening to the community, and every one is carried through until the help has truly arrived.",
  ],
  images: [
    { src: `${P}relief-2.jpg`, alt: "A volunteer handing a meal packet to a woman at her doorstep" },
    { src: `${P}camp-banner.jpg`, alt: "Volunteers and medical students at a free health camp in Belagavi district" },
  ],
  figures: [
    { value: "3,500+", label: "people cared for at free health camps" },
    { value: "500", label: "schoolchildren given books and stationery" },
    { value: "7,77,534", label: "meals shared in the lockdown" },
    { value: "262", label: "flood-hit families helped to rebuild" },
  ],
} as const;

export const method = {
  question: "How we",
  label: "serve",
  heading: "Listening First, Then Serving",
  lede: "Our help is shaped by the people it is meant for.",
  steps: [
    { title: "Understand", body: "We visit, listen and learn what is truly needed." },
    { title: "Respond", body: "We bring the right help, quickly and with dignity." },
    { title: "Collaborate", body: "We work with doctors, schools, panchayats and fellow trusts." },
    { title: "Follow through", body: "We stay until the care is complete, from treatment to recovery." },
  ],
} as const;

export const healthcare = {
  question: "Health",
  label: "camps",
  heading: "Specialist Care, Closer to Home",
  lede: "For a family in a village, a specialist can be a day's journey and a month's earnings away. So we bring the specialists to them.",
  body: "With hospitals and fellow organisations, we have held free camps with cardiologists, eye surgeons, paediatricians, gynaecologists and dentists. Those who needed surgery were taken onward for free treatment, and medicines and spectacles were given on the spot.",
  images: [
    { src: `${P}camp-mandya.jpg`, alt: "Children at the free health camp in Dadagadapura, Mandya", caption: "Dadagadapura, Mandya, 30 June 2019." },
    { src: `${P}camp-children.jpg`, alt: "Children being checked by a doctor at a health camp", caption: "Care for the youngest, at one of our camps." },
  ],
  camps: [
    { date: "14 March 2019", place: "Irkal, Raichur", value: "463", unit: "people cared for", detail: "5 free heart surgeries · 35 cataract surgeries · 137 spectacles" },
    { date: "17 April 2019", place: "Bengaluru", value: "178", unit: "heart screenings", detail: "On Mahaveer Jayanti · 78 units of blood donated" },
    { date: "30 June 2019", place: "Dadagadapura, Mandya", value: "1,100", unit: "people cared for", detail: "463 spectacles · 138 cataract surgeries · 35 doctors" },
    { date: "11 July 2019", place: "Yarnal, Belagavi", value: "1,800", unit: "people cared for", detail: "78 cataract cases treated free of cost" },
    { date: "16 August 2019", place: "Yarnal, Hosur, Bastvad", value: "48", unit: "women and children", detail: "Dengue and chikungunya prevention drops" },
  ],
  partnersLabel: "Together with",
  partners: "KLES Dr. Prabhakar Kore Hospital · Sapthagiri Hospital · Rudra Gowda Eye Hospital · Lions Blood Bank · Bharatesh Education Trust · Karnataka Jain Association · and many more",
} as const;

export const education = {
  question: "Education",
  label: "support",
  heading: "Helping Children Keep Learning",
  image: { src: `${P}books-yarnal.jpg`, alt: "Schoolchildren near Yarnal holding their new books" },
  paragraphs: [
    "A child who stays in school carries a whole family forward. We visited schools around Yarnal, understood what each one needed, and gave books and stationery to nearly 500 students across three schools.",
    "From 2019 to 2021, we also supported deserving children through their schooling, chosen with care from requests sent by parents and schools, including around 120 children helped through six years of study.",
  ],
  figures: [
    { value: "500", label: "students with books and stationery" },
    { value: "3", label: "village schools near Yarnal" },
    { value: "120", label: "children supported for six years" },
  ],
  strip: [
    { src: `${P}books-yarnal-2.jpg`, alt: "Children receiving books from our team" },
    { src: `${P}education.jpg`, alt: "Young schoolchildren holding their new books" },
    { src: `${P}books-yarnal-3.jpg`, alt: "Book distribution at a village school" },
  ],
  stripCaption: "Books and stationery for village schools near Yarnal.",
} as const;

export const relief = {
  question: "In hard",
  label: "times",
  heading: "Beside Families in Hard Times",
  lede: "When floods rose and the city stood still, we went to the doorsteps of the families who needed us.",
  items: [
    {
      date: "August 2019 · Belagavi district",
      title: "When the Floods Came",
      body: "As floods swept North Karnataka, our volunteers carried survival kits to six villages: Yamgarni, Budiyal, Ugar, Shirgur, Kusnal and Yarnal. We then helped 262 families whose homes were damaged to begin rebuilding.",
      images: [
        { src: `${P}flood-kit.jpg`, alt: "An elderly woman receiving a relief kit" },
        { src: `${P}flood-sacks.jpg`, alt: "Relief kits ready for families in a flood-hit village" },
      ],
      stats: [
        { value: "2,000", label: "food kits" },
        { value: "500", label: "clothing and blanket kits" },
        { value: "262", label: "families helped to rebuild" },
      ],
    },
    {
      date: "1 April to 3 May 2020 · Bengaluru",
      title: "When the City Stood Still",
      body: "Through the lockdown, together with Sakal Digambar Jain Samaj and fifteen fellow organisations, we shared meals and grain with families across the city, to everyone in need, whoever they were.",
      images: [
        { src: `${P}covid-kits.jpg`, alt: "Volunteers handing grain kits to women" },
        { src: `${P}relief-1.jpg`, alt: "A volunteer handing a food packet to a woman" },
      ],
      stats: [
        { value: "7,77,534", label: "meal packets" },
        { value: "2,795", label: "grain kits" },
        { value: "16", label: "organisations, one effort" },
      ],
    },
  ],
  pressLabel: "In the news",
  press: [
    { src: `${P}press-6.jpg`, alt: "Vijayavani newspaper report on lockdown relief" },
    { src: `${P}press-8.jpg`, alt: "Kannada Prabha newspaper report on lockdown relief" },
    { src: `${P}press-7.jpg`, alt: "Newspaper report on community kitchens" },
    { src: `${P}press-78.jpg`, alt: "Mandya newspaper report on the health camp" },
  ],
  pressCaption: "Our relief and health camps, as reported in Vijayavani, Kannada Prabha and local papers.",
} as const;

export const give = {
  question: "Be part",
  label: "of it",
  heading: "Many Hands, One Kindness",
  body: "Every camp, every book and every meal here was made possible by many people giving together. There is a place for you too.",
  tiers: [
    { value: "Give", label: "towards the next camp or a child's schooling" },
    { value: "Volunteer", label: "at camps and community drives" },
    { value: "Tell us", label: "about a village or school that needs help" },
  ],
  buttons: [
    { label: "Support the mission", href: "/donate" },
    { label: "Volunteer with us", href: "/careers" },
    { label: "Write to us", href: `mailto:${org.email}` },
  ],
  next: { text: "Some needs are met in a day. Others are built to last for generations.", label: "Next: Rural Infrastructure", href: "/rural-infrastructure" },
} as const;
