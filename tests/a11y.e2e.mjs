// tests/a11y.e2e.mjs
// Automated accessibility checks on every screen (features.md D2, SPEC.md section 8).
//
//   pnpm build && DEMO_MODE=1 pnpm start -p 3111
//   BASE_URL=http://localhost:3111 pnpm test:a11y
//
// Fails on any serious or critical axe-core violation. Moderate and minor findings are
// reported so they can be judged, not silently dropped. This complements the landing probe:
// that one checks Moye's own house rules, this one checks the general WCAG rules.
//
// Needs: pnpm add -D @axe-core/playwright && npx playwright install chromium
import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";

const BASE = process.env.BASE_URL ?? "http://localhost:3111";

/** Every screen a child, a teacher or a grown up can land on. */
const PAGES = [
  { path: "/", name: "landing" },
  { path: "/start", name: "onboarding" },
  { path: "/learn", name: "learning path" },
  { path: "/lesson?level=s1", name: "lesson" },
  { path: "/lesson?level=r1", name: "reading lesson" },
  { path: "/done?level=s1", name: "done for today" },
  { path: "/hive", name: "hive" },
  { path: "/grownups", name: "grown ups report" },
  { path: "/proof", name: "how Moye decides" },
  { path: "/privacy", name: "privacy" },
];

/** Anything at or above this level fails the run. */
const BLOCKING = new Set(["serious", "critical"]);

let failures = 0;
const summary = [];

const browser = await chromium.launch();

for (const viewport of [
  { width: 1280, height: 900, tag: "desktop" },
  { width: 375, height: 812, tag: "mobile" },
]) {
  const context = await browser.newContext({ viewport });

  for (const target of PAGES) {
    const page = await context.newPage();
    try {
      await page.goto(BASE + target.path, { waitUntil: "networkidle", timeout: 25000 });
      // Let reveals settle so hidden content is not reported as a contrast failure.
      await page.waitForTimeout(600);

      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
        .analyze();

      const blocking = results.violations.filter((v) => BLOCKING.has(v.impact));
      const advisory = results.violations.filter((v) => !BLOCKING.has(v.impact));

      if (blocking.length === 0) {
        console.log(
          `  ok    ${viewport.tag} ${target.name}: ${results.passes.length} rules passed` +
            (advisory.length ? `, ${advisory.length} advisory` : ""),
        );
      } else {
        for (const v of blocking) {
          failures++;
          console.log(`  FAIL  ${viewport.tag} ${target.name}: [${v.impact}] ${v.id} (${v.nodes.length} node(s))`);
          for (const node of v.nodes.slice(0, 2)) {
            console.log(`          ${node.target.join(" ")}`);
            const msg = (node.failureSummary || "").split("\n").filter(Boolean).slice(1, 2).join("");
            if (msg) console.log(`          ${msg.trim().slice(0, 160)}`);
          }
        }
      }
      for (const v of advisory) {
        summary.push(`  note  ${viewport.tag} ${target.name}: [${v.impact}] ${v.id} (${v.nodes.length})`);
      }
      summary.push(
        `  --    ${viewport.tag} ${target.name}: ${results.violations.length} violations, ${results.passes.length} passes`,
      );
    } catch (err) {
      failures++;
      console.log(`  FAIL  ${viewport.tag} ${target.name}: could not check, ${String(err).split("\n")[0].slice(0, 120)}`);
    } finally {
      await page.close();
    }
  }
  await context.close();
}

await browser.close();

if (summary.length) {
  console.log("\nNotes (advisory findings, not blocking):");
  for (const line of summary.filter((l) => l.startsWith("  note"))) console.log(line);
}
console.log(
  failures
    ? `\n${failures} serious or critical accessibility violation(s)`
    : `\nNo serious or critical accessibility violations across ${PAGES.length} pages and 2 viewports`,
);
process.exit(failures ? 1 : 0);
