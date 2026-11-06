"use client";

import { forwardRef, useEffect, useRef, useState, type ClipboardEvent, type KeyboardEvent } from "react";
import { cn } from "../lib/utils";

export interface OTPInputProps {
  /** Number of digits. */
  length?: number;
  /** Controlled value as a string of digits (or characters). */
  value?: string;
  /** Uncontrolled starting value. */
  defaultValue?: string;
  /** Fires with the full string on every change; empty string when cleared. */
  onChange?: (value: string) => void;
  /** Fires once the last box is filled. */
  onComplete?: (value: string) => void;
  /** Accept letters as well as digits. */
  alphanumeric?: boolean;
  disabled?: boolean;
  invalid?: boolean;
  size?: "sm" | "md" | "lg";
  autoFocus?: boolean;
  "aria-label"?: string;
  className?: string;
}

const sizeClasses = {
  sm: "h-9 w-8 text-sm rounded-[9px] pointer-coarse:text-base",
  md: "h-11 w-10 text-base rounded-[10px]",
  lg: "h-14 w-12 text-xl rounded-[12px]",
} as const;

const CHAR_RE = {
  digit: /[0-9]/,
  alnum: /[0-9a-zA-Z]/,
} as const;

/**
 * One box per character, for verification codes. Typing advances,
 * backspace retreats, and pasting a code fills the boxes from the
 * start. The whole group is a single labelled input group with
 * arrow key navigation.
 */
export const OTPInput = forwardRef<HTMLDivElement, OTPInputProps>(
  function OTPInput(
    {
      length = 6,
      value: controlled,
      defaultValue = "",
      onChange,
      onComplete,
      alphanumeric = false,
      disabled,
      invalid,
      size = "md",
      autoFocus,
      "aria-label": ariaLabel = "Verification code",
      className,
    },
    ref,
  ) {
    const [uncontrolled, setUncontrolled] = useState(defaultValue);
    const value = controlled !== undefined ? controlled : uncontrolled;
    const boxes = useRef<Array<HTMLInputElement | null>>([]);
    const filled = new Array(length)
      .fill(0)
      .map((_, i) => value[i] ?? "")
      .slice(0, length);

    const setValue = (next: string) => {
      if (controlled === undefined) setUncontrolled(next);
      onChange?.(next);
      if (next.length === length) onComplete?.(next);
    };

    useEffect(() => {
      if (autoFocus) boxes.current[0]?.focus();
    }, []);

    const setCharAt = (index: number, char: string) => {
      const chars = filled.slice();
      chars[index] = char;
      setValue(chars.join("").slice(0, length));
    };

    const handleInput = (index: number, raw: string) => {
      const re = alphanumeric ? CHAR_RE.alnum : CHAR_RE.digit;
      const chars = Array.from(raw).filter((c) => re.test(c));
      if (chars.length === 0) return;
      if (chars.length > 1) {
        // Pasted or fast-typed run: fill from the start of the group.
        setValue(chars.slice(0, length).join(""));
        boxes.current[Math.min(chars.length, length - 1)]?.focus();
        return;
      }
      setCharAt(index, chars[0]);
      if (index < length - 1) boxes.current[index + 1]?.focus();
    };

    const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Backspace") {
        e.preventDefault();
        if (filled[index]) {
          setCharAt(index, "");
        } else if (index > 0) {
          setCharAt(index - 1, "");
          boxes.current[index - 1]?.focus();
        }
      } else if (e.key === "ArrowLeft" && index > 0) {
        e.preventDefault();
        boxes.current[index - 1]?.focus();
      } else if (e.key === "ArrowRight" && index < length - 1) {
        e.preventDefault();
        boxes.current[index + 1]?.focus();
      }
    };

    const handleGroupKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
      const target = e.target as HTMLInputElement;
      if (!target.dataset.index) return;
      handleKeyDown(Number(target.dataset.index), e as unknown as KeyboardEvent<HTMLInputElement>);
    };

    const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
      e.preventDefault();
      handleInput(0, e.clipboardData.getData("text").trim());
    };

    return (
      <div
        ref={ref}
        role="group"
        aria-label={ariaLabel}
        className={cn("flex items-center gap-2", className)}
        onKeyDown={handleGroupKeyDown}
      >
        {filled.map((char, i) => (
          <input
            key={i}
            ref={(el) => {
              boxes.current[i] = el;
            }}
            data-index={i}
            type="text"
            inputMode={alphanumeric ? "text" : "numeric"}
            autoComplete={i === 0 ? "one-time-code" : "off"}
            aria-label={`${ariaLabel} character ${i + 1}`}
            aria-invalid={invalid || undefined}
            value={char}
            disabled={disabled}
            onChange={(e) => handleInput(i, e.target.value)}
            onPaste={handlePaste}
            onFocus={(e) => e.currentTarget.select()}
            className={cn(
              "w-full shrink-0 bg-fill text-center font-mono outline-none transition-[background-color,box-shadow] duration-150 placeholder:text-faint hover:bg-fill-strong focus:bg-card focus-visible:ring-[3px] focus-visible:ring-accent/25 disabled:cursor-not-allowed disabled:opacity-50",
              sizeClasses[size],
              invalid &&
                "bg-danger/[0.08] hover:bg-danger/[0.12] focus:bg-card focus-visible:ring-danger/25",
            )}
          />
        ))}
      </div>
    );
  },
);

OTPInput.displayName = "OTPInput";
