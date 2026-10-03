/**
 * Onboarding placement (features.md A2, SPEC.md 6.2).
 *
 * A short adaptive check so a child starts at their real level instead of at level one.
 * Six questions, one at a time, no timer, and it can be skipped.
 *
 * How it works: each question is tagged with a tier (1 gentle, 2 in the middle, 3 a
 * stretch). Two correct answers in a row moves the ladder up one rung, two slips in a
 * row moves it down. The ladder position then maps to a starting level.
 *
 * The same estimator that runs the lessons decides the placement, so a child cannot be
 * placed by a different rule than the one that will teach them. All pure functions.
 */

import { LEVEL_BANKS, SKILL_TITLES } from "./lesson-bank";
import { updatePKnown, DEFAULT_BKT_PARAMS } from "./mastery";
import type { Question } from "./content-schema";

/** Questions served during placement. One per rung of difficulty, gentle first. */
export const PLACEMENT_QUESTION_IDS: string[] = [
  "q-math-1-3", // tier 1, count within 10
  "q-math-1-4", // tier 2, count within 10
  "q-math-1-12", // tier 3, count within 10
  "q-math-2-3", // tier 1, money
  "q-math-2-4", // tier 2, money
  "q-math-2-10", // tier 3, money
];

/** Correct answers in a row needed to step up the ladder. */
export const STEP_UP_AFTER = 2;
/** Slips in a row needed to step down. */
export const STEP_DOWN_AFTER = 2;

export interface PlacementAnswer {
  questionId: string;
  skillId: string;
  tier: number;
  isCorrect: boolean;
}

export interface PlacementResult {
  /** Where on the difficulty ladder the child finished, 0 being the gentlest. */
  rung: number;
  /** Level the child should start on. */
  startingLevelId: string;
  startingLevelTitle: string;
  /** Seed mastery to write into the store, keyed by skill. */
  masterySeed: Record<string, { pKnown: number; tier: number }>;
  /** Skills actually covered, so the summary can say how much was checked. */
  skillsMeasured: number;
  /** True when the child answered everything correctly. Never shown as a score. */
  allCorrect: boolean;
}

/** Resolves a placement question id against the committed banks. */
export function getPlacementQuestions(bank: Record<string, Question[]> = LEVEL_BANKS): Question[] {
  const byId = new Map<string, Question>();
  for (const questions of Object.values(bank)) {
    for (const q of questions) byId.set(q.id, q);
  }
  return PLACEMENT_QUESTION_IDS.map((id) => byId.get(id)).filter((q): q is Question => Boolean(q));
}

/**
 * Walks the answers and returns where the child ended up.
 *
 * The ladder starts in the middle (rung 1) so the first question is fair either way, and
 * it is clamped so no amount of answers pushes a child past the top or bottom rung.
 */
export function scorePlacement(answers: PlacementAnswer[], totalRungs = 3): PlacementResult {
  let rung = 1;
  let inARow = 0;
  let lastWasCorrect = true;

  for (const answer of answers) {
    if (answer.isCorrect) {
      inARow = lastWasCorrect ? inARow + 1 : 1;
      if (inARow >= STEP_UP_AFTER) {
        rung = Math.min(totalRungs - 1, rung + 1);
        inARow = 0;
      }
    } else {
      inARow = lastWasCorrect ? -1 : inARow - 1;
      if (inARow <= -STEP_DOWN_AFTER) {
        rung = Math.max(0, rung - 1);
        inARow = 0;
      }
    }
    lastWasCorrect = answer.isCorrect;
  }

  // Rung 0 starts at level 1, rung 2 starts at level 3. A child at the very top is
  // offered level 4 rather than being held back.
  const startingLevelId = rung <= 0 ? "s1" : rung === 1 ? "s2" : "s3";

  return {
    rung,
    startingLevelId,
    startingLevelTitle: SKILL_TITLES[startingLevelId] ?? "Counting and Stories",
    masterySeed: seedMasteryFromPlacement(answers),
    skillsMeasured: new Set(answers.map((a) => a.skillId)).size,
    allCorrect: answers.length > 0 && answers.every((a) => a.isCorrect),
  };
}

/**
 * Turns placement answers into starting mastery for each skill, using the same BKT
 * update the lesson uses. A child who answered a tier 3 question correctly starts that
 * skill higher than one who needed the gentlest rung.
 */
export function seedMasteryFromPlacement(
  answers: PlacementAnswer[],
): Record<string, { pKnown: number; tier: number }> {
  const seed: Record<string, { pKnown: number; tier: number }> = {};

  for (const answer of answers) {
    const existing = seed[answer.skillId];
    const prior = existing ? existing.pKnown : DEFAULT_BKT_PARAMS.pInit;
    const update = updatePKnown(prior, answer.isCorrect);
    seed[answer.skillId] = { pKnown: update.newPKnown, tier: update.recommendedTier };
  }

  return seed;
}

/** Levels a result unlocks: the starting level and everything up to it. */
export function levelsToUnlock(startingLevelId: string, sequence: string[]): string[] {
  const index = sequence.indexOf(startingLevelId);
  if (index <= 0) return sequence.slice(0, 1);
  return sequence.slice(0, index + 1);
}

/**
 * Warm summary line. Names the level, never a score, and reassures either way.
 * (features.md A2 asks for "Moyin found a good place to start".)
 */
export function placementHeadline(startingLevelTitle: string): string {
  return `Moyin found a good place to start: ${startingLevelTitle}.`;
}
