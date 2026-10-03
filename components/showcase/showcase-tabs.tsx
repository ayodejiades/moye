"use client";

import {
  HoneyDropIcon,
  TargetIcon,
  StarIcon,
  PrinterIcon,
} from "@/components/ui/svg-icons";

export const TABS = [
  { id: "focus", label: "Focus lesson", Icon: TargetIcon },
  { id: "mastery", label: "Difficulty that adapts", Icon: StarIcon },
  { id: "hive", label: "Moyin's hive", Icon: HoneyDropIcon },
  { id: "grownups", label: "Teacher report", Icon: PrinterIcon },
] as const;

export type ShowcaseTabId = (typeof TABS)[number]["id"];
