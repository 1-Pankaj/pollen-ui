"use client";

import {
  forwardRef,
  useId,
  useState,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "../lib/utils";
import { Spinner } from "./spinner";
import { IconEye, IconEyeOff } from "../icons";

export type FieldSize = "sm" | "md" | "lg";
export type FieldVariant = "fill" | "outline" | "underline" | "ghost";
export type FieldShape = "default" | "pill";

export interface InputProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "size" | "prefix"
  > {
  /** Leading icon, muted by default. */
  icon?: ReactNode;
  /** Trailing content such as a unit or a keyboard hint. */
  suffix?: ReactNode;
  /** Static content before the typed value, e.g. "https://". */
  prefix?: ReactNode;
  /** Turns the fill and focus ring red, swaps the helper for the error. */
  invalid?: boolean;
  /** Turns the fill and focus ring green. Ignored when invalid is set. */
  valid?: boolean;
  /** Green helper line under the field; pairs with `valid`. */
  successText?: ReactNode;
  /** Control height. sm pairs with dense toolbars, lg with marketing pages. */
  size?: FieldSize;
  /** Visual treatment. fill is the Pollen default; outline for forms on white; underline for inline editing; ghost for toolbars. */
  variant?: FieldVariant;
  /** "pill" fully rounds the field for search-style inputs. Ignored by the underline variant. */
  shape?: FieldShape;
  /** Renders a clear button once the field has content. */
  clearable?: boolean;
  /** Shows a spinner in place of the clear button while work is in flight. */
  loading?: boolean;
  /** With type="password", adds an eye toggle that reveals the value. */
  passwordToggle?: boolean;
  /** Label rendered above the field. */
  label?: ReactNode;
  /** Quiet helper line under the field. Replaced by errorText when invalid. */
  helperText?: ReactNode;
  /** Red helper line under the field; pairs with `invalid`. */
  errorText?: ReactNode;
  /** Show "n / maxLength" under the field when maxLength is set. */
  charCount?: boolean;
  /** Called after the field is emptied through the clear button. */
  onClear?: () => void;
}

const sizeClasses: Record<FieldSize, string> = {
  sm: "h-9 rounded-[9px] px-3 text-sm",
  md: "h-11 rounded-[10px] px-3.5 text-[15px]",
  lg: "h-12 rounded-[11px] px-4 text-[15px]",
};

const variantClasses: Record<FieldVariant, string> = {
  fill:
    "bg-fill hover:bg-fill-strong focus:bg-card focus-visible:ring-[3px] focus-visible:ring-accent/20",
  outline:
    "bg-card border border-[var(--pollen-border)] shadow-[var(--pollen-shadow-xs)] hover:border-[var(--pollen-border-strong)] focus-visible:ring-[3px] focus-visible:ring-accent/20 focus:border-[var(--pollen-accent)]",
  underline:
    "bg-transparent rounded-none border-b border-[var(--pollen-border)] px-0 hover:border-[var(--pollen-border-strong)] focus:border-[var(--pollen-accent)] focus-visible:shadow-none",
  ghost:
    "bg-transparent hover:bg-fill focus:bg-fill focus-visible:ring-[3px] focus-visible:ring-accent/15",
};

const shapeClasses: Record<FieldShape, string> = {
  default: "",
  pill: "rounded-full",
};

/**
 * Single-line text field with real product polish: four visual
 * variants, an optional pill shape for search-style fields, an
 * optional label and helper or error line, a live character count,
 * a password reveal, prefix slots and the clear / loading
 * affordances. Focus rings the field with the accent colour; that
 * is the only decoration.
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      icon,
      suffix,
      prefix,
      invalid,
      valid,
      successText,
      size = "md",
      variant = "fill",
      shape = "default",
      clearable,
      loading,
      passwordToggle,
      label,
      helperText,
      errorText,
      charCount,
      id,
      defaultValue,
      value: controlledValue,
      onChange,
      maxLength,
      type,
      ...props
    },
    ref,
  ) => {
    const autoId = useId();
    const inputId = id ?? autoId;
    const helperId = `${inputId}-desc`;
    const [uncontrolled, setUncontrolled] = useState(
      defaultValue !== undefined ? String(defaultValue) : "",
    );
    const [revealed, setRevealed] = useState(false);
    const isControlled = controlledValue !== undefined;
    const currentValue = isControlled
      ? String(controlledValue ?? "")
      : uncontrolled;
    const showClear =
      clearable && !loading && currentValue.length > 0 && !props.disabled;
    const isPassword = type === "password" && passwordToggle;
    const rightAddon = loading
      ? "spinner"
      : showClear
        ? "clear"
        : isPassword
          ? "reveal"
          : suffix
            ? "suffix"
            : null;

    const update = (next: string) => {
      if (!isControlled) setUncontrolled(next);
    };

    const input = (
      <input
        ref={ref}
        id={inputId}
        maxLength={maxLength}
        value={controlledValue}
        defaultValue={isControlled ? undefined : defaultValue}
        onChange={(e) => {
          update(e.target.value);
          onChange?.(e);
        }}
        aria-describedby={
          errorText || successText || helperText || charCount
            ? helperId
            : undefined
        }
        className={cn(
          "w-full outline-none transition-[background-color,border-color,box-shadow] duration-150 placeholder:text-faint disabled:cursor-not-allowed disabled:opacity-50",
          // 16px on touch pointers keeps iOS Safari from focus-zooming.
          "pointer-coarse:text-base",
          // Underline keeps its own padding; the rest share the size scale.
          variant === "underline"
            ? cn("pb-1.5 pt-0", size === "sm" ? "text-sm" : "text-[15px]")
            : sizeClasses[size],
          variantClasses[variant],
          shape === "pill" && variant !== "underline" && shapeClasses.pill,
          icon && variant !== "underline" && "pl-9",
          icon && variant === "underline" && "pl-6",
          prefix && variant !== "underline" && "pl-[4.2rem]",
          (rightAddon || isPassword) && variant !== "underline" && "pr-9",
          invalid &&
            variant === "fill" &&
            "bg-danger/[0.08] hover:bg-danger/[0.12] focus:bg-card focus-visible:ring-danger/25",
          invalid &&
            variant === "outline" &&
            "border-danger hover:border-danger focus-visible:ring-danger/25",
          invalid && variant === "underline" && "border-danger",
          invalid &&
            variant === "ghost" &&
            "text-danger focus-visible:ring-danger/20",
          valid &&
            !invalid &&
            variant === "fill" &&
            "bg-success/[0.08] hover:bg-success/[0.12] focus:bg-card focus-visible:ring-success/25",
          valid &&
            !invalid &&
            variant === "outline" &&
            "border-success hover:border-success focus:border-success focus-visible:ring-success/25",
          valid && !invalid && variant === "underline" && "border-success",
          valid &&
            !invalid &&
            variant === "ghost" &&
            "text-success-ink focus-visible:ring-success/20",
          className,
        )}
        aria-invalid={invalid || undefined}
        type={isPassword ? (revealed ? "text" : "password") : type}
        {...props}
      />
    );

    const field = prefix ? (
      <div
        className={cn(
          "flex w-full items-center overflow-hidden",
          variant === "outline" || variant === "fill"
            ? sizeClasses[size]
            : "border-b border-[var(--pollen-border)]",
          shape === "pill" && variant !== "underline" && shapeClasses.pill,
          variant === "outline" &&
            "border bg-card shadow-[var(--pollen-shadow-xs)] focus-within:border-[var(--pollen-accent)] focus-within:ring-[3px] focus-within:ring-accent/20",
          variant === "fill" && "bg-fill focus-within:bg-card focus-within:ring-[3px] focus-within:ring-accent/20",
          invalid && "border-danger",
        )}
      >
        <span
          className={cn(
            "flex h-full shrink-0 select-none items-center border-r border-[var(--pollen-border)] bg-fill/60 pr-2.5 text-muted-foreground",
            variant === "fill" && "bg-transparent",
            variant === "fill" && "border-r-0 pr-0.5",
          )}
        >
          {prefix}
        </span>
        {input}
      </div>
    ) : (
      input
    );

    const desc =
      invalid && errorText ? (
        <span className="text-danger">{errorText}</span>
      ) : valid && !invalid && successText ? (
        <span className="text-success-ink">{successText}</span>
      ) : helperText ? (
        <span>{helperText}</span>
      ) : charCount && maxLength ? (
        <span className="tabular-nums">
          {currentValue.length} / {maxLength}
        </span>
      ) : null;

    const withChrome = (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="mb-1.5 block text-[13px] font-medium text-foreground"
          >
            {label}
          </label>
        )}
        <div className="relative w-full">
          {icon && (
            <span
              className={cn(
                "pointer-events-none absolute top-1/2 -translate-y-1/2 text-faint [&_svg]:h-4 [&_svg]:w-4",
                variant === "underline" ? "left-0" : "left-3",
              )}
            >
              {icon}
            </span>
          )}
          {field}
          {rightAddon && variant !== "underline" && (
            <span className="absolute right-2.5 top-1/2 flex -translate-y-1/2 items-center text-faint [&_svg]:h-4 [&_svg]:w-4">
              {rightAddon === "spinner" ? (
                <Spinner size={15} className="mr-0.5 text-muted-foreground" />
              ) : rightAddon === "clear" ? (
                <button
                  type="button"
                  aria-label="Clear field"
                  onClick={() => {
                    update("");
                    const input = document.getElementById(inputId);
                    if (input instanceof HTMLInputElement) {
                      const setter = Object.getOwnPropertyDescriptor(
                        window.HTMLInputElement.prototype,
                        "value",
                    )?.set;
                      setter?.call(input, "");
                      input.dispatchEvent(
                        new Event("input", { bubbles: true }),
                      );
                      input.focus();
                    }
                    props.onClear?.();
                  }}
                  className="flex h-6 w-6 items-center justify-center rounded-md text-faint transition-colors hover:bg-fill hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-accent/20 outline-none pointer-coarse:before:absolute pointer-coarse:before:-inset-2 pointer-coarse:before:content-['']"
                >
                  <svg
                    viewBox="0 0 16 16"
                    fill="none"
                    className="h-3.5 w-3.5"
                    aria-hidden="true"
                  >
                    <path
                      d="M4 4l8 8M12 4l-8 8"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              ) : rightAddon === "reveal" ? (
                <button
                  type="button"
                  aria-label={revealed ? "Hide password" : "Show password"}
                  aria-pressed={revealed}
                  onClick={() => setRevealed((r) => !r)}
                  className="flex h-6 w-6 items-center justify-center rounded-md text-faint transition-colors hover:bg-fill hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-accent/20 outline-none pointer-coarse:before:absolute pointer-coarse:before:-inset-2 pointer-coarse:before:content-['']"
                >
                  {revealed ? (
                    <IconEyeOff className="h-4 w-4" />
                  ) : (
                    <IconEye className="h-4 w-4" />
                  )}
                </button>
              ) : (
                suffix
              )}
            </span>
          )}
        </div>
        {(desc || (charCount && maxLength)) && (
          <div
            id={helperId}
            className="mt-1.5 flex items-center justify-between gap-3 text-[12.5px] leading-snug text-muted-foreground"
          >
            {desc ?? <span />}
            {charCount && maxLength && desc && (
              <span className="tabular-nums">
                {currentValue.length} / {maxLength}
              </span>
            )}
          </div>
        )}
      </div>
    );

    return withChrome;
  },
);

Input.displayName = "Input";
