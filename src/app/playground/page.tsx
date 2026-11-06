import type { Metadata } from "next";
import { Reveal, CodeBlock, Tabs, TabsList, TabsTrigger, TabsContent } from "pollen-ui";
import { Playground } from "@/components/site/playground/playground";
import { AiPrompt } from "@/components/site/ai-prompt";
import { scopeSummary } from "@/lib/playground/scope-meta";

export const metadata: Metadata = {
  title: "Playground",
  description:
    "Write JSX against Pollen UI right in your browser. Real components, real hooks, instant preview. No install, no build.",
};

const PLAYGROUND_PROMPT = [
  "Set up a scratch page for trying Pollen UI components.",
  "",
  "Pollen UI is a React 19 + Tailwind CSS 4 component library by Pankaj Israni.",
  "Source and docs: https://github.com/1-Pankaj/pollen-ui",
  "Install: npm install pollen-ui",
  "",
  "Give me one page with a working example of Button, Modal and Toast:",
  "- a Button that opens the Modal",
  "- a Toast fired from the Modal's confirm action",
  "- TypeScript, no extra dependencies beyond pollen-ui and framer-motion",
].join("\n");

const REACT_SNIPPET = `npm install pollen-ui framer-motion

import { Button } from "pollen-ui";
import "pollen-ui/styles.css";

export function App() {
  return <Button onClick={() => console.log("hey")}>Hey</Button>;
}`;

const NEXT_SNIPPET = `// app/page.tsx - App Router
// Components that use state or events need the directive:
"use client";

import { Button } from "pollen-ui";
import "pollen-ui/styles.css";

export default function Page() {
  return <Button>Works in Next.js</Button>;
}`;

const RN_SNIPPET = `npm install @pollen/native
# requires react-native >= 0.74, react-native-reanimated >= 3.16
# under Expo, NativeWind 4 handles the className passthrough

import { Button } from "@pollen/native";

export function App() {
  return (
    <Button variant="primary" onPress={() => console.log("hey")}>
      Hey
    </Button>
  );
}`;

const HOW_TO = [
  {
    title: "Run it",
    body: "Press Run, or ⌘/Ctrl + Enter inside the editor. Auto-run keeps the preview in step as you type.",
  },
  {
    title: "Your work stays",
    body: "Code saves locally after every pause and is restored when you return. Reset pulls the example back in.",
  },
  {
    title: "Drafts from the docs",
    body: "Every demo's Code view has Open in Playground - the snippet lands here ready to pull apart.",
  },
  {
    title: "A real sandbox",
    body: "The actual library is transpiled in your browser and rendered. Nothing is uploaded anywhere.",
  },
];

export default function PlaygroundPage() {
  return (
    <div className="mx-auto max-w-[1200px] px-6 pb-24 pt-14 sm:pt-20">
      <Reveal>
        <p className="text-sm font-semibold text-accent">Playground</p>
        <h1 className="mt-3 max-w-2xl text-balance text-4xl font-semibold leading-[1.08] tracking-[-0.03em] sm:text-5xl">
          Code against the real thing
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          This editor runs the actual library in your browser. Press Run and
          the preview renders what you wrote - no install, no build.
        </p>
      </Reveal>

      <Reveal delay={0.1} className="mt-10">
        <Playground />
      </Reveal>

      {/* How it works - compact, no card wall */}
      <Reveal delay={0.12} className="mt-14">
        <h2 className="text-2xl font-semibold tracking-tight">How it works</h2>
        <div className="mt-6 grid gap-x-10 gap-y-6 sm:grid-cols-2">
          {HOW_TO.map((item, i) => (
            <div key={item.title} className="flex gap-3.5">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/12 font-mono text-[11px] font-semibold text-accent">
                {i + 1}
              </span>
              <div>
                <p className="text-[15px] font-medium text-foreground">{item.title}</p>
                <p className="mt-1 text-[13.5px] leading-relaxed text-muted-foreground">
                  {item.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Reveal>

      {/* Imports - one compact card, chips collapsed */}
      <Reveal delay={0.14} className="mt-14">
        <h2 className="text-2xl font-semibold tracking-tight">What you can import</h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Four namespaces are wired into the sandbox. Anything a real project
          would import from them works identically here.
        </p>
        <div className="mt-5 divide-y rounded-2xl bg-card shadow-[var(--pollen-shadow-sm)]">
          <ImportRow
            name="pollen-ui"
            note={`${scopeSummary.pollen.length} exports - the whole component library`}
            items={scopeSummary.pollen}
          />
          <ImportRow
            name="react"
            note="the React namespace plus every hook"
            items={scopeSummary.react}
          />
          <ImportRow
            name="framer-motion"
            note="for custom motion"
            items={scopeSummary.motion}
          />
          <ImportRow
            name="lucide-react"
            note="a curated icon set"
            items={scopeSummary.icons}
          />
        </div>
      </Reveal>

      {/* Take it into a real project - one tab visible at a time */}
      <Reveal delay={0.16} className="mt-14">
        <h2 className="text-2xl font-semibold tracking-tight">
          Take it into a real project
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          The playground is a sketchbook. When something clicks, the same
          code runs in your app - pick your stack:
        </p>
        <div className="mt-5 rounded-2xl bg-card p-5 shadow-[var(--pollen-shadow-sm)]">
          <Tabs defaultValue="react">
            <TabsList aria-label="Setup guides">
              <TabsTrigger value="react">React</TabsTrigger>
              <TabsTrigger value="next">Next.js</TabsTrigger>
              <TabsTrigger value="native">React Native</TabsTrigger>
            </TabsList>
            <TabsContent value="react">
              <p className="mb-4 max-w-2xl text-[13.5px] leading-relaxed text-muted-foreground">
                Vite, Remix, CRA - anything that renders React. One package,
                one stylesheet import, done.
              </p>
              <CodeBlock code={REACT_SNIPPET} filename="app.tsx" language="tsx" />
            </TabsContent>
            <TabsContent value="next">
              <p className="mb-4 max-w-2xl text-[13.5px] leading-relaxed text-muted-foreground">
                Fully compatible with the App Router. Interactive components
                need the &quot;use client&quot; directive - exactly one line.
              </p>
              <CodeBlock code={NEXT_SNIPPET} filename="page.tsx" language="tsx" />
            </TabsContent>
            <TabsContent value="native">
              <p className="mb-4 max-w-2xl text-[13.5px] leading-relaxed text-muted-foreground">
                The same design language on iOS and Android through
                @pollen/native, sharing tokens with the web library.
              </p>
              <CodeBlock code={RN_SNIPPET} filename="app.tsx" language="tsx" />
            </TabsContent>
          </Tabs>
        </div>
        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-faint">
          @pollen/native ships sixteen primitives - Button, Input, Badge,
          Avatar, Switch, Slider, Progress, Skeleton, Card, Checkbox,
          RadioGroup, Textarea, SegmentedControl, PinInput, Rating and
          Stepper - each with its own docs page, and the{" "}
          <a href="/docs/react-native" className="underline underline-offset-2 hover:text-foreground">
            React Native guide
          </a>{" "}
          lists the whole set in one place.
        </p>
      </Reveal>

      {/* AI prompt */}
      <Reveal delay={0.18} className="mt-12">
        <AiPrompt
          prompt={PLAYGROUND_PROMPT}
          intro="A ready-to-paste brief for a coding agent: it sets up a scratch page wired to the three components this playground demonstrates most."
          filename="playground-prompt.txt"
        />
      </Reveal>
    </div>
  );
}

/**
 * One namespace row. Small lists show inline; long ones collapse behind
 * a native details element so the page stays scannable.
 */
function ImportRow({
  name,
  note,
  items,
}: {
  name: string;
  note: string;
  items: string[];
}) {
  const inline = items.length <= 8;
  return (
    <details className="group px-5 py-4" open={inline ? true : undefined}>
      <summary className="flex cursor-pointer flex-wrap items-center gap-x-3 gap-y-1 list-none [&::-webkit-details-marker]:hidden select-none">
        <span className="font-mono text-[13px] font-medium text-foreground">{name}</span>
        <span className="text-[13px] text-muted-foreground">{note}</span>
        {!inline && (
          <span className="ml-auto flex items-center gap-1 text-[12px] font-medium text-faint transition-colors group-open:text-accent">
            <span className="hidden sm:inline">All {items.length}</span>
            <span className="sm:hidden">{items.length}</span>
            <svg
              aria-hidden="true"
              viewBox="0 0 16 16"
              className="h-3 w-3 transition-transform duration-200 group-open:rotate-180"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 6l4 4 4-4" />
            </svg>
          </span>
        )}
      </summary>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {items.map((item) => (
          <span
            key={item}
            className="rounded-md bg-fill px-2 py-1 font-mono text-[11px] text-muted-foreground"
          >
            {item}
          </span>
        ))}
      </div>
    </details>
  );
}
