"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { level2Ground } from "@/lib/content";
import { LEVEL2_LENGTH, LEVEL2_TARGET } from "@/lib/level2Ground";
import { PrimaryButton } from "./PrimaryButton";

type Phase = "lift" | "zoom" | "arrows";

export type Level2GroundProps = {
  onComplete: () => void;
};

const ZOOM_MS = 620;

/** Compact image width — tweak for “slightly smaller” */
const LIFT_MAX_W = "max-w-[260px] sm:max-w-[300px]";
const ARROWS_MAX_W = "max-w-[300px] sm:max-w-[340px]";

export function Level2Ground({ onComplete }: Level2GroundProps) {
  const [phase, setPhase] = useState<Phase>("lift");
  const [guess, setGuess] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [shake, setShake] = useState(false);
  const [won, setWon] = useState(false);

  useEffect(() => {
    if (phase !== "zoom") return;
    const t = window.setTimeout(() => setPhase("arrows"), ZOOM_MS);
    return () => window.clearTimeout(t);
  }, [phase]);

  const onLiftActivate = useCallback(() => {
    if (phase !== "lift") return;
    setPhase("zoom");
  }, [phase]);

  const submitGuess = useCallback(() => {
    const g = guess.trim().toUpperCase();
    if (g.length !== LEVEL2_LENGTH) {
      setError(level2Ground.guessShortError);
      return;
    }
    if (g === LEVEL2_TARGET) {
      setWon(true);
      setError(null);
      return;
    }
    setError(level2Ground.guessWrong);
    setShake(true);
    window.setTimeout(() => setShake(false), 400);
  }, [guess]);

  useEffect(() => {
    if (phase !== "arrows") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        submitGuess();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase, submitGuess]);

  useEffect(() => {
    if (!won) return;
    const t = window.setTimeout(() => onComplete(), 1600);
    return () => window.clearTimeout(t);
  }, [won, onComplete]);

  return (
    <div className="mx-auto flex w-full max-w-md flex-col items-center bg-white px-4 py-6">
      {(phase === "lift" || phase === "zoom") && (
        <div className="flex w-full flex-col items-center gap-4">
          <h1 className="text-center text-lg font-black tracking-tight text-[var(--ink)] sm:text-xl">
            {level2Ground.title}
          </h1>

          <div
            className={[
              "relative w-full origin-center rounded-2xl transition-all duration-500 ease-out",
              LIFT_MAX_W,
              phase === "zoom"
                ? "scale-110 shadow-lg ring-2 ring-[var(--accent)]/25 sm:scale-[1.18]"
                : "scale-100",
            ].join(" ")}
          >
            <div
              className={[
                "relative mx-auto aspect-[4/5] w-full",
                phase === "zoom" ? "bg-white" : "",
              ].join(" ")}
            >
              <Image
                src="/level2/lift.png"
                alt="Elevator"
                fill
                sizes="(max-width: 640px) 260px, 300px"
                className="object-contain object-center"
                priority
              />
            </div>
            <button
              type="button"
              onClick={onLiftActivate}
              disabled={phase !== "lift"}
              aria-label="Open elevator"
              className={[
                "absolute inset-0 z-[1] rounded-2xl outline-none focus-visible:ring-4 focus-visible:ring-[var(--accent)]/50 disabled:cursor-default",
                phase !== "lift" ? "pointer-events-none" : "cursor-pointer",
              ].join(" ")}
            />
          </div>
        </div>
      )}

      {phase === "arrows" && (
        <div className="animate-fade-in flex w-full flex-col items-center gap-5">
          <h1 className="text-center text-lg font-black text-[var(--ink)] sm:text-xl">
            {level2Ground.title}
          </h1>

          <div
            className={[
              "relative w-full",
              ARROWS_MAX_W,
              "aspect-[6/5] sm:aspect-[12/7]",
            ].join(" ")}
          >
            <Image
              src="/level2/arrows.png"
              alt="Arrow puzzle"
              fill
              sizes="(max-width: 640px) 300px, 340px"
              className="object-contain object-center"
            />
          </div>

          <div className="w-full max-w-sm">
            <label className="block text-sm font-semibold text-[var(--ink)]">
              {level2Ground.guessLabel}
              <input
                value={guess}
                onChange={(e) => {
                  setError(null);
                  const v = e.target.value
                    .toUpperCase()
                    .replace(/[^A-Z]/g, "")
                    .slice(0, LEVEL2_LENGTH);
                  setGuess(v);
                }}
                maxLength={LEVEL2_LENGTH}
                autoCapitalize="characters"
                autoComplete="off"
                placeholder={level2Ground.guessPlaceholder}
                className={[
                  "mt-2 w-full rounded-2xl border-2 border-[var(--ink)]/12 bg-white px-4 py-3.5 text-center font-mono text-xl font-bold tracking-[0.35em] outline-none ring-[var(--accent)]/30 focus:border-[var(--accent)]/50 focus:ring-4",
                  shake ? "animate-shake" : "",
                ].join(" ")}
              />
            </label>
            {error ? (
              <p className="mt-2 text-center text-sm font-medium text-[var(--accent)]">
                {error}
              </p>
            ) : null}
            <div className="mt-4">
              <PrimaryButton onClick={submitGuess}>
                {level2Ground.submitLabel}
              </PrimaryButton>
            </div>
          </div>
        </div>
      )}

      {won ? (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-white/92 p-4 backdrop-blur-[2px]"
          role="presentation"
        >
          <p
            id="level2-win-go"
            role="status"
            aria-live="polite"
            className="animate-pop-in text-center text-5xl font-black tracking-tight text-[var(--accent)] drop-shadow-sm sm:text-6xl"
          >
            {level2Ground.winGo}
          </p>
        </div>
      ) : null}
    </div>
  );
}
