import assert from "node:assert/strict";
import { test } from "node:test";
import {
  selectReviewSkills,
  daysBetween,
  reviewReasonPhrase,
  placementSummary,
  WEAK_THRESHOLD,
  STALE_DAYS,
  MAX_REVIEWS_PER_SKILL,
} from "../lib/review.ts";

// Pinned dates. Nothing here reads the clock, so the plan is identical on every run.
const DAY = 86_400_000;
const TODAY = Date.parse("2026-10-10T09:00:00Z");
const daysAgo = (n) => TODAY - n * DAY;

test("[B4] daysBetween counts whole days and never goes negative", () => {
  assert.equal(daysBetween(daysAgo(3), TODAY), 3);
  assert.equal(daysBetween(TODAY, TODAY), 0);
  // A clock skew or an attempt stamped in the future must not produce a negative gap.
  assert.equal(daysBetween(TODAY + 5000, TODAY), 0);
  assert.equal(daysBetween(Number.NaN, TODAY), 0);
});

test("[B4] a skill that slipped is offered for another look", () => {
  const plan = selectReviewSkills(
    { "count-within-10": { pKnown: 0.31, tier: 1 } },
    [{ skillId: "count-within-10", timestamps: [daysAgo(1)] }],
    TODAY,
  );
  assert.equal(plan.length, 1);
  assert.equal(plan[0].reason, "slipped");
  assert.ok(plan[0].pKnown < WEAK_THRESHOLD);
});

test("[B4] a skill left alone for long enough is offered again", () => {
  const plan = selectReviewSkills(
    { "money-simple": { pKnown: 0.8, tier: 2 } },
    [{ skillId: "money-simple", timestamps: [daysAgo(STALE_DAYS)] }],
    TODAY,
  );
  assert.equal(plan.length, 1);
  assert.equal(plan[0].reason, "quiet");
});

test("[B4] a healthy skill practised yesterday is left alone", () => {
  const plan = selectReviewSkills(
    { "place-value-tens": { pKnown: 0.82, tier: 2 } },
    [{ skillId: "place-value-tens", timestamps: [daysAgo(1)] }],
    TODAY,
  );
  assert.deepEqual(plan, [], "no pressure: a recently practised, learned skill is not re-served");
});

test("[B4] a never attempted skill is not treated as quiet", () => {
  const plan = selectReviewSkills({ "shapes-geometry": { pKnown: 0.4, tier: 1 } }, [], TODAY);
  // It slipped, so it is still offered, but for the right reason.
  assert.equal(plan.length, 1);
  assert.equal(plan[0].reason, "slipped");
  assert.equal(plan[0].daysSinceLastAttempt, null);

  const strong = selectReviewSkills({ "shapes-geometry": { pKnown: 0.9, tier: 3 } }, [], TODAY);
  assert.deepEqual(strong, [], "a strong skill the child has never met is not pushed at them");
});

test("[B4] slipping outranks going quiet, and the weakest comes first", () => {
  const plan = selectReviewSkills(
    {
      "quiet-skill": { pKnown: 0.5, tier: 2 },
      "weak-skill": { pKnown: 0.2, tier: 1 },
    },
    [
      { skillId: "quiet-skill", timestamps: [daysAgo(20)] },
      { skillId: "weak-skill", timestamps: [daysAgo(1)] },
    ],
    TODAY,
    5,
  );
  assert.equal(plan[0].skillId, "weak-skill");
  assert.equal(plan[0].reason, "slipped");
  assert.equal(plan[1].reason, "quiet");
});

test("[B4] the plan is capped so one hard skill cannot fill the session", () => {
  const plan = selectReviewSkills(
    { "count-within-10": { pKnown: 0.1, tier: 1 } },
    [{ skillId: "count-within-10", timestamps: [daysAgo(1)] }],
    TODAY,
    3,
  );
  assert.equal(plan.length, 1, "a single skill can never be served more than once in one plan");
  assert.ok(MAX_REVIEWS_PER_SKILL >= 1);
});

test("[B4] the limit is respected and the result is deterministic", () => {
  const mastery = {
    a: { pKnown: 0.11, tier: 1 },
    b: { pKnown: 0.12, tier: 1 },
    c: { pKnown: 0.13, tier: 1 },
    d: { pKnown: 0.14, tier: 1 },
  };
  const first = selectReviewSkills(mastery, [], TODAY, 2);
  const second = selectReviewSkills(mastery, [], TODAY, 2);
  assert.equal(first.length, 2);
  assert.deepEqual(
    first.map((c) => c.skillId),
    second.map((c) => c.skillId),
    "same input, same order, every run"
  );
});

test("[B4] copy never blames the child and never mentions a streak", () => {
  const slipped = { skillId: "x", reason: "slipped", pKnown: 0.2, tier: 1, daysSinceLastAttempt: 1, priority: 1 };
  const quiet = { ...slipped, reason: "quiet" };
  for (const phrase of [reviewReasonPhrase(slipped), reviewReasonPhrase(quiet)]) {
    assert.ok(phrase.length > 0);
    assert.doesNotMatch(phrase, /fail|wrong|streak|lose|behind|bad/i);
  }
});

test("[B4] the placement summary names a starting level, not a score", () => {
  const summary = placementSummary("s2", "Money and Snacks", 6);
  assert.match(summary, /Money and Snacks/);
  assert.match(summary, /6 skills/);
  assert.doesNotMatch(summary, /score|grade|percent|%/i);
  assert.match(placementSummary("s1", "Counting", 1), /1 skill\./);
});
