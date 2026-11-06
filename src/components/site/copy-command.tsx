"use client";

import { useEffect, useState } from "react";
import {
  IconCheck as Check,
  IconCopy as Copy,
} from "pollen-ui";

/** Install command with a copy button that confirms, then reverts. */
export function CopyCommand() {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [copied]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText("npm install pollen-ui");
      setCopied(true);
    } catch {
      /* Clipboard unavailable; the text is selectable anyway. */
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      aria-label="Copy install command"
      className="group inline-flex h-11 items-center gap-3 rounded-[13px] bg-card pr-2.5 pl-4 font-mono text-[13px] text-muted-foreground shadow-[var(--pollen-shadow-sm)] transition-colors duration-150 hover:bg-fill"
    >
      <span className="text-faint">$</span>
      <span className="tabular-nums">npm install pollen-ui</span>
      <span
        aria-hidden="true"
        className="flex h-6 w-6 items-center justify-center rounded-lg text-faint transition-colors group-hover:text-foreground"
      >
        {copied ? <Check className="h-3.5 w-3.5 text-success-ink" /> : <Copy className="h-3.5 w-3.5" />}
      </span>
    </button>
  );
}
