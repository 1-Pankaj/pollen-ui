"use client";

import {
  createContext,
  useContext,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { motion } from "framer-motion";
import { cn } from "../lib/utils";
import { spring } from "../lib/motion";

interface RadioGroupContextValue {
  value: string | undefined;
  setValue: (value: string) => void;
  name: string;
  focusNext: (current: HTMLElement, dir: 1 | -1) => void;
}

const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);

export interface RadioGroupProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  children: ReactNode;
  className?: string;
  "aria-label"?: string;
}

/** Group of Radio items. Arrow keys move between options. */
export function RadioGroup({
  value: controlled,
  defaultValue,
  onValueChange,
  children,
  className,
  ...aria
}: RadioGroupProps) {
  const [uncontrolled, setUncontrolled] = useState(defaultValue);
  const value = controlled !== undefined ? controlled : uncontrolled;
  const name = useId();
  const groupRef = useRef<HTMLDivElement>(null);

  const focusNext = (current: HTMLElement, dir: 1 | -1) => {
    const radios = Array.from(
      groupRef.current?.querySelectorAll<HTMLButtonElement>('[role="radio"]') ?? [],
    );
    const enabled = radios.filter((r) => !r.disabled);
    if (enabled.length === 0) return;
    const index = enabled.indexOf(current as HTMLButtonElement);
    const next = enabled[(index + dir + enabled.length) % enabled.length];
    next?.focus();
    next?.click();
  };

  return (
    <div
      ref={groupRef}
      role="radiogroup"
      className={cn("flex flex-col gap-2.5", className)}
      {...aria}
    >
      <RadioGroupContext.Provider
        value={{
          value,
          setValue: (v) => {
            setUncontrolled(v);
            onValueChange?.(v);
          },
          name,
          focusNext,
        }}
      >
        {children}
      </RadioGroupContext.Provider>
    </div>
  );
}

export interface RadioProps {
  value: string;
  /** Clickable text rendered next to the circle. */
  children?: ReactNode;
  disabled?: boolean;
  id?: string;
  className?: string;
}

export function Radio({ value, children, disabled, id, className }: RadioProps) {
  const ctx = useContext(RadioGroupContext);
  const autoId = useId();
  const inputId = id ?? autoId;
  if (!ctx) {
    throw new Error("Radio must be used inside a RadioGroup");
  }
  const checked = ctx.value === value;

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "ArrowDown" || e.key === "ArrowRight") {
      e.preventDefault();
      ctx.focusNext(e.currentTarget, 1);
    } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
      e.preventDefault();
      ctx.focusNext(e.currentTarget, -1);
    }
  };

  return (
    <div className={cn("flex items-start gap-2.5", className)}>
      {/* Submission channel: hidden native radio carrying name/value. */}
      <input
        type="radio"
        name={ctx.name}
        value={value}
        checked={checked}
        readOnly
        tabIndex={-1}
        aria-hidden="true"
        className="sr-only"
      />
      <button
        type="button"
        role="radio"
        id={inputId}
        aria-checked={checked}
        disabled={disabled}
        onClick={() => ctx.setValue(value)}
        onKeyDown={onKeyDown}
        tabIndex={checked || ctx.value === undefined ? 0 : -1}
        className={cn(
          "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full transition-colors duration-150 outline-none focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--pollen-bg)]",
          checked
            ? "bg-foreground"
            : "bg-fill hover:bg-fill-strong",
          disabled && "cursor-not-allowed opacity-50",
        )}
      >
        {checked && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={spring.snappy}
            className="h-2 w-2 rounded-full bg-background"
          />
        )}
      </button>
      {children && (
        <label
          htmlFor={inputId}
          className={cn(
            "cursor-pointer select-none text-[15px] leading-6 text-foreground",
            disabled && "cursor-not-allowed opacity-50",
          )}
        >
          {children}
        </label>
      )}
    </div>
  );
}
