"use client";

import {
  cloneElement,
  useEffect,
  useId,
  isValidElement,
  useRef,
  useState,
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
  type FloatAlign,
  type FloatSide,
} from "../lib/floating";

export interface PopoverProps {
  /** Element that toggles the popover, usually a Button. */
  trigger: ReactNode;
  children: ReactNode;
  side?: FloatSide;
  align?: FloatAlign;
  /** Controlled open state. */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Hide the small pointer triangle. */
  arrow?: boolean;
  /** Accessible name for the panel. */
  "aria-label"?: string;
  className?: string;
  contentClassName?: string;
}

/**
 * A floating panel for rich content: forms, filter panes, help
 * cards. Anchored to its trigger, portaled to the end of body so
 * nothing can clip it, flips sides when the viewport edge is
 * closer, and closes on Escape or an outside pointer.
 */
export function Popover({
  trigger,
  children,
  side = "bottom",
  align = "start",
  open: controlledOpen,
  onOpenChange,
  arrow = true,
  className,
  contentClassName,
  ...aria
}: PopoverProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const open = controlledOpen ?? uncontrolledOpen;
  const setOpen = (next: boolean) => {
    if (controlledOpen === undefined) setUncontrolledOpen(next);
    onOpenChange?.(next);
  };

  const panelId = useId();
  const reduce = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const { panelRef, position } = useFloatingPanel(open, rootRef, {
    side,
    align,
    offset: 10,
  });

  // The consumer's element stays the real trigger; the aria state
  // and the toggle ride along via cloneElement so Enter and Space
  // work through the native button.
  let triggerNode: ReactNode = trigger;
  if (isValidElement(trigger)) {
    const child = trigger as React.ReactElement<{
      onClick?: (e: React.MouseEvent) => void;
      [key: string]: unknown;
    }>;
    const childOnClick = child.props.onClick;
    triggerNode = cloneElement(child, {
      "aria-haspopup": "dialog",
      "aria-expanded": open,
      "aria-controls": open ? panelId : undefined,
      onClick: (e: React.MouseEvent) => {
        childOnClick?.(e);
        setOpen(!open);
      },
    });
  }

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!isEventInside(e.target, rootRef, panelRef)) setOpen(false);
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
    <div ref={rootRef} className={cn("relative inline-block", className)}>
      <div data-popover-trigger className="inline-flex">
        {triggerNode}
      </div>

      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {open && (
              <motion.div
                ref={panelRef}
                id={panelId}
                role="dialog"
                initial={{ opacity: 0, scale: 0.96, y: side === "bottom" ? -4 : 4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{
                  opacity: 0,
                  scale: 0.97,
                  transition: { duration: 0.1, ease: "easeOut" },
                }}
                transition={reduce ? { duration: 0 } : { duration: 0.18, ease: EASE_OUT }}
                {...aria}
                style={{
                  ...panelStyle(position),
                  transformOrigin: position?.origin ?? "top left",
                }}
                className={cn(
                  "w-72 rounded-2xl bg-card p-4 shadow-[var(--pollen-shadow-lg)]",
                  contentClassName,
                )}
              >
                {children}
                {arrow && (
                  <span
                    aria-hidden="true"
                    className={cn(
                      "absolute h-2.5 w-2.5 rotate-45 rounded-[2px] bg-card",
                      !position || position.side === "top"
                        ? "-bottom-1 left-1/2 -translate-x-1/2"
                        : position.side === "bottom"
                          ? "-top-1 left-1/2 -translate-x-1/2"
                          : position.side === "left"
                            ? "-right-1 top-1/2 -translate-y-1/2"
                            : "-left-1 top-1/2 -translate-y-1/2",
                    )}
                  />
                )}
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </div>
  );
}
