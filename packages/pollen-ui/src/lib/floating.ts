"use client";

/**
 * A tiny positioning layer for portaled panels.
 *
 * Panels (menus, listboxes, popovers, tooltips) render at the end
 * of <body> so no overflow container can ever clip them. This file
 * computes where a panel belongs relative to its trigger: it flips
 * when the viewport edge is closer than the trigger, clamps inside
 * the viewport, and reports the transform origin that matches the
 * placed edge so the entrance still scales out of the trigger.
 */

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type RefObject,
} from "react";
import { Z_FLOATING } from "./z-index";

export type FloatSide = "top" | "bottom" | "left" | "right";
export type FloatAlign = "start" | "center" | "end";

export interface FloatConfig {
  /** Preferred side. Flips automatically when it does not fit. */
  side?: FloatSide;
  /** Alignment along the trigger edge. */
  align?: FloatAlign;
  /** Gap between trigger and panel in pixels. */
  offset?: number;
  /** Give the panel the trigger's width, like a listbox. */
  matchWidth?: boolean;
  /**
   * Direction context for mirroring. Defaults to the trigger's
   * computed direction: in RTL documents, "start" aligns to the
   * trigger's right edge and left/right sides swap, so panels open
   * the way the text reads.
   */
  dir?: "ltr" | "rtl";
}

export interface FloatPosition {
  top: number;
  left: number;
  width?: number;
  side: FloatSide;
  origin: string;
}

/**
 * A position-only anchor for panels opened at a pointer (context
 * menus): the floating-UI "virtual element" pattern. It answers the
 * one geometry question panels need and nothing else - it is NOT a
 * DOM node, so anything beyond getBoundingClientRect must not touch
 * it.
 */
export interface VirtualAnchor {
  getBoundingClientRect: () => DOMRect;
}

export type FloatAnchor = HTMLElement | VirtualAnchor;

function isElement(anchor: FloatAnchor | null): anchor is HTMLElement {
  return typeof Element !== "undefined" && anchor instanceof Element;
}

function documentDirection(): "ltr" | "rtl" {
  if (typeof document === "undefined") return "ltr";
  return getComputedStyle(document.documentElement).direction === "rtl"
    ? "rtl"
    : "ltr";
}

const PADDING = 8;

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function computePosition(
  trigger: DOMRect,
  panel: { width: number; height: number },
  config: FloatConfig = {},
): FloatPosition {
  const side = config.side ?? "bottom";
  const align = config.align ?? "start";
  const offset = config.offset ?? 8;
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const width = config.matchWidth ? trigger.width : panel.width;
  const height = panel.height;

  // Mirror the request for right-to-left documents: "start" is the
  // right edge, "end" the left, and horizontal sides swap. Every
  // later computation, including the transform origin, works off the
  // mirrored values so the panel still scales out of its trigger.
  const rtl = config.dir === "rtl";
  const effSide = rtl
    ? side === "left"
      ? "right"
      : side === "right"
        ? "left"
        : side
    : side;
  const effAlign = rtl
    ? align === "start"
      ? "end"
      : align === "end"
        ? "start"
        : align
    : align;

  let finalSide = effSide;
  let top: number;
  let left: number;

  if (effSide === "top" || effSide === "bottom") {
    const fitsBelow = trigger.bottom + offset + height <= vh - PADDING;
    const fitsAbove = trigger.top - offset - height >= PADDING;
    if (effSide === "bottom" && !fitsBelow && fitsAbove) finalSide = "top";
    if (effSide === "top" && !fitsAbove && fitsBelow) finalSide = "bottom";
    top =
      finalSide === "bottom"
        ? trigger.bottom + offset
        : trigger.top - offset - height;
    if (effAlign === "start") left = trigger.left;
    else if (effAlign === "center") left = trigger.left + trigger.width / 2 - width / 2;
    else left = trigger.right - width;
    left = clamp(left, PADDING, Math.max(PADDING, vw - width - PADDING));
  } else {
    const fitsRight = trigger.right + offset + width <= vw - PADDING;
    const fitsLeft = trigger.left - offset - width >= PADDING;
    if (effSide === "right" && !fitsRight && fitsLeft) finalSide = "left";
    if (effSide === "left" && !fitsLeft && fitsRight) finalSide = "right";
    left =
      finalSide === "right"
        ? trigger.right + offset
        : trigger.left - offset - width;
    if (effAlign === "start") top = trigger.top;
    else if (effAlign === "center") top = trigger.top + trigger.height / 2 - height / 2;
    else top = trigger.bottom - height;
    top = clamp(top, PADDING, Math.max(PADDING, vh - height - PADDING));
  }

  let origin: string;
  if (finalSide === "top" || finalSide === "bottom") {
    const h = effAlign === "start" ? "left" : effAlign === "center" ? "center" : "right";
    origin = `${finalSide === "bottom" ? "top" : "bottom"} ${h}`;
  } else {
    const v = effAlign === "start" ? "top" : effAlign === "center" ? "center" : "bottom";
    origin = `${v} ${finalSide === "right" ? "left" : "right"}`;
  }

  return {
    top,
    left,
    width: config.matchWidth ? trigger.width : undefined,
    side: finalSide,
    origin,
  };
}

/** True when the event target sits inside any of the given refs. */
export function isEventInside(
  target: EventTarget | null,
  ...refs: (RefObject<HTMLElement | null>)[]
) {
  const node = target as Node | null;
  if (!node) return false;
  return refs.some((ref) => ref.current?.contains(node));
}

/**
 * Measures the trigger and panel and keeps a fixed position in
 * state while open. The panel mounts hidden on the first commit,
 * is measured in a layout effect (before paint), then positioned:
 * nothing ever flashes at the wrong coordinate.
 */
export function useFloatingPanel(
  open: boolean,
  triggerRef: RefObject<FloatAnchor | null>,
  config: FloatConfig = {},
) {
  const panelRef = useRef<HTMLDivElement | null>(null);
  const [position, setPosition] = useState<FloatPosition | null>(null);
  const configRef = useRef(config);

  // Keep the latest config without writing refs during render.
  useLayoutEffect(() => {
    configRef.current = config;
  });

  const measure = () => {
    const trigger = triggerRef.current;
    const panel = panelRef.current;
    if (!trigger || !panel) return;
    const rect = trigger.getBoundingClientRect();
    // Direction comes from the trigger's own subtree when the caller
    // did not pin it, so embedded RTL sections mirror on their own.
    // Virtual anchors are not DOM nodes; they read the document.
    const cfg = configRef.current;
    const dir =
      cfg.dir ??
      (isElement(trigger)
        ? getComputedStyle(trigger).direction === "rtl"
          ? "rtl"
          : "ltr"
        : documentDirection());
    const next = computePosition(
      rect,
      { width: panel.offsetWidth, height: panel.offsetHeight },
      { ...cfg, dir },
    );
    setPosition((prev) => {
      if (
        prev &&
        prev.top === next.top &&
        prev.left === next.left &&
        prev.width === next.width &&
        prev.side === next.side &&
        prev.origin === next.origin
      ) {
        return prev;
      }
      return next;
    });
  };

  useLayoutEffect(() => {
    if (open) measure();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onReposition = () => measure();
    window.addEventListener("resize", onReposition);
    window.addEventListener("scroll", onReposition, true);
    return () => {
      window.removeEventListener("resize", onReposition);
      window.removeEventListener("scroll", onReposition, true);
    };
  }, [open]);

  return { panelRef, position, measure };
}

/** Style for a portaled panel. Hidden until the first measurement. */
export function panelStyle(position: FloatPosition | null): CSSProperties {
  if (!position) {
    return {
      position: "fixed",
      top: 0,
      left: 0,
      zIndex: Z_FLOATING,
      visibility: "hidden",
    };
  }
  return {
    position: "fixed",
    top: position.top,
    left: position.left,
    width: position.width,
    zIndex: Z_FLOATING,
  };
}
