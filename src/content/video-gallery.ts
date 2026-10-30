/**
 * The video gallery. It opens with the two recordings in the home page's
 * Voices (supplied by the Foundation, Sept 2026), titled and captioned as
 * they are there; their captions and transcripts stay with the Voices
 * (content/home.ts → voices.heard). The Foundation adds films in the site
 * editor (Video Gallery) by pasting a YouTube link — a film is too large to
 * upload through the editor, and YouTube plays it well on any phone.
 *
 * `url` is either a YouTube link or one of the site's own recordings in
 * /videos — a Voices recording, or a clip in /videos/gallery that carries
 * its own poster and size; a link that is neither is left off the page
 * rather than shown broken.
 */
export const pageHero = {
  eyebrow: "Video Gallery",
  title: "The work on film",
  body: "Films and recordings of the Foundation's work.",
} as const;

export type Film = {
  title: string;
  caption: string;
  url: string;
  /** For the site's own clips in /videos/gallery: the still shown before it plays, its frame and its length. */
  poster?: string;
  width?: number;
  height?: number;
  duration?: string;
  /** Captions, as /videos/…/name for name.en.vtt, name.hi.vtt and name.kn.vtt, when the clip has speech. */
  captions?: string;
};

export const gallery = {
  label: "Films",
  items: [
    {
      title: "Muni Shri 108 Subrat Sagar Ji Maharaj",
      caption: "A blessing, recorded at Karanja",
      url: "/videos/voices/maharaj-ji.mp4",
    },
    {
      title: "To a visiting group, at Karanja",
      caption: "Recorded at Karanja Lad, where the Foundation's conservation work is under way.",
      url: "/videos/voices/karanja-visit.mp4",
    },
    /*
     * The Foundation's clips (WeTransfer, 29 Oct 2026: "suggest video for
     * site"), encoded for the web and put in the order of the work: arriving
     * at the lab, the lab at work, a manuscript's treatment step by step,
     * and the finished leaves. Of near-repeats, the clearer take is used.
     * Titles and captions say only what can be seen or heard; where and
     * when each was filmed, and who is in it, waits for the Foundation.
     * Sound is kept where it carries something (the mantra, the speech) and
     * left off where it was room noise.
     */
    {
      title: "Arriving at the conservation lab",
      caption: "Visitors walk into the conservation lab reciting the Namokar Mantra.",
      url: "/videos/gallery/arriving-at-the-lab.mp4",
      poster: "/videos/gallery/arriving-at-the-lab.jpg",
      width: 1280,
      height: 720,
      duration: "2:18",
    },
    {
      title: "A puja beside the manuscripts",
      caption: "A puja around a manuscript bundle in the conservation lab, followed by a short address in Marathi.",
      url: "/videos/gallery/puja-in-the-lab.mp4",
      poster: "/videos/gallery/puja-in-the-lab.jpg",
      width: 1280,
      height: 720,
      duration: "1:18",
    },
    {
      title: "Munis visit the lab",
      caption: "Jain munis watch as a conservator shows them a bundle of palm-leaf manuscripts.",
      url: "/videos/gallery/munis-visit-the-lab.mp4",
      poster: "/videos/gallery/munis-visit-the-lab.jpg",
      width: 1280,
      height: 720,
      duration: "0:28",
    },
    {
      title: "The lab at work",
      caption: "Conservators at their tables, each working on a manuscript.",
      url: "/videos/gallery/the-lab-at-work.mp4",
      poster: "/videos/gallery/the-lab-at-work.jpg",
      width: 1280,
      height: 720,
      duration: "0:41",
    },
    {
      title: "A talk in the lab",
      caption: "In Hindi: how a manuscript is checked when it reaches the lab, and treated if insects or fungus have reached it.",
      url: "/videos/gallery/talk-in-the-lab.mp4",
      poster: "/videos/gallery/talk-in-the-lab.jpg",
      width: 1280,
      height: 720,
      duration: "1:28",
    },
    {
      title: "Damaged pages, before treatment",
      caption: "Paper manuscript pages with torn and missing edges, laid out before conservation.",
      url: "/videos/gallery/damaged-pages-before-treatment.mp4",
      poster: "/videos/gallery/damaged-pages-before-treatment.jpg",
      width: 1280,
      height: 720,
      duration: "1:09",
    },
    {
      title: "Separating the pages of an archival book",
      caption: "Conservators lift and clean the pages of a printed book in Devanagari, one leaf at a time.",
      url: "/videos/gallery/book-pages-separated.mp4",
      poster: "/videos/gallery/book-pages-separated.jpg",
      width: 1280,
      height: 720,
      duration: "1:07",
    },
    {
      title: "Dry-cleaning a page",
      caption: "A page of archival book AB-017, cleaned with a soft brush and an air blower.",
      url: "/videos/gallery/dry-cleaning-a-page.mp4",
      poster: "/videos/gallery/dry-cleaning-a-page.jpg",
      width: 1280,
      height: 720,
      duration: "0:27",
    },
    {
      title: "Brushing a long folio clean",
      caption: "A soft brush run along a long paper folio with a painted border.",
      url: "/videos/gallery/brushing-a-long-folio.mp4",
      poster: "/videos/gallery/brushing-a-long-folio.jpg",
      width: 1280,
      height: 720,
      duration: "0:16",
    },
    {
      title: "Cleaning a stain with a swab",
      caption: "A cotton swab worked along the water-stained edge of a paper manuscript page.",
      url: "/videos/gallery/swab-cleaning-a-page.mp4",
      poster: "/videos/gallery/swab-cleaning-a-page.jpg",
      width: 720,
      height: 1280,
      duration: "1:08",
    },
    {
      title: "Solvent cleaning and cellotape removal",
      caption: "Old cellotape lifted from palm leaf PL/598 with solvent, cotton swabs, tweezers and a scalpel.",
      url: "/videos/gallery/cellotape-removal-palm-leaf.mp4",
      poster: "/videos/gallery/cellotape-removal-palm-leaf.jpg",
      width: 720,
      height: 1280,
      duration: "3:26",
    },
    {
      title: "Washing a paper page",
      caption: "A paper manuscript page washed in a shallow water bath.",
      url: "/videos/gallery/washing-a-paper-page.mp4",
      poster: "/videos/gallery/washing-a-paper-page.jpg",
      width: 1280,
      height: 720,
      duration: "1:44",
    },
    {
      title: "Brushing paste over pages",
      caption: "Paper pages laid out under a thin sheet and brushed over with paste.",
      url: "/videos/gallery/brushing-paste-over-pages.mp4",
      poster: "/videos/gallery/brushing-paste-over-pages.jpg",
      width: 1280,
      height: 720,
      duration: "0:31",
    },
    {
      title: "Cutting board to size",
      caption: "A strip of board cut to size on a board cutter in the lab.",
      url: "/videos/gallery/cutting-archival-board.mp4",
      poster: "/videos/gallery/cutting-archival-board.jpg",
      width: 1280,
      height: 720,
      duration: "0:17",
    },
    {
      title: "An illustrated manuscript, leaf by leaf",
      caption: "The painted leaves of an illustrated paper manuscript, turned one by one.",
      url: "/videos/gallery/illustrated-manuscript.mp4",
      poster: "/videos/gallery/illustrated-manuscript.jpg",
      width: 1280,
      height: 720,
      duration: "1:44",
    },
  ] as Film[],
};
