/**
 * A YouTube film's id from any of the ways its link is written — as the
 * Foundation might paste it into the site editor — or null. Safe to import
 * anywhere.
 */
export function youtubeId(url: string): string | null {
  const raw = url.trim();
  if (/^[\w-]{11}$/.test(raw)) return raw;
  try {
    const u = new URL(raw);
    const host = u.hostname.replace(/^(www|m|music)\./, "");
    let id: string | null = null;
    if (host === "youtu.be") id = u.pathname.slice(1).split("/")[0];
    else if (host === "youtube.com" || host === "youtube-nocookie.com") {
      id = u.searchParams.get("v") ?? u.pathname.match(/^\/(?:embed|shorts|live|v)\/([\w-]{11})/)?.[1] ?? null;
    }
    return id && /^[\w-]{11}$/.test(id) ? id : null;
  } catch {
    return null;
  }
}
