import type { Metadata } from "next";
import Link from "next/link";
import {
  IconArrowRight as ArrowRight,
} from "pollen-ui";
import { CodeBlock, Reveal } from "pollen-ui";
import { DemoBlock } from "@/components/site/demo-block";

export const metadata: Metadata = {
  title: "Introduction",
  description:
    "Pollen UI is an open source React component library for Next.js, with light and dark themes and motion that feels physical.",
};

const installCode = `npm install pollen-ui`;

const setupCode = `// app/layout.tsx
import "pollen-ui/styles.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}`;

const usageCode = `import { Button } from "pollen-ui";

export default function Page() {
  return <Button>Ship it</Button>;
}`;

const tailwindCode = `/* app/globals.css */
@import "tailwindcss";
@import "pollen-ui/styles.css";
@import "pollen-ui/theme.css";
@source "../node_modules/pollen-ui/dist";`;

const families = [
  {
    name: "Primitives",
    href: "/docs/button",
    description:
      "Buttons, inputs, selects, checkboxes, sliders, OTP fields — the controls every form is made of.",
    items:
      "Button, Badge, Input, Textarea, Label, Select, Combobox, Checkbox, Radio Group, Switch, Slider, Rating, Tag Input, Toggle Group, OTP Input, Pagination",
    count: 16,
  },
  {
    name: "Overlays",
    href: "/docs/modal",
    description:
      "Portaled, focus-managed, escape-to-close. Every floating layer flips and clamps to the viewport.",
    items:
      "Modal, Drawer, Popover, Tooltip, Dropdown Menu, Context Menu, Command, Toast, Toast Pile",
    count: 9,
  },
  {
    name: "Display",
    href: "/docs/tabs",
    description:
      "Structure and feedback for pages: navigation, tables, steps, stats and empty states.",
    items:
      "Tabs, Breadcrumb, Accordion, Avatar, Alert, Skeleton, Spinner, Progress, Progress Ring, Kbd, Table, Card, Code Block, Segmented Control, Steps, Timeline, Stat, Empty State",
    count: 18,
  },
  {
    name: "Motion",
    href: "/docs/reveal",
    description:
      "Scroll-linked and entrance motion that obeys prefers-reduced-motion everywhere.",
    items: "Reveal, Text Reveal, Marquee, Scroll Progress, Parallax, Number Ticker, Typewriter",
    count: 7,
  },
  {
    name: "Signatures",
    href: "/docs/dock",
    description:
      "The pieces you will not find pasted from tutorials — the ones that make the library recognizable.",
    items:
      "Dock, Kinetic Headline, Magnetic Button, Odometer, Scramble Text, Slide to Confirm, Chat, Pressable Card, Tilt Card, Ticket Card",
    count: 10,
  },
];

export default function DocsIntroPage() {
  return (
    <article className="max-w-2xl">
      <h1 className="text-4xl font-semibold tracking-tight">Introduction</h1>
      <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
        Pollen UI is an open source React component library for Next.js.
        Careful typography, motion built on springs, and light and
        dark themes out of the box. The kind of foundation you stop
        thinking about after the first week.
      </p>

      <Reveal className="mt-12">
        <h2 className="text-2xl font-semibold tracking-tight">Quick start</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Three steps and you are rendering components. The full
          walkthrough, including Tailwind setup, lives on the{" "}
          <Link
            href="/docs/installation"
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            Installation
          </Link>{" "}
          page.
        </p>

        <ol className="mt-6 space-y-5">
          <li className="space-y-3">
            <p className="text-sm font-medium text-foreground">
              1. Install the package
            </p>
            <CodeBlock filename="terminal" language="bash" code={installCode} />
          </li>
          <li className="space-y-3">
            <p className="text-sm font-medium text-foreground">
              2. Import the stylesheet
            </p>
            <CodeBlock filename="app/layout.tsx" language="tsx" code={setupCode} />
          </li>
          <li className="space-y-3">
            <p className="text-sm font-medium text-foreground">
              3. Use a component
            </p>
            <CodeBlock filename="app/page.tsx" language="tsx" code={usageCode} />
          </li>
        </ol>
      </Reveal>

      <Reveal className="mt-12">
        <h2 className="text-2xl font-semibold tracking-tight">Tailwind setup</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Pollen UI styles its components with Tailwind utilities. Add the
          package to your Tailwind sources so its classes get compiled:
        </p>
        <div className="mt-6">
          <CodeBlock filename="globals.css" language="css" code={tailwindCode} />
        </div>
      </Reveal>

      <Reveal className="mt-12">
        <h2 className="text-2xl font-semibold tracking-tight">What is inside</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Sixty components in five families, 103 hand-drawn icons, and 229
          value exports. Every component is documented with a live demo, a
          props table and a playground.
        </p>
        <div className="mt-6 space-y-3">
          {families.map((family) => (
            <Link
              key={family.name}
              href={family.href}
              className="block rounded-[12px] bg-card p-4 shadow-[var(--pollen-shadow-xs)] transition-shadow hover:shadow-[var(--pollen-shadow-sm)]"
            >
              <div className="flex items-baseline justify-between gap-4">
                <span className="text-sm font-medium text-foreground">
                  {family.name}
                </span>
                <span className="font-mono text-xs text-muted-foreground">
                  {family.count}
                </span>
              </div>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                {family.description}
              </p>
              <p className="mt-2 text-xs leading-relaxed text-fg-faint">
                {family.items}
              </p>
            </Link>
          ))}
        </div>
      </Reveal>

      <Reveal className="mt-12">
        <h2 className="text-2xl font-semibold tracking-tight">Principles</h2>
        <ul className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground">
          <li>
            <span className="font-medium text-foreground">Achromatic by default.</span>{" "}
            Near-black text, white surfaces, soft shadows. Blue appears
            only where it carries meaning: links, focus, and system state.
          </li>
          <li>
            <span className="font-medium text-foreground">Motion under 300ms.</span>{" "}
            Ease-out for entrances, springs for things you can interrupt,
            and nothing animates from zero scale.
          </li>
          <li>
            <span className="font-medium text-foreground">Documentation sizing.</span>{" "}
            Buttons are 44 pixels tall, body text is 15 to 16 pixels, and
            touch targets stay generous. Everything is sized for real hands
            and real screens.
          </li>
          <li>
            <span className="font-medium text-foreground">Open source.</span>{" "}
            MIT licensed. The source of every component is readable, and
            every token is a CSS variable you can override.
          </li>
        </ul>
      </Reveal>

      <Reveal className="mt-12">
        <div className="flex flex-wrap gap-3">
          <Link
            href="/docs/installation"
            className="inline-flex h-11 items-center gap-1.5 rounded-[10px] bg-foreground px-5 text-[15px] font-medium text-background shadow-[var(--pollen-shadow-xs)] transition-[opacity,transform] duration-150 hover:opacity-90 active:scale-[0.98]"
          >
            Installation <ArrowRight className="h-3.5 w-3.5" />
          </Link>
          <Link
            href="/docs/button"
            className="inline-flex h-11 items-center gap-1.5 rounded-[10px] bg-card px-5 text-[15px] font-medium text-foreground shadow-[var(--pollen-shadow-sm)] transition-[background-color,transform] duration-150 hover:bg-fill active:scale-[0.98]"
          >
            Browse components
          </Link>
        </div>
      </Reveal>
    </article>
  );
}
