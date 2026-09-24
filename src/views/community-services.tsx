import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import {
  Gloss,
  Heading,
  Leaf,
  PageHero,
  Plate,
  Prose,
  Register,
  Verses,
} from "@/components/site/primitives";
import { getContent } from "@/i18n/content";
import { pageMetadata } from "@/i18n/metadata";

export async function generateMetadata() {
  const { community } = await getContent();
  return pageMetadata("community", "/community-services", community.pageHero.body);
}

export default async function CommunityServicesPage() {
  const { community, ui } = await getContent();
  const { education, healthcare, method, pageHero, relief } = community;
  const t = ui.community;
  return (
    <>
      <Header />
      <main>
        <PageHero
          question={ui.steps.why}
          thread={{
            title: ui.steps.thread,
            items: [
              { id: "method", question: ui.steps.how },
              { id: "healthcare", question: ui.steps.health },
              { id: "education", question: ui.steps.learning },
              { id: "relief", question: ui.steps.crisis },
            ],
          }}
          label={t.heroLabel}
          {...pageHero}
        />

        <Leaf id="method" label={method.label} question={ui.steps.how}>
          <Heading>{method.heading}</Heading>
          <Verses steps={method.steps} />
        </Leaf>

        <Leaf id="healthcare" label={healthcare.label} question={ui.steps.health}>
          <Heading>{healthcare.heading}</Heading>
          <Prose>
            <Gloss label={t.also}>{healthcare.note}</Gloss>
            <p>{healthcare.body}</p>
          </Prose>
          <Register entries={healthcare.totals} />

          {/* The camps, as a register: place, reach, what was done. */}
          <div className="bleed-margin mt-14 overflow-x-auto">
            <table className="w-full min-w-[36rem] border-collapse">
              <caption className="sr-only">{t.campsCaption}</caption>
              <thead>
                <tr className="border-y border-ink/25">
                  <th scope="col" className="py-3 pr-4 text-left font-mono text-register font-normal text-ink-faint">{t.camp}</th>
                  <th scope="col" className="px-4 py-3 text-right font-mono text-register font-normal text-ink-faint">{t.beneficiaries}</th>
                  <th scope="col" className="py-3 pl-6 text-left font-mono text-register font-normal text-ink-faint">{t.specialties}</th>
                </tr>
              </thead>
              <tbody>
                {healthcare.camps.map((camp) => (
                  <tr key={camp.place} className="border-b border-ink/15 align-baseline">
                    <th scope="row" className="py-5 pr-4 text-left font-display text-[1.25rem] font-medium text-ink">
                      {camp.place}
                    </th>
                    <td className="px-4 py-5 text-right font-display text-[1.6rem] tabular-nums text-ink">
                      {camp.beneficiaries}
                    </td>
                    <td className="max-w-[40ch] py-5 pl-6 text-[1rem] leading-relaxed text-ink-soft">
                      {camp.detail}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bleed-margin mt-12 grid gap-4 sm:grid-cols-2">
            {healthcare.images.map((img) => (
              <Plate
                key={img.src}
                src={img.src}
                alt={img.alt}
                caption={img.caption}
                ratio="16 / 10"
                sizes="(min-width: 640px) 40vw, 100vw"
              />
            ))}
          </div>
        </Leaf>

        <Leaf id="education" label={education.label} question={ui.steps.learning}>
          <div className="bleed-margin grid items-start gap-x-12 gap-y-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
            <div>
              <Heading>{education.heading}</Heading>
              <Prose>
                <p>{education.body}</p>
              </Prose>
            </div>
            <Plate
              src={education.image}
              alt={education.imageAlt}
              caption={t.educationCaption}
              ratio="16 / 9"
              sizes="(min-width: 1024px) 45vw, 100vw"
            />
          </div>
        </Leaf>

        <Leaf id="relief" label={relief.label} question={ui.steps.crisis}>
          <Heading>{relief.heading}</Heading>
          <ul className="bleed-margin mt-12 grid gap-x-14 gap-y-14 border-t border-ink/20 pt-10 lg:grid-cols-2">
            {relief.items.map((item) => (
              <li key={item.name}>
                <h3 className="font-display text-[1.7rem] font-medium leading-tight text-ink">{item.name}</h3>
                <p className="mt-3 max-w-[50ch] text-[1.0625rem] leading-relaxed text-ink-soft">{item.body}</p>
                <dl className="mt-6 flex flex-wrap gap-x-10 gap-y-5">
                  {item.stats.map((stat) => (
                    <div key={stat.label} className="flex flex-col-reverse">
                      <dt className="mt-1.5 font-mono text-register text-ink-faint">{stat.label}</dt>
                      <dd className="font-display text-[clamp(1.9rem,1.5rem+1.4vw,2.6rem)] font-medium leading-none tabular-nums text-ink">
                        {stat.value}
                      </dd>
                    </div>
                  ))}
                </dl>
                {"image" in item && item.image ? (
                  <Plate
                    className="mt-8"
                    src={item.image}
                    alt={item.imageAlt}
                    caption={item.name}
                    ratio="16 / 9"
                    sizes="(min-width: 1024px) 40vw, 100vw"
                  />
                ) : null}
              </li>
            ))}
          </ul>
        </Leaf>
      </main>
      <Footer />
    </>
  );
}
