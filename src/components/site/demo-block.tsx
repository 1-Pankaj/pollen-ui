"use client";

import { useState, type ReactNode } from "react";
import { CodeBlock, SegmentedControl } from "pollen-ui";
import { useFrameworkCode } from "./framework";
import { OpenInPlaygroundButton } from "./playground/playground";
import { NativePendingNote } from "./native-note";

export interface DemoBlockProps {
  title: string;
  code: string;
  /** Precomputed JavaScript variant; omit to keep TS-only. */
  jsCode?: string | null;
  /**
   * React Native usage for the component, when @pollen-ui/native ships
   * it. Shown instead of the web snippet while the React Native
   * stack is selected.
   */
  nativeCode?: string | null;
  /** Component title for the native pending note. */
  componentTitle?: string;
  children: ReactNode;
  align?: "center" | "stretch";
}

/**
 * One documented demo: a live preview and the exact code behind
 * it, switchable in place, plus a one-click jump into the
 * playground with this code preloaded. The code pane follows the
 * page-wide stack and language switches. Kept as a figure so
 * tooling can find individual demos on the page.
 */
export function DemoBlock({
  title,
  code,
  jsCode,
  nativeCode,
  componentTitle,
  children,
  align = "center",
}: DemoBlockProps) {
  const [view, setView] = useState<"preview" | "code">("preview");
  const { stack, display, filenameBase, language } = useFrameworkCode(
    code,
    jsCode,
    nativeCode,
  );
  const nativeMissing = stack === "native" && !nativeCode;

  return (
    <figure className="mt-8 rounded-2xl bg-card shadow-[var(--pollen-shadow-md)]">
      <figcaption className="flex items-center justify-between gap-4 rounded-t-2xl bg-fill/60 px-5 py-3">
        <span className="text-sm font-medium text-foreground">{title}</span>
        <SegmentedControl
          size="sm"
          aria-label={`${title} view`}
          value={view}
          onValueChange={(v) => setView(v as "preview" | "code")}
          options={[
            { value: "preview", label: "Preview" },
            { value: "code", label: "Code" },
          ]}
        />
      </figcaption>
      <div
        className={
          view === "preview"
            ? `flex min-h-[160px] p-6 sm:p-8 ${align === "center" ? "items-center justify-center" : "items-center"}`
            : "hidden"
        }
      >
        {children}
      </div>
      {view === "code" && (
        <div className="p-4 sm:p-6">
          {nativeMissing ? (
            <NativePendingNote title={componentTitle ?? title} />
          ) : (
            <>
              <CodeBlock
                code={display}
                filename={filenameBase}
                language={stack === "native" ? "tsx" : language}
              />
              {stack !== "native" && (
                <div className="mt-4 flex justify-end">
                  <OpenInPlaygroundButton code={display} />
                </div>
              )}
            </>
          )}
        </div>
      )}
    </figure>
  );
}
