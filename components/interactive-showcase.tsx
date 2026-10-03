"use client";

import { useEffect, useState, type KeyboardEvent } from "react";
import { useAccessibility } from "@/lib/accessibility-context";
import { MoyinMascot } from "@/components/moyin-mascot";
import {
  HoneyDropIcon,
  SpeakerIcon,
  CheckIcon,
  RetryIcon,
  DuoStreakFlame,
  DinosaurIcon,
  PrinterIcon,
  TargetIcon,
  StarIcon,
} from "@/components/ui/svg-icons";
import { TABS, type ShowcaseTabId } from "./showcase/showcase-tabs";
import { step } from "./showcase/step";
import { StoryCard, UnderTheHoodCard } from "./showcase/story-cards";
import {
  PhoneFrame,
  PhoneStatusBar,
  MasteryScreen,
  HiveScreen,
  GrownupsScreen,
} from "./showcase/phone-frame";

const QUESTION = "How many friendly dinosaurs are here? Count 3 dinosaurs.";

const OPTIONS = [
  { val: 2, correct: false },
  { val: 3, correct: true },
  { val: 4, correct: false },
];

type Story = {
  eyebrow: string;
  title: string;
  body: string;
  accent: "teal" | "plum" | "honey" | "rose";
  icon: React.ReactNode;
  bullets: string[];
  cta: { label: string; href: string };
};

const STORY: Record<ShowcaseTabId, Story> = {
  focus: {
    eyebrow: "No timer panic",
    title: "Focus Mode lesson",
    body: "One gentle question at a time. No countdown and no buzzer. Every question can be read aloud, and one tap switches to dyslexia friendly spacing.",
    accent: "teal",
    icon: <TargetIcon size={22} />,
    bullets: ["Tap answers on the phone screen", "Toggle dyslexia spacing in one tap"],
    cta: { label: "Try the full lesson", href: "/start" },
  },
  mastery: {
    eyebrow: "Adjusts to each child",
    title: "Difficulty that adapts",
    body: "Plain maths, not guesswork. Moyin checks what the child has understood after every answer and picks the next question from that.",
    accent: "plum",
    icon: <StarIcon size={22} />,
    bullets: ["Comfortable range sits between 0.60 and 0.85", "No chatbot decides the difficulty"],
    cta: { label: "See how Moye decides", href: "/proof" },
  },
  hive: {
    eyebrow: "Healthy habits",
    title: "Moyin's hive and cap",
    body: "Children earn honey only for finished focus work. When the daily goal is reached, Moyin rests and the screen says done for today.",
    accent: "honey",
    icon: <HoneyDropIcon size={22} />,
    bullets: ["Tap an accessory to dress Moyin", "Rest tokens that never scold"],
    cta: { label: "Open Moyin's hive", href: "/hive" },
  },
  grownups: {
    eyebrow: "For parents and teachers",
    title: "Plain language reports",
    body: "No clinical jargon and no scoreboards. It shows where the child was confident, what needs gentle support, and how that maps to the classroom curriculum.",
    accent: "rose",
    icon: <PrinterIcon size={20} />,
    bullets: ["Curriculum lenses for Nigeria, England and the US", "A printable class summary"],
    cta: { label: "Open the teacher portal", href: "/grownups" },
  },
};

export function InteractiveAppShowcase() {
  const { dyslexicFont, setDyslexicFont } = useAccessibility();
  const [activeTab, setActiveTab] = useState<ShowcaseTabId>("focus");
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [pKnown, setPKnown] = useState(0.74);
  const [hat, setHat] = useState<string | null>("hat-acorn");
  const [scarf, setScarf] = useState<string | null>(null);

  useEffect(() => {
    if (!isSpeaking || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(QUESTION);
    utterance.rate = 0.9;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
    return () => window.speechSynthesis.cancel();
  }, [isSpeaking]);

  function onTabKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    const i = TABS.findIndex((t) => t.id === activeTab);
    if (e.key === "ArrowRight") {
      e.preventDefault();
      setActiveTab(TABS[(i + 1) % TABS.length].id);
    }
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      setActiveTab(TABS[(i + TABS.length - 1) % TABS.length].id);
    }
  }

  const story = STORY[activeTab];
  const pose = selectedAnswer === 3 ? "cheer" : selectedAnswer !== null ? "think" : "body-double";

  return (
    <section className="relative overflow-hidden bg-[var(--plum-100)] border-y border-[var(--border)] py-16 sm:py-24 px-4 sm:px-6 text-center select-none">
      <div className="max-w-4xl mx-auto flex flex-col items-center gap-4 relative">
        <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-[var(--plum-900)] leading-tight">
          See how Moye works
        </h2>
        <p className="text-sm sm:text-base text-[var(--fg-muted)] max-w-xl font-medium">
          Try four parts of Moye: calm lessons, difficulty that adjusts, honey rewards, and plain reports for grownups.
        </p>

        {/* Real tab semantics: arrow keys move, only the selected tab is in the tab order. */}
        <div
          role="tablist"
          aria-label="What Moye does"
          onKeyDown={onTabKeyDown}
          className="flex flex-wrap justify-center gap-2 pt-3 pb-2 w-full max-w-2xl"
        >
          {TABS.map(({ id, label, Icon }) => (
            <button
              key={id}
              type="button"
              role="tab"
              id={`tab-${id}`}
              aria-selected={activeTab === id}
              aria-controls={`panel-${id}`}
              tabIndex={activeTab === id ? 0 : -1}
              onClick={() => setActiveTab(id)}
              className={`btn-3d text-base gap-2 ${activeTab === id ? "btn-3d-plum" : "btn-3d-card"}`}
            >
              <Icon size={16} />
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="relative w-full max-w-5xl mx-auto mt-8 sm:mt-12 flex flex-col lg:flex-row items-stretch justify-center gap-8 lg:gap-12">
        {/* Left: what the active tab does. min-h keeps the card from jumping between tabs. */}
        <div
          role="tabpanel"
          id={`panel-${activeTab}`}
          aria-labelledby={`tab-${activeTab}`}
          key={activeTab}
          className="panel-in order-2 lg:order-1 min-h-[520px] flex"
        >
          <StoryCard {...story} cta={story.cta} />
        </div>

        {/* Centre: the device frame showing the active screen. */}
        <PhoneFrame
          dyslexic={dyslexicFont}
          bottomNav={
            <div className="px-4 py-2 bg-white border-t border-[var(--border)] flex items-center justify-around text-xs text-[var(--fg-muted)]">
              <span className="flex flex-col items-center gap-1 text-[var(--plum-700)] font-bold">
                <TargetIcon size={16} />
                <span className="text-xs">Lesson</span>
              </span>
              <span className="flex flex-col items-center gap-1">
                <DuoStreakFlame size={16} />
                <span className="text-xs">Mastery</span>
              </span>
              <span className="flex flex-col items-center gap-1">
                <HoneyDropIcon size={16} />
                <span className="text-xs">Hive</span>
              </span>
              <span className="flex flex-col items-center gap-1">
                <PrinterIcon size={16} />
                <span className="text-xs">Report</span>
              </span>
            </div>
          }
        >
          <PhoneStatusBar dyslexicFont={dyslexicFont} onToggleDyslexic={() => setDyslexicFont(!dyslexicFont)} />
          <div key={activeTab} className="panel-in flex-1 flex flex-col">
            {activeTab === "focus" && (
              <div className="p-4 flex-1 flex flex-col justify-between gap-3 overflow-y-auto">
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-bold text-[var(--fg-muted)]">Question 2 of 5</span>
                  <div className="w-full h-2 bg-[var(--plum-100)] overflow-hidden">
                    <div className="h-full bg-[var(--teal-500)] w-[40%]" />
                  </div>
                </div>

                <div className="p-3 bg-white rounded-2xl border-2 border-[var(--border)] flex flex-col gap-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-[var(--fg-muted)]">Count and match</span>
                    <button
                      type="button"
                      onClick={() => setIsSpeaking(true)}
                      className={`px-2 py-1 min-h-11 rounded-md border flex items-center gap-1 text-xs font-semibold transition-colors ${
                        isSpeaking
                          ? "bg-[var(--teal-700)] text-white border-[var(--teal-700)]"
                          : "bg-[var(--plum-100)] text-[var(--plum-900)] border-[var(--border)]"
                      }`}
                    >
                      <SpeakerIcon size={12} />
                      <span>{isSpeaking ? "Reading" : "Read aloud"}</span>
                    </button>
                  </div>

                  <h4 className="text-base font-bold text-[var(--plum-900)] leading-tight">
                    How many friendly dinosaurs are here?
                  </h4>

                  {/* One shot entrance, 60ms apart. No looping bounce. */}
                  <div className="flex items-center justify-center gap-4 py-2 bg-[var(--paper)] rounded-xl border border-[var(--border)]">
                    {[0, 1, 2].map((n) => (
                      <div key={n} className="pop-in" style={step(n)}>
                        <DinosaurIcon size={28} className="text-[var(--teal-700)]" />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {OPTIONS.map((opt) => {
                    const isSelected = selectedAnswer === opt.val;
                    let btnClasses =
                      "bg-white border-2 border-[var(--border)] shadow-[0_3px_0_var(--border)] text-[var(--plum-900)]";
                    if (isSelected) {
                      btnClasses = opt.correct
                        ? "bg-[var(--teal-500)] border-2 border-[var(--teal-700)] shadow-[0_3px_0_var(--teal-700)] text-white"
                        : "bg-[var(--rose-400)] border-2 border-[var(--rose-400)] shadow-[0_3px_0_var(--plum-700)] text-[var(--plum-900)]";
                    }
                    return (
                      <button
                        key={opt.val}
                        type="button"
                        aria-pressed={isSelected}
                        onClick={() => setSelectedAnswer(opt.val)}
                        className={`h-12 rounded-xl font-bold text-lg transition-transform active:translate-y-1 flex items-center justify-center ${btnClasses}`}
                      >
                        {opt.val}
                      </button>
                    );
                  })}
                </div>

                {/* Feedback is announced, and a wrong answer is gentle: no shake, no buzzer. */}
                <div
                  aria-live="polite"
                  className="pt-2 border-t border-[var(--border)] flex items-center justify-between gap-2 min-h-12"
                >
                  {selectedAnswer === 3 ? (
                    <div className="pop-in flex items-center gap-1 text-xs font-bold text-[var(--teal-700)] bg-[var(--plum-100)] px-2 py-1 rounded-xl">
                      <CheckIcon size={16} />
                      <span>Spot on. One honey drop.</span>
                      <HoneyDropIcon size={14} />
                    </div>
                  ) : selectedAnswer !== null ? (
                    <div className="pop-in flex items-center gap-1 text-xs font-bold text-[var(--plum-900)] bg-[var(--paper)] px-2 py-1 rounded-xl border border-[var(--rose-400)]">
                      <RetryIcon size={16} />
                      <span>Almost. Let&apos;s count again.</span>
                    </div>
                  ) : (
                    <span className="text-xs font-bold text-[var(--fg-muted)]">Tap an answer above to try.</span>
                  )}
                  <div key={pose} className="pop-in shrink-0">
                    <MoyinMascot pose={pose} size={52} />
                  </div>
                </div>
              </div>
            )}
            {activeTab === "mastery" && (
              <MasteryScreen
                pKnown={pKnown}
                onCorrect={() => setPKnown((p) => Math.min(0.95, Number((p + 0.08).toFixed(2))))}
                onSlip={() => setPKnown((p) => Math.max(0.35, Number((p - 0.09).toFixed(2))))}
              />
            )}
            {activeTab === "hive" && (
              <HiveScreen
                hat={hat}
                scarf={scarf}
                onHat={(id) => setHat((h) => (h === id ? null : id))}
                onScarf={(id) => setScarf((s) => (s === id ? null : id))}
              />
            )}
            {activeTab === "grownups" && <GrownupsScreen />}
          </div>
        </PhoneFrame>

        {/* Right: what is under the hood, in plain words. */}
        <div className="order-3 flex">
          <UnderTheHoodCard
            eyebrow="Under the hood"
            title="Built to stay calm"
            rows={[
              {
                heading: "Saves on this device",
                body: "Progress is kept in your browser on this device. No account and no tracking.",
              },
              {
                heading: "Free to use",
                body: "Read aloud uses your browser voice. No subscription and no paid services.",
              },
              {
                heading: "Rules in plain code",
                body: "Pass or fail, mastery, streaks and honey are computed by functions with tests in this repo.",
              },
            ]}
          />
        </div>
      </div>
    </section>
  );
}
