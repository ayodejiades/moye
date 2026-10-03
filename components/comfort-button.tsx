"use client";

import { useAccessibility } from "@/lib/accessibility-context";
import { AccessibilitySheet } from "@/components/accessibility-sheet";
import { SettingsIcon } from "@/components/ui/svg-icons";

/**
 * The one Comfort settings control, shared by the landing header and the in app headers.
 * SPEC section 5.7 asks for the accessibility sheet on every screen; this is also the
 * WCAG 2.2.2 pause mechanism for the ambient motion on the landing page.
 */
export function ComfortButton() {
  const { setPanelOpen } = useAccessibility();

  return (
    <>
      <button
        type="button"
        data-demo="a11y-open"
        onClick={() => setPanelOpen(true)}
        aria-label="Open comfort settings"
        aria-haspopup="dialog"
        className="btn-3d btn-3d-card gap-2"
      >
        <SettingsIcon size={20} />
        <span className="hidden sm:inline">Comfort settings</span>
      </button>
      <AccessibilitySheet />
    </>
  );
}
