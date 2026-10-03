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

  // 4b. text cut off by its own box (overflow hidden with no way to scroll)
  for (const el of document.querySelectorAll("body *")) {
    if (!visible(el) || el.closest("svg, [aria-hidden=true], .sr-only") || ![...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())) continue;
    const cs = getComputedStyle(el);
    const clipX = /hidden|clip/.test(cs.overflowX) && el.scrollWidth > el.clientWidth + 2 && cs.textOverflow !== "ellipsis";
    const clipY = /hidden|clip/.test(cs.overflowY) && el.scrollHeight > el.clientHeight + 2 && cs.display !== "inline";
    if (clipX || clipY) problems.push(`CLIPPED ${lab(el)} (${el.scrollWidth}x${el.scrollHeight} inside ${el.clientWidth}x${el.clientHeight})`);
  }

  // 4c. headings, paragraphs and buttons inside a centred block that sit off centre
  for (const c of document.querySelectorAll("section, main div")) {
    if (c.closest("header, footer, nav") || getComputedStyle(c).textAlign !== "center" || !visible(c)) continue;
    const cr = c.getBoundingClientRect(); if (cr.width < 200) continue;
    for (const k of c.querySelectorAll(":scope > h1, :scope > h2, :scope > p, :scope > a, :scope > button")) {
      if (!visible(k)) continue;
      const r = k.getBoundingClientRect();
      // Controls that share a row are centred as a group, so judge the group.
      const row = [...c.children].filter((o) => { if (!visible(o)) return false; const q = o.getBoundingClientRect(); return Math.abs(q.top - r.top) < 6 || (q.top < r.bottom && q.bottom > r.top); });
      const left = Math.min(...row.map((o) => o.getBoundingClientRect().left)), right = Math.max(...row.map((o) => o.getBoundingClientRect().right));
      const off = Math.abs((left + right) / 2 - (cr.left + cr.width / 2));
      if (off > 8) problems.push(`OFFCENTRE ${lab(k)} is ${Math.round(off)}px off the middle of its centred block`);
    }
  }

  // 5. sideways scroll
  const over = document.documentElement.scrollWidth - innerWidth;
  if (over > 0) problems.push(`SCROLLX page is ${over}px wider than the screen`);
  return problems;
}

const SKIP_CLICK = /continue|start|sign|create|unlock|buy|reset|delete|leave|stop|begin|save|skip|check|next|submit|finish|done|try|open|close|comfort|pause|resume|print|copy|install/i;
let failures = 0;
const linkStatus = new Map();
const browser = await chromium.launch();
for (const viewport of VIEWPORTS) {
  const context = await browser.newContext({ viewport });
  for (const path of PAGES) {
    const page = await context.newPage();
    const tag = `${viewport.width}px ${path}`;
    const errors = [];
    page.on("console", (m) => m.type() === "error" && errors.push(`console error: ${m.text().slice(0, 140)}`));
    page.on("pageerror", (e) => errors.push(`page error: ${String(e).slice(0, 140)}`));
    page.on("response", (r) => { if (r.status() >= 400 && r.url().startsWith(BASE)) errors.push(`HTTP ${r.status()} ${r.url().replace(BASE, "")}`); });
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
        await page.mouse.move(0, 0);
        await page.waitForTimeout(500);
        problems.push(...(await page.evaluate(sweep, false)).filter((p) => p.startsWith("CONTRAST") || p.startsWith("OVERLAP") || p.startsWith("COVERED")));
      }

      // Every internal link on the page must resolve.
      const hrefs = await page.$$eval("a[href^='/']", (as) => [...new Set(as.map((a) => a.getAttribute("href")))]);
      for (const href of hrefs) {
        if (!linkStatus.has(href)) linkStatus.set(href, (await page.request.get(BASE + href).catch(() => ({ status: () => 0 }))).status());
        if (linkStatus.get(href) >= 400 || linkStatus.get(href) === 0) problems.push(`DEADLINK ${href} -> ${linkStatus.get(href)}`);
      }
      problems.push(...errors);
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
// The Comfort settings switches must each change something you can see.
{
  const page = await (await browser.newContext({ viewport: { width: 1280, height: 800 } })).newPage();
  await page.goto(BASE + "/learn", { waitUntil: "networkidle" });
  await page.waitForTimeout(800);
  await page.getByRole("button", { name: /comfort settings/i }).first().click();
  await page.waitForTimeout(400);
  const dialog = page.getByRole("dialog");
  const buttons = await dialog.getByRole("button").all();
  const snap = () => page.evaluate(() => JSON.stringify({ html: document.documentElement.className, fs: getComputedStyle(document.documentElement).fontSize, body: getComputedStyle(document.body).fontFamily + getComputedStyle(document.body).letterSpacing + getComputedStyle(document.body).backgroundColor + getComputedStyle(document.body).fontSize, ls: localStorage.getItem("moye_a11y_settings") }));
  for (const btn of buttons) {
    const name = ((await btn.textContent()) || "").trim().replace(/\s+/g, " ").slice(0, 30);
    if (!name || /close|done|listen|sample|active/i.test(name) || (await btn.getAttribute("aria-pressed")) === "true" || !(await btn.isVisible())) continue;
    const before = await snap();
    await btn.click({ timeout: 1500 }).catch(() => {});
    await page.waitForTimeout(250);
    if ((await snap()) === before) { failures++; console.log(`FAIL settings switch "${name}" changes nothing you can see or save`); }
    await btn.click({ timeout: 1500 }).catch(() => {}); // put it back
  }
  console.log("checked the Comfort settings switches");
}
await browser.close();
console.log(failures ? `\n${failures} problem(s)` : "\nNo overlaps, contrast failures, tiny text or sideways scroll on any screen");
process.exit(failures ? 1 : 0);
