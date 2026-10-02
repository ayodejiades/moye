"use client";

import React, { useState } from "react";
import Link from "next/link";
import { MoyinMascot } from "@/components/moyin-mascot";
import {
  HoneyDropIcon,
  SpeakerIcon,
  CheckIcon,
  RetryIcon,
  AcornHatIcon,
  HoneyCrownIcon,
  DuoStreakFlame,
  TargetIcon,
  DinosaurIcon,
  ScarfIcon,
  LockIcon,
  SparkIcon,
  DuoLeagueShield,
  StarIcon,
  PrinterIcon,
} from "@/components/ui/svg-icons";

type ShowcaseTab = "focus" | "mastery" | "hive" | "grownups";

export function InteractiveAppShowcase() {
  const [activeTab, setActiveTab] = useState<ShowcaseTab>("focus");

  // Focus Lesson tab state
  const [dyslexicFont, setDyslexicFont] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Mastery tab simulation state
  const [simulatedPKnown, setSimulatedPKnown] = useState(0.74);

  // Hive tab cosmetic state
  const [equippedHat, setEquippedHat] = useState<string | null>("hat-acorn");
  const [equippedScarf, setEquippedScarf] = useState<string | null>(null);

  // Web speech helper
  const handleReadAloud = (text: string) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    } else {
      setIsSpeaking(true);
      setTimeout(() => setIsSpeaking(false), 1200);
    }
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#EEF4FF] via-[#F5F2FF] to-[var(--paper)] border-y border-[var(--border)] py-16 sm:py-24 px-4 sm:px-6 text-center select-none">
      {/* Background ambient accents */}
      <div className="absolute top-12 left-1/4 w-72 h-72 rounded-full bg-purple-200/40 blur-3xl pointer-events-none" />
      <div className="absolute bottom-12 right-1/4 w-80 h-80 rounded-full bg-amber-100/50 blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto flex flex-col items-center gap-4 z-10 relative">
        <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[var(--plum-900)] leading-tight">
          See how Moye works
        </h2>
        <p className="text-sm sm:text-base text-[var(--fg-muted)] max-w-xl font-medium">
          Experience Moye’s four pillars: calm focus lessons, Bayesian mastery, honey rewards, and plain-language grown-up reports.
        </p>

        {/* Feature Tab Switcher */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 pt-3 pb-2 w-full max-w-2xl">
          <button
            type="button"
            onClick={() => setActiveTab("focus")}
            style={activeTab === "focus" ? { color: "#FFFFFF" } : undefined}
            className={`px-4 sm:px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "focus"
                ? "bg-[var(--plum-700)] !text-white text-white shadow-[0_4px_0_var(--plum-900)] translate-y-[-2px]"
                : "bg-white text-[var(--plum-900)] border border-[var(--border)] hover:bg-[var(--plum-100)] shadow-xs"
            }`}
          >
            <span className={activeTab === "focus" ? "brightness-0 invert" : ""}><TargetIcon size={16} /></span>
            <span style={activeTab === "focus" ? { color: "#FFFFFF" } : undefined} className={activeTab === "focus" ? "!text-white text-white" : ""}>Focus Lesson</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("mastery")}
            style={activeTab === "mastery" ? { color: "#FFFFFF" } : undefined}
            className={`px-4 sm:px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "mastery"
                ? "bg-[var(--plum-700)] !text-white text-white shadow-[0_4px_0_var(--plum-900)] translate-y-[-2px]"
                : "bg-white text-[var(--plum-900)] border border-[var(--border)] hover:bg-[var(--plum-100)] shadow-xs"
            }`}
          >
            <span className={activeTab === "mastery" ? "brightness-0 invert" : ""}><StarIcon size={16} /></span>
            <span style={activeTab === "mastery" ? { color: "#FFFFFF" } : undefined} className={activeTab === "mastery" ? "!text-white text-white" : ""}>Adaptive Engine</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("hive")}
            style={activeTab === "hive" ? { color: "#FFFFFF" } : undefined}
            className={`px-4 sm:px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "hive"
                ? "bg-[var(--plum-700)] !text-white text-white shadow-[0_4px_0_var(--plum-900)] translate-y-[-2px]"
                : "bg-white text-[var(--plum-900)] border border-[var(--border)] hover:bg-[var(--plum-100)] shadow-xs"
            }`}
          >
            <span className={activeTab === "hive" ? "brightness-0 invert" : ""}><HoneyDropIcon size={16} /></span>
            <span style={activeTab === "hive" ? { color: "#FFFFFF" } : undefined} className={activeTab === "hive" ? "!text-white text-white" : ""}>Moyin&apos;s Hive</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("grownups")}
            style={activeTab === "grownups" ? { color: "#FFFFFF" } : undefined}
            className={`px-4 sm:px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "grownups"
                ? "bg-[var(--plum-700)] !text-white text-white shadow-[0_4px_0_var(--plum-900)] translate-y-[-2px]"
                : "bg-white text-[var(--plum-900)] border border-[var(--border)] hover:bg-[var(--plum-100)] shadow-xs"
            }`}
          >
            <span className={activeTab === "grownups" ? "brightness-0 invert" : ""}><PrinterIcon size={16} /></span>
            <span style={activeTab === "grownups" ? { color: "#FFFFFF" } : undefined} className={activeTab === "grownups" ? "!text-white text-white" : ""}>Teacher Report</span>
          </button>
        </div>
      </div>

      {/* Main Interactive Device Container */}
      <div className="relative w-full max-w-5xl mx-auto mt-8 sm:mt-12 flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12 z-20">
        
        {/* Left Side: Contextual Feature Explanation Card */}
        <div className="w-full lg:w-80 text-left bg-white/95 backdrop-blur-sm p-6 sm:p-7 rounded-3xl border-2 border-[var(--border)] shadow-[0_8px_20px_rgba(42,27,77,0.06)] order-2 lg:order-1 flex flex-col justify-between">
          {activeTab === "focus" && (
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-2xl bg-teal-100 border border-teal-300 flex items-center justify-center text-teal-800 text-lg">
                <TargetIcon size={22} />
              </div>
              <div>
                <span className="text-[11px] font-black uppercase tracking-wider text-teal-700">Zero Timer Panic</span>
                <h3 className="text-xl font-black text-[var(--plum-900)] mt-0.5">Focus Mode Lesson</h3>
              </div>
              <p className="text-xs text-[var(--fg-muted)] leading-relaxed">
                Presents one gentle question at a time. No ticking countdown buzzer, full Web Speech read-aloud support, and an instant dyslexic font toggle.
              </p>
              <div className="pt-2 border-t border-[var(--border)] flex flex-col gap-2">
                <div className="flex items-center gap-2 text-xs font-bold text-[var(--plum-900)]">
                  <span className="w-2 h-2 rounded-full bg-teal-500" />
                  <span>Tap answers on the phone screen</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-[var(--plum-900)]">
                  <span className="w-2 h-2 rounded-full bg-purple-500" />
                  <span>Toggle dyslexia spacing mode</span>
                </div>
              </div>
              <Link
                href="/start"
                className="btn-3d btn-3d-plum text-xs py-2.5 px-4 text-center w-full mt-2"
              >
                Try Full Focus Lesson
              </Link>
            </div>
          )}

          {activeTab === "mastery" && (
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-800">
                <TargetIcon size={22} className="text-amber-800" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700">Deterministic Engine</span>
                <h3 className="text-xl font-bold text-[var(--plum-900)] mt-0.5">Bayesian Knowledge Tracing</h3>
              </div>
              <p className="text-xs text-[var(--fg-muted)] leading-relaxed [text-wrap:pretty]">
                Computes learner probability of mastery with pure mathematical algorithms rather than probabilistic guesswork. Fully verifiable in How Moye Decides.
              </p>
              <div className="pt-2 border-t border-[var(--border)] flex flex-col gap-2">
                <div className="flex items-center gap-2 text-xs font-bold text-[var(--plum-900)]">
                  <span className="w-2 h-2 rounded-sm bg-teal-500" />
                  <span>Target Optimal Challenge Zone: 0.60 to 0.85</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-[var(--plum-900)]">
                  <span className="w-2 h-2 rounded-sm bg-amber-500" />
                  <span>Zero runtime LLM dependency</span>
                </div>
              </div>
              <Link
                href="/proof"
                className="btn-3d btn-3d-card text-xs py-2.5 px-4 text-center w-full mt-2"
              >
                Explore How Moye Decides
              </Link>
            </div>
          )}

          {activeTab === "hive" && (
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-800">
                <HoneyDropIcon size={22} className="text-amber-800" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700">Healthy Habits</span>
                <h3 className="text-xl font-bold text-[var(--plum-900)] mt-0.5">Moyin&apos;s Hive &amp; Cap</h3>
              </div>
              <p className="text-xs text-[var(--fg-muted)] leading-relaxed [text-wrap:pretty]">
                Kids earn honey drops only for completed focus. No artificial scarcity or streak guilt. When the daily goal is reached, Moyin rests and displays &quot;Done for today&quot;.
              </p>
              <div className="pt-2 border-t border-[var(--border)] flex flex-col gap-2">
                <div className="flex items-center gap-2 text-xs font-bold text-[var(--plum-900)]">
                  <span className="w-2 h-2 rounded-sm bg-amber-500" />
                  <span>Select accessories to dress up Moyin</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-[var(--plum-900)]">
                  <span className="w-2 h-2 rounded-sm bg-purple-500" />
                  <span>Guilt-free Spark resting tokens</span>
                </div>
              </div>
              <Link
                href="/hive"
                className="btn-3d btn-3d-plum text-xs py-2.5 px-4 text-center w-full mt-2"
              >
                Visit Moyin&apos;s Hive
              </Link>
            </div>
          )}

          {activeTab === "grownups" && (
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-2xl bg-purple-100 border border-purple-300 flex items-center justify-center text-purple-800">
                <PrinterIcon size={20} className="text-purple-800" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-purple-700">For Parents &amp; Teachers</span>
                <h3 className="text-xl font-bold text-[var(--plum-900)] mt-0.5">Plain Language Reports</h3>
              </div>
              <p className="text-xs text-[var(--fg-muted)] leading-relaxed [text-wrap:pretty]">
                Zero clinical jargon or punitive scoreboards. Highlights where the child was confident, what needs gentle support, and curriculum alignment across national frameworks.
              </p>
              <div className="pt-2 border-t border-[var(--border)] flex flex-col gap-2">
                <div className="flex items-center gap-2 text-xs font-bold text-[var(--plum-900)]">
                  <span className="w-2 h-2 rounded-sm bg-teal-500" />
                  <span>Curriculum Lenses: UBE, NC, US Core</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-[var(--plum-900)]">
                  <span className="w-2 h-2 rounded-sm bg-purple-500" />
                  <span>Print-ready classroom summary</span>
                </div>
              </div>
              <Link
                href="/grownups"
                className="btn-3d btn-3d-card text-xs py-2.5 px-4 text-center w-full mt-2"
              >
                Open Teacher Portal
              </Link>
            </div>
          )}
        </div>

        {/* Center: High-Fidelity Smartphone Device Mockup */}
        <div className="relative order-1 lg:order-2 flex flex-col items-center">
          {/* Subtle phone shadow */}
          <div className="w-72 sm:w-84 h-[560px] sm:h-[600px] rounded-[3.2rem] bg-white border-[3px] border-[var(--plum-900)] shadow-[0_20px_50px_rgba(42,27,77,0.18),0_4px_0_#2A1B4D] overflow-hidden relative flex flex-col p-2.5 transition-all">
            
            {/* Phone Bezel Top: Speaker & Dynamic Island */}
            <div className="w-full flex items-center justify-between px-6 pt-2 pb-1.5 z-30">
              <span className="text-[11px] font-black text-[var(--plum-900)]">9:41</span>
              {/* Dynamic Island Pill */}
              <div className="w-20 h-4 rounded-full bg-[var(--plum-900)] flex items-center justify-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-teal-400" />
                <span className="text-[8px] font-bold text-white tracking-wider">OFFLINE</span>
              </div>
              <div className="flex items-center gap-1 text-[10px] font-bold text-[var(--plum-900)]">
                <span>100%</span>
              </div>
            </div>

            {/* Device Screen Viewport */}
            <div className={`w-full flex-1 rounded-[2.4rem] overflow-hidden flex flex-col bg-[var(--paper)] border border-[var(--border)] transition-all ${dyslexicFont ? "dyslexic-mode" : ""}`}>
              
              {/* Top Lesson Status Bar inside App */}
              <div className="px-4 py-2.5 bg-white border-b border-[var(--border)] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black lowercase text-[var(--plum-900)]">moye</span>
                  <span className="text-[10px] bg-[var(--plum-100)] text-[var(--plum-700)] font-black px-2 py-0.5 rounded-md border border-[var(--border)]">
                    maths
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200 text-xs font-black text-amber-800">
                    <HoneyDropIcon size={14} />
                    <span>14</span>
                  </div>
                  <div className="flex items-center gap-1 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200 text-xs font-black text-[var(--plum-700)]">
                    <DuoStreakFlame size={14} />
                    <span>3d</span>
                  </div>
                </div>
              </div>

              {/* TAB 1: FOCUS MODE LESSON SCREEN */}
              {activeTab === "focus" && (
                <div className="p-4 flex-1 flex flex-col justify-between overflow-y-auto">
                  {/* Top Bar with Calm Progress & Accessibility Switch */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-bold text-[var(--fg-muted)]">
                      <span>Question 2 of 5</span>
                      <button
                        type="button"
                        onClick={() => setDyslexicFont(!dyslexicFont)}
                        style={dyslexicFont ? { color: "#FFFFFF" } : undefined}
                        className={`px-2 py-0.5 rounded-md text-[10px] font-bold cursor-pointer transition-colors ${
                          dyslexicFont ? "bg-[var(--plum-700)] !text-white text-white" : "bg-[var(--plum-100)] text-[var(--plum-900)]"
                        }`}
                        title="Toggle Dyslexic Font spacing"
                      >
                        Dyslexia: {dyslexicFont ? "ON" : "OFF"}
                      </button>
                    </div>
                    {/* Visual Progress Bar (Zero timer!) */}
                    <div className="w-full h-2.5 bg-[var(--plum-100)] rounded-full overflow-hidden">
                      <div className="h-full bg-teal-500 rounded-full w-[40%]" />
                    </div>
                  </div>

                  {/* Question Box */}
                  <div className="my-2 p-3.5 bg-white rounded-2xl border-2 border-[var(--border)] shadow-xs flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-extrabold uppercase text-[var(--fg-muted)]">Count &amp; Match</span>
                      <button
                        type="button"
                        onClick={() => handleReadAloud("How many friendly dinosaurs are here? Count 3 dinosaurs.")}
                        className={`px-2 py-1 rounded-md border cursor-pointer flex items-center gap-1 text-[9px] font-bold transition-all ${
                          isSpeaking
                            ? "bg-teal-500 text-white border-teal-600 scale-105"
                            : "bg-[var(--plum-100)] text-[var(--plum-900)] border-[var(--border)] hover:bg-[var(--plum-200)]"
                        }`}
                        title="Read question aloud with Web Speech"
                      >
                        <SpeakerIcon size={11} />
                        <span>{isSpeaking ? "Reading..." : "Read Aloud"}</span>
                      </button>
                    </div>

                    <h4 className="text-base sm:text-lg font-black text-[var(--plum-900)] leading-tight">
                      How many friendly dinosaurs are here?
                    </h4>

                    {/* Cute Dino Counting Grid */}
                    <div className="flex items-center justify-center gap-4 py-2 bg-[var(--paper)] rounded-xl border border-[var(--border)]">
                      <div className="animate-bounce" style={{ animationDuration: "2s" }}>
                        <DinosaurIcon size={28} className="text-teal-600" />
                      </div>
                      <div className="animate-bounce" style={{ animationDuration: "2.3s" }}>
                        <DinosaurIcon size={28} className="text-teal-600" />
                      </div>
                      <div className="animate-bounce" style={{ animationDuration: "1.9s" }}>
                        <DinosaurIcon size={28} className="text-teal-600" />
                      </div>
                    </div>
                  </div>

                  {/* Interactive Chunky Answer Options */}
                  <div className="grid grid-cols-3 gap-2 my-1">
                    {[
                      { val: 2, correct: false },
                      { val: 3, correct: true },
                      { val: 4, correct: false },
                    ].map((opt) => {
                      const isSelected = selectedAnswer === opt.val;
                      let btnClasses = "bg-white border-2 border-[var(--border)] shadow-[0_3px_0_var(--border)] text-[var(--plum-900)]";
                      
                      if (isSelected) {
                        if (opt.correct) {
                          btnClasses = "bg-teal-50 border-2 border-teal-500 shadow-[0_3px_0_#12786B] text-teal-900";
                        } else {
                          btnClasses = "bg-rose-50 border-2 border-[var(--rose-400)] shadow-[0_3px_0_#C56884] text-rose-900";
                        }
                      }

                      return (
                        <button
                          key={opt.val}
                          type="button"
                          onClick={() => setSelectedAnswer(opt.val)}
                          className={`h-13 rounded-xl font-black text-lg transition-transform active:translate-y-1 active:shadow-none flex items-center justify-center cursor-pointer ${btnClasses}`}
                        >
                          {opt.val}
                        </button>
                      );
                    })}
                  </div>

                  {/* Feedback Box & Mascot */}
                  <div className="mt-1 pt-2 border-t border-[var(--border)] flex items-center justify-between">
                    <div className="flex-1 pr-2">
                      {selectedAnswer === 3 && (
                        <div className="flex items-center gap-1.5 text-xs font-black text-teal-800 bg-teal-100/80 px-2.5 py-1 rounded-xl">
                          <CheckIcon size={16} />
                          <span className="inline-flex items-center gap-1">
                            <span>Spot on! +1 Honey Drop</span>
                            <HoneyDropIcon size={14} />
                          </span>
                        </div>
                      )}
                      {selectedAnswer !== null && selectedAnswer !== 3 && (
                        <div className="flex items-center gap-1.5 text-xs font-bold text-rose-800 bg-rose-100/80 px-2.5 py-1 rounded-xl">
                          <RetryIcon size={16} />
                          <span>Almost! Let&apos;s count again.</span>
                        </div>
                      )}
                      {selectedAnswer === null && (
                        <span className="text-[11px] font-bold text-[var(--fg-muted)]">
                          Tap an answer above to try!
                        </span>
                      )}
                    </div>
                    <div className="shrink-0">
                      <MoyinMascot
                        pose={selectedAnswer === 3 ? "cheer" : selectedAnswer !== null ? "think" : "body-double"}
                        size={52}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: ADAPTIVE MASTERY ENGINE */}
              {activeTab === "mastery" && (
                <div className="p-4 flex-1 flex flex-col justify-between overflow-y-auto">
                  <div className="space-y-1">
                    <span className="text-[10px] font-extrabold uppercase text-[var(--fg-muted)]">Bayesian Knowledge Model</span>
                    <h4 className="text-base font-black text-[var(--plum-900)]">Active Skill: Number Bonds to 10</h4>
                  </div>

                  {/* Live Mastery Meter Card */}
                  <div className="p-4 bg-white rounded-2xl border-2 border-[var(--border)] shadow-xs space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[var(--fg-muted)]">Mastery Probability</span>
                      <span className="text-sm font-mono font-black text-teal-700">
                        p_known: {simulatedPKnown.toFixed(2)}
                      </span>
                    </div>

                    {/* Progress Bar with Optimal Zone Highlight */}
                    <div className="relative w-full h-4 bg-zinc-100 rounded-lg overflow-hidden border border-zinc-200">
                      {/* Optimal Challenge Target Zone (0.60 to 0.85) */}
                      <div className="absolute left-[60%] w-[25%] h-full bg-teal-200/50" title="Target Zone" />
                      {/* Actual P_Known Bar */}
                      <div
                        className="h-full bg-teal-500 rounded-lg transition-all duration-500"
                        style={{ width: `${Math.round(simulatedPKnown * 100)}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[10px] font-bold text-[var(--fg-muted)]">
                      <span>0.00 (New)</span>
                      <span className="text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200 inline-flex items-center gap-1">
                        <TargetIcon size={12} />
                        <span>Optimal Challenge Zone</span>
                      </span>
                      <span>1.00 (Mastered)</span>
                    </div>
                  </div>

                  {/* Interactive Engine Sandbox Stepper */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-extrabold text-[var(--fg-muted)] uppercase">Simulate Learner Action:</span>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setSimulatedPKnown((prev) => Math.min(0.95, Number((prev + 0.08).toFixed(2))))}
                        className="p-2 rounded-xl bg-teal-50 border border-teal-300 text-teal-800 text-xs font-bold cursor-pointer hover:bg-teal-100 active:scale-95 transition-all text-center"
                      >
                        + Correct Step
                      </button>
                      <button
                        type="button"
                        onClick={() => setSimulatedPKnown((prev) => Math.max(0.35, Number((prev - 0.09).toFixed(2))))}
                        className="p-2 rounded-xl bg-rose-50 border border-rose-300 text-rose-800 text-xs font-bold cursor-pointer hover:bg-rose-100 active:scale-95 transition-all text-center"
                      >
                        − Gentle Slip
                      </button>
                    </div>
                  </div>

                  {/* Next Step Prediction */}
                  <div className="p-3 bg-[var(--plum-100)] rounded-xl border border-[var(--border)] text-left">
                    <span className="text-[10px] font-bold uppercase text-[var(--plum-700)]">Next Lesson Action:</span>
                    <p className="text-xs font-bold text-[var(--plum-900)] mt-0.5">
                      {simulatedPKnown >= 0.85
                        ? "Advance to multi-digit bonds. Learner ready for next tier."
                        : simulatedPKnown <= 0.55
                        ? "Offering gentle visual counters with Moyin."
                        : "Question kept in the optimal challenge zone."}
                    </p>
                  </div>
                </div>
              )}

              {/* TAB 3: MOYIN'S HIVE & REWARDS */}
              {activeTab === "hive" && (
                <div className="p-4 flex-1 flex flex-col justify-between overflow-y-auto">
                  <div className="space-y-1">
                    <span className="text-[10px] font-extrabold uppercase text-[var(--fg-muted)]">Cozy Hive Bedroom</span>
                    <h4 className="text-base font-black text-[var(--plum-900)]">Moyin&apos;s Dressing Room</h4>
                  </div>

                  {/* Mascot Showcase with equipped cosmetic */}
                  <div className="p-4 bg-gradient-to-b from-amber-50/60 to-white rounded-2xl border-2 border-amber-200/80 flex flex-col items-center justify-center relative">
                    <div className="absolute top-2 right-2 flex items-center gap-1 bg-amber-100 px-2 py-0.5 rounded-md text-xs font-bold text-amber-900 border border-amber-300">
                      <HoneyDropIcon size={12} />
                      <span>24 Drops</span>
                    </div>

                    <MoyinMascot
                      pose="cheer"
                      size={100}
                      hat={equippedHat}
                      scarf={equippedScarf}
                    />

                    <span className="text-xs font-bold text-[var(--plum-900)] mt-2">
                      Moyin is cozy and proud!
                    </span>
                  </div>

                  {/* Interactive Wardrobe Selector */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold uppercase text-[var(--fg-muted)]">Equip Cosmetics:</span>
                    <div className="grid grid-cols-3 gap-1.5">
                      <button
                        type="button"
                        onClick={() => setEquippedHat(equippedHat === "hat-acorn" ? null : "hat-acorn")}
                        className={`p-2 rounded-xl border text-[11px] font-bold flex flex-col items-center gap-1 cursor-pointer transition-all ${
                          equippedHat === "hat-acorn"
                            ? "bg-amber-100 border-amber-400 text-amber-900"
                            : "bg-white border-[var(--border)] text-[var(--plum-900)]"
                        }`}
                      >
                        <AcornHatIcon size={20} />
                        <span>Acorn Cap</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setEquippedHat(equippedHat === "hat-honey-crown" ? null : "hat-honey-crown")}
                        className={`p-2 rounded-xl border text-[11px] font-bold flex flex-col items-center gap-1 cursor-pointer transition-all ${
                          equippedHat === "hat-honey-crown"
                            ? "bg-amber-100 border-amber-400 text-amber-900"
                            : "bg-white border-[var(--border)] text-[var(--plum-900)]"
                        }`}
                      >
                        <HoneyCrownIcon size={20} />
                        <span>Crown</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setEquippedScarf(equippedScarf === "scarf-teal" ? null : "scarf-teal")}
                        className={`p-2 rounded-xl border text-[11px] font-bold flex flex-col items-center gap-1 cursor-pointer transition-all ${
                          equippedScarf === "scarf-teal"
                            ? "bg-teal-100 border-teal-400 text-teal-900"
                            : "bg-white border-[var(--border)] text-[var(--plum-900)]"
                        }`}
                      >
                        <ScarfIcon size={20} />
                        <span>Knit Scarf</span>
                      </button>
                    </div>
                  </div>

                  {/* Soft Cap "Done for Today" Card */}
                  <div className="p-2.5 bg-purple-50 rounded-xl border border-purple-200 flex items-center justify-between text-left">
                    <div>
                      <span className="text-[10px] font-bold uppercase text-[var(--plum-700)]">Daily Goal Met</span>
                      <p className="text-[11px] font-bold text-[var(--plum-900)]">Done for today! Rest anytime.</p>
                    </div>
                    <span className="text-xs font-bold text-[var(--plum-700)] bg-purple-100 px-2 py-0.5 rounded-md">Resting</span>
                  </div>
                </div>
              )}

              {/* TAB 4: TEACHER & GROWN-UPS REPORT */}
              {activeTab === "grownups" && (
                <div className="p-4 flex-1 flex flex-col justify-between overflow-y-auto">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase text-[var(--fg-muted)]">Classroom &amp; Parent Sync</span>
                    <h4 className="text-base font-bold text-[var(--plum-900)]">Learner Summary: Amina</h4>
                  </div>

                  {/* Summary Card */}
                  <div className="p-3 bg-white rounded-2xl border-2 border-[var(--border)] shadow-xs space-y-2 text-left">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-[var(--plum-900)]">Curriculum: Nigeria (UBE)</span>
                      <span className="text-[10px] bg-teal-100 text-teal-800 font-bold px-2 py-0.5 rounded-md">
                        Primary 2
                      </span>
                    </div>
                    
                    <div className="p-2 rounded-lg bg-[var(--paper)] border border-[var(--border)] text-xs text-[var(--plum-900)] leading-relaxed">
                      &quot;Amina is thriving in visual addition and number patterns. When a regrouping step arose, she took time with audio hints with zero speed anxiety.&quot;
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[10px] font-bold pt-1">
                      <div className="bg-amber-50 p-1.5 rounded-md border border-amber-200 text-amber-900 flex items-center gap-1.5">
                        <HoneyDropIcon size={14} />
                        <span>14 Honey Earned</span>
                      </div>
                      <div className="bg-teal-50 p-1.5 rounded-md border border-teal-200 text-teal-900 flex items-center gap-1.5">
                        <TargetIcon size={14} />
                        <span>0 Timers Forced</span>
                      </div>
                    </div>
                  </div>

                  {/* Teacher Action Card */}
                  <div className="p-3 bg-[var(--plum-100)] rounded-xl border border-[var(--border)] text-left flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase text-[var(--plum-700)]">Teacher Next Step</span>
                      <p className="text-xs font-bold text-[var(--plum-900)]">Ready for word problems tomorrow.</p>
                    </div>
                    <SparkIcon size={16} className="text-[var(--plum-700)]" />
                  </div>
                </div>
              )}

              {/* Bottom Nav inside Phone */}
              <div className="px-6 py-2 bg-white border-t border-[var(--border)] flex items-center justify-around text-xs text-[var(--fg-muted)]">
                <button
                  type="button"
                  onClick={() => setActiveTab("focus")}
                  className={`flex flex-col items-center gap-0.5 cursor-pointer ${activeTab === "focus" ? "text-[var(--plum-700)] font-bold" : "text-zinc-400 font-semibold"}`}
                >
                  <TargetIcon size={16} />
                  <span className="text-[9px]">Lesson</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("mastery")}
                  className={`flex flex-col items-center gap-0.5 cursor-pointer ${activeTab === "mastery" ? "text-[var(--plum-700)] font-bold" : "text-zinc-400 font-semibold"}`}
                >
                  <DuoStreakFlame size={16} />
                  <span className="text-[9px]">Mastery</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("hive")}
                  className={`flex flex-col items-center gap-0.5 cursor-pointer ${activeTab === "hive" ? "text-[var(--plum-700)] font-bold" : "text-zinc-400 font-semibold"}`}
                >
                  <HoneyDropIcon size={16} />
                  <span className="text-[9px]">Hive</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("grownups")}
                  className={`flex flex-col items-center gap-0.5 cursor-pointer ${activeTab === "grownups" ? "text-[var(--plum-700)] font-bold" : "text-zinc-400 font-semibold"}`}
                >
                  <PrinterIcon size={16} />
                  <span className="text-[9px]">Report</span>
                </button>
              </div>

            </div>

            {/* Bottom Home Indicator Bar */}
            <div className="w-28 h-1 rounded-full bg-[var(--plum-200)] mx-auto mt-2 mb-0.5" />
          </div>
        </div>

        {/* Right Side: Key Architecture Highlights */}
        <div className="w-full lg:w-80 text-left bg-white/95 backdrop-blur-sm p-6 sm:p-7 rounded-3xl border-2 border-[var(--border)] shadow-[0_8px_20px_rgba(42,27,77,0.06)] order-3 flex flex-col justify-between">
          <div className="space-y-4">
            <span className="text-[11px] font-black uppercase tracking-wider text-[var(--plum-700)]">Engineering Moat</span>
            <h3 className="text-xl font-black text-[var(--plum-900)]">Built Without Gimmicks</h3>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-2xl bg-[var(--paper)] border border-[var(--border)] flex items-start gap-3">
                <span className="mt-0.5 shrink-0 text-[var(--plum-700)]"><SparkIcon size={18} /></span>
                <div>
                  <h4 className="font-black text-[var(--plum-900)]">100% Offline PWA</h4>
                  <p className="text-[var(--fg-muted)] mt-0.5 leading-relaxed">
                    Cached lesson bank in IndexedDB. Fully functional with Wi-Fi switched off.
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-[var(--paper)] border border-[var(--border)] flex items-start gap-3">
                <span className="mt-0.5 shrink-0 text-[var(--plum-700)]"><LockIcon size={18} /></span>
                <div>
                  <h4 className="font-black text-[var(--plum-900)]">Free Stack</h4>
                  <p className="text-[var(--fg-muted)] mt-0.5 leading-relaxed">
                    Browser Web Speech API, Supabase Auth &amp; RLS. No subscriptions or paid APIs required.
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-[var(--paper)] border border-[var(--border)] flex items-start gap-3">
                <span className="mt-0.5 shrink-0 text-teal-700"><DuoLeagueShield size={18} /></span>
                <div>
                  <h4 className="font-black text-[var(--plum-900)]">Deterministic Rigor</h4>
                  <p className="text-[var(--fg-muted)] mt-0.5 leading-relaxed">
                    Pass/fail, mastery, streaks, and honey rewards run in audited pure functions.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[var(--border)] flex items-center justify-between">
            <span className="text-[11px] font-bold text-[var(--fg-muted)]">Verified in Test Suite</span>
            <span className="text-xs font-mono font-black text-teal-700">100% Pass</span>
          </div>
        </div>

      </div>

      {/* PWA & Platform Install Badges */}
      <div className="mt-12 sm:mt-16 flex flex-col items-center gap-3">
        <span className="text-xs font-extrabold uppercase tracking-wider text-[var(--fg-muted)]">
          Install as an offline Progressive Web App
        </span>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/start"
            className="bg-white border-2 border-[var(--border)] rounded-2xl px-6 py-3 shadow-[0_4px_0_#D8CCE8] active:translate-y-1 active:shadow-none duo-card-hover cursor-pointer inline-flex items-center gap-3.5 transition-all hover:border-[var(--plum-500)] select-none"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="shrink-0">
              <path d="M18.71 19.5C17.88 20.74 17 21.95 15.66 21.97C14.32 22 13.89 21.18 12.37 21.18C10.84 21.18 10.37 21.95 9.1 22C7.79 22.05 6.8 20.68 5.96 19.47C4.25 17 2.94 12.45 4.7 9.39C5.57 7.87 7.13 6.91 8.82 6.88C10.1 6.86 11.32 7.75 12.11 7.75C12.89 7.75 14.37 6.68 15.92 6.84C16.57 6.87 18.39 7.1 19.56 8.82C19.47 8.88 17.39 10.1 17.41 12.63C17.44 15.65 20.06 16.66 20.09 16.67C20.06 16.74 19.67 18.11 18.71 19.5ZM15.97 4.9C16.63 4.1 17.08 2.99 16.96 1.88C15.99 1.92 14.81 2.53 14.12 3.33C13.51 4.04 12.98 5.17 13.12 6.27C14.2 6.35 15.31 5.7 15.97 4.9Z" fill="#2A1B4D"/>
            </svg>
            <div className="text-left flex flex-col justify-center">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[var(--fg-muted)] leading-tight">Install PWA on</span>
              <span className="text-sm font-black text-[var(--plum-900)] leading-tight mt-0.5">iOS &amp; iPadOS</span>
            </div>
          </Link>

          <Link
            href="/start"
            className="bg-white border-2 border-[var(--border)] rounded-2xl px-6 py-3 shadow-[0_4px_0_#D8CCE8] active:translate-y-1 active:shadow-none duo-card-hover cursor-pointer inline-flex items-center gap-3.5 transition-all hover:border-[var(--plum-500)] select-none"
          >
            <svg width="22" height="24" viewBox="0 0 24 24" fill="none" className="shrink-0">
              <path d="M3.6 1.8 C3.3 2.1 3.1 2.6 3.1 3.2 L3.1 20.8 C3.1 21.4 3.3 21.9 3.6 22.2 L12.6 12 L3.6 1.8 Z" fill="#2BB7A3"/>
              <path d="M16.5 8.1 L12.6 12 L16.5 15.9 L20.8 13.4 C21.6 12.9 21.6 12.1 20.8 11.6 L16.5 8.1 Z" fill="#F5A524"/>
              <path d="M3.6 1.8 L12.6 12 L16.5 8.1 L6.2 2.2 C5.2 1.6 4.3 1.5 3.6 1.8 Z" fill="#7C5CC4"/>
              <path d="M3.6 22.2 C4.3 22.5 5.2 22.4 6.2 21.8 L16.5 15.9 L12.6 12 L3.6 22.2 Z" fill="#E88AA6"/>
            </svg>
            <div className="text-left flex flex-col justify-center">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[var(--fg-muted)] leading-tight">Install PWA on</span>
              <span className="text-sm font-black text-[var(--plum-900)] leading-tight mt-0.5">Android &amp; Chrome</span>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
