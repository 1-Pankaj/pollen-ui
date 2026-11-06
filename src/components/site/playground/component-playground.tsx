"use client";

import {
  Component,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ErrorInfo,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  CodeBlock,
  Input,
  SegmentedControl,
  Switch,
  toast,
  IconCode as Code,
  IconCopy as Copy,
  IconFlask as FlaskConical,
  IconMonitor as Monitor,
  IconMoon as Moon,
  IconPanelBottom as PanelBottom,
  IconPanels as PanelsRight,
  IconPlay as Play,
  IconRotate as RotateCcw,
  IconSun as Sun,
  IconExternal as External,
} from "pollen-ui";
import { CodeEditor } from "./code-editor";
import { PhoneFrame } from "./phone-frame";
import { compile } from "@/lib/playground/compile";
import { playgroundSnippet } from "@/lib/playground/props-code";
import { useFrameworkCode, type StackVariant } from "../framework";
import { NativePendingNote } from "../native-note";
import type { PlaygroundSpec } from "@/lib/registry/types";

/**
 * The playground, scaled down to live inside a docs page.
 *
 * Every component page embeds one. It opens with that component's
 * first demo already loaded. When the registry documents a prop
 * spec, a Props pane appears: flip a switch or pick a variant and
 * the code rewrites itself, then the preview follows. The editor
 * stays editable, the preview has its own theme and viewport, and
 * everything saves locally per component.
 */

class MiniBoundary extends Component<
  { children: ReactNode; resetKey: string; onError?: () => void },
  { error: Error | null }
> {
  state = { error: null as Error | null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("[mini-playground]", error, info.componentStack);
    this.props.onError?.();
  }

  componentDidUpdate(prev: { resetKey: string }) {
    if (prev.resetKey !== this.props.resetKey && this.state.error) {
      this.setState({ error: null });
    }
  }

  render() {
    if (this.state.error) {
      return (
        <pre className="whitespace-pre-wrap font-mono text-xs leading-relaxed text-danger-ink">
          {this.state.error.message}
        </pre>
      );
    }
    return this.props.children;
  }
}

type PreviewTheme = "auto" | "light" | "dark";

export function ComponentPlayground({
  slug,
  variants,
  spec,
  nativeCode,
  componentTitle,
}: {
  slug: string;
  /** Per-stack starting code; the language switch picks the variant. */
  variants: { react: StackVariant; next: StackVariant };
  spec?: PlaygroundSpec;
  /** React Native usage, when @pollen-ui/native ships the component. */
  nativeCode?: string | null;
  componentTitle?: string;
}) {
  const router = useRouter();
  const storageKey = `pollen-mini-${slug}`;
  const { stack, lang, setLang } = useFrameworkCode("");
  const [code, setCode] = useState(variants.react.tsx);
  const [result, setResult] = useState<{ runId: number } & ReturnType<typeof compile>>(
    () => ({ runId: 0, ok: false, error: undefined }),
  );
  const [previewTheme, setPreviewTheme] = useState<PreviewTheme>("auto");
  const [viewport, setViewport] = useState<"fit" | "phone">("fit");
  const [expanded, setExpanded] = useState(false);
  const [runtimeError, setRuntimeError] = useState(false);
  const [values, setValues] = useState<Record<string, string | boolean | number>>(
    () => spec?.values ?? {},
  );
  const runIdRef = useRef(0);
  const codeRef = useRef(code);
  // True once the visitor has typed in the editor. Their code then
  // wins over the stack/language variants until Reset.
  const editedRef = useRef(false);

  // The canonical snippet for the current page-wide stack + language.
  const baseCode =
    stack === "react"
      ? lang === "js"
        ? variants.react.js || variants.react.tsx
        : variants.react.tsx
      : stack === "next"
        ? lang === "js"
          ? variants.next.js || variants.next.tsx
          : variants.next.tsx
        : null;

  // Keep the latest code readable by run() without writing refs during
  // render. Declared before the mount effect so the ref is fresh when
  // the first compile fires.
  useEffect(() => {
    codeRef.current = code;
  });

  // Follow the page-wide stack/language switches, but never over
  // the visitor's own edits.
  useEffect(() => {
    if (baseCode && !editedRef.current) {
      setCode(baseCode);
      codeRef.current = baseCode;
    }
  }, [baseCode]);

  const run = useCallback(() => {
    runIdRef.current += 1;
    setRuntimeError(false);
    const next = compile(codeRef.current);
    setResult({ runId: runIdRef.current, ...next });
  }, []);

  useEffect(() => {
    // Adopt any saved code one tick later so no state is set directly
    // inside the effect body; storage access is guarded (private mode).
    const adopt = () => {
      let saved: string | null = null;
      try {
        saved = window.localStorage.getItem(storageKey);
      } catch {}
      // Saved code is adopted only when it is a real visitor edit -
      // not one of the canonical variants, which the stack/language
      // switches own.
      const canonical = new Set(
        [
          variants.react.tsx,
          variants.react.js,
          variants.next.tsx,
          variants.next.js,
        ].filter((s): s is string => typeof s === "string"),
      );
      if (saved && saved.trim() && !canonical.has(saved)) {
        setCode(saved);
        codeRef.current = saved;
        editedRef.current = true;
      }
      window.setTimeout(run, 80);
    };
    const t = window.setTimeout(adopt, 0);
    return () => window.clearTimeout(t);
    // Run once on mount with whatever code is current.
  }, []);

  useEffect(() => {
    const save = window.setTimeout(() => {
      try {
        window.localStorage.setItem(storageKey, code);
      } catch {
        // Storage unavailable: the session still works, nothing persists.
      }
    }, 600);
    const timer = window.setTimeout(run, 500);
    return () => {
      window.clearTimeout(save);
      window.clearTimeout(timer);
    };
  }, [code]);

  /* Changing a prop rewrites the snippet. The editor remains free
     to edit afterwards; the next control change regenerates again. */
  const applyValues = (next: Record<string, string | boolean | number>) => {
    if (!spec) return;
    setValues(next);
    setCode(playgroundSnippet(spec, next));
    editedRef.current = false;
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      toast.success("Code copied");
    } catch {
      toast.error("Could not copy");
    }
  };

  const reset = () => {
    setCode(baseCode ?? variants.react.tsx);
    codeRef.current = baseCode ?? variants.react.tsx;
    editedRef.current = false;
    if (spec) setValues(spec.values);
    toast("Demo restored");
  };

  const openFull = () => {
    try {
      window.localStorage.setItem("pollen-playground-draft", code);
    } catch {
      // Storage unavailable: the playground just opens with its defaults.
    }
    router.push("/playground?draft=1");
  };

  // The macOS hint is ⌘⏎; everyone else gets Ctrl. Deferred one tick
  // so the server HTML and the first client paint agree.
  const [isMac, setIsMac] = useState(true);
  useEffect(() => {
    const t = window.setTimeout(
      () => setIsMac(/Mac|iPhone|iPad/.test(navigator.platform)),
      0,
    );
    return () => window.clearTimeout(t);
  }, []);

  const { runId, Component, error } = result;
  const previewThemeClass =
    previewTheme === "auto" ? undefined : previewTheme === "dark" ? "dark" : "light";
  const lineCount = useMemo(() => code.split("\n").length, [code]);

  const themeOptions = useMemo(
    () => [
      { value: "auto", label: "Auto" },
      { value: "light", label: "Light" },
      { value: "dark", label: "Dark" },
    ],
    [],
  );

  if (stack === "native") {
    return (
      <section
        className="mt-12 scroll-mt-24 overflow-hidden rounded-2xl bg-card shadow-[var(--pollen-shadow-md)]"
        aria-label={`${slug} react native`}
        id="playground"
      >
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 bg-fill/60 px-4 py-2.5">
          <span className="flex items-center gap-2 text-sm font-medium text-foreground">
            <FlaskConical className="h-4 w-4 text-accent" />
            React Native
          </span>
          <span className="text-[13px] text-muted-foreground">
            The browser playground runs web code - copy this into your Expo or bare RN app.
          </span>
        </div>
        <div className="p-4 sm:p-6">
          {nativeCode ? (
            <CodeBlock code={nativeCode} filename="App.tsx" language="tsx" />
          ) : (
            <NativePendingNote title={componentTitle ?? slug} />
          )}
        </div>
      </section>
    );
  }

  const renderControl = (key: string) => {
    if (!spec) return null;
    const control = spec.controls.find((c) => c.prop === key);
    if (!control) return null;
    const value = values[control.prop];

    if (control.kind === "boolean") {
      return (
        <label
          key={control.prop}
          className="flex min-w-0 items-center gap-2.5 rounded-xl bg-fill/60 px-3 py-2"
        >
          <span className="text-[13px] font-medium text-foreground">
            {control.label}
          </span>
          <Switch
            checked={value === true}
            onCheckedChange={(v) => applyValues({ ...values, [control.prop]: v })}
            aria-label={control.label}
            className="ml-auto"
          />
        </label>
      );
    }

    if (control.kind === "select") {
      return (
        <div
          key={control.prop}
          className="flex min-w-0 items-center gap-2.5 rounded-xl bg-fill/60 px-3 py-1.5"
        >
          <span className="text-[13px] font-medium text-foreground">
            {control.label}
          </span>
          <SegmentedControl
            size="sm"
            aria-label={control.label}
            className="min-w-0 max-w-full"
            value={String(value ?? "")}
            onValueChange={(v) => applyValues({ ...values, [control.prop]: v })}
            options={control.options}
          />
        </div>
      );
    }

    if (control.kind === "number") {
      return (
        <label
          key={control.prop}
          className="flex min-w-0 items-center gap-2 rounded-xl bg-fill/60 px-3 py-1.5"
        >
          <span className="whitespace-nowrap text-[13px] font-medium text-foreground">
            {control.label}
          </span>
          <Input
            type="number"
            defaultValue={Number(value ?? 0)}
            min={control.min}
            max={control.max}
            step={control.step}
            onBlur={(e) =>
              applyValues({ ...values, [control.prop]: Number(e.target.value) })
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                applyValues({
                  ...values,
                  [control.prop]: Number((e.target as HTMLInputElement).value),
                });
              }
            }}
            aria-label={control.label}
            className="ml-auto h-8 w-20 text-[13px]"
          />
        </label>
      );
    }

    return (
      <label
        key={control.prop}
        className="flex min-w-0 items-center gap-2 rounded-xl bg-fill/60 px-3 py-1.5"
      >
        <span className="whitespace-nowrap text-[13px] font-medium text-foreground">
          {control.label}
        </span>
        <Input
          defaultValue={String(value ?? "")}
          placeholder={control.placeholder}
          onBlur={(e) =>
            applyValues({ ...values, [control.prop]: e.target.value })
          }
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              applyValues({
                ...values,
                [control.prop]: (e.target as HTMLInputElement).value,
              });
            }
          }}
          aria-label={control.label}
          className="ml-auto h-8 w-36 text-[13px]"
        />
      </label>
    );
  };

  return (
    <section
      className="mt-12 scroll-mt-24 overflow-hidden rounded-2xl bg-card shadow-[var(--pollen-shadow-md)]"
      aria-label={`${slug} playground`}
      id="playground"
    >
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 bg-fill/60 px-4 py-2.5">
        <span className="flex items-center gap-2 text-sm font-medium text-foreground">
          <FlaskConical className="h-4 w-4 text-accent" />
          Playground
        </span>
        <span className="hidden text-[13px] text-muted-foreground sm:inline">
          {spec
            ? "Flip the props, or edit the code directly"
            : "Edit the code, the preview follows"}
        </span>
        <div className="ml-auto flex flex-wrap items-center justify-end gap-2 sm:gap-3">
          <SegmentedControl
            size="sm"
            aria-label="Code language"
            value={lang}
            onValueChange={(v) => setLang(v as "tsx" | "js")}
            options={[
              { value: "tsx", label: "TypeScript" },
              { value: "js", label: "JavaScript" },
            ]}
          />
          <SegmentedControl
            size="sm"
            aria-label="Preview theme"
            value={previewTheme}
            onValueChange={(v) => setPreviewTheme(v as PreviewTheme)}
            options={themeOptions}
          />
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
            aria-label={expanded ? "Compact playground" : "Expand playground"}
          >
            <PanelBottom className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">{expanded ? "Compact" : "Expand"}</span>
          </Button>
          <Button size="sm" variant="ghost" onClick={reset} aria-label="Restore demo">
            <RotateCcw className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </Button>
          <Button size="sm" variant="outline" onClick={copy}>
            <Copy className="h-3.5 w-3.5" />
            Copy
          </Button>
          <Button size="sm" onClick={run}>
            <Play className="h-3.5 w-3.5" />
            Run
            <span className="ml-1 hidden rounded bg-background/15 px-1 py-px font-mono text-[10px] md:inline">
              {isMac ? "⌘⏎" : "Ctrl+⏎"}
            </span>
          </Button>
        </div>
      </div>

      {spec && (
        <div className="min-w-0 flex flex-wrap items-center gap-2 overflow-x-auto slim-scroll border-none bg-card px-4 py-3">
          <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-faint">
            <PanelsRight className="h-3 w-3" />
            Props
          </span>
          {spec.controls.map((control) => renderControl(control.prop))}
        </div>
      )}

      <div className="grid lg:grid-cols-2">
        <div
          className={`relative flex flex-col transition-[min-height] duration-200 ${
            expanded ? "min-h-[520px] lg:max-h-[70vh]" : "min-h-[240px] lg:min-h-[320px]"
          }`}
        >
          <div className="flex items-center justify-between px-4 pt-2.5">
            <span className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wide text-faint">
              <Code className="h-3 w-3" />
              {lang === "js" ? "demo.jsx" : "demo.tsx"}
            </span>
            <span className="font-mono text-[11px] text-faint">
              {lineCount} lines · ⇧ editable
            </span>
          </div>
          <div className="slim-scroll mt-1 max-h-[420px] min-h-[210px] flex-1 overflow-auto">
            <CodeEditor
              value={code}
              onChange={(v) => {
                editedRef.current = true;
                setCode(v);
              }}
              onSubmit={run}
              ariaLabel={`${slug} playground code`}
              className="min-h-[210px]"
            />
          </div>
        </div>

        <div
          data-theme={previewThemeClass}
          className={`relative flex flex-col bg-fill/40 ${
            previewThemeClass ? previewThemeClass : ""
          } ${
            viewport === "phone"
              ? // The device frame is 780px tall: give the pane room to
                // show the whole phone instead of clipping it.
                "min-h-[840px]"
              : expanded
                ? "min-h-[520px] lg:max-h-[70vh]"
                : "min-h-[240px] max-h-[480px] lg:min-h-[320px]"
          } ${previewThemeClass ? "bg-fill/60" : ""}`}
        >
          <div className="flex items-center justify-between px-4 pt-2.5">
            <SegmentedControl
              size="sm"
              aria-label="Preview width"
              value={viewport}
              onValueChange={(v) => setViewport(v as "fit" | "phone")}
              options={[
                { value: "fit", label: "Fit" },
                { value: "phone", label: "Phone" },
              ]}
            />
            <span className="flex items-center gap-1.5 font-mono text-[11px] text-faint">
              {previewTheme === "auto" ? (
                <Monitor className="h-3 w-3" />
              ) : previewTheme === "light" ? (
                <Sun className="h-3 w-3" />
              ) : (
                <Moon className="h-3 w-3" />
              )}
              {previewTheme}
            </span>
          </div>
          <div className="slim-scroll flex flex-1 items-center justify-center overflow-auto p-6">
            {viewport === "phone" ? (
              <div className="py-2">
                <PhoneFrame>
                  {Component ? (
                    <MiniBoundary
                      key={String(runId)}
                      resetKey={String(runId)}
                      onError={() => setRuntimeError(true)}
                    >
                      <div className="p-4">
                        <Component />
                      </div>
                    </MiniBoundary>
                  ) : (
                    <p className="p-6 text-center text-sm text-faint">
                      Press Run to render the preview.
                    </p>
                  )}
                </PhoneFrame>
              </div>
            ) : (
              <div className="w-full">
                {Component ? (
                  <MiniBoundary
                    key={String(runId)}
                    resetKey={String(runId)}
                    onError={() => setRuntimeError(true)}
                  >
                    <Component />
                  </MiniBoundary>
                ) : (
                  <p className="mx-auto max-w-[240px] text-center text-sm text-faint">
                    Press Run to render the preview.
                  </p>
                )}
              </div>
            )}
          </div>
          {(error || runtimeError) && (
            <div className="slim-scroll max-h-36 overflow-auto bg-danger/[0.06] px-4 py-2.5">
              <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-danger-ink">
                Error
              </p>
              <pre className="whitespace-pre-wrap font-mono text-xs leading-relaxed text-danger-ink">
                {error}
              </pre>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 bg-fill/60 px-4 py-2">
        <span className="text-[13px] text-muted-foreground">
          Saved locally as you type, per component. Your edits win over the language and stack switches until you press Reset.
        </span>
        <button
          type="button"
          onClick={openFull}
          className="group inline-flex items-center gap-1.5 text-[13px] font-medium text-foreground transition-colors hover:text-accent"
        >
          Open the full Playground
          <External className="h-3.5 w-3.5 transition-transform duration-150 group-hover:translate-x-0.5" />
        </button>
      </div>
    </section>
  );
}
