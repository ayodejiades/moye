// tests/health.test.mjs - a real test that must pass in DEMO_MODE without a database.
// Uses Node's built-in test runner (`node --test`), no extra dependency.
import assert from "node:assert/strict";
import { test } from "node:test";

process.env.DEMO_MODE = "1";

test("listRecords and createRecord round-trip in DEMO_MODE", async () => {
  const { listRecords, createRecord } = await import("../db/index.ts");
  const before = await listRecords();
  assert.ok(Array.isArray(before));
  assert.ok(before.length >= 1, "fixtures/records.json should seed at least one row");

  const created = await createRecord("test row");
  assert.equal(created.title, "test row");

  const after = await listRecords();
  assert.equal(after.length, before.length + 1);
});

test("sanitizeTitle rejects non-strings and control-character payloads", async () => {
  const { sanitizeTitle, MAX_TITLE } = await import("../lib/record-guard.ts");

  // A FormData value can be a File; String(file) is the literal "[object File]",
  // which would otherwise be stored as a title.
  assert.equal(sanitizeTitle(new File(["x"], "x.txt")), null);
  assert.equal(sanitizeTitle(undefined), null);
  assert.equal(sanitizeTitle(null), null);

  // Nothing usable survives these, so the write must be refused rather than stored.
  assert.equal(sanitizeTitle("   "), null);
  assert.equal(sanitizeTitle("\u0000\u200b\ufeff"), null);

  // Bidi overrides and zero-width characters are deleted, not stored verbatim: they
  // render as something other than what the text says. Deleting them must not insert
  // a word break either - "pay<RTL override>re" is the word "payre", not "pay re".
  assert.equal(sanitizeTitle("pay\u202Ere now"), "payre now");
  assert.equal(sanitizeTitle("a\u200bb"), "ab");

  assert.equal(sanitizeTitle("  Lagos pilot  "), "Lagos pilot");
  assert.equal(sanitizeTitle("two\nlines"), "two lines");
  assert.equal(sanitizeTitle("x".repeat(MAX_TITLE + 1)), null);
  assert.equal(sanitizeTitle("x".repeat(MAX_TITLE)).length, MAX_TITLE);
});

test("FixedWindowLimiter caps a burst and reopens after the window", async () => {
  const { FixedWindowLimiter } = await import("../lib/record-guard.ts");

  const limiter = new FixedWindowLimiter(3, 1000);
  const at = 1_000_000;
  assert.equal(limiter.allow("1.2.3.4", at), true);
  assert.equal(limiter.allow("1.2.3.4", at + 1), true);
  assert.equal(limiter.allow("1.2.3.4", at + 2), true);
  assert.equal(limiter.allow("1.2.3.4", at + 3), false, "the 4th call inside the window is refused");

  // Another client is unaffected: the budget is per key, not global.
  assert.equal(limiter.allow("5.6.7.8", at + 3), true);

  assert.equal(limiter.allow("1.2.3.4", at + 1000), true, "the window must reset");
});

test("deterministic safety kernel enforces excerpt binding, benign control, and resolution gating", async () => {
  const { evaluateDeterministicKernel } = await import("../lib/kernel.ts");

  const drift = evaluateDeterministicKernel({
    caseId: "c1",
    sourceCaptureT0: "Offer #1: $18.75 monthly bill credit for 24 months.",
    extractedExcerpt: "$18.75 monthly bill credit for 24 months",
    promisedCents: 1875,
    observedCents: 0,
  });
  assert.equal(drift.state, "MATERIAL_DRIFT_DETECTED");
  assert.equal(drift.excerptBound, true);

  const unbound = evaluateDeterministicKernel({
    caseId: "c2",
    sourceCaptureT0: "Standard retail purchase receipt.",
    extractedExcerpt: "hallucinated $50 credit",
    promisedCents: 5000,
    observedCents: 0,
  });
  assert.equal(unbound.state, "ABSTAIN_UNBOUND_EXCERPT");
  assert.equal(unbound.excerptBound, false);

  const unverifiedClaim = evaluateDeterministicKernel({
    caseId: "c3",
    sourceCaptureT0: "Offer #1: $18.75 monthly bill credit for 24 months.",
    extractedExcerpt: "$18.75 monthly bill credit for 24 months",
    promisedCents: 1875,
    observedCents: 0,
    providerClaimsFixed: true,
    subsequentObservationProvesFix: false,
  });
  assert.equal(unverifiedClaim.state, "WAITING_TO_VERIFY");
});
