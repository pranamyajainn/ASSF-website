import { authorizationServerMetadata, CORS, originOf } from "@/lib/mcp/oauth";

/** OAuth authorization server metadata (RFC 8414), for AI apps connecting to /api/mcp. */
export function GET(req: Request) {
  return Response.json(authorizationServerMetadata(originOf(req)), { headers: CORS });
}

export function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS });
}
