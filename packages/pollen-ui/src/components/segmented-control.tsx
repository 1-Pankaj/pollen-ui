"use client";

import { useId, useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "../lib/utils";
import { spring } from "../lib/motion";

export interface SegmentedOption {
  value: string;
  label: ReactNode;
  icon?: ReactNode;
  /** Small numeric bubble after the label, e.g. a count. */
  badge?: number | string;
  disabled?: boolean;
}

export interface SegmentedControlProps {
  options: SegmentedOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  size?: "sm" | "md" | "lg";
  /** Stretch to fill the container, thumbs sized by fraction. */
  fullWidth?: boolean;
  /** Pill-shaped container instead of the inset square. */
  shape?: "rounded" | "pill";
  className?: string;
  "aria-label"?: string;
}

const sizes = {
  sm: { item: "h-7 px-2.5 text-[12.5px]", pad: "p-[3px]", gap: "gap-0.5", thumb: "rounded-[7px]" },
  md: { item: "h-9 px-4 text-[15px]", pad: "p-1", gap: "gap-1", thumb: "rounded-md" },
  lg: { item: "h-11 px-5 text-base", pad: "p-1.5", gap: "gap-1", thumb: "rounded-lg" },
} as const;

/**
 * iOS-style segmented control. The thumb glides between options
 * on a spring; options take icons and counts, stretch full width,
 * and the whole thing scales three sizes.
 */
export function SegmentedControl({
  options = [],
  value: controlled,
  defaultValue,
  onValueChange,
  size = "md",
  fullWidth,
  shape = "rounded",
  className,
  ...aria
}: SegmentedControlProps) {
  const layoutId = useId();
  const [uncontrolled, setUncontrolled] = useState(
    defaultValue ?? options.find((o) => !o.disabled)?.value,
  );
  const value = controlled !== undefined ? controlled : uncontrolled;
  const s = sizes[size];

  return (
    <div
      role="radiogroup"
      className={cn(
        "inline-flex items-center bg-fill",
        shape === "pill" ? "rounded-full" : "rounded-[11px]",
        s.pad,
        s.gap,
        fullWidth && "flex w-full",
        className,
      )}
      {...aria}
    >
      {options.map((option) => {
        const isActive = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={isActive}
            disabled={option.disabled}
            onClick={() => {
              if (option.disabled) return;
              setUncontrolled(option.value);
              onValueChange?.(option.value);
            }}
            className={cn(
              "relative inline-flex flex-1 items-center justify-center gap-1.5 whitespace-nowrap font-medium outline-none transition-colors duration-150",
              s.item,
              shape === "pill" ? "rounded-full" : "rounded-[8px]",
              fullWidth && "flex-auto",
              isActive
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground",
              option.disabled && "pointer-events-none opacity-40",
            )}
          >
            {isActive && (
              <motion.span
                layoutId={layoutId}
                transition={spring.snappy}
                className={cn(
                  "absolute inset-0 bg-card shadow-[var(--pollen-shadow-xs)]",
                  shape === "pill" ? "rounded-full" : s.thumb,
                )}
              />
            )}
            {option.icon && (
              <span className="relative z-10 [&_svg]:h-4 [&_svg]:w-4">
                {option.icon}
              </span>
            )}
            <span className="relative z-10">{option.label}</span>
            {option.badge !== undefined && (
              <span
                className={cn(
                  "relative z-10 inline-flex h-[17px] min-w-[17px] items-center justify-center rounded-full px-1 text-[10.5px] font-semibold leading-none tabular-nums transition-colors duration-150",
                  isActive
                    ? "bg-foreground text-background"
                    : "bg-fill-strong text-muted-foreground",
                )}
              >
                {option.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
