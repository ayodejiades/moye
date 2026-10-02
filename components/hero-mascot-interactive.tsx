"use client";

import React, { useState, useEffect } from "react";
import { MoyinPeeking } from "@/components/moyin-mascot";

const GREETING_PHRASES = [
  {
    speech: "Hi there! I'm Moyin the honey badger. Let's do 5 calm minutes together today!",
    bubble: "Hi! I'm Moyin. Let's do 5 calm minutes today!",
  },
  {
    speech: "Welcome to Moye! Take all the time you need, there are zero countdown timers here.",
    bubble: "Take your time! No countdown timers here.",
  },
  {
    speech: "Learning at your own pace is wonderful. Ready to earn some sweet honey drops?",
    bubble: "Ready to earn some sweet honey drops?",
  },
];

export function HeroMascotInteractive() {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [bubbleVisible, setBubbleVisible] = useState(false);
  const [bubbleText, setBubbleText] = useState(GREETING_PHRASES[0].bubble);
  const [pose, setPose] = useState<"smile" | "cheer" | "think">("smile");

  const speakGreeting = (index?: number) => {
    const nextIdx = index !== undefined ? index : phraseIndex;
    const item = GREETING_PHRASES[nextIdx % GREETING_PHRASES.length];
    setBubbleText(item.bubble);
    setBubbleVisible(true);
    setPose("cheer");

    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(item.speech);
        utterance.rate = 0.92;
        utterance.pitch = 1.08;

        // Try to pick a natural English voice if available
        const voices = window.speechSynthesis.getVoices();
        const preferredVoice = voices.find(
          (v) =>
            v.lang.startsWith("en") &&
            (v.name.includes("Samantha") ||
              v.name.includes("Victoria") ||
              v.name.includes("Google") ||
              v.name.includes("Natural"))
        );
        if (preferredVoice) {
          utterance.voice = preferredVoice;
        }

        utterance.onstart = () => {
          setIsSpeaking(true);
        };

        utterance.onend = () => {
          setIsSpeaking(false);
          setPose("smile");
        };

        utterance.onerror = () => {
          setIsSpeaking(false);
          setPose("smile");
        };

        window.speechSynthesis.speak(utterance);
      } catch {
        setIsSpeaking(false);
        setPose("smile");
      }
    } else {
      // Fallback if speechSynthesis is unavailable
      setIsSpeaking(true);
      setTimeout(() => {
        setIsSpeaking(false);
        setPose("smile");
      }, 3000);
    }

    setPhraseIndex((prev) => (prev + 1) % GREETING_PHRASES.length);
  };

  useEffect(() => {
    // Hide speech bubble after 5 seconds if not speaking
    if (bubbleVisible && !isSpeaking) {
      const timer = setTimeout(() => {
        setBubbleVisible(false);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [bubbleVisible, isSpeaking]);

  return (
    <div className="relative z-10 flex flex-col items-center select-none">
      {/* Speech Bubble — floats clearly above Moyin's head */}
      <div
        className={`absolute -top-16 sm:-top-20 md:-top-24 z-30 transition-all duration-300 transform pointer-events-auto ${
          bubbleVisible
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-0 translate-y-3 scale-95 pointer-events-none"
        }`}
      >
        <div className="relative bg-white border-2 border-[var(--plum-800)]/30 rounded-2xl shadow-xl px-4 py-2.5 sm:px-5 sm:py-3 max-w-[260px] sm:max-w-sm text-center">
          <p className="text-xs sm:text-sm font-extrabold text-[var(--plum-900)] leading-snug">
            {bubbleText}
          </p>
          {/* Bubble Pointer Arrow Down */}
          <div className="absolute left-1/2 -bottom-2 -translate-x-1/2 w-3.5 h-3.5 bg-white border-b-2 border-r-2 border-[var(--plum-800)]/30 transform rotate-45" />
        </div>
      </div>

      {/* Moyin's Enlarged Peeking Face & Paws (Clickable to trigger speech) */}
      <button
        type="button"
        onClick={() => speakGreeting()}
        aria-label="Tap to hear Moyin greet you"
        className="relative z-20 -mb-6 sm:-mb-8 md:-mb-10 transform hover:-translate-y-2 active:scale-95 transition-transform duration-300 cursor-pointer focus:outline-none focus-visible:ring-4 focus-visible:ring-[var(--honey-500)] rounded-full group"
      >
        <MoyinPeeking
          pose={isSpeaking ? "cheer" : pose}
          width={360}
          height={260}
          className="sm:w-[500px] sm:h-[360px] md:w-[560px] md:h-[405px] drop-shadow-2xl"
        />

        {/* "Tap to listen" tooltip on hover */}
        {!bubbleVisible && !isSpeaking && (
          <div className="absolute top-6 right-10 sm:right-16 md:right-22 opacity-0 group-hover:opacity-100 transition-opacity bg-[var(--plum-900)] text-white text-[11px] sm:text-xs font-bold px-2.5 py-1 rounded-md shadow-md flex items-center gap-1.5 pointer-events-none">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
            </svg>
            <span>Tap to listen</span>
          </div>
        )}
      </button>

      {/* Card Moyin peeks over — top padding clears the paws + chin so the message is never covered.
          sm:px-5/sm:pb-5 is a one-off outside the spacing token set, kept to preserve the card's original padding. */}
      <div className="w-76 sm:w-96 md:w-[460px] rounded-3xl bg-white border-2 border-[var(--plum-800)]/20 shadow-[0_14px_32px_rgba(42,27,77,0.16)] px-4 pb-4 pt-10 sm:px-5 sm:pb-5 sm:pt-12 md:pt-16 text-center relative z-10">
        <div className="text-base sm:text-lg font-bold text-balance text-[var(--plum-900)]">
          calm learning, one step at a time
        </div>
        <p className="text-xs sm:text-sm text-[var(--fg-muted)] mt-1 font-medium text-pretty">
          No rush · No timers · No shame
        </p>
      </div>
    </div>
  );
}
