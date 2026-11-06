"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { cn } from "../lib/utils";
import { EASE_OUT } from "../lib/motion";

export interface TextRevealProps {
  text: string;
  /** Seconds between words. */
  stagger?: number;
  delay?: number;
  once?: boolean;
  className?: string;
}

const container = (stagger: number, delay: number): Variants => ({
  hidden: {},
  show: {
    transition: { staggerChildren: stagger, delayChildren: delay },
  },
});

const word: Variants = {
  hidden: { opacity: 0, y: "0.55em", filter: "blur(8px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.6, ease: EASE_OUT },
  },
};

/**
 * Headline entrance, word by word: each word rises out of a
 * soft blur. The signature move of modern marketing pages,
 * tuned to stay under a second.
 */
export function TextReveal({
  text,
  stagger = 0.055,
  delay = 0,
  once = true,
  className,
}: TextRevealProps) {
  const reduce = useReducedMotion();
  const words = text.split(" ");

  if (reduce) return <span className={className}>{text}</span>;

  return (
    <motion.span
      initial="hidden"
      whileInView="show"
      viewport={{ once, margin: "-40px" }}
      variants={container(stagger, delay)}
      aria-label={text}
      className={cn("inline", className)}
    >
      {words.map((w, i) => (
        <motion.span
          key={`${w}-${i}`}
          aria-hidden="true"
          variants={word}
          className="inline-block will-change-transform"
        >
          {w}
          {i < words.length - 1 ? "\u00A0" : ""}
        </motion.span>
      ))}
    </motion.span>
  );
}
