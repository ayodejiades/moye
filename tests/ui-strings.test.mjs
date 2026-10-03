import assert from "node:assert/strict";
import { test } from "node:test";
import {
  uiStrings,
  normaliseUiLanguage,
  UI_LANGUAGES,
  TABLE_KEYS,
} from "../lib/ui-strings.ts";
import { EN_PLACEHOLDER } from "./helpers.mjs";

test("[B8] English is always available and always complete", () => {
  const en = uiStrings("en");
  for (const key of TABLE_KEYS) {
    assert.equal(typeof en[key], "string", `${key} is a string`);
    assert.ok(en[key].trim().length > 0, `${key} is not blank`);
  }
});

test("[B8] every language fills every key, so no screen is ever half translated", () => {
  for (const language of UI_LANGUAGES) {
    const strings = uiStrings(language.id);
    for (const key of TABLE_KEYS) {
      assert.ok(strings[key].trim().length > 0, `${language.id}.${key} is filled`);
    }
  }
});

test("[B8] an unknown or missing language falls back to English", () => {
  for (const input of [null, undefined, "", "fr", "zz", 42]) {
    assert.equal(uiStrings(input).nameQuestion, uiStrings("en").nameQuestion);
  }
  assert.equal(normaliseUiLanguage("fr"), "en");
  assert.equal(normaliseUiLanguage(null), "en");
  assert.equal(normaliseUiLanguage("YO"), "yo", "case does not matter");
  assert.equal(normaliseUiLanguage("pcm"), "pcm");
});

test("[B8] the two translations are actually different from English", () => {
  const en = uiStrings("en");
  for (const id of ["pcm", "yo"]) {
    const translated = uiStrings(id);
    const changed = TABLE_KEYS.filter((key) => translated[key] !== en[key]).length;
    // Not every string needs translating, but most of the visible ones should be.
    assert.ok(changed >= TABLE_KEYS.length * 0.6, `${id} translated ${changed} of ${TABLE_KEYS.length}`);
  }
});

test("[B8] no translated string breaks the house copy rules", () => {
  for (const language of UI_LANGUAGES) {
    const strings = uiStrings(language.id);
    for (const key of TABLE_KEYS) {
      const value = strings[key];
      assert.doesNotMatch(value, /[A-Za-z]-[A-Za-z]/, `${language.id}.${key} has a hyphen`);
      assert.doesNotMatch(value, /\p{Extended_Pictographic}/u, `${language.id}.${key} has an emoji`);
      assert.doesNotMatch(value, /\b(SCORE|GRADE|TIMER|FAIL|WRONG)\b/, `${language.id}.${key} shouts or shames`);
      assert.equal(value, value.trim(), `${language.id}.${key} has stray whitespace`);
    }
  }
});

test("[B8] retry copy is gentle in every language", () => {
  for (const language of UI_LANGUAGES) {
    const wrong = uiStrings(language.id).wrongFeedback;
    assert.ok(wrong.length > 0);
    assert.doesNotMatch(wrong, /wrong|fail|bad|incorrect/i);
  }
});

test("[B8] the copy summary action stays in English until it is checked", () => {
  // Honesty marker: this one string is a flagged item for a native speaker review.
  assert.equal(uiStrings("pcm").copySummary, EN_PLACEHOLDER.copySummary);
  assert.equal(uiStrings("yo").copySummary, EN_PLACEHOLDER.copySummary);
});
