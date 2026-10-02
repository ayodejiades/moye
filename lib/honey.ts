/**
 * Honey Economy (SPEC.md §5.3)
 *
 * Rules:
 * - Correct work and finishing lessons earn honey drops.
 * - Variable amounts: small (3), medium (5), golden drop (12).
 * - Seeded deterministic PRNG so rewards are reproducible and unit-testable.
 * - Daily cap on honey earned (e.g. 50 drops/day); hitting it shows "Done for today".
 * - No dark patterns: no loss-framing, no fake scarcity.
 */

export interface HoneyRewardConfig {
  dailyCap: number;
  smallReward: number;
  mediumReward: number;
  goldenReward: number;
}

export const DEFAULT_HONEY_CONFIG: HoneyRewardConfig = {
  dailyCap: 50,
  smallReward: 3,
  mediumReward: 5,
  goldenReward: 12,
};

/** Simple deterministic pseudo-random number generator (Mulberry32) */
export function seededRandom(seed: number): () => number {
  let s = seed >>> 0;
  return function () {
    s = (s + 0x6D2B79F5) >>> 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export type DropType = "small" | "medium" | "golden";

export interface HoneyRewardResult {
  amount: number;
  dropType: DropType;
  capped: boolean;
  newDailyTotal: number;
  hitDailyCap: boolean;
}

export function computeHoneyReward(
  currentDailyHoney: number,
  stepSeed: number,
  config: HoneyRewardConfig = DEFAULT_HONEY_CONFIG
): HoneyRewardResult {
  // Honey drops are counted in whole drops from a zero floor: a negative or
  // fractional running total is a caller bug, and without this a balance of -5
  // grants 5 drops yet reports a total of 0. Invalid config fields fall back
  // to the defaults rather than inverting the cap math.
  const today = Number.isFinite(currentDailyHoney) ? Math.max(0, Math.floor(currentDailyHoney)) : 0;
  const safeConfig: HoneyRewardConfig = {
    dailyCap: validCap(config.dailyCap),
    smallReward: validReward(config.smallReward, DEFAULT_HONEY_CONFIG.smallReward),
    mediumReward: validReward(config.mediumReward, DEFAULT_HONEY_CONFIG.mediumReward),
    goldenReward: validReward(config.goldenReward, DEFAULT_HONEY_CONFIG.goldenReward),
  };
  if (today >= safeConfig.dailyCap) {
    return {
      amount: 0,
      dropType: "small",
      capped: true,
      newDailyTotal: safeConfig.dailyCap,
      hitDailyCap: true,
    };
  }

  const rng = seededRandom(stepSeed)();
  let baseAmount = safeConfig.smallReward;
  let dropType: DropType = "small";

  if (rng > 0.85) {
    baseAmount = safeConfig.goldenReward;
    dropType = "golden";
  } else if (rng > 0.50) {
    baseAmount = safeConfig.mediumReward;
    dropType = "medium";
  }

  const allowable = safeConfig.dailyCap - today;
  const granted = Math.min(baseAmount, allowable);
  const newTotal = today + granted;

  return {
    amount: granted,
    dropType,
    capped: granted < baseAmount,
    newDailyTotal: newTotal,
    hitDailyCap: newTotal >= safeConfig.dailyCap,
  };
}

/** A reward is a finite, non-negative whole number of drops. */
function validReward(value: number, fallback: number): number {
  return Number.isFinite(value) && value >= 0 ? Math.floor(value) : fallback;
}

/** A daily cap below 1 would end earning before it starts; fall back instead. */
function validCap(value: number): number {
  return Number.isFinite(value) && value >= 1 ? Math.floor(value) : DEFAULT_HONEY_CONFIG.dailyCap;
}

export interface HiveCosmetic {
  id: string;
  name: string;
  cost: number;
  category: "hat" | "glasses" | "scarf" | "pet" | "decor";
  description: string;
}

export const HIVE_COSMETICS: HiveCosmetic[] = [
  // Hats
  { id: "hat-acorn", name: "Acorn Cap", cost: 15, category: "hat", description: "A snug acorn cap made by forest friends." },
  { id: "hat-honey-crown", name: "Honeycomb Crown", cost: 35, category: "hat", description: "Gleams with amber royal badge honey." },
  { id: "hat-safari", name: "Explorer Sun Hat", cost: 25, category: "hat", description: "Sturdy expedition hat for uncovering dinosaur fossils." },
  { id: "hat-flower-wreath", name: "Wildflower Wreath", cost: 20, category: "hat", description: "Gentle woven crown of lavender, daisies, and golden buttercups." },
  { id: "hat-cozy-beanie", name: "Plum Pom Pom Beanie", cost: 15, category: "hat", description: "Warm knitted beanie with a fluffy amber pom pom." },
  { id: "hat-star-wizard", name: "Starlight Wizard Hat", cost: 40, category: "hat", description: "Deep indigo pointed cap sprinkled with tiny constellations." },

  // Glasses & Eyewear
  { id: "glasses-reading", name: "Round Reading Specs", cost: 20, category: "glasses", description: "Classic amber round frames with clear anti glare lenses for reading." },
  { id: "glasses-star", name: "Starlight Star Frames", cost: 30, category: "glasses", description: "Playful purple star shaped rims that sparkle with cheerful energy." },
  { id: "glasses-sunglasses", name: "Cool Honey Shades", cost: 25, category: "glasses", description: "Warm amber tinted sunglasses for bright sunny days in the meadow." },
  { id: "glasses-aviator", name: "Golden Aviator Frames", cost: 35, category: "glasses", description: "Gleaming wire frames with a double brow bar for daring adventures." },

  // Scarves & Capes
  { id: "scarf-teal", name: "Teal Knitted Scarf", cost: 20, category: "scarf", description: "Warm and cheerful, keeps Moyin cozy." },
  { id: "scarf-honey-stripe", name: "Golden Fleece Scarf", cost: 25, category: "scarf", description: "Thick honey and cream striped wrap with soft fringed ends." },
  { id: "scarf-star-cape", name: "Midnight Starlight Cape", cost: 35, category: "scarf", description: "Swishy deep plum cape clasped with a golden star button." },
  { id: "scarf-leaf-cowl", name: "Clover Leaf Cowl", cost: 18, category: "scarf", description: "Forest green woven neck cowl tucked with fresh clover leaves." },

  // Hive Pets
  { id: "pet-bee", name: "Buzz the Friendly Bee", cost: 40, category: "pet", description: "Floats happily next to Moyin while learning." },
  { id: "pet-ladybug", name: "Pip the Little Ladybug", cost: 30, category: "pet", description: "A gentle spotted friend resting softly on Moyin." },
  { id: "pet-firefly", name: "Lumi the Lantern Firefly", cost: 45, category: "pet", description: "Glows with calm amber starlight for quiet reading." },
  { id: "pet-snail", name: "Shelly the Forest Snail", cost: 25, category: "pet", description: "Takes things calm and unhurried at your own pace." },

  // Hive Decor
  { id: "decor-honeycomb-lamp", name: "Honeycomb Nightlight", cost: 30, category: "decor", description: "Casts a soothing amber glow across the hive room." },
  { id: "decor-cushion-pile", name: "Plump Lavender Beanbag", cost: 25, category: "decor", description: "An ultra soft sensory nook for peaceful lesson breaks." },
  { id: "decor-bookshelf", name: "Little Forest Bookshelf", cost: 35, category: "decor", description: "Carved oak shelf stacked with colorful picture tales." },
  { id: "decor-hologram-globe", name: "Starlight Hologram Globe", cost: 45, category: "decor", description: "A futuristic floating hologram globe spinning with constellations above the hive." },
];
