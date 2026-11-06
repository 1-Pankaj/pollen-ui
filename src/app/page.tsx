import Link from "next/link";
import {
  IconArrowRight as ArrowRight,
  IconBox as Box,
  IconCode as Braces,
  IconCheck as Check,
  IconFlask as FlaskConical,
  IconGauge as Gauge,
  IconKeyboard as Keyboard,
  IconLayers as Layers,
  IconPanels as LayoutGrid,
  IconPackage as Package,
  IconSearch as IconSearch,
  IconSwatches as Palette,
  IconSun as SunMoon,
  IconWind as Wind,
  IconPetal as Sparkles,
} from "pollen-ui";
import { cn } from "pollen-ui";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Alert,
  Avatar,
  AvatarGroup,
  Badge,
  Button,
  Checkbox,
  CodeBlock,
  Input,
  Kbd,
  Marquee,
  Progress,
  Rating,
  Reveal,
  SegmentedControl,
  Skeleton,
  Slider,
  Spinner,
  Switch,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Tooltip,
  Dock,
  KineticHeadline,
  Odometer,
  ScrambleText,
  TiltCard,
  TicketCard,
  IconTicket,
} from "pollen-ui";
import { HeroScene } from "@/components/site/hero-scene";
import { HeroHeadline } from "@/components/site/hero-headline";
import { HeroActions } from "@/components/site/hero-actions";
import { HeroStage } from "@/components/site/hero-stage";
import { TemplateFrame } from "@/components/site/template-frame";
import { NavbarPill } from "@/components/templates/navbars";
import { HeroStatement } from "@/components/templates/heroes";
import { iconForSlug } from "@/components/site/component-icons";
import { SpotlightCard } from "@/components/site/spotlight-card";
import { CopyCommand } from "@/components/site/copy-command";
import { MotionDemo } from "@/components/site/motion-demo";
import { ThemePreview } from "@/components/site/theme-preview";
import { ThemeStudio } from "@/components/site/theme-studio";
import PlaygroundLoader from "@/components/site/playground/playground-loader";
import { FireToast } from "@/components/demos/fire-toast";
import { DemoButtons } from "@/components/demos/demo-buttons";
import { OdometerDemo } from "@/components/demos/odometer-demo";
import { DockDemo } from "@/components/demos/dock-demo";
import { SliderRangeTile } from "@/components/demos/slider-demo";
import { ChatDemo } from "@/components/demos/chat-demo";
import { SlideConfirmWideDemo } from "@/components/demos/slide-confirm-demo";
import { PressableRowDemo } from "@/components/demos/pressable-demo";
import { componentIndex } from "@/lib/registry";

const GITHUB_URL = "https://github.com/1-Pankaj/pollen-ui";

const COMPONENT_COUNT = componentIndex.length;

const stack = ["Next.js 16", "React 19", "Tailwind CSS 4", "Framer Motion", "TypeScript"];

const features = [
  {
    icon: <Keyboard className="h-5 w-5" />,
    title: "Keyboard first",
    description:
      "Focus rings, roving tab index, arrow keys, and Escape. Every interactive component works without a mouse.",
  },
  {
    icon: <SunMoon className="h-5 w-5" />,
    title: "Light and dark",
    description:
      "Both themes are designed together and ship in one stylesheet. They follow the system setting by default.",
  },
  {
    icon: <Gauge className="h-5 w-5" />,
    title: "Motion with intent",
    description:
      "Springs for interruptible movement, ease-out for entrances, and nothing that takes longer than 300 milliseconds.",
  },
  {
    icon: <Braces className="h-5 w-5" />,
    title: "Strictly typed",
    description:
      "Every prop and variant is typed. If it compiles, it renders, and the defaults are the ones you would have picked.",
  },
  {
    icon: <Palette className="h-5 w-5" />,
    title: "Yours to theme",
    description:
      "Colors, radii and shadows are CSS variables. Change one file and the whole library follows.",
  },
  {
    icon: <Package className="h-5 w-5" />,
    title: "Tree-shakeable",
    description:
      "ESM builds with no side effects. Import the two components you need and ship just those.",
  },
];

const accessibilityPoints = [
  "Full keyboard support on every interactive component, including arrow keys and roving tab index",
  "Focus rings you can actually see, tuned separately for light and dark",
  "ARIA roles, states and labels are part of how each component is built, from the first commit",
  "prefers-reduced-motion quiets every animation, in the library and on this site",
];

const libraryGroups = [
  {
    label: "Primitives",
    icon: <Box className="h-5 w-5" />,
    blurb:
      "Fields, buttons and controls with the states you actually ship: hover, focus, invalid, loading, disabled.",
    slugs: ["button", "badge", "input", "textarea", "label", "select", "combobox", "checkbox", "radio-group", "switch", "slider", "rating", "tag-input", "toggle-group", "otp-input"],
  },
  {
    label: "Display",
    icon: <LayoutGrid className="h-5 w-5" />,
    blurb:
      "Structure for content and status: tables, cards, code, avatars, stats, and the small labels in between.",
    slugs: ["tabs", "breadcrumb", "accordion", "avatar", "alert", "skeleton", "spinner", "progress", "progress-ring", "kbd", "table", "card", "code-block", "segmented-control", "pagination", "steps", "timeline", "stat", "empty-state"],
  },
  {
    label: "Overlays",
    icon: <Layers className="h-5 w-5" />,
    blurb:
      "Portaled, focus-trapped and Escape-ready. They stack in the right order and return focus where it belongs.",
    slugs: ["modal", "drawer", "popover", "tooltip", "dropdown-menu", "context-menu", "command", "toast"],
  },
  {
    label: "Motion",
    icon: <Wind className="h-5 w-5" />,
    blurb:
      "Springs and reveals that wrap any element, and quiet themselves when the system asks for reduced motion.",
    slugs: ["reveal", "text-reveal", "marquee", "scroll-progress", "parallax", "number-ticker", "typewriter"],
  },
  {
    label: "Signatures",
    icon: <Sparkles className="h-5 w-5" />,
    blurb:
      "The pieces no tutorial gives you: a dock with real physics, rolling digits, decoding text, cards that tilt and tear.",
    slugs: ["dock", "kinetic-headline", "magnetic-button", "odometer", "slide-to-confirm", "scramble-text", "ticket-card", "tilt-card", "pressable-card"],
  },
];

const faqs = [
  {
    q: "Is Pollen UI free to use?",
    a: "Yes. It is released under the MIT license, so it works for personal projects and commercial products alike.",
  },
  {
    q: "Which frameworks does it support?",
    a: "It is built and tested for Next.js with the App Router, and works in any React 18 or newer project that uses Tailwind CSS.",
  },
  {
    q: "What does it depend on?",
    a: "Framer Motion for springs, gestures and scroll-linked motion, plus clsx, tailwind-merge and class-variance-authority for styling helpers. There is nothing else at runtime.",
  },
  {
    q: "How do I install it?",
    a: "Install the package, import the stylesheet once, and add the source folder to your Tailwind sources. The installation page walks through every step.",
  },
  {
    q: "How does dark mode work?",
    a: "Add the .dark class to your html element, or set data-theme to dark. Both themes ship in the same stylesheet and every component follows.",
  },
  {
    q: "Can I change how it looks?",
    a: "Every color, radius and shadow is a CSS variable. Override the tokens in one file and the whole library follows, in both themes.",
  },
];

function Tile({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <SpotlightCard className="rounded-2xl bg-card p-4 shadow-[var(--pollen-shadow-sm)] transition-[box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:shadow-[var(--pollen-shadow-md)]">
      <div className="relative flex min-h-[150px] items-center justify-center rounded-xl bg-fill/50 p-5">
        {children}
      </div>
      <p className="relative px-1 pb-1 pt-3.5 text-[15px] font-medium text-muted-foreground">
        {label}
      </p>
    </SpotlightCard>
  );
}

function SectionHeading({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Reveal>
      <p className="text-sm font-semibold text-accent">{eyebrow}</p>
      <h2 className="mt-3 max-w-2xl text-balance text-4xl font-semibold leading-[1.08] tracking-[-0.03em] sm:text-5xl">
        {title}
      </h2>
      <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
        {children}
      </p>
    </Reveal>
  );
}

export default function Home() {
  return (
    <>
      {/* Hero: the library floats around its own headline */}
      <section className="relative flex min-h-[calc(100svh-64px)] flex-col overflow-hidden">
        <HeroScene />
        <div className="relative z-10 mx-auto flex w-full max-w-[1200px] flex-1 flex-col items-center justify-center px-6 pb-40 pt-28 text-center">
          <HeroHeadline />
          <Reveal delay={0.45}>
            <p className="mx-auto mt-7 max-w-xl text-balance text-lg leading-relaxed text-muted-foreground sm:text-xl">
              An open source React library: {COMPONENT_COUNT} components,
              motion that feels physical, and light and dark themes
              designed together. Built for Next.js.
            </p>
          </Reveal>
          <Reveal delay={0.55}>
            <div className="mt-8 flex justify-center">
              <CopyCommand />
            </div>
          </Reveal>
        </div>
        <div className="absolute inset-x-0 bottom-7 z-10 flex justify-center">
          <HeroActions />
        </div>
      </section>

      {/* Component strip: a quiet bridge out of the hero */}
      <section className="border-none py-10">
        <Reveal>
          <Marquee duration={44}>
            {componentIndex.map((entry) => (
              <Link
                key={entry.slug}
                href={`/docs/${entry.slug}`}
                className="mx-1.5 flex items-center gap-2.5 rounded-full bg-card py-1.5 pl-2 pr-4 text-[13px] font-medium text-muted-foreground shadow-[var(--pollen-shadow-xs)] transition-colors duration-150 hover:text-foreground"
              >
                <span
                  aria-hidden="true"
                  className="flex h-6 w-6 items-center justify-center rounded-full bg-fill text-muted-foreground [&>svg]:h-3.5 [&>svg]:w-3.5"
                >
                  {iconForSlug(entry.slug)}
                </span>
                {entry.title}
              </Link>
            ))}
          </Marquee>
          <p className="mt-8 text-center text-base text-faint">
            Press{" "}
            <Kbd className="mx-0.5">⌘</Kbd>
            <Kbd className="mx-0.5">K</Kbd>{" "}
            anywhere on this site to search the docs
          </p>
        </Reveal>
      </section>

      {/* The stage: one composition, real components */}
      <section>
        <div className="mx-auto max-w-[1200px] px-6 pb-24 pt-10 sm:pb-32 sm:pt-14">
          <Reveal>
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-semibold text-accent">The stage</p>
              <h2 className="mt-3 text-balance text-4xl font-semibold leading-[1.08] tracking-[-0.03em] sm:text-5xl">
                A product window, entirely ours
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-muted-foreground sm:text-xl">
                A product window built entirely from the library. Change
                the range, flip the switch, open the logs. Nothing here is
                a screenshot.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.15} className="mt-14">
            <HeroStage />
          </Reveal>
        </div>
      </section>

      {/* Principles and stack */}
      <section className="bg-fill/40">
        <div className="mx-auto max-w-[1200px] px-6 py-16 sm:py-20">
          <Reveal>
            <p className="mx-auto max-w-2xl text-balance text-center text-2xl font-semibold leading-snug tracking-[-0.02em] text-foreground sm:text-[28px]">
              One install. Zero config. Light and dark, each given its
              own full design.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-2.5">
              {stack.map((item) => (
                <span
                  key={item}
                  className="rounded-full bg-card px-4 py-2 text-[15px] font-medium text-muted-foreground shadow-[var(--pollen-shadow-xs)]"
                >
                  {item}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Features */}
      <section>
        <div className="mx-auto max-w-[1200px] px-6 py-24 sm:py-32">
          <SectionHeading eyebrow="Craft" title="The details do the work">
            Focus rings tuned per theme. Springs that reverse mid-gesture.
            Errors announced before you tab away. Decisions you feel
            every day, quietly, in the background.
          </SectionHeading>
          <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <Reveal key={feature.title} delay={index * 0.05}>
                <SpotlightCard className="h-full rounded-3xl bg-card p-8 shadow-[var(--pollen-shadow-sm)] transition-[box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:shadow-[var(--pollen-shadow-md)]">
                  <span className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-fill text-foreground">
                    {feature.icon}
                  </span>
                  <h3 className="relative mt-6 text-lg font-semibold tracking-[-0.01em] text-foreground">
                    {feature.title}
                  </h3>
                  <p className="relative mt-2.5 text-base leading-relaxed text-muted-foreground">
                    {feature.description}
                  </p>
                </SpotlightCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Live components */}
      <section className="bg-fill/40">
        <div className="mx-auto max-w-[1200px] px-6 py-24 sm:py-32">
          <SectionHeading eyebrow="Components" title="Everything on this page runs">
            These are the real components, rendered by the same code
            you would import. Type into the fields, drag the sliders,
            open the menus.
          </SectionHeading>

          <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Reveal>
              <Tile label="Buttons">
                <DemoButtons />
              </Tile>
            </Reveal>
            <Reveal delay={0.05}>
              <Tile label="Badges">
                <div className="flex flex-col items-center gap-3">
                  <div className="flex flex-wrap justify-center gap-2">
                    <Badge dot>Building</Badge>
                    <Badge dot variant="accent">New</Badge>
                    <Badge dot variant="success">Ready</Badge>
                    <Badge dot variant="warning">Pending</Badge>
                    <Badge variant="solid">v2.0</Badge>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge count={3} size="sm" />
                    <Badge count={12} size="sm" />
                    <Badge count={128} size="sm" />
                    <Badge variant="accent" dismissible size="sm">Pro plan</Badge>
                  </div>
                </div>
              </Tile>
            </Reveal>
            <Reveal delay={0.1}>
              <Tile label="Input">
                <Input
                  icon={<IconSearch className="h-4 w-4" />}
                  clearable
                  defaultValue="pollen-web"
                  aria-label="Project name"
                  className="max-w-[240px]"
                />
              </Tile>
            </Reveal>
            <Reveal>
              <Tile label="Controls">
                <div className="flex flex-col items-start gap-3.5">
                  <Switch defaultChecked description="Shown on your public page" aria-label="Public profile">
                    Public profile
                  </Switch>
                  <Checkbox defaultChecked description="One email a week, nothing more">
                    Email digests
                  </Checkbox>
                  <Checkbox indeterminate>Partial selection</Checkbox>
                </div>
              </Tile>
            </Reveal>
            <Reveal delay={0.05}>
              <Tile label="Slider">
                <SliderRangeTile />
              </Tile>
            </Reveal>
            <Reveal delay={0.1}>
              <Tile label="Tabs">
                <Tabs defaultValue="preview">
                  <TabsList aria-label="View">
                    <TabsTrigger value="preview">Preview</TabsTrigger>
                    <TabsTrigger value="code">Code</TabsTrigger>
                  </TabsList>
                  <TabsContent value="preview" className="pt-4 text-center text-[15px] text-muted-foreground">
                    Rendered output
                  </TabsContent>
                  <TabsContent value="code" className="pt-4 text-center text-[15px] text-muted-foreground">
                    Source code
                  </TabsContent>
                </Tabs>
              </Tile>
            </Reveal>
            <Reveal>
              <Tile label="Segmented control">
                <SegmentedControl
                  defaultValue="week"
                  aria-label="Range"
                  options={[
                    { value: "day", label: "Day" },
                    { value: "week", label: "Week" },
                    { value: "month", label: "Month" },
                  ]}
                />
              </Tile>
            </Reveal>
            <Reveal delay={0.05}>
              <Tile label="Alert">
                <Alert variant="success" title="Deployment complete" className="max-w-[280px]">
                  pollen-web is live.
                </Alert>
              </Tile>
            </Reveal>
            <Reveal delay={0.1}>
              <Tile label="Avatars">
                <AvatarGroup max={4}>
                  <Avatar size={36} src="/avatars/jo.jpg" fallback="Jo Chen" />
                  <Avatar size={36} src="/avatars/sam.jpg" fallback="Sam Ortiz" />
                  <Avatar size={36} src="/avatars/rae.jpg" fallback="Rae Kim" />
                  <Avatar size={36} src="/avatars/tim.jpg" fallback="Tim Blum" />
                  <Avatar size={36} src="/avatars/alan.jpg" fallback="Nia West" />
                </AvatarGroup>
              </Tile>
            </Reveal>
            <Reveal>
              <Tile label="Progress">
                <div className="w-full max-w-[220px]">
                  <Progress value={62} striped showValue />
                  <div className="mt-4 flex items-center gap-2 text-[15px] text-muted-foreground">
                    <Spinner size={15} /> Uploading
                  </div>
                </div>
              </Tile>
            </Reveal>
            <Reveal delay={0.05}>
              <Tile label="Toast">
                <FireToast />
              </Tile>
            </Reveal>
            <Reveal delay={0.1}>
              <Tile label="Accordion">
                <Accordion type="single" defaultValue={["one"]} className="w-full max-w-[300px]">
                  <AccordionItem value="one">
                    <AccordionTrigger value="one">What is Pollen UI?</AccordionTrigger>
                    <AccordionContent value="one">
                      A React component library for Next.js.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="two">
                    <AccordionTrigger value="two">Is it free?</AccordionTrigger>
                    <AccordionContent value="two">
                      Yes, MIT licensed.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </Tile>
            </Reveal>
            <Reveal delay={0.1}>
              <Tile label="Rating">
                <div className="flex flex-col items-center gap-2 py-1">
                  <Rating
                    defaultValue={0}
                    labels={["Poor", "Fair", "Good", "Great", "Exceptional"]}
                    aria-label="Rate this page"
                  />
                  <Rating value={4.5} readOnly aria-label="Average rating" />
                </div>
              </Tile>
            </Reveal>
            <Reveal delay={0.05}>
              <Tile label="Skeleton">
                <div className="w-full max-w-[240px]">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-3 w-28" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  </div>
                  <div className="mt-4 space-y-2.5">
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-3/5" />
                  </div>
                </div>
              </Tile>
            </Reveal>
          </div>

          <Reveal>
            <div className="mt-14 text-center">
              <Link
                href="/docs/button"
                className="inline-flex items-center gap-1.5 text-base font-medium text-foreground underline-offset-4 transition-colors hover:underline"
              >
                Browse all {COMPONENT_COUNT} components
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Signatures: the components you cannot paste from a tutorial */}
      <section>
        <div className="mx-auto max-w-[1200px] px-6 py-24 sm:py-32">
          <SectionHeading eyebrow="Signatures" title="The uncommon parts">
            Every library has a button. These are the pieces you stay
            for: a dock with real physics, digits that roll, cards that
            tilt and tear. Each one started as an empty file here.
          </SectionHeading>

          <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Reveal>
              <Tile label="Dock">
                <DockDemo />
              </Tile>
            </Reveal>
            <Reveal delay={0.05}>
              <Tile label="Odometer">
                <OdometerDemo />
              </Tile>
            </Reveal>
            <Reveal delay={0.1}>
              <Tile label="Scramble Text">
                <div className="py-2 text-center">
                  <ScrambleText
                    text="moving with you"
                    trigger="view"
                    speed={26}
                    className="font-mono text-[15px] text-foreground"
                  />
                  <p className="mt-3 text-xs text-faint">decodes as you arrive, replays on hover</p>
                </div>
              </Tile>
            </Reveal>
            <Reveal>
              <Tile label="Kinetic Headline">
                <div className="w-full py-2 text-center">
                  <KineticHeadline
                    as="p"
                    text="Type with intent"
                    className="text-xl font-semibold tracking-[-0.02em] text-foreground"
                  />
                </div>
              </Tile>
            </Reveal>
            <Reveal delay={0.05}>
              <Tile label="Tilt Card">
                <div className="w-full py-2 [perspective:800px]">
                  <TiltCard
                    maxTilt={9}
                    glare
                    className="mx-auto w-full max-w-[230px] rounded-xl bg-card p-4 shadow-[var(--pollen-shadow-md)]"
                  >
                    <p className="text-xs font-medium text-muted-foreground">Quarterly report</p>
                    <p className="mt-0.5 text-[15px] font-semibold text-foreground">Spring release</p>
                    <p className="mt-1.5 text-[13px] leading-snug text-muted-foreground">
                      Moves with your pointer, light where you look.
                    </p>
                  </TiltCard>
                </div>
              </Tile>
            </Reveal>
            <Reveal delay={0.1}>
              <Tile label="Ticket Card">
                <TicketCard
                  className="w-full max-w-[320px] bg-card p-5 shadow-[var(--pollen-shadow-md)]"
                  stub={
                    <div className="flex h-full w-12 flex-col items-center justify-center">
                      <IconTicket className="h-4.5 w-4.5 text-accent" />
                      <span className="mt-1 font-mono text-[10px] text-faint">0042</span>
                    </div>
                  }
                >
                  <p className="text-[15px] font-semibold text-foreground">Night Bloom Society</p>
                  <p className="mt-0.5 text-[13px] text-muted-foreground">Table for two, 19:30</p>
                </TicketCard>
              </Tile>
            </Reveal>
          </div>

          <Reveal delay={0.1}>
            <div className="mt-12 text-center">
              <Link
                href="/docs/dock"
                className="inline-flex items-center gap-1.5 text-base font-medium text-foreground underline-offset-4 transition-colors hover:underline"
              >
                Browse the signatures
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Templates: whole pages, prebuilt */}
      <section className="bg-fill/40">
        <div className="mx-auto max-w-[1200px] px-6 py-24 sm:py-32">
          <SectionHeading eyebrow="Templates" title="Skip the blank page">
            Hero sections, five styles of navbar, pricing, auth,
            footers. Whole production surfaces built from live
            components, each preview carrying its own theme switch so
            you can judge it in light and dark, in place.
          </SectionHeading>

          <div className="mt-16 grid gap-8 lg:grid-cols-2">
            <Reveal>
              <TemplateFrame
                title="Floating pill nav"
                description="A detached, blurred pill that floats over the content."
                url="studio.pollen.design"
              >
                <NavbarPill />
              </TemplateFrame>
            </Reveal>
            <Reveal delay={0.08}>
              <TemplateFrame
                title="Bold statement hero"
                description="Oversized type, one accent word, and the install command."
                url="nimbus.dev"
                defaultTheme="dark"
              >
                <HeroStatement />
              </TemplateFrame>
            </Reveal>
          </div>

          <Reveal delay={0.1}>
            <div className="mt-12 flex flex-col items-center gap-4 text-center">
              <p className="max-w-xl text-balance text-[15.5px] leading-relaxed text-muted-foreground">
                Five navbars, three heroes, and every section between
                them, from pricing to the closing banner.
              </p>
              <Link
                href="/templates"
                className="group inline-flex h-11 items-center gap-2 rounded-[12px] bg-foreground px-5 text-[15px] font-medium text-background shadow-[var(--pollen-shadow-xs)] transition-[opacity,transform] duration-150 hover:opacity-90 active:scale-[0.98]"
              >
                Browse all templates
                <ArrowRight className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-0.5" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Premium: the pieces other libraries paywall */}
      <section className="bg-fill/40">
        <div className="mx-auto max-w-[1200px] px-6 py-24 sm:py-32">
          <SectionHeading eyebrow="Premium tier" title="The parts they charge for">
            Stacked toasts with real physics. A chat surface with
            reactions, delivery ticks and a typing presence. A gesture
            that makes the delete button think twice. This is the tier
            other libraries put behind a paywall; it ships here in the
            MIT one.
          </SectionHeading>

          <div className="mt-16 grid items-start gap-4 lg:grid-cols-[minmax(0,5fr)_minmax(0,4fr)]">
            <Reveal>
              <div className="rounded-3xl bg-card p-6 shadow-[var(--pollen-shadow-sm)]">
                <div className="mb-5 flex items-baseline justify-between gap-4">
                  <div>
                    <p className="text-[15px] font-semibold tracking-[-0.01em] text-foreground">Chat, the whole surface</p>
                    <p className="mt-1 text-[13.5px] text-muted-foreground">
                      Reactions on hover, delivery ticks, grouping, typing. Send something.
                    </p>
                  </div>
                  <Link href="/docs/chat" className="shrink-0 text-[13.5px] font-medium text-accent underline-offset-4 hover:underline">
                    Docs
                  </Link>
                </div>
                <ChatDemo className="mx-auto flex h-[430px] w-full max-w-[400px] flex-col overflow-hidden rounded-2xl bg-fill/60 shadow-none ring-1 ring-[var(--pollen-border)]" />
              </div>
            </Reveal>

            <div className="flex flex-col gap-4">
              <Reveal delay={0.05}>
                <div className="rounded-3xl bg-card p-6 shadow-[var(--pollen-shadow-sm)]">
                  <p className="text-[15px] font-semibold tracking-[-0.01em] text-foreground">Toasts that pile up</p>
                  <p className="mt-1 text-[13.5px] leading-relaxed text-muted-foreground">
                    The newest lands in front, the rest peek behind it.
                    Hover the pile to fan it out, swipe a card away,
                    click one to bring it forward.
                  </p>
                  <div className="mt-5">
                    <FireToast />
                  </div>
                </div>
              </Reveal>
              <Reveal delay={0.1}>
                <div className="rounded-3xl bg-card p-6 shadow-[var(--pollen-shadow-sm)]">
                  <p className="text-[15px] font-semibold tracking-[-0.01em] text-foreground">Slide to confirm</p>
                  <p className="mt-1 text-[13.5px] leading-relaxed text-muted-foreground">
                    For the buttons that should never be clicked by
                    accident. Keyboard works: focus the handle, press
                    Enter, or walk it with the arrow keys.
                  </p>
                  <div className="mt-5">
                    <SlideConfirmWideDemo />
                  </div>
                </div>
              </Reveal>
            </div>
          </div>

          <Reveal delay={0.1}>
            <div className="mt-4">
              <PressableRowDemo />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Playground */}
      <section>
        <div className="mx-auto max-w-[1200px] px-6 py-24 sm:py-32">
          <SectionHeading eyebrow="Playground" title="Try it before you install it">
            A real editor with the real library, running in your browser.
            Change the code, press Run, watch it render, then copy what
            you built straight into your project.
          </SectionHeading>
          <Reveal delay={0.1} className="mt-14">
            <PlaygroundLoader />
          </Reveal>
          <Reveal delay={0.15}>
            <div className="mt-8 flex flex-col items-center gap-3 text-center">
              <p className="text-[15px] text-muted-foreground">
                Seven starter examples, every component in scope, saved
                locally as you type.
              </p>
              <Link
                href="/playground"
                className="group inline-flex h-11 items-center gap-2 rounded-[12px] bg-foreground px-5 text-[15px] font-medium text-background shadow-[var(--pollen-shadow-xs)] transition-[opacity,transform] duration-150 hover:opacity-90 active:scale-[0.98]"
              >
                <FlaskConical className="h-4 w-4" />
                Open the full Playground
                <ArrowRight className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-0.5" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Motion */}
      <section>
        <div className="mx-auto grid max-w-[1200px] items-center gap-12 px-6 py-24 sm:py-32 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <p className="text-sm font-semibold text-accent">Motion</p>
            <h2 className="mt-3 max-w-md text-balance text-4xl font-semibold leading-[1.08] tracking-[-0.03em] sm:text-5xl">
              Motion that earns its place
            </h2>
            <p className="mt-5 max-w-lg text-lg leading-relaxed text-muted-foreground sm:text-xl">
              Every animation runs on springs. They start, stop and
              reverse with your fingers, so interfaces feel like objects
              instead of slideshows. Entrances stay under 300
              milliseconds, and nothing moves unless it helps.
            </p>
            <ul className="mt-9 space-y-4 text-base text-foreground sm:text-[17px]">
              {[
                "Springs for anything you can touch or drag",
                "Ease-out for entrances, nothing animating from zero",
                "Reduced motion preferences respected everywhere",
              ].map((line) => (
                <li key={line} className="flex items-start gap-3">
                  <Check className="mt-1.5 h-4 w-4 shrink-0 text-foreground" />
                  {line}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.1}>
            <MotionDemo />
          </Reveal>
        </div>
      </section>

      {/* Themes */}
      <section className="bg-fill/40">
        <div className="mx-auto grid max-w-[1200px] items-center gap-12 px-6 py-24 sm:py-32 lg:grid-cols-2 lg:gap-16">
          <Reveal className="lg:order-2">
            <p className="text-sm font-semibold text-accent">Theming</p>
            <h2 className="mt-3 max-w-md text-balance text-4xl font-semibold leading-[1.08] tracking-[-0.03em] sm:text-5xl">
              Both themes, first class
            </h2>
            <p className="mt-5 max-w-lg text-lg leading-relaxed text-muted-foreground sm:text-xl">
              Each theme gets its own complete design. Dark surfaces
              lift with a faint top edge, the way light falls on a real
              object, so depth still reads without a single outline.
              Flip the preview to compare.
            </p>
            <div className="mt-8">
              <Link
                href="/docs/theming"
                className="inline-flex items-center gap-1.5 text-base font-medium text-foreground underline-offset-4 transition-colors hover:underline"
              >
                Read the theming guide
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </Reveal>
          <Reveal delay={0.1} className="lg:order-1">
            <ThemePreview />
          </Reveal>
        </div>
      </section>

      {/* Theme studio */}
      <section>
        <div className="mx-auto max-w-[1200px] px-6 py-24 sm:py-32">
          <SectionHeading eyebrow="Theme studio" title="Make it yours before you install">
            Tokens are CSS variables, so a rebrand is one file. Pick an
            accent, tint the surfaces, set how deep the shadows carry.
            The preview is live, and the CSS it generates is yours to
            copy.
          </SectionHeading>
          <Reveal delay={0.1} className="mt-14">
            <ThemeStudio />
          </Reveal>
        </div>
      </section>

      {/* Accessibility */}
      <section className="bg-fill/40">
        <div className="mx-auto max-w-[1200px] px-6 py-24 sm:py-32">
          <SectionHeading eyebrow="Accessibility" title="Accessible by default">
            Roles, states and focus are part of how each component is
            built. The keyboard is a first-class input on every
            interactive piece.
          </SectionHeading>
          <div className="mt-16 grid gap-4 lg:grid-cols-5">
            <Reveal className="lg:col-span-3">
              <ul className="h-full rounded-3xl bg-card p-8 shadow-[var(--pollen-shadow-sm)] sm:p-10">
                {accessibilityPoints.map((point) => (
                  <li key={point} className="flex items-start gap-4 py-4 text-base leading-relaxed text-foreground sm:text-lg">
                    <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-fill">
                      <Check className="h-4 w-4 text-foreground" />
                    </span>
                    {point}
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal delay={0.1} className="lg:col-span-2">
              <div className="flex h-full flex-col rounded-3xl bg-card p-8 shadow-[var(--pollen-shadow-sm)] sm:p-10">
                <p className="text-lg font-semibold text-foreground">
                  Try it with your keyboard
                </p>
                <p className="mt-2 text-base leading-relaxed text-muted-foreground">
                  Tab through these controls. Focus is always visible,
                  and every state is announced.
                </p>
                <div className="mt-7 flex flex-wrap items-center gap-3">
                  <Button>Save</Button>
                  <Button variant="secondary">Preview</Button>
                  <Tooltip content="Opens the deploy log">
                    <Button variant="outline">Logs</Button>
                  </Tooltip>
                </div>
                <div className="mt-8 flex flex-wrap items-center gap-2 text-base text-muted-foreground">
                  <Kbd>Tab</Kbd> to move
                  <span className="text-faint">·</span>
                  <Kbd>Space</Kbd> to toggle
                  <span className="text-faint">·</span>
                  <Kbd>Esc</Kbd> to close
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Component index */}
      <section>
        <div className="mx-auto max-w-[1200px] px-6 py-24 sm:py-32">
          <SectionHeading eyebrow="The library" title={`${COMPONENT_COUNT} components, one import away`}>
            Every component is documented with live demos, typed props, and
            the reasoning behind its defaults. Hover any name to see what it
            does.
          </SectionHeading>
          <div className="mt-14 grid gap-4 md:grid-cols-2">
            {libraryGroups.map((group, index) => (
              <Reveal key={group.label} delay={index * 0.05}>
                <SpotlightCard
                  className={cn(
                    "h-full rounded-[26px] bg-fill/50 p-7 transition-[background-color,transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:bg-fill/75 hover:shadow-[var(--pollen-shadow-sm)] sm:p-8",
                    group.label === "Signatures" && "md:col-span-2",
                  )}
                >
                  <div className="relative flex items-center gap-3.5">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-card text-foreground shadow-[var(--pollen-shadow-xs)]">
                      {group.icon}
                    </span>
                    <h3 className="text-xl font-semibold tracking-[-0.01em] text-foreground">
                      {group.label}
                    </h3>
                    <span className="ml-auto rounded-full bg-card px-3 py-1 text-[13px] font-medium text-faint shadow-[var(--pollen-shadow-xs)]">
                      {group.slugs.length}
                    </span>
                  </div>
                  <p className="relative mt-3.5 text-[15px] leading-relaxed text-muted-foreground">
                    {group.blurb}
                  </p>
                  <div className="relative mt-6 flex flex-wrap gap-1.5">
                    {group.slugs.map((slug) => {
                      const entry = componentIndex.find((c) => c.slug === slug);
                      if (!entry) return null;
                      return (
                        <Tooltip key={slug} content={entry.description}>
                          <Link
                            href={`/docs/${slug}`}
                            className="rounded-lg bg-card px-3.5 py-2 text-sm font-medium text-muted-foreground shadow-[var(--pollen-shadow-xs)] transition-[color,box-shadow,transform] duration-150 hover:-translate-y-px hover:text-foreground hover:shadow-[var(--pollen-shadow-sm)]"
                          >
                            {entry.title}
                          </Link>
                        </Tooltip>
                      );
                    })}
                  </div>
                </SpotlightCard>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.1}>
            <div className="mt-8 flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">
              <p className="text-[15px] leading-relaxed text-faint">
                {COMPONENT_COUNT} components. Live demos, typed props, and keyboard support
                on every one of them.
              </p>
              <Link
                href="/docs"
                className="group inline-flex h-11 shrink-0 items-center gap-1.5 rounded-[12px] bg-foreground px-5 text-[15px] font-medium text-background shadow-[var(--pollen-shadow-xs)] transition-[opacity,transform] duration-150 hover:opacity-90 active:scale-[0.98]"
              >
                Open the docs
                <ArrowRight className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-0.5" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-fill/40">
        <div className="mx-auto max-w-[1200px] px-6 py-24 sm:py-32">
          <SectionHeading eyebrow="FAQ" title="Frequently asked questions">
            The short version of what people ask before installing.
          </SectionHeading>
          <Reveal delay={0.1}>
            <div className="mt-14 rounded-3xl bg-card p-2 shadow-[var(--pollen-shadow-sm)] sm:p-3">
              <Accordion type="single">
                {faqs.map((faq) => (
                  <AccordionItem key={faq.q} value={faq.q}>
                    <AccordionTrigger value={faq.q} className="text-base sm:text-lg">
                      {faq.q}
                    </AccordionTrigger>
                    <AccordionContent value={faq.q} className="text-[15px] sm:text-base">
                      {faq.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section>
        <div className="mx-auto max-w-[1200px] px-6 py-24 sm:py-32">
          <Reveal>
            <div className="relative overflow-hidden rounded-[36px] bg-card px-6 py-24 text-center shadow-[var(--pollen-shadow-md)] sm:py-28">
              <div
                aria-hidden="true"
                className="absolute left-1/2 top-[-160px] h-[380px] w-[680px] -translate-x-1/2 rounded-[100%] bg-[radial-gradient(closest-side,color-mix(in_srgb,var(--pollen-accent)_9%,transparent),transparent)] blur-xl"
              />
              <h2 className="relative text-balance text-4xl font-semibold tracking-[-0.03em] sm:text-6xl">
                Start building
              </h2>
              <p className="relative mx-auto mt-6 max-w-md text-lg text-muted-foreground sm:text-xl">
                One install, one stylesheet import. Your first component
                is running within the minute.
              </p>
              <div className="relative mt-11 flex flex-col items-center gap-7">
                <Link
                  href="/docs"
                  className="inline-flex h-12 items-center justify-center rounded-[14px] bg-foreground px-8 text-base font-medium text-background shadow-[var(--pollen-shadow-sm)] transition-[opacity,transform] duration-150 hover:opacity-90 active:scale-[0.98]"
                >
                  Read the docs
                </Link>
                <CodeBlock
                  filename="terminal"
                  language="bash"
                  code="npm install pollen-ui"
                  className="w-full max-w-sm"
                />
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
