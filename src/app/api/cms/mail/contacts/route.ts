import { editorRequest } from "@/lib/cms/access";
import { EMAIL, GROUPS, normalise, updateMail, type Contact } from "@/lib/mail/data";

export const runtime = "nodejs";

const GROUP_IDS = new Set<string>(GROUPS.map((g) => g.id));
const MAX_CONTACTS = 5000;

/**
 * Saves the mailing list. Someone who unsubscribed stays unsubscribed —
 * the editor can remove them, but not sign them up again.
 */
export async function PUT(req: Request) {
  const editor = await editorRequest(req);
  if (editor instanceof Response) return editor;
  const body = (await req.json().catch(() => null)) as { contacts?: unknown } | null;
  if (!Array.isArray(body?.contacts)) return new Response("No contacts sent.", { status: 400 });
  if (body.contacts.length > MAX_CONTACTS) return new Response(`The list can hold up to ${MAX_CONTACTS} people.`, { status: 413 });

  const incoming: Contact[] = [];
  const seen = new Set<string>();
  for (const raw of body.contacts as Partial<Contact>[]) {
    const email = typeof raw?.email === "string" ? normalise(raw.email) : "";
    if (!EMAIL.test(email) || seen.has(email)) continue;
    seen.add(email);
    incoming.push({
      email,
      name: typeof raw.name === "string" ? raw.name.trim().slice(0, 120) : "",
      groups: Array.isArray(raw.groups) ? [...new Set(raw.groups.filter((g): g is string => typeof g === "string" && GROUP_IDS.has(g)))] : [],
      unsubscribed: null,
      added: typeof raw.added === "string" ? raw.added : new Date().toISOString(),
    });
  }
  try {
    const data = await updateMail((current) => {
      const left = new Map(current.contacts.filter((c) => c.unsubscribed).map((c) => [c.email, c.unsubscribed]));
      return { ...current, contacts: incoming.map((c) => ({ ...c, unsubscribed: left.get(c.email) ?? null })) };
    }, "Mailing list updated");
    console.info("Mail contacts saved", { editor: editor.email, count: data.contacts.length });
    return Response.json({ contacts: data.contacts });
  } catch (err) {
    console.error("Mail contacts save failed", err);
    return new Response("The list couldn't be saved. Please try again.", { status: 502 });
  }
}
