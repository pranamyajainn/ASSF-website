import { lang as rootLang } from "next/root-params";
import { isLang, type Lang } from "./config";

/**
 * The edition the current route belongs to. English routes sit under a root
 * layout with no `lang` segment, so the root param is undefined there.
 */
export async function getLang(): Promise<Lang> {
  const value = await rootLang();
  return isLang(value) ? value : "en";
}
