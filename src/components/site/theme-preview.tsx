"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  IconCube as Boxes,
  IconFileCode as FileCode2,
  IconGauge as Gauge,
  IconSettings as Settings,
} from "pollen-ui";
import { Badge, Progress, SegmentedControl, Switch, cn } from "pollen-ui";

const navItems = [
  { label: "Overview", icon: <Gauge className="h-4 w-4" />, active: true },
  { label: "Projects", icon: <Boxes className="h-4 w-4" />, active: false },
  { label: "Builds", icon: <FileCode2 className="h-4 w-4" />, active: false },
  { label: "Settings", icon: <Settings className="h-4 w-4" />, active: false },
];

const deployments = [
  {
    name: "pollen-web",
    env: "Production",
    commit: "fix: hydrate locale on redirect",
    sha: "8f4be21",
    time: "2m ago",
    status: "Ready",
    variant: "success" as const,
  },
  {
    name: "docs-site",
    env: "Preview",
    commit: "docs: rewrite the theming guide",
    sha: "c91d04a",
    time: "just now",
    status: "Building",
    variant: "warning" as const,
    building: true,
  },
  {
    name: "storefront",
    env: "Production",
    commit: "feat: one-click upsell at checkout",
    sha: "3e7a5f8",
    time: "26m ago",
    status: "Ready",
    variant: "success" as const,
  },
  {
    name: "marketing",
    env: "Preview",
    commit: "chore: bump dependencies",
    sha: "b2d90c6",
    time: "1h ago",
    status: "Queued",
    variant: "neutral" as const,
  },
];

/**
 * Live preview for the home page. The segmented control flips a
 * scoped .dark class, so both themes render side by side on one
 * screen, wherever the site itself is set.
 */
export function ThemePreview() {
  const [dark, setDark] = useState(true);

  return (
    <div>
      <div className={dark ? "dark" : "light"}>
        <motion.div
          key={dark ? "dark" : "light"}
          initial={{ opacity: 0.6, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="overflow-hidden rounded-3xl bg-[var(--pollen-bg)] shadow-[var(--pollen-shadow-lg)]"
        >
          {/* window bar */}
          <div className="flex items-center justify-between bg-card px-5 py-3">
            <div className="flex items-center gap-2.5">
              <span className="flex h-7 items-center rounded-lg bg-fill px-2.5 font-mono text-xs font-medium text-foreground">
                pollen-web
              </span>
              <span className="text-xs text-faint">deployments</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="hidden font-mono text-xs text-faint sm:inline">
                us-east-1
              </span>
              <Badge variant="success">Ready</Badge>
            </div>
          </div>

          <div className="flex bg-[var(--pollen-bg)]">
            {/* sidebar */}
            <nav
              aria-label="Preview"
              className="hidden w-48 shrink-0 flex-col gap-1 bg-card p-3 sm:flex"
            >
              {navItems.map((item) => (
                <span
                  key={item.label}
                  className={cn(
                    "flex items-center gap-2.5 rounded-xl px-3 py-2 text-[13px]",
                    item.active
                      ? "bg-fill font-medium text-foreground"
                      : "text-muted-foreground",
                  )}
                >
                  {item.icon}
                  {item.label}
                </span>
              ))}
              <div className="mt-auto rounded-2xl bg-fill p-3.5">
                <p className="text-[13px] font-medium text-foreground">
                  Auto deploy
                </p>
                <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                  Build on every push to main.
                </p>
                <div className="mt-2.5">
                  <Switch defaultChecked aria-label="Auto deploy" />
                </div>
              </div>
            </nav>

            {/* main */}
            <div className="min-w-0 flex-1 p-4 sm:p-5">
              <div className="flex items-center justify-between px-1 pb-2.5">
                <span className="text-[13px] font-medium text-foreground">
                  Recent deployments
                </span>
                <span className="font-mono text-xs text-faint">4 today</span>
              </div>

              <div className="flex flex-col gap-2.5">
                {deployments.map((row) => (
                  <div
                    key={row.name}
                    className="rounded-xl bg-card px-4 py-3 shadow-[var(--pollen-shadow-xs)] transition-shadow duration-200 hover:shadow-[var(--pollen-shadow-sm)]"
                  >
                    <div className="flex items-center gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-baseline gap-2">
                          <span className="truncate text-[13px] font-medium text-foreground">
                            {row.name}
                          </span>
                          <span className="hidden text-xs text-faint sm:inline">
                            {row.env}
                          </span>
                        </div>
                        <div className="mt-0.5 flex items-center gap-2">
                          <span className="truncate text-xs text-muted-foreground">
                            {row.commit}
                          </span>
                          <span className="hidden shrink-0 font-mono text-[11px] text-faint md:inline">
                            {row.sha}
                          </span>
                        </div>
                      </div>
                      <span className="hidden shrink-0 font-mono text-[11px] tabular-nums text-faint sm:inline">
                        {row.time}
                      </span>
                      <Badge variant={row.variant} className="shrink-0">
                        {row.status}
                      </Badge>
                    </div>
                    {row.building && <Progress className="mt-3" />}
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between px-1 pt-3.5 text-[11px] text-faint">
                <span>Queue · 1 waiting</span>
                <span className="font-mono">avg build 42s</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="mt-6 flex justify-center">
        <SegmentedControl
          aria-label="Preview theme"
          value={dark ? "dark" : "light"}
          onValueChange={(v) => setDark(v === "dark")}
          options={[
            { value: "light", label: "Light" },
            { value: "dark", label: "Dark" },
          ]}
        />
      </div>
    </div>
  );
}
