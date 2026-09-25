"use client";

import { useParams } from "next/navigation";
import { BrokenLeaf } from "@/components/site/broken-leaf";
import { isLang } from "@/i18n/config";

export default function EditionError({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  const { lang } = useParams<{ lang: string }>();
  return <BrokenLeaf lang={isLang(lang) ? lang : "en"} error={error} retry={retry} />;
}
