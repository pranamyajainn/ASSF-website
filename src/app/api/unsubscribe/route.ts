import { unsubscribe } from "@/lib/mail/unsubscribe";

export const runtime = "nodejs";

/** One-click unsubscribe (RFC 8058): what Gmail's "Unsubscribe" button posts to. */
export async function POST(req: Request) {
  const email = await unsubscribe(new URL(req.url).searchParams.get("t")).catch(() => null);
  return new Response(email ? "Unsubscribed." : "This link isn't valid.", { status: email ? 200 : 400 });
}
