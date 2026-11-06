"use client";

import { ActivityHeatmap, type HeatmapDatum } from "pollen-ui";

/**
 * Deterministic demo data - a seeded generator so the grid looks
 * like a real half year of deploys without changing between runs.
 * Weekend dip included, so the pattern reads as real
 * activity, not noise.
 */
function seedData(): HeatmapDatum[] {
  let seed = 20260901;
  const rand = () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };
  const days: HeatmapDatum[] = [];
  const today = new Date();
  for (let i = 210; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const weekend = d.getDay() === 0 || d.getDay() === 6;
    const r = rand();
    const count = weekend
      ? Math.round(r * 4)
      : Math.round(r * r * 18 + (r > 0.94 ? 10 : 0));
    days.push({
      date: d.toISOString().slice(0, 10),
      count,
    });
  }
  return days;
}

const DATA = seedData();

export function ActivityHeatmapDemo() {
  return (
    <div className="flex flex-col items-center gap-4">
      <ActivityHeatmap data={DATA} weeks={30} />
      <p className="text-[12.5px] text-faint">
        Deploys per day, last 30 weeks. Hover a cell for the day.
      </p>
    </div>
  );
}

export function ActivityHeatmapSizesDemo() {
  return (
    <div className="flex flex-col items-center gap-8">
      <ActivityHeatmap data={DATA} weeks={18} cellSize={14} weekdayLabels levels={5} />
      <div className="flex items-center gap-2">
        <span className="text-[11px] text-faint">Less</span>
        {[0, 1, 2, 3, 4].map((level) => (
          <span
            key={level}
            className="inline-block h-3 w-3 rounded-[3px]"
            style={{
              backgroundColor:
                level === 0
                  ? "var(--pollen-fill)"
                  : `color-mix(in srgb, var(--pollen-accent) ${((level + 1) / 5) * 100}%, var(--pollen-fill))`,
            }}
          />
        ))}
        <span className="text-[11px] text-faint">More</span>
      </div>
    </div>
  );
}
