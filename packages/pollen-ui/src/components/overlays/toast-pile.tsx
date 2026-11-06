"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ComponentType,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type PanInfo,
  type Variants,
} from "framer-motion";
import {
  IconAlert,
  IconCircleCheck,
  IconClose,
  IconInfo,
  IconLayers,
  type IconProps,
} from "../../icons";
import { springSnappy, springSoft } from "../../lib/springs";
import { clamp, cn } from "../../lib/utils";
import { Z_TOAST_PILE } from "../../lib/z-index";

export type ToastPileVariant = "default" | "success" | "danger";

export type ToastPilePosition = "bottom-right" | "bottom-center" | "top-right";

export interface ToastPileItem {
  id: string;
  title: string;
  description?: string;
  variant?: ToastPileVariant;
  /** Auto-dismiss after this many ms. 0 keeps it until closed. */
  duration?: number;
}

/** Alias for docs and playgrounds. */
export type PileToastData = ToastPileItem;

/** What pile() accepts. Everything except the id, which the provider mints. */
export type ToastPileInput = Omit<ToastPileItem, "id">;

export interface ToastPileApi {
  pile: (input: ToastPileInput) => void;
  dismiss: (id: string) => void;
}

export interface ToastPileProps {
  /** Oldest first. The last item sits at the front of the pile. */
  toasts: PileToastData[];
  onDismiss: (id: string) => void;
  position?: ToastPilePosition;
  /** Force the pile open or shut. Leave undefined to let hover, focus, and the stack badge decide. */
  expanded?: boolean;
  className?: string;
}

const PILE_GAP = 10; // px between cards once the pile is fanned out
const PILE_TUCK = 14; // px of each deeper card peeking out while collapsed
const MAX_LAYERS = 3; // visible depth while collapsed, the rest stay in state
const DISMISS_OFFSET = 90; // px of drag before a card lets go
const DISMISS_VELOCITY = 550; // px/s flick that dismisses regardless of distance
const DRAG_TILT = 0.05; // degrees of rotation per px of drag
const MAX_TILT = 8;
const ESTIMATED_HEIGHT = 84; // stand-in until a card reports its real height
const DEFAULT_DURATION = 5000;
const MAX_KEPT = 6; // provider retention window

const COLLAPSED_OPACITY = [1, 0.8, 0.62];
const COLLAPSED_BRIGHTNESS = [1, 0.94, 0.88];

const VARIANT_TINTS: Record<ToastPileVariant, string> = {
  default: "var(--pollen-accent)",
  success: "var(--pollen-sage)",
  danger: "var(--pollen-danger)",
};

const VARIANT_ICONS: Record<ToastPileVariant, ComponentType<IconProps>> = {
  default: IconInfo,
  success: IconCircleCheck,
  danger: IconAlert,
};

const POSITION_CLASSES: Record<ToastPilePosition, string> = {
  // Safe-area aware like the Toaster; env() is 0 where no inset exists.
  "bottom-right": "bottom-[calc(1.25rem_+_env(safe-area-inset-bottom))] right-[calc(1.25rem_+_env(safe-area-inset-right))]",
  "bottom-center": "bottom-[calc(1.25rem_+_env(safe-area-inset-bottom))] left-1/2 -translate-x-1/2",
  "top-right": "top-[calc(1.25rem_+_env(safe-area-inset-top))] right-[calc(1.25rem_+_env(safe-area-inset-right))]",
};

const ToastPileContext = createContext<ToastPileApi | null>(null);

interface PileLook {
  y: number;
  scale: number;
  opacity: number;
  brightness: number;
  shadow: string;
  zIndex: number;
}

/** Portal mounts strictly after hydration so SSR and the first client render agree. */
function usePortalReady() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const raf = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(raf);
  }, []);
  return mounted;
}

/**
 * Drives the countdown bar. The progress value runs 1 to 0 on a linear
 * motion value so pause and resume pick up from wherever the bar is,
 * instead of restarting the clock.
 */
function useCountdown(duration: number, paused: boolean, onExpire: () => void) {
  const progress = useMotionValue(1);
  const expireRef = useRef(onExpire);
  useEffect(() => {
    expireRef.current = onExpire;
  }, [onExpire]);

  useEffect(() => {
    if (duration <= 0 || paused) return;
    const remaining = progress.get() * duration;
    if (remaining <= 0) return;
    const controls = animate(progress, 0, {
      duration: remaining / 1000,
      ease: "linear",
      onComplete: () => expireRef.current(),
    });
    return () => controls.stop();
  }, [duration, paused, progress]);

  return progress;
}

interface PileCardProps {
  item: PileToastData;
  look: PileLook;
  fromTop: boolean;
  interactive: boolean;
  onHeight: (id: string, height: number) => void;
  onDismiss: (id: string) => void;
  onSwipe: (id: string, dir: number) => void;
}

function PileCard({ item, look, fromTop, interactive, onHeight, onDismiss, onSwipe }: PileCardProps) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement | null>(null);
  const [hovered, setHovered] = useState(false);
  const [dragging, setDragging] = useState(false);

  const x = useMotionValue(0);
  // Tilt derives from the same value drag writes to, so entry, drag, and the
  // exit throw all share one continuous rotation.
  const rotate = useTransform(x, (v) => clamp(v * DRAG_TILT, -MAX_TILT, MAX_TILT));

  const variant = item.variant ?? "default";
  const tint = VARIANT_TINTS[variant];
  const Icon = VARIANT_ICONS[variant];
  const duration = item.duration ?? DEFAULT_DURATION;
  const progress = useCountdown(duration, hovered || dragging, () => onDismiss(item.id));

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const report = () => onHeight(item.id, el.offsetHeight);
    report();
    const observer = new ResizeObserver(report);
    observer.observe(el);
    return () => observer.disconnect();
  }, [item.id, onHeight]);

  const exitVariants: Variants = {
    exit: (dirs: Record<string, number>) => {
      const dir = dirs[item.id] ?? 1;
      return reduce
        ? { opacity: 0, transition: { duration: 0.15, ease: "easeOut" } }
        : { x: dir * 420, opacity: 0, transition: springSnappy };
    },
  };

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    setDragging(false);
    const gone =
      Math.abs(info.offset.x) > DISMISS_OFFSET ||
      Math.abs(info.velocity.x) > DISMISS_VELOCITY;
    if (!gone) return; // under threshold, the card springs back to its x: 0 target
    onSwipe(item.id, info.offset.x >= 0 || info.velocity.x > 0 ? 1 : -1);
    onDismiss(item.id);
  };

  return (
    <motion.div
      ref={ref}
      initial={
        reduce
          ? { opacity: 0 }
          : { opacity: 0, x: 56, y: fromTop ? -26 : 26, scale: 0.97, filter: "brightness(1)" }
      }
      animate={{
        x: 0,
        y: look.y,
        scale: look.scale,
        opacity: look.opacity,
        filter: `brightness(${look.brightness})`,
      }}
      exit="exit"
      variants={exitVariants}
      transition={springSoft}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={1}
      dragMomentum={false}
      dragListener={interactive}
      whileDrag={{ scale: 1.03, zIndex: 40 }}
      onDragStart={() => setDragging(true)}
      onDragEnd={handleDragEnd}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        x,
        rotate,
        zIndex: look.zIndex,
        transformOrigin: fromTop ? "50% 0%" : "50% 100%",
        pointerEvents: interactive ? "auto" : "none",
      }}
      className={cn(
        "absolute inset-x-0 rounded-[14px] bg-[var(--pollen-fill)] p-4 pr-10 transition-[box-shadow] duration-300",
        fromTop ? "top-0" : "bottom-0",
        look.shadow
      )}
    >
      <div className="flex items-start gap-3">
        <span
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full"
          style={{
            backgroundColor: `color-mix(in srgb, ${tint} 12%, transparent)`,
            color: tint,
          }}
        >
          <Icon size={15} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium leading-snug text-[var(--pollen-fg)]">{item.title}</p>
          {item.description && (
            <p className="mt-0.5 text-[13px] leading-snug text-[var(--pollen-fg-muted)]">
              {item.description}
            </p>
          )}
        </div>
      </div>
      <button
        type="button"
        aria-label="Dismiss"
        onClick={() => onDismiss(item.id)}
        className="absolute right-2.5 top-2.5 flex h-7 w-7 items-center justify-center rounded-md text-[var(--pollen-fg-faint)] transition-colors hover:bg-[var(--pollen-fill-strong)] hover:text-[var(--pollen-fg)] pointer-coarse:before:absolute pointer-coarse:before:-inset-2 pointer-coarse:before:content-['']"
      >
        <IconClose size={11} />
      </button>
      {duration > 0 && (
        <span className="pointer-events-none absolute inset-x-4 bottom-0 h-[2px] overflow-hidden">
          <motion.span
            className="block h-full w-full origin-left rounded-full"
            style={{ scaleX: progress, backgroundColor: tint, opacity: 0.5 }}
          />
        </span>
      )}
    </motion.div>
  );
}

/**
 * ToastPile - a deck of cards, not a column of them.
 *
 * New cards spring in from below-right and land in front. Older cards
 * tuck behind at reduced scale and brightness, three layers deep. Hover,
 * focus, or the stack badge fans the pile into a list on the same springs
 * that collapse it again. Any card drags horizontally: past a threshold
 * (or a hard enough flick) it springs off-screen and the pile heals
 * forward around it. Hovering a card pauses its countdown, a thin bar
 * along its bottom edge.
 *
 * Cards animate their y targets with springs rather than the layout prop
 * so a drag can interrupt the pile mid-flight.
 *
 * @example
 * <ToastPile toasts={toasts} onDismiss={(id) => setToasts((list) => list.filter((t) => t.id !== id))} />
 */
export function ToastPile({
  toasts,
  onDismiss,
  position = "bottom-right",
  expanded,
  className,
}: ToastPileProps) {
  const mounted = usePortalReady();
  const [hover, setHover] = useState(false);
  const [focusWithin, setFocusWithin] = useState(false);
  const [pinned, setPinned] = useState(false);
  const [exitDirs, setExitDirs] = useState<Record<string, number>>({});
  const [heights, setHeights] = useState<Record<string, number>>({});
  const stageRef = useRef<HTMLDivElement | null>(null);

  const fromTop = position === "top-right";
  const controlled = expanded !== undefined;
  const isOpen = controlled ? expanded : hover || focusWithin || pinned;

  const handleHeight = useCallback((id: string, height: number) => {
    setHeights((prev) => (prev[id] === height ? prev : { ...prev, [id]: height }));
  }, []);

  const handleSwipe = useCallback((id: string, dir: number) => {
    setExitDirs((prev) => ({ ...prev, [id]: dir }));
  }, []);

  // A press outside releases a pile the stack badge pinned open.
  useEffect(() => {
    if (controlled) return;
    const onDown = (e: PointerEvent) => {
      if (stageRef.current && !stageRef.current.contains(e.target as Node)) {
        setPinned(false);
        setHover(false);
      }
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [controlled]);

  // Offsets measured from the anchor edge, newest first, so the front card
  // sits at zero and each older card stacks above (or below) its seniors.
  const count = toasts.length;
  const heightOf = (id: string) => heights[id] ?? ESTIMATED_HEIGHT;
  const offsets: number[] = new Array(count);
  let running = 0;
  for (let i = count - 1; i >= 0; i--) {
    offsets[i] = running;
    running += heightOf(toasts[i].id) + PILE_GAP;
  }
  const expandedHeight = count > 0 ? running - PILE_GAP : 0;
  const collapsedHeight =
    count > 0 ? heightOf(toasts[count - 1].id) + (Math.min(count, MAX_LAYERS) - 1) * PILE_TUCK : 0;
  const stageHeight = isOpen ? expandedHeight : collapsedHeight;
  const hiddenCount = Math.max(0, count - MAX_LAYERS);
  const sign = fromTop ? 1 : -1;

  if (!mounted) return null;

  return createPortal(
    <div
      style={{ zIndex: Z_TOAST_PILE }}
      className={cn(
        "pointer-events-none fixed w-[360px] max-w-[calc(100vw-2.5rem)]",
        POSITION_CLASSES[position],
        className
      )}
    >
      <motion.div
        ref={stageRef}
        role="status"
        aria-live="polite"
        aria-label="Notifications"
        initial={false}
        animate={{ height: stageHeight }}
        transition={springSoft}
        onPointerEnter={() => setHover(true)}
        onPointerLeave={() => setHover(false)}
        onPointerDown={(e) => {
          if (e.pointerType === "touch") setPinned(true);
        }}
        onFocusCapture={() => setFocusWithin(true)}
        onBlurCapture={(e) => {
          const next = e.relatedTarget instanceof Node ? e.relatedTarget : null;
          if (!e.currentTarget.contains(next)) setFocusWithin(false);
        }}
        onKeyDown={(e) => {
          if (e.key !== "Escape") return;
          if (!controlled) {
            setPinned(false);
            return;
          }
          // The pile is its own document region: Escape dismisses the
          // front card, the same contract as the Toaster.
          const front = toasts[toasts.length - 1];
          if (front) onDismiss(front.id);
        }}
        className="pointer-events-auto relative w-full"
      >
        <AnimatePresence custom={exitDirs} initial={false}>
          {toasts.map((item, i) => {
            const depth = count - 1 - i;
            const slot = Math.min(depth, MAX_LAYERS - 1);
            const look: PileLook = {
              y: (isOpen ? offsets[i] : slot * PILE_TUCK) * sign,
              scale: isOpen ? 1 : Math.pow(0.95, slot),
              opacity: isOpen ? 1 : depth < MAX_LAYERS ? COLLAPSED_OPACITY[slot] : 0,
              brightness: isOpen ? 1 : COLLAPSED_BRIGHTNESS[slot],
              shadow:
                isOpen || depth === 0
                  ? "shadow-[var(--pollen-shadow-md)]"
                  : "shadow-[var(--pollen-shadow-lg)]",
              zIndex: 30 - depth,
            };
            return (
              <PileCard
                key={item.id}
                item={item}
                look={look}
                fromTop={fromTop}
                interactive={isOpen || depth === 0}
                onHeight={handleHeight}
                onDismiss={onDismiss}
                onSwipe={handleSwipe}
              />
            );
          })}
        </AnimatePresence>
        {hiddenCount > 0 && (
          <AnimatePresence>
            <motion.button
              key="stack-badge"
              type="button"
              aria-expanded={isOpen}
              aria-label={
                isOpen
                  ? "Collapse notification pile"
                  : `Show ${hiddenCount} more notification${hiddenCount === 1 ? "" : "s"}`
              }
              onClick={() => {
                if (!controlled) setPinned((p) => !p);
              }}
              initial={{ opacity: 0, y: fromTop ? 8 : -8, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{
                opacity: 0,
                y: fromTop ? 8 : -8,
                scale: 0.94,
                transition: { duration: 0.15, ease: "easeOut" },
              }}
              transition={springSnappy}
              className={cn(
                "absolute right-1 z-40 inline-flex h-7 items-center gap-1.5 rounded-full bg-[var(--pollen-fill)] px-2.5 text-[11px] font-medium text-[var(--pollen-fg-muted)] shadow-[var(--pollen-shadow-sm)] transition-colors hover:text-[var(--pollen-fg)]",
                fromTop ? "top-full mt-2.5" : "bottom-full mb-2.5"
              )}
            >
              <IconLayers size={12} />
              +{hiddenCount}
            </motion.button>
          </AnimatePresence>
        )}
      </motion.div>
    </div>,
    document.body
  );
}

ToastPile.displayName = "ToastPile";

/**
 * ToastPileProvider - mount once near the root of your app.
 *
 * Owns the pile state and renders a bottom-right ToastPile. Call
 * `pile()` from `useToastPile()` anywhere beneath it.
 *
 * @example
 * <ToastPileProvider>
 *   <App />
 * </ToastPileProvider>
 */
export function ToastPileProvider({
  children,
  position = "bottom-right",
}: {
  children: ReactNode;
  /** Where the pile docks. Default bottom-right. */
  position?: ToastPilePosition;
}) {
  const [toasts, setToasts] = useState<PileToastData[]>([]);
  const nextId = useRef(1);

  const dismiss = useCallback((id: string) => {
    setToasts((list) => list.filter((t) => t.id !== id));
  }, []);

  const pile = useCallback((input: ToastPileInput) => {
    const id = `pile-${nextId.current++}`;
    const record: PileToastData = {
      id,
      title: input.title,
      description: input.description,
      variant: input.variant ?? "default",
      duration: input.duration ?? DEFAULT_DURATION,
    };
    setToasts((list) => [...list.slice(-(MAX_KEPT - 1)), record]);
  }, []);

  const api = useMemo(() => ({ pile, dismiss }), [pile, dismiss]);

  return (
    <ToastPileContext.Provider value={api}>
      {children}
      <ToastPile toasts={toasts} onDismiss={dismiss} position={position} />
    </ToastPileContext.Provider>
  );
}

ToastPileProvider.displayName = "ToastPileProvider";

/** Access the pile function from anywhere under `ToastPileProvider`. */
export function useToastPile(): ToastPileApi {
  const ctx = useContext(ToastPileContext);
  if (!ctx) {
    throw new Error("useToastPile must be used inside <ToastPileProvider>");
  }
  return ctx;
}
