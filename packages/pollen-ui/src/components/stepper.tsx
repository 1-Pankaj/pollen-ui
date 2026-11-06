"use client";

import { useCallback, useEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { IconMinus as Minus, IconPlus as Plus } from "../icons";
import { cn } from "../lib/utils";

export type StepperSize = "sm" | "md" | "lg";

export interface StepperProps {
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  min?: number;
  max?: number;
  /** Amount added or removed per press. Default 1. */
  step?: number;
  size?: StepperSize;
  /** Accessible name, announced with the value. Default "Stepper". */
  "aria-label"?: string;
  disabled?: boolean;
  className?: string;
}

const sizeStyles: Record<
  StepperSize,
  { track: string; end: string; value: string }
> = {
  sm: { track: "h-8", end: "h-8 w-8", value: "text-[13px] w-10" },
  md: { track: "h-10", end: "h-10 w-10", value: "text-[14.5px] w-12" },
  lg: { track: "h-12", end: "h-12 w-12", value: "text-base w-14" },
};

/**
 * The plus/minus quantity control the platform trained every thumb
 * on: an inset track, two tappable ends, the value in the middle,
 * and ends that grey out at min and max instead of clicking
 * emptily. The count bumps with a tiny scale spring on every
 * change so the eye can track repeated taps.
 *
 * Accessibility follows the number-input convention: the track is
 * a role="spinbutton" - focus it and use the arrow keys; the value
 * is announced as it changes. The two ends are pointer
 * conveniences, hidden from assistive tech so the control is one
 * stop, not three.
 */
export function Stepper({
  value: controlled,
  defaultValue = 0,
  onValueChange,
  min = 0,
  max = 99,
  step = 1,
  size = "md",
  "aria-label": ariaLabel = "Stepper",
  disabled = false,
  className,
}: StepperProps) {
  const [uncontrolled, setUncontrolled] = useState(
    Math.min(max, Math.max(min, defaultValue)),
  );
  const value = controlled !== undefined ? Math.min(max, Math.max(min, controlled)) : uncontrolled;
  const locked = disabled === true;
  const reduce = useReducedMotion();
  const bumpKey = useRef(0);

  const clamp = useCallback((v: number) => Math.min(max, Math.max(min, v)), [min, max]);

  const apply = (next: number) => {
    const clamped = clamp(next);
    if (clamped === value) return;
    if (controlled === undefined) setUncontrolled(clamped);
    onValueChange?.(clamped);
  };

  const atMin = value <= min;
  const atMax = value >= max;

  const onKeyDown = (e: ReactKeyboardEvent) => {
    if (locked) return;
    if (e.key === "ArrowUp" || e.key === "ArrowRight") {
      e.preventDefault();
      apply(value + step);
    } else if (e.key === "ArrowDown" || e.key === "ArrowLeft") {
      e.preventDefault();
      apply(value - step);
    } else if (e.key === "Home") {
      e.preventDefault();
      apply(min);
    } else if (e.key === "End") {
      e.preventDefault();
      apply(max);
    }
  };

  const s = sizeStyles[size];

  return (
    <div
      role="spinbutton"
      tabIndex={locked ? -1 : 0}
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={value}
      aria-valuetext={String(value)}
      aria-label={ariaLabel}
      aria-disabled={locked || undefined}
      onKeyDown={onKeyDown}
      data-focus-ring=""
      className={cn(
        "inline-flex select-none items-center overflow-hidden rounded-xl bg-fill",
        s.track,
        locked ? "opacity-55" : "focus-visible:ring-2 focus-visible:ring-[var(--pollen-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent",
        className,
      )}
    >
      <button
        type="button"
        tabIndex={-1}
        aria-hidden="true"
        disabled={locked || atMin}
        onClick={() => apply(value - step)}
        className={cn(
          "flex items-center justify-center text-foreground transition-colors",
          s.end,
          atMin ? "cursor-not-allowed text-faint" : "hover:bg-fill-strong active:bg-fill-strong/80",
        )}
      >
        <Minus className="h-3.5 w-3.5" />
      </button>
      <span className={cn("text-center font-semibold tabular-nums text-foreground", s.value)}>
        <motion.span
          key={value}
          className="inline-block"
          initial={reduce ? false : { scale: 0.86 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 400, damping: 32 }}
        >
          {value}
        </motion.span>
      </span>
      <button
        type="button"
        tabIndex={-1}
        aria-hidden="true"
        disabled={locked || atMax}
        onClick={() => apply(value + step)}
        className={cn(
          "flex items-center justify-center text-foreground transition-colors",
          s.end,
          atMax ? "cursor-not-allowed text-faint" : "hover:bg-fill-strong active:bg-fill-strong/80",
        )}
      >
        <Plus className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

Stepper.displayName = "Stepper";
