"use client";

import type { ComponentType } from "react";
import { transform } from "sucrase";
import { reactScope, resolveRequire } from "./scope";

export interface CompileResult {
  ok: boolean;
  Component?: ComponentType;
  error?: string;
}

interface Module {
  exports: Record<string, unknown>;
}

function pickComponent(mod: Module): ComponentType | null {
  const { exports } = mod;
  const candidate = (exports as { default?: unknown }).default;
  if (typeof candidate === "function") return candidate as ComponentType;
  // Fall back to the first exported component-looking function.
  for (const value of Object.values(exports)) {
    if (typeof value === "function") return value as ComponentType;
  }
  return null;
}

/**
 * Transpiles JSX user code with Sucrase and evaluates it against
 * the playground scope. Import statements become require calls
 * into "react", "pollen-ui", "lucide-react" (aliased to Pollen icons) and "framer-motion".
 * Any syntax or evaluation error comes back as a string so the UI
 * can show it inline instead of a blank panel.
 */
export function compile(source: string): CompileResult {
  if (!source.trim()) {
    return { ok: false, error: "Nothing to run yet. Write a component and press Run." };
  }

  let transpiled: string;
  try {
    transpiled = transform(source, {
      transforms: ["jsx", "imports", "typescript"],
      jsxRuntime: "automatic",
      production: true,
    }).code;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return { ok: false, error: message };
  }

  try {
    const mod: Module = { exports: {} };
    // Ambient scope: hooks and helpers work without an import,
    // matching how the docs snippets are written.
    const fn = new Function(
      "require",
      "exports",
      "module",
      "useState",
      "useEffect",
      "useRef",
      "useMemo",
      "useCallback",
      "useReducer",
      "useId",
      `"use strict";\n${transpiled}`,
    );
    fn(
      resolveRequire,
      mod.exports,
      mod,
      reactScope.useState,
      reactScope.useEffect,
      reactScope.useRef,
      reactScope.useMemo,
      reactScope.useCallback,
      reactScope.useReducer,
      reactScope.useId,
    );
    const Component = pickComponent(mod);
    if (!Component) {
      return {
        ok: false,
        error:
          "No component found. Export one with: export default function Demo() { … }",
      };
    }
    return { ok: true, Component };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return { ok: false, error: message };
  }
}
