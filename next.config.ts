import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // AVIF first — typically a fifth to a third smaller than WebP for these
    // photographs — with WebP as the fallback for browsers without it.
    formats: ["image/avif", "image/webp"],
    // Optimised images are immutable per URL; keep them cached for a month.
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
  // "/home" is the homepage too, and keeps its own address in the bar — the
  // header's Home link uses it. Search engines are told "/" is canonical.
  rewrites() {
    return [
      { source: "/home", destination: "/" },
      { source: "/:lang(hi|kn)/home", destination: "/:lang" },
    ];
  },
};

export default nextConfig;
