"use client";

import {
  forwardRef,
  useCallback,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
  type TextareaHTMLAttributes,
} from "react";
import { cn } from "../lib/utils";
import type { FieldSize } from "./input";

export type TextareaVariant = "fill" | "outline" | "underline" | "ghost";
/** Corner resize handle. autoGrow implies "none". */
export type TextareaResize = "none" | "vertical";

export interface TextareaProps
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "onInput"> {
  invalid?: boolean;
  /** Turns the fill and focus ring green. ignored when invalid is set. */
  valid?: boolean;
  /** Green helper line under the field; pairs with `valid`. */
  successText?: ReactNode;
  /** Control height. sm pairs with dense toolbars, lg with marketing pages. */
  size?: FieldSize;
  /** Visual treatment. fill is the Pollen default; outline for forms on white; underline for inline editing; ghost for quiet surfaces. */
  variant?: TextareaVariant;
  /** Corner resize handle. Defaults to "vertical"; autoGrow implies "none". */
  resize?: TextareaResize;
  /** Label rendered above the field. */
  label?: ReactNode;
  /** Quiet helper line under the field. Replaced by errorText when invalid. */
  helperText?: ReactNode;
  /** Red helper line under the field; pairs with `invalid`. */
  errorText?: ReactNode;
  /** Show "n / maxLength" under the field when maxLength is set. */
  charCount?: boolean;
  /** Grows with content instead of scrolling, up to max-height. Disables the corner resize handle. */
  autoGrow?: boolean;
  /** Called on every input event while the user types. */
  onInput?: TextareaHTMLAttributes<HTMLTextAreaElement>["onInput"];
}

const sizeClasses: Record<FieldSize, string> = {
  sm: "min-h-[76px] rounded-[9px] px-3 py-2.5 text-sm",
  md: "min-h-[96px] rounded-[10px] px-3.5 py-3 text-[15px]",
  lg: "min-h-[120px] rounded-[11px] px-4 py-3.5 text-[15px]",
};

const variantClasses: Record<TextareaVariant, string> = {
  fill:
    "bg-fill hover:bg-fill-strong focus:bg-card focus-visible:ring-[3px] focus-visible:ring-accent/20",
  outline:
    "bg-card border border-[var(--pollen-border)] shadow-[var(--pollen-shadow-xs)] hover:border-[var(--pollen-border-strong)] focus-visible:ring-[3px] focus-visible:ring-accent/20 focus:border-[var(--pollen-accent)]",
  underline:
    "bg-transparent rounded-none border-b border-[var(--pollen-border)] px-0 hover:border-[var(--pollen-border-strong)] focus:border-[var(--pollen-accent)] focus-visible:shadow-none",
  ghost:
    "bg-transparent hover:bg-fill focus:bg-fill focus-visible:ring-[3px] focus-visible:ring-accent/15",
};

/**
 * Multi-line text field. Shares the Input API — label and helper or
 * error and success lines, a live character count, four visual
 * variants — and can grow with its content through autoGrow.
 * Grows with content up to max-height.
 */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      invalid,
      valid,
      successText,
      size = "md",
      variant = "fill",
      resize = "vertical",
      label,
      helperText,
      errorText,
      charCount,
      autoGrow,
      id,
      defaultValue,
      value,
      maxLength,
      onChange,
      onInput,
      ...props
    },
    ref,
  ) => {
    const autoId = useId();
    const inputId = id ?? autoId;
    const helperId = `${inputId}-desc`;
    const innerRef = useRef<HTMLTextAreaElement | null>(null);
    const [uncontrolledLen, setUncontrolledLen] = useState(
      defaultValue !== undefined ? String(defaultValue).length : 0,
    );
    const isControlled = value !== undefined;
    const currentLen = isControlled
      ? String(value ?? "").length
      : uncontrolledLen;

    const setRef = useCallback(
      (node: HTMLTextAreaElement | null) => {
        innerRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
      },
      [ref],
    );

    const grow = useCallback(() => {
      const el = innerRef.current;
      if (!el) return;
      el.style.height = "auto";
      el.style.height = `${el.scrollHeight}px`;
    }, []);

    useLayoutEffect(() => {
      if (autoGrow) grow();
    }, [autoGrow, grow, value, defaultValue]);

    const showDesc = Boolean(
      (invalid && errorText) ||
        (valid && !invalid && successText) ||
        helperText ||
        (charCount && maxLength),
    );

    const field = (
      <textarea
        ref={setRef}
        id={inputId}
        maxLength={maxLength}
        value={value}
        defaultValue={isControlled ? undefined : defaultValue}
        onChange={(e) => {
          if (charCount) setUncontrolledLen(e.target.value.length);
          onChange?.(e);
        }}
        onInput={(e) => {
          if (autoGrow) grow();
          onInput?.(e);
        }}
        aria-describedby={showDesc ? helperId : undefined}
        className={cn(
          "w-full resize-y outline-none transition-[background-color,border-color,box-shadow] duration-150 placeholder:text-faint disabled:cursor-not-allowed disabled:opacity-50",
          // 16px on touch pointers keeps iOS Safari from focus-zooming.
          "pointer-coarse:text-base",
          sizeClasses[size],
          variantClasses[variant],
          resize === "none" && "resize-none",
          autoGrow && "resize-none",
          // Underline stays transparent and signals state through the
          // border only, mirroring Input.
          invalid &&
            variant !== "underline" &&
            "bg-danger/[0.08] hover:bg-danger/[0.12] focus:bg-card focus-visible:ring-danger/25",
          invalid &&
            (variant === "outline" || variant === "underline") &&
            "border-danger hover:border-danger focus:border-danger",
          valid &&
            !invalid &&
            variant !== "underline" &&
            "bg-success/[0.08] hover:bg-success/[0.12] focus:bg-card focus-visible:ring-success/25",
          valid &&
            !invalid &&
            (variant === "outline" || variant === "underline") &&
            "border-success hover:border-success focus:border-success",
          className,
        )}
        aria-invalid={invalid || undefined}
        {...props}
      />
    );

    if (!label && !showDesc) return field;

    const desc =
      invalid && errorText ? (
        <span className="text-danger">{errorText}</span>
      ) : valid && !invalid && successText ? (
        <span className="text-success-ink">{successText}</span>
      ) : helperText ? (
        <span>{helperText}</span>
      ) : charCount && maxLength ? (
        <span className="tabular-nums">
          {currentLen} / {maxLength}
        </span>
      ) : null;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="mb-1.5 block text-[13px] font-medium text-foreground"
          >
            {label}
          </label>
        )}
        {field}
        {showDesc && (
          <div
            id={helperId}
            className="mt-1.5 flex items-center justify-between gap-3 text-[12.5px] leading-snug text-muted-foreground"
          >
            {desc ?? <span />}
            {charCount && maxLength && desc && (
              <span className="tabular-nums">
                {currentLen} / {maxLength}
              </span>
            )}
          </div>
        )}
      </div>
    );
  },
);

Textarea.displayName = "Textarea";
