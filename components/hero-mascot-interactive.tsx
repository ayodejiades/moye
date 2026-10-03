"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { MoyinPeeking } from "@/components/moyin-mascot";
import { useAccessibility } from "@/lib/accessibility-context";

const GREETINGS = [
  {
    speech: "Hi there! I'm Moyin the honey badger. Let's do five calm minutes together today.",
    bubble: "Hi! I'm Moyin. Let's do five calm minutes.",
  },
  {
    speech: "Welcome to Moye. Take all the time you need. There are no timers here.",
    bubble: "Take your time. There are no timers here.",
  },
  {
    speech: "Learning at your own pace is wonderful. Ready to earn some honey?",
    bubble: "Ready to earn some honey?",
  },
];

export function HeroMascotInteractive() {
  const { soundEnabled, speechSpeed } = useAccessibility();
  const [index, setIndex] = useState(0);
  const [pose, setPose] = useState<"smile" | "cheer">("smile");
  const [bubble, setBubble] = useState<string | null>(null);
  const [inView, setInView] = useState(true);
  const rootRef = useRef<HTMLDivElement>(null);
  const timers = useRef<number[]>([]);

  const later = useCallback((fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms));
  }, []);

  // Pause the blink and breathing loops while the hero is off screen.
  useEffect(() => {
    const el = rootRef.current;
    if (!el || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Stop timers and speech when the visitor leaves the page.
  useEffect(() => {
    const pending = timers.current;
    return () => {
      pending.forEach((t) => window.clearTimeout(t));
      if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    };
  }, []);

  const greet = () => {
    const item = GREETINGS[index % GREETINGS.length];
    setIndex((i) => i + 1);
    setBubble(item.bubble);
    setPose("cheer");
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];

    const finish = () => {
      setPose("smile");
      later(() => setBubble(null), 3000);
    };

    if (soundEnabled && "speechSynthesis" in window) {
      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(item.speech);
        utterance.rate = speechSpeed;
        utterance.onend = finish;
        utterance.onerror = finish;
        window.speechSynthesis.speak(utterance);
        return;
      } catch {
        // fall through to the silent path
      }
    }
    later(finish, 2400);
  };

  return (
    <div ref={rootRef} data-inview={inView ? "true" : "false"} className="relative z-10 flex flex-col items-center select-none">
      {/* Live region: always mounted so screen readers announce each greeting. */}
      <div role="status" aria-live="polite" className="absolute -top-16 sm:-top-20 md:-top-24 z-30 pointer-events-none">
        {bubble && (
          <div className="duo-speech-bubble relative bg-white border-2 border-[var(--border)] rounded-2xl shadow-xl px-4 py-3 max-w-[260px] sm:max-w-sm text-center">
            <p className="text-sm font-semibold text-[var(--plum-900)] leading-snug">{bubble}</p>
            <div className="absolute left-1/2 -bottom-2 -translate-x-1/2 w-4 h-4 bg-white border-b-2 border-r-2 border-[var(--border)] rotate-45" />
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={greet}
        aria-label="Hear Moyin say hello"
        className="relative z-20 -mb-6 sm:-mb-8 md:-mb-10 active:translate-y-1 transition-transform duration-200 cursor-pointer focus:outline-none focus-visible:ring-4 focus-visible:ring-[var(--honey-500)] rounded-2xl"
      >
        <MoyinPeeking
          pose={pose}
          className="w-[min(360px,88vw)] sm:w-[500px] md:w-[560px] drop-shadow-2xl"
        />
      </button>

      <div className="w-76 sm:w-96 md:w-[460px] rounded-3xl bg-white border-2 border-[var(--border)] shadow-[0_14px_32px_rgba(42,27,77,0.16)] px-4 pb-4 pt-10 sm:px-6 sm:pb-6 sm:pt-12 md:pt-16 text-center relative z-10">
        <div className="text-lg font-bold text-balance text-[var(--plum-900)]">calm learning, one step at a time</div>
        <p className="text-sm text-[var(--fg-muted)] mt-1 font-medium text-pretty">No rush. No timers. No shame.</p>
        <p className="text-sm text-[var(--fg-muted)] mt-2 text-pretty">Tap Moyin to hear a hello.</p>
      </div>
    </div>
  );
}
