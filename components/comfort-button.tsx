"use client";

import { useAccessibility } from "@/lib/accessibility-context";
import { AccessibilitySheet } from "@/components/accessibility-sheet";
import { SettingsIcon } from "@/components/ui/svg-icons";

/**
 * The one Comfort settings control, used in the header of every screen.
 * SPEC section 5.7 asks for the accessibility sheet on every screen; this is also the
 * WCAG 2.2.2 pause mechanism for the ambient motion on the landing page.
 *
 * Rendered at header size so it stays a quiet control rather than the loudest thing on
 * the page. The label is dropped on narrow screens, where the icon and the aria-label
 * carry the meaning and the tap target is still 44px.
 */
export function ComfortButton({ showLabel = true }: { showLabel?: boolean }) {
  const { setPanelOpen } = useAccessibility();

  return (
    <>
      <button
        type="button"
        data-demo="a11y-open"
        onClick={() => setPanelOpen(true)}
        aria-label="Open comfort settings"
        aria-haspopup="dialog"
        className="btn-3d btn-3d-card btn-3d-header gap-2"
      >
        <SettingsIcon size={18} />
        {showLabel ? (
          <span className="hidden md:inline whitespace-nowrap">Comfort settings</span>
        ) : (
          <span className="hidden md:inline whitespace-nowrap">Comfort</span>
        )}
      </button>
      <AccessibilitySheet />
    </>
  );
}
