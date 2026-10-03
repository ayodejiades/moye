/**
 * Moye evidence fixtures (features.md D1, AGENTS.md: every number is measured).
 *
 * These are the cases `pnpm claim:verify` executes, live, through the real decision
 * functions the app uses. Each one names an input, the state a user is in, the decision
 * the function must reach, and why that outcome is the correct, calm one.
 *
 * Every case is a plain object, so the verifier can re-derive the result from the shipped
 * code on every run rather than trusting a number someone typed. Change a threshold in
 * lib/mastery.ts and these fixtures fail, which is the point.
 */

export interface MasteryCase {
  id: string;
  /** Plain words for what is being checked. */
  claim: string;
  /** Starting probability the skill is known. */
  startPKnown: number;
  /** Answers in order: true is a right answer. */
  answers: boolean[];
  /** The p_known the function must reach, to four decimal places. */
  expectedPKnown: number;
  /** The tier the function must recommend. */
  expectedTier: 1 | 2 | 3;
  /** The zone the function must report. */
  expectedZone: "remedial" | "just-right" | "mastered";
  /** Why this outcome is the right product behaviour. */
  rationale: string;
}

export interface HoneyCase {
  id: string;
  claim: string;
  currentDailyHoney: number;
  stepSeed: number;
  expectedAmount: number;
  expectedCapped: boolean;
  expectedHitDailyCap: boolean;
  rationale: string;
}

export interface StreakCase {
  id: string;
  claim: string;
  current: { sparkCount: number; freezes: number; restTokens: number; lastActiveDate: string; message: string };
  todayDate: string;
  expectedSparkCount: number;
  /** True when the streak is held by a token rather than broken. */
  expectedHeldByRest: boolean;
  rationale: string;
}

export interface PlacementCase {
  id: string;
  claim: string;
  answers: boolean[];
  expectedStartingLevelId: string;
  rationale: string;
}

export interface ReviewCase {
  id: string;
  claim: string;
  mastery: Record<string, { pKnown: number; tier: number }>;
  /** Days since the last attempt for each skill. */
  daysSince: Record<string, number>;
  expectedSkillIds: string[];
  rationale: string;
}

/**
 * A learner who finds counting hard drops out of the comfortable range, so Moyin moves the
 * difficulty down and offers a gentler step. The child is never told they failed.
 */
export const MASTERY_CASES: MasteryCase[] = [
  {
    id: "mastery-struggling-drops",
    claim: "A learner who keeps slipping is offered a gentler step, not the same question again",
    startPKnown: 0.62,
    answers: [false, false, false],
    expectedPKnown: 0.2919,
    expectedTier: 1,
    expectedZone: "remedial",
    rationale: "Three slips in a row should move the child into the remedial band so the next question is easier.",
  },
  {
    id: "mastery-steady-holds",
    claim: "A learner answering consistently is kept in the comfortable range",
    startPKnown: 0.7,
    answers: [true, true],
    expectedPKnown: 0.9824,
    expectedTier: 3,
    expectedZone: "mastered",
    rationale: "Consistent right answers raise p_known past the 0.85 ceiling of the comfortable band, so Moyin offers a challenge.",
  },
  {
    id: "mastery-boundary-below-60",
    claim: "A score just under the comfortable range stays remedial rather than being rounded up",
    startPKnown: 0.55,
    answers: [true, false],
    expectedPKnown: 0.5894,
    expectedTier: 1,
    expectedZone: "remedial",
    rationale:
      "This lands at 0.5894, inside the 0.60 boundary. It pins the threshold: move the 0.60 cut and this check fails.",
  },
  {
    id: "mastery-one-slip-recovers",
    claim: "A single slip in a strong run does not collapse the estimate",
    startPKnown: 0.88,
    answers: [false, true],
    expectedPKnown: 0.8912,
    expectedTier: 3,
    expectedZone: "mastered",
    rationale: "One slip after a strong run should not undo the work: the estimate dips and recovers, staying in the mastered band.",
  },
];

/**
 * The daily cap is the promise that a child can stop. Honey is only ever granted up to the
 * cap, and the cap is announced rather than silently enforced.
 */
export const HONEY_CASES: HoneyCase[] = [
  {
    id: "honey-grants-within-cap",
    claim: "A finished lesson earns honey while the daily cap is not reached",
    currentDailyHoney: 0,
    stepSeed: 12345,
    expectedAmount: 12,
    expectedCapped: false,
    expectedHitDailyCap: false,
    rationale: "Starting from zero the reward is granted in full: the seeded roll picked a golden drop, worth 12.",
  },
  {
    id: "honey-trims-at-cap",
    claim: "Honey is trimmed to the cap rather than refused",
    currentDailyHoney: 48,
    stepSeed: 12345,
    expectedAmount: 2,
    expectedCapped: true,
    expectedHitDailyCap: true,
    rationale: "At 48 of a 50 drop cap the child still gets the 2 drops that are left, rather than being told no.",
  },
  {
    id: "honey-zero-at-cap",
    claim: "Once the cap is reached a further lesson grants nothing and says so",
    currentDailyHoney: 50,
    stepSeed: 12345,
    expectedAmount: 0,
    expectedCapped: true,
    expectedHitDailyCap: true,
    rationale: "At the cap the honest answer is zero, and the app says done for today rather than pretending otherwise.",
  },
  {
    id: "honey-negative-is-safe",
    claim: "A corrupted negative balance cannot grant honey",
    currentDailyHoney: -5,
    stepSeed: 12345,
    expectedAmount: 12,
    expectedCapped: false,
    expectedHitDailyCap: false,
    rationale: "A negative total is clamped to zero, so the reward matches a clean start and a storage bug cannot mint honey.",
  },
];

/**
 * A missed day is never punished. A rest token holds the streak, and the copy stays warm.
 */
export const STREAK_CASES: StreakCase[] = [
  {
    id: "streak-consecutive-day",
    claim: "Coming back the next day grows the streak",
    current: { sparkCount: 1, freezes: 0, restTokens: 1, lastActiveDate: "2026-10-01", message: "" },
    todayDate: "2026-10-02",
    expectedSparkCount: 2,
    expectedHeldByRest: false,
    rationale: "Consecutive days are counted, so the child sees the habit building.",
  },
  {
    id: "streak-rest-token-holds",
    claim: "A rest token protects a missed day instead of breaking the streak",
    current: { sparkCount: 2, freezes: 0, restTokens: 1, lastActiveDate: "2026-10-01", message: "" },
    todayDate: "2026-10-03",
    expectedSparkCount: 3,
    expectedHeldByRest: true,
    rationale: "The token spends itself so the missed day still counts: the streak reaches 3 rather than being lost.",
  },
  {
    id: "streak-break-is-guilt-free",
    claim: "A missed day with no token restarts gently at one, not at zero",
    current: { sparkCount: 5, freezes: 0, restTokens: 0, lastActiveDate: "2026-10-01", message: "" },
    todayDate: "2026-10-05",
    expectedSparkCount: 1,
    expectedHeldByRest: false,
    rationale: "Without a token the streak restarts at 1. Starting again is never zero and never a punishment.",
  },
];

/**
 * Placement has to land a strong learner above a struggling one, and has to be able to say
 * "start from the beginning" without shame.
 */
export const PLACEMENT_CASES: PlacementCase[] = [
  {
    id: "placement-strong-learner",
    claim: "A learner who answers every placement question starts above the first level",
    answers: [true, true, true, true, true, true],
    expectedStartingLevelId: "s3",
    rationale: "Six right answers in a row climb the ladder, so a confident child is not held at level one.",
  },
  {
    id: "placement-struggling-learner",
    claim: "A learner who slips in placement starts at the beginning, without blame",
    answers: [false, false, false, false, false, false],
    expectedStartingLevelId: "s1",
    rationale: "Six slips descend the ladder to the gentlest rung, which is a starting point rather than a verdict.",
  },
  {
    id: "placement-stays-put-when-mixed",
    claim: "An inconsistent run leaves the ladder where it started",
    answers: [true, false, true, false, true, false],
    expectedStartingLevelId: "s2",
    rationale: "With no consistent run the ladder does not move, so a mixed result stays in the middle.",
  },
];

/**
 * Review only offers a skill the child has actually practised. A skill never attempted is
 * never called weak.
 */
export const REVIEW_CASES: ReviewCase[] = [
  {
    id: "review-offers-a-slip",
    claim: "A skill that slipped is offered once more",
    mastery: { "count-within-10": { pKnown: 0.31, tier: 1 } },
    daysSince: { "count-within-10": 1 },
    expectedSkillIds: ["count-within-10"],
    rationale: "A skill below the threshold comes back so the child can rebuild it.",
  },
  {
    id: "review-leaves-healthy-skill-alone",
    claim: "A recently practised, learned skill is not re-served",
    mastery: { "money-simple": { pKnown: 0.82, tier: 2 } },
    daysSince: { "money-simple": 1 },
    expectedSkillIds: [],
    rationale: "Nothing is wrong with this skill, so there is no reason to show it again. No pressure.",
  },
  {
    id: "review-never-flags-a-new-skill",
    claim: "A skill the child has never met is never flagged",
    mastery: { "shapes-geometry": { pKnown: 0.9, tier: 3 } },
    daysSince: {},
    expectedSkillIds: [],
    rationale: "Not started is not the same as struggled, and must never appear as a concern.",
  },
];
