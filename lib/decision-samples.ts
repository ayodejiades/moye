// lib/decision-samples.ts - one place that runs the Moye decision functions on
// fixed sample inputs, so the grown-up console pages show live computed results
// instead of scaffold finance cases. Every number below is computed at request
// time by lib/mastery.ts, lib/honey.ts, and lib/streak.ts - nothing is typed in.
import { updatePKnown } from "./mastery";
import { computeHoneyReward, DEFAULT_HONEY_CONFIG } from "./honey";
import { calculateStreakUpdate } from "./streak";

export const ZONE_LABELS = {
  remedial: "Tier 1 · Extra support",
  "just-right": "Tier 2 · Just right",
  mastered: "Tier 3 · Ready for challenge",
} as const;

export interface DecisionEntry {
  id: string;
  title: string;
  summary: string;
  meta: string;
}

const STREAK_SAMPLE_START = {
  sparkCount: 3,
  freezes: 1,
  restTokens: 1,
  lastActiveDate: "2026-10-01",
  message: "",
};

export function getDecisionSamples(): DecisionEntry[] {
  const mastery = updatePKnown(0.25, true);
  const honey = computeHoneyReward(18, 42);
  const streak = calculateStreakUpdate(STREAK_SAMPLE_START, "2026-10-02");

  return [
    {
      id: "DEC-MASTERY",
      title: "Mastery update · correct answer from 0.25",
      summary: `Mastery moved from 25% to ${(mastery.newPKnown * 100).toFixed(2)}% after one correct answer.`,
      meta: `Tier ${mastery.recommendedTier} of 3 · ${ZONE_LABELS[mastery.zone]}`,
    },
    {
      id: "DEC-HONEY",
      title: `Honey grant · lesson reward at 18 of ${DEFAULT_HONEY_CONFIG.dailyCap}`,
      summary: `Granted ${honey.amount} ${honey.dropType} drops for a running total of ${honey.newDailyTotal}.`,
      meta: honey.hitDailyCap
        ? "Daily cap reached · Done for today"
        : `${DEFAULT_HONEY_CONFIG.dailyCap - honey.newDailyTotal} drops left today`,
    },
    {
      id: "DEC-STREAK",
      title: "Spark update · learning day after 2026-10-01",
      summary: streak.message,
      meta: `Spark ${streak.sparkCount} days · ${streak.restTokens} rest tokens left`,
    },
  ];
}
