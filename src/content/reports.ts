/**
 * Reports: the Foundation's own project reports, as it publishes them.
 * Sent by Alka, 28 Oct 2026, for the Impact page's "Read our reports".
 * Only reports without financial figures are listed: the Foundation has
 * asked that no expenditure be published until all trustees approve it,
 * so the Kumbhoj and Mahaveer Gurukul completion reports wait for that.
 */
export type Report = { title: string; place: string; period: string; pages: string; size: string; href: string };

export const pageHero = {
  eyebrow: "Reports",
  title: "Project reports",
  body: "Reports on the Foundation's completed conservation projects: what was found, how it was conserved, and what was handed back.",
} as const;

export const list = {
  label: "Reports",
  heading: "Completed projects",
  open: "Open the report (PDF)",
  items: [
    {
      title: "Manuscripts Conservation and Restoration Project — Closing Report",
      place: "Shri Mahaveer Brahmacharyashram, Jain Gurukul, Karanja Lad, Maharashtra",
      period: "October 2024 – 9 August 2025",
      pages: "12 pages",
      size: "1.5 MB",
      href: "/reports/karanja-lad-closing-report.pdf",
    },
  ] as Report[],
};
