import { isEditorEmail } from "@/lib/cms/editors";
import { TranslationError } from "@/lib/cms/translate";
import { verify } from "@/lib/mcp/jwt";
import { CORS, originOf, resourceOf, type AccessClaims } from "@/lib/mcp/oauth";
import { INSTRUCTIONS, ToolError, TOOLS } from "@/lib/mcp/tools";
import { overLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const maxDuration = 60;

/**
 * The website's MCP server (Streamable HTTP, stateless): Claude, ChatGPT and
 * other MCP apps connect here, signed in as a site editor (see
 * lib/mcp/oauth.ts), and get the tools in lib/mcp/tools.ts.
 */
const VERSIONS = ["2025-11-25", "2025-06-18", "2025-03-26", "2024-11-05"];
const SERVER = { name: "assf-website", title: "Acharya Shanti Sagar Foundation website", version: "1.0.0" };

type Message = { jsonrpc?: string; id?: string | number | null; method?: string; params?: Record<string, unknown> };

const rpcError = (id: Message["id"], code: number, message: string) => ({ jsonrpc: "2.0", id: id ?? null, error: { code, message } });

function unauthorized(req: Request, description: string, error = "invalid_token") {
  const metadata = `${originOf(req)}/.well-known/oauth-protected-resource/api/mcp`;
  return new Response(JSON.stringify({ error, error_description: description }), {
    status: 401,
    headers: {
      ...CORS,
      "Content-Type": "application/json",
      "WWW-Authenticate": `Bearer resource_metadata="${metadata}", error="${error}", error_description="${description}"`,
    },
  });
}

async function handle(msg: Message, who: AccessClaims, origin: string): Promise<object | null> {
  if (msg.id === undefined || msg.id === null) return null; // a notification: nothing to answer
  switch (msg.method) {
    case "initialize": {
      const asked = typeof msg.params?.protocolVersion === "string" ? msg.params.protocolVersion : "";
      return {
        jsonrpc: "2.0",
        id: msg.id,
        result: {
          protocolVersion: VERSIONS.includes(asked) ? asked : VERSIONS[0],
          capabilities: { tools: { listChanged: false } },
          serverInfo: SERVER,
          instructions: INSTRUCTIONS,
        },
      };
    }
    case "ping":
      return { jsonrpc: "2.0", id: msg.id, result: {} };
    case "tools/list":
      return {
        jsonrpc: "2.0",
        id: msg.id,
        result: { tools: TOOLS.map(({ name, title, description, inputSchema, annotations }) => ({ name, title, description, inputSchema, annotations: { title, ...annotations } })) },
      };
    case "tools/call": {
      const tool = TOOLS.find((t) => t.name === msg.params?.name);
      if (!tool) return rpcError(msg.id, -32602, `Unknown tool: ${String(msg.params?.name)}`);
      const args = (msg.params?.arguments ?? {}) as Record<string, unknown>;
      try {
        const text = await tool.run(args, { email: who.sub, app: who.client_name, origin });
        return { jsonrpc: "2.0", id: msg.id, result: { content: [{ type: "text", text }], isError: false } };
      } catch (err) {
        const known = err instanceof ToolError || err instanceof TranslationError;
        if (!known) console.error("MCP tool failed", tool.name, err);
        const text = known ? (err as Error).message : "Something went wrong on the website's side. Please try again.";
        return { jsonrpc: "2.0", id: msg.id, result: { content: [{ type: "text", text }], isError: true } };
      }
    }
    case "resources/list":
      return { jsonrpc: "2.0", id: msg.id, result: { resources: [] } };
    case "prompts/list":
      return { jsonrpc: "2.0", id: msg.id, result: { prompts: [] } };
    default:
      return rpcError(msg.id, -32601, `Method not found: ${msg.method}`);
  }
}

export async function POST(req: Request) {
  const origin = originOf(req);
  const token = req.headers.get("authorization")?.match(/^Bearer\s+(.+)$/i)?.[1];
  if (!token) return unauthorized(req, "Sign in to connect to the website.", "invalid_request");
  const who = verify<AccessClaims>("access", token);
  if (!who || who.aud !== resourceOf(origin)) return unauthorized(req, "The sign-in has expired. Please reconnect.");
  if (!isEditorEmail(who.sub)) {
    return new Response(JSON.stringify({ error: "insufficient_scope", error_description: "This account is no longer a site editor." }), {
      status: 403,
      headers: { ...CORS, "Content-Type": "application/json" },
    });
  }
  const wait = overLimit(`mcp:${who.sub}`, [
    { ms: 60_000, max: 60 },
    { ms: 60 * 60_000, max: 900 },
  ]);
  if (wait) return new Response("Too many requests — please slow down.", { status: 429, headers: { ...CORS, "Retry-After": String(wait) } });

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json(rpcError(null, -32700, "Parse error"), { status: 400, headers: CORS });
  }
  const batch = Array.isArray(body);
  const messages = (batch ? body : [body]) as Message[];
  if (!messages.length || messages.some((m) => !m || typeof m !== "object" || m.jsonrpc !== "2.0")) {
    return Response.json(rpcError(null, -32600, "Invalid request"), { status: 400, headers: CORS });
  }
  const answers = (await Promise.all(messages.map((m) => handle(m, who, origin)))).filter(Boolean);
  if (!answers.length) return new Response(null, { status: 202, headers: CORS });
  return Response.json(batch ? answers : answers[0], { headers: { ...CORS, "Cache-Control": "no-store" } });
}

/** No server-initiated stream: this server only answers requests. */
export function GET() {
  return new Response("Method not allowed", { status: 405, headers: { ...CORS, Allow: "POST, OPTIONS" } });
}

export function DELETE() {
  return new Response("Method not allowed", { status: 405, headers: { ...CORS, Allow: "POST, OPTIONS" } });
}

export function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS });
}
