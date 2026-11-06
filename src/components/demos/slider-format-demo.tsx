"use client";

import { Slider } from "pollen-ui";

/** Value bubbles: a formatted horizontal slider and a vertical rail. */
export function SliderFormatDemo() {
  return (
    <div className="flex w-full max-w-[300px] flex-wrap items-center justify-center gap-10">
      <Slider
        defaultValue={46}
        showTooltip
        tooltipAlways
        formatValue={(v) => `$${v},000`}
        aria-label="Salary"
        className="max-w-[210px]"
      />
      <Slider
        orientation="vertical"
        defaultValue={62}
        formatValue={(v) => `${v}°`}
        aria-label="Temperature"
      />
    </div>
  );
}
