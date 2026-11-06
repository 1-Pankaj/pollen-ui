"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

const ticketVariants = cva(
  "relative flex overflow-hidden rounded-[16px] bg-card text-foreground",
  {
    variants: {
      perforated: {
        true: "",
        false: "",
      },
    },
    defaultVariants: { perforated: true },
  }
);

export interface TicketCardProps
  extends Omit<
      React.HTMLAttributes<HTMLDivElement>,
      "onAnimationStart" | "onAnimationEnd" | "onAnimationIteration" | "onDragStart" | "onDrag" | "onDragEnd" | "onDragOver" | "style"
    >,
    VariantProps<typeof ticketVariants> {
  /** Main content area. */
  children: React.ReactNode;
  /** Detached stub content rendered after the perforation. */
  stub?: React.ReactNode;
  /** Show the dashed tear line. Default true. */
  perforated?: boolean;
  /** Horizontal lays out the stub to the right; vertical stacks it underneath. */
  orientation?: "horizontal" | "vertical";
  /** Which edges get the punched notch. Default both. */
  notch?: "both" | "left" | "right" | "none";
  /** Paints a quiet accent strip along the leading edge. */
  accentEdge?: boolean;
  /** Content density. */
  size?: "sm" | "md" | "lg";
}

const PAD = {
  sm: "p-3.5",
  md: "p-5",
  lg: "p-6",
} as const;

const STUB_W = {
  sm: "w-[84px]",
  md: "w-[104px]",
  lg: "w-[120px]",
} as const;

const STUB_H = {
  sm: "h-[64px]",
  md: "h-[84px]",
  lg: "h-[96px]",
} as const;

/**
 * TicketCard - admission for one, please.
 *
 * A card with punched side notches and a dashed perforation, the
 * way real tickets are die-cut. The stub detaches visually from
 * the body, which makes it perfect for bookings, raffles, event
 * rows, or any record you want to feel physical. Works in both
 * orientations, all four notch arrangements, and can carry a quiet
 * accent edge.
 *
 * @example
 * <TicketCard stub={<span>No. 0042</span>}>
 *   <h4>Night Bloom Society</h4>
 *   <p>Table for two</p>
 * </TicketCard>
 * <TicketCard orientation="vertical" accentEdge stub={<QrCode />} />
 */
export function TicketCard({
  children,
  stub,
  perforated = true,
  orientation = "horizontal",
  notch = "both",
  accentEdge = false,
  size = "md",
  className,
  ...props
}: TicketCardProps) {
  const vertical = orientation === "vertical";
  const bodyPad = vertical ? cn(PAD[size], "pb-4") : PAD[size];

  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      className={cn(
        ticketVariants({ perforated }),
        vertical && "flex-col",
        "shadow-[var(--pollen-shadow-md)]",
        className,
      )}
      {...props}
    >
      {accentEdge && (
        <span
          aria-hidden
          className={cn(
            "shrink-0 bg-[var(--pollen-accent)]",
            vertical ? "h-1 w-full" : "w-1 self-stretch",
          )}
        />
      )}
      <div className={cn("relative min-w-0 flex-1", bodyPad)}>
        {children}
      </div>
      {stub && (
        <>
          {perforated && (
            <div
              aria-hidden
              className={cn(
                "border-dashed border-[var(--pollen-border-strong)]",
                vertical ? "border-t-2" : "border-l-2 w-0",
              )}
            />
          )}
          <div
            className={cn(
              "relative flex shrink-0 flex-col items-center justify-center gap-1 bg-fill/60 text-center",
              vertical
                ? cn(STUB_H[size], "max-w-full flex-row items-center justify-center px-3.5")
                : cn(STUB_W[size], "max-w-full p-3.5"),
            )}
          >
            {stub}
          </div>
        </>
      )}
      {/* Punched notches: page-toned circles bite into the edges.
          Painted fills instead of a mask, so the card shadow stays
          intact and the cut renders in every browser. */}
      {vertical ? (
        <>
          {(notch === "both" || notch === "left") && (
            <span
              aria-hidden
              className="pointer-events-none absolute left-1/2 top-[-11px] h-[22px] w-[22px] -translate-x-1/2 rounded-full bg-background"
            />
          )}
          {(notch === "both" || notch === "right") && (
            <span
              aria-hidden
              className="pointer-events-none absolute bottom-[-11px] left-1/2 h-[22px] w-[22px] -translate-x-1/2 rounded-full bg-background"
            />
          )}
        </>
      ) : (
        <>
          {(notch === "both" || notch === "left") && (
            <span
              aria-hidden
              className="pointer-events-none absolute left-[-11px] top-1/2 h-[22px] w-[22px] -translate-y-1/2 rounded-full bg-background"
            />
          )}
          {(notch === "both" || notch === "right") && (
            <span
              aria-hidden
              className="pointer-events-none absolute right-[-11px] top-1/2 h-[22px] w-[22px] -translate-y-1/2 rounded-full bg-background"
            />
          )}
        </>
      )}
    </motion.div>
  );
}

TicketCard.displayName = "TicketCard";
