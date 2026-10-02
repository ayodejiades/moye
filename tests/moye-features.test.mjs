import assert from "node:assert/strict";
import { test } from "node:test";
import { simulateStudentTrace } from "../lib/mastery.ts";
import { computeHoneyReward, HIVE_COSMETICS } from "../lib/honey.ts";
import { calculateStreakUpdate } from "../lib/streak.ts";
import { renderQuestion } from "../lib/theme-resolver.ts";
import { SAMPLE_MATH_QUESTIONS } from "../lib/lesson-bank.ts";

test("Bayesian Knowledge Tracing adapts difficulty correctly", () => {
  // Strong student progresses from Tier 1 to Tier 3
  const strongTrace = simulateStudentTrace(0.20, [true, true, true, true, true]);
  assert.ok(strongTrace[0].newPKnown > 0.20);
  assert.ok(strongTrace[strongTrace.length - 1].newPKnown > 0.85);
  assert.equal(strongTrace[strongTrace.length - 1].recommendedTier, 3);

  // Struggling student drops down to remedial Tier 1
  const strugglingTrace = simulateStudentTrace(0.70, [false, false, false]);
  assert.ok(strugglingTrace[strugglingTrace.length - 1].newPKnown < 0.60);
  assert.equal(strugglingTrace[strugglingTrace.length - 1].recommendedTier, 1);
});

test("Honey economy rewards deterministically and enforces daily cap", () => {
  const seed = 12345;
  const reward1 = computeHoneyReward(10, seed);
  const reward2 = computeHoneyReward(10, seed);
  assert.equal(reward1.amount, reward2.amount, "Seeded rewards must be deterministic");

  // Hitting daily cap
  const capped = computeHoneyReward(48, seed, { dailyCap: 50, smallReward: 5, mediumReward: 10, goldenReward: 20 });
  assert.equal(capped.amount, 2, "Only grants up to the 50 cap");
  assert.equal(capped.hitDailyCap, true);

  const atMax = computeHoneyReward(50, seed);
  assert.equal(atMax.amount, 0);
  assert.equal(atMax.capped, true);
});

test("Spark streak handles consecutive days, rest-day tokens, and guilt-free rests", () => {
  // Consecutive day
  const day2 = calculateStreakUpdate(
    { sparkCount: 1, freezes: 1, restTokens: 1, lastActiveDate: "2026-10-01", message: "" },
    "2026-10-02"
  );
  assert.equal(day2.sparkCount, 2);

  // Missed 1 day with rest token
  const protectedStreak = calculateStreakUpdate(
    { sparkCount: 2, freezes: 0, restTokens: 1, lastActiveDate: "2026-10-01", message: "" },
    "2026-10-03"
  );
  assert.equal(protectedStreak.sparkCount, 3);
  assert.equal(protectedStreak.restTokens, 0, "Used up 1 rest token");

  // Missed day with zero tokens -> calm reset with encouraging copy
  const resetStreak = calculateStreakUpdate(
    { sparkCount: 5, freezes: 0, restTokens: 0, lastActiveDate: "2026-10-01", message: "" },
    "2026-10-05"
  );
  assert.equal(resetStreak.sparkCount, 1);
  assert.match(resetStreak.message, /welcome back/i);
});

test("Question templates render seamlessly across themes and locales", () => {
  const q = SAMPLE_MATH_QUESTIONS[0];
  const dinoNG = renderQuestion(q, "dinosaurs", "en-NG");
  assert.match(dinoNG.prompt, /fossil stones/i);

  const footUS = renderQuestion(q, "football", "en-US");
  assert.match(footUS.prompt, /footballs/i);
});

test("Hive shop cosmetics catalogue is well-formed with unique items across all categories", () => {
  assert.ok(HIVE_COSMETICS.length >= 10, "Shop should offer a rich catalogue of items");

  const ids = new Set();
  const validCategories = new Set(["hat", "glasses", "scarf", "pet", "decor"]);

  for (const item of HIVE_COSMETICS) {
    assert.ok(!ids.has(item.id), `Duplicate cosmetic ID: ${item.id}`);
    ids.add(item.id);
    assert.ok(validCategories.has(item.category), `Invalid category: ${item.category}`);
    assert.ok(item.cost > 0 && item.cost <= 100, `Item cost should be positive and balanced: ${item.cost}`);
    assert.ok(item.name.length > 0 && item.description.length > 0);
    // Strict typography rule: no hyphens in names or descriptions
    assert.doesNotMatch(item.name, /-/, `Item name should not contain hyphens: ${item.name}`);
    assert.doesNotMatch(item.description, /-/, `Item description should not contain hyphens: ${item.description}`);
  }

  // Ensure every required category has items
  const categoriesPresent = new Set(HIVE_COSMETICS.map((c) => c.category));
  for (const cat of validCategories) {
    assert.ok(categoriesPresent.has(cat), `Category missing items: ${cat}`);
  }
});

test("Multilingual voice engine provides valid localizations across all supported dialects", async () => {
  const {
    SUPPORTED_VOICE_LANGUAGES,
    LOCALIZED_ENCOURAGEMENTS,
    getLocalizedQuestionContent,
    getEncouragementPhrase,
  } = await import("../lib/multilingual-voice.ts");

  assert.equal(SUPPORTED_VOICE_LANGUAGES.length, 6);
  const langIds = SUPPORTED_VOICE_LANGUAGES.map((l) => l.id);
  assert.deepEqual(langIds, ["en", "pcm", "yo", "ha", "ig", "sw"]);

  for (const lang of langIds) {
    const enc = LOCALIZED_ENCOURAGEMENTS[lang];
    assert.ok(enc, `Missing encouragements for language ${lang}`);
    assert.ok(enc.correct.length > 0);
    assert.ok(enc.retry.length > 0);
    assert.ok(enc.companionWelcome.length > 0);
    assert.ok(enc.doneForToday.length > 0);

    for (const phrase of [...enc.correct, ...enc.retry, enc.companionWelcome, enc.doneForToday]) {
      assert.doesNotMatch(phrase, /-/, `Encouragement should not contain hyphens: ${phrase}`);
    }

    const correctPhrase = getEncouragementPhrase("correct", lang, 1);
    assert.ok(correctPhrase.length > 0);
  }

  const defaults = { prompt: "Default Prompt", hint: "Default Hint", readAloud: "Default Read" };
  const yorubaQ = getLocalizedQuestionContent("q-math-1", "yo", defaults);
  assert.match(yorubaQ.prompt, /okuta fossil/i);
  assert.match(yorubaQ.hint, /Bere lati 4/i);

  const pidginQ = getLocalizedQuestionContent("q-math-1", "pcm", defaults);
  assert.match(pidginQ.prompt, /fossil stones for morning/i);

  const hausaQ = getLocalizedQuestionContent("q-math-1", "ha", defaults);
  assert.match(hausaQ.prompt, /duwatsu/i);

  const igboQ = getLocalizedQuestionContent("q-math-1", "ig", defaults);
  assert.match(igboQ.prompt, /okwute/i);

  const swahiliQ = getLocalizedQuestionContent("q-math-1", "sw", defaults);
  assert.match(swahiliQ.prompt, /kisukuku/i);
  assert.match(swahiliQ.hint, /Anzia 4/i);

  const fallback = getLocalizedQuestionContent("unknown-id", "yo", defaults);
  assert.equal(fallback.prompt, "Default Prompt");
});
