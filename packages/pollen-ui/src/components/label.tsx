import type { LabelHTMLAttributes } from "react";
import { cn } from "../lib/utils";

export type LabelProps = LabelHTMLAttributes<HTMLLabelElement>;

/** Field label. Pair it with an Input, Select, Checkbox or Radio. */
export function Label({ className, ...props }: LabelProps) {
  return (
    <label
      className={cn("block text-sm font-medium text-foreground", className)}
      {...props}
    />
  );
}
