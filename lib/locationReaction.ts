/**
 * Humor-only helper: maps rough keywords in free-text location to a roast line.
 * Story flow never branches on this — always the same next scene.
 */

export type LocationCategory =
  | "home"
  | "office"
  | "nadayu"
  | "default";

const reactions: Record<LocationCategory, string[]> = {
  home: [
    "Classic. Floor grout level: unknown. Snack inventory: suspicious.",
    "Ah, rumah energy. If your chair has an imprint, that’s a personality trait now.",
    "House? Bold of you to admit you’re horizontally aligned today.",
  ],
  office: [
    "Work? On your last day arc? The drama. The Excel.",
    "Office mode activated. Pretend to look busy for no one. Iconic.",
    "Company property, employee feelings — all temporarily yours. Cute.",
  ],
  nadayu: [
    "Nadayu? Instantly plotting parking luck. Good luck soldier.",
    "That’s a very specific postcode of chaos. Respect.",
    "If the guard asks, you’re “going to see a friend.” Not wrong.",
  ],
  default: [
    "Somewhere chaotic. I respect the ambiguity.",
    "That location sounds made up. Perfect. I’ll allow it.",
    "Okay mysterious. Are you in a stairwell? A bush? A meeting you muted?",
  ],
};

const HOME_KEYS = ["home", "rumah", "house", "ruma", "apartment", "apt", "condo"];
const OFFICE_KEYS = ["office", "work", "company", "desk", "hq", "wfh"];
const NADAYU_KEYS = ["nadayu"];

function normalize(input: string): string {
  return input.trim().toLowerCase();
}

function detectCategory(normalized: string): LocationCategory {
  if (NADAYU_KEYS.some((k) => normalized.includes(k))) return "nadayu";
  if (HOME_KEYS.some((k) => normalized.includes(k))) return "home";
  if (OFFICE_KEYS.some((k) => normalized.includes(k))) return "office";
  return "default";
}

function pickStable<T>(items: readonly T[], seed: string): T {
  if (items.length === 0) throw new Error("reaction list empty");
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return items[h % items.length]!;
}

/**
 * @param rawLocation Whatever the user typed; never used for real navigation logic.
 */
export function getLocationReaction(rawLocation: string): {
  category: LocationCategory;
  line: string;
} {
  const normalized = normalize(rawLocation);
  if (!normalized) {
    return {
      category: "default",
      line: "Blank location? Zen. Or lazy. Both are on brand.",
    };
  }
  const category = detectCategory(normalized);
  const pool = reactions[category];
  return { category, line: pickStable(pool, normalized) };
}
