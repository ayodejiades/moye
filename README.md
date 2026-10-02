<div align="center">

# moye

**Moye: an adaptive learning app for neurodivergent (ADHD, dyslexia) and neurotypical kids. Mascot Moyin the honey badger. Free stack: Supabase, PWA, browser speech.**

[![License: MIT](https://img.shields.io/badge/license-MIT-2f6f4f?style=flat-square)](LICENSE)
[![Stack](https://img.shields.io/badge/stack-Next.js%20%C2%B7%20TypeScript%20%C2%B7%20Tailwind-111111?style=flat-square)](package.json)
[![Demo mode](https://img.shields.io/badge/demo%20mode-offline-2f6f4f?style=flat-square)](#try-it)

[Demo script](docs/DEMO_PATH.md) &nbsp;|&nbsp; [Evidence](docs/EVIDENCE.md) &nbsp;|&nbsp; [How it works](#how-it-works)

</div>

![demo](docs/demo.gif)

---

## Why moye exists

Moye: an adaptive learning app for neurodivergent (ADHD, dyslexia) and neurotypical kids. Mascot Moyin the honey badger. Free stack: Supabase, PWA, browser speech.

## Try it

```bash
pnpm install
DEMO_MODE=1 pnpm dev
```

Open http://localhost:3000. Demo mode runs the app on committed fixtures, with no database, account or network. The demo script is in [`docs/DEMO_PATH.md`](docs/DEMO_PATH.md), and how each number was checked is in [`CLAIM_LEDGER.md`](CLAIM_LEDGER.md).

## How it works

The demo path, step by step:

```mermaid
flowchart LR
    S0["1. Welcome to the overview"] --> S1
    S1["2. Launch the live demo workspace"] --> S2
    S2["3. Create a new record"] --> S3
    S3["4. Submit and verify real-time state"]
```

Architecture:

```mermaid
flowchart TD
    U["User in the browser"]
    U --> R["Next.js pages: /, /dashboard, /demo, /lab, /landing, /login ..."]
    R --> L["lib/kernel.ts: the product's rules, plain functions"]
    L --> M{"DEMO_MODE=1?"}
    M -->|yes, offline| F["fixtures/: committed demo data"]
    M -->|no| DB["Postgres via Drizzle (db/)"]
    L -.-> V["pnpm claim:verify: re-derives every number in CLAIM_LEDGER.md"]
```

Next.js and TypeScript, with Drizzle for data. The product's rules live in `lib/kernel.ts` as plain functions, so the same input always gives the same result and the tests call them directly. Recorded runs live in `evidence/campaign-report.json`.

## Run it

| Command | What it does |
| --- | --- |
| `pnpm dev` | start the app locally |
| `pnpm build` | production build |
| `pnpm test` | run the automated tests |
| `pnpm claim:verify` | re-derive every claim in CLAIM_LEDGER.md from the committed data |

## What is real

What is built, partial or not wired yet, measured rather than claimed: [`WHAT_IS_REAL.md`](WHAT_IS_REAL.md).

## Credits

Assets and open-source attributions are listed in [`CREDITS.md`](CREDITS.md).

---

<div align="center">
  <sub>moye. Built by Ayodeji Adesegun (<a href="https://github.com/ayodejiades">@ayodejiades</a>) under the MIT License.</sub>
</div>
