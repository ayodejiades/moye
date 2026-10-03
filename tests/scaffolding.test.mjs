import assert from "node:assert/strict";
import { test } from "node:test";
import {
  scaffoldForQuestion,
  buildSteps,
  exampleIntro,
  shouldShowSteps,
  SUPPORTED_TIERS,
} from "../lib/scaffolding.ts";

const base = {
  tier: 1,
  prompt: "Moyin found 4 fossil stones and 2 more. How many altogether?",
  readAloud: "Moyin found 4 fossil stones and 2 more. How many altogether?",
  answer: "6 fossil stones",
  hint: "Start with 4, then count up two more: 5, 6",
  alreadySeenSkill: false,
};

test("[B5] a first question on a new skill comes with a worked example", () => {
  const plan = scaffoldForQuestion(base);
  assert.equal(plan.level, "full");
  assert.ok(plan.example, "an example is offered");
  assert.equal(plan.example.answer, "6 fossil stones");
  assert.ok(plan.example.steps.length > 0, "the steps are shown");
  assert.ok(plan.example.readAloud.length > 0, "the example can be read aloud");
});

test("[B5] the steps fade once the child has seen the example", () => {
  const plan = scaffoldForQuestion({ ...base, alreadySeenSkill: true });
  assert.equal(plan.level, "prompt-only");
  assert.equal(plan.example, null, "no second worked example for the same skill");
  assert.equal(shouldShowSteps(plan), false);
});

test("[B5] a stretch question gets no scaffolding at all", () => {
  const plan = scaffoldForQuestion({ ...base, tier: 3, alreadySeenSkill: true });
  assert.equal(plan.level, "none");
  assert.equal(shouldShowSteps(plan), false);
});

test("[B5] scaffolding is only for the supported tiers", () => {
  for (const tier of SUPPORTED_TIERS) {
    assert.equal(scaffoldForQuestion({ ...base, tier }).level, "full");
  }
  assert.equal(scaffoldForQuestion({ ...base, tier: 3 }).level, "none");
});

test("[B5] hints become one step per instruction", () => {
  // Each clause becomes its own step, and a count sequence becomes one step per number
  // so a child can put a finger on each.
  assert.deepEqual(buildSteps("Start with 4, then count up two more: 5, 6").map((s) => s.label), [
    "Start with 4",
    "count up two more",
    "5",
    "6",
  ]);
});

test("[B5] a hint with no separator is shown whole, never mangled", () => {
  assert.deepEqual(buildSteps("Double 3 is 6").map((s) => s.label), ["Double 3 is 6"]);
  assert.deepEqual(buildSteps("").map((s) => s.label), []);
  assert.deepEqual(buildSteps("   ").map((s) => s.label), []);
});

test("[B5] trailing exclamation is trimmed once, not left dangling", () => {
  const steps = buildSteps("Start at 6: 7, 8, 9!");
  assert.deepEqual(steps.map((s) => s.label), ["Start at 6", "7", "8", "9"]);
});

test("[B5] the intro invites the child in without saying it is easy", () => {
  const first = exampleIntro("Counting to 10", true);
  assert.match(first, /one together/);
  assert.match(first, /Counting to 10/);
  for (const line of [first, exampleIntro("Counting to 10", false)]) {
    assert.doesNotMatch(line, /easy|simple|just|obvious|can't|cannot/i);
  }
});

test("[B5] steps are hidden when there is nothing to show", () => {
  const empty = scaffoldForQuestion({ ...base, hint: "" });
  assert.equal(empty.level, "full", "still an example");
  assert.equal(shouldShowSteps(empty), false, "but no empty steps panel");
});
