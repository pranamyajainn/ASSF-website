/**
 * Content shared across every page: organisation identity, primary nav,
 * language switcher and the site-wide `Pending` convention.
 *
 * `Pending<T>` marks a fact the Foundation has not supplied. It renders as a
 * dashed placeholder rather than a guess or a zero — see `Pending` in
 * components/site/primitives.tsx. Apply it consistently: a number we cannot
 * source belongs here, not filled in.
 */
export type Pending<T> = T | null;

export const org = {
  nameDeva: "आचार्य शांति सागर फाउंडेशन",
  nameLatin: "Acharya Shanti Sagar Foundation",
  /** How each edition names the Foundation: large in the colophon, then in
      its other script beneath. The Hindi and Kannada editions swap these. */
  displayName: "Acharya Shanti Sagar Foundation",
  secondaryName: "आचार्य शांति सागर फाउंडेशन",
  /** The name in the edition's own Indian script, above the hero headline. */
  nameNative: "आचार्य शांति सागर फाउंडेशन",
  tagline: "जीवन धरोहर संरक्षण",
  brandLine: "In Service of Heritage and Humanity",
  sealDeva: "शांति सागरम्",
  founded: 2019,
  registration: "GAN-4-00431-2018-19",
  phone: "+91 8095588411",
  email: "info@shantisagarfoundation.org",
  office:
    "A1, Office Building, 2nd Floor, Epsilon Residential Villas, Yamlur Main Road, next to CGI, Bengaluru 560037, Karnataka",
  bank: {
    branch: "IndusInd Bank, M G Road, Bengaluru 560001",
    account: "SB A/c 100118813667",
    ifsc: "IFSC INDB0000008",
  },
} as const;

export const folioPrice = 414;
export const tributePrice = 9938;

export const nav = [
  { label: "About", href: "/about" },
  { label: "Manuscript Conservation", href: "/manuscript-conservation" },
  { label: "Rural Infrastructure", href: "/rural-infrastructure" },
  { label: "Community Services", href: "/community-services" },
  { label: "Impact", href: "/impact" },
  { label: "Trustees", href: "/trustees" },
] as const;

export const languages = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिन्दी" },
  { code: "kn", label: "ಕನ್ನಡ" },
] as const;

/**
 * The three pillars, in the order and naming the Foundation confirmed:
 * Manuscript Conservation / Rural Infrastructure / Community Services.
 * Reused on the homepage and About page.
 */
export const pillars = [
  {
    slug: "manuscript-conservation",
    label: "Manuscript Conservation",
    tagline: "Preserving Knowledge Written by Hand",
    body: "Scientific conservation of fragile palm-leaf and handwritten-paper manuscripts — assessed, treated, documented, digitised and returned to their custodians.",
  },
  {
    slug: "rural-infrastructure",
    label: "Rural Infrastructure",
    tagline: "Creating Spaces That Serve Communities",
    body: "Community halls, staff accommodation and public sanitation built where a missing facility limits what a village can do.",
  },
  {
    slug: "community-services",
    label: "Community Services",
    tagline: "Responding Where the Need Is Immediate",
    body: "Free medical camps, education support and emergency relief, shaped by what each community is actually facing.",
  },
] as const;
