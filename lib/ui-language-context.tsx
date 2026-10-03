"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  uiStrings,
  normaliseUiLanguage,
  readStoredUiLanguage,
  storeUiLanguage,
  type UiLanguage,
  type UiStrings,
} from "@/lib/ui-strings";

type UiLanguageContextValue = {
  language: UiLanguage;
  strings: UiStrings;
  setLanguage: (language: UiLanguage) => void;
};

const UiLanguageContext = createContext<UiLanguageContextValue | null>(null);

/**
 * UI language for the screens themselves (features.md B8). Kept separate from the
 * narration voice in lib/accessibility-context, because speaking in Yoruba and reading
 * in Yoruba are two different choices.
 */
export function UiLanguageProvider({ children }: { children: ReactNode }) {
  // English first so the server and first client render match; the stored choice is applied
  // right after mount. Reading localStorage during render caused a hydration error.
  const [language, setLanguageState] = useState<UiLanguage>("en");
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- syncing from localStorage after mount
    setLanguageState(readStoredUiLanguage());
  }, []);

  const setLanguage = useCallback((next: UiLanguage) => {
    const normalised = normaliseUiLanguage(next);
    storeUiLanguage(normalised);
    setLanguageState(normalised);
  }, []);

  const value = useMemo(
    () => ({ language, strings: uiStrings(language), setLanguage }),
    [language, setLanguage],
  );

  return <UiLanguageContext.Provider value={value}>{children}</UiLanguageContext.Provider>;
}

export function useUiLanguage(): UiLanguageContextValue {
  const context = useContext(UiLanguageContext);
  if (!context) {
    // Rendering in English is always safe, so a missing provider never breaks a screen.
    return { language: "en", strings: uiStrings("en"), setLanguage: () => {} };
  }
  return context;
}
