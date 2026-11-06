"use client";

import { useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  IconCircleCheck as CircleCheck,
  IconCircleClose as CircleX,
  IconInfo as Info,
  IconAlert as TriangleAlert,
  IconClose as X,
} from "../icons";
import { cn } from "../lib/utils";
import { EASE_OUT } from "../lib/motion";

export type AlertVariant = "info" | "success" | "warning" | "danger";

export interface AlertProps {
  variant?: AlertVariant;
  title?: ReactNode;
  children?: ReactNode;
  /** Shows a close button and collapses the alert when pressed. */
  dismissible?: boolean;
  /** Called after the dismiss animation finishes. */
  onDismiss?: () => void;
  className?: string;
}

const config: Record<
  AlertVariant,
  { icon: ReactNode; tint: string; text: string }
> = {
  info: {
    icon: <Info className="h-5 w-5" />,
    tint: "var(--pollen-accent)",
    text: "var(--pollen-accent)",
  },
  success: {
    icon: <CircleCheck className="h-5 w-5" />,
    tint: "var(--pollen-success)",
    text: "var(--pollen-success-ink)",
  },
  warning: {
    icon: <TriangleAlert className="h-5 w-5" />,
    tint: "var(--pollen-warning)",
    text: "var(--pollen-warning-ink)",
  },
  danger: {
    icon: <CircleX className="h-5 w-5" />,
    tint: "var(--pollen-danger)",
    text: "var(--pollen-danger-ink)",
  },
};

/**
 * Inline message. Color shows up in the icon, a 7 percent
 * background tint, and nothing else, so the page stays quiet.
 * Dismissible alerts collapse to zero height instead of
 * vanishing, so the layout moves the way the eye expects.
 */
export function Alert({
  variant = "info",
  title,
  children,
  dismissible,
  onDismiss,
  className,
}: AlertProps) {
  const [open, setOpen] = useState(true);
  const { icon, tint, text } = config[variant];

  const close = () => {
    setOpen(false);
    onDismiss?.();
  };

  return (
    <AnimatePresence initial={false}>
      {open && (
        <motion.div
          role="alert"
          exit={{
            opacity: 0,
            height: 0,
            scale: 0.98,
            transition: { duration: 0.2, ease: EASE_OUT },
          }}
          className={cn("overflow-hidden rounded-2xl", className)}
          style={{
            backgroundColor: `color-mix(in srgb, ${tint} 7%, var(--pollen-card))`,
          }}
        >
          <div className="flex gap-3 p-4">
            <span className="mt-px shrink-0" style={{ color: text }}>
              {icon}
            </span>
            <div className="min-w-0">
              {title && (
                <div className="text-[15px] font-medium text-foreground">
                  {title}
                </div>
              )}
              {children && (
                <div className="text-[15px] leading-relaxed text-muted-foreground">
                  {children}
                </div>
              )}
            </div>
            {dismissible && (
              <button
                type="button"
                onClick={close}
                aria-label="Dismiss"
                className="-mr-1 -mt-1 ml-auto inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors duration-150 hover:bg-black/5 hover:text-foreground dark:hover:bg-white/10"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
