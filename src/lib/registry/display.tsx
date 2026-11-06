import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Alert,
  Avatar,
  AvatarGroup,
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  CodeBlock,
  Kbd,
  Progress,
  ProgressRing,
  SegmentedControl,
  Skeleton,
  SkeletonText,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  IconGauge,
} from "pollen-ui";
import type { RegistryEntry } from "./types";
import { DataTableDemo } from "@/components/demos/data-table-demo";

const members = [
  { name: "Ada Lovelace", role: "Owner", status: "Active", plan: "Pro" },
  { name: "Grace Hopper", role: "Admin", status: "Active", plan: "Pro" },
  { name: "Alan Turing", role: "Developer", status: "Invited", plan: "Hobby" },
];

const memberCode = `import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "pollen-ui";

const members = [
  { name: "Ada Lovelace", role: "Owner", status: "Active", plan: "Pro" },
  { name: "Grace Hopper", role: "Admin", status: "Active", plan: "Pro" },
  { name: "Alan Turing", role: "Developer", status: "Invited", plan: "Hobby" },
];

<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Name</TableHead>
      <TableHead>Role</TableHead>
      <TableHead>Status</TableHead>
      <TableHead className="text-right">Plan</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {members.map((member) => (
      <TableRow key={member.name}>
        <TableCell className="font-medium">{member.name}</TableCell>
        <TableCell className="text-muted-foreground">{member.role}</TableCell>
        <TableCell className="text-muted-foreground">{member.status}</TableCell>
        <TableCell className="text-right text-muted-foreground">{member.plan}</TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>`;

export const display: RegistryEntry[] = [
  {
    slug: "tabs",
    title: "Tabs",
    description:
      "Switch between views in place. The indicator glides between triggers on a spring, and both an enclosed and an underline style ship by default.",
    demos: [
      {
        title: "Enclosed",
        component: (
          <Tabs defaultValue="preview" className="w-full max-w-[320px]">
            <TabsList aria-label="View">
              <TabsTrigger value="preview">Preview</TabsTrigger>
              <TabsTrigger value="code">Code</TabsTrigger>
              <TabsTrigger value="logs">Logs</TabsTrigger>
            </TabsList>
            <TabsContent value="preview" className="pt-4 text-sm text-muted-foreground">
              A live rendering of your page, updated on every deploy.
            </TabsContent>
            <TabsContent value="code" className="pt-4 text-sm text-muted-foreground">
              The source that produced this deployment.
            </TabsContent>
            <TabsContent value="logs" className="pt-4 text-sm text-muted-foreground">
              Build output, streamed as it happens.
            </TabsContent>
          </Tabs>
        ),
        code: `import { Tabs, TabsContent, TabsList, TabsTrigger } from "pollen-ui";

<Tabs defaultValue="preview">
  <TabsList>
    <TabsTrigger value="preview">Preview</TabsTrigger>
    <TabsTrigger value="code">Code</TabsTrigger>
    <TabsTrigger value="logs">Logs</TabsTrigger>
  </TabsList>
  <TabsContent value="preview">A live rendering of your page.</TabsContent>
  <TabsContent value="code">The source that produced this deployment.</TabsContent>
  <TabsContent value="logs">Build output, streamed as it happens.</TabsContent>
</Tabs>`,
      },
      {
        title: "Underline",
        component: (
          <Tabs defaultValue="overview" variant="line" className="w-full max-w-[320px]">
            <TabsList aria-label="Project">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="domains">Domains</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="pt-4 text-sm text-muted-foreground">
              Traffic, performance and errors at a glance.
            </TabsContent>
            <TabsContent value="analytics" className="pt-4 text-sm text-muted-foreground">
              Audience and usage, updated hourly.
            </TabsContent>
            <TabsContent value="domains" className="pt-4 text-sm text-muted-foreground">
              Nameservers and SSL status per domain.
            </TabsContent>
          </Tabs>
        ),
        code: `<Tabs defaultValue="overview" variant="line">
  <TabsList>
    <TabsTrigger value="overview">Overview</TabsTrigger>
    <TabsTrigger value="analytics">Analytics</TabsTrigger>
    <TabsTrigger value="domains">Domains</TabsTrigger>
  </TabsList>
  <TabsContent value="overview">Traffic, performance and errors at a glance.</TabsContent>
</Tabs>`,
      },
    ],
    keyboard: [
      { keys: "Arrow Right / Arrow Left", action: "Move between tabs, skipping disabled ones." },
      { keys: "Home / End", action: "Jump to the first or last tab." },
    ],
    props: [
      { name: "value", type: "string", description: "Controlled active tab." },
      { name: "defaultValue", type: "string", description: "Initial active tab." },
      { name: "variant", type: '"enclosed" | "line"', default: '"enclosed"', description: "Visual style of the list." },
    ],
    playground: {
      component: "Tabs",
      values: { defaultValue: "preview", variant: "enclosed" },
      controls: [
        {
          kind: "select",
          prop: "defaultValue",
          label: "defaultValue",
          options: [
            { value: "preview", label: "preview" },
            { value: "code", label: "code" },
            { value: "logs", label: "logs" },
          ],
        },
        {
          kind: "select",
          prop: "variant",
          label: "variant",
          options: [
            { value: "enclosed", label: "enclosed" },
            { value: "line", label: "line" },
          ],
        },
      ],
    },
  },
  {
    slug: "breadcrumb",
    title: "Breadcrumb",
    description:
      "Trail of where you are. Separators and the current page are wired for accessibility out of the box.",
    demos: [
      {
        title: "Basic",
        component: (
          <Breadcrumb>
            <BreadcrumbItem>
              <BreadcrumbLink href="/docs">Docs</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/docs">Components</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbEllipsis />
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
            </BreadcrumbItem>
          </Breadcrumb>
        ),
        code: `import {
  Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator,
} from "pollen-ui";

<Breadcrumb>
  <BreadcrumbItem><BreadcrumbLink href="/">Docs</BreadcrumbLink></BreadcrumbItem>
  <BreadcrumbSeparator />
  <BreadcrumbItem><BreadcrumbLink href="/components">Components</BreadcrumbLink></BreadcrumbItem>
  <BreadcrumbSeparator />
  <BreadcrumbItem><BreadcrumbPage>Breadcrumb</BreadcrumbPage></BreadcrumbItem>
</Breadcrumb>`,
      },
    ],
    playground: {
      component: "Breadcrumb",
      values: { children: "Docs / Components / Breadcrumb" },
      controls: [
        { kind: "text", prop: "children", label: "children", placeholder: "Docs / Components" },
      ],
    },
  },
  {
    slug: "accordion",
    title: "Accordion",
    description:
      "Collapsible sections for FAQs and settings. Height animates with an ease-out curve, and the plus rotates into a close mark.",
    demos: [
      {
        title: "Frequently asked",
        component: (
          <Accordion type="single" className="w-full max-w-[420px]">
            <AccordionItem value="what">
              <AccordionTrigger value="what">What is Pollen UI?</AccordionTrigger>
              <AccordionContent value="what">
                A React component library for Next.js with light and dark
                themes, spring-based motion, and typed props throughout.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="themes">
              <AccordionTrigger value="themes">Does it support dark mode?</AccordionTrigger>
              <AccordionContent value="themes">
                Yes. Both themes ship in the box and follow the system
                setting. Switch with a single class on the html element.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="license">
              <AccordionTrigger value="license">Can I use it commercially?</AccordionTrigger>
              <AccordionContent value="license">
                Yes. Pollen UI is MIT licensed, so it is free for personal
                and commercial work.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        ),
        code: `import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "pollen-ui";

<Accordion type="single">
  <AccordionItem value="what">
    <AccordionTrigger value="what">What is Pollen UI?</AccordionTrigger>
    <AccordionContent value="what">
      A React component library for Next.js.
    </AccordionContent>
  </AccordionItem>
</Accordion>`,
      },
      {
        title: "Variants and icons",
        component: (
          <div className="w-full max-w-[440px] space-y-5">
            <Accordion type="single" variant="card" icon="chevron" defaultValue={["plan"]}>
              <AccordionItem value="plan">
                <AccordionTrigger value="plan" leading={<IconGauge />}>
                  Usage-based pricing
                </AccordionTrigger>
                <AccordionContent value="plan">
                  Pay for what you render. The first 10,000 views a month are free.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="team">
                <AccordionTrigger value="team" meta="3 seats">
                  Team workspaces
                </AccordionTrigger>
                <AccordionContent value="team">
                  Shared tokens, shared history, one bill.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            <Accordion type="single" variant="bordered" icon="arrow">
              <AccordionItem value="a11y">
                <AccordionTrigger value="a11y">Accessibility</AccordionTrigger>
                <AccordionContent value="a11y">
                  Keyboard operable, labelled, and reduced-motion aware.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        ),
        code: `import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger, IconGauge,
} from "pollen-ui";

<Accordion type="single" variant="card" icon="chevron">
  <AccordionItem value="plan">
    <AccordionTrigger value="plan" leading={<IconGauge />} meta="3 seats">
      Team workspaces
    </AccordionTrigger>
    <AccordionContent value="plan">...</AccordionContent>
  </AccordionItem>
</Accordion>

<Accordion type="single" variant="bordered" icon="arrow">...</Accordion>`,
      },
    ],
    keyboard: [
      { keys: "Enter / Space", action: "Toggle the focused section. Each header is a real button." },
    ],
    props: [
      { name: "type", type: '"single" | "multiple"', default: '"single"', description: "Whether one or many items can be open." },
      { name: "defaultValue", type: "string[]", default: "[]", description: "Items open on first render." },
      { name: "value / onValueChange", type: "string[]", default: "-", description: "Controlled open ids." },
      { name: "variant", type: '"fill" | "flush" | "bordered" | "card"', default: '"fill"', description: "Visual treatment of the items." },
      { name: "icon", type: '"plus" | "chevron" | "arrow" | "none"', default: '"plus"', description: "The disclosure glyph and its rotation." },
      { name: "size", type: '"sm" | "md" | "lg"', default: '"md"', description: "Trigger and content padding." },
      { name: "leading", type: "ReactNode", description: "Slot before the title on a trigger." },
      { name: "meta", type: "ReactNode", description: "Quiet content pinned before the glyph." },
      { name: "disabled", type: "boolean", description: "On an item: greys it out and swallows clicks." },
    ],
    playground: {
      component: "Accordion",
      values: { type: "single", defaultValue: true, variant: "fill", icon: "plus", size: "md" },
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
        { kind: "boolean", prop: "defaultValue", label: "defaultValue", attr: 'defaultValue={["what"]}' },
        {
          kind: "select",
          prop: "variant",
          label: "variant",
          options: [
            { value: "fill", label: "fill" },
            { value: "flush", label: "flush" },
            { value: "bordered", label: "bordered" },
            { value: "card", label: "card" },
          ],
        },
        {
          kind: "select",
          prop: "icon",
          label: "icon",
          options: [
            { value: "plus", label: "plus" },
            { value: "chevron", label: "chevron" },
            { value: "arrow", label: "arrow" },
            { value: "none", label: "none" },
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
    slug: "avatar",
    title: "Avatar",
    description:
      "A person or a team. Photos crop to the shape, the person's name is announced to screen readers, initials fill in when there is nothing to show, and the gradient variant derives a stable duotone from the name. Groups overlap with a ring and end in a labelled overflow chip.",
    demos: [
      {
        title: "Photos",
        component: (
          <div className="flex flex-col items-center gap-5">
            <div className="flex items-end gap-3">
              <Avatar size={24} src="/avatars/ada.jpg" fallback="Ada Lovelace" />
              <Avatar size={32} src="/avatars/grace.jpg" fallback="Grace Hopper" />
              <Avatar size={40} src="/avatars/alan.jpg" fallback="Alan Turing" />
            </div>
            <AvatarGroup max={4}>
              <Avatar size={32} src="/avatars/jo.jpg" fallback="Jo Chen" />
              <Avatar size={32} src="/avatars/sam.jpg" fallback="Sam Ortiz" />
              <Avatar size={32} src="/avatars/rae.jpg" fallback="Rae Kim" />
              <Avatar size={32} src="/avatars/tim.jpg" fallback="Tim Blum" />
              <Avatar size={32} src="/avatars/nia.jpg" fallback="Nia West" />
            </AvatarGroup>
          </div>
        ),
        code: `import { Avatar, AvatarGroup } from "pollen-ui";

// alt defaults to the fallback name, so every photo
// announces the person it shows.
<Avatar size={32} src="/avatars/ada.jpg" fallback="Ada Lovelace" />

<AvatarGroup max={4}>
  <Avatar src="/avatars/jo.jpg" fallback="Jo Chen" />
  <Avatar src="/avatars/sam.jpg" fallback="Sam Ortiz" />
  <Avatar src="/avatars/rae.jpg" fallback="Rae Kim" />
  <Avatar src="/avatars/tim.jpg" fallback="Tim Blum" />
  <Avatar src="/avatars/nia.jpg" fallback="Nia West" />
</AvatarGroup>`,
      },
      {
        title: "Presence",
        component: (
          <div className="flex flex-wrap items-center justify-center gap-5">
            <Avatar size={36} status="online" src="/avatars/jo.jpg" fallback="Jo Chen" />
            <Avatar size={36} status="away" src="/avatars/sam.jpg" fallback="Sam Ortiz" />
            <Avatar size={36} status="busy" src="/avatars/rae.jpg" fallback="Rae Kim" />
            <Avatar size={36} status="offline" src="/avatars/tim.jpg" fallback="Tim Blum" />
          </div>
        ),
        code: `import { Avatar } from "pollen-ui";

// The dot is role="img" with a spoken label:
// screen readers hear "Online", not just a color.
<Avatar status="online" src="/avatars/jo.jpg" fallback="Jo Chen" />
<Avatar status="away" src="/avatars/sam.jpg" fallback="Sam Ortiz" />
<Avatar status="busy" src="/avatars/rae.jpg" fallback="Rae Kim" />
<Avatar status="offline" src="/avatars/tim.jpg" fallback="Tim Blum" />`,
      },
      {
        title: "Variants",
        component: (
          <div className="flex flex-wrap items-center justify-center gap-5">
            <Avatar size={36} fallback="Ada Lovelace" />
            <Avatar size={36} fallback="Ada Lovelace" variant="accent" />
            <Avatar size={36} fallback="Ada Lovelace" variant="inverted" />
            <Avatar size={36} fallback="Grace Hopper" shape="square" />
            <Avatar size={36} fallback="Rae Kim" shape="square" variant="accent" status="offline" />
          </div>
        ),
        code: `import { Avatar } from "pollen-ui";

<Avatar fallback="Ada Lovelace" />
<Avatar fallback="Ada Lovelace" variant="accent" />
<Avatar fallback="Ada Lovelace" variant="inverted" />
<Avatar fallback="Grace Hopper" shape="square" />
<Avatar fallback="Rae Kim" shape="square" variant="accent" status="offline" />`,
      },
      {
        title: "Gradient fallbacks",
        component: (
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Avatar size={40} fallback="Ada Lovelace" variant="gradient" />
            <Avatar size={40} fallback="Grace Hopper" variant="gradient" />
            <Avatar size={40} fallback="Alan Turing" variant="gradient" status="online" />
            <Avatar size={40} fallback="Jo Chen" variant="gradient" />
            <Avatar size={40} fallback="Sam Ortiz" variant="gradient" shape="square" />
            <Avatar size={40} fallback="Rae Kim" variant="gradient" />
            <Avatar size={40} fallback="Tim Blum" variant="gradient" status="busy" />
            <Avatar size={40} fallback="Nia West" variant="gradient" />
          </div>
        ),
        code: `import { Avatar } from "pollen-ui";

// The duotone is derived from the name: the same person gets the
// same colours everywhere, with no request to any server.
<Avatar fallback="Ada Lovelace" variant="gradient" />
<Avatar fallback="Grace Hopper" variant="gradient" status="online" />
<Avatar fallback="Sam Ortiz" variant="gradient" shape="square" />`,
      },
    ],
    props: [
      { name: "src", type: "string", description: "Image URL. A failed load falls back to initials automatically, and a new src retries." },
      { name: "alt", type: "string", description: "Accessible name of the photo. Defaults to the fallback prop, so omitting it still announces the person. Pass an empty string to mark the avatar decorative." },
      { name: "srcSet / sizes", type: "string", description: "Forwarded to the img element for retina sources." },
      { name: "fallback", type: "string", description: "Initials shown when the image is missing. Also seeds the gradient variant's colour." },
      { name: "size", type: "number", default: "32", description: "Diameter in pixels." },
      { name: "status", type: "\"online\" | \"away\" | \"busy\" | \"offline\"", description: "Presence dot in the lower right. Omit for none." },
      { name: "variant", type: "\"fill\" | \"accent\" | \"inverted\" | \"gradient\"", default: "\"fill\"", description: "Treatment of the initials fallback. gradient derives a duotone from the name. Images ignore it." },
      { name: "shape", type: "\"circle\" | \"square\"", default: "\"circle\"", description: "Rounded square instead of a circle." },
      { name: "max", type: "number", description: "AvatarGroup: collapse beyond this count." },
      { name: "size", type: "number", default: "32", description: "AvatarGroup: diameter of the +N chip, announced as “N more”." },
    ],
    playground: {
      component: "Avatar",
      values: { src: "/avatars/ada.jpg", fallback: "Ada Lovelace", size: 40, status: "online", variant: "fill", shape: "circle" },
      controls: [
        { kind: "text", prop: "src", label: "src", placeholder: "/avatars/ada.jpg" },
        { kind: "text", prop: "fallback", label: "fallback", placeholder: "Ada Lovelace" },
        { kind: "number", prop: "size", label: "size", min: 16, max: 96, step: 2 },
        {
          kind: "select",
          prop: "status",
          label: "status",
          options: [
            { value: "online", label: "online" },
            { value: "away", label: "away" },
            { value: "busy", label: "busy" },
            { value: "offline", label: "offline" },
          ],
        },
        {
          kind: "select",
          prop: "variant",
          label: "variant",
          options: [
            { value: "fill", label: "fill" },
            { value: "accent", label: "accent" },
            { value: "inverted", label: "inverted" },
            { value: "gradient", label: "gradient" },
          ],
        },
        {
          kind: "select",
          prop: "shape",
          label: "shape",
          options: [
            { value: "circle", label: "circle" },
            { value: "square", label: "square" },
          ],
        },
      ],
    },
  },
  {
    slug: "alert",
    title: "Alert",
    description:
      "An inline message with a job to do. Color lives in the icon and a seven percent tint, so the rest of the page stays quiet.",
    demos: [
      {
        title: "Variants",
        component: (
          <div className="flex w-full max-w-[420px] flex-col gap-3">
            <Alert title="Heads up">
              Prices change on the first of the month.
            </Alert>
            <Alert variant="success" title="Deployment complete">
              pollen-web is live on production.
            </Alert>
            <Alert variant="warning" title="Approaching limit">
              You have used 90 percent of your bandwidth.
            </Alert>
            <Alert variant="danger" title="Build failed">
              One test did not pass. Check the logs for details.
            </Alert>
          </div>
        ),
        code: `import { Alert } from "pollen-ui";

<Alert title="Heads up">Prices change on the first of the month.</Alert>
<Alert variant="success" title="Deployment complete">pollen-web is live.</Alert>
<Alert variant="warning" title="Approaching limit">You have used 90 percent of your bandwidth.</Alert>
<Alert variant="danger" title="Build failed">One test did not pass.</Alert>`,
      },
      {
        title: "Dismissible",
        component: (
          <div className="flex w-full max-w-[420px] flex-col gap-3">
            <Alert
              variant="success"
              title="Backup finished"
              dismissible
            >
              1,204 files synced. This alert collapses away when dismissed.
            </Alert>
            <Alert variant="info" title="New version available" dismissible>
              Reload to pick up the latest release.
            </Alert>
          </div>
        ),
        code: `<Alert variant="success" title="Backup finished" dismissible>
  1,204 files synced. This alert collapses away when dismissed.
</Alert>`,
      },
    ],
    props: [
      { name: "variant", type: '"info" | "success" | "warning" | "danger"', default: '"info"', description: "Severity of the message." },
      { name: "title", type: "ReactNode", description: "Bold first line." },
      { name: "dismissible", type: "boolean", default: "false", description: "Shows a close button and collapses when pressed." },
      { name: "onDismiss", type: "() => void", description: "Called after the collapse animation." },
    ],
    playground: {
      component: "Alert",
      values: { variant: "info", title: "Heads up", dismissible: false, children: "Prices change on the first of the month." },
      controls: [
        {
          kind: "select",
          prop: "variant",
          label: "variant",
          options: [
            { value: "info", label: "info" },
            { value: "success", label: "success" },
            { value: "warning", label: "warning" },
            { value: "danger", label: "danger" },
          ],
        },
        { kind: "text", prop: "title", label: "title", placeholder: "Heads up" },
        { kind: "boolean", prop: "dismissible", label: "dismissible" },
        { kind: "text", prop: "children", label: "children", placeholder: "Message body" },
      ],
    },
  },
  {
    slug: "skeleton",
    title: "Skeleton",
    description:
      "A placeholder that sketches the layout while content loads. Compose circles and lines to mirror what is coming.",
    demos: [
      {
        title: "Profile card",
        component: (
          <div className="flex w-full max-w-[320px] items-center gap-4 rounded-xl bg-card p-5 shadow-[var(--pollen-shadow-sm)]">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-3.5 w-2/3" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
        ),
        code: `import { Skeleton } from "pollen-ui";

<div className="flex items-center gap-4 rounded-xl bg-card p-5 shadow-[var(--pollen-shadow-sm)]">
  <Skeleton className="h-10 w-10 rounded-full" />
  <div className="flex-1 space-y-2">
    <Skeleton className="h-3.5 w-2/3" />
    <Skeleton className="h-3 w-1/2" />
  </div>
</div>`,
      },
      {
        title: "Shimmer and text",
        component: (
          <div className="w-full max-w-[320px] space-y-5 rounded-xl bg-card p-5 shadow-[var(--pollen-shadow-sm)]">
            <div className="flex items-center gap-4">
              <Skeleton shape="circle" className="h-11 w-11" effect="shimmer" />
              <SkeletonText lines={3} effect="shimmer" className="flex-1" />
            </div>
            <div className="flex items-center gap-3">
              <Skeleton shape="text" className="w-24" />
              <Skeleton shape="text" className="w-16" />
              <Skeleton shape="text" className="w-20" />
            </div>
          </div>
        ),
        code: `import { Skeleton, SkeletonText } from "pollen-ui";

<Skeleton shape="circle" className="h-11 w-11" effect="shimmer" />
<SkeletonText lines={3} effect="shimmer" />

<Skeleton shape="text" className="w-24" />`,
      },
    ],
    props: [
      { name: "effect", type: '"pulse" | "shimmer" | "none"', default: '"pulse"', description: "The loading animation. Shimmer sweeps a band of light." },
      { name: "shape", type: '"rect" | "circle" | "text"', default: '"rect"', description: "Free-form, self-squaring circle, or rounded text bar." },
      { name: "className / style", type: "-", description: "Size it like any div." },
    ],
    playground: {
      component: "Skeleton",
      values: { className: "h-10 w-10 rounded-full", effect: "pulse", shape: "rect" },
      controls: [
        { kind: "text", prop: "className", label: "className", placeholder: "h-10 w-10 rounded-full" },
        {
          kind: "select",
          prop: "effect",
          label: "effect",
          options: [
            { value: "pulse", label: "pulse" },
            { value: "shimmer", label: "shimmer" },
            { value: "none", label: "none" },
          ],
        },
        {
          kind: "select",
          prop: "shape",
          label: "shape",
          options: [
            { value: "rect", label: "rect" },
            { value: "circle", label: "circle" },
            { value: "text", label: "text" },
          ],
        },
      ],
    },
  },
  {
    slug: "spinner",
    title: "Spinner",
    description:
      "A single rotating arc, sized to match surrounding text. It spins fast, because a fast spinner makes the app feel faster too.",
    demos: [
      {
        title: "Sizes",
        component: (
          <div className="flex items-center gap-6 text-foreground">
            <Spinner size={14} />
            <Spinner size={16} />
            <Spinner size={20} />
            <span className="flex items-center gap-2 text-sm text-muted-foreground">
              <Spinner size={16} /> Loading
            </span>
          </div>
        ),
        code: `import { Spinner } from "pollen-ui";

<Spinner size={16} />
<span className="flex items-center gap-2 text-sm">
  <Spinner size={16} /> Loading
</span>`,
      },
    ],
    props: [
      { name: "size", type: "number", default: "16", description: "Diameter in pixels." },
    ],
    playground: {
      component: "Spinner",
      values: { size: 16 },
      controls: [
        { kind: "number", prop: "size", label: "size", min: 8, max: 48, step: 2 },
      ],
    },
  },
  {
    slug: "progress",
    title: "Progress",
    description:
      "A determinate bar that eases to its width, five status colors, three heights, optional stripes for active work, and a numeric readout. Omit the value for an indeterminate loop.",
    demos: [
      {
        title: "Basic and indeterminate",
        component: (
          <div className="flex w-full max-w-[320px] flex-col gap-5">
            <div>
              <div className="mb-2 flex justify-between text-sm">
                <span className="font-medium">Uploading assets</span>
                <span className="text-muted-foreground">62%</span>
              </div>
              <Progress value={62} striped />
            </div>
            <Progress aria-label="Loading" />
          </div>
        ),
        code: `import { Progress } from "pollen-ui";

<Progress value={62} striped />
<Progress aria-label="Loading" /> {/* indeterminate */}`,
      },
      {
        title: "Colors, sizes and readouts",
        component: (
          <div className="flex w-full max-w-[320px] flex-col gap-3">
            <Progress value={86} color="success" showValue />
            <Progress value={40} color="warning" size="md" showValue />
            <Progress value={22} color="danger" size="xs" showValue />
          </div>
        ),
        code: `<Progress value={86} color="success" showValue />
<Progress value={40} color="warning" size="md" showValue />
<Progress value={22} color="danger" size="xs" showValue />`,
      },
    ],
    props: [
      { name: "value", type: "number", description: "Current value. Omit for indeterminate." },
      { name: "max", type: "number", default: "100", description: "Upper bound." },
      { name: "color", type: '"neutral" | "accent" | "success" | "warning" | "danger"', default: '"accent"', description: "Fill color." },
      { name: "size", type: '"xs" | "sm" | "md"', default: '"sm"', description: "Bar height." },
      { name: "striped", type: "boolean", default: "false", description: "Animated diagonal stripes over the fill." },
      { name: "showValue", type: "boolean", default: "false", description: "Numeric readout after the bar." },
    ],
    playground: {
      component: "Progress",
      values: { value: 62, max: 100 },
      controls: [
        { kind: "number", prop: "value", label: "value", min: 0, max: 100, step: 1 },
        { kind: "number", prop: "max", label: "max", min: 50, max: 500, step: 50 },
      ],
    },
  },
  {
    slug: "kbd",
    title: "Kbd",
    description:
      "A keyboard key. Use it to document shortcuts right where they matter.",
    demos: [
      {
        title: "Shortcuts",
        component: (
          <div className="flex flex-wrap items-center justify-center gap-2.5 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Kbd>⌘</Kbd>
              <Kbd>K</Kbd>
              to search
            </span>
            <span className="flex items-center gap-1.5">
              <Kbd>↵</Kbd>
              to select
            </span>
            <span className="flex items-center gap-1.5">
              <Kbd>ESC</Kbd>
              to close
            </span>
          </div>
        ),
        code: `import { Kbd } from "pollen-ui";

<span className="flex items-center gap-1.5 text-sm">
  <Kbd>⌘</Kbd> <Kbd>K</Kbd> to search
</span>`,
      },
    ],
    playground: {
      component: "Kbd",
      values: { children: "⌘" },
      controls: [
        { kind: "text", prop: "children", label: "children", placeholder: "⌘" },
      ],
    },
  },
  {
    slug: "table",
    title: "Table",
    description:
      "Rows and columns for real data. Hairline rules, a quiet header, and a hover state that tracks the pointer.",
    demos: [
      {
        title: "Members",
        component: (
          <div className="w-full max-w-[460px] overflow-hidden rounded-2xl bg-card shadow-[var(--pollen-shadow-md)]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Plan</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {members.map((member) => (
                  <TableRow key={member.name}>
                    <TableCell className="font-medium">{member.name}</TableCell>
                    <TableCell className="text-muted-foreground">{member.role}</TableCell>
                    <TableCell className="text-muted-foreground">{member.status}</TableCell>
                    <TableCell className="text-right text-muted-foreground">{member.plan}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ),
        code: memberCode,
      },
      {
        title: "Sorting",
        component: <DataTableDemo />,
        code: `import { DataTable } from "pollen-ui";

const members = [
  { name: "Ada Lovelace", role: "Owner", seats: 24, plan: "Enterprise" },
  { name: "Grace Hopper", role: "Admin", seats: 12, plan: "Pro" },
  { name: "Alan Turing", role: "Developer", seats: 3, plan: "Hobby" },
  { name: "Katherine Johnson", role: "Developer", seats: 8, plan: "Pro" },
];

const columns = [
  { key: "name", header: "Name", sortable: true, value: (m) => m.name },
  { key: "role", header: "Role", value: (m) => m.role },
  { key: "seats", header: "Seats", sortable: true, align: "right", value: (m) => m.seats },
  { key: "plan", header: "Plan", sortable: true, align: "right", value: (m) => m.plan },
];

<DataTable
  rows={members}
  columns={columns}
  getRowId={(m) => m.name}
  initialSort={{ key: "seats", dir: "desc" }}
/>`,
      },
    ],
    keyboard: [
      { keys: "Enter / Space", action: "Activate a clickable row. Rows become focusable when onRowClick is set." },
    ],
    props: [
      { name: "columns", type: "DataTableColumn<T>[]", description: "DataTable: header, optional sorting and custom cells." },
      { name: "rows", type: "T[]", description: "DataTable: the data to render." },
      { name: "getRowId", type: "(row: T) => string", description: "DataTable: stable React key per row." },
      { name: "initialSort", type: "{ key: string; dir: \"asc\" | \"desc\" }", description: "DataTable: column the table starts sorted by." },
      { name: "onRowClick", type: "(row: T) => void", description: "DataTable: called when a row is clicked; rows become interactive." },
    ],
    playground: {
      component: "DataTable",
      values: { rows: true, initialSort: true },
      controls: [
        {
          kind: "boolean",
          prop: "rows",
          label: "rows",
          attr: 'rows={[{ name: "Ada Lovelace", role: "Owner", plan: "Pro" }, { name: "Grace Hopper", role: "Admin", plan: "Pro" }, { name: "Alan Turing", role: "Developer", plan: "Hobby" }]} columns={[{ key: "name", header: "Name", sortable: true, value: (row) => row.name }, { key: "role", header: "Role", value: (row) => row.role }, { key: "plan", header: "Plan", align: "right", sortable: true, value: (row) => row.plan }]} getRowId={(row) => row.name}',
        },
        { kind: "boolean", prop: "initialSort", label: "initialSort", attr: 'initialSort={{ key: "plan", dir: "desc" }}' },
      ],
    },
  },
  {
    slug: "card",
    title: "Card",
    description:
      "A floating surface with header, content and footer slots. Compose anything inside; the container stays out of the way.",
    demos: [
      {
        title: "Basic",
        component: (
          <Card className="w-full max-w-[340px]">
            <CardHeader>
              <CardTitle>Deploy hooks</CardTitle>
              <CardDescription>
                Trigger a build from any tool with a single POST request.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="rounded-md bg-fill px-3 py-2 font-mono text-xs text-muted-foreground">
                POST /api/v1/deploy
              </p>
            </CardContent>
            <CardFooter className="justify-end gap-2">
              <Button variant="ghost">Cancel</Button>
              <Button>Create hook</Button>
            </CardFooter>
          </Card>
        ),
        code: `import { Button, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "pollen-ui";

<Card className="max-w-[340px]">
  <CardHeader>
    <CardTitle>Deploy hooks</CardTitle>
    <CardDescription>Trigger a build with a single POST request.</CardDescription>
  </CardHeader>
  <CardContent>
    <p className="rounded-md bg-fill px-3 py-2 font-mono text-xs">POST /api/v1/deploy</p>
  </CardContent>
  <CardFooter className="justify-end gap-2">
    <Button variant="ghost">Cancel</Button>
    <Button>Create hook</Button>
  </CardFooter>
</Card>`,
      },
    ],
    playground: {
      component: "Card",
      values: { children: "Deploy hooks", className: "w-full max-w-[340px] p-6" },
      controls: [
        { kind: "text", prop: "children", label: "children", placeholder: "Card content" },
        { kind: "text", prop: "className", label: "className", placeholder: "w-full max-w-[340px] p-6" },
      ],
    },
  },
  {
    slug: "code-block",
    title: "Code Block",
    description:
      "A dark code surface with a file name, basic syntax colors, and a copy button that confirms with a check. It stays dark in both themes, the way terminals do.",
    demos: [
      {
        title: "Basic",
        component: (
          <CodeBlock
            className="w-full max-w-[420px]"
            filename="app/page.tsx"
            language="tsx"
            code={`import { Button } from "pollen-ui";

export default function Page() {
  return <Button>Ship it</Button>;
}`}
          />
        ),
        code: `import { CodeBlock } from "pollen-ui";

const source = [
  'import { Button } from "pollen-ui";',
  '',
  'export default function Page() {',
  '  return <Button>Ship it</Button>;',
  '}',
].join("\\n");

<CodeBlock
  filename="app/page.tsx"
  language="tsx"
  code={source}
/>`,
      },
      {
        title: "Terminal",
        component: (
          <CodeBlock
            className="w-full max-w-[420px]"
            filename="terminal"
            language="bash"
            code={`# Install the library
npm install pollen-ui

# Add the stylesheet to your entry
# import "pollen-ui/styles.css";`}
          />
        ),
        code: `import { CodeBlock } from "pollen-ui";

const commands = [
  "# Install the library",
  "npm install pollen-ui",
  "",
  "# Add the stylesheet to your entry",
  '# import "pollen-ui/styles.css";',
].join("\\n");

<CodeBlock filename="terminal" language="bash" code={commands} />`,
      },
    ],
    props: [
      { name: "code", type: "string", description: "The source text to render." },
      { name: "filename", type: "string", description: "Shown in the header." },
      { name: "language", type: "string", description: "Language tag shown when there is no file name." },
      { name: "highlight", type: "boolean", default: "true", description: "Apply basic syntax colors." },
    ],
    playground: {
      component: "CodeBlock",
      values: { code: "npm install pollen-ui", filename: "terminal", language: "bash", highlight: true },
      controls: [
        { kind: "text", prop: "code", label: "code", placeholder: "npm install pollen-ui" },
        { kind: "text", prop: "filename", label: "filename", placeholder: "terminal" },
        { kind: "text", prop: "language", label: "language", placeholder: "bash" },
        { kind: "boolean", prop: "highlight", label: "highlight" },
      ],
    },
  },
  {
    slug: "segmented-control",
    title: "Segmented Control",
    description:
      "A compact way to switch between related views. The thumb glides on a spring; options take icons and counts, stretch full width, scale three sizes, and can render as a pill.",
    demos: [
      {
        title: "Basic",
        component: (
          <SegmentedControl
            defaultValue="week"
            aria-label="Range"
            options={[
              { value: "day", label: "Day" },
              { value: "week", label: "Week" },
              { value: "month", label: "Month" },
            ]}
          />
        ),
        code: `import { SegmentedControl } from "pollen-ui";

<SegmentedControl
  defaultValue="week"
  options={[
    { value: "day", label: "Day" },
    { value: "week", label: "Week" },
    { value: "month", label: "Month" },
  ]}
/>`,
      },
      {
        title: "Counts, sizes and pill",
        component: (
          <div className="flex w-full max-w-[380px] flex-col items-center gap-4">
            <SegmentedControl
              fullWidth
              defaultValue="all"
              aria-label="Inbox filter"
              options={[
                { value: "all", label: "All", badge: 24 },
                { value: "unread", label: "Unread", badge: 3 },
                { value: "sent", label: "Sent" },
              ]}
            />
            <SegmentedControl
              shape="pill"
              size="lg"
              defaultValue="ship"
              aria-label="Ship"
              options={[
                { value: "ship", label: "Ship it" },
                { value: "hold", label: "Hold" },
              ]}
            />
          </div>
        ),
        code: `<SegmentedControl
  fullWidth
  defaultValue="all"
  options={[
    { value: "all", label: "All", badge: 24 },
    { value: "unread", label: "Unread", badge: 3 },
    { value: "sent", label: "Sent" },
  ]}
/>

<SegmentedControl shape="pill" size="lg" defaultValue="ship"
  options={[{ value: "ship", label: "Ship it" }, { value: "hold", label: "Hold" }]}
/>`,
      },
    ],
    props: [
      { name: "options", type: "SegmentedOption[]", description: "Choices with value and label, optional icon, badge and disabled." },
      { name: "value", type: "string", description: "Controlled active segment." },
      { name: "defaultValue", type: "string", description: "Initial active segment." },
      { name: "onValueChange", type: "(value: string) => void", description: "Called on change." },
      { name: "size", type: '"sm" | "md" | "lg"', default: '"md"', description: "Height, padding and type size." },
      { name: "fullWidth", type: "boolean", default: "false", description: "Stretches the control; thumbs size by fraction." },
      { name: "shape", type: '"rounded" | "pill"', default: '"rounded"', description: "Pill renders fully rounded ends." },
    ],
    playground: {
      component: "SegmentedControl",
      values: { options: true, defaultValue: "week", size: "md" },
      controls: [
        {
          kind: "boolean",
          prop: "options",
          label: "options",
          attr: 'options={[{ value: "day", label: "Day" }, { value: "week", label: "Week" }, { value: "month", label: "Month" }]}',
        },
        {
          kind: "select",
          prop: "defaultValue",
          label: "defaultValue",
          options: [
            { value: "day", label: "day" },
            { value: "week", label: "week" },
            { value: "month", label: "month" },
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
        { kind: "boolean", prop: "fullWidth", label: "fullWidth" },
        {
          kind: "select",
          prop: "shape",
          label: "shape",
          options: [
            { value: "rounded", label: "rounded" },
            { value: "pill", label: "pill" },
          ],
        },
      ],
    },
  },

  {
    slug: "progress-ring",
    title: "Progress Ring",
    description:
      "Circular progress with a soft gradient arc that eases to its value. Use it where a bar would shout: uploads, quotas, streaks.",
    demos: [
      {
        title: "Sizes",
        component: (
          <div className="flex flex-wrap items-center justify-center gap-6">
            <ProgressRing value={25} size={48} thickness={5} aria-label="Quarter" />
            <ProgressRing value={62} size={64} thickness={6} aria-label="Standard" />
            <ProgressRing value={90} size={84} thickness={7} aria-label="Almost done" />
          </div>
        ),
        code: `<ProgressRing value={25} size={48} thickness={5} />
<ProgressRing value={62} size={64} thickness={6} />
<ProgressRing value={90} size={84} thickness={7} />`,
      },
      {
        title: "Semantic colors",
        component: (
          <div className="flex flex-wrap items-center justify-center gap-6">
            <ProgressRing value={100} variant="success" size={64} label="Done" />
            <ProgressRing value={54} variant="warning" size={64} label="54%" />
            <ProgressRing value={96} variant="danger" size={64} label="96%" />
          </div>
        ),
        code: `<ProgressRing value={100} variant="success" label="Done" />
<ProgressRing value={54} variant="warning" label="54%" />
<ProgressRing value={96} variant="danger" label="96%" />`,
      },
      {
        title: "With custom content",
        component: (
          <ProgressRing value={72} size={84} thickness={6} showValue={false}>
          </ProgressRing>
        ),
        code: `<ProgressRing value={72} showValue={false} aria-label="Storage" />`,
      },
    ],
    props: [
      { name: "value", type: "number", default: "0", description: "Current value, clamped to the range." },
      { name: "min / max", type: "number", default: "0 / 100", description: "Range of the arc." },
      { name: "size", type: "number", default: "64", description: "Outer diameter in pixels." },
      { name: "thickness", type: "number", default: "6", description: "Ring thickness in pixels." },
      { name: "variant", type: '"accent" | "success" | "warning" | "danger" | "foreground"', default: '"accent"', description: "Arc color." },
      { name: "label", type: "ReactNode", description: "Custom content in the center, replacing the percent." },
      { name: "showValue", type: "boolean", default: "true", description: "Renders the percent inside the ring." },
    ],
    playground: {
      component: "ProgressRing",
      values: { value: 62, size: 64, thickness: 6, variant: "accent", showValue: true },
      controls: [
        { kind: "number", prop: "value", label: "value", min: 0, max: 100, step: 1 },
        { kind: "number", prop: "size", label: "size", min: 40, max: 120, step: 2 },
        { kind: "number", prop: "thickness", label: "thickness", min: 2, max: 14, step: 1 },
        {
          kind: "select",
          prop: "variant",
          label: "variant",
          options: [
            { value: "accent", label: "accent" },
            { value: "success", label: "success" },
            { value: "warning", label: "warning" },
            { value: "danger", label: "danger" },
            { value: "foreground", label: "foreground" },
          ],
        },
        { kind: "boolean", prop: "showValue", label: "showValue" },
      ],
    },
  },
];

// Accordion import guard: it is re-exported above via the entry JSX.
export type { RegistryEntry };
