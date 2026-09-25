/**
 * Who may use the site editor: the Google accounts listed in the
 * EDITOR_EMAILS environment variable (comma-separated), set in Vercel.
 * Kept out of the code because this repository is public.
 *
 * No server-only import: auth.ts (which the proxy loads) asks this too.
 */
function listed(): string[] {
  return (process.env.EDITOR_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export function isEditorEmail(email: string | null | undefined): boolean {
  return !!email && listed().includes(email.trim().toLowerCase());
}

export function editorsConfigured(): boolean {
  return listed().length > 0;
}

/**
 * On a developer's machine only (`next dev`), CMS_DEV_EDITOR=<any email>
 * stands in for a Google sign-in, so the editor can be worked on without
 * OAuth. It can never apply to a production build.
 */
export const devEditor = process.env.NODE_ENV === "development" ? process.env.CMS_DEV_EDITOR || null : null;
