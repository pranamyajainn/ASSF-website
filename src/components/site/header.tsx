import { getContent } from "@/i18n/content";
import { HeaderClient } from "./header-client";

/**
 * Resolves the edition's words and links on the server, so the client part
 * ships only the strings it shows — never the whole content bundle.
 */
export async function Header() {
  const { shared, ui, lang, href } = await getContent();
  return (
    <HeaderClient
      lang={lang}
      nav={shared.nav}
      tagline={shared.org.tagline}
      brandLine={shared.org.brandLine}
      name={shared.org.displayName}
      phone={shared.org.phone}
      t={ui.header}
      edition={ui.edition}
      homeHref={href("/")}
      homePageHref={href("/home")}
      joinHref={href("/#join")}
    />
  );
}
