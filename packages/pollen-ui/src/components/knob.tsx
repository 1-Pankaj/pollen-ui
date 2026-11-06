"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { cn } from "../lib/utils";

export type KnobTone = "accent" | "neutral" | "success" | "danger";

export interface KnobProps {
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  min?: number;
  max?: number;
  /** Amount per keyboard step and wheel notch. Default 1. */
  step?: number;
  /** Diameter in pixels. Default 96. */
  size?: number;
  /** Sweep start, in degrees from 12 o'clock, clockwise positive. Default -135. */
  startAngle?: number;
  /** Sweep end. Default 135. The gap between start and end is the knob's dead zone. */
  endAngle?: number;
  tone?: KnobTone;
  /** Accessible name. Also rendered as a caption when showLabel is on. */
  label?: string;
  /** Show the numeric value under the dial. Default true. */
  showValue?: boolean;
  /** Round the readout to this many decimals. Default 0. */
  precision?: number;
  disabled?: boolean;
  className?: string;
}

const TONE_VARS: Record<KnobTone, string> = {
  accent: "var(--pollen-accent)",
  neutral: "var(--pollen-fg)",
  success: "var(--pollen-success)",
  danger: "var(--pollen-danger)",
};

/**
 * A rotary control for values that live on a dial - gain, blur,
 * temperature, opacity. Drag around the cap (angle-based, like a
 * real knob, so value tracks the pointer position, not the drag
 * distance), fine-tune with the scroll wheel, or walk it with the
 * keyboard: the dial is a slider to assistive tech, arrows step,
 * PageUp/PageDown take a big step, Home and End hit the limits.
 *
 * The sweep defaults to -135deg to 135deg - the classic 270 degree
 * knob - and both ends are configurable, so a gauge-style 180
 * degree sweep or a full circle is the same component.
 */
export function Knob({
  value: controlled,
  defaultValue = 0,
  onValueChange,
  min = 0,
  max = 100,
  step = 1,
  size = 96,
  startAngle = -135,
  endAngle = 135,
  tone = "accent",
  label,
  showValue = true,
  precision = 0,
  disabled = false,
  className,
}: KnobProps) {
  const capRef = useRef<HTMLDivElement>(null);
  const [uncontrolled, setUncontrolled] = useState(defaultValue);
  const value = controlled !== undefined ? controlled : uncontrolled;
  const locked = disabled === true;

  const clamp = useCallback(
    (v: number) => Math.min(max, Math.max(min, v)),
    [min, max],
  );

  const set = useCallback(
    (next: number) => {
      const clamped = clamp(next);
      if (controlled === undefined) setUncontrolled(clamped);
      onValueChange?.(clamped);
    },
    [clamp, controlled, onValueChange],
  );

  // Angle under the pointer, mapped into the sweep. The dead zone
  // (the gap past either end of the sweep) snaps to the nearer end:
  // grabbing slightly past min/max feels like grabbing min/max.
  const valueFromPointer = useCallback(
    (clientX: number, clientY: number) => {
      const cap = capRef.current;
      if (!cap) return null;
      const rect = cap.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      // 0deg points up (12 o'clock), positive clockwise.
      const angle = (Math.atan2(clientX - cx, cy - clientY) * 180) / Math.PI;
      const sweep = endAngle - startAngle;
      // Relative angle from the sweep start, wrapped into [0, 360).
      let rel = ((angle - startAngle) % 360 + 360) % 360;
      if (rel > sweep) {
        // In the dead zone: nearer the end stop or the start stop?
        rel = rel - sweep < 360 - sweep ? sweep : 0;
      }
      return min + (rel / sweep) * (max - min);
    },
    [endAngle, max, min, startAngle],
  );

  const dragging = useRef(false);

  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (locked) return;
    dragging.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    const v = valueFromPointer(e.clientX, e.clientY);
    if (v !== null) set(v);
  };

  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (locked || !dragging.current) return;
    const v = valueFromPointer(e.clientX, e.clientY);
    if (v !== null) set(v);
  };

  const stop = () => {
    dragging.current = false;
  };

  // The wheel nudges by one step per notch, so precision work does
  // not need a drag at all.
  useEffect(() => {
    const cap = capRef.current;
    if (!cap || locked) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      set(value + (e.deltaY < 0 ? step : -step));
    };
    cap.addEventListener("wheel", onWheel, { passive: false });
    return () => cap.removeEventListener("wheel", onWheel);
  }, [locked, set, step, value]);

  const onKeyDown = (e: ReactKeyboardEvent) => {
    if (locked) return;
    const big = (max - min) / 10;
    if (e.key === "ArrowUp" || e.key === "ArrowRight") {
      e.preventDefault();
      set(value + (e.shiftKey ? big : step));
    } else if (e.key === "ArrowDown" || e.key === "ArrowLeft") {
      e.preventDefault();
      set(value - (e.shiftKey ? big : step));
    } else if (e.key === "PageUp") {
      e.preventDefault();
      set(value + big);
    } else if (e.key === "PageDown") {
      e.preventDefault();
      set(value - big);
    } else if (e.key === "Home") {
      e.preventDefault();
      set(min);
    } else if (e.key === "End") {
      e.preventDefault();
      set(max);
    }
  };

  const t = max === min ? 0 : (value - min) / (max - min);
  const angle = startAngle + t * (endAngle - startAngle);
  const sweep = endAngle - startAngle;

  // Arc geometry: one SVG circle, the fill arc revealed through a
  // stroke-dasharray window. Round caps make the arc read as a
  // dial, not a progress bar.
  const r = size / 2 - 7;
  const c = 2 * Math.PI * r;
  const arcLen = (sweep / 360) * c;
  const gap = c - arcLen;
  const fillLen = arcLen * t;

  const toneColor = TONE_VARS[tone];

  return (
    <div className={cn("inline-flex flex-col items-center gap-2", className)}>
      <div
        ref={capRef}
        role="slider"
        tabIndex={locked ? -1 : 0}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={Number(value.toFixed(precision))}
        aria-valuetext={label ? `${label}, ${value.toFixed(precision)}` : undefined}
        aria-label={label}
        aria-orientation="vertical"
        aria-disabled={locked || undefined}
        data-focus-ring=""
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={stop}
        onPointerCancel={stop}
        onKeyDown={onKeyDown}
        style={{ width: size, height: size }}
        className={cn(
          "relative select-none rounded-full bg-card shadow-[var(--pollen-shadow-md)] ring-1 ring-[var(--pollen-border)]",
          locked ? "cursor-default opacity-55" : "cursor-grab active:cursor-grabbing",
          "focus-visible:ring-2 focus-visible:ring-[var(--pollen-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent",
        )}
      >
        {/* Track and fill share one center; the fill rotates its
            dash start to the sweep origin. */}
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="absolute inset-0"
          aria-hidden="true"
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke="var(--pollen-fill)"
            strokeWidth={6}
            strokeDasharray={`${arcLen} ${gap}`}
            strokeDashoffset={arcLen / 2}
            strokeLinecap="round"
            transform={`rotate(${startAngle - 90} ${size / 2} ${size / 2})`}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={toneColor}
            strokeWidth={6}
            strokeDasharray={`${fillLen} ${c - fillLen}`}
            strokeDashoffset={arcLen / 2}
            strokeLinecap="round"
            transform={`rotate(${startAngle - 90} ${size / 2} ${size / 2})`}
          />
        </svg>
        {/* The pointer line, like a real dial's mark. */}
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{ transform: `rotate(${angle}deg)` }}
        >
          <div
            className="absolute left-1/2 top-[9px] w-0.5 -translate-x-1/2 rounded-full"
            style={{ height: Math.max(6, r * 0.34), background: toneColor }}
          />
        </div>
      </div>
      {showValue && (
        <span className="font-mono text-[12.5px] tabular-nums text-muted-foreground">
          {value.toFixed(precision)}
          {label ? <span className="ml-1.5 font-sans">{label}</span> : null}
        </span>
      )}
    </div>
  );
}

Knob.displayName = "Knob";
