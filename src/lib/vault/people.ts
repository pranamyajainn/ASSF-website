/**
 * Who may open the Foundation's document vault: the Google accounts in the
 * VAULT_EMAILS environment variable (comma-separated), set in Vercel. Until
 * it is set, the site editors (EDITOR_EMAILS) may — the same people who
 * already hold the keys to the site. Kept out of the code because this
 * repository is public.
 *
 * No server-only import: auth.ts (which the proxy loads) asks this too.
 */
import { devEditor, editorEmails } from "@/lib/cms/editors";

function listed(): string[] {
  const own = (process.env.VAULT_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  return own.length ? own : editorEmails();
}

export function isVaultEmail(email: string | null | undefined): boolean {
  if (devEditor && email === devEditor) return true;
  return !!email && listed().includes(email.trim().toLowerCase());
}

export function vaultConfigured(): boolean {
  return listed().length > 0 || !!devEditor;
}
