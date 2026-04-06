"use client";

import { useEffect, useRef, useState } from "react";

type TextRevealProps = {
  lines: string[];
  /** ms per character */
  speedMs?: number;
  /** ms pause after each full line */
  linePauseMs?: number;
  className?: string;
  lineClassName?: string;
  onComplete?: () => void;
};

export function TextReveal({
  lines,
  speedMs = 22,
  linePauseMs = 420,
  className = "",
  lineClassName = "",
  onComplete,
}: TextRevealProps) {
  const [lineIndex, setLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [showCaret, setShowCaret] = useState(true);
  const doneRef = useRef(false);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    setLineIndex(0);
    setCharIndex(0);
    setShowCaret(true);
    doneRef.current = false;
  }, [lines]);

  useEffect(() => {
    if (lines.length === 0) {
      if (!doneRef.current) {
        doneRef.current = true;
        onCompleteRef.current?.();
      }
      return;
    }

    const current = lines[lineIndex];
    if (!current) return;

    if (charIndex < current.length) {
      const t = window.setTimeout(() => setCharIndex((c) => c + 1), speedMs);
      return () => clearTimeout(t);
    }

    if (lineIndex < lines.length - 1) {
      const t = window.setTimeout(() => {
        setLineIndex((i) => i + 1);
        setCharIndex(0);
      }, linePauseMs);
      return () => clearTimeout(t);
    }

    if (!doneRef.current) {
      doneRef.current = true;
      setShowCaret(false);
      onCompleteRef.current?.();
    }
  }, [charIndex, lineIndex, linePauseMs, lines, speedMs]);

  return (
    <div className={["space-y-3", className].join(" ")}>
      {lines.map((line, i) => {
        const isPast = i < lineIndex;
        const isCurrent = i === lineIndex;
        if (!isPast && !isCurrent) return null;
        const visible = isPast ? line : line.slice(0, charIndex);
        return (
          <p
            key={`${i}-${line}`}
            className={[
              "text-pretty text-lg leading-snug text-[var(--ink)]",
              lineClassName,
            ].join(" ")}
          >
            {visible}
            {isCurrent && showCaret && charIndex < line.length ? (
              <span className="ml-0.5 inline-block h-4 w-0.5 translate-y-0.5 animate-pulse bg-[var(--accent)] align-middle" />
            ) : null}
          </p>
        );
      })}
    </div>
  );
}
