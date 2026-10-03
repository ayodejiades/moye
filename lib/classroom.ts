/**
 * Teacher classroom mode (features.md B6, SPEC.md 5.6).
 *
 * Three screens maximum, big buttons, no jargon: the class list, one child's report, and
 * a printable summary. Everything is local to this device: there is no server, no account
 * and no real time messaging. A join code is a label for a classroom, not a login.
 *
 * All pure functions so the "who needs help today" list is the same every run.
 */

import { longestSessionMinutes } from "./energy";

export interface ClassChild {
  id: string;
  name: string;
  /** Skill ids the child has practised, with how well. */
  mastery: Record<string, { pKnown: number; tier: number }>;
  /** Attempt timestamps in milliseconds. */
  attempts: number[];
  /** Consecutive days. */
  streakDays: number;
  honeyBalance: number;
}

/** Below this, a child gets a gentle note for the teacher. */
export const NEEDS_HELP_THRESHOLD = 0.5;

/** Never show more than this many children on the "needs help today" list. */
export const MAX_HELP_LIST = 5;

export type HelpReason = "practising" | "new";

export interface HelpEntry {
  childId: string;
  childName: string;
  /** The skill to look at together. */
  skillId: string;
  pKnown: number;
  reason: HelpReason;
}

/** A stable join code for a classroom name. Not a secret, and not a login. */
export function joinCodeFor(className: string): string {
  const cleaned = className.trim().toUpperCase().replace(/[^A-Z0-9]/g, "");
  let hash = 0x811c9dc5;
  const material = cleaned || "MOYE";
  for (let i = 0; i < material.length; i++) {
    hash ^= material.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return `MOYE-${(hash % 900) + 100}`;
}

/**
 * Who could use a little help today, and on what.
 *
 * Only skills the child has actually practised are considered. A skill never attempted is
 * not "weak", it is simply not started, so it never appears on this list. Ordered by how
 * far below the threshold the child is, then by name, so the list is identical on every
 * device and in every run.
 */
export function whoNeedsHelp(children: ClassChild[], limit = MAX_HELP_LIST): HelpEntry[] {
  const entries: HelpEntry[] = [];

  for (const child of children) {
    const practised = Object.entries(child.mastery ?? {});
    for (const [skillId, record] of practised) {
      const pKnown = Number.isFinite(record?.pKnown) ? record.pKnown : 0;
      if (pKnown >= NEEDS_HELP_THRESHOLD) continue;
      entries.push({
        childId: child.id,
        childName: child.name,
        skillId,
        pKnown,
        reason: "practising",
      });
    }
  }

  entries.sort((a, b) => a.pKnown - b.pKnown || a.childName.localeCompare(b.childName) || a.skillId.localeCompare(b.skillId));
  return entries.slice(0, Math.max(0, limit));
}

/** One line per child for the printable summary. Plain words, no scores. */
export function classroomSummaryLine(child: ClassChild): string {
  const focus = longestSessionMinutes(child.attempts ?? []);
  const parts: string[] = [];
  if (focus !== null) {
    parts.push(`held focus for about ${focus} minute${focus === 1 ? "" : "s"} in one sitting`);
  }
  if (child.streakDays > 0) {
    parts.push(`came back ${child.streakDays} day${child.streakDays === 1 ? "" : "s"} in a row`);
  }
  if (parts.length === 0) return `${child.name}: just getting started, which is completely fine.`;
  const who = child.name.trim() || "This child";
  return `${who}: ${parts.join(", and ")}.`;
}

/**
 * The whole printable page, as plain text a browser can print.
 * Never uses a banned clinical or score word.
 */
export function buildClassroomReport(className: string, children: ClassChild[]): string {
  const name = className.trim() || "My class";
  const help = whoNeedsHelp(children);
  const lines: string[] = [];

  lines.push(name);
  lines.push("How everyone is getting on");
  lines.push("");
  lines.push(...children.map(classroomSummaryLine));

  if (help.length > 0) {
    lines.push("");
    lines.push("Worth a look together today");
    for (const entry of help) {
      lines.push(`${entry.childName}: practise ${entry.skillId.replace(/-/g, " ")} together, slowly.`);
    }
  }

  lines.push("");
  lines.push("There were no timers and no countdowns. A wrong answer only ever got a hint.");

  return lines.join("\n");
}

/**
 * Words the printable report must never contain. A teacher's note about a child should
 * read as an invitation, not a diagnosis.
 */
export const BANNED_REPORT_WORDS = [
  "fail",
  "weak",
  "poor",
  "behind",
  "deficient",
  "disorder",
  "diagnos",
  "percentile",
  "score",
  "grade",
  "iq",
  "below average",
];

/** A count of children, for the header. */
export function classSize(children: ClassChild[]): number {
  return Array.isArray(children) ? children.length : 0;
}
