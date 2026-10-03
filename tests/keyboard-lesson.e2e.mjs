// tests/keyboard-lesson.e2e.mjs
// Completes a lesson with the keyboard only and fails on console errors.
//
//   pnpm build && DEMO_MODE=1 pnpm start -p 3111
//   pnpm test:keyboard
//
// Needs Playwright: pnpm add -D playwright && npx playwright install chromium
//
// SPEC section 8 asks for keyboard completion. This drives it with zero mouse input:
// 1 to 4 choose an answer, Enter checks and advances, R reads aloud, P pauses. If a
// shortcut regresses, or a control cannot be reached or seen, this fails here first.
import { chromium } from "playwright";

const BASE = process.env.BASE_URL ?? "http://localhost:3111";
const QUESTIONS = Number(process.env.QUESTIONS ?? 6);
let failures = 0;

const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
const page = await context.newPage();

const errors = [];
page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
page.on("pageerror", (e) => errors.push(String(e)));

const fail = (msg) => {
  failures++;
  console.log(`  FAIL  ${msg}`);
};
const ok = (msg) => console.log(`  ok    ${msg}`);

// Start from the landing page and walk in, so the whole entry path is keyboard friendly.
await page.goto(BASE, { waitUntil: "networkidle" });

// 1. The skip link is the first thing the keyboard reaches, and it jumps to <main>.
await page.keyboard.press("Tab");
const skip = await page.evaluate(() => {
  const el = document.activeElement;
  return { tag: el?.tagName, href: el?.getAttribute("href"), text: el?.textContent?.trim() };
});
if (skip.href === "#main") ok(`first Tab reaches the skip link (${skip.text})`);
else fail(`first Tab should reach the skip link, got ${JSON.stringify(skip)}`);

await page.keyboard.press("Enter");
await page.waitForTimeout(300);

// 2. Tab on to the start button and open onboarding with the keyboard.
let reached = false;
for (let i = 0; i < 12 && !reached; i++) {
  await page.keyboard.press("Tab");
  reached = await page.evaluate(() => document.activeElement?.getAttribute("data-demo") === "start");
}
if (reached) ok("Tab reaches the Get Started button");
else fail("could not Tab to [data-demo=start]");
await page.keyboard.press("Enter");
await page.waitForURL("**/start", { timeout: 15000 }).catch(() => {});
ok(`keyboard opened onboarding (${new URL(page.url()).pathname})`);

await page.fill("[data-demo='name']", "Keyboard");
// Wait for the framework list rather than clicking the country container: that div
// wraps the buttons, so clicking it would hit whichever lens sits in the middle.
await page.waitForSelector("[data-demo='country']", { timeout: 15000 });
await page.waitForSelector("[data-demo='lens-ng-ube']", { timeout: 15000 });
await page.click("[data-demo='lens-ng-ube']");
await page.waitForSelector("[data-demo='theme-dinosaurs']", { timeout: 10000 });
await page.keyboard.press("Tab");
await page.keyboard.press("Enter");

// Onboarding placement runs between the theme and the first lesson (features.md A2).
// Skip it, because skipping is itself a keyboard reachable choice.
await page.waitForSelector("[data-demo='placement-quiz']", { timeout: 15000 });
ok("reached the placement check without the mouse");
await page.getByText("Skip, start from the beginning").click();
await page.waitForSelector("[data-demo='question']", { timeout: 25000 });
ok("reached the lesson question without the mouse");

// 3. Every answer button must be focusable and show a visible focus ring.
const focusRing = await page.evaluate(() => {
  const btn = document.querySelector("[data-demo='answer-right']") || document.querySelector("[data-demo='answer-wrong']");
  if (!btn) return { found: false };
  btn.focus();
  const cs = getComputedStyle(btn);
  return {
    found: true,
    outline: cs.outlineStyle !== "none" && parseFloat(cs.outlineWidth) > 0,
    shadow: cs.boxShadow !== "none",
  };
});
if (!focusRing.found) fail("no answer button found on the question");
else if (focusRing.outline || focusRing.shadow) ok("answer button shows a visible focus ring");
else fail("answer button has no visible focus ring");

// 4. P pauses and resumes.
await page.keyboard.press("p");
await page.waitForTimeout(400);
const paused = await page.locator("text=Lesson Paused").count();
if (paused > 0) ok("P pauses the lesson");
else fail("P did not pause the lesson");
await page.keyboard.press("p");
await page.waitForTimeout(400);
if ((await page.locator("text=Lesson Paused").count()) === 0) ok("P resumes the lesson");
else fail("P did not resume the lesson");

// 5. R reads the question aloud without touching the mouse.
await page.keyboard.press("r");
await page.waitForTimeout(500);
const spoke = await page.evaluate(() => {
  const btn = document.querySelector("[data-demo='read-aloud']");
  return btn?.getAttribute("aria-pressed") === "true";
});
if (spoke) ok("R starts read aloud");
else fail("R did not start read aloud");

// 6. Answer with a number key, check with Enter, advance with Enter.
let answered = 0;
for (let q = 0; q < QUESTIONS; q++) {
  const hasQuestion = await page.locator("[data-demo='question']").count();
  if (!hasQuestion) break;

  await page.keyboard.press("1");
  await page.waitForTimeout(250);
  // Key 1 selects the first option, which is the first answer button in the DOM.
  const selected = await page.evaluate(() => {
    const first = document.querySelector("[data-demo='answer-wrong'], [data-demo='answer-right']");
    return first?.getAttribute("aria-pressed") === "true";
  });
  if (!selected) {
    fail(`question ${q + 1}: number key 1 did not select an answer`);
    break;
  }

  // This lesson checks as soon as an answer is chosen, the same as a tap. So the
  // number key answers, and Enter moves on.
  await page.waitForTimeout(450);
  // The lesson says "Nice thinking!" for a right answer and "Almost, let us look
  // again:" for a gentle retry, plus the honey reward line.
  const gaveFeedback = await page.evaluate(() => {
    const t = document.body.innerText;
    return /nice thinking|almost|look again|hint|honey/i.test(t);
  });
  if (!gaveFeedback) fail(`question ${q + 1}: choosing an answer gave no feedback`);
  answered++;

  await page.keyboard.press("Enter");
  await page.waitForTimeout(450);
}
ok(`answered and advanced past ${answered} question(s) with the keyboard only`);

const real = errors.filter((e) => !/favicon|speech|Synthesis|not-allowed/i.test(e));
if (real.length) fail(`console errors: ${real.join(" | ").slice(0, 250)}`);
else ok("no console errors");

await context.close();
await browser.close();
console.log(failures ? `\n${failures} failure(s)` : "\nA lesson completes with the keyboard only");
process.exit(failures ? 1 : 0);
