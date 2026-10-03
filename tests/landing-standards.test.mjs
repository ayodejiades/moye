// tests/landing-standards.test.mjs
// Zero-dependency checks for the Moye landing page. Run: pnpm test:landing
// Every test name starts with a priority: [P0] ship blocker, [P1] must fix, [P2] polish.
// A test failure prints WHAT is wrong and WHERE. Fix the code, never weaken the test.
import assert from "node:assert/strict";
import { test } from "node:test";
import { readFileSync, existsSync } from "node:fs";
import { execSync } from "node:child_process";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const read = (p) => (existsSync(resolve(ROOT, p)) ? readFileSync(resolve(ROOT, p), "utf8") : "");

// Files that render on "/" . Add a path here if you add a landing component.
const LANDING = [
  "app/page.tsx",
  "components/hero-mascot-interactive.tsx",
  "components/interactive-showcase.tsx",
  "components/reveal.tsx",
  "components/comfort-button.tsx",
  "components/accessibility-sheet.tsx",
  // Showcase parts. fixes.md C4 requires the split, so these are audited in their own right.
  "components/showcase/showcase-tabs.tsx",
  "components/showcase/focus-screen.tsx",
  "components/showcase/phone-frame.tsx",
  "components/showcase/story-cards.tsx",
];
const MASCOT = ["components/moyin-mascot.tsx", "components/ui/svg-icons.tsx"];
const CSS_PATH = "app/globals.css";

// ---------- helpers ----------
// Comments are blanked, not removed, so reported line numbers match the real file.
const blank = (m) => m.replace(/[^\n]/g, " ");
const stripJsComments = (s) =>
  s.replace(/\{\s*\/\*[\s\S]*?\*\/\s*\}/g, blank).replace(/\/\*[\s\S]*?\*\//g, blank).replace(/^\s*\/\/.*$/gm, blank);
const stripCssComments = (s) => s.replace(/\/\*[\s\S]*?\*\//g, blank);
const landing = () => LANDING.filter((p) => existsSync(resolve(ROOT, p))).map((p) => [p, stripJsComments(read(p))]);
const allVisual = () => [...landing(), ...MASCOT.map((p) => [p, stripJsComments(read(p))])];
const matches = (text, re, msg) => assert.ok(re.test(text), msg);
const lineOf = (src, idx) => src.slice(0, idx).split("\n").length;

/** Collect every regex match across files as "file:line  text" so failures are actionable. */
function scan(files, re, filter = () => true) {
  const hits = [];
  for (const [file, src] of files) {
    for (const m of src.matchAll(re)) {
      if (filter(m, src)) hits.push(`${file}:${lineOf(src, m.index)}  ${m[0].replace(/\s+/g, " ").trim().slice(0, 90)}`);
    }
  }
  return hits;
}
const expectNone = (hits, why) =>
  assert.equal(hits.length, 0, `${why}\n  ${hits.slice(0, 25).join("\n  ")}${hits.length > 25 ? `\n  ...and ${hits.length - 25} more` : ""}`);

/** Split CSS into nested blocks: [{ prelude, body, children }] */
function parseCss(css) {
  const out = [];
  let i = 0;
  while (i < css.length) {
    const open = css.indexOf("{", i);
    if (open === -1) break;
    const prelude = css.slice(i, open).trim();
    let depth = 1, j = open + 1;
    while (j < css.length && depth) {
      if (css[j] === "{") depth++;
      else if (css[j] === "}") depth--;
      j++;
    }
    const body = css.slice(open + 1, j - 1);
    out.push({ prelude: prelude.split(";").pop().replace(/^[\s}]+/, "").trim(), body, children: body.includes("{") ? parseCss(body) : [] });
    i = j;
  }
  return out;
}
const flatten = (blocks, ctx = []) =>
  blocks.flatMap((b) => (b.children.length && b.prelude.startsWith("@media") ? flatten(b.children, [...ctx, b.prelude]) : [{ ...b, ctx }]));
const css = () => stripCssComments(read(CSS_PATH));
const rules = () => flatten(parseCss(css()));
const isReduceCtx = (ctx) => ctx.some((c) => /prefers-reduced-motion:\s*reduce/.test(c));
const isNoPrefCtx = (ctx) => ctx.some((c) => /prefers-reduced-motion:\s*no-preference/.test(c));
const keyframes = () =>
  parseCss(css()).filter((b) => b.prelude.startsWith("@keyframes")).map((b) => ({ name: b.prelude.replace("@keyframes", "").trim(), body: b.body }));
const OFF_ANIM = /animation(-duration)?\s*:\s*(none|0?\.01ms|1ms|0s)/;
const OFF_TRANS = /transition(-duration)?\s*:\s*(none|0?\.01ms|1ms|0s)/;
const classesIn = (selector) => [...selector.matchAll(/\.([A-Za-z_][\w-]*)/g)].map((m) => m[1]);

// WCAG contrast
const rgb = (h) => { const s = h.replace("#", ""); return [0, 2, 4].map((i) => parseInt(s.slice(i, i + 2), 16)); };
const lum = (c) => { const [r, g, b] = c.map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
const contrast = (a, b) => { const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x); return (hi + 0.05) / (lo + 0.05); };
const mix = (fg, bg, o) => fg.map((v, i) => v * o + bg[i] * (1 - o));
const token = (name) => (css().match(new RegExp(`--${name}:\\s*(#[0-9A-Fa-f]{6})`)) || [])[1];

// =====================================================================
// MOTION
// =====================================================================
test("[P0] M1 the in-app Calm Motion toggle has real CSS behind it (.reduced-motion-mode)", () => {
  const hit = rules().filter((r) => r.prelude.includes(".reduced-motion-mode"));
  assert.ok(hit.length > 0, "lib/accessibility-context.tsx adds class `reduced-motion-mode` to <html> but app/globals.css has no rule for it, so the toggle does nothing.");
  const body = hit.map((r) => r.body).join(" ");
  matches(body, OFF_ANIM, "`.reduced-motion-mode` rules must switch animations off");
  matches(body, OFF_TRANS, "`.reduced-motion-mode` rules must switch transitions off");
});

test("[P0] M2 no Tailwind animate-bounce/pulse/ping/spin on the landing page (they ignore reduced motion)", () => {
  expectNone(
    scan(landing(), /(?<!motion-safe:)\banimate-(bounce|pulse|ping|spin)\b/g),
    "Replace with a named keyframe from globals.css that is neutralised under reduced motion. Bouncing is also not calm.",
  );
});

test("[P0] M3 every infinite animation is switched off by prefers-reduced-motion AND .reduced-motion-mode", () => {
  const all = rules();
  const offByMedia = all.some((r) => isReduceCtx(r.ctx) && /(^|,)\s*\*/.test(r.prelude) && OFF_ANIM.test(r.body));
  const offByClass = all.some((r) => /\.reduced-motion-mode\s+\*/.test(r.prelude) && OFF_ANIM.test(r.body));
  const problems = [];
  for (const r of all) {
    if (isReduceCtx(r.ctx) || isNoPrefCtx(r.ctx) || r.prelude.includes(".reduced-motion-mode") || r.prelude.startsWith("@")) continue;
    if (!/animation[^;]*\binfinite\b/.test(r.body)) continue;
    for (const cls of classesIn(r.prelude)) {
      const coveredMedia = offByMedia || all.some((q) => isReduceCtx(q.ctx) && classesIn(q.prelude).includes(cls));
      const coveredClass = offByClass || all.some((q) => q.prelude.includes(".reduced-motion-mode") && q.prelude.includes(`.${cls}`));
      if (!coveredMedia) problems.push(`.${cls}: not covered inside @media (prefers-reduced-motion: reduce)`);
      if (!coveredClass) problems.push(`.${cls}: not covered by a .reduced-motion-mode rule`);
    }
  }
  expectNone([...new Set(problems)], "Add one universal reset in BOTH places instead of listing classes:\n  @media (prefers-reduced-motion: reduce){ *,*::before,*::after{ animation:none !important; transition-duration:.01ms !important; } }\n  .reduced-motion-mode *, .reduced-motion-mode *::before, .reduced-motion-mode *::after{ animation:none !important; transition-duration:.01ms !important; }");
});

test("[P0] M4 keyframes animate only transform, opacity or filter (no left/top/width/height/z-index)", () => {
  const bad = [];
  for (const k of keyframes()) {
    const props = new Set([...k.body.matchAll(/([a-z-]+)\s*:/g)].map((m) => m[1]));
    for (const p of props) if (!["transform", "opacity", "filter", "translate", "scale", "rotate", "animation-timing-function"].includes(p)) bad.push(`@keyframes ${k.name} animates \`${p}\` (layout or discrete property, causes jank)`);
  }
  expectNone(bad, "Animate transform/opacity only. Use translate3d/scale instead of left/top.");
});

test("[P1] M5 no dead motion code: every @keyframes and .duo-* class is used", () => {
  const src = stripCssComments(read(CSS_PATH));
  const used = (needle) => {
    try { return execSync(`grep -rl --include=*.tsx --include=*.ts -e '${needle}' app components lib`, { cwd: ROOT }).toString().trim().length > 0; } catch { return false; }
  };
  const dead = [];
  for (const k of keyframes()) {
    const referenced = new RegExp(`animation[^;]*\\b${k.name}\\b`).test(src.replace(new RegExp(`@keyframes\\s+${k.name}`), "")) || used(k.name);
    if (!referenced) dead.push(`@keyframes ${k.name} is never referenced`);
  }
  for (const m of new Set([...src.matchAll(/\.(duo-[\w-]+|moyin-[\w-]+|reveal[\w-]*|hero-[\w-]+)\s*[{,:.\s]/g)].map((x) => x[1]))) {
    if (!used(m)) dead.push(`.${m} is defined in CSS but never used in app/ components/ lib/`);
  }
  expectNone(dead, "Delete unused motion CSS or wire it in. Dead keyframes make the motion system look finished when it is not.");
});

test("[P1] M6 no `transition-all` on the landing page (name the properties)", () => {
  expectNone(scan(landing(), /\btransition-all\b/g), "Use transition-transform, transition-colors or transition-opacity so unrelated properties never animate.");
});

test("[P1] M7 one-shot animations and transitions are 300ms or shorter (SPEC section 4)", () => {
  const bad = [];
  bad.push(...scan(landing(), /\bduration-(\d+)\b/g, (m) => Number(m[1]) > 300));
  const toMs = (v, u) => (u === "s" ? Number(v) * 1000 : Number(v));
  for (const r of rules()) {
    if (isReduceCtx(r.ctx) || r.prelude.startsWith("@")) continue;
    for (const d of r.body.matchAll(/(?:^|[;{\s])(transition|animation)\s*:\s*([^;]+);/g)) {
      const decl = d[2];
      if (/\binfinite\b/.test(decl)) continue; // ambient loops are judged by M8
      const times = [...decl.replace(/cubic-bezier\([^)]*\)|steps\([^)]*\)/g, "").matchAll(/(-?\d*\.?\d+)(ms|s)\b/g)];
      // animation: first time is the duration, second is the delay. transition: every segment starts with a duration.
      const durations = d[1] === "animation" ? times.slice(0, 1) : times;
      for (const t of durations) if (toMs(t[1], t[2]) > 300) bad.push(`globals.css  ${r.prelude.slice(0, 40)} -> ${d[1]}: ${decl.trim().slice(0, 60)}`);
    }
  }
  expectNone(bad, "Keep one-shot motion at or under 300ms. Slow ambient loops are allowed (see M8), one-shots are not.");
});

test("[P1] M8 ambient loops are calm: 3s or longer, translate 6px or less, rotate 3deg or less, scale 0.97 to 1.05", () => {
  const problems = [];
  const kf = Object.fromEntries(keyframes().map((k) => [k.name, k.body]));
  for (const r of rules()) {
    if (isReduceCtx(r.ctx)) continue;
    for (const m of r.body.matchAll(/animation(?:-name)?\s*:\s*([^;]*\binfinite\b[^;]*);/g)) {
      const name = Object.keys(kf).find((n) => m[1].includes(n));
      const dur = (m[1].match(/(\d*\.?\d+)(ms|s)\b/) || []);
      const secs = dur[2] === "ms" ? Number(dur[1]) / 1000 : Number(dur[1]);
      if (secs < 3) problems.push(`${r.prelude}: infinite loop is ${secs}s, minimum is 3s`);
      if (!name) continue;
      for (const t of kf[name].matchAll(/translate[XYZ3d]*\(([^)]*)\)/g)) for (const n of t[1].match(/-?\d*\.?\d+(?=px)/g) || []) if (Math.abs(n) > 6) problems.push(`${r.prelude}: ${name} translates ${n}px (max 6)`);
      for (const t of kf[name].matchAll(/rotate\((-?\d*\.?\d+)deg\)/g)) if (Math.abs(t[1]) > 3) problems.push(`${r.prelude}: ${name} rotates ${t[1]}deg (max 3)`);
      for (const t of kf[name].matchAll(/scale\((\d*\.?\d+)/g)) if (t[1] < 0.97 || t[1] > 1.05) problems.push(`${r.prelude}: ${name} scales to ${t[1]} (allowed 0.97 to 1.05)`);
    }
  }
  expectNone([...new Set(problems)], "Ambient motion must be barely noticeable. ADHD and sensory friendly means no big loops.");
});

test("[P1] M9 scroll reveal system exists, is gated, and cannot leave content hidden", () => {
  assert.ok(existsSync(resolve(ROOT, "components/reveal.tsx")), "Create components/reveal.tsx exporting <Reveal> (see fixes.md section 3.2).");
  const hidden = rules().filter((r) => /\[data-reveal\]/.test(r.prelude) && /opacity\s*:\s*0\b/.test(r.body));
  assert.ok(hidden.length > 0, "globals.css needs a hidden starting state for [data-reveal].");
  for (const h of hidden) {
    assert.ok(isNoPrefCtx(h.ctx), `Hidden state \`${h.prelude}\` must sit inside @media (prefers-reduced-motion: no-preference).`);
    matches(h.prelude, /data-motion/, `Hidden state \`${h.prelude}\` must also require html[data-motion="on"] so content is visible without JavaScript.`);
  }
  const uses = scan(landing(), /<Reveal\b/g).length;
  assert.ok(uses >= 4, `Wrap at least 4 landing sections or rows in <Reveal> (found ${uses}).`);
  const reveal = stripJsComments(read("components/reveal.tsx"));
  matches(reveal, /IntersectionObserver/, "Reveal must use IntersectionObserver.");
  matches(reveal, /rootMargin:\s*["'`][^"'`]*(px|%)[^"'`]*(px|%)[^"'`]*(px|%)[^"'`]*(px|%)/, "rootMargin needs four values WITH units, for example \"0px 0px -10% 0px\". A bare 0 throws a SyntaxError.");
  matches(reveal, /disconnect\(\)|unobserve\(/, "Reveal must stop observing after the first reveal.");
});

test("[P1] M10 hero has a staggered entrance (CSS only, 60ms steps, total under 900ms)", () => {
  const rule = rules().find((r) => /\.hero-enter\b/.test(r.prelude) && /animation/.test(r.body));
  assert.ok(rule, "Define .hero-enter in globals.css (see fixes.md section 3.1).");
  assert.ok(isNoPrefCtx(rule.ctx), ".hero-enter must sit inside @media (prefers-reduced-motion: no-preference).");
  matches(rule.body, /var\(--i/, ".hero-enter must read the stagger index from var(--i).");
  const uses = scan(landing(), /\bhero-enter\b/g).length;
  assert.ok(uses >= 4, `Use hero-enter on the h1, subcopy, buttons and mascot (found ${uses}).`);
  const delay = rule.body.match(/(\d+)ms\s*\*\s*var\(--i|var\(--i[^)]*\)\s*\*\s*(\d+)ms/);
  assert.ok(delay, "Stagger must be calc(var(--i) * Nms).");
  assert.ok(Number(delay[1] ?? delay[2]) <= 80, "Stagger step must be 80ms or less.");
});

test("[P1] M11 mascot has idle life: blink and breathe, paused when off screen", () => {
  const names = keyframes().map((k) => k.name);
  assert.ok(names.includes("moyin-blink"), "Add @keyframes moyin-blink (scaleY on the eyes, one blink every 5 to 7s).");
  assert.ok(names.includes("moyin-breathe"), "Add @keyframes moyin-breathe (scale 1 to 1.02, 4s or longer).");
  matches(css(), /animation-play-state\s*:\s*paused/, "Loops must pause when the hero is off screen or the tab is hidden (animation-play-state: paused).");
  matches(stripJsComments(read("components/moyin-mascot.tsx")), /moyin-(blink|eyes)/, "MoyinPeeking must tag its eyes with the blink class.");
  const cheer = stripJsComments(read("components/moyin-mascot.tsx"));
  matches(cheer.slice(cheer.indexOf("export function MoyinPeeking")), /pose\s*===\s*["']cheer["']/, "MoyinPeeking ignores pose=\"cheer\" today. Render a visible cheer (raised paws or happy eyes).");
});

test("[P1] M12 hero respects Calm Motion and sound settings, and cleans up timers and speech", () => {
  const hero = stripJsComments(read("components/hero-mascot-interactive.tsx"));
  matches(hero, /useAccessibility\(/, "Hero must read useAccessibility() from lib/accessibility-context.");
  matches(hero, /soundEnabled/, "Do not call speechSynthesis when soundEnabled is false.");
  matches(hero, /return\s*\(\)\s*=>\s*\{[^}]*speechSynthesis\.cancel/s, "Cancel speech in an effect cleanup so it stops on navigation.");
  const sets = (hero.match(/setTimeout\(/g) || []).length;
  const clears = (hero.match(/clearTimeout\(/g) || []).length;
  assert.ok(clears >= sets, `Every setTimeout needs a clearTimeout (setTimeout x${sets}, clearTimeout x${clears}).`);
});

test("[P1] M13 hover lift only on real links or buttons, never on div/span, and no cursor-pointer on divs", () => {
  expectNone(
    scan(landing(), /<(div|span)\b[^>]*\b(duo-card-hover|cursor-pointer)\b[^>]*>/g),
    "These elements lift and show a hand cursor but do nothing when clicked. Remove the classes or make them real links.",
  );
});

// =====================================================================
// DESIGN RULES (AGENTS.md + SPEC section 4)
// =====================================================================
test("[P0] D1 no pills, no heavy weights, no italics, no gradients", () => {
  expectNone(scan(allVisual(), /\brounded-full\b/g), "No rounded-full anywhere. Dots: rounded-sm. Bars: rounded-md. Focus ring: rounded-2xl.");
  expectNone(scan(allVisual(), /\bfont-(black|extrabold)\b/g), "Cap weight at font-bold (700).");
  expectNone(scan(allVisual(), /\bitalic\b|font-style:\s*italic/g), "No italics.");
  expectNone(scan(allVisual(), /\b(bg|from|via|to)-gradient|linear-gradient|radial-gradient|conic-gradient|\b(from|via|to)-\[/g), "No gradients. Use flat token fills.");
});

test("[P0] D2 no raw emoji in UI source", () => {
  expectNone(scan(allVisual(), /(?![©®™])\p{Extended_Pictographic}/gu), "Replace emoji with an SVG icon from components/ui/svg-icons.tsx or plain text.");
});

test("[P0] D3 every var(--x) used on the landing page is defined", () => {
  const defined = new Set([...css().matchAll(/(--[\w-]+)\s*:/g)].map((m) => m[1]));
  ["--font-lexend"].forEach((n) => defined.add(n)); // injected by next/font in app/layout.tsx
  const hits = scan(allVisual(), /var\((--[\w-]+)/g, (m) => !defined.has(m[1]));
  expectNone(hits, "Undefined CSS variable. The declaration is silently dropped (for example the border disappears). Use a real token such as --plum-100 or --border.");
});

test("[P1] D4 no text smaller than 12px", () => {
  expectNone(scan(allVisual(), /text-\[(\d+(?:\.\d+)?)px\]/g, (m) => Number(m[1]) < 12), "Minimum is text-xs (12px). Restructure the mock phone UI instead of shrinking type.");
});

test("[P1] D5 spacing uses only the approved token set", () => {
  const ok = new Set(["0", "0.5", "1", "2", "3", "4", "6", "8", "10", "12", "16", "20", "24", "px", "auto"]);
  expectNone(
    scan(landing(), /(?<![\w[-])-?(?:p|px|py|pt|pb|pl|pr|m|mx|my|mt|mb|ml|mr|gap|gap-x|gap-y|space-x|space-y)-(\d+(?:\.\d+)?|px|auto)\b(?!\])/g, (m) => !ok.has(m[1])),
    "Allowed: 0 0.5 1 2 3 4 6 8 10 12 16 20 24. Round to the nearest allowed value (1.5 -> 2, 2.5 -> 3, 3.5 -> 4, 5 -> 4 or 6, 7 -> 8, 14 -> 12 or 16).",
  );
});

test("[P1] D6 no hyphens in visible copy", () => {
  const files = landing();
  const jsx = scan(files, />([^<>{}]+)</g, (m) => /\p{L}-\p{L}/u.test(m[1]) && !/[;=]/.test(m[1].replace(/&#?\w+;/g, " ")));
  const strings = scan(files, /\b(speech|bubble|label|title|text|copy|desc|body)\s*:\s*["'`]([^"'`]*)["'`]/g, (m) => /\p{L}-\p{L}/u.test(m[2]));
  const attrs = scan(files, /\b(aria-label|title|alt|placeholder)="([^"]*)"/g, (m) => /\p{L}-\p{L}/u.test(m[2]));
  expectNone([...jsx, ...strings, ...attrs], "Rewrite without hyphens (bite-sized -> small steps, Grown-ups -> Grownups, Wi-Fi -> internet, guilt-free -> no guilt).");
});

test("[P1] D7 headings are balanced and paragraphs are pretty (no orphan words)", () => {
  const c = css();
  const globalHeading = /h1[^{}]*\{[^}]*text-wrap:\s*balance/s.test(c) || /(h1|h2|h3)[\s\S]{0,80}text-wrap:\s*balance/.test(c);
  const globalPara = /\bp\b[^{}]*\{[^}]*text-wrap:\s*pretty/s.test(c);
  const missing = [];
  for (const [file, src] of landing()) {
    for (const m of src.matchAll(/<h[123]\b[^>]*>/g)) if (!globalHeading && !/text-balance|text-wrap:balance/.test(m[0])) missing.push(`${file}:${lineOf(src, m.index)}  ${m[0].slice(0, 70)}`);
    if (!globalPara) for (const m of src.matchAll(/<p\b[^>]*>/g)) if (!/text-pretty|text-wrap:pretty/.test(m[0])) missing.push(`${file}:${lineOf(src, m.index)}  ${m[0].slice(0, 70)}`);
  }
  expectNone(missing, "Add once in globals.css: `h1,h2,h3{text-wrap:balance} p,li{text-wrap:pretty}` (preferred), or per element.");
});

test("[P1] D8 buttons: main buttons are text-base, and no all caps labels", () => {
  expectNone(
    scan(landing(), /className="[^"]*(?<![\w-])btn-3d(?![\w-])(?![^"]*\bbtn-3d-(header|sm)\b)[^"]*(?<![\w:-])text-(xs|sm)\b[^"]*"/g),
    "Main buttons are text-base (16px) semibold. Only btn-3d-header and btn-3d-sm may be text-sm.",
  );
  expectNone(scan(landing(), /\buppercase\b/g), "No all caps. It hurts dyslexic readers and SPEC section 4 bans all caps text. Use sentence case.");
});

test("[P1] D9 palette discipline: honey is for rewards only, colours come from tokens", () => {
  const page = stripJsComments(read("app/page.tsx"));
  expectNone(scan([["app/page.tsx", page]], /#(F59E0B|0D7377|5B21B6)\b/gi), "Starburst uses off palette hex (amber is reward only, the others are not tokens). Use var(--plum-100) and var(--plum-500) at low opacity, or remove the starburst.");
  expectNone(scan(landing(), /\btext-(amber|yellow|orange|teal|emerald|green|purple|rose|red)-\d{3}\b/g), "Text colours must be tokens: text-[var(--teal-700)], text-[var(--honey-700)], text-[var(--plum-700)], text-[var(--rose-400)] is decoration only.");
});

test("[P2] D10 backgrounds and borders use tokens, not Tailwind default colour scales", () => {
  expectNone(scan(landing(), /\b(bg|border|shadow)-(amber|yellow|orange|teal|emerald|green|purple|rose|red|blue|sky|indigo|violet|slate|gray|zinc|neutral)-\d{2,3}(\/\d+)?\b/g), "Use --plum-100, --teal-500/700, --honey-500/700, --rose-400 via arbitrary values or add them to @theme in globals.css.");
});

test("[P1] D11 .btn-3d padding is the spec value (8px 12px) and padding utilities on it are not dead", () => {
  const base = rules().find((r) => /(^|,)\s*\.btn-3d\s*(,|$)/.test(r.prelude) && /padding/.test(r.body));
  assert.ok(base && /padding:\s*0\.5rem\s+0\.75rem/.test(base.body), "`.btn-3d` in globals.css must be `padding: 0.5rem 0.75rem` (SPEC 4). It is 0.75rem 1.75rem today, and 28px is not a spacing token.");
  // Unlayered CSS beats Tailwind utilities, so py-4 or px-10 on a .btn-3d element silently does nothing.
  expectNone(
    scan(landing(), /className="[^"]*(?<![\w-])btn-3d(?![\w-])[^"]*"/g, (m) => /(?<![\w:!-])(px|py|p)-\d/.test(m[0])),
    "These padding utilities have no effect on .btn-3d (the CSS rule wins). Remove them. Use min-w-* or w-full for width.",
  );
});

// =====================================================================
// CONTRAST (WCAG AA)
// =====================================================================
test("[P0] X1 coloured 3D buttons meet AA (4.5:1) for their label", () => {
  const bad = [];
  for (const cls of ["btn-3d-plum", "btn-3d-teal", "btn-3d-honey"]) {
    const bgs = rules().filter((r) => new RegExp(`\\.${cls}(?![\\w-])(?!:)`).test(r.prelude) && /background-color/.test(r.body));
    for (const r of bgs) {
      const bgv = r.body.match(/background-color:\s*(var\(--([\w-]+)\)|#[0-9A-Fa-f]{6})/);
      const bg = bgv[2] ? token(bgv[2]) : bgv[1];
      const fgSrc = (rules().filter((q) => new RegExp(`\\.${cls}(?![\\w-])`).test(q.prelude) && /(^|[;\s])color:\s*(#[0-9A-Fa-f]{6}|var\(--[\w-]+\))/.test(q.body)).pop() || { body: "" }).body;
      const fgm = fgSrc.match(/(?:^|[;\s])color:\s*(?:var\(--([\w-]+)\)|(#[0-9A-Fa-f]{6}))/);
      const fg = fgm ? (fgm[1] ? token(fgm[1]) : fgm[2]) : "#FFFFFF";
      const ratio = contrast(rgb(fg), rgb(bg));
      if (ratio < 4.5) bad.push(`.${cls}: label ${fg} on ${bg} = ${ratio.toFixed(2)}:1 (needs 4.5)`);
    }
  }
  expectNone(bad, "Honey button: label var(--plum-900). Teal button: background var(--teal-700) (edge var(--plum-900)). Re-run until every ratio is 4.5 or more.");
});

test("[P0] X2 hero copy stays AA over the worst stripe of the starburst", () => {
  const page = read("app/page.tsx");
  const fills = (page.match(/const fills = \[([^\]]*)\]/) || [])[1];
  const ops = page.match(/opacity=\{[^}]*\?\s*(0?\.\d+)\s*:\s*(0?\.\d+)\}/);
  if (!fills || !ops) return; // starburst removed or refactored: nothing to check
  const base = rgb((page.match(/<rect[^>]*fill="(#[0-9A-Fa-f]{6})"/) || [])[1] || "#F5F0FA");
  const muted = rgb(token("fg-muted") || "#594875");
  const worst = [];
  for (const f of fills.match(/#[0-9A-Fa-f]{6}/g) || []) for (const o of [ops[1], ops[2]]) {
    const r = contrast(muted, mix(rgb(f), base, Number(o)));
    if (r < 4.5) worst.push(`${f} at opacity ${o}: ${r.toFixed(2)}:1`);
  }
  expectNone(worst, "Subcopy (--fg-muted) falls below 4.5:1 over these stripes. Lower stripe opacity to 0.10 or less, or put the copy on a solid --paper panel.");
});

test("[P0] X3 `button { color: inherit }` lives in @layer base so text-white on purple buttons wins", () => {
  const unlayered = parseCss(css()).filter((b) => /^button\b/.test(b.prelude) && /(^|[;\s])color\s*:\s*inherit/.test(b.body));
  expectNone(unlayered.map((b) => `globals.css  ${b.prelude}`), "An unlayered `button { color: inherit }` beats every Tailwind utility and puts dark text on plum and teal buttons (1.9:1). Wrap it in `@layer base { ... }`.");
});

// =====================================================================
// ACCESSIBILITY / SEMANTICS
// =====================================================================
test("[P0] A1 page has a <main id=\"main\"> landmark and a skip link", () => {
  const page = stripJsComments(read("app/page.tsx")) + stripJsComments(read("app/layout.tsx"));
  matches(page, /<main\b[^>]*\bid="main"/, "Wrap the page body in <main id=\"main\">.");
  matches(page, /href="#main"/, "Add a visually hidden skip link <a href=\"#main\"> as the first focusable element.");
});

test("[P0] A2 showcase tabs use real tab semantics and arrow key navigation", () => {
  const s = stripJsComments(read("components/interactive-showcase.tsx"));
  for (const need of ['role="tablist"', 'role="tab"', "aria-selected", 'role="tabpanel"', "aria-controls", "ArrowRight", "ArrowLeft"]) assert.ok(s.includes(need), `interactive-showcase.tsx is missing ${need}`);
  assert.ok((s.match(/onClick=\{\(\) => setActiveTab\(/g) || []).length <= 1, "Four copy pasted tab buttons: build them with TABS.map(...).");
});

test("[P1] A3 mascot speech bubble is announced and the mascot has an accessible role", () => {
  const hero = stripJsComments(read("components/hero-mascot-interactive.tsx"));
  matches(hero, /aria-live="polite"|role="status"/, "The bubble text must be in an aria-live=\"polite\" region.");
  const m = stripJsComments(read("components/moyin-mascot.tsx"));
  expectNone(scan([["moyin-mascot.tsx", m]], /<div\b(?![^>]*\brole=)[^>]*\baria-label=/g), "aria-label on a div without a role is ignored. Add role=\"img\".");
});

test("[P1] A4 exactly one h1, and one data-demo=\"start\" on the page", () => {
  const files = landing();
  const h1 = scan(files, /<h1\b/g);
  assert.equal(h1.length, 1, `Expected one <h1>, found ${h1.length}`);
  const starts = scan(files, /data-demo="start"/g);
  assert.equal(starts.length, 1, `docs/demo-path.json clicks [data-demo='start'] and Playwright strict mode fails on duplicates. Found ${starts.length}: keep it on the hero button, rename others to start-header and start-footer.`);
});

test("[P1] A5 the accessibility sheet is reachable from the landing page (SPEC 5.7)", () => {
  const src = LANDING.map(read).join("\n") + read("app/layout.tsx") + read("lib/client-providers.tsx");
  matches(src, /AccessibilitySheet/, "Render <AccessibilitySheet /> (with a header button labelled \"Comfort settings\") so visitors can turn Calm Motion on. This is also the WCAG 2.2.2 pause mechanism for ambient motion.");
});

test("[P2] A6 showcase answers expose state to assistive tech", () => {
  // Read every showcase part: fixes.md C4 splits these across files, so checking only
  // the orchestrator would miss the markup entirely.
  const s = ["components/interactive-showcase.tsx", ...LANDING.filter((p) => p.includes("/showcase/"))]
    .filter((p) => existsSync(resolve(ROOT, p)))
    .map((p) => stripJsComments(read(p)))
    .join("\n");
  matches(s, /aria-pressed|aria-checked/, "Answer buttons need aria-pressed.");
  matches(s, /aria-live/, "Feedback (Spot on / Almost) must be in an aria-live region.");
});

// =====================================================================
// HONESTY (SPEC section 2.7 and 10)
// =====================================================================
test("[P0] H1 landing makes no offline or install claim unless a manifest and service worker exist", () => {
  const text = landing().map(([, s]) => s).join("\n");
  const claims = /offline pwa|install pwa|installable|install as an|wi.?fi switched off|works offline|offline progressive|indexeddb/i.test(text);
  if (!claims) return;
  const manifest = ["app/manifest.ts", "app/manifest.json", "public/manifest.webmanifest", "public/manifest.json"].some((p) => existsSync(resolve(ROOT, p)));
  const sw = ["public/sw.js", "public/service-worker.js", "app/sw.ts"].some((p) => existsSync(resolve(ROOT, p)));
  assert.ok(manifest && sw, `Landing claims offline install but manifest=${manifest}, serviceWorker=${sw}. Either build them (app/manifest.ts + public/sw.js that caches the lesson bank) or delete the claims and the "Install PWA on iOS / Android" links.`);
});

test("[P0] H2 landing does not name a service the project does not use", () => {
  const text = landing().map(([, s]) => s).join("\n");
  const pkg = read("package.json");
  if (/supabase/i.test(text)) assert.ok(/@supabase\/supabase-js/.test(pkg), "Landing says Supabase Auth and RLS, but @supabase/supabase-js is not a dependency. Say \"Saves on this device\" until it is wired.");
});

test("[P1] H3 no unmeasured numbers, no efficacy claims, no slop words", () => {
  expectNone(scan(landing(), />\s*100\s?%|["'`]100\s?%|\b100%\s+(Pass|Offline|Deterministic|Transparent)/gi), "\"100%\" is not in evidence/. Show a number read from an evidence file or remove it.");
  expectNone(scan(landing(), /research.?backed|clinically|proven|guarantee|zero anxiety|audited|certified|production.?ready/gi), "Unsupported claim (SPEC section 10). Say what the app does, not that it is proven.");
  expectNone(scan(landing(), /supercharge|seamless|next.?gen|revolution|kernel|moat|jumpscare|funkified|gimmick/gi), "Slop or internal jargon in user facing copy.");
});

// =====================================================================
// HYGIENE
// =====================================================================
test("[P1] C1 no .bak files are committed", () => {
  const out = execSync("git ls-files '*.bak'", { cwd: ROOT }).toString().trim();
  assert.equal(out, "", `Delete these stale backups (git rm):\n${out}`);
});

test("[P1] C2 typecheck passes", () => {
  execSync("npx tsc --noEmit", { cwd: ROOT, stdio: "pipe" });
});

test("[P1] C3 eslint has zero warnings", () => {
  try { execSync("npx eslint --max-warnings 0", { cwd: ROOT, stdio: "pipe" }); }
  catch (e) { assert.fail(`eslint reported problems:\n${String(e.stdout).slice(0, 1500)}`); }
});

test("[P2] C4 showcase is split into small components", () => {
  const n = read("components/interactive-showcase.tsx").split("\n").length;
  assert.ok(n <= 400, `components/interactive-showcase.tsx is ${n} lines (max 400). Split into showcase-tabs.tsx, phone-frame.tsx and one file per tab panel.`);
});
