"use client";

import { useEffect, useState } from "react";
import {
  IconChevronLeft as ChevronLeft,
  IconChevronRight as ChevronRight,
  IconDots as MoreHorizontal,
} from "../icons";
import { cn } from "../lib/utils";

export interface PaginationProps {
  /** Total number of pages. */
  total: number;
  /** Current page, 1-indexed. */
  value?: number;
  /** Uncontrolled initial page. */
  defaultValue?: number;
  onChange?: (page: number) => void;
  /** Hide the page numbers and keep only the arrows. */
  compact?: boolean;
  /** Collapse page numbers into first / ellipsis / last. */
  siblingCount?: number;
  className?: string;
  "aria-label"?: string;
}

/** Pages to render, with ellipsis markers where numbers collapse. */
function pageList(current: number, total: number, siblings: number) {
  // Everything fits, render every page.
  const shown = siblings * 2 + 5;
  if (total <= shown) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  const left = Math.max(2, current - siblings);
  const right = Math.min(total - 1, current + siblings);
  const pages: (number | "ellipsis-left" | "ellipsis-right")[] = [1];
  if (left > 2) pages.push("ellipsis-left");
  for (let p = left; p <= right; p++) pages.push(p);
  if (right < total - 1) pages.push("ellipsis-right");
  pages.push(total);
  return pages;
}

const baseButton =
  "inline-flex h-9 select-none items-center justify-center bg-fill text-sm font-medium text-foreground outline-none transition-[background-color,box-shadow,color,transform] duration-150 hover:bg-fill-strong active:scale-[0.96] disabled:pointer-events-none disabled:opacity-40";

/**
 * Page navigation with ellipsis collapsing, keyboard focus and a
 * compact arrows-only mode. Controlled and uncontrolled.
 */
export function Pagination({
  total,
  value,
  defaultValue = 1,
  onChange,
  compact = false,
  siblingCount = 1,
  className,
  "aria-label": ariaLabel = "Pagination",
}: PaginationProps) {
  const [inner, setInner] = useState(defaultValue);
  const current = Math.min(Math.max(value ?? inner, 1), Math.max(total, 1));

  // Keep the uncontrolled copy in sync when the controlled value
  // changes. Adjusting during render (not in an effect) keeps the
  // sync on the same commit.
  const [lastValue, setLastValue] = useState<number | undefined>(undefined);
  if (value !== lastValue) {
    setLastValue(value);
    if (value !== undefined) setInner(value);
  }

  const go = (page: number) => {
    const next = Math.min(Math.max(page, 1), total);
    setInner(next);
    onChange?.(next);
  };

  return (
    <nav
      aria-label={ariaLabel}
      className={cn("inline-flex items-center gap-1.5", className)}
    >
      <button
        type="button"
        aria-label="Previous page"
        disabled={current <= 1}
        onClick={() => go(current - 1)}
        className={cn(baseButton, "w-9 rounded-[9px]")}
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {!compact &&
        pageList(current, total, siblingCount).map((page) =>
          typeof page === "number" ? (
            <button
              key={page}
              type="button"
              aria-current={page === current ? "page" : undefined}
              onClick={() => go(page)}
              className={cn(
                baseButton,
                "min-w-9 rounded-[9px] px-2 tabular-nums",
                page === current &&
                  "bg-foreground text-background hover:bg-foreground hover:opacity-90",
              )}
            >
              {page}
            </button>
          ) : (
            <span
              key={page}
              aria-hidden="true"
              className="inline-flex h-9 min-w-6 items-center justify-center text-faint"
            >
              <MoreHorizontal className="h-4 w-4" />
            </span>
          ),
        )}

      {!compact && (
        <span
          aria-live="polite"
          className="ml-1.5 hidden text-sm text-faint sm:inline"
        >
          {current} / {total}
        </span>
      )}

      <button
        type="button"
        aria-label="Next page"
        disabled={current >= total}
        onClick={() => go(current + 1)}
        className={cn(baseButton, "w-9 rounded-[9px]")}
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </nav>
  );
}
