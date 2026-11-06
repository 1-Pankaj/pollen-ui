"use client";

import { useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import { IconMoon as Moon, IconSun as Sun, IconCode as CodeIcon, cn } from "pollen-ui";

/* ------------------------------------------------------------------
   TemplateFrame: a browser window with its own theme studio. Every
   template previews in light and dark, any of eight accents, and
   three corner languages - independently of the page around it,
   which is the fastest way to judge a design: flip it while you
   look at it.
   ------------------------------------------------------------------ */

export const FRAME_ACCENTS = [
  { name: "Pollen Blue", light: "#0070f3", dark: "#3291ff" },
  { name: "Iris", light: "#6e56cf", dark: "#9b8afb" },
  { name: "Teal", light: "#0d9373", dark: "#26c593" },
  { name: "Grass", light: "#3d8f4f", dark: "#5fb869" },
  { name: "Amber", light: "#c2710c", dark: "#f0a020" },
  { name: "Rose", light: "#e54666", dark: "#f26e88" },
  { name: "Plum", light: "#8e4ec6", dark: "#bf7af0" },
  { name: "Ink", light: "#18181b", dark: "#ececef" },
] as const;

const RADII = [
  { id: "soft", label: "Soft", vars: {} as Record<string, string> },
  {
    id: "round",
    label: "Round",
    vars: {
      "--radius-xs": "0.25rem",
      "--radius-sm": "0.375rem",
      "--radius-md": "0.5rem",
      "--radius-lg": "0.75rem",
      "--radius-xl": "1rem",
      "--radius-2xl": "1.5rem",
      "--radius-3xl": "2rem",
    } as Record<string, string>,
  },
  {
    id: "sharp",
    label: "Sharp",
    vars: {
      "--radius-xs": "0px",
      "--radius-sm": "0px",
      "--radius-md": "0px",
      "--radius-lg": "0px",
      "--radius-xl": "0px",
      "--radius-2xl": "0px",
      "--radius-3xl": "0px",
    } as Record<string, string>,
  },
] as const;

export type FrameRadius = (typeof RADII)[number]["id"];

export function TemplateFrame({
  id,
  title,
  description,
  url,
  children,
  defaultTheme = "light",
  defaultAccent = 0,
  defaultRadius = "soft",
  className,
  bodyClassName,
  /** Hides the customization rail for template-in-template use. */
  controls = true,
  /** When set, the caption carries a link to the template's source page. */
  sourceHref,
}: {
  id?: string;
  title: string;
  description: string;
  /** Fake URL for the address bar. */
  url: string;
  children: ReactNode;
  defaultTheme?: "light" | "dark";
  /** Index into FRAME_ACCENTS. */
  defaultAccent?: number;
  defaultRadius?: FrameRadius;
  className?: string;
  bodyClassName?: string;
  controls?: boolean;
  sourceHref?: string;
}) {
  const [theme, setTheme] = useState<"light" | "dark">(defaultTheme);
  const [accentIndex, setAccentIndex] = useState(defaultAccent);
  const [radius, setRadius] = useState<FrameRadius>(defaultRadius);

  const accent = FRAME_ACCENTS[accentIndex];

  const scopeStyle = useMemo(() => {
    const chosen = theme === "dark" ? accent.dark : accent.light;
    return {
      "--pollen-accent": chosen,
      ...RADII.find((r) => r.id === radius)?.vars,
    } as React.CSSProperties;
  }, [theme, accent, radius]);

  return (
    <figure id={id} className={cn("group/frame", className)}>
      <div className="overflow-hidden rounded-3xl bg-card shadow-[var(--pollen-shadow-sm)] transition-shadow duration-200 hover:shadow-[var(--pollen-shadow-md)]">
        {/* Browser chrome. */}
        <div className="flex items-center gap-3 bg-card px-4 py-3">
          <span aria-hidden="true" className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
          </span>
          <span className="mx-auto hidden h-7 w-full max-w-[240px] items-center justify-center rounded-lg bg-fill px-3 text-[12px] text-faint sm:flex">
            {url}
          </span>

          {controls && (
            <div className="ml-auto flex items-center gap-2.5">
              {/* Accent swatches. */}
              <div
                role="radiogroup"
                aria-label={`${title} accent colour`}
                className="flex items-center gap-1"
              >
                {FRAME_ACCENTS.map((a, i) => (
                  <button
                    key={a.name}
                    type="button"
                    role="radio"
                    aria-checked={accentIndex === i}
                    aria-label={`${title} in ${a.name}`}
                    title={a.name}
                    onClick={() => setAccentIndex(i)}
                    className={cn(
                      "h-3.5 w-3.5 rounded-full transition-transform duration-150",
                      accentIndex === i
                        ? "scale-110 ring-2 ring-[var(--pollen-accent)] ring-offset-2 ring-offset-card"
                        : "hover:scale-110",
                    )}
                    style={{ background: a.light }}
                  />
                ))}
              </div>

              {/* Radius language. */}
              <div className="hidden items-center rounded-lg bg-fill p-0.5 md:flex">
                {RADII.map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    aria-pressed={radius === r.id}
                    onClick={() => setRadius(r.id)}
                    className={cn(
                      "rounded-md px-2 py-1 text-[11px] font-medium transition-colors duration-150",
                      radius === r.id
                        ? "bg-card text-foreground shadow-[var(--pollen-shadow-xs)]"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {r.label}
                  </button>
                ))}
              </div>

              {/* Theme. */}
              <button
                type="button"
                onClick={() => setTheme((t) => (t === "light" ? "dark" : "light"))}
                aria-label={`Preview ${title} in ${theme === "light" ? "dark" : "light"} theme`}
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors duration-150 hover:bg-fill hover:text-foreground"
              >
                {theme === "light" ? <Moon className="h-3.5 w-3.5" /> : <Sun className="h-3.5 w-3.5" />}
              </button>
            </div>
          )}
          {!controls && <span className="w-7" aria-hidden />}
        </div>

        {/* The themed viewport. The wrapper class re-maps every
            pollen token inside, so the template renders its own
            theme, accent and radius regardless of the page. */}
        <div
          className={cn(theme === "light" ? "light" : "dark", "bg-[var(--pollen-bg)]")}
          style={scopeStyle}
        >
          <div className={cn("@container overflow-hidden", bodyClassName)}>
            {children}
          </div>
        </div>
      </div>
      <figcaption className="mt-4 px-1">
        <div className="flex items-center justify-between gap-4">
          <p className="text-[15px] font-semibold tracking-[-0.01em] text-foreground">{title}</p>
          {sourceHref && (
            <Link
              href={sourceHref}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-lg px-2 py-1 text-[13px] font-medium text-muted-foreground transition-colors duration-150 hover:bg-fill hover:text-foreground"
            >
              <CodeIcon className="h-3.5 w-3.5" />
              View source
            </Link>
          )}
        </div>
        <p className="mt-1 text-[13.5px] leading-relaxed text-muted-foreground">{description}</p>
      </figcaption>
    </figure>
  );
}
