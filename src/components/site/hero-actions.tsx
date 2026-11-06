"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { useTheme } from "next-themes";
import { motion, useReducedMotion } from "framer-motion";
import { IconMoon as Moon, IconSun as Sun } from "pollen-ui";
import { sweepToTheme } from "@/lib/theme-sweep";
import { useIsClient } from "@/lib/use-is-client";

const EASE_OUT = [0.22, 1, 0.36, 1] as const;

/**
 * The hero controls: a small circular theme switch sitting above a
 * single pill. Toggling the theme from inside the hero is the
 * fastest way to see what the library is about.
 */
export function HeroActions() {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useIsClient();
  const reduce = useReducedMotion();
  const toggleRef = useRef<HTMLButtonElement>(null);

  const isDark = mounted && resolvedTheme === "dark";
  const enter = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 14 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.6, ease: EASE_OUT, delay },
        };

  const sweepTheme = () => {
    const rect = toggleRef.current?.getBoundingClientRect();
    const origin = rect
      ? { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
      : undefined;
    sweepToTheme(() => setTheme(isDark ? "light" : "dark"), origin);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <motion.button
        {...enter(0.75)}
        ref={toggleRef}
        type="button"
        aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
        onClick={sweepTheme}
        className="flex h-11 w-11 items-center justify-center rounded-full bg-card/85 text-muted-foreground shadow-[var(--pollen-shadow-sm)] backdrop-blur transition-colors duration-200 hover:text-foreground"
      >
        {mounted && isDark ? (
          <Sun className="h-4 w-4" />
        ) : (
          <Moon className="h-4 w-4" />
        )}
      </motion.button>
      <motion.div {...enter(0.85)}>
        <Link
          href="/docs"
          className="inline-flex h-11 items-center rounded-full bg-card px-6 text-[15px] font-medium text-foreground shadow-[var(--pollen-shadow-sm)] backdrop-blur transition-[background-color,transform,box-shadow] duration-150 hover:bg-fill active:scale-[0.98]"
        >
          Explore the components
        </Link>
      </motion.div>
    </div>
  );
}
