"use client";

import {
  createContext,
  useContext,
  useId,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "../lib/utils";
import { spring } from "../lib/motion";

export type TabsVariant = "enclosed" | "line";

interface TabsContextValue {
  value: string;
  setValue: (value: string) => void;
  layoutId: string;
  /** Stable id base wiring trigger/panel pairs for aria-controls. */
  baseId: string;
  variant: TabsVariant;
}

const TabsContext = createContext<TabsContextValue | null>(null);

export interface TabsProps {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  variant?: TabsVariant;
  children: ReactNode;
  className?: string;
}

/**
 * Tabs with a shared indicator that glides between triggers.
 * The enclosed style uses a floating pill; the line style uses
 * an underline, like documentation sites.
 */
export function Tabs({
  defaultValue,
  value: controlled,
  onValueChange,
  variant = "enclosed",
  children,
  className,
}: TabsProps) {
  const [uncontrolled, setUncontrolled] = useState(defaultValue ?? "");
  const value = controlled !== undefined ? controlled : uncontrolled;
  const layoutId = useId();
  const baseId = useId();

  return (
    <TabsContext.Provider
      value={{
        value,
        setValue: (v) => {
          setUncontrolled(v);
          onValueChange?.(v);
        },
        layoutId,
        baseId,
        variant,
      }}
    >
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
}

export function TabsList({
  children,
  className,
  "aria-label": ariaLabel,
}: {
  children: ReactNode;
  className?: string;
  "aria-label"?: string;
}) {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error("TabsList must be used inside Tabs");

  const onKeyDown = (e: KeyboardEvent) => {
    const triggers = Array.from(
      e.currentTarget.querySelectorAll<HTMLButtonElement>('[role="tab"]'),
    );
    const index = triggers.indexOf(document.activeElement as HTMLButtonElement);
    if (index < 0) return;
    if (e.key === "Home" || e.key === "End") {
      e.preventDefault();
      const target = e.key === "Home" ? triggers[0] : triggers[triggers.length - 1];
      if (target && !target.disabled) {
        target.focus();
        target.click();
      }
      return;
    }
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const dir = e.key === "ArrowRight" ? 1 : -1;
    // Walk until an enabled trigger turns up; disabled ones are skipped.
    for (let step = 1; step <= triggers.length; step++) {
      const wrapped = (((index + dir * step) % triggers.length) + triggers.length) % triggers.length;
      const next = triggers[wrapped];
      if (next && !next.disabled) {
        next.focus();
        next.click();
        break;
      }
    }
  };

  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      onKeyDown={onKeyDown}
      className={cn(
        ctx.variant === "enclosed"
          ? "inline-flex items-center gap-1 rounded-lg bg-fill p-1"
          : "flex items-center gap-6",
        className,
      )}
    >
      {children}
    </div>
  );
}

export interface TabsTriggerProps {
  value: string;
  children: ReactNode;
  disabled?: boolean;
  className?: string;
}

export function TabsTrigger({
  value,
  children,
  disabled,
  className,
}: TabsTriggerProps) {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error("TabsTrigger must be used inside Tabs");
  const isActive = ctx.value === value;
  const reduce = useReducedMotion();
  const triggerProps = {
    type: "button" as const,
    role: "tab" as const,
    id: `${ctx.baseId}-tab-${value}`,
    "aria-controls": `${ctx.baseId}-panel-${value}`,
    "aria-selected": isActive,
    disabled,
    onClick: () => ctx.setValue(value),
  };

  if (ctx.variant === "enclosed") {
    return (
      <button
        {...triggerProps}
        className={cn(
          "relative rounded-md px-3 py-1.5 text-sm font-medium outline-none transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-accent/40 disabled:pointer-events-none disabled:opacity-50",
          isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground",
          className,
        )}
      >
        {isActive && (
          <motion.span
            layoutId={ctx.layoutId}
            transition={reduce ? { duration: 0 } : spring.snappy}
            className="absolute inset-0 rounded-md bg-background shadow-sm"
          />
        )}
        <span className="relative z-10">{children}</span>
      </button>
    );
  }

  return (
    <button
      {...triggerProps}
      className={cn(
        "relative pb-3 text-sm font-medium outline-none transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-accent/40 disabled:pointer-events-none disabled:opacity-50",
        isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground",
        className,
      )}
    >
      {children}
      {isActive && (
        <motion.span
          layoutId={ctx.layoutId}
          transition={reduce ? { duration: 0 } : spring.snappy}
          className="absolute inset-x-0 -bottom-px h-[2px] rounded-full bg-foreground"
        />
      )}
    </button>
  );
}

export interface TabsContentProps {
  value: string;
  children: ReactNode;
  className?: string;
}

export function TabsContent({ value, children, className }: TabsContentProps) {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error("TabsContent must be used inside Tabs");
  const isActive = ctx.value === value;
  const reduce = useReducedMotion();
  if (!isActive) return null;

  return (
    <div
      role="tabpanel"
      tabIndex={0}
      id={`${ctx.baseId}-panel-${value}`}
      aria-labelledby={`${ctx.baseId}-tab-${value}`}
      className={cn("outline-none", className)}
    >
      <motion.div
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduce ? 0 : 0.15, ease: "easeOut" }}
      >
        {children}
      </motion.div>
    </div>
  );
}
