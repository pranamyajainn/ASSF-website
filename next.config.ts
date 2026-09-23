import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // AVIF first — typically a fifth to a third smaller than WebP for these
    // photographs — with WebP as the fallback for browsers without it.
    formats: ["image/avif", "image/webp"],
    // Optimised images are immutable per URL; keep them cached for a month.
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
};

export default nextConfig;
