"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  type InputHTMLAttributes,
} from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  IconCheck as Check,
  IconChevronDown as ChevronDown,
  IconSearch as Search,
} from "../icons";
import { cn } from "../lib/utils";
import { EASE_OUT, spring } from "../lib/motion";
import {
  isEventInside,
  panelStyle,
  useFloatingPanel,
} from "../lib/floating";

export interface ComboboxOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

export interface ComboboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "value" | "defaultValue" | "onChange"> {
  options: ComboboxOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  /** Placeholder shown when the filter matches nothing. */
  emptyMessage?: string;
  /** Show a search icon in the field. */
  searchable?: boolean;
  size?: "sm" | "md" | "lg";
  "aria-label"?: string;
}

const fieldSizes = {
  sm: "h-9 rounded-[9px] px-3 text-sm",
  md: "h-11 rounded-[10px] px-3.5 text-[15px]",
  lg: "h-12 rounded-[11px] px-4 text-[15px]",
} as const;

/**
 * A select that filters as you type. The listbox is portaled to
 * the end of body so nothing can clip it, arrow keys move the
 * active option, Enter commits, and Escape clears or closes.
 */
export function Combobox({
  options = [],
  value,
  defaultValue,
  onValueChange,
  placeholder = "Search…",
  emptyMessage = "No matches",
  searchable = true,
  size = "md",
  className,
  "aria-label": ariaLabel,
  ...props
}: ComboboxProps) {
  const autoId = useId();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const reduce = useReducedMotion();
  const [selected, setSelected] = useState(defaultValue);
  const [active, setActive] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { panelRef, position } = useFloatingPanel(open, inputRef, {
    side: "bottom",
    align: "start",
    offset: 8,
    matchWidth: true,
  });

  const currentId = value !== undefined ? value : selected;
  const current = options.find((o) => o.value === currentId);

  const filtered = options.filter((o) => {
    if (!query) return true;
    const q = query.toLowerCase();
    return (
      o.label.toLowerCase().includes(q) ||
      (o.description?.toLowerCase().includes(q) ?? false)
    );
  });

  // Reset the active row when the query or open state changes while
  // open. Adjusting during render (not in an effect) keeps the reset
  // on the same commit.
  const resetKey = `${query}|${open}`;
  const [lastResetKey, setLastResetKey] = useState(resetKey);
  if (lastResetKey !== resetKey) {
    setLastResetKey(resetKey);
    if (open) setActive(0);
  }

  // Keep the active option visible while arrowing. Options are the
  // panel's direct children in order (the empty message is not).
  useEffect(() => {
    if (!open || filtered.length === 0) return;
    const el = panelRef.current?.children[active];
    el?.scrollIntoView({ block: "nearest" });
  }, [active, open, filtered.length, panelRef]);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!isEventInside(e.target, rootRef, panelRef)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open, panelRef]);

  const commit = (option: ComboboxOption) => {
    if (option.disabled) return;
    setSelected(option.value);
    setQuery("");
    onValueChange?.(option.value);
    setOpen(false);
    requestAnimationFrame(() => inputRef.current?.focus());
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Tab") {
      // Moving focus away is a close, like any outside interaction;
      // the Tab itself passes through.
      setOpen(false);
      return;
    }
    if (e.key === "Home" && open && filtered.length > 0) {
      e.preventDefault();
      const next = filtered.findIndex((o) => !o.disabled);
      if (next >= 0) setActive(next);
      return;
    }
    if (e.key === "End" && open && filtered.length > 0) {
      e.preventDefault();
      for (let i = filtered.length - 1; i >= 0; i--) {
        if (!filtered[i].disabled) {
          setActive(i);
          break;
        }
      }
      return;
    }
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      if (!open) {
        setOpen(true);
        return;
      }
      const step = e.key === "ArrowDown" ? 1 : -1;
      if (filtered.length === 0) return;
      let next = active;
      for (let i = 0; i < filtered.length; i++) {
        next = (next + step + filtered.length) % filtered.length;
        if (!filtered[next].disabled) break;
      }
      setActive(next);
      return;
    }
    if (e.key === "Enter") {
      if (open && filtered[active] && !filtered[active].disabled) {
        e.preventDefault();
        commit(filtered[active]);
      }
      return;
    }
    if (e.key === "Escape") {
      if (query) {
        setQuery("");
      } else {
        setOpen(false);
      }
    }
  };

  const showEmpty = open && filtered.length === 0;

  return (
    <div ref={rootRef} className={cn("relative w-full", className)}>
      <div className="relative">
        {searchable && (
          <span className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-faint [&_svg]:h-4 [&_svg]:w-4">
            <Search />
          </span>
        )}
        <input
          ref={inputRef}
          role="combobox"
          aria-expanded={open}
          aria-controls={`${autoId}-listbox`}
          aria-autocomplete="list"
          aria-label={ariaLabel}
          value={open ? query : current ? current.label : query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          {...props}
          className={cn(
            "w-full bg-fill pr-9 outline-none transition-[background-color,box-shadow] duration-150 placeholder:text-faint hover:bg-fill-strong focus:bg-card focus-visible:ring-[3px] focus-visible:ring-accent/20 disabled:cursor-not-allowed disabled:opacity-50 pointer-coarse:text-base",
            fieldSizes[size],
            searchable && "pl-9",
            open && "bg-card ring-[3px] ring-accent/20",
          )}
        />
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: reduce ? 0 : 0.15, ease: EASE_OUT }}
          className="pointer-events-none absolute right-3 top-1/2 z-10 -translate-y-1/2 text-faint"
        >
          <ChevronDown className="h-4 w-4" />
        </motion.span>
      </div>

      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {open && (
              <motion.div
                id={`${autoId}-listbox`}
                ref={panelRef}
                role="listbox"
                aria-activedescendant={`${autoId}-option-${active}`}
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
                className="slim-scroll max-h-72 overflow-y-auto overscroll-contain rounded-2xl bg-card p-1.5 shadow-[var(--pollen-shadow-lg)] outline-none"
              >
                {showEmpty ? (
                  <p className="px-2.5 py-6 text-center text-sm text-faint">
                    {emptyMessage}
                  </p>
                ) : (
                  filtered.map((option, index) => {
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
                        onMouseDown={(e) => e.preventDefault()}
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
                  })
                )}
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </div>
  );
}
