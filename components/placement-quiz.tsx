"use client";

import { useState } from "react";
import { renderQuestion } from "@/lib/theme-resolver";
import {
  getPlacementQuestions,
  scorePlacement,
  placementHeadline,
  type PlacementAnswer,
} from "@/lib/placement";
import { useMoyeStore } from "@/lib/moye-store";
import { LEVEL_SEQUENCE } from "@/lib/moye-store";
import { MoyinMascot } from "@/components/moyin-mascot";
import { CheckIcon, SpeakerIcon } from "@/components/ui/svg-icons";
import { retainUtterance } from "@/lib/multilingual-voice";

/**
 * Six questions to find a real starting point (features.md A2, SPEC.md 6.2).
 *
 * One question at a time, no timer, a gentle hint on a slip, and a skip that starts the
 * child at the beginning. The result seeds the same mastery estimator the lesson uses.
 */
export function PlacementQuiz({
  themeId,
  onFinish,
  onSkip,
}: {
  themeId: string;
  onFinish: (result: ReturnType<typeof scorePlacement>) => void;
  onSkip: () => void;
}) {
  const { state, updateSkillMastery } = useMoyeStore();
  const questions = getPlacementQuestions();
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<PlacementAnswer[]>([]);
  const [picked, setPicked] = useState<string | null>(null);

  const question = questions[index];
  if (!question) return null;

  const rendered = renderQuestion(question, themeId, state.selectedCurriculum);
  const answered = picked !== null;

  function choose(optionId: string) {
    if (answered) return;
    setPicked(optionId);
    const option = rendered.options.find((o) => o.id === optionId);
    const isCorrect = Boolean(option?.isCorrect);
    const next: PlacementAnswer[] = [
      ...answers,
      { questionId: question.id, skillId: question.skillId, tier: question.tier, isCorrect },
    ];
    setAnswers(next);

    window.setTimeout(() => {
      setPicked(null);
      if (index + 1 < questions.length) {
        setIndex(index + 1);
      } else {
        const result = scorePlacement(next);
        for (const [skillId, value] of Object.entries(result.masterySeed)) {
          updateSkillMastery(skillId, value.pKnown, value.tier);
        }
        onFinish(result);
      }
    }, isCorrect ? 900 : 1600);
  }

  return (
    <section
      aria-labelledby="placement-heading"
      data-demo="placement-quiz"
      className="w-full max-w-2xl bg-white border-2 border-[var(--border)] rounded-2xl p-6 flex flex-col gap-4"
    >
      <div className="flex items-center gap-4">
        <MoyinMascot pose={answered && !picked ? "cheer" : "smile"} size={64} />
        <div className="flex-1">
          <h2 id="placement-heading" className="text-lg font-bold text-[var(--plum-900)]">
            Let us find the right starting point
          </h2>
          <p className="text-sm text-[var(--fg-muted)] mt-1">
            {questions.length} short questions. No timer, and you can skip this.
          </p>
        </div>
        <span className="text-sm font-bold text-[var(--plum-700)] shrink-0">
          {index + 1} of {questions.length}
        </span>
      </div>

      {/* Progress: how far through, not how well doing */}
      <div className="w-full h-2 bg-[var(--plum-100)] overflow-hidden" role="presentation">
        <div
          className="h-full bg-[var(--teal-500)] transition-transform duration-300 origin-left"
          style={{ transform: `scaleX(${index / questions.length})` }}
        />
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg font-bold text-[var(--plum-900)] text-pretty">{rendered.prompt}</h3>
          <button
            type="button"
            data-demo="read-aloud"
            onClick={() => {
              if (!("speechSynthesis" in window)) return;
              window.speechSynthesis.cancel();
              const u = new SpeechSynthesisUtterance(rendered.readAloud);
              retainUtterance(u);
              u.rate = 0.9;
              window.speechSynthesis.speak(u);
            }}
            aria-label="Read this question aloud"
            className="btn-3d btn-3d-card btn-3d-header shrink-0"
          >
            <SpeakerIcon size={16} />
          </button>
        </div>

        <div className="flex flex-col gap-2">
          {rendered.options.map((option, i) => {
            const isPicked = picked === option.id;
            const showRight = answered && option.isCorrect;
            const showWrong = answered && isPicked && !option.isCorrect;
            return (
              <button
                key={option.id}
                type="button"
                data-demo={option.isCorrect ? "answer-right" : "answer-wrong"}
                aria-pressed={isPicked}
                disabled={answered}
                onClick={() => choose(option.id)}
                className={`text-left rounded-xl border-2 p-3 font-bold transition-colors ${
                  showRight
                    ? "bg-[var(--teal-500)] border-[var(--teal-700)] text-white"
                    : showWrong
                      ? "bg-[var(--paper)] border-[var(--rose-400)] text-[var(--plum-900)]"
                      : "bg-white border-[var(--border)] text-[var(--plum-900)] hover:bg-[var(--paper)]"
                }`}
              >
                <span className="flex items-center gap-2">
                  <span className="font-mono text-sm">{i + 1}</span>
                  <span>{option.text}</span>
                  {showRight && <CheckIcon size={16} className="ml-auto" />}
                </span>
              </button>
            );
          })}
        </div>

        {/* A slip gets a hint, never a buzzer */}
        {answered && !picked && (
          <p className="text-sm text-[var(--plum-900)] font-semibold" role="status">
            {rendered.options.some((o) => o.id === picked && o.isCorrect)
              ? "That is right. Moyin is pleased."
              : `Almost. Here is a hint: ${rendered.hint}`}
          </p>
        )}
      </div>

      <button
        type="button"
        onClick={onSkip}
        className="text-sm font-semibold text-[var(--plum-700)] hover:underline min-h-11 inline-flex items-center self-start"
      >
        Skip, start from the beginning
      </button>
    </section>
  );
}

/** Warm summary shown once placement is done. */
export function PlacementSummary({
  result,
  onContinue,
}: {
  result: ReturnType<typeof scorePlacement>;
  onContinue: () => void;
}) {
  return (
    <section
      aria-labelledby="placement-result-heading"
      data-demo="placement-result"
      className="w-full max-w-2xl bg-white border-2 border-[var(--border)] rounded-2xl p-6 flex flex-col gap-4"
    >
      <div className="flex items-center gap-4">
        <MoyinMascot pose="cheer" size={72} />
        <div>
          <h2 id="placement-result-heading" className="text-lg font-bold text-[var(--plum-900)]">
            {placementHeadline(result.startingLevelTitle)}
          </h2>
          <p className="text-sm text-[var(--fg-muted)] mt-1">
            Checked across {result.skillsMeasured} skill{result.skillsMeasured === 1 ? "" : "s"}. We will start at the
            level that feels right, and it moves as you learn.
          </p>
        </div>
      </div>
      <button type="button" data-demo="placement-continue" onClick={onContinue} className="btn-3d btn-3d-plum text-base self-start">
        Start learning
      </button>
    </section>
  );
}

export { LEVEL_SEQUENCE };
