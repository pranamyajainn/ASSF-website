import Image from "next/image";
import { headers } from "next/headers";
import { auth, signIn, signOut } from "@/auth";
import { GoogleMark } from "@/components/portal/google-mark";
import { currentEditor } from "@/lib/cms/access";
import { issueCode, lookupClient, redirectAllowed } from "@/lib/mcp/oauth";
import { Consent } from "./consent";

export const metadata = { title: "Connect an AI assistant — Acharya Shanti Sagar Foundation", robots: { index: false, follow: false } };

type Params = {
  response_type?: string;
  client_id?: string;
  redirect_uri?: string;
  code_challenge?: string;
  code_challenge_method?: string;
  state?: string;
};

/** Checks a sign-in request; the client and where to send the answer, or why not. */
async function check(p: Params) {
  const client = p.client_id ? await lookupClient(p.client_id) : null;
  if (!client) return { problem: "This app isn't registered with the site. Remove the connector and add it again." } as const;
  if (!p.redirect_uri || !client.redirectUris.includes(p.redirect_uri) || !redirectAllowed(p.redirect_uri)) {
    return { problem: "This app asked to be sent somewhere the site doesn't allow." } as const;
  }
  if (p.response_type !== "code" || !p.code_challenge || p.code_challenge_method !== "S256") {
    return { problem: "This app's sign-in request is incomplete (it must use PKCE)." } as const;
  }
  return { client, redirect: p.redirect_uri } as const;
}

function answer(redirect: string, values: Record<string, string | undefined>) {
  const url = new URL(redirect);
  for (const [k, v] of Object.entries(values)) if (v) url.searchParams.set(k, v);
  return url.toString();
}

/**
 * Where Claude, ChatGPT or another MCP app asks to work on the site for an
 * editor. The editor signs in with Google (if they haven't), sees which app
 * is asking and what it will be able to do, and allows or refuses.
 */
export default async function Authorize({ searchParams }: { searchParams: Promise<Params> }) {
  const p = await searchParams;
  const checked = await check(p);
  const host = (await headers()).get("host") ?? "";
  const origin = `${host.startsWith("localhost") ? "http" : "https"}://${host}`;
  const here = `/oauth/authorize?${new URLSearchParams(Object.entries(p).filter((e): e is [string, string] => typeof e[1] === "string")).toString()}`;

  if ("problem" in checked) {
    return (
      <Shell title="Can't connect">
        <p className="text-sm leading-relaxed text-orpiment">{checked.problem}</p>
      </Shell>
    );
  }

  const editor = await currentEditor();
  if (!editor) {
    const session = await auth().catch(() => null);
    return (
      <Shell title={`Connect ${checked.client.name}`}>
        {session?.user?.email ? (
          <>
            <p className="text-sm leading-relaxed text-orpiment">
              You&apos;re signed in as {session.user.email}, which isn&apos;t a site editor account.
            </p>
            <form
              className="mt-5"
              action={async () => {
                "use server";
                await signOut({ redirectTo: here });
              }}
            >
              <button type="submit" className="w-full border border-board-ink/25 px-5 py-3 text-board-ink hover:bg-white/5">
                Sign out and use another account
              </button>
            </form>
          </>
        ) : (
          <>
            <p className="mb-5 text-sm leading-relaxed text-board-ink/75">First, sign in with the Google account you use for the site editor.</p>
            <form
              action={async () => {
                "use server";
                await signIn("google", { redirectTo: here });
              }}
            >
              <button
                type="submit"
                className="flex w-full items-center justify-center gap-3 border border-board-ink/25 bg-board-ink px-5 py-3.5 text-base text-ink transition-colors hover:bg-leaf"
              >
                <GoogleMark className="size-5" />
                Continue with Google
              </button>
            </form>
          </>
        )}
      </Shell>
    );
  }

  async function decide(allow: boolean): Promise<string> {
    "use server";
    const again = await check(p);
    const who = await currentEditor();
    if ("problem" in again) throw new Error(again.problem);
    if (!allow || !who) return answer(again.redirect, { error: "access_denied", state: p.state, iss: origin });
    const code = issueCode({
      client_id: p.client_id!,
      redirect_uri: again.redirect,
      code_challenge: p.code_challenge!,
      email: who.email,
      client_name: again.client.name,
    });
    console.info("MCP connect", { client: again.client.name, redirect: new URL(again.redirect).host, editor: who.email });
    return answer(again.redirect, { code, state: p.state, iss: origin });
  }

  return (
    <Shell title={`Allow ${checked.client.name} to work on the website?`}>
      <p className="text-[0.95rem] leading-relaxed text-board-ink/80">
        Signed in as <b className="font-medium text-board-ink">{editor.email}</b>. {checked.client.name} (at{" "}
        <b className="font-medium text-board-ink">{new URL(checked.redirect).host}</b>) is asking to:
      </p>
      <ul className="mt-4 space-y-2 text-[0.95rem] text-board-ink/85">
        <li>✓ Read the site&apos;s pages, in English, हिन्दी and ಕನ್ನಡ</li>
        <li>✓ Search the site and translate text</li>
        <li>✓ Prepare changes for you to review in the site editor</li>
        <li className="text-board-soft">✗ It can&apos;t publish anything — you do that, in the editor</li>
      </ul>
      <Consent decide={decide} />
      <p className="mt-4 text-xs leading-relaxed text-board-ink/45">
        You can disconnect it any time from the app&apos;s connector settings. Removing your email from the editor list also cuts it off.
      </p>
    </Shell>
  );
}

function Shell({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-board-deep px-5 py-16">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center text-center">
          <Image src="/icon.png" alt="" width={56} height={56} className="size-14" />
          <p className="mt-4 font-mono text-[0.75rem] uppercase tracking-[0.08em] text-board-soft">Acharya Shanti Sagar Foundation · Site editor</p>
          <h1 className="mt-2 font-display text-2xl text-board-ink">{title}</h1>
        </div>
        <div className="mt-8 border border-board-ink/15 bg-board p-6">{children}</div>
      </div>
    </main>
  );
}
