"use client";

import {
  IconCheck as Check,
} from "../icons";
import { cn } from "../lib/utils";

export interface StepItem {
  title: string;
  description?: string;
}

export interface StepsProps {
  steps: StepItem[];
  /** Index of the current step, 0-indexed. Steps before it are complete. */
  value: number;
  className?: string;
}

/**
 * A horizontal progress stepper. Finished steps show a check,
 * the current step is filled, and the connector between steps
 * fills as progress moves.
 */
export function Steps({ steps = [], value, className }: StepsProps) {
  return (
    <ol
      role="list"
      aria-label="Progress"
      className={cn("flex w-full items-start", className)}
    >
      {steps.map((step, index) => {
        const done = index < value;
        const active = index === value;
        const last = index === steps.length - 1;
        return (
          <li
            key={step.title}
            aria-current={active ? "step" : undefined}
            className={cn("flex items-start", !last && "flex-1")}
          >
            <div className="flex flex-col items-center">
              <span
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[13px] font-semibold transition-colors duration-200",
                  done && "bg-foreground text-background",
                  active && "bg-accent text-white",
                  !done && !active && "bg-fill text-faint",
                )}
              >
                {done ? <Check className="h-4 w-4" /> : index + 1}
              </span>
              <span
                className={cn(
                  "mt-2 max-w-[120px] text-center text-[13px] font-medium leading-snug",
                  done || active ? "text-foreground" : "text-faint",
                )}
              >
                {step.title}
              </span>
              {step.description && (
                <span className="mt-1 max-w-[140px] text-center text-xs leading-snug text-faint">
                  {step.description}
                </span>
              )}
            </div>
            {!last && (
              <span
                aria-hidden="true"
                className="mt-4 h-1 flex-1 self-start overflow-hidden rounded-full bg-fill"
              >
                <span
                  className={cn(
                    "block h-full rounded-full bg-foreground transition-[width] duration-500",
                    done ? "w-full" : "w-0",
                  )}
                />
              </span>
            )}
          </li>
        );
      })}
    </ol>
  );
}
