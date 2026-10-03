"use client";

import { ComfortButton } from "@/components/comfort-button";
import { ReviewCard } from "@/components/review-card";
import { EnergyCheckIn } from "@/components/energy-checkin";
import { InstallPrompt } from "@/components/install-prompt";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMoyeStore } from "@/lib/moye-store";
import { useAccessibility } from "@/lib/accessibility-context";
import { MoyinMascot } from "@/components/moyin-mascot";
import {
  StarIcon,
  CoinIcon,
  BundleBoxIcon,
  DinoShapesIcon,
  HoneyDropIcon,
  LockIcon,
  CheckIcon,
  SparkIcon,
} from "@/components/ui/svg-icons";

interface SkillNode {
  id: string;
  levelNumber: number;
  title: string;
  subtitle: string;
  Icon: React.ComponentType<{ size?: number; className?: string }>;
}

const SKILL_NODES: SkillNode[] = [
  { id: "s1", levelNumber: 1, title: "Counting & Stories", subtitle: "Count fossil stones (15 questions)", Icon: StarIcon },
  { id: "s2", levelNumber: 2, title: "Money & Snacks", subtitle: "Spend plantain chips coins (15 questions)", Icon: CoinIcon },
  { id: "s3", levelNumber: 3, title: "Bundles of Ten", subtitle: "Place value tens & ones (15 questions)", Icon: BundleBoxIcon },
  { id: "s4", levelNumber: 4, title: "Dino Shapes", subtitle: "Symmetry & 2D blocks (15 questions)", Icon: DinoShapesIcon },
];

/** Mascot encouragement lines based on progress */
function getMascotMessage(completedCount: number, nextTitle: string | null): string {
  if (completedCount === 0) return "Let\u2019s start with the first level together!";
  if (completedCount >= SKILL_NODES.length) return "You mastered everything! Amazing work!";
  if (nextTitle) return `You\u2019re doing great! Ready for ${nextTitle}?`;
  return "Keep going, you\u2019re learning so much!";
}

export default function LearnPathPage() {
  const { state } = useMoyeStore();
  const router = useRouter();
  // Energy check in shows once per browser, before the first session of the day.
  const [energyAsked, setEnergyAsked] = useState(false);
  const { dyslexicFont, setDyslexicFont } = useAccessibility();

  const completedCount = state.completedLevels.length;
  // Find the first unlocked-but-not-completed level (the "active" one)
  const activeNodeIndex = SKILL_NODES.findIndex(
    (n) => state.unlockedLevels.includes(n.id) && !state.completedLevels.includes(n.id)
  );
  const nextTitle = activeNodeIndex >= 0 ? SKILL_NODES[activeNodeIndex].title : null;
  const mascotMessage = getMascotMessage(completedCount, nextTitle);

  return (
    <div className="min-h-screen flex flex-col bg-[var(--paper)] text-[var(--plum-900)]">
      {/* ─── Top Header ─── */}
      <header className="w-full border-b border-[var(--border)] bg-white">
        <div className="max-w-5xl mx-auto px-6 py-3 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold tracking-tight text-[var(--plum-900)] lowercase select-none">
            moye
          </Link>
          <div className="flex items-center gap-3">
            {/* Spark Streak */}
            <div className="flex items-center gap-1.5 text-sm font-bold text-[var(--plum-700)] bg-[var(--plum-100)] px-3 py-1 rounded-lg border border-[var(--border)]">
              <SparkIcon size={16} />
              <span>{state.streakDays}</span>
            </div>
            {/* Honey */}
            <Link
              href="/hive"
              className="flex items-center gap-1.5 text-sm font-bold text-[var(--honey-700)] bg-amber-50 px-3 py-1 rounded-lg border border-amber-300"
            >
              <HoneyDropIcon size={18} />
              <span>{state.honeyBalance}</span>
            </Link>
            {/* Direct dyslexia toggle (one tap comfortable reading) */}
            <button
              type="button"
              onClick={() => setDyslexicFont(!dyslexicFont)}
              aria-label={dyslexicFont ? "Turn off comfortable reading" : "Turn on comfortable reading"}
              aria-pressed={dyslexicFont}
              data-demo="a11y-dyslexia-quick"
              title={dyslexicFont ? "Comfortable reading on" : "Comfortable reading off"}
              className={`h-8 px-3 rounded-lg border text-sm font-semibold flex items-center gap-1.5 transition-colors ${
                dyslexicFont
                  ? "bg-[var(--plum-700)] text-white border-[var(--plum-700)]"
                  : "bg-white text-[var(--plum-700)] border-[var(--border)] hover:bg-[var(--plum-100)]"
              }`}
            >
              <span aria-hidden="true" className="text-sm leading-none font-semibold">Aa</span>
              <span className="hidden sm:inline text-sm">{dyslexicFont ? "On" : "Comfortable reading"}</span>
            </button>
            {/* Grown-ups */}
            <Link href="/grownups" className="text-xs font-bold text-[var(--plum-700)] hover:underline hidden sm:block">
              Grown-ups
            </Link>
            <ComfortButton />
          </div>
        </div>
      </header>

      {/* ─── Main Content: 2-column on desktop ─── */}
      <div className="flex-1 w-full max-w-5xl mx-auto px-6 py-8 flex flex-col lg:flex-row gap-8 lg:gap-12">

        {/* ─── Left Column: Path ─── */}
        <main className="flex-1 max-w-lg mx-auto lg:mx-0 w-full flex flex-col gap-6">

          {/* Unit Progress Header Card */}
          <div className="bg-white rounded-2xl border-2 border-[var(--border)] p-4 sm:p-6 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--fg-muted)]">Unit 1</span>
              <h1 className="text-xl font-bold mt-0.5">Early Numbers & Money</h1>
              <p className="text-xs text-[var(--fg-muted)] mt-1">
                {completedCount} of {SKILL_NODES.length} levels mastered
              </p>
            </div>
            {/* Mini progress bar */}
            <div className="flex flex-col items-end gap-1.5 shrink-0">
              <span className="text-sm font-bold text-[var(--plum-700)]">
                {Math.round((completedCount / SKILL_NODES.length) * 100)}%
              </span>
              <div className="w-20 h-2 bg-[var(--plum-100)] rounded-lg overflow-hidden border border-[var(--border)]">
                <div
                  className="h-full bg-[var(--teal-500)] transition-all duration-500 rounded-lg"
                  style={{ width: `${(completedCount / SKILL_NODES.length) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Energy check in, once per browser, then straight into the path (features.md B10) */}
          {energyAsked ? (
            <EnergyCheckIn onStart={() => setEnergyAsked(false)} />
          ) : (
            <button
              type="button"
              data-demo="energy-open"
              onClick={() => setEnergyAsked(true)}
              className="btn-3d btn-3d-card text-base self-start"
            >
              Check in: how is your energy?
            </button>
          )}

          {/* Something worth another look, only when something is due (features.md B4) */}
          <ReviewCard onStart={(_skillId, levelId) => router.push(`/lesson?level=${levelId}`)} />

          {/* ─── Connected Path with Spine ─── */}
          <div className="relative w-full">
            {/* Vertical connecting spine */}
            <div
              className="absolute left-[31px] top-6 bottom-6 w-0.5 bg-[var(--border)]"
              aria-hidden="true"
            />
            {/* Completed portion of spine */}
            {completedCount > 0 && (
              <div
                className="absolute left-[31px] top-6 w-0.5 bg-[var(--teal-500)] transition-all duration-500 z-[1]"
                aria-hidden="true"
                style={{
                  height: `${Math.min(
                    ((completedCount) / SKILL_NODES.length) * 100,
                    100
                  )}%`,
                }}
              />
            )}

            <div className="relative z-[2] space-y-0">
              {SKILL_NODES.map((node, index) => {
                const isCompleted = state.completedLevels.includes(node.id);
                const isUnlocked = state.unlockedLevels.includes(node.id);
                const isActive = isUnlocked && !isCompleted;
                const isLast = index === SKILL_NODES.length - 1;

                return (
                  <div key={node.id} className="relative">
                    {/* ─── Mascot with Speech Bubble at Active Level ─── */}
                    {isActive && (
                      <div className="flex items-start gap-3 pb-3 pl-16">
                        <MoyinMascot
                          pose={completedCount === 0 ? "smile" : "cheer"}
                          size={72}
                          hat={state.equippedHat}
                          glasses={state.equippedGlasses}
                          scarf={state.equippedScarf}
                          pet={state.equippedPet}
                        />
                        <div className="relative bg-white rounded-xl border-2 border-[var(--border)] px-3 py-2 shadow-xs max-w-[220px]">
                          {/* Speech bubble arrow */}
                          <div className="absolute -left-2 top-4 w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-r-[8px] border-r-[var(--border)]" aria-hidden="true" />
                          <div className="absolute -left-[6px] top-4 w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-r-[8px] border-r-white" aria-hidden="true" />
                          <p className="text-xs font-semibold text-[var(--plum-900)] leading-relaxed [text-wrap:pretty]">
                            {mascotMessage}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* ─── Level Node Card ─── */}
                    <div
                      className={`relative flex items-center gap-4 rounded-2xl border-2 p-4 transition-all ${
                        !isLast ? "mb-3" : ""
                      } ${
                        isCompleted
                          ? "bg-teal-50/70 border-[var(--teal-500)]"
                          : isActive
                          ? "bg-white border-[var(--plum-700)] shadow-md"
                          : "bg-zinc-50 border-zinc-200 opacity-60"
                      }`}
                    >
                      {/* Node Circle (sits on the spine) */}
                      <div
                        className={`h-[40px] w-[40px] rounded-xl flex items-center justify-center shrink-0 ${
                          isCompleted
                            ? "bg-[var(--teal-500)] text-white"
                            : isActive
                            ? "bg-[var(--plum-100)] text-[var(--plum-700)]"
                            : "bg-zinc-200 text-zinc-400"
                        }`}
                      >
                        {isCompleted ? <CheckIcon size={20} /> : <node.Icon size={22} />}
                      </div>

                      {/* Text */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--fg-muted)]">
                            Level {node.levelNumber}
                          </span>
                          {isCompleted && (
                            <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-[var(--teal-700)] bg-teal-100 px-1.5 py-0.5 rounded border border-[var(--teal-500)]">
                              Mastered
                            </span>
                          )}
                        </div>
                        <h2 className="font-bold text-base truncate">{node.title}</h2>
                        <p className="text-xs text-[var(--fg-muted)]">{node.subtitle}</p>
                      </div>

                      {/* Action */}
                      <div className="shrink-0">
                        {isCompleted ? (
                          <Link
                            href={`/lesson?level=${node.id}`}
                            className="btn-3d btn-3d-teal text-xs py-2 px-3"
                          >
                            Review
                          </Link>
                        ) : isActive ? (
                          <Link
                            href={`/lesson?level=${node.id}`}
                            className="btn-3d btn-3d-plum text-xs py-2 px-4"
                          >
                            Start
                          </Link>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-500 bg-zinc-200 px-3 py-1.5 rounded-xl">
                            <LockIcon size={13} />
                            <span>Locked</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </main>

        {/* ─── Right Column: Moyin Side Panel (Desktop Only) ─── */}
        <aside className="hidden lg:flex flex-col gap-6 w-72 shrink-0 pt-2">
          {/* Moyin Outfit Preview */}
          <div className="bg-white rounded-2xl border-2 border-[var(--border)] p-6 flex flex-col items-center text-center">
            <MoyinMascot
              pose="idle"
              size={110}
              hat={state.equippedHat}
              glasses={state.equippedGlasses}
              scarf={state.equippedScarf}
              pet={state.equippedPet}
            />
            <h3 className="text-sm font-bold mt-3">{state.activeProfileName}&apos;s Moyin</h3>
            <p className="text-xs text-[var(--fg-muted)] mt-1">
              {state.equippedHat || state.equippedGlasses || state.equippedScarf || state.equippedPet
                ? "Looking great with the new gear!"
                : "Earn honey to unlock outfits"}
            </p>
            <Link
              href="/hive"
              className="btn-3d btn-3d-card text-xs py-1.5 px-4 mt-3"
            >
              Visit Hive
            </Link>
          </div>

          {/* Install Moye on this device. A button the visitor chooses, never a popup. */}
          <InstallPrompt />

          {/* Calm Reminder Card */}
          <div className="bg-amber-50/60 rounded-2xl border-2 border-amber-200 p-4 text-center">
            <HoneyDropIcon size={24} className="mx-auto text-[var(--honey-700)]" />
            <p className="text-sm font-bold text-[var(--honey-700)] mt-2">No rush, no timers</p>
            <p className="text-xs text-[var(--fg-muted)] mt-1 [text-wrap:pretty]">
              Done for today whenever you want. Moyin will be right here when you come back.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-2xl border-2 border-[var(--border)] p-4 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--fg-muted)]">Quick Stats</h3>
            <div className="flex items-center justify-between">
              <span className="text-xs text-[var(--fg-muted)]">Honey earned</span>
              <span className="text-sm font-bold text-[var(--honey-700)]">{state.honeyBalance}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-[var(--fg-muted)]">Spark streak</span>
              <span className="text-sm font-bold text-[var(--plum-700)]">{state.streakDays} days</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-[var(--fg-muted)]">Levels mastered</span>
              <span className="text-sm font-bold text-[var(--teal-700)]">{completedCount} / {SKILL_NODES.length}</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
