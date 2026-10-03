"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useMoyeStore } from "@/lib/moye-store";
import { MoyinMascot } from "@/components/moyin-mascot";
import { HoneyJarIcon, SparkIcon, CheckIcon } from "@/components/ui/svg-icons";
import { ComfortButton } from "@/components/comfort-button";
import { useUiLanguage } from "@/lib/ui-language-context";

function DoneContent() {
  const { state } = useMoyeStore();
  const { strings } = useUiLanguage();
  const searchParams = useSearchParams();
  const levelParam = searchParams.get("level") || "s1";

  const levelNames: Record<string, string> = {
    s1: "Level 1: Counting & Stories",
    s2: "Level 2: Money & Snacks",
    s3: "Level 3: Bundles of Ten",
    s4: "Level 4: Dino Shapes",
  };

  const currentLevelName = levelNames[levelParam] || "Level 1";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--paper)] text-[var(--plum-900)] px-6 py-12">
      <div className="w-full max-w-md flex justify-end mb-4">
        <ComfortButton />
      </div>
      <div
        data-demo="done-for-today"
        className="max-w-md w-full bg-white rounded-3xl p-8 border-2 border-[var(--border)] shadow-sm text-center space-y-6"
      >
        <div className="flex justify-center">
          <MoyinMascot pose="sleepy" size={160} />
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 bg-teal-50 border border-[var(--teal-500)] text-[var(--teal-700)] px-3 py-1 rounded-lg text-xs font-bold">
            <CheckIcon size={14} />
            <span>{currentLevelName} Complete (15 Questions Mastered)</span>
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-[var(--plum-900)]">
            {strings.doneForToday}
          </h1>
          <p className="text-base text-[var(--fg-muted)] leading-relaxed">
            All 15 questions mastered. Next level unlocked automatically! Moyin is proud of you.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 py-2">
          <div className="bg-amber-50 rounded-2xl p-4 border border-[var(--honey-500)] flex flex-col items-center">
            <HoneyJarIcon size={34} />
            <span className="text-xl font-bold text-[var(--honey-700)] mt-1">+{state.honeyBalance}</span>
            <span className="text-xs font-semibold text-[var(--honey-700)]">Honey Earned</span>
          </div>
          <div className="bg-[var(--plum-100)] rounded-2xl p-4 border border-[var(--plum-500)] flex flex-col items-center">
            <SparkIcon size={34} />
            <span className="text-xl font-bold text-[var(--plum-900)] mt-1">{state.streakDays} Days</span>
            <span className="text-xs font-semibold text-[var(--plum-700)]">Spark Streak</span>
          </div>
        </div>

        <div className="bg-purple-50/60 rounded-2xl p-4 text-xs text-[var(--plum-700)] text-left">
          <span className="font-bold">Next level ready: </span>
          <span>Explore the next unlocked node on your learning path!</span>
        </div>

        <div className="flex flex-col gap-3 pt-2">
          <Link
            href="/learn"
            className="btn-3d btn-3d-teal w-full text-base py-3"
          >
            Continue to Next Level
          </Link>
          <Link
            href="/hive"
            className="btn-3d btn-3d-honey w-full text-base"
          >
            Visit Moyin&apos;s Hive
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function DoneForTodayPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[var(--paper)]" />}>
      <DoneContent />
    </Suspense>
  );
}
