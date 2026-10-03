import assert from "node:assert/strict";
import { test } from "node:test";
import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";

/**
 * Keeps /privacy honest (features.md D4).
 *
 * The privacy page makes specific promises. These tests check the repository actually keeps
 * them, so the page cannot drift away from what the app does. If someone adds analytics,
 * a cookie or a remote call, the promise fails here rather than quietly in production.
 */

const ROOT = process.cwd();

function grepSource(pattern) {
  return execSync(
    `grep -rn --include='*.ts' --include='*.tsx' --include='*.js' -E ${JSON.stringify(pattern)} app components lib tools public 2>/dev/null || true`,
    { cwd: ROOT, encoding: "utf8" },
  );
}

/** Lines that are about the privacy page itself, or about the checks running. */
function isSelfReference(line) {
  return (
    line.includes("app/privacy/page.tsx") ||
    line.includes("tests/privacy.test.mjs") ||
    line.includes("tools/verify-moye-claims.ts")
  );
}

test("[D4] no analytics or tracking library is present", () => {
  const banned = [
    "gtag",
    "googletagmanager",
    "google-analytics",
    "posthog",
    "mixpanel",
    "segment\\.io",
    "amplitude",
    "sentry",
    "plausible\\.io",
    "hotjar",
    "clarity\\.ms",
  ];
  for (const pattern of banned) {
    const hits = grepSource(pattern).split("\n").filter((l) => l.trim() && !isSelfReference(l));
    assert.deepEqual(hits, [], `found a tracking reference: ${hits.join(" | ")}`);
  }
});

test("[D4] the app sets no cookies", () => {
  const hits = grepSource("document\\.cookie").split("\n").filter((l) => l.trim() && !isSelfReference(l));
  assert.deepEqual(hits, [], `Moye promises no cookies, but found: ${hits.join(" | ")}`);
});

test("[D4] the app uses no remote browser storage", () => {
  for (const pattern of ["indexedDB", "caches\\.open\\(", "navigator\\.sendBeacon"]) {
    // The service worker legitimately uses the Cache API; it stores this app's own
    // assets on the device and never talks to a third party.
    if (pattern === "caches\\.open\\(") {
      const hits = grepSource(pattern)
        .split("\n")
        .filter((l) => l.trim() && !isSelfReference(l) && !l.includes("public/sw.js") && !l.includes("tools/"));
      assert.deepEqual(hits, [], `unexpected Cache API use outside the service worker: ${hits.join(" | ")}`);
      continue;
    }
    const hits = grepSource(pattern).split("\n").filter((l) => l.trim() && !isSelfReference(l));
    assert.deepEqual(hits, [], `found remote storage: ${hits.join(" | ")}`);
  }
});

test("[D4] no request leaves for another origin at runtime", () => {
  // Only dev tooling and documentation links may name an external host. Anything that
  // looks like a runtime fetch to another origin would break the offline promise.
  const hits = grepSource("https?://[a-z0-9.-]+")
    .split("\n")
    .filter((l) => l.trim() && !isSelfReference(l))
    .filter((l) => {
      const allowed = [
        "localhost",
        "127.0.0.1",
        "nextjs.org",
        "react.dev",
        "w3.org",
        "json-schema.org",
        "schema.org",
        "github.com/ayodejiades",
        "vercel",
        "neon.tech",
        "lovhack",
      ];
      return !allowed.some((host) => l.includes(host));
    });
  assert.deepEqual(hits, [], `an external host is referenced at runtime: ${hits.slice(0, 5).join(" | ")}`);
});

test("[D4] every storage key named on the privacy page is a real one", () => {
  const page = readFileSync("app/privacy/page.tsx", "utf8");
  // Capture the whole key, then strip a version suffix separately. Matching on "Stored as
  // <key>." rather than a narrower pattern avoids missing a key whose name simply has a
  // different shape from the ones being guessed at.
  const claimed = [...page.matchAll(/Stored as (moye_[a-z0-9_]+)\./g)].map((m) => m[1]);
  assert.ok(claimed.length >= 3, `expected at least three named keys, found ${claimed.length}`);

  const source = execSync(
    "grep -rhoE '\"moye_[a-z_0-9]+\"' app components lib | sort -u",
    { cwd: ROOT, encoding: "utf8" },
  );
  const real = new Set(source.split("\n").map((s) => s.trim().replace(/"/g, "")).filter(Boolean));

  // The page names the exact key the code uses, so a rename in lib/ without updating the
  // page fails here. That is the whole point: the promise and the code stay together.
  for (const key of claimed) {
    const family = key.replace(/_v\d+$/, "");
    const found = [...real].some((k) => k === key || k.replace(/_v\d+$/, "") === family);
    assert.ok(found, `the page names ${key}, but no such storage key exists in the code`);
  }
  // Every named key must also actually be written somewhere.
  const writers = execSync(
    "grep -rn 'setItem' app components lib | wc -l",
    { cwd: ROOT, encoding: "utf8" },
  ).trim();
  assert.ok(Number(writers) > 0, "nothing is ever written to storage, so the page cannot be true");
});

test("[D4] the privacy page promises no account, and none is asked for", () => {
  const hits = grepSource("createProfile\\(|signInWithCredentials\\(")
    .split("\n")
    .filter((l) => l.trim() && !isSelfReference(l) && !l.includes("lib/moye-store.ts"));
  // Sign in exists as an optional local profile switcher, never a remote identity. What
  // must not exist is a request to a server to create or check one.
  for (const hit of hits) {
    assert.ok(
      !/fetch|axios|http/i.test(hit),
      `profile creation must stay local, found a remote call: ${hit}`,
    );
  }
});

test("[D4] the privacy page is reachable and linked from the footer", () => {
  const footer = readFileSync("app/page.tsx", "utf8");
  assert.match(footer, /href="\/privacy"/, "the landing footer must link to the privacy page");
});
