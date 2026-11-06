"use client";

import { useState } from "react";
import { Stepper } from "pollen-ui";

/**
 * One piece of state, announced as a spinbutton: focus the track
 * and the arrow keys change the value, the ends grey out at the
 * bounds, and the count bumps on every change.
 */
export function StepperDemo() {
  const [seats, setSeats] = useState(3);
  return (
    <div className="flex flex-wrap items-center justify-center gap-10">
      <div className="flex flex-col items-center gap-3">
        <Stepper
          value={seats}
          onValueChange={setSeats}
          min={1}
          max={12}
          aria-label="Seats"
        />
        <span className="font-mono text-[12.5px] text-muted-foreground">
          {seats} seat{seats === 1 ? "" : "s"}
        </span>
      </div>
      <div className="flex flex-col items-center gap-3">
        <Stepper
          defaultValue={0}
          min={0}
          max={99}
          size="sm"
          aria-label="Guest passes"
        />
        <span className="text-[12.5px] text-faint">
          size=&quot;sm&quot;, bounds grey out
        </span>
      </div>
    </div>
  );
}
