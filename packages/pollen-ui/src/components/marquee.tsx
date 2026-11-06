import type { ReactNode } from "react";
import { cn } from "../lib/utils";

export interface MarqueeProps {
  children: ReactNode;
  /** Seconds for one full loop. */
  duration?: number;
  reverse?: boolean;
  pauseOnHover?: boolean;
  className?: string;
}

/**
 * Infinite horizontal ticker. Content is duplicated for a
 * continuous loop and the edges fade out. Pauses on hover.
 */
export function Marquee({
  children,
  duration = 30,
  reverse = false,
  pauseOnHover = true,
  className,
}: MarqueeProps) {
  return (
    <div
      className={cn(
        "group flex overflow-hidden",
        "[mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]",
        className,
      )}
    >
      <div
        className={cn(
          "flex w-max shrink-0 animate-[pollen-marquee_var(--marquee-duration)_linear_infinite]",
          pauseOnHover && "[@media(hover:hover)]:group-hover:[animation-play-state:paused]",
          reverse && "[animation-direction:reverse]",
        )}
        style={{ "--marquee-duration": `${duration}s` } as React.CSSProperties}
      >
        <div className="flex items-center">{children}</div>
        <div className="flex items-center" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
}
