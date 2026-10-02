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
  const [dyslexicFont, setDyslexicFont] = useState(() => {
    const s = getInitialA11ySettings();
    return typeof s?.dyslexicFont === "boolean" ? s.dyslexicFont : false;
  });
  const [fontChoice, setFontChoice] = useState<DyslexiaFontChoice>(() => {
    const s = getInitialA11ySettings();
    return s?.fontChoice === "opendyslexic" || s?.fontChoice === "lexend" ? s.fontChoice : "opendyslexic";
  });
  const [readingRuler, setReadingRuler] = useState(() => {
    const s = getInitialA11ySettings();
    return typeof s?.readingRuler === "boolean" ? s.readingRuler : false;
  });
  const [readingTint, setReadingTint] = useState<ReadingTint>(() => {
    const s = getInitialA11ySettings();
    return ["cream", "peach", "mint", "sky", "none"].includes(s?.readingTint) ? s.readingTint : "none";
  });
  const [wordHighlight, setWordHighlight] = useState(() => {
    const s = getInitialA11ySettings();
    return typeof s?.wordHighlight === "boolean" ? s.wordHighlight : true;
  });
  const [reducedMotion, setReducedMotion] = useState(() => {
    const s = getInitialA11ySettings();
    return typeof s?.reducedMotion === "boolean" ? s.reducedMotion : false;
  });
  const [largeText, setLargeText] = useState(() => {
    const s = getInitialA11ySettings();
    return typeof s?.largeText === "boolean" ? s.largeText : false;
  });
  const [soundEnabled, setSoundEnabled] = useState(() => {
    const s = getInitialA11ySettings();
    return typeof s?.soundEnabled === "boolean" ? s.soundEnabled : true;
  });
  const [speechSpeed, setSpeechSpeed] = useState(() => {
    const s = getInitialA11ySettings();
    return typeof s?.speechSpeed === "number" ? s.speechSpeed : 1.0;
  });
  const [narrationLanguage, setNarrationLanguage] = useState<VoiceLanguage>(() => {
    const s = getInitialA11ySettings();
    return ["en", "pcm", "yo", "ha", "ig", "sw"].includes(s?.narrationLanguage) ? s.narrationLanguage : "en";
  });
  const [panelOpen, setPanelOpen] = useState(false);

  // Save changes to localStorage
  useEffect(() => {
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

