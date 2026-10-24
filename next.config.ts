import type { NextConfig } from "next";
import { indexable } from "./src/lib/site";
import { PAYMENT_HOSTS } from "./src/lib/donate/config";

const dev = process.env.NODE_ENV !== "production";
const preview = process.env.VERCEL_ENV === "preview";

/**
 * The Foundation's earlier WordPress site, as Google still lists it: each
 * page goes to the page that now covers it, so search results and old links
 * land somewhere useful and their standing passes to the new pages. The
 * theme's demo pages (portfolio, ElementsKit, sample pages) are left to 404
 * and drop out of the index. Temple conservation is out of scope, so its
 * page goes to About.
 */
const earlierSite: [string, string][] = [
  ["/contact", "/#contact"],
  ["/volunteer", "/#contact"],
  ["/faq", "/about"],
  ["/services", "/"],
  ["/causes", "/"],
  ["/temple-restoration", "/about"],
  ["/shanti-smarak", "/about"],
  ["/testimonials", "/"],
  ["/muni-deeksha-shatabdi-mahotsav", "/"],
  ["/acaharya-pad-partisthapana-mahostav-2024-25", "/"],
  ["/tadpatra-restoration", "/manuscript-conservation"],
  ["/sharavanabalgal-m-at-parchan-tad-patar", "/manuscript-conservation"],
  ["/infra-development-at-yernal", "/rural-infrastructure"],
  ["/covid-19-initiative", "/community-services"],
  ["/welfare-work-in-south-flood-2018", "/community-services"],
  ["/annual-report", "/impact"],
  ["/news-coverage", "/impact"],
  ["/publication", "/impact"],
  ["/short-videos", "/impact"],
  ["/songs", "/impact"],
  ["/blog", "/impact"],
  ["/others", "/impact"],
  ["/category/:slug*", "/impact"],
  ["/donations/:slug*", "/donate"],
  ["/donation-confirmation", "/donate"],
  ["/donation-failed", "/donate"],
  ["/donor-dashboard", "/donate"],
  // Two Hindi posts about Acharya Shri, under their encoded and plain addresses.
  ["/%e0%a4%86%e0%a4%9a%e0%a4%b0%e0%a4%af-%e0%a4%b6%e0%a4%b0-%e0%a4%b6%e0%a4%a4-%e0%a4%b8%e0%a4%97%e0%a4%b0-%e0%a4%9c", "/hi/about"],
  ["/आचरय-शर-शत-सगर-ज", "/hi/about"],
  ["/%e0%a4%85%e0%a4%a6%e0%a5%83%e0%a4%b6%e0%a5%8d%e0%a4%af-%e0%a4%ad%e0%a4%95%e0%a5%8d%e0%a4%a4%e0%a4%bf-%e0%a4%95%e0%a5%87-%e0%a4%a6%e0%a4%b0%e0%a5%8d%e0%a4%b6%e0%a4%a8-%e0%a4%b6%e0%a4%be%e0%a4%82", "/hi/about"],
  ["/अदृश्य-भक्ति-के-दर्शन-शां", "/hi/about"],
];

/**
 * What a page may load. Everything is served from the site itself — fonts
 * are self-hosted by next/font, images go through /_next/image, the
 * assistant is /api/chat — except the restoration film, which is a
 * youtube-nocookie embed, and the trustee portal's Google sign-in, which is
 * a redirect. Inline scripts stay allowed because Next's own hydration
 * payload is inline; nonces would make every page dynamic.
 */
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${dev ? " 'unsafe-eval'" : ""}${preview ? " https://vercel.live" : ""}`,
  `style-src 'self' 'unsafe-inline'${preview ? " https://vercel.live" : ""}`,
  `img-src 'self' data: blob:${preview ? " https://vercel.live https://vercel.com" : ""}`,
  `font-src 'self'${preview ? " https://vercel.live https://assets.vercel.com" : ""}`,
  // blob: — sentences read aloud in the natural voice are played from memory.
  "media-src 'self' blob:",
  `connect-src 'self'${dev ? " ws:" : ""}${preview ? " https://vercel.live wss://ws-us3.pusher.com" : ""}`,
  // 'self': the site editor shows the site's own pages in a frame.
  `frame-src 'self' https://www.youtube-nocookie.com${preview ? " https://vercel.live" : ""}`,
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self' https://accounts.google.com",
  "object-src 'none'",
  ...(dev ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const security = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // The microphone: the assistant can be asked a question out loud.
  { key: "Permissions-Policy", value: "camera=(), microphone=(self), geolocation=(), payment=(), usb=(), browsing-topics=()" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
];

const noindex = { key: "X-Robots-Tag", value: "noindex, nofollow" };

/**
 * The donate page alone may also load Apna Dharm's payment script and the
 * NTT DATA (Atom) checkout it opens in place of the page — its scripts,
 * frames and API calls, and the bank's own pages for card and UPI
 * confirmation. Every other page keeps the strict policy above.
 */
const donateCsp = csp
  .replace("script-src 'self'", `script-src 'self' ${PAYMENT_HOSTS.script.join(" ")}`)
  .replace("connect-src 'self'", `connect-src 'self' ${PAYMENT_HOSTS.connect.join(" ")}`)
  .replace("img-src 'self'", `img-src 'self' ${PAYMENT_HOSTS.media.join(" ")}`)
  .replace("style-src 'self'", "style-src 'self' https://*.atomtech.in")
  .replace("font-src 'self'", "font-src 'self' https://*.atomtech.in")
  .replace("frame-src 'self'", `frame-src 'self' ${PAYMENT_HOSTS.frame.join(" ")}`)
  .replace("form-action 'self'", "form-action 'self' https://*.atomtech.in https://api.apnadharm.com");
const donating = [
  { key: "Content-Security-Policy", value: donateCsp },
  // The checkout may open the bank's own window (UPI apps, card confirmation).
  { key: "Cross-Origin-Opener-Policy", value: "same-origin-allow-popups" },
  {
    key: "Permissions-Policy",
    value: `camera=(), microphone=(self), geolocation=(), payment=(self ${PAYMENT_HOSTS.frame.map((h) => `"${h}"`).join(" ")}), usb=(), browsing-topics=()`,
  },
];

/**
 * The document vault uploads straight from the browser to its private store
 * (Vercel Blob, through vercel.com's API), so its page alone may connect
 * there. It is never indexed.
 */
const vault = [
  { key: "Content-Security-Policy", value: csp.replace("connect-src 'self'", "connect-src 'self' https://vercel.com https://*.blob.vercel-storage.com") },
  noindex,
];

/**
 * The video gallery shows each YouTube film's own thumbnail until it is
 * played (the film itself plays in the youtube-nocookie frame already allowed).
 */
const videoGallery = [{ key: "Content-Security-Policy", value: csp.replace("img-src 'self'", "img-src 'self' https://i.ytimg.com") }];

/** The editor's preview may be framed — by the site itself, and nothing else (and shows the video gallery's thumbnails). */
const framedBySelf = [
  { key: "Content-Security-Policy", value: csp.replace("frame-ancestors 'none'", "frame-ancestors 'self'").replace("img-src 'self'", "img-src 'self' https://i.ytimg.com") },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  noindex,
];

const nextConfig: NextConfig = {
  // One 404 for every unmatched address, across both root layouts (see
  // app/global-not-found.tsx).
  // authInterrupts: the vault answers 401 / 403 with its sign-in (unauthorized.tsx, forbidden.tsx).
  experimental: { globalNotFound: true, authInterrupts: true },
  images: {
    // AVIF first — typically a fifth to a third smaller than WebP for these
    // photographs — with WebP as the fallback for browsers without it.
    formats: ["image/avif", "image/webp"],
    // Optimised images are immutable per URL; keep them cached for a month.
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
  /**
   * The Foundation's earlier site took gifts at /donation.html and thanked
   * donors at /success.php; links and QR codes to them keep working once
   * this site takes over the domain.
   */
  async redirects() {
    return [
      { source: "/donation.html", destination: "/donate", permanent: true },
      { source: "/success.php", destination: "/donate/thank-you", permanent: true },
      ...earlierSite.map(([source, destination]) => ({ source, destination, permanent: true })),
    ];
  },
  async headers() {
    // Photographs, films and share cards keep their names when replaced, so
    // they are cached for a day and then revalidated, not forever.
    const media = { key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=2592000" };
    return [
      { source: "/:path*", headers: indexable ? security : [...security, noindex] },
      { source: "/trustee-portal/:path*", headers: [noindex] },
      { source: "/editor/:path*", headers: [noindex] },
      { source: "/editor", headers: [noindex] },
      { source: "/preview/:path*", headers: framedBySelf },
      // The editor shows a QR card's preview in a frame.
      { source: "/editor/qr", headers: framedBySelf },
      { source: "/oauth/:path*", headers: [noindex] },
      { source: "/unsubscribe", headers: [noindex] },
      { source: "/r/:path*", headers: [noindex] },
      { source: "/vault", headers: vault },
      { source: "/vault/:path*", headers: vault },
      { source: "/gallery/videos", headers: videoGallery },
      { source: "/:lang(hi|kn)/gallery/videos", headers: videoGallery },
      { source: "/api/:path*", headers: [noindex] },
      { source: "/donate", headers: donating },
      { source: "/:lang(hi|kn)/donate", headers: donating },
      { source: "/donate/thank-you", headers: [noindex] },
      { source: "/:lang(hi|kn)/donate/thank-you", headers: [noindex] },
      { source: "/images/:path*", headers: [media] },
      { source: "/videos/:path*", headers: [media] },
      { source: "/og/:path*", headers: [media] },
    ];
  },
};

export default nextConfig;
