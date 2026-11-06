"use client";

import { useMemo } from "react";
import { cn } from "../lib/utils";

export interface HeatmapDatum {
  /** Calendar day, "YYYY-MM-DD". */
  date: string;
  /** The measured amount for that day. */
  count: number;
}

export interface ActivityHeatmapProps {
  /**
   * One entry per measured day. Days between entries exist with a
   * count of 0, so sparse data still reads as a calendar. The grid
   * ends on the last dated entry (or today, whichever is later)
   * and stretches back far enough to fill `weeks` columns.
   */
  data: HeatmapDatum[] | Record<string, number>;
  /** Number of week columns. Default 26 - about half a year. */
  weeks?: number;
  /** Levels above zero. Colors step from fill toward the accent. Default 4. */
  levels?: number;
  /** Size of one cell in px. Default 11. */
  cellSize?: number;
  /** Gap between cells in px. Default 3. */
  gap?: number;
  /** Show month labels along the top. Default true. */
  monthLabels?: boolean;
  /** Show weekday labels on the left (Mon/Wed/Fri). Default false. */
  weekdayLabels?: boolean;
  /** Accessible summary override. A factual one is generated when omitted. */
  summary?: string;
  className?: string;
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function toKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/**
 * A calendar heatmap - one small square per day, shade per amount,
 * the GitHub-graph pattern applied to any daily measurement:
 * deploys, commits, workouts, incidents. Columns are weeks, rows
 * are weekdays, month labels ride the columns they start in.
 *
 * Accessibility: the grid is one image with a spoken summary
 * ("214 events across 182 days from Mar 8 to Sep 3; busiest Sep 12
 * with 19"), generated from the real data. Individual cells carry
 * title tooltips for the pointer; screen readers get the summary
 * instead of 182 stops. The summary can be overridden.
 */
export function ActivityHeatmap({
  data,
  weeks = 26,
  levels = 4,
  cellSize = 11,
  gap = 3,
  monthLabels = true,
  weekdayLabels = false,
  summary,
  className,
}: ActivityHeatmapProps) {
  const counts = useMemo(() => {
    const map = new Map<string, number>();
    if (Array.isArray(data)) {
      for (const d of data) map.set(d.date, d.count);
    } else {
      for (const [k, v] of Object.entries(data)) map.set(k, v);
    }
    return map;
  }, [data]);

  const grid = useMemo(() => {
    // End the grid on the last dated entry, or today when the data
    // is fresher than that, so a live feed grows to the right.
    let last = new Date();
    for (const key of counts.keys()) {
      const d = new Date(`${key}T00:00:00`);
      if (!Number.isNaN(d.getTime()) && d > last) last = d;
    }
    // Round up to the end of the week column (week ends Saturday).
    const end = new Date(last);
    end.setDate(end.getDate() + (6 - end.getDay()));

    // Walk back (weeks - 1) full columns; start on a Sunday.
    const start = new Date(end);
    start.setDate(start.getDate() - (weeks * 7 - 1));

    const columns: { key: string; date: Date; count: number }[][] = [];
    const monthMarks: (string | null)[] = [];
    let total = 0;
    let active = 0;
    let busiestKey = "";
    let busiestCount = -1;

    for (let w = 0; w < weeks; w++) {
      const col: { key: string; date: Date; count: number }[] = [];
      for (let day = 0; day < 7; day++) {
        const date = new Date(start);
        date.setDate(start.getDate() + w * 7 + day);
        const key = toKey(date);
        const count = counts.get(key) ?? 0;
        total += count;
        if (count > 0) active += 1;
        if (count > busiestCount) {
          busiestCount = count;
          busiestKey = key;
        }
        col.push({ key, date, count });
      }
      columns.push(col);
      const first = col[0].date;
      const prev = columns[w - 1]?.[0].date;
      monthMarks.push(
        !prev || prev.getMonth() !== first.getMonth()
          ? MONTHS[first.getMonth()]
          : null,
      );
    }

    const summaryText =
      busiestCount > 0
        ? `busiest ${new Date(`${busiestKey}T00:00:00`).toLocaleDateString([], {
            month: "short",
            day: "numeric",
          })} with ${busiestCount}`
        : "no active days";

    return {
      columns,
      monthMarks,
      total,
      active,
      summaryText,
      rangeFrom: columns[0][0].date,
      rangeTo: end,
    };
  }, [counts, weeks]);

  const max = useMemo(() => {
    let m = 0;
    for (const v of counts.values()) if (v > m) m = v;
    return m;
  }, [counts]);

  const levelOf = (count: number): number => {
    if (count <= 0) return 0;
    if (max === 0) return 1;
    // Quartile-style bands keep the shading accurate for both sparse
    // and dense data: level 1 starts at the first nonzero step.
    const share = count / max;
    return Math.min(levels, Math.max(1, Math.ceil(share * levels)));
  };

  const cellStyle = (level: number): React.CSSProperties => ({
    width: cellSize,
    height: cellSize,
    borderRadius: 3,
    backgroundColor:
      level === 0
        ? "var(--pollen-fill)"
        : `color-mix(in srgb, var(--pollen-accent) ${Math.round(
            (level / levels) * 100,
          )}%, var(--pollen-fill))`,
  });

  const spoken =
    summary ??
    `${grid.total} events across ${grid.active} active days from ${grid.rangeFrom.toLocaleDateString(
      [],
      { month: "short", day: "numeric" },
    )} to ${grid.rangeTo.toLocaleDateString([], {
      month: "short",
      day: "numeric",
    })}; ${grid.summaryText}.`;

  return (
    <div className={cn("inline-flex flex-col gap-2", className)}>
      {monthLabels && (
        <div
          className="relative h-4 select-none"
          style={{ marginLeft: weekdayLabels ? 28 : 0 }}
          aria-hidden="true"
        >
          {grid.monthMarks.map((mark, w) =>
            mark === null ? null : (
              <span
                key={w}
                className="absolute top-0 text-[10px] leading-4 text-faint"
                style={{ left: w * (cellSize + gap) }}
              >
                {mark}
              </span>
            ),
          )}
        </div>
      )}
        {weekdayLabels && (
          <div
            className="flex select-none flex-col justify-between py-px text-[10px] leading-none text-faint"
            style={{ height: 7 * cellSize + 6 * gap, width: 22 }}
            aria-hidden="true"
          >
            <span>Mon</span>
            <span>Wed</span>
            <span>Fri</span>
          </div>
        )}
        <div
          role="img"
          aria-label={spoken}
          className="inline-flex"
          style={{ gap }}
        >
          {grid.columns.map((col, ci) => (
            <div
              key={ci}
              className="grid grid-rows-7"
              style={{ gap, gridTemplateRows: `repeat(7, ${cellSize}px)` }}
            >
              {col.map((cell) => {
                const level = levelOf(cell.count);
                return (
                  <div
                    key={cell.key}
                    data-level={level}
                    title={`${cell.count} on ${cell.date.toLocaleDateString([], {
                      month: "short",
                      day: "numeric",
                    })}`}
                    style={cellStyle(level)}
                    className="transition-[background-color] duration-150"
                  />
                );
              })}
            </div>
          ))}
        </div>
    </div>
  );
}

ActivityHeatmap.displayName = "ActivityHeatmap";
