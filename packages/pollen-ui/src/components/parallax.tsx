"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { cn } from "../lib/utils";

export interface ParallaxProps {
  children: ReactNode;
  /**
   * How far the element drifts, as a fraction of viewport
   * height. 0.1 is subtle, 0.3 is dramatic. Negative reverses
   * the direction.
   */
  speed?: number;
  /** Drift axis. "y" (default) drifts vertically, "x" horizontally. */
  axis?: "y" | "x";
  /**
   * Extra rotation across the visible scroll range, in degrees.
   * The element sits at -rotate when entering and +rotate when
   * leaving, passing through 0 at the centre.
   */
  rotate?: number;
  /**
   * Extra scale across the visible range. 0.1 scales from 0.9 to
   * 1.1, through 1 at the centre.
   */
  scale?: number;
  /** Turn the effect off without unmounting. */
  disabled?: boolean;
  className?: string;
}

/**
 * Scroll-linked drift. The movement is scrubbed, so it tracks the
 * scrollbar 1:1 and reverses cleanly. Layer speed, axis, rotation
 * and scale to build depth. Disabled automatically for reduced
 * motion, or explicitly with `disabled`.
 */
export function Parallax({
  children,
  speed = 0.12,
  axis = "y",
  rotate = 0,
  scale = 0,
  disabled = false,
  className,
}: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [vh, setVh] = useState(0);

  useEffect(() => {
    const sync = () => setVh(window.innerHeight);
    sync();
    window.addEventListener("resize", sync);
    return () => window.removeEventListener("resize", sync);
  }, []);

  // The element drifts speed*vh across the viewport: it starts at
  // one extreme when its top enters the viewport bottom, passes
  // through zero at centre, and ends at the other extreme as its
  // bottom leaves the viewport top.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const off = reduce || disabled || vh === 0;
  const drift = useTransform(scrollYProgress, (p) =>
    off ? 0 : (0.5 - p) * 2 * speed * vh,
  );
  const spin = useTransform(scrollYProgress, (p) =>
    off || !rotate ? 0 : (p - 0.5) * 2 * rotate,
  );
  const grow = useTransform(scrollYProgress, (p) =>
    off || !scale ? 1 : 1 + (0.5 - p) * 2 * scale,
  );

  return (
    <motion.div
      ref={ref}
      style={
        axis === "x"
          ? { x: drift, rotate: spin, scale: grow }
          : { y: drift, rotate: spin, scale: grow }
      }
      className={cn("will-change-transform", className)}
    >
      {children}
    </motion.div>
  );
}
