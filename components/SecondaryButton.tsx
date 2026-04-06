"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";
import { forwardRef } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
};

export const SecondaryButton = forwardRef<HTMLButtonElement, Props>(
  function SecondaryButton({ children, className = "", ...rest }, ref) {
    return (
      <button
        ref={ref}
        type="button"
        className={[
          "inline-flex min-h-[48px] w-full items-center justify-center rounded-2xl border-2 border-[var(--ink)]/15 bg-[var(--warm-bg)] px-5 py-3 text-center text-base font-semibold text-[var(--ink)] transition-colors hover:bg-[var(--ink)]/[0.04] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ink)] disabled:cursor-not-allowed disabled:opacity-50",
          className,
        ].join(" ")}
        {...rest}
      >
        {children}
      </button>
    );
  }
);
