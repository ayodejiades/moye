/**
 * Worked example, then fade (features.md B5, SPEC.md 6.4).
 *
 * A child meeting a new skill gets one solved example first, read aloud, with the steps
 * visible. On later tiers the steps are taken away. The scaffolding is withdrawn as the
 * child gets closer to the skill, never as a punishment for a wrong answer.
 *
 * Pure functions, so "which scaffold does this question get" has one answer that the
 * tests pin down.
 */

/** Tiers that still get the full worked steps. */
export const SUPPORTED_TIERS: readonly number[] = [1];
/** Tier that gets the steps hidden but the example prompt still read aloud. */
export const PROMPT_ONLY_TIER = 2;

/** How much help a question should carry. */
export type ScaffoldLevel = "full" | "prompt-only" | "none";

export interface WorkedStep {
  /** Short label for the step, e.g. "Start with 4". */
  label: string;
}

export interface WorkedExample {
  /** The question, already rendered through the theme and locale. */
  prompt: string;
  /** Text for read aloud, written so a child can follow it without seeing the screen. */
  readAloud: string;
  /** The steps, empty once the scaffolding is faded out. */
  steps: WorkedStep[];
  /** The answer, revealed as worked rather than as a score. */
  answer: string;
}

export interface ScaffoldPlan {
  level: ScaffoldLevel;
  example: WorkedExample | null;
}

/**
 * Picks the question to work through as the example.
 *
 * It must be a DIFFERENT question from the one the child is about to answer. Showing the
 * solved version of the very same question gives the answer away and turns the "try one"
 * into copying. Same skill, so the idea carries over; a different id, so the answer does
 * not. Prefers the question furthest from the current one so the child is least likely to
 * see it again soon. Returns null when the skill has no second question, in which case no
 * example is shown at all (better none than a leaked answer).
 */
export function pickExampleSource<T extends { id: string; skillId: string; tier: number }>(
  questions: readonly T[],
  current: { id: string; skillId: string; tier: number },
): T | null {
  const others = questions.filter((q) => q.skillId === current.skillId && q.id !== current.id);
  if (others.length === 0) return null;
  const sameOrEasier = others.filter((q) => q.tier <= current.tier);
  const pool = sameOrEasier.length > 0 ? sameOrEasier : others;
  return pool[pool.length - 1];
}

/**
 * Chooses the scaffold for a question.
 *
 * The worked example is only ever shown for the first time a child meets a skill at a
 * supported tier. `alreadySeenSkill` is what makes it fade: once the child has worked
 * through the example for this skill, later questions carry no steps.
 */
export function scaffoldForQuestion(input: {
  tier: number;
  prompt: string;
  readAloud: string;
  answer: string;
  hint: string;
  /** Has this child already been shown the worked example for this skill? */
  alreadySeenSkill: boolean;
}): ScaffoldPlan {
  const steps = buildSteps(input.hint);

  if (input.alreadySeenSkill) {
    // Faded: the question stands on its own, the hint stays one tap away.
    return { level: input.tier <= PROMPT_ONLY_TIER ? "prompt-only" : "none", example: null };
  }

  if (input.tier <= SUPPORTED_TIERS[SUPPORTED_TIERS.length - 1]) {
    return {
      level: "full",
      example: {
        prompt: input.prompt,
        readAloud: input.readAloud,
        steps,
        answer: input.answer,
      },
    };
  }

  return { level: "none", example: null };
}

/**
 * Turns a hint sentence into separate steps.
 *
 * The hints in the lesson bank are written as instructions ("Start with 4, then count up
 * two more: 5, 6!"), so splitting on the natural separators gives a child-sized step
 * list. If a hint has no separator, it is shown whole rather than mangled.
 */
export function buildSteps(hint: string): WorkedStep[] {
  const trimmed = hint.trim();
  if (!trimmed) return [];

  const parts = trimmed
    .split(/,\s*(?:then\s+)?|\s+then\s+|:/i)
    .map((part) => part.replace(/!\s*$/, "").trim())
    .filter((part) => part.length > 0);

  if (parts.length <= 1) return [{ label: trimmed.replace(/!\s*$/, "") }];
  return parts.map((label) => ({ label }));
}

/**
 * One warm line introducing the example. Never says "this is easy" or implies the
 * child cannot do it alone.
 */
export function exampleIntro(skillTitle: string, isFirst: boolean): string {
  if (isFirst) return `Let us look at one together before you try. This is ${skillTitle}.`;
  return "Here is one more worked through together.";
}

/** Whether the steps panel should be visible at all. */
export function shouldShowSteps(plan: ScaffoldPlan): boolean {
  return plan.level === "full" && plan.example !== null && plan.example.steps.length > 0;
}
