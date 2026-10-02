// app/api/health/route.ts - the deployment's own report on whether it actually works.
//
// This endpoint returns health status and verifies database connectivity when deep=1.
// `ok` is false whenever the app cannot serve requests.
//
//   GET /api/health          shallow: process liveness, no I/O, for uptime pings
//   GET /api/health?deep=1   deep: opens the database and confirms the tables exist
//
// `ok` is true in demo mode without any network call - that path is designed to work
// offline, so the honest answer there is "serving fixtures", which `demoMode` reports.
import { NextResponse } from "next/server";
import { isDemoMode } from "@/lib/demo-mode";
import { probeDatabase } from "@/db";

// Never cache a health result: a stale "ok" from a warm CDN is the exact bug this fixes.
export const dynamic = "force-dynamic";
export const revalidate = 0;

// A cooldown on the deep probe only. Each ?deep=1 call opens its own database
// connection, so an unauthenticated caller looping the endpoint multiplies
// connections against the pool. The result is reused for a few seconds; checkedAt
// still reports when the probe actually ran, so a reused result is never passed off
// as a fresh one. The shallow path is pure process liveness and does no I/O, so it
// is always answered live.
const PROBE_COOLDOWN_MS = 5_000;

let lastProbe: { at: number; result: Awaited<ReturnType<typeof probeDatabase>> } | null = null;

export async function GET(request: Request) {
  const deep = new URL(request.url).searchParams.get("deep") === "1";
  const base = {
    ok: true,
    sha: process.env.VERCEL_GIT_COMMIT_SHA ?? process.env.GIT_COMMIT ?? "dev",
    demoMode: isDemoMode(),
    checkedAt: new Date().toISOString(),
  };

  if (!deep) {
    return NextResponse.json(base, { headers: { "cache-control": "no-store" } });
  }

  const now = Date.now();
  let db: Awaited<ReturnType<typeof probeDatabase>>;
  let probedAt = now;
  if (lastProbe && now - lastProbe.at < PROBE_COOLDOWN_MS) {
    db = lastProbe.result;
    probedAt = lastProbe.at;
  } else {
    // A health endpoint must answer, never throw: a corrupt fixture file or a
    // driver-level failure is a 503 finding, not a 500 with no body. Failures are
    // deliberately not cached, so the next caller re-probes instead of replaying
    // a stale error through the whole cooldown window.
    try {
      db = await probeDatabase();
      lastProbe = { at: now, result: db };
    } catch (err) {
      db = {
        reachable: false,
        tablesPresent: false,
        detail: (err as Error).message,
        latencyMs: Date.now() - now,
      };
    }
  }
  // In demo mode the fixtures are the product, so a healthy fixture store is `ok`.
  // Outside demo mode, an unreachable database or a missing migration is not.
  const ok = db.reachable && db.tablesPresent;

  return NextResponse.json(
    { ...base, ok, checkedAt: new Date(probedAt).toISOString(), database: db },
    { status: ok ? 200 : 503, headers: { "cache-control": "no-store" } },
  );
}
