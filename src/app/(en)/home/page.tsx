// "/home" is the homepage under its own address — the header's Home link.
// A page, not a rewrite: Vercel can't serve a rewrite to "/" for Next's
// per-segment prefetches. Its canonical URL is still "/".
export { default, generateMetadata } from "@/views/home";
