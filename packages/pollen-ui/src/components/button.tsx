"use client";

import {
  forwardRef,
  isValidElement,
  cloneElement,
  type ButtonHTMLAttributes,
  type ReactElement,
  type ReactNode,
} from "react";
import { cn } from "../lib/utils";
import { Spinner } from "./spinner";

export type ButtonVariant =
  | "primary"
  | "accent"
  | "secondary"
  | "outline"
  | "ghost"
  | "link"
  | "destructive";

export type ButtonSize = "sm" | "md" | "lg" | "icon";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual weight. Primary is the single high-contrast action on a view. */
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Shows a spinner, keeps the label readable, and disables interaction. */
  loading?: boolean;
  /** Swaps the label while loading. Falls back to children when unset. */
  loadingText?: string;
  /** Content rendered before the label. Icons inherit the current size. */
  leftIcon?: ReactNode;
  /** Content rendered after the label. Shifts 1px right on hover. */
  rightIcon?: ReactNode;
  /** Stretches the button to fill its container width. */
  fullWidth?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-foreground text-background shadow-[var(--pollen-shadow-xs)] hover:opacity-90 active:opacity-80",
  accent:
    "bg-accent text-white shadow-[var(--pollen-shadow-xs)] hover:opacity-90 active:opacity-80",
  secondary:
    "bg-fill text-foreground hover:bg-fill-strong active:opacity-80",
  outline:
    "bg-card shadow-[var(--pollen-shadow-sm)] hover:bg-fill active:opacity-80",
  ghost: "hover:bg-fill active:opacity-80",
  link: "bg-transparent text-accent shadow-none hover:bg-transparent hover:underline underline-offset-4 active:opacity-80",
  destructive:
    "bg-danger text-white shadow-[var(--pollen-shadow-xs)] hover:opacity-90 active:opacity-80",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-9 gap-1.5 rounded-[9px] px-3.5 text-[13px]",
  md: "h-11 gap-2 rounded-[10px] px-5 text-[15px]",
  lg: "h-12 gap-2 rounded-[11px] px-6 text-[15px]",
  icon: "h-11 w-11 rounded-[10px]",
};

/** Icons placed through leftIcon / rightIcon are sized to the button. */
function slotIcon(node: ReactNode, size: ButtonSize): ReactNode {
  if (!node || size === "icon") return node;
  if (isValidElement(node)) {
    const el = node as ReactElement<{ className?: string }>;
    const hasSize = /h-\d|w-\d|h-\[|w-\[/.test(el.props.className ?? "");
    if (!hasSize) {
      return cloneElement(el, {
        className: cn("h-4 w-4 shrink-0", el.props.className),
      });
    }
  }
  return node;
}

/**
 * The primary way to trigger an action. Presses scale to 0.98
 * so the button visibly responds the moment it is touched.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      loading,
      loadingText,
      leftIcon,
      rightIcon,
      fullWidth,
      disabled,
      children,
      type,
      ...props
    },
    ref,
  ) => {
    const label = loading && loadingText !== undefined ? loadingText : children;
    const showLeft = size !== "icon" && slotIcon(leftIcon, size);
    const showRight = size !== "icon" && slotIcon(rightIcon, size);

    return (
      <button
        ref={ref}
        type={type ?? "button"}
        disabled={disabled || loading}
        className={cn(
          "group/btn inline-flex select-none items-center justify-center whitespace-nowrap font-medium transition-[background-color,border-color,opacity,transform,box-shadow] duration-150 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50",
          variantClasses[variant],
          sizeClasses[size],
          fullWidth && "w-full",
          className,
        )}
        {...props}
      >
        {loading ? (
          <Spinner size={size === "sm" ? 14 : 16} className="shrink-0 text-current" />
        ) : (
          showLeft
        )}
        {label}
        {showRight && (
          <span className="inline-flex shrink-0 transition-transform duration-150 group-hover/btn:translate-x-0.5">
            {showRight}
          </span>
        )}
      </button>
    );
  },
);

Button.displayName = "Button";
