import Image from "next/image";
import type { ReactNode } from "react";
import type { Lang } from "@/i18n/config";

/**
 * The words for a missing or broken page, per edition. They live here, not
 * in the content modules, because the pages that use them render outside
 * the editions' layouts (the 404 before any route matches, the error pages
 * as client components) and can't read the content bundle.
 */
export const lostCopy: Record<
  Lang,
  { missingTitle: string; missingBody: string; home: string; brokenTitle: string; brokenBody: string; retry: string }
> = {
  en: {
    missingTitle: "This leaf is missing",
    missingBody: "The page you asked for isn't here — its address may have changed.",
    home: "Go to the homepage",
    brokenTitle: "This leaf didn't open",
    brokenBody: "Something went wrong while showing this page. Please try again.",
    retry: "Try again",
  },
  hi: {
    missingTitle: "यह पत्र यहाँ नहीं है",
    missingBody: "आप जो पृष्ठ खोज रहे हैं, वह यहाँ नहीं है — हो सकता है उसका पता बदल गया हो।",
    home: "मुखपृष्ठ पर जाएँ",
    brokenTitle: "यह पत्र खुल नहीं सका",
    brokenBody: "यह पृष्ठ दिखाते समय कुछ गड़बड़ हो गई। कृपया फिर से प्रयास करें।",
    retry: "फिर से प्रयास करें",
  },
  kn: {
    missingTitle: "ಈ ಪತ್ರ ಇಲ್ಲಿಲ್ಲ",
    missingBody: "ನೀವು ಹುಡುಕುತ್ತಿರುವ ಪುಟ ಇಲ್ಲಿಲ್ಲ — ಅದರ ವಿಳಾಸ ಬದಲಾಗಿರಬಹುದು.",
    home: "ಮುಖಪುಟಕ್ಕೆ ಹೋಗಿ",
    brokenTitle: "ಈ ಪತ್ರ ತೆರೆಯಲಿಲ್ಲ",
    brokenBody: "ಈ ಪುಟವನ್ನು ತೋರಿಸುವಾಗ ಏನೋ ತಪ್ಪಾಗಿದೆ. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.",
    retry: "ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ",
  },
};

export const lostActionClass =
  "inline-flex items-center gap-2 border-b border-cinnabar/50 pb-0.5 text-[1.05rem] text-cinnabar-deep transition-colors hover:border-cinnabar hover:text-cinnabar";

/**
 * A single leaf on the dark board, with the Foundation's mark and a way
 * back. The 404 speaks all three editions at once — it can't know which one
 * the reader came from — and an error page speaks the edition it broke in.
 */
export function LostLeaf({
  lines,
}: {
  lines: readonly { lang: Lang; title: string; body: string; action: ReactNode }[];
}) {
  return (
    <main className="grid min-h-dvh place-items-center bg-board-deep px-4 py-16">
      <div className="relative w-full max-w-[38rem] rounded-[1.75rem] bg-leaf-deep py-11 pl-12 pr-7 shadow-[inset_0_0_0_1px_var(--color-leaf-edge),inset_0_0_3rem_rgb(122_90_34/0.16)] sm:px-14">
        <span aria-hidden="true" className="string-hole absolute left-4 top-1/2 -translate-y-1/2 sm:left-5" />
        <Image src="/icon.png" alt="Acharya Shanti Sagar Foundation" width={44} height={44} className="size-11" />
        <div className="mt-7 divide-y divide-ink/15">
          {lines.map((line, i) => {
            const Heading = i === 0 ? "h1" : "h2";
            return (
              <section
                key={line.lang}
                lang={line.lang}
                className={`py-6 first:pt-0 last:pb-0 ${line.lang === "kn" ? "font-kannada" : ""}`}
              >
                <Heading
                  className={`${line.lang === "kn" ? "font-kannada" : "font-display"} text-[clamp(1.6rem,1.3rem+1.2vw,2.1rem)] font-medium leading-tight text-ink`}
                >
                  {line.title}
                  <span aria-hidden="true" className="text-cinnabar">
                    {" "}॥
                  </span>
                </Heading>
                <p className="mt-3 text-[1.05rem] leading-relaxed text-ink-soft">{line.body}</p>
                <div className="mt-5">{line.action}</div>
              </section>
            );
          })}
        </div>
      </div>
    </main>
  );
}
