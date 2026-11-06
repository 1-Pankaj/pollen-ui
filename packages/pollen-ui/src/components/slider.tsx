"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "../lib/utils";

export interface SliderMark {
  value: number;
  label?: string;
}

export interface SliderProps {
  /** A single number, or a pair for a range with two thumbs. */
  value?: number | [number, number];
  defaultValue?: number | [number, number];
  min?: number;
  max?: number;
  step?: number;
  /** Two thumbs never come closer than this many steps. */
  minStepsBetweenThumbs?: number;
  /** Tick dots along the track, with optional labels underneath. */
  marks?: SliderMark[];
  /** Vertical rail instead of the horizontal one. Pair it with a height class. */
  orientation?: "horizontal" | "vertical";
  /** Show the value bubble while dragging, hovering or focusing a thumb. */
  showTooltip?: boolean;
  /** Keep every value bubble pinned open. */
  tooltipAlways?: boolean;
  /** Format the bubble and the accessible label. Defaults to a plain number. */
  formatValue?: (value: number) => string;
  onValueChange?: (value: number | [number, number]) => void;
  disabled?: boolean;
  className?: string;
  "aria-label"?: string;
}

const clamp = (v: number, min: number, max: number) =>
  Math.min(Math.max(v, min), max);

const snap = (raw: number, step: number, min: number, max: number) =>
  clamp(Number((Math.round(raw / step) * step).toFixed(5)), min, max);

type Slots = [number, number] | [number, number, true];

const defaultFormat = (v: number) =>
  Number.isInteger(v) ? String(v) : String(Math.round(v * 100) / 100);

/**
 * Range control, single thumb or two. Press anywhere to jump with
 * a short glide, drag inside or outside the rail without losing
 * the grab, and watch the value bubble follow the thumb. Fully
 * keyboard operable: arrows, Home, End, Page Up, Page Down, and
 * Shift multiplies the step by ten.
 */
export function Slider({
  value: controlled,
  defaultValue = 0,
  min = 0,
  max = 100,
  step = 1,
  minStepsBetweenThumbs = 0,
  marks,
  orientation = "horizontal",
  showTooltip = true,
  tooltipAlways = false,
  formatValue = defaultFormat,
  onValueChange,
  disabled,
  className,
  ...aria
}: SliderProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const thumbRefs = useRef<(HTMLDivElement | null)[]>([]);
  const initial = (controlled ?? defaultValue) as number | [number, number];
  const isRange = Array.isArray(initial);
  const single = !isRange;
  const vertical = orientation === "vertical";
  const reduce = useReducedMotion();
  const uid = useId();

  const [uncontrolled, setUncontrolled] = useState<Slots>(() =>
    isRange
      ? [initial[0], initial[1]]
      : [initial as number, (initial as number) + 1, true],
  );
  /** 0 | 1 = a held thumb, 2 = pointer down without a grab yet. */
  const [active, setActive] = useState<number | null>(null);
  const [hoverThumb, setHoverThumb] = useState<number | null>(null);
  const [focusThumb, setFocusThumb] = useState<number | null>(null);

  const source = (controlled !== undefined ? controlled : uncontrolled) as
    | number
    | [number, number];
  const values: [number, number] = Array.isArray(source)
    ? [source[0], source[1]]
    : [source, source];

  const commit = useCallback(
    (next: [number, number]) => {
      if (controlled === undefined) {
        setUncontrolled(single ? [next[0], next[0] + 1, true] : next);
      }
      onValueChange?.(single ? next[0] : [next[0], next[1]]);
    },
    [controlled, onValueChange, single],
  );

  const valueFromPointer = useCallback(
    (clientX: number, clientY: number) => {
      const rect = trackRef.current?.getBoundingClientRect();
      if (!rect || (vertical ? rect.height : rect.width) === 0) return null;
      const ratio = vertical
        ? 1 - clamp((clientY - rect.top) / rect.height, 0, 1)
        : clamp((clientX - rect.left) / rect.width, 0, 1);
      return snap(min + ratio * (max - min), step, min, max);
    },
    [min, max, step, vertical],
  );

  const moveThumb = useCallback(
    (index: 0 | 1, raw: number) => {
      let next: [number, number];
      if (single) {
        next = [raw, values[1]];
      } else {
        const gap = step * minStepsBetweenThumbs;
        if (index === 0) next = [Math.min(raw, values[1] - gap), values[1]];
        else next = [values[0], Math.max(raw, values[0] + gap)];
      }
      commit(next);
    },
    [commit, minStepsBetweenThumbs, single, step, values],
  );

  /* While dragging, the window tracks the pointer so you can pull
     outside the rail without losing the grab. */
  useEffect(() => {
    if (active === null || active === 2) return;
    const index = active as 0 | 1;
    const move = (e: PointerEvent) => {
      const next = valueFromPointer(e.clientX, e.clientY);
      if (next !== null) moveThumb(index, next);
    };
    const up = () => setActive(null);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
    };
  }, [active, moveThumb, valueFromPointer]);

  const nearestThumb = (clientX: number, clientY: number): 0 | 1 => {
    if (single) return 0;
    const rect = trackRef.current?.getBoundingClientRect();
    if (!rect) return 0;
    const x = vertical
      ? 1 - clamp((clientY - rect.top) / rect.height, 0, 1)
      : clamp((clientX - rect.left) / rect.width, 0, 1);
    const d0 = Math.abs(x - (values[0] - min) / (max - min));
    const d1 = Math.abs(x - (values[1] - min) / (max - min));
    return d0 <= d1 ? 0 : 1;
  };

  const onThumbKeyDown = (index: 0 | 1) => (e: React.KeyboardEvent) => {
    if (disabled) return;
    const fine = e.shiftKey ? 10 : 1;
    let delta = 0;
    if (e.key === "ArrowRight" || e.key === "ArrowUp") delta = step * fine;
    if (e.key === "ArrowLeft" || e.key === "ArrowDown") delta = -step * fine;
    if (e.key === "PageUp") delta = step * 10;
    if (e.key === "PageDown") delta = -step * 10;
    let next: number | null = null;
    if (delta !== 0) next = values[index] + delta;
    if (e.key === "Home") next = min;
    if (e.key === "End") next = max;
    if (next !== null) {
      e.preventDefault();
      moveThumb(index, snap(next, step, min, max));
    }
  };

  const pct = (v: number) =>
    max === min ? 0 : ((v - min) / (max - min)) * 100;

  const dragging = active !== null && active !== 2;

  const thumb = (index: 0 | 1) => {
    const hovered = hoverThumb === index;
    const focused = focusThumb === index;
    const open =
      tooltipAlways ||
      (showTooltip && (active === index || hovered || focused) && !disabled);
    const pos = pct(values[index]);
    return (
      <motion.div
        key={index}
        ref={(el) => {
          thumbRefs.current[index] = el;
        }}
        role="slider"
        id={single ? uid : `${uid}-${index}`}
        tabIndex={disabled ? -1 : 0}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={values[index]}
        aria-valuetext={formatValue(values[index])}
        aria-label={
          single
            ? aria["aria-label"]
            : `${aria["aria-label"] ?? "Range"} ${index === 0 ? "minimum" : "maximum"}`
        }
        aria-orientation={orientation}
        onKeyDown={onThumbKeyDown(index)}
        onFocus={() => setFocusThumb(index)}
        onBlur={() => setFocusThumb(null)}
        onPointerEnter={() => setHoverThumb(index)}
        onPointerLeave={() => setHoverThumb(null)}
        className={cn(
          "absolute z-20 rounded-full bg-white outline-none",
          "shadow-[0_1px_2px_rgba(18,18,26,0.2),0_3px_8px_rgba(18,18,26,0.14)]",
          "ring-1 ring-black/[0.1]",
          disabled && "cursor-not-allowed",
        )}
        style={
          vertical
            ? { width: 18, height: 18, bottom: `${pos}%`, left: "50%", x: "-50%", y: "50%" }
            : { width: 18, height: 18, left: `${pos}%`, top: "50%", x: "-50%", y: "-50%" }
        }
        animate={{ scale: dragging && active === index ? 1.15 : hovered || focused ? 1.06 : 1 }}
        transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 600, damping: 34 }}
      >
        {/* Grab affordance: a core dot that wakes up with the fill. */}
        <span
          aria-hidden="true"
          className={cn(
            "absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-fill-strong transition-colors duration-150",
            (dragging || hovered || focused) && !disabled && "bg-accent",
          )}
        />
        {/* Value bubble. */}
        {open && (
          <motion.span
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={reduce ? { duration: 0 } : { duration: 0.15, ease: [0.16, 0.84, 0.44, 1] }}
            className={cn(
              "pointer-events-none absolute z-30 flex items-center justify-center rounded-md bg-foreground px-2 py-1 text-[11.5px] font-medium leading-none text-background shadow-[var(--pollen-shadow-md)]",
              vertical
                ? "right-[calc(100%+10px)] top-1/2 -translate-y-1/2"
                : "bottom-[calc(100%+10px)] left-1/2 -translate-x-1/2",
            )}
          >
            {formatValue(values[index])}
            <span
              aria-hidden="true"
              className={cn(
                "absolute h-1.5 w-1.5 rotate-45 rounded-[1px] bg-foreground",
                vertical
                  ? "right-[-3px] top-1/2 -translate-y-1/2"
                  : "bottom-[-3px] left-1/2 -translate-x-1/2",
              )}
            />
          </motion.span>
        )}
      </motion.div>
    );
  };

  const from = pct(single ? min : values[0]);
  const to = pct(single ? values[0] : values[1]);

  const rail = (
    <div
      ref={trackRef}
      role="presentation"
      className={cn(
        "relative flex touch-none select-none items-center",
        vertical ? "h-44 w-6 justify-center" : "h-5 w-full",
      )}
      onPointerDown={(e: ReactPointerEvent<HTMLDivElement>) => {
        if (disabled) return;
        const next = valueFromPointer(e.clientX, e.clientY);
        if (next === null) return;
        const index = nearestThumb(e.clientX, e.clientY);
        setActive(index);
        moveThumb(index, next);
        thumbRefs.current[index]?.focus?.();
      }}
    >
      {/* The rail. */}
      <div
        className={cn(
          "relative overflow-hidden rounded-full bg-fill-strong",
          vertical ? "h-full w-1.5" : "h-1.5 w-full",
        )}
      >
        <motion.div
          className="absolute rounded-full bg-accent"
          style={
            vertical
              ? { left: 0, right: 0, bottom: 0, height: `${Math.max(to - from, 0)}%`, top: `${100 - to}%` }
              : { top: 0, bottom: 0, left: `${from}%`, width: `${Math.max(to - from, 0)}%` }
          }
        />
      </div>
      {/* Rail marks. */}
      {marks?.map((mark) => {
        const p = pct(mark.value);
        const reached = single
          ? mark.value <= values[0]
          : mark.value >= values[0] && mark.value <= values[1];
        return (
          <span
            key={mark.value}
            aria-hidden="true"
            className={cn(
              "pointer-events-none absolute rounded-full transition-colors duration-150",
              vertical
                ? "left-1/2 h-[3px] w-[7px] -translate-x-1/2"
                : "top-1/2 h-[7px] w-[3px] -translate-y-1/2",
              reached
                ? "bg-accent"
                : "bg-fill-strong shadow-[0_0_0_1.5px_var(--pollen-card)]",
            )}
            style={vertical ? { bottom: `${p}%` } : { left: `${p}%` }}
          />
        );
      })}
      {single ? thumb(0) : (
        <>
          {thumb(0)}
          {thumb(1)}
        </>
      )}
    </div>
  );

  if (vertical) {
    return (
      <div
        className={cn(
          "inline-flex items-start gap-3",
          disabled && "pointer-events-none opacity-50",
          className,
        )}
      >
        {rail}
        {marks?.some((m) => m.label) && (
          <div className="relative h-44 w-16">
            {marks.filter((m) => m.label).map((mark) => (
              <span
                key={mark.value}
                className="absolute left-0 -translate-y-1/2 whitespace-nowrap text-xs leading-none text-faint"
                style={{ bottom: `${pct(mark.value)}%` }}
              >
                {mark.label}
              </span>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={cn("w-full", disabled && "pointer-events-none opacity-50", className)}>
      {rail}
      {marks?.some((m) => m.label) && (
        <div className="relative mt-2.5 h-4">
          {marks
            .filter((m) => m.label)
            .map((mark) => {
              const reached = single
                ? mark.value <= values[0]
                : mark.value >= values[0] && mark.value <= values[1];
              return (
                <button
                  key={mark.value}
                  type="button"
                  tabIndex={-1}
                  onClick={() => {
                    const index = single
                      ? 0
                      : Math.abs(mark.value - values[0]) <=
                          Math.abs(mark.value - values[1])
                        ? 0
                        : 1;
                    moveThumb(index as 0 | 1, mark.value);
                    thumbRefs.current[index]?.focus?.();
                  }}
                  className={cn(
                    "absolute -translate-x-1/2 whitespace-nowrap rounded text-xs leading-none tabular-nums transition-colors duration-150",
                    reached ? "font-medium text-foreground" : "text-faint hover:text-muted-foreground",
                  )}
                  style={{ left: `${pct(mark.value)}%` }}
                >
                  {mark.label}
                </button>
              );
            })}
        </div>
      )}
    </div>
  );
}
