/**
 * Committed answer traces used to show the adaptive model working (features.md C4).
 *
 * These are inputs, not outputs. The numbers the landing page and /proof display are
 * produced by running `updatePKnown` from lib/mastery.ts over these traces, so the page
 * cannot quietly disagree with the engine. A weak learner and a strong learner are
 * pinned here so the difference is visible in one comparison.
 */

export interface SkillTrace {
  /** Shown on the page. Plain words, no jargon. */
  name: string;
  /** The prior the trace starts from. */
  startPKnown: number;
  /** Answers in order. true is a right answer. */
  answers: boolean[];
}

export const DEMO_SKILL_TRACES: SkillTrace[] = [
  {
    name: "A learner who found counting hard",
    startPKnown: 0.62,
    answers: [false, false, false, false, false],
  },
  {
    name: "A learner who found counting easy",
    startPKnown: 0.3,
    answers: [true, true, true, true, true],
  },
];
