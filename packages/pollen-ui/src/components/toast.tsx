"use client";

import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  IconCircleCheck as CircleCheck,
  IconCircleClose as CircleX,
  IconAlert as TriangleAlert,
  IconClose as X,
} from "../icons";
import { cn } from "../lib/utils";
import { useIsClient } from "../lib/use-is-client";
import {
  Z_TOASTER,
  Z_TOAST_CARD_BASE,
} from "../lib/z-index";
import { springSnappy } from "../lib/springs";
import { Spinner } from "./spinner";

export type ToastVariant =
  | "default"
  | "success"
  | "error"
  | "warning"
  | "loading";

export type ToastPosition =
  | "top-left"
  | "top-center"
  | "top-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";

export interface ToastAction {
  label: string;
  onClick: () => void;
}

export interface ToastOptions {
  description?: ReactNode;
  action?: ToastAction;
  /** Auto dismiss in ms. Defaults to 4000, infinite while loading. */
  duration?: number;
}

interface ToastData {
  id: number;
  title: ReactNode;
  description?: ReactNode;
  variant: ToastVariant;
  action?: ToastAction;
  duration: number;
  /** Epoch ms when the timer runs out. Infinity while paused-able loading. */
  expiresAt: number;
  /** Remaining ms captured when the stack pauses on hover. */
  remaining: number;
}

/* ------------------------------------------------------------------
   Tiny external store, sonner style: toast() works anywhere and
   the <Toaster /> component picks it up. No provider required.
   ------------------------------------------------------------------ */

let toasts: ToastData[] = [];
let counter = 0;
const listeners = new Set<(toasts: ToastData[]) => void>();
/** Per-toast fly-out vector captured from the swipe gesture, read
    by the exit animation. */
const exitVector = new Map<number, { x: number; y: number }>();

function emit() {
  for (const listener of listeners) listener([...toasts]);
}

function commit(next: ToastData[]) {
  toasts = next;
  emit();
}

function now(): number {
  return typeof performance !== "undefined" ? performance.now() + Date.now() - performance.now() : Date.now();
}

function add(variant: ToastVariant, title: ReactNode, options?: ToastOptions) {
  const id = ++counter;
  const duration =
    options?.duration ?? (variant === "loading" ? Infinity : 4000);
  const record: ToastData = {
    id,
    title,
    description: options?.description,
    variant,
    action: options?.action,
    duration,
    expiresAt: duration === Infinity ? Infinity : now() + duration,
    remaining: duration,
  };
  // The store keeps a generous history so an expanded stack can show
  // everything from this session; the Toaster decides visibility.
  commit([...toasts, record].slice(-12));
  return id;
}

function patch(id: number, changes: Partial<ToastData>) {
  commit(toasts.map((t) => (t.id === id ? { ...t, ...changes } : t)));
}

export const toast = Object.assign(
  (title: ReactNode, options?: ToastOptions) => add("default", title, options),
  {
    success: (title: ReactNode, options?: ToastOptions) => add("success", title, options),
    error: (title: ReactNode, options?: ToastOptions) => add("error", title, options),
    warning: (title: ReactNode, options?: ToastOptions) => add("warning", title, options),
    loading: (title: ReactNode, options?: ToastOptions) => add("loading", title, options),
    dismiss: (id?: number) => {
      commit(id === undefined ? [] : toasts.filter((t) => t.id !== id));
    },
    /** Bring a background toast in the pile to the front. */
    focus: (id: number) => {
      const found = toasts.find((t) => t.id === id);
      if (found && toasts.indexOf(found) !== toasts.length - 1) {
        commit([...toasts.filter((t) => t.id !== id), found]);
      }
    },
    promise: async <T,>(
      promise: Promise<T>,
      messages: { loading: ReactNode; success: ReactNode | ((value: T) => ReactNode); error: ReactNode },
      options?: ToastOptions,
    ): Promise<T> => {
      const id = add("loading", messages.loading, options);
      try {
        const value = await promise;
        patch(id, {
          variant: "success",
          duration: 4000,
          expiresAt: now() + 4000,
          remaining: 4000,
          title:
            typeof messages.success === "function"
              ? messages.success(value)
              : messages.success,
          description: undefined,
        });
        return value;
      } catch (error) {
        patch(id, {
          variant: "error",
          duration: 5000,
          expiresAt: now() + 5000,
          remaining: 5000,
          title: messages.error,
          description: undefined,
        });
        throw error;
      }
    },
  },
);

export interface ToasterProps {
  position?: ToastPosition;
  /** How many toasts peek in the collapsed pile. Default 3. */
  visibleToasts?: number;
  /** Gap between cards while expanded, px. Default 12. */
  gap?: number;
}

const positionClasses: Record<ToastPosition, string> = {
  // Fixed chrome respects the notch/home-indicator insets; env() is 0 on
  // desktop so the rendered offsets are unchanged there.
  "bottom-right": "bottom-[calc(1rem_+_env(safe-area-inset-bottom))] right-[calc(1rem_+_env(safe-area-inset-right))] items-end",
  "bottom-center": "bottom-[calc(1rem_+_env(safe-area-inset-bottom))] inset-x-0 justify-center",
  "bottom-left": "bottom-[calc(1rem_+_env(safe-area-inset-bottom))] left-[calc(1rem_+_env(safe-area-inset-left))] items-start",
  "top-right": "top-[calc(1rem_+_env(safe-area-inset-top))] right-[calc(1rem_+_env(safe-area-inset-right))] items-end",
  "top-center": "top-[calc(1rem_+_env(safe-area-inset-top))] inset-x-0 justify-center",
  "top-left": "top-[calc(1rem_+_env(safe-area-inset-top))] left-[calc(1rem_+_env(safe-area-inset-left))] items-start",
};

const variantIcons: Record<Exclude<ToastVariant, "default">, ReactNode> = {
  success: <CircleCheck className="mt-px h-[18px] w-[18px] shrink-0 text-success" />,
  error: <CircleX className="mt-px h-[18px] w-[18px] shrink-0 text-danger" />,
  warning: <TriangleAlert className="mt-px h-[18px] w-[18px] shrink-0 text-warning" />,
  loading: <Spinner size={18} className="mt-px shrink-0 text-muted-foreground" />,
};

const PEEK = 15; // px of each background card that peeks out
const DEPTH_SCALE = 0.05;
const DEPTH_FADE = 0.22;

/**
 * The stacked toaster. Toasts land on a pile: the newest in front,
 * the older ones scaled and peeking behind it. Hover the pile and it
 * fans out into a full list; leave and it collapses again. The front
 * toast swipes away in any direction, background toasts come to the
 * front when clicked, and Escape dismisses the front card.
 */
export function Toaster({
  position = "bottom-right",
  visibleToasts = 3,
  gap = 12,
}: ToasterProps) {
  const mounted = useIsClient();
  const reduce = useReducedMotion();
  const [items, setItems] = useState<ToastData[]>([]);
  const [hovering, setHovering] = useState(false);
  const [heights, setHeights] = useState<Map<number, number>>(new Map());

  useEffect(() => {
    const listener = (next: ToastData[]) => setItems(next);
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  // One clock for the whole stack: pause on hover, expire on tick.
  useEffect(() => {
    if (hovering) {
      for (const t of toasts) {
        if (t.expiresAt !== Infinity) patch(t.id, { remaining: Math.max(t.expiresAt - now(), 400) });
      }
      return;
    }
    const resumed = now();
    for (const t of toasts) {
      if (t.expiresAt === Infinity && t.duration !== Infinity) {
        patch(t.id, { expiresAt: resumed + t.remaining });
      }
    }
    const timer = setInterval(() => {
      const t0 = now();
      const expired = toasts.filter((t) => t.expiresAt !== Infinity && t0 > t.expiresAt);
      if (expired.length) commit(toasts.filter((t) => !expired.includes(t)));
    }, 500);
    return () => clearInterval(timer);
  }, [hovering]);

  // Escape dismisses the front toast.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && toasts.length) {
        toast.dismiss(toasts[toasts.length - 1].id);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const measure = (id: number, el: HTMLDivElement | null) => {
    if (!el) return;
    const h = el.offsetHeight;
    if (h > 0) {
      setHeights((prev) => {
        if (prev.get(id) === h) return prev;
        const next = new Map(prev);
        next.set(id, h);
        return next;
      });
    }
  };

  if (!mounted) return null;

  const top = position.startsWith("top");
  const isCenter = position.endsWith("center");
  const total = items.length;
  // Depth 0 is the newest (front of the pile).
  const depthOf = (index: number) => total - 1 - index;

  // Cumulative layout: front card sits at the anchor edge, older
  // cards stack behind it toward the page.
  let acc = 0;
  const offsets: number[] = new Array(total);
  for (let i = total - 1; i >= 0; i--) {
    const depth = depthOf(i);
    const h = heights.get(items[i].id) ?? 84;
    if (hovering) {
      offsets[i] = acc;
      acc += h + gap;
    } else {
      offsets[i] = depth * PEEK;
    }
  }
  const frontHeight = total ? (heights.get(items[total - 1].id) ?? 84) : 0;
  const stackHeight = hovering
    ? Math.max(acc - gap, frontHeight)
    : frontHeight + Math.min(Math.max(total - 1, 0), visibleToasts - 1) * PEEK;

  return createPortal(
    <div
      role="region"
      aria-label="Notifications"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      style={{ zIndex: Z_TOASTER }}
      className={cn(
        "pointer-events-none fixed flex max-w-[calc(100vw-2rem)]",
        positionClasses[position],
      )}
    >
      <div
        className={cn("relative", isCenter ? "w-[calc(100vw-2rem)] max-w-[400px]" : "w-[368px] max-w-[calc(100vw-2rem)]")}
        style={{ height: Math.max(stackHeight, 0), transition: "height 280ms cubic-bezier(0.22, 1, 0.36, 1)" }}
      >
        <AnimatePresence initial={false}>
          {items.map((item, index) => {
            const depth = depthOf(index);
            const front = depth === 0;
            const hidden = depth >= visibleToasts && !hovering;
            const off = offsets[index];
            const exitVec = exitVector.get(item.id);
            return (
              <motion.div
                key={item.id}
                ref={(el) => measure(item.id, el)}
                role="status"
                custom={{ top, front, exitVec }}
                initial={{
                  opacity: 0,
                  scale: 0.92,
                  y: top ? -24 : 28,
                  x: isCenter ? 0 : position.endsWith("right") ? 40 : -40,
                }}
                animate={{
                  opacity: hidden ? 0 : 1 - (hovering ? 0 : depth * DEPTH_FADE),
                  scale: hovering ? 1 : 1 - depth * DEPTH_SCALE,
                  y: 0,
                  x: 0,
                  [top ? "top" : "bottom"]: off,
                }}
                exit={{
                  opacity: 0,
                  scale: 0.94,
                  x: exitVec ? exitVec.x : 0,
                  y: exitVec ? exitVec.y : top ? -18 : 18,
                  transition: { duration: reduce ? 0 : 0.22, ease: [0.4, 0, 1, 1] },
                }}
                transition={reduce ? { duration: 0 } : springSnappy}
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  zIndex: Z_TOAST_CARD_BASE - depth,
                  transformOrigin: top ? "center top" : "center bottom",
                }}
                className="pointer-events-auto"
                onClick={() => {
                  if (!front) toast.focus(item.id);
                }}
              >
                <ToastCard toast={item} front={front} hovering={hovering} />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>,
    document.body,
  );
}

function ToastCard({
  toast: data,
  front,
  hovering,
}: {
  toast: ToastData;
  front: boolean;
  hovering: boolean;
}) {
  const icon = data.variant === "default" ? null : variantIcons[data.variant];
  const dragActive = front || hovering;

  const swipeAway = (_: unknown, info: { offset: { x: number; y: number }; velocity: { x: number; y: number } }) => {
    const dx = info.offset.x;
    const dy = info.offset.y;
    const vx = info.velocity.x;
    const vy = info.velocity.y;
    const away = Math.hypot(dx, dy) > 72 || Math.hypot(vx, vy) > 420;
    if (!away) return;
    // Fly out along the gesture, so the card leaves where the hand
    // sent it.
    const len = Math.max(Math.hypot(dx, dy), 1);
    return { x: (dx / len) * 280 + vx * 0.06, y: (dy / len) * 280 + vy * 0.06 };
  };

  return (
    <motion.div
      drag={dragActive}
      dragDirectionLock
      dragSnapToOrigin
      dragElastic={0.55}
      dragMomentum={false}
      whileDrag={{ cursor: "grabbing" }}
      onDragEnd={(_, info) => {
        const vec = swipeAway(null, info);
        if (vec) {
          exitVector.set(data.id, vec);
          toast.dismiss(data.id);
        }
      }}
      className={cn(
        "relative flex gap-3 rounded-2xl bg-[var(--pollen-fill)] p-4 pr-11 shadow-[var(--pollen-shadow-lg)]",
        "backdrop-blur-sm",
        !front && "cursor-pointer",
      )}
    >
      {icon}
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium leading-snug text-[var(--pollen-fg)]">{data.title}</p>
        {data.description && (
          <p className="mt-1 text-[13px] leading-snug text-[var(--pollen-fg-muted)]">{data.description}</p>
        )}
        {data.action && (
          <div className="mt-3 flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                data.action?.onClick();
                toast.dismiss(data.id);
              }}
              className="rounded-lg bg-[var(--pollen-fill)] px-2.5 py-1 text-[13px] font-medium text-[var(--pollen-fg)] transition-colors duration-150 hover:bg-[var(--pollen-fill-strong)] active:scale-[0.97]"
            >
              {data.action.label}
            </button>
          </div>
        )}
      </div>
      <button
        type="button"
        aria-label="Dismiss notification"
        onClick={(e) => {
          e.stopPropagation();
          exitVector.set(data.id, { x: 0, y: 0 });
          toast.dismiss(data.id);
        }}
        className={cn(
          "absolute right-2.5 top-2.5 flex h-7 w-7 items-center justify-center rounded-lg text-[var(--pollen-fg-faint)] transition-all duration-150",
          // Invisible hit-area expansion on touch: the 28px button meets
          // the ~40px minimum without changing its rendered size.
          "pointer-coarse:before:absolute pointer-coarse:before:-inset-2 pointer-coarse:before:content-['']",
          "hover:bg-[var(--pollen-fill-strong)] hover:text-[var(--pollen-fg)]",
          front || hovering ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        tabIndex={front || hovering ? 0 : -1}
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </motion.div>
  );
}

Toaster.displayName = "Toaster";
