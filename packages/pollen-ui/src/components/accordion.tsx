"use client";

import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  IconPlus as Plus,
  IconChevronDown as ChevronDown,
  IconChevronRight as ChevronRight,
} from "../icons";
import { cn } from "../lib/utils";
import { EASE_OUT, spring } from "../lib/motion";

export type AccordionVariant = "fill" | "flush" | "bordered" | "card";
export type AccordionIcon = "plus" | "chevron" | "arrow" | "none";
export type AccordionSize = "sm" | "md" | "lg";

interface AccordionContextValue {
  isOpen: (value: string) => boolean;
  toggle: (value: string) => void;
  variant: AccordionVariant;
  icon: AccordionIcon;
  size: AccordionSize;
}

const AccordionContext = createContext<AccordionContextValue | null>(null);
const ItemDisabledContext = createContext(false);

export interface AccordionProps {
  children: ReactNode;
  className?: string;
  /** Which items start open. */
  defaultValue?: string[];
  /** Controlled open item ids. Pair with onValueChange. */
  value?: string[];
  /** Fired with the open ids after every toggle. */
  onValueChange?: (value: string[]) => void;
  /** Single keeps one item open at a time, like a FAQ. */
  type?: "single" | "multiple";
  /** Visual treatment: fill is soft blocks, flush is a divided list, bordered wraps each item, card separates them. */
  variant?: AccordionVariant;
  /** The disclosure glyph. */
  icon?: AccordionIcon;
  size?: AccordionSize;
  "aria-label"?: string;
}

export function Accordion({
  children,
  className,
  defaultValue = [],
  value,
  onValueChange,
  type = "single",
  variant = "fill",
  icon = "plus",
  size = "md",
  ...aria
}: AccordionProps) {
  const [inner, setInner] = useState<string[]>(defaultValue);
  const open = value ?? inner;

  const setOpen = (next: string[]) => {
    setInner(next);
    onValueChange?.(next);
  };

  return (
    <div
      className={cn(
        "w-full",
        variant === "flush" && "divide-y divide-[var(--pollen-border)]",
        variant === "card" && "flex flex-col gap-3",
        className,
      )}
      {...aria}
    >
      <AccordionContext.Provider
        value={{
          isOpen: (v) => open.includes(v),
          toggle: (v) =>
            setOpen(
              open.includes(v)
                ? open.filter((x) => x !== v)
                : type === "single"
                  ? [v]
                  : [...open, v],
            ),
          variant,
          icon,
          size,
        }}
      >
        {children}
      </AccordionContext.Provider>
    </div>
  );
}

export function AccordionItem({
  value,
  children,
  disabled,
  className,
}: {
  value: string;
  children: ReactNode;
  /** Greys the trigger out and swallows clicks. */
  disabled?: boolean;
  className?: string;
}) {
  const ctx = useContext(AccordionContext);
  const open = ctx?.isOpen(value) ?? false;

  return (
    <ItemDisabledContext.Provider value={Boolean(disabled)}>
      <div
        className={cn(
          "transition-all duration-200",
          ctx?.variant === "fill" &&
            cn("rounded-2xl", open ? "bg-fill/70" : "hover:bg-fill/40"),
          ctx?.variant === "bordered" &&
            "rounded-2xl border border-[var(--pollen-border)] bg-card",
          ctx?.variant === "card" &&
            "rounded-2xl border border-[var(--pollen-border)] bg-card shadow-[var(--pollen-shadow-xs)]",
          ctx?.variant === "card" && open && "shadow-[var(--pollen-shadow-sm)]",
          disabled && "opacity-50",
          className,
        )}
      >
        {children}
      </div>
    </ItemDisabledContext.Provider>
  );
}

const ICON_GLYPHS: Record<Exclude<AccordionIcon, "none">, React.ReactNode> = {
  plus: <Plus className="h-4 w-4" />,
  chevron: <ChevronDown className="h-4 w-4" />,
  arrow: <ChevronRight className="h-4 w-4" />,
};

export function AccordionTrigger({
  value,
  children,
  leading,
  meta,
  className,
}: {
  value: string;
  children: ReactNode;
  /** Slot before the title: an icon, an avatar. */
  leading?: ReactNode;
  /** Quiet content pinned before the glyph: a count, a badge. */
  meta?: ReactNode;
  className?: string;
}) {
  const ctx = useContext(AccordionContext);
  if (!ctx) throw new Error("AccordionTrigger must be used inside Accordion");
  const disabled = useContext(ItemDisabledContext);
  const open = ctx.isOpen(value);

  const pad =
    ctx.variant === "flush"
      ? { sm: "py-2.5", md: "py-4", lg: "py-5" }
      : { sm: "px-4 py-2.5", md: "px-5 py-4", lg: "px-6 py-5" };

  const reduce = useReducedMotion();

  return (
    <button
      type="button"
      aria-expanded={open}
      disabled={disabled}
      onClick={() => ctx.toggle(value)}
      className={cn(
        "flex w-full items-center justify-between gap-4 text-left text-[15px] font-medium text-foreground outline-none transition-colors duration-150 focus-visible:text-muted-foreground",
        pad[ctx.size],
        className,
      )}
    >
      <span className="flex min-w-0 items-center gap-3">
        {leading && (
          <span className="shrink-0 text-faint [&_svg]:h-4 [&_svg]:w-4">
            {leading}
          </span>
        )}
        <span className={className ?? "truncate"}>{children}</span>
      </span>
      <span className="flex shrink-0 items-center gap-2.5">
        {meta && (
          <span className="text-[13px] font-normal text-muted-foreground">
            {meta}
          </span>
        )}
        {ctx.icon !== "none" && (
          <motion.span
            animate={{
              rotate:
                ctx.icon === "plus"
                  ? open
                    ? 45
                    : 0
                  : ctx.icon === "arrow"
                    ? open
                      ? 90
                      : 0
                    : open
                      ? 180
                      : 0,
            }}
            transition={reduce ? { duration: 0 } : spring.snappy}
            className="shrink-0 text-faint"
          >
            {ICON_GLYPHS[ctx.icon]}
          </motion.span>
        )}
      </span>
    </button>
  );
}

export function AccordionContent({
  value,
  children,
  className,
}: {
  value: string;
  children: ReactNode;
  className?: string;
}) {
  const ctx = useContext(AccordionContext);
  if (!ctx) throw new Error("AccordionContent must be used inside Accordion");
  const open = ctx.isOpen(value);

  const pad =
    ctx.variant === "flush"
      ? { sm: "pb-2.5", md: "pb-4", lg: "pb-5" }
      : { sm: "px-4 pb-3", md: "px-5 pb-4", lg: "px-6 pb-5" };

  const reduce = useReducedMotion();

  return (
    <AnimatePresence initial={false}>
      {open && (
        <motion.div
          key="content"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0, transition: { duration: 0.18, ease: "easeOut" } }}
          transition={reduce ? { duration: 0 } : { duration: 0.25, ease: EASE_OUT }}
          className="overflow-hidden"
        >
          <div
            className={cn(
              "text-[15px] leading-relaxed text-muted-foreground",
              pad[ctx.size],
              className,
            )}
          >
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
