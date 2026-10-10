import { isLang } from "@/i18n/config";
import { recordGift } from "@/lib/donate/apnadharm";
import type { Outcome } from "@/lib/donate/config";
import { EMAIL, normalise, updateMail } from "@/lib/mail/data";
import { clientKey, overLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

const OUTCOMES = new Set<Outcome>(["success", "failed", "cancelled", "timeout", "unclear"]);

/**
 * The donor's browser reports how the payment ended, once: kept (without
 * the donor's details) for the editor's Insights, and — if the donor asked
 * for them — their email goes on the newsletter list. Apna Dharm, not this,
 * is the record of the gift.
 */
export async function POST(req: Request) {
  const origin = req.headers.get("origin");
  const site = req.headers.get("sec-fetch-site");
  // Browsers always send Origin with a POST; a request without one didn't come from the donate page.
  let sameOrigin = false;
  try {
    if (origin) sameOrigin = new URL(origin).host === new URL(req.url).host;
  } catch {
    sameOrigin = false;
  }
  if (!sameOrigin || (site && site !== "same-origin")) return new Response("Forbidden.", { status: 403 });
  if (overLimit(`gift:${clientKey(req)}`, [{ ms: 60 * 60_000, max: 12 }])) return new Response("Too many.", { status: 429 });
  if (Number(req.headers.get("content-length") ?? 0) > 4000) return new Response("Too large.", { status: 413 });

  const b = (await req.json().catch(() => null)) as {
    txn?: unknown;
    status?: unknown;
    amount?: unknown;
    category?: unknown;
    lang?: unknown;
    newsletter?: { email?: unknown; name?: unknown } | null;
  } | null;
  const txn = typeof b?.txn === "string" && /^[a-z0-9]{6,24}$/.test(b.txn) ? b.txn : null;
  const status = typeof b?.status === "string" && OUTCOMES.has(b.status as Outcome) ? (b.status as Outcome) : null;
  if (!txn || !status) return new Response("Invalid.", { status: 400 });
  const amount = Math.min(10_000_000, Math.max(0, Math.round(Number(b?.amount) || 0)));
  const category = typeof b?.category === "string" ? b.category.slice(0, 120) : "";
  const lang = typeof b?.lang === "string" && isLang(b.lang) ? b.lang : "en";

  await recordGift({ txn, status, amount, category, lang });

  // Updates by email, only when asked for and only after a gift went through.
  const email = typeof b?.newsletter?.email === "string" ? normalise(b.newsletter.email) : "";
  if (status === "success" && email && EMAIL.test(email) && email.length <= 200) {
    const name = typeof b?.newsletter?.name === "string" ? b.newsletter.name.replace(/\s+/g, " ").trim().slice(0, 100) : "";
    try {
      await updateMail((d) => {
        if (d.contacts.some((c) => c.email === email)) {
          // Already on the list: joined to the newsletter, unless they once unsubscribed.
          return {
            ...d,
            contacts: d.contacts.map((c) =>
              c.email === email && !c.unsubscribed && !c.groups.includes("newsletter") ? { ...c, groups: [...c.groups, "newsletter"] } : c,
            ),
          };
        }
        return { ...d, contacts: [...d.contacts, { email, name, groups: ["newsletter"], unsubscribed: null, added: new Date().toISOString() }] };
      }, "A donor asked for updates");
    } catch (err) {
      console.error("Couldn't add a donor to the newsletter", err instanceof Error ? err.message : err);
    }
  }
  return Response.json({ ok: true });
}
