/**
 * Trustee and advisor profiles, word for word from the Foundation's
 * "Trustee Intro" document of 26 October 2026 (sections 4.2 and 4.3), in
 * its order, with its photographs. Each `body` is the approved profile;
 * `bio` is optional, for a longer profile opened on demand.
 */
export const pageHero = {
  eyebrow: "Leadership & Governance",
  title: "The Guardians",
  body: "Acharya Shanti Sagar Foundation is guided by trustees and advisors who bring diverse expertise and a shared commitment to heritage preservation and community welfare.",
} as const;

/** The two introductions from the same document, §4.2 and §4.3. */
export const intros = {
  governance: "The Foundation is governed by a Board of Trustees drawn from industry, public institutions and the Jain religious and educational establishment. The Board sets strategy, approves budgets and exercises fiduciary oversight; Project execution rests with the operations and conservation leadership reporting to it.",
  advisory: "The conservation and digitization mission is strengthened by an Advisory Board of distinguished leaders drawn from public policy, institutional leadership, and philanthropy, bringing diverse expertise and strategic perspective to the Foundation’s work.",
} as const;

export const trustees = [
  {
    name: "Rajashri Dharmadhikari Dr. D. Veerendra Heggade",
    rank: "Param Samrakshak, Margadarshak & Founder Trustee",
    body: "Hereditary Dharmadhikari of Shri Kshetra Dharmasthala; Padma Vibhushan and Padma Bhushan awardee; nominated to the Rajya Sabha in 2022. Long record in rural development, education and cultural preservation. At ASSF he is the guiding patron of the mission, lending institutional standing to the Foundation's approach to custodial institutions and counselling the Board on the preservation of religious and cultural heritage.",
    image: "/images/trustees/oct26/veerendra-heggade.jpg",
  },
  {
    name: "Shri Ashok Patni",
    rank: "Settlor, Visionary & Founder Trustee",
    body: "Chairman Emeritus of the R.K. Group and founder of R.K. Marble, a principal force behind Wonder Cement. As Settlor he constituted the Trust and endowed its founding corpus, and he continues to set the long-term direction of the Foundation's heritage and community mandate.",
    image: "/images/trustees/oct26/ashok-patni.jpg",
  },
  {
    name: "Shri Rajendra Kumar Kataria",
    rank: "Working President & Founder Trustee",
    body: "Head of Kataria Automobiles Pvt. Ltd.; philanthropic work in education, health and environment. As Working President, he holds executive responsibility for the conservation Project, the progress of work at each site, the deployment of conservation teams and the delivery of the Foundation's project commitments.",
    image: "/images/trustees/oct26/rajendra-kumar-kataria.jpg",
  },
  {
    name: "Shri Anil Kumar Sethi",
    rank: "President & Founder Trustee",
    body: "Chairman of the ADD Group; infrastructure leader associated with SPML Infra; founder of Pump Academy and iPUMPNET. As President he leads the Foundation's outreach and representation, institutional relationships, and the convening of events through which the conservation work is presented to donors, custodians and the wider community.",
    image: "/images/trustees/oct26/anil-kumar-sethi.jpg",
  },
  {
    name: "Shri Suresh Sablawat",
    rank: "Founder Trustee",
    body: "Head of Readiprint International Pvt. Ltd. A trustee at major Jain institutions, he brings the Foundation its connection to the wider network of Jain trusts and repositories, through which collections needing conservation are identified and access is arranged.",
    image: "/images/trustees/oct26/suresh-sablawat.jpg",
  },
  {
    name: "Shri Vinod Doddanavar",
    rank: "Founder Trustee",
    body: "Secretary, Bharatesh Education Trust; background in pharmaceutical research and academia, national Jain community leadership roles. He connects the mission to educational and academic institutions and to community leadership, and served as National Secretary during the Bahubali Mahamastakabhisheka at Shravanabelagola in 2018.",
    image: "/images/trustees/oct26/vinod-doddanavar.jpg",
  },
  {
    name: "Shri Rakesh Kumar Jain",
    rank: "Secretary, Treasurer & Founder Trustee",
    body: "FCA and FCS; expertise in insolvency, valuation and corporate governance. He manages the finances of the Foundation — budgets, financial controls, statutory accounts and audit, and the utilisation reporting that accompanies grant-supported work.",
    image: "/images/trustees/oct26/rakesh-kumar-jain.jpg",
  },
  {
    name: "Shri Ashok Kumar Jain",
    rank: "Founder Trustee",
    body: "Senior positions across national and regional Jain community bodies, involved in the management of Shravanabelagola institutions and Karnataka tirth kshetras. He maintains the Foundation's custodial relationships with repositories in Karnataka, on which site access and post-project preservation depend.",
    image: "/images/trustees/oct26/ashok-kumar-jain.jpg",
  },
  {
    name: "Prof. D. A. Appa Patil",
    rank: "Founder Trustee",
    body: "Professor D. A. Appa Patil is an educationist, author and scholar with a sustained engagement with Jain philosophy, literature and spiritual heritage. As a Founder Trustee, he brings this academic and cultural perspective to ASSF’s mission of conserving India’s manuscript heritage and safeguarding the knowledge contained within it for future generations.",
    image: "/images/trustees/oct26/appa-patil.jpg",
  },
] as const;

export const advisors = [
  {
    name: "Shri Rajeev Jain",
    rank: "Chief Advisor, Acharya Shanti Sagar Foundation | Former Director General, Press Information Bureau, Government of India",
    body: "An officer of the Indian Information Service (1991 batch) who retired as Director General of the Press Information Bureau after three decades leading government communications across the Ministries of Finance, Defence, Petroleum and Natural Gas, Commerce and Industry, Housing and Urban Affairs, and Railways. He has served as a government nominee director on public sector boards, bringing governance and institutional oversight experience. As Chief Advisor he guides ASSF on institutional development, government engagement and the public communication of the Foundation’s conservation work.",
    image: "/images/trustees/oct26/rajeev-jain.jpg",
  },
  {
    name: "Dr. Jasvant Modi",
    rank: "Board Member, Arihanta Institute | Past President, Jain Center of Southern California",
    body: "A gastroenterologist who retired from practice in 2014 to give his time to philanthropy in healthcare and Jain education. Since 2015 he has endowed chairs, professorships, post-doctoral fellowships and graduate scholarships that have carried Jain studies into universities across North America and India, and in 2023 he received the Ahiṃsā Award from the Institute of Jainology at the UK House of Commons. On the ASSF Advisory Board he guides the Foundation’s engagement with the international Jain studies community and the scholarly use of its conserved manuscripts.",
    image: "/images/trustees/oct26/jasvant-modi.jpg",
  },
  {
    name: "Dr. Ashok Jetawat",
    rank: "Professor and Research Guide, Pacific University | Chairman, Motivational Society of Achiever",
    body: "An engineer and researcher in e-Governance, technology and management, holding a Doctorate in e-Governance from Mohanlal Sukhadia University alongside M.Tech. and MBA qualifications. He has published over forty research papers, guides doctoral scholars at Pacific University, and received the Scroll of Honour from The Institution of Engineers (India) for his services to the engineering fraternity. On the ASSF Advisory Board he advises on the technological and systems dimensions of the Foundation’s manuscript documentation and digitization Project.",
    image: "/images/trustees/oct26/ashok-jetawat.jpg",
  },
  {
    name: "Dr. Priyadarshana Jain",
    rank: "Associate Professor and Head (i/c), Department of Jainology, University of Madras, Chennai",
    body: "A scholar of Jain philosophy, logic and metaphysics, Prakrit language and literature, Jaina scriptures and Indian culture, with M.A., M.Phil. and Ph.D. in Jainology. Her edited works include Essence of Samayasara and Essence of Niyamasāra, and she has long been associated with institutions engaged in Jainology and Prakrit research. On the ASSF Advisory Board she provides academic and subject-matter guidance on the conservation, documentation and digitization of the Foundation’s manuscript collections.",
    image: "/images/trustees/oct26/priyadarshana-jain.jpg",
  },
] as const;
