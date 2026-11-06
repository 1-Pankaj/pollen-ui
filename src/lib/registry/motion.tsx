import { Reveal, TextReveal, Marquee, ScrollProgress, Parallax } from "pollen-ui";
import { ScrollProgressPaneDemo } from "@/components/demos/scroll-progress-demo";
import type { RegistryEntry } from "./types";

const names = [
  "Button", "Input", "Select", "Switch", "Tabs", "Tooltip", "Modal",
  "Toast", "Command", "Accordion", "Avatar", "Table", "Slider", "Progress",
];

export const motionEntries: RegistryEntry[] = [
  {
    slug: "reveal",
    title: "Reveal",
    description:
      "Fades content up as it scrolls into view. Runs once, uses ease-out, and stays a pure fade for reduced motion users.",
    demos: [
      {
        title: "Basic",
        component: (
          <Reveal className="w-full max-w-[340px]">
            <div className="rounded-xl bg-card p-5 text-sm text-muted-foreground shadow-[var(--pollen-shadow-sm)]">
              This block faded up 14 pixels when it entered the viewport,
              over 550 milliseconds.
            </div>
          </Reveal>
        ),
        code: `import { Reveal } from "pollen-ui";

<Reveal>
  <div className="rounded-xl bg-card p-5 shadow-[var(--pollen-shadow-sm)]">...</div>
</Reveal>`,
      },
    ],
    props: [
      { name: "delay", type: "number", default: "0", description: "Seconds to wait before starting." },
      { name: "y", type: "number", default: "14", description: "Starting offset in pixels." },
      { name: "once", type: "boolean", default: "true", description: "Animate only the first time." },
    ],
    playground: {
      component: "Reveal",
      values: { delay: 0, y: 14, once: true, children: "This block faded up when it entered the viewport." },
      controls: [
        { kind: "number", prop: "delay", label: "delay", min: 0, max: 2, step: 0.1 },
        { kind: "number", prop: "y", label: "y", min: 0, max: 40, step: 1 },
        { kind: "boolean", prop: "once", label: "once" },
        { kind: "text", prop: "children", label: "children", placeholder: "Content to reveal" },
      ],
    },
  },
  {
    slug: "text-reveal",
    title: "Text Reveal",
    description:
      "A headline entrance, word by word: each word rises out of a soft blur. The signature move of modern marketing pages, tuned to finish in under a second.",
    demos: [
      {
        title: "Headline",
        component: (
          <TextReveal
            text="Ship interfaces that feel considered."
            className="text-2xl font-semibold tracking-tight text-foreground"
          />
        ),
        code: `import { TextReveal } from "pollen-ui";

<TextReveal
  text="Ship interfaces that feel considered."
  className="text-2xl font-semibold tracking-tight"
/>`,
      },
    ],
    props: [
      { name: "text", type: "string", description: "The words to reveal." },
      { name: "stagger", type: "number", default: "0.055", description: "Seconds between words." },
      { name: "delay", type: "number", default: "0", description: "Seconds before the first word." },
    ],
    playground: {
      component: "TextReveal",
      values: { text: "Ship interfaces that feel considered.", stagger: 0.055, delay: 0 },
      controls: [
        { kind: "text", prop: "text", label: "text", placeholder: "Words to reveal" },
        { kind: "number", prop: "stagger", label: "stagger", min: 0, max: 0.2, step: 0.005 },
        { kind: "number", prop: "delay", label: "delay", min: 0, max: 2, step: 0.1 },
      ],
    },
  },
  {
    slug: "marquee",
    title: "Marquee",
    description:
      "An infinite ticker for lists that repeat: names, tags, sponsors. Content is duplicated for a continuous loop and the edges fade out.",
    demos: [
      {
        title: "Component ticker",
        component: (
          <Marquee duration={22} className="w-full max-w-[420px]">
            {names.map((name) => (
              <span
                key={name}
                className="mx-1.5 rounded-full bg-fill px-4 py-2 text-sm text-muted-foreground"
              >
                {name}
              </span>
            ))}
          </Marquee>
        ),
        code: `import { Marquee } from "pollen-ui";

const names = [
  "Button", "Input", "Select", "Switch", "Tabs", "Tooltip", "Modal",
  "Toast", "Command", "Accordion", "Avatar", "Table", "Slider", "Progress",
];

<Marquee duration={22}>
  {names.map((name) => (
    <span key={name} className="mx-1.5 rounded-full bg-fill px-4 py-2 text-sm">
      {name}
    </span>
  ))}
</Marquee>`,
      },
    ],
    props: [
      { name: "duration", type: "number", default: "30", description: "Seconds for one loop." },
      { name: "reverse", type: "boolean", default: "false", description: "Run the loop backwards." },
      { name: "pauseOnHover", type: "boolean", default: "true", description: "Pause while the pointer is over it." },
    ],
    playground: {
      component: "Marquee",
      values: { duration: 22, reverse: false, pauseOnHover: true, children: "Ship interfaces that feel considered" },
      controls: [
        { kind: "number", prop: "duration", label: "duration", min: 5, max: 60, step: 1 },
        { kind: "boolean", prop: "reverse", label: "reverse" },
        { kind: "boolean", prop: "pauseOnHover", label: "pauseOnHover" },
        { kind: "text", prop: "children", label: "children", placeholder: "Ticker content" },
      ],
    },
  },
  {
    slug: "scroll-progress",
    title: "Scroll Progress",
    description:
      "A two pixel bar that fills as its surface scrolls. Fixed to the viewport by default - it is active on this page right now - or bound to any scrollable pane with a target ref. Springy, so fast scrolling never stutters.",
    demos: [
      {
        title: "Bound to a pane",
        component: (
          <ScrollProgressPaneDemo />
        ),
        code: `import { useRef } from "react";
import { ScrollProgress } from "pollen-ui";

const paneRef = useRef<HTMLDivElement>(null);

<div className="relative overflow-hidden rounded-2xl bg-card">
  <ScrollProgress
    target={paneRef}
    className="absolute inset-x-0 top-0 h-[2px] origin-left bg-accent"
  />
  <div ref={paneRef} className="h-44 overflow-y-auto">
    {/* scrollable content */}
  </div>
</div>`,
      },
      {
        title: "Anchored to the page",
        component: (
          <div className="flex flex-col items-center gap-3 py-2 text-center">
            <ScrollProgress />
            <p className="max-w-[340px] text-[13.5px] leading-relaxed text-muted-foreground">
              A bare <span className="font-mono text-[12.5px]">&lt;ScrollProgress /&gt;</span> pins
              itself to the top of the viewport. Scroll this page and
              watch the very top edge - that bar is this component,
              live.
            </p>
          </div>
        ),
        code: `import { ScrollProgress } from "pollen-ui";

// Place it once, near the root:
<ScrollProgress />`,
      },
    ],
    props: [
      { name: "target", type: "RefObject<HTMLElement>", default: "-", description: "Bind the bar to a scrollable container instead of the viewport. Renders absolutely at its top edge." },
      { name: "className", type: "string", default: "fixed 2px bar", description: "Override the bar's own classes - color, height, position." },
    ],
    playground: {
      component: "ScrollProgress",
      values: { className: "bg-accent" },
      controls: [
        { kind: "text", prop: "className", label: "className", placeholder: "bg-accent" },
      ],
    },
  },
  {
    slug: "parallax",
    title: "Parallax",
    description:
      "Scroll-linked drift on any axis, with optional rotation and scale layered on the same scrubbed progress. The movement tracks the scrollbar 1:1 and reverses cleanly. Great for hero panels and floating cards.",
    demos: [
      {
        title: "Drifting panel",
        component: (
          <div className="relative h-64 w-full max-w-[420px] overflow-hidden rounded-2xl bg-fill/40">
            <Parallax speed={0.1} className="absolute inset-0 flex items-center">
              <div className="ml-6 rounded-xl bg-card px-5 py-3 text-sm shadow-[var(--pollen-shadow-md)]">
                Scroll the page and watch this drift
              </div>
            </Parallax>
            <span className="absolute bottom-3 left-6 text-xs text-faint">
              speed 0.1, scrubbed
            </span>
          </div>
        ),
        code: `import { Parallax } from "pollen-ui";

<Parallax speed={0.1}>
  <div className="rounded-xl bg-card px-5 py-3 text-sm shadow-[var(--pollen-shadow-sm)]">
    Scroll the page and watch this drift
  </div>
</Parallax>`,
      },
      {
        title: "Drift, rotate and scale",
        component: (
          <div className="relative h-72 w-full max-w-[460px] overflow-hidden rounded-2xl bg-fill/40">
            <Parallax
              speed={0.16}
              rotate={5}
              scale={0.12}
              className="absolute inset-0 flex items-center"
            >
              <div className="rounded-2xl bg-card px-6 py-4 shadow-[var(--pollen-shadow-lg)] ring-1 ring-[var(--pollen-border)]">
                <p className="text-sm font-medium text-foreground">Depth in three axes</p>
                <p className="mt-1 text-[13px] text-muted-foreground">
                  Drift 0.16 - rotate 5° - scale 0.12
                </p>
              </div>
            </Parallax>
            <Parallax
              speed={-0.06}
              axis="x"
              className="absolute inset-0 flex items-center"
            >
              <div className="ml-auto mr-6 rounded-xl bg-card/80 px-4 py-2 text-[12.5px] text-muted-foreground shadow-[var(--pollen-shadow-sm)]">
                opposite way, sideways
              </div>
            </Parallax>
            <span className="absolute bottom-3 left-6 text-xs text-faint">
              negative speed reverses - axis x slides sideways
            </span>
          </div>
        ),
        code: `import { Parallax } from "pollen-ui";

<Parallax speed={0.16} rotate={5} scale={0.12}>
  <div className="rounded-2xl bg-card px-6 py-4 shadow-md">{\/* front layer *\/}</div>
</Parallax>

<Parallax speed={-0.06} axis="x">
  <div>{\/* back layer, sideways, opposite direction *\/}</div>
</Parallax>`,
      },
    ],
    props: [
      { name: "speed", type: "number", default: "0.12", description: "Drift as a fraction of viewport height. Negative reverses." },
      { name: "axis", type: "\"y\" | \"x\"", default: "\"y\"", description: "Drift vertically (default) or horizontally." },
      { name: "rotate", type: "number", default: "0", description: "Extra degrees across the visible range, through 0 at centre." },
      { name: "scale", type: "number", default: "0", description: "Extra scale across the range. 0.1 scales 0.9 to 1.1." },
      { name: "disabled", type: "boolean", default: "false", description: "Turn the effect off without unmounting. Reduced motion disables it automatically." },
    ],
    playground: {
      component: "Parallax",
      values: { speed: 0.12, axis: "y", rotate: 0, scale: 0, disabled: false, children: "Scroll the page and watch this drift" },
      controls: [
        { kind: "number", prop: "speed", label: "speed", min: -0.3, max: 0.5, step: 0.02 },
        { kind: "select", prop: "axis", label: "axis", options: [{ value: "y", label: "y" }, { value: "x", label: "x" }] },
        { kind: "number", prop: "rotate", label: "rotate", min: -20, max: 20, step: 1 },
        { kind: "number", prop: "scale", label: "scale", min: 0, max: 0.3, step: 0.02 },
        { kind: "boolean", prop: "disabled", label: "disabled" },
        { kind: "text", prop: "children", label: "children", placeholder: "Drifting content" },
      ],
    },
  },
];
