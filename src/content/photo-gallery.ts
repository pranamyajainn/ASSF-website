/**
 * The Gallery: photos and films in folders, after the Foundation's page
 * designs (Nov 2026). It opens with the latest event as a slideshow and a
 * short film beside it; then four folders, each holding sub-folders of
 * photos and films. Every photo opens full size, and the arrows step
 * through its sub-folder.
 *
 * A film's `url` is one of the site's own clips in /videos (with its
 * `poster` and length) or a YouTube link the Foundation pastes in the site
 * editor — a film is too large to upload through the editor. A link that
 * is neither is left off rather than shown broken.
 */
const P = "/images/pages/gallery/";

export type Film = { title: string; caption: string; url: string; poster: string; duration: string; captions: string };
type Photo = { src: string; alt: string };
export type Folder = { name: string; sub: string; note: string; photos: Photo[]; videos: Film[] };

/** §1, the latest event: its photos as a slideshow, "See all photos" opens the first folder. */
export const pageHero = {
  question: "Gallery",
  label: "Photos and films",
  tag: "Latest",
  date: "October 2025 · Shravanabelagola",
  title: "Folio by Folio, in Our Laboratory",
  body: "Our conservators at work on palm-leaf granthas at Bahubali Prakrit Bhawan.",
  button: "See all photos",
  slides: [
    { src: `${P}lab-at-work.jpg`, alt: "Conservators at work in our Shravanabelagola laboratory" },
    { src: `${P}sbg-granthas.jpg`, alt: "Palm-leaf granthas laid out at the start of the programme" },
    { src: `${P}hero-conservation.jpg`, alt: "Mending a palm leaf with Japanese tissue" },
    { src: `${P}palm-swab.jpg`, alt: "Cleaning a palm leaf, one line at a time" },
  ],
  filmLabel: "Film",
  film: { title: "The lab at work", caption: "Conservators at their tables, each working on a manuscript.", url: "/videos/gallery/the-lab-at-work.mp4", poster: "/videos/gallery/the-lab-at-work.jpg", duration: "0:41", captions: "" },
};

/** §2, the folders. */
export const gallery = {
  question: "Photos",
  label: "and videos",
  heading: "Photos and Videos",
  folders: [
  {
    name: "Latest Events",
    line: "What is happening now, as it happens.",
    subs: [
      {
        name: "Our Shravanabelagola Laboratory at Work",
        sub: "October 2025 · Shravanabelagola",
        note: "Conservators at work on palm-leaf granthas at Bahubali Prakrit Bhawan.",
        photos: [
          { src: `${P}lab-at-work.jpg`, alt: "Conservators at work in the laboratory" },
          { src: `${P}sbg-granthas.jpg`, alt: "Palm-leaf granthas laid out at the start of the programme" },
          { src: `${P}hero-conservation.jpg`, alt: "Mending a palm leaf with Japanese tissue" },
          { src: `${P}palm-swab.jpg`, alt: "Cleaning a palm leaf, one line at a time" },
        ],
        videos: [],
      },
    ],
  },
  {
    name: "Manuscript Conservation",
    line: "Our laboratories, site by site.",
    subs: [
      {
        name: "Shravanabelagola",
        sub: "Bahubali Prakrit Bhawan · since July 2025",
        note: "Our laboratory beside one of the largest palm-leaf collections we care for: 2,695 granthas, conserved folio by folio.",
        photos: [
          { src: `${P}sbg-granthas.jpg`, alt: "Palm-leaf granthas laid out at the start of the programme" },
          { src: `${P}lab-at-work.jpg`, alt: "Conservators at work in the laboratory" },
          { src: `${P}hero-conservation.jpg`, alt: "Mending a palm leaf with Japanese tissue" },
          { src: `${P}palm-swab.jpg`, alt: "Cleaning a palm leaf, one line at a time" },
          { src: `${P}lab-shravanabelagola.jpg`, alt: "The laboratory at Bahubali Prakrit Bhawan" },
          { src: `${P}palm-cleaning.jpg`, alt: "Surface cleaning of a palm-leaf folio" },
        ],
        videos: [],
      },
      {
        name: "Karanja Lad",
        sub: "Gurukul Ashram, Balatkar Gan Mandir, Sengan Temple · since 2024",
        note: "Two of the town's four historic repositories conserved, and the Sengan Temple collection next.",
        photos: [
          { src: `${P}karanja-ashram.jpg`, alt: "Shri Mahaveer Gurukul Brahmacharya Ashram, Karanja Lad" },
          { src: `${P}team-karanja.jpg`, alt: "Our conservation team at Karanja Lad" },
          { src: `${P}treatment-bath.jpg`, alt: "A folio in treatment" },
          { src: `${P}repair-tear.jpg`, alt: "Mending a tear with fine tissue" },
          { src: `${P}painted-folio.jpg`, alt: "A painted motif within the collection" },
          { src: `${P}paper-damaged.jpg`, alt: "A paper manuscript before conservation" },
        ],
        videos: [
          { title: "The lab at work", caption: "Conservators at their tables, each working on a manuscript.", url: "/videos/gallery/the-lab-at-work.mp4", poster: "/videos/gallery/the-lab-at-work.jpg", duration: "0:41", captions: "" },
          { title: "Arriving at the conservation lab", caption: "Visitors walk into the conservation lab reciting the Namokar Mantra.", url: "/videos/gallery/arriving-at-the-lab.mp4", poster: "/videos/gallery/arriving-at-the-lab.jpg", duration: "2:18", captions: "" },
          { title: "To a visiting group", caption: "Recorded at Karanja Lad, where the Foundation's conservation work is under way.", url: "/videos/voices/karanja-visit.mp4", poster: "/videos/voices/karanja-visit.jpg", duration: "1:46", captions: "/videos/voices/karanja-visit" },
          { title: "A talk in the lab", caption: "In Hindi: how a manuscript is checked when it reaches the lab, and treated if insects or fungus have reached it.", url: "/videos/gallery/talk-in-the-lab.mp4", poster: "/videos/gallery/talk-in-the-lab.jpg", duration: "1:28", captions: "" },
        ],
      },
      {
        name: "Kumbhoj",
        sub: "Kumbhoj Bahubali, Kolhapur · 2022 to 2024",
        note: "Our first laboratory: 1,399 manuscripts and archival books, all conserved and digitised.",
        photos: [
          { src: `${P}kumbhoj-site.jpg`, alt: "Kumbhoj Bahubali" },
          { src: `${P}conservator-kumbhoj.jpg`, alt: "A conservator at work at Kumbhoj" },
          { src: `${P}kumbhoj-folios.jpg`, alt: "Paper folios after conservation" },
          { src: `${P}paper-cleaning.jpg`, alt: "Cleaning a paper folio" },
          { src: `${P}paper-conserved.jpg`, alt: "A conserved manuscript in its wrapper" },
          { src: `${P}boxes-shelf.jpg`, alt: "Conserved manuscripts in archival boxes" },
        ],
        videos: [],
      },
      {
        name: "Visits and Blessings",
        sub: "At our laboratories",
        note: "Revered Munis, Swamijis and visitors who came to bless the work.",
        photos: [
          { src: `${P}sbg-inauguration.jpg`, alt: "The inauguration at Shravanabelagola" },
          { src: `${P}swamiji-lab.jpg`, alt: "A Swamiji visits the laboratory" },
          { src: `${P}munis-lab.jpg`, alt: "Revered Munis at our laboratory" },
          { src: `${P}sbg-lab-visit.jpg`, alt: "Visitors look on as a scroll is unrolled" },
          { src: `${P}visitors-kumbhoj.jpg`, alt: "Visitors at the conservation table, Kumbhoj" },
          { src: `${P}founder-lab.jpg`, alt: "Shri Ashok Patni at the Shravanabelagola laboratory" },
        ],
        videos: [
          { title: "A blessing from Muni Shri 108 Subrat Sagar Ji Maharaj", caption: "A blessing, recorded at Karanja", url: "/videos/voices/maharaj-ji.mp4", poster: "/videos/voices/maharaj-ji.jpg", duration: "1:24", captions: "/videos/voices/maharaj-ji" },
          { title: "A puja beside the manuscripts", caption: "A puja around a manuscript bundle in the conservation lab, followed by a short address in Marathi.", url: "/videos/gallery/puja-in-the-lab.mp4", poster: "/videos/gallery/puja-in-the-lab.jpg", duration: "1:18", captions: "" },
          { title: "Munis visit the lab", caption: "Jain munis watch as a conservator shows them a bundle of palm-leaf manuscripts.", url: "/videos/gallery/munis-visit-the-lab.mp4", poster: "/videos/gallery/munis-visit-the-lab.jpg", duration: "0:28", captions: "" },
        ],
      },
      {
        name: "How a Manuscript Is Treated",
        sub: "In our laboratories, step by step",
        note: "Short films of the work at the conservation table, from damaged pages to finished leaves.",
        photos: [],
        videos: [
          { title: "Damaged pages, before treatment", caption: "Paper manuscript pages with torn and missing edges, laid out before conservation.", url: "/videos/gallery/damaged-pages-before-treatment.mp4", poster: "/videos/gallery/damaged-pages-before-treatment.jpg", duration: "1:09", captions: "" },
          { title: "Separating the pages of an archival book", caption: "Conservators lift and clean the pages of a printed book in Devanagari, one leaf at a time.", url: "/videos/gallery/book-pages-separated.mp4", poster: "/videos/gallery/book-pages-separated.jpg", duration: "1:07", captions: "" },
          { title: "Dry-cleaning a page", caption: "A page of archival book AB-017, cleaned with a soft brush and an air blower.", url: "/videos/gallery/dry-cleaning-a-page.mp4", poster: "/videos/gallery/dry-cleaning-a-page.jpg", duration: "0:27", captions: "" },
          { title: "Brushing a long folio clean", caption: "A soft brush run along a long paper folio with a painted border.", url: "/videos/gallery/brushing-a-long-folio.mp4", poster: "/videos/gallery/brushing-a-long-folio.jpg", duration: "0:16", captions: "" },
          { title: "Cleaning a stain with a swab", caption: "A cotton swab worked along the water-stained edge of a paper manuscript page.", url: "/videos/gallery/swab-cleaning-a-page.mp4", poster: "/videos/gallery/swab-cleaning-a-page.jpg", duration: "1:08", captions: "" },
          { title: "Solvent cleaning and cellotape removal", caption: "Old cellotape lifted from palm leaf PL/598 with solvent, cotton swabs, tweezers and a scalpel.", url: "/videos/gallery/cellotape-removal-palm-leaf.mp4", poster: "/videos/gallery/cellotape-removal-palm-leaf.jpg", duration: "3:26", captions: "" },
          { title: "Washing a paper page", caption: "A paper manuscript page washed in a shallow water bath.", url: "/videos/gallery/washing-a-paper-page.mp4", poster: "/videos/gallery/washing-a-paper-page.jpg", duration: "1:44", captions: "" },
          { title: "Brushing paste over pages", caption: "Paper pages laid out under a thin sheet and brushed over with paste.", url: "/videos/gallery/brushing-paste-over-pages.mp4", poster: "/videos/gallery/brushing-paste-over-pages.jpg", duration: "0:31", captions: "" },
          { title: "Cutting board to size", caption: "A strip of board cut to size on a board cutter in the lab.", url: "/videos/gallery/cutting-archival-board.mp4", poster: "/videos/gallery/cutting-archival-board.jpg", duration: "0:17", captions: "" },
          { title: "An illustrated manuscript, leaf by leaf", caption: "The painted leaves of an illustrated paper manuscript, turned one by one.", url: "/videos/gallery/illustrated-manuscript.mp4", poster: "/videos/gallery/illustrated-manuscript.jpg", duration: "1:44", captions: "" },
        ],
      },
    ],
  },
  {
    name: "Community Services",
    line: "Health, education and relief, wherever the need arose.",
    subs: [
      {
        name: "Free Health Camps",
        sub: "Raichur, Bengaluru, Mandya, Belagavi · 2019",
        note: "Five free camps with specialist doctors, caring for more than 3,500 people.",
        photos: [
          { src: `${P}camp-mandya.jpg`, alt: "Children at the camp in Dadagadapura, Mandya" },
          { src: `${P}camp-children.jpg`, alt: "A doctor checks the youngest" },
          { src: `${P}camp-mandya-2.jpg`, alt: "The Mandya camp, 30 June 2019" },
          { src: `${P}camp-banner.jpg`, alt: "Our camp team in Belagavi district" },
          { src: `${P}camp-consult.jpg`, alt: "A consultation at one of our camps" },
          { src: `${P}camp-blood.jpg`, alt: "Blood donation, Bengaluru" },
        ],
        videos: [],
      },
      {
        name: "Books for Village Schools",
        sub: "Near Yarnal, Belagavi district",
        note: "Books and stationery for nearly 500 students in three village schools.",
        photos: [
          { src: `${P}books-yarnal.jpg`, alt: "Schoolchildren with their new books" },
          { src: `${P}books-yarnal-2.jpg`, alt: "Books handed over by our team" },
          { src: `${P}books-yarnal-3.jpg`, alt: "Distribution at a village school" },
          { src: `${P}education.jpg`, alt: "Young students and their books" },
        ],
        videos: [],
      },
      {
        name: "Food and Relief Distribution",
        sub: "Belagavi floods 2019 · Bengaluru lockdown 2020",
        note: "Relief kits for six flood-hit villages, and meals and grain for families across Bengaluru through the lockdown.",
        photos: [
          { src: `${P}flood-kit.jpg`, alt: "A relief kit reaches an elder" },
          { src: `${P}flood-sacks.jpg`, alt: "Kits ready for families" },
          { src: `${P}flood-village.jpg`, alt: "Relief arrives in a flood-hit village" },
          { src: `${P}relief-2.jpg`, alt: "A meal at the doorstep" },
          { src: `${P}relief-1.jpg`, alt: "Food packets for families" },
          { src: `${P}covid-kits.jpg`, alt: "Grain kits for women and families" },
          { src: `${P}relief-3.jpg`, alt: "Volunteers in the neighbourhood" },
          { src: `${P}covid-kitchen.jpg`, alt: "Meals being prepared" },
        ],
        videos: [],
      },
    ],
  },
  {
    name: "Rural Infrastructure",
    line: "Spaces built with the villages that asked for them.",
    subs: [
      {
        name: "Samudaya Bhavan, Yarnal",
        sub: "Yarnal, Belagavi district",
        note: "A community hall, dining hall, kitchen and dharamshala, on land given by community members.",
        photos: [
          { src: `${P}hero-infrastructure.jpg`, alt: "The Samudaya Bhavan, Yarnal" },
          { src: `${P}yarnal-build.jpg`, alt: "The Bhavan under construction" },
        ],
        videos: [],
      },
      {
        name: "Teachers' Resting Space, Hosur",
        sub: "Hosur, Belagavi district",
        note: "An old building turned into 14 rooms where teachers can rest.",
        photos: [
          { src: `${P}hosur-1.jpg`, alt: "The teachers' resting space, Hosur" },
          { src: `${P}hosur-2.jpg`, alt: "The Hosur building" },
          { src: `${P}quarters-room.jpg`, alt: "Rooms being partitioned inside" },
        ],
        videos: [],
      },
      {
        name: "Clean Sanitation",
        sub: "Schools and villages",
        note: "Toilet blocks for schools and villages, and public blocks at Yarnal.",
        photos: [
          { src: `${P}sanitation-1.jpg`, alt: "Public sanitation block, Yarnal" },
          { src: `${P}toilet-block.jpg`, alt: "A new toilet block" },
        ],
        videos: [],
      },
    ],
  },
  ] as { name: string; line: string; subs: Folder[] }[],
};
