import { LEVEL_BANKS } from "../lib/lesson-bank";
import { renderQuestion, KID_NAMES } from "../lib/theme-resolver";

const seen = new Set<string>();
let templated = 0;
for (const qs of Object.values(LEVEL_BANKS)) {
  for (const q of qs) {
    const r = renderQuestion(q, "dinosaurs", "en-NG");
    if (r.prompt.includes("{kid}")) { console.log("UNFILLED", q.id); process.exit(1); }
    if (q.promptTemplate.includes("{kid}")) {
      templated++;
      const found = KID_NAMES.find((n) => r.prompt.includes(n));
      if (found) seen.add(found);
    }
    if (/—|–/.test(r.prompt + r.readAloud + r.hint)) { console.log("EMDASH", q.id); process.exit(1); }
  }
}
console.log("templated questions:", templated);
console.log("distinct names rendered:", seen.size, "->", [...seen].sort().join(", "));
const missing = KID_NAMES.filter((n) => !seen.has(n));
console.log("names not yet surfaced:", missing.length ? missing.join(", ") : "none");
