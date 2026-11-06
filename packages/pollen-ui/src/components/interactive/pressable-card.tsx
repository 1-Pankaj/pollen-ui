"use client";

import { type ReactNode } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import { cn } from "../../lib/utils";

export type PressableDepth = "sm" | "md" | "lg";
export type PressableVariant = "raised" | "flat" | "outline";

export interface PressableCardProps {
  children: ReactNode;
  /** Visual treatment: raised floats on depth, flat sits in a filled tile, outline draws a hairline. */
  variant?: PressableVariant;
  /** Physical tilt toward the cursor. Default true. */
  tilt?: boolean;
  /** Radial light that follows the cursor. Default true. */
  spotlight?: boolean;
  /** Shadow scale at rest. Default "md". */
  depth?: PressableDepth;
  /** Max tilt in degrees. Default 5. */
  maxTilt?: number;
  /** Hover lift. Turn off for cards that should stay anchored. Default true. */
  lift?: boolean;
  /** Accent ring that lights the border under the pointer. Default false. */
  borderGlow?: boolean;
  onClick?: () => void;
  href?: string;
  className?: string;
  ariaLabel?: string;
}

const depthShadows: Record<PressableDepth, { rest: string; hover: string }> = {
  sm: {
    rest: "var(--pollen-shadow-xs)",
    hover: "var(--pollen-shadow-sm)",
  },
  md: {
    rest: "var(--pollen-shadow-sm)",
    hover: "var(--pollen-shadow-lg)",
  },
  lg: {
    rest: "var(--pollen-shadow-md)",
    hover: "var(--pollen-shadow-lg)",
  },
};

const variantSurfaces: Record<PressableVariant, string> = {
  raised: "bg-card",
  flat: "bg-fill",
  outline: "bg-card border border-[var(--pollen-border)]",
};

/**
 * PressableCard - an interactive block with real physicality.
 *
 * Three layers work together: the surface tilts toward the cursor
 * on springs, a soft light tracks the pointer across it, and
 * pressing compresses the card into its own shadow. Released, it
 * springs back with a little overshoot. Keyboard focus gets the
 * same ring the pointer gets. Three surface variants (raised,
 * flat, outline), an optional accent border glow, and every layer
 * is individually switchable.
 */
export function PressableCard({
  children,
  tilt = true,
  spotlight = true,
  depth = "md",
  maxTilt = 5,
  onClick,
  href,
  className,
  ariaLabel,
  variant = "raised",
  lift = true,
  borderGlow = false,
}: PressableCardProps) {
  const reduce = useReducedMotion();

  const rx = useSpring(0, { stiffness: 260, damping: 22 });
  const ry = useSpring(0, { stiffness: 260, damping: 22 });
  const liftSpring = useSpring(0, { stiffness: 300, damping: 24 });
  const mx = useMotionValue(50);
  const my = useMotionValue(50);
  const spotlightBg = useMotionTemplate`radial-gradient(220px circle at ${mx}% ${my}%, color-mix(in srgb, var(--pollen-fg) 7%, transparent), transparent 70%)`;
  const liftSpringY = useTransform(liftSpring, (v) => v * -2);
  const boxShadow = useTransform(liftSpring, (v) =>
    v < 0.5 ? depthShadows[depth].rest : depthShadows[depth].hover,
  );

  const onMove = (e: React.PointerEvent) => {
    if (reduce) return;
    const el = e.currentTarget as HTMLElement;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    mx.set(px * 100);
    my.set(py * 100);
    if (tilt) {
      ry.set((px - 0.5) * maxTilt * 2);
      rx.set(-(py - 0.5) * maxTilt * 2);
    }
  };

  const onLeave = () => {
    rx.set(0);
    ry.set(0);
    liftSpring.set(0);
    mx.set(50);
    my.set(50);
  };

  const interactive = Boolean(onClick || href);

  const shared = {
    "aria-label": ariaLabel,
    onPointerMove: onMove,
    onPointerLeave: onLeave,
    onPointerEnter: () => lift && liftSpring.set(1),
    whileTap: reduce || !interactive ? undefined : { scale: 0.977 },
    style: {
      rotateX: tilt && !reduce ? rx : 0,
      rotateY: tilt && !reduce ? ry : 0,
      transformPerspective: 900,
      y: liftSpringY,
      boxShadow: variant === "flat" ? "none" : boxShadow,
    },
    className: cn(
      "relative block w-full rounded-2xl p-6 text-left outline-none",
      variantSurfaces[variant],
      borderGlow &&
        "after:pointer-events-none after:absolute after:inset-0 after:rounded-2xl after:opacity-0 after:transition-opacity after:duration-300 hover:after:opacity-100 after:ring-1 after:ring-inset after:ring-[var(--pollen-accent)]/40",
      "focus-visible:ring-2 focus-visible:ring-[var(--pollen-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--pollen-bg)]",
      interactive ? "cursor-pointer" : "",
      className,
    ),
  };

  const inner = (
    <>
      {spotlight && (
        <motion.span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[inherit]"
          style={{ background: spotlightBg, opacity: liftSpring }}
        />
      )}
      {children}
    </>
  );

  if (href) {
    return (
      <motion.a href={href} {...shared}>
        {inner}
      </motion.a>
    );
  }

  return (
    <motion.button type="button" onClick={onClick} {...shared}>
      {inner}
    </motion.button>
  );
}

PressableCard.displayName = "PressableCard";
