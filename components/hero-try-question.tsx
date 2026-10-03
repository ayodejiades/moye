"use client";

import { useState } from "react";
import { LEVEL_BANKS } from "@/lib/lesson-bank";
import { renderQuestion } from "@/lib/theme-resolver";
import { updatePKnown } from "@/lib/mastery";
import { MoyinMascot, type MoyinPose } from "@/components/moyin-mascot";
import { SpeakerIcon, CheckIcon, RetryIcon, HoneyDropIcon } from "@/components/ui/svg-icons";

/**
 * One real question a visitor can actually answer, right on the landing page
 * (features.md C1). This is the whole product in about five seconds:
 *
 *   right answer  -> a honey drop appears and Moyin cheers
 *   wrong answer  -> a gentle hint and Moyin thinks
 *
 * The question is a committed bank question rendered by the real resolver, and the
 * difficulty number moves with the real BKT update. Nothing here is a mock, and the
 * child is never told they failed.
 */

// A tier 1 counting question, so a first time visitor meets something gentle.
const QUESTION = LEVEL_BANKS.s1[0];

export function HeroTryQuestion() {
  const [themeId, localeId] = ["dinosaurs", "en-NG"] as const;
  const question = renderQuestion(QUESTION, themeId, localeId);
  const [picked, setPicked] = useState<string | null>(null);
  const [pKnown, setPKnown] = useState(0.3);

  const isCorrect = picked !== null && question.options.find((o) => o.id === picked)?.isCorrect === true;
  const answered = picked !== null;
  const pose: MoyinPose = !answered ? "smile" : isCorrect ? "cheer" : "think";
  const answer = question.options.find((o) => o.isCorrect)?.text ?? "";

  function choose(id: string) {
    // A visitor can keep trying until they get it right. There is no lock out and no
    // penalty for changing their mind: the only thing a slip changes is the hint.
    if (isCorrect) return;
    setPicked(id);
    setPKnown((p) => updatePKnown(p, question.options.find((o) => o.id === id)?.isCorrect ?? false).newPKnown);
  }

  function startAgain() {
    setPicked(null);
    setPKnown(0.3);
  }

  return (
    <section
      aria-labelledby="hero-try-heading"
      data-demo="hero-try"
      className="w-full max-w-xl bg-white border-2 border-[var(--border)] rounded-3xl p-5 sm:p-6 flex flex-col gap-4 text-left shadow-[0_8px_20px_rgba(42,27,77,0.06)]"
    >
      <div className="flex items-start gap-3">
        <MoyinMascot pose={pose} size={64} />
        <div className="flex-1">
          <h2 id="hero-try-heading" className="text-base font-bold text-[var(--plum-900)]">
            Try one question
          </h2>
          <p className="text-sm text-[var(--fg-muted)] mt-0.5">
            A real Moye question. No timer, and a slip only ever gets a hint.
          </p>
        </div>
      </div>

      <div className="flex items-start justify-between gap-3">
        <p className="text-lg font-bold text-[var(--plum-900)] text-pretty">{question.prompt}</p>
        <button
          type="button"
          data-demo="hero-try-read"
          onClick={() => {
            if (!("speechSynthesis" in window)) return;
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(question.readAloud);
            utterance.rate = 0.9;
            window.speechSynthesis.speak(utterance);
          }}
          aria-label="Read this question aloud"
          className="btn-3d btn-3d-card btn-3d-header shrink-0"
        >
          <SpeakerIcon size={16} />
        </button>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {question.options.map((opt) => {
          const selected = picked === opt.id;
          const cls = selected
            ? opt.isCorrect
              ? "bg-[var(--teal-500)] border-[var(--teal-700)] shadow-[0_3px_0_var(--teal-700)] text-white"
              : "bg-[var(--rose-400)] border-[var(--rose-400)] shadow-[0_3px_0_var(--plum-700)] text-[var(--plum-900)]"
            : "bg-[var(--paper)] border-[var(--border)] shadow-[0_3px_0_var(--border)] text-[var(--plum-900)]";
          return (
            <button
              key={opt.id}
              type="button"
              data-demo={opt.isCorrect ? "hero-try-right" : "hero-try-wrong"}
              aria-pressed={selected}
              onClick={() => choose(opt.id)}
              className={`h-12 rounded-xl border-2 font-bold transition-transform active:translate-y-1 ${cls}`}
            >
              {opt.text}
            </button>
          );
        })}
      </div>

      {/* Announced, and gentle either way. */}
      <div aria-live="polite" className="min-h-12">
        {!answered && (
          <p className="text-sm text-[var(--fg-muted)]">Tap an answer. Moyin will help either way.</p>
        )}
        {answered && isCorrect && (
          <button
            type="button"
            data-demo="hero-try-again"
            onClick={startAgain}
            className="text-sm font-semibold text-[var(--plum-700)] hover:underline min-h-11 inline-flex items-center"
          >
            Try another one
          </button>
        )}
        {answered && isCorrect && (
          <div className="pop-in flex items-center gap-2 text-sm font-bold text-[var(--teal-700)] bg-[var(--plum-100)] px-3 py-2 rounded-xl">
            <CheckIcon size={18} />
            <span>
              {answer} is right. Here is a honey drop.
            </span>
            <HoneyDropIcon size={16} />
          </div>
        )}
        {answered && !isCorrect && (
          <div className="pop-in text-sm font-bold text-[var(--plum-900)] bg-[var(--paper)] border border-[var(--rose-400)] px-3 py-2 rounded-xl flex items-start gap-2">
            <RetryIcon size={18} className="shrink-0 mt-0.5" />
            <span className="text-pretty">Almost. Here is a hint: {question.hint}</span>
          </div>
        )}
      </div>

      {answered && (
        <p className="text-xs text-[var(--fg-muted)]">
          Moyin now thinks this skill is {pKnown.toFixed(2)} learned.
        </p>
      )}
    </section>
  );
}
