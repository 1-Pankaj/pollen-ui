import { cn } from "../lib/utils";

export interface SpinnerProps {
  /** Diameter in pixels. */
  size?: number;
  className?: string;
}

/**
 * Loading indicator. A single rotating arc, sized to match
 * surrounding text. Spin fast: perceived performance is part
 * of the design.
 */
export function Spinner({ size = 16, className }: SpinnerProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className={cn("shrink-0 text-current", className)}
    >
      <circle
        cx="8"
        cy="8"
        r="6.5"
        stroke="currentColor"
        strokeOpacity="0.2"
        strokeWidth="2"
      />
      <path
        d="M14.5 8A6.5 6.5 0 0 0 8 1.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        className="origin-center animate-[pollen-spin_0.6s_linear_infinite]"
      />
    </svg>
  );
}
