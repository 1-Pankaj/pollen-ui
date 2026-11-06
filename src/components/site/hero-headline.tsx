"use client";

import { motion, useReducedMotion } from "framer-motion";

const EASE_OUT = [0.22, 1, 0.36, 1] as const;

/**
 * The hero statement: two centered lines, the promise landing on one
 * italic serif word. Each line rises out of its own overflow mask.
 */
export function HeroHeadline() {
  const reduce = useReducedMotion();

  const lines = [
    { words: ["The", "component", "library"], accent: null },
    { words: ["for", "interfaces", "that"], accent: "breathe" },
  ];

  let wordIndex = 0;

  if (reduce) {
    return (
      <h1 className="hero-accent mx-auto max-w-[1060px] text-balance text-[40px] font-semibold leading-[1.08] tracking-[-0.035em] sm:text-6xl lg:text-[76px]">
        The component library
        <br />
        for interfaces that <em className="font-display-serif">breathe</em>.
      </h1>
    );
  }

  return (
    <h1
      aria-label="The component library for interfaces that breathe."
      className="hero-accent mx-auto max-w-[1060px] text-balance text-[40px] font-semibold leading-[1.08] tracking-[-0.035em] sm:text-6xl lg:text-[76px]"
    >
      {lines.map((line, li) => (
        <span key={li} className="block">
          {line.words.map((word) => {
            const delay = 0.08 + wordIndex++ * 0.075;
            return (
              <span key={word} className="inline-block overflow-hidden pb-[0.1em] align-bottom">
                <motion.span
                  className="inline-block"
                  initial={{ y: "112%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.72, ease: EASE_OUT, delay }}
                >
                  {word}
                  {"\u00A0"}
                </motion.span>
              </span>
            );
          })}
          {line.accent && (
            <span className="inline-block overflow-hidden pb-[0.1em] align-bottom">
              <motion.span
                className="inline-block"
                initial={{ y: "112%" }}
                animate={{ y: 0 }}
                transition={{ duration: 0.8, ease: EASE_OUT, delay: 0.08 + wordIndex++ * 0.075 + 0.08 }}
              >
                <em className="font-display-serif">{line.accent}</em>.
              </motion.span>
            </span>
          )}
        </span>
      ))}
    </h1>
  );
}
