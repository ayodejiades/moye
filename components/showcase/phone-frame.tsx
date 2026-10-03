"use client";

import { MoyinMascot } from "@/components/moyin-mascot";
import {
  HoneyDropIcon,
  DuoStreakFlame,
  TargetIcon,
  AcornHatIcon,
  HoneyCrownIcon,
  ScarfIcon,
} from "@/components/ui/svg-icons";

type PhoneFrameProps = {
  children: React.ReactNode;
  bottomNav: React.ReactNode;
  /** Applies the real dyslexia spacing variables inside the device screen only. */
  dyslexic?: boolean;
};

/** The device frame. Status bar decoration is deliberately absent: it is not real UI. */
export function PhoneFrame({ children, bottomNav, dyslexic = false }: PhoneFrameProps) {
  return (
    <div className="relative order-1 lg:order-2 flex flex-col items-center">
      <div className="w-72 sm:w-84 h-[560px] sm:h-[600px] rounded-[3.2rem] bg-white border-[3px] border-[var(--plum-900)] shadow-[0_20px_50px_rgba(42,27,77,0.18),0_4px_0_var(--plum-900)] overflow-hidden relative flex flex-col p-3">
        <div
          className={`w-full flex-1 rounded-[2.4rem] overflow-hidden flex flex-col bg-[var(--paper)] border border-[var(--border)] ${dyslexic ? "dyslexic-mode font-opendyslexic" : ""}`}
        >
          {children}
          {bottomNav}
        </div>
      </div>
    </div>
  );
}

export function PhoneStatusBar({ dyslexicFont, onToggleDyslexic }: { dyslexicFont: boolean; onToggleDyslexic: () => void }) {
  return (
    <div className="px-4 py-3 bg-white border-b border-[var(--border)] flex items-center justify-between gap-2">
      <div className="flex items-center gap-2">
        <span className="text-xs font-bold lowercase text-[var(--plum-900)]">moye</span>
        <span className="text-xs bg-[var(--plum-100)] text-[var(--plum-700)] font-semibold px-2 rounded-md border border-[var(--border)]">
          maths
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className="flex items-center gap-1 text-xs font-semibold text-[var(--honey-700)]">
          <HoneyDropIcon size={14} />
          <span>14</span>
        </span>
        <span className="flex items-center gap-1 text-xs font-semibold text-[var(--plum-700)]">
          <DuoStreakFlame size={14} />
          <span>3d</span>
        </span>
        <button
          type="button"
          onClick={onToggleDyslexic}
          aria-pressed={dyslexicFont}
          className={`text-xs font-semibold px-2 min-h-11 rounded-md border transition-colors ${
            dyslexicFont
              ? "bg-[var(--plum-700)] text-white border-[var(--plum-700)]"
              : "bg-[var(--plum-100)] text-[var(--plum-900)] border-[var(--border)]"
          }`}
        >
          Dyslexia spacing {dyslexicFont ? "on" : "off"}
        </button>
      </div>
    </div>
  );
}

/** TAB 2: difficulty that adapts */
export function MasteryScreen({
  pKnown,
  onCorrect,
  onSlip,
}: {
  pKnown: number;
  onCorrect: () => void;
  onSlip: () => void;
}) {
  return (
    <div className="p-4 flex-1 flex flex-col justify-between gap-3 overflow-y-auto">
      <div className="flex flex-col gap-1">
        <span className="text-xs font-bold text-[var(--fg-muted)]">What Moye is tracking</span>
        <h4 className="text-base font-bold text-[var(--plum-900)]">Active skill: number bonds to 10</h4>
      </div>

      <div className="p-4 bg-white rounded-2xl border-2 border-[var(--border)] flex flex-col gap-3">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-bold text-[var(--fg-muted)]">Chance the skill is learned</span>
          <span className="text-sm font-bold text-[var(--teal-700)]">{pKnown.toFixed(2)}</span>
        </div>

        {/* Width transition replaced with scaleX so the fill animates on the compositor only. */}
        <div className="relative w-full h-4 bg-[var(--plum-100)] border border-[var(--border)]">
          <div className="absolute left-[60%] w-[25%] h-full bg-[var(--plum-500)] opacity-30" />
          <div
            className="h-full w-full origin-left bg-[var(--teal-500)] transition-transform duration-300"
            style={{ transform: `scaleX(${pKnown})` }}
          />
        </div>

        <div className="flex items-center justify-between gap-2 text-xs font-semibold text-[var(--fg-muted)]">
          <span>0.00 new</span>
          <span className="text-[var(--plum-700)]">Comfortable range</span>
          <span>1.00 learned</span>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-xs font-bold text-[var(--fg-muted)]">Try one answer</span>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={onCorrect}
            className="p-3 rounded-xl bg-[var(--plum-100)] border border-[var(--teal-500)] text-[var(--plum-900)] text-sm font-bold transition-colors"
          >
            Correct
          </button>
          <button
            type="button"
            onClick={onSlip}
            className="p-3 rounded-xl bg-[var(--plum-100)] border border-[var(--rose-400)] text-[var(--plum-900)] text-sm font-bold transition-colors"
          >
            Slip
          </button>
        </div>
      </div>

      <div className="p-3 bg-[var(--plum-100)] rounded-xl border border-[var(--border)] text-left">
        <span className="text-xs font-bold text-[var(--plum-700)]">What Moyin does next</span>
        <p aria-live="polite" className="text-sm font-bold text-[var(--plum-900)] mt-1">
          {pKnown >= 0.85
            ? "Learns multi digit bonds next."
            : pKnown <= 0.55
              ? "Adds gentle visual counters with Moyin."
              : "Keeps the question in the comfortable range."}
        </p>
      </div>
    </div>
  );
}

/** TAB 3: hive and cosmetics */
export function HiveScreen({
  hat,
  scarf,
  onHat,
  onScarf,
}: {
  hat: string | null;
  scarf: string | null;
  onHat: (id: string) => void;
  onScarf: (id: string) => void;
}) {
  const items = [
    { label: "Acorn Cap", Icon: AcornHatIcon, active: hat === "hat-acorn", onClick: () => onHat("hat-acorn") },
    {
      label: "Honeycomb Crown",
      Icon: HoneyCrownIcon,
      active: hat === "hat-honey-crown",
      onClick: () => onHat("hat-honey-crown"),
    },
    { label: "Knitted Scarf", Icon: ScarfIcon, active: scarf === "scarf-teal", onClick: () => onScarf("scarf-teal") },
  ];

  return (
    <div className="p-4 flex-1 flex flex-col justify-between gap-3 overflow-y-auto">
      <div className="flex flex-col gap-1">
        <span className="text-xs font-bold text-[var(--fg-muted)]">Cozy hive bedroom</span>
        <h4 className="text-base font-bold text-[var(--plum-900)]">Moyin&apos;s dressing room</h4>
      </div>

      <div className="p-4 bg-[var(--paper)] rounded-2xl border-2 border-[var(--honey-500)] flex flex-col items-center justify-center relative">
        <span className="absolute top-2 right-2 flex items-center gap-1 text-xs font-bold text-[var(--honey-700)]">
          <HoneyDropIcon size={12} />
          <span>24 drops</span>
        </span>
        <div key={`${hat}-${scarf}`} className="pop-in">
          <MoyinMascot pose="cheer" size={100} hat={hat} scarf={scarf} />
        </div>
        <span className="text-xs font-bold text-[var(--plum-900)] mt-2">Moyin is cozy and proud.</span>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-xs font-bold text-[var(--fg-muted)]">Dress Moyin</span>
        <div className="grid grid-cols-3 gap-2">
          {items.map((item) => (
            <button
              key={item.label}
              type="button"
              aria-pressed={item.active}
              onClick={item.onClick}
              className={`p-2 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-colors ${
                item.active
                  ? "bg-[var(--plum-100)] border-[var(--plum-700)] text-[var(--plum-900)]"
                  : "bg-white border-[var(--border)] text-[var(--plum-900)]"
              }`}
            >
              <item.Icon size={20} className="text-[var(--plum-700)]" />
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="p-3 bg-[var(--plum-100)] rounded-xl border border-[var(--border)] flex items-center justify-between gap-2 text-left">
        <span className="text-sm font-bold text-[var(--plum-900)]">Done for today. Rest anytime.</span>
        <TargetIcon size={16} className="text-[var(--plum-700)] shrink-0" />
      </div>
    </div>
  );
}

/** TAB 4: teacher report */
export function GrownupsScreen() {
  return (
    <div className="p-4 flex-1 flex flex-col justify-between gap-3 overflow-y-auto">
      <div className="flex flex-col gap-1">
        <span className="text-xs font-bold text-[var(--fg-muted)]">Classroom and parent view</span>
        <h4 className="text-base font-bold text-[var(--plum-900)]">Learner summary: Amina</h4>
      </div>

      <div className="p-3 bg-white rounded-2xl border-2 border-[var(--border)] flex flex-col gap-2 text-left">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-bold text-[var(--plum-900)]">Curriculum: Nigeria UBE</span>
          <span className="text-xs bg-[var(--plum-100)] text-[var(--plum-700)] font-semibold px-2 rounded-md border border-[var(--border)]">
            Primary 2
          </span>
        </div>
        <p className="p-2 bg-[var(--paper)] border border-[var(--border)] text-sm text-[var(--plum-900)] leading-relaxed">
          Amina is confident with visual addition and number patterns. When a regrouping step came up, she took her
          time with the audio hint and there was no timer.
        </p>
        <div className="grid grid-cols-2 gap-2 text-xs font-bold">
          <span className="bg-[var(--plum-100)] p-2 rounded-md border border-[var(--border)] text-[var(--honey-700)] flex items-center gap-1">
            <HoneyDropIcon size={14} />
            <span>14 honey earned</span>
          </span>
          <span className="bg-[var(--plum-100)] p-2 rounded-md border border-[var(--border)] text-[var(--teal-700)] flex items-center gap-1">
            <TargetIcon size={14} />
            <span>0 timers forced</span>
          </span>
        </div>
      </div>

      <div className="p-3 bg-[var(--plum-100)] rounded-xl border border-[var(--border)] text-left">
        <span className="text-xs font-bold text-[var(--plum-700)]">Teacher next step</span>
        <p className="text-sm font-bold text-[var(--plum-900)] mt-1">Ready for word problems tomorrow.</p>
      </div>
    </div>
  );
}
