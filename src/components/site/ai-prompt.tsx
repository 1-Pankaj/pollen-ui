"use client";

import { useState } from "react";
import { CodeBlock, IconChat, IconChevronDown } from "pollen-ui";

/**
 * A small affordance that expands into a ready-to-paste prompt for AI
 * coding agents, with a one-click copy (CodeBlock's own button).
 * The prompt text itself is generated on the server from the same
 * data the page renders.
 */
export function AiPrompt({
  prompt,
  intro,
  filename = "prompt.txt",
}: {
  prompt: string;
  intro: string;
  filename?: string;
}) {
  const [open, setOpen] = useState(false);
  const panelId = `ai-prompt-${filename.replace(/[^a-z0-9]/gi, "-")}`;
  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={panelId}
        className="inline-flex items-center gap-1.5 rounded-[10px] bg-fill px-3.5 py-2 text-[13px] font-medium text-foreground transition-colors hover:bg-fill-strong"
      >
        <IconChat className="h-3.5 w-3.5" />
        AI prompt
        <IconChevronDown
          className={`h-3.5 w-3.5 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      {open && (
        <div id={panelId} className="mt-4">
          <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
            {intro}
          </p>
          <CodeBlock
            code={prompt}
            filename={filename}
            highlight={false}
            className="mt-3"
          />
        </div>
      )}
    </div>
  );
}
