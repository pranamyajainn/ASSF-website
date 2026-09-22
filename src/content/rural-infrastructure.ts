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

export const projects = {
  gutter: "Projects",
  heading: "Infrastructure with a purpose",
  items: [
    {
      name: "Samudaya Bhavan, Yarnal",
      body: "The Yarnal Gram Panchayat identified the absence of a community facility as a real gap. ASSF developed a multi-purpose hall on donated land — for gatherings, cultural programmes, discourses and guest accommodation.",
      image: "/images/rural/samudaya-bhavan-complete.jpeg",
    },
    {
      name: "Community hall renovation, Yarnal",
      body: "An existing hall had deteriorated with no comparable space nearby. ASSF renovated and expanded it into a functioning space with a reading library, restored for family gatherings and cultural events.",
      image: "/images/rural/community-hall-complete.jpeg",
    },
    {
      name: "Staff quarters, Hosur",
      body: "Teaching staff were commuting from distant towns for lack of housing. ASSF converted an existing building into 14 rooms of staff accommodation, following a site assessment.",
      image: "/images/rural/staff-quarters-1.jpeg",
    },
    {
      name: "Public sanitation, Yarnal",
      body: "Responding to resident requests, ASSF surveyed the need and worked with the Zilla Panchayat to fund toilet blocks with running water and proper sewage disposal — on land provided by the local Jain Mandir committee.",
      image: "/images/rural/sanitation-block-1.jpeg",
    },
  ],
} as const;

export const shantiStambh = {
  gutter: "Cultural Landmark",
  heading: "Shanti Stambh",
  paragraphs: [
    "Rural infrastructure can also carry cultural memory forward. ASSF constructed the Shanti Stambh at Yarnal in memory of Pratham Acharya Shri Shantisagarji Maharaj — a six-foot statue above the stambh, with engraved panels depicting his life on all four sides.",
    "It was inaugurated on 8 February 2020, in the presence of Acharya Shri 108 Vardhaman Sagarji Maharaj and his Sangh, with Dr. D. Veerendra Heggade participating.",
  ],
  image: "/images/rural/shanti-stambh.png",
} as const;

export const method = {
  gutter: "How We Work",
  heading: "Beginning with the need, not the structure",
  steps: [
    { title: "Listen & assess", body: "Understand the request from a community or institution, then assess the site." },
    { title: "Define the purpose", body: "Establish what the facility must enable, and for whom." },
    { title: "Plan carefully", body: "Develop plans with appropriate architectural and technical input." },
    { title: "Build or facilitate", body: "Undertake the work directly, or help connect communities with public authorities." },
    { title: "Create long-term value", body: "Focus on what stays useful to the community after the project ends." },
  ],
} as const;
