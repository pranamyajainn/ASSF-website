import type { Lang } from "@/i18n/config";
import type { Group } from "./paths";

/**
 * The vault's words, in the site's three languages. They live here rather
 * than in the site's content (src/content, src/i18n) so that nothing about
 * the vault is ever part of what the public pages, the assistant or the AI
 * connector read.
 */
export const vaultStrings: Record<
  Lang,
  {
    title: string;
    lede: string;
    groups: Record<Group, string>;
    empty: string;
    upload: string;
    accepted: string;
    uploading: string;
    uploaded: string;
    failed: string;
    tooLarge: string;
    wrongType: string;
    view: string;
    download: string;
    uploadedOn: string;
    signedInAs: string;
    signOut: string;
    editor: string;
    notConnected: string;
    unreadable: string;
    language: string;
  }
> = {
  en: {
    title: "Trust documents",
    lede: "Private. Only people the Foundation has authorised can open these documents. This page isn't linked from the website, and search engines don't list it.",
    groups: { "trust-deed": "Trust Deed", financials: "Financials", "balance-sheets": "Balance Sheets", approvals: "Approvals" },
    empty: "No documents here yet.",
    upload: "Upload a document",
    accepted: "PDF, images, Word or Excel, up to 100 MB.",
    uploading: "Uploading… {percent}%",
    uploaded: "Uploaded.",
    failed: "The upload didn't go through. Please try again.",
    tooLarge: "This file is larger than 100 MB.",
    wrongType: "Only PDF, image, Word and Excel files can be kept here.",
    view: "View",
    download: "Download",
    uploadedOn: "Uploaded {date}",
    signedInAs: "Signed in as {email}",
    signOut: "Sign out",
    editor: "Site editor",
    notConnected: "The document store isn't connected yet. The web team connects it in the site's settings.",
    unreadable: "The documents couldn't be read just now. Please reload in a minute.",
    language: "Language",
  },
  hi: {
    title: "न्यास के दस्तावेज़",
    lede: "निजी। इन दस्तावेज़ों को केवल वही लोग खोल सकते हैं जिन्हें फ़ाउंडेशन ने अधिकृत किया है। यह पृष्ठ वेबसाइट से जुड़ा नहीं है, और सर्च इंजन इसे सूची में नहीं दिखाते।",
    groups: { "trust-deed": "न्यास विलेख (ट्रस्ट डीड)", financials: "वित्तीय विवरण", "balance-sheets": "तुलन-पत्र (बैलेंस शीट)", approvals: "अनुमोदन" },
    empty: "यहाँ अभी कोई दस्तावेज़ नहीं है।",
    upload: "दस्तावेज़ अपलोड करें",
    accepted: "PDF, चित्र, Word या Excel — 100 MB तक।",
    uploading: "अपलोड हो रहा है… {percent}%",
    uploaded: "अपलोड हो गया।",
    failed: "अपलोड नहीं हो सका। कृपया फिर से प्रयास करें।",
    tooLarge: "यह फ़ाइल 100 MB से बड़ी है।",
    wrongType: "यहाँ केवल PDF, चित्र, Word और Excel फ़ाइलें रखी जा सकती हैं।",
    view: "देखें",
    download: "डाउनलोड करें",
    uploadedOn: "{date} को अपलोड किया गया",
    signedInAs: "{email} से साइन इन",
    signOut: "साइन आउट",
    editor: "साइट संपादक",
    notConnected: "दस्तावेज़ भंडार अभी जुड़ा नहीं है। वेब टीम इसे साइट की सेटिंग्स में जोड़ती है।",
    unreadable: "दस्तावेज़ अभी पढ़े नहीं जा सके। कृपया एक मिनट बाद पृष्ठ फिर से खोलें।",
    language: "भाषा",
  },
  kn: {
    title: "ಟ್ರಸ್ಟ್ ದಾಖಲೆಗಳು",
    lede: "ಖಾಸಗಿ. ಫೌಂಡೇಶನ್ ಅಧಿಕಾರ ನೀಡಿದವರು ಮಾತ್ರ ಈ ದಾಖಲೆಗಳನ್ನು ತೆರೆಯಬಹುದು. ಈ ಪುಟಕ್ಕೆ ವೆಬ್‌ಸೈಟ್‌ನಿಂದ ಕೊಂಡಿ ಇಲ್ಲ, ಮತ್ತು ಸರ್ಚ್ ಇಂಜಿನ್‌ಗಳು ಇದನ್ನು ಪಟ್ಟಿ ಮಾಡುವುದಿಲ್ಲ.",
    groups: { "trust-deed": "ಟ್ರಸ್ಟ್ ಡೀಡ್", financials: "ಹಣಕಾಸು ವರದಿಗಳು", "balance-sheets": "ಬ್ಯಾಲೆನ್ಸ್ ಶೀಟ್‌ಗಳು", approvals: "ಅನುಮೋದನೆಗಳು" },
    empty: "ಇಲ್ಲಿ ಇನ್ನೂ ಯಾವುದೇ ದಾಖಲೆ ಇಲ್ಲ.",
    upload: "ದಾಖಲೆಯನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ",
    accepted: "PDF, ಚಿತ್ರಗಳು, Word ಅಥವಾ Excel — 100 MB ವರೆಗೆ.",
    uploading: "ಅಪ್‌ಲೋಡ್ ಆಗುತ್ತಿದೆ… {percent}%",
    uploaded: "ಅಪ್‌ಲೋಡ್ ಆಯಿತು.",
    failed: "ಅಪ್‌ಲೋಡ್ ಆಗಲಿಲ್ಲ. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.",
    tooLarge: "ಈ ಫೈಲ್ 100 MB ಗಿಂತ ದೊಡ್ಡದಾಗಿದೆ.",
    wrongType: "ಇಲ್ಲಿ PDF, ಚಿತ್ರ, Word ಮತ್ತು Excel ಫೈಲ್‌ಗಳನ್ನು ಮಾತ್ರ ಇಡಬಹುದು.",
    view: "ನೋಡಿ",
    download: "ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ",
    uploadedOn: "{date} ರಂದು ಅಪ್‌ಲೋಡ್ ಮಾಡಲಾಗಿದೆ",
    signedInAs: "{email} ಆಗಿ ಸೈನ್ ಇನ್",
    signOut: "ಸೈನ್ ಔಟ್",
    editor: "ಸೈಟ್ ಸಂಪಾದಕ",
    notConnected: "ದಾಖಲೆ ಸಂಗ್ರಹವನ್ನು ಇನ್ನೂ ಜೋಡಿಸಿಲ್ಲ. ವೆಬ್ ತಂಡ ಇದನ್ನು ಸೈಟ್‌ನ ಸೆಟ್ಟಿಂಗ್‌ಗಳಲ್ಲಿ ಜೋಡಿಸುತ್ತದೆ.",
    unreadable: "ದಾಖಲೆಗಳನ್ನು ಈಗ ಓದಲು ಆಗಲಿಲ್ಲ. ದಯವಿಟ್ಟು ಒಂದು ನಿಮಿಷದ ನಂತರ ಪುಟವನ್ನು ಮತ್ತೆ ತೆರೆಯಿರಿ.",
    language: "ಭಾಷೆ",
  },
};

/**
 * The sign-in screen's words for the vault: every line in all three
 * languages at once, since the reader hasn't chosen one yet.
 */
export const vaultGate = {
  title: ["Trust documents", "न्यास के दस्तावेज़", "ಟ್ರಸ್ಟ್ ದಾಖಲೆಗಳು"],
  lede: [
    "The Foundation's private documents.",
    "फ़ाउंडेशन के निजी दस्तावेज़।",
    "ಫೌಂಡೇಶನ್‌ನ ಖಾಸಗಿ ದಾಖಲೆಗಳು.",
  ],
  footnote: [
    "Only Google accounts the Foundation has authorised can open them.",
    "इन्हें केवल फ़ाउंडेशन द्वारा अधिकृत Google खाते खोल सकते हैं।",
    "ಫೌಂಡೇಶನ್ ಅಧಿಕಾರ ನೀಡಿದ Google ಖಾತೆಗಳು ಮಾತ್ರ ಇವುಗಳನ್ನು ತೆರೆಯಬಹುದು.",
  ],
  refused: [
    "You're signed in as {email}, which isn't authorised to open these documents.",
    "आप {email} से साइन इन हैं, जिसे ये दस्तावेज़ खोलने की अनुमति नहीं है।",
    "ನೀವು {email} ಆಗಿ ಸೈನ್ ಇನ್ ಆಗಿದ್ದೀರಿ; ಈ ಖಾತೆಗೆ ಈ ದಾಖಲೆಗಳನ್ನು ತೆರೆಯಲು ಅನುಮತಿ ಇಲ್ಲ.",
  ],
  denied: [
    "That Google account isn't on the Foundation's list for these documents. Ask the web team to add it, then try again.",
    "वह Google खाता इन दस्तावेज़ों की सूची में नहीं है। वेब टीम से इसे जुड़वाएँ, फिर से प्रयास करें।",
    "ಆ Google ಖಾತೆ ಈ ದಾಖಲೆಗಳ ಪಟ್ಟಿಯಲ್ಲಿ ಇಲ್ಲ. ವೆಬ್ ತಂಡಕ್ಕೆ ಸೇರಿಸಲು ಹೇಳಿ, ನಂತರ ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.",
  ],
  switchAccount: ["Sign out and use another account", "साइन आउट करके दूसरा खाता चुनें", "ಸೈನ್ ಔಟ್ ಮಾಡಿ ಬೇರೆ ಖಾತೆ ಬಳಸಿ"],
};
