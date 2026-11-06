"use client";

import Link from "next/link";
import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";
import { CodeBlock, SegmentedControl } from "pollen-ui";
import { NATIVE_SHIPPED } from "./native-note";
import { withUseClient } from "@/lib/use-client";

export { withUseClient };

export type CodeLang = "tsx" | "js";
/** The stack whose code the page is currently showing. */
export type Stack = "react" | "next" | "native";

export interface StackVariant {
  tsx: string;
  /** Precomputed JavaScript variant; empty when unavailable. */
  js?: string;
}

interface FrameworkContextValue {
  lang: CodeLang;
  setLang: (lang: CodeLang) => void;
  stack: Stack;
  setStack: (stack: Stack) => void;
}

const FrameworkContext = createContext<FrameworkContextValue | null>(null);

/**
 * Page-wide code language and stack. The switches sit in the page
 * header; every code view on the page - demo blocks and the
 * playground - follows them.
 */
export function FrameworkProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<CodeLang>("tsx");
  const [stack, setStack] = useState<Stack>("react");
  return (
    <FrameworkContext.Provider value={{ lang, setLang, stack, setStack }}>
      {children}
    </FrameworkContext.Provider>
  );
}

const STACK_OPTIONS = [
  { value: "react", label: "React" },
  { value: "next", label: "Next.js" },
  { value: "native", label: "React Native" },
];

const LANGUAGE_SWITCH_OPTIONS = [
  { value: "tsx", label: "TypeScript" },
  { value: "js", label: "JavaScript" },
];

/** The page-header pair: which stack's code to show, in which language. */
export function FrameworkSwitch() {
  const ctx = useContext(FrameworkContext);
  if (!ctx) return null;
  return (
    <>
      <SegmentedControl
        size="sm"
        aria-label="Framework"
        value={ctx.stack}
        onValueChange={(v) => ctx.setStack(v as Stack)}
        options={STACK_OPTIONS}
      />
      <SegmentedControl
        size="sm"
        aria-label="Code language"
        value={ctx.lang}
        onValueChange={(v) => ctx.setLang(v as CodeLang)}
        options={LANGUAGE_SWITCH_OPTIONS}
      />
    </>
  );
}

/**
 * Shown while the React Native stack is selected. States the
 * coverage once, up top, so the demo panes don't have to repeat it.
 */
export function NativeBanner() {
  const ctx = useContext(FrameworkContext);
  if (!ctx || ctx.stack !== "native") return null;
  return (
    <aside className="mt-4 w-full rounded-xl bg-fill/60 px-4 py-3 ring-1 ring-[var(--pollen-border)]">
      <p className="text-[13px] leading-relaxed text-muted-foreground">
        <span className="font-medium text-foreground">React Native coverage today: </span>
        sixteen primitives ship in @pollen-ui/native. Code panes show the native
        example where it exists; components without a chip below are
        web-only for now and say so in place.
      </p>
      <p className="mt-2 flex flex-wrap gap-1.5">
        {NATIVE_SHIPPED.map((c) => (
          <Link
            key={c.slug}
            href={`/docs/${c.slug}`}
            className="rounded-md bg-card px-2 py-1 font-mono text-[11px] text-foreground ring-1 ring-[var(--pollen-border)] transition-colors hover:text-accent"
          >
            {c.label}
          </Link>
        ))}
      </p>
    </aside>
  );
}

/**
 * Code-language and stack state for one block: follows the page-wide
 * switches when there are any, carries its own local toggle otherwise.
 * The JavaScript variant is precomputed at build time, so switching is
 * a pure lookup.
 */
export function useFrameworkCode(
  code: string,
  jsCode?: string | null,
  nativeCode?: string | null,
): {
  stack: Stack;
  lang: CodeLang;
  setLang: (lang: CodeLang) => void;
  ready: boolean;
  display: string;
  filenameBase: string;
  language: "tsx" | "jsx";
} {
  const ctx = useContext(FrameworkContext);
  const [localLang, setLocalLang] = useState<CodeLang>("tsx");
  const lang = ctx?.lang ?? localLang;
  const setLang = ctx?.setLang ?? setLocalLang;
  const stack = ctx?.stack ?? "react";

  const hasJs = typeof jsCode === "string" && jsCode.length > 0;

  let display = code;
  if (stack === "native") {
    display = nativeCode ?? code;
  } else if (lang === "js" && hasJs) {
    display = stack === "next" ? withUseClient(jsCode as string) : (jsCode as string);
  } else if (stack === "next") {
    display = withUseClient(code);
  }

  return {
    stack,
    lang,
    setLang,
    ready: lang === "tsx" || hasJs,
    display,
    filenameBase: stack === "native" ? "App.tsx" : lang === "js" ? "example.jsx" : "example.tsx",
    language: lang === "js" ? "jsx" : "tsx",
  };
}

/**
 * Standalone code card with its own TypeScript/JavaScript toggle - used
 * on template pages, outside the docs pages' shared switch.
 */
export function FrameworkCodeCard({
  code,
  jsCode,
  filename,
  label,
}: {
  code: string;
  jsCode?: string | null;
  filename: string;
  label?: string;
}) {
  const { lang, setLang, display } = useFrameworkCode(code, jsCode);
  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        {label ? (
          <p className="text-sm font-medium text-foreground">{label}</p>
        ) : (
          <span />
        )}
        <SegmentedControl
          size="sm"
          aria-label="Code language"
          value={lang}
          onValueChange={(v) => setLang(v as CodeLang)}
          options={LANGUAGE_SWITCH_OPTIONS}
        />
      </div>
      <div className="mt-3">
        <CodeBlock
          code={display}
          filename={lang === "tsx" ? filename : filename.replace(/\.tsx$/, ".jsx")}
          language={lang === "tsx" ? "tsx" : "jsx"}
        />
      </div>
    </div>
  );
}
