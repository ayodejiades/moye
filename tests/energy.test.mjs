import assert from "node:assert/strict";
import { test } from "node:test";
import {
  planForEnergy,
  energyGreeting,
  focusMinutesHeld,
  ENERGY_LEVELS,
} from "../lib/energy.ts";

test("[B10] the check in offers exactly three plain choices", () => {
  assert.deepEqual(
    ENERGY_LEVELS.map((e) => e.id),
    ["full", "okay", "tired"],
  );
  for (const level of ENERGY_LEVELS) {
    assert.ok(level.label.length > 0 && level.blurb.length > 0);
  }
});

test("[B10] a tired child starts gentler and finishes sooner", () => {
  const skills = ["count-within-10", "money-simple"];
  const tired = planForEnergy("tired", skills);
  const full = planForEnergy("full", skills);

  assert.equal(tired.startTier, 1);
  assert.ok(full.startTier > tired.startTier, "a full energy session may open at a higher tier");
  assert.ok(tired.questionTarget < full.questionTarget, "a tired session aims at fewer questions");
  assert.ok(tired.honeyScale < full.honeyScale, "rewards are trimmed so the session stays short");
  assert.equal(tired.suggestBreak, true);
  assert.equal(full.suggestBreak, false);
});

test("[B10] a tired session only offers the gentlest skills", () => {
  const plan = planForEnergy(
    "tired",
    ["shapes-geometry", "count-within-10", "money-simple"],
    {
      "count-within-10": { pKnown: 0.25, tier: 1 },
      "money-simple": { pKnown: 0.8, tier: 2 },
      "shapes-geometry": { pKnown: 0.9, tier: 3 },
    },
  );
  assert.ok(plan.skillOrder.length <= 2, "a tired session does not queue the whole path");
  assert.equal(plan.skillOrder[0], "count-within-10", "the best known skill comes first");
});

test("[B10] a session with energy keeps the whole path available", () => {
  const skills = ["count-within-10", "money-simple", "place-value-tens"];
  const full = planForEnergy("full", skills);
  const okay = planForEnergy("okay", skills);
  assert.equal(full.skillOrder.length, 3);
  assert.equal(okay.skillOrder.length, 3);
});

test("[B10] a skill never met is treated as a gentle default, not as zero", () => {
  const plan = planForEnergy("okay", ["new-skill"], {});
  assert.deepEqual(plan.skillOrder, ["new-skill"]);
  // A single unknown skill must not throw or come back undefined.
  assert.equal(typeof plan.questionTarget, "number");
});

test("[B10] empty and duplicate skill lists are handled", () => {
  const empty = planForEnergy("full", []);
  assert.deepEqual(empty.skillOrder, []);
  const blanks = planForEnergy("full", ["", "  "]);
  assert.deepEqual(blanks.skillOrder, [], "blank ids are dropped");
  const dupes = planForEnergy("full", ["a", "a", "b"]);
  assert.deepEqual(dupes.skillOrder, ["a", "b"], "no skill is queued twice");
});

test("[B10] the greeting is warm and never scores the child", () => {
  for (const level of ["full", "okay", "tired"]) {
    const line = energyGreeting("Amina", level);
    assert.match(line, /Amina/);
    assert.doesNotMatch(line, /score|rating|level|grade|percent|%/i);
  }
  assert.match(energyGreeting("", "tired"), /friend/, "a blank name still reads naturally");
});

test("[B10] focus held comes only from measured timestamps", () => {
  const base = Date.parse("2026-10-10T09:00:00Z");
  assert.equal(focusMinutesHeld([]), null, "nothing measured, nothing claimed");
  assert.equal(focusMinutesHeld([base]), null, "one timestamp is not a span");
  assert.equal(
    focusMinutesHeld([base, base + 20_000]),
    null,
    "under a minute is noise, so it is not reported as focus",
  );
  assert.equal(focusMinutesHeld([base, base + 180_000]), 3);
  // Unsorted input still gives the same answer.
  assert.equal(focusMinutesHeld([base + 180_000, base, base + 60_000]), 3);
  assert.equal(focusMinutesHeld([base, Number.NaN, base + 120_000]), 2, "a corrupt stamp is ignored");
});
