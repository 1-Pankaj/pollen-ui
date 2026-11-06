"use client";

import { useState } from "react";
import { Slider } from "pollen-ui";

export function SliderDemo() {
  const [volume, setVolume] = useState(40);

  return (
    <div className="w-full max-w-[260px]">
      <div className="mb-3 flex items-center justify-between text-sm">
        <span className="font-medium text-foreground">Volume</span>
        <span className="text-muted-foreground">{volume}%</span>
      </div>
      <Slider
        value={volume}
        onValueChange={(next) => setVolume(Array.isArray(next) ? next[0] : next)}
        min={0}
        max={100}
        step={1}
        aria-label="Volume"
      />
    </div>
  );
}

/** Range slider with pinned value bubbles, for compact tiles. */
export function SliderRangeTile() {
  return (
    <Slider
      defaultValue={[24, 72]}
      min={0}
      max={100}
      step={1}
      minStepsBetweenThumbs={5}
      marks={[
        { value: 0 },
        { value: 25 },
        { value: 50 },
        { value: 75 },
        { value: 100 },
      ]}
      tooltipAlways
      formatValue={(v) => `${v}%`}
      aria-label="Price range"
      className="max-w-[230px]"
    />
  );
}
