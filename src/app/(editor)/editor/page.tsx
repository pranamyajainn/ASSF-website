import { redirect } from "next/navigation";
import { signOut } from "@/auth";
import { EditorRoot } from "@/components/editor/editor-app";
import { baseContent, publishedEdits } from "@/i18n/content";
import { locales, type Lang } from "@/i18n/config";
import { currentEditor } from "@/lib/cms/access";
import { readEdits, storage } from "@/lib/cms/store";
import { decodeProposal } from "@/lib/mcp/proposal";

/**
 * The site editor. It opens on the content as it stands on GitHub (which may
 * be a publish or two ahead of what is deployed), over the three editions'
 * base content from the code.
 */
export default async function EditorPage({ searchParams }: { searchParams: Promise<{ proposal?: string }> }) {
  const { proposal: token } = await searchParams;
  const editor = await currentEditor();
  // Keep a review link through sign-in.
  if (!editor) redirect(token ? `/editor/sign-in?next=${encodeURIComponent(`/editor?proposal=${token}`)}` : "/editor/sign-in");
  const proposal = token ? decodeProposal(token) : null;

  if (storage === "none") {
    return (
      <Notice title="The editor isn't connected yet">
        Publishing needs a GitHub access token in the site&apos;s settings (CMS_GITHUB_TOKEN). Ask the web team to add it — nothing
        else needs to change.
      </Notice>
    );
  }

  let initial;
  try {
    initial = (await readEdits()).edits;
  } catch (err) {
    console.error("CMS could not read edits", err);
    return <Notice title="The editor couldn't load">The site&apos;s content couldn&apos;t be read just now. Please reload in a minute.</Notice>;
  }

  const base = Object.fromEntries(locales.map((l) => [l, baseContent(l)])) as Record<Lang, unknown>;

  async function leave() {
    "use server";
    await signOut({ redirectTo: "/editor/sign-in" });
  }

  return (
    <EditorRoot
      base={base}
      initial={initial}
      deployed={publishedEdits.revision}
      storage={storage}
      editor={editor}
      signOut={leave}
      proposal={proposal}
      badProposal={!!token && !proposal}
    />
  );
}

function Notice({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <main className="grid min-h-dvh place-items-center bg-board-deep px-4">
      <div className="max-w-md rounded-xl bg-leaf px-8 py-10">
        <h1 className="font-display text-2xl">{title}</h1>
        <p className="mt-3 leading-relaxed text-ink-soft">{children}</p>
      </div>
    </main>
  );
}
