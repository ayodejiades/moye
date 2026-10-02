/**
 * Spark Streaks (SPEC.md §5.4)
 *
 * Rules:
 * - A Spark counts consecutive days of learning.
 * - Timezone-safe: calculates against the learner's local ISO date (YYYY-MM-DD).
 * - Includes streak freezes and rest-day tokens.
 * - If a day is missed:
 *     - If rest tokens > 0: auto-uses 1 token, Spark remains intact.
 *     - If streak freezes > 0: auto-uses 1 freeze, Spark remains intact.
 *     - If none left: Spark resets to 1 upon learning without any guilt copy!
 *       Moyin says: "Welcome back! Your spark is warm."
 */

export interface SparkStreakState {
  sparkCount: number;
  freezes: number;
  restTokens: number;
  lastActiveDate: string; // YYYY-MM-DD
  message: string;
}

export function calculateStreakUpdate(
  current: SparkStreakState,
  todayDate: string // YYYY-MM-DD
): SparkStreakState {
  // Counts are whole drops and tokens from a zero floor; sanitize once so a
  // negative or fractional stored value cannot leak into the next state.
  const state: SparkStreakState = {
    sparkCount: validCount(current.sparkCount),
    freezes: validCount(current.freezes),
    restTokens: validCount(current.restTokens),
    lastActiveDate: current.lastActiveDate,
    message: current.message,
  };

  if (!state.lastActiveDate) {
    return {
      sparkCount: 1,
      freezes: state.freezes,
      restTokens: state.restTokens,
      lastActiveDate: todayDate,
      message: "Spark ignited! Great start.",
    };
  }

  if (state.lastActiveDate === todayDate) {
    return {
      ...state,
      message: "You've already stoked your spark today!",
    };
  }

  // Calculate day difference
  const lastDate = new Date(state.lastActiveDate + "T00:00:00Z");
  const thisDate = new Date(todayDate + "T00:00:00Z");
  if (!isCalendarDate(state.lastActiveDate) || !isCalendarDate(todayDate)) {
    // An unreadable date is reported, never stored: writing it would poison
    // every future calculation, and resetting on it would punish the learner.
    return {
      ...state,
      message: "Moyin could not read that date, so your spark is untouched.",
    };
  }
  const diffDays = Math.round((thisDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays < 1) {
    // A date before the last active day is stale input (clock skew, replayed
    // request), not a missed day: counting it would inflate the spark and move
    // lastActiveDate backwards in time.
    return {
      ...state,
      message: "That day is already behind you, so your spark is untouched.",
    };
  }

  if (diffDays === 1) {
    // Consecutive day
    return {
      sparkCount: state.sparkCount + 1,
      freezes: state.freezes,
      restTokens: state.restTokens,
      lastActiveDate: todayDate,
      message: `Spark grew! ${state.sparkCount + 1} days strong.`,
    };
  }

  const missedDays = diffDays - 1;
  let remainingFreezes = state.freezes;
  let remainingTokens = state.restTokens;
  let protectedDays = 0;

  // Use rest tokens first, then freezes
  for (let i = 0; i < missedDays; i++) {
    if (remainingTokens > 0) {
      remainingTokens--;
      protectedDays++;
    } else if (remainingFreezes > 0) {
      remainingFreezes--;
      protectedDays++;
    } else {
      break;
    }
  }

  if (protectedDays >= missedDays) {
    return {
      sparkCount: current.sparkCount + 1,
      freezes: remainingFreezes,
      restTokens: remainingTokens,
      lastActiveDate: todayDate,
      message: "Rest token used to protect your spark while you recharged!",
    };
  }

  // No guilt copy reset
  return {
    sparkCount: 1,
    freezes: remainingFreezes,
    restTokens: remainingTokens,
    lastActiveDate: todayDate,
    message: "Welcome back! Your spark is warm.",
  };
}

/** A count of sparks, freezes, or tokens is a finite, non-negative whole number. */
function validCount(value: number): number {
  return Number.isFinite(value) && value > 0 ? Math.floor(value) : 0;
}

/** Strict YYYY-MM-DD naming a real calendar day (rejects 2026-02-30, junk, etc.). */
function isCalendarDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [y, m, d] = value.split("-").map(Number);
  const dt = new Date(`${value}T00:00:00Z`);
  return (
    Number.isFinite(dt.getTime()) &&
    dt.getUTCFullYear() === y &&
    dt.getUTCMonth() + 1 === m &&
    dt.getUTCDate() === d
  );
}
