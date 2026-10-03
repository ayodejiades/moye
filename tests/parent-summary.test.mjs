import assert from "node:assert/strict";
import { test } from "node:test";
import {
  buildParentSummary,
  joinList,
  summaryHasBannedWord,
  BANNED_SUMMARY_WORDS,
} from "../lib/parent-summary.ts";

const base = {
  childName: "Anjola",
  strongSkills: ["Counting to 10", "Number bonds"],
  growingSkills: ["Carrying digits in 2 digit sums"],
  focusMinutes: 9,
  sparks: 4,
  curriculum: "Nigeria UBE",
};

test("[B9] the summary reads like plain language and names the child", () => {
  const text = buildParentSummary(base);
  assert.match(text, /Anjola/);
  assert.match(text, /Counting to 10/);
  assert.match(text, /Nigeria UBE/);
  assert.ok(text.split("\n\n").length >= 3, "short readable paragraphs, not a wall of text");
});

test("[B9] no timers and no shame are stated plainly", () => {
  const text = buildParentSummary(base);
  assert.match(text, /no timers/i);
  assert.match(text, /only ever got a hint/i);
  assert.match(text, /stopping for the day is fine/i);
});

test("[B9] the summary never uses a banned clinical or score word", () => {
  const text = buildParentSummary(base);
  assert.equal(summaryHasBannedWord(text), null, `banned word in: ${text}`);
  // And the checker itself works.
  for (const word of BANNED_SUMMARY_WORDS) {
    assert.ok(summaryHasBannedWord(`The child did poorly: ${word}`), `should catch ${word}`);
  }
});

test("[B9] a growing skill is phrased as practice, never as failure", () => {
  const text = buildParentSummary({ ...base, strongSkills: [], growingSkills: ["Subtraction as take away"] });
  assert.match(text, /is practising Subtraction as take away/);
  assert.equal(summaryHasBannedWord(text), null);
});

test("[B9] a missing measurement is left out, never guessed", () => {
  const text = buildParentSummary({ ...base, focusMinutes: null });
  assert.doesNotMatch(text, /focused for about/, "no span was measured, so no focus claim");
  assert.doesNotMatch(text, /minute/, "and no invented minute count either");
});

test("[B9] plurals read correctly", () => {
  assert.match(buildParentSummary({ ...base, focusMinutes: 1 }), /1 minute at a time/);
  assert.match(buildParentSummary({ ...base, focusMinutes: 5 }), /5 minutes at a time/);
  assert.match(buildParentSummary({ ...base, sparks: 1 }), /1 day in a row/);
  assert.match(buildParentSummary({ ...base, sparks: 3 }), /3 days in a row/);
});

test("[B9] a child with nothing recorded yet still gets kind copy", () => {
  const text = buildParentSummary({
    childName: "",
    strongSkills: [],
    growingSkills: [],
    focusMinutes: null,
    sparks: 0,
    curriculum: "Nigeria UBE",
  });
  assert.match(text, /just getting started/);
  assert.match(text, /completely fine/);
  assert.doesNotMatch(text, /name's week/, "a blank name does not leave a dangling apostrophe");
  assert.equal(summaryHasBannedWord(text), null);
});

test("[B9] joinList says it the way a person would", () => {
  assert.equal(joinList([]), "");
  assert.equal(joinList(["one"]), "one");
  assert.equal(joinList(["one", "two"]), "one and two");
  assert.equal(joinList(["one", "two", "three"]), "one, two and three");
  assert.equal(joinList(["  padded  ", "", "two"]), "padded and two");
});

test("[B9] the same report always produces the same text", () => {
  assert.equal(buildParentSummary(base), buildParentSummary(base));
});
