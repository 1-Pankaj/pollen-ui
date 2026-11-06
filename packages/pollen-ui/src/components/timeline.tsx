"use client";

import type { ReactNode } from "react";
import { cn } from "../lib/utils";

export interface TimelineItem {
  title: string;
  /** Small timestamp or meta line under the title. */
  meta?: string;
  description?: ReactNode;
  /** Marker color token name. */
  tone?: "neutral" | "accent" | "success" | "warning" | "danger";
}

export interface TimelineProps {
  items: TimelineItem[];
  className?: string;
}

const toneDot: Record<NonNullable<TimelineItem["tone"]>, string> = {
  neutral: "bg-fill-strong",
  accent: "bg-accent",
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-danger",
};

/**
 * A quiet vertical timeline. The connecting line runs behind the
 * dots and stops at the last item, so the list ends cleanly.
 */
export function Timeline({ items = [], className }: TimelineProps) {
  return (
    <ol role="list" className={cn("relative", className)}>
      {items.map((item, index) => {
        const last = index === items.length - 1;
        return (
          <li key={`${item.title}-${index}`} className="relative flex gap-4 pb-7 last:pb-0">
            {!last && (
              <span
                aria-hidden="true"
                className="absolute left-[7px] top-5 h-[calc(100%-16px)] w-px rounded-full bg-fill-strong"
              />
            )}
            <span
              aria-hidden="true"
              className={cn(
                "relative z-10 mt-1.5 h-[15px] w-[15px] shrink-0 rounded-full shadow-[var(--pollen-shadow-xs)] ring-4 ring-background",
                toneDot[item.tone ?? "neutral"],
              )}
            />
            <div className="min-w-0">
              <p className="text-[15px] font-medium leading-snug text-foreground">
                {item.title}
              </p>
              {item.meta && (
                <p className="mt-0.5 font-mono text-xs text-faint">{item.meta}</p>
              )}
              {item.description && (
                <div className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </div>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
