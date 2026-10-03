/**
 * Focus and feelings micro skills (features.md B2, SPEC.md 6.3 priority 4).
 *
 * Ungraded. There is no right answer, no score, and nothing here feeds a difficulty
 * number. A child can breathe, name a feeling, or plan a break, and any of it counts.
 *
 * The one thing that is measured is focus held, and only from real attempt timestamps
 * (see focusMinutesHeld in lib/energy.ts). Nothing is estimated.
 */

export type BreathPhase = "breathe in" | "hold" | "breathe out" | "rest";

export interface BreathStep {
  phase: BreathPhase;
  /** Whole seconds to hold this phase. */
  seconds: number;
}

/**
 * A calm breathing pattern. Long exhale, which is the part that settles someone down,
 * and short holds so nobody has to concentrate hard while doing it.
 */
export const CALM_BREATHING: BreathStep[] = [
  { phase: "breathe in", seconds: 4 },
  { phase: "hold", seconds: 2 },
  { phase: "breathe out", seconds: 6 },
  { phase: "rest", seconds: 2 },
];

/** Rounds a child might do. Never a countdown pressure: it is "up to". */
export const BREATHING_ROUNDS = 4;

/** How long the whole pattern takes, so the UI can show a gentle total. */
export function breathingTotalSeconds(steps: BreathStep[] = CALM_BREATHING): number {
  return steps.reduce((total, step) => total + Math.max(0, step.seconds), 0);
}

/** Which phase is showing at a given elapsed second. Loops forever, so no pressure. */
export function breathPhaseAt(elapsedSeconds: number, steps: BreathStep[] = CALM_BREATHING): BreathStep {
  const safe = steps.filter((s) => s.seconds > 0);
  if (safe.length === 0) return { phase: "rest", seconds: 0 };
  const cycle = breathingTotalSeconds(safe);
  // Guard against a negative or NaN clock: start at the beginning rather than loop badly.
  const within = Number.isFinite(elapsedSeconds) && elapsedSeconds > 0 ? elapsedSeconds % cycle : 0;
  let acc = 0;
  for (const step of safe) {
    acc += step.seconds;
    if (within < acc) return step;
  }
  return safe[safe.length - 1];
}

/** What Moyin says for each phase. Warm and short, never counting down at a child. */
export function breathPhasePrompt(phase: BreathPhase): string {
  if (phase === "breathe in") return "Breathe in gently through your nose.";
  if (phase === "hold") return "Hold it softly. No need to strain.";
  if (phase === "breathe out") return "Now breathe out slowly. This is the settling part.";
  return "Rest. Moyin is right here.";
}

/** How the animation should move for a phase. Drives the calm breathing ring. */
export function breathScale(phase: BreathPhase): number {
  if (phase === "breathe in") return 1;
  if (phase === "hold") return 1;
  if (phase === "breathe out") return 0.82;
  return 0.82;
}

export interface Feeling {
  id: string;
  label: string;
  /** What Moyin suggests for this feeling. Never advice, always an invitation. */
  suggestion: string;
}

/**
 * "What am I feeling" choices. Deliberately plain words a child can recognise, and no
 * clinical labels. Colour is never the only signal: each has a name and a suggestion.
 */
export const FEELINGS: Feeling[] = [
  { id: "wobbly", label: "Wobbly inside", suggestion: "That is a lot to hold. Let's take one slow breath." },
  { id: "cross", label: "Cross", suggestion: "Cross is a big feeling. You can put it down for a minute." },
  { id: "flat", label: "Flat", suggestion: "Flat happens. Small steps still count today." },
  { id: "happy", label: "Happy", suggestion: "Happy is worth noticing. What made it?" },
  { id: "tired", label: "Tired", suggestion: "Tired means less, not more. We can stop here." },
  { id: "wondering", label: "Wondering", suggestion: "Wondering is a good place to start from." },
];

export function feelingById(id: string): Feeling | null {
  return FEELINGS.find((f) => f.id === id) ?? null;
}

export interface BreakStep {
  label: string;
  minutes: number;
}

/**
 * A break plan: small chunks with a rest between them (features.md B2, task chunking).
 * Every chunk is short enough to start when you do not feel like starting.
 */
export function buildBreakPlan(totalMinutes: number, chunkMinutes = 5): BreakStep[] {
  const safeTotal = Number.isFinite(totalMinutes) ? Math.max(0, Math.round(totalMinutes)) : 0;
  const safeChunk = Number.isFinite(chunkMinutes) ? Math.max(1, Math.round(chunkMinutes)) : 5;
  if (safeTotal === 0) return [];

  const steps: BreakStep[] = [];
  let remaining = safeTotal;
  while (remaining > 0) {
    const length = Math.min(safeChunk, remaining);
    steps.push({ label: `Work for ${length} minute${length === 1 ? "" : "s"}`, minutes: length });
    remaining -= length;
    if (remaining > 0) {
      const rest = Math.min(2, remaining);
      steps.push({ label: `Rest for ${rest} minute${rest === 1 ? "" : "s"}`, minutes: rest });
      remaining -= rest;
    }
  }
  return steps;
}

/** One warm line for the start of a focus session. Never mentions a score. */
export function focusOpeningLine(name: string): string {
  const who = name.trim() || "friend";
  return `Small steps with ${who}. Stop whenever you like.`;
}
