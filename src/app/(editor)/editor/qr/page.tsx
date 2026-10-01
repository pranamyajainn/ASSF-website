import { redirect } from "next/navigation";
import QRCode from "qrcode";
import { localeInfo, localizeHref, locales, type Lang } from "@/i18n/config";
import { resolveContent } from "@/i18n/content";
import { currentEditor } from "@/lib/cms/access";
import { PAGES } from "@/lib/cms/schema";
import { siteUrl } from "@/lib/site";
import { PrintButton } from "./print-button";

/**
 * Printable QR cards — for an exhibition table, a temple notice board or a
 * library shelf. Each card names the page in the reader's language and
 * opens it there; "All three languages" puts the three editions side by
 * side, each under its own script. "The AI assistant" opens the site with
 * the assistant ready to answer (/#ask), as a guide to an exhibition.
 */
const WORDS: Record<Lang, { scan: string; ask: string; askTitle: string; choose: string }> = {
  en: {
    scan: "Scan to read this page",
    ask: "Scan to ask the Foundation — type or speak, in English, Hindi or Kannada",
    askTitle: "Ask the Foundation",
    choose: "Read in your language",
  },
  hi: {
    scan: "यह पृष्ठ पढ़ने के लिए स्कैन करें",
    ask: "फ़ाउंडेशन से पूछने के लिए स्कैन करें — लिखकर या बोलकर, हिंदी, अंग्रेज़ी या कन्नड़ में",
    askTitle: "फ़ाउंडेशन से पूछें",
    choose: "अपनी भाषा में पढ़ें",
  },
  kn: {
    scan: "ಈ ಪುಟವನ್ನು ಓದಲು ಸ್ಕ್ಯಾನ್ ಮಾಡಿ",
    ask: "ಫೌಂಡೇಶನ್ ಅನ್ನು ಕೇಳಲು ಸ್ಕ್ಯಾನ್ ಮಾಡಿ — ಬರೆದು ಅಥವಾ ಮಾತನಾಡಿ, ಕನ್ನಡ, ಹಿಂದಿ ಅಥವಾ ಇಂಗ್ಲಿಷ್‌ನಲ್ಲಿ",
    askTitle: "ಫೌಂಡೇಶನ್ ಅನ್ನು ಕೇಳಿ",
    choose: "ನಿಮ್ಮ ಭಾಷೆಯಲ್ಲಿ ಓದಿ",
  },
};

type Params = { page?: string; lang?: string; size?: string; embed?: string };

async function qr(url: string): Promise<string> {
  return QRCode.toString(url, { type: "svg", errorCorrectionLevel: "M", margin: 0, color: { dark: "#1d1812", light: "#0000" } });
}

export default async function QrPage({ searchParams }: { searchParams: Promise<Params> }) {
  const params = await searchParams;
  if (!(await currentEditor())) redirect("/editor/sign-in?next=/editor");

  const target = PAGES.find((p) => p.module === params.page && p.module !== "shared" && p.module !== "ui");
  const ask = params.page === "ask" || !target;
  const href = ask ? "/" : target.href;
  const langs: Lang[] = params.lang && (locales as readonly string[]).includes(params.lang) ? [params.lang as Lang] : [...locales];
  const a4 = params.size === "a4";
  /** Shown small inside the editor's dialog, without the print controls. */
  const embed = params.embed === "1";

  const cards = await Promise.all(
    langs.map(async (lang) => {
      const content = resolveContent(lang);
      const title = ask
        ? WORDS[lang].askTitle
        : href === "/"
          ? content.ui.header.homeLink
          : (content.shared.nav.find((n) => n.href === localizeHref(href, lang))?.label ?? target!.title);
      const url = new URL(`${localizeHref(href, lang)}${ask ? "#ask" : ""}`, siteUrl).toString();
      return { lang, title, url, svg: await qr(url), words: WORDS[lang] };
    }),
  );
  const { org } = resolveContent("en").shared;
  const single = cards.length === 1 ? cards[0] : null;

  return (
    <main className={`qr-sheet ${a4 ? "qr-a4" : "qr-a6"} min-h-dvh bg-leaf-deep/50 ${embed ? "py-4" : "py-8"} print:bg-transparent print:py-0`}>
      <style>{`@page { size: ${a4 ? "A4" : "A6"} ${single || a4 ? "portrait" : "landscape"}; margin: 0; }
        @media print { .qr-controls { display: none !important; } body { background: none !important; } }`}</style>
      <div hidden={embed} className="qr-controls mx-auto mb-6 flex max-w-3xl flex-wrap items-center justify-between gap-3 px-4">
        <p className="text-[0.92rem] text-ink-soft">
          Print on card, at 100% (“actual size”). The code opens <span className="font-mono text-[0.85rem]">{siteUrl.host}</span>, which keeps working
          when the Foundation&apos;s own web address arrives.
        </p>
        <PrintButton />
      </div>

      <article
        className="mx-auto flex flex-col overflow-hidden bg-[#fbf6ea] text-ink shadow-[0_20px_60px_rgb(23_17_12/0.25)] print:shadow-none"
        style={{
          width: a4 ? "210mm" : single ? "105mm" : "148mm",
          height: a4 ? "297mm" : single ? "148mm" : "105mm",
          backgroundImage: "var(--fibre)",
          zoom: embed ? (a4 ? 0.42 : single ? 0.8 : 0.58) : undefined,
        }}
      >
        <div className="h-[3mm] shrink-0 bg-cinnabar" />
        <header className={`flex shrink-0 items-center gap-[3mm] px-[7mm] ${a4 ? "pt-[14mm]" : "pt-[6mm]"}`}>
          {/* eslint-disable-next-line @next/next/no-img-element -- printed, not served */}
          <img src="/images/logo/assf-icon-square.png" alt="" className={a4 ? "size-[18mm]" : "size-[10mm]"} />
          <div className="leading-tight">
            <p className={`font-display ${a4 ? "text-[20pt]" : "text-[10.5pt]"}`}>{org.nameLatin}</p>
            <p lang="hi" className={`font-serif text-ink-soft ${a4 ? "text-[14pt]" : "text-[8.5pt]"}`}>
              {org.nameDeva} · {org.tagline}
            </p>
          </div>
        </header>

        {single ? (
          <section lang={single.lang} className={`flex flex-1 flex-col items-center justify-center px-[8mm] text-center ${single.lang === "kn" ? "font-kannada" : ""}`}>
            <h1 className={`font-display leading-tight ${a4 ? "text-[34pt]" : "text-[17pt]"}`}>{single.title}</h1>
            <div className={`my-[5mm] bg-white p-[3mm] ${a4 ? "w-[110mm]" : "w-[52mm]"}`} dangerouslySetInnerHTML={{ __html: single.svg }} />
            <p className={`text-ink-soft ${a4 ? "max-w-[150mm] text-[15pt]" : "text-[9pt]"}`}>{ask ? single.words.ask : single.words.scan}</p>
            <p className={`mt-[2mm] font-mono text-ink-faint ${a4 ? "text-[11pt]" : "text-[6.5pt]"}`}>{single.url.replace(/^https?:\/\//, "")}</p>
          </section>
        ) : (
          <section className="flex flex-1 flex-col justify-center px-[6mm]">
            <p className={`text-center font-display ${a4 ? "text-[26pt]" : "text-[13pt]"}`}>
              {cards.map((c, i) => (
                <span key={c.lang} lang={c.lang} className={c.lang === "kn" ? "font-kannada" : ""}>
                  {i ? <span className="mx-[2mm] text-cinnabar">·</span> : null}
                  {c.words.choose}
                </span>
              ))}
            </p>
            <div className={`mt-[5mm] grid grid-cols-3 ${a4 ? "gap-[8mm]" : "gap-[4mm]"}`}>
              {cards.map((c) => (
                <div key={c.lang} lang={c.lang} className={`flex flex-col items-center text-center ${c.lang === "kn" ? "font-kannada" : ""}`}>
                  <p className={`font-display ${a4 ? "text-[20pt]" : "text-[12pt]"}`}>{localeInfo[c.lang].label}</p>
                  <div className="my-[2.5mm] w-full bg-white p-[2mm]" dangerouslySetInnerHTML={{ __html: c.svg }} />
                  <p className={`leading-snug text-ink-soft ${a4 ? "text-[12pt]" : "text-[7pt]"}`}>{c.title}</p>
                </div>
              ))}
            </div>
            {ask ? <p className={`mt-[4mm] text-center text-ink-soft ${a4 ? "text-[13pt]" : "text-[7.5pt]"}`}>{WORDS.en.ask}</p> : null}
          </section>
        )}

        <footer className={`flex shrink-0 items-center justify-between border-t border-ink/15 px-[7mm] text-ink-faint ${a4 ? "py-[8mm] text-[11pt]" : "py-[3mm] text-[6.5pt]"}`}>
          <span>{org.brandLine}</span>
          <span className="font-mono">{org.phone}</span>
        </footer>
      </article>
    </main>
  );
}
