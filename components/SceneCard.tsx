"use client";

import type { ReactNode } from "react";

type SceneCardProps = {
  children: ReactNode;
  className?: string;
  /** Staggered entrance for inner content */
  animate?: boolean;
};

export function SceneCard({
  children,
  className = "",
  animate = true,
}: SceneCardProps) {
  return (
    <div
      className={[
        "relative w-full max-w-md rounded-3xl border border-[var(--border)] bg-[var(--warm-card)] px-6 py-8 shadow-[0_18px_50px_-28px_rgba(26,20,16,0.35)]",
        animate ? "animate-fade-in" : "",
        className,
      ].join(" ")}
    >
      {/* subtle corner "chaos" accent */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-2 -top-2 h-10 w-10 rounded-full bg-[var(--accent)] opacity-[0.12]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-1 -left-1 h-6 w-6 rotate-12 rounded-md bg-[var(--accent-soft)] opacity-20"
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
