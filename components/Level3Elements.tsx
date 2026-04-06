"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { level3Elements } from "@/lib/content";
import { LEVEL3_LENGTH, LEVEL3_TARGET } from "@/lib/level3Elements";
import { PrimaryButton } from "./PrimaryButton";
import { SecondaryButton } from "./SecondaryButton";

export type Level3ElementsProps = {
  onComplete: () => void;
};

function normalizeGuess(raw: string): string {
  return raw
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "");
}

export function Level3Elements({ onComplete }: Level3ElementsProps) {
  const [guess, setGuess] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [shake, setShake] = useState(false);
  const [won, setWon] = useState(false);
  const [hintOpen, setHintOpen] = useState(false);

  const submitGuess = useCallback(() => {
    const g = normalizeGuess(guess);
    if (g.length !== LEVEL3_LENGTH) {
      setError(level3Elements.guessShortError);
      return;
    }
    if (g === LEVEL3_TARGET) {
      setWon(true);
      setError(null);
      return;
    }
    setError(level3Elements.guessWrong);
    setShake(true);
    window.setTimeout(() => setShake(false), 400);
  }, [guess]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (hintOpen && e.key === "Escape") {
        e.preventDefault();
        setHintOpen(false);
        return;
      }
      if (!hintOpen && !won && e.key === "Enter") {
        e.preventDefault();
        submitGuess();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [hintOpen, won, submitGuess]);

  useEffect(() => {
    if (hintOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [hintOpen]);

  useEffect(() => {
    if (!won) return;
    const t = window.setTimeout(() => onComplete(), 1200);
    return () => window.clearTimeout(t);
  }, [won, onComplete]);

  return (
    <div className="mx-auto flex w-full max-w-md flex-col items-center bg-white px-4 py-6">
      <h1 className="text-center text-lg font-black text-[var(--ink)] sm:text-xl">
        {level3Elements.title}
      </h1>

      <p
        className="mt-10 text-center text-4xl font-semibold tracking-[0.15em] text-[var(--ink)] sm:text-5xl"
        lang="zh-Hans"
      >
        {level3Elements.puzzleChars}
      </p>

      <div className="mt-10 w-full max-w-sm">
        <SecondaryButton type="button" onClick={() => setHintOpen(true)}>
          {level3Elements.hintLabel}
        </SecondaryButton>
        <p className="mt-2 text-center text-sm text-[var(--muted)]">
          {level3Elements.hintSub}
        </p>

        <label className="mt-6 block text-sm font-semibold text-[var(--ink)]">
          {level3Elements.guessLabel}
          <input
            value={guess}
            onChange={(e) => {
              setError(null);
              const v = normalizeGuess(e.target.value).slice(0, LEVEL3_LENGTH);
              setGuess(v);
            }}
            maxLength={LEVEL3_LENGTH}
            autoCapitalize="characters"
            autoComplete="off"
            placeholder={level3Elements.guessPlaceholder}
            className={[
              "mt-2 w-full rounded-2xl border-2 border-[var(--ink)]/12 bg-white px-4 py-3.5 text-center font-mono text-xl font-bold tracking-[0.2em] outline-none ring-[var(--accent)]/30 focus:border-[var(--accent)]/50 focus:ring-4",
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
            {level3Elements.submitLabel}
          </PrimaryButton>
        </div>
      </div>

      {hintOpen ? (
        <div
          className="fixed inset-0 z-[300] flex flex-col items-center justify-center p-3 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="level3-hint-heading"
        >
          <button
            type="button"
            className="absolute inset-0 bg-black/55 backdrop-blur-[1px]"
            aria-label={level3Elements.closeHintLabel}
            onClick={() => setHintOpen(false)}
          />
          <div className="relative z-[1] flex max-h-[min(92dvh,920px)] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-[var(--ink)]/10 bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-[var(--ink)]/10 px-4 py-3">
              <h2
                id="level3-hint-heading"
                className="text-sm font-bold text-[var(--ink)]"
              >
                {level3Elements.hintTitle}
              </h2>
              <button
                type="button"
                onClick={() => setHintOpen(false)}
                className="rounded-xl px-3 py-1.5 text-sm font-semibold text-[var(--muted)] hover:bg-[var(--ink)]/[0.06] hover:text-[var(--ink)]"
              >
                {level3Elements.closeHintLabel}
              </button>
            </div>
            <div className="relative min-h-0 flex-1 overflow-auto p-3 sm:p-4">
              <div className="relative mx-auto h-[min(72dvh,720px)] w-full">
                <Image
                  src="/level3/hint.png"
                  alt={level3Elements.hintImageAlt}
                  fill
                  className="object-contain object-top"
                  sizes="(max-width: 896px) 100vw, 896px"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {won ? (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-white/92 p-4 backdrop-blur-[2px]"
          role="status"
          aria-live="polite"
        >
          <p className="animate-pop-in text-center text-3xl font-black text-[var(--accent)] sm:text-4xl">
            {level3Elements.winMessage}
          </p>
        </div>
      ) : null}
    </div>
  );
}
