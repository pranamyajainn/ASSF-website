/**
 * Community Services page copy. Figures reconcile across the Community
 * Services, Impact Page and Mission/Vision/Values documents — the aggregate
 * healthcare totals equal the sum of the named camps, so both are shown.
 *
 * Not included: the "Community Empowerment Scheme" (education loans,
 * micro-business loans, etc.) described in the Mission/Vision/Values
 * document. That programme is explicitly marked there as in planning, with
 * no confirmed launch date — publishing loan amounts and timelines for a
 * programme that does not yet exist would overstate what the Foundation
 * currently offers, so it is left out until it launches.
 */
export const pageHero = {
  eyebrow: "Community Services",
  title: "Service Where It Is Needed",
  body: "Heritage work does not stand apart from human need. ASSF responds to healthcare, education and emergency needs directly — understanding what a community requires, then acting on it.",
} as const;

export const healthcare = {
  gutter: "Healthcare",
  heading: "Taking specialist care closer to villages",
  body: "Free medical camps bring doctors and diagnostics to communities where specialist care is otherwise out of reach — with follow-up, not just a single day's consultation.",
  totals: [
    { label: "Beneficiaries screened", value: "3,500+" },
    { label: "Cataract surgeries", value: "251+" },
    { label: "Heart bypass surgeries", value: "5" },
    { label: "Spectacles distributed", value: "463+" },
  ],
  camps: [
    { place: "Irkal, Raichur", beneficiaries: "463", detail: "Cardiology, nephrology, neurology, ophthalmology — 5 heart bypasses, 35 cataract surgeries" },
    { place: "Dadagadapura, Mandya", beneficiaries: "1,100", detail: "Orthopaedic, cardiac, ENT, dental, ophthalmology — 463 spectacles, 138 cataract surgeries" },
    { place: "Yarnal, Belagavi", beneficiaries: "1,800", detail: "Cardiology, ophthalmology, gynaecology, dentistry — 78 cataract cases treated" },
  ],
  note: "Also included: dengue and chikungunya prevention camps for 48 beneficiaries, and blood-donation drives screening 178 participants and collecting 78 units.",
} as const;

export const education = {
  gutter: "Education Support",
  heading: "Helping children continue to learn",
  body: "ASSF studied schools around Yarnal and identified three serving children from economically disadvantaged backgrounds. Nearly 500 students received books and stationery — support chosen after understanding what each school actually needed.",
  image: "/images/community/education-support-2.jpeg",
} as const;

export const relief = {
  gutter: "Emergency Relief",
  heading: "Standing with communities in crisis",
  items: [
    {
      name: "North Karnataka & Maharashtra floods, 2019",
      body: "ASSF reached six villages with 2,000 food kits and 500 clothing kits, then extended direct financial support to 262 families rebuilding their homes.",
      image: "/images/community/relief-distribution-1.jpeg",
    },
    {
      name: "COVID-19 response, Bengaluru, 2020",
      body: "With Sakal Digambar Jain Samaj and volunteer networks, ASSF distributed 7,77,534 cooked meals and 2,795 food-grain kits across Bengaluru between 1 April and 3 May 2020.",
      image: "/images/community/relief-distribution-3.jpeg",
    },
  ],
} as const;

export const method = {
  gutter: "How We Work",
  heading: "Practical, and community-led",
  steps: [
    { title: "Understand", body: "Identify the need through direct engagement with local institutions." },
    { title: "Respond", body: "Provide support that addresses that specific need." },
    { title: "Collaborate", body: "Work with doctors, hospitals, schools, volunteers and local networks." },
    { title: "Reach", body: "Take assistance to communities with otherwise limited access." },
    { title: "Follow through", body: "Connect people with the next step, where further care is needed." },
  ],
} as const;
