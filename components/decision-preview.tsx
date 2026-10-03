"use client";

import { useMemo } from "react";
import { useMoyeStore } from "@/lib/moye-store";
import { updatePKnown } from "@/lib/mastery";
import { focusMinutesHeld } from "@/lib/energy";
import { DEMO_SKILL_TRACES } from "@/lib/demo-traces";
import { MoyinMascot } from "@/components/moyin-mascot";

/**
 * A real result from /proof, read from a committed fixture rather than typed by hand
 * (features.md C4). The numbers below are produced by running the actual functions in
 * lib/mastery.ts, so this card cannot drift away from what the app does.
 */
export function DecisionPreview() {
  const { state } = useMoyeStore();

  // Recompute from the committed traces so the card shows this run's real arithmetic.
  const traces = useMemo(
    () =>
      DEMO_SKILL_TRACES.map((trace) => {
        let p = trace.startPKnown;
        for (const isCorrect of trace.answers) p = updatePKnown(p, isCorrect).newPKnown;
        return { ...trace, finalPKnown: p, finalTier: updatePKnown(p, true).recommendedTier };
      }),
    [],
  );

  const heldMinutes = focusMinutesHeld(state.attemptLogs.map((a) => a.timestamp));

  return (
    <section
      aria-labelledby="decision-preview-heading"
      data-demo="decision-preview"
      className="w-full max-w-3xl mx-auto bg-white border-2 border-[var(--border)] rounded-3xl p-6 flex flex-col gap-4"
    >
      <div>
        <h2 id="decision-preview-heading" className="text-xl font-bold text-[var(--plum-900)]">
          How Moye decides
        </h2>
        <p className="text-sm text-[var(--fg-muted)] mt-1">
          Two real runs through the same function the lesson uses. Nothing here is a marketing number.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {traces.map((trace) => (
          <article key={trace.name} className="p-4 rounded-2xl bg-[var(--paper)] border border-[var(--border)]">
            <h3 className="text-sm font-bold text-[var(--plum-900)]">{trace.name}</h3>
            <p className="text-xs text-[var(--fg-muted)] mt-1">
              Started at {trace.startPKnown.toFixed(2)}, answered {trace.answers.length} questions.
            </p>
            <p className="text-sm font-bold text-[var(--plum-900)] mt-2">
              Moyin moved them to tier {trace.finalTier}, at {trace.finalPKnown.toFixed(2)}.
            </p>
          </article>
        ))}
      </div>

      {heldMinutes !== null && (
        <p className="text-sm text-[var(--fg-muted)]">
          On this device, focus has been held for about {heldMinutes} minute{heldMinutes === 1 ? "" : "s"} so far,
          measured from real attempt times.
        </p>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <a href="/proof" data-demo="decision-preview-link" className="btn-3d btn-3d-plum text-base">
          See the working
        </a>
        <span className="text-sm text-[var(--fg-muted)] inline-flex items-center gap-2">
          <MoyinMascot pose="smile" size={28} />
          No timer, no buzzer, ever.
        </span>
      </div>
    </section>
  );
}
