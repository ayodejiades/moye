/**
 * Spaced review of skills that need another look (features.md B4, SPEC.md 5.4).
 *
 * Two plain reasons a skill comes back for practice:
 *   1. It slipped: p_known fell below WEAK_THRESHOLD.
 *   2. It has been quiet: no attempt recorded for STALE_DAYS days.
 *
 * Deliberately calm. There is no streak pressure here, no red, and no countdown. The
 * scheduler only decides *what is worth revisiting*, never whether a child is a failure
 * at it. Everything is a pure function of (mastery, attempts, today) so the same input
 * always gives the same plan and the tests can pin dates.
 */

/** Below this, a skill is worth another gentle look. */
export const WEAK_THRESHOLD = 0.5;

/** No attempt for this many days and the skill is offered again. */
export const STALE_DAYS = 7;

/** How often the same skill may come back, so a hard skill never dominates a session. */
export const MAX_REVIEWS_PER_SKILL = 2;

export interface MasteryRecord {
  pKnown: number;
  tier: number;
}

export interface AttemptStamp {
  skillId: string;
  /** Attempt timestamps in milliseconds. */
  timestamps: number[];
}

export type ReviewReason = "slipped" | "quiet";

export interface ReviewCandidate {
  skillId: string;
  reason: ReviewReason;
  pKnown: number;
  tier: number;
  /** Whole days since the last attempt, or null when the skill was never tried. */
  daysSinceLastAttempt: number | null;
  /** Higher sorts first. How badly the skill needs another look. */
  priority: number;
}

const MS_PER_DAY = 86_400_000;

/** Days between two instants, counted as whole days and never negative. */
export function daysBetween(fromMs: number, toMs: number): number {
  if (!Number.isFinite(fromMs) || !Number.isFinite(toMs)) return 0;
  return Math.max(0, Math.floor((toMs - fromMs) / MS_PER_DAY));
}

function lastAttemptFor(attempts: AttemptStamp[], skillId: string): number | null {
  let latest: number | null = null;
  for (const attempt of attempts) {
    if (attempt.skillId !== skillId) continue;
    for (const t of attempt.timestamps) {
      if (!Number.isFinite(t)) continue;
      if (latest === null || t > latest) latest = t;
    }
  }
  return latest;
}

/**
 * Works out which skills are worth another look.
 *
 * `todayMs` is passed in rather than read from the clock so a test can pin the date and
 * get the same answer every run. A skill is offered when it slipped, when it has gone
 * quiet, or both; when both apply the slip wins, because a skill the child just got
 * wrong matters more than an old one.
 */
export function selectReviewSkills(
  mastery: Record<string, MasteryRecord>,
  attempts: AttemptStamp[],
  todayMs: number,
  limit = 3,
): ReviewCandidate[] {
  const candidates: ReviewCandidate[] = [];

  for (const [skillId, record] of Object.entries(mastery)) {
    const pKnown = Number.isFinite(record?.pKnown) ? record.pKnown : 0;
    const tier = Number.isFinite(record?.tier) ? record.tier : 1;

    const last = lastAttemptFor(attempts, skillId);
    const daysSinceLastAttempt = last === null ? null : daysBetween(last, todayMs);

    const slipped = pKnown < WEAK_THRESHOLD;
    // A never tried skill is not "quiet": it simply has not been met yet, and the
    // placement and the learning path introduce it in their own time.
    const quiet = daysSinceLastAttempt !== null && daysSinceLastAttempt >= STALE_DAYS;

    if (!slipped && !quiet) continue;

    const reason: ReviewReason = slipped ? "slipped" : "quiet";
    // Slipping outranks going quiet, and within each, the further from learned, the
    // sooner it comes back. A long quiet gap nudges it up a little.
    const priority = (slipped ? 100 : 50) + (1 - pKnown) * 10 + (daysSinceLastAttempt ?? 0) * 0.5;

    candidates.push({ skillId, reason, pKnown, tier, daysSinceLastAttempt, priority });
  }

  candidates.sort((a, b) => b.priority - a.priority || a.skillId.localeCompare(b.skillId));

  const countPerSkill = new Map<string, number>();
  const plan: ReviewCandidate[] = [];
  for (const candidate of candidates) {
    const used = countPerSkill.get(candidate.skillId) ?? 0;
    if (used >= MAX_REVIEWS_PER_SKILL) continue;
    countPerSkill.set(candidate.skillId, used + 1);
    plan.push(candidate);
    if (plan.length >= limit) break;
  }
  return plan;
}

/**
 * One calm sentence for the card. Never says the child failed, never mentions a streak.
 */
export function reviewReasonPhrase(candidate: ReviewCandidate): string {
  return candidate.reason === "slipped"
    ? "Moyin remembered something we can practise"
    : "Moyin saved this one for another day";
}

/**
 * Warm summary line for the placement result (features.md A2). Names the level the
 * child starts on without scoring them.
 */
export function placementSummary(startingLevelId: string, levelTitle: string, skillsMeasured: number): string {
  return `Moyin found a good place to start: ${levelTitle}. Checked across ${skillsMeasured} skill${skillsMeasured === 1 ? "" : "s"}.`;
}
