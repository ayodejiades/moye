import assert from "node:assert/strict";
import { test } from "node:test";
import {
  CONTENT_LENSES,
  CONTENT_LOCALES,
  CONTENT_THEMES,
  CONTENT_LEVELS,
  ALL_CONTENT_QUESTIONS,
  curriculumStats,
} from "../lib/content.generated.ts";
import { LEVEL_BANKS, SKILL_TITLES } from "../lib/lesson-bank.ts";
import { READING_BANKS } from "../lib/reading-bank.ts";
import { THEMES, LOCALES, renderQuestion } from "../lib/theme-resolver.ts";

/**
 * The combinatorial render test features.md B3 asks for: every skill has to render with no
 * unfilled slot in every lens x locale x theme. A single failing combination would be a
 * question a child sees with a raw {placeholder} in it.
 */
test("[B3] the content folder validates and is not empty", () => {
  assert.ok(CONTENT_LENSES.length >= 3, "at least three curriculum lenses");
  assert.ok(CONTENT_LOCALES.length >= 3, "at least three locales");
  assert.ok(CONTENT_THEMES.length >= 3, "at least three themes");
  assert.ok(Object.keys(CONTENT_LEVELS).length >= 8, "at least eight levels");
  assert.ok(ALL_CONTENT_QUESTIONS.length >= 80, "the content folder holds the whole bank");
});

test("[B3] the committed content matches the typed banks exactly", () => {
  // The JSON is the source of truth that ships; the typed banks are the working copy.
  // If these ever drift, one of them is lying to the user.
  const typed = { ...LEVEL_BANKS, ...READING_BANKS };
  for (const [levelId, questions] of Object.entries(typed)) {
    const content = CONTENT_LEVELS[levelId];
    assert.ok(content, `${levelId} is missing from content/skills/levels.json`);
    assert.equal(
      content.questions.length,
      questions.length,
      `${levelId} has a different number of questions in content/ than in the typed bank`,
    );
    assert.deepEqual(
      content.questions.map((q) => q.id),
      questions.map((q) => q.id),
      `${levelId} question ids differ between content/ and the typed bank`,
    );
  }
  for (const levelId of Object.keys(CONTENT_LEVELS)) {
    assert.ok(typed[levelId], `${levelId} exists in content/ but not in the typed bank`);
  }
});

test("[B3] every level is named, so a child never sees a raw level id", () => {
  for (const level of Object.values(CONTENT_LEVELS)) {
    assert.ok(level.title.length > 0, `${level.id} has no title`);
    assert.ok(level.skillTitle.length > 0, `${level.id} has no skill title`);
    assert.ok(["maths", "reading"].includes(level.subject));
  }
});

test("[B3] every level is reachable from every lens", () => {
  for (const lens of CONTENT_LENSES) {
    for (const levelId of lens.skillOrder) {
      assert.ok(CONTENT_LEVELS[levelId], `${lens.id} lists ${levelId}, which is not in the content`);
    }
  }
});

test("[B3] every lens says aligned to a curriculum, never claims to be official", () => {
  for (const lens of CONTENT_LENSES) {
    assert.ok(lens.sourceNote.length > 0, `${lens.id} has no source note`);
    assert.match(lens.sourceNote, /Aligned to/i, `${lens.id} must say aligned to`);

    // An explicit disclaimer is fine; a claim of official status is not. The word is
    // only allowed inside a sentence that denies it.
    for (const claim of ["officially aligned", "endorsed by", "accredited by", "approved by", "in partnership with"]) {
      assert.doesNotMatch(
        `${lens.name} ${lens.sourceNote}`,
        new RegExp(claim, "i"),
        `${lens.id} claims ${claim}`,
      );
    }
    // Where "official" appears at all, it must be negated.
    for (const sentence of lens.sourceNote.split(/[.;]/)) {
      if (/official/i.test(sentence)) {
        assert.match(sentence, /not an official|never official/i, `${lens.id}: "${sentence.trim()}"`);
      }
    }
  }
});

test("[B3] every skill renders in every theme and locale with no unfilled slot", () => {
  const slots = /\{[a-z_]+\}/g;
  let combinations = 0;
  for (const question of ALL_CONTENT_QUESTIONS) {
    for (const themeId of Object.keys(THEMES)) {
      for (const localeId of Object.keys(LOCALES)) {
        const rendered = renderQuestion(question, themeId, localeId);
        for (const text of [rendered.prompt, rendered.readAloud, rendered.hint, ...rendered.options.map((o) => o.text)]) {
          const leftover = text.match(slots);
          assert.equal(
            leftover,
            null,
            `${question.id} left ${leftover} unfilled in theme ${themeId} and locale ${localeId}`,
          );
        }
        combinations++;
      }
    }
  }
  // Prove the loop really ran rather than silently doing nothing.
  assert.equal(combinations, ALL_CONTENT_QUESTIONS.length * Object.keys(THEMES).length * Object.keys(LOCALES).length);
  assert.ok(combinations > 500, `expected hundreds of combinations, ran ${combinations}`);
});

test("[B3] every rendered question keeps exactly one right answer", () => {
  for (const question of ALL_CONTENT_QUESTIONS) {
    for (const themeId of Object.keys(THEMES)) {
      for (const localeId of Object.keys(LOCALES)) {
        const rendered = renderQuestion(question, themeId, localeId);
        assert.equal(
          rendered.options.filter((o) => o.isCorrect).length,
          1,
          `${question.id} lost its single right answer in ${themeId}/${localeId}`,
        );
        assert.ok(rendered.options.length >= 2, `${question.id} lost its options`);
        assert.ok(rendered.prompt.trim().length > 0, `${question.id} rendered an empty prompt`);
      }
    }
  }
});

test("[B3] the same input always renders the same words", () => {
  for (const question of ALL_CONTENT_QUESTIONS) {
    const a = renderQuestion(question, "dinosaurs", "en-NG");
    const b = renderQuestion(question, "dinosaurs", "en-NG");
    assert.deepEqual(a, b, `${question.id} is not deterministic`);
  }
});

test("[B3] the reported curriculum stats are true counts", () => {
  const stats = curriculumStats();
  assert.equal(stats.levels, Object.keys(CONTENT_LEVELS).length);
  assert.equal(stats.questions, ALL_CONTENT_QUESTIONS.length);
  assert.equal(stats.lenses, CONTENT_LENSES.length);
  assert.equal(stats.locales, CONTENT_LOCALES.length);
  assert.equal(stats.themes, CONTENT_THEMES.length);
  // These are the numbers the landing page is allowed to quote.
  assert.ok(stats.questions >= 80, `the page would claim only ${stats.questions} questions`);
  assert.ok(stats.skills >= 10);
  assert.deepEqual(stats.subjects, ["maths", "reading"]);
  assert.deepEqual(stats.tiers, [1, 2, 3]);
});

test("[B3] no skill in the content is missing a title a child can read", () => {
  for (const level of Object.values(CONTENT_LEVELS)) {
    const known = SKILL_TITLES[level.skillId] || level.skillTitle;
    assert.ok(known && known.length > 0, `${level.id} has no readable skill title`);
    assert.doesNotMatch(known, /[{}]/, `${level.id} has a placeholder in its skill title`);
  }
});
