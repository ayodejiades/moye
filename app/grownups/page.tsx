"use client";

import { ComfortButton } from "@/components/comfort-button";
import { CopySummaryButton } from "@/components/copy-summary-button";
import { useUiLanguage } from "@/lib/ui-language-context";

import { useState } from "react";
import Link from "next/link";
import {
  AdaAvatar,
  ChidiAvatar,
  SparkIcon,
  PrinterIcon,
  CheckIcon,
  RetryIcon,
} from "@/components/ui/svg-icons";

interface ChildProgress {
  name: string;
  Avatar: React.ComponentType<{ size?: number; className?: string }>;
  theme: string;
  strongSkills: string[];
  growingSkills: string[];
  focusDurationMin: number;
  bestTime: string;
  sparks: number;
  recentObservation: string;
}

const SAMPLE_CHILDREN: ChildProgress[] = [
  {
    name: "Anjola",
    Avatar: AdaAvatar,
    theme: "Dinosaurs",
    strongSkills: ["Counting objects to 10", "Recognizing number bonds"],
    growingSkills: ["Carrying digits in 2-digit sums"],
    focusDurationMin: 9,
    bestTime: "Morning (9:00 - 11:00 AM)",
    sparks: 4,
    recentObservation: "Anjola stays focused for about 9 minutes per session. Works best with dinosaur story problems and plantain chip currency word problems.",
  },
  {
    name: "Ayodeji",
    Avatar: ChidiAvatar,
    theme: "Football",
    strongSkills: ["Number line jumps", "Adding single digits"],
    growingSkills: ["Subtraction as take-away"],
    focusDurationMin: 12,
    bestTime: "Early Afternoon (1:00 - 2:00 PM)",
    sparks: 6,
    recentObservation: "High engagement when questions involve football pitch scenarios. Responds well to gentle second-try hints.",
  },
];

export default function GrownupsReportPage() {
  const [selectedChildIndex, setSelectedChildIndex] = useState(0);
  const { strings } = useUiLanguage();
  const [joinCode] = useState("MOYE-704");
  const child = SAMPLE_CHILDREN[selectedChildIndex];

  return (
    <div className="min-h-screen flex flex-col bg-[var(--paper)] text-[var(--plum-900)]">
      {/* Top Header */}
      <header className="w-full max-w-5xl mx-auto px-6 py-4 flex items-center justify-between border-b border-[var(--border)]">
        <div className="flex items-center gap-2.5">
          <Link
            href="/learn"
            className="font-semibold text-xs sm:text-sm text-[var(--plum-700)] hover:text-[var(--plum-900)] px-3 py-1.5 rounded-lg border border-[var(--border)] bg-white shadow-2xs hover:border-[var(--plum-400)] active:translate-y-0.5 transition-all"
          >
            Learning Path
          </Link>
          <span className="text-[var(--fg-muted)] opacity-40">/</span>
          <span className="text-base sm:text-lg font-bold text-[var(--plum-900)]">
            Grown-Ups &amp; Teachers Portal
          </span>
        </div>
        <div className="flex items-center gap-2 bg-[var(--plum-100)] border border-[var(--plum-500)] text-[var(--plum-900)] px-3 py-1 rounded-xl text-xs font-bold">
          <span>Class Code:</span>
          <span className="font-mono text-sm text-[var(--plum-700)]">{joinCode}</span>
        </div>
        <ComfortButton />
      </header>

      <main className="flex-1 max-w-5xl mx-auto px-6 py-8 flex flex-col w-full space-y-8">
        {/* Child Selector Tabs */}
        <div className="flex items-center gap-3 overflow-x-auto pb-2">
          {SAMPLE_CHILDREN.map((c, idx) => (
            <button
              key={c.name}
              type="button"
              onClick={() => setSelectedChildIndex(idx)}
              className={`flex items-center gap-2.5 px-5 py-3 rounded-2xl font-bold text-sm border-2 transition-all ${
                selectedChildIndex === idx
                  ? "bg-white border-[var(--plum-700)] shadow-md text-[var(--plum-900)]"
                  : "bg-white/60 border-[var(--border)] text-[var(--fg-muted)] hover:bg-white"
              }`}
            >
              <c.Avatar size={28} className="shrink-0" />
              <span>{c.name}</span>
              <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-md inline-flex items-center gap-1">
                <SparkIcon size={12} />
                <span>{c.sparks}d</span>
              </span>
            </button>
          ))}
        </div>

        {/* Weekly Report Card (SPEC.md §5.6 - Plain language rules, zero jargon) */}
        <div
          data-demo="weekly-report"
          className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-[var(--border)] shadow-sm space-y-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border)] pb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--teal-700)] bg-teal-50 px-2.5 py-1 rounded-md border border-teal-200">
                Weekly Plain-Language Summary
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold mt-2">
                {strings.reportHeading.replace("this child", child.name)}
              </h1>
            </div>
            <div className="flex flex-col items-start gap-2 sm:items-end">
              <button
                type="button"
                onClick={() => {
                  if (typeof window !== "undefined") window.print();
                }}
                className="btn-3d btn-3d-plum text-base flex items-center gap-2"
              >
                <PrinterIcon size={16} />
                <span>Print Report</span>
              </button>
              {/* Copy only: no email, no send, nothing leaves the device (features.md B9) */}
              <CopySummaryButton
                summary={{
                  childName: child.name,
                  strongSkills: child.strongSkills,
                  growingSkills: child.growingSkills,
                  focusMinutes: child.focusDurationMin,
                  sparks: child.sparks,
                  curriculum: child.theme === "Dinosaurs" ? "Nigeria UBE" : "England National Curriculum",
                }}
              />
            </div>
          </div>

          {/* Key Indicators in Plain Words */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-[var(--plum-100)] rounded-2xl p-4 border border-[var(--plum-500)] flex flex-col justify-between">
              <span className="text-xs font-bold text-[var(--plum-700)] uppercase">Focus Span</span>
              <span className="text-2xl font-extrabold text-[var(--plum-900)] mt-1">
                About {child.focusDurationMin} mins
              </span>
              <span className="text-xs text-[var(--fg-muted)] mt-1">
                Healthy, unhurried learning blocks with no timer stress.
              </span>
            </div>

            <div className="bg-teal-50 rounded-2xl p-4 border border-[var(--teal-500)] flex flex-col justify-between">
              <span className="text-xs font-bold text-[var(--teal-700)] uppercase">Best Learning Time</span>
              <span className="text-xl font-extrabold text-[var(--teal-700)] mt-1">
                {child.bestTime}
              </span>
              <span className="text-xs text-[var(--fg-muted)] mt-1">
                Highest focus and accuracy recorded here.
              </span>
            </div>

            <div className="bg-amber-50 rounded-2xl p-4 border border-[var(--honey-500)] flex flex-col justify-between">
              <span className="text-xs font-bold text-[var(--honey-700)] uppercase">Spark Streak</span>
              <span className="text-2xl font-extrabold text-[var(--honey-700)] mt-1">
                {child.sparks} Days Strong
              </span>
              <span className="text-xs text-[var(--honey-700)] mt-1">
                Rest-day tokens protected progress without guilt.
              </span>
            </div>
          </div>

          {/* Teacher / Parent Narrative */}
          <div className="space-y-4 pt-2">
            <div>
              <h2 className="font-bold text-base text-[var(--plum-900)]">Teacher Observations</h2>
              <p className="text-base text-[var(--plum-900)] leading-relaxed mt-1 bg-neutral-50 p-4 rounded-2xl border border-[var(--border)]">
                {child.recentObservation}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-teal-50/60 border border-teal-200">
                <h3 className="font-bold text-sm text-[var(--teal-700)] flex items-center gap-1.5">
                  <CheckIcon size={16} />
                  <span>Strong Skills</span>
                </h3>
                <ul className="list-disc list-inside mt-2 text-sm text-[var(--plum-900)] space-y-1">
                  {child.strongSkills.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-2xl bg-rose-50/60 border border-rose-200">
                <h3 className="font-bold text-sm text-rose-700 flex items-center gap-1.5">
                  <RetryIcon size={16} />
                  <span>What We&apos;re Practicing Next</span>
                </h3>
                <ul className="list-disc list-inside mt-2 text-sm text-[var(--plum-900)] space-y-1">
                  {child.growingSkills.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
