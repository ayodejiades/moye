"use client";

import { useEffect, useState } from "react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

/**
 * A calm install control for /learn (docs/SPEC.md section 5, features.md A1).
 * Deliberately a button the child or a grown up chooses to press: no popup, no nag.
 * The browser only fires beforeinstallprompt when Moye is not installed yet, so once
 * the app is on the home screen (or the browser cannot install) this renders nothing.
 */
export function InstallPrompt() {
  const [promptEvent, setPromptEvent] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    const onPrompt = (e: Event) => {
      // Hold it in our own state instead of letting the browser show its mini infobar.
      e.preventDefault();
      setPromptEvent(e as BeforeInstallPromptEvent);
    };
    const onInstalled = () => setPromptEvent(null);

    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  if (!promptEvent) return null;

  return (
    <button
      type="button"
      data-demo="install-app"
      onClick={async () => {
        await promptEvent.prompt();
        await promptEvent.userChoice;
        setPromptEvent(null);
      }}
      className="btn-3d btn-3d-card text-base gap-2 w-full"
    >
      Add Moye to your home screen
    </button>
  );
}
