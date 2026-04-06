"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";
import { forwardRef } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  wiggle?: boolean;
  /** Subtle continuous wiggle on hover — good for the opening “do not click” trap */
  hoverWiggle?: boolean;
};

export const PrimaryButton = forwardRef<HTMLButtonElement, Props>(
  function PrimaryButton(
    { children, className = "", wiggle = false, hoverWiggle = false, ...rest },
    ref
  ) {
    return (
      <button
        ref={ref}
        type="button"
        className={[
          "inline-flex min-h-[48px] w-full items-center justify-center rounded-2xl bg-[var(--accent)] px-5 py-3 text-center text-base font-bold text-white shadow-[0_10px_0_0_rgba(180,70,45,0.9)] transition-transform active:translate-y-1 active:shadow-[0_6px_0_0_rgba(180,70,45,0.9)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] disabled:cursor-not-allowed disabled:opacity-50",
          hoverWiggle ? "hover:animate-wiggle-soft" : "",
          wiggle ? "animate-wiggle" : "",
          className,
        ].join(" ")}
        {...rest}
      >
        {children}
      </button>
    );
  }
);
