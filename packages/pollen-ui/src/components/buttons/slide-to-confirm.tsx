"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { animate, motion, useMotionValue, useReducedMotion, useTransform } from "framer-motion";
import { IconCheck as Check, IconChevronRight as ChevronRight } from "../../icons";
import { cn } from "../../lib/utils";
import { Spinner } from "../spinner";

export type SlideToConfirmSize = "sm" | "md" | "lg";
export type SlideToConfirmTone = "accent" | "danger" | "success";

export interface SlideToConfirmProps {
  /** Called when the handle reaches the end. Return a promise to
      show the confirming spinner until it settles. */
  onConfirm: () => void | Promise<void>;
  /** Track label. Default "Slide to confirm". */
  label?: string;
  /** Label after success. Default "Confirmed". */
  successLabel?: string;
  /** Ms before the control resets after success. 0 keeps the
      success state until the parent unmounts or re-keys it. */
  autoReset?: number;
  size?: SlideToConfirmSize;
  /** Fill and success colour: accent for confirmations, danger for
      destructive gestures like slide to delete. */
  tone?: SlideToConfirmTone;
  /** Replace the idle handle glyph. */
  icon?: React.ReactNode;
  disabled?: boolean;
  /** Accessible name for the handle. Defaults to the label. */
  ariaLabel?: string;
  className?: string;
}

const sizeStyles: Record<
  SlideToConfirmSize,
  { track: string; handle: string; text: string; pad: number }
> = {
  sm: { track: "h-11", handle: "h-9 w-9", text: "text-[13px]", pad: 4 },
  md: { track: "h-14", handle: "h-11 w-11", text: "text-[15px]", pad: 6 },
  lg: { track: "h-16", handle: "h-13 w-13", text: "text-base", pad: 7 },
};

/**
 * Slide to confirm - the gesture that makes destructive or
 * expensive actions feel deliberate.
 *
 * Drag the handle to the end of the track (or press Enter on the
 * focused handle, or walk it there with the arrow keys). Release
 * past the threshold and the action fires: the track fills, the
 * handle dissolves into a spinner while your promise runs, then a
 * check lands and the control resets itself.
 */
export function SlideToConfirm({
  onConfirm,
  label = "Slide to confirm",
  successLabel = "Confirmed",
  autoReset = 2600,
  size = "md",
  tone = "accent",
  icon,
  disabled = false,
  ariaLabel,
  className,
}: SlideToConfirmProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [trackWidth, setTrackWidth] = useState(0);
  const [handleWidth, setHandleWidth] = useState(56);
  const [status, setStatus] = useState<"idle" | "confirming" | "success">("idle");
  const [progress, setProgress] = useState(0);
  const reduce = useReducedMotion();

  const x = useMotionValue(0);
  const fillWidth = useTransform(x, (v) => v + handleWidth);
  const fillOpacity = useTransform(x, [0, Math.max(handleWidth, 1)], [0.12, 1]);

  const s = sizeStyles[size];

  useLayoutEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const update = () => {
      setTrackWidth(track.offsetWidth);
      const handle = track.querySelector<HTMLElement>("[data-handle]");
      if (handle) setHandleWidth(handle.offsetWidth);
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(track);
    return () => ro.disconnect();
  }, []);

  const max = Math.max(trackWidth - handleWidth - s.pad * 2, 0);
  const THRESHOLD = 0.94;

  useEffect(() => {
    return x.on("change", (v) => {
      if (max > 0) setProgress(Math.min(1, Math.max(0, v / max)));
    });
  }, [x, max]);

  useEffect(() => {
    if (status === "idle") {
      x.stop();
      // x.set(0) emits a change, and the subscription above mirrors it
      // into progress; no separate setState needed here.
      x.set(0);
    }
  }, [status, x]);

  const fire = async () => {
    if (status !== "idle" || disabled) return;
    setStatus("confirming");
    try {
      await onConfirm();
    } finally {
      setStatus("success");
    }
  };

  // Park the handle at the end of the track while confirming or
  // done (position is always left + translateX).
  useEffect(() => {
    if (status !== "idle" && max > 0) {
      x.stop();
      animate(x, max, { type: "spring", stiffness: 300, damping: 30 });
    }
  }, [status, max, x]);

  const handleDragEnd = () => {
    if (status !== "idle" || disabled) return;
    if (progress >= THRESHOLD) {
      if (typeof navigator !== "undefined" && "vibrate" in navigator) {
        navigator.vibrate?.(8);
      }
      void fire();
    } else {
      animate(x, 0, { type: "spring", stiffness: 420, damping: 34 });
    }
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (disabled || status !== "idle") return;
    if (e.key === "Enter") {
      e.preventDefault();
      void fire();
      return;
    }
    if (e.key === " " || e.key === "Spacebar") {
      e.preventDefault();
      void fire();
      return;
    }
    const step = max * 0.16;
    if (e.key === "ArrowRight") {
      e.preventDefault();
      const next = Math.min(max, x.get() + step);
      x.set(next);
      setProgress(max > 0 ? next / max : 0);
      if (next >= max) void fire();
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      const next = Math.max(0, x.get() - step);
      x.set(next);
      setProgress(max > 0 ? next / max : 0);
    }
  };

  const locked = disabled || status !== "idle";

  const toneFill =
    tone === "danger"
      ? "bg-[var(--pollen-danger)]"
      : tone === "success"
        ? "bg-[var(--pollen-success)]"
        : "bg-[var(--pollen-accent)]";
  const toneBg =
    tone === "danger"
      ? "bg-[var(--pollen-danger)]"
      : tone === "success"
        ? "bg-[var(--pollen-success)]"
        : "bg-[var(--pollen-accent)]";
  const toneInk =
    tone === "danger"
      ? "text-[var(--pollen-danger-ink,white)]"
      : tone === "success"
        ? "text-[var(--pollen-success-ink,white)]"
        : "text-white";

  // Reset after success so the control is reusable in place.
  useEffect(() => {
    if (status !== "success" || autoReset === 0) return;
    const t = setTimeout(() => setStatus("idle"), autoReset);
    return () => clearTimeout(t);
  }, [status, autoReset]);

  return (
    <div
      ref={trackRef}
      data-status={status}
      className={cn(
        "relative select-none overflow-hidden rounded-full",
        s.track,
        status === "success" ? toneBg : "bg-[var(--pollen-fill)]",
        // A whisper of inset depth keeps the track from reading as a
        // flat stripe next to the raised handle.
        "shadow-[inset_0_1px_2px_rgb(0_0_0/0.07)]",
        disabled && "opacity-55",
        className,
      )}
      role="group"
      aria-label={ariaLabel ?? label}
    >
      {/* The fill tracks the handle, then takes the whole track on
          success with one quiet swell. */}
      <motion.div
        aria-hidden="true"
        className={cn(
          "absolute inset-y-0 left-0 rounded-full",
          status === "success" ? toneBg : toneFill,
        )}
        style={{
          width: status === "idle" ? fillWidth : "100%",
          opacity: status === "idle" ? fillOpacity : 1,
          transition: status !== "idle" ? "width 300ms cubic-bezier(0.22,1,0.36,1)" : undefined,
        }}
      />

      {/* Center label: fades out as the handle covers it, swaps for
          the success label on completion. */}
      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-0 flex items-center justify-center font-medium",
          s.text,
          status === "success"
            ? toneInk
            : "text-muted-foreground",
        )}
        style={{
          opacity:
            status === "success" ? 1 : Math.max(0, 1 - progress * 2.4),
          transition: "opacity 120ms linear",
        }}
      >
        {status === "success" ? (
          <span className="flex items-center gap-1.5">
            <Check className="h-4 w-4" />
            {successLabel}
          </span>
        ) : (
          label
        )}
      </span>

      {/* The handle. */}
      <motion.button
        type="button"
        data-handle
        data-focus-ring=""
        role="slider"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(progress * 100)}
        aria-valuetext={status === "success" ? successLabel : undefined}
        aria-label={ariaLabel ?? label}
        disabled={disabled}
        onKeyDown={onKeyDown}
        drag={status === "idle" && !disabled ? "x" : false}
        dragConstraints={{ left: 0, right: max }}
        dragElastic={0.06}
        dragMomentum={false}
        onDrag={(_, info) => {
          if (max > 0) setProgress(Math.min(1, Math.max(0, info.offset.x / max)));
        }}
        onDragEnd={handleDragEnd}
        style={{ x, left: s.pad, touchAction: "none" }}
        whileTap={locked ? undefined : { scale: 0.94 }}
        className={cn(
          "absolute flex items-center justify-center rounded-full",
          s.handle,
          "top-1/2 -translate-y-1/2",
          status === "success"
            ? "bg-white/95 text-success"
            : "bg-card text-foreground",
          // One crisp edge and one focus ring - the data-focus-ring
          // attribute stands down the global outline so keyboard
          // focus draws a single ring, not a double glow.
          "border border-[var(--pollen-border)]",
          "shadow-[var(--pollen-shadow-md)] outline-none",
          "focus-visible:ring-2 focus-visible:ring-[var(--pollen-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent",
          locked ? "cursor-default" : "cursor-grab active:cursor-grabbing",
        )}
      >
        {status === "confirming" ? (
          <Spinner size={16} />
        ) : status === "success" ? (
          <Check className="h-4 w-4" />
        ) : icon ? (
          <span className="flex h-full w-full items-center justify-center [&_svg]:h-4 [&_svg]:w-4">
            {icon}
          </span>
        ) : (
          <motion.span
            aria-hidden="true"
            animate={
              progress > 0.02
                ? { x: 0, opacity: 0.6 }
                : reduce
                  ? { x: 0, opacity: 1 }
                  : { x: [0, 3, 0], opacity: 1 }
            }
            transition={
              progress > 0.02 || reduce
                ? { duration: reduce ? 0 : 0.2 }
                : { duration: 1.6, repeat: Infinity, ease: "easeInOut" }
            }
          >
            <ChevronRight className={size === "sm" ? "h-3.5 w-3.5" : "h-4.5 w-4.5"} />
          </motion.span>
        )}
      </motion.button>
    </div>
  );
}

SlideToConfirm.displayName = "SlideToConfirm";
