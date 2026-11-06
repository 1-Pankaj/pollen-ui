"use client";

import { useEffect, useState } from "react";
import { useIsClient } from "@/lib/use-is-client";
import { useTheme } from "next-themes";
import {
  IconMonitor as Monitor,
  IconMoon as Moon,
  IconSun as Sun,
} from "pollen-ui";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuLabel,
} from "pollen-ui";
import { sweepToTheme } from "@/lib/theme-sweep";

/** Sun on light, moon on dark, rendered after mount to avoid a flash. */
export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const mounted = useIsClient();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const update = () => {
      const resolved =
        theme === "system" ? (media.matches ? "dark" : "light") : theme;
      setIsDark(resolved === "dark");
    };
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, [theme]);

  const options = [
    { value: "light", label: "Light", icon: <Sun className="h-4 w-4" /> },
    { value: "dark", label: "Dark", icon: <Moon className="h-4 w-4" /> },
    { value: "system", label: "System", icon: <Monitor className="h-4 w-4" /> },
  ];

  return (
    <DropdownMenu
      align="end"
      trigger={
        <button
          type="button"
          aria-label="Toggle theme"
          className="inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors duration-150 hover:bg-fill hover:text-foreground"
        >
          {mounted && isDark ? (
            <Moon className="h-4 w-4" />
          ) : (
            <Sun className="h-4 w-4" />
          )}
        </button>
      }
    >
      <DropdownMenuLabel>Theme</DropdownMenuLabel>
      {options.map((option) => (
        <DropdownMenuItem
          key={option.value}
          icon={option.icon}
          selected={mounted && theme === option.value}
          onSelect={(event) => {
            const point =
              option.value === "system"
                ? undefined
                : { x: event.clientX, y: event.clientY };
            sweepToTheme(() => setTheme(option.value), point);
          }}
        >
          {option.label}
        </DropdownMenuItem>
      ))}
    </DropdownMenu>
  );
}
