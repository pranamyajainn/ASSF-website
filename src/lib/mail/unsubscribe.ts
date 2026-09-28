import "server-only";
import { verify } from "@/lib/mcp/jwt";
import { normalise, updateMail } from "./data";

/** Takes the person a signed unsubscribe link names off the mailing list. Returns their address, or null. */
export async function unsubscribe(token: string | null | undefined): Promise<string | null> {
  const claims = verify<{ email: string }>("unsubscribe", token);
  if (!claims?.email) return null;
  const email = normalise(claims.email);
  await updateMail(
    (d) => ({ ...d, contacts: d.contacts.map((c) => (c.email === email && !c.unsubscribed ? { ...c, unsubscribed: new Date().toISOString() } : c)) }),
    "Someone unsubscribed",
  );
  console.info("Unsubscribed", { email });
  return email;
}
