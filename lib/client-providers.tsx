"use client";

import { ReactNode } from "react";
import { AccessibilityProvider } from "./accessibility-context";

export function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <AccessibilityProvider>
      {children}
    </AccessibilityProvider>
  );
}
