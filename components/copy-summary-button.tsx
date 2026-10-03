"use client";

import { useState } from "react";
import { buildParentSummary, type SummaryInput } from "@/lib/parent-summary";
import { CheckIcon } from "@/components/ui/svg-icons";

/**
 * Copy this week's summary (features.md B9).
 *
 * Copy only. There is no send button, no email field, and nothing leaves the device.
 * The grown up decides where it goes.
 */
export function CopySummaryButton({ summary }: { summary: SummaryInput }) {
  const [copied, setCopied] = useState(false);
  const [failed, setFailed] = useState(false);

  async function copy() {
    const text = buildParentSummary(summary);
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        // Older browsers and insecure origins have no async clipboard.
        const area = document.createElement("textarea");
        area.value = text;
        area.setAttribute("readonly", "");
        area.style.position = "fixed";
        area.style.opacity = "0";
        document.body.appendChild(area);
        area.select();
        document.execCommand("copy");
        document.body.removeChild(area);
      }
      setCopied(true);
      setFailed(false);
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      setFailed(true);
      window.setTimeout(() => setFailed(false), 4000);
    }
  }

  return (
    <div className="flex flex-col gap-1">
      <button
        type="button"
        data-demo="copy-summary"
        onClick={copy}
        className="btn-3d btn-3d-card text-base gap-2 self-start"
      >
        {copied ? <CheckIcon size={16} /> : null}
        <span>{copied ? "Copied" : "Copy this week's summary"}</span>
      </button>
      {failed && (
        <p className="text-sm text-[var(--fg-muted)]">
          Copy did not work in this browser. The full summary is on the page below.
        </p>
      )}
    </div>
  );
}
