/**
 * UI strings in Nigerian Pidgin and Yoruba (features.md B8).
 *
 * The voice engine in lib/multilingual-voice.ts already speaks `pcm` and `yo`. This adds
 * the words on the screens themselves, so a child who is told to "tap Continue" in a
 * language they think in is not asked to read English first.
 *
 * IMPORTANT (features.md B8): every string here needs a native speaker check before it
 * ships. They are written to be plain and short, and the fallback to English is always
 * available in the picker, so a wrong word can never lock anyone out.
 *
 * House rules applied throughout: no hyphens in visible copy, sentence case only, no
 * emoji, no all caps.
 */

export type UiLanguage = "en" | "pcm" | "yo";

export const UI_LANGUAGES: { id: UiLanguage; label: string; nativeLabel: string }[] = [
  { id: "en", label: "English", nativeLabel: "English" },
  { id: "pcm", label: "Nigerian Pidgin", nativeLabel: "Naija Pidgin" },
  { id: "yo", label: "Yoruba", nativeLabel: "Ede Yoruba" },
];

/** Every string the screens need, in all three languages. */
export interface UiStrings {
  /** Onboarding: what is your name. */
  nameQuestion: string;
  /** Onboarding: the curriculum picker. */
  schoolQuestion: string;
  /** Onboarding: the story theme picker. */
  themeQuestion: string;
  /** Onboarding: continue. */
  continueLabel: string;
  /** Onboarding: sign in instead. */
  signInLabel: string;
  /** Placement: the intro heading. */
  placementHeading: string;
  /** Placement: skipping. */
  placementSkip: string;
  /** Placement: the result headline, before the level name. */
  placementFound: string;
  /** Placement: start learning. */
  placementContinue: string;
  /** Lesson: the question counter. */
  questionOf: string;
  /** Lesson: read aloud. */
  readAloud: string;
  /** Lesson: check the answer. */
  checkAnswer: string;
  /** Lesson: next question. */
  nextQuestion: string;
  /** Lesson: right answer feedback. Never a score. */
  correctFeedback: string;
  /** Lesson: gentle retry. Never shame. */
  wrongFeedback: string;
  /** Done for today. */
  doneForToday: string;
  /** Hive: honey balance. */
  honeyLabel: string;
  /** Grownups: the weekly report heading. */
  reportHeading: string;
  /** Grownups: copy the summary. */
  copySummary: string;
}

const EN: UiStrings = {
  nameQuestion: "What is your name?",
  schoolQuestion: "Where do you learn?",
  themeQuestion: "Pick your favourite story theme:",
  continueLabel: "Continue",
  signInLabel: "Sign In",
  placementHeading: "Let us find the right starting point",
  placementSkip: "Skip, start from the beginning",
  placementFound: "Moyin found a good place to start:",
  placementContinue: "Start learning",
  questionOf: "Question",
  readAloud: "Read aloud",
  checkAnswer: "Check Answer",
  nextQuestion: "Next Question",
  correctFeedback: "That is right. Moyin is pleased.",
  wrongFeedback: "Almost. Let us look again.",
  doneForToday: "Done for today. Rest anytime.",
  honeyLabel: "Honey",
  reportHeading: "How this child is learning this week",
  copySummary: "Copy this week's summary",
};

const PCM: UiStrings = {
  nameQuestion: "Wetin be your name?",
  schoolQuestion: "Where you dey learn?",
  themeQuestion: "Choose your favourite story:",
  continueLabel: "Continue",
  signInLabel: "Sign In",
  placementHeading: "Make we find the correct place to start",
  placementSkip: "Pass am, start from the beginning",
  placementFound: "Moyin find better place to start:",
  placementContinue: "Start to learn",
  questionOf: "Question",
  readAloud: "Read am out loud",
  checkAnswer: "Check the answer",
  nextQuestion: "Next question",
  correctFeedback: "Correct! Moyin happy for you.",
  wrongFeedback: "E near. Make we look again.",
  doneForToday: "You don finish for today. Rest anything you want.",
  honeyLabel: "Honey",
  reportHeading: "How this child dey learn this week",
  copySummary: "Copy this week's summary",
};

const YO: UiStrings = {
  nameQuestion: "Ounje ni orúkọ rẹ?",
  schoolQuestion: "Ibi wo kọ́?",
  themeQuestion: "Yíyàn àkọsọ ìtàn tí o fẹ́rẹ̀:",
  continueLabel: "Tẹ̀síwájú",
  signInLabel: "Wọlé",
  placementHeading: "Jẹ́ ká wa rí ibi tí ó yẹ́ láti bẹ̀rẹ̀",
  placementSkip: "Fi sọ́, bẹ̀rẹ̀ láti ìbẹ̀rẹ̀",
  placementFound: "Moyin rí ibi tó yẹ́ láti bẹ̀rẹ̀:",
  placementContinue: "Bẹ̀rẹ̀ kíkọ́",
  questionOf: "Ìbéèrè",
  readAloud: "Ka sókè",
  checkAnswer: "Ṣàyẹ̀wò àṣà",
  nextQuestion: "Ìbéèrè tókàn",
  correctFeedback: "Ó tọ́. Moyin happy fún ọ.",
  wrongFeedback: "Ó fẹ́rẹ̀. Jẹ́ ká wo lẹ́ẹ̀kansí.",
  doneForToday: "O ti parí fún ọjọ́ náà. Ibalẹ́ níkẹ́yìn.",
  honeyLabel: "Oyọ",
  reportHeading: "Bí ọmọ tuntun yẹ̀ ń kọ́ ní ọjọ́ yìí",
  copySummary: "Copy this week's summary",
};

const TABLE: Record<UiLanguage, UiStrings> = { en: EN, pcm: PCM, yo: YO };

/** Every key a screen may ask for. Exported so a test can prove no screen gets a blank. */
export const TABLE_KEYS = Object.keys(EN) as (keyof UiStrings)[];

const STORAGE_KEY = "moye_ui_language";

/**
 * The strings for a language, falling back to English key by key. A partial translation
 * is better than an empty screen, and English is always a valid choice in the picker.
 */
export function uiStrings(language: UiLanguage | string | null | undefined): UiStrings {
  const base = TABLE[(language ?? "en") as UiLanguage] ?? EN;
  const fallback = EN;
  const merged = { ...fallback };
  for (const key of Object.keys(fallback) as (keyof UiStrings)[]) {
    merged[key] = base[key] ?? fallback[key];
  }
  return merged;
}

/** A language that is safe to show. Anything unknown becomes English. */
export function normaliseUiLanguage(language: string | null | undefined): UiLanguage {
  const id = (language ?? "").toLowerCase();
  return id === "pcm" || id === "yo" ? id : "en";
}

export function readStoredUiLanguage(): UiLanguage {
  if (typeof window === "undefined") return "en";
  try {
    return normaliseUiLanguage(window.localStorage.getItem(STORAGE_KEY));
  } catch {
    return "en";
  }
}

export function storeUiLanguage(language: UiLanguage): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, language);
  } catch {
    // Storage is a bonus: the app works in English without it.
  }
}

export { STORAGE_KEY as UI_LANGUAGE_STORAGE_KEY };
