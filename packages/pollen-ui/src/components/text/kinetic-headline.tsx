"use client";

import { createElement, useMemo } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { cn } from "../../lib/utils";
import { EASE_OUT, springSoft } from "../../lib/springs";

export type KineticVariant =
  | "rise"
  | "blur"
  | "flip"
  | "scale"
  | "slide"
  | "drop";

export interface KineticHeadlineProps {
  /** The text to animate. */
  text: string;
  /** Rendered element. */
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span";
  /** Animation style. */
  variant?: KineticVariant;
  /** Animate whole words or individual characters. */
  by?: "word" | "char";
  /** Seconds between each unit. */
  stagger?: number;
  /** Seconds before the first unit appears. */
  delay?: number;
  /** Animate only the first time the element enters the viewport. */
  once?: boolean;
  /** Words rendered in the accent colour, matched case-sensitively. */
  highlight?: string[];
  className?: string;
}

const container = (stagger: number, delay: number): Variants => ({
  hidden: {},
  visible: {
    transition: { staggerChildren: stagger, delayChildren: delay },
  },
});

const wordVariants: Record<KineticVariant, Variants> = {
  rise: {
    hidden: { y: "115%", rotate: 4, opacity: 0 },
    visible: {
      y: "0%",
      rotate: 0,
      opacity: 1,
      transition: { ...springSoft, opacity: { duration: 0.3, ease: EASE_OUT } },
    },
  },
  blur: {
    hidden: { y: 14, opacity: 0, filter: "blur(12px)" },
    visible: {
      y: 0,
      opacity: 1,
      filter: "blur(0px)",
      transition: { duration: 0.7, ease: EASE_OUT },
    },
  },
  flip: {
    hidden: { rotateX: -88, y: 14, opacity: 0, transformPerspective: 700 },
    visible: {
      rotateX: 0,
      y: 0,
      opacity: 1,
      transition: { ...springSoft, opacity: { duration: 0.25, ease: EASE_OUT } },
    },
  },
  scale: {
    hidden: { scale: 0.6, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: springSoft,
    },
  },
  slide: {
    hidden: { x: "-108%", opacity: 0 },
    visible: {
      x: "0%",
      opacity: 1,
      transition: { ...springSoft, opacity: { duration: 0.2, ease: EASE_OUT } },
    },
  },
  drop: {
    hidden: { y: -46, opacity: 0, scale: 0.94 },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: { ...springSoft, opacity: { duration: 0.24, ease: EASE_OUT } },
    },
  },
};

/**
 * KineticHeadline - entrance choreography, word by word or letter
 * by letter.
 *
 * Words rise out of a clipped baseline, de-blur, flip up, scale in,
 * slide in from the left or drop from above with a spring. Switch
 * to `by="char"` for letter-level stagger, and pass `highlight` to
 * paint chosen words in the accent colour as they land. Sits
 * inline with your existing typography: pass any text style via
 * `className`.
 *
 * @example
 * <KineticHeadline as="h1" text="Interfaces that feel alive." variant="rise" />
 * <KineticHeadline text="Design at speed" by="char" variant="drop" highlight={["speed"]} />
 */
export function KineticHeadline({
  text,
  as = "span",
  variant = "rise",
  by = "word",
  stagger,
  delay = 0,
  once = true,
  highlight,
  className,
}: KineticHeadlineProps) {
  const reduced = useReducedMotion();

  const units = useMemo(() => {
    if (by === "char") {
      // Split into words, then letters; keep spaces as separators so
      // the line still wraps naturally.
      const words = text.split(/\s+/).filter(Boolean);
      const out: { key: string; text: string; spaceAfter: boolean }[] = [];
      words.forEach((word, wi) => {
        for (const ch of Array.from(word)) {
          out.push({ key: `${wi}-${ch}-${out.length}`, text: ch, spaceAfter: false });
        }
        if (wi < words.length - 1) out[out.length - 1].spaceAfter = true;
      });
      return out;
    }
    return text
      .split(/\s+/)
      .filter(Boolean)
      .map((word, i) => ({ key: `${word}-${i}`, text: word, spaceAfter: true }));
  }, [text, by]);

  const effStagger = stagger ?? (by === "char" ? 0.028 : 0.08);
  const highlightSet = useMemo(
    () => new Set(highlight ?? []),
    [highlight],
  );

  if (reduced) {
    return createElement(as, { className }, text);
  }

  const clipped = variant === "rise" || variant === "slide";

  return (
    <motion.span
      style={{
        display: "inline-block",
        perspective: variant === "flip" ? 700 : undefined,
      }}
    >
      <span className="sr-only">{text}</span>
      <motion.span
        aria-hidden
        variants={container(effStagger, delay)}
        initial="hidden"
        whileInView="visible"
        viewport={{ once, amount: 0.4 }}
        className={cn("inline", className)}
      >
        {units.map((unit) => {
          const isHighlighted =
            by === "word" && highlightSet.has(unit.text);
          return (
            <span key={unit.key} aria-hidden>
              <span
                className={cn(
                  "inline-block whitespace-nowrap",
                  clipped &&
                    "overflow-hidden pb-[0.12em] -mb-[0.12em] align-bottom",
                  isHighlighted && "text-accent",
                )}
              >
                <motion.span
                  variants={wordVariants[variant]}
                  className="inline-block will-change-transform"
                  style={{ transformOrigin: "50% 100%" }}
                >
                  {unit.text}
                </motion.span>
              </span>
              {unit.spaceAfter ? " " : null}
            </span>
          );
        })}
      </motion.span>
    </motion.span>
  );
}

KineticHeadline.displayName = "KineticHeadline";
