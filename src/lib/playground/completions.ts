import {
  snippetCompletion,
  type Completion,
  type CompletionContext,
  type CompletionResult,
  type CompletionSource,
} from "@codemirror/autocomplete";
import type { EditorState } from "@codemirror/state";

/**
 * VSCode-style completions for the playground editor.
 *
 * The data below is a static snapshot of the component library:
 * every value export from packages/pollen-ui/src/index.ts, plus the
 * documented prop rows from src/lib/registry/*.tsx. The source
 * activates in three places:
 *
 *   1. inside `import { ... } from "pollen-ui"`: export names,
 *   2. right after "<": JSX component and icon tag names,
 *   3. inside a JSX tag: that component's props plus common DOM props,
 *      applied as ready-to-edit attributes.
 */

type PropKind =
  | "boolean"
  | "string"
  | "number"
  | "enum"
  | "node"
  | "function"
  | "array";

interface PollenProp {
  name: string;
  /** The documented type, shown after the label in the tooltip. */
  detail: string;
  kind: PropKind;
  /** Allowed values for enum props; the first one is preselected. */
  options?: string[];
  /** Overrides the attribute template derived from kind. */
  template?: string;
}

// ---------------------------------------------------------------------------
// Static data, hand-transcribed from the registry docs.
// ---------------------------------------------------------------------------

const COMPONENT_NAMES = [
  // Primitives
  "Button", "Badge", "Input", "Textarea", "Label", "Select", "Checkbox",
  "RadioGroup", "Radio", "Switch", "Slider", "Spinner", "Combobox",
  "Pagination", "Rating", "TagInput", "ToggleGroup", "ToggleGroupItem",
  "OTPInput", "ProgressRing",
  // Overlays
  "Modal", "ModalContent", "ModalTitle", "ModalDescription", "ModalFooter",
  "ModalClose", "Drawer", "DrawerHeader", "DrawerTitle", "DrawerBody",
  "DrawerClose", "Tooltip", "DropdownMenu", "DropdownMenuItem",
  "DropdownMenuSeparator", "DropdownMenuLabel", "Command", "Toaster",
  "Popover", "ContextMenu", "ContextMenuTrigger", "ContextMenuContent",
  "ContextMenuItem", "ContextMenuSeparator", "ContextMenuLabel",
  // Navigation and display
  "Tabs", "TabsList", "TabsTrigger", "TabsContent", "Breadcrumb",
  "BreadcrumbItem", "BreadcrumbLink", "BreadcrumbPage", "BreadcrumbSeparator",
  "BreadcrumbEllipsis", "Accordion", "AccordionItem", "AccordionTrigger",
  "AccordionContent", "Avatar", "AvatarGroup", "Alert", "Skeleton", "Progress",
  "Kbd", "Table", "TableHeader", "TableBody", "TableRow", "TableHead",
  "TableCell", "DataTable", "Card", "CardHeader", "CardTitle",
  "CardDescription", "CardContent", "CardFooter", "CodeBlock",
  "SegmentedControl", "Steps", "Timeline", "EmptyState", "Stat",
  // Motion
  "Reveal", "TextReveal", "Marquee", "ScrollProgress", "Parallax",
  "NumberTicker", "Typewriter",
  // Signatures
  "MagneticButton", "Dock", "Odometer", "TiltCard",
  "TicketCard", "KineticHeadline", "ScrambleText", "SlideToConfirm",
  "PressableCard", "ChatThread", "ChatInput", "ChatMessage", "useChat",
] as const;

const ICON_NAMES = [
  "IconAlignLeft", "IconAlert", "IconArchive", "IconArrowDownRight",
  "IconArrowLeft", "IconArrowRight", "IconArrowUpRight", "IconBars",
  "IconBell", "IconBolt", "IconBook", "IconBox", "IconCard", "IconCheck",
  "IconCheckSquare", "IconChevronDown", "IconChevronLeft", "IconChevronRight",
  "IconChevronUp", "IconChat", "IconCircle", "IconCircleCheck",
  "IconCircleClose", "IconClose", "IconCode", "IconCommand", "IconCopy",
  "IconCube", "IconCursorClick", "IconDatabase", "IconDeploy", "IconDock",
  "IconDots", "IconDownload", "IconExternal", "IconEye", "IconFileCode",
  "IconFilter", "IconFlask", "IconGauge", "IconGithub", "IconGlobe",
  "IconGrip", "IconHash", "IconHeadline", "IconHeart", "IconHistory",
  "IconInfo", "IconKeyboard", "IconLayers", "IconLetter", "IconList",
  "IconListOrdered", "IconLoader", "IconLock", "IconMagnet", "IconMail",
  "IconMenu", "IconMinus", "IconMonitor", "IconMoon", "IconOdometer",
  "IconPackage", "IconPanelBottom", "IconPanelLeft", "IconPanels",
  "IconPercent", "IconPetal", "IconPencil", "IconPlay", "IconPlus",
  "IconPopover", "IconRadioDot", "IconRepeat", "IconRing", "IconRoute",
  "IconRotate", "IconScramble", "IconSearch", "IconSeed", "IconSettings",
  "IconSliders", "IconSplit", "IconSun", "IconSwatches", "IconTable",
  "IconTag", "IconTags", "IconTerminal", "IconTerminalSquare",
  "IconTextCursor", "IconTextSelect", "IconTicket", "IconTilt", "IconTrash",
  "IconTrend", "IconToggle", "IconType", "IconUser", "IconUserPlus",
  "IconUsers", "IconWindow", "IconWind",
] as const;

const UTILITY_FUNCTIONS = [
  "useModal", "toast", "cn", "spring", "fadeUp", "overlayIn",
] as const;
const UTILITY_CONSTANTS = ["EASE", "EASE_OUT"] as const;

const PROP_MAP: Record<string, PollenProp[]> = {
  Button: [
    { name: "variant", detail: '"primary" | "accent" | "secondary" | "outline" | "ghost" | "link" | "destructive"', kind: "enum", options: ["primary", "accent", "secondary", "outline", "ghost", "link", "destructive"] },
    { name: "size", detail: '"sm" | "md" | "lg" | "icon"', kind: "enum", options: ["sm", "md", "lg", "icon"] },
    { name: "loading", detail: "boolean", kind: "boolean" },
    { name: "loadingText", detail: "string", kind: "string" },
    { name: "leftIcon", detail: "ReactNode", kind: "node", template: "leftIcon={<Icon$1 />}" },
    { name: "rightIcon", detail: "ReactNode", kind: "node", template: "rightIcon={<Icon$1 />}" },
    { name: "fullWidth", detail: "boolean", kind: "boolean" },
    { name: "disabled", detail: "boolean", kind: "boolean" },
  ],
  Badge: [
    { name: "variant", detail: '"neutral" | "accent" | "success" | "warning" | "danger" | "solid"', kind: "enum", options: ["neutral", "accent", "success", "warning", "danger", "solid"] },
    { name: "size", detail: '"sm" | "md" | "lg"', kind: "enum", options: ["sm", "md", "lg"] },
    { name: "dot", detail: "boolean", kind: "boolean" },
  ],
  Input: [
    { name: "icon", detail: "ReactNode", kind: "node", template: "icon={<Icon$1 />}" },
    { name: "suffix", detail: "ReactNode", kind: "node" },
    { name: "prefix", detail: "ReactNode", kind: "node" },
    { name: "variant", detail: '"fill" | "outline" | "underline" | "ghost"', kind: "enum", options: ["fill", "outline", "underline", "ghost"] },
    { name: "size", detail: '"sm" | "md" | "lg"', kind: "enum", options: ["sm", "md", "lg"] },
    { name: "label", detail: "ReactNode", kind: "node" },
    { name: "helperText", detail: "ReactNode", kind: "node" },
    { name: "errorText", detail: "ReactNode", kind: "node" },
    { name: "charCount", detail: "boolean", kind: "boolean" },
    { name: "passwordToggle", detail: "boolean", kind: "boolean" },
    { name: "invalid", detail: "boolean", kind: "boolean" },
    { name: "valid", detail: "boolean", kind: "boolean" },
    { name: "successText", detail: "ReactNode", kind: "node" },
    { name: "clearable", detail: "boolean", kind: "boolean" },
    { name: "loading", detail: "boolean", kind: "boolean" },
    { name: "onClear", detail: "() => void", kind: "function" },
  ],
  Textarea: [
    { name: "variant", detail: '"fill" | "outline" | "ghost"', kind: "enum", options: ["fill", "outline", "ghost"] },
    { name: "size", detail: '"sm" | "md" | "lg"', kind: "enum", options: ["sm", "md", "lg"] },
    { name: "label", detail: "ReactNode", kind: "node" },
    { name: "helperText", detail: "ReactNode", kind: "node" },
    { name: "errorText", detail: "ReactNode", kind: "node" },
    { name: "charCount", detail: "boolean", kind: "boolean" },
    { name: "autoGrow", detail: "boolean", kind: "boolean" },
    { name: "invalid", detail: "boolean", kind: "boolean" },
    { name: "valid", detail: "boolean", kind: "boolean" },
    { name: "successText", detail: "ReactNode", kind: "node" },
  ],
  Select: [
    { name: "options", detail: "SelectOption[]", kind: "array" },
    { name: "value", detail: "string", kind: "string" },
    { name: "defaultValue", detail: "string", kind: "string" },
    { name: "onValueChange", detail: "(value: string) => void", kind: "function" },
    { name: "placeholder", detail: "string", kind: "string" },
    { name: "size", detail: '"sm" | "md" | "lg"', kind: "enum", options: ["sm", "md", "lg"] },
  ],
  Checkbox: [
    { name: "checked", detail: "boolean", kind: "boolean" },
    { name: "defaultChecked", detail: "boolean", kind: "boolean" },
    { name: "indeterminate", detail: "boolean", kind: "boolean" },
    { name: "onCheckedChange", detail: "(checked: boolean) => void", kind: "function" },
  ],
  RadioGroup: [
    { name: "value", detail: "string", kind: "string" },
    { name: "defaultValue", detail: "string", kind: "string" },
    { name: "onValueChange", detail: "(value: string) => void", kind: "function" },
  ],
  Switch: [
    { name: "checked", detail: "boolean", kind: "boolean" },
    { name: "defaultChecked", detail: "boolean", kind: "boolean" },
    { name: "onCheckedChange", detail: "(checked: boolean) => void", kind: "function" },
  ],
  Slider: [
    { name: "value", detail: "number | [number, number]", kind: "number" },
    { name: "defaultValue", detail: "number | [number, number]", kind: "number" },
    { name: "min", detail: "number", kind: "number" },
    { name: "max", detail: "number", kind: "number" },
    { name: "step", detail: "number", kind: "number" },
    { name: "minStepsBetweenThumbs", detail: "number", kind: "number" },
    { name: "marks", detail: "{ value: number; label?: string }[]", kind: "array" },
    { name: "onValueChange", detail: "(value: number | [number, number]) => void", kind: "function" },
  ],
  ToggleGroup: [
    { name: "type", detail: '"single" | "multiple"', kind: "enum", options: ["single", "multiple"] },
    { name: "value", detail: "string | string[]", kind: "string" },
    { name: "defaultValue", detail: "string | string[]", kind: "string" },
    { name: "onValueChange", detail: "(value: string | string[]) => void", kind: "function" },
    { name: "variant", detail: '"chips" | "connected"', kind: "enum", options: ["chips", "connected"] },
    { name: "size", detail: '"sm" | "md"', kind: "enum", options: ["sm", "md"] },
    { name: "disabled", detail: "boolean", kind: "boolean" },
  ],
  OTPInput: [
    { name: "length", detail: "number", kind: "number" },
    { name: "value", detail: "string", kind: "string" },
    { name: "defaultValue", detail: "string", kind: "string" },
    { name: "onChange", detail: "(value: string) => void", kind: "function" },
    { name: "onComplete", detail: "(value: string) => void", kind: "function" },
    { name: "alphanumeric", detail: "boolean", kind: "boolean" },
    { name: "size", detail: '"sm" | "md" | "lg"', kind: "enum", options: ["sm", "md", "lg"] },
    { name: "invalid", detail: "boolean", kind: "boolean" },
  ],
  Tabs: [
    { name: "value", detail: "string", kind: "string" },
    { name: "defaultValue", detail: "string", kind: "string" },
    { name: "variant", detail: '"enclosed" | "line"', kind: "enum", options: ["enclosed", "line"] },
  ],
  Accordion: [
    { name: "type", detail: '"single" | "multiple"', kind: "enum", options: ["single", "multiple"] },
    { name: "defaultValue", detail: "string[]", kind: "array" },
  ],
  Avatar: [
    { name: "src", detail: "string", kind: "string" },
    { name: "srcSet", detail: "string", kind: "string" },
    { name: "sizes", detail: "string", kind: "string" },
    { name: "fallback", detail: "string", kind: "string" },
    { name: "size", detail: "number", kind: "number" },
    { name: "status", detail: '"online" | "away" | "busy" | "offline"', kind: "enum", options: ["online", "away", "busy", "offline"] },
    { name: "variant", detail: '"fill" | "accent" | "inverted"', kind: "enum", options: ["fill", "accent", "inverted"] },
    { name: "shape", detail: '"circle" | "square"', kind: "enum", options: ["circle", "square"] },
    { name: "max", detail: "number", kind: "number" },
  ],
  Alert: [
    { name: "variant", detail: '"info" | "success" | "warning" | "danger"', kind: "enum", options: ["info", "success", "warning", "danger"] },
    { name: "title", detail: "ReactNode", kind: "node" },
    { name: "dismissible", detail: "boolean", kind: "boolean" },
    { name: "onDismiss", detail: "() => void", kind: "function" },
  ],
  Spinner: [{ name: "size", detail: "number", kind: "number" }],
  Progress: [
    { name: "value", detail: "number", kind: "number" },
    { name: "max", detail: "number", kind: "number" },
  ],
  DataTable: [
    { name: "columns", detail: "DataTableColumn<T>[]", kind: "array" },
    { name: "rows", detail: "T[]", kind: "array" },
    { name: "getRowId", detail: "(row: T) => string", kind: "function" },
    { name: "initialSort", detail: '{ key: string; dir: "asc" | "desc" }', kind: "node" },
    { name: "onRowClick", detail: "(row: T) => void", kind: "function" },
  ],
  CodeBlock: [
    { name: "code", detail: "string", kind: "string" },
    { name: "filename", detail: "string", kind: "string" },
    { name: "language", detail: "string", kind: "string" },
    { name: "highlight", detail: "boolean", kind: "boolean" },
  ],
  SegmentedControl: [
    { name: "options", detail: "SegmentedOption[]", kind: "array" },
    { name: "value", detail: "string", kind: "string" },
    { name: "defaultValue", detail: "string", kind: "string" },
    { name: "onValueChange", detail: "(value: string) => void", kind: "function" },
  ],
  ProgressRing: [
    { name: "value", detail: "number", kind: "number" },
    { name: "min", detail: "number", kind: "number" },
    { name: "max", detail: "number", kind: "number" },
    { name: "size", detail: "number", kind: "number" },
    { name: "thickness", detail: "number", kind: "number" },
    { name: "variant", detail: '"accent" | "success" | "warning" | "danger" | "foreground"', kind: "enum", options: ["accent", "success", "warning", "danger", "foreground"] },
    { name: "label", detail: "ReactNode", kind: "node" },
    { name: "showValue", detail: "boolean", kind: "boolean" },
  ],
  Modal: [
    { name: "open", detail: "boolean", kind: "boolean" },
    { name: "onOpenChange", detail: "(open: boolean) => void", kind: "function" },
    { name: "size", detail: '"sm" | "md" | "lg"', kind: "enum", options: ["sm", "md", "lg"] },
  ],
  Drawer: [
    { name: "open", detail: "boolean", kind: "boolean" },
    { name: "onOpenChange", detail: "(open: boolean) => void", kind: "function" },
    { name: "side", detail: '"left" | "right" | "bottom"', kind: "enum", options: ["left", "right", "bottom"] },
  ],
  Tooltip: [
    { name: "content", detail: "ReactNode", kind: "node" },
    { name: "side", detail: '"top" | "bottom" | "left" | "right"', kind: "enum", options: ["top", "bottom", "left", "right"] },
    { name: "delay", detail: "number", kind: "number" },
    { name: "arrow", detail: "boolean", kind: "boolean" },
  ],
  DropdownMenu: [
    { name: "trigger", detail: "ReactNode", kind: "node" },
    { name: "side", detail: '"top" | "bottom"', kind: "enum", options: ["top", "bottom"] },
    { name: "align", detail: '"start" | "center" | "end"', kind: "enum", options: ["start", "center", "end"] },
  ],
  Command: [
    { name: "open", detail: "boolean", kind: "boolean" },
    { name: "onOpenChange", detail: "(open: boolean) => void", kind: "function" },
    { name: "groups", detail: "CommandGroup[]", kind: "array" },
    { name: "onQuerySubmit", detail: "(query: string) => void", kind: "function" },
  ],
  Toaster: [
    { name: "position", detail: '"top-left" | "top-center" | "top-right" | "bottom-left" | "bottom-center" | "bottom-right"', kind: "enum", options: ["top-left", "top-center", "top-right", "bottom-left", "bottom-center", "bottom-right"] },
    { name: "visibleToasts", detail: "number", kind: "number" },
    { name: "gap", detail: "number", kind: "number" },
  ],
  Reveal: [
    { name: "delay", detail: "number", kind: "number" },
    { name: "y", detail: "number", kind: "number" },
    { name: "once", detail: "boolean", kind: "boolean" },
  ],
  TextReveal: [
    { name: "text", detail: "string", kind: "string" },
    { name: "stagger", detail: "number", kind: "number" },
    { name: "delay", detail: "number", kind: "number" },
  ],
  Marquee: [
    { name: "duration", detail: "number", kind: "number" },
    { name: "reverse", detail: "boolean", kind: "boolean" },
    { name: "pauseOnHover", detail: "boolean", kind: "boolean" },
  ],
  Parallax: [{ name: "speed", detail: "number", kind: "number" }],
  Popover: [
    { name: "trigger", detail: "ReactNode", kind: "node" },
    { name: "side", detail: '"top" | "bottom" | "left" | "right"', kind: "enum", options: ["top", "bottom", "left", "right"] },
    { name: "align", detail: '"start" | "center" | "end"', kind: "enum", options: ["start", "center", "end"] },
    { name: "open", detail: "boolean", kind: "boolean" },
    { name: "onOpenChange", detail: "(open: boolean) => void", kind: "function" },
    { name: "arrow", detail: "boolean", kind: "boolean" },
  ],
  Combobox: [
    { name: "options", detail: "ComboboxOption[]", kind: "array" },
    { name: "value", detail: "string", kind: "string" },
    { name: "defaultValue", detail: "string", kind: "string" },
    { name: "emptyMessage", detail: "string", kind: "string" },
    { name: "searchable", detail: "boolean", kind: "boolean" },
    { name: "size", detail: '"sm" | "md" | "lg"', kind: "enum", options: ["sm", "md", "lg"] },
  ],
  Pagination: [
    { name: "total", detail: "number", kind: "number" },
    { name: "value", detail: "number", kind: "number" },
    { name: "defaultValue", detail: "number", kind: "number" },
    { name: "onChange", detail: "(page: number) => void", kind: "function" },
    { name: "compact", detail: "boolean", kind: "boolean" },
    { name: "siblingCount", detail: "number", kind: "number" },
  ],
  Rating: [
    { name: "max", detail: "number", kind: "number" },
    { name: "value", detail: "number", kind: "number" },
    { name: "defaultValue", detail: "number", kind: "number" },
    { name: "readOnly", detail: "boolean", kind: "boolean" },
    { name: "size", detail: '"sm" | "md" | "lg"', kind: "enum", options: ["sm", "md", "lg"] },
  ],
  TagInput: [
    { name: "value", detail: "string[]", kind: "array" },
    { name: "defaultValue", detail: "string[]", kind: "array" },
    { name: "onValueChange", detail: "(tags: string[]) => void", kind: "function" },
    { name: "max", detail: "number", kind: "number" },
    { name: "unique", detail: "boolean", kind: "boolean" },
  ],
  Steps: [
    { name: "steps", detail: "StepItem[]", kind: "array" },
    { name: "value", detail: "number", kind: "number" },
  ],
  Timeline: [
    { name: "items", detail: "TimelineItem[]", kind: "array" },
    { name: "tone", detail: '"neutral" | "accent" | "success" | "warning" | "danger"', kind: "enum", options: ["neutral", "accent", "success", "warning", "danger"] },
  ],
  EmptyState: [
    { name: "icon", detail: "ReactNode", kind: "node", template: "icon={<Icon$1 />}" },
    { name: "title", detail: "string", kind: "string" },
    { name: "action", detail: "ReactNode", kind: "node" },
    { name: "secondaryAction", detail: "ReactNode", kind: "node" },
    { name: "size", detail: '"sm" | "md"', kind: "enum", options: ["sm", "md"] },
  ],
  Stat: [
    { name: "value", detail: "string", kind: "string" },
    { name: "label", detail: "string", kind: "string" },
    { name: "delta", detail: "number", kind: "number" },
    { name: "deltaLabel", detail: "string", kind: "string" },
  ],
  NumberTicker: [
    { name: "value", detail: "number", kind: "number" },
    { name: "decimals", detail: "number", kind: "number" },
    { name: "prefix", detail: "string", kind: "string" },
    { name: "suffix", detail: "string", kind: "string" },
    { name: "duration", detail: "number", kind: "number" },
    { name: "startOnView", detail: "boolean", kind: "boolean" },
  ],
  Typewriter: [
    { name: "text", detail: "string", kind: "string" },
    { name: "speed", detail: "number", kind: "number" },
    { name: "loop", detail: "boolean", kind: "boolean" },
    { name: "caret", detail: "boolean", kind: "boolean" },
    { name: "startOnView", detail: "boolean", kind: "boolean" },
  ],
  SlideToConfirm: [
    { name: "label", detail: "string", kind: "string" },
    { name: "successLabel", detail: "string", kind: "string" },
    { name: "onConfirm", detail: "() => void | Promise<void>", kind: "function" },
    { name: "autoReset", detail: "number", kind: "number" },
    { name: "size", detail: '"sm" | "md" | "lg"', kind: "string" },
    { name: "disabled", detail: "boolean", kind: "boolean" },
  ],
  PressableCard: [
    { name: "tilt", detail: "boolean", kind: "boolean" },
    { name: "spotlight", detail: "boolean", kind: "boolean" },
    { name: "depth", detail: '"sm" | "md" | "lg"', kind: "string" },
    { name: "maxTilt", detail: "number", kind: "number" },
    { name: "onClick", detail: "() => void", kind: "function" },
  ],
  ChatThread: [
    { name: "messages", detail: "ChatMessageData[]", kind: "array" },
    { name: "typing", detail: "{ name, avatar } | null", kind: "node" },
    { name: "onReact", detail: "(id, emoji) => void", kind: "function" },
    { name: "onReply", detail: "(message) => void", kind: "function" },
    { name: "autoScroll", detail: "boolean", kind: "boolean" },
  ],
  ChatInput: [
    { name: "onSend", detail: "(text) => void", kind: "function" },
    { name: "placeholder", detail: "string", kind: "string" },
    { name: "emojiPicker", detail: "boolean", kind: "boolean" },
    { name: "maxLength", detail: "number", kind: "number" },
    { name: "disabled", detail: "boolean", kind: "boolean" },
  ],
  useChat: [
    { name: "seed", detail: "ChatMessageData[]", kind: "array" },
    { name: "autoReply", detail: "object", kind: "node" },
  ],
  MagneticButton: [
    { name: "strength", detail: "number", kind: "number" },
    { name: "shine", detail: "boolean", kind: "boolean" },
    { name: "variant", detail: '"primary" | "secondary" | "outline" | "ghost"', kind: "enum", options: ["primary", "secondary", "outline", "ghost"] },
    { name: "size", detail: '"sm" | "md" | "lg"', kind: "enum", options: ["sm", "md", "lg"] },
  ],
  Dock: [
    { name: "items", detail: "DockItem[]", kind: "array" },
    { name: "size", detail: "number", kind: "number" },
    { name: "maxScale", detail: "number", kind: "number" },
  ],
  Odometer: [
    { name: "value", detail: "number", kind: "number" },
    { name: "digits", detail: "number", kind: "number" },
    { name: "separator", detail: "string", kind: "string" },
  ],
  KineticHeadline: [
    { name: "text", detail: "string", kind: "string" },
    { name: "as", detail: '"h1" | "h2" | "h3" | "p" | "span"', kind: "enum", options: ["h1", "h2", "h3", "p", "span"] },
    { name: "stagger", detail: "number", kind: "number" },
  ],
  ScrambleText: [
    { name: "text", detail: "string", kind: "string" },
    { name: "charset", detail: "string", kind: "string" },
    { name: "speed", detail: "number", kind: "number" },
    { name: "trigger", detail: '"mount" | "view" | "hover"', kind: "enum", options: ["mount", "view", "hover"] },
  ],
  TiltCard: [
    { name: "maxTilt", detail: "number", kind: "number" },
    { name: "scale", detail: "number", kind: "number" },
    { name: "glare", detail: "boolean", kind: "boolean" },
  ],
  TicketCard: [
    { name: "stub", detail: "ReactNode", kind: "node" },
    { name: "perforated", detail: "boolean", kind: "boolean" },
  ],
};

/** DOM-ish props offered on every tag, after the component's own. */
const COMMON_PROPS: PollenProp[] = [
  { name: "onClick", detail: "MouseEventHandler", kind: "function" },
  { name: "className", detail: "string", kind: "string" },
  { name: "disabled", detail: "boolean", kind: "boolean" },
  { name: "children", detail: "ReactNode", kind: "node", template: 'children="$1"' },
  { name: "type", detail: "string", kind: "string" },
  { name: "aria-label", detail: "string", kind: "string" },
];

// ---------------------------------------------------------------------------
// Option lists and helpers.
// ---------------------------------------------------------------------------

const TAG_OPTIONS: Completion[] = [
  ...COMPONENT_NAMES.map((name) => ({
    label: name,
    detail: "pollen-ui",
    type: "class",
  })),
  ...ICON_NAMES.map((name) => ({
    label: name,
    detail: "pollen-ui icon",
    type: "constant",
  })),
];

const IMPORT_OPTIONS: Completion[] = [
  ...TAG_OPTIONS,
  ...UTILITY_FUNCTIONS.map((name) => ({
    label: name,
    detail: "pollen-ui",
    type: "function",
  })),
  ...UTILITY_CONSTANTS.map((name) => ({
    label: name,
    detail: "pollen-ui",
    type: "constant",
  })),
];

const WORD_ONLY = /^[\w$]*$/;
const ATTR_WORD_ONLY = /^[\w$-]*$/;

function escapeRegExp(source: string): string {
  return source.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * The word character set comes from the active language data, which
 * in the playground editor is @codemirror/lang-javascript ("$").
 */
function wordBefore(
  context: CompletionContext,
  includeDash: boolean,
): { from: number; to: number; text: string } | null {
  const [wordChars] = context.state.languageDataAt<string>(
    "wordChars",
    context.pos,
  );
  const pattern = new RegExp(
    "[\\w" + escapeRegExp(wordChars ?? "$") + (includeDash ? "-" : "") + "]*$",
  );
  return context.matchBefore(pattern);
}

/** True when the cursor sits inside the braces of a pollen-ui import. */
function inPollenImport(state: EditorState, pos: number): boolean {
  const after = state.sliceDoc(pos, Math.min(state.doc.length, pos + 400));
  const close = after.indexOf("}");
  if (close < 0) return true; // The from clause is not typed yet.
  const source = /^\s*from\s*["']([^"']+)["']/.exec(after.slice(close + 1));
  return source ? source[1] === "pollen-ui" : false;
}

/**
 * The tag the cursor is inside, when it sits in attribute position:
 * the last "<Tag" with nothing but attributes (no ">" or "<") after
 * it, and the cursor not inside a string or expression value.
 */
function jsxTagBefore(before: string): string | null {
  const match = /<([A-Za-z][\w.]*)[^<>]*$/.exec(before);
  if (!match) return null;
  const inner = match[0];
  if (((inner.match(/"/g))?.length ?? 0) % 2 === 1) return null;
  if (((inner.match(/\{/g))?.length ?? 0) > ((inner.match(/\}/g))?.length ?? 0)) {
    return null;
  }
  return match[1];
}

function templateFor(prop: PollenProp): string {
  if (prop.template) return prop.template;
  switch (prop.kind) {
    case "boolean":
      return prop.name;
    case "enum":
      return `${prop.name}="${prop.options?.[0] ?? ""}"`;
    case "number":
      return `${prop.name}={$1}`;
    case "function":
      return `${prop.name}={() => {$1}}`;
    case "array":
      return `${prop.name}={[$1]}`;
    case "node":
      return `${prop.name}={$1}`;
    default:
      return `${prop.name}="$1"`;
  }
}

function attrCompletion(prop: PollenProp, boost: number): Completion {
  return snippetCompletion(templateFor(prop), {
    label: prop.name,
    detail: prop.detail,
    type: prop.kind === "function" ? "function" : "property",
    boost,
  });
}

function attrOptions(tag: string): Completion[] {
  const options: Completion[] = [];
  const seen = new Set<string>();
  for (const prop of PROP_MAP[tag] ?? []) {
    options.push(attrCompletion(prop, 1));
    seen.add(prop.name);
  }
  for (const prop of COMMON_PROPS) {
    if (!seen.has(prop.name)) options.push(attrCompletion(prop, 0));
  }
  return options;
}

// ---------------------------------------------------------------------------
// The source.
// ---------------------------------------------------------------------------

export const pollenCompletions: CompletionSource = (
  context,
): CompletionResult | null => {
  const before = context.state.sliceDoc(
    Math.max(0, context.pos - 2000),
    context.pos,
  );

  // 1. Names inside `import { ... } from "pollen-ui"`.
  if (/import\s*\{[^{}]*$/.test(before) && inPollenImport(context.state, context.pos)) {
    const word = wordBefore(context, false);
    return {
      from: word ? word.from : context.pos,
      options: IMPORT_OPTIONS,
      validFor: WORD_ONLY,
    };
  }

  // 2. Tag names right after "<" or "</".
  const tag = context.matchBefore(/<\/?[\w.]*$/);
  if (tag && tag.text.startsWith("<")) {
    return {
      from: tag.from + (tag.text.startsWith("</") ? 2 : 1),
      options: TAG_OPTIONS,
      validFor: WORD_ONLY,
    };
  }

  // 3. Attributes inside an open JSX tag.
  const openTag = jsxTagBefore(before);
  if (openTag) {
    const word = wordBefore(context, true);
    return {
      from: word ? word.from : context.pos,
      options: attrOptions(openTag),
      validFor: ATTR_WORD_ONLY,
    };
  }

  return null;
};
