import { getContent } from "@/i18n/content";
import { siteUrl } from "@/lib/site";

/**
 * Who the Foundation is, for search engines: schema.org's NGO, from the same
 * `org` record the footer prints — name in both scripts, address, contact,
 * founding year. Rendered on each edition's homepage.
 */
export async function OrgSchema() {
  const { shared, ui, href } = await getContent();
  const { org } = shared;
  const address = /^(.*), Bengaluru (\d{6}), Karnataka$/.exec(org.office);
  const data = {
    "@context": "https://schema.org",
    "@type": "NGO",
    name: org.nameLatin,
    alternateName: [org.nameDeva, "ASSF"],
    url: new URL(href("/"), siteUrl).href,
    logo: new URL("/icon.png", siteUrl).href,
    image: new URL("/og/en/home.jpg", siteUrl).href,
    description: ui.meta.homeDescription,
    slogan: org.brandLine,
    foundingDate: String(org.founded),
    email: org.email,
    telephone: org.phone.replace(/\s/g, ""),
    address: {
      "@type": "PostalAddress",
      streetAddress: address ? address[1] : org.office,
      addressLocality: "Bengaluru",
      postalCode: address?.[2],
      addressRegion: "Karnataka",
      addressCountry: "IN",
    },
  };
  return (
    <script
      type="application/ld+json"
      // JSON inside a script element: only "<" could end it early.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
