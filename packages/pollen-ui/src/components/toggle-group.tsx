"use client";

import {
  createContext,
  forwardRef,
  useContext,
  useRef,
  useState,
  type KeyboardEvent,
  type MutableRefObject,
  type ReactNode,
} from "react";
import { cn } from "../lib/utils";

export type ToggleGroupType = "single" | "multiple";

export interface ToggleGroupProps {
  /** single keeps one value; multiple keeps a set. */
  type?: ToggleGroupType;
  /** Controlled selected value(s). */
  value?: string | string[];
  /** Uncontrolled initial value(s). */
  defaultValue?: string | string[];
  onValueChange?: (value: string | string[]) => void;
  /** Renders the group as a connected pill row instead of separate chips. */
  variant?: "chips" | "connected";
  size?: "sm" | "md";
  disabled?: boolean;
  "aria-label"?: string;
  className?: string;
  children?: ReactNode;
}

export interface ToggleItemProps {
  value: string;
  /** Leading content, usually a small icon. */
  children?: ReactNode;
  disabled?: boolean;
  className?: string;
}

interface GroupContextValue {
  selected: string[];
  toggle: (value: string) => void;
  variant: "chips" | "connected";
  size: "sm" | "md";
  disabled: boolean;
  /** single behaves like a radio group; multiple like a checkbox set. */
  type: "single" | "multiple";
  refs: MutableRefObject<Map<string, HTMLButtonElement>>;
}

const GroupContext = createContext<GroupContextValue | null>(null);

function useGroupContext(): GroupContextValue {
  const ctx = useContext(GroupContext);
  if (!ctx) throw new Error("ToggleGroupItem must be used inside ToggleGroup");
  return ctx;
}

/**
 * A row of toggle buttons. The selection lives in one element with
 * roving tab index, so keyboard users tab once and arrow through.
 */
export const ToggleGroup = Object.assign(
  forwardRef<HTMLDivElement, ToggleGroupProps>(function ToggleGroup(
    {
      type = "single",
      value: controlled,
      defaultValue,
      onValueChange,
      variant = "chips",
      size = "md",
      disabled = false,
      className,
      children,
      ...props
    },
    ref,
  ) {
    const [uncontrolled, setUncontrolled] = useState<string[]>(
      () => (defaultValue === undefined ? [] : Array.isArray(defaultValue) ? defaultValue : [defaultValue]),
    );
    const selected = controlled === undefined ? uncontrolled : Array.isArray(controlled) ? controlled : [controlled];
    const refs = useRef<Map<string, HTMLButtonElement>>(new Map());

    const setValue = (next: string[]) => {
      if (controlled === undefined) setUncontrolled(next);
      onValueChange?.(type === "single" ? next[0] ?? "" : next);
    };

    const toggle = (value: string) => {
      if (disabled) return;
      if (type === "single") {
        setValue(selected.includes(value) ? [] : [value]);
      } else {
        setValue(selected.includes(value) ? selected.filter((v) => v !== value) : [...selected, value]);
      }
    };

    const onKeyNav = (e: KeyboardEvent<HTMLDivElement>) => {
      if (
        e.key !== "ArrowRight" &&
        e.key !== "ArrowLeft" &&
        e.key !== "ArrowDown" &&
        e.key !== "ArrowUp"
      )
        return;
      e.preventDefault();
      const buttons = Array.from(refs.current.entries()).filter(
        ([, el]) => !el.disabled,
      );
      if (buttons.length === 0) return;
      const current = buttons.findIndex(([v]) => v === document.activeElement?.getAttribute("data-value"));
      const dir = e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : -1;
      const next = buttons[(current + dir + buttons.length) % buttons.length];
      next[1].focus();
    };

    const single = type === "single";
    return (
      <GroupContext.Provider value={{ selected, toggle, variant, size, disabled, type, refs }}>
        <div
          ref={ref}
          role={single ? "radiogroup" : "group"}
          onKeyDown={onKeyNav}
          className={cn(
            "flex items-center",
            variant === "connected" && "rounded-[11px] bg-fill p-1",
            variant === "chips" && "gap-2",
            className,
          )}
          {...props}
        >
          {children}
        </div>
      </GroupContext.Provider>
    );
  }),
  { displayName: "ToggleGroup" },
);

export const ToggleGroupItem = forwardRef<HTMLButtonElement, ToggleItemProps>(
  function ToggleGroupItem({ value, children, disabled, className, ...props }, ref) {
    const { selected, toggle, variant, size, disabled: groupDisabled, type, refs } = useGroupContext();
    const isOn = selected.includes(value);
    const itemDisabled = disabled || groupDisabled;
    const sizeClasses = size === "sm" ? "h-8 px-3 text-[13px]" : "h-9 px-3.5 text-sm";

    return (
      <button
        ref={(el) => {
          if (el) refs.current.set(value, el);
          else refs.current.delete(value);
          if (typeof ref === "function") ref(el);
        }}
        type="button"
        data-value={value}
        role={type === "single" ? "radio" : "checkbox"}
        aria-checked={isOn}
        disabled={itemDisabled}
        tabIndex={isOn || selected.length === 0 ? 0 : -1}
        onClick={() => toggle(value)}
        className={cn(
          "inline-flex select-none items-center justify-center gap-1.5 whitespace-nowrap rounded-[9px] font-medium transition-[background-color,box-shadow,transform] duration-150 outline-none focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--pollen-bg)] active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50",
          sizeClasses,
          variant === "connected"
            ? isOn
              ? "bg-card text-foreground shadow-[var(--pollen-shadow-xs)]"
              : "text-muted-foreground hover:text-foreground"
            : isOn
              ? "bg-fill-strong text-foreground shadow-[var(--pollen-shadow-xs)]"
              : "bg-fill/70 text-muted-foreground hover:bg-fill hover:text-foreground",
          className,
        )}
        {...props}
      >
        {children}
      </button>
    );
  },
);

ToggleGroupItem.displayName = "ToggleGroupItem";
