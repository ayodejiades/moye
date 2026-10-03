"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { MoyinPeeking } from "@/components/moyin-mascot";
import { useAccessibility } from "@/lib/accessibility-context";
import { SpeakerIcon } from "@/components/ui/svg-icons";
import { retainUtterance } from "@/lib/multilingual-voice";

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
  const { soundEnabled, setSoundEnabled, speechSpeed } = useAccessibility();
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
        retainUtterance(utterance);
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
      <button
        type="button"
        onClick={greet}
        aria-label="Hear Moyin say hello"
        className="relative z-20 -mb-6 sm:-mb-8 active:translate-y-1 transition-transform duration-200 cursor-pointer focus:outline-none focus-visible:ring-4 focus-visible:ring-[var(--honey-500)] rounded-2xl"
      >
        <MoyinPeeking
          pose={pose}
          className="w-[min(240px,70vw)] sm:w-[300px] drop-shadow-xl"
        />
      </button>

      <div className="w-72 sm:w-96 rounded-3xl bg-white border-2 border-[var(--border)] shadow-[0_14px_32px_rgba(42,27,77,0.16)] px-4 pb-4 pt-8 sm:px-6 sm:pb-6 sm:pt-10 text-center relative z-10">
        <div className="text-lg font-bold text-balance text-[var(--plum-900)]">calm learning, one step at a time</div>
        <p className="text-sm text-[var(--fg-muted)] mt-1 font-medium text-pretty">No rush. No timers. No shame.</p>
        {/* Greeting shows here, inside the card, so it can never cover the buttons above. */}
        <p
          key={bubble ?? "hint"}
          role="status"
          aria-live="polite"
          className={`text-sm mt-2 text-pretty min-h-12 ${bubble ? "duo-speech-bubble font-semibold text-[var(--plum-900)]" : "text-[var(--fg-muted)]"}`}
        >
          {bubble ?? "Tap Moyin to hear a hello."}
        </p>
        {/* Sound is off until it is asked for (features.md C5). The label always states
            which way the switch is, so it is never a mystery tap. */}
        <button
          type="button"
          data-demo="sound-toggle"
          onClick={() => setSoundEnabled(!soundEnabled)}
          aria-pressed={soundEnabled}
          className="mt-3 btn-3d btn-3d-card btn-3d-header gap-2 self-center"
        >
          <SpeakerIcon size={16} />
          <span>{soundEnabled ? "Sound on" : "Sound off"}</span>
        </button>
      </div>
    </div>
  );
}
