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
     * The Foundation's clips of 29 Oct 2026, encoded for the web. Titles and
     * captions say only what can be seen or heard; where and when each was
     * filmed waits for the Foundation. Sound is kept where it carries
     * something (the mantra, the speech) and left off where it was room
     * noise or an air blower.
     */
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
      title: "An illustrated manuscript, leaf by leaf",
      caption: "The painted leaves of an illustrated paper manuscript, turned one by one.",
      url: "/videos/gallery/illustrated-manuscript.mp4",
      poster: "/videos/gallery/illustrated-manuscript.jpg",
      width: 1280,
      height: 720,
      duration: "1:44",
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
      title: "Solvent cleaning and cellotape removal",
      caption: "Old cellotape lifted from palm leaf PL/598 with solvent, cotton swabs, tweezers and a scalpel.",
      url: "/videos/gallery/cellotape-removal-palm-leaf.mp4",
      poster: "/videos/gallery/cellotape-removal-palm-leaf.jpg",
      width: 720,
      height: 1280,
      duration: "3:26",
    },
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
  ] as Film[],
};
