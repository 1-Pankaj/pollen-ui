"use client";

import {
  createContext,
  useContext,
  useEffect,
  useId,
  useRef,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  IconClose as X,
} from "../icons";
import { cn } from "../lib/utils";
import { useIsClient } from "../lib/use-is-client";
import { Z_MODAL } from "../lib/z-index";

export type DrawerSide = "left" | "right" | "bottom";

export interface DrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
  side?: DrawerSide;
  className?: string;
}

const panelPosition: Record<DrawerSide, string> = {
  right: "inset-y-0 right-0 h-full w-[86%] max-w-sm shadow-[var(--pollen-shadow-lg)]",
  left: "inset-y-0 left-0 h-full w-[86%] max-w-sm shadow-[var(--pollen-shadow-lg)]",
  bottom: "inset-x-0 bottom-0 max-h-[85dvh] w-full rounded-t-2xl shadow-[var(--pollen-shadow-lg)]",
};

const panelHidden: Record<DrawerSide, { x?: string; y?: string }> = {
  right: { x: "100%" },
  left: { x: "-100%" },
  bottom: { y: "100%" },
};

interface DrawerContextValue {
  onOpenChange?: (open: boolean) => void;
  titleId: string;
  descriptionId: string;
}

const DrawerContext = createContext<DrawerContextValue | null>(null);

/**
 * Sheet that slides in from an edge. Esc closes, the overlay
 * click closes, and the page behind it stops scrolling. Focus
 * is trapped inside while open and returns to the opener on close.
 */
export function Drawer({
  open,
  onOpenChange,
  children,
  side = "right",
  className,
}: DrawerProps) {
  const mounted = useIsClient();
  const reduce = useReducedMotion();
  const titleId = useId();
  const descriptionId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const restoreRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const { body, documentElement } = document;
    const scrollbar = window.innerWidth - documentElement.clientWidth;
    restoreRef.current = document.activeElement as HTMLElement | null;
    body.style.overflow = "hidden";
    if (scrollbar > 0) body.style.paddingRight = `${scrollbar}px`;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onOpenChange(false);
        return;
      }
      // Tab stays inside the panel, like Modal.
      if (e.key === "Tab" && panelRef.current) {
        const focusables = panelRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])',
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey, true);
    requestAnimationFrame(() => panelRef.current?.focus());
    return () => {
      body.style.overflow = "";
      body.style.paddingRight = "";
      document.removeEventListener("keydown", onKey, true);
      restoreRef.current?.focus?.();
    };
  }, [open, onOpenChange]);

  if (!mounted) return null;

  return (
    <DrawerContext.Provider value={{ onOpenChange, titleId, descriptionId }}>
      {createPortal(
        <AnimatePresence>
          {open && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.15, ease: "easeOut" } }}
                transition={{ duration: reduce ? 0 : 0.2, ease: "easeOut" }}
                onClick={() => onOpenChange(false)}
                style={{ zIndex: Z_MODAL }}
                className="fixed inset-0 bg-black/50 backdrop-blur-[2px]"
                aria-hidden="true"
              />
              <motion.div
                ref={panelRef}
                tabIndex={-1}
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
                aria-describedby={descriptionId}
                initial={{ opacity: 0, ...panelHidden[side] }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                exit={{
                  opacity: 0,
                  ...panelHidden[side],
                  transition: { duration: 0.2, ease: "easeOut" },
                }}
                transition={reduce ? { duration: 0 } : { type: "spring", duration: 0.5, bounce: 0 }}
                style={{ zIndex: Z_MODAL }}
                className={cn(
                  "fixed overflow-y-auto overscroll-contain bg-card shadow-[var(--pollen-shadow-lg)] outline-none",
                  panelPosition[side],
                  className,
                )}
              >
                {children}
              </motion.div>
            </>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </DrawerContext.Provider>
  );
}

export function DrawerHeader({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const base = "flex items-center justify-between bg-fill/60 px-5 py-4";
  return <div className={cn(base, className)}>{children}</div>;
}

export function DrawerTitle({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ctx = useContext(DrawerContext);
  return (
    <h2
      id={ctx?.titleId}
      className={cn("text-sm font-semibold text-foreground", className)}
    >
      {children}
    </h2>
  );
}

/** Description under the title, linked to the panel via aria-describedby. */
export function DrawerDescription({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ctx = useContext(DrawerContext);
  return (
    <p
      id={ctx?.descriptionId}
      className={cn("text-[13px] leading-snug text-muted-foreground", className)}
    >
      {children}
    </p>
  );
}

export function DrawerBody({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn("p-4", className)}>{children}</div>;
}

export function DrawerClose({
  onOpenChange,
  className,
}: {
  onOpenChange?: (open: boolean) => void;
  className?: string;
}) {
  const ctx = useContext(DrawerContext);
  const close = onOpenChange ?? ctx?.onOpenChange;
  return (
    <button
      type="button"
      onClick={() => close?.(false)}
      aria-label="Close"
      className={cn(
        "rounded-md p-1 text-faint transition-colors hover:bg-fill hover:text-foreground outline-none focus-visible:ring-2 focus-visible:ring-accent/40",
        className,
      )}
    >
      <X className="h-4 w-4" />
    </button>
  );
}
