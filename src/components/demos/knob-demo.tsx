"use client";

import { useState } from "react";
import { Knob } from "pollen-ui";

/**
 * Three dials, one piece of state each: the classic 270 degree
 * sweep in accent, a gauge-style 180 degree sweep in success, and
 * a wide-sweep danger dial with a decimal readout.
 */
export function KnobBasicDemo() {
  const [level, setLevel] = useState(64);
  return (
    <div className="flex flex-wrap items-center justify-center gap-10">
      <Knob
        value={level}
        onValueChange={setLevel}
        min={0}
        max={100}
        label="Level"
      />
      <div className="w-40">
        <p className="font-mono text-[13px] text-muted-foreground">
          value = {level}
        </p>
        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-fill">
          <div
            className="h-full rounded-full bg-accent transition-[width] duration-100"
            style={{ width: `${level}%` }}
          />
        </div>
        <p className="mt-3 text-[12.5px] leading-relaxed text-faint">
          Drag the cap, scroll on it, or focus and use the arrow keys.
        </p>
      </div>
    </div>
  );
}

export function KnobVariantsDemo() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-10">
      <Knob defaultValue={30} min={0} max={100} tone="accent" label="Gain" size={84} />
      <Knob
        defaultValue={0.5}
        min={0}
        max={1}
        step={0.05}
        precision={2}
        startAngle={-90}
        endAngle={90}
        tone="success"
        label="Opacity"
        size={84}
      />
      <Knob
        defaultValue={80}
        min={0}
        max={120}
        tone="danger"
        label="Threshold"
        size={84}
        showValue={false}
      />
    </div>
  );
}
