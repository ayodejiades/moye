// tests/demo-path.e2e.mjs
// Runs the real demo path from docs/demo-path.json and fails on console errors.
//
//   pnpm build && DEMO_MODE=1 pnpm start -p 3111
//   pnpm test:demo-path
//
// Needs Playwright: pnpm add -D playwright && npx playwright install chromium
//
// What it protects: the video recording. Every step in docs/demo-path.json is a thing
// a judge will watch happen, so a broken selector or a thrown error fails here first.
//
// Phase two repeats the whole path with the browser network switched off, which is the
// promise the product makes. That only passes once the service worker has cached the
// screens, so the first pass warms the cache on purpose.
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const BASE = process.env.BASE_URL ?? "http://localhost:3111";

let chromium;
try {
  ({ chromium } = await import("playwright"));
} catch {
  console.error("Playwright is not installed. Run: pnpm add -D playwright && npx playwright install chromium");
  process.exit(2);
}

const { steps } = JSON.parse(readFileSync(resolve(ROOT, "docs/demo-path.json"), "utf8"));
let failures = 0;

async function run(context, phase) {
  const page = await context.newPage();
  const errors = [];
  const failedUrls = [];
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  page.on("pageerror", (e) => errors.push(String(e)));
  page.on("response", (r) => {
    if (r.status() >= 400) failedUrls.push(`${r.status()} ${new URL(r.url()).pathname}`);
  });

  for (const [i, step] of steps.entries()) {
    const where = `${phase} step ${i + 1}/${steps.length}`;
    try {
      if (step.goto) await page.goto(BASE + step.goto, { waitUntil: "networkidle", timeout: 20000 });
      if (step.click) await page.click(step.click, { timeout: 10000 });
      for (const [selector, value] of Object.entries(step.fill ?? {})) {
        await page.fill(selector, value, { timeout: 10000 });
      }
      if (step.waitFor) await page.waitForSelector(step.waitFor, { timeout: 15000 });
      console.log(`  ok    ${where}: ${step.say}`);
    } catch (err) {
      failures++;
      console.log(`  FAIL  ${where}: ${step.say}\n        ${String(err).split("\n")[0]}`);
    }
  }

  // A console error anywhere in the demo is a failure: it shows up on the recording.
  const real = errors.filter((e) => !/favicon/i.test(e));
  if (real.length) {
    failures++;
    const seen = [...new Set(failedUrls)];
    console.log(`  FAIL  ${phase} console errors: ${real.join(" | ").slice(0, 300)}`);
    if (seen.length) console.log(`        from: ${seen.slice(0, 12).join(", ")}`);
  }
  await page.close();
}

const browser = await chromium.launch();

// Pass one, online: proves the path itself is intact and warms the service worker cache.
console.log("demo path, online:");
{
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  await run(context, "online");
  await context.close();
}

// Pass two, network off: the promise in SPEC section 5, proven rather than claimed.
//
// The warm up walks the whole demo path online in this same context first, not just the
// bare page URLs. That is what a real first visit does, and it is what fills the cache
// with the client side navigation payloads Next.js requests. Warming only the URLs leaves
// those payloads uncached, and a later offline click falls back to a hard navigation.
console.log("\ndemo path, network off:");
{
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const warm = await context.newPage();
  for (const path of ["/", "/start", "/learn", "/lesson", "/done", "/hive", "/grownups", "/proof"]) {
    await warm.goto(BASE + path, { waitUntil: "networkidle" }).catch(() => {});
  }
  await warm.close();

  const warmer = await context.newPage();
  for (const step of steps) {
    try {
      if (step.goto) await warmer.goto(BASE + step.goto, { waitUntil: "networkidle", timeout: 20000 });
      if (step.click) await warmer.click(step.click, { timeout: 10000 });
      for (const [selector, value] of Object.entries(step.fill ?? {})) {
        await warmer.fill(selector, value, { timeout: 10000 });
      }
      if (step.waitFor) await warmer.waitForSelector(step.waitFor, { timeout: 15000 });
    } catch {
      // The warm up only needs to exercise the paths; run() reports real failures.
    }
  }
  await warmer.close();

  // The warm up spent the honey and bought the hat. Put the profile back to a first
  // run so the offline pass starts from the same state a judge would see. Only
  // localStorage is cleared: the Cache Storage the service worker filled stays put.
  const reset = await context.newPage();
  await reset.goto(BASE + "/", { waitUntil: "domcontentloaded" }).catch(() => {});
  await reset.evaluate(() => {
    try {
      localStorage.clear();
    } catch {
      /* ignore */
    }
  });
  await reset.close();

  await context.setOffline(true);
  await run(context, "offline");
  await context.close();
}

await browser.close();
console.log(failures ? `\n${failures} failure(s)` : "\nDemo path passes online and with the network off");
process.exit(failures ? 1 : 0);
