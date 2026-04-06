/** Level 1 答案 — 改关卡时只动这里 */
export const WORDLE_TARGET = "JOANNE";

export const WORDLE_LENGTH = WORDLE_TARGET.length;
export const WORDLE_MAX_ATTEMPTS = 5;

export type TileState = "empty" | "tbd" | "correct" | "present" | "absent";

/** Wordle 规则：先标绿并扣库存，再标黄，剩余为灰（重复字母与常见 Wordle 一致）。 */
export function scoreGuess(
  secretRaw: string,
  guessRaw: string
): TileState[] {
  const secret = secretRaw.toUpperCase();
  const guess = guessRaw.toUpperCase();
  const n = secret.length;
  const res: TileState[] = Array.from({ length: n }, () => "absent");
  const remaining = new Map<string, number>();

  for (const ch of secret) {
    remaining.set(ch, (remaining.get(ch) ?? 0) + 1);
  }

  for (let i = 0; i < n; i++) {
    if (guess[i] === secret[i]) {
      res[i] = "correct";
      const c = guess[i]!;
      remaining.set(c, (remaining.get(c) ?? 1) - 1);
    }
  }

  for (let i = 0; i < n; i++) {
    if (res[i] === "correct") continue;
    const c = guess[i]!;
    const left = remaining.get(c) ?? 0;
    if (left > 0) {
      res[i] = "present";
      remaining.set(c, left - 1);
    }
  }

  return res;
}

export function updateKeyStates(
  prev: Map<string, "correct" | "present" | "absent">,
  guess: string,
  scores: TileState[]
): Map<string, "correct" | "present" | "absent"> {
  const next = new Map(prev);
  const g = guess.toUpperCase();
  for (let i = 0; i < g.length; i++) {
    const letter = g[i]!;
    const s = scores[i];
    if (s === "empty" || s === "tbd") continue;
    const rank = (x: string) =>
      x === "correct" ? 2 : x === "present" ? 1 : 0;
    const mapped: "correct" | "present" | "absent" =
      s === "correct" ? "correct" : s === "present" ? "present" : "absent";
    const old = next.get(letter);
    if (!old || rank(mapped) > rank(old)) next.set(letter, mapped);
  }
  return next;
}
