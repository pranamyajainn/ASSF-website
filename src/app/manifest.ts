import type { MetadataRoute } from "next";

/** For "Add to home screen": the Foundation's mark, on the leaf and board colours. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Acharya Shanti Sagar Foundation",
    short_name: "ASSF",
    description:
      "Conserving palm-leaf and handwritten paper manuscripts, building rural infrastructure and serving communities — in English, हिन्दी and ಕನ್ನಡ.",
    start_url: "/",
    display: "browser",
    background_color: "#f0e7d0",
    theme_color: "#17110c",
    icons: [
      { src: "/icon.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png", purpose: "any" },
    ],
  };
}
