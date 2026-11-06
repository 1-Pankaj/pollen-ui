"use client";

import {
  cloneElement,
  isValidElement,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "../lib/utils";
import { useIsClient } from "../lib/use-is-client";
import { EASE_OUT } from "../lib/motion";
import { panelStyle, useFloatingPanel } from "../lib/floating";

export type TooltipSide = "top" | "bottom" | "left" | "right";

export interface TooltipProps {
  content: ReactNode;
  children: ReactNode;
  side?: TooltipSide;
  /** Delay before the first tooltip on a surface appears. */
  delay?: number;
  arrow?: boolean;
}

const arrowClasses: Record<TooltipSide, string> = {
  top: "-bottom-[3px] left-1/2 -translate-x-1/2",
  bottom: "-top-[3px] left-1/2 -translate-x-1/2",
  left: "-right-[3px] top-1/2 -translate-y-1/2",
  right: "-left-[3px] top-1/2 -translate-y-1/2",
};

// Skip the delay when another tooltip closed less than 300ms ago.
let lastClosedAt = 0;

/**
 * Hover and focus tooltip. The first one waits 200ms so it
 * never fires by accident; quick hops between surfaces skip
 * the wait. Leaving always hides immediately.
 *
 * The bubble is portaled to the end of body, so it is never
 * clipped by an overflow container, and it flips sides
 * automatically when the viewport edge is closer.
 */
export function Tooltip({
  content,
  children,
  side = "top",
  delay = 200,
  arrow = true,
}: TooltipProps) {
  const [open, setOpen] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const triggerRef = useRef<HTMLSpanElement>(null);
  const { panelRef, position } = useFloatingPanel(open, triggerRef, {
    side,
    align: "center",
    offset: 10,
  });

  const mounted = useIsClient();

  const show = () => {
    const skipDelay = Date.now() - lastClosedAt < 300;
    const wait = skipDelay ? 0 : delay;
    timer.current = setTimeout(() => setOpen(true), wait);
  };

  const hide = () => {
    if (timer.current) clearTimeout(timer.current);
    if (open) lastClosedAt = Date.now();
    setOpen(false);
  };

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const trigger = isValidElement(children) ? (
    cloneElement(children as React.ReactElement<{ "aria-label"?: string }>, {})
  ) : (
    <>{children}</>
  );

  return (
    <span
      ref={triggerRef}
      className="relative inline-flex"
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocusCapture={show}
      onBlurCapture={hide}
    >
      {trigger}
      {mounted &&
        createPortal(
          <AnimatePresence>
            {open && (
              <motion.span
                ref={panelRef}
                role="tooltip"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{
                  opacity: 0,
                  scale: 0.97,
                  transition: { duration: 0.08, ease: "easeOut" },
                }}
                transition={{ duration: 0.15, ease: EASE_OUT }}
                style={{
                  ...panelStyle(position),
                  transformOrigin: position?.origin ?? "bottom center",
                }}
                className="pointer-events-none w-max whitespace-nowrap rounded-lg bg-foreground px-3 py-2 text-[13px] font-medium text-background shadow-[var(--pollen-shadow-lg)]"
              >
                {content}
                {arrow && (
                  <span
                    aria-hidden="true"
                    className={cn(
                      "absolute h-[7px] w-[7px] rotate-45 rounded-[1px] bg-foreground",
                      position
                        ? arrowClasses[position.side]
                        : arrowClasses[side],
                    )}
                  />
                )}
              </motion.span>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </span>
  );
}
