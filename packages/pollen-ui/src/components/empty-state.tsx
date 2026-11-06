"use client";

import type { ReactNode } from "react";
import { cn } from "../lib/utils";
import {
  IconSearch,
  IconMail,
  IconBox,
  IconFileCode,
  IconChat,
  IconAlert,
} from "../icons";

export type EmptyStateSize = "sm" | "md";
export type EmptyStateTone =
  | "neutral"
  | "accent"
  | "success"
  | "warning"
  | "danger";
export type EmptyScene =
  | "search"
  | "inbox"
  | "box"
  | "code"
  | "chat"
  | "error";

export interface EmptyStateProps {
  /** Custom illustration or icon slot, muted by default. Beats `scene`. */
  icon?: ReactNode;
  /** A built-in vignette: search, inbox, box, code, chat, error. */
  scene?: EmptyScene;
  title: string;
  description?: string;
  /** Primary action, usually a Button. */
  action?: ReactNode;
  /** Secondary action such as a link. */
  secondaryAction?: ReactNode;
  size?: EmptyStateSize;
  /** Colour of the scene tile and its glow. */
  tone?: EmptyStateTone;
  /** Drop the tile and render only the words. */
  plain?: boolean;
  className?: string;
}

const SCENES: Record<EmptyScene, ReactNode> = {
  search: <IconSearch className="h-5 w-5" />,
  inbox: <IconMail className="h-5 w-5" />,
  box: <IconBox className="h-5 w-5" />,
  code: <IconFileCode className="h-5 w-5" />,
  chat: <IconChat className="h-5 w-5" />,
  error: <IconAlert className="h-5 w-5" />,
};

const TONE_TILE: Record<EmptyStateTone, string> = {
  neutral: "bg-fill text-muted-foreground",
  accent:
    "bg-[color-mix(in_srgb,var(--pollen-accent)_12%,transparent)] text-[var(--pollen-accent)]",
  success:
    "bg-[color-mix(in_srgb,var(--pollen-success)_12%,transparent)] text-[var(--pollen-success)]",
  warning:
    "bg-[color-mix(in_srgb,var(--pollen-warning)_14%,transparent)] text-[var(--pollen-warning,#c2710c)]",
  danger:
    "bg-[color-mix(in_srgb,var(--pollen-danger)_12%,transparent)] text-[var(--pollen-danger)]",
};

/**
 * For genuinely empty views: searches with no results, inboxes
 * with nothing in them, flows that errored. Pick a built-in scene
 * or bring your own icon, choose a tone, add one or two actions.
 * `plain` drops the tile for tight inline empties. No filler
 * illustrations.
 *
 * @example
 * <EmptyState scene="search" title="No results"
 *   description="Try a different term or clear the filters."
 *   action={<Button size="sm">Clear filters</Button>} />
 */
export function EmptyState({
  icon,
  scene,
  title,
  description,
  action,
  secondaryAction,
  size = "md",
  tone = "neutral",
  plain = false,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center",
        size === "sm" ? "px-6 py-10" : "px-6 py-16",
        className,
      )}
    >
      {!plain && (icon || scene) && (
        <span
          className={cn(
            "mb-5 flex items-center justify-center rounded-2xl [&_svg]:h-5 [&_svg]:w-5",
            TONE_TILE[tone],
            size === "sm" ? "h-11 w-11" : "h-14 w-14",
          )}
        >
          {icon ?? (scene ? SCENES[scene] : null)}
        </span>
      )}
      <p
        className={cn(
          "font-semibold tracking-[-0.01em] text-foreground",
          size === "sm" ? "text-[15px]" : "text-lg",
        )}
      >
        {title}
      </p>
      {description && (
        <p
          className={cn(
            "mt-1.5 max-w-sm leading-relaxed text-muted-foreground",
            size === "sm" ? "text-[13px]" : "text-[15px]",
          )}
        >
          {description}
        </p>
      )}
      {(action || secondaryAction) && (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5">
          {action}
          {secondaryAction}
        </div>
      )}
    </div>
  );
}
