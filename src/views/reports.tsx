import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { Heading, Leaf, PageHero } from "@/components/site/primitives";
import { getContent } from "@/i18n/content";
import { pageMetadata } from "@/i18n/metadata";

export async function generateMetadata() {
  const { reports } = await getContent();
  return pageMetadata("reports", "/reports", reports.pageHero.body);
}

/** The Foundation's project reports, each one line of facts and its PDF. */
export default async function ReportsPage() {
  const { reports, ui } = await getContent();
  const { list, pageHero } = reports;
  return (
    <>
      <Header />
      <main id="main">
        <PageHero question={ui.steps.glance} {...pageHero} />
        <Leaf id="reports" label={list.label} question={ui.steps.lasts}>
          <Heading>{list.heading}</Heading>
          <ul className="mt-10 border-t border-ink/20">
            {list.items.map((report) => (
              <li key={report.href} className="border-b border-ink/20 py-8">
                <h3 className="font-display text-[clamp(1.3rem,1.1rem+0.8vw,1.75rem)] font-medium leading-tight text-ink">{report.title}</h3>
                <p className="mt-2 text-[1.0625rem] leading-relaxed text-ink-soft">{report.place}</p>
                <p className="mt-2 font-mono text-register text-ink-faint">
                  {report.period} · {report.pages} · PDF, {report.size}
                </p>
                <a
                  href={report.href}
                  target="_blank"
                  rel="noopener"
                  className="mt-5 inline-flex min-h-12 items-center justify-center border border-cinnabar px-6 py-3 text-[1.0625rem] leading-tight text-cinnabar transition-colors hover:bg-cinnabar hover:text-leaf"
                >
                  {list.open}
                </a>
              </li>
            ))}
          </ul>
        </Leaf>
      </main>
      <Footer />
    </>
  );
}
