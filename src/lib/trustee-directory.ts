/**
 * Who is allowed into the trustee portal, and how their Google account maps
 * back to their public profile.
 *
 * There's no database here — this is a short, hand-maintained allowlist.
 * Add each trustee's or advisor's real Google account email below; `name`
 * must match an entry in `content/trustees.ts` exactly, so the portal can
 * show their photo, rank and bio. Sign-in is refused for every other
 * Google account — an empty list means nobody can sign in yet.
 */
import { trustees, advisors } from "@/content/trustees";

export type PortalRole = "trustee" | "advisor";

export type AuthorizedMember = {
  email: string;
  name: string;
  role: PortalRole;
};

export const authorizedMembers: AuthorizedMember[] = [
  // { email: "name@gmail.com", name: "Dr. D. Veerendra Heggade", role: "trustee" },
];

const directory = [...trustees, ...advisors];

function normalize(email: string) {
  return email.trim().toLowerCase();
}

export function isAuthorizedEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  const target = normalize(email);
  return authorizedMembers.some((m) => normalize(m.email) === target);
}

export type MemberProfile = {
  name: string;
  rank: string;
  body: string;
  image: string | null;
  role: PortalRole;
  email: string;
};

export function getMemberProfile(email: string | null | undefined): MemberProfile | null {
  if (!email) return null;
  const target = normalize(email);
  const access = authorizedMembers.find((m) => normalize(m.email) === target);
  if (!access) return null;

  const record = directory.find((m) => m.name === access.name);
  return {
    name: access.name,
    rank: record?.rank ?? (access.role === "trustee" ? "Trustee" : "Advisor"),
    body: record?.body ?? "",
    image: record?.image ?? null,
    role: access.role,
    email: access.email,
  };
}
