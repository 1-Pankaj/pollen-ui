"use client";

import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from "framer-motion";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

const buttonVariants = cva(
  "group relative inline-flex select-none items-center justify-center gap-2 overflow-hidden whitespace-nowrap rounded-full font-medium outline-none transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-[var(--pollen-accent)]/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--pollen-bg)] disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-[var(--pollen-accent)] text-white shadow-[0_8px_28px_-10px_var(--pollen-accent)] hover:opacity-90",
        secondary:
          "border border-[var(--pollen-border-strong)] bg-[var(--pollen-fill)] text-[var(--pollen-fg)] hover:border-[var(--pollen-accent)]/35 hover:bg-[var(--pollen-fill-strong)]",
        outline:
          "border border-[var(--pollen-accent)]/45 text-[var(--pollen-accent)] hover:bg-[var(--pollen-accent)]/10",
        ghost:
          "text-[var(--pollen-fg-muted)] hover:bg-[var(--pollen-accent)]/10 hover:text-[var(--pollen-fg)]",
      },
      size: {
        sm: "h-8 px-4 text-xs",
        md: "h-10 px-5 text-sm",
        lg: "h-12 px-7 text-[15px]",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  }
);

export interface MagneticButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /** 0-1 - how far the button leans toward the cursor. */
  strength?: number;
  /** Shimmering light sweep on hover. */
  shine?: boolean;
  /** Contents; usually text + an optional inline SVG. */
  children?: React.ReactNode;
}

/**
 * MagneticButton - a button with gravity.
 *
 * The whole button leans toward the cursor on a spring while the
 * label leans a little further, giving a subtle parallax. Optional
 * shine sweep, tactile press scale, keyboard accessible, and fully
 * themeable through Pollen tokens.
 *
 * @example
 * <MagneticButton size="lg" shine>Get started</MagneticButton>
 */
export function MagneticButton({
  variant,
  size,
  strength = 0.28,
  shine = false,
  className,
  children,
  ...props
}: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const reduced = useReducedMotion();

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 180, damping: 14, mass: 0.4 });
  const y = useSpring(my, { stiffness: 180, damping: 14, mass: 0.4 });
  const lx = useSpring(mx, { stiffness: 120, damping: 12, mass: 0.5 });
  const ly = useSpring(my, { stiffness: 120, damping: 12, mass: 0.5 });

  return (
    <motion.button
      ref={ref}
      type="button"
      className={cn(buttonVariants({ variant, size }), className)}
      style={reduced ? undefined : { x, y }}
      whileTap={reduced ? undefined : { scale: 0.96 }}
      onMouseMove={(e) => {
        if (reduced) return;
        const rect = ref.current?.getBoundingClientRect();
        if (!rect) return;
        const dx = e.clientX - (rect.left + rect.width / 2);
        const dy = e.clientY - (rect.top + rect.height / 2);
        mx.set(dx * strength);
        my.set(dy * strength);
      }}
      onMouseLeave={() => {
        mx.set(0);
        my.set(0);
      }}
      {...(props as React.ComponentProps<typeof motion.button>)}
    >
      <motion.span
        className="relative z-10 inline-flex items-center gap-2"
        style={reduced ? undefined : { x: lx, y: ly }}
      >
        {children}
      </motion.span>
      {shine && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 z-0 before:absolute before:inset-0 before:-translate-x-[130%] before:bg-gradient-to-r before:from-transparent before:via-white/35 before:to-transparent before:transition-transform before:duration-700 before:ease-out group-hover:before:translate-x-[130%]"
        />
      )}
    </motion.button>
  );
}

MagneticButton.displayName = "MagneticButton";
