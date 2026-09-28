/**
 * An update as it arrives in someone's inbox: the Foundation's plain text,
 * set in the site's look — leaf-coloured page, the mark and name, a
 * heading, the words, and a footer with the Foundation's details and an
 * unsubscribe link. Email clients ignore most modern CSS, so this is tables
 * and inline styles, with serif system fonts. Safe to use in the browser
 * (for the editor's preview) and on the server (for sending).
 *
 * Writing rules for the text, kept simple enough to explain in one line:
 * a blank line starts a new paragraph; a line starting with "-" or "•" is a
 * list item; web addresses become links; **words** are bold.
 */
export type Email = {
  subject: string;
  body: string;
  /** The site's address, for the logo and links (https://…). */
  site: string;
  /** This reader's own unsubscribe link, when they're on the mailing list. */
  unsubscribe?: string | null;
  /** Name of an attached file, mentioned under the text. */
  attachment?: string | null;
  org: { name: string; tagline: string; office: string; phone: string; email: string };
};

const INK = "#1d1812";
const SOFT = "#4a4134";
const FAINT = "#6b6050";
const CINNABAR = "#a82e17";
const LEAF = "#f0e7d0";
const PAPER = "#fbf7ec";
const SERIF = "Georgia, 'Iowan Old Style', 'Times New Roman', serif";

const escape = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function inline(text: string): string {
  return escape(text)
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/(https?:\/\/[^\s<]+[^\s<.,;:!?)])/g, `<a href="$1" style="color:${CINNABAR};text-decoration:underline">$1</a>`);
}

type Block = { kind: "p"; text: string } | { kind: "ul"; items: string[] };

export function blocks(body: string): Block[] {
  const out: Block[] = [];
  for (const chunk of body.replace(/\r\n?/g, "\n").split(/\n\s*\n/)) {
    const lines = chunk.split("\n").map((l) => l.trim()).filter(Boolean);
    if (!lines.length) continue;
    let para: string[] = [];
    let list: string[] = [];
    const flush = () => {
      if (para.length) out.push({ kind: "p", text: para.join(" ") });
      if (list.length) out.push({ kind: "ul", items: list });
      para = [];
      list = [];
    };
    for (const line of lines) {
      const item = /^[-•*]\s+(.*)$/.exec(line);
      if (item) {
        if (para.length) flush();
        list.push(item[1]);
      } else {
        if (list.length) flush();
        para.push(line);
      }
    }
    flush();
  }
  return out;
}

export function renderEmail(e: Email): { html: string; text: string } {
  const body = blocks(e.body)
    .map((b) =>
      b.kind === "p"
        ? `<p style="margin:0 0 18px;font:17px/1.65 ${SERIF};color:${INK}">${inline(b.text)}</p>`
        : `<ul style="margin:0 0 18px;padding-left:22px;font:17px/1.65 ${SERIF};color:${INK}">${b.items.map((i) => `<li style="margin:0 0 6px">${inline(i)}</li>`).join("")}</ul>`,
    )
    .join("");
  const attachment = e.attachment
    ? `<p style="margin:6px 0 0;padding:12px 14px;background:${LEAF};font:15px/1.5 ${SERIF};color:${SOFT}">📎 Attached: <strong>${escape(e.attachment)}</strong></p>`
    : "";
  const unsubscribe = e.unsubscribe
    ? `<br>You're receiving this because you're on the Foundation's mailing list. <a href="${escape(e.unsubscribe)}" style="color:${FAINT};text-decoration:underline">Unsubscribe</a>.`
    : "";
  const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light"><title>${escape(e.subject)}</title></head>
<body style="margin:0;padding:0;background:${LEAF}">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${LEAF}"><tr><td align="center" style="padding:28px 12px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:${PAPER};border:1px solid #e3d6b4">
<tr><td style="padding:26px 32px 18px;border-bottom:3px solid ${CINNABAR}">
<table role="presentation" cellpadding="0" cellspacing="0"><tr>
<td style="padding-right:14px;vertical-align:middle"><img src="${escape(e.site)}/icon.png" width="44" height="44" alt="" style="display:block"></td>
<td style="vertical-align:middle"><div style="font:600 19px/1.2 ${SERIF};color:${INK}">${escape(e.org.name)}</div><div style="font:14px/1.4 ${SERIF};color:${CINNABAR}">${escape(e.org.tagline)}</div></td>
</tr></table></td></tr>
<tr><td style="padding:30px 32px 12px">
<h1 style="margin:0 0 20px;font:600 26px/1.25 ${SERIF};color:${INK}">${escape(e.subject)}</h1>
${body}${attachment}
</td></tr>
<tr><td style="padding:18px 32px 26px;border-top:1px solid #e3d6b4;font:13px/1.6 ${SERIF};color:${FAINT}">
${escape(e.org.name)} · ${escape(e.org.office)}<br>
<a href="tel:${escape(e.org.phone.replace(/\s/g, ""))}" style="color:${FAINT}">${escape(e.org.phone)}</a> · <a href="mailto:${escape(e.org.email)}" style="color:${FAINT}">${escape(e.org.email)}</a> · <a href="${escape(e.site)}" style="color:${FAINT}">${escape(e.site.replace(/^https?:\/\//, ""))}</a>${unsubscribe}
</td></tr>
</table></td></tr></table>
</body></html>`;
  const text = [
    e.subject,
    "",
    ...blocks(e.body).map((b) => (b.kind === "p" ? `${b.text.replace(/\*\*/g, "")}\n` : `${b.items.map((i) => `• ${i.replace(/\*\*/g, "")}`).join("\n")}\n`)),
    e.attachment ? `Attached: ${e.attachment}\n` : "",
    "—",
    `${e.org.name} · ${e.org.office}`,
    `${e.org.phone} · ${e.org.email} · ${e.site}`,
    e.unsubscribe ? `Unsubscribe: ${e.unsubscribe}` : "",
  ]
    .filter((l) => l !== "")
    .join("\n");
  return { html, text };
}
