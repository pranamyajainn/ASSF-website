import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { SignInPanel } from "@/components/portal/sign-in-panel";
import { devEditor, isEditorEmail } from "@/lib/cms/editors";
import { isVaultEmail } from "@/lib/vault/people";

/**
 * Sign-in for the site editor — and for the document vault, which uses the
 * same Google sign-in (`?next=/vault`) with its own list of who may enter.
 */
export default async function EditorSignIn({ searchParams }: { searchParams: Promise<{ error?: string; next?: string }> }) {
  const [{ error, next: asked }, session] = await Promise.all([searchParams, auth().catch(() => null)]);
  // Only back into the editor or the vault — never to another site.
  const area = asked && /^\/vault(\?|$|\/)/.test(asked) ? "vault" : "editor";
  const next = area === "vault" ? asked! : asked && /^\/editor(\?|$|\/)/.test(asked) ? asked : "/editor";
  if (devEditor) redirect(next);
  const email = session?.user?.email;
  if (area === "vault" ? isVaultEmail(email) : isEditorEmail(email)) redirect(next);
  return <SignInPanel area={area} next={next} error={error} />;
}
