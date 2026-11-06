"use client";

import { useMemo, useState, type CSSProperties } from "react";
import { motion } from "framer-motion";
import {
  IconCheck as Check,
  IconSearch as Search,
} from "pollen-ui";
import {
  Badge,
  Button,
  CodeBlock,
  Input,
  Progress,
  SegmentedControl,
  Switch,
  cn,
} from "pollen-ui";

const ACCENTS = [
  { name: "Pollen Blue", light: "#0070f3", dark: "#3291ff" },
  { name: "Iris", light: "#6e56cf", dark: "#9b8afb" },
  { name: "Teal", light: "#0d9373", dark: "#26c593" },
  { name: "Grass", light: "#3d8f4f", dark: "#5fb869" },
  { name: "Amber", light: "#c2710c", dark: "#f0a020" },
  { name: "Rose", light: "#e54666", dark: "#f26e88" },
  { name: "Plum", light: "#8e4ec6", dark: "#bf7af0" },
  { name: "Ink", light: "#18181b", dark: "#ececef" },
] as const;

const TINTS = [
  { value: 0, label: "None" },
  { value: 3, label: "Faint" },
  { value: 6, label: "Soft" },
  { value: 10, label: "Strong" },
] as const;

const DEPTHS = [
  { value: 0.6, label: "Subtle" },
  { value: 1, label: "Normal" },
  { value: 1.7, label: "Deep" },
] as const;

function shadowSet(depth: number, dark: boolean): CSSProperties {
  const a = (alpha: number) => Math.min(alpha * depth, 1).toFixed(3);
  if (dark) {
    return {
      "--pollen-shadow-xs": `0 1px 2px rgba(0,0,0,${a(0.5)})`,
      "--pollen-shadow-sm": `0 1px 3px rgba(0,0,0,${a(0.4)}), inset 0 1px 0 rgba(255,255,255,0.04)`,
      "--pollen-shadow-md": `0 8px 32px -4px rgba(0,0,0,${a(0.5)}), inset 0 1px 0 rgba(255,255,255,0.05)`,
      "--pollen-shadow-lg": `0 16px 56px -8px rgba(0,0,0,${a(0.65)}), inset 0 1px 0 rgba(255,255,255,0.06)`,
    } as CSSProperties;
  }
  return {
    "--pollen-shadow-xs": `0 1px 2px rgba(18,18,26,${a(0.06)})`,
    "--pollen-shadow-sm": `0 1px 2px rgba(18,18,26,${a(0.04)}), 0 2px 8px rgba(18,18,26,${a(0.05)})`,
    "--pollen-shadow-md": `0 2px 4px rgba(18,18,26,${a(0.04)}), 0 10px 28px -6px rgba(18,18,26,${a(0.1)})`,
    "--pollen-shadow-lg": `0 4px 12px rgba(18,18,26,${a(0.06)}), 0 28px 68px -12px rgba(18,18,26,${a(0.2)})`,
  } as CSSProperties;
}

/**
 * A small, focused studio: the preview is a working product
 * window, the rail on the right holds four decisions, and the
 * CSS underneath updates with each one. Everything is scoped to
 * this component so the rest of the page is untouched.
 */
export function ThemeStudio() {
  const [accentIndex, setAccentIndex] = useState(0);
  const [tint, setTint] = useState(0);
  const [depth, setDepth] = useState(1);
  const [dark, setDark] = useState(false);
  const [custom, setCustom] = useState<string | null>(null);

  const accent = ACCENTS[accentIndex];
  const chosen = custom ?? accent.light;
  const chosenDark = custom
    ? `color-mix(in srgb, ${custom} 82%, white)`
    : accent.dark;

  const scopeStyle = useMemo(() => {
    const bgLight =
      tint > 0
        ? `color-mix(in srgb, ${chosen} ${tint * 2}%, #f7f7f8)`
        : "#f7f7f8";
    const bgDark =
      tint > 0
        ? `color-mix(in srgb, ${chosenDark} ${Math.round(tint * 1.4)}%, #0a0a0c)`
        : "#0a0a0c";
    return {
      "--pollen-accent": chosen,
      "--pollen-bg": bgLight,
      ...shadowSet(depth, false),
      ...(dark
        ? {
            "--pollen-accent": chosenDark,
            "--pollen-bg": bgDark,
            ...shadowSet(depth, true),
          }
        : {}),
    } as CSSProperties;
  }, [chosen, chosenDark, tint, depth, dark]);

  const css = useMemo(() => {
    // Emitted shadows are derived from shadowSet itself, so the CSS a
    // user copies always matches the preview (all four depths, light
    // and dark, exactly as applied to the preview window).
    const shadowLines = (set: CSSProperties) =>
      ([
        "--pollen-shadow-xs",
        "--pollen-shadow-sm",
        "--pollen-shadow-md",
        "--pollen-shadow-lg",
      ] as const).map((k) => `  ${k}: ${(set as Record<string, string>)[k]};`);
    const lightShadows = shadowSet(depth, false);
    const darkShadows = shadowSet(depth, true);
    const lines = [
      `/* Generated with the Pollen UI theme studio */`,
      `:root {`,
      `  --pollen-accent: ${chosen};`,
      ...(tint > 0
        ? [`  --pollen-bg: color-mix(in srgb, ${chosen} ${tint * 2}%, #f7f7f8);`]
        : []),
      ...((depth !== 1
        ? [
            `  /* Depth: ${depth < 1 ? "subtler" : "deeper"} shadows */`,
            ...shadowLines(lightShadows),
          ]
        : []) as string[]),
      `}`,
      ``,
      `.dark {`,
      `  --pollen-accent: ${chosenDark};`,
      ...(tint > 0
        ? [`  --pollen-bg: color-mix(in srgb, ${chosenDark} ${Math.round(tint * 1.4)}%, #0a0a0c);`]
        : []),
      ...((depth !== 1
        ? [...shadowLines(darkShadows)]
        : []) as string[]),
      `}`,
    ];
    return lines.join("\n");
  }, [chosen, chosenDark, tint, depth]);

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[1fr_316px] lg:gap-8">
      {/* Preview + generated CSS */}
      <div className="flex min-w-0 flex-col gap-5">
        <motion.div
          key={`${chosen}-${tint}-${depth}-${dark}`}
          initial={{ opacity: 0.6, scale: 0.995 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          style={scopeStyle}
          className={dark ? "dark" : "light"}
        >
          <div className="rounded-3xl bg-[var(--pollen-bg)] p-5 shadow-[var(--pollen-shadow-lg)] sm:p-8">
            {/* Window chrome */}
            <div className="flex flex-wrap items-center gap-3">
              <span className="flex h-7 items-center rounded-lg bg-fill px-2.5 font-mono text-xs font-medium text-foreground">
                pollen-web
              </span>
              <Badge dot variant="success">
                Ready
              </Badge>
              <Badge variant="accent">New</Badge>
              <span className="ml-auto hidden text-xs text-muted-foreground sm:inline">
                Production
              </span>
            </div>

            {/* Actions */}
            <div className="mt-5 flex flex-wrap items-center gap-2.5">
              <Button>Deploy project</Button>
              <Button variant="secondary">Preview</Button>
              <Button variant="outline">Cancel</Button>
            </div>

            {/* Form */}
            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              <div>
                <p className="mb-2 text-[13px] font-medium text-foreground">
                  Project name
                </p>
                <Input icon={<Search />} clearable defaultValue="pollen-web" />
              </div>
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-[13px] font-medium text-foreground">
                    Build progress
                  </p>
                  <span className="text-[13px] tabular-nums text-muted-foreground">
                    68%
                  </span>
                </div>
                <Progress value={68} />
              </div>
            </div>

            {/* Switch row */}
            <div className="mt-6 flex items-center justify-between rounded-2xl bg-card px-4 py-3.5 shadow-[var(--pollen-shadow-xs)]">
              <span>
                <span className="block text-[13px] font-medium text-foreground">
                  Auto deploy
                </span>
                <span className="block text-xs text-muted-foreground">
                  Ship every merge to main
                </span>
              </span>
              <Switch defaultChecked aria-label="Auto deploy" />
            </div>
          </div>
        </motion.div>

        <CodeBlock filename="globals.css" language="css" code={css} />
      </div>

      {/* Control rail */}
      <div className="flex min-w-0 max-w-full flex-col gap-7 rounded-3xl bg-card p-6 shadow-[var(--pollen-shadow-sm)] lg:sticky lg:top-24">
        <div>
          <p className="text-[13px] font-semibold text-foreground">Accent</p>
          <div className="mt-3 flex min-w-0 max-w-full flex-wrap items-center gap-2">
            {ACCENTS.map((option, index) => {
              const selected = !custom && index === accentIndex;
              return (
                <button
                  key={option.name}
                  type="button"
                  title={option.name}
                  aria-label={option.name}
                  aria-pressed={selected}
                  onClick={() => {
                    setAccentIndex(index);
                    setCustom(null);
                  }}
                  className={cn(
                    "flex h-7 w-7 items-center justify-center rounded-full transition-transform duration-150 hover:scale-110",
                    selected && "ring-2 ring-offset-2 ring-offset-card",
                  )}
                  style={{
                    backgroundColor: option.light,
                    ...(selected
                      ? ({ "--tw-ring-color": option.light } as CSSProperties)
                      : {}),
                  }}
                >
                  {selected && <Check className="h-3.5 w-3.5 text-white" />}
                </button>
              );
            })}
          </div>
          <label className="mt-3.5 flex items-center justify-between gap-3 text-[13px] text-muted-foreground">
            Custom hex
            <input
              type="text"
              spellCheck={false}
              aria-label="Custom accent hex"
              placeholder="#0070f3"
              value={custom ?? ""}
              onChange={(e) => {
                const raw = e.target.value.trim();
                setCustom(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(raw) ? raw : null);
              }}
              className="h-8 w-28 min-w-0 max-w-full rounded-lg bg-fill px-2.5 font-mono text-xs text-foreground outline-none transition-[background-color,box-shadow] placeholder:text-faint focus-visible:ring-[3px] focus-visible:ring-accent/25"
            />
          </label>
        </div>

        <div>
          <p className="text-[13px] font-semibold text-foreground">
            Background tint
          </p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            Mix a little of the accent into every surface.
          </p>
          <div className="slim-scroll mt-3 min-w-0 max-w-full overflow-x-auto">
            <SegmentedControl
              size="sm"
              aria-label="Background tint"
              value={String(tint)}
              onValueChange={(v) => setTint(Number(v))}
              options={TINTS.map((t) => ({
                value: String(t.value),
                label: t.label,
              }))}
            />
          </div>
        </div>

        <div>
          <p className="text-[13px] font-semibold text-foreground">Depth</p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            How far the shadows carry.
          </p>
          <div className="slim-scroll mt-3 min-w-0 max-w-full overflow-x-auto">
            <SegmentedControl
              size="sm"
              aria-label="Shadow depth"
              value={String(depth)}
              onValueChange={(v) => setDepth(Number(v))}
              options={DEPTHS.map((d) => ({
                value: String(d.value),
                label: d.label,
              }))}
            />
          </div>
        </div>

        <div className="mt-auto border-none pt-2">
          <p className="text-[13px] font-semibold text-foreground">
            Preview theme
          </p>
          <div className="slim-scroll mt-3 min-w-0 max-w-full overflow-x-auto">
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
      </div>
    </div>
  );
}
