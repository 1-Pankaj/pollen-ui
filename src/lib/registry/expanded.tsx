import {
  IconCopy as Copy,
  IconCard as CreditCard,
  IconPackage as PackageOpen,
  IconPencil as Pencil,
  IconPlus as Plus,
  IconDeploy as Rocket,
  IconSearch as Search,
  IconTrash as Trash2,
} from "pollen-ui";
import {
  Badge,
  Button,
  Combobox,
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuTrigger,
  EmptyState,
  Input,
  Label,
  NumberTicker,
  Pagination,
  Popover,
  Rating,
  Stat,
  Steps,
  Switch,
  TagInput,
  Timeline,
  Typewriter,
} from "pollen-ui";
import { ChatDemo } from "@/components/demos/chat-demo";
import { ActivityHeatmapDemo, ActivityHeatmapSizesDemo } from "@/components/demos/activity-heatmap-demo";
import type { RegistryEntry } from "./types";

const timezones = [
  { value: "gmt", label: "London", description: "GMT · UTC+0" },
  { value: "cest", label: "Berlin", description: "CEST · UTC+2" },
  { value: "et", label: "New York", description: "ET · UTC−4" },
  { value: "pt", label: "San Francisco", description: "PT · UTC−7" },
  { value: "jst", label: "Tokyo", description: "JST · UTC+9" },
  { value: "aest", label: "Sydney", description: "AEST · UTC+10" },
];

export const expanded: RegistryEntry[] = [
  {
    slug: "popover",
    title: "Popover",
    description:
      "A floating panel for rich content: invite forms, filter panes, help cards. Portaled to the end of body so nothing can clip it, it flips above the trigger when the viewport edge is closer.",
    demos: [
      {
        title: "Invite form",
        component: (
          <Popover
            trigger={
              <Button variant="outline">
                <Plus className="h-4 w-4" />
                Invite
              </Button>
            }
          >
            <div className="w-64">
              <Label htmlFor="popover-email">Email address</Label>
              <Input id="popover-email" placeholder="mira@pollen.dev" className="mt-2" />
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                They get a link that expires in seven days.
              </p>
              <Button size="sm" className="mt-4 w-full">
                Send invite
              </Button>
            </div>
          </Popover>
        ),
        code: `import { Button, Input, Label, Popover } from "pollen-ui";

<Popover
  trigger={<Button variant="outline">Invite</Button>}
>
  <div className="w-64">
    <Label htmlFor="email">Email address</Label>
    <Input id="email" placeholder="mira@pollen.dev" className="mt-2" />
    <Button size="sm" className="mt-4 w-full">Send invite</Button>
  </div>
</Popover>`,
      },
      {
        title: "Sides",
        component: (
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Popover side="top" trigger={<Button size="sm" variant="secondary">Top</Button>}>
              <p className="text-sm text-muted-foreground">Opens above the trigger.</p>
            </Popover>
            <Popover side="bottom" trigger={<Button size="sm" variant="secondary">Bottom</Button>}>
              <p className="text-sm text-muted-foreground">Opens below the trigger.</p>
            </Popover>
            <Popover side="left" trigger={<Button size="sm" variant="secondary">Left</Button>}>
              <p className="text-sm text-muted-foreground">Opens to the left.</p>
            </Popover>
            <Popover side="right" trigger={<Button size="sm" variant="secondary">Right</Button>}>
              <p className="text-sm text-muted-foreground">Opens to the right.</p>
            </Popover>
          </div>
        ),
        code: `<Popover side="top" trigger={<Button>Top</Button>}>…</Popover>
<Popover side="bottom" trigger={<Button>Bottom</Button>}>…</Popover>
<Popover side="left" trigger={<Button>Left</Button>}>…</Popover>
<Popover side="right" trigger={<Button>Right</Button>}>…</Popover>`,
      },
    ],
    keyboard: [
      { keys: "Enter / Space / Arrow Down", action: "Open the popover from the trigger." },
      { keys: "Escape", action: "Close the popover and return focus to the trigger." },
    ],
    props: [
      { name: "trigger", type: "ReactNode", description: "Element that toggles the popover, usually a Button." },
      { name: "side", type: '"top" | "bottom" | "left" | "right"', default: '"bottom"', description: "Preferred side. Flips automatically when it does not fit." },
      { name: "align", type: '"start" | "center" | "end"', default: '"start"', description: "Alignment along the trigger edge." },
      { name: "open / onOpenChange", type: "boolean / (open) => void", description: "Control the open state from outside." },
      { name: "arrow", type: "boolean", default: "true", description: "Show the small pointer triangle." },
    ],
    playground: {
      component: "Popover",
      values: { side: "bottom", align: "start", arrow: true, children: "A floating panel for rich content." },
      controls: [
        {
          kind: "select",
          prop: "side",
          label: "side",
          options: [
            { value: "top", label: "top" },
            { value: "bottom", label: "bottom" },
            { value: "left", label: "left" },
            { value: "right", label: "right" },
          ],
        },
        {
          kind: "select",
          prop: "align",
          label: "align",
          options: [
            { value: "start", label: "start" },
            { value: "center", label: "center" },
            { value: "end", label: "end" },
          ],
        },
        { kind: "boolean", prop: "arrow", label: "arrow" },
        { kind: "text", prop: "children", label: "children", placeholder: "Panel content" },
      ],
    },
  },
  {
    slug: "context-menu",
    title: "Context menu",
    description:
      "Right-click menu for objects that deserve shortcuts. Opens exactly where you clicked, stays clamped inside the viewport, and supports the same items, labels and destructive styling as the dropdown menu.",
    demos: [
      {
        title: "File actions",
        component: (
          <ContextMenu>
            <ContextMenuTrigger className="flex w-full max-w-[320px] cursor-default items-center gap-3.5 rounded-2xl bg-card p-4 text-left shadow-[var(--pollen-shadow-sm)]">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-fill text-muted-foreground">
                <CreditCard className="h-5 w-5" />
              </span>
              <span className="min-w-0">
                <span className="block truncate text-[15px] font-medium text-foreground">
                  brand-refresh.fig
                </span>
                <span className="block text-[13px] text-faint">
                  Edited 2h ago · 14.2 MB
                </span>
              </span>
              <Badge variant="accent" className="ml-auto shrink-0">New</Badge>
            </ContextMenuTrigger>
            <ContextMenuContent>
              <ContextMenuLabel>File</ContextMenuLabel>
              <ContextMenuItem icon={<Pencil />} shortcut={["E"]}>
                Rename
              </ContextMenuItem>
              <ContextMenuItem icon={<Copy />} shortcut={["⌘", "C"]}>
                Duplicate
              </ContextMenuItem>
              <ContextMenuItem icon={<Rocket />} shortcut={["⇧", "⌘", "P"]}>
                Publish version
              </ContextMenuItem>
              <ContextMenuSeparator />
              <ContextMenuItem icon={<Trash2 />} destructive>
                Delete file
              </ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>
        ),
        code: `import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuTrigger,
  Button,
  IconPencil,
  IconTrash,
} from "pollen-ui";

<ContextMenu>
  <ContextMenuTrigger>
    <Button variant="outline">Right click anywhere in here</Button>
  </ContextMenuTrigger>
  <ContextMenuContent>
    <ContextMenuLabel>File</ContextMenuLabel>
    <ContextMenuItem icon={<IconPencil />} shortcut={["E"]}>Rename</ContextMenuItem>
    <ContextMenuSeparator />
    <ContextMenuItem icon={<IconTrash />} destructive>Delete file</ContextMenuItem>
  </ContextMenuContent>
</ContextMenu>`,
      },
    ],
    keyboard: [
      { keys: "Arrow Down / Arrow Up", action: "Move between items." },
      { keys: "Enter", action: "Activate the focused item." },
      { keys: "Escape", action: "Close the menu." },
    ],
    props: [
      { name: "ContextMenuTrigger", type: "ReactNode", description: "The area that responds to right click and long press." },
      { name: "onSelect", type: "() => void", description: "Fired when an item is picked; the menu closes first." },
      { name: "destructive", type: "boolean", default: "false", description: "Renders the item in the danger color." },
      { name: "shortcut", type: "string[]", description: "Keys rendered as small key caps on the right." },
    ],
    playground: {
      component: "ContextMenu",
      values: { children: "brand-refresh.fig", className: "rounded-2xl bg-card p-4" },
      controls: [
        { kind: "text", prop: "children", label: "children", placeholder: "File name" },
        { kind: "text", prop: "className", label: "className", placeholder: "rounded-2xl bg-card p-4" },
      ],
    },
  },
  {
    slug: "combobox",
    title: "Combobox",
    description:
      "A select that filters as you type. The listbox is portaled and collision-aware, arrow keys move the active option, Enter commits, and typing filters by label or description.",
    demos: [
      {
        title: "Filter and pick",
        component: (
          <div className="w-full max-w-[300px]">
            <Combobox
              aria-label="Timezone"
              options={timezones}
              defaultValue="cest"
              placeholder="Pick a timezone…"
            />
          </div>
        ),
        code: `import { Combobox } from "pollen-ui";

const timezones = [
  { value: "gmt", label: "London", description: "GMT · UTC+0" },
  { value: "cest", label: "Berlin", description: "CEST · UTC+2" },
  { value: "jst", label: "Tokyo", description: "JST · UTC+9" },
];

const [zone, setZone] = useState("cest");

<Combobox
  options={timezones}
  value={zone}
  onValueChange={setZone}
  placeholder="Pick a timezone…"
/>`,
      },
    ],
    keyboard: [
      { keys: "Arrow Down / Arrow Up", action: "Move the highlight; the list scrolls it into view." },
      { keys: "Home / End", action: "Jump to the first or last option." },
      { keys: "Enter", action: "Select the highlighted option." },
      { keys: "Escape", action: "Close the listbox." },
      { keys: "Tab", action: "Close the listbox and leave the field." },
    ],
    props: [
      { name: "options", type: "ComboboxOption[]", description: "Entries with value, label and optional description." },
      { name: "value / defaultValue", type: "string", description: "Controlled or initial selected value." },
      { name: "emptyMessage", type: "string", default: '"No matches"', description: "Shown when the filter matches nothing." },
      { name: "searchable", type: "boolean", default: "true", description: "Show the search icon in the field." },
      { name: "size", type: '"sm" | "md" | "lg"', default: '"md"', description: "Control height." },
    ],
    playground: {
      component: "Combobox",
      values: { options: true, defaultValue: "cest", placeholder: "Pick a timezone…", emptyMessage: "No matches", searchable: true, size: "md" },
      controls: [
        {
          kind: "boolean",
          prop: "options",
          label: "options",
          attr: 'options={[{ value: "gmt", label: "London" }, { value: "cest", label: "Berlin" }, { value: "et", label: "New York" }, { value: "jst", label: "Tokyo" }]}',
        },
        {
          kind: "select",
          prop: "defaultValue",
          label: "defaultValue",
          options: [
            { value: "gmt", label: "gmt" },
            { value: "cest", label: "cest" },
            { value: "et", label: "et" },
            { value: "jst", label: "jst" },
          ],
        },
        { kind: "text", prop: "placeholder", label: "placeholder", placeholder: "Pick a timezone…" },
        { kind: "text", prop: "emptyMessage", label: "emptyMessage", placeholder: "No matches" },
        { kind: "boolean", prop: "searchable", label: "searchable" },
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
    slug: "pagination",
    title: "Pagination",
    description:
      "Page navigation that collapses sensibly: with many pages you get first, last, an ellipsis, and the neighbors of the current page. There is also a compact arrows-only mode.",
    demos: [
      {
        title: "Many pages",
        component: (
          <Pagination
            total={24}
            defaultValue={9}
            aria-label="Deployment pages"
          />
        ),
        code: `import { Pagination } from "pollen-ui";

<Pagination
  total={24}
  defaultValue={9}
  aria-label="Deployment pages"
/>`,
      },
      {
        title: "Compact",
        component: <Pagination total={12} defaultValue={4} compact aria-label="Compact pagination" />,
        code: `<Pagination total={12} defaultValue={4} compact aria-label="Compact pagination" />`,
      },
    ],
    props: [
      { name: "total", type: "number", description: "Total number of pages." },
      { name: "value / defaultValue", type: "number", description: "Current page, 1-indexed. Controlled or uncontrolled." },
      { name: "onChange", type: "(page: number) => void", description: "Fired with the new page number." },
      { name: "compact", type: "boolean", default: "false", description: "Hide the page numbers, keep the arrows." },
      { name: "siblingCount", type: "number", default: "1", description: "How many neighbors of the current page stay visible." },
    ],
    playground: {
      component: "Pagination",
      values: { total: 24, defaultValue: 9, compact: false, siblingCount: 1 },
      controls: [
        { kind: "number", prop: "total", label: "total", min: 1, max: 100, step: 1 },
        { kind: "number", prop: "defaultValue", label: "defaultValue", min: 1, max: 100, step: 1 },
        { kind: "number", prop: "siblingCount", label: "siblingCount", min: 0, max: 3, step: 1 },
        { kind: "boolean", prop: "compact", label: "compact" },
      ],
    },
  },
  {
    slug: "rating",
    title: "Rating",
    description:
      "Star rating that fills as a continuous sweep under the pointer, speaks with your own label words, and renders fractional fills in readOnly for aggregate scores.",
    demos: [
      {
        title: "Interactive",
        component: <Rating defaultValue={4} aria-label="Your rating" />,
        code: `import { useState } from "react";
import { Rating } from "pollen-ui";

const [score, setScore] = useState(4);

<Rating value={score} onValueChange={setScore} aria-label="Your rating" />`,
      },
      {
        title: "Labels and fractional",
        component: (
          <div className="flex flex-col items-center gap-4">
            <Rating
              defaultValue={0}
              labels={["Poor", "Fair", "Good", "Great", "Exceptional"]}
              aria-label="Your rating"
            />
            <Rating value={4.5} readOnly aria-label="Average rating" />
          </div>
        ),
        code: `<Rating
  defaultValue={0}
  labels={["Poor", "Fair", "Good", "Great", "Exceptional"]}
/>

<Rating value={4.5} readOnly /> {/* fractional fill */}`,
      },
      {
        title: "Read only",
        component: (
          <div className="flex flex-col items-center gap-3">
            <Rating value={5} readOnly hideValue />
            <p className="text-sm text-muted-foreground">
              “Exactly the primitives we were missing.”
            </p>
          </div>
        ),
        code: `<Rating value={5} readOnly hideValue />`,
      },
      {
        title: "Glyphs and tones",
        component: (
          <div className="flex flex-col items-center gap-4">
            <Rating defaultValue={4} glyph="heart" tone="rose" caption="1,204 loves" aria-label="Loves" />
            <Rating defaultValue={3} glyph="thumbs" tone="mint" caption="Was this helpful?" aria-label="Helpful" />
            <Rating defaultValue={5} tone="accent" size="lg" caption="Rate this release" aria-label="Release rating" />
          </div>
        ),
        code: `import { Rating } from "pollen-ui";

<Rating glyph="heart" tone="rose" caption="1,204 loves" />
<Rating glyph="thumbs" tone="mint" caption="Was this helpful?" />
<Rating tone="accent" size="lg" caption="Rate this release" />`,
      },
      {
        title: "Half steps and clearing",
        component: (
          <Rating
            defaultValue={3.5}
            allowHalf
            clearable
            labels={["", "", "OK", "Good", "Great"]}
            caption="Half steps with the pointer. Escape clears."
            aria-label="Half-step rating"
          />
        ),
        code: `import { Rating } from "pollen-ui";

<Rating
  allowHalf
  clearable
  labels={["", "", "OK", "Good", "Great"]}
  caption="Half steps with the pointer. Escape clears."
/>`,
      },
    ],
    props: [
      { name: "max", type: "number", default: "5", description: "Number of glyphs." },
      { name: "value / defaultValue", type: "number", description: "Controlled or initial rating." },
      { name: "readOnly", type: "boolean", default: "false", description: "Static glyphs; accepts fractional values." },
      { name: "labels", type: "string[]", description: "Word shown for the hovered or current value." },
      { name: "caption", type: "ReactNode", description: "Extra line under the control, e.g. a review count." },
      { name: "glyph", type: '"star" | "heart" | "thumbs" | "petal"', default: '"star"', description: "Which glyph to draw." },
      { name: "tone", type: '"amber" | "accent" | "rose" | "mint" | "ink"', default: '"amber"', description: "Named fill colour. A raw CSS colour wins via `color`." },
      { name: "allowHalf", type: "boolean", default: "false", description: "Permit half-step commits from the pointer." },
      { name: "clearable", type: "boolean", default: "false", description: "Second click (or Escape) clears to 0." },
      { name: "size", type: '"sm" | "md" | "lg"', default: '"md"', description: "Glyph and text size." },
    ],
    playground: {
      component: "Rating",
      values: { defaultValue: 4, max: 5, readOnly: false, hideValue: false, size: "md", glyph: "star", tone: "amber", allowHalf: false, clearable: false },
      controls: [
        { kind: "number", prop: "defaultValue", label: "defaultValue", min: 0, max: 10, step: 0.5 },
        { kind: "number", prop: "max", label: "max", min: 1, max: 10, step: 1 },
        { kind: "boolean", prop: "readOnly", label: "readOnly" },
        { kind: "boolean", prop: "hideValue", label: "hideValue" },
        {
          kind: "select",
          prop: "glyph",
          label: "glyph",
          options: [
            { value: "star", label: "star" },
            { value: "heart", label: "heart" },
            { value: "thumbs", label: "thumbs" },
            { value: "petal", label: "petal" },
          ],
        },
        {
          kind: "select",
          prop: "tone",
          label: "tone",
          options: [
            { value: "amber", label: "amber" },
            { value: "accent", label: "accent" },
            { value: "rose", label: "rose" },
            { value: "mint", label: "mint" },
            { value: "ink", label: "ink" },
          ],
        },
        { kind: "boolean", prop: "allowHalf", label: "allowHalf" },
        { kind: "boolean", prop: "clearable", label: "clearable" },
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
    slug: "tag-input",
    title: "Tag input",
    description:
      "Type and press Enter to add a chip, Backspace on an empty field removes the last one, and every chip removes itself. Duplicates are rejected with a small shake.",
    demos: [
      {
        title: "Team roles",
        component: (
          <div className="w-full max-w-[340px]">
            <TagInput defaultValue={["design", "frontend", "docs"]} placeholder="Add role…" aria-label="Roles" />
          </div>
        ),
        code: `import { TagInput } from "pollen-ui";

const [roles, setRoles] = useState(["design", "frontend", "docs"]);

<TagInput
  value={roles}
  onValueChange={setRoles}
  placeholder="Add role…"
/>`,
      },
      {
        title: "Limited and validated",
        component: (
          <div className="w-full max-w-[340px]">
            <TagInput max={4} placeholder="Up to 4 tags…" aria-label="Limited tags" />
          </div>
        ),
        code: `<TagInput max={4} unique placeholder="Up to 4 tags…" />`,
      },
    ],
    props: [
      { name: "value / defaultValue", type: "string[]", description: "Controlled or initial tag list." },
      { name: "onValueChange", type: "(tags: string[]) => void", description: "Fired with the next list." },
      { name: "max", type: "number", description: "Maximum number of tags; further input is ignored." },
      { name: "unique", type: "boolean", default: "true", description: "Reject duplicates with a shake." },
    ],
    playground: {
      component: "TagInput",
      values: { placeholder: "Add a tag…", max: 4, unique: true, size: "md" },
      controls: [
        { kind: "text", prop: "placeholder", label: "placeholder", placeholder: "Add a tag…" },
        { kind: "number", prop: "max", label: "max", min: 1, max: 12, step: 1 },
        { kind: "boolean", prop: "unique", label: "unique" },
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
    },
  },
  {
    slug: "steps",
    title: "Steps",
    description:
      "A horizontal progress stepper for onboarding and setup flows. Finished steps show a check, the current step carries the accent, and the connector fills as progress moves.",
    demos: [
      {
        title: "Onboarding",
        component: (
          <div className="w-full max-w-[420px]">
            <Steps
              value={1}
              steps={[
                { title: "Workspace", description: "Name it" },
                { title: "Invite", description: "Add your team" },
                { title: "Deploy", description: "Ship it" },
              ]}
            />
          </div>
        ),
        code: `import { Steps } from "pollen-ui";

<Steps
  value={1}
  steps={[
    { title: "Workspace", description: "Name it" },
    { title: "Invite", description: "Add your team" },
    { title: "Deploy", description: "Ship it" },
  ]}
/>`,
      },
      {
        title: "Almost done",
        component: (
          <div className="w-full max-w-[420px]">
            <Steps
              value={2}
              steps={[
                { title: "Repository" },
                { title: "Build" },
                { title: "Domain" },
                { title: "Live" },
              ]}
            />
          </div>
        ),
        code: `<Steps
  value={2}
  steps={[
    { title: "Repository" },
    { title: "Build" },
    { title: "Domain" },
    { title: "Live" },
  ]}
/>`,
      },
    ],
    props: [
      { name: "steps", type: "StepItem[]", description: "Entries with title and optional description." },
      { name: "value", type: "number", description: "Index of the current step. Steps before it render complete." },
    ],
    playground: {
      component: "Steps",
      values: { steps: true, value: 1 },
      controls: [
        {
          kind: "boolean",
          prop: "steps",
          label: "steps",
          attr: 'steps={[{ title: "Workspace", description: "Name it" }, { title: "Invite", description: "Add your team" }, { title: "Deploy", description: "Ship it" }]}',
        },
        { kind: "number", prop: "value", label: "value", min: 0, max: 2, step: 1 },
      ],
    },
  },
  {
    slug: "timeline",
    title: "Timeline",
    description:
      "A quiet vertical timeline for activity feeds, changelogs and deploy logs. The connecting line runs behind the dots and stops at the last item so the list ends cleanly.",
    demos: [
      {
        title: "Deploy log",
        component: (
          <div className="w-full max-w-[360px]">
            <Timeline
              items={[
                {
                  title: "Build passed",
                  meta: "12:04:32",
                  description: "1,204 modules bundled in 41s.",
                  tone: "success",
                },
                {
                  title: "Tests green",
                  meta: "12:04:11",
                  description: "312 tests, 0 failed, 2 skipped.",
                  tone: "success",
                },
                {
                  title: "Uploading artifacts",
                  meta: "12:03:48",
                  tone: "accent",
                },
                {
                  title: "Queued by push to main",
                  meta: "12:03:40",
                },
              ]}
            />
          </div>
        ),
        code: `import { Timeline } from "pollen-ui";

<Timeline
  items={[
    { title: "Build passed", meta: "12:04:32", tone: "success" },
    { title: "Tests green", meta: "12:04:11", tone: "success" },
    { title: "Uploading artifacts", meta: "12:03:48", tone: "accent" },
    { title: "Queued by push to main", meta: "12:03:40" },
  ]}
/>`,
      },
    ],
    props: [
      { name: "items", type: "TimelineItem[]", description: "Entries with title, meta, description and tone." },
      { name: "tone", type: '"neutral" | "accent" | "success" | "warning" | "danger"', default: '"neutral"', description: "Marker color of a dot." },
    ],
    playground: {
      component: "Timeline",
      values: { items: true },
      controls: [
        {
          kind: "boolean",
          prop: "items",
          label: "items",
          attr: 'items={[{ title: "Build passed", meta: "12:04:32", description: "1,204 modules bundled in 41s.", tone: "success" }, { title: "Tests green", meta: "12:04:11", description: "312 tests, 0 failed.", tone: "success" }, { title: "Uploading artifacts", meta: "12:03:48", tone: "accent" }, { title: "Queued by push to main", meta: "12:03:40" }]}',
        },
      ],
    },
  },
  {
    slug: "empty-state",
    title: "Empty state",
    description:
      "For genuinely empty views: searches with no results, lists with nothing in them. One icon, one sentence, one action. No filler illustrations.",
    demos: [
      {
        title: "No results",
        component: (
          <div className="w-full max-w-[380px] rounded-2xl bg-card p-2 shadow-[var(--pollen-shadow-sm)]">
            <EmptyState
              size="sm"
              icon={<Search />}
              title="No deployments found"
              description="Try a different branch, or clear the status filter."
              action={<Button size="sm" variant="secondary">Clear filters</Button>}
            />
          </div>
        ),
        code: `import { Button, EmptyState, IconSearch } from "pollen-ui";

<EmptyState
  icon={<IconSearch />}
  title="No deployments found"
  description="Try a different branch, or clear the status filter."
  action={<Button size="sm" variant="secondary">Clear filters</Button>}
/>`,
      },
      {
        title: "First run",
        component: (
          <div className="w-full max-w-[380px] rounded-2xl bg-card p-2 shadow-[var(--pollen-shadow-sm)]">
            <EmptyState
              size="sm"
              icon={<PackageOpen />}
              title="No projects yet"
              description="Import a repository and your first deploy takes about a minute."
              action={<Button size="sm">New project</Button>}
              secondaryAction={
                <Button size="sm" variant="ghost">Read the guide</Button>
              }
            />
          </div>
        ),
        code: `import { Button, EmptyState, IconPackage } from "pollen-ui";

<EmptyState
  icon={<IconPackage />}
  title="No projects yet"
  description="Import a repository and your first deploy takes about a minute."
  action={<Button size="sm">New project</Button>}
  secondaryAction={<Button size="sm" variant="ghost">Read the guide</Button>}
/>`,
      },
      {
        title: "Scenes and tones",
        component: (
          <div className="grid w-full max-w-[420px] gap-3 sm:grid-cols-2">
            <div className="rounded-2xl bg-card p-2 shadow-[var(--pollen-shadow-sm)]">
              <EmptyState
                size="sm"
                scene="search"
                tone="accent"
                title="No matches"
                description="Loosen the filters and search again."
              />
            </div>
            <div className="rounded-2xl bg-card p-2 shadow-[var(--pollen-shadow-sm)]">
              <EmptyState
                size="sm"
                scene="inbox"
                tone="neutral"
                title="Inbox zero"
                description="New mentions land here."
              />
            </div>
            <div className="rounded-2xl bg-card p-2 shadow-[var(--pollen-shadow-sm)]">
              <EmptyState
                size="sm"
                scene="error"
                tone="danger"
                title="Build failed"
                description="The last two steps did not finish."
                action={<Button size="sm" variant="secondary">View logs</Button>}
              />
            </div>
            <div className="rounded-2xl bg-card p-2 shadow-[var(--pollen-shadow-sm)]">
              <EmptyState
                size="sm"
                scene="chat"
                plain
                title="No messages yet"
                description="Say hello to start the thread."
              />
            </div>
          </div>
        ),
        code: `import { EmptyState } from "pollen-ui";

<EmptyState scene="search" tone="accent" title="No matches" />
<EmptyState scene="inbox" title="Inbox zero" />
<EmptyState scene="error" tone="danger" title="Build failed" />
<EmptyState scene="chat" plain title="No messages yet" />`,
      },
    ],
    props: [
      { name: "icon", type: "ReactNode", description: "Custom icon slot. Beats `scene`." },
      { name: "scene", type: '"search" | "inbox" | "box" | "code" | "chat" | "error"', description: "A built-in vignette." },
      { name: "tone", type: '"neutral" | "accent" | "success" | "warning" | "danger"', default: '"neutral"', description: "Colour of the scene tile." },
      { name: "plain", type: "boolean", default: "false", description: "Drop the tile; words only." },
      { name: "title", type: "string", description: "One clear sentence about what is missing." },
      { name: "action / secondaryAction", type: "ReactNode", description: "Usually one Button each." },
      { name: "size", type: '"sm" | "md"', default: '"md"', description: "Compact for cards, regular for pages." },
    ],
    playground: {
      component: "EmptyState",
      values: { title: "No deployments found", description: "Try a different branch, or clear the status filter.", size: "sm", scene: "search", tone: "neutral" },
      controls: [
        { kind: "text", prop: "title", label: "title", placeholder: "No results found" },
        { kind: "text", prop: "description", label: "description", placeholder: "What to try next" },
        {
          kind: "select",
          prop: "scene",
          label: "scene",
          options: [
            { value: "search", label: "search" },
            { value: "inbox", label: "inbox" },
            { value: "box", label: "box" },
            { value: "code", label: "code" },
            { value: "chat", label: "chat" },
            { value: "error", label: "error" },
          ],
        },
        {
          kind: "select",
          prop: "tone",
          label: "tone",
          options: [
            { value: "neutral", label: "neutral" },
            { value: "accent", label: "accent" },
            { value: "success", label: "success" },
            { value: "warning", label: "warning" },
            { value: "danger", label: "danger" },
          ],
        },
        { kind: "boolean", prop: "plain", label: "plain" },
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
    },
  },
  {
    slug: "stat",
    title: "Stat",
    description:
      "One metric and its context: a formatted value, a quiet label, and a colored delta against the previous period. Built for dashboards that stay calm.",
    demos: [
      {
        title: "Metrics",
        component: (
          <div className="grid w-full max-w-[420px] gap-x-8 gap-y-6 sm:grid-cols-2">
            <Stat value="48,201" label="Requests today" delta={12.4} deltaLabel="vs yesterday" />
            <Stat value="99.98%" label="Uptime, 30 days" delta={0.02} deltaLabel="vs last month" />
            <Stat value="312" label="Open PRs" delta={-8.1} deltaLabel="vs last week" />
            <Stat value="30.1 kB" label="Bundle, gzipped" delta={-3.5} deltaLabel="since 2.0" />
          </div>
        ),
        code: `import { Stat } from "pollen-ui";

<Stat value="48,201" label="Requests today" delta={12.4} deltaLabel="vs yesterday" />
<Stat value="99.98%" label="Uptime, 30 days" delta={0.02} deltaLabel="vs last month" />
<Stat value="312" label="Open PRs" delta={-8.1} deltaLabel="vs last week" />`,
      },
    ],
    props: [
      { name: "value", type: "string", description: "The number, already formatted." },
      { name: "label", type: "string", description: "Quiet caption above the value." },
      { name: "delta", type: "number", description: "Change against the previous period, without the sign." },
      { name: "deltaLabel", type: "string", description: "Context for the delta, e.g. “vs last month”." },
    ],
    playground: {
      component: "Stat",
      values: { value: "48,201", label: "Requests today", delta: 12.4, deltaLabel: "vs yesterday" },
      controls: [
        { kind: "text", prop: "value", label: "value", placeholder: "48,201" },
        { kind: "text", prop: "label", label: "label", placeholder: "Requests today" },
        { kind: "number", prop: "delta", label: "delta", min: -100, max: 100, step: 0.1 },
        { kind: "text", prop: "deltaLabel", label: "deltaLabel", placeholder: "vs yesterday" },
      ],
    },
  },
  {
    slug: "number-ticker",
    title: "Number ticker",
    description:
      "Counts from zero to its target with one eased motion the first time it scrolls into view, and re-counts whenever the value changes. Reduced motion snaps straight to the number.",
    demos: [
      {
        title: "In view",
        component: (
          <div className="flex flex-wrap items-end justify-center gap-x-10 gap-y-6">
            <div className="text-center">
              <p className="text-5xl font-semibold tracking-[-0.02em]">
                <NumberTicker value={46} />
              </p>
              <p className="mt-1.5 text-sm text-muted-foreground">Components</p>
            </div>
            <div className="text-center">
              <p className="text-5xl font-semibold tracking-[-0.02em]">
                <NumberTicker value={23.4} decimals={1} suffix=" kB" />
              </p>
              <p className="mt-1.5 text-sm text-muted-foreground">Gzipped</p>
            </div>
            <div className="text-center">
              <p className="text-5xl font-semibold tracking-[-0.02em]">
                <NumberTicker value={99.98} decimals={2} suffix="%" />
              </p>
              <p className="mt-1.5 text-sm text-muted-foreground">Uptime</p>
            </div>
          </div>
        ),
        code: `import { NumberTicker } from "pollen-ui";

<NumberTicker value={46} />
<NumberTicker value={23.4} decimals={1} suffix=" kB" />
<NumberTicker value={99.98} decimals={2} suffix="%" />`,
      },
    ],
    props: [
      { name: "value", type: "number", description: "Target value. Re-animates when it changes." },
      { name: "decimals", type: "number", default: "0", description: "Digits after the decimal point." },
      { name: "prefix / suffix", type: "string", description: "Static text around the number." },
      { name: "duration", type: "number", default: "1.2", description: "Seconds for the count." },
      { name: "startOnView", type: "boolean", default: "true", description: "Start when scrolled into view." },
    ],
    playground: {
      component: "NumberTicker",
      values: { value: 46, decimals: 0, suffix: "", duration: 1.2 },
      controls: [
        { kind: "number", prop: "value", label: "value", min: 0, max: 10000, step: 1 },
        { kind: "number", prop: "decimals", label: "decimals", min: 0, max: 3, step: 1 },
        { kind: "text", prop: "suffix", label: "suffix", placeholder: " kB" },
        { kind: "number", prop: "duration", label: "duration", min: 0.4, max: 5, step: 0.2 },
      ],
    },
  },
  {
    slug: "typewriter",
    title: "Typewriter",
    description:
      "Types text one character at a time with a steady caret, holds, then optionally starts over. With reduced motion the full text simply appears.",
    demos: [
      {
        title: "Headline",
        component: (
          <div className="text-center">
            <p className="text-3xl font-semibold tracking-[-0.02em]">
              <Typewriter text="npm install pollen-ui" startOnView />
            </p>
            <p className="mt-3 text-sm text-faint">
              It types once when scrolled into view, then keeps still.
            </p>
          </div>
        ),
        code: `import { Typewriter } from "pollen-ui";

<Typewriter text="npm install pollen-ui" startOnView />`,
      },
      {
        title: "Loop",
        component: (
          <div className="text-center">
            <p className="text-3xl font-semibold tracking-[-0.02em]">
              <Typewriter
                text="Build interfaces that feel finished."
                loop
                holdTime={1800}
              />
            </p>
          </div>
        ),
        code: `<Typewriter text="Build interfaces that feel finished." loop holdTime={1800} />`,
      },
    ],
    props: [
      { name: "text", type: "string", description: "Text to type. Re-types when it changes." },
      { name: "speed", type: "number", default: "34", description: "Milliseconds per character." },
      { name: "loop", type: "boolean", default: "false", description: "Restart after holding." },
      { name: "caret", type: "boolean", default: "true", description: "Blinking caret while typing." },
      { name: "startOnView", type: "boolean", default: "false", description: "Start when scrolled into view." },
    ],
    playground: {
      component: "Typewriter",
      values: { text: "npm install pollen-ui", speed: 34, loop: false, caret: true, startOnView: false },
      controls: [
        { kind: "text", prop: "text", label: "text", placeholder: "Text to type" },
        { kind: "number", prop: "speed", label: "speed", min: 10, max: 120, step: 2 },
        { kind: "boolean", prop: "loop", label: "loop" },
        { kind: "boolean", prop: "caret", label: "caret" },
        { kind: "boolean", prop: "startOnView", label: "startOnView" },
      ],
    },
  },
  {
    slug: "chat",
    title: "Chat",
    description:
      "A complete messaging surface, not a bubble: grouped history with date dividers and delivery ticks, hover (or tap, on touch) reactions with a burst animation, reply quotes, a self-growing composer with emoji picker, a typing indicator, and a useChat engine that runs the whole lifecycle.",
    demos: [
      {
        title: "Live conversation",
        align: "stretch",
        component: (
          <div className="flex justify-center py-2">
            <ChatDemo />
          </div>
        ),
        code: `import { ChatThread, ChatInput, useChat } from "pollen-ui";

const chat = useChat({
  autoReply: {
    author: { name: "Ava Chen" },
    messages: ["Shipped.", "Open source is undefeated."],
  },
});

<div className="flex h-[440px] flex-col">
  <ChatThread
    messages={chat.messages}
    typing={chat.typing}
    onReact={chat.react}
  />
  <ChatInput onSend={chat.send} maxLength={280} />
</div>`,
      },
    ],
    keyboard: [
      { keys: "Enter", action: "Send the message from the composer." },
      { keys: "Shift + Enter", action: "Insert a new line instead of sending." },
      { keys: "Escape", action: "Close the emoji picker and return focus to the composer." },
    ],
    props: [
      { name: "messages", type: "ChatMessageData[]", default: "[]", description: "Thread content. Own bubbles sit right with delivery ticks." },
      { name: "typing", type: "{ name, avatar } | null", default: "null", description: "Author shown as typing under the thread." },
      { name: "onReact", type: "(messageId, emoji) => void", default: "-", description: "Toggle a reaction. The burst plays on the bubble. Hover a bubble on pointer devices; tap it on touch." },
      { name: "onReply", type: "(message) => void", default: "-", description: "Adds a reply action to the hover toolbar." },
      { name: "autoScroll", type: "boolean", default: "true", description: "Follow new messages to the bottom." },
      { name: "ChatInput.onSend", type: "(text) => void", default: "-", description: "Enter sends, Shift+Enter breaks the line." },
      { name: "useChat", type: "(options) => engine", default: "-", description: "Runs sending, sent, delivered, read, and auto-replies." },
    ],
    playground: {
      component: "ChatThread",
      values: { messages: true, typing: true, autoScroll: false },
      controls: [
        {
          kind: "boolean",
          prop: "messages",
          label: "messages",
          attr: 'messages={[{ id: "m1", author: { name: "Ava Chen" }, content: "Morning! The nav refactor is on main.", timestamp: Date.now() - 3600000 }, { id: "m2", author: { name: "You" }, content: "Merged. Shipping it with the 2.1 cut.", timestamp: Date.now() - 1800000, own: true, status: "read" }, { id: "m3", author: { name: "Ava Chen" }, content: "Perfect. Writing the changelog now.", timestamp: Date.now() - 60000 }]}',
        },
        { kind: "boolean", prop: "typing", label: "typing", attr: 'typing={{ name: "Ava Chen" }}' },
        { kind: "boolean", prop: "autoScroll", label: "autoScroll" },
      ],
    },
  },
  {
    slug: "activity-heatmap",
    title: "Activity Heatmap",
    description:
      "A calendar heatmap: one small square per day, shade per amount. Columns are weeks, rows are weekdays, month labels ride the columns they start in. The grid speaks a real summary - total, active days, range, busiest day - and every cell carries its own tooltip.",
    demos: [
      {
        title: "Half a year of deploys",
        component: <ActivityHeatmapDemo />,
        code: `import { ActivityHeatmap, type HeatmapDatum } from "pollen-ui";

const data: HeatmapDatum[] = [
  { date: "2026-06-01", count: 7 },
  { date: "2026-06-02", count: 12 },
  // ...one entry per measured day; missing days read as zero.
];

<ActivityHeatmap data={data} weeks={30} />`,
      },
      {
        title: "Bigger cells, weekday labels",
        component: <ActivityHeatmapSizesDemo />,
        code: `import { ActivityHeatmap, type HeatmapDatum } from "pollen-ui";

const data: HeatmapDatum[] = [
  { date: "2026-09-01", count: 9 },
  { date: "2026-09-04", count: 14 },
  { date: "2026-09-09", count: 3 },
  { date: "2026-09-12", count: 18 },
  { date: "2026-09-15", count: 7 },
  { date: "2026-09-18", count: 12 },
  { date: "2026-09-21", count: 5 },
  { date: "2026-09-24", count: 16 },
  { date: "2026-09-27", count: 8 },
  { date: "2026-09-30", count: 2 },
  { date: "2026-10-02", count: 11 },
  { date: "2026-10-04", count: 19 },
];

<ActivityHeatmap
  data={data}
  weeks={18}
  cellSize={14}
  levels={5}
  weekdayLabels
/>

// The legend under this demo is plain markup:
// color-mix(in srgb, var(--pollen-accent) N%, var(--pollen-fill)).`,
      },
    ],
    props: [
      { name: "data", type: "HeatmapDatum[] | Record<string, number>", description: "One entry per measured day. The grid ends on the latest entry (or today) and stretches back to fill weeks." },
      { name: "weeks", type: "number", default: "26", description: "Number of week columns." },
      { name: "levels", type: "number", default: "4", description: "Shade bands above zero, stepping from fill toward the accent." },
      { name: "cellSize", type: "number", default: "11", description: "Cell size in pixels." },
      { name: "gap", type: "number", default: "3", description: "Gap between cells in pixels." },
      { name: "monthLabels", type: "boolean", default: "true", description: "Month labels along the top." },
      { name: "weekdayLabels", type: "boolean", default: "false", description: "Mon / Wed / Fri labels on the left." },
      { name: "summary", type: "string", description: "Overrides the generated accessible summary." },
    ],
    playground: {
      component: "ActivityHeatmap",
      values: { weeks: 26, cellSize: 11, gap: 3, levels: 4 },
      imports: ["type HeatmapDatum"],
      prelude: [
        "// One entry per measured day; missing days read as zero.",
        "const data: HeatmapDatum[] = [",
        '  { date: "2026-09-01", count: 3 },',
        '  { date: "2026-09-02", count: 9 },',
        '  { date: "2026-09-05", count: 14 },',
        '  { date: "2026-09-08", count: 6 },',
        '  { date: "2026-09-11", count: 18 },',
        '  { date: "2026-09-14", count: 2 },',
        '  { date: "2026-09-17", count: 11 },',
        '  { date: "2026-09-20", count: 7 },',
        '  { date: "2026-09-23", count: 16 },',
        '  { date: "2026-09-26", count: 5 },',
        '  { date: "2026-09-29", count: 12 },',
        '  { date: "2026-10-01", count: 8 },',
        '  { date: "2026-10-03", count: 19 },',
        '  { date: "2026-10-05", count: 4 },',
        "];",
      ].join("\n"),
      attrs: "data={data}",
      controls: [
        { kind: "number", prop: "weeks", label: "weeks", min: 8, max: 40, step: 1 },
        { kind: "number", prop: "cellSize", label: "cellSize", min: 8, max: 18, step: 1 },
        { kind: "number", prop: "gap", label: "gap", min: 1, max: 6, step: 1 },
        { kind: "number", prop: "levels", label: "levels", min: 2, max: 6, step: 1 },
        { kind: "boolean", prop: "monthLabels", label: "monthLabels" },
        { kind: "boolean", prop: "weekdayLabels", label: "weekdayLabels" },
      ],
    },
  },

];
