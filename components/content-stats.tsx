"use client";

import { curriculumStats, CONTENT_LEVELS } from "@/lib/content.generated";

const STATS = curriculumStats();

const PER_SUBJECT = (() => {
  const counts: Record<string, number> = {};
  for (const level of Object.values(CONTENT_LEVELS)) {
    counts[level.subject] = (counts[level.subject] ?? 0) + level.questions.length;
  }
  return counts;
})();

/**
 * What is actually in the app, counted from the committed content (features.md B3).
 *
 * Every number here comes from `content/`, so the landing page cannot quote a figure the
 * repository does not hold. Nothing is estimated and nothing is rounded up for effect.
 */
export function ContentStats() {
  const items = [
    { big: String(STATS.questions), label: "Questions, written and read aloud" },
    { big: String(STATS.skills), label: "Skills across maths and reading" },
    { big: String(PER_SUBJECT.reading ?? 0), label: "Reading questions, with phonics" },
    { big: String(STATS.levels), label: "Levels on the learning path" },
  ];

  return (
    <section
      aria-labelledby="content-stats-heading"
      data-demo="content-stats"
      className="bg-white border-y border-[var(--border)] px-6 py-12"
    >
      <div className="max-w-4xl mx-auto">
        <h2 id="content-stats-heading" className="text-center text-2xl font-bold text-[var(--plum-900)]">
          What is in the app today
        </h2>
        <p className="text-center text-sm text-[var(--fg-muted)] mt-2 max-w-2xl mx-auto text-pretty">
          Counted from the questions in this repository, so these figures match what a child
          can actually practise.
        </p>
        <dl className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-8 text-center">
          {items.map((item) => (
            <div key={item.label}>
              <dt className="sr-only">{item.label}</dt>
              <dd>
                <span className="block text-4xl font-bold text-[var(--plum-700)]">{item.big}</span>
                <span className="block text-sm text-[var(--fg-muted)] mt-1 text-pretty">{item.label}</span>
              </dd>
            </div>
          ))}
        </dl>
        <p className="text-center text-xs text-[var(--fg-muted)] mt-6">
          Aligned to {STATS.lenses} school curricula and {STATS.locales} countries money. Never
          described as official.
        </p>
      </div>
    </section>
  );
}
