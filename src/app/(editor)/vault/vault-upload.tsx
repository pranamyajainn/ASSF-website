"use client";

import { upload } from "@vercel/blob/client";
import { useRouter } from "next/navigation";
import { useId, useState } from "react";
import { ALLOWED_TYPES, MAX_BYTES, newPath, type Group } from "@/lib/vault/paths";
import type { vaultStrings } from "@/lib/vault/strings";

type Strings = (typeof vaultStrings)["en"];
type State = { kind: "idle" } | { kind: "busy"; percent: number } | { kind: "done" } | { kind: "error"; message: string };

/**
 * One group's "Upload a document": the file goes from the browser straight
 * to the private store, with a token this site issues only to people on the
 * vault's list (/api/vault/upload). Large files go up in parts.
 */
export function VaultUpload({ group, t }: { group: Group; t: Strings }) {
  const [state, setState] = useState<State>({ kind: "idle" });
  const router = useRouter();
  const id = useId();

  async function send(file: File) {
    if (file.size > MAX_BYTES) return setState({ kind: "error", message: t.tooLarge });
    if (!(file.type in ALLOWED_TYPES)) return setState({ kind: "error", message: t.wrongType });
    setState({ kind: "busy", percent: 0 });
    try {
      await upload(newPath(group, file.name), file, {
        access: "private",
        handleUploadUrl: "/api/vault/upload",
        contentType: file.type,
        multipart: file.size > 20 * 1024 * 1024,
        onUploadProgress: ({ percentage }) => setState({ kind: "busy", percent: Math.round(percentage) }),
      });
      setState({ kind: "done" });
      router.refresh();
    } catch (err) {
      console.error("Vault upload failed", err);
      setState({ kind: "error", message: t.failed });
    }
  }

  const busy = state.kind === "busy";
  return (
    <div className="flex flex-col items-start gap-1.5 sm:items-end">
      <label
        htmlFor={id}
        className={`inline-flex min-h-11 cursor-pointer items-center bg-cinnabar px-4 text-[0.95rem] text-leaf transition-colors hover:bg-cinnabar-deep has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-cinnabar ${busy ? "pointer-events-none opacity-60" : ""}`}
      >
        + {t.upload}
        <input
          id={id}
          type="file"
          className="sr-only"
          disabled={busy}
          accept={Object.keys(ALLOWED_TYPES).join(",")}
          onChange={(e) => {
            const file = e.target.files?.[0];
            e.target.value = "";
            if (file) void send(file);
          }}
        />
      </label>
      <p aria-live="polite" className={`font-mono text-register ${state.kind === "error" ? "text-cinnabar" : "text-ink-faint"}`}>
        {state.kind === "busy" ? t.uploading.replace("{percent}", String(state.percent)) : state.kind === "done" ? t.uploaded : state.kind === "error" ? state.message : t.accepted}
      </p>
    </div>
  );
}
