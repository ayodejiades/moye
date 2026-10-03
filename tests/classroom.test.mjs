import assert from "node:assert/strict";
import { test } from "node:test";
import {
  joinCodeFor,
  whoNeedsHelp,
  buildClassroomReport,
  classroomSummaryLine,
  classSize,
  NEEDS_HELP_THRESHOLD,
  MAX_HELP_LIST,
  BANNED_REPORT_WORDS,
} from "../lib/classroom.ts";

const DAY = 86_400_000;
const NOW = Date.parse("2026-10-10T09:00:00Z");

const child = (over = {}) => ({
  id: "c1",
  name: "Amina",
  mastery: { "count-within-10": { pKnown: 0.8, tier: 2 } },
  attempts: [NOW - 5 * 60_000, NOW],
  streakDays: 3,
  honeyBalance: 12,
  ...over,
});

test("[B6] a join code is stable and readable", () => {
  const code = joinCodeFor("Year 4");
  assert.match(code, /^MOYE-\d{3}$/);
  assert.equal(joinCodeFor("Year 4"), code, "the same class name always gets the same code");
  assert.notEqual(joinCodeFor("Year 5"), code);
  assert.equal(joinCodeFor(""), joinCodeFor(""), "a blank name still gets a code");
  assert.equal(joinCodeFor("!!!"), joinCodeFor(""), "punctuation does not change the code");
});

test("[B6] only skills actually practised can appear on the help list", () => {
  const entries = whoNeedsHelp([
    child({ mastery: { "count-within-10": { pKnown: 0.3, tier: 1 } } }),
  ]);
  assert.equal(entries.length, 1);
  assert.equal(entries[0].skillId, "count-within-10");
  assert.ok(entries[0].pKnown < NEEDS_HELP_THRESHOLD);
});

test("[B6] a skill a child has never met is never called weak", () => {
  // Only a strong skill is recorded, so nothing belongs on the list.
  const entries = whoNeedsHelp([child()]);
  assert.deepEqual(entries, [], "a practised and learned skill is not a concern");
  // A child with no record at all is likewise not listed.
  assert.deepEqual(whoNeedsHelp([child({ mastery: {} })]), []);
});

test("[B6] the list is ordered by how far below the threshold, then by name", () => {
  const entries = whoNeedsHelp([
    child({ id: "b", name: "Bola", mastery: { s: { pKnown: 0.45, tier: 1 } } }),
    child({ id: "a", name: "Ada", mastery: { s: { pKnown: 0.1, tier: 1 } } }),
    child({ id: "c", name: "Chidi", mastery: { s: { pKnown: 0.45, tier: 1 } } }),
  ]);
  assert.deepEqual(entries.map((e) => e.childName), ["Ada", "Bola", "Chidi"]);
  assert.deepEqual(entries.map((e) => e.childName), whoNeedsHelp([
    child({ id: "c", name: "Chidi", mastery: { s: { pKnown: 0.45, tier: 1 } } }),
    child({ id: "a", name: "Ada", mastery: { s: { pKnown: 0.1, tier: 1 } } }),
    child({ id: "b", name: "Bola", mastery: { s: { pKnown: 0.45, tier: 1 } } }),
  ]).map((e) => e.childName), "order does not depend on input order");
});

test("[B6] the list is capped so a whole class cannot fill the screen", () => {
  const many = Array.from({ length: 20 }, (_, i) =>
    child({ id: `c${i}`, name: `Child ${i}`, mastery: { s: { pKnown: 0.1 + i * 0.01, tier: 1 } } }),
  );
  const entries = whoNeedsHelp(many);
  assert.equal(entries.length, MAX_HELP_LIST);
  assert.equal(whoNeedsHelp(many, 2).length, 2);
  assert.equal(whoNeedsHelp(many, 0).length, 0);
});

test("[B6] a corrupt mastery number does not produce NaN in the list", () => {
  const entries = whoNeedsHelp([child({ mastery: { s: { pKnown: Number.NaN, tier: 1 } } })]);
  assert.equal(entries.length, 1);
  assert.ok(Number.isFinite(entries[0].pKnown), "the number is finite");
});

test("[B6] the summary line only states measured things", () => {
  const withData = classroomSummaryLine(child());
  assert.match(withData, /about 5 minutes/);
  assert.match(withData, /in one sitting/);
  assert.match(withData, /3 days in a row/);
  // A single timestamp is not a span, so no focus claim at all.
  const noData = classroomSummaryLine(child({ attempts: [NOW] }));
  assert.doesNotMatch(noData, /focus/i);
  assert.match(noData, /came back 3 days in a row/);
  // Nothing measured at all falls back to the kind opening line.
  assert.match(
    classroomSummaryLine(child({ attempts: [], streakDays: 0 })),
    /just getting started/,
  );
});

test("[B6] focus reads as singular when it is one minute", () => {
  assert.match(classroomSummaryLine(child({ attempts: [NOW - 60_000, NOW] })), /1 minute in one sitting/);
  assert.match(classroomSummaryLine(child({ attempts: [NOW - 120_000, NOW] })), /2 minutes in one sitting/);
});

test("[B6] a long gap is not counted as one long sitting", () => {
  // Monday and Friday: that is two separate sittings, so there is nothing to report.
  const line = classroomSummaryLine(child({ attempts: [NOW - 4 * DAY, NOW] }));
  assert.doesNotMatch(line, /focus/i, "a four day gap is not one long sitting");
  assert.doesNotMatch(line, /[0-9]{3,} minutes/);

  // Two sittings with real gaps: the longest genuine one is what gets reported.
  const twoSittings = classroomSummaryLine(
    child({ attempts: [NOW - 2 * DAY, NOW - 2 * DAY + 7 * 60_000] }),
  );
  assert.match(twoSittings, /7 minutes in one sitting/);
});

test("[B6] the longest sitting wins when a child has several", () => {
  const line = classroomSummaryLine(
    child({ attempts: [NOW - 3 * DAY - 20 * 60_000, NOW - 3 * DAY - 18 * 60_000, NOW - 8 * 60_000, NOW - 6 * 60_000] }),
  );
  assert.match(line, /2 minutes/, "the 2 minute sitting is the longest one");
});

test("[B6] the printable report is plain and never shames or scores", () => {
  const report = buildClassroomReport("Year 4", [
    child({ name: "Amina", mastery: { "count-within-10": { pKnown: 0.3, tier: 1 } } }),
    child({ id: "c2", name: "Bola", mastery: { s: { pKnown: 0.9, tier: 3 } } }),
  ]);
  assert.match(report, /Year 4/);
  assert.match(report, /Worth a look together today/);
  assert.match(report, /practise count within 10 together, slowly/);
  assert.match(report, /no timers and no countdowns/);
  const lower = report.toLowerCase();
  for (const word of BANNED_REPORT_WORDS) {
    assert.ok(!lower.includes(word), `the report says "${word}": ${report}`);
  }
});

test("[B6] the report handles an empty class without breaking", () => {
  const report = buildClassroomReport("Year 4", []);
  assert.match(report, /Year 4/);
  assert.doesNotMatch(report, /Worth a look together/, "no help list when there is nothing to flag");
  assert.equal(classSize([]), 0);
  assert.equal(classSize(null), 0);
  assert.equal(classSize([child(), child({ id: "c2" })]), 2);
});

test("[B6] a blank class name still produces a readable report", () => {
  const report = buildClassroomReport("   ", [child()]);
  assert.match(report, /^My class/);
  assert.doesNotMatch(report, / +\n/, "no line is only whitespace");
});

test("[B6] a corrupt attempt list does not produce a NaN focus claim", () => {
  const line = classroomSummaryLine(child({ attempts: [Number.NaN, NOW] }));
  assert.doesNotMatch(line, /NaN/);
  assert.equal(classSize(undefined), 0);
});
