import { type Question, type ThemeWordBank, type LocalePack } from "./content-schema";

export const DINOSAURS_THEME: ThemeWordBank = {
  id: "dinosaurs",
  name: "Dinosaurs",
  icon: "dinosaurs",
  items: {
    hero: "Rex",
    item_plural: "fossil stones",
    item_singular: "fossil stone",
    collector: "paleontologist",
    habitat: "prehistoric valley",
  },
};

export const FOOTBALL_THEME: ThemeWordBank = {
  id: "football",
  name: "Football",
  icon: "football",
  items: {
    hero: "Striker Moyin",
    item_plural: "footballs",
    item_singular: "football",
    collector: "goalkeeper",
    habitat: "stadium pitch",
  },
};

export const SPACE_THEME: ThemeWordBank = {
  id: "space",
  name: "Space",
  icon: "space",
  items: {
    hero: "Comet Moyin",
    item_plural: "bright stars",
    item_singular: "bright star",
    collector: "sky watcher",
    habitat: "night sky",
  },
};

export const THEMES: Record<string, ThemeWordBank> = {
  dinosaurs: DINOSAURS_THEME,
  football: FOOTBALL_THEME,
  space: SPACE_THEME,
};

export const LOCALE_NG: LocalePack = {
  id: "en-NG",
  name: "Nigeria (English)",
  country: "Nigeria",
  currencySymbol: "₦",
  coinName: "kobo",
  foodName: "plantain chips",
  unitDistance: "metres",
  unitWeight: "kilograms",
};

export const LOCALE_US: LocalePack = {
  id: "en-US",
  name: "United States",
  country: "United States",
  currencySymbol: "$",
  coinName: "cents",
  foodName: "cookies",
  unitDistance: "yards",
  unitWeight: "pounds",
};

export const LOCALE_GB: LocalePack = {
  id: "en-GB",
  name: "England (English)",
  country: "United Kingdom",
  currencySymbol: "\u00a3",
  coinName: "pence",
  foodName: "crisps",
  unitDistance: "metres",
  unitWeight: "kilograms",
};

export const LOCALES: Record<string, LocalePack> = {
  "en-NG": LOCALE_NG,
  "en-US": LOCALE_US,
  "en-GB": LOCALE_GB,
};

/**
 * Curriculum lens to the locale whose words and money it uses. The landing page demos
 * the same money question in three places so the curriculum strip is a demonstration
 * rather than decoration (features.md C3). Aligned to, never official.
 */
export const LENS_LOCALES: Record<string, string> = {
  "ng-ube": "en-NG",
  "england-nc": "en-GB",
  "common-core": "en-US",
  universal: "en-NG",
};

/** The theme ids, in the order the demo switcher shows them. */
export const THEME_ORDER = ["dinosaurs", "football", "space"] as const;

/**
 * Kid names that appear inside question stories. Rendered through the
 * {kid} slot, one name per question, picked deterministically from the
 * question id so the same question always shows the same kid.
 * (SPEC typography rule: commas and periods only here, never em dashes.)
 */
export const KID_NAMES: string[] = [
  "Pelumi",
  "Tomiwa",
  "Demilade",
  "Ada",
  "Chidi",
  "Ayomide",
  "Anjola",
  "Ayodeji",
  "Ngozi",
  "Emeka",
  "Funke",
  "Ibrahim",
  "Aisha",
  "Tunde",
  "Kemi",
  "Oluchi",
];

function pickKidName(questionId: string): string {
  let hash = 0;
  for (let i = 0; i < questionId.length; i++) {
    hash = (hash * 31 + questionId.charCodeAt(i)) >>> 0;
  }
  // Knuth multiplicative scramble. Plain hash % length clusters on similar
  // ids (q-math-1-x), so mixing high bits first spreads all 16 names evenly
  // across the bank. The float multiply is IEEE754 rounded, so it stays
  // deterministic in every engine.
  const scrambled = ((hash * 2654435761) >>> 16) % KID_NAMES.length;
  return KID_NAMES[scrambled];
}

export function renderQuestion(
  question: Question,
  themeId: string = "dinosaurs",
  localeId: string = "en-NG"
): { prompt: string; readAloud: string; hint: string; options: { id: string; text: string; isCorrect: boolean; misconceptionTag?: string }[] } {
  const theme = THEMES[themeId] || DINOSAURS_THEME;
  const locale = LOCALES[localeId] || LOCALE_NG;
  const kid = pickKidName(question.id);

  const replaceSlots = (text: string) => {
    return text
      .replace(/{theme_hero}/g, theme.items.hero)
      .replace(/{theme_items}/g, theme.items.item_plural)
      .replace(/{theme_item}/g, theme.items.item_singular)
      .replace(/{theme_habitat}/g, theme.items.habitat)
      .replace(/{currency}/g, locale.currencySymbol)
      .replace(/{coin}/g, locale.coinName)
      .replace(/{food}/g, locale.foodName)
      .replace(/{unit_dist}/g, locale.unitDistance)
      .replace(/{kid}/g, kid);
  };

  const renderedPrompt = replaceSlots(question.promptTemplate);
  const renderedReadAloud = replaceSlots(question.readAloudText);
  const renderedHint = replaceSlots(question.hint);
  const renderedOptions = question.options.map((opt) => ({
    ...opt,
    text: replaceSlots(opt.text),
  }));

  return {
    prompt: renderedPrompt,
    readAloud: renderedReadAloud,
    hint: renderedHint,
    options: renderedOptions,
  };
}
