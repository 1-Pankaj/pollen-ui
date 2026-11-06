"use client";

import { useId, useRef, useState } from "react";
import { AnimatePresence,
  motion,
  useReducedMotion } from "framer-motion";
import { cn } from "../lib/utils";
import { spring } from "../lib/motion";

export type RatingGlyph = "star" | "heart" | "thumbs" | "petal";
export type RatingTone = "amber" | "accent" | "rose" | "mint" | "ink";

export interface RatingProps {
  /** Maximum rating, default 5. */
  max?: number;
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  /** Read only, for showing aggregate scores. Fractional values fill partially. */
  readOnly?: boolean;
  /** Hide the numeric value next to the glyphs. */
  hideValue?: boolean;
  /** Word shown for the hovered or current value, e.g. ["Poor", "Great"]. */
  labels?: string[];
  /** Extra caption under the control, e.g. "1,204 reviews". */
  caption?: React.ReactNode;
  /** Which glyph to draw. Star is the review standard; petal is the brand mark. */
  glyph?: RatingGlyph;
  /** Named colour for the filled glyph. A raw CSS colour wins via `color`. */
  tone?: RatingTone;
  /** Explicit CSS colour for filled glyphs; beats `tone`. */
  color?: string;
  /** Allow half-star commits from the pointer. Keyboard always steps whole. */
  allowHalf?: boolean;
  /** Clicking the current value clears it back to 0, Escape too. */
  clearable?: boolean;
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  className?: string;
  "aria-label"?: string;
}

const GLYPHS: Record<RatingGlyph, React.ReactNode> = {
  star: (
    <path d="M12 2.6l2.9 5.88 6.5.94-4.7 4.58 1.1 6.48L12 17.44l-5.8 3.04 1.1-6.48-4.7-4.58 6.5-.94L12 2.6z" />
  ),
  heart: (
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  ),
  thumbs: (
    <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
  ),
  petal: (
    <path d="M12 2.5c4.5 2.2 7.5 5.6 7.5 9.5 0 4.6-3.6 8-7.5 9.5C8.1 20 4.5 16.6 4.5 12c0-3.9 3-7.3 7.5-9.5z" />
  ),
};

const TONES: Record<RatingTone, string> = {
  amber: "var(--pollen-warning, #f5a623)",
  accent: "var(--pollen-accent)",
  rose: "var(--pollen-danger, #e54666)",
  mint: "var(--pollen-mint, #0d9373)",
  ink: "var(--pollen-fg)",
};

const sizes = {
  sm: { star: "h-3.5 w-3.5", gap: "gap-0.5", text: "text-xs", pop: 1.22 },
  md: { star: "h-5 w-5", gap: "gap-1", text: "text-sm", pop: 1.26 },
  lg: { star: "h-7 w-7", gap: "gap-1.5", text: "text-base", pop: 1.3 },
} as const;

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

/**
 * Rating - a review control that finally earns its stars.
 *
 * The pointer sweeps a continuous fill (half precision with
 * `allowHalf`), the keyboard steps in whole stars and Escape
 * clears when `clearable` is on. Four glyphs, five tones or a raw
 * colour, word labels, a caption line, and readOnly fractional
 * fills for aggregate scores like 4.2.
 *
 * @example
 * <Rating value={score} onValueChange={setScore} allowHalf clearable />
 * <Rating value={4.5} readOnly glyph="heart" tone="rose" caption="1,204 loves" />
 */
export function Rating({
  max = 5,
  value,
  defaultValue = 0,
  onValueChange,
  readOnly = false,
  hideValue = false,
  labels,
  caption,
  glyph = "star",
  tone = "amber",
  color,
  allowHalf = false,
  clearable = false,
  size = "md",
  disabled = false,
  className,
  "aria-label": ariaLabel = "Rating",
}: RatingProps) {
  const autoId = useId();
  const [inner, setInner] = useState(defaultValue);
  const [hoverFraction, setHoverFraction] = useState<number | null>(null);
  const [popIndex, setPopIndex] = useState<number | null>(null);
  const reduce = useReducedMotion();
  const popTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const groupRef = useRef<HTMLDivElement>(null);

  const locked = readOnly || disabled;
  const current = value ?? inner;
  const shown = readOnly ? current : (hoverFraction ?? current);
  const fillColor = color ?? TONES[tone];
  const s = sizes[size];

  const commit = (next: number) => {
    if (locked) return;
    const clamped = Math.min(Math.max(next, 0), max);
    setInner(clamped);
    onValueChange?.(clamped);
    setPopIndex(Math.max(1, Math.ceil(clamped)));
    if (popTimer.current) clearTimeout(popTimer.current);
    popTimer.current = setTimeout(() => setPopIndex(null), 360);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (locked) return;
    const step =
      e.key === "ArrowRight" || e.key === "ArrowUp"
        ? 1
        : e.key === "ArrowLeft" || e.key === "ArrowDown"
          ? -1
          : 0;
    if (step) {
      e.preventDefault();
      commit(current + step);
    } else if (e.key === "Home") {
      e.preventDefault();
      commit(1);
    } else if (e.key === "End") {
      e.preventDefault();
      commit(max);
    } else if (e.key === "Escape" && clearable) {
      e.preventDefault();
      commit(0);
    }
  };

  /* Pointer position inside the group becomes a continuous value. */
  const handlePointerMove = (e: React.PointerEvent) => {
    if (locked) return;
    const rect = groupRef.current?.getBoundingClientRect();
    if (!rect) return;
    const ratio = clamp01((e.clientX - rect.left) / rect.width);
    const raw = Math.round(ratio * max * 2) / 2; // half-star precision
    setHoverFraction(allowHalf ? raw : Math.ceil(raw));
  };

  const activeLabel =
    labels && shown > 0
      ? labels[Math.min(labels.length - 1, Math.ceil(shown) - 1)]
      : undefined;

  const glyphNode = (fill: number, filled: boolean, star: number) => (
    <motion.span
      aria-hidden="true"
      className="relative inline-flex shrink-0"
      initial={false}
      animate={{
        scale: popIndex === star && !locked && !reduce ? s.pop : 1,
      }}
      transition={reduce ? { duration: 0 } : spring.snappy}
    >
      {/* Base: the empty shape. In normal flow, so the button
          always sizes to the glyph. */}
      <svg
        viewBox="0 0 24 24"
        className={cn(s.star, "text-faint")}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
        strokeLinecap="round"
      >
        {GLYPHS[glyph]}
      </svg>
      {/* Fill layer clipped by the fraction, left-anchored. */}
      <span
        className="absolute inset-0 overflow-hidden"
        style={{ width: `${fill * 100}%` }}
      >
        <svg
          viewBox="0 0 24 24"
          className={cn(s.star, "absolute inset-y-0 left-0")}
          fill={fillColor}
          stroke={fillColor}
          strokeWidth="1.6"
          strokeLinejoin="round"
          strokeLinecap="round"
        >
          {GLYPHS[glyph]}
        </svg>
      </span>
    </motion.span>
  );

  return (
    <div className={cn("inline-flex flex-col gap-1", className)}>
      <div className={cn("inline-flex items-center", s.gap)}>
        <div
          ref={groupRef}
          role={locked ? "img" : "slider"}
          id={autoId}
          aria-label={ariaLabel}
          aria-valuemin={locked ? undefined : 0}
          aria-valuemax={locked ? undefined : max}
          aria-valuenow={locked ? undefined : current}
          aria-valuetext={activeLabel}
          aria-disabled={disabled || undefined}
          tabIndex={locked ? undefined : 0}
          onKeyDown={onKeyDown}
          onPointerMove={handlePointerMove}
          onPointerLeave={() => setHoverFraction(null)}
          className={cn(
            "inline-flex rounded-lg outline-none",
            s.gap,
            !locked &&
              !disabled &&
              "cursor-pointer focus-visible:ring-[3px] focus-visible:ring-accent/20",
            disabled && "opacity-50",
          )}
        >
          {Array.from({ length: max }, (_, i) => {
            const star = i + 1;
            const fill = clamp01(shown - star + 1);
            return (
              <button
                key={star}
                type="button"
                tabIndex={-1}
                aria-hidden={locked || undefined}
                disabled={locked}
                onClick={() => {
                  if (locked) return;
                  commit(star === current ? (clearable ? 0 : star) : star);
                }}
                className="relative inline-flex rounded-sm outline-none"
              >
                {glyphNode(fill, fill > 0, star)}
              </button>
            );
          })}
        </div>
        <AnimatePresence mode="wait" initial={false}>
          {!hideValue && (
            <motion.span
              key={`${Math.round(shown * 2)}-${activeLabel ?? ""}`}
              initial={{ opacity: 0, y: 2 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -2 }}
              transition={{ duration: reduce ? 0 : 0.12 }}
              className={cn(
                "ml-2 tabular-nums text-muted-foreground",
                s.text,
              )}
            >
              {activeLabel ??
                (current > 0
                  ? current.toFixed(1).replace(/\.0$/, "")
                  : "0")}
            </motion.span>
          )}
        </AnimatePresence>
      </div>
      {caption && (
        <span className="text-[12.5px] leading-none text-muted-foreground">
          {caption}
        </span>
      )}
    </div>
  );
}
