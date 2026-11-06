import {
  IconArchive as Archive,
  IconCopy as Copy,
  IconDots as Ellipsis,
  IconExternal as ExternalLink,
  IconPencil as Pencil,
  IconTrash as Trash2,
  IconUserPlus as UserPlus,
} from "pollen-ui";
import {
  Button,
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  Tooltip,
} from "pollen-ui";
import { ModalDemo } from "@/components/demos/modal-demo";
import { ModalSizesDemo } from "@/components/demos/modal-sizes-demo";
import { DrawerDemo } from "@/components/demos/drawer-demo";
import { CommandDemo } from "@/components/demos/command-demo";
import { DropdownCheckableDemo } from "@/components/demos/dropdown-checkable-demo";
import { ToastDemo } from "@/components/demos/toast-demo";
import { ToastPileControlledDemo } from "@/components/demos/toast-pile-demo";
import type { RegistryEntry } from "./types";

export const overlays: RegistryEntry[] = [
  {
    slug: "modal",
    title: "Modal",
    description:
      "A centered dialog for focused decisions. It enters from 96 percent scale, traps focus, locks scroll, and closes on Escape or overlay click.",
    demos: [
      {
        title: "Basic",
        component: <ModalDemo />,
        code: `import {
  Button,
  Modal,
  ModalClose,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalTitle,
} from "pollen-ui";

const [open, setOpen] = useState(false);

<Button variant="outline" onClick={() => setOpen(true)}>
  Open dialog
</Button>

<Modal open={open} onOpenChange={setOpen}>
  <ModalContent>
    <ModalTitle>Move project</ModalTitle>
    <ModalDescription>
      Choose a workspace for pollen-web. Members keep their access.
    </ModalDescription>
    <ModalClose />
    <ModalFooter>
      <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
      <Button onClick={() => setOpen(false)}>Move project</Button>
    </ModalFooter>
  </ModalContent>
</Modal>`,
      },
      {
        title: "Sizes",
        component: <ModalSizesDemo />,
        code: `import { Button, Modal, ModalContent, ModalDescription, ModalFooter, ModalTitle } from "pollen-ui";

const [size, setSize] = useState<"sm" | "md" | "lg" | null>(null);

<Button onClick={() => setSize("lg")}>Invite people</Button>

<Modal open={size !== null} onOpenChange={(o) => !o && setSize(null)} size={size ?? "md"}>
  <ModalContent>
    <ModalTitle>Invite to workspace</ModalTitle>
    <ModalDescription>
      They will get an email with a link to join pollen-web.
    </ModalDescription>
    <ModalFooter>
      <Button variant="ghost" onClick={() => setSize(null)}>Cancel</Button>
      <Button onClick={() => setSize(null)}>Send invite</Button>
    </ModalFooter>
  </ModalContent>
</Modal>`,
      },
    ],
    keyboard: [
      { keys: "Escape", action: "Close the modal." },
      { keys: "Tab / Shift + Tab", action: "Cycle focus inside the dialog; focus cannot escape while it is open." },
    ],
    props: [
      { name: "open", type: "boolean", description: "Whether the modal is shown." },
      { name: "onOpenChange", type: "(open: boolean) => void", description: "Called on close requests." },
      { name: "size", type: "\"sm\" | \"md\" | \"lg\"", default: "\"md\"", description: "Panel width: 24rem, 32rem or 42rem." },
    ],
    playground: {
      component: "Modal",
      values: { size: "md" },
      controls: [
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
    slug: "drawer",
    title: "Drawer",
    description:
      "A sheet that slides in from an edge. Good for filters, settings, and navigation on small screens.",
    demos: [
      {
        title: "From the right",
        component: <DrawerDemo />,
        code: `import {
  Drawer,
  DrawerBody,
  DrawerClose,
  DrawerHeader,
  DrawerTitle,
} from "pollen-ui";

const [open, setOpen] = useState(false);

<Drawer open={open} onOpenChange={setOpen} side="right">
  <DrawerHeader>
    <DrawerTitle>Filters</DrawerTitle>
    <DrawerClose onOpenChange={setOpen} />
  </DrawerHeader>
  <DrawerBody>{/* your content */}</DrawerBody>
</Drawer>`,
      },
    ],
    keyboard: [
      { keys: "Escape", action: "Close the drawer." },
      { keys: "Tab / Shift + Tab", action: "Focus is trapped inside the sheet and returns to the trigger on close." },
    ],
    props: [
      { name: "open", type: "boolean", description: "Whether the drawer is shown." },
      { name: "onOpenChange", type: "(open: boolean) => void", description: "Called on close requests." },
      { name: "side", type: '"left" | "right" | "bottom"', default: '"right"', description: "Edge it slides in from." },
    ],
    playground: {
      component: "Drawer",
      values: { side: "right" },
      controls: [
        {
          kind: "select",
          prop: "side",
          label: "side",
          options: [
            { value: "left", label: "left" },
            { value: "right", label: "right" },
            { value: "bottom", label: "bottom" },
          ],
        },
      ],
    },
  },
  {
    slug: "tooltip",
    title: "Tooltip",
    description:
      "A short hint on hover and focus. The first one waits 200ms so it never fires by accident, hopping between surfaces skips the wait, and the bubble scales out of the edge nearest the trigger.",
    demos: [
      {
        title: "Placement",
        component: (
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Tooltip content="Copy to clipboard">
              <Button variant="outline" aria-label="Copy">
                <Copy className="h-4 w-4" />
              </Button>
            </Tooltip>
            <Tooltip content="Invite your team" side="bottom">
              <Button variant="outline">
                <UserPlus className="h-4 w-4" />
                Invite
              </Button>
            </Tooltip>
            <Tooltip content="Open in production" side="top">
              <Button variant="outline">
                <ExternalLink className="h-4 w-4" />
                Open
              </Button>
            </Tooltip>
          </div>
        ),
        code: `import { Button, Tooltip, IconCopy } from "pollen-ui";

<Tooltip content="Copy to clipboard">
  <Button variant="outline" aria-label="Copy">
    <IconCopy className="h-4 w-4" />
  </Button>
</Tooltip>

<Tooltip content="Invite your team" side="bottom">
  <Button variant="outline">Invite</Button>
</Tooltip>`,
      },
    ],
    props: [
      { name: "content", type: "ReactNode", description: "The hint text." },
      { name: "side", type: '"top" | "bottom" | "left" | "right"', default: '"top"', description: "Where the bubble appears." },
      { name: "delay", type: "number", default: "200", description: "First-hover delay in milliseconds." },
      { name: "arrow", type: "boolean", default: "true", description: "Show the pointing arrow." },
    ],
    playground: {
      component: "Tooltip",
      values: { content: "Copy to clipboard", side: "top", delay: 200, arrow: true, children: "Hover me" },
      controls: [
        { kind: "text", prop: "content", label: "content", placeholder: "Copy to clipboard" },
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
        { kind: "number", prop: "delay", label: "delay", min: 0, max: 1000, step: 50 },
        { kind: "boolean", prop: "arrow", label: "arrow" },
        { kind: "text", prop: "children", label: "label", placeholder: "Hover me" },
      ],
    },
  },
  {
    slug: "dropdown-menu",
    title: "Dropdown Menu",
    description:
      "A list of actions attached to a trigger. Arrow keys navigate, Enter selects, Escape closes, and items can carry shortcuts or a destructive style.",
    demos: [
      {
        title: "Project actions",
        component: (
          <DropdownMenu
            align="center"
            trigger={
              <Button variant="outline" aria-label="Project actions">
                <Ellipsis className="h-4 w-4" />
              </Button>
            }
          >
            <DropdownMenuLabel>Project</DropdownMenuLabel>
            <DropdownMenuItem icon={<Pencil />} shortcut={["⌘", "E"]}>
              Rename
            </DropdownMenuItem>
            <DropdownMenuItem icon={<Copy />} shortcut={["⌘", "D"]}>
              Duplicate
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem icon={<Archive />}>Archive</DropdownMenuItem>
            <DropdownMenuItem icon={<Trash2 />} destructive>
              Delete
            </DropdownMenuItem>
          </DropdownMenu>
        ),
        code: `import {
  Button,
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  IconPencil,
  IconCopy,
  IconTrash,
} from "pollen-ui";

<DropdownMenu trigger={<Button variant="outline">Actions</Button>}>
  <DropdownMenuLabel>Project</DropdownMenuLabel>
  <DropdownMenuItem icon={<IconPencil />} shortcut={["⌘", "E"]}>Rename</DropdownMenuItem>
  <DropdownMenuItem icon={<IconCopy />} shortcut={["⌘", "D"]}>Duplicate</DropdownMenuItem>
  <DropdownMenuSeparator />
  <DropdownMenuItem icon={<IconTrash />} destructive>Delete</DropdownMenuItem>
</DropdownMenu>`,
      },
      {
        title: "Checkable items",
        component: <DropdownCheckableDemo />,
        code: `import {
  Button,
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuLabel,
} from "pollen-ui";
import { useState } from "react";

export default function Demo() {
  const [density, setDensity] = useState("Comfortable");

  return (
    <DropdownMenu trigger={<Button variant="outline">Density: {density}</Button>}>
      <DropdownMenuLabel>Row density</DropdownMenuLabel>
      {["Comfortable", "Compact"].map((option) => (
        <DropdownMenuItem
          key={option}
          selected={density === option}
          onSelect={() => setDensity(option)}
        >
          {option}
        </DropdownMenuItem>
      ))}
    </DropdownMenu>
  );
}`,
      },
    ],
    keyboard: [
      { keys: "Enter / Space / Arrow Down", action: "Open the menu from the trigger." },
      { keys: "Arrow Down / Arrow Up", action: "Move between items." },
      { keys: "Enter", action: "Activate the focused item." },
      { keys: "Escape", action: "Close the menu." },
    ],
    props: [
      { name: "trigger", type: "ReactNode", description: "Element that opens the menu." },
      { name: "side", type: '"top" | "bottom"', default: '"bottom"', description: "Where the menu opens." },
      { name: "align", type: '"start" | "center" | "end"', default: '"start"', description: "Alignment to the trigger." },
    ],
    playground: {
      component: "DropdownMenu",
      values: { trigger: true, side: "bottom", align: "start" },
      imports: ["Button"],
      controls: [
        { kind: "boolean", prop: "trigger", label: "trigger", attr: 'trigger={<Button variant="outline">Actions</Button>}' },
        {
          kind: "select",
          prop: "side",
          label: "side",
          options: [
            { value: "top", label: "top" },
            { value: "bottom", label: "bottom" },
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
      ],
    },
  },
  {
    slug: "command",
    title: "Command",
    description:
      "A command palette, the kind you open with Cmd + K. One input, flat keyboard navigation, grouped results, and instant filtering.",
    demos: [
      {
        title: "Basic",
        component: <CommandDemo />,
        code: `import { Command } from "pollen-ui";
import { useState } from "react";

export default function Demo() {
  const [open, setOpen] = useState(false);

  const groups = [
    {
      heading: "Suggested",
      items: [
        { label: "Copy link", shortcut: ["⌘", "C"] },
        { label: "Open docs", shortcut: ["⌘", "D"] },
        { label: "Invite people", shortcut: ["⌘", "I"] },
      ],
    },
    {
      heading: "Project",
      items: [
        { label: "View deployments" },
        { label: "Open logs" },
        { label: "Archive project" },
      ],
    },
  ];

  return (
    <Command
      open={open}
      onOpenChange={setOpen}
      groups={groups}
    />
  );
}`,
      },
    ],
    keyboard: [
      { keys: "Arrow Down / Arrow Up", action: "Move the highlight; the list scrolls it into view." },
      { keys: "Home / End", action: "Jump to the first or last command." },
      { keys: "Enter", action: "Run the highlighted command." },
      { keys: "Escape / Tab", action: "Close the palette." },
    ],
    props: [
      { name: "open", type: "boolean", description: "Whether the palette is shown." },
      { name: "onOpenChange", type: "(open: boolean) => void", description: "Called on open and close." },
      { name: "groups", type: "CommandGroup[]", description: "Grouped items with heading and items." },
      { name: "onQuerySubmit", type: "(query: string) => void", description: "Called when Enter finds no match." },
    ],
    playground: {
      component: "Command",
      values: { placeholder: "Search" },
      controls: [
        { kind: "text", prop: "placeholder", label: "placeholder", placeholder: "Search" },
      ],
    },
  },
  {
    slug: "toast",
    title: "Toast",
    description:
      "A stack that piles up like a deck of cards: the newest in front, the older ones scaled and peeking behind it. Hover the pile and it fans out, swipe the front card away in any direction, click a background toast to bring it forward, press Escape to dismiss. Mount one Toaster, then call toast() from anywhere.",
    demos: [
      {
        title: "Variants",
        component: <ToastDemo />,
        code: `import { useEffect } from "react";
import { Toaster, toast } from "pollen-ui";

// Mount one Toaster near the root of your app, then call
// toast() from anywhere.
export default function Demo() {
  useEffect(() => {
    toast.success("Settings saved", {
      description: "Your changes are live for your team.",
    });

    const timer = window.setTimeout(() => {
      toast("Project deleted", {
        description: "You can undo this for the next 30 days.",
        action: { label: "Undo", onClick: () => toast.success("Restored") },
      });
    }, 700);
    return () => window.clearTimeout(timer);
  }, []);

  return <Toaster />;
}`,
      },
      {
        title: "Controlled pile",
        component: <ToastPileControlledDemo />,
        code: `import { ToastPileProvider, useToastPile, Button } from "pollen-ui";

// Scope the pile to the part of the app that owns it.
// ToastPileProvider renders the pile itself.
function Composer() {
  const { pile } = useToastPile();
  return (
    <Button
      onClick={() =>
        pile({
          title: "Report queued",
          description: "We will email you when it is ready.",
          duration: 6000,
        })
      }
    >
      Queue report
    </Button>
  );
}

export default function Demo() {
  return (
    <ToastPileProvider>
      <Composer />
    </ToastPileProvider>
  );
}`,
      },
    ],
    keyboard: [
      { keys: "Escape", action: "Dismiss the front toast." },
    ],
    props: [
      { name: "position", type: '"top-left" | "top-center" | "top-right" | "bottom-left" | "bottom-center" | "bottom-right"', default: '"bottom-right"', description: "Where the pile lives. Toaster prop." },
      { name: "visibleToasts", type: "number", default: "3", description: "How many cards peek in the collapsed pile." },
      { name: "duration", type: "number", default: "4000", description: "Auto dismiss in ms. Timers pause while hovered." },
      { name: "action", type: "{ label, onClick }", default: "-", description: "Button on the card; clicking it dismisses too." },
      { name: "toast.promise", type: "(promise, msgs)", default: "-", description: "One card that turns loading into success or error." },
    ],
    playground: {
      component: "Toaster",
      values: { position: "bottom-right", visibleToasts: 3, gap: 12 },
      controls: [
        {
          kind: "select",
          prop: "position",
          label: "position",
          options: [
            { value: "top-left", label: "top-left" },
            { value: "top-center", label: "top-center" },
            { value: "top-right", label: "top-right" },
            { value: "bottom-left", label: "bottom-left" },
            { value: "bottom-center", label: "bottom-center" },
            { value: "bottom-right", label: "bottom-right" },
          ],
        },
        { kind: "number", prop: "visibleToasts", label: "visibleToasts", min: 1, max: 5, step: 1 },
        { kind: "number", prop: "gap", label: "gap", min: 0, max: 32, step: 2 },
      ],
    },
  },
];
