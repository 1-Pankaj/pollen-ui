"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "../lib/utils";

export type ProgressColor = "neutral" | "accent" | "success" | "warning" | "danger";
export type ProgressSize = "xs" | "sm" | "md";

export interface ProgressProps {
  /** Current value. Omit for an indeterminate bar. */
  value?: number;
  max?: number;
  size?: ProgressSize;
  color?: ProgressColor;
  /** Animated diagonal stripes over the fill. */
  striped?: boolean;
  /** Numeric readout after the bar, e.g. 62%. */
  showValue?: boolean;
  className?: string;
}

const heights = {
  xs: "h-1",
  sm: "h-1.5",
  md: "h-2.5",
} as const;

const fillColors: Record<ProgressColor, string> = {
  neutral: "bg-foreground",
  accent: "bg-accent",
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-danger",
};

/**
 * Linear progress in five status colors and three heights, with
 * optional stripes for active work and a numeric readout. The
 * fill eases to its new width; an omitted value loops forever.
 */
export function Progress({
  value,
  max = 100,
  size = "sm",
  color = "accent",
  striped,
  showValue,
  className,
}: ProgressProps) {
  const reduce = useReducedMotion();
  const indeterminate = value === undefined;
  const pct = indeterminate ? 0 : Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className={cn("flex w-full items-center gap-2.5", className)}>
      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={indeterminate ? undefined : Math.round(pct)}
        className={cn(
          "relative w-full overflow-hidden rounded-full bg-fill",
          heights[size],
        )}
      >
        <motion.div
          className={cn("relative h-full rounded-full", fillColors[color])}
          initial={false}
          animate={
            indeterminate
              ? // Reduced motion gets a still third-full bar; the
                // loop itself is the thing being turned off.
                reduce
                ? { x: "-60%" }
                : { x: ["-120%", "340%"] }
              : { width: `${pct}%` }
          }
          transition={
            indeterminate
              ? reduce
                ? { duration: 0 }
                : { repeat: Infinity, duration: 1.4, ease: "easeInOut" }
              : { duration: reduce ? 0 : 0.45, ease: [0.16, 0.84, 0.44, 1] }
          }
          style={indeterminate ? { width: "33%" } : undefined}
        >
          {striped && !indeterminate && (
            <span
              aria-hidden="true"
              className="absolute inset-0 rounded-full bg-[repeating-linear-gradient(120deg,transparent_0_6px,rgba(255,255,255,0.22)_6px_12px)]"
            />
          )}
        </motion.div>
      </div>
      {showValue && !indeterminate && (
        <span className="shrink-0 text-xs font-medium tabular-nums text-muted-foreground">
          {Math.round(pct)}%
        </span>
      )}
    </div>
  );
}
