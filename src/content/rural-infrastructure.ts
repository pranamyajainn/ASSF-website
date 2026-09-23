/**
 * Rural Infrastructure page copy — Foundation's "Rural Infrastructure" doc,
 * rewritten and condensed. Every project here starts from a stated need
 * (a request from the community, a site assessment) rather than a plan to
 * build for its own sake.
 */
export const pageHero = {
  eyebrow: "Rural Infrastructure",
  title: "Creating Spaces That Strengthen Rural Communities",
  body: "A missing community hall limits gatherings. Distant staff housing keeps teachers from their schools. Poor sanitation affects public health. ASSF starts with what a space needs to enable, then builds or facilitates it.",
} as const;

/**
 * Each project carries the Foundation's own photographs. The Samudaya
 * Bhavan set runs before → during → after, so the page shows what changed,
 * not only what stands. Several rural image filenames did not match what
 * the pictures show (the "before" file was the finished hall), so captions
 * describe what is visibly in each photograph, and only images whose
 * content plainly fits the project are used. `community-hall-progress`,
 * `staff-quarters-2` and `sanitation-block-1` are held back until the
 * Foundation confirms which project each shows.
 */
export const projects = {
  label: "Projects",
  heading: "Infrastructure with a purpose",
  items: [
    {
      name: "Samudaya Bhavan, Yarnal",
      body: "The Yarnal Gram Panchayat identified the absence of a community facility as a real gap. ASSF developed a multi-purpose hall on donated land — for gatherings, cultural programmes, discourses and guest accommodation.",
      images: [
        { src: "/images/rural/samudaya-bhavan-1-site.jpeg", alt: "Bare, levelled ground beside a village road.", caption: "Site before development" },
        { src: "/images/rural/samudaya-bhavan-2-construction.jpeg", alt: "Brick walls and red shuttering of the hall under construction, a worker on the wall.", caption: "Under construction" },
        { src: "/images/rural/samudaya-bhavan-3-completed.jpeg", alt: "Long, whitewashed wings with blue railings around a paved courtyard.", caption: "Completed" },
      ],
    },
    {
      name: "Community hall renovation, Yarnal",
      body: "An existing hall had deteriorated with no comparable space nearby. ASSF renovated and expanded it into a functioning space with a reading library, restored for family gatherings and cultural events.",
      images: [
        { src: "/images/rural/community-hall-complete.jpeg", alt: "A long concrete building, its walls still unpainted, during the works.", caption: "During the works" },
      ],
    },
    {
      name: "Staff quarters, Hosur",
      body: "Teaching staff were commuting from distant towns for lack of housing. ASSF converted an existing building into 14 rooms of staff accommodation, following a site assessment.",
      images: [
        { src: "/images/rural/staff-quarters-1.jpeg", alt: "A long, whitewashed single-storey building behind a fence.", caption: "Staff quarters, Hosur" },
      ],
    },
    {
      name: "Public sanitation, Yarnal",
      body: "Responding to resident requests, ASSF surveyed the need and worked with the Zilla Panchayat to fund toilet blocks with running water and proper sewage disposal — on land provided by the local Jain Mandir committee.",
      images: [
        { src: "/images/rural/sanitation-block-2.jpeg", alt: "A whitewashed toilet block with signboards on its wall.", caption: "Public toilet block, Yarnal" },
      ],
    },
  ],
} as const;

export const shantiStambh = {
  label: "Cultural landmark",
  heading: "Shanti Stambh",
  paragraphs: [
    "Rural infrastructure can also carry cultural memory forward. ASSF constructed the Shanti Stambh at Yarnal in memory of Pratham Acharya Shri Shantisagarji Maharaj — a six-foot statue above the stambh, with engraved panels depicting his life on all four sides.",
    "It was inaugurated on 8 February 2020, in the presence of Acharya Shri 108 Vardhaman Sagarji Maharaj and his Sangh, with Dr. D. Veerendra Heggade participating.",
  ],
  image: "/images/rural/shanti-stambh.png",
  caption: "The Shanti Stambh: the Foundation's drawing of the design.",
} as const;

export const method = {
  label: "How we work",
  heading: "Beginning with the need, not the structure",
  steps: [
    { title: "Listen & assess", body: "Understand the request from a community or institution, then assess the site." },
    { title: "Define the purpose", body: "Establish what the facility must enable, and for whom." },
    { title: "Plan carefully", body: "Develop plans with appropriate architectural and technical input." },
    { title: "Build or facilitate", body: "Undertake the work directly, or help connect communities with public authorities." },
    { title: "Create long-term value", body: "Focus on what stays useful to the community after the project ends." },
  ],
} as const;
