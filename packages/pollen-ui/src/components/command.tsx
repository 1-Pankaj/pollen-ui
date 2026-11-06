"use client";

import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  IconSearch as Search,
} from "../icons";
import { cn } from "../lib/utils";
import { useIsClient } from "../lib/use-is-client";
import { Z_COMMAND } from "../lib/z-index";
import { EASE_OUT } from "../lib/motion";

export interface CommandItem {
  label: string;
  icon?: ReactNode;
  shortcut?: string[];
  /** Extra strings the filter matches against. */
  keywords?: string[];
  onSelect?: () => void;
  disabled?: boolean;
}

export interface CommandGroup {
  heading: string;
  items: CommandItem[];
}

export interface CommandProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  groups: CommandGroup[];
  placeholder?: string;
  /** Called when no item matched and Enter was pressed. */
  onQuerySubmit?: (query: string) => void;
}

interface FlatItem extends CommandItem {
  id: string;
  heading: string;
}

/**
 * The command palette. One input, flat keyboard navigation,
 * spring entrance from the top of the viewport. Bind your own
 * shortcut (usually Cmd/Ctrl + K) to onOpenChange.
 */
export function Command({
  open,
  onOpenChange,
  groups = [],
  placeholder = "Search",
  onQuerySubmit,
}: CommandProps) {
  const mounted = useIsClient();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion();
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const restoreRef = useRef<HTMLElement | null>(null);
  const listId = useId();

  const filteredGroups = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return groups;
    return groups
      .map((group) => ({
        ...group,
        items: group.items.filter((item) =>
          [item.label, ...(item.keywords ?? [])]
            .join(" ")
            .toLowerCase()
            .includes(q),
        ),
      }))
      .filter((group) => group.items.length > 0);
  }, [groups, query]);

  const flatItems: FlatItem[] = useMemo(
    () =>
      filteredGroups.flatMap((group) =>
        group.items.map((item) => ({
          ...item,
          id: `${group.heading}:${item.label}`,
          heading: group.heading,
        })),
      ),
    [filteredGroups],
  );

  // Reset the active row whenever the query changes. Adjusting during
  // render (not in an effect) keeps the reset on the same commit.
  const [lastQuery, setLastQuery] = useState("");
  if (lastQuery !== query) {
    setLastQuery(query);
    setActive(0);
  }

  // Keep the active row visible while arrowing through the list.
  useEffect(() => {
    listRef.current
      ?.querySelector('[aria-selected="true"]')
      ?.scrollIntoView({ block: "nearest" });
  }, [active]);

  useEffect(() => {
    if (!open) return;
    const { body, documentElement } = document;
    const scrollbar = window.innerWidth - documentElement.clientWidth;
    restoreRef.current = document.activeElement as HTMLElement | null;
    body.style.overflow = "hidden";
    if (scrollbar > 0) body.style.paddingRight = `${scrollbar}px`;
    requestAnimationFrame(() => inputRef.current?.focus());
    return () => {
      body.style.overflow = "";
      body.style.paddingRight = "";
      restoreRef.current?.focus?.();
    };
  }, [open]);

  if (!mounted) return null;

  const run = (item: FlatItem) => {
    if (item.disabled) return;
    onOpenChange(false);
    setQuery("");
    item.onSelect?.();
  };

  return createPortal(
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.12, ease: "easeOut" } }}
            transition={{ duration: reduce ? 0 : 0.15, ease: EASE_OUT }}
            onClick={() => onOpenChange(false)}
            style={{ zIndex: Z_COMMAND }}
            className="fixed inset-0 bg-black/50 backdrop-blur-[2px]"
            aria-hidden="true"
          />
          <div style={{ zIndex: Z_COMMAND }}
          className="pointer-events-none fixed inset-x-0 top-[12dvh] flex justify-center px-4">
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Command menu"
              initial={{ opacity: 0, scale: 0.97, y: 6 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{
                opacity: 0,
                scale: 0.98,
                y: 4,
                transition: { duration: 0.12, ease: "easeOut" },
              }}
              transition={reduce ? { duration: 0 } : { type: "spring", duration: 0.4, bounce: 0.1 }}
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  onOpenChange(false);
                  return;
                }
                if (e.key === "Tab") {
                  // A palette holds one input; moving focus away is a
                  // close, matching Select and Combobox.
                  onOpenChange(false);
                  return;
                }
                if (e.key === "Home" && flatItems.length > 0) {
                  e.preventDefault();
                  setActive(0);
                  return;
                }
                if (e.key === "End" && flatItems.length > 0) {
                  e.preventDefault();
                  setActive(flatItems.length - 1);
                  return;
                }
                if (e.key === "ArrowDown") {
                  e.preventDefault();
                  setActive((a) => (a + 1) % Math.max(flatItems.length, 1));
                }
                if (e.key === "ArrowUp") {
                  e.preventDefault();
                  setActive(
                    (a) => (a - 1 + flatItems.length) % Math.max(flatItems.length, 1),
                  );
                }
                if (e.key === "Enter") {
                  e.preventDefault();
                  if (flatItems[active]) run(flatItems[active]);
                  else if (query.trim() && onQuerySubmit) {
                    onOpenChange(false);
                    setQuery("");
                    onQuerySubmit(query.trim());
                  }
                }
              }}
              className="pointer-events-auto w-full max-w-xl overflow-hidden rounded-[20px] bg-card shadow-[var(--pollen-shadow-lg)]"
            >
              <div className="flex items-center gap-3.5 px-5 pb-3 pt-5">
                <Search className="h-[18px] w-[18px] shrink-0 text-faint" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={placeholder}
                  aria-label={placeholder}
                  aria-controls={listId}
                  aria-activedescendant={
                    flatItems[active] ? `command-option-${active}` : undefined
                  }
                  className="h-8 w-full bg-transparent text-[16px] text-foreground outline-none placeholder:text-faint"
                />
                <kbd className="hidden shrink-0 rounded-md bg-fill px-1.5 py-0.5 font-mono text-[11px] font-medium text-faint sm:block">
                  ESC
                </kbd>
              </div>

              <div
                ref={listRef}
                id={listId}
                role="listbox"
                aria-label="Suggestions"
                className="max-h-[320px] overflow-y-auto overscroll-contain px-2.5 pb-2.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              >
                {flatItems.length === 0 ? (
                  <div className="px-3 py-12 text-center text-[15px] text-faint">
                    No results for &ldquo;{query}&rdquo;
                  </div>
                ) : (
                  filteredGroups.map((group) => (
                    <div key={group.heading} role="group" aria-label={group.heading} className="pb-1">
                      <div className="px-2.5 pb-1.5 pt-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-faint">
                        {group.heading}
                      </div>
                      {group.items.map((item) => {
                        const id = `${group.heading}:${item.label}`;
                        const index = flatItems.findIndex((f) => f.id === id);
                        const isActive = index === active;
                        return (
                          <button
                            key={id}
                            type="button"
                            role="option"
                            id={`command-option-${index}`}
                            aria-selected={isActive}
                            tabIndex={-1}
                            disabled={item.disabled}
                            onMouseEnter={() => setActive(index)}
                            onClick={() => run({ ...item, id, heading: group.heading })}
                            className={cn(
                              "flex w-full items-center gap-3 rounded-xl px-2.5 py-2.5 text-left text-[15px] outline-none transition-colors duration-75",
                              isActive ? "bg-fill" : "text-foreground",
                              item.disabled && "pointer-events-none opacity-50",
                            )}
                          >
                            {item.icon && (
                              <span
                                className={cn(
                                  "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-colors duration-75 [&_svg]:h-4 [&_svg]:w-4",
                                  isActive
                                    ? "bg-card text-foreground"
                                    : "bg-fill text-muted-foreground",
                                )}
                              >
                                {item.icon}
                              </span>
                            )}
                            <span className="flex-1 truncate">{item.label}</span>
                            {item.shortcut && (
                              <span className="flex shrink-0 gap-1">
                                {item.shortcut.map((key) => (
                                  <kbd
                                    key={key}
                                    className={cn(
                                      "inline-flex h-5 min-w-5 items-center justify-center rounded-md px-1 font-mono text-[11px] text-muted-foreground transition-colors duration-75",
                                      isActive ? "bg-card" : "bg-fill",
                                    )}
                                  >
                                    {key}
                                  </kbd>
                                ))}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  ))
                )}
              </div>

              <div className="bg-gradient-to-t from-fill/70 to-transparent px-5 pb-2.5 pt-6">
                <div className="flex items-center gap-4 text-xs text-faint">
                  <span className="flex items-center gap-1.5">
                    <kbd className="rounded-[5px] bg-card px-1 font-mono text-[10px] shadow-[0_1px_2px_rgba(18,18,26,0.08)]">↑↓</kbd>
                    Navigate
                  </span>
                  <span className="flex items-center gap-1.5">
                    <kbd className="rounded-[5px] bg-card px-1 font-mono text-[10px] shadow-[0_1px_2px_rgba(18,18,26,0.08)]">↵</kbd>
                    Select
                  </span>
                  <span className="flex items-center gap-1.5">
                    <kbd className="rounded-[5px] bg-card px-1 font-mono text-[10px] shadow-[0_1px_2px_rgba(18,18,26,0.08)]">ESC</kbd>
                    Close
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>,
    document.body,
  );
}
