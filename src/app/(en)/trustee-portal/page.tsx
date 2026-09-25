import Image from "next/image";
import Link from "next/link";
import { requireTrusteeSession } from "@/lib/trustee-session";
import { signOut } from "@/auth";
import { org } from "@/content/shared";
import { streams } from "@/content/impact";
import { ledger, sites, standing } from "@/content/home";
import { projects as ruralProjects } from "@/content/rural-infrastructure";
import { healthcare, education, relief } from "@/content/community-services";
import { trustees, advisors } from "@/content/trustees";
import { Meter, PortalSection, ReportCard, StatTile, StatusRow } from "@/components/portal/primitives";

export const metadata = {
  title: `Trustee Portal — ${org.nameLatin}`,
  robots: { index: false, follow: false },
};

function toNumber(value: string) {
  return Number(value.replace(/[^\d]/g, "")) || 0;
}

export default async function TrusteePortalPage() {
  const member = await requireTrusteeSession();

  const folioMetric = ledger.metrics.find((m) => m.label === "Folios conserved");
  const surveyedMetric = ledger.metrics.find((m) => m.label === "Folios documented by survey");
  const fraction =
    folioMetric?.value && surveyedMetric?.value
      ? toNumber(folioMetric.value) / toNumber(surveyedMetric.value)
      : 0;

  const board: { name: string; rank: string; image: string }[] = [...trustees, ...advisors];

  return (
    <main className="min-h-screen bg-board-deep pb-24">
      <div className="border-b border-board-ink/10 bg-board">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-4 px-5 py-5 sm:px-8">
          <div className="flex items-center gap-3">
            <Image src="/icon.png" alt="" width={32} height={32} className="size-8" />
            <div>
              <p className="text-sm text-board-ink">{org.nameLatin}</p>
              <p className="text-xs text-board-ink/50">Trustee Portal</p>
            </div>
          </div>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/trustee-portal/login" });
            }}
          >
            <button
              type="submit"
              className="border border-board-ink/20 px-4 py-2 text-sm text-board-ink/75 transition-colors hover:border-board-ink/40 hover:text-board-ink"
            >
              Sign out
            </button>
          </form>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-5 sm:px-8">
        <div className="flex flex-wrap items-center gap-5 pt-10">
          {member.image ? (
            <Image
              src={member.image}
              alt=""
              width={64}
              height={64}
              className="size-16 rounded-full object-cover"
            />
          ) : (
            <span className="flex size-16 items-center justify-center rounded-full bg-board-ink/10 text-xl text-board-ink">
              {member.name.charAt(0)}
            </span>
          )}
          <div>
            <h1 className="text-3xl text-board-ink">{member.name}</h1>
            <p className="mt-1 text-[0.95rem] text-board-ink/60">{member.rank}</p>
          </div>
        </div>

        <PortalSection eyebrow="Overview" heading="How much work has been done">
          <div className="grid gap-x-8 gap-y-8 sm:grid-cols-3">
            {streams.map((s) => (
              <StatTile key={s.name} label={`${s.name} — ${s.stats[0].label}`} value={s.stats[0].value} />
            ))}
          </div>
          <div className="mt-10">
            <Meter
              label="Scale of the manuscript conservation work"
              filledLabel={`${folioMetric?.value ?? "—"} folios preserved`}
              totalLabel={`${surveyedMetric?.value ?? "—"} folios documented by survey`}
              fraction={fraction}
            />
          </div>
        </PortalSection>

        <PortalSection eyebrow="Reports" heading="By programme">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {streams.map((s) => (
              <ReportCard key={s.name} name={s.name} href={s.href} stats={s.stats} />
            ))}
          </div>
          <Link
            href="/impact"
            className="mt-6 inline-block text-sm text-orpiment underline decoration-orpiment/40 underline-offset-4 hover:decoration-orpiment"
          >
            Open the combined impact report
          </Link>
        </PortalSection>

        <PortalSection eyebrow="Manuscript conservation" heading="Sites, completed and ongoing">
          <div className="space-y-4">
            {sites.items.map((site) => (
              <div key={site.name} className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-t border-board-ink/10 py-3 first:border-t-0">
                <div>
                  <p className="text-[0.95rem] text-board-ink">{site.name}</p>
                  <p className="text-sm text-board-ink/55">{site.institution}, {site.place}</p>
                </div>
                <div className="text-right">
                  <p className={`text-sm ${site.status === "Completed" ? "text-board-ink" : "text-orpiment"}`}>
                    {site.status}
                  </p>
                  {site.figures.manuscripts ? (
                    <p className="text-sm text-board-ink/55">
                      {site.figures.manuscripts} manuscripts · {site.figures.folios} folios
                    </p>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </PortalSection>

        <PortalSection eyebrow="Rural infrastructure" heading="Projects">
          <ul className="grid gap-4 sm:grid-cols-2">
            {ruralProjects.items.map((p) => (
              <li key={p.name} className="border-t border-board-ink/10 pt-3">
                <p className="text-[0.95rem] text-board-ink">{p.name}</p>
                <p className="mt-1 max-w-[42ch] text-base leading-snug text-board-ink/65">{p.body}</p>
              </li>
            ))}
          </ul>
        </PortalSection>

        <PortalSection eyebrow="Community services" heading="Healthcare, education, relief">
          <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
            {healthcare.totals.map((t) => (
              <StatTile key={t.label} label={t.label} value={t.value} />
            ))}
          </div>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            <div className="border-t border-board-ink/10 pt-4">
              <p className="text-sm text-board-ink/70">Education support</p>
              <p className="mt-2 max-w-[42ch] text-base leading-snug text-board-ink/70">{education.body}</p>
            </div>
            <div className="border-t border-board-ink/10 pt-4">
              <p className="text-sm text-board-ink/70">Emergency relief</p>
              <ul className="mt-2 space-y-2">
                {relief.items.map((r) => (
                  <li key={r.name} className="text-base leading-snug text-board-ink/70">
                    <span className="text-board-ink">{r.name}</span> — {r.body}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </PortalSection>

        <PortalSection eyebrow="Governance" heading="Standing & compliance">
          <div>
            {standing.badges.map((b) => (
              <StatusRow key={b.label} label={b.label} state={b.state} />
            ))}
          </div>
          <p className="mt-5 max-w-[60ch] text-sm leading-relaxed text-board-ink/55">{standing.note}</p>
        </PortalSection>

        <PortalSection eyebrow="Board" heading="Fellow trustees and advisors">
          <ul className="grid gap-x-8 gap-y-5 sm:grid-cols-2">
            {board.map((t) => (
              <li key={t.name} className="flex items-center gap-3">
                {t.image ? (
                  <Image src={t.image} alt="" width={40} height={40} className="size-10 rounded-full object-cover" />
                ) : (
                  <span className="flex size-10 items-center justify-center rounded-full bg-board-ink/10 text-sm text-board-ink">
                    {t.name.charAt(0)}
                  </span>
                )}
                <div>
                  <p className="text-[0.9rem] text-board-ink">
                    {t.name}
                    {t.name === member.name ? <span className="text-board-ink/40"> (you)</span> : null}
                  </p>
                  <p className="text-sm text-board-ink/55">{t.rank}</p>
                </div>
              </li>
            ))}
          </ul>
        </PortalSection>
      </div>
    </main>
  );
}
