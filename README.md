<div align="center">

# moye

**Moye: short, gentle lessons that adjust to each child, with no timers and no shame. Moyin the honey badger sits beside them the whole way. Built for ADHD, dyslexia, and neurotypical kids.**

[![License: MIT](https://img.shields.io/badge/license-MIT-2f6f4f?style=flat-square)](LICENSE)
[![Stack](https://img.shields.io/badge/stack-Next.js%20%C2%B7%20TypeScript%20%C2%B7%20Tailwind-111111?style=flat-square)](package.json)
[![Tests](https://img.shields.io/badge/tests-49%20passing-2f6f4f?style=flat-square)](#run-it)

[Demo path](docs/DEMO_PATH.md) &nbsp;|&nbsp; [What is real](WHAT_IS_REAL.md) &nbsp;|&nbsp; [How it works](#how-it-works)

</div>

![demo](docs/demo.gif)

---

## The problem

Many learning apps rush children with a clock, a buzzer, and a scoreboard. Moye shows one gentle
question at a time, adjusts the difficulty from plain arithmetic rather than a chatbot, and never
shames a wrong answer.

## What it does

- **One question at a time.** No countdown, no buzzer, no red flashing. Read aloud on every question.
- **Difficulty that adapts.** After each answer the app updates what the child has understood and
  picks the next question from that. It is arithmetic in `lib/mastery.ts`, not a model call.
- **Placement that finds the real starting point.** Six skippable questions before the first lesson,
  scored by the same estimator the lessons use, so a child who is further on starts further on.
- **A worked example, then it fades.** One solved example per skill, read aloud, then the steps are
  taken away as the child gets it.
- **Maths and reading.** 90 questions across 14 skills and 8 levels, including a full phonics and
  reading path: letter sounds, blending, sight words, rhyme, syllables and reading a sentence.
- **Review that comes back gently.** A skill that slipped, or has been quiet for a week, is offered
  once more. No streak pressure and no red.
- **Focus and feelings.** Breathe with Moyin, name a feeling, or split the work into small chunks.
  None of it is graded.
- **Honey rewards with a daily cap.** Children earn honey only for finished focus work and spend it
  on Moyin's hive. A daily cap tells them when they are done for today.
- **Calm Motion, dyslexia spacing, tinted backgrounds, voice speed.** One Comfort settings button on
  every screen, and the settings follow the child from page to page.
- **Words on screen in English, Nigerian Pidgin or Yoruba**, chosen separately from the voice.
- **Works offline.** Save Moye to the home screen. After the first visit the lessons open with the
  network switched off, and there is not a single request to a third party.
- **Plain reports for grownups.** A class list, who needs a hand today, a copyable weekly summary and
  a printable page. All of it measured from real attempt times, never estimated.

## Try it

```bash
pnpm install
DEMO_MODE=1 pnpm dev
```

Open http://localhost:3000. Demo mode runs the app on committed fixtures with no database, no
account, and no network.

## How it works

Every number and behaviour claim is re-derived by `pnpm claim:verify`, which runs the real
functions in `lib/` over committed fixtures and writes
[`evidence/claim-ledger.md`](evidence/claim-ledger.md). Move a threshold in the code and it fails,
so nothing on this page can quietly stop being true.

The demo path, step by step:

```mermaid
flowchart TD
    S1["Pick a name and a school curriculum"] --> S2
    S2["Choose a story theme"] --> S3
    S3["One gentle question, read aloud"] --> S4
    S4["A wrong answer gets a hint, never shame"] --> S5
    S5["A right answer earns honey"] --> S6
    S6["Difficulty adjusts"] --> S7
    S7["Done for today, Moyin rests"] --> S8
    S8["Spend honey in the hive"] --> S9
    S9["Plain report for grownups"]
```

Architecture:

```mermaid
flowchart TD
    U["Child in the browser"]
    U --> R["Next.js routes: /, /start, /learn, /lesson, /done, /hive, /grownups, /proof"]
    R --> L["Plain functions decide: lib/mastery.ts, lib/honey.ts, lib/streak.ts"]
    L --> M{"DEMO_MODE=1?"}
    M -->|yes, no network| F["fixtures/: committed demo data"]
    M -->|no| DB["Postgres via Drizzle (db/)"]
    R --> SW["public/sw.js: cache first, works offline"]
```

The rules that decide pass or fail, honey, streaks and rest tokens are plain functions in
`lib/mastery.ts`, `lib/honey.ts` and `lib/streak.ts`. The same input always gives the same result,
and the unit tests call them directly. `/proof` runs that same logic on committed cases and shows
the working, in the product's own words rather than as a wall of maths.

> Note: `lib/kernel.ts` and `evidence/` come from the shared project scaffold and describe a
> reconciliation kernel for a different domain. They are not Moye's decision logic, and no Moye
> number comes from them.

## Run it

| Command | What it does |
| --- | --- |
| `pnpm dev` | start the app locally |
| `pnpm build` | production build |
| `pnpm test` | unit tests for the decision logic (10) |
| `pnpm test:landing` | landing page standards: motion, contrast, honesty, semantics (39) |
| `pnpm test:features` | the learning logic: placement, review, scaffolding, energy, focus, classroom, content, privacy promises (110) |
| `pnpm content:sync` | regenerate `content/` from the typed banks, then `pnpm content:build` |
| `pnpm test:demo-path` | walks `docs/demo-path.json` online **and** with the network off |
| `pnpm test:keyboard` | completes a lesson with no mouse at all |
| `pnpm test:landing:e2e` | runs the browser probe at 1280, 768 and 375, with and without reduced motion |
| `pnpm test:a11y` | axe-core over 10 pages at 1280 and 375; fails on any serious or critical WCAG A/AA finding |
| `pnpm lint` | eslint, zero warnings |
| `pnpm claim:verify` | re-derives the scaffold evidence fixtures |

The end to end scripts need a running server and Playwright:

```bash
pnpm build && DEMO_MODE=1 pnpm start -p 3111
BASE_URL=http://localhost:3111 pnpm test:demo-path
BASE_URL=http://localhost:3111 pnpm test:keyboard
BASE_URL=http://localhost:3111 pnpm test:a11y
```

## Where the content lives

`content/` is the source of truth that ships: the curriculum lenses, the locales, the story themes and
every level with its questions, all as JSON validated against the zod schemas in
`lib/content-schema.ts`. `pnpm content:build` generates `lib/content.generated.ts` from it, and
`pnpm test:features` proves the two never drift apart and that every question renders with no
unfilled placeholder in every theme and locale.

That is also where the counts on the landing page come from, so a number on screen always matches
what is actually in the repository.

## Accessibility

Built in from the first screen, not bolted on afterwards.

- Lexend throughout, with a real OpenDyslexic option. Both fonts are served by this app, so
  dyslexia spacing also works offline.
- Comfort settings on every screen: dyslexia spacing, extra large text, tinted backgrounds, a
  reading line guide, word highlight while reading aloud, Calm Motion, sound, and voice speed.
- Calm Motion and the operating system's reduced motion setting both stop every animation, pause
  the ambient loops, and force all revealed content visible.
- Every colour pair on the landing page is checked against WCAG AA by `pnpm test:landing`, and all 10 pages are checked against WCAG A and AA by `pnpm test:a11y`.
- Any lesson can be left at any time with "Stop for now" or `Escape`, keeping every answer already given. Leaving is never punished.
- A browser probe runs at 1280, 768 and 375 px, with and without reduced motion, and fails on a
  stuck reveal, a running animation, a console error or a tap target under 44 px.
- A whole lesson can be finished with the keyboard: `1` to `4` choose an answer, `Enter` moves on,
  `R` reads the question aloud, `P` pauses. The list is in Comfort settings.

## What is real

What is built, partial, or deliberately not wired is written down in
[`WHAT_IS_REAL.md`](WHAT_IS_REAL.md), including the boundaries: no timers, no runtime model calls,
no monetisation, no guilt framing, and no cloud account.

## Credits

Assets and open-source attributions, including the OpenDyslexic font, are in
[`CREDITS.md`](CREDITS.md).

---

<div align="center">
  <sub>moye. Built by Ayodeji Adesegun (<a href="https://github.com/ayodejiades">@ayodejiades</a>) under the MIT License.</sub>
</div>
