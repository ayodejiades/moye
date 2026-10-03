// tests/landing.e2e.mjs  (optional, needs: pnpm add -D playwright && npx playwright install chromium)
// Runs tests/landing-probe.js at 3 widths, with and without OS reduced motion. Start the app first: pnpm dev
import { chromium } from "playwright";
import { readFileSync } from "node:fs";

const probe = readFileSync(new URL("./landing-probe.js", import.meta.url), "utf8");
const BASE = process.env.BASE_URL ?? "http://localhost:3000";
const viewports = [{ width: 1280, height: 800 }, { width: 768, height: 1024 }, { width: 375, height: 812 }];
let failures = 0;

const browser = await chromium.launch();
for (const viewport of viewports) {
  for (const reducedMotion of ["no-preference", "reduce"]) {
    const context = await browser.newContext({ viewport, reducedMotion });
    const page = await context.newPage();
    const errors = [];
    page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
    page.on("pageerror", (e) => errors.push(String(e)));
    await page.goto(BASE, { waitUntil: "networkidle" });

    const tag = `${viewport.width}px ${reducedMotion}`;
    const { results } = await page.evaluate(probe);
    for (const r of results.filter((x) => !x.pass)) { failures++; console.log(`FAIL [${r.pri}] ${tag} ${r.id} :: ${r.detail}`); }

    if (reducedMotion === "reduce") {
      await page.waitForTimeout(1500);
      const moving = await page.evaluate(() => document.getAnimations().filter((a) => a.playState === "running" && !String(a.effect?.target?.className).includes("animate-spin")).length);
      if (moving) { failures++; console.log(`FAIL [P0] ${tag} ${moving} animations still running under prefers-reduced-motion`); }
      const hidden = await page.evaluate(() => [...document.querySelectorAll("[data-reveal]")].filter((e) => getComputedStyle(e).opacity < 0.99).length);
      if (hidden) { failures++; console.log(`FAIL [P0] ${tag} ${hidden} [data-reveal] elements are hidden under reduced motion`); }
    }
    if (errors.length) { failures++; console.log(`FAIL [P0] ${tag} console errors: ${errors.join(" | ").slice(0, 300)}`); }
    await context.close();
  }
}
await browser.close();
console.log(failures ? `\n${failures} failure(s)` : "\nAll landing e2e checks passed");
process.exit(failures ? 1 : 0);
