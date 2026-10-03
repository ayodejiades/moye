"use client";

import { useEffect, useState, type KeyboardEvent } from "react";
import { useAccessibility } from "@/lib/accessibility-context";
import {
  HoneyDropIcon,
  DuoStreakFlame,
  PrinterIcon,
  TargetIcon,
  StarIcon,
} from "@/components/ui/svg-icons";
import { TABS, type ShowcaseTabId } from "./showcase/showcase-tabs";
import { renderQuestion, THEME_ORDER, LENS_LOCALES, LOCALES, THEMES } from "@/lib/theme-resolver";
import { LEVEL_BANKS } from "@/lib/lesson-bank";
import { StoryCard, UnderTheHoodCard } from "./showcase/story-cards";
import { FocusScreen } from "./showcase/focus-screen";
import {
  PhoneFrame,
  PhoneStatusBar,
  MasteryScreen,
  HiveScreen,
  GrownupsScreen,
} from "./showcase/phone-frame";

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
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [moneyPick, setMoneyPick] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [pKnown, setPKnown] = useState(0.74);
  const [hat, setHat] = useState<string | null>("hat-acorn");
  const [scarf, setScarf] = useState<string | null>(null);
  // The demo switches (features.md C2 and C3). These re-skin the same question template
  // through the real resolver, so what the visitor sees is what the app would serve.
  const [demoTheme, setDemoTheme] = useState<string>("dinosaurs");
  const [demoLens, setDemoLens] = useState<string>("ng-ube");

  // Two real questions from the committed bank, both rendered through the real resolver
  // with whatever theme and locale the visitor picked. Nothing here is typed by hand.
  // The counting question carries the theme slots, so the theme switch visibly re-skins
  // it. The money question carries the currency slot, so the curriculum switch visibly
  // changes the money. The bank keeps theme words and currency in separate levels, so
  // both are needed to show both switches honestly.
  const localeId = LENS_LOCALES[demoLens] ?? "en-NG";
  const demo = renderQuestion(LEVEL_BANKS.s1[0], demoTheme, localeId);
  const money = renderQuestion(LEVEL_BANKS.s2[0], demoTheme, localeId);

  useEffect(() => {
    if (!isSpeaking || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(demo.readAloud);
    utterance.rate = 0.9;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
    return () => window.speechSynthesis.cancel();
  }, [isSpeaking, demo.readAloud]);

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

  return (
    <section className="relative overflow-hidden bg-[var(--plum-100)] border-y border-[var(--border)] py-16 sm:py-24 px-4 sm:px-6 text-center select-none">
      <div className="max-w-4xl mx-auto flex flex-col items-center gap-4 relative">
        <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-[var(--plum-900)] leading-tight">
          See how Moye works
        </h2>
        <p className="text-sm sm:text-base text-[var(--fg-muted)] max-w-xl font-medium">
          Try four parts of Moye: calm lessons, difficulty that adjusts, honey rewards, and plain reports for grownups.
        </p>

        {/* The same question, re-skinned. Aligned to these curricula, never official. */}
        <div className="flex flex-wrap items-center justify-center gap-2" data-demo="showcase-switchers">
          {THEME_ORDER.map((id) => (
            <button
              key={id}
              type="button"
              data-demo={`showcase-theme-${id}`}
              aria-pressed={demoTheme === id}
              onClick={() => setDemoTheme(id)}
              className={`text-sm font-semibold px-3 min-h-11 inline-flex items-center gap-2 rounded-lg border transition-colors ${
                demoTheme === id
                  ? "bg-[var(--plum-700)] text-white border-[var(--plum-700)]"
                  : "bg-white text-[var(--plum-900)] border-[var(--border)] hover:bg-[var(--plum-100)]"
              }`}
            >
              {THEMES[id]?.name ?? id}
            </button>
          ))}
          <span aria-hidden="true" className="text-[var(--border)] px-1">|</span>
          {["ng-ube", "england-nc", "common-core"].map((id) => {
            const locale = LOCALES[LENS_LOCALES[id]];
            return (
              <button
                key={id}
                type="button"
                data-demo={`showcase-lens-${id}`}
                aria-pressed={demoLens === id}
                onClick={() => setDemoLens(id)}
                className={`text-sm font-semibold px-3 min-h-11 inline-flex items-center gap-1 rounded-lg border transition-colors ${
                  demoLens === id
                    ? "bg-[var(--plum-700)] text-white border-[var(--plum-700)]"
                    : "bg-white text-[var(--plum-900)] border-[var(--border)] hover:bg-[var(--plum-100)]"
                }`}
              >
                <span>{locale?.country ?? id}</span>
                <span aria-hidden="true">{locale?.currencySymbol}</span>
              </button>
            );
          })}
        </div>

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
              <FocusScreen
                countQuestion={demo}
                moneyQuestion={money}
                localeName={LOCALES[localeId]?.country ?? "your country"}
                countPick={selectedOptionId}
                moneyPick={moneyPick}
                isSpeaking={isSpeaking}
                onReadAloud={() => setIsSpeaking(true)}
                onPickCount={setSelectedOptionId}
                onPickMoney={setMoneyPick}
              />
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
                heading: "Works offline",
                body: "Save Moye to your home screen. After the first visit the lessons open with the network off, and progress stays in this browser.",
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
