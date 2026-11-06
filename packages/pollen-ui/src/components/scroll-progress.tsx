"use client";

import { type RefObject } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { Z_SCROLL_PROGRESS } from "../lib/z-index";

export interface ScrollProgressProps {
  className?: string;
  /**
   * Bind the bar to a scrollable container instead of the page.
   * Pass a ref to the element; the bar then renders absolutely at
   * its top edge and fills with that element's scroll. Omit it and
   * the bar stays fixed to the top of the viewport.
   */
  target?: RefObject<HTMLElement | null>;
}

/**
 * A 2px bar across the top of the viewport that fills as the
 * page scrolls. Springy so fast scrolling does not stutter.
 * With a target ref it tracks that container's scroll instead -
 * handy for panes, modals and demos.
 */
export function ScrollProgress({ className, target }: ScrollProgressProps) {
  const { scrollYProgress } = useScroll(
    target ? { container: target } : undefined,
  );
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 400,
    damping: 40,
    restDelta: 0.001,
  });

  return (
    <motion.div
      style={{ scaleX, zIndex: Z_SCROLL_PROGRESS }}
      aria-hidden="true"
      className={
        className ??
        (target
          ? "absolute inset-x-0 top-0 z-20 h-[2px] origin-left bg-foreground"
          : "fixed inset-x-0 top-0 h-[2px] origin-left bg-foreground")
      }
    />
  );
}
