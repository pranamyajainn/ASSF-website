/**
 * Our Guiding Lights (it replaced Trustees, page designs Nov 2026): each
 * trustee and advisor card shows a short description (`body`); the full
 * profile from the Foundation's "Trustee Intro" document of 26 October 2026
 * (`bio`) opens from "Read full profile". The trustee portal reads these too.
 */
export const pageHero = {
  question: "Our Guiding",
  label: "Lights",
  eyebrow: "About Us",
  title: "Our Guiding Lights",
  body: "Every lamp is lit by another. Our trustees give the Foundation its direction and its conscience. Our advisors bring the wisdom of scholarship and public service. And our team carries that light, every day, to the laboratory bench, the health camp and the village.",
} as const;

/** The two boards' section openers (page designs, Nov 2026). */
export const board = {
  question: "Board of",
  label: "Trustees",
  heading: "Our Founder Trustees",
  lede: "Nine trustees from public life, industry and Jain educational institutions, united by one belief: that caring for heritage and caring for people are the same work.",
} as const;

export const advisory = {
  question: "Advisory",
  label: "Board",
  heading: "Our Advisory Board",
  lede: "Scholars and leaders who lend their knowledge and experience, so that every programme rests on sound judgement and care.",
} as const;

export const trustees = [
  {
    name: "Rajarshi Dharmadhikari Dr. D. Veerendra Heggade",
    rank: "Param Samrakshak, Margadarshak & Founder Trustee",
    body: "Dharmadhikari of Shri Kshetra Dharmasthala and Padma Vibhushan awardee, whose blessing and guidance watch over the Foundation's care for heritage.",
    bio: ["Hereditary Dharmadhikari of Shri Kshetra Dharmasthala; Padma Vibhushan and Padma Bhushan awardee; nominated to the Rajya Sabha in 2022. Long record in rural development, education and cultural preservation. At ASSF he is the guiding patron of the mission, lending institutional standing to the Foundation's approach to custodial institutions and counselling the Board on the preservation of religious and cultural heritage."],
    image: "/images/trustees/oct26/veerendra-heggade.jpg",
  },
  {
    name: "Shri Ashok Patni",
    rank: "Settlor, Visionary & Founder Trustee",
    body: "Chairman Emeritus of the R.K. Group, who founded the Trust in 2019 and gave it its long view.",
    bio: ["Chairman Emeritus of the R.K. Group and founder of R.K. Marble, a principal force behind Wonder Cement. As Settlor he constituted the Trust and endowed its founding corpus, and he continues to set the long-term direction of the Foundation's heritage and community mandate."],
    image: "/images/trustees/oct26/ashok-patni.jpg",
  },
  {
    name: "Shri Rajendra Kumar Kataria",
    rank: "Working President & Founder Trustee",
    body: "Head of Kataria Automobiles, guiding the delivery of our work at every site.",
    bio: ["Head of Kataria Automobiles Pvt. Ltd.; philanthropic work in education, health and environment. As Working President, he holds executive responsibility for the conservation Project, the progress of work at each site, the deployment of conservation teams and the delivery of the Foundation's project commitments."],
    image: "/images/trustees/oct26/rajendra-kumar-kataria.jpg",
  },
  {
    name: "Shri Anil Kumar Sethi",
    rank: "President & Founder Trustee",
    body: "Chairman of the ADD Group, whose visit to Moodbidri set our manuscript work in motion.",
    bio: ["Chairman of the ADD Group; infrastructure leader associated with SPML Infra; founder of Pump Academy and iPUMPNET. As President he leads the Foundation's outreach and representation, institutional relationships, and the convening of events through which the conservation work is presented to donors, custodians and the wider community."],
    image: "/images/trustees/oct26/anil-kumar-sethi.jpg",
  },
  {
    name: "Shri Suresh Sablawat",
    rank: "Founder Trustee",
    body: "Head of Readiprint International, linking the Foundation with Jain trusts and their collections.",
    bio: ["Head of Readiprint International Pvt. Ltd. A trustee at major Jain institutions, he brings the Foundation its connection to the wider network of Jain trusts and repositories, through which collections needing conservation are identified and access is arranged."],
    image: "/images/trustees/oct26/suresh-sablawat.jpg",
  },
  {
    name: "Shri Vinod Doddanavar",
    rank: "Founder Trustee",
    body: "Secretary of the Bharatesh Education Trust, who brought our service to the villages of Belagavi.",
    bio: ["Secretary, Bharatesh Education Trust; background in pharmaceutical research and academia, national Jain community leadership roles. He connects the mission to educational and academic institutions and to community leadership, and served as National Secretary during the Bahubali Mahamastakabhisheka at Shravanabelagola in 2018."],
    image: "/images/trustees/oct26/vinod-doddanavar.jpg",
  },
  {
    name: "Shri Rakesh Kumar Jain",
    rank: "Secretary, Treasurer & Founder Trustee",
    body: "Chartered accountant and company secretary, the steady hand behind the Foundation's finances.",
    bio: ["FCA and FCS; expertise in insolvency, valuation and corporate governance. He manages the finances of the Foundation — budgets, financial controls, statutory accounts and audit, and the utilisation reporting that accompanies grant-supported work."],
    image: "/images/trustees/oct26/rakesh-kumar-jain.jpg",
  },
  {
    name: "Shri Ashok Kumar Jain",
    rank: "Founder Trustee",
    body: "A long-standing leader of Shravanabelagola's institutions and Karnataka's tirth kshetras.",
    bio: ["Senior positions across national and regional Jain community bodies, involved in the management of Shravanabelagola institutions and Karnataka tirth kshetras. He maintains the Foundation's custodial relationships with repositories in Karnataka, on which site access and post-project preservation depend."],
    image: "/images/trustees/oct26/ashok-kumar-jain.jpg",
  },
  {
    name: "Prof. D. A. Appa Patil",
    rank: "Founder Trustee",
    body: "Educationist, author and scholar of Jain philosophy and literature.",
    bio: ["Professor D. A. Appa Patil is an educationist, author and scholar with a sustained engagement with Jain philosophy, literature and spiritual heritage. As a Founder Trustee, he brings this academic and cultural perspective to ASSF’s mission of conserving India’s manuscript heritage and safeguarding the knowledge contained within it for future generations."],
    image: "/images/trustees/oct26/appa-patil.jpg",
  },
] as const;

export const advisors = [
  {
    name: "Shri Rajeev Jain",
    rank: "Chief Advisor",
    body: "Former Director General, Press Information Bureau, Government of India, guiding our institutional growth and public voice.",
    bio: ["An officer of the Indian Information Service (1991 batch) who retired as Director General of the Press Information Bureau after three decades leading government communications across the Ministries of Finance, Defence, Petroleum and Natural Gas, Commerce and Industry, Housing and Urban Affairs, and Railways. He has served as a government nominee director on public sector boards, bringing governance and institutional oversight experience. As Chief Advisor he guides ASSF on institutional development, government engagement and the public communication of the Foundation’s conservation work."],
    image: "/images/trustees/oct26/rajeev-jain.jpg",
  },
  {
    name: "Dr. Jasvant Modi",
    rank: "Advisory Board",
    body: "Board Member, Arihanta Institute, and Past President, Jain Center of Southern California, who has carried Jain studies into universities worldwide.",
    bio: ["A gastroenterologist who retired from practice in 2014 to give his time to philanthropy in healthcare and Jain education. Since 2015 he has endowed chairs, professorships, post-doctoral fellowships and graduate scholarships that have carried Jain studies into universities across North America and India, and in 2023 he received the Ahiṃsā Award from the Institute of Jainology at the UK House of Commons. On the ASSF Advisory Board he guides the Foundation’s engagement with the international Jain studies community and the scholarly use of its conserved manuscripts."],
    image: "/images/trustees/oct26/jasvant-modi.jpg",
  },
  {
    name: "Dr. Ashok Jetawat",
    rank: "Advisory Board",
    body: "Professor and Research Guide, Pacific University, advising on documentation and digital systems.",
    bio: ["An engineer and researcher in e-Governance, technology and management, holding a Doctorate in e-Governance from Mohanlal Sukhadia University alongside M.Tech. and MBA qualifications. He has published over forty research papers, guides doctoral scholars at Pacific University, and received the Scroll of Honour from The Institution of Engineers (India) for his services to the engineering fraternity. On the ASSF Advisory Board he advises on the technological and systems dimensions of the Foundation’s manuscript documentation and digitization Project."],
    image: "/images/trustees/oct26/ashok-jetawat.jpg",
  },
  {
    name: "Dr. Priyadarshana Jain",
    rank: "Advisory Board",
    body: "Associate Professor and Head (i/c), Department of Jainology, University of Madras, guiding the scholarly care of our collections.",
    bio: ["A scholar of Jain philosophy, logic and metaphysics, Prakrit language and literature, Jaina scriptures and Indian culture, with M.A., M.Phil. and Ph.D. in Jainology. Her edited works include Essence of Samayasara and Essence of Niyamasāra, and she has long been associated with institutions engaged in Jainology and Prakrit research. On the ASSF Advisory Board she provides academic and subject-matter guidance on the conservation, documentation and digitization of the Foundation’s manuscript collections."],
    image: "/images/trustees/oct26/priyadarshana-jain.jpg",
  },
] as const;

/** The team, after the page designs (Nov 2026): a group photograph, the three who lead the work, and thanks to the many hands behind them. */
export const team = {
  question: "Our",
  label: "Team",
  heading: "The Hands That Carry the Work",
  image: { src: "/images/pages/guiding-lights/team.jpg", alt: "The ASSF conservation team at Karanja Lad" },
  members: [
    { name: "Alka Mehta", rank: "Manager, Foundation Operations", body: "Holds the Foundation's operations together, from people and programmes to partners and sites." },
    { name: "Kartick Kayal", rank: "Conservation Project Lead", body: "Leads our conservation work across sites, from the first condition survey to the final archival box." },
    { name: "Dipanjan Modak", rank: "Site Lead, Shravanabelagola", body: "Guides the daily work of our palm-leaf laboratory at Bahubali Prakrit Bhawan." },
  ],
  thanks: "Behind every folio made whole and every family served stand many more hands: our conservators, assistant conservators, interns, volunteers, doctors and the colleagues who walk alongside us. To each of them, our heartfelt gratitude. This work is theirs as much as ours.",
  invite: "Would you like to bring your skill to this work?",
  buttons: [
    { label: "See careers", href: "/careers" },
    { label: "Write to us", href: "#contact" },
  ],
} as const;
