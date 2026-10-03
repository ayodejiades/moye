"use client";

import { useState, useRef, useEffect, useCallback, useMemo, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { getQuestionsForLevel, SKILL_TITLES } from "@/lib/lesson-bank";
import { renderQuestion } from "@/lib/theme-resolver";
import { updatePKnown, type MasteryUpdateResult } from "@/lib/mastery";
import { computeHoneyReward, type HoneyRewardResult } from "@/lib/honey";
import { MoyinMascot, type MoyinPose } from "@/components/moyin-mascot";
import { useAccessibility, type VoiceLanguage } from "@/lib/accessibility-context";
import { AccessibilitySheet } from "@/components/accessibility-sheet";
import { useMoyeStore } from "@/lib/moye-store";
import { playChime } from "@/lib/audio";
import { scaffoldForQuestion, pickExampleSource } from "@/lib/scaffolding";
import { WorkedExamplePanel } from "@/components/worked-example";
import {
  speakMultilingualText,
  getLocalizedQuestionContent,
  getEncouragementPhrase,
  SUPPORTED_VOICE_LANGUAGES,
} from "@/lib/multilingual-voice";
import {
  HoneyDropIcon,
  SettingsIcon,
  TargetIcon,
  SpeakerIcon,
  LightbulbIcon,
  CheckIcon,
  RetryIcon,
  ReadingRulerIcon,
} from "@/components/ui/svg-icons";

function LessonPlayerContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeLevelId = searchParams.get("level") || "s1";

  const {
    panelOpen,
    setPanelOpen,
    readingRuler,
    setReadingRuler,
    wordHighlight,
    speechSpeed,
    soundEnabled,
    narrationLanguage,
    setNarrationLanguage,
  } = useAccessibility();

  const {
    state: storeState,
    addHoney,
    logAttempt,
    updateSkillMastery,
    completeLevelAndUnlockNext,
  } = useMoyeStore();

  // Reading Ruler and Synchronized Speech State
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [spokenWordChar, setSpokenWordChar] = useState<{ start: number; end: number } | null>(null);
  const [rulerTop, setRulerTop] = useState(0);
  const promptRef = useRef<HTMLDivElement>(null);
  const promptTextRef = useRef<HTMLHeadingElement>(null);
  
  // Theme & Locale state (seeded from onboarding demo path)
  const [theme] = useState("dinosaurs");
  const [locale] = useState("en-NG");

  // Load exactly 15 curated questions for the selected level
  const levelQuestions = getQuestionsForLevel(activeLevelId);
  const totalTargetQuestions = levelQuestions.length; // Exactly 15 questions per level!

  const [questionQueue, setQuestionQueue] = useState(() => [...levelQuestions]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [masteredIds, setMasteredIds] = useState<string[]>([]);
  const [retakeIds, setRetakeIds] = useState<string[]>([]);

  const [pKnown, setPKnown] = useState(0.50);
  const [masteryState, setMasteryState] = useState<MasteryUpdateResult | null>(null);

  // Turn state
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [feedbackState, setFeedbackState] = useState<"idle" | "wrong" | "correct">("idle");
  const [hintVisible, setHintVisible] = useState(false);
  const [mascotPose, setMascotPose] = useState<MoyinPose>("body-double");
  const [paused, setPaused] = useState(false);
  const [latestReward, setLatestReward] = useState<HoneyRewardResult | null>(null);
  // Skills this child has already worked through together. Once a skill is on this list
  // its steps are taken away (features.md B5).
  const [skillsWithExample, setSkillsWithExample] = useState<string[]>([]);

  const currentRawQ = questionQueue[currentIndex] ?? levelQuestions[0];
  // renderQuestion is pure: memoize so renderedQ.options keeps a stable identity
  // and the answer callback below is not rebuilt on every keystroke.
  const renderedQ = useMemo(() => renderQuestion(currentRawQ, theme, locale), [currentRawQ, theme, locale]);
  const localizedContent = getLocalizedQuestionContent(currentRawQ.id, narrationLanguage, {
    prompt: renderedQ.prompt,
    hint: renderedQ.hint,
    readAloud: renderedQ.readAloud,
  });
  const activePromptText = localizedContent.prompt;
  const activeHintText = localizedContent.hint;
  const isReviewQuestion = retakeIds.includes(currentRawQ.id);

  // The worked example is a DIFFERENT question of the same skill, never the one the child is
  // about to answer (that would show them the answer). No second question, no example.
  const exampleSource = pickExampleSource(levelQuestions, currentRawQ);
  const renderedExample = useMemo(
    () => (exampleSource ? renderQuestion(exampleSource, theme, locale) : null),
    [exampleSource, theme, locale],
  );
  const localizedExample = exampleSource && renderedExample
    ? getLocalizedQuestionContent(exampleSource.id, narrationLanguage, {
        prompt: renderedExample.prompt,
        hint: renderedExample.hint,
        readAloud: renderedExample.readAloud,
      })
    : null;

  const scaffold = scaffoldForQuestion({
    tier: currentRawQ.tier,
    prompt: localizedExample?.prompt ?? "",
    readAloud: localizedExample ? localizedExample.readAloud || localizedExample.prompt : "",
    answer: renderedExample?.options.find((o) => o.isCorrect)?.text ?? "",
    hint: localizedExample?.hint ?? "",
    alreadySeenSkill: skillsWithExample.includes(currentRawQ.skillId) || !localizedExample,
  });
  const [exampleSeen, setExampleSeen] = useState(false);
  const showWorkedExample = scaffold.example !== null && !exampleSeen;

  const isLastInQueue = currentIndex >= questionQueue.length - 1;
  const isLevelCompleted =
    (masteredIds.includes(currentRawQ.id) || feedbackState === "correct") && isLastInQueue;

  const progressPercent = Math.min(
    100,
    Math.round((masteredIds.length / totalTargetQuestions) * 100)
  );

  // Centre the ruler over the question text whenever it is switched on
  // or the question changes. Runs after paint so refs have real geometry.
  useEffect(() => {
    if (!readingRuler) return;
    const frame = requestAnimationFrame(() => {
      const container = promptRef.current;
      const heading = promptTextRef.current;
      if (!container || !heading) return;
      const containerRect = container.getBoundingClientRect();
      const headingRect = heading.getBoundingClientRect();
      // Place the guide band over the vertical middle of the question text
      const middle = headingRect.top - containerRect.top + headingRect.height / 2 - 22;
      setRulerTop(Math.max(0, middle));
    });
    return () => cancelAnimationFrame(frame);
  }, [readingRuler, currentIndex, activePromptText]);

  // Web Speech API with Multilingual support
  const handleReadAloud = (textToSpeak: string) => {
    const targetText =
      textToSpeak === renderedQ.hint || textToSpeak === activeHintText
        ? activeHintText
        : localizedContent.readAloud || activePromptText;
    setIsSpeaking(true);

    speakMultilingualText(targetText, narrationLanguage, speechSpeed, {
      onWordBoundary: (start, len) => {
        if (wordHighlight) {
          setSpokenWordChar({ start, end: start + len });
        }
      },
      onEnd: () => {
        setIsSpeaking(false);
        setSpokenWordChar(null);
      },
      onError: () => {
        setIsSpeaking(false);
        setSpokenWordChar(null);
      },
    });
  };

  // The keyboard handler needs the current handleReadAloud without being rebuilt on
  // every render, so it reads it through a ref instead of taking it as a dependency.
  const readAloudRef = useRef(handleReadAloud);
  useEffect(() => {
    readAloudRef.current = handleReadAloud;
  });

  const evaluateAnswer = useCallback((optionId: string) => {
    const option = renderedQ.options.find((o) => o.id === optionId);
    if (!option) return;

    if (option.isCorrect) {
      // Correct answer!
      setFeedbackState("correct");
      setMascotPose("cheer");
      setHintVisible(false);

      // Mastery update
      const mastery = updatePKnown(pKnown, true);
      setPKnown(mastery.newPKnown);
      setMasteryState(mastery);

      // Honey reward & Store persistence
      const reward = computeHoneyReward(storeState.honeyBalance, Date.now());
      setLatestReward(reward);
      addHoney(reward.amount);

      // Telemetry log attempt & skill update
      logAttempt({
        questionId: currentRawQ.id,
        skillId: currentRawQ.skillId,
        isCorrect: true,
      });
      updateSkillMastery(currentRawQ.skillId, mastery.newPKnown, mastery.recommendedTier);

      // Register mastery
      setMasteredIds((prev) =>
        prev.includes(currentRawQ.id) ? prev : [...prev, currentRawQ.id]
      );

      // If completing the entire 15-question level, unlock the next level automatically!
      if (isLastInQueue) {
        completeLevelAndUnlockNext(activeLevelId);
      }

      // Auditory dopamine loop
      playChime(isLastInQueue ? "complete" : "correct", soundEnabled);
    } else {
      // Gentle wrong answer: never shame
      setFeedbackState("wrong");
      setMascotPose("think");
      setHintVisible(true);

      // Update mastery slightly
      const mastery = updatePKnown(pKnown, false);
      setPKnown(mastery.newPKnown);
      setMasteryState(mastery);

      // Telemetry log attempt & skill update
      logAttempt({
        questionId: currentRawQ.id,
        skillId: currentRawQ.skillId,
        isCorrect: false,
        misconceptionTag: option.misconceptionTag,
      });
      updateSkillMastery(currentRawQ.skillId, mastery.newPKnown, mastery.recommendedTier);

      // Duolingo mechanic: re-queue question to the end for review
      const alreadyQueuedAhead = questionQueue
        .slice(currentIndex + 1)
        .some((q) => q.id === currentRawQ.id);
      if (!alreadyQueuedAhead) {
        setRetakeIds((prev) =>
          prev.includes(currentRawQ.id) ? prev : [...prev, currentRawQ.id]
        );
        setQuestionQueue((prev) => [...prev, currentRawQ]);
      }

      // Calm auditory tone
      playChime("retry", soundEnabled);
    }
  }, [
    renderedQ.options,
    pKnown,
    storeState.honeyBalance,
    addHoney,
    logAttempt,
    currentRawQ,
    updateSkillMastery,
    isLastInQueue,
    completeLevelAndUnlockNext,
    activeLevelId,
    soundEnabled,
    questionQueue,
    currentIndex,
  ]);

  const handleSelectOption = useCallback(
    (optionId: string) => {
      if (feedbackState === "correct") return;
      setSelectedOptionId(optionId);
      playChime("tap", soundEnabled);
      evaluateAnswer(optionId);
    },
    [evaluateAnswer, feedbackState, soundEnabled],
  );

  const handleLeave = useCallback(() => {
    // Every answer is already written to the store, so there is nothing to save here.
    // The path map is a warm place to land: the child can see how far they got.
    router.push("/learn");
  }, [router]);

  const handleCheckAnswer = useCallback(() => {
    if (!selectedOptionId) return;
    evaluateAnswer(selectedOptionId);
  }, [selectedOptionId, evaluateAnswer]);

  const handleNextQuestion = useCallback(() => {
    if (currentIndex >= questionQueue.length - 1) {
      completeLevelAndUnlockNext(activeLevelId);
      router.push(`/done?level=${activeLevelId}`);
      return;
    }
    setSelectedOptionId(null);
    setFeedbackState("idle");
    setHintVisible(false);
    setLatestReward(null);
    setMascotPose("body-double");
    setExampleSeen(false);
    setCurrentIndex((prev) => prev + 1);
  }, [currentIndex, questionQueue.length, completeLevelAndUnlockNext, activeLevelId, router]);

  // Keyboard navigation & accessibility shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      // Answer keys 1 to 4, plus the letter in the same position for muscle memory.
      const optionIndex = ["1", "2", "3", "4"].indexOf(e.key);
      const letterIndex = ["a", "b", "c", "d"].indexOf(e.key.toLowerCase());
      const index = optionIndex !== -1 ? optionIndex : letterIndex;

      if (index !== -1) {
        const option = renderedQ.options[index];
        if (option) handleSelectOption(option.id);
        return;
      }

      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        if (feedbackState === "idle" && selectedOptionId) {
          handleCheckAnswer();
        } else if (feedbackState === "correct" || feedbackState === "wrong") {
          handleNextQuestion();
        }
        return;
      }

      // R reads the question aloud, P pauses. Both are listed in the comfort settings.
      if (e.key === "r" || e.key === "R") {
        e.preventDefault();
        readAloudRef.current(activePromptText);
        return;
      }

      if (e.key === "p" || e.key === "P") {
        e.preventDefault();
        setPaused((prev) => !prev);
        return;
      }

      // Escape is the way out of a lesson. When the comfort sheet is open, Escape belongs
      // to the sheet, which closes it instead.
      if (e.key === "Escape") {
        if (panelOpen) return;
        e.preventDefault();
        handleLeave();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    feedbackState,
    selectedOptionId,
    renderedQ.options,
    handleSelectOption,
    handleCheckAnswer,
    handleNextQuestion,
    activePromptText,
    handleLeave,
    panelOpen,
  ]);

  const handlePromptMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!readingRuler || !promptRef.current) return;
    const rect = promptRef.current.getBoundingClientRect();
    // Clamp the 44px band inside the container so it never flies off
    const relativeY = Math.max(0, Math.min(rect.height - 44, e.clientY - rect.top - 22));
    setRulerTop(relativeY);
  };

  const renderPromptContent = () => {
    if (!isSpeaking || !wordHighlight || !spokenWordChar) {
      return activePromptText;
    }

    let charOffset = 0;
    return activePromptText.split(/(\s+)/).map((segment, idx) => {
      const start = charOffset;
      const end = start + segment.length;
      charOffset = end;

      const isWord = /\S/.test(segment);
      const isCurrent =
        isWord &&
        spokenWordChar &&
        Math.abs(start - spokenWordChar.start) <= 5;

      return (
        <span
          key={idx}
          className={isCurrent ? "karaoke-word-active" : undefined}
        >
          {segment}
        </span>
      );
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--paper)] text-[var(--plum-900)]">
      <AccessibilitySheet />

      {/* Top Header: Progress Bar (15 Questions), Pause, A11y, Honey */}
      <header className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border)]">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setPaused(!paused)}
            className="h-9 rounded-lg border border-[var(--border)] bg-white px-3 text-sm font-semibold text-[var(--plum-900)] hover:bg-[var(--plum-100)] cursor-pointer"
          >
            {paused ? "Resume" : "Pause"}
          </button>
          <button
            type="button"
            onClick={handleLeave}
            className="h-9 rounded-lg border border-[var(--border)] bg-white px-3 text-sm font-semibold text-[var(--plum-900)] hover:bg-[var(--plum-100)] cursor-pointer"
          >
            Stop for now
          </button>
          <span className="text-xs font-semibold text-[var(--fg-muted)]">
            Focus Mode
          </span>
        </div>

        {/* Visual Progress Bar (Reflects Mastered Questions out of 15) */}
        <div className="order-last basis-full sm:order-none sm:basis-auto flex-1 sm:max-w-xs sm:mx-4">
          <div className="h-4 w-full bg-[var(--plum-100)] rounded-full overflow-hidden border border-[var(--border)]">
            <div
              className="h-full bg-[var(--teal-500)] transition-all duration-300 rounded-full"
              style={{ width: `${progressPercent}%` }}
              role="progressbar"
              aria-label={`Mastery this level: ${masteredIds.length} of ${totalTargetQuestions} questions`}
              aria-valuenow={masteredIds.length}
              aria-valuemin={0}
              aria-valuemax={totalTargetQuestions}
              aria-valuetext={`${masteredIds.length} of ${totalTargetQuestions} questions answered`}
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Honey Counter synced from global store */}
          <div
            data-demo="honey-counter"
            className="flex items-center gap-1.5 bg-amber-50 border border-[var(--honey-500)] text-[var(--honey-700)] px-3 py-1 rounded-lg text-sm font-bold"
          >
            <HoneyDropIcon size={18} />
            <span>{storeState.honeyBalance}</span>
          </div>

          {/* Accessibility Toggle Sheet Trigger */}
          <button
            type="button"
            data-demo="a11y-open"
            onClick={() => setPanelOpen(true)}
            aria-label="Open accessibility options"
            className="rounded-xl bg-[var(--plum-100)] p-2 text-[var(--plum-700)] hover:bg-[var(--plum-700)] hover:text-white transition-colors cursor-pointer"
          >
            <SettingsIcon size={20} />
          </button>
        </div>
      </header>

      {/* Main Focus Area: Centered Single-Column Canvas with Fixed Bottom Dock */}
      <main className="flex-1 max-w-2xl mx-auto px-4 sm:px-6 py-6 flex flex-col justify-center w-full pb-36">
        {paused ? (
          <div className="text-center py-16 space-y-4">
            <MoyinMascot pose="sleepy" size={140} />
            <h2 className="text-2xl font-bold">Lesson Paused</h2>
            <p className="text-[var(--fg-muted)]">Take all the time you need. Moyin is keeping your place safe.</p>
            <button
              type="button"
              onClick={() => setPaused(false)}
              className="btn-3d btn-3d-plum text-base py-2 px-3"
            >
              Resume Lesson
            </button>
            <div>
              <button
                type="button"
                onClick={handleLeave}
                className="btn-3d btn-3d-card text-base py-2 px-3"
              >
                Stop for now
              </button>
              <p className="text-xs text-[var(--fg-muted)] mt-3 text-pretty">
                Everything you answered is already saved. You can pick this level back up any
                time from your path.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col space-y-5">
            {/* Companion Dialogue Row: Moyin Mascot + Speech Bubble + Adaptive Level */}
            <div className="flex items-center gap-4 bg-white/85 p-3.5 sm:p-4 rounded-2xl border border-[var(--border)] shadow-xs">
              <div className="shrink-0">
                <MoyinMascot pose={mascotPose} size={76} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-[var(--plum-900)]">
                  {mascotPose === "cheer" ? (
                    <span className="text-[var(--teal-700)]">
                      Moyin says: {getEncouragementPhrase("correct", narrationLanguage, currentIndex)}
                    </span>
                  ) : mascotPose === "think" ? (
                    <span className="text-amber-800">
                      Moyin says: {getEncouragementPhrase("retry", narrationLanguage, currentIndex)}
                    </span>
                  ) : isReviewQuestion ? (
                    <span className="text-amber-800">
                      Moyin says: We have got this! Let us review together
                    </span>
                  ) : (
                    <span>Moyin is learning alongside you</span>
                  )}
                </div>
                <div className="mt-1.5 flex items-center gap-2">
                  <div
                    data-demo="difficulty-indicator"
                    className="inline-flex items-center gap-1.5 bg-[var(--plum-100)] text-[var(--plum-900)] px-2 py-1 rounded-lg text-xs font-bold border border-[var(--border)] whitespace-nowrap"
                  >
                    <TargetIcon size={14} className="shrink-0" />
                    <span>
                      {masteryState?.zone === "mastered"
                        ? "Level: Challenge Tier 3"
                        : masteryState?.zone === "remedial"
                        ? "Level: Foundational Tier 1"
                        : "Level: Just-Right Tier 2"}
                    </span>
                    <span className="font-mono text-xs text-[var(--fg-muted)] pl-1 border-l border-[var(--plum-500)]/20">
                      p: {pKnown.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Question Card */}
            <div
              data-demo="question"
              className="bg-white rounded-3xl p-6 sm:p-7 border-2 border-[var(--border)] shadow-sm space-y-4 question-card"
            >
              {/* Question Card Utility Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[var(--border)]">
                {/* Context badge / Review notice */}
                <div className="flex items-center gap-2">
                  {isReviewQuestion && (
                    <div className="inline-flex items-center gap-1.5 bg-amber-50 border border-[var(--honey-500)] text-[var(--honey-700)] px-2.5 py-1 rounded-md text-xs font-bold">
                      <RetryIcon size={14} />
                      <span>Review round: Let us practice this together</span>
                    </div>
                  )}
                </div>

                {/* Accessibility & Audio Controls */}
                <div className="flex items-center gap-2">
                  {/* Language Selector Button — code only, cycles on tap */}
                  <button
                    type="button"
                    onClick={() => {
                      const langs: VoiceLanguage[] = ["en", "pcm", "yo", "ha", "ig", "sw"];
                      const nextIdx = (langs.indexOf(narrationLanguage) + 1) % langs.length;
                      setNarrationLanguage(langs[nextIdx]);
                    }}
                    aria-label={`Narration language: ${SUPPORTED_VOICE_LANGUAGES.find((l) => l.id === narrationLanguage)?.label ?? narrationLanguage}. Tap to switch language.`}
                    title={`Narration language: ${SUPPORTED_VOICE_LANGUAGES.find((l) => l.id === narrationLanguage)?.label ?? narrationLanguage} — tap to switch`}
                    className="h-8 w-10 min-w-10 max-w-10 overflow-hidden rounded-md border border-[var(--border)] bg-white text-[var(--plum-900)] hover:bg-[var(--plum-100)] hover:border-[var(--plum-400)] flex items-center justify-center p-0 text-xs leading-none font-bold shadow-2xs transition-all cursor-pointer"
                  >
                    <span className="block w-full text-center font-bold uppercase leading-none tracking-tighter whitespace-nowrap overflow-hidden text-xs">{narrationLanguage}</span>
                  </button>

                  {/* Quick Reading Ruler Toggle — icon only */}
                  <button
                    type="button"
                    onClick={() => setReadingRuler(!readingRuler)}
                    aria-label={readingRuler ? "Turn off Reading Ruler" : "Turn on Reading Ruler line guide"}
                    aria-pressed={readingRuler}
                    title={readingRuler ? "Reading Ruler is ON (tap to hide)" : "Reading Ruler (tap to show line guide)"}
                    className={`h-8 w-8 rounded-md border flex items-center justify-center shadow-2xs transition-all cursor-pointer ${
                      readingRuler
                        ? "bg-amber-50 text-[var(--honey-700)] border-[var(--honey-500)]"
                        : "bg-white text-[var(--plum-700)] border-[var(--border)] hover:bg-[var(--plum-100)] hover:border-[var(--plum-400)]"
                    }`}
                  >
                    <ReadingRulerIcon size={16} />
                  </button>

                  {/* Read Aloud Button (Web Speech with karaoke sync) — icon only */}
                  <button
                    type="button"
                    data-demo="read-aloud"
                    onClick={() => handleReadAloud(activePromptText)}
                    aria-label={isSpeaking ? "Reading aloud, tap to stop" : "Read question aloud"}
                    aria-pressed={isSpeaking}
                    title={isSpeaking ? "Reading…" : "Read question aloud"}
                    className={`h-8 w-8 rounded-md border flex items-center justify-center shadow-2xs transition-all cursor-pointer ${
                      isSpeaking
                        ? "bg-teal-50 text-[var(--teal-700)] border-[var(--teal-500)]"
                        : "bg-white text-[var(--plum-700)] border-[var(--border)] hover:bg-[var(--plum-100)] hover:border-[var(--plum-400)]"
                    }`}
                  >
                    <SpeakerIcon size={16} />
                  </button>
                </div>
              </div>

              {/* Prompt with reading ruler and karaoke word tracking - Full width container */}
              {/* NOTE: mouse/touch tracking lives on the whole card so the band
                  keeps following even when the cursor drifts off the heading text. */}
              <div
                ref={promptRef}
                onMouseMove={handlePromptMouseMove}
                onTouchMove={(e) => {
                  if (!readingRuler || !promptRef.current) return;
                  const touch = e.touches[0];
                  if (!touch) return;
                  const rect = promptRef.current.getBoundingClientRect();
                  const relativeY = Math.max(0, Math.min(rect.height - 44, touch.clientY - rect.top - 22));
                  setRulerTop(relativeY);
                }}
                className="relative w-full pt-1 pb-2"
              >
                {readingRuler && (
                  <div
                    className="reading-ruler-guide"
                    style={{ top: `${rulerTop}px`, height: "44px" }}
                    aria-hidden="true"
                  />
                )}
                <h1 ref={promptTextRef} className="relative z-[1] text-xl sm:text-2xl md:text-3xl font-bold leading-relaxed text-[var(--plum-900)] [text-wrap:balance]">
                  {renderPromptContent()}
                </h1>
                {narrationLanguage !== "en" && (
                  <div className="text-xs text-[var(--fg-muted)] mt-2 font-medium">
                    English: {renderedQ.prompt}
                  </div>
                )}
              </div>

              {/* One worked example before the child tries alone (features.md B5) */}
              {showWorkedExample && scaffold.example && (
                <WorkedExamplePanel
                  example={scaffold.example}
                  skillTitle={SKILL_TITLES[currentRawQ.skillId] ?? "this skill"}
                  onContinue={() => {
                    setSkillsWithExample((prev) =>
                      prev.includes(currentRawQ.skillId) ? prev : [...prev, currentRawQ.skillId],
                    );
                    setExampleSeen(true);
                  }}
                />
              )}

              {/* Gentle Hint Box on Mistake */}
              {hintVisible && (
                <div
                  data-demo="hint"
                  className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-amber-900 text-base flex items-start gap-3"
                >
                  <LightbulbIcon size={24} className="shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Almost, let us look again: </span>
                    <span>{activeHintText}</span>
                  </div>
                </div>
              )}

              {/* Options List with Tactile Tap Targets and Keyboard Shortcuts */}
              <div className="space-y-3 pt-2">
                {renderedQ.options.map((option, idx) => {
                  const isSelected = selectedOptionId === option.id;
                  const isRightOpt = option.isCorrect;

                  let customClass = "btn-3d-card";
                  if (isSelected && feedbackState === "idle") {
                    customClass = "btn-3d-card selected";
                  } else if (feedbackState === "correct" && isRightOpt) {
                    customClass = "btn-3d-teal";
                  } else if (feedbackState === "wrong" && isSelected) {
                    customClass = "btn-3d-card border-rose-400 bg-rose-50 text-rose-950";
                  }

                  const shortcutNumber = idx + 1;

                  return (
                    <button
                      key={option.id}
                      type="button"
                      data-demo={option.isCorrect ? "answer-right" : "answer-wrong"}
                      aria-pressed={isSelected}
                      onClick={() => handleSelectOption(option.id)}
                      className={`w-full text-left p-4 rounded-2xl font-bold text-lg btn-3d justify-start ${customClass}`}
                    >
                      <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm mr-3.5 shrink-0 border ${
                        feedbackState === "correct" && isRightOpt
                          ? "bg-white border-white !text-[var(--teal-700)]"
                          : isSelected
                          ? "bg-[var(--plum-700)] text-white border-[var(--plum-900)]"
                          : "bg-[var(--plum-100)] text-[var(--plum-900)] border-[var(--border)]"
                      }`}>
                        {shortcutNumber}
                      </span>
                      <span className="flex-1 text-left">{option.text}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Persistent Full-Width Duolingo Bottom Dock */}
      {!paused && (
        <footer
          className={`fixed bottom-0 inset-x-0 z-40 py-4 px-6 border-t-2 transition-all duration-300 shadow-xl ${
            feedbackState === "correct"
              ? "bg-teal-50 border-[var(--teal-500)]"
              : feedbackState === "wrong"
              ? "bg-rose-50 border-[var(--rose-400)]"
              : "bg-white border-[var(--border)]"
          }`}
        >
          <div className="max-w-2xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            {feedbackState === "idle" ? (
              <button
                type="button"
                disabled={!selectedOptionId}
                onClick={handleCheckAnswer}
                className={`btn-3d w-full py-3.5 text-base font-bold transition-all ${
                  selectedOptionId
                    ? "btn-3d-plum cursor-pointer"
                    : "bg-zinc-200 text-zinc-400 border-zinc-300 cursor-not-allowed"
                }`}
              >
                <span>Check Answer</span>
              </button>
            ) : feedbackState === "correct" ? (
              <>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <CheckIcon size={28} className="text-[var(--teal-700)] shrink-0" />
                  <div>
                    <div className="font-bold text-[var(--teal-700)] text-lg">
                      {isLevelCompleted ? "Level Complete! Next Level Unlocked!" : "Nice thinking!"}
                    </div>
                    {latestReward && (
                      <div
                        data-demo="honey-drop"
                        className="text-xs font-bold text-[var(--honey-700)] flex items-center gap-1"
                      >
                        <span className="inline-flex items-center gap-1">
                          <span>+{latestReward.amount} honey drops!</span>
                          <HoneyDropIcon size={16} />
                        </span>
                        {latestReward.dropType === "golden" && <span>(Golden Drop!)</span>}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto shrink-0">
                  {isLevelCompleted ? (
                    <Link
                      href={`/done?level=${activeLevelId}`}
                      data-demo="finish-lesson"
                      className="btn-3d btn-3d-teal w-full sm:w-auto px-8 py-3 text-base font-bold shrink-0 text-center"
                    >
                      Continue
                    </Link>
                  ) : (
                    <button
                      type="button"
                      onClick={handleNextQuestion}
                      className="btn-3d btn-3d-teal w-full sm:w-auto px-8 py-3 text-base font-bold shrink-0 cursor-pointer"
                    >
                      Continue
                    </button>
                  )}
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2.5 text-rose-800 font-bold text-base min-w-0 w-full sm:w-auto">
                  <RetryIcon size={22} className="shrink-0 text-rose-600" />
                  <span className="leading-snug text-sm sm:text-base">
                    No worries! Moyin saved this one for us to practice again before we finish.
                  </span>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      setFeedbackState("idle");
                      setSelectedOptionId(null);
                    }}
                    className="btn-3d btn-3d-plum py-2.5 px-4 text-sm font-semibold shrink-0 cursor-pointer"
                  >
                    Try Again
                  </button>
                  <button
                    type="button"
                    onClick={handleNextQuestion}
                    className="btn-3d btn-3d-teal py-2.5 px-6 text-sm font-semibold shrink-0 cursor-pointer"
                  >
                    Continue
                  </button>
                </div>
              </>
            )}
          </div>
        </footer>
      )}
    </div>
  );
}

export default function LessonPlayerPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[var(--paper)]" />}>
      <LessonPlayerContent />
    </Suspense>
  );
}
