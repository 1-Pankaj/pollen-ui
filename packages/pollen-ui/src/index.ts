/**
 * Pollen UI
 * A React component library for Next.js. Careful typography,
 * spring-based motion, and light and dark themes out of the box.
 *
 * Import the stylesheet once in your app entry:
 *   import "pollen-ui/styles.css";
 */

// Primitives
export { Button, type ButtonProps, type ButtonVariant, type ButtonSize } from "./components/button";
export { Badge, type BadgeProps, type BadgeVariant } from "./components/badge";
export {
  Input,
  type InputProps,
  type FieldSize,
  type FieldVariant,
} from "./components/input";
export { Textarea, type TextareaProps } from "./components/textarea";
export { Label, type LabelProps } from "./components/label";
export {
  Select,
  type SelectProps,
  type SelectOption,
} from "./components/select";
export { Checkbox, type CheckboxProps } from "./components/checkbox";
export {
  RadioGroup,
  Radio,
  type RadioGroupProps,
  type RadioProps,
} from "./components/radio-group";
export { Switch, type SwitchProps } from "./components/switch";
export { Slider, type SliderProps } from "./components/slider";
export { Knob, type KnobProps, type KnobTone } from "./components/knob";
export {
  Stepper,
  type StepperProps,
  type StepperSize,
} from "./components/stepper";
export { Spinner, type SpinnerProps } from "./components/spinner";
export {
  Combobox,
  type ComboboxProps,
  type ComboboxOption,
} from "./components/combobox";
export {
  Pagination,
  type PaginationProps,
} from "./components/pagination";
export {
  Rating,
  type RatingProps,
  type RatingGlyph,
  type RatingTone,
} from "./components/rating";
export { TagInput, type TagInputProps } from "./components/tag-input";
export {
  ToggleGroup,
  ToggleGroupItem,
  type ToggleGroupProps,
  type ToggleGroupType,
} from "./components/toggle-group";
export { OTPInput, type OTPInputProps } from "./components/otp-input";
export { ProgressRing, type ProgressRingProps } from "./components/progress-ring";

// Overlays
export {
  Modal,
  ModalContent,
  ModalTitle,
  ModalDescription,
  ModalFooter,
  ModalClose,
  useModal,
  type ModalProps,
} from "./components/modal";
export {
  Drawer,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerBody,
  DrawerClose,
  type DrawerProps,
  type DrawerSide,
} from "./components/drawer";
export { Tooltip, type TooltipProps, type TooltipSide } from "./components/tooltip";
export {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  type DropdownMenuProps,
  type DropdownMenuItemProps,
} from "./components/dropdown-menu";
export {
  Command,
  type CommandProps,
  type CommandGroup,
  type CommandItem,
} from "./components/command";
export {
  Toaster,
  toast,
  type ToasterProps,
  type ToastOptions,
  type ToastVariant,
} from "./components/toast";
export {
  ToastPile,
  ToastPileProvider,
  useToastPile,
  type ToastPileProps,
  type ToastPileItem,
  type ToastPileVariant,
  type ToastPilePosition,
  type ToastPileApi,
  type ToastPileInput,
  type PileToastData,
} from "./components/overlays/toast-pile";
export { Popover, type PopoverProps } from "./components/popover";
export {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuLabel,
  type ContextMenuProps,
  type ContextMenuItemProps,
} from "./components/context-menu";

// Navigation and display
export {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  type TabsProps,
  type TabsVariant,
} from "./components/tabs";
export {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
} from "./components/breadcrumb";
export {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  type AccordionProps,
  type AccordionVariant,
  type AccordionIcon,
  type AccordionSize,
} from "./components/accordion";
export {
  Avatar,
  AvatarGroup,
  type AvatarProps,
  type AvatarGroupProps,
  type AvatarStatus,
} from "./components/avatar";
export { Alert, type AlertProps, type AlertVariant } from "./components/alert";
export {
  Skeleton,
  SkeletonText,
  type SkeletonProps,
  type SkeletonTextProps,
  type SkeletonEffect,
  type SkeletonShape,
} from "./components/skeleton";
export { Progress, type ProgressProps } from "./components/progress";
export { Kbd, type KbdProps } from "./components/kbd";
export {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  DataTable,
  type DataTableColumn,
  type DataTableProps,
  type SortDirection,
} from "./components/table";
export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "./components/card";
export {
  CodeBlock,
  type CodeBlockProps,
} from "./components/code-block";
export {
  SegmentedControl,
  type SegmentedControlProps,
  type SegmentedOption,
} from "./components/segmented-control";
export { Steps, type StepsProps } from "./components/steps";
export { Timeline, type TimelineProps, type TimelineItem } from "./components/timeline";
export {
  EmptyState,
  type EmptyStateProps,
  type EmptyStateSize,
  type EmptyStateTone,
  type EmptyScene,
} from "./components/empty-state";
export { Stat, type StatProps } from "./components/stat";

// Motion
export { Reveal, type RevealProps } from "./components/reveal";
export { TextReveal, type TextRevealProps } from "./components/text-reveal";
export { Marquee, type MarqueeProps } from "./components/marquee";
export { ScrollProgress, type ScrollProgressProps } from "./components/scroll-progress";
export { Parallax, type ParallaxProps } from "./components/parallax";
export { NumberTicker, type NumberTickerProps } from "./components/number-ticker";
export { Typewriter, type TypewriterProps } from "./components/typewriter";

// Motion presets and utilities
export { EASE_OUT, EASE, spring, fadeUp, overlayIn, type SpringName } from "./lib/motion";
export { cn } from "./lib/utils";
export * from "./lib/z-index";

// Icons - drawn for Pollen, shipped with the library
export type { IconProps } from "./icons";
export {
  IconAlignLeft, IconAlert, IconArchive, IconArrowDownRight, IconArrowLeft,
  IconArrowRight, IconArrowUpRight, IconBars, IconBell, IconBolt, IconBook,
  IconBox, IconCard, IconCheck, IconCheckSquare, IconChevronDown,
  IconChevronLeft, IconChevronRight, IconChevronUp, IconChat, IconCircle,
  IconCircleCheck, IconCircleClose, IconClose, IconCode, IconCommand,
  IconCopy, IconCube, IconCursorClick, IconDatabase, IconDeploy, IconDock, IconDots,
  IconDownload, IconExternal, IconEye, IconFileCode, IconFilter, IconFlask,
  IconGauge, IconGithub, IconGlobe, IconGrip, IconHash, IconHeadline,
  IconHeart, IconHistory, IconInfo, IconKeyboard, IconLayers, IconLetter,
  IconList, IconListOrdered, IconLoader, IconLock, IconMagnet, IconMail,
  IconMenu, IconMinus, IconMonitor, IconMoon, IconOdometer, IconPackage,
  IconPanelBottom, IconPanelLeft, IconPanels, IconPercent, IconPetal,
  IconPencil, IconPlay, IconPlus, IconPopover, IconRadioDot, IconRepeat,
  IconRing, IconRoute, IconRotate, IconScramble, IconSearch, IconSeed,
  IconSettings, IconSliders, IconSplit, IconSun, IconSwatches, IconTable,
  IconTag, IconTags, IconTerminal, IconTerminalSquare, IconTextCursor,
  IconTextSelect, IconTicket, IconTilt, IconTrash, IconTrend,
  IconToggle, IconType,
  IconUser, IconUserPlus, IconUsers, IconWindow, IconWind,
} from "./icons";

// Signatures - the uncommon parts
export { MagneticButton, type MagneticButtonProps } from "./components/buttons/magnetic-button";
export {
  SlideToConfirm,
  type SlideToConfirmProps,
  type SlideToConfirmSize,
  type SlideToConfirmTone,
} from "./components/buttons/slide-to-confirm";
export {
  ChatMessage,
  ChatThread,
  ChatInput,
  TypingIndicator,
  useChat,
  DEFAULT_QUICK_REACTIONS,
  type ChatMessageProps,
  type ChatThreadProps,
  type ChatInputProps,
  type ChatMessageData,
  type ChatAuthor,
  type ChatReaction,
  type MessageStatus,
  type UseChatOptions,
} from "./components/chat/chat";
export {
  PressableCard,
  type PressableCardProps,
  type PressableVariant,
  type PressableDepth,
} from "./components/interactive/pressable-card";
export {
  Dock,
  type DockProps,
  type DockItem,
  type DockPosition,
  type DockLabelMode,
} from "./components/nav/dock";
export { Odometer, type OdometerProps } from "./components/data/odometer";
export {
  TiltCard,
  type TiltCardProps,
  type TiltAxis,
  type TiltSpring,
} from "./components/cards/tilt-card";
export { TicketCard, type TicketCardProps } from "./components/cards/ticket-card";
export { KineticHeadline, type KineticHeadlineProps } from "./components/text/kinetic-headline";
export {
  ScrambleText,
  type ScrambleTextProps,
  type ScramblePreset,
} from "./components/text/scramble-text";
export {
  CompareSlider,
  type CompareSliderProps,
} from "./components/compare-slider";
export {
  ActivityHeatmap,
  type ActivityHeatmapProps,
  type HeatmapDatum,
} from "./components/activity-heatmap";
