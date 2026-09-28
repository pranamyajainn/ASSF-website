import { openShared } from "@/lib/mail/files";

export const runtime = "nodejs";

/** The shared report itself (the page at /r/<id> links here). */
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const file = await openShared(id).catch(() => null);
  if (!file) {
    return new Response("This link has expired or isn't valid. Ask the Foundation to share the report again.", {
      status: 404,
      headers: { "Content-Type": "text/plain; charset=utf-8", "X-Robots-Tag": "noindex" },
    });
  }
  const download = new URL(req.url).searchParams.has("download");
  return new Response(new Uint8Array(file.bytes), {
    headers: {
      "Content-Type": file.type,
      "Content-Disposition": `${download ? "attachment" : "inline"}; filename*=UTF-8''${encodeURIComponent(file.name)}`,
      "Cache-Control": "private, max-age=3600",
      "X-Robots-Tag": "noindex, nofollow",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
