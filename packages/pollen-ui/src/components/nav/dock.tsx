"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { cn } from "../../lib/utils";

export interface DockItem {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  /** Small count or dot pinned to the tile corner. */
  badge?: number | string;
  /** Renders a hairline separator before this item. */
  separator?: boolean;
}

export type DockPosition = "bottom" | "top" | "left" | "right";
export type DockLabelMode = "tooltip" | "always";

export interface DockProps {
  items: DockItem[];
  /** Icon tile size in px at rest. */
  size?: number;
  /** Peak magnification under the pointer. */
  maxScale?: number;
  /** Which edge the dock sits on; changes the magnify axis and label side. */
  position?: DockPosition;
  /** Tooltip on hover, or a permanent small label under each tile. */
  labelMode?: DockLabelMode;
  className?: string;
}

const DOCK_SPRING = { stiffness: 320, damping: 22, mass: 0.6 };

function DockIcon({
  item,
  pointer,
  containerRef,
  size,
  maxScale,
  vertical,
  position,
  labelMode,
}: {
  item: DockItem;
  pointer: MotionValue<number | null>;
  containerRef: RefObject<HTMLDivElement | null>;
  size: number;
  maxScale: number;
  vertical: boolean;
  position: DockPosition;
  labelMode: DockLabelMode;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const [hovered, setHovered] = useState(false);
  /* Icon center relative to the dock, kept in a ref so the distance
     transform always reads the freshest layout without re-rendering. */
  const centerRef = useRef<number | null>(null);

  useEffect(() => {
    const measure = () => {
      const icon = ref.current?.getBoundingClientRect();
      const container = containerRef.current?.getBoundingClientRect();
      if (icon && container) {
        centerRef.current = vertical
          ? icon.top + icon.height / 2 - container.top
          : icon.left + icon.width / 2 - container.left;
      }
    };
    measure();
    window.addEventListener("resize", measure);
    window.addEventListener("scroll", measure, true);
    document.fonts?.ready.then(measure).catch(() => {});
    const observer = new ResizeObserver(measure);
    if (containerRef.current) observer.observe(containerRef.current);
    return () => {
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", measure, true);
      observer.disconnect();
    };
  }, [containerRef, vertical]);

  const distance = useTransform(pointer, (v) => {
    if (v === null || centerRef.current === null) return Infinity;
    return v - centerRef.current;
  });

  const scaleRaw = useTransform(distance, (d) => {
    if (!isFinite(d)) return 1;
    const sigma = size * 1.6;
    return 1 + (maxScale - 1) * Math.exp(-(d * d) / (2 * sigma * sigma));
  });

  const scale = useSpring(scaleRaw, DOCK_SPRING);
  /* Grow away from the dock edge: bottom docks lift up, top docks
     press down, side docks push inward. */
  const liftSign =
    position === "bottom" ? -1 : position === "top" ? 1 : position === "left" ? 1 : -1;
  const lift = useSpring(
    useTransform(scale, (s) => liftSign * (s - 1) * size * 0.28),
    DOCK_SPRING,
  );
  /* The tooltip rides the tile: at rest it clears the tile by 12px,
     and it drifts further out as the tile magnifies. */
  const tooltipOffset = useTransform(scale, (s) => size + 12 + (s - 1) * size * 0.72);

  const tile = (
    <motion.span
      className="flex items-center justify-center rounded-xl bg-fill text-foreground shadow-[var(--pollen-shadow-sm)]"
      style={{ width: size, height: size, scale, x: vertical ? lift : 0, y: vertical ? 0 : lift }}
    >
      <span className="flex h-[55%] w-[55%] items-center justify-center [&>svg]:h-full [&>svg]:w-full">
        {item.icon}
      </span>
      {item.badge !== undefined && (
        <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--pollen-accent)] px-1 text-[9.5px] font-semibold leading-none text-[var(--pollen-accent-ink, #fff)]">
          {item.badge}
        </span>
      )}
    </motion.span>
  );

  const side: "top" | "bottom" | "left" | "right" =
    position === "bottom"
      ? "top"
      : position === "top"
        ? "bottom"
        : position === "left"
          ? "right"
          : "left";

  return (
    <motion.button
      ref={ref}
      type="button"
      aria-label={item.label}
      className="relative flex flex-col items-center rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
      onClick={item.onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {tile}
      <AnimatePresence>
        {labelMode === "tooltip" && hovered && (
          <Tooltip side={side} offset={tooltipOffset} label={item.label} />
        )}
      </AnimatePresence>
      {labelMode === "always" && (
        <span className="mt-1 max-w-[64px] truncate text-[10px] font-medium leading-none text-muted-foreground">
          {item.label}
        </span>
      )}
    </motion.button>
  );
}

function Tooltip({
  side,
  offset,
  label,
}: {
  side: "top" | "bottom" | "left" | "right";
  offset: MotionValue<number>;
  label: string;
}) {
  const style: Record<string, unknown> = {};
  if (side === "top") style.bottom = offset;
  if (side === "bottom") style.top = offset;
  if (side === "left") style.right = offset;
  if (side === "right") style.left = offset;

  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.94 }}
      transition={{ duration: 0.16 }}
      style={style}
      className={cn(
        "pointer-events-none absolute z-30 whitespace-nowrap rounded-lg bg-foreground px-2.5 py-1 text-xs text-background shadow-[var(--pollen-shadow-md)]",
        (side === "top" || side === "bottom") &&
          "left-1/2 -translate-x-1/2",
        (side === "left" || side === "right") &&
          "top-1/2 -translate-y-1/2",
      )}
    >
      {label}
      <span
        aria-hidden
        className={cn(
          "absolute h-1.5 w-1.5 rotate-45 rounded-[1px] bg-foreground",
          side === "top" && "-bottom-1 left-1/2 -translate-x-1/2",
          side === "bottom" && "-top-1 left-1/2 -translate-x-1/2",
          side === "left" && "-right-1 top-1/2 -translate-y-1/2",
          side === "right" && "-left-1 top-1/2 -translate-y-1/2",
        )}
      />
    </motion.span>
  );
}

/**
 * Dock - a magnifying application dock.
 *
 * Icons swell smoothly under the pointer with a gaussian falloff and
 * spring back when it leaves, exactly like the dock you are thinking
 * of. The row reserves the full icon height so magnifying never
 * shifts layout, tooltips float above each icon, tiles can carry
 * badges and separators, and the dock can pin to any edge: bottom,
 * top, left or right. Works on touch (no magnify, just tap) and
 * degrades gracefully.
 *
 * @example
 * <Dock items={[{ icon: <HomeIcon />, label: "Home" }]} />
 * <Dock position="left" labelMode="always" items={apps} />
 */
export function Dock({
  items = [],
  size = 50,
  maxScale = 1.75,
  position = "bottom",
  labelMode = "tooltip",
  className,
}: DockProps) {
  const pointer = useMotionValue<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const vertical = position === "left" || position === "right";
  // Reduced motion: the pointer distance never updates, so icons
  // hold their rest size and the dock reads as a static launcher.
  const reduce = useReducedMotion();

  return (
    <div
      ref={containerRef}
      className={cn(
        "flex items-center bg-card/80 shadow-[var(--pollen-shadow-md)] backdrop-blur-xl",
        vertical
          ? "flex-col rounded-2xl py-3 px-2"
          : "rounded-2xl px-3 py-2 items-center",
        vertical ? "gap-2" : "gap-2",
        className,
      )}
      style={
        vertical
          ? { width: size * 1.32 }
          : { height: size * 1.32 }
      }
      onMouseMove={(e) => {
        if (reduce) return;
        /* Pointer along the dock's own axis, so the falloff
           survives scrolling and nested transforms. */
        const rect = containerRef.current?.getBoundingClientRect();
        if (!rect) return;
        pointer.set(vertical ? e.clientY - rect.top : e.clientX - rect.left);
      }}
      onMouseLeave={() => pointer.set(null)}
    >
      {items.map((item, i) => (
        <div key={item.label} className={cn("flex", vertical ? "flex-col" : "flex-row", "items-center gap-2")}>
          {item.separator && (
            <span
              aria-hidden
              className={cn(
                "bg-[var(--pollen-separator)]",
                vertical ? "h-px w-6 self-center" : "h-6 w-px self-center",
              )}
            />
          )}
          <DockIcon
            item={item}
            pointer={pointer}
            containerRef={containerRef}
            size={size}
            maxScale={maxScale}
            vertical={vertical}
            position={position}
            labelMode={labelMode}
          />
        </div>
      ))}
    </div>
  );
}

Dock.displayName = "Dock";
