import assert from "node:assert/strict";
import { test } from "node:test";
import {
  breathPhaseAt,
  breathingTotalSeconds,
  breathPhasePrompt,
  breathScale,
  buildBreakPlan,
  feelingById,
  focusOpeningLine,
  FEELINGS,
  CALM_BREATHING,
  BREATHING_ROUNDS,
} from "../lib/focus-feelings.ts";

test("[B2] the breathing pattern has a longer out breath than in", () => {
  const byPhase = Object.fromEntries(CALM_BREATHING.map((s) => [s.phase, s.seconds]));
  assert.ok(byPhase["breathe out"] > byPhase["breathe in"], "the long exhale is what settles someone");
  assert.ok(byPhase.hold <= 2, "holds stay short so nobody strains");
});

test("[B2] a full round takes a sane amount of time", () => {
  const total = breathingTotalSeconds();
  assert.ok(total >= 10 && total <= 30, `a round should be 10 to 30 seconds, got ${total}`);
  assert.equal(total, 14, "4 in + 2 hold + 6 out + 2 rest");
  assert.ok(BREATHING_ROUNDS >= 2);
});

test("[B2] the phase walks the cycle and loops without pressure", () => {
  const cycle = breathingTotalSeconds();
  const first = breathPhaseAt(0).phase;
  assert.equal(first, "breathe in");
  // Same point in the next round gives the same phase: it loops, it does not end.
  assert.equal(breathPhaseAt(cycle).phase, first);
  assert.equal(breathPhaseAt(cycle * 3 + 1).phase, first);
  assert.notEqual(breathPhaseAt(5).phase, first, "the phase actually changes over a round");
});

test("[B2] a broken or negative clock starts the round instead of misbehaving", () => {
  for (const bad of [-10, Number.NaN, Number.POSITIVE_INFINITY]) {
    assert.equal(breathPhaseAt(bad).phase, "breathe in", `${bad} starts at the beginning`);
  }
});

test("[B2] the ring shrinks on the out breath and stays small at rest", () => {
  assert.equal(breathScale("breathe in"), 1);
  assert.equal(breathScale("hold"), 1);
  assert.ok(breathScale("breathe out") < 1);
  assert.equal(breathScale("rest"), breathScale("breathe out"));
});

test("[B2] every phase has a warm prompt and none rushes the child", () => {
  for (const step of CALM_BREATHING) {
    const prompt = breathPhasePrompt(step.phase);
    assert.ok(prompt.length > 0);
    assert.doesNotMatch(prompt, /count|hurry|quick|faster|now\./i, "never nags or counts down");
  }
});

test("[B2] feelings are plain, distinct, and colour is never the only signal", () => {
  assert.ok(FEELINGS.length >= 4);
  const ids = new Set(FEELINGS.map((f) => f.id));
  assert.equal(ids.size, FEELINGS.length, "no duplicate feelings");
  for (const feeling of FEELINGS) {
    assert.ok(feeling.label.length > 0, `${feeling.id} has a name`);
    assert.ok(feeling.suggestion.length > 0, `${feeling.id} has something Moyin says`);
    assert.doesNotMatch(feeling.suggestion, /score|grade|percent|wrong|bad/i);
  }
  assert.equal(feelingById("nope"), null);
  assert.equal(feelingById("happy")?.label, "Happy");
});

test("[B2] a break plan chunks the work and rests between chunks", () => {
  const plan = buildBreakPlan(12, 5);
  const work = plan.filter((s) => s.label.startsWith("Work"));
  const rest = plan.filter((s) => s.label.startsWith("Rest"));
  // A rest eats into the total, so 12 minutes is 5 work + 2 rest + 5 work.
  assert.equal(work.length, 2, "two 5 minute chunks of actual work");
  assert.equal(rest.length, 1, "one rest between the chunks");
  assert.ok(work.every((s) => s.minutes <= 5), "no chunk is longer than asked");
  // The plan always adds up to the time asked for: nothing is quietly lost.
  assert.equal(
    plan.reduce((n, s) => n + s.minutes, 0),
    12,
  );
  // A rest only ever appears between chunks, never after the final one.
  assert.doesNotMatch(plan[plan.length - 1].label, /^Rest/);
  // Singular wording must not read "1 minutes".
  assert.equal(buildBreakPlan(1, 5)[0].label, "Work for 1 minute");
  assert.equal(buildBreakPlan(2, 5)[0].label, "Work for 2 minutes");
});

test("[B2] a zero, negative or broken total yields no plan rather than a broken one", () => {
  assert.deepEqual(buildBreakPlan(0), []);
  assert.deepEqual(buildBreakPlan(-5), []);
  assert.deepEqual(buildBreakPlan(Number.NaN), []);
});

test("[B2] the opening line invites rather than instructs", () => {
  const line = focusOpeningLine("Amina");
  assert.match(line, /Amina/);
  assert.match(line, /Stop whenever/);
  assert.doesNotMatch(line, /must|should|score|goal/i);
  assert.match(focusOpeningLine(""), /friend/);
});
