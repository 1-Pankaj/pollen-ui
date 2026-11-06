"use client";

import type { ReactNode } from "react";
import {
  IconArrowDownRight as ArrowDownRight,
  IconArrowUpRight as ArrowUpRight,
} from "../icons";
import { cn } from "../lib/utils";

export interface StatProps {
  /** The number, already formatted: "24.1 kB", "12,480", "98.2%". */
  value: string;
  label?: string;
  /** Change against the previous period, without the sign. */
  delta?: number;
  /** Context for the delta, e.g. "vs last month". */
  deltaLabel?: string;
  icon?: ReactNode;
  className?: string;
}

/**
 * One metric and its context. The delta carries its own color,
 * the label stays quiet, and nothing animates without a reason.
 */
export function Stat({
  value,
  label,
  delta,
  deltaLabel,
  icon,
  className,
}: StatProps) {
  const up = (delta ?? 0) >= 0;
  return (
    <div className={cn("inline-flex flex-col", className)}>
      {label && (
        <p className="text-[13px] font-medium text-muted-foreground">{label}</p>
      )}
      <div className="mt-1 flex items-center gap-2.5">
        <p className="text-3xl font-semibold tracking-[-0.02em] tabular-nums text-foreground">
          {value}
        </p>
        {icon && (
          <span className="text-faint [&_svg]:h-4 [&_svg]:w-4">{icon}</span>
        )}
      </div>
      {delta !== undefined && (
        <p className="mt-1.5 flex items-center gap-1.5 text-[13px]">
          <span
            className={cn(
              "inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 font-medium",
              up ? "bg-success/10 text-success-ink" : "bg-danger/10 text-danger-ink",
            )}
          >
            {up ? (
              <ArrowUpRight className="h-3 w-3" />
            ) : (
              <ArrowDownRight className="h-3 w-3" />
            )}
            {Math.abs(delta).toFixed(1)}%
          </span>
          {deltaLabel && <span className="text-faint">{deltaLabel}</span>}
        </p>
      )}
    </div>
  );
}
