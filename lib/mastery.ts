/**
 * Adaptive Difficulty & Mastery Model (SPEC.md §5.2)
 *
 * Implements Bayesian Knowledge Tracing (BKT) per skill:
 * - p_known: probability the student knows the skill.
 * - p_init: initial prior knowledge.
 * - p_learn: probability of learning the skill during a step.
 * - p_guess: probability of answering correctly despite not knowing.
 * - p_slip: probability of answering incorrectly despite knowing.
 *
 * Difficulty zone targeting: "just right" target is p_known in [0.6, 0.85].
 * Tier 1: p_known < 0.6 (scaffolding / foundational)
 * Tier 2: 0.6 <= p_known <= 0.85 (just right target)
 * Tier 3: p_known > 0.85 (mastery / challenge)
 */

export interface BKTParameters {
  pInit: number;
  pLearn: number;
  pSlip: number;
  pGuess: number;
}

export const DEFAULT_BKT_PARAMS: BKTParameters = {
  pInit: 0.15,
  pLearn: 0.25,
  pSlip: 0.10,
  pGuess: 0.25,
};

export interface MasteryUpdateResult {
  previousPKnown: number;
  newPKnown: number;
  recommendedTier: 1 | 2 | 3;
  zone: "remedial" | "just-right" | "mastered";
}

/**
 * Calculates updated p_known after an observation (correct/incorrect)
 * using standard Bayesian Knowledge Tracing formulas.
 *
 * Inputs are sanitized, not trusted: a non-finite p_known falls back to the
 * prior (there is no observation to update from), a finite one is clamped to
 * [0, 1], and any out-of-range BKT parameter falls back to its default. Without
 * this, NaN flows straight through to newPKnown and the UI renders "NaN%".
 */
export function updatePKnown(
  pKnown: number,
  isCorrect: boolean,
  params: BKTParameters = DEFAULT_BKT_PARAMS
): MasteryUpdateResult {
  const prior = Number.isFinite(pKnown) ? Math.max(0, Math.min(1, pKnown)) : DEFAULT_BKT_PARAMS.pInit;
  const safeParams: BKTParameters = {
    pInit: validUnit(params.pInit, DEFAULT_BKT_PARAMS.pInit),
    pLearn: validUnit(params.pLearn, DEFAULT_BKT_PARAMS.pLearn),
    pSlip: validUnit(params.pSlip, DEFAULT_BKT_PARAMS.pSlip),
    pGuess: validUnit(params.pGuess, DEFAULT_BKT_PARAMS.pGuess),
  };
  const { pLearn, pSlip, pGuess } = safeParams;

  let posterior: number;
  if (isCorrect) {
    // P(L | C) = [P(L) * (1 - P(S))] / [P(L) * (1 - P(S)) + (1 - P(L)) * P(G)]
    const numerator = prior * (1 - pSlip);
    const denominator = numerator + (1 - prior) * pGuess;
    posterior = denominator > 0 ? numerator / denominator : prior;
  } else {
    // P(L | ~C) = [P(L) * P(S)] / [P(L) * P(S) + (1 - P(L)) * (1 - P(G))]
    const numerator = prior * pSlip;
    const denominator = numerator + (1 - prior) * (1 - pGuess);
    posterior = denominator > 0 ? numerator / denominator : prior;
  }

  // Knowledge transition: P(L_t+1) = posterior + (1 - posterior) * pLearn
  const updated = posterior + (1 - posterior) * pLearn;
  const clamped = Math.max(0.01, Math.min(0.99, Number(updated.toFixed(4))));

  let recommendedTier: 1 | 2 | 3 = 2;
  let zone: "remedial" | "just-right" | "mastered" = "just-right";

  if (clamped < 0.60) {
    recommendedTier = 1;
    zone = "remedial";
  } else if (clamped <= 0.85) {
    recommendedTier = 2;
    zone = "just-right";
  } else {
    recommendedTier = 3;
    zone = "mastered";
  }

  return {
    previousPKnown: prior,
    newPKnown: clamped,
    recommendedTier,
    zone,
  };
}

/** A BKT probability is only meaningful as a finite number in [0, 1]. */
function validUnit(value: number, fallback: number): number {
  return Number.isFinite(value) && value >= 0 && value <= 1 ? value : fallback;
}

/**
 * Simulates a student sequence of answers to verify convergence.
 */
export function simulateStudentTrace(
  startPKnown: number,
  answers: boolean[],
  params: BKTParameters = DEFAULT_BKT_PARAMS
): MasteryUpdateResult[] {
  const history: MasteryUpdateResult[] = [];
  let currentP = startPKnown;

  for (const ans of answers) {
    const result = updatePKnown(currentP, ans, params);
    history.push(result);
    currentP = result.newPKnown;
  }

  return history;
}
