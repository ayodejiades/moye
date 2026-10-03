"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type ReadingTint = "cream" | "peach" | "mint" | "sky" | "none";
export type DyslexiaFontChoice = "opendyslexic" | "lexend";
export type VoiceLanguage = "en" | "pcm" | "yo" | "ha" | "ig" | "sw";

interface AccessibilityState {
  dyslexicFont: boolean;
  fontChoice: DyslexiaFontChoice;
  readingRuler: boolean;
  readingTint: ReadingTint;
  wordHighlight: boolean;
  reducedMotion: boolean;
  largeText: boolean;
  soundEnabled: boolean;
  speechSpeed: number;
  narrationLanguage: VoiceLanguage;
}

interface AccessibilityContextType extends AccessibilityState {
  setDyslexicFont: (val: boolean) => void;
  setFontChoice: (choice: DyslexiaFontChoice) => void;
  setReadingRuler: (val: boolean) => void;
  setReadingTint: (tint: ReadingTint) => void;
  setWordHighlight: (val: boolean) => void;
  setReducedMotion: (val: boolean) => void;
  setLargeText: (val: boolean) => void;
  setSoundEnabled: (val: boolean) => void;
  setSpeechSpeed: (val: number) => void;
  setNarrationLanguage: (lang: VoiceLanguage) => void;
  panelOpen: boolean;
  setPanelOpen: (val: boolean) => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

const STORAGE_KEY = "moye_a11y_settings";

function getInitialA11ySettings() {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

export function AccessibilityProvider({ children }: { children: ReactNode }) {
  // Defaults first, so the server and the first client render match. Saved settings are
  // applied right after mount (reading localStorage during render caused a hydration error).
  const [dyslexicFont, setDyslexicFont] = useState(false);
  const [fontChoice, setFontChoice] = useState<DyslexiaFontChoice>("opendyslexic");
  const [readingRuler, setReadingRuler] = useState(false);
  const [readingTint, setReadingTint] = useState<ReadingTint>("none");
  const [wordHighlight, setWordHighlight] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [largeText, setLargeText] = useState(false);
  // Sound is off until someone turns it on (features.md C5). An unprompted noise is the
  // fastest way to lose a child who is sensitive to sound, and nothing in Moye needs to
  // make a sound to work. Read aloud is a separate, explicit control.
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [speechSpeed, setSpeechSpeed] = useState(1.0);
  const [narrationLanguage, setNarrationLanguage] = useState<VoiceLanguage>("en");
  const [hydrated, setHydrated] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);

  // Apply saved settings once, after mount. Syncing from localStorage (an external system) is
  // exactly what an effect is for, and doing it during render breaks hydration.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const s = getInitialA11ySettings();
    if (s) {
      if (typeof s.dyslexicFont === "boolean") setDyslexicFont(s.dyslexicFont);
      if (s.fontChoice === "opendyslexic" || s.fontChoice === "lexend") setFontChoice(s.fontChoice);
      if (typeof s.readingRuler === "boolean") setReadingRuler(s.readingRuler);
      if (["cream", "peach", "mint", "sky", "none"].includes(s.readingTint)) setReadingTint(s.readingTint);
      if (typeof s.wordHighlight === "boolean") setWordHighlight(s.wordHighlight);
      if (typeof s.reducedMotion === "boolean") setReducedMotion(s.reducedMotion);
      if (typeof s.largeText === "boolean") setLargeText(s.largeText);
      if (typeof s.soundEnabled === "boolean") setSoundEnabled(s.soundEnabled);
      if (typeof s.speechSpeed === "number") setSpeechSpeed(s.speechSpeed);
      if (["en", "pcm", "yo", "ha", "ig", "sw"].includes(s.narrationLanguage)) setNarrationLanguage(s.narrationLanguage);
    }
    setHydrated(true);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  // Save changes to localStorage (not before the saved settings have been loaded)
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          dyslexicFont,
          fontChoice,
          readingRuler,
          readingTint,
          wordHighlight,
          reducedMotion,
          largeText,
          soundEnabled,
          speechSpeed,
          narrationLanguage,
        })
      );
    } catch {
      // Ignore storage errors
    }
  }, [
    hydrated,
    dyslexicFont,
    fontChoice,
    readingRuler,
    readingTint,
    wordHighlight,
    reducedMotion,
    largeText,
    soundEnabled,
    speechSpeed,
    narrationLanguage,
  ]);

  // Apply DOM classes on root element
  useEffect(() => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;

    // Dyslexia mode toggle
    if (dyslexicFont) {
      root.classList.add("dyslexic-mode");
    } else {
      root.classList.remove("dyslexic-mode");
    }

    // Font choice under dyslexia mode
    if (dyslexicFont && fontChoice === "opendyslexic") {
      root.classList.add("font-opendyslexic");
      root.classList.remove("font-lexend");
    } else {
      root.classList.remove("font-opendyslexic");
      root.classList.add("font-lexend");
    }

    // Visual stress tints (Irlen relief)
    root.classList.remove("tint-cream", "tint-peach", "tint-mint", "tint-sky");
    if (readingTint !== "none") {
      root.classList.add(`tint-${readingTint}`);
    } else if (dyslexicFont) {
      // Auto-apply warm cream if in dyslexia mode without custom tint
      root.classList.add("tint-cream");
    }

    // Large text
    if (largeText) {
      root.classList.add("large-text-mode");
    } else {
      root.classList.remove("large-text-mode");
    }

    // Reduced motion
    if (reducedMotion) {
      root.classList.add("reduced-motion-mode");
    } else {
      root.classList.remove("reduced-motion-mode");
    }
  }, [dyslexicFont, fontChoice, readingTint, largeText, reducedMotion]);

  return (
    <AccessibilityContext.Provider
      value={{
        dyslexicFont,
        setDyslexicFont,
        fontChoice,
        setFontChoice,
        readingRuler,
        setReadingRuler,
        readingTint,
        setReadingTint,
        wordHighlight,
        setWordHighlight,
        reducedMotion,
        setReducedMotion,
        largeText,
        setLargeText,
        soundEnabled,
        setSoundEnabled,
        speechSpeed,
        setSpeechSpeed,
        narrationLanguage,
        setNarrationLanguage,
        panelOpen,
        setPanelOpen,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error("useAccessibility must be used within AccessibilityProvider");
  }
  return context;
}

