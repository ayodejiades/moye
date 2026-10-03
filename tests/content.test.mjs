import assert from "node:assert/strict";
import { test } from "node:test";
import {
  READING_SKILLS,
  READING_BANKS,
  ALL_READING_QUESTIONS,
} from "../lib/reading-bank.ts";
import { LEVEL_BANKS, LEVEL_SKILL_IDS, LEVEL_TITLES } from "../lib/lesson-bank.ts";
import { SkillSchema, QuestionSchema } from "../lib/content-schema.ts";
import { THEMES, LOCALES, renderQuestion } from "../lib/theme-resolver.ts";

const MIN_QUESTIONS_PER_SKILL = 3;

test("[B1] the reading subject has at least twenty real questions", () => {
  assert.ok(
    ALL_READING_QUESTIONS.length >= 20,
    `SPEC 6.3 forbids an empty subject; found ${ALL_READING_QUESTIONS.length} questions`,
  );
});

test("[B1] there are at least ten distinct reading skills", () => {
  assert.ok(READING_SKILLS.length >= 10, `found ${READING_SKILLS.length} skills`);
  const ids = new Set(READING_SKILLS.map((s) => s.id));
  assert.equal(ids.size, READING_SKILLS.length, "skill ids are unique");
});

test("[B1] no skill is a stub: each one has enough to actually teach", () => {
  for (const skill of READING_SKILLS) {
    assert.ok(
      skill.questions.length >= MIN_QUESTIONS_PER_SKILL,
      `${skill.id} has only ${skill.questions.length} questions`,
    );
    assert.ok(skill.title.length > 0, `${skill.id} has a title`);
    assert.ok(skill.description.length > 0, `${skill.id} has a description`);
  }
});

test("[B1] every reading question validates against the content schema", () => {
  for (const q of ALL_READING_QUESTIONS) {
    const parsed = QuestionSchema.safeParse(q);
    assert.ok(parsed.success, `${q.id} fails the schema: ${JSON.stringify(parsed.error?.issues?.[0])}`);
  }
  for (const skill of READING_SKILLS) {
    const parsed = SkillSchema.safeParse(skill);
    assert.ok(parsed.success, `${skill.id} fails the schema: ${JSON.stringify(parsed.error?.issues?.[0])}`);
  }
});

test("[B1] every reading skill is a reading skill, with grade band and priors", () => {
  for (const skill of READING_SKILLS) {
    assert.equal(skill.subject, "reading", `${skill.id} is not tagged reading`);
    assert.ok(["A", "B", "C"].includes(skill.gradeBand), `${skill.id} has no grade band`);
    for (const key of ["pInit", "pLearn", "pSlip", "pGuess"]) {
      const value = skill[key];
      assert.ok(value >= 0 && value <= 1, `${skill.id}.${key} is out of range: ${value}`);
    }
  }
});

test("[B1] every question has read aloud text and an actionable hint", () => {
  for (const q of ALL_READING_QUESTIONS) {
    assert.ok(q.readAloudText.trim().length > 10, `${q.id} has no real read aloud text`);
    assert.ok(q.hint.trim().length > 5, `${q.id} has no hint`);
  }
});

test("[B1] every question has options with exactly one right answer", () => {
  for (const q of ALL_READING_QUESTIONS) {
    assert.ok(q.options.length >= 2, `${q.id} needs at least two options`);
    const correct = q.options.filter((o) => o.isCorrect);
    assert.equal(correct.length, 1, `${q.id} must have exactly one right answer`);
    const texts = new Set(q.options.map((o) => o.text));
    assert.equal(texts.size, q.options.length, `${q.id} has duplicate options`);
  }
});

test("[B1] every question spans the tiers a learner needs", () => {
  for (const skill of READING_SKILLS) {
    const tiers = new Set(skill.questions.map((q) => q.tier));
    assert.ok(tiers.size >= 2, `${skill.id} only uses ${[...tiers].join(",")}`);
    for (const tier of tiers) assert.ok([1, 2, 3].includes(tier), `${skill.id} has a bad tier`);
  }
});

test("[B1] every question id is unique across the whole bank", () => {
  const ids = ALL_READING_QUESTIONS.map((q) => q.id);
  assert.equal(new Set(ids).size, ids.length, "duplicate question id");
});

test("[B1] every reading level holds questions and they all come from the bank", () => {
  for (const [level, questions] of Object.entries(READING_BANKS)) {
    assert.ok(questions.length > 0, `${level} is empty`);
    const known = new Set(ALL_READING_QUESTIONS.map((q) => q.id));
    for (const q of questions) {
      assert.ok(known.has(q.id), `${q.id} in ${level} is not in the flat bank`);
    }
  }
});

test("[B1] every reading question renders with no unfilled slot, in any theme or locale", () => {
  const slots = /\{[a-z_]+\}/g;
  for (const q of ALL_READING_QUESTIONS) {
    for (const themeId of Object.keys(THEMES)) {
      for (const localeId of Object.keys(LOCALES)) {
        const rendered = renderQuestion(q, themeId, localeId);
        for (const text of [rendered.prompt, rendered.readAloud, rendered.hint, ...rendered.options.map((o) => o.text)]) {
          const leftover = text.match(slots);
          assert.equal(leftover, null, `${q.id} left ${leftover} unfilled in ${themeId}/${localeId}`);
        }
      }
    }
  }
});

test("[B1] the reading bank does not collide with the maths bank", () => {
  const mathsIds = new Set(Object.values(LEVEL_BANKS).flat().map((q) => q.id));
  for (const q of ALL_READING_QUESTIONS) {
    assert.ok(!mathsIds.has(q.id), `${q.id} is also a maths id`);
  }
});

test("[B1] every reading skill is named, so a child never sees a raw skill id", () => {
  for (const skill of READING_SKILLS) {
    assert.ok(skill.title.length > 0, `${skill.id} has no title`);
  }
});

test("[B1] reading levels have human titles", () => {
  for (const level of Object.keys(READING_BANKS)) {
    assert.ok(LEVEL_TITLES[level]?.length > 0, `${level} has no title`);
    assert.ok(LEVEL_SKILL_IDS[level]?.length > 0 || level.startsWith("r"), `${level} maps to no skill`);
  }
});
