"use client";

import { useEffect, useRef, useState } from "react";
import { useMoyeStore } from "@/lib/moye-store";
import { useAccessibility } from "@/lib/accessibility-context";
import {
  BREATHING_ROUNDS,
  breathPhaseAt,
  breathPhasePrompt,
  breathScale,
  breathingTotalSeconds,
  buildBreakPlan,
  FEELINGS,
  feelingById,
  focusOpeningLine,
} from "@/lib/focus-feelings";
import { MoyinMascot, type MoyinPose } from "@/components/moyin-mascot";

type Mode = "choose" | "breathe" | "feelings" | "break";

/**
 * Focus and feelings (features.md B2). Ungraded and optional: there is no score, no
 * timer and no right answer here. A child can breathe, name a feeling, or plan a break.
 */
export function FocusAndFeelings() {
  const { state } = useMoyeStore();
  const { reducedMotion } = useAccessibility();
  const [mode, setMode] = useState<Mode>("choose");
  const [feeling, setFeeling] = useState<string | null>(null);
  const [minutes, setMinutes] = useState(15);

  const cycle = breathingTotalSeconds();

  return (
    <section
      aria-labelledby="focus-feelings-heading"
      data-demo="focus-feelings"
      className="w-full max-w-2xl bg-white border-2 border-[var(--border)] rounded-2xl p-5 flex flex-col gap-4"
    >
      {mode === "choose" && (
        <>
          <div>
            <h2 id="focus-feelings-heading" className="text-lg font-bold text-[var(--plum-900)]">
              Need a moment?
            </h2>
            <p className="text-sm text-[var(--fg-muted)] mt-1">
              {focusOpeningLine(state.activeProfileName)} None of this is graded.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            {[
              { id: "breathe" as const, label: "Breathe with Moyin", blurb: "A slow pattern, as long as you want." },
              { id: "feelings" as const, label: "What am I feeling?", blurb: "Pick a word. That is enough." },
              { id: "break" as const, label: "Plan a break", blurb: "Split the work into small steps." },
            ].map((option) => (
              <button
                key={option.id}
                type="button"
                data-demo={`focus-${option.id}`}
                onClick={() => setMode(option.id)}
                className="text-left rounded-xl border-2 border-[var(--border)] bg-white p-3 transition-colors hover:bg-[var(--paper)]"
              >
                <span className="block text-base font-bold text-[var(--plum-900)]">{option.label}</span>
                <span className="block text-sm text-[var(--fg-muted)] mt-0.5">{option.blurb}</span>
              </button>
            ))}
          </div>
        </>
      )}

      {mode === "breathe" && (
        <BreathingView
          cycleSeconds={cycle}
          reducedMotion={reducedMotion}
          onDone={() => setMode("choose")}
        />
      )}

      {mode === "feelings" && (
        <div className="flex flex-col gap-3">
          <h3 className="text-lg font-bold text-[var(--plum-900)]">What am I feeling?</h3>
          <div className="flex flex-wrap gap-2">
            {FEELINGS.map((option) => (
              <button
                key={option.id}
                type="button"
                data-demo={`feeling-${option.id}`}
                aria-pressed={feeling === option.id}
                onClick={() => setFeeling(option.id)}
                className={`text-sm font-semibold px-3 min-h-11 inline-flex items-center rounded-lg border transition-colors ${
                  feeling === option.id
                    ? "bg-[var(--plum-700)] text-white border-[var(--plum-700)]"
                    : "bg-[var(--paper)] text-[var(--plum-900)] border-[var(--border)]"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
          {/* Announced, and never a verdict. */}
          <p aria-live="polite" className="text-sm text-[var(--plum-900)] font-semibold min-h-12">
            {feeling ? feelingById(feeling)?.suggestion : "Pick whichever word feels closest."}
          </p>
          <BackButton onClick={() => setMode("choose")} />
        </div>
      )}

      {mode === "break" && (
        <div className="flex flex-col gap-3">
          <h3 className="text-lg font-bold text-[var(--plum-900)]">Plan a break</h3>
          <p className="text-sm text-[var(--fg-muted)]">How much is there to do?</p>
          <div className="flex flex-wrap gap-2">
            {[5, 10, 15, 20, 30].map((value) => (
              <button
                key={value}
                type="button"
                data-demo={`break-${value}`}
                aria-pressed={minutes === value}
                onClick={() => setMinutes(value)}
                className={`text-sm font-semibold px-3 min-h-11 inline-flex items-center rounded-lg border transition-colors ${
                  minutes === value
                    ? "bg-[var(--plum-700)] text-white border-[var(--plum-700)]"
                    : "bg-[var(--paper)] text-[var(--plum-900)] border-[var(--border)]"
                }`}
              >
                {value} minutes
              </button>
            ))}
          </div>
          <ol className="flex flex-col gap-1">
            {buildBreakPlan(minutes, 5).map((step, i) => (
              <li
                key={`${step.label}-${i}`}
                className={`text-sm px-3 py-2 rounded-lg border ${
                  step.label.startsWith("Rest")
                    ? "bg-[var(--plum-100)] border-[var(--border)] text-[var(--fg-muted)]"
                    : "bg-white border-[var(--border)] text-[var(--plum-900)] font-semibold"
                }`}
              >
                {step.label}
              </li>
            ))}
          </ol>
          <BackButton onClick={() => setMode("choose")} />
        </div>
      )}
    </section>
  );
}

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-sm font-semibold text-[var(--plum-700)] hover:underline min-h-11 inline-flex items-center self-start"
    >
      Back
    </button>
  );
}

/**
 * The breathing ring. The animation is driven by a class rather than a keyframe, and it
 * is switched off entirely under Calm Motion or the OS reduced motion setting, where the
 * phase text alone carries the pattern.
 */
function BreathingView({
  cycleSeconds,
  reducedMotion,
  onDone,
}: {
  cycleSeconds: number;
  reducedMotion: boolean;
  onDone: () => void;
}) {
  const [elapsed, setElapsed] = useState(0);
  const [round, setRound] = useState(1);
  const still = reducedMotion;
  const phase = breathPhaseAt(elapsed);

  function advance() {
    setElapsed((e) => {
      const next = e + 1;
      if (next >= cycleSeconds * BREATHING_ROUNDS) {
        setRound((r) => Math.min(BREATHING_ROUNDS, r + 1));
        return 0;
      }
      return next;
    });
  }

  // One step per second. Only started when the motion is welcome, and always cleared.
  const [running, setRunning] = useState(true);
  useTicker(running && !still, advance);

  const pose: MoyinPose =
    phase.phase === "rest" ? "sleepy" : phase.phase === "breathe out" ? "smile" : "body-double";

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-lg font-bold text-[var(--plum-900)]">Breathe with Moyin</h3>

      <div className="flex items-center gap-4">
        <MoyinMascot pose={pose} size={64} />
        <div
          aria-hidden="true"
          className="w-20 h-20 rounded-full border-2 border-[var(--plum-500)] bg-[var(--plum-100)] shrink-0"
          style={{
            transform: `scale(${still ? 1 : breathScale(phase.phase)})`,
            transition: still ? "none" : "transform 900ms ease-in-out",
          }}
        />
        <div className="flex-1">
          {/* Announced each phase, so the pattern works without seeing the ring. */}
          <p aria-live="polite" className="text-base font-bold text-[var(--plum-900)]">
            {breathPhasePrompt(phase.phase)}
          </p>
          <p className="text-xs text-[var(--fg-muted)] mt-1">
            Round {round} of {BREATHING_ROUNDS}. It loops, so you can stop whenever.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => setRunning((r) => !r)}
          className="btn-3d btn-3d-card text-base"
        >
          {running ? "Pause" : "Continue"}
        </button>
        <BackButton onClick={onDone} />
      </div>
    </div>
  );
}

/**
 * Advances the breathing pattern once per second while enabled. The interval is always
 * cleared on unmount and whenever the pattern is paused.
 */
function useTicker(enabled: boolean, tick: () => void) {
  // Keep the latest callback in an effect rather than writing the ref during render.
  const savedTick = useRef(tick);
  useEffect(() => {
    savedTick.current = tick;
  });
  useEffect(() => {
    if (!enabled) return;
    const id = window.setInterval(() => savedTick.current(), 1000);
    return () => window.clearInterval(id);
  }, [enabled]);
}
