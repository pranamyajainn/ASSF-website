import { CORS, originOf, protectedResourceMetadata } from "@/lib/mcp/oauth";

/**
 * Protected resource metadata (RFC 9728) for the MCP server — at the root
 * and at /.well-known/oauth-protected-resource/api/mcp, where clients look.
 */
export function GET(req: Request) {
  return Response.json(protectedResourceMetadata(originOf(req)), { headers: CORS });
}

export function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS });
}
