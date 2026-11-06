"use client";

import { useRef, useState } from "react";
import { ScrollProgress } from "pollen-ui";

const LINES = [
  "Deployment started",
  "Building web (14s)",
  "Building edge functions (6s)",
  "Running 214 tests",
  "All tests green",
  "Uploading source maps",
  "Invalidating CDN cache",
  "Deployed to production",
];

/**
 * A scroll progress bar bound to its own scrollable pane - the
 * docs-friendly way to show the component working, no page scroll
 * required. Scroll the log and the bar on top fills.
 */
export function ScrollProgressPaneDemo() {
  const paneRef = useRef<HTMLDivElement>(null);
  const [atEnd, setAtEnd] = useState(false);

  return (
    <div className="w-full max-w-[420px] overflow-hidden rounded-2xl bg-card shadow-[var(--pollen-shadow-md)] ring-1 ring-[var(--pollen-border)]">
      {/* Faux window chrome */}
      <div className="relative flex items-center gap-2 border-b border-[var(--pollen-border)] bg-fill/60 px-4 py-2.5">
        <span className="h-2 w-2 rounded-full bg-danger/70" />
        <span className="h-2 w-2 rounded-full bg-warning/70" />
        <span className="h-2 w-2 rounded-full bg-success/70" />
        <span className="ml-2 font-mono text-[11px] text-faint">deploy.log</span>
        <ScrollProgress target={paneRef} className="absolute inset-x-0 top-0 h-[2px] origin-left bg-accent" />
      </div>
      <div
        ref={paneRef}
        onScroll={(e) => {
          const el = e.currentTarget;
          setAtEnd(el.scrollHeight - el.scrollTop - el.clientHeight < 4);
        }}
        className="slim-scroll h-44 overflow-y-auto px-4 py-3"
      >
        <div className="space-y-2">
          {LINES.map((line, i) => (
            <p key={i} className="flex items-center gap-2 font-mono text-[12.5px] text-muted-foreground">
              <span className="text-faint">{String(i + 1).padStart(2, "0")}</span>
              {line}
            </p>
          ))}
          <p className="pt-1 font-mono text-[12.5px] font-medium text-success">Live in 42s</p>
        </div>
      </div>
      <p className="border-t border-[var(--pollen-border)] px-4 py-2 text-[11.5px] text-faint">
        {atEnd ? "Bar full - you reached the end" : "Scroll the log - the bar tracks this pane"}
      </p>
    </div>
  );
}
