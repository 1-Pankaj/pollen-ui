"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  IconCheck as Check,
  IconChevronDown as ChevronDown,
} from "../icons";
import { cn } from "../lib/utils";
import { EASE_OUT, spring } from "../lib/motion";
import {
  isEventInside,
  panelStyle,
  useFloatingPanel,
} from "../lib/floating";
import type { FieldSize } from "./input";

export interface SelectOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

export interface SelectProps {
  options: SelectOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  /** Control height. sm pairs with dense toolbars, lg with marketing pages. */
  size?: FieldSize;
  className?: string;
  /** Accessible name when no visible label is used. */
  "aria-label"?: string;
}

const triggerSizes: Record<FieldSize, string> = {
  sm: "h-9 rounded-[9px] px-3 text-sm",
  md: "h-11 rounded-[10px] px-3.5 text-[15px]",
  lg: "h-12 rounded-[11px] px-4 text-[15px]",
};

/**
 * A select that behaves like the rest of the system: the menu
 * scales out of the trigger edge, hover states are quiet, and
 * the keyboard fully drives it. Arrow keys move, Enter picks,
 * Escape closes.
 *
 * The listbox renders through a portal at the end of body, so
 * no overflow container can clip it, and it flips above the
 * trigger when there is no room below.
 */
export function Select({
  options = [],
  value,
  defaultValue,
  onValueChange,
  placeholder = "Select an option",
  disabled,
  size = "md",
  className,
  ...aria
}: SelectProps) {
  const autoId = useId();
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(defaultValue);
  const [active, setActive] = useState(0);
  const typeAhead = useRef({ buffer: "", at: 0 });
  const reduce = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const { panelRef, position, measure } = useFloatingPanel(open, triggerRef, {
    side: "bottom",
    align: "start",
    offset: 8,
    matchWidth: true,
  });

  const currentId = value !== undefined ? value : selected;
  const current = options.find((o) => o.value === currentId);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!isEventInside(e.target, rootRef, panelRef)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open, panelRef]);

  useEffect(() => {
    if (open) {
      requestAnimationFrame(() => {
        const index = options.findIndex((o) => o.value === currentId);
        setActive(index >= 0 ? index : 0);
        measure();
        panelRef.current?.focus();
      });
    }
  }, [open]);

  // Keep the active option visible while arrowing, the way the
  // command palette does it. Options are the panel's direct children
  // in order, so the index reaches the element without id escaping.
  useEffect(() => {
    if (!open) return;
    const el = panelRef.current?.children[active];
    el?.scrollIntoView({ block: "nearest" });
  }, [active, open, panelRef]);

  const commit = (option: SelectOption) => {
    if (option.disabled) return;
    setSelected(option.value);
    onValueChange?.(option.value);
    setOpen(false);
    requestAnimationFrame(() => triggerRef.current?.focus());
  };

  const onListKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      e.stopPropagation();
      setOpen(false);
      requestAnimationFrame(() => triggerRef.current?.focus());
      return;
    }
    if (e.key === "Tab") {
      setOpen(false);
      return;
    }
    if (e.key === "Home") {
      e.preventDefault();
      const next = options.findIndex((o) => !o.disabled);
      if (next >= 0) setActive(next);
      return;
    }
    if (e.key === "End") {
      e.preventDefault();
      for (let i = options.length - 1; i >= 0; i--) {
        if (!options[i].disabled) {
          setActive(i);
          break;
        }
      }
      return;
    }
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      const step = e.key === "ArrowDown" ? 1 : -1;
      let next = active;
      for (let i = 0; i < options.length; i++) {
        next = (next + step + options.length) % options.length;
        if (!options[next].disabled) break;
      }
      setActive(next);
      return;
    }
    // Type-ahead: printable characters jump between matching options.
    if (e.key.length === 1 && !e.metaKey && !e.ctrlKey && !e.altKey) {
      const now = Date.now();
      const state = typeAhead.current;
      state.buffer = now - state.at < 500 ? state.buffer + e.key.toLowerCase() : e.key.toLowerCase();
      state.at = now;
      const start = active + 1;
      for (let i = 0; i < options.length; i++) {
        const index = (start + i) % options.length;
        const option = options[index];
        if (!option.disabled && option.label.toLowerCase().startsWith(state.buffer)) {
          setActive(index);
          break;
        }
      }
      return;
    }
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      commit(options[active]);
    }
  };

  return (
    <div ref={rootRef} className={cn("relative w-full", className)}>
      <button
        ref={triggerRef}
        id={autoId}
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? `${autoId}-listbox` : undefined}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={(e) => {
          if (["Enter", " ", "ArrowDown", "ArrowUp"].includes(e.key)) {
            e.preventDefault();
            setOpen(true);
          }
        }}
        className={cn(
          "flex w-full items-center justify-between gap-2 bg-fill outline-none transition-[background-color,box-shadow] duration-150 hover:bg-fill-strong focus-visible:bg-card focus-visible:ring-[3px] focus-visible:ring-accent/20 disabled:cursor-not-allowed disabled:opacity-50",
          triggerSizes[size],
          open && "bg-card ring-[3px] ring-accent/20",
        )}
        {...aria}
      >
        <span className={cn("truncate", !current && "text-faint")}>
          {current ? current.label : placeholder}
        </span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: reduce ? 0 : 0.15, ease: EASE_OUT }}
          className="shrink-0 text-faint"
        >
          <ChevronDown className="h-4 w-4" />
        </motion.span>
      </button>

      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {open && (
              <motion.div
                ref={panelRef}
                tabIndex={-1}
                id={`${autoId}-listbox`}
                role="listbox"
                aria-activedescendant={`${autoId}-option-${active}`}
                onKeyDown={onListKeyDown}
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{
                  opacity: 0,
                  scale: 0.98,
                  transition: { duration: 0.1, ease: "easeOut" },
                }}
                transition={reduce ? { duration: 0 } : spring.snappy}
                style={{
                  ...panelStyle(position),
                  transformOrigin: position?.origin ?? "top left",
                }}
                className="slim-scroll max-h-80 overflow-y-auto overscroll-contain rounded-2xl bg-card p-1.5 shadow-[var(--pollen-shadow-lg)] outline-none"
              >
                {options.map((option, index) => {
                  const isSelected = option.value === currentId;
                  const isActive = index === active;
                  return (
                    <div
                      key={option.value}
                      id={`${autoId}-option-${index}`}
                      role="option"
                      aria-selected={isSelected}
                      aria-disabled={option.disabled || undefined}
                      onMouseEnter={() => setActive(index)}
                      onClick={() => commit(option)}
                      className={cn(
                        "flex cursor-pointer select-none items-start justify-between gap-3 rounded-lg px-2.5 py-2 text-[15px] outline-none",
                        isActive && "bg-fill",
                        option.disabled && "pointer-events-none opacity-50",
                      )}
                    >
                      <span
                        className={cn(
                          isSelected
                            ? "font-medium text-foreground"
                            : "text-foreground",
                        )}
                      >
                        {option.label}
                        {option.description && (
                          <span className="mt-0.5 block text-[13px] font-normal text-muted-foreground">
                            {option.description}
                          </span>
                        )}
                      </span>
                      {isSelected && (
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-foreground" />
                      )}
                    </div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </div>
  );
}
