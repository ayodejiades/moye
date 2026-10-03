// tests/landing-probe.js  (browser probe for "/" . Paste into DevTools console, or run through tests/landing.e2e.mjs)
// Returns [{ id, pri, pass, detail }]. Each id matches a section in fixes.md.
(async () => {
  const out = [];
  const add = (id, pri, pass, detail = "") => out.push({ id, pri, pass: !!pass, detail: String(detail).slice(0, 400) });
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const vis = (el) => { const r = el.getBoundingClientRect(); const cs = getComputedStyle(el); return r.width > 0 && r.height > 0 && cs.visibility !== "hidden" && cs.display !== "none"; };
  const label = (el) => `${el.tagName.toLowerCase()}${el.className && typeof el.className === "string" ? "." + el.className.split(/\s+/).slice(0, 3).join(".") : ""} "${(el.textContent || "").trim().slice(0, 24)}"`;
  const root = document.documentElement;
  window.scrollTo(0, 0);
  await sleep(1200);

  // R1 no horizontal scroll
  const over = root.scrollWidth - innerWidth;
  add("R1 no horizontal overflow", "P0", over <= 0, `scrollWidth - innerWidth = ${over} at ${innerWidth}px`);

  // R2 animations only touch compositor properties
  const layoutProps = ["left", "top", "right", "bottom", "width", "height", "margin", "padding", "zIndex", "z-index"];
  const badAnims = document.getAnimations().filter((a) => a.effect?.getKeyframes && a.effect.getKeyframes().some((k) => layoutProps.some((p) => p in k))).map((a) => a.animationName || a.transitionProperty);
  add("R2 animations use transform/opacity only", "P0", badAnims.length === 0, badAnims.join(", "));

  // R3 Calm Motion class stops every running animation (and OS reduced motion does too when emulated)
  const osReduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const had = root.classList.contains("reduced-motion-mode");
  root.classList.add("reduced-motion-mode");
  await sleep(250);
  const running = document.getAnimations().filter((a) => a.playState === "running" && a.effect?.getTiming().iterations === Infinity);
  add("R3 .reduced-motion-mode stops infinite loops", "P0", running.length === 0, running.map((a) => a.animationName).join(", "));
  if (!had) root.classList.remove("reduced-motion-mode");
  if (osReduced) {
    const stillRunning = document.getAnimations().filter((a) => a.playState === "running" && a.effect?.getTiming().iterations === Infinity);
    add("R3b OS reduced motion stops infinite loops", "P0", stillRunning.length === 0, stillRunning.map((a) => a.animationName).join(", "));
  }

  // R4 at most 2 ambient loops running at once
  const loops = document.getAnimations().filter((a) => a.playState === "running" && a.effect?.getTiming().iterations === Infinity && !(a.effect.target?.className || "").toString().includes("animate-spin"));
  add("R4 at most 2 ambient loops at once", "P1", loops.length <= 2, `${loops.length} running: ${loops.map((a) => a.animationName).join(", ")}`);

  // R5 tap targets 44x44 minimum
  const small = [...document.querySelectorAll("a[href], button, [role=tab]")].filter(vis).filter((el) => { const r = el.getBoundingClientRect(); return r.width < 44 || r.height < 44; });
  add("R5 tap targets are at least 44x44", "P1", small.length === 0, small.slice(0, 6).map((el) => `${label(el)} ${Math.round(el.getBoundingClientRect().width)}x${Math.round(el.getBoundingClientRect().height)}`).join(" | "));

  // R6 every control has an accessible name
  const unnamed = [...document.querySelectorAll("a[href], button, [role=tab]")].filter(vis).filter((el) => !(el.getAttribute("aria-label") || el.textContent || "").trim() && !el.getAttribute("aria-labelledby"));
  add("R6 controls have accessible names", "P0", unnamed.length === 0, unnamed.slice(0, 5).map(label).join(" | "));

  // R7 structure
  const h1s = document.querySelectorAll("h1").length;
  const first = document.querySelector("a[href], button");
  add("R7a exactly one h1", "P1", h1s === 1, `${h1s} h1 elements`);
  add("R7b <main> landmark exists", "P0", !!document.querySelector("main"), "");
  add("R7c first focusable is a skip link to #main", "P0", first?.getAttribute("href") === "#main", first ? label(first) : "none");
  const starts = document.querySelectorAll("[data-demo='start']").length;
  add("R7d data-demo=start is unique", "P1", starts === 1, `${starts} matches`);

  // R8 reveal system: everything becomes visible after scrolling, nothing stuck at opacity 0
  const total = root.scrollHeight;
  for (let y = 0; y <= total; y += Math.max(200, innerHeight * 0.6)) { window.scrollTo(0, y); await sleep(120); }
  window.scrollTo(0, total); await sleep(500);
  const stuck = [...document.querySelectorAll("[data-reveal]")].filter((el) => getComputedStyle(el).opacity < 0.99);
  add("R8 no reveal element is stuck hidden after scrolling", "P0", stuck.length === 0, `${stuck.length} stuck: ${stuck.slice(0, 3).map(label).join(" | ")}`);
  add("R8b page uses reveal at least 6 times", "P1", document.querySelectorAll("[data-reveal]").length >= 6, `${document.querySelectorAll("[data-reveal]").length} [data-reveal] elements`);
  window.scrollTo(0, 0); await sleep(300);

  // R9 type: min size, weight cap, italics, fonts
  const textEls = [...document.querySelectorAll("body *")].filter((el) => [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim()) && vis(el));
  const tiny = textEls.filter((el) => parseFloat(getComputedStyle(el).fontSize) < 12);
  const heavy = textEls.filter((el) => Number(getComputedStyle(el).fontWeight) > 700);
  const ital = textEls.filter((el) => getComputedStyle(el).fontStyle !== "normal");
  const badFont = textEls.filter((el) => /\b(Inter|Roboto|Arial|Open Sans|Helvetica)\b/.test(getComputedStyle(el).fontFamily.split(",")[0]));
  add("R9a no text under 12px", "P1", tiny.length === 0, `${tiny.length}: ${tiny.slice(0, 4).map((e) => label(e) + " " + getComputedStyle(e).fontSize).join(" | ")}`);
  add("R9b no weight above 700", "P1", heavy.length === 0, `${heavy.length}: ${heavy.slice(0, 4).map(label).join(" | ")}`);
  add("R9c no italics", "P1", ital.length === 0, ital.slice(0, 4).map(label).join(" | "));
  add("R9d primary font is not Inter/Roboto/Arial/Open Sans/Helvetica", "P1", badFont.length === 0, badFont.slice(0, 3).map(label).join(" | "));

  // R10 no pill shaped elements that carry text or a fill
  const pills = [...document.querySelectorAll("body *")].filter(vis).filter((el) => {
    const r = el.getBoundingClientRect(); const cs = getComputedStyle(el);
    const radius = parseFloat(cs.borderTopLeftRadius);
    const filled = cs.backgroundColor !== "rgba(0, 0, 0, 0)" || parseFloat(cs.borderTopWidth) > 0;
    const hasText = (el.textContent || "").trim().length > 0;
    return filled && hasText && r.height < 80 && radius >= Math.min(r.width, r.height) / 2 - 1 && radius > 0;
  });
  add("R10 no pill badges", "P0", pills.length === 0, pills.slice(0, 5).map(label).join(" | "));

  // R11 hero mascot really scales up on large screens (inline width used to beat sm:w-[500px])
  const mascot = document.querySelector("button[aria-label*='Moyin']");
  if (mascot) { const w = mascot.getBoundingClientRect().width; add("R11 hero mascot width scales with viewport", "P1", innerWidth < 768 || w >= 480, `mascot ${Math.round(w)}px wide at ${innerWidth}px viewport (want 480 or more from 768px up)`); }
  else add("R11 hero mascot found", "P1", false, "no button with aria-label containing Moyin");

  // R12 layout shift
  let cls = 0; try { const po = new PerformanceObserver((l) => { for (const e of l.entries) if (!e.hadRecentInput) cls += e.value; }); po.observe({ type: "layout-shift", buffered: true }); await sleep(100); po.disconnect(); } catch {}
  add("R12 cumulative layout shift 0.1 or less", "P1", cls <= 0.1, `CLS ${cls.toFixed(3)}`);

  // R13 primary CTA is above the fold
  const cta = document.querySelector("[data-demo='start']");
  add("R13 primary CTA visible without scrolling", "P1", !!cta && cta.getBoundingClientRect().bottom <= innerHeight, cta ? `bottom=${Math.round(cta.getBoundingClientRect().bottom)} viewport=${innerHeight}` : "missing");

  // R14 ambient hero loops pause when hero is off screen
  window.scrollTo(0, root.scrollHeight / 2); await sleep(400);
  const heroLoops = document.getAnimations().filter((a) => a.playState === "running" && a.effect?.getTiming().iterations === Infinity && /moyin|hero/i.test(a.animationName || "") );
  add("R14 hero loops pause when scrolled away", "P1", heroLoops.length === 0, heroLoops.map((a) => a.animationName).join(", "));
  window.scrollTo(0, 0);

  const failed = out.filter((r) => !r.pass);
  console.table(out.map((r) => ({ id: r.id, pri: r.pri, result: r.pass ? "PASS" : "FAIL", detail: r.detail })));
  return { viewport: `${innerWidth}x${innerHeight}`, passed: out.length - failed.length, failed: failed.length, results: out };
})();
