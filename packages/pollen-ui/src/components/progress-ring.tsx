"use client";

import { useId, type ReactNode } from "react";
import { cn } from "../lib/utils";

export interface ProgressRingProps {
  /** Current value between min and max. */
  value?: number;
  /** Lower bound of the range. */
  min?: number;
  /** Upper bound of the range. */
  max?: number;
  /** Outer diameter in pixels. */
  size?: number;
  /** Ring thickness in pixels. */
  thickness?: number;
  /** Tints the arc: accent by default, or a semantic state color. */
  variant?: "accent" | "success" | "warning" | "danger" | "foreground";
  /** Hides the numeric label and exposes it through aria-label instead. */
  label?: ReactNode;
  /** When true, renders the percent as text inside the ring. */
  showValue?: boolean;
  disabled?: boolean;
  "aria-label"?: string;
  className?: string;
}

const variantColors: Record<NonNullable<ProgressRingProps["variant"]>, string> = {
  accent: "var(--pollen-accent, #0070F3)",
  success: "var(--pollen-success, #16a34a)",
  warning: "var(--pollen-warning, #d97706)",
  danger: "var(--pollen-danger, #dc2626)",
  foreground: "var(--pollen-fg)",
};

/**
 * Circular progress. The arc eases to its value with a CSS
 * transition, so updates anywhere in the tree stay smooth without
 * extra JavaScript. Values beyond the range clamp to it.
 */
export function ProgressRing({
  value = 0,
  min = 0,
  max = 100,
  size = 64,
  thickness = 6,
  variant = "accent",
  label,
  showValue = true,
  disabled,
  "aria-label": ariaLabel,
  className,
}: ProgressRingProps) {
  const id = useId();
  const clamped = Math.min(Math.max(value, min), max);
  const range = max - min || 1;
  const pct = Math.min(Math.max((clamped - min) / range, 0), 1);
  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;
  const color = variantColors[variant];
  const autoLabel = typeof label === "string" ? label : `${Math.round(pct * 100)} percent`;

  return (
    <div
      role="progressbar"
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={Math.round(clamped)}
      aria-label={ariaLabel ?? autoLabel}
      className={cn(
        "relative inline-flex select-none items-center justify-center rounded-full",
        disabled && "opacity-50",
        className,
      )}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90" aria-hidden="true">
        <defs>
          <linearGradient id={`ring-${id}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.85" />
            <stop offset="100%" stopColor={color} />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={thickness}
          className="stroke-[var(--pollen-fill)]"
          style={{ stroke: "var(--pollen-fill, rgba(128,128,128,0.18))" }}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={thickness}
          strokeLinecap="round"
          stroke={`url(#ring-${id})`}
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - pct)}
          style={{
            transition: "stroke-dashoffset 480ms cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        />
      </svg>
      {showValue && (
        <span
          className="absolute inset-0 flex items-center justify-center font-medium tabular-nums text-foreground"
          style={{ fontSize: Math.max(size * 0.24, 11) }}
        >
          {label ?? `${Math.round(pct * 100)}%`}
        </span>
      )}
      {!showValue && label ? (
        <span className="absolute inset-0 flex items-center justify-center text-foreground">
          {label}
        </span>
      ) : null}
    </div>
  );
}

ProgressRing.displayName = "ProgressRing";
