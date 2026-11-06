"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { LogoMark } from "./logo";

/**
 * Interactive spring demo for the home page. The card can be
 * thrown in any direction and returns home on a spring, which
 * says more about the motion system than a paragraph could.
 */
export function MotionDemo() {
  const [grabbed, setGrabbed] = useState(false);

  return (
    <div className="relative flex h-[340px] items-center justify-center overflow-hidden rounded-3xl bg-fill/70 sm:h-[380px]">
      {/* soft spotlight under the card */}
      <motion.div
        aria-hidden="true"
        animate={{ scale: grabbed ? 0.86 : 1, opacity: grabbed ? 0.55 : 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 24 }}
        className="absolute h-40 w-56 rounded-[100%] bg-foreground/[0.06] blur-2xl dark:bg-white/[0.04]"
      />

      <motion.button
        type="button"
        drag
        dragSnapToOrigin
        dragElastic={0.14}
        dragTransition={{ bounceStiffness: 320, bounceDamping: 20 }}
        whileHover={{ scale: 1.03 }}
        whileDrag={{ scale: 1.05, rotate: -2.5 }}
        onDragStart={() => setGrabbed(true)}
        onDragEnd={() => setGrabbed(false)}
        transition={{ type: "spring", stiffness: 420, damping: 26 }}
        aria-label="Draggable card, spring return demo"
        className="relative z-10 flex w-64 cursor-grab touch-none flex-col items-center gap-4 rounded-2xl bg-card px-6 py-7 shadow-[var(--pollen-shadow-lg)] outline-none active:cursor-grabbing"
      >
        <LogoMark />
        <div className="text-center">
          <p className="text-[15px] font-semibold text-foreground">
            Grab this card
          </p>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            Pull it anywhere and let go. It finds its way home.
          </p>
        </div>
      </motion.button>

      <p
        aria-hidden="true"
        className="absolute bottom-5 px-6 text-center text-[13px] font-medium text-faint transition-opacity duration-200"
      >
        {grabbed
          ? "Let go and watch it settle"
          : "Springs respond to you. Durations just play back."}
      </p>
    </div>
  );
}
