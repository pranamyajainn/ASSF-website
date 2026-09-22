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
    "I can help with questions about the Foundation's manuscript conservation, rural infrastructure and community services, or about Acharya Shri Shantisagar Ji himself. What would you like to know?",
};

const STARTERS = [
  "What does ASSF do?",
  "How can I adopt a folio?",
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
      {/* Proactive teaser */}
      {showTeaser && !open ? (
        <div
          className="fixed bottom-24 right-5 z-40 max-w-[15.5rem] animate-[teaser-in_0.35s_ease-out] rounded-xl border border-parchment/15 bg-ink-deep p-4 pr-8 shadow-2xl sm:right-6"
          role="status"
        >
          <button
            type="button"
            onClick={dismissTeaser}
            aria-label="Dismiss"
            className="absolute right-2 top-2 rounded-full p-1 text-parchment/50 transition-colors hover:text-parchment"
          >
            <CloseIcon className="size-3.5" />
          </button>
          <p className="font-sans text-[0.9rem] leading-snug text-parchment/90">
            Have a question about our work? Ask the ASSF assistant.
          </p>
          <button
            type="button"
            onClick={() => {
              setOpen(true);
              dismissTeaser();
            }}
            className="mt-3 font-sans text-sm text-accent underline decoration-accent/40 underline-offset-4 hover:decoration-accent"
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
          className="fixed inset-0 z-50 flex flex-col bg-ink-deep sm:inset-auto sm:bottom-24 sm:right-5 sm:h-[38rem] sm:max-h-[80vh] sm:w-[23.5rem] sm:rounded-2xl sm:border sm:border-parchment/15 sm:shadow-[0_20px_60px_rgba(0,0,0,0.5)] sm:animate-[panel-in_0.22s_cubic-bezier(0.16,1,0.3,1)] sm:right-6"
        >
          {/* Header */}
          <div className="flex shrink-0 items-center gap-3 border-b border-parchment/10 bg-ink px-4 py-3.5 sm:rounded-t-2xl">
            <span className="relative shrink-0 overflow-hidden rounded-full ring-1 ring-parchment/20">
              <Image src="/icon.png" alt="" width={36} height={36} className="size-9" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate font-sans text-[0.95rem] text-parchment-bright">
                ASSF Assistant
              </p>
              <p className="flex items-center gap-1.5 font-sans text-xs text-parchment/55">
                <span className="size-1.5 rounded-full bg-sage" aria-hidden="true" />
                Usually replies instantly
              </p>
            </div>
            {hasConversation ? (
              <button
                type="button"
                onClick={resetConversation}
                title="Start a new conversation"
                aria-label="Start a new conversation"
                className="shrink-0 rounded-full p-2 text-parchment/55 transition-colors hover:bg-parchment/10 hover:text-parchment"
              >
                <ResetIcon className="size-4" />
              </button>
            ) : null}
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              className="shrink-0 rounded-full p-2 text-parchment/55 transition-colors hover:bg-parchment/10 hover:text-parchment"
            >
              <CloseIcon className="size-4.5" />
            </button>
          </div>

          {/* Messages */}
          <div
            ref={scrollRef}
            className="flex-1 space-y-4 overflow-y-auto px-4 py-5"
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
              <div className="flex flex-wrap gap-2 pt-1">
                {STARTERS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => send(s)}
                    className="rounded-full border border-parchment/20 px-3.5 py-2 text-left font-sans text-[0.83rem] leading-snug text-parchment/80 transition-colors hover:border-accent/50 hover:text-parchment-bright"
                  >
                    {s}
                  </button>
                ))}
              </div>
            ) : null}

            {error ? (
              <p className="font-sans text-[0.85rem] leading-snug text-accent">{error}</p>
            ) : null}
          </div>

          {/* Composer */}
          <form
            onSubmit={handleSubmit}
            className="shrink-0 border-t border-parchment/10 bg-ink p-3 sm:rounded-b-2xl"
          >
            <div className="flex items-end gap-2 rounded-xl border border-parchment/20 bg-ink-deep px-3 py-2 focus-within:border-accent/50">
              <textarea
                ref={inputRef}
                rows={1}
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  autoResize(e.target);
                }}
                onKeyDown={handleKeyDown}
                placeholder="Ask about ASSF's work…"
                aria-label="Message"
                className="max-h-[7.5rem] flex-1 resize-none bg-transparent font-sans text-[0.95rem] leading-relaxed text-parchment-bright placeholder:text-parchment/40 focus:outline-none"
              />
              <button
                type="submit"
                disabled={!input.trim() || isStreaming}
                aria-label="Send message"
                className="mb-0.5 shrink-0 rounded-lg bg-rust p-2 text-parchment-bright transition-colors hover:bg-rust/85 disabled:cursor-not-allowed disabled:opacity-35"
              >
                <SendIcon className="size-4" />
              </button>
            </div>
            <p className="mt-2 text-center font-sans text-[0.7rem] text-parchment/35">
              Answers are drawn from ASSF&apos;s published work and may be incomplete.
            </p>
          </form>
        </div>
      ) : null}

      {/* Launcher */}
      <button
        ref={fabRef}
        type="button"
        onClick={() => {
          const next = !open;
          setOpen(next);
          if (next) dismissTeaser();
        }}
        aria-label={open ? "Close chat" : "Open ASSF assistant chat"}
        aria-expanded={open}
        className="fixed bottom-5 right-5 z-50 flex size-14 items-center justify-center rounded-full bg-rust text-parchment-bright shadow-[0_8px_24px_rgba(0,0,0,0.35)] transition-transform duration-200 hover:scale-105 hover:bg-rust/90 active:scale-95 sm:bottom-6 sm:right-6"
      >
        {open ? <CloseIcon className="size-6" /> : <ChatIcon className="size-6" />}
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

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={[
          "max-w-[85%] whitespace-pre-wrap break-words px-3.5 py-2.5 font-sans text-[0.92rem] leading-relaxed",
          isUser
            ? "rounded-2xl rounded-br-sm bg-rust text-parchment-bright"
            : "rounded-2xl rounded-bl-sm bg-parchment-bright text-ink",
        ].join(" ")}
      >
        {pending ? <TypingDots /> : message.content}
      </div>
    </div>
  );
}

function TypingDots() {
  return (
    <span className="flex items-center gap-1 py-1" aria-label="Assistant is typing">
      <span className="size-1.5 animate-bounce rounded-full bg-ink/50 [animation-delay:0ms]" />
      <span className="size-1.5 animate-bounce rounded-full bg-ink/50 [animation-delay:150ms]" />
      <span className="size-1.5 animate-bounce rounded-full bg-ink/50 [animation-delay:300ms]" />
    </span>
  );
}

function ChatIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v8a2.5 2.5 0 0 1-2.5 2.5H10l-4.5 4v-4H6.5A2.5 2.5 0 0 1 4 13.5v-8Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
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
