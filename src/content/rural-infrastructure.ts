/**
 * Rural Infrastructure, after the Foundation's page designs (Nov 2026): how
 * the Foundation builds, what it has built, the Shanti Stambh, and how to
 * be part of it. Words and photographs as the Foundation's preview gives them.
 */
import { org } from "./shared";

const P = "/images/pages/rural/";

export const pageHero = {
  question: "Rural",
  label: "Infrastructure",
  eyebrow: "Our Work · Rural Infrastructure",
  title: "Building What Villages Ask For",
  paragraphs: [
    "Some needs are met in a day. Others need walls and a roof: a hall where a village can gather, a place where a teacher can rest, clean water and sanitation for every family.",
    "We build only when a community asks, and we build with them, so that what rises belongs to the village and serves it for generations.",
  ],
  images: [
    { src: `${P}hero-infrastructure.jpg`, alt: "The Samudaya Bhavan at Yarnal" },
    { src: `${P}hosur-2.jpg`, alt: "The teachers' resting space at Hosur" },
    { src: `${P}sanitation-2.jpg`, alt: "The public sanitation block at Yarnal" },
  ],
  figures: [
    { value: "5", label: "spaces built or brought to life with villages" },
    { value: "14", label: "rooms for rural teachers to rest" },
    { value: "419", label: "students in the schools those teachers serve" },
    { value: "27", label: "guntas of land given by community members for the Bhavan" },
  ],
} as const;

export const method = {
  question: "How we",
  label: "build",
  heading: "Beginning With the Need",
  lede: "A building is only as good as the life it makes possible. So we start with that life.",
  steps: [
    { title: "Listen", body: "A request comes from the village, and we visit to understand it." },
    { title: "Define", body: "We agree on what the space must make possible, and for whom." },
    { title: "Plan", body: "Architects and engineers design it to suit the place and its people." },
    { title: "Build or bring together", body: "We build it ourselves, or work with public bodies to see it done." },
  ],
} as const;

export const projects = {
  question: "What we",
  label: "have built",
  heading: "Spaces That Serve for Generations",
  feature: {
    place: "Yarnal, Hukkeri taluk, Belagavi district",
    title: "Samudaya Bhavan",
    paragraphs: [
      "In February 2019, the Hosur Gram Panchayat wrote to us: the village had no place to come together. Three community members gave 27 guntas of their own land, and on it rose the Samudaya Bhavan, with a community hall, a dining hall, a kitchen and a dharamshala for visitors.",
      "It was built for the village's gatherings, discourses, cultural programmes and visiting guests.",
    ],
    images: [
      { src: `${P}yarnal-build.jpg`, alt: "The Samudaya Bhavan at Yarnal under construction", caption: "Under construction" },
      { src: `${P}hero-infrastructure.jpg`, alt: "The completed Samudaya Bhavan at Yarnal", caption: "Complete" },
    ],
    credits: [
      { label: "Land given by", text: "Shri Mahaveer Nilajagi, Shri D. A. Patil and Shri V. S. Doddanavar" },
      { label: "Designed by", text: "21st Studio, Belagavi" },
    ],
  },
  /** More spaces; one without photographs shows as a dark card. */
  items: [
    {
      place: "Hosur, Belagavi district",
      title: "A Place for Teachers to Rest",
      body: "Teachers of a rural Kannada-medium school and an industrial training centre travel in from distant towns. We turned an old building into a 14-room resting space, so the people who teach 419 students have a place of their own to rest.",
      images: [
        { src: `${P}hosur-1.jpg`, alt: "The teachers' resting space at Hosur" },
        { src: `${P}quarters-room.jpg`, alt: "Rooms being partitioned inside the building" },
      ],
    },
    {
      place: "Schools and villages",
      title: "Clean Sanitation for All",
      body: "We build toilet blocks for schools and village communities, with special care for women and children. At Yarnal, when residents asked, we worked with the Zilla Panchayat to build public blocks with running water and proper drainage, on land given by the Shri Chandraprabhu Digambar Jain Mandir Committee.",
      images: [
        { src: `${P}toilet-block.jpg`, alt: "A newly built toilet block" },
        { src: `${P}sanitation-1.jpg`, alt: "The public sanitation block at Yarnal" },
      ],
    },
    {
      place: "Yarnal, Belagavi district",
      title: "A Hall Renewed",
      body: "The village's old community hall, its only gathering place nearby, had worn with time. We renovated and enlarged it, and added a reading library, so families once again gather there for their occasions and celebrations.",
      images: [] as { src: string; alt: string }[],
    },
  ],
} as const;

export const shantiStambh = {
  question: "A landmark",
  label: "of memory",
  heading: "The Shanti Stambh",
  lede: "Some structures shelter people. This one shelters a memory.",
  paragraphs: [
    "At Yarnal stands the Shanti Stambh, raised in memory of Pratham Acharya Shri Shanti Sagar Ji Maharaj. A six-foot statue of Acharya Shri crowns the pillar, and its four sides carry his life story, engraved for every visitor to read.",
    "It was inaugurated on 8 February 2020 by Dr. D. Veerendra Heggade, in the presence of Acharya Shri 108 Vardhaman Sagar Ji Maharaj and his Sangh, with Swamijis from Shravanabelagola, Humcha and Nandani.",
  ],
  creditLabel: "Made possible mainly by",
  credit: "Shri Shobhag Mal Rajendra Kumar Ji Kataria, Ahmedabad",
  image: { src: `${P}shanti-stambh.jpg`, alt: "Drawing of the Shanti Stambh design", caption: "The Shanti Stambh, Yarnal" },
} as const;

export const give = {
  question: "Be part",
  label: "of it",
  heading: "Build With Us",
  body: "Every space on this page began with a village that asked and many people who gave. The next one can begin with you.",
  tiers: [
    { value: "Ask", label: "tell us what your village needs" },
    { value: "Give", label: "towards a hall, a home or clean water" },
    { value: "Partner", label: "bring your land, skills or institution" },
  ],
  buttons: [
    { label: "Support the mission", href: "/donate" },
    { label: "Write to us", href: `mailto:${org.email}` },
  ],
  next: { text: "Spaces strengthen a village. Livelihoods strengthen a family.", label: "Next: Swavalamban Yojana", href: "/swavalamban-yojana" },
} as const;
