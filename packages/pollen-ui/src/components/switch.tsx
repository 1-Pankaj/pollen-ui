"use client";

import { useId, useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../lib/utils";

export type SwitchSize = "sm" | "md" | "lg";

export type SwitchColor = "accent" | "neutral" | "success";

export interface SwitchProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  /** Shows a spinner in place of the thumb; events are paused. */
  loading?: boolean;
  /** Color of the on state. */
  color?: SwitchColor;
  size?: SwitchSize;
  /** Icon drawn inside the track for the on state. */
  onIcon?: ReactNode;
  /** Icon drawn inside the track for the off state. */
  offIcon?: ReactNode;
  /** Clickable text rendered next to the switch. */
  children?: ReactNode;
  /** Second line under the label. Implies a roomier layout. */
  description?: ReactNode;
  id?: string;
  className?: string;
}

const sizes = {
  sm: { track: "h-[18px] w-8 px-[2px]", thumb: 14, travel: 14, icon: 8 },
  md: { track: "h-6 w-11 px-0.5", thumb: 20, travel: 20, icon: 11 },
  lg: { track: "h-7 w-[52px] px-0.5", thumb: 24, travel: 24, icon: 13 },
} as const;

const trackColors: Record<SwitchColor, string> = {
  accent: "bg-accent",
  neutral: "bg-foreground",
  success: "bg-success",
};

/**
 * On and off. The thumb travels on a stiff spring, state icons
 * crossfade inside the track, and a loading state pauses the
 * world while the change commits. Label and description stack
 * when you pass both.
 */
export function Switch({
  checked: controlled,
  defaultChecked,
  onCheckedChange,
  disabled,
  loading,
  color = "accent",
  size = "md",
  onIcon,
  offIcon,
  children,
  description,
  id,
  className,
}: SwitchProps) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const [uncontrolled, setUncontrolled] = useState(defaultChecked ?? false);
  const checked = controlled !== undefined ? controlled : uncontrolled;
  const s = sizes[size];
  const locked = disabled || loading;

  const toggle = () => {
    if (locked) return;
    const next = !checked;
    if (controlled === undefined) setUncontrolled(next);
    onCheckedChange?.(next);
  };

  return (
    <div className={cn("flex items-start gap-2.5", className)}>
      <button
        type="button"
        role="switch"
        id={inputId}
        aria-checked={checked}
        aria-busy={loading || undefined}
        disabled={locked}
        onClick={toggle}
        className={cn(
          "relative inline-flex shrink-0 items-center rounded-full outline-none transition-colors duration-200",
          s.track,
          checked ? trackColors[color] : "bg-fill-strong",
          locked ? "cursor-not-allowed opacity-50" : "cursor-pointer",
        )}
      >
        {/* State icons sit opposite the thumb and crossfade. */}
        {(onIcon || offIcon) && (
          <span
            aria-hidden="true"
            className={cn(
              "absolute flex items-center justify-center text-white",
              checked ? "left-[7px]" : "right-[7px]",
            )}
            style={{ width: s.icon, height: s.icon }}
          >
            <AnimatePresence initial={false} mode="wait">
              <motion.span
                key={checked ? "on" : "off"}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.12 }}
                className="absolute [&_svg]:h-full [&_svg]:w-full"
              >
                {checked ? onIcon : offIcon}
              </motion.span>
            </AnimatePresence>
          </span>
        )}
        {loading ? (
          <span
            className="absolute rounded-full"
            style={{ width: s.thumb, height: s.thumb, left: checked ? s.travel : 0 }}
          >
            <svg
              viewBox="0 0 24 24"
              className="absolute inset-0 h-full w-full animate-[pollen-spin_0.7s_linear_infinite]"
              fill="none"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.25" strokeWidth="3" />
              <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
            </svg>
          </span>
        ) : (
          <motion.span
            animate={{ x: checked ? s.travel : 0 }}
            transition={{ type: "spring", stiffness: 650, damping: 42 }}
            className={cn(
              "relative rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.25)]",
              !locked && "active:scale-95",
            )}
            style={{ width: s.thumb, height: s.thumb }}
          />
        )}
      </button>
      {(children || description) && (
        <span className="flex flex-col gap-0.5">
          {children && (
            <label
              htmlFor={inputId}
              onClick={(e) => {
                e.preventDefault();
                toggle();
              }}
              className={cn(
                "cursor-pointer select-none text-sm font-medium leading-5 text-foreground",
                locked && "cursor-not-allowed opacity-50",
              )}
            >
              {children}
            </label>
          )}
          {description && (
            <label
              htmlFor={inputId}
              onClick={(e) => {
                e.preventDefault();
                toggle();
              }}
              className={cn(
                "cursor-pointer select-none text-[13px] leading-snug text-muted-foreground",
                locked && "cursor-not-allowed opacity-50",
              )}
            >
              {description}
            </label>
          )}
        </span>
      )}
    </div>
  );
}
