import "server-only";
import { resolveContent } from "@/i18n/content";
import type { Email } from "./render";

/** The Foundation's details for an email's header and footer, from the site's own content. */
export function orgForEmail(): Email["org"] {
  const { org } = resolveContent("en").shared;
  return { name: org.nameLatin, tagline: org.tagline, office: org.office, phone: org.phone, email: org.email };
}
