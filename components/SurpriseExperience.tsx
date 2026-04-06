"use client";

import { useCallback, useMemo, useState } from "react";
import {
  doneScene,
  loadingScene,
  locationScene,
  nameScene,
  TOTAL_INPUT_STEPS,
} from "@/lib/content";
import { FakeLoadingScreen } from "./FakeLoadingScreen";
import { PrimaryButton } from "./PrimaryButton";
import { ProgressIndicator } from "./ProgressIndicator";
import { SceneCard } from "./SceneCard";
import { SecondaryButton } from "./SecondaryButton";
import { Level2Ground } from "./Level2Ground";
import { Level3Elements } from "./Level3Elements";
import { WordlyLevel } from "./WordlyLevel";

type Step =
  | "name"
  | "location"
  | "loading"
  | "wordle"
  | "level2"
  | "level3"
  | "done";

function displayName(raw: string): string {
  const t = raw.trim();
  return t.length ? t : "friend";
}

export function SurpriseExperience() {
  const [step, setStep] = useState<Step>("name");
  const [name, setName] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [locationInput, setLocationInput] = useState("");
  const [nameError, setNameError] = useState<string | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);

  const friendly = useMemo(() => displayName(name), [name]);

  const resetAll = useCallback(() => {
    setStep("name");
    setName("");
    setNameInput("");
    setLocationInput("");
    setNameError(null);
    setLocationError(null);
  }, []);

  const progressCurrent = step === "name" ? 1 : step === "location" ? 2 : 2;
  const showInputProgress = step === "name" || step === "location";

  return (
    <main className="mx-auto flex min-h-dvh max-w-lg flex-col px-4 pb-10 pt-8">
      {showInputProgress ? (
        <header className="mb-5">
          <ProgressIndicator
            current={progressCurrent}
            total={TOTAL_INPUT_STEPS}
          />
        </header>
      ) : null}

      <div className="flex flex-1 flex-col items-center justify-center">
        {step === "name" && (
          <SceneCard>
            <h1 className="text-balance text-2xl font-extrabold text-[var(--ink)]">
              {nameScene.heading}
            </h1>
            {nameScene.sub ? (
              <p className="mt-2 text-sm text-[var(--muted)]">{nameScene.sub}</p>
            ) : null}
            <label className="mt-6 block text-sm font-semibold text-[var(--ink)]">
              {nameScene.label}
              <input
                value={nameInput}
                onChange={(e) => {
                  setNameInput(e.target.value);
                  setNameError(null);
                }}
                placeholder={nameScene.placeholder}
                autoComplete="username"
                className="mt-2 w-full rounded-2xl border-2 border-[var(--ink)]/10 bg-[var(--warm-bg)] px-4 py-3 text-base outline-none ring-[var(--accent)]/40 placeholder:text-[var(--muted)]/70 focus:border-[var(--accent)]/60 focus:ring-4"
              />
            </label>
            {nameError ? (
              <p className="mt-2 text-sm font-medium text-[var(--accent)]">
                {nameError}
              </p>
            ) : null}
            <div className="mt-8">
              <PrimaryButton
                onClick={() => {
                  if (!nameInput.trim()) {
                    setNameError(nameScene.emptyError);
                    return;
                  }
                  setName(nameInput.trim());
                  setStep("location");
                }}
              >
                {nameScene.submitLabel}
              </PrimaryButton>
            </div>
          </SceneCard>
        )}

        {step === "location" && (
          <SceneCard>
            <h1 className="text-balance text-2xl font-extrabold text-[var(--ink)]">
              {locationScene.heading}
            </h1>
            {locationScene.sub ? (
              <p className="mt-2 text-sm text-[var(--muted)]">
                {locationScene.sub}
              </p>
            ) : null}
            <p className="mt-3 rounded-2xl bg-[var(--ink)]/[0.03] px-4 py-3 text-sm font-semibold text-[var(--ink)]">
              <span className="text-[var(--accent)]">{friendly}</span>, next
              step.
            </p>
            <label className="mt-5 block text-sm font-semibold text-[var(--ink)]">
              {locationScene.label}
              <input
                value={locationInput}
                onChange={(e) => {
                  setLocationInput(e.target.value);
                  setLocationError(null);
                }}
                placeholder={locationScene.placeholder}
                className="mt-2 w-full rounded-2xl border-2 border-[var(--ink)]/10 bg-[var(--warm-bg)] px-4 py-3 text-base outline-none ring-[var(--accent)]/40 placeholder:text-[var(--muted)]/70 focus:border-[var(--accent)]/60 focus:ring-4"
              />
            </label>
            {locationError ? (
              <p className="mt-2 text-sm font-medium text-[var(--accent)]">
                {locationError}
              </p>
            ) : null}
            <div className="mt-8">
              <PrimaryButton
                onClick={() => {
                  if (!locationInput.trim()) {
                    setLocationError(locationScene.emptyError);
                    return;
                  }
                  setStep("loading");
                }}
              >
                {locationScene.submitLabel}
              </PrimaryButton>
            </div>
          </SceneCard>
        )}

        {step === "loading" && (
          <SceneCard animate={false}>
            <h1 className="text-xl font-extrabold text-[var(--ink)]">
              Loading…
            </h1>
            <p className="mt-2 text-sm text-[var(--muted)]">
              Level 1 is about to get wordy.
            </p>
            <div className="mt-6">
              <FakeLoadingScreen
                messages={loadingScene.hints}
                durationMs={loadingScene.durationMs}
                onLoadComplete={() => setStep("wordle")}
              />
            </div>
          </SceneCard>
        )}

        {step === "wordle" && (
          <div className="w-full max-w-lg">
            <WordlyLevel onComplete={() => setStep("level2")} />
          </div>
        )}

        {step === "level2" && (
          <div className="w-full max-w-lg">
            <Level2Ground onComplete={() => setStep("level3")} />
          </div>
        )}

        {step === "level3" && (
          <div className="w-full max-w-lg">
            <Level3Elements onComplete={() => setStep("done")} />
          </div>
        )}

        {step === "done" && (
          <SceneCard animate={false}>
            <h1 className="text-balance text-center text-2xl font-extrabold text-[var(--ink)] sm:text-3xl">
              {doneScene.title}
            </h1>
            <div className="mt-10">
              <SecondaryButton onClick={resetAll}>
                {doneScene.restartLabel}
              </SecondaryButton>
            </div>
          </SceneCard>
        )}
      </div>
    </main>
  );
}
