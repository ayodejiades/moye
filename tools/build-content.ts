/**
 * Regenerates lib/content.generated.ts from the JSON in content/.
 *
 *   pnpm content:build
 *
 * content/ is the source of truth that ships. This script validates every file against
 * the zod schemas in lib/content-schema.ts and writes the client safe module the app
 * imports. tests/content-data.test.mjs then proves the two never drift apart.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import {
  CurriculumLensSchema,
  LocalePackSchema,
  ThemeWordBankSchema,
  QuestionSchema,
} from "../lib/content-schema.js";

const ROOT = process.cwd();
const TEMPLATE = join(ROOT, "lib/content.generated.ts");

function readJson(relative: string): Record<string, unknown> {
  return JSON.parse(readFileSync(join(ROOT, "content", relative), "utf8"));
}

const lenses = CurriculumLensSchema.array().parse(
  readJson("lenses/lenses.json").lenses ?? [],
);
const locales = LocalePackSchema.array().parse(
  readJson("locales/locales.json").locales ?? [],
);
const themes = ThemeWordBankSchema.array().parse(
  readJson("skills/themes.json").themes ?? [],
);

const rawLevels = (readJson("skills/levels.json").levels ?? {}) as Record<string, Record<string, unknown>>;
const levels: Record<string, unknown> = {};
for (const [id, value] of Object.entries(rawLevels)) {
  levels[id] = {
    id,
    title: value.title ?? id,
    subject: value.subject === "reading" ? "reading" : "maths",
    skillId: value.skillId ?? "",
    skillTitle: value.skillTitle ?? "",
    questions: QuestionSchema.array().parse(value.questions ?? []),
  };
}

const template = readFileSync(TEMPLATE, "utf8");
const filled = template
  .replace("__CONTENT_LENSES__", JSON.stringify(lenses, null, 2))
  .replace("__CONTENT_LOCALES__", JSON.stringify(locales, null, 2))
  .replace("__CONTENT_THEMES__", JSON.stringify(themes, null, 2))
  .replace("__CONTENT_LEVELS__", JSON.stringify(levels, null, 2));

if (filled.includes("__CONTENT_")) {
  console.error("A placeholder was left unfilled in the generated file.");
  process.exit(1);
}

writeFileSync(TEMPLATE, filled);
console.log(
  `content:build wrote ${lenses.length} lenses, ${locales.length} locales, ${themes.length} themes, ` +
    `${Object.keys(levels).length} levels`,
);
