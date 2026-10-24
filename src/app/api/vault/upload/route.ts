import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { vaultRequest } from "@/lib/vault/access";
import { ALLOWED_TYPES, isVaultPath, MAX_BYTES } from "@/lib/vault/paths";
import { storeConnected } from "@/lib/vault/store";

export const runtime = "nodejs";

/**
 * Lets the vault page upload one document straight to the private store:
 * the browser asks here first, and gets a short-lived token for exactly the
 * path it named — only for someone on the vault's list, only into one of the
 * four groups, only PDFs, images, Word and Excel files, and never over an
 * existing document. Files don't pass through this server, so large scans
 * aren't held back by its request-size limit.
 */
export async function POST(req: Request) {
  const user = await vaultRequest(req);
  if (user instanceof Response) return user;
  if (!storeConnected()) return new Response("The document store isn't connected yet.", { status: 503 });

  let body: HandleUploadBody;
  try {
    body = (await req.json()) as HandleUploadBody;
  } catch {
    return new Response("Invalid request.", { status: 400 });
  }
  // Only token requests: no completion callback is registered, so none is expected.
  if (body?.type !== "blob.generate-client-token") return new Response("Invalid request.", { status: 400 });

  try {
    const result = await handleUpload({
      body,
      request: req,
      onBeforeGenerateToken: async (pathname) => {
        if (!isVaultPath(pathname)) throw new Error("Not a vault path.");
        return {
          allowedContentTypes: Object.keys(ALLOWED_TYPES),
          maximumSizeInBytes: MAX_BYTES,
          addRandomSuffix: false,
          allowOverwrite: false,
          validUntil: Date.now() + 10 * 60 * 1000,
        };
      },
    });
    // Who uploaded what stays in the server logs, not in the store.
    console.info("Vault upload", { path: body.payload.pathname, by: user.email });
    return Response.json(result);
  } catch (err) {
    console.error("Vault upload refused", err);
    return new Response("This file can't be uploaded.", { status: 400 });
  }
}
