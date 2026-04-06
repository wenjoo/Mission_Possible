"use client";

/**
 * Level 1 — Wordly（6 格 × 最多 5 行）
 * 改答案与次数：`lib/wordle.ts` 的 WORDLE_TARGET / WORDLE_MAX_ATTEMPTS
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { wordleLevel } from "@/lib/content";
import {
  scoreGuess,
  updateKeyStates,
  WORDLE_LENGTH,
  WORDLE_MAX_ATTEMPTS,
  WORDLE_TARGET,
  type TileState,
} from "@/lib/wordle";
import { PrimaryButton } from "./PrimaryButton";

const ROWS = WORDLE_MAX_ATTEMPTS;
const COLS = WORDLE_LENGTH;

const KEYBOARD_ROWS = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "BACK"],
] as const;

type KeyStatus = "correct" | "present" | "absent" | "default";

function tileClass(state: TileState, rowFilled: boolean): string {
  const base =
    "flex aspect-square w-full max-w-[3.25rem] items-center justify-center rounded-md border-2 text-lg font-black uppercase tabular-nums sm:text-xl";

  if (state === "empty" || state === "tbd") {
    return `${base} border-[var(--ink)]/18 bg-[var(--warm-card)] text-[var(--ink)] ${
      rowFilled ? "border-[var(--ink)]/35" : ""
    }`;
  }

  if (state === "correct") {
    return `${base} border-[#2f9d5c] bg-[#2f9d5c] text-white shadow-[inset_0_-2px_0_rgba(0,0,0,0.12)]`;
  }
  if (state === "present") {
    return `${base} border-[#d4a017] bg-[#c9a227] text-white shadow-[inset_0_-2px_0_rgba(0,0,0,0.12)]`;
  }
  return `${base} border-[#6b7280] bg-[#6b7280] text-white shadow-[inset_0_-2px_0_rgba(0,0,0,0.12)]`;
}

function keyCapClass(status: KeyStatus, wide?: boolean): string {
  const wideCls = wide ? "min-w-[3rem] flex-1 px-2 sm:min-w-[4.25rem]" : "min-w-[1.85rem] flex-1 sm:min-w-9";
  const base = `flex items-center justify-center rounded-md py-3 text-xs font-bold uppercase tracking-tight transition-colors sm:py-3.5 sm:text-sm ${wideCls}`;

  if (status === "correct") return `${base} bg-[#2f9d5c] text-white`;
  if (status === "present") return `${base} bg-[#c9a227] text-white`;
  if (status === "absent") return `${base} bg-[#6b7280] text-white`;
  return `${base} border border-[var(--ink)]/12 bg-[var(--warm-bg)] text-[var(--ink)] active:bg-[var(--ink)]/10`;
}

export type WordlyLevelProps = {
  /** 不传则用 `WORDLE_TARGET` */
  targetWord?: string;
  onComplete: (won: boolean) => void;
};

export function WordlyLevel({
  targetWord = WORDLE_TARGET,
  onComplete,
}: WordlyLevelProps) {
  const target = useMemo(() => targetWord.toUpperCase(), [targetWord]);
  const currentRef = useRef("");
  const [submitted, setSubmitted] = useState<string[]>([]);
  const [scores, setScores] = useState<TileState[][]>([]);
  const [current, setCurrent] = useState("");
  const [keyStates, setKeyStates] = useState<
    Map<string, "correct" | "present" | "absent">
  >(() => new Map());
  const [ended, setEnded] = useState<"play" | "won" | "lost">("play");

  const rowIndex = submitted.length;
  const gameLocked = ended !== "play";

  const reset = useCallback(() => {
    setSubmitted([]);
    setScores([]);
    setCurrent("");
    currentRef.current = "";
    setKeyStates(new Map());
    setEnded("play");
  }, []);

  useEffect(() => {
    if (ended === "play") return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [ended]);

  const submitGuess = useCallback(() => {
    if (gameLocked) return;
    const live = currentRef.current;
    if (live.length !== COLS) return;
    const guess = live.toUpperCase();
    const rowScore = scoreGuess(target, guess);
    const nextLen = submitted.length + 1;
    setSubmitted((s) => [...s, guess]);
    setScores((s) => [...s, rowScore]);
    setKeyStates((ks) => updateKeyStates(ks, guess, rowScore));
    setCurrent("");
    currentRef.current = "";

    if (guess === target) setEnded("won");
    else if (nextLen >= ROWS) setEnded("lost");
  }, [gameLocked, submitted.length, target]);

  const onKey = useCallback(
    (key: string) => {
      if (gameLocked) return;
      if (key === "ENTER") {
        submitGuess();
        return;
      }
      if (key === "BACK") {
        setCurrent((c) => {
          const n = c.slice(0, -1);
          currentRef.current = n;
          return n;
        });
        return;
      }
      if (key.length === 1 && /^[A-Z]$/.test(key)) {
        setCurrent((c) => {
          if (c.length >= COLS) return c;
          const n = (c + key).slice(0, COLS);
          currentRef.current = n;
          return n;
        });
      }
    },
    [gameLocked, submitGuess]
  );

  useEffect(() => {
    currentRef.current = current;
  }, [current]);

  useEffect(() => {
    const onPhys = (e: KeyboardEvent) => {
      if (gameLocked) return;
      const k = e.key;
      if (k === "Enter") {
        e.preventDefault();
        submitGuess();
        return;
      }
      if (k === "Backspace") {
        e.preventDefault();
        setCurrent((c) => {
          const n = c.slice(0, -1);
          currentRef.current = n;
          return n;
        });
        return;
      }
      if (/^[a-zA-Z]$/.test(k)) {
        if (currentRef.current.length >= COLS) return;
        e.preventDefault();
        setCurrent((c) => {
          const n = (c + k.toUpperCase()).slice(0, COLS);
          currentRef.current = n;
          return n;
        });
      }
    };
    window.addEventListener("keydown", onPhys);
    return () => window.removeEventListener("keydown", onPhys);
  }, [gameLocked, submitGuess]);

  const gridRows = useMemo(() => {
    const out: { letters: string; states: TileState[] }[] = [];
    for (let r = 0; r < ROWS; r++) {
      if (r < submitted.length) {
        const letters = submitted[r] ?? "";
        const states = scores[r] ?? [];
        out.push({
          letters: letters.padEnd(COLS, " "),
          states,
        });
      } else if (r === rowIndex) {
        const letters = current.padEnd(COLS, " ");
        const states: TileState[] = Array.from({ length: COLS }, (_, i) =>
          i < current.length ? "tbd" : "empty"
        );
        out.push({ letters, states });
      } else {
        out.push({
          letters: " ".repeat(COLS),
          states: Array.from({ length: COLS }, () => "empty"),
        });
      }
    }
    return out;
  }, [current, rowIndex, scores, submitted]);

  const keyStatus = useCallback(
    (ch: string): KeyStatus => {
      const s = keyStates.get(ch);
      if (s === "correct" || s === "present" || s === "absent") return s;
      return "default";
    },
    [keyStates]
  );

  return (
    <div className="relative mx-auto flex w-full max-w-md flex-col gap-6">
      <header className="text-center">
        <h1 className="text-xl font-black tracking-tight text-[var(--ink)] sm:text-2xl">
          {wordleLevel.title}
        </h1>
        <p className="mt-1 text-sm text-[var(--muted)]">{wordleLevel.sub}</p>
        <p className="mt-0.5 text-xs font-medium uppercase tracking-wide text-[var(--muted)]">
          {wordleLevel.lengthHint}
        </p>
      </header>

      <div
        className="grid w-full gap-2 px-1"
        style={{ gridTemplateRows: `repeat(${ROWS}, minmax(0, 1fr))` }}
        role="grid"
        aria-label="Word guesses"
      >
        {gridRows.map((row, ri) => (
          <div
            key={ri}
            className="mx-auto grid w-full max-w-[22.5rem] gap-1.5 sm:gap-2"
            style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))` }}
            role="row"
          >
            {Array.from({ length: COLS }, (_, ci) => {
              const ch = row.letters[ci] ?? " ";
              const st = row.states[ci] ?? "empty";
              const showChar = ch.trim() !== "";
              return (
                <div
                  key={ci}
                  role="gridcell"
                  className={tileClass(
                    st,
                    ri === rowIndex && Boolean(current.length)
                  )}
                >
                  {showChar ? ch : ""}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <div
        className="flex w-full flex-col gap-2 pb-2"
        style={gameLocked ? { opacity: 0.4, pointerEvents: "none" } : undefined}
        aria-hidden={gameLocked}
      >
        {KEYBOARD_ROWS.map((row, ri) => (
          <div key={ri} className="flex w-full justify-center gap-1 sm:gap-1.5">
            {row.map((k) => {
              if (k === "ENTER") {
                return (
                  <button
                    key={k}
                    type="button"
                    className={keyCapClass("default", true)}
                    onClick={() => onKey("ENTER")}
                  >
                    {wordleLevel.enterLabel}
                  </button>
                );
              }
              if (k === "BACK") {
                return (
                  <button
                    key={k}
                    type="button"
                    className={keyCapClass("default", true)}
                    onClick={() => onKey("BACK")}
                  >
                    {wordleLevel.backspaceLabel}
                  </button>
                );
              }
              return (
                <button
                  key={k}
                  type="button"
                  className={keyCapClass(keyStatus(k))}
                  onClick={() => onKey(k)}
                >
                  {k}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {ended === "won" ? (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-[var(--ink)]/45 p-4 backdrop-blur-[3px]"
          role="presentation"
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="wordly-win-title"
            className="animate-pop-in w-full max-w-sm rounded-3xl border border-[var(--border)] bg-[var(--warm-card)] px-6 py-7 text-center shadow-[0_24px_60px_-20px_rgba(26,20,16,0.45)]"
          >
            <p
              id="wordly-win-title"
              className="text-lg font-extrabold text-[var(--ink)] sm:text-xl"
            >
              {wordleLevel.winTitle}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
              {wordleLevel.winSub}
            </p>
            <div className="mt-6">
              <PrimaryButton onClick={() => onComplete(true)}>
                {wordleLevel.continueLabel}
              </PrimaryButton>
            </div>
          </div>
        </div>
      ) : null}

      {ended === "lost" ? (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-[var(--ink)]/45 p-4 backdrop-blur-[3px]"
          role="presentation"
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="wordly-lose-title"
            className="animate-pop-in w-full max-w-sm rounded-3xl border border-[var(--border)] bg-[var(--warm-card)] px-6 py-7 text-center shadow-[0_24px_60px_-20px_rgba(26,20,16,0.45)]"
          >
            <p
              id="wordly-lose-title"
              className="text-lg font-extrabold text-[var(--ink)] sm:text-xl"
            >
              {wordleLevel.loseTitle}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
              {wordleLevel.loseSub}
            </p>
            <div className="mt-6">
              <PrimaryButton onClick={reset}>{wordleLevel.retryLabel}</PrimaryButton>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
