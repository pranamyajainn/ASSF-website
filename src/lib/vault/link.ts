import "server-only";
import { deliver, mailMode } from "@/lib/mail/send";
import { orgForEmail } from "@/lib/mail/org";
import { siteUrl } from "@/lib/site";
import { signLink } from "./link-token";
import { isVaultEmail } from "./people";
import { vaultLink } from "./strings";

/** Emailed links need the site to be able to send email (SMTP_USER / SMTP_PASS). */
export function linksAvailable(): boolean {
  return mailMode !== "none" && !!process.env.AUTH_SECRET;
}

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/**
 * Emails a sign-in link to an address on the vault's list. An address that
 * isn't on it gets nothing, and the asker hears the same answer either way,
 * so the form can't be used to learn who is on the list. False only when
 * sending failed.
 */
export async function emailSignInLink(email: string): Promise<boolean> {
  if (!isVaultEmail(email)) return true;
  const url = new URL("/vault/link", siteUrl);
  url.searchParams.set("t", signLink(email));
  const org = orgForEmail();
  const lines = [...vaultLink.intro, url.href, ...vaultLink.ignore];
  try {
    await deliver({
      to: email,
      subject: vaultLink.subject,
      text: `${lines.join("\n\n")}\n\n${org.name}`,
      html: `<div style="font-family:Georgia,serif;font-size:16px;line-height:1.6;color:#1d1a16;max-width:520px">
${vaultLink.intro.map((l) => `<p style="margin:0 0 10px">${esc(l)}</p>`).join("\n")}
<p style="margin:22px 0"><a href="${esc(url.href)}" style="display:inline-block;background:#1d1a16;color:#f6efe2;padding:12px 22px;text-decoration:none">${esc(vaultLink.enter[0])}</a></p>
${vaultLink.ignore.map((l) => `<p style="margin:0 0 6px;color:#6b6257;font-size:14px">${esc(l)}</p>`).join("\n")}
<p style="margin:22px 0 0;color:#6b6257;font-size:14px">${esc(org.name)}</p>
</div>`,
      replyTo: org.email,
      unsubscribe: null,
      attachment: null,
    });
    return true;
  } catch (err) {
    console.error("Vault sign-in link not sent", err instanceof Error ? err.message : err);
    return false;
  }
}
