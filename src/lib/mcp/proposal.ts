import "server-only";
import { randomUUID } from "node:crypto";
import { deflateRawSync, inflateRawSync } from "node:zlib";
import type { Action } from "@/components/editor/model";
import { sign, verify } from "./jwt";

/**
 * A set of changes an AI app prepared, carried in the editor link it hands
 * back ("/editor?proposal=…"): compressed, signed by the site, valid for
 * thirty days. Opening the link puts the changes into the editor's draft,
 * on the page, for a person to check and publish — nothing else.
 */
export type Proposal = { id: string; summary: string; by: string; app: string; actions: Action[] };

const TTL = 60 * 60 * 24 * 30;
/** Links past this length get unwieldy in chat apps; bigger changes should be split. */
export const MAX_TOKEN = 14_000;

export function encodeProposal(p: Omit<Proposal, "id">): string {
  const z = deflateRawSync(Buffer.from(JSON.stringify({ ...p, id: randomUUID() }))).toString("base64url");
  return sign("proposal", { z }, TTL);
}

export function decodeProposal(token: string | null | undefined): Proposal | null {
  const claims = verify<{ z: string }>("proposal", token);
  if (!claims) return null;
  try {
    return JSON.parse(inflateRawSync(Buffer.from(claims.z, "base64url")).toString()) as Proposal;
  } catch {
    return null;
  }
}
