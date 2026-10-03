"use client";

import { ReactNode } from "react";
import { AccessibilityProvider } from "./accessibility-context";
import { UiLanguageProvider } from "./ui-language-context";

export function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <AccessibilityProvider>
      <UiLanguageProvider>{children}</UiLanguageProvider>
    </AccessibilityProvider>
  );
}
