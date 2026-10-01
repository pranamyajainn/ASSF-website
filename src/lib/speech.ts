import { useSyncExternalStore } from "react";
import type { Lang } from "@/i18n/config";

/**
 * Reading aloud, with the voices the reader's own device has — so it costs
 * nothing and works offline. Phones carry Hindi and Kannada voices; a
 * computer may not, and then nothing offers to read in that language.
 */
const TAGS: Record<Lang, string[]> = {
  en: ["en-in", "en-gb", "en-us", "en"],
  hi: ["hi-in", "hi"],
  kn: ["kn-in", "kn"],
};

function voiceFor(lang: Lang): SpeechSynthesisVoice | null {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return null;
  const voices = window.speechSynthesis.getVoices();
  for (const tag of TAGS[lang]) {
    const matching = voices.filter((v) => v.lang.replace("_", "-").toLowerCase().startsWith(tag));
    // A voice on the device itself first: it starts at once and works offline.
    const voice = matching.find((v) => v.localService) ?? matching[0];
    if (voice) return voice;
  }
  return null;
}

function subscribeVoices(onChange: () => void) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return () => {};
  window.speechSynthesis.addEventListener("voiceschanged", onChange);
  return () => window.speechSynthesis.removeEventListener("voiceschanged", onChange);
}

/** Whether this device can read aloud in `lang` (false on the server, and until its voices load). */
export function useCanSpeak(lang: Lang): boolean {
  return useSyncExternalStore(
    subscribeVoices,
    () => !!voiceFor(lang),
    () => false,
  );
}

/** Text as it should be heard: no ornaments, links or list markers. */
function forSpeech(text: string): string {
  return text
    .replace(/[॥*_#•·‸]+/g, " ")
    .replace(/https?:\/\/\S+/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Sentences short enough to speak whole: some browsers stop a long
 * utterance part-way, so nothing is handed over longer than ~220 letters.
 */
export function sentences(text: string): string[] {
  const out: string[] = [];
  for (const part of forSpeech(text).split(/(?<=[.!?।])\s+/)) {
    let rest = part;
    while (rest.length > 220) {
      const cut = Math.max(rest.lastIndexOf(", ", 220), rest.lastIndexOf(" ", 220));
      out.push(rest.slice(0, cut > 60 ? cut + 1 : 220).trim());
      rest = rest.slice(cut > 60 ? cut + 1 : 220);
    }
    if (rest.trim()) out.push(rest.trim());
  }
  return out;
}

export type Reading = { stop: () => void; done: Promise<void> };

/**
 * Speaks `parts` in order. `onPart(i)` is called as each part begins, so
 * the page can show where it is. Stopping (or speaking something else)
 * ends it; `done` settles either way.
 */
export function speak(parts: readonly string[], lang: Lang, onPart?: (index: number) => void): Reading {
  const synth = typeof window !== "undefined" && "speechSynthesis" in window ? window.speechSynthesis : null;
  const voice = voiceFor(lang);
  let stopped = false;
  let finish: () => void = () => {};
  const done = new Promise<void>((resolve) => (finish = resolve));
  if (!synth || !voice) {
    finish();
    return { stop: () => {}, done };
  }
  synth.cancel();
  const queue = parts.flatMap((text, index) => sentences(text).map((s) => ({ s, index })));
  let i = 0;
  let current = -1;
  const next = () => {
    if (stopped || i >= queue.length) {
      finish();
      return;
    }
    const { s, index } = queue[i++];
    if (index !== current) {
      current = index;
      onPart?.(index);
    }
    const u = new SpeechSynthesisUtterance(s);
    u.voice = voice;
    u.lang = voice.lang;
    u.rate = lang === "en" ? 0.98 : 0.92;
    u.onend = next;
    u.onerror = () => {
      stopped = true;
      finish();
    };
    synth.speak(u);
  };
  next();
  return {
    stop: () => {
      stopped = true;
      synth.cancel();
      finish();
    },
    done,
  };
}
