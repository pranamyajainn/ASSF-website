/**
 * Careers: the Foundation's open positions. None is written here — a
 * vacancy is the Foundation's to announce — so the page shows its "no
 * openings" note until one is added in the site editor (Careers → Open
 * positions), where vacancies are added and removed. Applications go by
 * email to the Foundation's address (shared.org.email).
 */
export type Vacancy = { role: string; location: string; description: string };

export const pageHero = {
  eyebrow: "Careers",
  title: "Work with the Foundation",
  body: "When the Foundation has a position open, it is listed here, with how to apply.",
} as const;

export const openings = {
  label: "Openings",
  heading: "Open positions",
  items: [] as Vacancy[],
  empty: "There are no openings right now. Thank you for your interest — please look in again later.",
};

export const apply = {
  label: "Applying",
  heading: "How to apply",
  body: "Send your application by email to the Foundation, with the position you are applying for in the subject line.",
} as const;
