"use client";

import { useState, type ReactNode } from "react";
import { cn } from "../lib/utils";

export type AvatarStatus = "online" | "away" | "busy" | "offline";
export type AvatarVariant = "fill" | "accent" | "inverted" | "gradient";
export type AvatarShape = "circle" | "square";

export interface AvatarProps {
  src?: string;
  alt?: string;
  /** Shown when the image is missing or fails. Usually initials. */
  fallback?: string;
  /** Diameter in pixels. */
  size?: number;
  /** Presence dot in the lower right. Static, never animated. */
  status?: AvatarStatus;
  /**
   * Treatment of the initials fallback. "fill" is the quiet default,
   * "accent" puts the house accent behind white ink, "inverted" is
   * the high-contrast negative, and "gradient" derives a duotone
   * from the name - the same person gets the same colours in every
   * surface, with no server round-trip. Images ignore this.
   */
  variant?: AvatarVariant;
  /** "circle" (default) or "square" (rounded, card-style corners). */
  shape?: AvatarShape;
  /** Forwarded to the img element for real retina sources. */
  srcSet?: string;
  /** Forwarded to the img element alongside srcSet. */
  sizes?: string;
  className?: string;
}

const statusClasses: Record<AvatarStatus, string> = {
  online: "bg-success",
  away: "bg-warning",
  busy: "bg-danger",
  offline: "bg-faint",
};

/** Spoken text for the presence dot, since a colored dot has no words. */
const STATUS_LABELS: Record<AvatarStatus, string> = {
  online: "Online",
  away: "Away",
  busy: "Busy",
  offline: "Offline",
};

const variantClasses: Record<Exclude<AvatarVariant, "gradient">, string> = {
  fill: "bg-fill text-muted-foreground",
  accent: "bg-accent text-white",
  inverted: "bg-foreground text-background",
};

/**
 * Duotone pairs for the "gradient" fallback. Deliberately not theme
 * tokens: identity colours must not shift when the user retints the
 * accent or flips the theme. Ink is always white.
 */
const GRADIENTS: Array<readonly [string, string]> = [
  ["#6366F1", "#8B5CF6"],
  ["#0EA5E9", "#2563EB"],
  ["#10B981", "#0D9488"],
  ["#F59E0B", "#D97706"],
  ["#8B5CF6", "#D946EF"],
  ["#14B8A6", "#0891B2"],
  ["#EC4899", "#F43F5E"],
  ["#64748B", "#334155"],
];

function gradientOf(seed: string): readonly [string, string] {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return GRADIENTS[h % GRADIENTS.length];
}

const shapeClasses: Record<AvatarShape, string> = {
  circle: "rounded-full",
  square: "rounded-xl",
};

function initialsOf(fallback: string) {
  const parts = fallback.trim().split(/\s+/);
  return parts
    .slice(0, 2)
    .map((p) => Array.from(p)[0]?.toUpperCase() ?? "")
    .join("");
}

export function Avatar({
  src,
  alt,
  fallback = "",
  size = 32,
  status,
  variant = "fill",
  shape = "circle",
  srcSet,
  sizes,
  className,
}: AvatarProps) {
  const [failed, setFailed] = useState(false);
  // A new src is a new chance to load: reset the failure flag during
  // render when the source changes, or a swapped-in photo stays a
  // fallback forever.
  const [lastSrc, setLastSrc] = useState(src);
  if (src !== lastSrc) {
    setLastSrc(src);
    setFailed(false);
  }
  const showImage = src && !failed;
  const dotSize = Math.min(14, Math.max(9, Math.round(size * 0.3)));
  const shapeClass = shapeClasses[shape];
  const gradient = variant === "gradient" ? gradientOf(fallback || "?") : null;

  // The accessible name lives in exactly one place: the img's alt when
  // a photo is shown (alt defaults to the person's name), the wrapper's
  // role="img" label when initials stand in. An explicit alt="" stays
  // decorative in both paths.
  const name = alt !== undefined ? alt : fallback;
  const fallbackAnnounces = !showImage && name !== "";

  return (
    <span
      className={cn(
        "relative inline-flex shrink-0 select-none items-center justify-center overflow-visible",
        shapeClass,
        className,
      )}
      style={{ width: size, height: size }}
      role={fallbackAnnounces ? "img" : undefined}
      aria-label={fallbackAnnounces ? name : undefined}
    >
      <span
        className={cn(
          "inline-flex h-full w-full items-center justify-center overflow-hidden",
          gradient ? "text-white" : variantClasses[variant as Exclude<AvatarVariant, "gradient">],
          shapeClass,
        )}
        style={
          gradient
            ? { background: `linear-gradient(135deg, ${gradient[0]}, ${gradient[1]})` }
            : undefined
        }
      >
        {showImage ? (
          <img
            src={src}
            srcSet={srcSet}
            sizes={sizes}
            alt={name}
            width={size}
            height={size}
            loading="lazy"
            decoding="async"
            referrerPolicy="no-referrer"
            draggable={false}
            onError={() => setFailed(true)}
            className="h-full w-full object-cover"
          />
        ) : (
          <span
            className="font-medium"
            style={{
              fontSize: Math.max(10, Math.round(size / 2.8)),
              width: "100%",
              height: "100%",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {initialsOf(fallback)}
          </span>
        )}
      </span>
      {status && (
        <span
          role="img"
          aria-label={STATUS_LABELS[status]}
          className={cn(
            "absolute bottom-0 right-0 rounded-full ring-2 ring-[var(--avatar-ring,var(--pollen-card))]",
            statusClasses[status],
          )}
          style={{ width: dotSize, height: dotSize, transform: "translate(12%, 12%)" }}
        />
      )}
    </span>
  );
}

export interface AvatarGroupProps {
  children: ReactNode;
  /** Collapse to this many avatars, showing +N for the rest. */
  max?: number;
  /** Diameter of the +N overflow chip. Match it to the avatar size. */
  size?: number;
  className?: string;
}

/**
 * Overlapping avatars are separated by a 2px ring in the color of the
 * surrounding surface, so each circle reads as cut out of the page
 * instead of bordered. The ring defaults to the card surface; point
 * the --avatar-ring custom property at another surface token when a
 * group sits directly on the page background.
 */
export function AvatarGroup({ children, max, size = 32, className }: AvatarGroupProps) {
  const items = Array.isArray(children) ? children : [children];
  const visible = max !== undefined ? items.slice(0, max) : items;
  const overflow = items.length - visible.length;

  return (
    <div className={cn("flex -space-x-2", className)}>
      {visible.map((child, index) => (
        <span
          key={index}
          className="rounded-full ring-2 ring-[var(--avatar-ring,var(--pollen-card))]"
        >
          {child}
        </span>
      ))}
      {overflow > 0 && (
        <span
          role="img"
          aria-label={`${overflow} more`}
          className="inline-flex shrink-0 items-center justify-center rounded-full bg-fill font-medium text-muted-foreground ring-2 ring-[var(--avatar-ring,var(--pollen-card))]"
          style={{ width: size, height: size, fontSize: Math.max(10, Math.round(size / 2.8)) }}
        >
          +{overflow}
        </span>
      )}
    </div>
  );
}
