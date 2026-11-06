"use client";

import {
  createContext,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
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
import { EASE_OUT } from "../lib/motion";

interface ModalContextValue {
  onOpenChange: (open: boolean) => void;
  /** ids the panel's aria-labelledby / aria-describedby point at. */
  titleId: string;
  descriptionId: string;
}

const ModalContext = createContext<ModalContextValue | null>(null);

export interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
  /** Panel width. sm for confirms, md default, lg for forms. */
  size?: "sm" | "md" | "lg";
}

/**
 * Centered dialog. Enters from scale 0.96 and a slight rise,
 * never from zero. The overlay dims and blurs the page, focus
 * is trapped inside, and Escape closes.
 */
export function Modal({ open, onOpenChange, children, size = "md" }: ModalProps) {
  const mounted = useIsClient();
  const reduce = useReducedMotion();
  const titleId = useId();
  const descriptionId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const restoreRef = useRef<HTMLElement | null>(null);

  // Scroll lock with scrollbar compensation so the page does not shift.
  useEffect(() => {
    if (!open) return;
    const { body, documentElement } = document;
    const scrollbar = window.innerWidth - documentElement.clientWidth;
    restoreRef.current = document.activeElement as HTMLElement | null;
    body.style.overflow = "hidden";
    if (scrollbar > 0) body.style.paddingRight = `${scrollbar}px`;
    requestAnimationFrame(() => panelRef.current?.focus());
    return () => {
      body.style.overflow = "";
      body.style.paddingRight = "";
      restoreRef.current?.focus?.();
    };
  }, [open]);

  // Escape closes, Tab stays inside the panel.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onOpenChange(false);
      }
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
    return () => document.removeEventListener("keydown", onKey, true);
  }, [open, onOpenChange]);

  if (!mounted) return null;

  return (
    <ModalContext.Provider value={{ onOpenChange, titleId, descriptionId }}>
      {createPortal(
        <AnimatePresence>
          {open && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.15, ease: "easeOut" } }}
                transition={{ duration: reduce ? 0 : 0.2, ease: EASE_OUT }}
                onClick={() => onOpenChange(false)}
                style={{ zIndex: Z_MODAL }}
                className="fixed inset-0 bg-black/50 backdrop-blur-[2px]"
                aria-hidden="true"
              />
              <div style={{ zIndex: Z_MODAL }}
              className="pointer-events-none fixed inset-0 flex items-center justify-center p-4">
                <ModalPanelContext.Provider value={panelRef}>
                  <motion.div
                    ref={panelRef}
                    tabIndex={-1}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby={titleId}
                    aria-describedby={descriptionId}
                    initial={{ opacity: 0, scale: 0.96, y: 8 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{
                      opacity: 0,
                      scale: 0.97,
                      y: 4,
                      transition: { duration: 0.15, ease: "easeOut" },
                    }}
                    transition={reduce ? { duration: 0 } : { type: "spring", duration: 0.4, bounce: 0.12 }}
                    className={cn(
                      "pointer-events-auto relative max-h-[calc(100dvh-2rem)] w-full overflow-y-auto overscroll-contain rounded-2xl bg-card p-6 shadow-[var(--pollen-shadow-lg)] outline-none",
                      modalSizes[size],
                    )}
                  >
                    {children}
                  </motion.div>
                </ModalPanelContext.Provider>
              </div>
            </>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </ModalContext.Provider>
  );
}

const modalSizes = {
  sm: "max-w-sm",
  md: "max-w-lg",
  lg: "max-w-2xl",
} as const;

const ModalPanelContext = createContext<React.RefObject<HTMLDivElement | null> | null>(
  null,
);

export function useModal() {
  return useContext(ModalContext);
}

export interface ModalContentProps {
  children: ReactNode;
  className?: string;
}

export function ModalContent({ children, className }: ModalContentProps) {
  return <div className={className}>{children}</div>;
}

export function ModalTitle({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const { titleId } = useContext(ModalContext) ?? {};
  return (
    <h2
      id={titleId}
      className={cn("text-base font-semibold tracking-tight text-foreground", className)}
    >
      {children}
    </h2>
  );
}

export function ModalDescription({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const { descriptionId } = useContext(ModalContext) ?? {};
  return (
    <p
      id={descriptionId}
      className={cn("mt-1.5 text-sm leading-relaxed text-muted-foreground", className)}
    >
      {children}
    </p>
  );
}

export function ModalFooter({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className)}>
      {children}
    </div>
  );
}

export function ModalClose({ className }: { className?: string }) {
  const ctx = useContext(ModalContext);
  return (
    <button
      type="button"
      onClick={() => ctx?.onOpenChange(false)}
      aria-label="Close"
      className={cn(
        "absolute right-4 top-4 rounded-md p-1 text-faint transition-colors hover:bg-fill hover:text-foreground outline-none focus-visible:ring-2 focus-visible:ring-accent/40",
        className,
      )}
    >
      <X className="h-4 w-4" />
    </button>
  );
}
