import { isLang } from "@/i18n/config";
import { CategoriesUnavailable, donationCategories } from "@/lib/donate/apnadharm";

export const runtime = "nodejs";

/** The donation categories for the donate page, in the edition's language. */
export async function GET(req: Request) {
  const raw = new URL(req.url).searchParams.get("lang") ?? "en";
  const lang = isLang(raw) ? raw : "en";
  try {
    const categories = await donationCategories(lang);
    return Response.json({ categories }, { headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=3600" } });
  } catch (err) {
    console.error("Donation categories unavailable", err instanceof CategoriesUnavailable ? err.message : err);
    return Response.json({ categories: null }, { status: 502, headers: { "Cache-Control": "no-store" } });
  }
}
