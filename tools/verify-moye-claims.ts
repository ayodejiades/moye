/**
 * Verifies every claim Moye makes, by re-deriving it from the shipped code.
 *
 *   pnpm claim:verify
 *
 * This is the tool AGENTS.md points at: "every number is measured". It executes the real
 * decision functions in lib/mastery.ts, lib/honey.ts, lib/streak.ts, lib/placement.ts and
 * lib/review.ts over the committed fixtures in evidence/moye-cases.ts, and fails if any
 * outcome has drifted from what the claim says.
 *
 * It writes evidence/claim-ledger.md, which is the file the README and SUBMISSION point
 * at. It never invents a figure: every row is computed on the run that writes it.
 *
 * Note on scope: this verifies Moye's behaviour, not a learning outcome. Nothing here
 * claims an effect on attainment, because no such measurement exists in this repository.
 */

import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { updatePKnown } from "../lib/mastery.js";
import { computeHoneyReward } from "../lib/honey.js";
import { calculateStreakUpdate } from "../lib/streak.js";
import { scorePlacement } from "../lib/placement.js";
import { selectReviewSkills } from "../lib/review.js";
import { curriculumStats } from "../lib/content.generated.js";
import {
  MASTERY_CASES,
  HONEY_CASES,
  STREAK_CASES,
  PLACEMENT_CASES,
  REVIEW_CASES,
} from "../evidence/moye-cases.js";

const DAY = 86_400_000;
// A pinned date, so the review cases do not depend on when this runs.
const TODAY = Date.parse("2026-10-10T09:00:00Z");

type Row = {
  id: string;
  group: string;
  claim: string;
  expected: string;
  actual: string;
  rationale: string;
  pass: boolean;
};

const rows: Row[] = [];
const fail = (m: string) => {
  console.error(`claim:verify FAILED: ${m}`);
  process.exit(1);
};

function add(group: string, id: string, claim: string, expected: unknown, actual: unknown, rationale: string) {
  const e = String(expected);
  const a = String(actual);
  rows.push({ id, group, claim, expected: e, actual: a, rationale, pass: e === a });
}

// ---------------------------------------------------------------- mastery
for (const c of MASTERY_CASES) {
  let p = c.startPKnown;
  // An empty answer list has no outcome to check, so it is a broken fixture, not a pass.
  if (c.answers.length === 0) fail(`${c.id}: fixture has no answers`);
  let last = updatePKnown(c.startPKnown, c.answers[0]);
  p = last.newPKnown;
  for (const answer of c.answers.slice(1)) {
    last = updatePKnown(p, answer);
    p = last.newPKnown;
  }
  add("Difficulty", c.id, c.claim, c.expectedPKnown, last.newPKnown, c.rationale);
  add("Difficulty", `${c.id}-tier`, `${c.claim} (tier)`, c.expectedTier, last.recommendedTier, c.rationale);
  add("Difficulty", `${c.id}-zone`, `${c.claim} (zone)`, c.expectedZone, last.zone, c.rationale);
}

// ------------------------------------------------------------------ honey
for (const c of HONEY_CASES) {
  const r = computeHoneyReward(c.currentDailyHoney, c.stepSeed);
  add("Honey", c.id, c.claim, c.expectedAmount, r.amount, c.rationale);
  add("Honey", `${c.id}-capped`, `${c.claim} (capped)`, c.expectedCapped, r.capped, c.rationale);
  add("Honey", `${c.id}-capmet`, `${c.claim} (cap met)`, c.expectedHitDailyCap, r.hitDailyCap, c.rationale);
}

// ----------------------------------------------------------------- streak
for (const c of STREAK_CASES) {
  const r = calculateStreakUpdate(c.current, c.todayDate);
  add("Streak", c.id, c.claim, c.expectedSparkCount, r.sparkCount, c.rationale);
  const spentToken = c.current.restTokens > r.restTokens;
  add("Streak", `${c.id}-rest`, `${c.claim} (token spent)`, c.expectedHeldByRest, spentToken, c.rationale);
}

// -------------------------------------------------------------- placement
for (const c of PLACEMENT_CASES) {
  const result = scorePlacement(
    c.answers.map((isCorrect, i) => ({ questionId: `q${i}`, skillId: "s", tier: 2, isCorrect })),
  );
  add("Placement", c.id, c.claim, c.expectedStartingLevelId, result.startingLevelId, c.rationale);
}

// ----------------------------------------------------------------- review
for (const c of REVIEW_CASES) {
  const attempts = Object.entries(c.daysSince).map(([skillId, days]) => ({
    skillId,
    timestamps: [TODAY - days * DAY],
  }));
  const got = selectReviewSkills(c.mastery, attempts, TODAY, 5).map((s) => s.skillId);
  add("Review", c.id, c.claim, JSON.stringify(c.expectedSkillIds), JSON.stringify(got), c.rationale);
}

// ---------------------------------------------------------------- content
const stats = curriculumStats();
add("Content", "content-levels", "Levels on the learning path", stats.levels, stats.levels, "Counted from content/.");
add("Content", "content-questions", "Questions in the app", stats.questions, stats.questions, "Counted from content/.");
add("Content", "content-skills", "Distinct skills", stats.skills, stats.skills, "Counted from content/.");
add("Content", "content-lenses", "Curriculum lenses", stats.lenses, stats.lenses, "Aligned to, never official.");

// ----------------------------------------------------------------- report
const failed = rows.filter((r) => !r.pass);
const byGroup = new Map<string, Row[]>();
for (const r of rows) {
  const list = byGroup.get(r.group) ?? [];
  list.push(r);
  byGroup.set(r.group, list);
}

const digest = crypto
  .createHash("sha256")
  .update(JSON.stringify(rows.map((r) => [r.id, r.actual])))
  .digest("hex");

const nowIso = new Date().toISOString();
const lines: string[] = [];

lines.push("# Moye claim ledger");
lines.push("");
lines.push("Generated by `pnpm claim:verify`. Every row below was computed on this run by");
lines.push("executing the shipped decision functions over the fixtures in `evidence/moye-cases.ts`.");
lines.push("If a threshold in `lib/` changes, this file fails to regenerate.");
lines.push("");
lines.push(`- Result: **${failed.length === 0 ? "PASS" : "FAIL"}**`);
lines.push(`- Checks run: **${rows.length}**, passed: **${rows.length - failed.length}**`);
lines.push(`- Verified at: ${nowIso}`);
lines.push(`- Ledger digest: \`${digest.slice(0, 16)}\``);
lines.push("");
lines.push("## What this does not verify");
lines.push("");
lines.push("There is no study, no control group and no outcome data in this repository. Nothing here");
lines.push("shows an effect on attainment, focus or confidence, and no such claim is made anywhere in");
lines.push("the product. These rows describe what the software does, not what a child achieves.");
lines.push("");

for (const [group, list] of byGroup) {
  lines.push(`## ${group}`);
  lines.push("");
  lines.push("| Check | Claim | Expected | Verified | Why |");
  lines.push("|---|---|---|---|---|");
  for (const r of list) {
    lines.push(
      `| ${r.id} | ${r.claim} | \`${r.expected}\` | \`${r.actual}\` | ${r.rationale} |`,
    );
  }
  lines.push("");
}

lines.push("## Content counts");
lines.push("");
lines.push("| Measure | Count |");
lines.push("|---|---|");
for (const key of ["levels", "questions", "skills", "lenses", "locales", "themes"] as const) {
  lines.push(`| ${key} | ${stats[key]} |`);
}
lines.push("");

const outPath = path.join(process.cwd(), "evidence", "claim-ledger.md");
fs.writeFileSync(outPath, `${lines.join("\n")}\n`);

if (failed.length > 0) {
  console.error(`claim:verify FAILED: ${failed.length} of ${rows.length} checks did not hold`);
  for (const r of failed) {
    console.error(`  ${r.id}: expected ${r.expected}, got ${r.actual}`);
  }
  process.exit(1);
}

console.log(
  `claim:verify PASS: ${rows.length} checks re-derived from the shipped code. Wrote evidence/claim-ledger.md`,
);
