"use client";

import { type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "../lib/utils";
import { EASE_OUT } from "../lib/motion";

export interface RevealProps {
  children: ReactNode;
  /** Seconds to wait before starting. */
  delay?: number;
  /** Starting offset in pixels. Set 0 for a pure fade. */
  y?: number;
  once?: boolean;
  className?: string;
}

/**
 * Fades content up as it scrolls into view. Runs once, uses
 * ease-out, and respects reduced motion by fading only.
 */
export function Reveal({
  children,
  delay = 0,
  y = 14,
  once = true,
  className,
}: RevealProps) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, y: reduce ? 0 : y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: "-60px" }}
      transition={{ duration: 0.55, ease: EASE_OUT, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
