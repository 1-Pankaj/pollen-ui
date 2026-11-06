"use client";

import {
  Component,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ErrorInfo,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { Button, SegmentedControl, Switch, toast } from "pollen-ui";
import {
  IconFlask as FlaskConical,
  IconMonitor as Monitor,
  IconMoon as Moon,
  IconPanelBottom as PanelBottom,
  IconPlay as Play,
  IconRotate as RotateCcw,
  IconSeed as Sparkles,
  IconSun as Sun,
} from "pollen-ui";
import { CodeEditor } from "./code-editor";
import { PhoneFrame } from "./phone-frame";
import { compile } from "@/lib/playground/compile";
import { toPlaygroundSource } from "@/lib/playground/normalize";
import { examples } from "@/lib/playground/examples";
import { useFrameworkCode } from "../framework";
import { transform } from "sucrase";

/** Strips TypeScript for the JavaScript view; JSX stays untouched. */
function toJsDisplay(source: string): string {
  try {
    return transform(source, { transforms: ["typescript"] }).code;
  } catch {
    return source;
  }
}

const STORAGE_KEY = "pollen-playground-code";
const DRAFT_KEY = "pollen-playground-draft";

type PreviewTheme = "auto" | "light" | "dark";

class PreviewBoundary extends Component<
  { children: ReactNode; resetKey: string; onError?: () => void },
  { error: Error | null }
> {
  state = { error: null as Error | null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("[playground]", error, info.componentStack);
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

export function Playground() {
  const router = useRouter();
  const { lang, setLang } = useFrameworkCode("");
  const [code, setCode] = useState<string>(() => examples[0].code);
  const [result, setResult] = useState<{ runId: number } & ReturnType<typeof compile>>(
    () => ({ runId: 0, ok: false, error: undefined }),
  );
  const [autoRun, setAutoRun] = useState(true);
  const [runtimeError, setRuntimeError] = useState(false);
  const [exampleId, setExampleId] = useState<string>(examples[0].id);
  const [previewTheme, setPreviewTheme] = useState<PreviewTheme>("auto");
  const [viewport, setViewport] = useState<"fit" | "phone">("fit");
  const [expanded, setExpanded] = useState(false);
  const runIdRef = useRef(0);
  const codeRef = useRef(code);
  // True once the code came from the visitor (typed, saved or a
  // docs draft). The language switch then leaves it alone.
  const userEditedRef = useRef(false);

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

  // Keep the latest code readable by run() without writing refs during
  // render. Declared before the mount effect so the ref is fresh when
  // the first compile fires.
  useEffect(() => {
    codeRef.current = code;
  });

  const run = useCallback(() => {
    runIdRef.current += 1;
    setRuntimeError(false);
    const next = compile(codeRef.current);
    setResult({ runId: runIdRef.current, ...next });
  }, []);

  // Compile once on mount so the preview is never empty. Draft and
  // saved-code adoption runs one tick later so no state is set directly
  // inside the effect body; storage access is guarded (private mode).
  useEffect(() => {
    const adopt = () => {
      let draft: string | null = null;
      try {
        draft = window.localStorage.getItem(DRAFT_KEY);
      } catch {}
      const url = new URL(window.location.href);
      if (draft && url.searchParams.has("draft")) {
        try {
          window.localStorage.removeItem(DRAFT_KEY);
        } catch {}
        url.searchParams.delete("draft");
        window.history.replaceState(null, "", url.toString());
        setCode(draft);
        setExampleId("custom");
        userEditedRef.current = true;
        window.setTimeout(run, 60);
        return;
      }
      let saved: string | null = null;
      try {
        saved = window.localStorage.getItem(STORAGE_KEY);
      } catch {}
      if (saved && saved.trim()) {
        setCode(saved);
        setExampleId("custom");
        userEditedRef.current = true;
      }
      window.setTimeout(run, 60);
    };
    const t = window.setTimeout(adopt, 0);
    return () => window.clearTimeout(t);
  }, [run]);

  // Debounced auto-run + persistence.
  useEffect(() => {
    const save = window.setTimeout(() => {
      try {
        window.localStorage.setItem(STORAGE_KEY, code);
      } catch {
        // Storage unavailable: the session still works, nothing persists.
      }
    }, 600);
    if (!autoRun) return () => window.clearTimeout(save);
    const timer = window.setTimeout(run, 500);
    return () => {
      window.clearTimeout(save);
      window.clearTimeout(timer);
    };
  }, [code, autoRun, run]);

  const loadExample = (id: string) => {
    const example = examples.find((e) => e.id === id);
    if (!example) return;
    setExampleId(id);
    const next = lang === "js" ? toJsDisplay(example.code) : example.code;
    setCode(next);
    userEditedRef.current = false;
    codeRef.current = next;
  };

  // Swapping the language rewrites the editor from the current
  // example - unless the visitor has their own code in it. Deferred
  // one tick so no state is set directly inside the effect body.
  useEffect(() => {
    if (lang !== "js" || userEditedRef.current) return;
    const example = examples.find((e) => e.id === exampleId);
    if (!example) return;
    const t = window.setTimeout(() => {
      const next = toJsDisplay(example.code);
      setCode(next);
      codeRef.current = next;
    }, 0);
    return () => window.clearTimeout(t);
  }, [lang, exampleId]);

  const currentExample = useMemo(
    () => examples.find((e) => e.id === exampleId),
    [exampleId],
  );

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      toast.success("Copied to clipboard");
    } catch {
      toast.error("Could not copy");
    }
  };

  const reset = () => {
    const example = examples.find((e) => e.id === exampleId) ?? examples[0];
    setExampleId(example.id);
    const next = lang === "js" ? toJsDisplay(example.code) : example.code;
    setCode(next);
    codeRef.current = next;
    userEditedRef.current = false;
    toast("Example restored");
  };

  const { runId, Component, error } = result;
  const statusLabel = error || runtimeError ? "error" : "live";

  return (
    <div className="overflow-hidden rounded-[20px] bg-card shadow-[var(--pollen-shadow-md)]">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3 bg-fill/60 px-4 py-2.5">
        <span className="flex items-center gap-2 text-sm font-medium text-foreground">
          <FlaskConical className="h-4 w-4 text-accent" />
          Playground
        </span>

        {/* Example pills: one swipeable row on narrow screens */}
        <div className="slim-scroll flex min-w-0 max-w-full items-center gap-1.5 overflow-x-auto">
          {examples.map((example) => (
            <button
              key={example.id}
              type="button"
              title={example.blurb}
              onClick={() => loadExample(example.id)}
              className={
                exampleId === example.id
                  ? "shrink-0 rounded-full bg-card px-3 py-1.5 text-[13px] font-medium text-foreground shadow-[var(--pollen-shadow-xs)]"
                  : "shrink-0 rounded-full px-3 py-1.5 text-[13px] font-medium text-muted-foreground transition-colors hover:bg-card/70 hover:text-foreground"
              }
            >
              {example.title}
            </button>
          ))}
        </div>

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
            options={[
              { value: "auto", label: "Auto" },
              { value: "light", label: "Light" },
              { value: "dark", label: "Dark" },
            ]}
          />
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
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
          >
            <PanelBottom className="h-3.5 w-3.5" />
            {expanded ? "Compact" : "Expand"}
          </Button>
          <Switch
            checked={autoRun}
            onCheckedChange={setAutoRun}
            aria-label="Run automatically"
          >
            Auto-run
          </Switch>
          <Button size="sm" variant="ghost" onClick={reset} aria-label="Reset example">
            <RotateCcw className="h-3.5 w-3.5" />
            Reset
          </Button>
          <Button size="sm" variant="outline" onClick={copy}>
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

      {/* Editor + preview */}
      <div className="grid lg:grid-cols-2">
        <div
          className={`relative flex flex-col ${
            expanded ? "min-h-[560px] lg:min-h-[640px]" : "min-h-[300px] lg:min-h-[460px]"
          }`}
        >
          <div className="flex items-center justify-between px-4 pt-3">
            <span className="font-mono text-[11px] uppercase tracking-wide text-faint">
              {lang === "js" ? "demo.jsx" : "demo.tsx"}
            </span>
            {currentExample && (
              <span className="font-mono text-[11px] text-faint">
                {currentExample.blurb}
              </span>
            )}
          </div>
          <CodeEditor
            value={code}
            onChange={(v) => {
              userEditedRef.current = true;
              setCode(v);
            }}
            onSubmit={run}
            className="mt-1 min-h-[270px] flex-1"
          />
        </div>

        <div
          data-theme={previewTheme === "auto" ? undefined : previewTheme}
          className={`relative flex flex-col bg-fill/40 ${
            viewport === "phone"
              ? // Room for the full 780px device frame.
                "min-h-[860px]"
              : expanded
                ? "min-h-[560px] lg:min-h-[640px]"
                : "min-h-[300px] lg:min-h-[460px]"
          }`}
        >
          <div className="flex items-center justify-between px-4 pt-3">
            <span className="font-mono text-[11px] uppercase tracking-wide text-faint">
              Preview
            </span>
            <span className="flex items-center gap-1.5 font-mono text-[11px] text-faint">
              {previewTheme === "auto" ? (
                <Monitor className="h-3 w-3" />
              ) : previewTheme === "light" ? (
                <Sun className="h-3 w-3" />
              ) : (
                <Moon className="h-3 w-3" />
              )}
              {statusLabel}
            </span>
          </div>
          <div className="slim-scroll flex flex-1 items-center justify-center overflow-auto p-6 sm:p-8">
            {viewport === "phone" ? (
              <div className="py-2">
                <PhoneFrame>
                  {Component ? (
                    <PreviewBoundary
                      key={String(runId)}
                      resetKey={String(runId)}
                      onError={() => setRuntimeError(true)}
                    >
                      <div className="p-4">
                        <Component />
                      </div>
                    </PreviewBoundary>
                  ) : (
                    <p className="p-6 text-center text-sm text-faint">
                      Write a component and press Run.
                    </p>
                  )}
                </PhoneFrame>
              </div>
            ) : (
              Component ? (
                <PreviewBoundary
                  key={String(runId)}
                  resetKey={String(runId)}
                  onError={() => setRuntimeError(true)}
                >
                  <Component />
                </PreviewBoundary>
              ) : (
                <p className="max-w-[280px] text-center text-sm text-faint">
                  Write a component and press Run.
                </p>
              )
            )}
          </div>
          {error && (
            <div className="slim-scroll max-h-40 overflow-auto bg-danger/[0.06] px-4 py-3">
              <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-danger-ink">
                {error.slice(0, 60).startsWith("No component") ? "Missing export" : "Error"}
              </p>
              <pre className="whitespace-pre-wrap font-mono text-xs leading-relaxed text-danger-ink">
                {error}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/** The small "Open in playground" button used by docs demo blocks. */
export function OpenInPlaygroundButton({ code }: { code: string }) {
  const router = useRouter();
  return (
    <Button
      size="sm"
      variant="ghost"
      onClick={() => {
        try {
          window.localStorage.setItem(DRAFT_KEY, toPlaygroundSource(code));
        } catch {
          // Storage unavailable: the playground just opens empty.
        }
        router.push("/playground?draft=1");
      }}
    >
      <Sparkles className="h-3.5 w-3.5 text-accent" />
      Open in Playground
    </Button>
  );
}
