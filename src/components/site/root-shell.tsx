import type { ReactNode } from "react";
import { ChatWidget } from "@/components/chat/chat-widget";
import { resolveContent } from "@/i18n/content";
import type { Lang } from "@/i18n/config";
import { fontVariables } from "./fonts";
import { cleanFolioScript } from "./reading-mode";

export function RootShell({ lang, children }: { lang: Lang; children: ReactNode }) {
  const { ui, shared } = resolveContent(lang);
  return (
    <html
      lang={lang}
      className={fontVariables}
      // The reading-mode script may set data-clean before React hydrates.
      suppressHydrationWarning
    >
      {/* App Router root layouts render <head> directly; the lint rule is
          for the Pages Router and only fires because this file is outside app/. */}
      {/* eslint-disable-next-line @next/next/no-head-element */}
      <head>
        <script dangerouslySetInnerHTML={{ __html: cleanFolioScript }} />
      </head>
      <body>
        {children}
        <ChatWidget lang={lang} strings={ui.chat} email={shared.org.email} />
      </body>
    </html>
  );
}
