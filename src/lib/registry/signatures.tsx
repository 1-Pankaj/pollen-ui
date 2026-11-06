import { Badge, Dock, KineticHeadline, MagneticButton, Odometer, ScrambleText, TiltCard, TicketCard } from "pollen-ui";
import { SlideConfirmDemo, SlideConfirmToneDemo } from "@/components/demos/slide-confirm-demo";
import { PressableDemo } from "@/components/demos/pressable-demo";
import { DockDemo } from "@/components/demos/dock-demo";
import { OdometerDemo } from "@/components/demos/odometer-demo";
import { CompareSliderDemo, CompareSliderHoverDemo } from "@/components/demos/compare-slider-demo";
import {
  IconDeploy,
  IconGauge,
  IconTicket,
} from "pollen-ui";
import type { RegistryEntry } from "./types";

export const signatures: RegistryEntry[] = [
  {
    slug: "magnetic-button",
    title: "Magnetic Button",
    description:
      "A button with gravity. The body leans toward the cursor on a spring, the label leans a little further, and a light sweep crosses on hover.",
    demos: [
      {
        title: "Gravity",
        component: (
          <div className="flex flex-wrap items-center justify-center gap-3">
            <MagneticButton size="lg" shine className="rounded-[14px] bg-foreground text-background hover:bg-foreground/90">
              Get Started
            </MagneticButton>
            <MagneticButton size="lg" strength={0.18} className="rounded-[14px]">
              Softer pull
            </MagneticButton>
          </div>
        ),
        code: `import { MagneticButton } from "pollen-ui";

<MagneticButton size="lg" shine>
  Get Started
</MagneticButton>`,
      },
    ],
    props: [
      { name: "strength", type: "number", default: "0.28", description: "How far the button leans toward the cursor, 0 to 1." },
      { name: "shine", type: "boolean", default: "false", description: "Light sweep across the surface on hover." },
      { name: "variant", type: '"primary" | "secondary" | "outline" | "ghost"', default: '"primary"', description: "Surface treatment." },
      { name: "size", type: '"sm" | "md" | "lg"', default: '"md"', description: "Height and padding." },
    ],
    playground: {
      component: "MagneticButton",
      values: { children: "Get Started", strength: 0.28, shine: true, variant: "primary", size: "lg" },
      controls: [
        { kind: "text", prop: "children", label: "children", placeholder: "Get Started" },
        { kind: "number", prop: "strength", label: "strength", min: 0, max: 1, step: 0.02 },
        { kind: "boolean", prop: "shine", label: "shine" },
        {
          kind: "select",
          prop: "variant",
          label: "variant",
          options: [
            { value: "primary", label: "primary" },
            { value: "secondary", label: "secondary" },
            { value: "outline", label: "outline" },
            { value: "ghost", label: "ghost" },
          ],
        },
        {
          kind: "select",
          prop: "size",
          label: "size",
          options: [
            { value: "sm", label: "sm" },
            { value: "md", label: "md" },
            { value: "lg", label: "lg" },
          ],
        },
      ],
    },
  },
  {
    slug: "dock",
    title: "Dock",
    description:
      "A magnifying launcher bar. Icons bloom under the pointer with neighbor falloff, exactly the physics your finger expects from a tray.",
    demos: [
      {
        title: "Magnification",
        component: (
          <div className="flex w-full max-w-[380px] justify-center rounded-2xl bg-fill/60 py-6">
            <DockDemo size={46} maxScale={1.75} />
          </div>
        ),
        code: `import { Dock, IconDeploy, IconGauge } from "pollen-ui";

<Dock
  size={46}
  items={[
    { label: "Deploy", icon: <IconDeploy /> },
    { label: "Metrics", icon: <IconGauge /> },
  ]}
/>`,
      },
      {
        title: "Pinned left, labels always",
        component: (
          <div className="flex w-full justify-center rounded-2xl bg-fill/60 py-6">
            <Dock
              position="left"
              labelMode="always"
              size={44}
              maxScale={1.4}
              items={[
                { label: "Deploy", icon: <IconDeploy className="h-5 w-5" /> },
                { label: "Metrics", icon: <IconGauge className="h-5 w-5" />, badge: 3 },
                { label: "Ticket", icon: <IconTicket className="h-5 w-5" />, separator: true },
              ]}
            />
          </div>
        ),
        code: `import { Dock } from "pollen-ui";

<Dock
  position="left"
  labelMode="always"
  items={[
    { label: "Deploy", icon: <IconDeploy />, separator: true },
    { label: "Metrics", icon: <IconGauge />, badge: 3 },
  ]}
/>`,
      },
    ],
    props: [
      { name: "items", type: "DockItem[]", default: "-", description: "Label, icon, onClick, an optional badge and a separator flag per slot." },
      { name: "size", type: "number", default: "50", description: "Icon tile size in px at rest." },
      { name: "maxScale", type: "number", default: "1.75", description: "Peak magnification under the pointer." },
      { name: "position", type: '"bottom" | "top" | "left" | "right"', default: '"bottom"', description: "Which edge the dock pins to; changes the magnify axis." },
      { name: "labelMode", type: '"tooltip" | "always"', default: '"tooltip"', description: "Tooltip on hover, or a permanent label under each tile." },
    ],
    playground: {
      component: "Dock",
      values: { items: true, size: 50, maxScale: 1.75, position: "bottom", labelMode: "tooltip" },
      imports: ["IconDeploy", "IconGauge", "IconPackage"],
      controls: [
        {
          kind: "boolean",
          prop: "items",
          label: "items",
          attr: 'items={[{ label: "Deploy", icon: <IconDeploy /> }, { label: "Metrics", icon: <IconGauge />, badge: 3 }, { label: "Files", icon: <IconPackage />, separator: true }]}',
        },
        { kind: "number", prop: "size", label: "size", min: 28, max: 72, step: 2 },
        { kind: "number", prop: "maxScale", label: "maxScale", min: 1, max: 2.5, step: 0.05 },
        {
          kind: "select",
          prop: "position",
          label: "position",
          options: [
            { value: "bottom", label: "bottom" },
            { value: "top", label: "top" },
            { value: "left", label: "left" },
            { value: "right", label: "right" },
          ],
        },
        {
          kind: "select",
          prop: "labelMode",
          label: "labelMode",
          options: [
            { value: "tooltip", label: "tooltip" },
            { value: "always", label: "always" },
          ],
        },
      ],
    },
  },
  {
    slug: "odometer",
    title: "Odometer",
    description:
      "Digits that roll like a mechanical counter. Values spin to their target with a spring settle, so numbers feel physical instead of painted.",
    demos: [
      {
        title: "Rolling digits",
        component: (
          <OdometerDemo />
        ),
        code: `import { Odometer } from "pollen-ui";

<Odometer value={24680} separator="," />`,
      },
      {
        title: "Money, units, compact",
        component: (
          <div className="flex flex-col items-center gap-5 py-4">
            <Odometer value={98421.5} prefix="$" separator="," precision={1} className="text-2xl font-semibold" />
            <div className="flex items-center gap-8">
              <Odometer value={43812} compact className="text-2xl font-semibold" />
              <Odometer value={-12} digits={3} className="text-2xl font-semibold" />
            </div>
          </div>
        ),
        code: `import { Odometer } from "pollen-ui";

<Odometer value={98421.5} prefix="$" separator="," precision={1} />
<Odometer value={43812} compact />
<Odometer value={-12} digits={3} />`,
      },
    ],
    props: [
      { name: "value", type: "number", default: "-", description: "Target value. Changes roll the digits. Negatives roll a sign in." },
      { name: "digits", type: "number", default: "6", description: "Fixed digit count for the integer part, zero padded." },
      { name: "precision", type: "number", default: "0", description: "Decimal places to render." },
      { name: "separator", type: "string", default: "-", description: "Thousands separator, e.g. comma." },
      { name: "prefix / suffix", type: "ReactNode", default: "-", description: "Content before or after the digits, e.g. a currency." },
      { name: "compact", type: "boolean", default: "false", description: "Render 1,234,567 as 1.23M." },
    ],
    playground: {
      component: "Odometer",
      values: { value: 24680, digits: 6, separator: "," },
      controls: [
        { kind: "number", prop: "value", label: "value", min: 0, max: 999999, step: 1 },
        { kind: "number", prop: "digits", label: "digits", min: 1, max: 8, step: 1 },
        { kind: "text", prop: "separator", label: "separator", placeholder: "," },
      ],
    },
  },
  {
    slug: "kinetic-headline",
    title: "Kinetic Headline",
    description:
      "Display text with choreography: words enter on their own trajectories, so a page opener lands like a title card instead of a paragraph.",
    demos: [
      {
        title: "Title card",
        component: (
          <div className="w-full max-w-[420px] py-4 text-center">
            <KineticHeadline as="h3" text="Ship the small details" className="text-3xl font-semibold tracking-[-0.02em]" />
          </div>
        ),
        code: `import { KineticHeadline } from "pollen-ui";

<KineticHeadline
  as="h3"
  text="Ship the small details"
/>`,
      },
      {
        title: "By letter, with highlights",
        component: (
          <div className="w-full max-w-[420px] py-4 text-center">
            <KineticHeadline
              as="h3"
              by="char"
              variant="drop"
              text="Design at speed"
              highlight={["speed"]}
              className="text-3xl font-semibold tracking-[-0.02em]"
            />
          </div>
        ),
        code: `import { KineticHeadline } from "pollen-ui";

<KineticHeadline
  by="char"
  variant="drop"
  text="Design at speed"
  highlight={["speed"]}
/>`,
      },
    ],
    props: [
      { name: "text", type: "string", default: "-", description: "The text to animate, word by word." },
      { name: "as", type: '"h1" | "h2" | "h3" | "p" | "span"', default: '"h2"', description: "Rendered element." },
      { name: "variant", type: "KineticVariant", default: '"rise"', description: "Animation style: rise, blur, flip, scale, slide or drop." },
      { name: "by", type: '"word" | "char"', default: '"word"', description: "Animate whole words or individual letters." },
      { name: "highlight", type: "string[]", default: "-", description: "Words painted in the accent colour as they land." },
      { name: "stagger", type: "number", default: "0.08", description: "Seconds between units. Defaults tighter for char mode." },
    ],
    playground: {
      component: "KineticHeadline",
      values: { text: "Ship the small details", as: "h3", variant: "rise", stagger: 0.06 },
      controls: [
        { kind: "text", prop: "text", label: "text", placeholder: "Headline text" },
        {
          kind: "select",
          prop: "as",
          label: "as",
          options: [
            { value: "h1", label: "h1" },
            { value: "h2", label: "h2" },
            { value: "h3", label: "h3" },
            { value: "h4", label: "h4" },
            { value: "p", label: "p" },
            { value: "span", label: "span" },
          ],
        },
        {
          kind: "select",
          prop: "variant",
          label: "variant",
          options: [
            { value: "rise", label: "rise" },
            { value: "blur", label: "blur" },
            { value: "flip", label: "flip" },
            { value: "scale", label: "scale" },
            { value: "slide", label: "slide" },
            { value: "drop", label: "drop" },
          ],
        },
        {
          kind: "select",
          prop: "by",
          label: "by",
          options: [
            { value: "word", label: "word" },
            { value: "char", label: "char" },
          ],
        },
        { kind: "number", prop: "stagger", label: "stagger", min: 0, max: 0.2, step: 0.01 },
      ],
    },
  },
  {
    slug: "scramble-text",
    title: "Scramble Text",
    description:
      "Text that decodes from noise into its final message. Runs on mount, in view, or on hover, and respects reduced motion by skipping straight to the truth.",
    demos: [
      {
        title: "Decode on hover",
        component: (
          <div className="w-full max-w-[420px] py-4 text-center">
            <ScrambleText
              text="access granted"
              trigger="hover"
              className="font-mono text-lg text-foreground"
            />
          </div>
        ),
        code: `import { ScrambleText } from "pollen-ui";

<ScrambleText
  text="access granted"
  trigger="hover"
  className="font-mono text-lg"
/>`,
      },
      {
        title: "Presets and loop",
        component: (
          <div className="flex w-full max-w-[420px] flex-col items-center gap-4 py-4 text-center">
            <ScrambleText text="0x5F3759DF" preset="hex" trigger="mount" className="font-mono text-lg text-foreground" />
            <ScrambleText text="░▒▓ decoding" preset="blocks" loop={3600} trigger="mount" className="font-mono text-lg text-muted-foreground" />
          </div>
        ),
        code: `import { ScrambleText } from "pollen-ui";

<ScrambleText text="0x5F3759DF" preset="hex" trigger="mount" />
<ScrambleText text="░▒▓ decoding" preset="blocks" loop={3600} />`,
      },
    ],
    props: [
      { name: "text", type: "string", default: "-", description: "Final text to decode into." },
      { name: "charset", type: "string", default: "-", description: "Characters used while scrambling. Beats `preset`." },
      { name: "preset", type: '"latin" | "hex" | "katakana" | "blocks" | "binary"', default: '"latin"', description: "Named character set." },
      { name: "speed", type: "number", default: "32", description: "Milliseconds between frames." },
      { name: "trigger", type: '"mount" | "view" | "hover"', default: '"view"', description: "What starts the effect." },
      { name: "loop", type: "number", default: "-", description: "Ms at the settled text before it re-decodes, forever." },
      { name: "useRealChars", type: "boolean", default: "false", description: "Shuffle the text's own letters instead of foreign glyphs." },
    ],
    playground: {
      component: "ScrambleText",
      values: { text: "access granted", speed: 30, trigger: "hover" },
      controls: [
        { kind: "text", prop: "text", label: "text", placeholder: "access granted" },
        {
          kind: "select",
          prop: "preset",
          label: "preset",
          options: [
            { value: "latin", label: "latin" },
            { value: "hex", label: "hex" },
            { value: "katakana", label: "katakana" },
            { value: "blocks", label: "blocks" },
            { value: "binary", label: "binary" },
          ],
        },
        { kind: "number", prop: "speed", label: "speed", min: 10, max: 100, step: 2 },
        {
          kind: "select",
          prop: "trigger",
          label: "trigger",
          options: [
            { value: "mount", label: "mount" },
            { value: "view", label: "view" },
            { value: "hover", label: "hover" },
          ],
        },
      ],
    },
  },
  {
    slug: "tilt-card",
    title: "Tilt Card",
    description:
      "A surface that meets your pointer in perspective, with an optional glare that travels across it. Depth without a single border.",
    demos: [
      {
        title: "Perspective",
        component: (
          <div className="flex w-full justify-center py-2 [perspective:900px]">
            <TiltCard maxTilt={10} glare className="w-64 rounded-2xl bg-card p-5 shadow-[var(--pollen-shadow-lg)]">
              <p className="text-[13px] font-medium text-muted-foreground">Quarterly report</p>
              <p className="mt-1 text-xl font-semibold tracking-[-0.01em] text-foreground">Spring release</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Forty six components, one stylesheet, zero config.
              </p>
            </TiltCard>
          </div>
        ),
        code: `import { TiltCard } from "pollen-ui";

<TiltCard maxTilt={10} glare className="rounded-2xl bg-card p-5">
  ...
</TiltCard>`,
      },
    ],
    props: [
      { name: "maxTilt", type: "number", default: "9", description: "Maximum rotation in degrees." },
      { name: "scale", type: "number", default: "1.015", description: "Hover scale. 1 disables." },
      { name: "glare", type: "boolean", default: "true", description: "Moving light that follows the pointer." },
      { name: "glareColor", type: "string", default: '"255, 255, 255"', description: "Glare tint: an rgb triplet or any hex." },
      { name: "axis", type: '"both" | "x" | "y"', default: '"both"', description: "Which axes rotate." },
      { name: "invert", type: "boolean", default: "false", description: "Lean away from the pointer instead of toward it." },
      { name: "spring", type: '"soft" | "snappy" | "gentle"', default: '"soft"', description: "How the card settles." },
      { name: "elevate", type: "boolean", default: "false", description: "Raise the shadow while hovered." },
    ],
    playground: {
      component: "TiltCard",
      values: { maxTilt: 10, glare: true, axis: "both", spring: "soft", children: "Spring release" },
      controls: [
        { kind: "number", prop: "maxTilt", label: "maxTilt", min: 0, max: 30, step: 1 },
        { kind: "boolean", prop: "glare", label: "glare" },
        {
          kind: "select",
          prop: "axis",
          label: "axis",
          options: [
            { value: "both", label: "both" },
            { value: "x", label: "x" },
            { value: "y", label: "y" },
          ],
        },
        {
          kind: "select",
          prop: "spring",
          label: "spring",
          options: [
            { value: "soft", label: "soft" },
            { value: "snappy", label: "snappy" },
            { value: "gentle", label: "gentle" },
          ],
        },
        { kind: "text", prop: "children", label: "children", placeholder: "Card content" },
      ],
    },
  },
  {
    slug: "ticket-card",
    title: "Ticket Card",
    description:
      "A card die-cut like a real ticket: punched side notches and a dashed perforation with a detachable stub. Bookings, raffles, event rows.",
    demos: [
      {
        title: "Admit one",
        component: (
          <div className="flex w-full justify-center">
            <TicketCard
              className="w-72 bg-card p-5 shadow-[var(--pollen-shadow-md)]"
              stub={
                <div className="flex h-full w-16 flex-col items-center justify-center gap-1.5">
                  <IconTicket className="h-5 w-5 text-accent" />
                  <span className="font-mono text-[11px] text-faint">0042</span>
                </div>
              }
            >
              <Badge variant="accent">Tonight</Badge>
              <p className="mt-2 text-lg font-semibold tracking-[-0.01em] text-foreground">
                Night Bloom Society
              </p>
              <p className="mt-1 text-sm text-muted-foreground">Table for two, doors 19:30</p>
            </TicketCard>
          </div>
        ),
        code: `import { TicketCard } from "pollen-ui";

<TicketCard stub={<span>No. 0042</span>}>
  <h4>Night Bloom Society</h4>
  <p>Table for two</p>
</TicketCard>`,
      },
      {
        title: "Vertical, accent edge",
        component: (
          <div className="flex w-full justify-center">
            <TicketCard
              orientation="vertical"
              accentEdge
              size="sm"
              className="w-64 bg-card shadow-[var(--pollen-shadow-md)]"
              stub={
                <span className="flex items-center gap-2 font-mono text-[11px] text-faint">
                  <IconTicket className="h-4 w-4 text-accent" />
                  GATE 4 · 19:30
                </span>
              }
            >
              <Badge variant="success" size="sm" dot>Boarding</Badge>
              <p className="mt-2 text-[15px] font-semibold tracking-[-0.01em] text-foreground">
                Night Bloom Society
              </p>
              <p className="mt-0.5 text-[13px] text-muted-foreground">Table for two, Mezzanine</p>
            </TicketCard>
          </div>
        ),
        code: `import { TicketCard } from "pollen-ui";

<TicketCard
  orientation="vertical"
  accentEdge
  stub={<span>Gate 4 · 19:30</span>}
>
  <h4>Night Bloom Society</h4>
</TicketCard>`,
      },
    ],
    props: [
      { name: "children", type: "ReactNode", default: "-", description: "Main content area." },
      { name: "stub", type: "ReactNode", default: "-", description: "Detached stub after the perforation." },
      { name: "perforated", type: "boolean", default: "true", description: "Show the dashed tear line." },
      { name: "orientation", type: '"horizontal" | "vertical"', default: '"horizontal"', description: "Stub to the right, or stacked underneath." },
      { name: "notch", type: '"both" | "left" | "right" | "none"', default: '"both"', description: "Which edges get the punched notch." },
      { name: "accentEdge", type: "boolean", default: "false", description: "Quiet accent strip along the leading edge." },
      { name: "size", type: '"sm" | "md" | "lg"', default: '"md"', description: "Content density." },
    ],
    playground: {
      component: "TicketCard",
      values: { children: "Night Bloom Society", stub: true, perforated: true, orientation: "horizontal", accentEdge: false, size: "md" },
      controls: [
        { kind: "text", prop: "children", label: "children", placeholder: "Night Bloom Society" },
        { kind: "boolean", prop: "stub", label: "stub", attr: 'stub={<span className="font-mono text-xs">No. 0042</span>}' },
        { kind: "boolean", prop: "perforated", label: "perforated" },
        {
          kind: "select",
          prop: "orientation",
          label: "orientation",
          options: [
            { value: "horizontal", label: "horizontal" },
            { value: "vertical", label: "vertical" },
          ],
        },
        { kind: "boolean", prop: "accentEdge", label: "accentEdge" },
        {
          kind: "select",
          prop: "size",
          label: "size",
          options: [
            { value: "sm", label: "sm" },
            { value: "md", label: "md" },
            { value: "lg", label: "lg" },
          ],
        },
      ],
    },
  },
  {
    slug: "slide-to-confirm",
    title: "Slide to Confirm",
    description:
      "The gesture that makes destructive or expensive actions feel deliberate. Drag the handle (or press Enter, or walk it there with arrow keys), watch the track fill, the spinner take over while your promise runs, then the check land and the control reset itself.",
    demos: [
      {
        title: "Deliberate actions",
        align: "stretch",
        component: (
          <SlideConfirmDemo />
        ),
        code: `import { SlideToConfirm, toast } from "pollen-ui";

<SlideToConfirm
  label="Slide to confirm"
  onConfirm={async () => {
    await deleteProject(id);
    toast.success("pollen-web deleted");
  }}
/>`,
      },
      {
        title: "Destructive red",
        align: "stretch",
        component: (
          <div className="flex w-full max-w-sm flex-col items-center gap-4 py-2">
            <SlideConfirmToneDemo />
          </div>
        ),
        code: `import { SlideToConfirm, toast } from "pollen-ui";

<SlideToConfirm
  tone="danger"
  label="Slide to delete"
  successLabel="Deleted"
  onConfirm={() => toast.success("Project deleted")}
/>`,
      },
    ],
    props: [
      { name: "onConfirm", type: "() => void | Promise<void>", default: "-", description: "Fires when the handle clears the threshold. A promise keeps the spinner up." },
      { name: "label", type: "string", default: '"Slide to confirm"', description: "Track label, fades as the handle covers it." },
      { name: "successLabel", type: "string", default: '"Confirmed"', description: "Label shown after success." },
      { name: "autoReset", type: "number", default: "2600", description: "Ms before the control resets. 0 keeps the success state." },
      { name: "size", type: '"sm" | "md" | "lg"', default: '"md"', description: "Track and handle height." },
      { name: "tone", type: '"accent" | "danger" | "success"', default: '"accent"', description: "Fill and success colour. danger for delete gestures." },
      { name: "icon", type: "ReactNode", default: "-", description: "Replace the idle handle glyph." },
      { name: "disabled", type: "boolean", default: "false", description: "Locks the gesture." },
    ],
    playground: {
      component: "SlideToConfirm",
      values: { label: "Slide to confirm", size: "md", disabled: false },
      controls: [
        { kind: "text", prop: "label", label: "label", placeholder: "Slide to confirm" },
        {
          kind: "select",
          prop: "tone",
          label: "tone",
          options: [
            { value: "accent", label: "accent" },
            { value: "danger", label: "danger" },
            { value: "success", label: "success" },
          ],
        },
        {
          kind: "select",
          prop: "size",
          label: "size",
          options: [
            { value: "sm", label: "sm" },
            { value: "md", label: "md" },
            { value: "lg", label: "lg" },
          ],
        },
        { kind: "boolean", prop: "disabled", label: "disabled" },
      ],
    },
  },
  {
    slug: "pressable-card",
    title: "Pressable Card",
    description:
      "An interactive block with real physicality: the surface tilts toward the cursor on springs, a soft light tracks the pointer, and pressing compresses the card into its own shadow. It springs back with a little overshoot.",
    demos: [
      {
        title: "Blocks you can push",
        component: (
          <PressableDemo />
        ),
        code: `import { PressableCard, toast } from "pollen-ui";

<PressableCard depth="md" onClick={() => toast.success("Pressed")}>
  <h4>Deployments</h4>
  <p>Press it. It compresses into its own shadow.</p>
</PressableCard>`,
      },
    ],
    props: [
      { name: "variant", type: '"raised" | "flat" | "outline"', default: '"raised"', description: "Surface treatment." },
      { name: "tilt", type: "boolean", default: "true", description: "Tilt toward the cursor on springs." },
      { name: "spotlight", type: "boolean", default: "true", description: "Soft light that tracks the pointer." },
      { name: "depth", type: '"sm" | "md" | "lg"', default: '"md"', description: "Shadow scale at rest and on hover." },
      { name: "maxTilt", type: "number", default: "5", description: "Max tilt in degrees." },
      { name: "lift", type: "boolean", default: "true", description: "Hover lift. Off keeps the card anchored." },
      { name: "borderGlow", type: "boolean", default: "false", description: "Accent ring that lights the border under the pointer." },
      { name: "onClick", type: "() => void", default: "-", description: "Makes the block pressable." },
      { name: "href", type: "string", default: "-", description: "Renders as a link." },
    ],
    playground: {
      component: "PressableCard",
      values: { children: "Press me", tilt: true, spotlight: true, depth: "md", variant: "raised", borderGlow: false },
      controls: [
        { kind: "text", prop: "children", label: "children", placeholder: "Press me" },
        {
          kind: "select",
          prop: "variant",
          label: "variant",
          options: [
            { value: "raised", label: "raised" },
            { value: "flat", label: "flat" },
            { value: "outline", label: "outline" },
          ],
        },
        { kind: "boolean", prop: "borderGlow", label: "borderGlow" },
        { kind: "boolean", prop: "tilt", label: "tilt" },
        { kind: "boolean", prop: "spotlight", label: "spotlight" },
        {
          kind: "select",
          prop: "depth",
          label: "depth",
          options: [
            { value: "sm", label: "sm" },
            { value: "md", label: "md" },
            { value: "lg", label: "lg" },
          ],
        },
      ],
    },
  },
  {
    slug: "compare-slider",
    title: "Compare Slider",
    description:
      "Before and after in one frame, with a divider you drag between them. The divider is a real slider - arrow keys, Home and End, a spoken percentage - and the frame keeps vertical scrolling alive under a touch. Hover mode follows the mouse with no press for fast scanning.",
    demos: [
      {
        title: "Photo retouch",
        component: <CompareSliderDemo />,
        code: `import { CompareSlider } from "pollen-ui";

<CompareSlider
  className="h-[280px] w-full max-w-[420px] rounded-2xl ring-1 ring-[var(--pollen-border)]"
  before={
    <img
      src="/avatars/grace.jpg"
      alt="Before: the portrait in grayscale"
      className="h-full w-full object-cover grayscale brightness-90"
      draggable={false}
    />
  }
  after={
    <img
      src="/avatars/grace.jpg"
      alt="After: the portrait in full color"
      className="h-full w-full object-cover"
      draggable={false}
    />
  }
/>`,
      },
      {
        title: "Hover mode over UI states",
        component: <CompareSliderHoverDemo />,
        code: `import { CompareSlider } from "pollen-ui";

// The layers are not limited to images: a flat wireframe
// against the themed build of the same screen.
function WireframeCard() {
  return (
    <div className="flex h-40 flex-col justify-between bg-fill p-4">
      <div className="h-3 w-1/3 rounded-full bg-fill-strong" />
      <div className="space-y-1.5">
        <div className="h-2 w-full rounded-full bg-fill-strong" />
        <div className="h-2 w-4/5 rounded-full bg-fill-strong" />
      </div>
      <div className="flex gap-1.5">
        <div className="h-6 w-16 rounded-md bg-fill-strong" />
        <div className="h-6 w-16 rounded-md bg-fill-strong" />
      </div>
    </div>
  );
}

function ThemedCard() {
  return (
    <div className="flex h-40 flex-col justify-between bg-card p-4">
      <p className="text-sm font-medium text-foreground">Relay dashboard</p>
      <div className="space-y-1.5 text-[13px] text-muted-foreground">
        <p>Deploys are green across every region.</p>
        <p>Queue depth is back under the alert line.</p>
      </div>
      <div className="flex gap-1.5">
        <span className="rounded-md bg-[var(--pollen-accent)] px-2.5 py-1 text-xs font-medium text-white">Ship</span>
        <span className="rounded-md bg-fill px-2.5 py-1 text-xs font-medium text-muted-foreground">Rollback</span>
      </div>
    </div>
  );
}

<CompareSlider
  mode="hover"
  defaultValue={35}
  before={<WireframeCard />}
  after={<ThemedCard />}
  ariaLabel="Divider between the flat wireframe and the themed card"
/>`,
      },
    ],
    keyboard: [
      { keys: "Arrow Right / Arrow Left", action: "Move the divider one step. Shift takes four steps." },
      { keys: "Home / End", action: "Show only the before layer, or only the after layer." },
    ],
    props: [
      { name: "before", type: "ReactNode", description: "The layer underneath. Keep its own alt text - both layers stay in the reading order." },
      { name: "after", type: "ReactNode", description: "The layer revealed on top of the divider." },
      { name: "value", type: "number", description: "Controlled divider position, in percent from the left edge." },
      { name: "defaultValue", type: "number", default: "50", description: "Initial position." },
      { name: "mode", type: '"drag" | "hover"', default: '"drag"', description: "hover follows a mouse with no press; touch always drags." },
      { name: "step", type: "number", default: "5", description: "Keyboard step in percent." },
      { name: "ariaLabel", type: "string", default: '"Divider position"', description: "Accessible name for the divider." },
      { name: "onValueChange", type: "(value: number) => void", description: "Called while dragging or stepping." },
    ],
    playground: {
      component: "CompareSlider",
      values: { defaultValue: 50, step: 5, mode: "drag" },
      controls: [
        { kind: "number", prop: "defaultValue", label: "defaultValue" },
        { kind: "number", prop: "step", label: "step", min: 1, max: 20, step: 1 },
        {
          kind: "select",
          prop: "mode",
          label: "mode",
          options: [
            { value: "drag", label: "drag" },
            { value: "hover", label: "hover" },
          ],
        },
      ],
    },
  },

];
