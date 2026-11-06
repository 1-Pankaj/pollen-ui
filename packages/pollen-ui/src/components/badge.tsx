"use client";

import { useState, type HTMLAttributes, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "../lib/utils";

export type BadgeVariant =
  | "neutral"
  | "accent"
  | "success"
  | "warning"
  | "danger"
  | "solid";

export type BadgeSize = "sm" | "md" | "lg";

export interface BadgeProps
  extends Omit<HTMLAttributes<HTMLSpanElement>, "onDrag" | "onDragStart" | "onDragEnd"> {
  variant?: BadgeVariant;
  /** Control height and type size. */
  size?: BadgeSize;
  /** Precedes the label with a small static status dot in the variant color. */
  dot?: boolean;
  /** Leading icon. The dot wins if you pass both. */
  icon?: ReactNode;
  /** Render as a notification counter with overflow, e.g. 99+. */
  count?: number;
  /** Where the counter switches to `${max}+`. Default 99. */
  max?: number;
  /** Adds a close button; removal animates the badge out. */
  dismissible?: boolean;
  onDismiss?: () => void;
  /** Subtle light sweep on hover. On by default for accent. */
  shimmer?: boolean;
}

const variantClasses: Record<BadgeVariant, string> = {
  neutral: "bg-fill text-muted-foreground",
  accent: "bg-accent/10 text-accent",
  success: "bg-success/10 text-success-ink",
  warning: "bg-warning/15 text-warning-ink",
  danger: "bg-danger/10 text-danger-ink",
  solid: "bg-foreground text-background",
};

const dotClasses: Record<BadgeVariant, string> = {
  neutral: "bg-muted-foreground/60",
  accent: "bg-accent",
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-danger",
  solid: "bg-background",
};

const sizeClasses: Record<BadgeSize, string> = {
  sm: "h-[19px] px-2 text-[10.5px] gap-1 rounded-full [&_svg]:h-3 [&_svg]:w-3",
  md: "h-[22px] px-2.5 text-xs gap-1.5 rounded-full [&_svg]:h-3.5 [&_svg]:w-3.5",
  lg: "h-[26px] px-3 text-[13px] gap-2 rounded-full [&_svg]:h-4 [&_svg]:w-4",
};

const counterSizeClasses: Record<BadgeSize, string> = {
  sm: "h-[16px] min-w-[16px] px-1 text-[9.5px]",
  md: "h-[18px] min-w-[18px] px-1 text-[10.5px]",
  lg: "h-[20px] min-w-[20px] px-1.5 text-[11.5px]",
};

/**
 * Status label with real jobs built in: notification counters with
 * overflow, a removable state, status dots, and a quiet light
 * sweep on hover. Keep the copy to one or two words.
 */
export function Badge({
  className,
  variant = "neutral",
  size = "md",
  dot,
  icon,
  count,
  max = 99,
  dismissible,
  onDismiss,
  shimmer,
  children,
  ...props
}: BadgeProps) {
  const [removed, setRemoved] = useState(false);
  const swept = shimmer ?? variant === "accent";

  /* Counter mode: a compact numeric bubble, no room for labels. */
  if (count !== undefined) {
    const label = count > max ? `${max}+` : String(count);
    return (
      <span
        role="status"
        aria-label={`${label} unread`}
        className={cn(
          "inline-flex items-center justify-center rounded-full bg-accent font-semibold leading-none text-white tabular-nums",
          "shadow-[0_0_0_2.5px_var(--pollen-card)]",
          counterSizeClasses[size],
          className,
        )}
        {...props}
      >
        {label}
      </span>
    );
  }

  return (
    <AnimatePresence>
      {!removed && (
        <motion.span
          exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.14 } }}
          className={cn(
            "group relative inline-flex w-fit select-none items-center overflow-hidden font-medium",
            variantClasses[variant],
            sizeClasses[size],
            className,
          )}
          {...(props as object)}
        >
          {/* Light sweep: a single quiet pass on hover. */}
          {swept && (
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 -translate-x-full bg-[linear-gradient(105deg,transparent_35%,rgba(255,255,255,0.28)_50%,transparent_65%)] transition-transform duration-700 ease-out group-hover:translate-x-full"
            />
          )}
          {dot && (
            <span
              aria-hidden="true"
              className={cn("shrink-0 rounded-full", dotClasses[variant], size === "sm" ? "h-1 w-1" : size === "lg" ? "h-1.5 w-1.5" : "h-[5px] w-[5px]")}
            />
          )}
          {!dot && icon && (
            <span aria-hidden="true" className="shrink-0 [&_svg]:h-full [&_svg]:w-full">
              {icon}
            </span>
          )}
          {children}
          {dismissible && (
            <button
              type="button"
              aria-label="Remove"
              onClick={(e) => {
                e.stopPropagation();
                setRemoved(true);
                onDismiss?.();
              }}
              className={cn(
                "relative -mr-1 ml-0.5 flex shrink-0 cursor-pointer items-center justify-center rounded-full opacity-60 transition-[opacity,background-color] duration-150 hover:opacity-100",
                variant === "solid" ? "hover:bg-white/15" : "hover:bg-black/[0.07]",
                size === "sm" ? "h-3.5 w-3.5" : size === "lg" ? "h-5 w-5" : "h-4 w-4",
              )}
            >
              <svg
                viewBox="0 0 12 12"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                className={size === "sm" ? "h-2 w-2" : "h-2.5 w-2.5"}
                aria-hidden="true"
              >
                <path d="M3.5 3.5l5 5M8.5 3.5l-5 5" />
              </svg>
            </button>
          )}
        </motion.span>
      )}
    </AnimatePresence>
  );
}
