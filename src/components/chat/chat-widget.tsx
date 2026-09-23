"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { org } from "@/content/shared";

type Role = "user" | "assistant";
type Msg = { role: Role; content: string };

const STORAGE_KEY = "assf-chat-v1";
const TEASER_KEY = "assf-chat-teaser-seen";

const GREETING: Msg = {
  role: "assistant",
  content:
    "I'm the Foundation's AI assistant. I answer from its published pages — on manuscript conservation, rural infrastructure and community services, or about Acharya Shri Shantisagar Ji himself. What would you like to know?",
};

/** Any part of the site can open the assistant by dispatching this event. */
export const OPEN_CHAT_EVENT = "assf:open-chat";

/**
 * The "AI" stamp. The assistant is an AI and says so everywhere it
 * appears — typed like an accession mark, in the site's register voice,
 * rather than decorated with a sparkle.
 */
export function AiStamp({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-block border border-current px-1 py-px font-mono text-[0.68rem] leading-none tracking-[0.08em] ${className}`}
    >
      AI
    </span>
  );
}

const STARTERS = [
  "What does ASSF do?",
  "How can I support the work?",
  "Tell me about Acharya Shantisagar Ji",
  "How do I get manuscripts surveyed?",
];

function loadMessages(): Msg[] {
  if (typeof window === "undefined") return [GREETING];
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return [GREETING];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) return parsed as Msg[];
  } catch {
    // fall through to default
  }
  return [GREETING];
}

export function ChatWidget() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([GREETING]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showTeaser, setShowTeaser] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const fabRef = useRef<HTMLButtonElement>(null);

  // Load any prior conversation once, client-side only — sessionStorage isn't
  // available during SSR, so the default render must stay the static
  // greeting and this hydrates it in after mount rather than up front.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMessages(loadMessages());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch {
      // sessionStorage unavailable — conversation just won't persist
    }
  }, [messages, hydrated]);

  // A single, quiet invitation — once per session, only if the visitor hasn't engaged yet.
  useEffect(() => {
    if (!hydrated) return;
    let seen = false;
    try {
      seen = sessionStorage.getItem(TEASER_KEY) === "1";
    } catch {
      seen = false;
    }
    if (seen || open) return;
    const timer = setTimeout(() => setShowTeaser(true), 3800);
    return () => clearTimeout(timer);
  }, [hydrated, open]);

  function dismissTeaser() {
    setShowTeaser(false);
    try {
      sessionStorage.setItem(TEASER_KEY, "1");
    } catch {
      // ignore
    }
  }

  // The masthead's "Ask AI" button (and anything else) opens the panel.
  useEffect(() => {
    function onOpen() {
      setOpen(true);
      setShowTeaser(false);
      try {
        sessionStorage.setItem(TEASER_KEY, "1");
      } catch {
        // ignore
      }
    }
    window.addEventListener(OPEN_CHAT_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_CHAT_EVENT, onOpen);
  }, []);

  useLayoutEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, open]);

  useEffect(() => {
    if (open) {
      const t = setTimeout(() => inputRef.current?.focus(), 150);
      return () => clearTimeout(t);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        fabRef.current?.focus();
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  function appendToLastAssistant(chunk: string) {
    setMessages((prev) => {
      const copy = [...prev];
      const last = copy[copy.length - 1];
      if (last && last.role === "assistant") {
        copy[copy.length - 1] = { ...last, content: last.content + chunk };
      }
      return copy;
    });
  }

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || isStreaming) return;

    setError(null);
    const payload = [...messages, { role: "user" as const, content: trimmed }];
    setMessages([...payload, { role: "assistant", content: "" }]);
    setInput("");
    setIsStreaming(true);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: payload }),
        signal: controller.signal,
      });

      if (!res.ok || !res.body) {
        const detail = await res.text().catch(() => "");
        throw new Error(detail || "The assistant is temporarily unavailable. Please try again shortly.");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        appendToLastAssistant(decoder.decode(value, { stream: true }));
      }
    } catch (err) {
      if ((err as Error).name !== "AbortError") {
        const message = (err as Error).message;
        setError(message || `Something went wrong. Please try again, or reach us at ${org.email}.`);
        setMessages((prev) => prev.slice(0, -1));
      }
    } finally {
      setIsStreaming(false);
      abortRef.current = null;
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    send(input);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send(input);
    }
  }

  function autoResize(el: HTMLTextAreaElement) {
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  }

  function resetConversation() {
    if (abortRef.current) abortRef.current.abort();
    setIsStreaming(false);
    setError(null);
    setMessages([GREETING]);
  }

  const hasConversation = messages.length > 1 || messages[0]?.content !== GREETING.content;

  // The trustee portal is its own secure area, not part of the public site
  // this assistant is grounded in — keep it off those routes entirely.
  if (pathname?.startsWith("/trustee-portal")) return null;

  return (
    <>
      {/* Proactive teaser: a note slipped into the margin, once per session. */}
      {showTeaser && !open ? (
        <div
          className="on-dark fixed bottom-[5.25rem] right-5 z-40 max-w-[16rem] animate-[teaser-in_0.35s_ease-out] border-l-2 border-cinnabar bg-board py-3.5 pl-4 pr-9 text-board-ink shadow-[0_12px_30px_rgb(23_17_12/0.35)] sm:right-6"
          role="status"
        >
          <button
            type="button"
            onClick={dismissTeaser}
            aria-label="Dismiss"
            className="absolute right-1.5 top-1.5 p-1.5 text-board-soft transition-colors hover:text-board-ink"
          >
            <CloseIcon className="size-3.5" />
          </button>
          <p className="text-[0.98rem] leading-snug">
            A question about the Foundation&apos;s work? Ask our{" "}
            <span className="whitespace-nowrap">
              AI assistant <AiStamp className="ml-0.5 text-orpiment" />
            </span>
          </p>
          <button
            type="button"
            onClick={() => {
              setOpen(true);
              dismissTeaser();
            }}
            className="mt-2 font-mono text-register text-orpiment underline decoration-orpiment/40 underline-offset-4 hover:decoration-orpiment"
          >
            Start a conversation
          </button>
        </div>
      ) : null}

      {/* Panel */}
      {open ? (
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label={`${org.nameLatin} assistant`}
          className="fixed inset-0 z-50 flex flex-col bg-leaf sm:inset-auto sm:bottom-[5.25rem] sm:right-6 sm:h-[38rem] sm:max-h-[80vh] sm:w-[24rem] sm:animate-[panel-in_0.22s_cubic-bezier(0.16,1,0.3,1)] sm:border sm:border-ink/25 sm:shadow-[0_24px_60px_rgb(23_17_12/0.3)]"
          style={{ backgroundImage: "var(--fibre)" }}
        >
          {/* Header — the board */}
          <div className="on-dark flex shrink-0 items-center gap-3 bg-board px-4 py-3 text-board-ink">
            <Image src="/icon.png" alt="" width={32} height={32} className="size-8" />
            <div className="min-w-0 flex-1">
              <p className="flex items-center gap-2 font-display text-[1.1rem] font-medium leading-tight">
                Ask the Foundation
                <AiStamp className="text-orpiment" />
              </p>
              <p className="truncate font-mono text-[0.72rem] text-board-soft">
                AI assistant · answers from its published pages
              </p>
            </div>
            {hasConversation ? (
              <button
                type="button"
                onClick={resetConversation}
                title="Start a new conversation"
                aria-label="Start a new conversation"
                className="shrink-0 p-2 text-board-soft transition-colors hover:text-board-ink"
              >
                <ResetIcon className="size-4" />
              </button>
            ) : null}
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              className="shrink-0 p-2 text-board-soft transition-colors hover:text-board-ink"
            >
              <CloseIcon className="size-4.5" />
            </button>
          </div>

          {/* Transcript */}
          <div
            ref={scrollRef}
            className="flex-1 space-y-5 overflow-y-auto px-5 py-5"
            aria-live="polite"
          >
            {messages.map((m, i) => (
              <MessageBubble
                key={i}
                message={m}
                isLast={i === messages.length - 1}
                isStreaming={isStreaming}
              />
            ))}

            {messages.length === 1 ? (
              <ul className="space-y-2 pt-1">
                {STARTERS.map((s) => (
                  <li key={s}>
                    <button
                      type="button"
                      onClick={() => send(s)}
                      className="w-full border border-ink/25 px-3.5 py-2 text-left text-[0.98rem] leading-snug text-ink transition-colors hover:border-cinnabar hover:text-cinnabar"
                    >
                      {s}
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}

            {error ? (
              <p className="border-l-2 border-cinnabar pl-3 text-[0.95rem] leading-snug text-cinnabar">
                {error}
              </p>
            ) : null}
          </div>

          {/* Composer */}
          <form onSubmit={handleSubmit} className="shrink-0 border-t border-ink/20 p-3">
            <div className="flex items-end gap-2 border border-ink/30 bg-leaf px-3 py-2 focus-within:border-cinnabar">
              <textarea
                ref={inputRef}
                rows={1}
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  autoResize(e.target);
                }}
                onKeyDown={handleKeyDown}
                placeholder="Ask about the Foundation's work…"
                aria-label="Message"
                className="max-h-[7.5rem] flex-1 resize-none bg-transparent text-[1rem] leading-relaxed text-ink placeholder:text-ink-faint focus:outline-none"
              />
              <button
                type="submit"
                disabled={!input.trim() || isStreaming}
                aria-label="Send message"
                className="mb-0.5 shrink-0 bg-cinnabar p-2 text-leaf transition-colors hover:bg-cinnabar-deep disabled:cursor-not-allowed disabled:opacity-35"
              >
                <SendIcon className="size-4" />
              </button>
            </div>
            <p className="mt-2 text-center font-mono text-[0.7rem] text-ink-faint">
              Drawn from the Foundation&apos;s published work; may be incomplete.
            </p>
          </form>
        </div>
      ) : null}

      {/* Launcher — a labelled tab, not an anonymous bubble */}
      <button
        ref={fabRef}
        type="button"
        onClick={() => {
          const next = !open;
          setOpen(next);
          if (next) dismissTeaser();
        }}
        aria-label={open ? "Close the AI assistant" : "Ask the Foundation's AI assistant"}
        aria-expanded={open}
        className="on-dark fixed bottom-5 right-5 z-50 flex h-12 items-center gap-2.5 bg-board pl-3 pr-4 text-board-ink shadow-[0_10px_24px_rgb(23_17_12/0.3)] transition-colors hover:bg-board-deep sm:bottom-6 sm:right-6"
      >
        {open ? (
          <CloseIcon className="size-5" />
        ) : (
          <Image src="/icon.png" alt="" width={24} height={24} className="size-6" />
        )}
        {open ? (
          <span className="font-display text-[1.05rem] font-medium">Close</span>
        ) : (
          <span className="flex items-center gap-2 font-display text-[1.05rem] font-medium">
            Ask <AiStamp className="text-orpiment" />
          </span>
        )}
      </button>
    </>
  );
}

function MessageBubble({
  message,
  isLast,
  isStreaming,
}: {
  message: Msg;
  isLast: boolean;
  isStreaming: boolean;
}) {
  const isUser = message.role === "user";
  const pending = isLast && isStreaming && message.content === "";

  // A transcript, not a messenger: the visitor's question sits on a deeper
  // leaf to the right; the answer is plain text on a red rule.
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={[
          "max-w-[88%] whitespace-pre-wrap break-words text-[1rem] leading-relaxed",
          isUser
            ? "bg-leaf-deep px-3.5 py-2.5 text-ink"
            : "border-l border-cinnabar/60 pl-3.5 text-ink",
        ].join(" ")}
      >
        {pending ? <TypingDots /> : message.content}
      </div>
    </div>
  );
}

function TypingDots() {
  return (
    <span className="flex items-center gap-1 py-1.5" aria-label="Assistant is typing">
      <span className="size-1.5 animate-pulse rounded-full bg-cinnabar [animation-delay:0ms]" />
      <span className="size-1.5 animate-pulse rounded-full bg-cinnabar [animation-delay:200ms]" />
      <span className="size-1.5 animate-pulse rounded-full bg-cinnabar [animation-delay:400ms]" />
    </span>
  );
}

function CloseIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M6 6l12 12M18 6L6 18"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SendIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M4 12l16-7-6.5 16-2.5-7-7-2Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ResetIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M4 4v5h5M20 20v-5h-5M5.1 15A8 8 0 0 0 19 9.5M18.9 9A8 8 0 0 0 5 14.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
