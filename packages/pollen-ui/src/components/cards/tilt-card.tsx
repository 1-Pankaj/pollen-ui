"use client";

import { useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from "framer-motion";
import { cn } from "../../lib/utils";

export type TiltAxis = "both" | "x" | "y";
export type TiltSpring = "soft" | "snappy" | "gentle";

export interface TiltCardProps {
  children?: React.ReactNode;
  /** Maximum rotation in degrees. */
  maxTilt?: number;
  /** Hover scale. 1 disables. */
  scale?: number;
  /** Moving light glare that follows the pointer. */
  glare?: boolean;
  glareOpacity?: number;
  /** Glare tint; any CSS colour. Default white. */
  glareColor?: string;
  /** Which axes rotate. Default both. */
  axis?: TiltAxis;
  /** Reverse the tilt so the card leans away from the pointer. */
  invert?: boolean;
  /** How the card settles: soft wobbles, snappy lands fast, gentle floats. */
  spring?: TiltSpring;
  /** Raise the shadow while hovered. */
  elevate?: boolean;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

const SPRINGS: Record<TiltSpring, { stiffness: number; damping: number; mass: number }> = {
  soft: { stiffness: 160, damping: 18, mass: 0.6 },
  snappy: { stiffness: 320, damping: 26, mass: 0.4 },
  gentle: { stiffness: 90, damping: 14, mass: 0.9 },
};

/**
 * TiltCard - physical, weighty 3D tilt with a moving glare.
 *
 * Rotation is driven by springs (not raw transforms), so the card
 * settles with a natural wobble. The glare is a soft light that
 * tracks the pointer across the surface; its colour and opacity
 * are yours to set. Control which axes rotate, invert the lean,
 * pick a settle personality, and add a hover shadow lift. Great
 * for feature cards, product shots and media tiles.
 *
 * @example
 * <TiltCard maxTilt={8} glare elevate>
 *   <img ... />
 * </TiltCard>
 * <TiltCard axis="x" spring="gentle" glareColor="var(--pollen-accent)" />
 */
export function TiltCard({
  children,
  maxTilt = 9,
  scale = 1.015,
  glare = true,
  glareOpacity = 0.16,
  glareColor = "255, 255, 255",
  axis = "both",
  invert = false,
  spring = "soft",
  elevate = false,
  className,
  style,
  onClick,
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const reduced = useReducedMotion();

  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const cfg = SPRINGS[spring];
  const rotateX = useSpring(rx, cfg);
  const rotateY = useSpring(ry, cfg);
  const sign = invert ? -1 : 1;

  return (
    <div style={{ perspective: 900 }} className="h-full w-full">
      <motion.div
        ref={ref}
        onClick={onClick}
        role={onClick ? "button" : undefined}
        tabIndex={onClick ? 0 : undefined}
        onKeyDown={
          onClick
            ? (e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onClick();
                }
              }
            : undefined
        }
        className={cn(
          "relative h-full w-full overflow-hidden rounded-2xl will-change-transform",
          elevate &&
            "transition-shadow duration-300 hover:shadow-[var(--pollen-shadow-lg)]",
          onClick &&
            "outline-none focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--pollen-bg)] cursor-pointer",
          className
        )}
        style={
          reduced
            ? style
            : {
                ...style,
                rotateX: axis === "y" ? 0 : rotateX,
                rotateY: axis === "x" ? 0 : rotateY,
                transformStyle: "preserve-3d",
              }
        }
        whileHover={reduced ? undefined : { scale }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => {
          setHovered(false);
          rx.set(0);
          ry.set(0);
        }}
        onMouseMove={(e) => {
          if (reduced) return;
          const rect = ref.current?.getBoundingClientRect();
          if (!rect) return;
          const px = (e.clientX - rect.left) / rect.width - 0.5;
          const py = (e.clientY - rect.top) / rect.height - 0.5;
          if (axis !== "y") rx.set(-py * maxTilt * 2 * sign);
          if (axis !== "x") ry.set(px * maxTilt * 2 * sign);
          ref.current?.style.setProperty("--gx", `${(px + 0.5) * 100}%`);
          ref.current?.style.setProperty("--gy", `${(py + 0.5) * 100}%`);
        }}
      >
        {children}
        {glare && (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              opacity: hovered ? 1 : 0,
              transition: "opacity 350ms ease",
              background:
                `radial-gradient(430px circle at var(--gx, 50%) var(--gy, 50%),` +
                ` rgba(${glareColor.startsWith("#") ? hexToRgb(glareColor) : glareColor}, ${glareOpacity}), transparent 62%)`,
            }}
          />
        )}
      </motion.div>
    </div>
  );
}

function hexToRgb(hex: string): string {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const n = parseInt(full.slice(0, 6), 16);
  if (Number.isNaN(n)) return "255, 255, 255";
  return `${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}`;
}

TiltCard.displayName = "TiltCard";
