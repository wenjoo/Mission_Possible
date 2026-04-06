"use client";

import { useEffect, useRef, useState } from "react";

type FakeLoadingScreenProps = {
  messages: readonly string[];
  /** Total fake duration in ms */
  durationMs?: number;
  /** Fired once when the progress bar reaches 100% */
  onLoadComplete: () => void;
};

/**
 * Visual-only loading bar + cycling status text. Does not render the final “result” line;
 * the parent scene should show that + the primary button after `onLoadComplete`.
 */
export function FakeLoadingScreen({
  messages,
  durationMs = 5200,
  onLoadComplete,
}: FakeLoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [msgIndex, setMsgIndex] = useState(0);
  const doneRef = useRef(false);
  const onDoneRef = useRef(onLoadComplete);
  onDoneRef.current = onLoadComplete;

  useEffect(() => {
    setProgress(0);
    setMsgIndex(0);
    doneRef.current = false;

    let cancelled = false;
    let raf = 0;
    const start = performance.now();

    const tick = (now: number) => {
      if (cancelled) return;

      const t = Math.min(1, (now - start) / durationMs);
      setProgress(Math.round(t * 100));

      const nextIdx = Math.min(
        messages.length - 1,
        Math.floor(t * messages.length)
      );
      setMsgIndex(nextIdx);

      if (t < 1) {
        raf = requestAnimationFrame(tick);
      } else if (!doneRef.current) {
        doneRef.current = true;
        onDoneRef.current();
      }
    };

    raf = requestAnimationFrame(tick);
    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
    };
  }, [durationMs, messages]);

  return (
    <div className="space-y-5">
      <div
        className="h-3 w-full overflow-hidden rounded-full bg-[var(--ink)]/10"
        role="progressbar"
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full rounded-full bg-gradient-to-r from-[var(--accent-soft)] to-[var(--accent)] transition-[width] duration-150 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="min-h-[3.5rem] text-pretty text-[var(--muted)] animate-pulse">
        {messages[msgIndex]}
      </p>
    </div>
  );
}
