"use client";

import { BrokenLeaf } from "@/components/site/broken-leaf";

export default function EnglishError({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return <BrokenLeaf lang="en" error={error} retry={retry} />;
}
