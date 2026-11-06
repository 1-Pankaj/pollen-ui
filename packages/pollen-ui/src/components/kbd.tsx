import type { HTMLAttributes } from "react";
import { cn } from "../lib/utils";

export type KbdProps = HTMLAttributes<HTMLElement>;

/** Keyboard key. Use for shortcuts: ⌘, K, Enter, arrows. */
export function Kbd({ className, ...props }: KbdProps) {
  return (
    <kbd
      className={cn(
        "inline-flex h-6 min-w-6 items-center justify-center rounded-[7px] bg-fill px-1.5 font-mono text-xs font-medium text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}
