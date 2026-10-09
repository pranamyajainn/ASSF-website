import { useSyncExternalStore } from "react";
import type { Lang } from "@/i18n/config";

/**
 * Reading aloud. English is read in a natural, cheerful voice made on the
 * server (/api/speak — Orpheus on Groq), sentence by sentence, the next one
 * fetched while the current one plays. Hindi and Kannada — and English when
 * that voice isn't available — use the best voice the reader's device has:
 * natural and online voices first, never the old robotic ones, at a bright,
 * lively pitch.
 */
const TAGS: Record<Lang, string[]> = {
  en: ["en-in", "en-gb", "en-us", "en"],
  hi: ["hi-in", "hi"],
  kn: ["kn-in", "kn"],
};

/** Voices that sound like a person: the "natural", "neural", online and enhanced ones. */
const NATURAL = /natural|neural|online|google|premium|enhanced|siri|wavenet/i;
/** Smooth voices most computers and phones carry (macOS, iOS, Windows), better than their neighbours. */
const SMOOTH = /samantha|daniel|karen|moira|tessa|veena|serena|allison|ava|susan|zira|aria|jenny|heera|neerja|swara|kalpana|lekha|soumya/i;
/** Novelty and old formant voices — robotic, syllable by syllable (Rishi among them). */
const ROBOTIC = /compact|espeak|albert|bad news|bahh|bells|boing|bubbles|cellos|deranged|fred|good news|hysterical|jester|junior|organ|superstar|trinoids|whisper|wobble|zarvox|ralph|kathy|rishi|grandma|grandpa|eddy|flo\b|reed|rocko|sandy|shelley/i;

function voiceFor(lang: Lang): SpeechSynthesisVoice | null {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return null;
  const tags = TAGS[lang];
  let best: SpeechSynthesisVoice | null = null;
  let bestScore = -Infinity;
  for (const v of window.speechSynthesis.getVoices()) {
    const tag = v.lang.replace("_", "-").toLowerCase();
    const rank = tags.findIndex((t) => tag.startsWith(t));
    if (rank < 0) continue;
    // How it sounds first, the accent second.
    const score = (NATURAL.test(v.name) ? 10 : 0) + (SMOOTH.test(v.name) ? 6 : 0) + (ROBOTIC.test(v.name) ? -20 : 0) + (v.localService ? 0 : 2) + (tags.length - rank);
    if (score > bestScore) {
      best = v;
      bestScore = score;
    }
  }
  return best;
}

function subscribeVoices(onChange: () => void) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return () => {};
  window.speechSynthesis.addEventListener("voiceschanged", onChange);
  return () => window.speechSynthesis.removeEventListener("voiceschanged", onChange);
}

/** Whether `lang` can be read aloud here (false on the server, and until the device's voices load). */
export function useCanSpeak(lang: Lang): boolean {
  return useSyncExternalStore(
    subscribeVoices,
    () => lang === "en" || !!voiceFor(lang),
    () => false,
  );
}

/** Text as it should be heard: no ornaments, links or list markers. */
function forSpeech(text: string): string {
  return text
    .replace(/[॥*_#•·‸\[\]]+/g, " ")
    .replace(/https?:\/\/\S+/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/** Sentences short enough to speak whole — nothing longer than ~220 letters. */
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

/** Set once the natural English voice has failed, so the rest of the visit uses the device's. */
let naturalUnavailable = false;

/**
 * Speaks `parts` in order. `onPart(i)` is called as each part begins, so
 * the page can show where it is. Stopping (or speaking something else)
 * ends it; `done` settles either way.
 */
export function speak(parts: readonly string[], lang: Lang, onPart?: (index: number) => void): Reading {
  const synth = typeof window !== "undefined" && "speechSynthesis" in window ? window.speechSynthesis : null;
  let stopped = false;
  let finish: () => void = () => {};
  const done = new Promise<void>((resolve) => (finish = resolve));
  synth?.cancel();
  current?.stop();

  const queue = parts.flatMap((text, index) => sentences(text).map((s) => ({ s, index })));
  let shown = -1;
  const mark = (index: number) => {
    if (index !== shown) {
      shown = index;
      onPart?.(index);
    }
  };

  // The device's own voice, from sentence `from` on.
  const device = (from: number) => {
    const voice = voiceFor(lang);
    if (!synth || !voice) {
      finish();
      return;
    }
    let i = from;
    const next = () => {
      if (stopped || i >= queue.length) {
        finish();
        return;
      }
      const { s, index } = queue[i++];
      mark(index);
      const u = new SpeechSynthesisUtterance(s);
      u.voice = voice;
      u.lang = voice.lang;
      // Bright and lively rather than flat: a touch higher, at an easy pace.
      u.pitch = 1.1;
      u.rate = lang === "en" ? 1.02 : 0.96;
      u.onend = next;
      u.onerror = () => {
        stopped = true;
        finish();
      };
      synth.speak(u);
    };
    next();
  };

  // The natural English voice: one audio element, reused (phones allow that after a tap), the next sentence fetched ahead.
  const urls: string[] = [];
  let audio: HTMLAudioElement | null = null;
  const fetchSentence = (i: number): Promise<string | null> | null =>
    i < queue.length
      ? fetch(`/api/speak?text=${encodeURIComponent(queue[i].s)}`)
          .then(async (res) => {
            if (!res.ok) return null;
            const url = URL.createObjectURL(await res.blob());
            urls.push(url);
            return url;
          })
          .catch(() => null)
      : null;
  const natural = () => {
    audio = new Audio();
    let ahead = fetchSentence(0);
    const play = async (i: number) => {
      if (stopped || i >= queue.length) {
        finish();
        return;
      }
      const url = await ahead;
      if (stopped) return;
      if (!url || !audio) {
        naturalUnavailable = true;
        device(i);
        return;
      }
      ahead = fetchSentence(i + 1);
      mark(queue[i].index);
      audio.src = url;
      audio.onended = () => play(i + 1);
      audio.onerror = () => device(i + 1);
      audio.play().catch(() => {
        naturalUnavailable = true;
        device(i);
      });
    };
    play(0);
  };

  const stop = () => {
    stopped = true;
    synth?.cancel();
    audio?.pause();
    urls.forEach((u) => URL.revokeObjectURL(u));
    finish();
  };
  const reading = { stop, done };
  current = reading;
  done.then(() => {
    if (current === reading) current = null;
    setTimeout(() => urls.forEach((u) => URL.revokeObjectURL(u)), 1000);
  });

  if (lang === "en" && !naturalUnavailable) natural();
  else device(0);
  return reading;
}

/** One reading at a time, across the page and the assistant. */
let current: Reading | null = null;
