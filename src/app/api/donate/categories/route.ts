import { isLang } from "@/i18n/config";
import { resolveContent } from "@/i18n/content";
import { CategoriesUnavailable, donationCategories, fallbackCategories } from "@/lib/donate/apnadharm";
import { qrGiving } from "@/lib/donate/config";

export const runtime = "nodejs";

/** The donation categories for the donate page, in the edition's language. */
export async function GET(req: Request) {
  const raw = new URL(req.url).searchParams.get("lang") ?? "en";
  const lang = isLang(raw) ? raw : "en";
  // Gifts by QR code don't go through Apna Dharm, so its price (still ₹414 a
  // page) mustn't override the site's own: the same two choices, at the
  // price the pages show.
  if (qrGiving.on) {
    const categories = await fallbackCategories(lang, resolveContent("en").shared.folioPrice);
    return Response.json({ categories }, { headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=3600" } });
  }
  try {
    const categories = await donationCategories(lang);
    return Response.json({ categories }, { headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=3600" } });
  } catch (err) {
    console.error("Donation categories unavailable", err instanceof CategoriesUnavailable ? err.message : err);
    return Response.json({ categories: null }, { status: 502, headers: { "Cache-Control": "no-store" } });
  }
}
