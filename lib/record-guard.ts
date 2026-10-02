// lib/record-guard.ts - pure guards for the one unauthenticated write path
// (app/actions.ts -> db/index.ts). Deliberately free of next/* imports so
// tests/health.test.mjs can exercise every rule with `node --test`.

/** Longest accepted title, in UTF-16 code units. */
export const MAX_TITLE = 200;

/** Upper bound on rows a single listRecords() call may return. */
export const RECORD_LIST_LIMIT = 100;

// C0/C1 control characters (NUL, newline, DEL, ...) are real whitespace: a title is one
// line of plain text, so a line break becomes a space rather than silently changing length.
const CONTROL_CHARS = /[\u0000-\u001F\u007F-\u009F]/g;
// Zero-width characters and bidi overrides are invisible formatting, not whitespace.
// Removing a zero-width joiner must not insert a break into the middle of a word, so
// these are deleted outright: a zero-width character in a title is either a typo or
// an attempt to make the stored text render as something it is not.
const INVISIBLE_CHARS = /[\u200B-\u200F\u202A-\u202E\u2066-\u2069\uFEFF]/g;
const WHITESPACE_RUN = /\s+/g;

/**
 * sanitizeTitle - the single validation and cleanup for a submitted title.
 *
 * Returns the cleaned title, or null when nothing usable is left. The type is
 * checked rather than coerced: FormData values may be File parts, and
 * String(file) is the literal "[object File]".
 */
export function sanitizeTitle(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const cleaned = raw
    .replace(CONTROL_CHARS, " ")
    .replace(INVISIBLE_CHARS, "")
    .replace(WHITESPACE_RUN, " ")
    .trim();
  if (!cleaned || cleaned.length > MAX_TITLE) return null;
  return cleaned;
}

interface WindowEntry {
  count: number;
  resetAt: number;
}

/** Stop tracking keys once this many are live, so rotating keys cannot grow memory. */
const MAX_TRACKED_KEYS = 10_000;

/**
 * FixedWindowLimiter - per-key request limiter for the unauthenticated write.
 *
 * In-memory and per process: enough to stop a loop against one instance, and
 * honest about it - a distributed store (Redis/Upstash) is the production
 * step-up, as docs/HONESTY.md records. When the key table hits MAX_TRACKED_KEYS
 * it is cleared wholesale: dropping limits briefly (fail open) is preferred over
 * unbounded memory growth (fail availability).
 */
export class FixedWindowLimiter {
  private readonly hits = new Map<string, WindowEntry>();

  constructor(
    private readonly max: number,
    private readonly windowMs: number,
  ) {}

  /** Whether `key` may proceed at `now`; consumes one unit of budget when true. */
  allow(key: string, now: number = Date.now()): boolean {
    if (this.hits.size >= MAX_TRACKED_KEYS) this.prune(now);
    if (this.hits.size >= MAX_TRACKED_KEYS) this.hits.clear();

    const entry = this.hits.get(key);
    if (!entry || now >= entry.resetAt) {
      this.hits.set(key, { count: 1, resetAt: now + this.windowMs });
      return true;
    }
    if (entry.count >= this.max) return false;
    entry.count += 1;
    return true;
  }

  private prune(now: number): void {
    for (const [key, entry] of this.hits) {
      if (now >= entry.resetAt) this.hits.delete(key);
    }
  }
}
