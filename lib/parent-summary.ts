/**
 * Plain language summary a grown up can copy and send on (features.md B9).
 *
 * Copy only. Nothing is sent, no email, no account, no tracking. The wording avoids
 * clinical terms and avoids anything that reads as a verdict on the child: it says what
 * was practised, what landed, and what to try next.
 *
 * A pure function, so the same report always produces the same text.
 */

export interface SummaryInput {
  childName: string;
  /** Skills that are going well. */
  strongSkills: string[];
  /** Skills that would benefit from more practice. Never phrased as a failure. */
  growingSkills: string[];
  /** Whole minutes of focus, from measured attempt timestamps. Null when unmeasured. */
  focusMinutes: number | null;
  /** Consecutive days. */
  sparks: number;
  /** Curriculum the lessons follow. */
  curriculum: string;
}

/** Joins a list the way a person would say it, with "and" before the last item. */
export function joinList(items: string[]): string {
  const clean = items.map((s) => s.trim()).filter(Boolean);
  if (clean.length === 0) return "";
  if (clean.length === 1) return clean[0];
  return `${clean.slice(0, -1).join(", ")} and ${clean[clean.length - 1]}`;
}

/**
 * Builds the summary. Every number here comes from a measured field; when a number is
 * missing the sentence is left out rather than filled with a guess.
 */
export function buildParentSummary(input: SummaryInput): string {
  const name = input.childName.trim() || "Your child";
  const lines: string[] = [];

  lines.push(`${name}'s week with Moye`);

  const practised: string[] = [];
  if (input.strongSkills.length) practised.push(`is doing well with ${joinList(input.strongSkills)}`);
  if (input.growingSkills.length) practised.push(`is practising ${joinList(input.growingSkills)}`);
  if (practised.length) {
    lines.push(`${name} ${practised.join(", and ")}.`);
  } else {
    lines.push(`${name} is just getting started. That is completely fine.`);
  }

  const measured: string[] = [];
  if (input.focusMinutes !== null && input.focusMinutes >= 1) {
    measured.push(
      `focused for about ${input.focusMinutes} minute${input.focusMinutes === 1 ? "" : "s"} at a time`,
    );
  }
  if (input.sparks > 0) {
    measured.push(`came back ${input.sparks} day${input.sparks === 1 ? "" : "s"} in a row`);
  }
  if (measured.length) {
    lines.push(`${capitalise(measured.join(", and "))}.`);
  }

  lines.push(`These lessons follow the ${input.curriculum} curriculum.`);
  lines.push("There were no timers and no countdowns. A wrong answer only ever got a hint.");
  lines.push("Moye is happy to keep going at this pace, and stopping for the day is fine too.");

  return lines.join("\n\n");
}

function capitalise(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/**
 * Words the summary must never use. A parent facing note should not read like a
 * diagnosis or a scorecard.
 */
export const BANNED_SUMMARY_WORDS = [
  "fail",
  "failed",
  "failure",
  "weak",
  "weakness",
  "poor",
  "behind",
  "deficient",
  "disorder",
  "dyscaria",
  "diagnos",
  "percentile",
  "score",
  "grade",
  "iq",
  "average",
  "below average",
];

export function summaryHasBannedWord(text: string): string | null {
  const lower = text.toLowerCase();
  for (const word of BANNED_SUMMARY_WORDS) {
    if (lower.includes(word)) return word;
  }
  return null;
}
