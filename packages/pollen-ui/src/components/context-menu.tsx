"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { cn } from "../lib/utils";
import { EASE_OUT } from "../lib/motion";
import {
  isEventInside,
  panelStyle,
  useFloatingPanel,
  type VirtualAnchor,
} from "../lib/floating";

interface ContextMenuContextValue {
  openAt: (x: number, y: number) => void;
  close: () => void;
  open: boolean;
  panelRef: React.RefObject<HTMLDivElement | null>;
  position: ReturnType<typeof useFloatingPanel>["position"];
  origin: string;
}

const ContextMenuContext = createContext<ContextMenuContextValue | null>(null);

function useContextMenu(component: string) {
  const ctx = useContext(ContextMenuContext);
  if (!ctx) {
    throw new Error(
      `<${component}> must be used inside <ContextMenu>.`,
    );
  }
  return ctx;
}

export interface ContextMenuProps {
  children: ReactNode;
  className?: string;
}

/**
 * Right-click menu. Wrap any area with <ContextMenu>, mark the
 * interactive zone with <ContextMenuTrigger> and put the items
 * into <ContextMenuContent>. The menu is portaled to the end of
 * body, clamped to the viewport, and closes on Escape, an outside
 * pointer or scroll.
 */
export function ContextMenu({ children, className }: ContextMenuProps) {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<VirtualAnchor | HTMLElement | null>(null);
  const { panelRef, position, measure } = useFloatingPanel(open, anchorRef, {
    side: "bottom",
    align: "start",
    offset: 4,
  });

  const openAt = (x: number, y: number) => {
    const anchor: VirtualAnchor = {
      getBoundingClientRect: () => ({
        x,
        y,
        top: y,
        left: x,
        bottom: y,
        right: x,
        width: 0,
        height: 0,
        toJSON: () => ({}),
      }),
    };
    anchorRef.current = anchor;
    setOpen(true);
    requestAnimationFrame(() => {
      measure();
      panelRef.current?.focus();
    });
  };

  const close = () => setOpen(false);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!isEventInside(e.target, panelRef)) setOpen(false);
    };
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, panelRef]);

  return (
    <ContextMenuContext.Provider
      value={{
        openAt,
        close,
        open,
        panelRef,
        position,
        origin: position?.origin ?? "top left",
      }}
    >
      <div className={cn("relative", className)}>{children}</div>
    </ContextMenuContext.Provider>
  );
}

export interface ContextMenuTriggerProps {
  children: ReactNode;
  className?: string;
}

/**
 * The area that responds to right click and, on touch, long press
 * (hold ~500ms without moving; cancel on lift, move, or scroll).
 */
export function ContextMenuTrigger({
  children,
  className,
}: ContextMenuTriggerProps) {
  const { openAt } = useContextMenu("ContextMenuTrigger");
  const timer = useRef<number | null>(null);
  const start = useRef({ x: 0, y: 0 });

  const clearTimer = () => {
    if (timer.current !== null) {
      window.clearTimeout(timer.current);
      timer.current = null;
    }
  };

  return (
    <div
      className={cn("select-none", className)}
      onContextMenu={(e) => {
        e.preventDefault();
        openAt(e.clientX, e.clientY);
      }}
      onPointerDown={(e) => {
        if (e.pointerType !== "touch") return;
        start.current = { x: e.clientX, y: e.clientY };
        clearTimer();
        timer.current = window.setTimeout(() => {
          timer.current = null;
          openAt(e.clientX, e.clientY);
        }, 500);
      }}
      onPointerMove={(e) => {
        if (timer.current === null) return;
        const dx = e.clientX - start.current.x;
        const dy = e.clientY - start.current.y;
        if (dx * dx + dy * dy > 100) clearTimer(); // scrolled or dragged
      }}
      onPointerUp={clearTimer}
      onPointerCancel={clearTimer}
      onPointerLeave={clearTimer}
    >
      {children}
    </div>
  );
}

export interface ContextMenuContentProps {
  children: ReactNode;
  className?: string;
}

export function ContextMenuContent({
  children,
  className,
}: ContextMenuContentProps) {
  const { open, close, position, origin, panelRef } = useContextMenu(
    "ContextMenuContent",
  );
  const reduce = useReducedMotion();

  const onMenuKeyDown = (e: KeyboardEvent) => {
    const items = Array.from(
      panelRef.current?.querySelectorAll<HTMLElement>(
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

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          ref={panelRef}
          role="menu"
          aria-label="Context menu"
          tabIndex={-1}
          onKeyDown={onMenuKeyDown}
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
            transformOrigin: origin,
          }}
          className={cn(
            "min-w-[220px] rounded-2xl bg-card p-1.5 shadow-[var(--pollen-shadow-lg)] outline-none",
            className,
          )}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

export interface ContextMenuItemProps {
  children: ReactNode;
  icon?: ReactNode;
  shortcut?: string[];
  destructive?: boolean;
  disabled?: boolean;
  onSelect?: () => void;
  className?: string;
}

export function ContextMenuItem({
  children,
  icon,
  shortcut,
  destructive,
  disabled,
  onSelect,
  className,
}: ContextMenuItemProps) {
  const { close } = useContextMenu("ContextMenuItem");

  return (
    <button
      type="button"
      role="menuitem"
      disabled={disabled}
      onClick={() => {
        close();
        onSelect?.();
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
    </button>
  );
}

export function ContextMenuSeparator() {
  return (
    <div role="separator" className="mx-2.5 my-1 h-px rounded-full bg-fill" />
  );
}

export function ContextMenuLabel({ children }: { children: ReactNode }) {
  return (
    <div className="px-2 py-1.5 text-xs font-medium text-faint">{children}</div>
  );
}
