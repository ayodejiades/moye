/**
 * Keeps content/ and the typed banks in step (features.md B3).
 *
 *   pnpm content:sync
 *
 * content/skills/levels.json is derived from the typed lesson banks. Run this after adding
 * or editing a question, then run `pnpm content:build`. tests/content-data.test.mjs fails
 * if the two ever drift apart, so this script is a convenience, not the safety net.
 */
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { LEVEL_BANKS, LEVEL_TITLES, LEVEL_SKILL_IDS, SKILL_TITLES } from "../lib/lesson-bank.js";
import type { Question } from "../lib/content-schema.js";
import { READING_BANKS, READING_SKILLS } from "../lib/reading-bank.js";

const path = join(process.cwd(), "content/skills/levels.json");
// Question[] from both banks; the shape is validated on the way in by content:build.
const banks = { ...LEVEL_BANKS, ...READING_BANKS } as Record<string, Question[]>;

const levels: Record<string, unknown> = {};
for (const [id, questions] of Object.entries(banks)) {
  const skillId = LEVEL_SKILL_IDS[id] || questions[0]?.skillId || "";
  levels[id] = {
    id,
    title: LEVEL_TITLES[id] ?? id,
    subject: id.startsWith("r") ? "reading" : "maths",
    skillId,
    skillTitle: SKILL_TITLES[skillId] ?? READING_SKILLS.find((s) => s.id === skillId)?.title ?? "",
    questions,
  };
}

writeFileSync(path, `${JSON.stringify({ version: 1, levels }, null, 2)}\n`);
console.log(`content:sync wrote ${Object.keys(levels).length} levels to content/skills/levels.json`);
console.log("Now run: pnpm content:build");
