import {
  IconSettings as Settings,
  IconSearch as Search,
  IconMail as Mail,
  IconArrowRight as ArrowRight,
  IconDeploy as Rocket,
} from "pollen-ui";
import {
  Badge,
  Button,
  Checkbox,
  Input,
  Label,
  OTPInput,
  Radio,
  RadioGroup,
  Select,
  Slider,
  Switch,
  Textarea,
  ToggleGroup,
  ToggleGroupItem,
} from "pollen-ui";
import { SliderDemo } from "@/components/demos/slider-demo";
import { SliderFormatDemo } from "@/components/demos/slider-format-demo";
import { OTPInputDemo } from "@/components/demos/otp-demo";
import { KnobBasicDemo, KnobVariantsDemo } from "@/components/demos/knob-demo";
import { StepperDemo } from "@/components/demos/stepper-demo";
import type { RegistryEntry } from "./types";

export const primitives: RegistryEntry[] = [
  {
    slug: "button",
    title: "Button",
    description:
      "Triggers an action. Seven variants, three sizes, a loading state, and a press that scales to 0.98 so the button answers your finger.",
    demos: [
      {
        title: "Variants",
        component: (
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            <Button>Primary</Button>
            <Button variant="accent">Accent</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="link">Learn more</Button>
            <Button variant="destructive">Delete</Button>
          </div>
        ),
        code: `import { Button } from "pollen-ui";

export default function Page() {
  return (
    <div className="flex flex-wrap gap-2.5">
      <Button>Primary</Button>
      <Button variant="accent">Accent</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Learn more</Button>
      <Button variant="destructive">Delete</Button>
    </div>
  );
}`,
      },
      {
        title: "Sizes",
        component: (
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Large</Button>
            <Button size="icon" variant="outline" aria-label="Settings">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        ),
        code: `import { Button, IconSettings } from "pollen-ui";

export default function Page() {
  return (
    <div className="flex flex-wrap gap-2.5">
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
      <Button size="icon" variant="outline" aria-label="Settings">
        <IconSettings className="h-4 w-4" />
      </Button>
    </div>
  );
}`,
      },
      {
        title: "Loading and disabled",
        component: (
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            <Button loading loadingText="Deploying">
              Deploy
            </Button>
            <Button variant="secondary" disabled>
              Disabled
            </Button>
          </div>
        ),
        code: `<Button loading loadingText="Deploying">Deploy</Button>
<Button variant="secondary" disabled>Disabled</Button>`,
      },
      {
        title: "Icons",
        component: (
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            <Button leftIcon={<Rocket />}>Deploy project</Button>
            <Button variant="secondary" rightIcon={<ArrowRight />}>
              Continue
            </Button>
            <Button variant="outline" size="sm" leftIcon={<Settings />}>
              Settings
            </Button>
          </div>
        ),
        code: `<Button leftIcon={<IconDeploy />}>Deploy project</Button>
<Button variant="secondary" rightIcon={<IconArrowRight />}>Continue</Button>
<Button variant="outline" size="sm" leftIcon={<IconSettings />}>Settings</Button>`,
      },
    ],
    props: [
      { name: "variant", type: '"primary" | "accent" | "secondary" | "outline" | "ghost" | "link" | "destructive"', default: '"primary"', description: "Visual weight of the button. Accent is the brand blue." },
      { name: "size", type: '"sm" | "md" | "lg" | "icon"', default: '"md"', description: "Height and padding. icon renders a square." },
      { name: "loading", type: "boolean", default: "false", description: "Shows a spinner and disables interaction." },
      { name: "loadingText", type: "string", description: "Swaps the label while loading." },
      { name: "leftIcon / rightIcon", type: "ReactNode", description: "Icon slots, sized to the button. The right icon nudges on hover." },
      { name: "fullWidth", type: "boolean", default: "false", description: "Stretches the button to fill its container." },
      { name: "disabled", type: "boolean", default: "false", description: "Prevents interaction and dims the button." },
    ],
    playground: {
      component: "Button",
      values: { variant: "primary", size: "md", loading: false, disabled: false, fullWidth: false, children: "Deploy project" },
      controls: [
        {
          kind: "select",
          prop: "variant",
          label: "variant",
          options: [
            { value: "primary", label: "Primary" },
            { value: "accent", label: "Accent" },
            { value: "secondary", label: "Secondary" },
            { value: "outline", label: "Outline" },
            { value: "ghost", label: "Ghost" },
            { value: "destructive", label: "Destructive" },
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
        { kind: "boolean", prop: "loading", label: "loading" },
        { kind: "boolean", prop: "disabled", label: "disabled" },
        { kind: "boolean", prop: "fullWidth", label: "fullWidth" },
        { kind: "text", prop: "children", label: "label", placeholder: "Deploy project" },
      ],
    },
  },
  {
    slug: "badge",
    title: "Badge",
    description:
      "A small status label. Tinted backgrounds carry the color, the text stays readable in both themes.",
    demos: [
      {
        title: "Variants",
        component: (
          <div className="flex flex-wrap items-center justify-center gap-2">
            <Badge>Stable</Badge>
            <Badge variant="solid">v2.0</Badge>
            <Badge variant="accent">New</Badge>
            <Badge variant="success">Ready</Badge>
            <Badge variant="warning">Pending</Badge>
            <Badge variant="danger">Deprecated</Badge>
          </div>
        ),
        code: `import { Badge } from "pollen-ui";

<div className="flex flex-wrap gap-2">
  <Badge>Stable</Badge>
  <Badge variant="solid">v2.0</Badge>
  <Badge variant="accent">New</Badge>
  <Badge variant="success">Ready</Badge>
  <Badge variant="warning">Pending</Badge>
  <Badge variant="danger">Deprecated</Badge>
</div>`,
      },
      {
        title: "Status dots",
        component: (
          <div className="flex flex-wrap items-center justify-center gap-2">
            <Badge dot variant="success">Operational</Badge>
            <Badge dot variant="warning">Degraded</Badge>
            <Badge dot variant="danger">Outage</Badge>
            <Badge dot>Building</Badge>
          </div>
        ),
        code: `<Badge dot variant="success">Operational</Badge>
<Badge dot variant="warning">Degraded</Badge>
<Badge dot variant="danger">Outage</Badge>`,
      },
      {
        title: "Counters",
        component: (
          <div className="flex flex-wrap items-center justify-center gap-5">
            <Badge count={3} />
            <Badge count={12} />
            <Badge count={128} />
          </div>
        ),
        code: `<Badge count={3} />
<Badge count={12} />
<Badge count={128} /> {/* renders 99+ */}`,
      },
      {
        title: "Dismissible",
        component: (
          <div className="flex flex-wrap items-center justify-center gap-2">
            <Badge variant="accent" dismissible>Pro plan</Badge>
            <Badge dismissible>Beta</Badge>
          </div>
        ),
        code: `<Badge variant="accent" dismissible>Pro plan</Badge>
<Badge dismissible onDismiss={() => {}} />`,
      },
      {
        title: "Sizes",
        component: (
          <div className="flex flex-wrap items-center justify-center gap-2">
            <Badge size="sm" dot variant="accent">Small</Badge>
            <Badge size="md" dot variant="accent">Medium</Badge>
            <Badge size="lg" dot variant="accent">Large</Badge>
          </div>
        ),
        code: `<Badge size="sm" dot variant="accent">Small</Badge>
<Badge size="md" dot variant="accent">Medium</Badge>
<Badge size="lg" dot variant="accent">Large</Badge>`,
      },
    ],
    props: [
      { name: "variant", type: '"neutral" | "accent" | "success" | "warning" | "danger" | "solid"', default: '"neutral"', description: "Color treatment." },
      { name: "size", type: '"sm" | "md" | "lg"', default: '"md"', description: "Height, padding and dot size." },
      { name: "dot", type: "boolean", default: "false", description: "Adds a status dot in the variant color." },
      { name: "icon", type: "ReactNode", description: "Leading icon sized to the badge." },
      { name: "count", type: "number", description: "Renders a notification counter instead of a label." },
      { name: "max", type: "number", default: "99", description: "Where the counter switches to N+." },
      { name: "dismissible", type: "boolean", default: "false", description: "Adds a close button; removal animates out." },
      { name: "onDismiss", type: "() => void", description: "Called after the badge removes itself." },
      { name: "shimmer", type: "boolean", default: "accent only", description: "A light sweep passes over the badge on hover." },
    ],
    playground: {
      component: "Badge",
      values: { variant: "accent", size: "md", dot: true, children: "New" },
      controls: [
        {
          kind: "select",
          prop: "variant",
          label: "variant",
          options: [
            { value: "neutral", label: "Neutral" },
            { value: "accent", label: "Accent" },
            { value: "success", label: "Success" },
            { value: "warning", label: "Warning" },
            { value: "danger", label: "Danger" },
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
        { kind: "boolean", prop: "dot", label: "dot" },
        { kind: "text", prop: "children", label: "label", placeholder: "New" },
      ],
    },
  },
  {
    slug: "input",
    title: "Input",
    description:
      "Single-line text field. The fill deepens on hover, rings blue on focus, and turns red only when something is actually wrong.",
    demos: [
      {
        title: "Basic",
        component: (
          <div className="w-full max-w-[280px] space-y-2">
            <Label htmlFor="demo-email">Email</Label>
            <Input id="demo-email" type="email" placeholder="you@example.com" />
          </div>
        ),
        code: `import { Input, Label } from "pollen-ui";

<div className="space-y-2">
  <Label htmlFor="email">Email</Label>
  <Input id="email" type="email" placeholder="you@example.com" />
</div>`,
      },
      {
        title: "Icon and error state",
        component: (
          <div className="w-full max-w-[280px] space-y-4">
            <Input icon={<Search />} placeholder="Search projects" />
            <div className="space-y-2">
              <Input
                icon={<Mail />}
                defaultValue="not-an-email"
                invalid
                aria-label="Email"
              />
              <p className="text-xs text-danger-ink">
                Enter a valid email address.
              </p>
            </div>
          </div>
        ),
        code: `import { Input, IconSearch, IconMail } from "pollen-ui";

<Input icon={<IconSearch />} placeholder="Search projects" />

<Input icon={<IconMail />} invalid defaultValue="not-an-email" />
<p className="text-xs text-danger-ink">Enter a valid email address.</p>`,
      },
      {
        title: "Success state",
        component: (
          <div className="w-full max-w-[280px]">
            <Input
              defaultValue="you@example.com"
              valid
              successText="Address verified."
              label="Email"
              aria-label="Verified email"
            />
          </div>
        ),
        code: `<Input valid successText="Address verified." label="Email" />`,
      },
      {
        title: "Clearable and loading",
        component: (
          <div className="w-full max-w-[280px] space-y-4">
            <Input clearable defaultValue="pollen-web" aria-label="Project name" />
            <Input
              icon={<Search />}
              clearable
              placeholder="Search and wait"
              loading
              aria-label="Search loading"
            />
          </div>
        ),
        code: `import { Input, IconSearch } from "pollen-ui";

<Input clearable defaultValue="pollen-web" />

<Input icon={<IconSearch />} clearable loading placeholder="Search and wait" />`,
      },
      {
        title: "Sizes",
        component: (
          <div className="w-full max-w-[280px] space-y-3">
            <Input size="sm" placeholder="Small, for dense toolbars" aria-label="Small input" />
            <Input size="md" placeholder="Medium, the default" aria-label="Medium input" />
            <Input size="lg" placeholder="Large, for hero forms" aria-label="Large input" />
          </div>
        ),
        code: `<Input size="sm" placeholder="Small, for dense toolbars" />
<Input size="md" placeholder="Medium, the default" />
<Input size="lg" placeholder="Large, for hero forms" />`,
      },
      {
        title: "Variants",
        component: (
          <div className="w-full max-w-[300px] space-y-4">
            <Input variant="fill" placeholder="Fill, the default" aria-label="Fill variant" />
            <Input variant="outline" placeholder="Outline, for forms on white" aria-label="Outline variant" />
            <Input variant="underline" placeholder="Underline, for inline editing" aria-label="Underline variant" />
            <Input variant="ghost" placeholder="Ghost, for toolbars" aria-label="Ghost variant" />
          </div>
        ),
        code: `<Input variant="fill" placeholder="Fill, the default" />
<Input variant="outline" placeholder="Outline, for forms on white" />
<Input variant="underline" placeholder="Underline, for inline editing" />
<Input variant="ghost" placeholder="Ghost, for toolbars" />`,
      },
      {
        title: "Pill shape",
        component: (
          <div className="w-full max-w-[280px]">
            <Input
              shape="pill"
              icon={<Search />}
              placeholder="Search components"
              aria-label="Pill search input"
            />
          </div>
        ),
        code: `import { Input, IconSearch } from "pollen-ui";

<Input shape="pill" icon={<IconSearch />} placeholder="Search components" />`,
      },
      {
        title: "Password, prefix, count",
        component: (
          <div className="w-full max-w-[300px] space-y-4">
            <Input
              type="password"
              passwordToggle
              defaultValue="correct-horse-battery"
              label="Password"
              aria-label="Password with reveal"
            />
            <Input
              prefix="https://"
              defaultValue="nimbus.app"
              label="Custom domain"
              helperText="We verify ownership with a DNS record."
              aria-label="Domain with prefix"
            />
            <Input
              defaultValue="Designed for the last ten percent"
              charCount
              maxLength={48}
              label="Tagline"
              aria-label="Input with character count"
            />
          </div>
        ),
        code: `import { Input } from "pollen-ui";

<Input type="password" passwordToggle label="Password" />

<Input prefix="https://" label="Custom domain" helperText="Verify with a DNS record." />

<Input charCount maxLength={48} label="Tagline" />`,
      },
    ],
    props: [
      { name: "icon", type: "ReactNode", description: "Leading icon, muted by default." },
      { name: "suffix", type: "ReactNode", description: "Trailing content, such as a unit." },
      { name: "prefix", type: "ReactNode", description: "Static content before the value, e.g. https://." },
      { name: "variant", type: '"fill" | "outline" | "underline" | "ghost"', default: '"fill"', description: "Visual treatment." },
      { name: "shape", type: '"default" | "pill"', default: '"default"', description: "Fully rounds the field for search-style inputs. Ignored by the underline variant." },
      { name: "size", type: '"sm" | "md" | "lg"', default: '"md"', description: "Control height and padding." },
      { name: "label", type: "ReactNode", description: "Label rendered above the field." },
      { name: "helperText / errorText", type: "ReactNode", description: "Quiet line under the field; errorText wins when invalid." },
      { name: "charCount", type: "boolean", default: "false", description: 'Show "n / maxLength" under the field.' },
      { name: "passwordToggle", type: "boolean", default: "false", description: 'With type="password", adds an eye reveal toggle.' },
      { name: "invalid", type: "boolean", default: "false", description: "Applies the error treatment." },
      { name: "valid / successText", type: "boolean / ReactNode", default: "false", description: "Green state mirroring invalid; successText replaces the helper line. invalid wins when both are set." },
      { name: "clearable", type: "boolean", default: "false", description: "Renders a clear button once the field has content." },
      { name: "loading", type: "boolean", default: "false", description: "Shows a spinner in the trailing slot." },
      { name: "onClear", type: "() => void", description: "Called after the clear button empties the field." },
    ],
    playground: {
      component: "Input",
      values: { icon: false, invalid: false, valid: false, clearable: true, loading: false, shape: "default", placeholder: "you@example.com" },
      imports: ["IconSearch as Search"],

      controls: [
        { kind: "boolean", prop: "icon", label: "icon", attr: "icon={<Search />}" },
        { kind: "boolean", prop: "invalid", label: "invalid" },
        { kind: "boolean", prop: "valid", label: "valid" },
        { kind: "boolean", prop: "clearable", label: "clearable" },
        { kind: "boolean", prop: "loading", label: "loading" },
        { kind: "select", prop: "shape", label: "shape", options: [{ value: "default", label: "default" }, { value: "pill", label: "pill" }] },
        { kind: "text", prop: "placeholder", label: "placeholder", placeholder: "you@example.com" },
      ],
    },
  },
  {
    slug: "textarea",
    title: "Textarea",
    description:
      "Multi-line text field that shares the Input API — label and helper lines, states, four variants — and can grow with its content.",
    demos: [
      {
        title: "Basic",
        component: (
          <div className="w-full max-w-[320px] space-y-2">
            <Label htmlFor="demo-bio">Project description</Label>
            <Textarea
              id="demo-bio"
              placeholder="A short summary of what you are building"
              className="min-h-[96px]"
            />
          </div>
        ),
        code: `import { Textarea, Label } from "pollen-ui";

<div className="space-y-2">
  <Label htmlFor="bio">Project description</Label>
  <Textarea id="bio" placeholder="A short summary of what you are building" />
</div>`,
      },
      {
        title: "Variants",
        component: (
          <div className="w-full max-w-[320px] space-y-4">
            <Textarea variant="fill" placeholder="Fill, the default" aria-label="Fill variant" />
            <Textarea variant="outline" placeholder="Outline, for forms on white" aria-label="Outline variant" />
            <Textarea variant="underline" placeholder="Underline, for inline editing" aria-label="Underline variant" />
            <Textarea variant="ghost" placeholder="Ghost, for quiet surfaces" aria-label="Ghost variant" />
          </div>
        ),
        code: `<Textarea variant="fill" placeholder="Fill, the default" />
<Textarea variant="outline" placeholder="Outline, for forms on white" />
<Textarea variant="underline" placeholder="Underline, for inline editing" />
<Textarea variant="ghost" placeholder="Ghost, for quiet surfaces" />`,
      },
      {
        title: "Label, count and states",
        component: (
          <div className="w-full max-w-[320px] space-y-4">
            <Textarea
              label="Release notes"
              charCount
              maxLength={120}
              defaultValue="Spring entrances under 300ms, springs only where interruptions happen."
              aria-label="Release notes with count"
            />
            <Textarea
              label="Summary"
              invalid
              errorText="Keep the summary under 140 characters."
              defaultValue="This summary runs long and needs a careful trim before it can ship."
              aria-label="Invalid textarea"
            />
          </div>
        ),
        code: `<Textarea label="Release notes" charCount maxLength={120} />

<Textarea label="Summary" invalid errorText="Keep the summary under 140 characters." />`,
      },
      {
        title: "Auto grow",
        component: (
          <div className="w-full max-w-[320px]">
            <Textarea
              autoGrow
              label="Notes"
              placeholder="Type — the field grows with you"
              aria-label="Auto-growing textarea"
            />
          </div>
        ),
        code: `<Textarea autoGrow label="Notes" placeholder="Type — the field grows with you" />`,
      },
    ],
    props: [
      { name: "variant", type: '"fill" | "outline" | "underline" | "ghost"', default: '"fill"', description: "Visual treatment. Underline signals state through the border only." },
      { name: "size", type: '"sm" | "md" | "lg"', default: '"md"', description: "Minimum height and padding." },
      { name: "resize", type: '"none" | "vertical"', default: '"vertical"', description: "Corner resize handle. autoGrow implies none." },
      { name: "label", type: "ReactNode", description: "Label rendered above the field." },
      { name: "helperText / errorText", type: "ReactNode", description: "Quiet line under the field; errorText wins when invalid." },
      { name: "invalid", type: "boolean", default: "false", description: "Applies the error treatment." },
      { name: "valid / successText", type: "boolean / ReactNode", default: "false", description: "Green state mirroring invalid; successText replaces the helper line. invalid wins when both are set." },
      { name: "charCount", type: "boolean", default: "false", description: 'Show "n / maxLength" under the field.' },
      { name: "autoGrow", type: "boolean", default: "false", description: "Grows with content instead of scrolling; disables the corner resize handle." },
    ],
    playground: {
      component: "Textarea",
      values: { placeholder: "A short summary of what you are building", size: "md", rows: 4, variant: "fill", invalid: false, valid: false, disabled: false, autoGrow: false },
      controls: [
        { kind: "text", prop: "placeholder", label: "placeholder", placeholder: "A short summary of what you are building" },
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
        {
          kind: "select",
          prop: "variant",
          label: "variant",
          options: [
            { value: "fill", label: "fill" },
            { value: "outline", label: "outline" },
            { value: "underline", label: "underline" },
            { value: "ghost", label: "ghost" },
          ],
        },
        { kind: "number", prop: "rows", label: "rows", min: 2, max: 12, step: 1 },
        { kind: "boolean", prop: "invalid", label: "invalid" },
        { kind: "boolean", prop: "valid", label: "valid" },
        { kind: "boolean", prop: "autoGrow", label: "autoGrow" },
        { kind: "boolean", prop: "disabled", label: "disabled" },
      ],
    },
  },
  {
    slug: "label",
    title: "Label",
    description:
      "A field label. Point it at a control with htmlFor and the browser handles focus for free.",
    demos: [
      {
        title: "With helper text",
        component: (
          <div className="w-full max-w-[280px] space-y-2">
            <Label htmlFor="demo-key">API key</Label>
            <Input id="demo-key" placeholder="sk_live_..." className="font-mono" />
            <p className="text-xs text-muted-foreground">
              Keep it secret. Rotate it any time from settings.
            </p>
          </div>
        ),
        code: `import { Input, Label } from "pollen-ui";

<div className="space-y-2">
  <Label htmlFor="key">API key</Label>
  <Input id="key" placeholder="sk_live_..." className="font-mono" />
  <p className="text-xs text-muted-foreground">
    Keep it secret. Rotate it any time from settings.
  </p>
</div>`,
      },
    ],
    playground: {
      component: "Label",
      values: { children: "Email" },
      controls: [
        { kind: "text", prop: "children", label: "label", placeholder: "Email" },
      ],
    },
  },
  {
    slug: "select",
    title: "Select",
    description:
      "A custom listbox. The menu scales out of the trigger edge, arrow keys move the active option, and Enter commits it.",
    demos: [
      {
        title: "Basic",
        component: (
          <div className="w-full max-w-[280px]">
            <Select
              aria-label="Framework preset"
              defaultValue="nextjs"
              options={[
                { value: "nextjs", label: "Next.js", description: "React framework with App Router" },
                { value: "astro", label: "Astro", description: "Content-driven websites" },
                { value: "sveltekit", label: "SvelteKit", description: "Svelte applications" },
                { value: "remix", label: "Remix", disabled: true },
              ]}
            />
          </div>
        ),
        code: `import { Select } from "pollen-ui";

<Select
  defaultValue="nextjs"
  options={[
    { value: "nextjs", label: "Next.js", description: "React framework with App Router" },
    { value: "astro", label: "Astro", description: "Content-driven websites" },
    { value: "sveltekit", label: "SvelteKit", description: "Svelte applications" },
    { value: "remix", label: "Remix", disabled: true },
  ]}
/>`,
      },
    ],
    keyboard: [
      { keys: "Enter / Space", action: "Open the listbox from the trigger." },
      { keys: "Arrow Down / Arrow Up", action: "Move the highlight; the list scrolls it into view." },
      { keys: "Home / End", action: "Jump to the first or last option." },
      { keys: "A-Z / 0-9", action: "Type-ahead jumps to the next matching option. The buffer resets after 500 ms." },
      { keys: "Enter", action: "Select the highlighted option." },
      { keys: "Escape / Tab", action: "Close the listbox without changing the selection." },
    ],
    props: [
      { name: "options", type: "SelectOption[]", description: "Entries with value, label and optional description." },
      { name: "value", type: "string", description: "Controlled selected value." },
      { name: "defaultValue", type: "string", description: "Initial selected value." },
      { name: "onValueChange", type: "(value: string) => void", description: "Called when a value is picked." },
      { name: "placeholder", type: "string", default: '"Select an option"', description: "Shown when nothing is selected." },
      { name: "size", type: '"sm" | "md" | "lg"', default: '"md"', description: "Control height and padding." },
    ],
    playground: {
      component: "Select",
      values: { options: true, defaultValue: "nextjs", placeholder: "Pick a framework", size: "md", disabled: false },
      controls: [
        {
          kind: "boolean",
          prop: "options",
          label: "options",
          attr: 'options={[{ value: "nextjs", label: "Next.js" }, { value: "astro", label: "Astro" }, { value: "sveltekit", label: "SvelteKit" }]}',
        },
        {
          kind: "select",
          prop: "defaultValue",
          label: "defaultValue",
          options: [
            { value: "nextjs", label: "nextjs" },
            { value: "astro", label: "astro" },
            { value: "sveltekit", label: "sveltekit" },
          ],
        },
        { kind: "text", prop: "placeholder", label: "placeholder", placeholder: "Select an option" },
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
    slug: "checkbox",
    title: "Checkbox",
    description:
      "A binary choice with a check mark that draws itself in. Indeterminate dash, three sizes, three colors, and a card mode that turns the whole row into the hit area.",
    demos: [
      {
        title: "States",
        component: (
          <div className="flex flex-col gap-3">
            <Checkbox defaultChecked>Email digests</Checkbox>
            <Checkbox>Weekly summary</Checkbox>
            <Checkbox indeterminate>Notifications (partial)</Checkbox>
            <Checkbox disabled>Enterprise feature</Checkbox>
          </div>
        ),
        code: `import { Checkbox } from "pollen-ui";

<Checkbox defaultChecked>Email digests</Checkbox>
<Checkbox>Weekly summary</Checkbox>
<Checkbox indeterminate>Notifications (partial)</Checkbox>
<Checkbox disabled>Enterprise feature</Checkbox>`,
      },
      {
        title: "Card mode",
        component: (
          <div className="grid w-full max-w-[420px] gap-2.5">
            <Checkbox card defaultChecked description="Every push, pr, and deployment event">
              All activity
            </Checkbox>
            <Checkbox card description="Only mentions, reviews and requests">
              Important only
            </Checkbox>
          </div>
        ),
        code: `<Checkbox
  card
  defaultChecked
  description="Every push, pr, and deployment event"
>
  All activity
</Checkbox>

<Checkbox card description="Only mentions, reviews and requests">
  Important only
</Checkbox>`,
      },
    ],
    keyboard: [
      { keys: "Space", action: "Toggle the checkbox. The visible control is a real button." },
      { keys: "Enter", action: "Toggle the checkbox." },
    ],
    props: [
      { name: "checked", type: "boolean", description: "Controlled state." },
      { name: "defaultChecked", type: "boolean", description: "Initial state." },
      { name: "indeterminate", type: "boolean", default: "false", description: "Shows a dash instead of a check." },
      { name: "onCheckedChange", type: "(checked: boolean) => void", description: "Called on toggle." },
      { name: "name / value", type: "string", description: "Form participation through a hidden native input; value defaults to \"on\"." },
      { name: "card", type: "boolean", default: "false", description: "Wraps label and description in a selectable card." },
      { name: "description", type: "ReactNode", description: "Second line under the label." },
      { name: "size", type: '"sm" | "md" | "lg"', default: '"md"', description: "Box, mark and text size." },
      { name: "color", type: '"accent" | "neutral" | "success"', default: '"accent"', description: "Fill of the checked box." },
    ],
    playground: {
      component: "Checkbox",
      values: { defaultChecked: true, indeterminate: false, disabled: false, children: "Email digests" },
      controls: [
        { kind: "boolean", prop: "defaultChecked", label: "defaultChecked" },
        { kind: "boolean", prop: "indeterminate", label: "indeterminate" },
        { kind: "boolean", prop: "disabled", label: "disabled" },
        { kind: "text", prop: "children", label: "label", placeholder: "Email digests" },
      ],
    },
  },
  {
    slug: "radio-group",
    title: "Radio Group",
    description:
      "Pick exactly one option. The dot springs in, arrow keys move the selection, and the group manages its own roving focus.",
    demos: [
      {
        title: "Basic",
        component: (
          <RadioGroup defaultValue="pro" aria-label="Plan" className="gap-3">
            <Radio value="hobby">Hobby, for side projects</Radio>
            <Radio value="pro">Pro, for growing teams</Radio>
            <Radio value="enterprise">Enterprise, with SSO and SLA</Radio>
          </RadioGroup>
        ),
        code: `import { Radio, RadioGroup } from "pollen-ui";

<RadioGroup defaultValue="pro">
  <Radio value="hobby">Hobby, for side projects</Radio>
  <Radio value="pro">Pro, for growing teams</Radio>
  <Radio value="enterprise">Enterprise, with SSO and SLA</Radio>
</RadioGroup>`,
      },
    ],
    keyboard: [
      { keys: "Arrow Up / Arrow Left", action: "Move to the previous option, wrapping at the ends." },
      { keys: "Arrow Down / Arrow Right", action: "Move to the next option, wrapping at the ends." },
    ],
    props: [
      { name: "value", type: "string", description: "Controlled selected value." },
      { name: "defaultValue", type: "string", description: "Initial selected value." },
      { name: "onValueChange", type: "(value: string) => void", description: "Called when the selection changes." },
    ],
    playground: {
      component: "RadioGroup",
      values: { defaultValue: "pro" },
      controls: [
        {
          kind: "select",
          prop: "defaultValue",
          label: "defaultValue",
          options: [
            { value: "hobby", label: "hobby" },
            { value: "pro", label: "pro" },
            { value: "enterprise", label: "enterprise" },
          ],
        },
      ],
    },
  },
  {
    slug: "switch",
    title: "Switch",
    description:
      "An immediate on and off. The thumb travels on a stiff spring, state icons crossfade in the track, and a loading state pauses the world while the change commits.",
    demos: [
      {
        title: "Settings rows",
        component: (
          <div className="w-full max-w-[320px] rounded-2xl bg-fill/70 p-1.5 shadow-[var(--pollen-shadow-sm)]">
            <div className="flex items-center justify-between rounded-xl bg-card p-3.5 shadow-[var(--pollen-shadow-xs)]">
              <span className="text-sm font-medium">Public profile</span>
              <Switch defaultChecked aria-label="Public profile" />
            </div>
            <div className="mt-1.5 flex items-center justify-between rounded-xl bg-card p-3.5 shadow-[var(--pollen-shadow-xs)]">
              <span className="text-sm font-medium">Email me product updates</span>
              <Switch aria-label="Email me product updates" />
            </div>
          </div>
        ),
        code: `import { Switch } from "pollen-ui";

<div className="flex items-center justify-between p-3.5">
  <span className="text-sm font-medium">Public profile</span>
  <Switch defaultChecked />
</div>`,
      },
      {
        title: "Sizes, icons and loading",
        component: (
          <div className="flex flex-wrap items-center justify-center gap-8">
            <Switch size="sm" defaultChecked aria-label="Small switch" />
            <Switch size="lg" defaultChecked aria-label="Large switch" />
            <Switch
              defaultChecked
              onIcon={
                <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 6.5L5 9l4.5-5.5" /></svg>
              }
              offIcon={
                <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M3 6h6" /></svg>
              }
              aria-label="Icon switch"
            />
            <Switch loading defaultChecked aria-label="Saving" />
          </div>
        ),
        code: `<Switch size="sm" defaultChecked />
<Switch size="lg" defaultChecked />

<Switch
  defaultChecked
  onIcon={<IconCheck />}
  offIcon={<IconMinus />}
/>

<Switch loading defaultChecked />`,
      },
    ],
    keyboard: [
      { keys: "Space / Enter", action: "Toggle the switch. The control is a real button with role=\"switch\"." },
    ],
    props: [
      { name: "checked", type: "boolean", description: "Controlled state." },
      { name: "defaultChecked", type: "boolean", description: "Initial state." },
      { name: "onCheckedChange", type: "(checked: boolean) => void", description: "Called on toggle." },
      { name: "size", type: '"sm" | "md" | "lg"', default: '"md"', description: "Track and thumb size." },
      { name: "color", type: '"accent" | "neutral" | "success"', default: '"accent"', description: "Track color in the on state." },
      { name: "loading", type: "boolean", default: "false", description: "Swaps the thumb for a spinner and pauses events." },
      { name: "onIcon / offIcon", type: "ReactNode", description: "Icons crossfading inside the track with the state." },
      { name: "description", type: "ReactNode", description: "Second line under the label." },
    ],
    playground: {
      component: "Switch",
      values: { defaultChecked: true, disabled: false },
      controls: [
        { kind: "boolean", prop: "defaultChecked", label: "defaultChecked" },
        { kind: "boolean", prop: "disabled", label: "disabled" },
      ],
    },
  },
  {
    slug: "slider",
    title: "Slider",
    description:
      "Press anywhere to jump, drag outside the rail without losing the grab, and watch the value bubble follow the thumb. One thumb or two, marks, vertical rail, and full keyboard support.",
    demos: [
      {
        title: "Basic",
        component: <SliderDemo />,
        code: `import { Slider } from "pollen-ui";

const [volume, setVolume] = useState(40);

<div className="w-full max-w-[260px]">
  <div className="mb-3 flex justify-between text-sm">
    <span className="font-medium">Volume</span>
    <span className="text-muted-foreground">{volume}%</span>
  </div>
  <Slider
    value={volume}
    onValueChange={setVolume}
    min={0}
    max={100}
    step={1}
    aria-label="Volume"
  />
</div>`,
      },
      {
        title: "Range with marks",
        component: (
          <div className="w-full max-w-[300px]">
            <Slider
              defaultValue={[24, 72]}
              min={0}
              max={100}
              step={1}
              minStepsBetweenThumbs={5}
              marks={[
                { value: 0, label: "0" },
                { value: 25, label: "25" },
                { value: 50, label: "50" },
                { value: 75, label: "75" },
                { value: 100, label: "100" },
              ]}
              aria-label="Price range"
            />
          </div>
        ),
        code: `<Slider
  defaultValue={[24, 72]}
  minStepsBetweenThumbs={5}
  marks={[
    { value: 0, label: "0" },
    { value: 50, label: "50" },
    { value: 100, label: "100" },
  ]}
/>`,
      },
      {
        title: "Formatted bubble",
        component: <SliderFormatDemo />,
        code: `<Slider
  defaultValue={46}
  tooltipAlways
  formatValue={(v) => \`$\${v},000\`}
  aria-label="Salary"
/>

<Slider
  orientation="vertical"
  defaultValue={62}
  formatValue={(v) => \`\${v}°\`}
  aria-label="Temperature"
/>`,
      },
    ],
    keyboard: [
      { keys: "Arrow Left / Arrow Down", action: "Step the value down." },
      { keys: "Arrow Right / Arrow Up", action: "Step the value up." },
      { keys: "Page Down / Page Up", action: "Take a large step." },
      { keys: "Home / End", action: "Jump to the minimum or maximum." },
    ],
    props: [
      { name: "value", type: "number | [number, number]", description: "Controlled value. An array switches to two thumbs." },
      { name: "defaultValue", type: "number | [number, number]", default: "0", description: "Initial value." },
      { name: "min / max / step", type: "number", default: "0 / 100 / 1", description: "Range and snapping." },
      { name: "minStepsBetweenThumbs", type: "number", default: "0", description: "How close the two thumbs may get, in steps." },
      { name: "marks", type: "{ value: number; label?: string }[]", description: "Tick dots on the rail. Passed marks light up; labels are clickable." },
      { name: "orientation", type: '"horizontal" | "vertical"', default: '"horizontal"', description: "Vertical swaps to a rail with the value bubble on the side." },
      { name: "showTooltip", type: "boolean", default: "true", description: "Bubble appears on drag, hover and focus." },
      { name: "tooltipAlways", type: "boolean", default: "false", description: "Pins every value bubble open." },
      { name: "formatValue", type: "(value: number) => string", description: "Formats the bubble and the accessible value text." },
      { name: "onValueChange", type: "(value: number | [number, number]) => void", description: "Called while dragging." },
    ],
    playground: {
      component: "Slider",
      values: { min: 0, max: 100, step: 1, minStepsBetweenThumbs: 5 },
      controls: [
        { kind: "number", prop: "min", label: "min" },
        { kind: "number", prop: "max", label: "max" },
        { kind: "number", prop: "step", label: "step" },
        { kind: "number", prop: "minStepsBetweenThumbs", label: "min gap" },
      ],
    },
  },
  {
    slug: "toggle-group",
    title: "Toggle Group",
    description:
      "A row of toggle buttons for picking one or many options. Arrow keys move between items, and the connected variant reads as one segmented control.",
    demos: [
      {
        title: "Single selection",
        component: (
          <div className="flex flex-wrap items-center justify-center gap-3">
            <ToggleGroup type="single" defaultValue="dense" aria-label="Density">
              <ToggleGroupItem value="cozy">Cozy</ToggleGroupItem>
              <ToggleGroupItem value="dense">Dense</ToggleGroupItem>
              <ToggleGroupItem value="list">List</ToggleGroupItem>
            </ToggleGroup>
            <ToggleGroup type="single" variant="connected" aria-label="View">
              <ToggleGroupItem value="day">Day</ToggleGroupItem>
              <ToggleGroupItem value="week">Week</ToggleGroupItem>
              <ToggleGroupItem value="month">Month</ToggleGroupItem>
            </ToggleGroup>
          </div>
        ),
        code: `import { ToggleGroup, ToggleGroupItem } from "pollen-ui";

export default function Page() {
  return (
    <ToggleGroup type="single" defaultValue="dense">
      <ToggleGroupItem value="cozy">Cozy</ToggleGroupItem>
      <ToggleGroupItem value="dense">Dense</ToggleGroupItem>
      <ToggleGroupItem value="list">List</ToggleGroupItem>
    </ToggleGroup>
  );
}`,
      },
      {
        title: "Multiple selection",
        component: (
          <div className="flex justify-center">
            <ToggleGroup type="multiple" defaultValue={["bold", "italic"]} aria-label="Formatting">
              <ToggleGroupItem value="bold">Bold</ToggleGroupItem>
              <ToggleGroupItem value="italic">Italic</ToggleGroupItem>
              <ToggleGroupItem value="underline">Underline</ToggleGroupItem>
              <ToggleGroupItem value="code">Code</ToggleGroupItem>
            </ToggleGroup>
          </div>
        ),
        code: `<ToggleGroup type="multiple" defaultValue={["bold", "italic"]}>
  <ToggleGroupItem value="bold">Bold</ToggleGroupItem>
  <ToggleGroupItem value="italic">Italic</ToggleGroupItem>
</ToggleGroup>`,
      },
    ],
    keyboard: [
      { keys: "Arrow Right / Arrow Down", action: "Move focus to the next item." },
      { keys: "Arrow Left / Arrow Up", action: "Move focus to the previous item." },
      { keys: "Space / Enter", action: "Toggle the focused item." },
    ],
    props: [
      { name: "type", type: '"single" | "multiple"', default: '"single"', description: "Whether one value or a set stays selected." },
      { name: "value", type: "string | string[]", description: "Controlled selection." },
      { name: "defaultValue", type: "string | string[]", description: "Initial selection for uncontrolled use." },
      { name: "onValueChange", type: "(value: string | string[]) => void", description: "Called with the new selection." },
      { name: "variant", type: '"chips" | "connected"', default: '"chips"', description: "Separate chips, or one pill row with an inset track." },
      { name: "size", type: '"sm" | "md"', default: '"md"', description: "Item height and padding." },
      { name: "disabled", type: "boolean", default: "false", description: "Disables every item at once." },
    ],
    playground: {
      component: "ToggleGroup",
      values: { type: "single", variant: "chips", size: "md" },
      controls: [
        {
          kind: "select",
          prop: "type",
          label: "type",
          options: [
            { value: "single", label: "single" },
            { value: "multiple", label: "multiple" },
          ],
        },
        {
          kind: "select",
          prop: "variant",
          label: "variant",
          options: [
            { value: "chips", label: "chips" },
            { value: "connected", label: "connected" },
          ],
        },
        {
          kind: "select",
          prop: "size",
          label: "size",
          options: [
            { value: "sm", label: "sm" },
            { value: "md", label: "md" },
          ],
        },
      ],
      imports: ["ToggleGroupItem"],
    },
  },
  {
    slug: "otp-input",
    title: "OTP Input",
    description:
      "One box per character for verification codes. Typing advances, backspace retreats, and pasting a code fills every box from the start.",
    demos: [
      {
        title: "Six digits",
        component: (
          <OTPInputDemo />
        ),
        code: `import { useState } from "react";
import { OTPInput } from "pollen-ui";

export default function Page() {
  const [code, setCode] = useState("");
  return (
    <OTPInput
      length={6}
      value={code}
      onChange={setCode}
      onComplete={(value) => console.log(value)}
      aria-label="Verification code"
    />
  );
}`,
      },
      {
        title: "Alphanumeric, invalid state",
        component: (
          <div className="flex flex-col items-center gap-4">
            <OTPInput length={4} alphanumeric defaultValue="7X2K" aria-label="Access code" />
            <OTPInput length={6} defaultValue="12" invalid aria-label="Expired code" />
          </div>
        ),
        code: `<OTPInput length={4} alphanumeric defaultValue="7X2K" />
<OTPInput length={6} defaultValue="12" invalid />`,
      },
    ],
    keyboard: [
      { keys: "0-9", action: "Fill the focused cell and advance to the next one." },
      { keys: "Backspace", action: "Clear the focused cell, or the previous cell when it is already empty." },
      { keys: "Arrow Left / Arrow Right", action: "Move between cells." },
    ],
    props: [
      { name: "length", type: "number", default: "6", description: "Number of boxes." },
      { name: "value", type: "string", description: "Controlled code as a string." },
      { name: "defaultValue", type: "string", description: "Initial code for uncontrolled use." },
      { name: "onChange", type: "(value: string) => void", description: "Called on every change with the full string." },
      { name: "onComplete", type: "(value: string) => void", description: "Called once the last box is filled." },
      { name: "alphanumeric", type: "boolean", default: "false", description: "Accept letters as well as digits." },
      { name: "size", type: '"sm" | "md" | "lg"', default: '"md"', description: "Box height and type size." },
      { name: "invalid", type: "boolean", default: "false", description: "Turns the fill and focus ring red." },
    ],
    playground: {
      component: "OTPInput",
      values: { length: 6, size: "md", invalid: false, alphanumeric: false },
      controls: [
        { kind: "number", prop: "length", label: "length", min: 3, max: 8, step: 1 },
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
        { kind: "boolean", prop: "invalid", label: "invalid" },
        { kind: "boolean", prop: "alphanumeric", label: "alphanumeric" },
      ],
    },
  },
  {
    slug: "knob",
    title: "Knob",
    description:
      "A rotary control for values that live on a dial. Drag around the cap and the value tracks the angle, nudge it with the scroll wheel, or step it with the keyboard - to assistive tech it is a slider. The sweep is configurable, from the classic 270 degrees to a gauge-style 180.",
    demos: [
      {
        title: "Basic",
        component: <KnobBasicDemo />,
        code: `import { useState } from "react";
import { Knob } from "pollen-ui";

const [level, setLevel] = useState(64);

<Knob value={level} onValueChange={setLevel} min={0} max={100} label="Level" />`,
      },
      {
        title: "Sweeps and tones",
        component: <KnobVariantsDemo />,
        code: `// The classic 270 degree dial.
<Knob defaultValue={30} tone="accent" label="Gain" size={84} />

// Gauge-style 180 degree sweep, decimal readout.
<Knob
  defaultValue={0.5}
  min={0}
  max={1}
  step={0.05}
  precision={2}
  startAngle={-90}
  endAngle={90}
  tone="success"
  label="Opacity"
  size={84}
/>

// Readout hidden when the dial sits next to its own label.
<Knob defaultValue={80} min={0} max={120} tone="danger" label="Threshold" showValue={false} />`,
      },
    ],
    keyboard: [
      { keys: "Arrow Right / Arrow Up", action: "Step the value up. Shift takes a large step." },
      { keys: "Arrow Left / Arrow Down", action: "Step the value down. Shift takes a large step." },
      { keys: "Page Up / Page Down", action: "Take one tenth of the range." },
      { keys: "Home / End", action: "Jump to the minimum or maximum." },
    ],
    props: [
      { name: "value", type: "number", description: "Controlled value." },
      { name: "defaultValue", type: "number", default: "0", description: "Initial value." },
      { name: "min / max / step", type: "number", default: "0 / 100 / 1", description: "Range and snapping. step also sizes the wheel and keyboard increments." },
      { name: "size", type: "number", default: "96", description: "Diameter of the dial in pixels." },
      { name: "startAngle / endAngle", type: "number", default: "-135 / 135", description: "The sweep in degrees from 12 o'clock. The gap is the dead zone, which snaps to the nearer end." },
      { name: "tone", type: '"accent" | "neutral" | "success" | "danger"', default: '"accent"', description: "Color of the fill arc and the pointer mark." },
      { name: "label", type: "string", description: "Accessible name; also shown next to the readout." },
      { name: "showValue", type: "boolean", default: "true", description: "Numeric readout under the dial." },
      { name: "precision", type: "number", default: "0", description: "Decimals in the readout and the announced value." },
      { name: "onValueChange", type: "(value: number) => void", description: "Called on drag, wheel and keyboard changes." },
    ],
    playground: {
      component: "Knob",
      values: { defaultValue: 45, min: 0, max: 100, step: 1, size: 96, precision: 0, label: "Level" },
      controls: [
        { kind: "number", prop: "defaultValue", label: "defaultValue" },
        { kind: "number", prop: "min", label: "min" },
        { kind: "number", prop: "max", label: "max" },
        { kind: "number", prop: "step", label: "step" },
        { kind: "number", prop: "size", label: "size", min: 64, max: 160, step: 4 },
        { kind: "number", prop: "precision", label: "precision", min: 0, max: 2, step: 1 },
        {
          kind: "select",
          prop: "tone",
          label: "tone",
          options: [
            { value: "accent", label: "accent" },
            { value: "neutral", label: "neutral" },
            { value: "success", label: "success" },
            { value: "danger", label: "danger" },
          ],
        },
      ],
    },
  },

  {
    slug: "stepper",
    title: "Stepper",
    description:
      "The plus/minus quantity control the platform trained every thumb on. Ends grey out at the bounds instead of clicking emptily, the count bumps with a spring so repeated taps stay legible, and the whole track is a spinbutton - focus it and the arrow keys drive the value.",
    demos: [
      {
        title: "Basic",
        component: <StepperDemo />,
        code: `import { useState } from "react";
import { Stepper } from "pollen-ui";

const [seats, setSeats] = useState(3);

<Stepper
  value={seats}
  onValueChange={setSeats}
  min={1}
  max={12}
  aria-label="Seats"
/>

// Small size, uncontrolled, bounds grey out:
<Stepper defaultValue={0} min={0} max={99} size="sm" aria-label="Guest passes" />`,
      },
    ],
    keyboard: [
      { keys: "Arrow Up / Arrow Right", action: "Step the value up." },
      { keys: "Arrow Down / Arrow Left", action: "Step the value down." },
      { keys: "Home / End", action: "Jump to the minimum or maximum." },
    ],
    props: [
      { name: "value", type: "number", description: "Controlled value." },
      { name: "defaultValue", type: "number", default: "0", description: "Initial value." },
      { name: "min / max / step", type: "number", default: "0 / 99 / 1", description: "Range and snapping. At the bounds the matching end greys out." },
      { name: "size", type: '"sm" | "md" | "lg"', default: '"md"', description: "Control height." },
      { name: "aria-label", type: "string", default: '"Stepper"', description: "Accessible name, announced with the value." },
      { name: "onValueChange", type: "(value: number) => void", description: "Called on press and keyboard changes." },
    ],
    playground: {
      component: "Stepper",
      values: { defaultValue: 3, min: 0, max: 99, step: 1 },
      controls: [
        { kind: "number", prop: "defaultValue", label: "defaultValue" },
        { kind: "number", prop: "min", label: "min" },
        { kind: "number", prop: "max", label: "max" },
        { kind: "number", prop: "step", label: "step" },
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
];
