# WHAT_IS_REAL.md: Production Maturity & Boundaries

## Built and Verified

| Component | Status | Verification Level | Evidence and Implementation |
|---|---|---|---|
| **Focus Mode and Lesson Player** | Built | **LIVE_IN_BROWSER** | One question at a time, visual progress bar with no timers, Web Speech read aloud, pause state. Lives in `app/lesson/page.tsx` and `lib/lesson-bank.ts`. |
| **Profile Management and Sign In / Sign Up** | Built | **LIVE_IN_BROWSER** | Dual mode account setup, saved profile switcher (Anjola, Ayodeji), credentials login with role toggle, local store sync. Lives in `app/start/page.tsx` and `lib/moye-store.ts`. |
| **Adaptive Difficulty and BKT Engine** | Built | **PROVEN_LOCAL_EXECUTION** | Bayesian Knowledge Tracing updates $p_{known}$ per attempt, moving struggling learners to tier 1 and strong learners to tier 3. Verified by unit tests in `lib/mastery.ts`. |
| **Honey Economy, Shop, and Daily Cap** | Built | **PROVEN_LOCAL_EXECUTION** | Seeded deterministic drop rewards, cosmetic item unlocks, 50 drop daily limit with Done for Today screen. Lives in `lib/honey.ts`, `app/hive/page.tsx`, and `app/done/page.tsx`. |
| **Spark Streaks and Rest Tokens** | Built | **PROVEN_LOCAL_EXECUTION** | Timezone safe consecutive day streak counter, automatic rest token protection, guilt free rest pauses. Verified in `lib/streak.ts`. |
| **Curriculum Lenses and Theme Resolver** | Built | **LIVE_IN_BROWSER** | Dynamic question templating adapting to regional curricula (`ng-ube`, `common-core`, `england-nc`) and story themes (`dinosaurs`, `football`, `space`). Lives in `lib/theme-resolver.ts`. |
| **Parent and Teacher Weekly Portal** | Built | **LIVE_IN_BROWSER** | Plain language narrative report, focus duration metrics, zero jargon teacher overview, class join code. Lives in `app/grownups/page.tsx`. |
| **Accessibility and Dyslexia Panel** | Built | **LIVE_IN_BROWSER** | OpenDyslexic font toggle, letter spacing options, high contrast palette, calm motion toggle, voice speed controls. Lives in `components/accessibility-sheet.tsx`. |
| **Installable App and Offline Cache** | Built | **LIVE_IN_BROWSER** | Web app manifest at `app/manifest.ts` with 192, 512 and maskable icons, plus a cache first service worker at `public/sw.js` that precaches the seven screens on install. Verified by loading `/`, `/learn`, `/hive` and a full lesson with the browser network switched off. |
| **Self Hosted Fonts** | Built | **LIVE_IN_BROWSER** | Lexend and OpenDyslexic are served from this app, so there are zero requests to any third party and dyslexia spacing works offline. The OpenDyslexic files live in `public/fonts/`. |
| **Offline DEMO_MODE and Local Fixtures** | Built | **LIVE_FALLBACK** | Operates with Wi Fi disconnected using local in memory fixtures and deterministic logic. Verified by `DEMO_MODE=1` health tests. |
| **Deterministic Safety Kernel** | Built | **PROVEN_LOCAL_EXECUTION** | Pure function verification of rules and benchmark cases in `lib/kernel.ts` and inspectable on `/proof`. |
| **Multilingual Voice Audio** | Built | **LIVE_IN_BROWSER** | Five supported language voices (English, Nigerian Pidgin, Yoruba, Hausa, Igbo) with Web Speech BCP47 matching, pitch tuning, localized lesson questions, and encouraging companion speech. Lives in `lib/multilingual-voice.ts` and `app/lesson/page.tsx`. |

## Partial or Roadmap Features

| Feature | Current State | Production Plan |
|---|---|---|
| **Supabase Remote Cloud Sync** | **PARTIAL** | Runs completely offline via local storage; syncs to Supabase Postgres pooler when `DATABASE_URL` is configured. |

## What The App Does Not Do (Boundaries)

- **No Timers or Countdown Clocks:** Learning is unhurried. There are no per question timers, countdown buzzers, or stress signals.
- **No Runtime LLM Dependency:** Core lessons run from deterministic, pre verified lesson banks without needing live external API keys.
- **No Monetization or Paid Upgrades:** Honey drops are earned purely through practice; zero microtransactions, subscriptions, or paywalls exist.
- **No Shame or Guilt Framing:** Incorrect answers offer hints, and broken streaks simply rest without punitive messaging.
