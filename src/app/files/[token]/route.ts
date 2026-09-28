import { openFile } from "@/lib/mail/files";

export const runtime = "nodejs";

/** A shared report, opened from its link (e.g. in a WhatsApp message). */
export async function GET(_req: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const file = await openFile(token).catch(() => null);
  if (!file) {
    return new Response("This link has expired or isn't valid. Ask the Foundation to share the report again.", {
      status: 404,
      headers: { "Content-Type": "text/plain; charset=utf-8", "X-Robots-Tag": "noindex" },
    });
  }
  return new Response(new Uint8Array(file.bytes), {
    headers: {
      "Content-Type": file.type,
      "Content-Disposition": `inline; filename*=UTF-8''${encodeURIComponent(file.name)}`,
      "Cache-Control": "private, max-age=3600",
      "X-Robots-Tag": "noindex, nofollow",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
