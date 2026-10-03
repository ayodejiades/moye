"use client";

import { useMemo, useState } from "react";
import { useMoyeStore } from "@/lib/moye-store";
import { selectReviewSkills, reviewReasonPhrase, type ReviewCandidate } from "@/lib/review";

/**
 * One calm card offering a short review of something worth another look (features.md B4).
 * No streak, no red, no countdown. If nothing is due the card renders nothing at all.
 */
export function ReviewCard({ onStart }: { onStart: (skillId: string, levelId: string) => void }) {
  const { state } = useMoyeStore();
  // Read the clock in the lazy initialiser, so it is sampled once on mount and never
  // again. Calling Date.now() in the memo body would make the output depend on when
  // React happened to re-render. The store is client only, so there is no server render
  // to mismatch against.
  const [today] = useState(() => Date.now());

  const plan = useMemo<ReviewCandidate[]>(() => {
    if (state.attemptLogs.length === 0 && Object.keys(state.skillMastery).length === 0) return [];
    // Group the attempt log by skill so the scheduler sees one entry per skill.
    const bySkill = new Map<string, number[]>();
    for (const attempt of state.attemptLogs) {
      const list = bySkill.get(attempt.skillId) ?? [];
      list.push(attempt.timestamp);
      bySkill.set(attempt.skillId, list);
    }
    return selectReviewSkills(
      state.skillMastery,
      [...bySkill.entries()].map(([skillId, timestamps]) => ({ skillId, timestamps })),
      today,
      3,
    );
  }, [state.skillMastery, state.attemptLogs, today]);

  // Nothing due: show nothing rather than inventing a suggestion.
  if (plan.length === 0) return null;

  // The review re-serves the skill's own level, so the child stays where they were.
  const levelForSkill = (skillId: string): string => {
    if (skillId === "money-simple") return "s2";
    if (skillId === "place-value-tens") return "s3";
    if (skillId === "shapes-geometry") return "s4";
    return "s1";
  };

  return (
    <section
      aria-labelledby="review-heading"
      className="w-full max-w-2xl bg-[var(--paper)] border-2 border-[var(--border)] rounded-2xl p-4 flex flex-col gap-3"
    >
      <div>
        <h2 id="review-heading" className="text-base font-bold text-[var(--plum-900)]">
          Something worth another look
        </h2>
        <p className="text-sm text-[var(--fg-muted)] mt-1">
          Moyin kept {plan.length === 1 ? "one thing" : `${plan.length} things`} for you. No hurry.
        </p>
      </div>
      <ul className="flex flex-col gap-2">
        {plan.map((candidate) => (
          <li key={candidate.skillId}>
            <button
              type="button"
              data-demo={`review-${candidate.skillId}`}
              onClick={() => onStart(candidate.skillId, levelForSkill(candidate.skillId))}
              className="w-full text-left bg-white border-2 border-[var(--border)] rounded-xl p-3 flex items-center justify-between gap-3 transition-colors hover:bg-[var(--plum-100)]"
            >
              <span>
                <span className="block text-sm font-bold text-[var(--plum-900)]">
                  {reviewReasonPhrase(candidate)}
                </span>
                <span className="block text-xs text-[var(--fg-muted)] mt-0.5">
                  {candidate.reason === "slipped"
                    ? "We can take it slowly together."
                    : candidate.daysSinceLastAttempt !== null
                      ? `Last practised ${candidate.daysSinceLastAttempt} days ago.`
                      : "Ready when you are."}
                </span>
              </span>
              <span className="text-xs font-bold text-[var(--plum-700)] shrink-0">Practise</span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
