/**
 * Energy check in at the start of a session (features.md B10, SPEC.md 5.3).
 *
 * Three choices, no score, nothing leaves the device. A tired child gets an easier
 * warm up and a shorter goal, so the session still ends well rather than ending in
 * frustration. Never framed as a rating of the child: this is how the session starts,
 * not how the child is doing.
 *
 * Everything is a pure function so the same answer always produces the same plan.
 */

export type EnergyLevel = "full" | "okay" | "tired";

export const ENERGY_LEVELS: { id: EnergyLevel; label: string; blurb: string }[] = [
  { id: "full", label: "Full of energy", blurb: "Let's go further today." },
  { id: "okay", label: "Okay", blurb: "A steady session works." },
  { id: "tired", label: "Tired", blurb: "We will keep it small and gentle." },
];

export interface SessionPlan {
  /** Skill ids to serve first, easiest first. */
  skillOrder: string[];
  /** How many questions to aim for. Never a countdown, just a soft target. */
  questionTarget: number;
  /** Tier to open the session at: 1 is the gentlest. */
  startTier: 1 | 2 | 3;
  /** Honey per question is trimmed for a tired child so the session stays short. */
  honeyScale: number;
  /** True when the plan asks for a break rather than another question. */
  suggestBreak: boolean;
}

/**
 * Turns the check in into a plan. `availableSkills` is the ordered list the child could
 * do; the plan reorders it so the gentlest comes first when energy is low.
 */
export function planForEnergy(
  energy: EnergyLevel,
  availableSkills: string[],
  skillMastery: Record<string, { pKnown: number; tier: number }> = {},
): SessionPlan {
  // Trim as well as filter: a padded id would sort and compare inconsistently, and a
  // repeated id would queue the same skill twice in one session.
  const seen = new Set<string>();
  const known = availableSkills.filter((id) => {
    if (typeof id !== "string") return false;
    const trimmed = id.trim();
    if (trimmed.length === 0 || seen.has(trimmed)) return false;
    seen.add(trimmed);
    return true;
  });

  // Sort by how well the child knows each skill, gentlest first. Unknown skills sit at
  // the bottom of the range rather than being treated as zero.
  const byGentleness = [...known].sort((a, b) => {
    const pa = skillMastery[a]?.pKnown ?? 0.3;
    const pb = skillMastery[b]?.pKnown ?? 0.3;
    if (pa !== pb) return pa - pb;
    return a.localeCompare(b);
  });

  if (energy === "tired") {
    return {
      skillOrder: byGentleness.slice(0, 2),
      questionTarget: 3,
      startTier: 1,
      honeyScale: 0.5,
      suggestBreak: true,
    };
  }

  if (energy === "okay") {
    return {
      skillOrder: byGentleness,
      questionTarget: 8,
      startTier: 1,
      honeyScale: 1,
      suggestBreak: false,
    };
  }

  return {
    skillOrder: byGentleness,
    questionTarget: 12,
    startTier: 2,
    honeyScale: 1,
    suggestBreak: false,
  };
}

/** One warm line for the start of the session. Never mentions a score or a target. */
export function energyGreeting(name: string, energy: EnergyLevel): string {
  const who = name.trim() || "friend";
  if (energy === "tired") return `No problem at all, ${who}. Small and gentle today.`;
  if (energy === "okay") return `Good to see you, ${who}. Let's take it steady.`;
  return `Great to see you, ${who}. Let's go a little further today.`;
}

/**
 * Minutes of focus held, from measured attempt timestamps only (features.md B2 asks for
 * the same honesty). Returns whole minutes, or null when there is nothing measured.
 *
 * `maxGapMs` bounds what counts as one sitting. Without it a child who opens the app on
 * Monday and again on Friday would be reported as having focused for 1440 minutes, which
 * is simply untrue. Anything longer than the gap is treated as a break and not counted.
 */
export function focusMinutesHeld(timestamps: number[], maxGapMs = DEFAULT_SESSION_GAP_MS): number | null {
  const valid = timestamps.filter((t) => Number.isFinite(t)).sort((a, b) => a - b);
  if (valid.length < 2) return null;
  const spanMs = valid[valid.length - 1] - valid[0];
  const minutes = Math.round(spanMs / 60_000);
  // Under a minute of real measurement is noise, not focus. Say nothing rather than guess.
  if (minutes < 1) return null;
  const gap = Number.isFinite(maxGapMs) && maxGapMs > 0 ? maxGapMs : DEFAULT_SESSION_GAP_MS;
  return Math.min(minutes, Math.round(gap / 60_000));
}

/** A gap longer than this means the child stopped, so the span is not one sitting. */
export const DEFAULT_SESSION_GAP_MS = 90 * 60_000;

/**
 * Longest single sitting across many timestamps, for a class summary where the whole
 * history is being looked at at once. Same honesty rules as focusMinutesHeld.
 */
export function longestSessionMinutes(
  timestamps: number[],
  maxGapMs = DEFAULT_SESSION_GAP_MS,
): number | null {
  const valid = timestamps.filter((t) => Number.isFinite(t)).sort((a, b) => a - b);
  if (valid.length < 2) return null;
  const gap = Number.isFinite(maxGapMs) && maxGapMs > 0 ? maxGapMs : DEFAULT_SESSION_GAP_MS;

  let best = 0;
  let start = valid[0];
  let previous = valid[0];
  for (const t of valid.slice(1)) {
    if (t - previous > gap) {
      best = Math.max(best, previous - start);
      start = t;
    }
    previous = t;
  }
  best = Math.max(best, previous - start);

  const minutes = Math.round(best / 60_000);
  return minutes >= 1 ? minutes : null;
}
