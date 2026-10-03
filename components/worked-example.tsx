"use client";

import { useState } from "react";
import { exampleIntro, type WorkedExample } from "@/lib/scaffolding";
import { MoyinMascot } from "@/components/moyin-mascot";
import { SpeakerIcon } from "@/components/ui/svg-icons";
import { retainUtterance } from "@/lib/multilingual-voice";

/**
 * One solved example before the child tries alone (features.md B5, SPEC.md 6.4).
 *
 * Read aloud on request, the steps listed one per line, and the answer shown as worked
 * through together. The steps are then taken away for the rest of the skill.
 */
export function WorkedExamplePanel({
  example,
  skillTitle,
  onContinue,
}: {
  example: WorkedExample;
  skillTitle: string;
  onContinue: () => void;
}) {
  const [heard, setHeard] = useState(false);

  function readAloud() {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const script = [example.prompt, ...example.steps.map((s) => s.label), example.answer].join(". ");
    const utterance = new SpeechSynthesisUtterance(script);
    retainUtterance(utterance);
    utterance.rate = 0.88;
    utterance.onstart = () => setHeard(true);
    utterance.onend = () => setHeard(false);
    utterance.onerror = () => setHeard(false);
    window.speechSynthesis.speak(utterance);
  }

  return (
    <section
      aria-labelledby="worked-example-heading"
      data-demo="worked-example"
      className="p-4 rounded-2xl bg-[var(--plum-100)] border-2 border-[var(--plum-500)] flex flex-col gap-3"
    >
      <div className="flex items-start gap-3">
        <MoyinMascot pose="smile" size={48} />
        <div className="flex-1">
          <h3 id="worked-example-heading" className="text-base font-bold text-[var(--plum-900)] text-pretty">
            {exampleIntro(skillTitle, true)}
          </h3>
          <p className="text-sm text-[var(--fg-muted)] mt-1 text-pretty">{example.prompt}</p>
        </div>
        <button
          type="button"
          data-demo="worked-example-read"
          onClick={readAloud}
          aria-label={heard ? "Reading the example aloud" : "Read this example aloud"}
          className="btn-3d btn-3d-card btn-3d-header shrink-0"
        >
          <SpeakerIcon size={16} />
        </button>
      </div>

      {example.steps.length > 0 && (
        <ol className="flex flex-col gap-1 pl-1">
          {example.steps.map((step, i) => (
            <li key={step.label} className="flex items-start gap-2 text-sm text-[var(--plum-900)]">
              <span
                aria-hidden="true"
                className="font-mono text-xs font-bold bg-white border border-[var(--border)] rounded-md w-6 h-6 shrink-0 flex items-center justify-center"
              >
                {i + 1}
              </span>
              <span className="pt-0.5">{step.label}</span>
            </li>
          ))}
        </ol>
      )}

      <p className="text-sm font-bold text-[var(--teal-700)]">So the answer is {example.answer}.</p>

      <button type="button" data-demo="worked-example-continue" onClick={onContinue} className="btn-3d btn-3d-plum text-base self-start">
        Now I will try one
      </button>
    </section>
  );
}
