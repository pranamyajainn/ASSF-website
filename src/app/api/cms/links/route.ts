import { editorRequest } from "@/lib/cms/access";

export const runtime = "nodejs";
export const maxDuration = 30;

/** Addresses that are never another website: this machine, and private networks. */
const PRIVATE = /^(localhost|.*\.local|.*\.internal|127\.|10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.|169\.254\.|0\.|\[?::1\]?|\[?f[cd][0-9a-f]{2}:)/i;

async function opens(url: string): Promise<{ ok: boolean; status: number }> {
  const attempt = async (method: "HEAD" | "GET") => {
    const res = await fetch(url, {
      method,
      redirect: "follow",
      signal: AbortSignal.timeout(7000),
      headers: { "User-Agent": "Mozilla/5.0 (compatible; ASSF site check)", Accept: "text/html,*/*" },
    });
    await res.body?.cancel().catch(() => {});
    return res.status;
  };
  try {
    let status = await attempt("HEAD");
    // Some sites refuse HEAD, or bots: ask for the page itself before calling it broken.
    if (status === 405 || status === 403 || status === 404 || status >= 500) status = await attempt("GET");
    // 403/429 mean the site answered but turned the checker away — not a broken link.
    return { ok: status < 400 || status === 403 || status === 429, status };
  } catch {
    return { ok: false, status: 0 };
  }
}

/** The editor's Site check: do these links to other websites still open? */
export async function POST(req: Request) {
  const editor = await editorRequest(req);
  if (editor instanceof Response) return editor;
  const body = (await req.json().catch(() => null)) as { urls?: unknown } | null;
  const urls = (Array.isArray(body?.urls) ? body.urls : [])
    .filter((u): u is string => typeof u === "string")
    .filter((u) => {
      try {
        const { protocol, hostname } = new URL(u);
        return (protocol === "https:" || protocol === "http:") && !PRIVATE.test(hostname);
      } catch {
        return false;
      }
    })
    .slice(0, 40);
  const results = await Promise.all(urls.map(async (url) => ({ url, ...(await opens(url)) })));
  return Response.json({ results });
}
