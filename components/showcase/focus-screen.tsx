"use client";

import { HoneyDropIcon, SpeakerIcon, CheckIcon, RetryIcon, DinosaurIcon } from "@/components/ui/svg-icons";
import { MoyinMascot } from "@/components/moyin-mascot";
import { step } from "./step";

/**
 * The Focus tab screen. The question comes from the committed lesson bank and is rendered
 * by the real resolver. A slip gets a gentle retry, never a buzzer.
 */
export function FocusScreen({
  countQuestion,
  countPick,
  isSpeaking,
  onReadAloud,
  onPickCount,
}: {
  countQuestion: { prompt: string; options: { id: string; text: string; isCorrect: boolean }[] };
  countPick: string | null;
  isSpeaking: boolean;
  onReadAloud: () => void;
  onPickCount: (id: string) => void;
}) {
  const countAnswer = countQuestion.options.find((o) => o.isCorrect)?.text ?? "";
  const countCorrect = countPick !== null && countQuestion.options.find((o) => o.id === countPick)?.isCorrect === true;
  const pose: "body-double" | "cheer" | "think" =
    countPick === null ? "body-double" : countCorrect ? "cheer" : "think";

  return (
    <div className="p-4 flex-1 flex flex-col justify-between gap-3 overflow-y-auto">
      <div className="flex flex-col gap-2">
        <span className="text-xs font-bold text-[var(--fg-muted)]">Question 1 of 5</span>
        <div className="w-full h-2 bg-[var(--plum-100)] overflow-hidden">
          <div className="h-full bg-[var(--teal-500)] w-[20%]" />
        </div>
      </div>

      <div className="p-3 bg-white rounded-2xl border-2 border-[var(--border)] flex flex-col gap-2">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-bold text-[var(--fg-muted)]">Count and match</span>
          <button
            type="button"
            data-demo="showcase-read-aloud"
            onClick={onReadAloud}
            className={`px-2 py-1 min-h-11 shrink-0 whitespace-nowrap rounded-md border flex items-center gap-1 text-xs font-semibold transition-colors ${
              isSpeaking
                ? "bg-[var(--teal-700)] text-white border-[var(--teal-700)]"
                : "bg-[var(--plum-100)] text-[var(--plum-900)] border-[var(--border)]"
            }`}
          >
            <SpeakerIcon size={12} />
            <span>{isSpeaking ? "Reading" : "Read aloud"}</span>
          </button>
        </div>

        <h4
          key={countQuestion.prompt}
          className="pop-in text-base font-bold text-[var(--plum-900)] leading-tight text-pretty"
        >
          {countQuestion.prompt}
        </h4>

        {/* One shot entrance, 60ms apart. No looping bounce. */}
        <div className="flex items-center justify-center gap-3 py-2 bg-[var(--paper)] rounded-xl border border-[var(--border)]">
          {[0, 1, 2].map((n) => (
            <div key={n} className="pop-in" style={step(n)}>
              <DinosaurIcon size={26} className="text-[var(--teal-700)]" />
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2">
        {countQuestion.options.map((opt) => {
          const isSelected = countPick === opt.id;
          const cls = isSelected
            ? opt.isCorrect
              ? "bg-[var(--teal-500)] border-[var(--teal-700)] shadow-[0_3px_0_var(--teal-700)] text-white"
              : "bg-[var(--rose-400)] border-[var(--rose-400)] shadow-[0_3px_0_var(--plum-700)] text-[var(--plum-900)]"
            : "bg-white border-[var(--border)] shadow-[0_3px_0_var(--border)] text-[var(--plum-900)]";
          return (
            <button
              key={opt.id}
              type="button"
              data-demo={opt.isCorrect ? "showcase-answer-right" : "showcase-answer-wrong"}
              aria-pressed={isSelected}
              onClick={() => onPickCount(opt.id)}
              className={`min-h-12 py-2 px-3 rounded-xl border-2 font-bold text-base leading-tight text-center transition-transform active:translate-y-1 flex items-center justify-center ${cls}`}
            >
              {opt.text}
            </button>
          );
        })}
      </div>

      {/* Feedback is announced, and a wrong answer is gentle: no shake, no buzzer. */}
      <div
        aria-live="polite"
        className="pt-2 border-t border-[var(--border)] flex items-center justify-between gap-2 min-h-12"
      >
        {countPick !== null ? (
          <div className="pop-in flex items-center gap-1 text-xs font-bold bg-[var(--plum-100)] px-2 py-1 rounded-xl text-[var(--plum-900)]">
            {countCorrect ? <CheckIcon size={16} /> : <RetryIcon size={16} />}
            <span>{countCorrect ? `Spot on. ${countAnswer} is right.` : "Almost. Try the other one."}</span>
            {countCorrect && <HoneyDropIcon size={14} />}
          </div>
        ) : (
          <span className="text-xs font-bold text-[var(--fg-muted)]">Tap an answer above to try.</span>
        )}
        <div key={pose} className="pop-in shrink-0">
          <MoyinMascot pose={pose} size={52} />
        </div>
      </div>
    </div>
  );
}
