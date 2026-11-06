"use client";

import { useState, type ReactNode } from "react";
import {
  IconCheck as Check,
  IconCopy as Copy,
} from "../icons";
import { cn } from "../lib/utils";

export interface CodeBlockProps {
  code: string;
  /** Shown on the left of the header, e.g. a file name. */
  filename?: string;
  /** Shown as the language tag, e.g. tsx, bash. */
  language?: string;
  highlight?: boolean;
  className?: string;
}

const KEYWORDS = new Set([
  "const", "let", "var", "function", "return", "import", "from", "export",
  "default", "type", "interface", "extends", "implements", "new", "class",
  "async", "await", "if", "else", "for", "while", "switch", "case", "break",
  "try", "catch", "finally", "throw", "typeof", "instanceof", "of", "this",
  "super", "yield", "static", "public", "private", "protected", "readonly",
  "as", "satisfies", "null", "undefined", "true", "false", "void", "never",
]);

const TOKEN_RE =
  /(\/\/[^\n]*|\/\*[\s\S]*?\*\/)|("(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)*'|`(?:[^`\\]|\\.)*`)|(\b\d+(?:\.\d+)?\b)|(\b[A-Za-z_$][\w$]*\b)|(<\/?[A-Z][\w.]*|<\/?[a-z][\w-]*(?=[\s/>]))/g;

function highlight(code: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;
  TOKEN_RE.lastIndex = 0;

  while ((match = TOKEN_RE.exec(code)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(code.slice(lastIndex, match.index));
    }
    const [full, comment, str, num, word, tag] = match;
    if (comment) {
      nodes.push(
        <span key={key++} style={{ color: "var(--pollen-code-muted)" }}>
          {full}
        </span>,
      );
    } else if (str) {
      nodes.push(
        <span key={key++} style={{ color: "#a5d6ff" }}>
          {full}
        </span>,
      );
    } else if (num) {
      nodes.push(
        <span key={key++} style={{ color: "#79c0ff" }}>
          {full}
        </span>,
      );
    } else if (word && KEYWORDS.has(word)) {
      nodes.push(
        <span key={key++} style={{ color: "#ff7b72" }}>
          {full}
        </span>,
      );
    } else if (tag) {
      nodes.push(
        <span key={key++} style={{ color: "#7ee787" }}>
          {full}
        </span>,
      );
    } else {
      nodes.push(full);
    }
    lastIndex = match.index + full.length;
  }
  if (lastIndex < code.length) nodes.push(code.slice(lastIndex));
  return nodes;
}

/**
 * Always-dark code surface, in both themes, the way terminal
 * output should look. Copy is one click away and confirms with
 * a check instead of a message.
 */
export function CodeBlock({
  code,
  filename,
  language,
  highlight: shouldHighlight = true,
  className,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      const area = document.createElement("textarea");
      area.value = code;
      document.body.appendChild(area);
      area.select();
      document.execCommand("copy");
      area.remove();
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl bg-[var(--pollen-code-bg)] shadow-[var(--pollen-shadow-md)]",
        className,
      )}
    >
      <div className="flex items-center justify-between bg-white/[0.05] px-4 py-2.5">
        <span className="truncate font-mono text-xs text-[var(--pollen-code-muted)]">
          {filename ?? language ?? "code"}
        </span>
        <button
          type="button"
          onClick={copy}
          className="flex shrink-0 items-center gap-1.5 rounded px-1.5 py-1 text-xs text-[var(--pollen-code-muted)] transition-colors duration-150 hover:text-white"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5" /> Copied
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" /> Copy
            </>
          )}
        </button>
      </div>
      <pre className="slim-scroll overflow-x-auto p-4 font-mono text-[13px] leading-[1.7] text-[var(--pollen-code-fg)]">
        <code>{shouldHighlight ? highlight(code) : code}</code>
      </pre>
    </div>
  );
}
