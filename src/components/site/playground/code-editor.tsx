"use client";

/**
 * CodeMirror 6 wrapper styled with Pollen tokens. Because every
 * color is a CSS variable the editor follows the light and dark
 * themes with zero extra work, and because it is a real editor it
 * gets line numbers, history, bracket matching, autocompletion
 * and Tab indentation like a normal IDE.
 */

import { useEffect, useRef } from "react";
import {
  EditorState,
  type Extension,
} from "@codemirror/state";
import {
  EditorView,
  drawSelection,
  dropCursor,
  highlightActiveLine,
  highlightActiveLineGutter,
  highlightSpecialChars,
  keymap,
  lineNumbers,
  rectangularSelection,
} from "@codemirror/view";
import {
  defaultKeymap,
  history,
  historyKeymap,
  indentWithTab,
} from "@codemirror/commands";
import {
  bracketMatching,
  defaultHighlightStyle,
  HighlightStyle,
  indentOnInput,
  indentUnit,
  syntaxHighlighting,
} from "@codemirror/language";
import {
  autocompletion,
  closeBrackets,
  closeBracketsKeymap,
  completionKeymap,
} from "@codemirror/autocomplete";
import { highlightSelectionMatches } from "@codemirror/search";
import { javascript } from "@codemirror/lang-javascript";
import { tags as t } from "@lezer/highlight";
import { cn } from "@/lib/utils";
import { pollenCompletions } from "@/lib/playground/completions";

const pollenTheme = EditorView.theme({
  "&": {
    color: "var(--pollen-fg)",
    backgroundColor: "transparent",
    fontSize: "13.5px",
  },
  "&.cm-focused": { outline: "none" },
  ".cm-scroller": {
    fontFamily: "var(--font-mono)",
    lineHeight: "1.7",
  },
  ".cm-content": { caretColor: "var(--pollen-accent)", padding: "16px 0" },
  ".cm-gutters": {
    backgroundColor: "transparent",
    color: "var(--pollen-fg-faint)",
    border: "none",
    paddingRight: "4px",
  },
  ".cm-activeLine": {
    backgroundColor: "color-mix(in srgb, var(--pollen-fg) 4%, transparent)",
  },
  ".cm-activeLineGutter": {
    backgroundColor: "transparent",
    color: "var(--pollen-fg-muted)",
  },
  ".cm-selectionBackground, &.cm-focused .cm-selectionBackground": {
    backgroundColor: "color-mix(in srgb, var(--pollen-accent) 20%, transparent) !important",
    borderRadius: "2px",
  },
  ".cm-cursor, .cm-dropCursor": { borderLeftColor: "var(--pollen-accent)" },
  ".cm-tooltip": {
    backgroundColor: "var(--pollen-card)",
    border: "none",
    borderRadius: "10px",
    boxShadow: "var(--pollen-shadow-lg)",
    overflow: "hidden",
  },
  ".cm-tooltip.cm-tooltip-autocomplete > ul": {
    fontFamily: "var(--font-mono)",
    fontSize: "12.5px",
    maxHeight: "240px",
    padding: "4px",
  },
  ".cm-tooltip.cm-tooltip-autocomplete > ul > li": {
    padding: "3px 8px",
    borderRadius: "6px",
  },
  ".cm-tooltip.cm-tooltip-autocomplete > ul > li[aria-selected]": {
    backgroundColor: "color-mix(in srgb, var(--pollen-accent) 15%, transparent)",
    color: "var(--pollen-fg)",
  },
  ".cm-completionLabel": { color: "var(--pollen-fg)" },
  ".cm-completionDetail": {
    color: "var(--pollen-fg-faint)",
    fontStyle: "normal",
  },
});

const pollenHighlight = HighlightStyle.define([
  { tag: [t.keyword, t.moduleKeyword, t.controlKeyword], color: "var(--pollen-accent)" },
  { tag: [t.string, t.special(t.string)], color: "var(--pollen-success-ink)" },
  { tag: [t.number, t.bool, t.null], color: "var(--pollen-warning-ink)" },
  { tag: [t.comment, t.lineComment, t.blockComment], color: "var(--pollen-fg-faint)", fontStyle: "italic" },
  { tag: [t.tagName], color: "var(--pollen-fg)", fontWeight: "600" },
  { tag: [t.attributeName], color: "var(--pollen-fg-muted)" },
  { tag: [t.definition(t.variableName)], color: "var(--pollen-fg)" },
  { tag: [t.function(t.variableName)], color: "var(--pollen-fg)" },
  { tag: [t.variableName], color: "var(--pollen-fg)" },
  { tag: [t.propertyName], color: "var(--pollen-fg)" },
  { tag: [t.operator, t.punctuation, t.bracket], color: "var(--pollen-fg-muted)" },
  { tag: [t.invalid], color: "var(--pollen-danger-ink)" },
]);

function baseExtensions(onSubmit: () => void): Extension[] {
  return [
    lineNumbers(),
    highlightActiveLineGutter(),
    highlightSpecialChars(),
    history(),
    drawSelection(),
    dropCursor(),
    EditorState.allowMultipleSelections.of(true),
    indentOnInput(),
    indentUnit.of("  "),
    bracketMatching(),
    closeBrackets(),
    autocompletion({
      override: [pollenCompletions],
      activateOnTyping: true,
      icons: true,
      closeOnBlur: false,
    }),
    rectangularSelection(),
    highlightActiveLine(),
    highlightSelectionMatches(),
    // Completion keys run before the default maps so Enter accepts
    // the open completion instead of inserting a newline.
    keymap.of([...completionKeymap]),
    syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
    syntaxHighlighting(pollenHighlight),
    pollenTheme,
    javascript({ jsx: true, typescript: true }),
    keymap.of([
      {
        key: "Mod-Enter",
        preventDefault: true,
        run: () => {
          onSubmit();
          return true;
        },
      },
      ...closeBracketsKeymap,
      ...defaultKeymap,
      ...historyKeymap,
      indentWithTab,
    ]),
    EditorView.lineWrapping,
  ];
}

export interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit?: () => void;
  className?: string;
  ariaLabel?: string;
}

export function CodeEditor({
  value,
  onChange,
  onSubmit,
  className,
  ariaLabel = "Code editor",
}: CodeEditorProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const onChangeRef = useRef(onChange);
  const onSubmitRef = useRef<() => void>(() => {});

  // Keep the latest callbacks readable by the editor without writing
  // refs during render. Declared before the creation effect so the
  // refs are fresh when the view is constructed.
  useEffect(() => {
    onChangeRef.current = onChange;
    onSubmitRef.current = onSubmit ?? (() => {});
  });

  useEffect(() => {
    if (!hostRef.current) return;
    const view = new EditorView({
      state: EditorState.create({
        doc: value,
        extensions: [
          ...baseExtensions(() => onSubmitRef.current()),
          EditorView.updateListener.of((update) => {
            if (update.docChanged) {
              onChangeRef.current(update.state.doc.toString());
            }
          }),
        ],
      }),
      parent: hostRef.current,
    });
    viewRef.current = view;
    return () => {
      view.destroy();
      viewRef.current = null;
    };
    // The editor is created once; value changes flow through dispatch below.
  }, []);

  useEffect(() => {
    const view = viewRef.current;
    if (!view) return;
    const current = view.state.doc.toString();
    if (current !== value) {
      view.dispatch({
        changes: { from: 0, to: current.length, insert: value },
      });
    }
  }, [value]);

  return (
    <div
      ref={hostRef}
      role="textbox"
      aria-label={ariaLabel}
      aria-multiline="true"
      className={cn("overflow-hidden [&_.cm-editor]:h-full", className)}
    />
  );
}
