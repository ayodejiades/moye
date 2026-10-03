"use client";

import { useState } from "react";
import { useMoyeStore } from "@/lib/moye-store";
import {
  ENERGY_LEVELS,
  planForEnergy,
  energyGreeting,
  type EnergyLevel,
} from "@/lib/energy";
import { MoyinMascot } from "@/components/moyin-mascot";

const PATH_SKILLS = ["count-within-10", "money-simple", "place-value-tens", "shapes-geometry"];

const STORAGE_KEY = "moye_energy_checkin";

/**
 * How is your energy right now? (features.md B10)
 *
 * Three buttons, no score, no timer, and it can be skipped. Nothing leaves the device:
 * the answer only shapes which questions come next.
 */
export function EnergyCheckIn({ onStart }: { onStart: (energy: EnergyLevel) => void }) {
  const { state } = useMoyeStore();
  const [chosen, setChosen] = useState<EnergyLevel | null>(null);

  const plan = chosen ? planForEnergy(chosen, PATH_SKILLS, state.skillMastery) : null;

  function begin() {
    if (!chosen) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ energy: chosen, at: Date.now() }));
    } catch {
      // Storage is a bonus here: the session works without remembering the answer.
    }
    onStart(chosen);
  }

  return (
    <section
      aria-labelledby="energy-heading"
      data-demo="energy-checkin"
      className="w-full max-w-2xl bg-white border-2 border-[var(--border)] rounded-2xl p-6 flex flex-col gap-4"
    >
      <div className="flex items-center gap-4">
        <MoyinMascot pose={chosen === "tired" ? "sleepy" : "smile"} size={72} />
        <div>
          <h2 id="energy-heading" className="text-lg font-bold text-[var(--plum-900)]">
            How is your energy right now?
          </h2>
          <p className="text-sm text-[var(--fg-muted)] mt-1">
            This only changes what comes next. There is no wrong answer and nothing is saved off this device.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {ENERGY_LEVELS.map((level) => {
          const selected = chosen === level.id;
          return (
            <button
              key={level.id}
              type="button"
              data-demo={`energy-${level.id}`}
              aria-pressed={selected}
              onClick={() => setChosen(level.id)}
              className={`text-left rounded-xl border-2 p-3 transition-colors ${
                selected
                  ? "bg-[var(--plum-100)] border-[var(--plum-700)]"
                  : "bg-white border-[var(--border)] hover:bg-[var(--paper)]"
              }`}
            >
              <span className="block text-base font-bold text-[var(--plum-900)]">{level.label}</span>
              <span className="block text-sm text-[var(--fg-muted)] mt-0.5">{level.blurb}</span>
            </button>
          );
        })}
      </div>

      {plan && chosen && (
        <p className="text-sm text-[var(--plum-900)] font-semibold">
          {energyGreeting(state.activeProfileName, chosen)}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          data-demo="energy-continue"
          disabled={!chosen}
          onClick={begin}
          className={`btn-3d btn-3d-plum text-base ${chosen ? "" : "opacity-50 cursor-not-allowed"}`}
        >
          Start the session
        </button>
        <button
          type="button"
          onClick={() => onStart("okay")}
          className="text-sm font-semibold text-[var(--plum-700)] hover:underline min-h-11 inline-flex items-center"
        >
          Skip, start from the beginning
        </button>
      </div>
    </section>
  );
}
