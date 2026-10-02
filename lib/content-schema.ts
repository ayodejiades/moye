import { z } from "zod";

export const QuestionOptionSchema = z.object({
  id: z.string(),
  text: z.string(),
  isCorrect: z.boolean(),
  misconceptionTag: z.string().optional(),
});

export const QuestionSchema = z.object({
  id: z.string(),
  skillId: z.string(),
  tier: z.number().int().min(1).max(3),
  promptTemplate: z.string(),
  readAloudText: z.string(),
  hint: z.string(),
  options: z.array(QuestionOptionSchema).min(2),
  themeSlots: z.record(z.string(), z.string()).optional(),
  localeSlots: z.record(z.string(), z.string()).optional(),
  type: z.enum(["multiple-choice", "tap-to-count", "tap-drag-order", "number-input", "match-pairs"]).default("multiple-choice"),
});

export const SkillSchema = z.object({
  id: z.string(),
  subject: z.enum(["maths", "reading", "science", "sel"]),
  title: z.string(),
  description: z.string(),
  gradeBand: z.enum(["A", "B", "C"]), // A: 5-7, B: 7-9, C: 9-12
  prerequisites: z.array(z.string()),
  // Bayesian Knowledge Tracing parameters
  pInit: z.number().min(0).max(1).default(0.1),
  pLearn: z.number().min(0).max(1).default(0.2),
  pSlip: z.number().min(0).max(1).default(0.1),
  pGuess: z.number().min(0).max(1).default(0.25),
  questions: z.array(QuestionSchema),
});

export type QuestionOption = z.infer<typeof QuestionOptionSchema>;
export type Question = z.infer<typeof QuestionSchema>;
export type Skill = z.infer<typeof SkillSchema>;

export const ThemeWordBankSchema = z.object({
  id: z.string(),
  name: z.string(),
  icon: z.string(),
  items: z.record(z.string(), z.string()),
});

export type ThemeWordBank = z.infer<typeof ThemeWordBankSchema>;

export const LocalePackSchema = z.object({
  id: z.string(),
  name: z.string(),
  country: z.string(),
  currencySymbol: z.string(),
  coinName: z.string(),
  foodName: z.string(),
  unitDistance: z.string(),
  unitWeight: z.string(),
});

export type LocalePack = z.infer<typeof LocalePackSchema>;

export const CurriculumLensSchema = z.object({
  id: z.string(),
  name: z.string(),
  region: z.string(),
  sourceNote: z.string(),
  stageNames: z.array(z.string()),
  skillOrder: z.array(z.string()),
});

export type CurriculumLens = z.infer<typeof CurriculumLensSchema>;
