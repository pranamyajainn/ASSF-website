import "server-only";
import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { emptyEdits, type Edits } from "./edits";

/**
 * Where the site editor's work is kept.
 *
 * In production, in the site's GitHub repository: publishing writes
 * `src/content/edits.json` (and any new photographs) as one commit on the
 * deployed branch, which Vercel builds and serves like any other change —
 * so every publish is in the history, and any one can be restored.
 * The token (CMS_GITHUB_TOKEN) needs only "Contents: read and write" on
 * this one repository.
 *
 * On a developer's machine without a token, the same files are written to
 * the working tree instead.
 */
const token = process.env.CMS_GITHUB_TOKEN;
const repo =
  process.env.CMS_GITHUB_REPO ??
  (process.env.VERCEL_GIT_REPO_OWNER && process.env.VERCEL_GIT_REPO_SLUG
    ? `${process.env.VERCEL_GIT_REPO_OWNER}/${process.env.VERCEL_GIT_REPO_SLUG}`
    : "pranamyajainn/ASSF-website");
const branch = process.env.CMS_GITHUB_BRANCH ?? "main";

export const EDITS_FILE = "src/content/edits.json";
export const storage: "github" | "local" | "none" = token ? "github" : process.env.NODE_ENV === "development" ? "local" : "none";

export class Conflict extends Error {}

async function github<T>(path: string, init: RequestInit & { raw?: boolean } = {}): Promise<T> {
  const res = await fetch(`https://api.github.com/repos/${repo}${path}`, {
    ...init,
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: init.raw ? "application/vnd.github.raw+json" : "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      ...(init.body ? { "Content-Type": "application/json" } : {}),
    },
  });
  if (res.status === 409 || res.status === 422) throw new Conflict(`GitHub ${res.status}`);
  if (!res.ok) throw new Error(`GitHub ${res.status} on ${path}: ${(await res.text()).slice(0, 200)}`);
  return (init.raw ? await res.text() : await res.json()) as T;
}

function parseEdits(text: string): Edits {
  const data = JSON.parse(text) as Partial<Edits>;
  return { revision: data.revision ?? 0, updatedAt: data.updatedAt ?? null, ops: Array.isArray(data.ops) ? data.ops : [] };
}

async function headSha(): Promise<string> {
  const ref = await github<{ object: { sha: string } }>(`/git/ref/heads/${branch}`);
  return ref.object.sha;
}

/** The edits as they stand now — on GitHub, not as last deployed. */
export async function readEdits(at?: string): Promise<{ edits: Edits; commit: string | null }> {
  if (storage === "github") {
    const commit = at ?? (await headSha());
    try {
      return { edits: parseEdits(await github<string>(`/contents/${EDITS_FILE}?ref=${commit}`, { raw: true })), commit };
    } catch (err) {
      if (err instanceof Error && err.message.startsWith("GitHub 404")) return { edits: emptyEdits, commit };
      throw err;
    }
  }
  if (storage === "local") {
    try {
      return { edits: parseEdits(await readFile(join(process.cwd(), EDITS_FILE), "utf8")), commit: null };
    } catch {
      return { edits: emptyEdits, commit: null };
    }
  }
  throw new Error("The site editor isn't connected to storage (CMS_GITHUB_TOKEN is not set).");
}

/**
 * Holds a photograph ready to be published. On GitHub it becomes a blob —
 * stored, but part of nothing until a publish commits it — so a photo that
 * is uploaded and then abandoned never appears in the site or its history.
 */
export async function stageImage(bytes: Buffer, name: string): Promise<{ path: string; blob: string | null }> {
  const hash = createHash("sha256").update(bytes).digest("hex").slice(0, 10);
  const slug =
    name
      .toLowerCase()
      .replace(/\.[a-z0-9]+$/, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 40) || "photo";
  const path = `/images/uploads/${new Date().getFullYear()}/${slug}-${hash}.jpg`;
  if (storage === "github") {
    const blob = await github<{ sha: string }>(`/git/blobs`, {
      method: "POST",
      body: JSON.stringify({ content: bytes.toString("base64"), encoding: "base64" }),
    });
    return { path, blob: blob.sha };
  }
  if (storage === "local") {
    const file = join(process.cwd(), "public", path);
    await mkdir(dirname(file), { recursive: true });
    await writeFile(file, bytes);
    return { path, blob: null };
  }
  throw new Error("The site editor isn't connected to storage.");
}

/**
 * Writes new edits (and staged photographs) as one commit on top of
 * `parent`. If the branch moved on since — another publish, or a code
 * change — this throws Conflict and the caller starts over from the new head.
 */
export async function writeEdits(
  edits: Edits,
  images: readonly { path: string; blob: string }[],
  message: string,
  parent: string | null,
): Promise<string | null> {
  const text = `${JSON.stringify(edits, null, 2)}\n`;
  if (storage === "local") {
    await writeFile(join(process.cwd(), EDITS_FILE), text);
    return null;
  }
  if (storage !== "github" || !parent) throw new Error("The site editor isn't connected to storage.");
  const base = await github<{ tree: { sha: string } }>(`/git/commits/${parent}`);
  const tree = await github<{ sha: string }>(`/git/trees`, {
    method: "POST",
    body: JSON.stringify({
      base_tree: base.tree.sha,
      tree: [
        { path: EDITS_FILE, mode: "100644", type: "blob", content: text },
        ...images.map((img) => ({ path: `public${img.path}`, mode: "100644", type: "blob", sha: img.blob })),
      ],
    }),
  });
  const commit = await github<{ sha: string }>(`/git/commits`, {
    method: "POST",
    body: JSON.stringify({ message, tree: tree.sha, parents: [parent] }),
  });
  await github(`/git/refs/heads/${branch}`, { method: "PATCH", body: JSON.stringify({ sha: commit.sha, force: false }) });
  return commit.sha;
}

export type Publish = { sha: string; message: string; date: string };

/** The latest publishes, newest first. */
export async function history(): Promise<Publish[]> {
  if (storage !== "github") return [];
  const commits = await github<{ sha: string; commit: { message: string; committer: { date: string } } }[]>(
    `/commits?sha=${branch}&path=${EDITS_FILE}&per_page=25`,
  );
  return commits.map((c) => ({ sha: c.sha, message: c.commit.message, date: c.commit.committer.date }));
}

/** Retries `publish` from a fresh head when the branch moved underneath it. */
export async function withRetry<T>(publish: () => Promise<T>, attempts = 3): Promise<T> {
  for (let i = 1; ; i++) {
    try {
      return await publish();
    } catch (err) {
      if (!(err instanceof Conflict) || i >= attempts) throw err;
    }
  }
}
