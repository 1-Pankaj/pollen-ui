"use client";

import { useId, useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "../lib/utils";
import { EASE_OUT } from "../lib/motion";

export type CheckboxSize = "sm" | "md" | "lg";
export type CheckboxColor = "accent" | "neutral" | "success";

export interface CheckboxProps {
  checked?: boolean;
  defaultChecked?: boolean;
  /** Shows a dash instead of a check. */
  indeterminate?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  /** Clickable text rendered next to the box. */
  children?: ReactNode;
  /** Second line under the label. */
  description?: ReactNode;
  /** Render the label and description inside a selectable card. */
  card?: boolean;
  size?: CheckboxSize;
  color?: CheckboxColor;
  id?: string;
  className?: string;
  /** Form field name; submitted through a hidden native input. */
  name?: string;
  /** Form field value submitted when checked. Defaults to "on". */
  value?: string;
}

const sizes = {
  sm: { box: "h-4 w-4 rounded-[5px]", mark: 11, check: 10, dash: "h-0.5 w-2", text: "text-[13.5px]" },
  md: { box: "h-5 w-5 rounded-[6px]", mark: 14, check: 12, dash: "h-0.5 w-2.5", text: "text-[15px]" },
  lg: { box: "h-6 w-6 rounded-[8px]", mark: 16, check: 14, dash: "h-[3px] w-3", text: "text-base" },
} as const;

const fillColors: Record<CheckboxColor, string> = {
  accent: "bg-accent",
  neutral: "bg-foreground",
  success: "bg-success",
};

/**
 * Checkbox with a hand-drawn feel: the check mark draws itself
 * in 150ms. Sizes, three colors, a second line for context, and
 * a card mode that turns the whole row into the hit area.
 *
 * The visible control carries the keyboard and screen-reader
 * interface; a visually hidden native input carries name/value
 * so the checkbox actually participates in form submission.
 */
export function Checkbox({
  checked: controlled,
  defaultChecked,
  indeterminate,
  onCheckedChange,
  disabled,
  children,
  description,
  card,
  size = "md",
  color = "accent",
  id,
  className,
  name,
  value,
}: CheckboxProps) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const [uncontrolled, setUncontrolled] = useState(defaultChecked ?? false);
  const checked = controlled !== undefined ? controlled : uncontrolled;
  const s = sizes[size];
  const active = checked || indeterminate;

  const toggle = () => {
    if (disabled) return;
    const next = !checked;
    if (controlled === undefined) setUncontrolled(next);
    onCheckedChange?.(next);
  };

  // The submission channel: hidden from AT (the visible control is
  // the interface) and from the tab order, but present for forms.
  const formInput = (
    <input
      type="checkbox"
      name={name}
      value={value}
      checked={checked}
      readOnly
      tabIndex={-1}
      aria-hidden="true"
      className="sr-only"
    />
  );

  const box = (
    <button
      type="button"
      role="checkbox"
      id={inputId}
      aria-checked={indeterminate ? "mixed" : checked}
      aria-labelledby={card ? `${inputId}-label` : undefined}
      aria-describedby={description ? `${inputId}-description` : undefined}
      disabled={disabled}
      onClick={(e) => {
        if (card) return; // the card wrapper owns the click in card mode
        toggle();
      }}
      className={cn(
        "flex shrink-0 items-center justify-center transition-colors duration-150 outline-none focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--pollen-bg)]",
        s.box,
        active ? fillColors[color] : card ? "bg-card ring-1 ring-[var(--pollen-separator)]" : "bg-fill hover:bg-fill-strong",
        !card && !active && !disabled && "hover:bg-fill-strong",
        disabled && "cursor-not-allowed opacity-50",
      )}
      tabIndex={card ? -1 : undefined}
    >
      {indeterminate ? (
        <motion.span
          initial={{ opacity: 0, scaleX: 0.4 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.15, ease: EASE_OUT }}
          className={cn("rounded-full bg-white", s.dash)}
        />
      ) : (
        checked && (
          <svg width={s.mark} height={s.mark} viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <motion.path
              d="M2.5 6.5L5 9L9.5 3.5"
              stroke="white"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.18, ease: EASE_OUT }}
            />
          </svg>
        )
      )}
    </button>
  );

  if (card) {
    return (
      <div
        role="checkbox"
        aria-checked={indeterminate ? "mixed" : checked}
        aria-disabled={disabled || undefined}
        tabIndex={disabled ? -1 : 0}
        onClick={toggle}
        onKeyDown={(e) => {
          if (e.key === " " || e.key === "Enter") {
            e.preventDefault();
            toggle();
          }
        }}
        className={cn(
          "flex w-full cursor-pointer select-none items-start gap-3 rounded-2xl bg-card p-4 text-left outline-none transition-[box-shadow,background-color] duration-150",
          "shadow-[var(--pollen-shadow-xs)] hover:shadow-[var(--pollen-shadow-sm)]",
          "focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--pollen-bg)]",
          active && "bg-accent/[0.04] ring-1 ring-[color-mix(in_srgb,var(--pollen-accent)_28%,transparent)]",
          disabled && "pointer-events-none opacity-50",
          className,
        )}
      >
        {formInput}
        {box}
        <span className="flex min-w-0 flex-col gap-0.5">
          {children && (
            <span id={`${inputId}-label`} className={cn("font-medium leading-5 text-foreground", s.text)}>
              {children}
            </span>
          )}
          {description && (
            <span id={`${inputId}-description`} className="text-[13px] leading-snug text-muted-foreground">
              {description}
            </span>
          )}
        </span>
      </div>
    );
  }

  return (
    <div className={cn("flex items-start gap-2.5", className)}>
      {formInput}
      {box}
      {(children || description) && (
        <label
          htmlFor={inputId}
          className={cn(
            "flex cursor-pointer select-none flex-col gap-0.5",
            disabled && "cursor-not-allowed opacity-50",
          )}
        >
          {children && (
            <span className={cn("leading-6 text-foreground", s.text)}>{children}</span>
          )}
          {description && (
            <span className="text-[13px] leading-snug text-muted-foreground">{description}</span>
          )}
        </label>
      )}
    </div>
  );
}
