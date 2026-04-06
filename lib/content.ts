/**
 * 文案集中在这里，之后要改字只改这个文件即可。
 */

/** 仅统计「输入步骤」数量（不含最后的确认页） */
export const TOTAL_INPUT_STEPS = 2;

export const nameScene = {
  heading: "Enter your username",
  sub: "",
  label: "Username",
  placeholder: "Your username",
  submitLabel: "Continue",
  emptyError: "Username can’t be empty.",
};

export const locationScene = {
  heading: "Where are you",
  sub: "",
  label: "Location",
  placeholder: "Home? Office? Somewhere else?",
  submitLabel: "Done",
  emptyError: "Location can’t be empty.",
};

/** Location 提交后 → Wordle 前的假 loading */
export const loadingScene = {
  hints: [
    "Spinning up Level 1…",
    "Calibrating six-letter chaos…",
    "Almost playable…",
  ] as const,
  durationMs: 3600,
} as const;

/** Wordle 关卡文案 — 改标题/提示只动这里 */
export const wordleLevel = {
  title: "Level 1 — Wordly",
  sub: "Six letters. Five tries. Good luck.",
  /** 不要写死答案；仅供 UI 提示长度 */
  lengthHint: "6-letter word",
  enterLabel: "ENTER",
  backspaceLabel: "⌫",
  winTitle: "Nice.",
  winSub: "Go find her for your first surprise!",
  loseTitle: "Out of tries",
  loseSub: "No peeking — have another go with five fresh guesses.",
  continueLabel: "Continue",
  retryLabel: "Try again",
} as const;

/** Level 2 — 电梯插图 + 箭头谜题；答案在 `lib/level2Ground.ts` */
export const level2Ground = {
  title: "Level 2",
  liftHint: "Tap the lift",
  puzzleHint: "Decode the arrows. One word, six letters.",
  guessLabel: "Your answer",
  guessPlaceholder: "Six letters…",
  submitLabel: "Submit",
  guessShortError: "Need all six letters.",
  guessWrong: "Not quite — look at the paths again.",
  /** Shown full-screen when `GROUND` is guessed */
  winGo: "GO!!!",
} as const;

/** Level 3 — 钨钬氩；答案在 `lib/level3Elements.ts` */
export const level3Elements = {
  title: "Level 3",
  puzzleChars: "钨钬氩",
  hintLabel: "HINT",
  /** Shown under the HINT button */
  hintSub: "Not only letters",
  hintTitle: "Hint",
  closeHintLabel: "Close",
  hintImageAlt: "Periodic table of elements (reference)",
  guessLabel: "Your answer",
  guessPlaceholder: "Four characters…",
  submitLabel: "Submit",
  guessShortError: "Need all four characters.",
  guessWrong: "Not quite — try the hint.",
  winMessage: "Nice!",
} as const;

/** 全部通关后的收尾 */
export const doneScene = {
  title: "Congratulations",
  restartLabel: "Start over",
} as const;
