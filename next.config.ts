import type { NextConfig } from "next";
import { indexable } from "./src/lib/site";

const dev = process.env.NODE_ENV !== "production";
const preview = process.env.VERCEL_ENV === "preview";

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
  "media-src 'self'",
  `connect-src 'self'${dev ? " ws:" : ""}${preview ? " https://vercel.live wss://ws-us3.pusher.com" : ""}`,
  `frame-src https://www.youtube-nocookie.com${preview ? " https://vercel.live" : ""}`,
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
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
];

const noindex = { key: "X-Robots-Tag", value: "noindex, nofollow" };

const nextConfig: NextConfig = {
  // One 404 for every unmatched address, across both root layouts (see
  // app/global-not-found.tsx).
  experimental: { globalNotFound: true },
  images: {
    // AVIF first — typically a fifth to a third smaller than WebP for these
    // photographs — with WebP as the fallback for browsers without it.
    formats: ["image/avif", "image/webp"],
    // Optimised images are immutable per URL; keep them cached for a month.
    minimumCacheTTL: 60 * 60 * 24 * 30,
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
      { source: "/api/:path*", headers: [noindex] },
      { source: "/images/:path*", headers: [media] },
      { source: "/videos/:path*", headers: [media] },
      { source: "/og/:path*", headers: [media] },
    ];
  },
};

export default nextConfig;
