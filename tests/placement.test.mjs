import assert from "node:assert/strict";
import { test } from "node:test";
import {
  scorePlacement,
  seedMasteryFromPlacement,
  getPlacementQuestions,
  levelsToUnlock,
  placementHeadline,
  PLACEMENT_QUESTION_IDS,
  STEP_UP_AFTER,
} from "../lib/placement.ts";
import { LEVEL_SEQUENCE } from "../lib/moye-store.ts";

const answer = (isCorrect, over = {}) => ({
  questionId: "q",
  skillId: "count-within-10",
  tier: 2,
  isCorrect,
  ...over,
});

test("[A2] every placement question exists in the committed bank", () => {
  const questions = getPlacementQuestions();
  assert.equal(questions.length, PLACEMENT_QUESTION_IDS.length, "no placeholder ids");
  for (const q of questions) {
    assert.ok(q.promptTemplate.length > 0, `${q.id} has a prompt`);
    assert.ok(q.readAloudText.length > 0, `${q.id} has read aloud text`);
    assert.ok(q.hint.length > 0, `${q.id} has a hint`);
    assert.ok(q.options.length >= 2, `${q.id} has options`);
    assert.equal(q.options.filter((o) => o.isCorrect).length, 1, `${q.id} has exactly one right answer`);
  }
});

test("[A2] placement questions span the three tiers", () => {
  const tiers = new Set(getPlacementQuestions().map((q) => q.tier));
  assert.deepEqual([...tiers].sort(), [1, 2, 3], "the ladder must actually have three rungs");
});

test("[A2] a strong learner is placed above a struggling one", () => {
  const strong = scorePlacement(Array.from({ length: 6 }, () => answer(true)));
  const struggling = scorePlacement(Array.from({ length: 6 }, () => answer(false)));
  assert.ok(strong.rung > struggling.rung, `strong ${strong.rung} vs struggling ${struggling.rung}`);
  assert.notEqual(strong.startingLevelId, struggling.startingLevelId, "they land on different levels");
});

test("[A2] the ladder is clamped to the rungs that exist", () => {
  const allRight = scorePlacement(Array.from({ length: 40 }, () => answer(true)));
  const allWrong = scorePlacement(Array.from({ length: 40 }, () => answer(false)));
  assert.ok(allRight.rung <= 2, "cannot climb past the top rung");
  assert.ok(allWrong.rung >= 0, "cannot sink below the bottom rung");
  assert.equal(allWrong.startingLevelId, "s1", "a struggling learner still starts at the beginning");
});

test("[A2] an alternating pattern neither rewards nor punishes", () => {
  const mixed = scorePlacement(Array.from({ length: 6 }, (_, i) => answer(i % 2 === 0)));
  assert.equal(mixed.rung, 1, "no consistent run, so the ladder stays where it started");
});

test("[A2] the ladder needs a run of answers to move", () => {
  const one = scorePlacement([answer(true)]);
  assert.equal(one.rung, 1, `one correct answer must not move the ladder (STEP_UP_AFTER=${STEP_UP_AFTER})`);
  const two = scorePlacement([answer(true), answer(true)]);
  assert.equal(two.rung, 2);
});

test("[A2] the same estimator that teaches the lesson seeds the placement", () => {
  const seed = seedMasteryFromPlacement([answer(true), answer(false), answer(true)]);
  const skill = seed["count-within-10"];
  assert.ok(skill.pKnown > 0 && skill.pKnown < 1, "mastery is a probability");
  assert.ok([1, 2, 3].includes(skill.tier));
});

test("[A2] a never attempted skill is absent from the seed rather than zeroed", () => {
  const seed = seedMasteryFromPlacement([answer(true, { skillId: "money-simple" })]);
  assert.deepEqual(Object.keys(seed), ["money-simple"]);
});

test("[A2] only skills actually covered are counted as measured", () => {
  const result = scorePlacement([
    answer(true, { skillId: "count-within-10" }),
    answer(true, { skillId: "money-simple" }),
    answer(true, { skillId: "count-within-10" }),
  ]);
  assert.equal(result.skillsMeasured, 2);
  assert.equal(scorePlacement([]).skillsMeasured, 0);
});

test("[A2] placement unlocks the starting level and everything before it", () => {
  assert.deepEqual(levelsToUnlock("s1", LEVEL_SEQUENCE), ["s1"]);
  assert.deepEqual(levelsToUnlock("s2", LEVEL_SEQUENCE), ["s1", "s2"]);
  assert.deepEqual(levelsToUnlock("s4", LEVEL_SEQUENCE), LEVEL_SEQUENCE);
  // An unknown level must not unlock nothing and strand the child.
  assert.deepEqual(levelsToUnlock("nope", LEVEL_SEQUENCE), ["s1"]);
});

test("[A2] the headline names a level and never a score", () => {
  const line = placementHeadline("Money and Snacks");
  assert.match(line, /Moyin found a good place to start/);
  assert.match(line, /Money and Snacks/);
  assert.doesNotMatch(line, /score|grade|percent|%|level \d/i);
});

test("[A2] every level the placement can start on has a real title", () => {
  // Two slips drop the ladder one rung from its middle start, so s1 is reachable.
  // The ladder only has three rungs, so s4 is deliberately not a placement outcome:
  // a child who is that strong starts at s3 and unlocks s4 by earning it.
  // Each rung needs a run to move to, so a real answer pattern is used for each.
  const reachable = new Map(
    [
      [false, false], // two slips: down to the gentlest rung
      [false, false, true, true], // down, then a run back up: the middle rung
      [true, true], // a run straight up: the top rung
    ].map((pattern) => {
      const result = scorePlacement(pattern.map(answer));
      return [result.startingLevelId, result];
    }),
  );
  assert.deepEqual([...reachable.keys()].sort(), ["s1", "s2", "s3"], "all three rungs are reachable");
  for (const [id, result] of reachable) {
    assert.ok(result.startingLevelTitle.length > 0, `${id} has a title`);
    assert.ok(LEVEL_SEQUENCE.includes(id), `${id} is a real level`);
  }
});
