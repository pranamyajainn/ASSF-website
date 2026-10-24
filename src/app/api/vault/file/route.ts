import { vaultRequest } from "@/lib/vault/access";
import { openDocument, storeConnected } from "@/lib/vault/store";

export const runtime = "nodejs";

/**
 * One of the Foundation's documents, for someone on the vault's list — the
 * only way a file leaves the private store. `?p=<path>` names it;
 * `&download` saves it rather than opening it in the browser. Signed out:
 * 401. Signed in with another account: 403.
 */
export async function GET(req: Request) {
  const user = await vaultRequest(req);
  if (user instanceof Response) return user;
  if (!storeConnected()) return new Response("The document store isn't connected yet.", { status: 503 });

  const url = new URL(req.url);
  const doc = await openDocument(url.searchParams.get("p") ?? "").catch((err) => {
    console.error("Vault read failed", err);
    return null;
  });
  if (!doc) return new Response("That document isn't in the vault.", { status: 404, headers: { "Cache-Control": "no-store" } });

  const download = url.searchParams.has("download");
  console.info("Vault file", { path: url.searchParams.get("p"), by: user.email, download });
  return new Response(doc.stream, {
    headers: {
      "Content-Type": doc.type,
      "Content-Length": String(doc.size),
      "Content-Disposition": `${download || doc.type === "application/octet-stream" ? "attachment" : "inline"}; filename*=UTF-8''${encodeURIComponent(doc.name)}`,
      "Cache-Control": "private, no-store",
      "X-Robots-Tag": "noindex, nofollow",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
