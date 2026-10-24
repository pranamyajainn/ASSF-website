/**
 * The video gallery. It opens with the two recordings in the home page's
 * Voices (supplied by the Foundation, Sept 2026), titled and captioned as
 * they are there; their captions and transcripts stay with the Voices
 * (content/home.ts → voices.heard). The Foundation adds films in the site
 * editor (Video Gallery) by pasting a YouTube link — a film is too large to
 * upload through the editor, and YouTube plays it well on any phone.
 *
 * `url` is either a YouTube link or one of the site's own recordings in
 * /videos; a link that is neither is left off the page rather than shown
 * broken.
 */
export const pageHero = {
  eyebrow: "Video Gallery",
  title: "The work on film",
  body: "Films and recordings of the Foundation's work.",
} as const;

export type Film = { title: string; caption: string; url: string };

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
  ] as Film[],
};
