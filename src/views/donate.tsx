import Image from "next/image";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { DonateForm } from "@/components/site/donate-form";
import { Heading, Leaf, Lede } from "@/components/site/primitives";
import { getContent } from "@/i18n/content";
import { pageMetadata } from "@/i18n/metadata";
import { DONATE_PATH, qrGiving, THANKS_PATH } from "@/lib/donate/config";

export async function generateMetadata() {
  const { ui } = await getContent();
  return pageMetadata("donate", DONATE_PATH, qrGiving.on ? ui.donate.qrLede : ui.donate.lede);
}

/**
 * Giving, after the Foundation's page designs (Nov 2026): why give, then the
 * gift (the form, already open, working exactly as before), where a gift
 * goes, and the two ways to give — the UPI QR code and a bank transfer. The
 * QR code and UPI ID are the ones in lib/donate/config.ts.
 */
export default async function DonatePage() {
  const { donate, ui, shared, lang, href } = await getContent();
  const { pageHero, gift, goes, ways } = donate;
  const { org, folioPrice } = shared;
  const t = ui.donate;
  const tel = `tel:${org.phone.replace(/\s/g, "")}`;
  const [receiptBefore, receiptAfter = ""] = ways.receipt.body.split("{email}");
  const bankRows: [string, string][] = [
    [ways.bank.labels.name, org.displayName],
    [ways.bank.labels.bank, org.bank.branch],
    [ways.bank.labels.account, org.bank.account],
    [ways.bank.labels.ifsc, org.bank.ifsc.replace(/^IFSC\s*/, "")],
  ];

  return (
    <>
      <Header />
      <main id="main">
        <Leaf id="top" label={pageHero.label} question={pageHero.question} innerClassName="!pt-10 md:!pt-14 lg:!pt-16">
          <div className="bleed-margin grid items-center gap-x-10 gap-y-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <div className="min-w-0">
              <p className="font-mono text-register text-cinnabar">{pageHero.eyebrow}</p>
              <h1 className="inked ink-on-load mt-4 max-w-[15ch] text-balance font-display text-title font-medium tracking-[-0.015em]">
                {pageHero.title}
                <span className="text-cinnabar" aria-hidden="true">
                  {" "}॥
                </span>
              </h1>
              <p className="mt-6 max-w-[48ch] text-lede text-ink">{pageHero.body}</p>
              <p className="mt-7 flex items-center gap-5 rounded-lg bg-board px-6 py-5 text-board-ink">
                <span className="shrink-0 font-display text-[2.3rem] font-semibold leading-none text-orpiment">₹{folioPrice.toLocaleString("en-IN")}</span>
                <span className="text-[1.05rem] leading-snug">{pageHero.price}</span>
              </p>
            </div>
            <figure className="min-w-0">
              <div className="relative aspect-[3/2] overflow-hidden rounded-lg bg-leaf-deep shadow-[0_18px_34px_-24px_rgb(0_0_0/0.65)]">
                <Image src={pageHero.image.src} alt={pageHero.image.alt} fill priority sizes="(min-width: 1024px) 34rem, 92vw" className="object-cover" />
              </div>
              <figcaption className="mt-3 font-mono text-register text-ink-soft">{pageHero.image.caption}</figcaption>
            </figure>
          </div>
        </Leaf>

        <Leaf id="give" label={gift.label} question={gift.question}>
          <Heading>{gift.heading}</Heading>
          <Lede>{gift.lede}</Lede>
          <div className="bleed-margin mt-10">
            <DonateForm lang={lang} t={t} thanksPath={href(THANKS_PATH)} payee={org.displayName} />
          </div>
        </Leaf>

        <Leaf id="goes" label={goes.label} question={goes.question}>
          <Heading>{goes.heading}</Heading>
          <div className="bleed-margin mt-10 grid items-center gap-x-10 gap-y-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <div className="relative aspect-[16/10] overflow-hidden rounded-[10px_10px_10px_10px] bg-leaf-deep lg:rounded-tr-[5rem]">
              <Image src={goes.image.src} alt={goes.image.alt} fill sizes="(min-width: 1024px) 34rem, 92vw" className="object-cover" />
            </div>
            <ol className="divide-y divide-ink/15 border-y border-ink/15">
              {goes.points.map((point, i) => (
                <li key={point.title} className="grid grid-cols-[2.5rem_minmax(0,1fr)] gap-x-3 py-5">
                  <span className="pt-1 font-mono text-register text-cinnabar">{String(i + 1).padStart(2, "0")}</span>
                  <span>
                    <span className="block font-display text-[1.3rem] font-medium leading-snug text-ink">{point.title}</span>
                    <span className="mt-1 block text-[1.02rem] leading-relaxed text-ink-soft">{point.body}</span>
                  </span>
                </li>
              ))}
            </ol>
          </div>
          <dl className="bleed-margin mt-10 grid grid-cols-2 border-y border-ink/15 lg:grid-cols-4">
            {goes.figures.map((figure, i) => (
              <div key={figure.label} className={`py-5 pr-4 ${i % 2 === 1 ? "border-l border-ink/15 pl-4" : ""} ${i > 0 ? "lg:border-l lg:border-ink/15 lg:pl-5" : ""}`}>
                <dt className="sr-only">{figure.label}</dt>
                <dd className="font-display text-[clamp(1.8rem,1.4rem+1.2vw,2.5rem)] font-semibold leading-none text-cinnabar">{figure.value}</dd>
                <dd className="mt-2 text-[1rem] leading-snug text-ink">{figure.label}</dd>
              </div>
            ))}
          </dl>
        </Leaf>

        <Leaf id="ways" label={ways.label} question={ways.question}>
          <Heading>{ways.heading}</Heading>
          <div className="bleed-margin mt-10 grid gap-6 lg:grid-cols-2">
            <div className="flex flex-col items-center rounded-xl bg-board px-6 py-9 text-center text-board-ink">
              <p className="font-mono text-register uppercase tracking-[0.12em] text-orpiment">{ways.upi.eyebrow}</p>
              <h3 className="mt-3 font-display text-[1.7rem] font-semibold leading-tight">{ways.upi.title}</h3>
              <p className="mt-2 text-[1.05rem]">{ways.upi.body}</p>
              <div className="mt-6 w-[13.5rem] rounded-xl border-4 border-orpiment bg-white p-3">
                <Image src={qrGiving.image} alt={`${ways.upi.title}: UPI QR code, ${qrGiving.upi}`} width={720} height={720} unoptimized className="block h-auto w-full" />
              </div>
              <p className="mt-6 font-mono text-[0.75rem] uppercase tracking-[0.12em] text-board-soft">{t.qrUpi}</p>
              <p className="mt-1 break-all font-mono text-[1.2rem] text-orpiment">{qrGiving.upi}</p>
              <p className="mt-3 text-[0.98rem] text-board-soft">{org.displayName}</p>
            </div>
            <div className="rounded-xl border border-leaf-edge border-t-4 border-t-orpiment bg-leaf-deep/70 px-7 py-8">
              <p className="font-mono text-register uppercase tracking-[0.12em] text-cinnabar">{ways.bank.eyebrow}</p>
              <h3 className="mt-3 font-display text-[1.7rem] font-semibold leading-tight text-ink">{ways.bank.title}</h3>
              <dl className="mt-6 space-y-4">
                {bankRows.map(([label, value]) => (
                  <div key={label} className="grid grid-cols-[8rem_minmax(0,1fr)] gap-x-4">
                    <dt className="pt-1 font-mono text-[0.75rem] uppercase tracking-[0.08em] text-ink-soft">{label}</dt>
                    <dd className="font-display text-[1.15rem] font-medium leading-snug text-ink">{value}</dd>
                  </div>
                ))}
              </dl>
              <div className="mt-7 border-t border-dashed border-ink/25 pt-5">
                <p className="font-display text-[1.15rem] font-semibold text-ink">{ways.receipt.title}</p>
                <p className="mt-2 text-[1rem] leading-relaxed text-ink-soft">
                  {receiptBefore}
                  <a href={`mailto:${org.email}`} className="text-cinnabar underline underline-offset-2">
                    {org.email}
                  </a>
                  {receiptAfter}
                </p>
              </div>
            </div>
          </div>
          <div className="bleed-margin mt-8 grid border-y border-ink/15 sm:grid-cols-2">
            <div className="py-6 sm:pr-6">
              <p className="font-display text-[1.25rem] font-semibold text-ink">{ways.time.title}</p>
              <p className="mt-1.5 text-[1rem] leading-relaxed text-ink-soft">{ways.time.body}</p>
              <a href={href(ways.time.link.href)} className="mt-2 inline-block font-mono text-register text-cinnabar underline underline-offset-4">
                {ways.time.link.label} →
              </a>
            </div>
            <div className="border-t border-ink/15 py-6 sm:border-l sm:border-t-0 sm:pl-6">
              <p className="font-display text-[1.25rem] font-semibold text-ink">{ways.questions.title}</p>
              <p className="mt-1.5 text-[1rem] leading-relaxed text-ink-soft">{ways.questions.body}</p>
              <a href={tel} className="mt-2 inline-block font-mono text-register text-cinnabar underline underline-offset-4">
                {org.phone} →
              </a>
            </div>
          </div>
          <p className="mt-14 text-center font-display text-[clamp(1.5rem,1.2rem+1vw,2rem)] font-medium text-ink">
            <span className="text-cinnabar" aria-hidden="true">
              ॥{" "}
            </span>
            {ways.closing}
            <span className="text-cinnabar" aria-hidden="true">
              {" "}॥
            </span>
          </p>
        </Leaf>
      </main>
      <Footer />
    </>
  );
}
