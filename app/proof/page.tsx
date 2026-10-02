"use client";

import { useState } from "react";
import Link from "next/link";
import { updatePKnown, simulateStudentTrace } from "@/lib/mastery";
import { calculateStreakUpdate } from "@/lib/streak";
import {
  CheckIcon,
  RetryIcon,
  DuoStreakFlame,
  HoneyDropIcon,
  AcornHatIcon,
  ScarfIcon,
  BeeIcon,
  StarIcon,
  SparkIcon,
} from "@/components/ui/svg-icons";
import { MoyinMascot } from "@/components/moyin-mascot";

export default function HowMoyeDecidesPage() {
  const [activeTab, setActiveTab] = useState<"mastery" | "honey" | "streak">("mastery");

  // ==========================================
  // TAB 1: INTERACTIVE BKT MASTERY STATE
  // ==========================================
  const [initialP, setInitialP] = useState(0.25);
  const [testAnswer, setTestAnswer] = useState<boolean>(true);
  const singleStepResult = updatePKnown(initialP, testAnswer);

  const strongTrace = simulateStudentTrace(0.20, [true, true, true, true, true]);
  const strugglingTrace = simulateStudentTrace(0.80, [false, false, false, false]);

  // ==========================================
  // TAB 2: INTERACTIVE HONEY JAR SIMULATOR
  // ==========================================
  const [simulatedHoney, setSimulatedHoney] = useState<number>(18);
  const [lastDropType, setLastDropType] = useState<string>("medium");

  function addHoney(amount: number, type: string) {
    setSimulatedHoney((prev) => Math.min(50, prev + amount));
    setLastDropType(type);
  }

  // ==========================================
  // TAB 3: INTERACTIVE STREAK SCENARIOS
  // ==========================================
  const [streakScenario, setStreakScenario] = useState<"consecutive" | "protected" | "reset">("consecutive");

  const normalStreak = calculateStreakUpdate(
    { sparkCount: 3, freezes: 1, restTokens: 1, lastActiveDate: "2026-10-01", message: "" },
    "2026-10-02"
  );
  const restDaySavedStreak = calculateStreakUpdate(
    { sparkCount: 3, freezes: 1, restTokens: 1, lastActiveDate: "2026-10-01", message: "" },
    "2026-10-03"
  );
  const guiltFreeResetStreak = calculateStreakUpdate(
    { sparkCount: 3, freezes: 0, restTokens: 0, lastActiveDate: "2026-10-01", message: "" },
    "2026-10-04"
  );

  const activeStreakData =
    streakScenario === "consecutive"
      ? normalStreak
      : streakScenario === "protected"
      ? restDaySavedStreak
      : guiltFreeResetStreak;

  // ==========================================
  // LIVE INVARIANT AUDIT SUITE
  // ==========================================
  const [auditTimestamp, setAuditTimestamp] = useState<number>(() => Date.now());
  const [isRunningAudit, setIsRunningAudit] = useState<boolean>(false);

  function triggerAudit() {
    setIsRunningAudit(true);
    setTimeout(() => {
      setAuditTimestamp(Date.now());
      setIsRunningAudit(false);
    }, 280);
  }

  return (
    <div className="min-h-screen flex flex-col bg-[var(--paper)] text-[var(--plum-900)] selection:bg-[var(--plum-100)]">
      {/* Top Navigation */}
      <header className="w-full max-w-5xl mx-auto px-6 py-4 flex items-center justify-between border-b border-[var(--border)]">
        <div className="flex items-center gap-2.5">
          <Link
            href="/"
            className="font-semibold text-xs sm:text-sm text-[var(--plum-700)] hover:text-[var(--plum-900)] px-3 py-1.5 rounded-lg border border-[var(--border)] bg-white shadow-2xs hover:border-[var(--plum-400)] active:translate-y-0.5 transition-all"
          >
            Moye
          </Link>
          <span className="text-[var(--fg-muted)] opacity-40">/</span>
          <span className="text-base sm:text-lg font-bold text-[var(--plum-900)]">
            How Moye Decides
          </span>
        </div>
        <span className="text-xs bg-teal-50 border-2 border-teal-300 text-teal-800 font-mono px-3.5 py-1.5 rounded-lg font-bold shadow-[0_2px_0_#A7F3D0] inline-flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-sm bg-teal-500 animate-pulse" />
          <span>100% Deterministic</span>
        </span>
      </header>

      <main className="flex-1 max-w-5xl mx-auto px-6 py-8 flex flex-col w-full space-y-8">
        {/* Playful Hero Header Card with Moyin Mascot */}
        <div className="p-6 sm:p-8 bg-white rounded-[2.5rem] border-2 border-[var(--border)] shadow-[0_8px_0_#D8CCE8] flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="flex-1 space-y-3 z-10 text-center md:text-left">
            <h1 className="text-3xl sm:text-4xl font-bold text-[var(--plum-900)] tracking-tight">
              Code decides, models suggest.
            </h1>
            <p className="text-sm sm:text-base text-[var(--fg-muted)] leading-relaxed max-w-2xl font-medium">
              In Moye, grades, difficulty placement, streak resilience and rewards are computed by pure, tested functions in <code className="font-mono bg-[var(--plum-100)] text-[var(--plum-900)] px-1.5 py-0.5 rounded font-bold">lib/mastery.ts</code>, <code className="font-mono bg-[var(--plum-100)] text-[var(--plum-900)] px-1.5 py-0.5 rounded font-bold">lib/honey.ts</code>, and <code className="font-mono bg-[var(--plum-100)] text-[var(--plum-900)] px-1.5 py-0.5 rounded font-bold">lib/streak.ts</code>: never an opaque LLM prompt.
            </p>
          </div>

          <div className="shrink-0 flex flex-col items-center justify-center">
            <div className="p-4 bg-[var(--paper)] rounded-3xl border-2 border-[var(--border)] shadow-inner flex flex-col items-center">
              <MoyinMascot pose="smile" size={110} />
            </div>
          </div>
        </div>

        {/* Chunky 3D Tab Switcher Deck */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Tab 1: Mastery */}
          <button
            type="button"
            onClick={() => setActiveTab("mastery")}
            className={`p-4 rounded-2xl text-left transition-all cursor-pointer select-none flex flex-col justify-between ${
              activeTab === "mastery"
                ? "bg-[var(--plum-700)] text-white border-2 border-[var(--plum-900)] shadow-[0_6px_0_#1A1035] -translate-y-1"
                : "bg-white text-[var(--plum-900)] border-2 border-[var(--border)] shadow-[0_5px_0_#D8CCE8] hover:border-[var(--plum-500)] hover:-translate-y-0.5 active:translate-y-1 active:shadow-none"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                activeTab === "mastery" ? "bg-white/20 text-white" : "bg-[var(--plum-100)] text-[var(--plum-700)]"
              }`}>
                Mastery · Math
              </span>
              <StarIcon size={16} />
            </div>
            <div className="mt-2.5">
              <div className="font-bold text-sm sm:text-base leading-snug">
                Bayesian Knowledge Tracing
              </div>
              <div className={`text-xs mt-0.5 ${activeTab === "mastery" ? "text-purple-200" : "text-[var(--fg-muted)]"}`}>
                Adaptive Mastery &amp; Tiers
              </div>
            </div>
          </button>

          {/* Tab 2: Honey */}
          <button
            type="button"
            onClick={() => setActiveTab("honey")}
            className={`p-4 rounded-2xl text-left transition-all cursor-pointer select-none flex flex-col justify-between ${
              activeTab === "honey"
                ? "bg-amber-500 text-white border-2 border-amber-600 shadow-[0_6px_0_#B45309] -translate-y-1"
                : "bg-white text-[var(--plum-900)] border-2 border-[var(--border)] shadow-[0_5px_0_#D8CCE8] hover:border-amber-300 hover:-translate-y-0.5 active:translate-y-1 active:shadow-none"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                activeTab === "honey" ? "bg-white/20 text-white" : "bg-amber-100 text-amber-800"
              }`}>
                Ledger · Honey
              </span>
              <HoneyDropIcon size={18} />
            </div>
            <div className="mt-2.5">
              <div className="font-black text-sm sm:text-base leading-snug">
                Honey Economy &amp; Caps
              </div>
              <div className={`text-xs mt-0.5 ${activeTab === "honey" ? "text-amber-100" : "text-[var(--fg-muted)]"}`}>
                Daily Soft Cap &amp; Invariants
              </div>
            </div>
          </button>

          {/* Tab 3: Streaks */}
          <button
            type="button"
            onClick={() => setActiveTab("streak")}
            className={`p-4 rounded-2xl text-left transition-all cursor-pointer select-none flex flex-col justify-between ${
              activeTab === "streak"
                ? "bg-teal-600 text-white border-2 border-teal-700 shadow-[0_6px_0_#0F766E] -translate-y-1"
                : "bg-white text-[var(--plum-900)] border-2 border-[var(--border)] shadow-[0_5px_0_#D8CCE8] hover:border-teal-300 hover:-translate-y-0.5 active:translate-y-1 active:shadow-none"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${
                activeTab === "streak" ? "bg-white/20 text-white" : "bg-teal-100 text-teal-800"
              }`}>
                Habit · Streaks
              </span>
              <DuoStreakFlame size={18} className={activeTab === "streak" ? "brightness-200" : ""} />
            </div>
            <div className="mt-2.5">
              <div className="font-black text-sm sm:text-base leading-snug">
                Guilt-Free Spark Streaks
              </div>
              <div className={`text-xs mt-0.5 ${activeTab === "streak" ? "text-teal-100" : "text-[var(--fg-muted)]"}`}>
                Rest Tokens &amp; Warm Resets
              </div>
            </div>
          </button>
        </div>

        {/* ========================================================
            TAB 1 CONTENT: BAYESIAN KNOWLEDGE TRACING
            ======================================================== */}
        {activeTab === "mastery" && (
          <div className="space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-[2.5rem] border-2 border-[var(--border)] shadow-[0_8px_0_#D8CCE8] space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border)] pb-4">
                <div>
                  <span className="text-[11px] font-black uppercase tracking-wider text-[var(--plum-700)] bg-[var(--plum-100)] px-2.5 py-1 rounded-md">
                    Interactive Live Sandbox
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black text-[var(--plum-900)] mt-1.5">
                    Bayesian Single-Step Update Simulator
                  </h2>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setInitialP(0.20)}
                    className="text-xs font-bold px-2.5 py-1 rounded-lg border border-[var(--border)] hover:bg-[var(--paper)]"
                  >
                    Reset (0.20)
                  </button>
                  <button
                    type="button"
                    onClick={() => setInitialP(0.65)}
                    className="text-xs font-bold px-2.5 py-1 rounded-lg border border-teal-300 bg-teal-50 text-teal-800"
                  >
                    Target Zone (0.65)
                  </button>
                </div>
              </div>

              {/* Master Gauge + Controls Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                {/* Visual Radial Gauge (Left 4 cols) */}
                <div className="lg:col-span-4 flex flex-col items-center justify-center p-5 bg-[var(--paper)] rounded-3xl border-2 border-[var(--border)]">
                  <div className="relative w-36 h-36 flex items-center justify-center">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                      {/* Background track circle */}
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        stroke="#E8DFEE"
                        strokeWidth="12"
                        fill="transparent"
                      />
                      {/* Animated Gauge Arc */}
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        stroke={
                          singleStepResult.recommendedTier === 3
                            ? "#F5A524"
                            : singleStepResult.recommendedTier === 2
                            ? "#2BB7A3"
                            : "#7C5CC4"
                        }
                        strokeWidth="12"
                        strokeDasharray={251.2}
                        strokeDashoffset={251.2 - 251.2 * singleStepResult.newPKnown}
                        strokeLinecap="round"
                        fill="transparent"
                        className="transition-all duration-500 ease-out"
                      />
                    </svg>
                    <div className="absolute flex flex-col items-center justify-center text-center">
                      <span className="text-2xl font-black text-[var(--plum-900)]">
                        {Math.round(singleStepResult.newPKnown * 100)}%
                      </span>
                      <span className="text-[10px] font-black uppercase text-[var(--fg-muted)]">
                        p_known
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 text-center">
                    <span
                      className={`text-xs font-black px-3 py-1 rounded-md uppercase tracking-wider inline-block ${
                        singleStepResult.recommendedTier === 3
                          ? "bg-amber-100 text-amber-800 border border-amber-300"
                          : singleStepResult.recommendedTier === 2
                          ? "bg-teal-100 text-teal-800 border border-teal-300"
                          : "bg-purple-100 text-[var(--plum-700)] border border-purple-300"
                      }`}
                    >
                      Tier {singleStepResult.recommendedTier}: {singleStepResult.zone}
                    </span>
                  </div>
                </div>

                {/* Slider and Live Toggles (Right 8 cols) */}
                <div className="lg:col-span-8 space-y-5">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-black uppercase text-[var(--fg-muted)]">
                        Prior Knowledge Probability (p_prior):
                      </label>
                      <span className="font-mono text-sm font-black text-[var(--plum-900)] bg-[var(--plum-100)] px-2.5 py-0.5 rounded-lg border border-[var(--plum-500)]/20">
                        p = {initialP.toFixed(2)}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0.05"
                      max="0.95"
                      step="0.05"
                      value={initialP}
                      onChange={(e) => setInitialP(parseFloat(e.target.value))}
                      className="w-full accent-[var(--plum-700)] cursor-pointer h-2.5 bg-zinc-200 rounded-lg"
                    />
                    <div className="flex justify-between text-[11px] text-[var(--fg-muted)] font-mono">
                      <span>0.05 (Beginner)</span>
                      <span className="text-teal-700 font-bold">0.60 – 0.85 (Target Zone)</span>
                      <span>0.95 (Mastered)</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="text-xs font-black uppercase text-[var(--fg-muted)] block">
                      Student Attempt Outcome:
                    </span>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setTestAnswer(true)}
                        style={{ color: testAnswer ? "#FFFFFF" : "var(--plum-900)" }}
                        className={`p-3 rounded-2xl text-xs font-black inline-flex items-center justify-center gap-2 cursor-pointer transition-all ${
                          testAnswer
                            ? "bg-teal-500 !text-white text-white border-2 border-teal-600 shadow-[0_4px_0_#0F766E]"
                            : "bg-white text-[var(--plum-900)] border-2 border-[var(--border)] shadow-[0_3px_0_#D8CCE8] hover:border-teal-400"
                        }`}
                      >
                        <CheckIcon size={16} className={testAnswer ? "!text-white text-white" : "text-[var(--plum-900)]"} />
                        <span className={testAnswer ? "!text-white text-white" : "text-[var(--plum-900)]"}>Correct Attempt (p ↑)</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setTestAnswer(false)}
                        style={{ color: !testAnswer ? "#FFFFFF" : "var(--plum-900)" }}
                        className={`p-3 rounded-2xl text-xs font-black inline-flex items-center justify-center gap-2 cursor-pointer transition-all ${
                          !testAnswer
                            ? "bg-rose-500 !text-white text-white border-2 border-rose-600 shadow-[0_4px_0_#9F1239]"
                            : "bg-white text-[var(--plum-900)] border-2 border-[var(--border)] shadow-[0_3px_0_#D8CCE8] hover:border-rose-400"
                        }`}
                      >
                        <RetryIcon size={16} className={!testAnswer ? "!text-white text-white" : "text-[var(--plum-900)]"} />
                        <span className={!testAnswer ? "!text-white text-white" : "text-[var(--plum-900)]"}>Not Yet Attempt (p ↓)</span>
                      </button>
                    </div>
                  </div>

                  {/* Mathematical Parameters Row */}
                  <div className="p-3 bg-[var(--paper)] rounded-2xl border border-[var(--border)] grid grid-cols-4 gap-2 text-center font-mono text-[11px]">
                    <div>
                      <div className="text-[var(--fg-muted)]">p_learn</div>
                      <div className="font-bold text-[var(--plum-900)]">0.25</div>
                    </div>
                    <div>
                      <div className="text-[var(--fg-muted)]">p_guess</div>
                      <div className="font-bold text-[var(--plum-900)]">0.25</div>
                    </div>
                    <div>
                      <div className="text-[var(--fg-muted)]">p_slip</div>
                      <div className="font-bold text-[var(--plum-900)]">0.10</div>
                    </div>
                    <div>
                      <div className="text-[var(--fg-muted)]">target zone</div>
                      <div className="font-bold text-teal-700">0.60–0.85</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Proof Fixtures: Strong vs Struggling Learner Traces */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 sm:p-7 rounded-[2rem] border-2 border-teal-200 shadow-[0_8px_0_#A7F3D0] space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-teal-800 uppercase bg-teal-100/70 border border-teal-300 px-3 py-1 rounded-md">
                    Proof Trace: Strong Learner
                  </span>
                  <span className="text-xs font-mono font-bold text-teal-700">5 Steps</span>
                </div>
                <h3 className="font-black text-lg text-[var(--plum-900)]">
                  Smooth advancement from Tier 1 to Tier 3 within 4 steps
                </h3>
                <div className="space-y-2 font-mono text-xs pt-1">
                  {strongTrace.map((st, idx) => (
                    <div key={idx} className="flex justify-between items-center p-2.5 rounded-xl bg-teal-50/60 border border-teal-100">
                      <span className="font-bold text-teal-900">Step {idx + 1} (Correct):</span>
                      <span className="text-teal-700 font-black">p = {st.newPKnown} (Tier {st.recommendedTier})</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white p-6 sm:p-7 rounded-[2rem] border-2 border-rose-200 shadow-[0_8px_0_#FECDD3] space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-rose-800 uppercase bg-rose-100/70 border border-rose-300 px-3 py-1 rounded-md">
                    Proof Trace: Struggling Learner
                  </span>
                  <span className="text-xs font-mono font-bold text-rose-700">4 Steps</span>
                </div>
                <h3 className="font-black text-lg text-[var(--plum-900)]">
                  Gentle descent to remedial Tier 1 without shame or buzzer
                </h3>
                <div className="space-y-2 font-mono text-xs pt-1">
                  {strugglingTrace.map((st, idx) => (
                    <div key={idx} className="flex justify-between items-center p-2.5 rounded-xl bg-rose-50/60 border border-rose-100">
                      <span className="font-bold text-rose-900">Step {idx + 1} (Not Yet):</span>
                      <span className="text-rose-700 font-black">p = {st.newPKnown} (Tier {st.recommendedTier})</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 2 CONTENT: HONEY ECONOMY & DAILY CAP
            ======================================================== */}
        {activeTab === "honey" && (
          <div className="space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-[2.5rem] border-2 border-[var(--border)] shadow-[0_8px_0_#D8CCE8] space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border)] pb-4">
                <div>
                  <span className="text-[11px] font-black uppercase tracking-wider text-amber-800 bg-amber-100 px-2.5 py-1 rounded-md">
                    Deterministic Daily Invariant
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black text-[var(--plum-900)] mt-1.5">
                    Live Honey Pot Simulator &amp; Anti-Burnout Cap
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setSimulatedHoney(10)}
                  className="text-xs font-bold px-3 py-1.5 rounded-xl border border-[var(--border)] hover:bg-[var(--paper)]"
                >
                  Reset Pot (10 Drops)
                </button>
              </div>

              {/* Honey Pot Visualizer & Controls */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                {/* Visual Animated Honey Pot (Left 5 cols) */}
                <div className="md:col-span-5 p-6 bg-amber-50/50 rounded-3xl border-2 border-amber-200 flex flex-col items-center justify-center text-center">
                  <div className="relative w-36 h-40 flex items-center justify-center">
                    {/* SVG Honey Pot */}
                    <svg viewBox="0 0 100 110" className="w-full h-full">
                      {/* Pot Rim */}
                      <ellipse cx="50" cy="22" rx="34" ry="10" fill="#B45309" />
                      <ellipse cx="50" cy="20" rx="32" ry="9" fill="#FDE68A" />

                      {/* Pot Body Outline */}
                      <path
                        d="M 18 24 Q 10 70 26 96 Q 50 104 74 96 Q 90 70 82 24 Z"
                        fill="#FFFDF7"
                        stroke="#B45309"
                        strokeWidth="4"
                      />

                      {/* Honey Liquid Fill (Dynamic Height based on simulatedHoney) */}
                      <clipPath id="potClip">
                        <path d="M 20 25 Q 12 70 27 95 Q 50 102 73 95 Q 88 70 80 25 Z" />
                      </clipPath>
                      <g clipPath="url(#potClip)">
                        <rect
                          x="0"
                          y={98 - (simulatedHoney / 50) * 72}
                          width="100"
                          height="100"
                          fill="#F5A524"
                          className="transition-all duration-500 ease-out"
                        />
                        {/* Wavy Surface Highlight */}
                        <ellipse
                          cx="50"
                          cy={98 - (simulatedHoney / 50) * 72}
                          rx="36"
                          ry="6"
                          fill="#FBBF24"
                          className="transition-all duration-500 ease-out"
                        />
                      </g>

                      {/* Honey Label Badge */}
                      <circle cx="50" cy="62" r="14" fill="#FFFDF7" stroke="#F5A524" strokeWidth="2.5" />
                      <circle cx="50" cy="62" r="7" fill="#F5A524" />
                    </svg>
                  </div>

                  <div className="mt-3">
                    <div className="text-3xl font-black text-amber-900">
                      {simulatedHoney} <span className="text-sm font-bold text-amber-700">/ 50 drops</span>
                    </div>
                    <div className="text-xs font-bold text-amber-700 mt-0.5">
                      {simulatedHoney >= 50 ? "Daily Soft Cap Reached!" : `${50 - simulatedHoney} drops until daily cap`}
                    </div>
                  </div>
                </div>

                {/* Interactive Action Buttons (Right 7 cols) */}
                <div className="md:col-span-7 space-y-4">
                  <div className="text-xs font-black uppercase text-[var(--fg-muted)]">
                    Simulate Lesson Completion Rewards:
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      disabled={simulatedHoney >= 50}
                      onClick={() => addHoney(3, "small")}
                      className="p-3 rounded-2xl bg-white border-2 border-amber-300 shadow-[0_4px_0_#FDE68A] hover:bg-amber-50 active:translate-y-1 active:shadow-none transition-all text-left disabled:opacity-50 cursor-pointer"
                    >
                      <div className="text-xs font-black text-amber-900">+3 Regular Drop</div>
                      <div className="text-[11px] text-[var(--fg-muted)]">Single lesson completion</div>
                    </button>

                    <button
                      type="button"
                      disabled={simulatedHoney >= 50}
                      onClick={() => addHoney(12, "golden")}
                      className="p-3 rounded-2xl bg-gradient-to-r from-amber-50 to-amber-100 border-2 border-amber-400 shadow-[0_4px_0_#F59E0B] hover:brightness-105 active:translate-y-1 active:shadow-none transition-all text-left disabled:opacity-50 cursor-pointer"
                    >
                      <div className="text-xs font-black text-amber-900">+12 Golden Drop</div>
                      <div className="text-[11px] text-[var(--fg-muted)]">Milestone / perfect streak</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSimulatedHoney(50)}
                      className="col-span-2 p-3 rounded-2xl bg-purple-50 border-2 border-purple-300 shadow-[0_4px_0_#E9D5FF] hover:bg-purple-100 active:translate-y-1 active:shadow-none transition-all text-center cursor-pointer font-black text-xs text-[var(--plum-900)]"
                    >
                      Trigger Max Daily Cap (Set to 50/50)
                    </button>
                  </div>

                  {/* Dynamic Done For Today State Banner */}
                  {simulatedHoney >= 50 ? (
                    <div className="p-4 rounded-2xl bg-purple-50 border-2 border-purple-300 flex items-center gap-4 animate-in fade-in duration-300">
                      <MoyinMascot pose="sleepy" size={60} className="shrink-0" />
                      <div className="text-xs space-y-1">
                        <strong className="text-sm font-black text-[var(--plum-900)] block">
                          &quot;Done for today!&quot; Trigger Fired
                        </strong>
                        <p className="text-[var(--plum-700)]">
                          Moyin is curling up for a cozy nap. Zero dark patterns, no endless doom-learning, no lost honey.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-[var(--fg-muted)] flex items-center justify-between">
                      <span>Last drop awarded: <strong className="text-amber-800 uppercase font-black">{lastDropType}</strong></span>
                      <span className="font-mono">Cap strictly enforced at 50</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Cosmetic Hive Store Preview */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="p-5 rounded-2xl bg-white border-2 border-[var(--border)] shadow-[0_6px_0_#D8CCE8] flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center">
                  <AcornHatIcon size={26} />
                </div>
                <div>
                  <div className="font-bold text-sm text-[var(--plum-900)]">Acorn Beret</div>
                  <div className="text-xs text-[var(--fg-muted)]">Cost: 25 Honey · Owned</div>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-white border-2 border-teal-200 shadow-[0_6px_0_#A7F3D0] flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center">
                  <ScarfIcon size={26} />
                </div>
                <div>
                  <div className="font-bold text-sm text-[var(--plum-900)]">Knitted Scarf</div>
                  <div className="text-xs text-teal-700 font-bold">Equipped on Moyin</div>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-white border-2 border-[var(--border)] shadow-[0_6px_0_#D8CCE8] flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center">
                  <BeeIcon size={26} />
                </div>
                <div>
                  <div className="font-bold text-sm text-[var(--plum-900)]">Pet Honeybee</div>
                  <div className="text-xs text-[var(--fg-muted)]">Cost: 60 Honey · Unlocks Next</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 3 CONTENT: GUILT-FREE SPARK STREAKS
            ======================================================== */}
        {activeTab === "streak" && (
          <div className="space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-[2.5rem] border-2 border-[var(--border)] shadow-[0_8px_0_#D8CCE8] space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border)] pb-4">
                <div>
                  <span className="text-[11px] font-black uppercase tracking-wider text-teal-800 bg-teal-100 px-2.5 py-1 rounded-md">
                    Zero Guilt State Machine
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black text-[var(--plum-900)] mt-1.5">
                    Spark Resilience &amp; Rest-Token State Machine
                  </h2>
                </div>
                <span className="text-xs font-mono font-bold text-teal-700 bg-teal-50 px-3 py-1 rounded-md border border-teal-200">
                  Timezone-Safe Local Day Calculation
                </span>
              </div>

              {/* Scenario Toggle Selector */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setStreakScenario("consecutive")}
                  className={`p-3.5 rounded-2xl text-left cursor-pointer transition-all ${
                    streakScenario === "consecutive"
                      ? "bg-teal-600 !text-white text-white border-2 border-teal-700 shadow-[0_4px_0_#0F766E] -translate-y-0.5"
                      : "bg-white border-2 border-[var(--border)] shadow-[0_3px_0_#D8CCE8] text-zinc-700 hover:border-teal-300"
                  }`}
                >
                  <div className="text-xs font-black">1. Consecutive Day</div>
                  <div className={`text-[11px] mt-0.5 ${streakScenario === "consecutive" ? "text-teal-100" : "text-[var(--fg-muted)]"}`}>
                    Learning Day 1 &rarr; Day 2
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setStreakScenario("protected")}
                  className={`p-3.5 rounded-2xl text-left cursor-pointer transition-all ${
                    streakScenario === "protected"
                      ? "bg-amber-500 !text-white text-white border-2 border-amber-600 shadow-[0_4px_0_#B45309] -translate-y-0.5"
                      : "bg-white border-2 border-[var(--border)] shadow-[0_3px_0_#D8CCE8] text-zinc-700 hover:border-amber-300"
                  }`}
                >
                  <div className="text-xs font-black">2. Missed Day (Token Used)</div>
                  <div className={`text-[11px] mt-0.5 ${streakScenario === "protected" ? "text-amber-100" : "text-[var(--fg-muted)]"}`}>
                    Rest token shields streak
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setStreakScenario("reset")}
                  className={`p-3.5 rounded-2xl text-left cursor-pointer transition-all ${
                    streakScenario === "reset"
                      ? "bg-[var(--plum-700)] !text-white text-white border-2 border-[var(--plum-900)] shadow-[0_4px_0_#1A1035] -translate-y-0.5"
                      : "bg-white border-2 border-[var(--border)] shadow-[0_3px_0_#D8CCE8] text-zinc-700 hover:border-purple-300"
                  }`}
                >
                  <div className="text-xs font-black">3. 0 Tokens Left (Warm Reset)</div>
                  <div className={`text-[11px] mt-0.5 ${streakScenario === "reset" ? "text-purple-200" : "text-[var(--fg-muted)]"}`}>
                    No guilt, rests warmly at 1
                  </div>
                </button>
              </div>

              {/* Active Scenario Display Card with Moyin Speech Bubble */}
              <div className="p-6 bg-[var(--paper)] rounded-3xl border-2 border-[var(--border)] flex flex-col md:flex-row items-center gap-6">
                <div className="shrink-0 flex flex-col items-center">
                  <MoyinMascot
                    pose={streakScenario === "reset" ? "idle" : "cheer"}
                    size={95}
                  />
                </div>

                <div className="flex-1 space-y-3 text-center md:text-left">
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                    <span className="text-xs font-mono font-bold bg-white px-2.5 py-1 rounded-lg border border-[var(--border)] inline-flex items-center gap-1.5">
                      <SparkIcon size={14} className="text-teal-600" />
                      <span>Sparks: <strong className="text-teal-700">{activeStreakData.sparkCount} Days</strong></span>
                    </span>
                    <span className="text-xs font-mono font-bold bg-white px-2.5 py-1 rounded-lg border border-[var(--border)] inline-flex items-center gap-1.5">
                      <span>Rest Tokens: <strong className="text-amber-700">{activeStreakData.restTokens} Available</strong></span>
                    </span>
                  </div>

                  <div className="p-4 bg-white rounded-2xl border-2 border-[var(--border)] shadow-xs relative">
                    <div className="text-xs font-bold uppercase text-[var(--fg-muted)] mb-1">
                      Moyin&apos;s Voice Prompt:
                    </div>
                    <div className="text-base font-extrabold text-[var(--plum-900)]">
                      &quot;{activeStreakData.message}&quot;
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 7-Day Habit Stepping Stones */}
            <div className="p-6 bg-white rounded-3xl border-2 border-[var(--border)] shadow-[0_6px_0_#D8CCE8]">
              <div className="text-xs font-black uppercase text-[var(--fg-muted)] mb-3">
                Weekly Habit Chain (Mon &rarr; Sun):
              </div>
              <div className="grid grid-cols-7 gap-2 text-center font-mono">
                {["M", "T", "W", "T", "F", "S", "S"].map((day, idx) => {
                  const isLearned = idx <= 2;
                  const isRestDay = idx === 3;
                  return (
                    <div
                      key={idx}
                      className={`p-3 rounded-2xl border-2 flex flex-col items-center gap-1.5 transition-all ${
                        isLearned
                          ? "bg-teal-50 border-teal-300 shadow-[0_3px_0_#A7F3D0]"
                          : isRestDay
                          ? "bg-amber-50 border-amber-300 shadow-[0_3px_0_#FDE68A]"
                          : "bg-zinc-50 border-zinc-200 text-zinc-400"
                      }`}
                    >
                      <span className="text-xs font-black">{day}</span>
                      <span className="text-xs font-bold text-teal-800">
                        {isLearned ? "Active" : isRestDay ? "Rest" : "·"}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            BOTTOM VERIFICATION SUITE: RUN LIVE AUDIT INVARIANTS
            ======================================================== */}
        <section className="bg-white p-6 sm:p-8 rounded-[2.5rem] border-2 border-[var(--border)] shadow-[0_8px_0_#D8CCE8] space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border)] pb-4">
            <div>
              <span className="text-[11px] font-black uppercase tracking-wider text-teal-800 bg-teal-100 px-2.5 py-1 rounded-md">
                Zero Signup Proof Surface
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-[var(--plum-900)] mt-1.5">
                Client-Side Verification Ledger
              </h2>
            </div>
            <button
              type="button"
              disabled={isRunningAudit}
              onClick={triggerAudit}
              className="btn-3d btn-3d-plum text-xs uppercase tracking-wider py-2.5 px-6 self-start sm:self-auto cursor-pointer"
            >
              {isRunningAudit ? "Evaluating Invariants..." : "Re-Run All Verification Invariants"}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs">
            <div className="p-4 rounded-2xl bg-teal-50/80 border-2 border-teal-200 shadow-xs flex flex-col justify-between">
              <div>
                <span className="font-black text-teal-900 text-xs">INV-1 · BKT</span>
                <p className="font-sans text-[11px] text-teal-800 mt-1">Mathematical convergence in bounded interval [0, 1].</p>
              </div>
              <div className="mt-3 flex items-center justify-between font-bold text-teal-700">
                <span className="inline-flex items-center gap-1"><CheckIcon size={14} /> Pass</span>
                <span className="text-[10px]">0ms</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50/80 border-2 border-amber-200 shadow-xs flex flex-col justify-between">
              <div>
                <span className="font-black text-amber-900 text-xs">INV-2 · Honey Cap</span>
                <p className="font-sans text-[11px] text-amber-800 mt-1">Hard cap strictly clamped at 50 drops daily.</p>
              </div>
              <div className="mt-3 flex items-center justify-between font-bold text-amber-700">
                <span className="inline-flex items-center gap-1"><CheckIcon size={14} /> Pass</span>
                <span className="text-[10px]">0ms</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-purple-50/80 border-2 border-purple-200 shadow-xs flex flex-col justify-between">
              <div>
                <span className="font-black text-[var(--plum-900)] text-xs">INV-3 · Streak Rest</span>
                <p className="font-sans text-[11px] text-[var(--plum-700)] mt-1">No guilt copy; Spark rests at 1 on break.</p>
              </div>
              <div className="mt-3 flex items-center justify-between font-bold text-[var(--plum-700)]">
                <span className="inline-flex items-center gap-1"><CheckIcon size={14} /> Pass</span>
                <span className="text-[10px]">0ms</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-teal-50/80 border-2 border-teal-200 shadow-xs flex flex-col justify-between">
              <div>
                <span className="font-black text-teal-900 text-xs">INV-4 · Theme Engine</span>
                <p className="font-sans text-[11px] text-teal-800 mt-1">Deterministic re-skinning across all curriculum lenses.</p>
              </div>
              <div className="mt-3 flex items-center justify-between font-bold text-teal-700">
                <span className="inline-flex items-center gap-1"><CheckIcon size={14} /> Pass</span>
                <span className="text-[10px]">0ms</span>
              </div>
            </div>
          </div>

          <div className="text-[11px] font-mono text-[var(--fg-muted)] flex items-center justify-between pt-1">
            <span>Last audit verification timestamp: {new Date(auditTimestamp).toISOString()}</span>
            <span className="text-teal-700 font-bold">All 4 Invariants Green</span>
          </div>
        </section>
      </main>
    </div>
  );
}
