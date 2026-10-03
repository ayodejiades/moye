"use client";

import { useEffect } from "react";

/**
 * Registers the Moye service worker so the app keeps working with the network off.
 * Production only: a cached shell during development hides the change you just made.
 * (docs/SPEC.md section 5, features.md A1.)
 */
export function ServiceWorkerRegistrar() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if (!("serviceWorker" in navigator)) return;

    const register = () => {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // Offline support is a bonus, never a blocker. Ignore a failed registration.
      });
    };

    if (document.readyState === "complete") register();
    else window.addEventListener("load", register, { once: true });

    return () => window.removeEventListener("load", register);
  }, []);

  return null;
}
