"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import type { UI } from "@/i18n/ui";

type Role = "user" | "assistant";
type Msg = { role: Role; content: string };

const TEASER_KEY = "assf-chat-teaser-seen";

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

/** One saved conversation per edition: switching language starts afresh. */
function storageKey(lang: string) {
  return `assf-chat-v1-${lang}`;
}

function loadMessages(lang: string, greeting: Msg): Msg[] {
  if (typeof window === "undefined") return [greeting];
  try {
    const raw = sessionStorage.getItem(storageKey(lang));
    if (!raw) return [greeting];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) return parsed as Msg[];
  } catch {
    // fall through to default
  }
  return [greeting];
}

/**
 * The Foundation's AI assistant. It speaks the edition's language: its
 * chrome and greeting come from the edition's strings, and the language is
 * sent with every question so the answer comes back in the same script.
 */
export function ChatWidget({
  lang,
  strings,
  email,
}: {
  lang: string;
  strings: UI["chat"];
  email: string;
}) {
  const GREETING: Msg = { role: "assistant", content: strings.greeting };
  const STARTERS = strings.starters;
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([GREETING]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  /** The answer currently being written onto the leaf, by index. */
  const [inkingIndex, setInkingIndex] = useState<number | null>(null);
  /** The finished answer, announced once to screen readers. */
  const [announcement, setAnnouncement] = useState("");
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
    setMessages(loadMessages(lang, { role: "assistant", content: strings.greeting }));
    setHydrated(true);
  }, [lang, strings.greeting]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      sessionStorage.setItem(storageKey(lang), JSON.stringify(messages));
    } catch {
      // sessionStorage unavailable — conversation just won't persist
    }
  }, [messages, hydrated, lang]);

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

  // While an answer is being written, keep the writing point in view —
  // unless the reader has scrolled up to reread something.
  const followWriting = useCallback(() => {
    const el = scrollRef.current;
    if (el && el.scrollHeight - el.scrollTop - el.clientHeight < 140) {
      el.scrollTop = el.scrollHeight;
    }
  }, []);

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
    setInkingIndex(payload.length);
    setAnnouncement("");
    setInput("");
    setIsStreaming(true);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: payload, lang }),
        signal: controller.signal,
      });

      if (!res.ok || !res.body) {
        const detail = await res.text().catch(() => "");
        throw new Error(detail || strings.unavailable);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let full = "";
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        full += chunk;
        appendToLastAssistant(chunk);
      }
      setAnnouncement(full);
    } catch (err) {
      if ((err as Error).name !== "AbortError") {
        const message = (err as Error).message;
        setError(message || `${strings.failed} ${email}.`);
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
            aria-label={strings.dismiss}
            className="absolute right-1.5 top-1.5 p-1.5 text-board-soft transition-colors hover:text-board-ink"
          >
            <CloseIcon className="size-3.5" />
          </button>
          <p className="text-[0.98rem] leading-snug">
            {strings.teaser}{" "}
            <span className="whitespace-nowrap">
              {strings.teaserAssistant} <AiStamp className="ml-0.5 text-orpiment" />
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
            {strings.teaserStart}
          </button>
        </div>
      ) : null}

      {/* Panel */}
      {open ? (
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label={strings.title}
          className="fixed inset-0 z-50 flex flex-col bg-leaf sm:inset-auto sm:bottom-[5.25rem] sm:right-6 sm:h-[38rem] sm:max-h-[80vh] sm:w-[24rem] sm:animate-[panel-in_0.22s_cubic-bezier(0.16,1,0.3,1)] sm:border sm:border-ink/25 sm:shadow-[0_24px_60px_rgb(23_17_12/0.3)]"
          style={{ backgroundImage: "var(--fibre)" }}
        >
          {/* Header — the board */}
          <div className="on-dark flex shrink-0 items-center gap-3 bg-board px-4 py-3 text-board-ink">
            <Image src="/icon.png" alt="" width={32} height={32} className="size-8" />
            <div className="min-w-0 flex-1">
              <p className="flex items-center gap-2 font-display text-[1.1rem] font-medium leading-tight">
                {strings.title}
                <AiStamp className="text-orpiment" />
              </p>
              <p className="truncate font-mono text-[0.72rem] text-board-soft">
                {strings.subtitle}
              </p>
            </div>
            {hasConversation ? (
              <button
                type="button"
                onClick={resetConversation}
                title={strings.reset}
                aria-label={strings.reset}
                className="shrink-0 p-2 text-board-soft transition-colors hover:text-board-ink"
              >
                <ResetIcon className="size-4" />
              </button>
            ) : null}
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label={strings.closeChat}
              className="shrink-0 p-2 text-board-soft transition-colors hover:text-board-ink"
            >
              <CloseIcon className="size-4.5" />
            </button>
          </div>

          {/* Transcript */}
          {/* Screen readers hear each answer once, whole — not word by word
              as it is written onto the leaf. */}
          <p className="sr-only" aria-live="polite">
            {announcement}
          </p>
          <div
            ref={scrollRef}
            className="flex-1 space-y-5 overflow-y-auto px-5 py-5"
            aria-busy={isStreaming}
          >
            {messages.map((m, i) => (
              <MessageBubble
                key={i}
                message={m}
                answer={i > 0}
                pending={i === messages.length - 1 && isStreaming && m.content === ""}
                inking={i === inkingIndex}
                streaming={i === messages.length - 1 && isStreaming}
                readingLabel={strings.reading}
                onGrow={followWriting}
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
                placeholder={strings.placeholder}
                aria-label={strings.message}
                className="max-h-[7.5rem] flex-1 resize-none bg-transparent text-[1rem] leading-relaxed text-ink placeholder:text-ink-faint focus:outline-none"
              />
              <button
                type="submit"
                disabled={!input.trim() || isStreaming}
                aria-label={strings.send}
                className="mb-0.5 shrink-0 bg-cinnabar p-2 text-leaf transition-colors hover:bg-cinnabar-deep disabled:cursor-not-allowed disabled:opacity-35"
              >
                <SendIcon className="size-4" />
              </button>
            </div>
            <p className="mt-2 text-center font-mono text-[0.7rem] text-ink-faint">
              {strings.disclaimer}
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
        aria-label={open ? strings.closeChat : strings.openChat}
        aria-expanded={open}
        // On phones the open panel fills the screen and has its own close
        // button; the launcher would sit on top of the send button.
        className={`on-dark fixed bottom-5 right-5 z-50 h-12 items-center gap-2.5 bg-board pl-3 pr-4 text-board-ink shadow-[0_10px_24px_rgb(23_17_12/0.3)] transition-colors hover:bg-board-deep sm:bottom-6 sm:right-6 ${
          open ? "hidden sm:flex" : "flex"
        }`}
      >
        {open ? (
          <CloseIcon className="size-5" />
        ) : (
          <Image src="/icon.png" alt="" width={24} height={24} className="size-6" />
        )}
        {open ? (
          <span className="font-display text-[1.05rem] font-medium">{strings.close}</span>
        ) : (
          <span className="flex items-center gap-2 font-display text-[1.05rem] font-medium">
            {strings.ask} <AiStamp className="text-orpiment" />
          </span>
        )}
      </button>
    </>
  );
}

function MessageBubble({
  message,
  answer,
  pending,
  inking,
  streaming,
  readingLabel,
  onGrow,
}: {
  message: Msg;
  /** An assistant reply to a question (not the opening greeting). */
  answer: boolean;
  pending: boolean;
  inking: boolean;
  streaming: boolean;
  readingLabel: string;
  onGrow: () => void;
}) {
  const isUser = message.role === "user";

  // A transcript, not a messenger: the visitor's question sits on a deeper
  // leaf to the right; the answer is written on a red rule, and closes with
  // a double danda, as a verse does.
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
        {isUser ? (
          message.content
        ) : pending ? (
          <ReadingLine label={readingLabel} />
        ) : inking ? (
          <InkReveal text={message.content} streaming={streaming} onGrow={onGrow} />
        ) : (
          <>
            {message.content}
            {answer ? <Danda /> : null}
          </>
        )}
      </div>
    </div>
  );
}

/** Before the first word arrives: a stylus ruling a line across the leaf. */
function ReadingLine({ label }: { label: string }) {
  return (
    <span className="block py-1" role="status">
      <span className="block font-mono text-register text-ink-faint">{label}</span>
      <span aria-hidden="true" className="relative mt-2.5 block h-px w-44 overflow-hidden bg-ink/15">
        <span className="rule-sweep absolute inset-y-0 left-0 w-1/3 bg-cinnabar" />
      </span>
    </span>
  );
}

function Danda() {
  return (
    <span aria-hidden="true" className="text-cinnabar">
      {" "}॥
    </span>
  );
}

function subscribeMotion(onChange: () => void) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

/**
 * Writes an answer onto the leaf word by word, at a scribe's pace rather
 * than the network's. The stream is decoupled from the display: text
 * arrives as fast as it arrives; the reveal advances ~60 characters a
 * second, quickening when a backlog builds so it never falls far behind.
 * Each new word inks in (red, soft → lampblack); a nib blinks at the
 * writing point; a danda closes the answer. Readers who asked for reduced
 * motion get the text as it arrives.
 */
function InkReveal({
  text,
  streaming,
  onGrow,
}: {
  text: string;
  streaming: boolean;
  onGrow: () => void;
}) {
  const reduced = useSyncExternalStore(
    subscribeMotion,
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false,
  );
  const [shown, setShown] = useState(0);
  const textRef = useRef(text);
  const streamingRef = useRef(streaming);
  const shownRef = useRef(0);

  useEffect(() => {
    textRef.current = text;
    streamingRef.current = streaming;
  }, [text, streaming]);

  useEffect(() => {
    if (reduced) return;
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      const total = textRef.current.length;
      if (shownRef.current < total) {
        const backlog = total - shownRef.current;
        const rate = 60 + backlog * 0.9; // characters per second
        shownRef.current = Math.min(total, shownRef.current + Math.max(1, Math.round(rate * dt)));
        setShown(shownRef.current);
      } else if (!streamingRef.current) {
        return; // Written in full: stop the loop.
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduced, text]);

  useEffect(() => {
    onGrow();
  }, [shown, onGrow]);

  const done = reduced || (!streaming && shown >= text.length);
  const tokens = (done ? text : text.slice(0, shown)).split(/(\s+)/);
  // Hold back a half-written word until its last letter has arrived.
  if (!done && tokens.length && !/^\s*$/.test(tokens[tokens.length - 1])) tokens.pop();

  return (
    <>
      {tokens.map((token, i) =>
        /^\s*$/.test(token) ? (
          token
        ) : (
          <span key={i} className={reduced ? undefined : "ink-word"}>
            {token}
          </span>
        ),
      )}
      {done ? <Danda /> : <span aria-hidden="true" className="chat-nib" />}
    </>
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
