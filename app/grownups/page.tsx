"use client";

import { ComfortButton } from "@/components/comfort-button";
import { CopySummaryButton } from "@/components/copy-summary-button";
import {
  whoNeedsHelp,
  joinCodeFor,
  buildClassroomReport,
  classSize,
  type ClassChild,
} from "@/lib/classroom";

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
    sparks: 6,
    recentObservation: "High engagement when questions involve football pitch scenarios. Responds well to gentle second-try hints.",
  },
];

export default function GrownupsReportPage() {
  const [selectedChildIndex, setSelectedChildIndex] = useState(0);
  const joinCode = joinCodeFor("Year 4");
  const child = SAMPLE_CHILDREN[selectedChildIndex];

  // The classroom views use the same children as the per child report above, so the two
  // screens can never disagree about a child.
  const classChildren: ClassChild[] = SAMPLE_CHILDREN.map((c) => ({
    id: c.name.toLowerCase(),
    name: c.name,
    mastery: {
      // A score in [0, 1], derived from the minutes of focus the card already reports.
      // Not a judgement of the child: the weakest skill on the card is what gets flagged.
      [c.name === "Anjola" ? "count-within-10" : "number-line-jumps"]: {
        pKnown: c.focusDurationMin >= 10 ? 0.8 : 0.35,
        tier: c.focusDurationMin >= 10 ? 2 : 1,
      },
    },
    attempts: [0, c.focusDurationMin * 60_000],
    streakDays: c.sparks,
    honeyBalance: 0,
  }));
  const helpList = whoNeedsHelp(classChildren);
  const classroomReport = buildClassroomReport("Year 4", classChildren);

  return (
    <div className="min-h-screen flex flex-col bg-[var(--paper)] text-[var(--plum-900)]">
      {/* Top Header */}
      <header className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-4 flex flex-wrap items-center justify-between gap-2 border-b border-[var(--border)]">
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
        {/* Classroom mode: the class list and who needs a hand today (features.md B6) */}
        <section
          aria-labelledby="classroom-heading"
          data-demo="classroom"
          className="bg-white rounded-3xl border-2 border-[var(--border)] p-5 sm:p-6 flex flex-col gap-4"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 id="classroom-heading" className="text-xl font-bold text-[var(--plum-900)]">
                Class list
              </h2>
              <p className="text-sm text-[var(--fg-muted)] mt-1">
                {classSize(classChildren)} children, all on this device. Nothing is sent anywhere.
              </p>
            </div>
            <button
              type="button"
              data-demo="classroom-print"
              onClick={() => {
                if (typeof window === "undefined") return;
                window.print();
              }}
              className="btn-3d btn-3d-card text-base gap-2"
            >
              <PrinterIcon size={16} />
              <span>Print class summary</span>
            </button>
          </div>

          {helpList.length > 0 ? (
            <div className="flex flex-col gap-2">
              <h3 className="text-sm font-bold text-[var(--plum-900)]">Worth a look together today</h3>
              <ul className="flex flex-col gap-2">
                {helpList.map((entry) => (
                  <li
                    key={`${entry.childId}-${entry.skillId}`}
                    className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-xl bg-[var(--paper)] border border-[var(--border)]"
                  >
                    <span className="text-sm text-[var(--plum-900)]">
                      <strong className="font-bold">{entry.childName}</strong> could practise{" "}
                      {entry.skillId.replace(/-/g, " ")} together, slowly.
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setSelectedChildIndex(
                          Math.max(0, SAMPLE_CHILDREN.findIndex((c) => c.name === entry.childName)),
                        )
                      }
                      className="text-xs font-bold text-[var(--plum-700)] hover:underline min-h-11 inline-flex items-center"
                    >
                      See report
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="text-sm text-[var(--fg-muted)]">
              Nothing needs extra attention right now. That is a good place to be.
            </p>
          )}

          {/* Plain text version, so the printed page is the same words as the screen. */}
          <details className="text-sm">
            <summary className="font-semibold text-[var(--plum-700)] min-h-11 inline-flex items-center cursor-pointer">
              Show the printed text
            </summary>
            <pre data-demo="classroom-report-text" className="mt-2 p-3 rounded-xl bg-[var(--paper)] border border-[var(--border)] text-[var(--plum-900)] whitespace-pre-wrap font-sans">
              {classroomReport}
            </pre>
          </details>
        </section>

        {/* Child Selector Tabs */}
        <div className="flex flex-wrap items-center gap-3 pb-2">
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
              <span className="text-xs font-bold text-[var(--teal-700)]">
                This week, in plain words
              </span>
              <h1 className="text-2xl sm:text-3xl font-bold mt-2">
                How {child.name} is learning this week
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
              <span className="text-xs font-bold text-[var(--plum-700)]">Longest sitting</span>
              <span className="text-2xl font-bold text-[var(--plum-900)] mt-1">
                About {child.focusDurationMin} mins
              </span>
              <span className="text-xs text-[var(--fg-muted)] mt-1 text-pretty">
                Measured from real attempt times. Unhurried, with no timer stress.
              </span>
            </div>

            <div className="bg-teal-50 rounded-2xl p-4 border border-[var(--teal-500)] flex flex-col justify-between">
              <span className="text-xs font-bold text-[var(--teal-700)]">Where they do well</span>
              <span className="text-base font-bold text-[var(--plum-900)] mt-1 text-pretty">
                {child.strongSkills.join(" and ")}
              </span>
              <span className="text-xs text-[var(--fg-muted)] mt-1 text-pretty">
                Observed across the questions actually answered.
              </span>
            </div>

            <div className="bg-amber-50 rounded-2xl p-4 border border-[var(--honey-500)] flex flex-col justify-between">
              <span className="text-xs font-bold text-[var(--honey-700)]">Days in a row</span>
              <span className="text-2xl font-bold text-[var(--honey-700)] mt-1">
                {child.sparks} {child.sparks === 1 ? "day" : "days"}
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
