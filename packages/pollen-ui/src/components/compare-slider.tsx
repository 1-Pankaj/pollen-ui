"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";
import { IconChevronLeft as ChevronLeft, IconChevronRight as ChevronRight } from "../icons";
import { cn } from "../lib/utils";

export interface CompareSliderProps {
  /** The "before" layer, rendered underneath. Usually an image. */
  before: ReactNode;
  /** The "after" layer, revealed on top. Usually an image. */
  after: ReactNode;
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  /**
   * "drag" (default) moves the divider while the pointer is down;
   * "hover" follows a mouse with no press, which scans faster but
   * holds less precisely. Touch always drags in both modes.
   */
  mode?: "drag" | "hover";
  /** Keyboard step in percent. Default 5. */
  step?: number;
  /** Accessible name for the divider. */
  ariaLabel?: string;
  disabled?: boolean;
  className?: string;
}

/**
 * Before and after in one frame, with a divider you drag between
 * them. The divider is a real slider: arrow keys move it by step,
 * Home and End jump to the edges, and the value is announced as a
 * percentage. Both layers stay in the DOM with their own alt text,
 * so a screen reader reads the whole scene either way.
 *
 * The frame takes over horizontal pointer moves only
 * (touch-action: pan-y), so a finger can still scroll the page
 * from inside it. Layers themselves ignore the pointer, for the
 * same reason.
 */
export function CompareSlider({
  before,
  after,
  value: controlled,
  defaultValue = 50,
  onValueChange,
  mode = "drag",
  step = 5,
  ariaLabel = "Divider position",
  disabled = false,
  className,
}: CompareSliderProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const [uncontrolled, setUncontrolled] = useState(defaultValue);
  const value = controlled !== undefined ? controlled : uncontrolled;
  const locked = disabled === true;
  const dragging = useRef(false);

  const set = useCallback(
    (next: number) => {
      const clamped = Math.min(100, Math.max(0, next));
      if (controlled === undefined) setUncontrolled(clamped);
      onValueChange?.(clamped);
    },
    [controlled, onValueChange],
  );

  const valueFromClientX = useCallback((clientX: number) => {
    const frame = frameRef.current;
    if (!frame) return null;
    const rect = frame.getBoundingClientRect();
    if (rect.width === 0) return null;
    return ((clientX - rect.left) / rect.width) * 100;
  }, []);

  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (locked) return;
    const v = valueFromClientX(e.clientX);
    if (v === null) return;
    dragging.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    set(v);
  };

  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (locked) return;
    // Hover mode follows the mouse without a press; touch always
    // drags (a finger has no hover), so pointerType gates it.
    const follows =
      mode === "hover" && e.pointerType === "mouse"
        ? true
        : dragging.current;
    if (!follows) return;
    const v = valueFromClientX(e.clientX);
    if (v !== null) set(v);
  };

  const stopDrag = () => {
    dragging.current = false;
  };

  // Release capture if the pointer leaves mid-drag.
  useEffect(() => {
    const onUp = () => {
      dragging.current = false;
    };
    window.addEventListener("pointerup", onUp);
    return () => window.removeEventListener("pointerup", onUp);
  }, []);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (locked) return;
    const big = step * 4;
    if (e.key === "ArrowRight") {
      e.preventDefault();
      set(value + (e.shiftKey ? big : step));
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      set(value - (e.shiftKey ? big : step));
    } else if (e.key === "Home") {
      e.preventDefault();
      set(0);
    } else if (e.key === "End") {
      e.preventDefault();
      set(100);
    }
  };

  return (
    <div
      ref={frameRef}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={stopDrag}
      onPointerCancel={stopDrag}
      className={cn(
        "relative touch-pan-y select-none overflow-hidden bg-fill",
        className,
      )}
    >
      {/* Before is the base layer; after is clipped from the inline
          start so the divider reveals it. */}
      <div aria-hidden={false} className="pointer-events-none absolute inset-0">
        {before}
      </div>
      <div
        className="pointer-events-none absolute inset-0"
        style={{ clipPath: `inset(0 0 0 ${value}%)` }}
      >
        {after}
      </div>

      {/* The divider: a hairline plus the grip. It is the slider. */}
      <div
        role="slider"
        tabIndex={locked ? -1 : 0}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(value)}
        aria-valuetext={`${Math.round(value)} percent before`}
        aria-label={ariaLabel}
        aria-disabled={locked || undefined}
        data-focus-ring=""
        onKeyDown={onKeyDown}
        className={cn(
          "group absolute inset-y-0 z-10 w-0 focus:outline-none",
          locked ? "cursor-default" : "cursor-ew-resize",
        )}
        style={{ left: `${value}%` }}
      >
        <span className="absolute inset-y-0 left-0 w-0.5 -translate-x-1/2 bg-card shadow-[0_0_0_1px_rgb(0_0_0/0.18)]" />
        <span
          className={cn(
            "absolute left-1/2 top-1/2 flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center gap-0 rounded-full bg-card text-foreground shadow-[var(--pollen-shadow-md)] ring-1 ring-[var(--pollen-border)] transition-transform duration-150",
            locked ? "" : "active:scale-95",
            // Keyboard focus paints one accent ring on the grip.
            "group-focus-visible:ring-2 group-focus-visible:ring-[var(--pollen-accent)] group-focus-visible:ring-offset-2 group-focus-visible:ring-offset-transparent",
          )}
        >
          <ChevronLeft className="h-3.5 w-3.5 text-muted-foreground" />
          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
        </span>
      </div>
    </div>
  );
}

CompareSlider.displayName = "CompareSlider";
