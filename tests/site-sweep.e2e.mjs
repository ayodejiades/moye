// tests/site-sweep.e2e.mjs
// Sweeps every screen at three widths for the faults a screenshot shows and unit tests miss:
//   1. something sitting on top of a button or link (a mascot, a bubble, a card)
//   2. two controls overlapping each other
//   3. text that fails WCAG AA against the colour it sits on (for example dark text on a purple button)
//   4. text under 12px, and sideways page scroll
// It also clicks every toggle style button once, so the "selected" colours are checked too.
//
//   pnpm build && DEMO_MODE=1 pnpm start -p 3111
//   BASE_URL=http://localhost:3111 pnpm test:site
import { chromium } from "playwright";

const BASE = process.env.BASE_URL ?? "http://localhost:3111";
const PAGES = ["/", "/start", "/learn", "/lesson?level=s1", "/lesson?level=r1", "/done?level=s1", "/hive", "/grownups", "/proof", "/privacy"];
const VIEWPORTS = [{ width: 1280, height: 800 }, { width: 768, height: 1024 }, { width: 375, height: 812 }];

/** Runs inside the page. Returns a list of problems. */
function sweep(atBottom) {
  const problems = [];
  const lab = (el) => `${el.tagName.toLowerCase()} "${(el.getAttribute("aria-label") || el.textContent || "").trim().replace(/\s+/g, " ").slice(0, 30)}"`;
  const visible = (el) => { const r = el.getBoundingClientRect(); const cs = getComputedStyle(el); return r.width > 1 && r.height > 1 && cs.visibility !== "hidden" && cs.display !== "none" && cs.opacity !== "0"; };
  const lum = (c) => { const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(c[0]) + 0.7152 * f(c[1]) + 0.0722 * f(c[2]); };
  // getComputedStyle can return lab(), oklch() or color(srgb ...), so let a canvas turn any colour into rgba.
  const ctx = document.createElement("canvas").getContext("2d", { willReadFrequently: true });
  const cache = new Map();
  const parse = (s) => {
    if (cache.has(s)) return cache.get(s);
    ctx.clearRect(0, 0, 1, 1); ctx.fillStyle = "#000"; ctx.fillStyle = s; ctx.fillRect(0, 0, 1, 1);
    const [r, g, b, a] = ctx.getImageData(0, 0, 1, 1).data;
    const out = [r, g, b, a / 255]; cache.set(s, out); return out;
  };
  const pinned = (el) => { for (let e = el; e && e !== document.body; e = e.parentElement) { const p = getComputedStyle(e).position; if (p === "fixed" || p === "sticky") return true; } return false; };
  const opaqueBg = (el) => {
    const layers = [];
    for (let e = el; e; e = e.parentElement) { const c = parse(getComputedStyle(e).backgroundColor); if (c[3] > 0) layers.push(c); if (c[3] >= 0.99) break; }
    let out = [255, 255, 255];
    for (const c of layers.reverse()) out = out.map((v, i) => c[i] * c[3] + v * (1 - c[3]));
    return out;
  };

  const controls = [...document.querySelectorAll("a[href], button, input, select, textarea, [role=tab]")].filter(visible).filter((el) => !el.closest("[aria-hidden=true]"));

  // 1. covered controls: whatever is on top at the centre of a control must be the control or part of it
  for (const el of controls) {
    const r = el.getBoundingClientRect();
    if (r.bottom < 0 || r.top > innerHeight) continue; // only what is on screen at this scroll position
    const x = Math.min(Math.max(r.left + r.width / 2, 0), innerWidth - 1), y = Math.min(Math.max(r.top + r.height / 2, 0), innerHeight - 1);
    const top = document.elementFromPoint(x, y);
    // A fixed bar over scrolling content only matters once the page is scrolled to the end: there it can never be scrolled away.
    if (top && !el.contains(top) && !top.contains(el) && !(el.labels && [...el.labels].some((l) => l.contains(top))) && (atBottom || (!pinned(el) && !pinned(top)))) problems.push(`COVERED ${lab(el)} is under ${lab(top)}`);
  }

  // 2. controls overlapping each other
  for (let i = 0; i < controls.length; i++) for (let j = i + 1; j < controls.length; j++) {
    const a = controls[i], b = controls[j];
    if (a.contains(b) || b.contains(a)) continue;
    if (!atBottom && (pinned(a) || pinned(b))) continue;
    const ra = a.getBoundingClientRect(), rb = b.getBoundingClientRect();
    const w = Math.min(ra.right, rb.right) - Math.max(ra.left, rb.left), h = Math.min(ra.bottom, rb.bottom) - Math.max(ra.top, rb.top);
    if (w > 4 && h > 4) problems.push(`OVERLAP ${lab(a)} and ${lab(b)} (${Math.round(w)}x${Math.round(h)}px)`);
  }

  // 3 and 4. text contrast and size
  const seen = new Set();
  for (const el of document.querySelectorAll("body *")) {
    if (!visible(el) || ![...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())) continue;
    if (el.closest("svg, [aria-hidden=true], .sr-only, :disabled, [aria-disabled=true]")) continue; // disabled controls are exempt from contrast rules
    const cs = getComputedStyle(el);
    const fs = parseFloat(cs.fontSize), bold = Number(cs.fontWeight) >= 700;
    const fg = parse(cs.color), bg = opaqueBg(el);
    const a = fg[3];
    const mixed = fg.slice(0, 3).map((v, i) => v * a + bg[i] * (1 - a));
    const [hi, lo] = [lum(mixed), lum(bg)].sort((x, y) => y - x);
    const ratio = (hi + 0.05) / (lo + 0.05);
    const need = fs >= 24 || (fs >= 18.66 && bold) ? 3 : 4.5;
    const key = lab(el) + cs.color + cs.backgroundColor;
    if (ratio < need && !seen.has(key)) { seen.add(key); problems.push(`CONTRAST ${ratio.toFixed(2)}:1 (needs ${need}) ${lab(el)} text ${cs.color} on rgb(${bg.join(",")})`); }
    if (fs < 12 && !seen.has("fs" + key)) { seen.add("fs" + key); problems.push(`TINY ${fs}px ${lab(el)}`); }
  }

  // 5. sideways scroll
  const over = document.documentElement.scrollWidth - innerWidth;
  if (over > 0) problems.push(`SCROLLX page is ${over}px wider than the screen`);
  return problems;
}

const SKIP_CLICK = /continue|start|sign|create|unlock|buy|reset|delete|leave|stop|begin|save|skip|check|next|submit|finish|done|try|open|close|comfort|pause|resume|print|copy|install/i;
let failures = 0;
const browser = await chromium.launch();
for (const viewport of VIEWPORTS) {
  const context = await browser.newContext({ viewport });
  for (const path of PAGES) {
    const page = await context.newPage();
    const tag = `${viewport.width}px ${path}`;
    try {
      await page.goto(BASE + path, { waitUntil: "networkidle", timeout: 25000 });
      await page.waitForTimeout(1200);
      let problems = await page.evaluate(sweep, false);
      // Reveal everything below the fold, then re-run once at the very bottom.
      const h = await page.evaluate(() => document.documentElement.scrollHeight);
      for (let y = 0; y < h; y += viewport.height * 0.6) { await page.evaluate((v) => window.scrollTo(0, v), y); await page.waitForTimeout(80); }
      await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
      await page.waitForTimeout(500);
      problems.push(...(await page.evaluate(sweep, true)));
      await page.evaluate(() => window.scrollTo(0, 0));

      // Click each toggle style button once and re-check its own colours in the selected state.
      const toggles = await page.$$("button[aria-pressed], [role=tab]");
      for (const t of toggles.slice(0, 14)) {
        const name = ((await t.textContent()) || "").trim();
        if (SKIP_CLICK.test(name) || !(await t.isVisible())) continue;
        await t.scrollIntoViewIfNeeded().catch(() => {});
        await t.click({ timeout: 1500 }).catch(() => {});
        await page.waitForTimeout(150);
        problems.push(...(await page.evaluate(sweep, false)).filter((p) => p.startsWith("CONTRAST") || p.startsWith("OVERLAP") || p.startsWith("COVERED")));
      }

      problems = [...new Set(problems)];
      if (problems.length) { failures += problems.length; console.log(`FAIL ${tag}`); problems.slice(0, 12).forEach((p) => console.log(`   ${p}`)); }
      else console.log(`ok   ${tag}`);
    } catch (e) {
      failures++; console.log(`FAIL ${tag}  ${String(e).slice(0, 120)}`);
    }
    await page.close();
  }
  await context.close();
}
await browser.close();
console.log(failures ? `\n${failures} problem(s)` : "\nNo overlaps, contrast failures, tiny text or sideways scroll on any screen");
process.exit(failures ? 1 : 0);
