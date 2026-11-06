"use client";

import {
  cloneElement,
  createContext,
  useContext,
  useEffect,
  useId,
  isValidElement,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { cn } from "../lib/utils";
import { EASE_OUT } from "../lib/motion";
import { IconCheck as Check } from "../icons";
import {
  isEventInside,
  panelStyle,
  useFloatingPanel,
} from "../lib/floating";

export interface DropdownMenuProps {
  /** Element that opens the menu, usually a Button. */
  trigger: ReactNode;
  children: ReactNode;
  side?: "top" | "bottom";
  align?: "start" | "center" | "end";
  className?: string;
  contentClassName?: string;
}

function originFor(side: string, align: string) {
  const vertical = side === "bottom" ? "top" : "bottom";
  const horizontal =
    align === "end" ? "right" : align === "center" ? "center" : "left";
  return `${vertical} ${horizontal}`;
}

const DropdownContext = createContext<{ close: () => void } | null>(null);

/**
 * Menu attached to a trigger. Scales out of the trigger corner,
 * closes on Escape or outside click, and navigates with arrow
 * keys. Items expose onSelect, shortcut and destructive styles.
 *
 * The panel is portaled to the end of body, so nothing on the
 * page, not a card, not a table, not a tile, can clip it, and
 * it flips above the trigger when the viewport edge is closer.
 */
export function DropdownMenu({
  trigger,
  children,
  side = "bottom",
  align = "start",
  className,
  contentClassName,
}: DropdownMenuProps) {
  const autoId = useId();
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const { panelRef, position } = useFloatingPanel(open, rootRef, {
    side,
    align,
    offset: 8,
  });

  useEffect(() => {
    if (!open) return;
    const focusTrigger = () =>
      requestAnimationFrame(() =>
        rootRef.current
          ?.querySelector<HTMLElement>("[data-menu-trigger] > *")
          ?.focus(),
      );
    const onPointerDown = (e: PointerEvent) => {
      if (!isEventInside(e.target, rootRef, panelRef)) {
        setOpen(false);
        focusTrigger();
      }
    };
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        focusTrigger();
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKey);
    // Focus the first item, the way native menus do, so keyboard
    // users land on something visibly focused. The panel itself is
    // only the fallback for menus without enabled items.
    requestAnimationFrame(() => {
      const first = contentRef.current?.querySelector<HTMLElement>(
        '[role="menuitem"]:not([disabled])',
      );
      (first ?? contentRef.current)?.focus();
    });
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, panelRef]);

  // Item clicks close the menu while focus sits on the unmounting
  // item; hand focus back to the trigger when nothing holds it.
  useEffect(() => {
    if (open) return;
    if (document.activeElement !== document.body) return;
    requestAnimationFrame(() =>
      rootRef.current
        ?.querySelector<HTMLElement>("[data-menu-trigger] > *")
        ?.focus(),
    );
  }, [open]);

  const onContentKeyDown = (e: KeyboardEvent) => {
    const items = Array.from(
      contentRef.current?.querySelectorAll<HTMLElement>(
        '[role="menuitem"]:not([disabled])',
      ) ?? [],
    );
    if (items.length === 0) return;
    const index = items.indexOf(document.activeElement as HTMLElement);
    if (e.key === "ArrowDown") {
      e.preventDefault();
      items[(index + 1 + items.length) % items.length]?.focus();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      items[(index - 1 + items.length) % items.length]?.focus();
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      (document.activeElement as HTMLElement)?.click();
    }
  };

  // The consumer's element stays the real trigger; aria state and
  // the toggle ride along via cloneElement. ArrowDown opens, the
  // way native menus do.
  let triggerNode: ReactNode = trigger;
  if (isValidElement(trigger)) {
    const child = trigger as React.ReactElement<{
      onClick?: (e: React.MouseEvent) => void;
      onKeyDown?: (e: React.KeyboardEvent) => void;
      [key: string]: unknown;
    }>;
    const childOnClick = child.props.onClick;
    const childOnKeyDown = child.props.onKeyDown;
    triggerNode = cloneElement(child, {
      "aria-haspopup": "menu",
      "aria-expanded": open,
      "aria-controls": open ? autoId : undefined,
      onClick: (e: React.MouseEvent) => {
        childOnClick?.(e);
        setOpen((o) => !o);
      },
      onKeyDown: (e: React.KeyboardEvent) => {
        childOnKeyDown?.(e);
        if (e.key === "ArrowDown" && !open) {
          e.preventDefault();
          setOpen(true);
        }
      },
    });
  }

  return (
    <div ref={rootRef} className={cn("relative inline-block", className)}>
      <div data-menu-trigger className="inline-flex">
        {triggerNode}
      </div>

      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {open && (
              <motion.div
                id={autoId}
                ref={(node) => {
                  panelRef.current = node;
                  contentRef.current = node;
                }}
                tabIndex={-1}
                role="menu"
                onKeyDown={onContentKeyDown}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{
                  opacity: 0,
                  scale: 0.97,
                  transition: { duration: 0.1, ease: "easeOut" },
                }}
                transition={reduce ? { duration: 0 } : { duration: 0.15, ease: EASE_OUT }}
                style={{
                  ...panelStyle(position),
                  transformOrigin: position?.origin ?? originFor(side, align),
                }}
                className={cn(
                  "min-w-[220px] rounded-2xl bg-card p-1.5 shadow-[var(--pollen-shadow-lg)] outline-none",
                  contentClassName,
                )}
              >
                <DropdownContext.Provider value={{ close: () => setOpen(false) }}>
                  {children}
                </DropdownContext.Provider>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </div>
  );
}

export interface DropdownMenuItemProps {
  children: ReactNode;
  icon?: ReactNode;
  shortcut?: string[];
  destructive?: boolean;
  disabled?: boolean;
  /** Shows a check at the row's end, for menus that pick one value. */
  selected?: boolean;
  /** Receives the click event, so callers can read the pointer position. */
  onSelect?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
}

export function DropdownMenuItem({
  children,
  icon,
  shortcut,
  destructive,
  disabled,
  selected,
  onSelect,
  className,
}: DropdownMenuItemProps) {
  const ctx = useContext(DropdownContext);

  return (
    <button
      type="button"
      role="menuitem"
      disabled={disabled}
      onClick={(event) => {
        ctx?.close();
        onSelect?.(event);
      }}
      className={cn(
        "flex w-full items-center gap-2.5 rounded-md px-2 py-1.5 text-left text-sm text-foreground outline-none transition-colors duration-100 focus:bg-fill focus:outline-none",
        !disabled && "hover:bg-fill",
        destructive && "text-danger-ink focus:bg-danger/10",
        disabled && "pointer-events-none opacity-50",
        className,
      )}
    >
      {icon && (
        <span
          className={cn(
            "text-muted-foreground [&_svg]:h-4 [&_svg]:w-4",
            destructive && "text-danger-ink",
          )}
        >
          {icon}
        </span>
      )}
      <span className="flex-1 truncate">{children}</span>
      {shortcut && (
        <span className="flex gap-1">
          {shortcut.map((key) => (
            <kbd
              key={key}
              className="inline-flex h-5 min-w-5 items-center justify-center rounded-[5px] bg-fill px-1 font-mono text-[11px] text-muted-foreground"
            >
              {key}
            </kbd>
          ))}
        </span>
      )}
      {selected && <Check className="h-4 w-4 shrink-0 text-foreground" />}
    </button>
  );
}

export function DropdownMenuSeparator({ className }: { className?: string }) {
  return (
    <div
      role="separator"
      className={cn("mx-2.5 my-1 h-px rounded-full bg-fill", className)}
    />
  );
}

export function DropdownMenuLabel({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("px-2 py-1.5 text-xs font-medium text-faint", className)}>
      {children}
    </div>
  );
}
