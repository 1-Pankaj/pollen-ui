"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "../lib/utils";

export type SkeletonEffect = "pulse" | "shimmer" | "none";
export type SkeletonShape = "rect" | "circle" | "text";

export interface SkeletonProps {
  className?: string;
  /** The loading animation. Shimmer sweeps a band of light; pulse breathes. */
  effect?: SkeletonEffect;
  /** rect is free-form (give it w/h), circle squares itself, text is a rounded bar. */
  shape?: SkeletonShape;
  style?: React.CSSProperties;
}

/**
 * Loading placeholder. A quiet pulse by default, or a band of
 * light that sweeps across for long waits. Compose circles, lines
 * and blocks to sketch the layout that is coming.
 *
 * @example
 * <Skeleton className="h-24 w-full" />
 * <Skeleton shape="circle" className="h-10 w-10" effect="shimmer" />
 */
export function Skeleton({
  className,
  effect = "pulse",
  shape = "rect",
  style,
}: SkeletonProps) {
  const reduced = useReducedMotion();
  const live = !reduced && effect !== "none";

  return (
    <div
      aria-hidden="true"
      style={style}
      className={cn(
        "relative overflow-hidden bg-fill",
        shape === "circle" && "rounded-full",
        shape === "text" && "h-3.5 rounded-full",
        shape === "rect" && "rounded-md",
        live && effect === "pulse" && "animate-pulse",
        className,
      )}
    >
      {live && effect === "shimmer" && (
        <motion.span
          className="absolute inset-y-0 w-1/3 skew-x-[-16deg]"
          style={{
            background:
              "linear-gradient(90deg, transparent, color-mix(in srgb, var(--pollen-fg) 7%, transparent), transparent)",
          }}
          animate={{ x: ["-120%", "340%"] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: [0.4, 0, 0.6, 1],
          }}
        />
      )}
    </div>
  );
}

export interface SkeletonTextProps {
  /** How many lines to sketch. The last one renders 60% wide. */
  lines?: number;
  /** Animate the lines. */
  effect?: SkeletonEffect;
  /** Fixed line height override. */
  lineHeight?: string;
  className?: string;
}

/**
 * A paragraph-shaped placeholder: n rounded bars with the last one
 * pulled short, the way real text raggedly ends.
 *
 * @example
 * <SkeletonText lines={3} />
 */
export function SkeletonText({
  lines = 3,
  effect = "pulse",
  lineHeight,
  className,
}: SkeletonTextProps) {
  const reduced = useReducedMotion();
  const live = !reduced && effect !== "none";

  return (
    <div
      aria-hidden="true"
      className={cn("flex flex-col gap-2.5", live && effect === "pulse" && "animate-pulse", className)}
    >
      {Array.from({ length: lines }, (_, i) => (
        <div
          key={i}
          className="relative overflow-hidden rounded-full bg-fill"
          style={{ height: lineHeight ?? "0.875rem", width: i === lines - 1 ? "60%" : "100%" }}
        >
          {live && effect === "shimmer" && (
            <motion.span
              className="absolute inset-y-0 w-1/3 skew-x-[-16deg]"
              style={{
                background:
                  "linear-gradient(90deg, transparent, color-mix(in srgb, var(--pollen-fg) 7%, transparent), transparent)",
              }}
              animate={{ x: ["-120%", "340%"] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: [0.4, 0, 0.6, 1],
                delay: i * 0.1,
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
}

Skeleton.displayName = "Skeleton";
SkeletonText.displayName = "SkeletonText";
