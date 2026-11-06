"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView, useReducedMotion } from "framer-motion";
import { cn } from "../lib/utils";
import { EASE_OUT } from "../lib/motion";

export interface NumberTickerProps {
  /** Target value. Re-animates whenever it changes. */
  value: number;
  /** Digits after the decimal point. */
  decimals?: number;
  /** Prefix such as "$" or "≈". */
  prefix?: string;
  /** Suffix such as "kB" or "%". */
  suffix?: string;
  /** Duration in seconds. */
  duration?: number;
  /** Start when scrolled into view (default) or immediately. */
  startOnView?: boolean;
  className?: string;
}

/**
 * Counts from zero to the target with one eased motion, then
 * snaps to plain numbers when the user prefers reduced motion.
 */
export function NumberTicker({
  value,
  decimals = 0,
  prefix = "",
  suffix = "",
  duration = 1.2,
  startOnView = true,
  className,
}: NumberTickerProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState(() =>
    startOnView && !reduce ? 0 : value,
  );

  useEffect(() => {
    if (reduce) return;
    if (startOnView && !inView) return;
    const controls = animate(display, value, {
      duration,
      ease: EASE_OUT,
      onUpdate: (v) => setDisplay(v),
    });
    return () => controls.stop();
  }, [value, inView, reduce]);

  // Reduced motion renders the final value directly; the state stays
  // untouched so nothing animates when the query flips mid-flight.
  const shown = reduce ? value : display;

  const formatted = shown.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return (
    <span ref={ref} className={cn("tabular-nums", className)}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}
