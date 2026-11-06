"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { cn } from "pollen-ui";
import {
  applyAccent,
  getSavedAccent,
  saveAccent,
  subscribeToAccent,
} from "@/lib/accent";
import { useIsClient } from "@/lib/use-is-client";

/* ------------------------------------------------------------------
   AccentPicker: one of the seven site accent themes, persisted to
   localStorage and written to <html data-accent>. Pollen Blue is
   the default and simply removes the attribute, so the library's
   own blue wins.
   ------------------------------------------------------------------ */

const ACCENTS = [
  { id: "", name: "Pollen Blue", light: "#0070f3", dark: "#3291ff" },
  { id: "iris", name: "Iris", light: "#6e56cf", dark: "#9b8afb" },
  { id: "teal", name: "Teal", light: "#0d9373", dark: "#26c593" },
  { id: "grass", name: "Grass", light: "#3d8f4f", dark: "#5fb869" },
  { id: "amber", name: "Amber", light: "#c2710c", dark: "#f0a020" },
  { id: "rose", name: "Rose", light: "#e54666", dark: "#f26e88" },
  { id: "plum", name: "Plum", light: "#8e4ec6", dark: "#bf7af0" },
] as const;

export function AccentPicker() {
  const [open, setOpen] = useState(false);
  // The saved id arrives through the store; the pre-paint script in
  // the root layout has already applied it, so there is no flash of
  // default blue between hydration and the first effect.
  const accent = useSyncExternalStore(subscribeToAccent, getSavedAccent, () => "");
  const { resolvedTheme } = useTheme();
  const mounted = useIsClient();
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const choose = (id: string) => {
    saveAccent(id);
    setOpen(false);
  };

  const current = ACCENTS.find((a) => a.id === accent) ?? ACCENTS[0];
  const isDark = mounted && resolvedTheme === "dark";
  const swatch = isDark ? current.dark : current.light;

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-label={`Accent theme: ${current.name}`}
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="flex h-9 w-9 items-center justify-center rounded-xl text-muted-foreground transition-colors duration-150 hover:bg-fill hover:text-foreground"
      >
        <span
          aria-hidden="true"
          className="h-3.5 w-3.5 rounded-full ring-1 ring-inset ring-black/10"
          style={{ background: swatch }}
        />
      </button>

      {open && (
        <div
          role="radiogroup"
          aria-label="Accent theme"
          className="absolute right-0 top-11 z-50 w-44 rounded-2xl bg-card p-1.5 shadow-[var(--pollen-shadow-lg)]"
        >
          {ACCENTS.map((a) => (
            <button
              key={a.id || "default"}
              type="button"
              role="radio"
              aria-checked={accent === a.id}
              onClick={() => choose(a.id)}
              className={cn(
                "flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-left text-[13px] transition-colors duration-150",
                accent === a.id
                  ? "bg-fill font-medium text-foreground"
                  : "text-muted-foreground hover:bg-fill/60 hover:text-foreground",
              )}
            >
              <span
                aria-hidden="true"
                className="h-3.5 w-3.5 shrink-0 rounded-full ring-1 ring-inset ring-black/10"
                style={{ background: a.light }}
              />
              {a.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

