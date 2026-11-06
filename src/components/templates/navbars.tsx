"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import {
  Avatar,
  Badge,
  Button,
  IconArrowRight as ArrowRight,
  IconPlus as Plus,
  IconTerminalSquare as TerminalSquare,
  IconBell as Bell,
  IconBox as Box,
  IconChat as Chat,
  IconChevronDown as ChevronDown,
  IconDeploy as Deploy,
  IconDots as Dots,
  IconFileCode as FileCode,
  IconGauge as Gauge,
  IconGithub as Github,
  IconWindow as Home,
  IconLayers as Layers,
  IconPanels as LayoutGrid,
  IconSearch as Search,
  IconSettings as Settings,
  IconSwatches as Palette,
  IconUserPlus as UserPlus,
  Kbd,
  cn,
} from "pollen-ui";

/* ------------------------------------------------------------------
   Navigation templates. Five takes on the same product shell, each
   fully composed from the library and safe to paste into a project.
   ------------------------------------------------------------------ */

const navLinks = ["Product", "Docs", "Pricing", "Changelog"];

/* ------------------------------ top ------------------------------ */

export function NavbarTop() {
  return (
    <div className="flex h-full min-h-[320px] flex-col bg-background">
      <header className="flex h-16 items-center gap-6 bg-card/80 px-6 shadow-[var(--pollen-shadow-xs)] backdrop-blur-xl">
        <span className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-foreground text-background">
            <Layers className="h-4 w-4" />
          </span>
          <span className="text-[15px] font-semibold tracking-[-0.01em]">Nimbus</span>
        </span>
        <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
          {navLinks.map((link, i) => (
            <Link
              key={link}
              href="#"
              onClick={(e) => e.preventDefault()}
              className={cn(
                "rounded-full px-3.5 py-2 text-sm transition-colors duration-150",
                i === 0
                  ? "bg-fill font-medium text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {link}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <span className="hidden h-9 w-52 items-center gap-2 rounded-full bg-fill px-3.5 text-[13px] text-faint sm:flex">
            <Search className="h-3.5 w-3.5" />
            Search
            <Kbd className="ml-auto bg-card">⌘K</Kbd>
          </span>
          <Button variant="ghost" size="icon" aria-label="Notifications" className="relative">
            <Bell className="h-4 w-4" />
            <Badge count={3} size="sm" className="absolute right-1 top-1" />
          </Button>
          <Avatar size={32} fallback="RA" />
        </div>
      </header>

      {/* Page body hint so the bar reads in context. */}
      <div className="grid flex-1 grid-cols-3 gap-4 p-6 opacity-60">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-20 rounded-2xl bg-fill" />
        ))}
      </div>
    </div>
  );
}

/* ---------------------------- command ---------------------------- */

export function NavbarCommand() {
  return (
    <div className="flex h-full min-h-[320px] flex-col bg-background">
      <header className="flex h-16 items-center gap-4 bg-card px-6 shadow-[var(--pollen-shadow-xs)]">
        <span className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--pollen-accent)] text-white">
            <Deploy className="h-4 w-4" />
          </span>
          <span className="text-[15px] font-semibold tracking-[-0.01em]">Relay</span>
        </span>
        <div className="mx-auto flex h-10 w-full max-w-md items-center gap-2.5 rounded-xl bg-fill px-3.5 text-[13.5px] text-faint">
          <Search className="h-4 w-4" />
          <span>Jump to a project, file or action</span>
          <span className="ml-auto flex items-center gap-1 text-[11px]">
            <Kbd className="bg-card">⌘</Kbd>
            <Kbd className="bg-card">K</Kbd>
          </span>
        </div>
        <div className="hidden items-center gap-2 md:flex">
          <Button size="sm" variant="secondary">
            <UserPlus className="h-3.5 w-3.5" />
            Invite
          </Button>
          <Button size="sm">Deploy</Button>
        </div>
      </header>

      <div className="flex flex-1 items-center justify-center gap-4 p-6 opacity-60">
        <div className="h-24 w-2/3 rounded-2xl bg-fill" />
        <div className="h-24 w-1/3 rounded-2xl bg-fill" />
      </div>
    </div>
  );
}

/* ------------------------------ pill ------------------------------ */

export function NavbarPill() {
  const [active, setActive] = useState("Preview");
  return (
    <div className="relative flex h-full min-h-[320px] flex-col bg-background">
      {/* Soft context so the pill visibly floats. */}
      <div className="grid flex-1 grid-cols-2 gap-4 p-6 opacity-50">
        <div className="h-28 rounded-2xl bg-fill" />
        <div className="h-28 rounded-2xl bg-fill" />
      </div>
      <nav
        aria-label="Floating"
        className="absolute inset-x-0 top-5 z-10 mx-auto flex w-fit items-center gap-1 rounded-full bg-card/90 p-1.5 shadow-[var(--pollen-shadow-md)] backdrop-blur-xl"
      >
        <span className="mr-1 flex h-8 w-8 items-center justify-center rounded-full bg-foreground text-background">
          <Palette className="h-4 w-4" />
        </span>
        {["Preview", "Branches", "Insights", "Settings"].map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setActive(item)}
            className={cn(
              "relative rounded-full px-4 py-2 text-[13.5px] font-medium outline-none transition-colors duration-150",
              active === item
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {active === item && (
              <span className="absolute inset-0 rounded-full bg-fill" />
            )}
            <span className="relative z-10">{item}</span>
          </button>
        ))}
        <span className="mx-1 h-5 w-px bg-[var(--pollen-separator)]" />
        <button
          type="button"
          aria-label="Repository"
          className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-fill hover:text-foreground"
        >
          <Github className="h-4 w-4" />
        </button>
      </nav>
    </div>
  );
}

/* ------------------------------ dock ------------------------------ */

export function NavbarDock() {
  const items = [
    { icon: <Home className="h-[45%] w-[45%]" />, label: "Home" },
    { icon: <Chat className="h-[45%] w-[45%]" />, label: "Chat", badge: 5 },
    { icon: <FileCode className="h-[45%] w-[45%]" />, label: "Files" },
    { icon: <Gauge className="h-[45%] w-[45%]" />, label: "Usage" },
    { icon: <Box className="h-[45%] w-[45%]" />, label: "Apps" },
    { icon: <Settings className="h-[45%] w-[45%]" />, label: "Settings" },
  ];
  const [active, setActive] = useState(0);
  return (
    <div className="relative flex h-full min-h-[320px] flex-col justify-end bg-background">
      <div className="absolute inset-x-6 top-6 grid grid-cols-3 gap-3 opacity-50">
        <div className="h-16 rounded-2xl bg-fill" />
        <div className="h-16 rounded-2xl bg-fill" />
        <div className="h-16 rounded-2xl bg-fill" />
      </div>
      {/* Dock: pinned to the bottom like a desktop. */}
      <div className="relative z-10 mb-6 flex justify-center pb-2">
        <div className="flex items-end gap-1.5 rounded-2xl bg-card/85 p-2 shadow-[var(--pollen-shadow-lg)] backdrop-blur-xl">
          {items.map((item, i) => (
            <button
              key={item.label}
              type="button"
              aria-label={item.label}
              onClick={() => setActive(i)}
              className="group relative flex flex-col items-center"
            >
              <span className="pointer-events-none absolute -top-9 z-20 whitespace-nowrap rounded-lg bg-foreground px-2 py-1 text-[11px] font-medium text-background opacity-0 shadow-[var(--pollen-shadow-sm)] transition-[opacity,translate] duration-150 group-hover:opacity-100">
                {item.label}
                <span className="absolute -bottom-1 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rotate-45 rounded-[1px] bg-foreground" />
              </span>
              <span
                className={cn(
                  "relative flex h-11 w-11 items-center justify-center rounded-xl transition-[background-color,transform] duration-150",
                  "bg-fill text-muted-foreground group-hover:-translate-y-1.5 group-hover:bg-fill-strong group-hover:text-foreground",
                  active === i && "text-foreground",
                )}
              >
                {item.icon}
                {item.badge && (
                  <Badge
                    count={item.badge}
                    size="sm"
                    className="absolute -right-1.5 -top-1.5"
                  />
                )}
              </span>
              <span
                aria-hidden="true"
                className={cn(
                  "mt-1 h-1 w-1 rounded-full transition-colors duration-150",
                  active === i ? "bg-accent" : "bg-transparent",
                )}
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------------------------- sidebar ---------------------------- */

const sidebarSections = [
  {
    heading: "Workspace",
    items: [
      { icon: <Home className="h-4 w-4" />, label: "Overview" },
      { icon: <LayoutGrid className="h-4 w-4" />, label: "Projects", badge: 8 },
      { icon: <Chat className="h-4 w-4" />, label: "Discussions", badge: 2 },
    ],
  },
  {
    heading: "Platform",
    items: [
      { icon: <Deploy className="h-4 w-4" />, label: "Deployments" },
      { icon: <Gauge className="h-4 w-4" />, label: "Analytics" },
      { icon: <Box className="h-4 w-4" />, label: "Integrations" },
    ],
  },
];

export function NavbarSidebar() {
  const [active, setActive] = useState("Overview");
  return (
    <div className="flex h-full min-h-[380px] bg-background">
      <aside className="flex w-60 shrink-0 flex-col bg-card p-3 shadow-[var(--pollen-shadow-xs)]">
        <div className="flex items-center justify-between px-2 py-2">
          <span className="flex items-center gap-2.5">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-foreground text-background">
              <Box className="h-4 w-4" />
            </span>
            <span className="text-[14.5px] font-semibold tracking-[-0.01em]">Atlas</span>
          </span>
          <button
            type="button"
            aria-label="Collapse workspace"
            className="flex h-7 w-7 items-center justify-center rounded-lg text-faint transition-colors hover:bg-fill hover:text-foreground"
          >
            <ChevronDown className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-2 flex h-9 items-center gap-2 rounded-xl bg-fill px-3 text-[13px] text-faint">
          <Search className="h-3.5 w-3.5" />
          Search
          <Kbd className="ml-auto bg-card">⌘K</Kbd>
        </div>

        <nav aria-label="Workspace" className="mt-4 flex-1 space-y-4">
          {sidebarSections.map((section) => (
            <div key={section.heading}>
              <p className="px-3 pb-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-faint">
                {section.heading}
              </p>
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const isActive = active === item.label;
                  return (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => setActive(item.label)}
                      className={cn(
                        "flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-[13.5px] transition-colors duration-150",
                        isActive
                          ? "bg-fill font-medium text-foreground"
                          : "text-muted-foreground hover:bg-fill/60 hover:text-foreground",
                      )}
                    >
                      <span className={cn(isActive ? "text-accent" : "text-faint")}>
                        {item.icon}
                      </span>
                      <span className="truncate">{item.label}</span>
                      {item.badge && <Badge count={item.badge} size="sm" className="ml-auto" />}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="flex items-center gap-3 rounded-2xl bg-fill/70 p-3">
          <Avatar size={34} fallback="JD" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-medium text-foreground">Jordan Diaz</p>
            <p className="truncate text-[11.5px] text-faint">jordan@atlas.dev</p>
          </div>
          <button
            type="button"
            aria-label="More"
            className="flex h-7 w-7 items-center justify-center rounded-lg text-faint transition-colors hover:bg-card hover:text-foreground"
          >
            <Dots className="h-4 w-4" />
          </button>
        </div>
      </aside>

      <div className="flex-1 p-6 opacity-60">
        <div className="grid grid-cols-2 gap-4">
          <div className="h-24 rounded-2xl bg-fill" />
          <div className="h-24 rounded-2xl bg-fill" />
          <div className="col-span-2 h-32 rounded-2xl bg-fill" />
        </div>
      </div>
    </div>
  );
}

/* ----------------------------- bottom ----------------------------- */

/* A mobile-grade bottom tab bar. Five slots, the active one lifts
   on a filled tile with the accent dot, and the middle slot can be
   a primary action. The shell above is dimmed content so the bar
   reads in context. */

const bottomTabs = [
  { icon: <Home className="h-5 w-5" />, label: "Home" },
  { icon: <Search className="h-5 w-5" />, label: "Search" },
  { icon: <Layers className="h-5 w-5" />, label: "Library" },
  { icon: <Chat className="h-5 w-5" />, label: "Inbox", badge: 3 },
];

export function NavbarBottom() {
  const [active, setActive] = useState("Home");
  return (
    <div className="relative flex h-full min-h-[340px] flex-col justify-end bg-background">
      {/* Dimmed content skeleton above the bar. */}
      <div className="absolute inset-x-6 top-6 space-y-3 opacity-50">
        <div className="h-20 rounded-2xl bg-fill" />
        <div className="grid grid-cols-2 gap-3">
          <div className="h-16 rounded-2xl bg-fill" />
          <div className="h-16 rounded-2xl bg-fill" />
        </div>
      </div>

      <nav
        aria-label="Primary"
        className="relative z-10 m-4 flex items-center justify-around rounded-2xl bg-card/90 p-2 shadow-[var(--pollen-shadow-lg)] backdrop-blur-xl"
      >
        {bottomTabs.slice(0, 2).map((tab) => (
          <BottomTab key={tab.label} tab={tab} active={active === tab.label} onClick={() => setActive(tab.label)} />
        ))}
        <button
          type="button"
          aria-label="Create"
          className="flex h-11 w-11 items-center justify-center rounded-full bg-foreground text-background shadow-[var(--pollen-shadow-md)] transition-transform duration-150 active:scale-95"
        >
          <Plus className="h-5 w-5" />
        </button>
        {bottomTabs.slice(2).map((tab) => (
          <BottomTab key={tab.label} tab={tab} active={active === tab.label} onClick={() => setActive(tab.label)} />
        ))}
      </nav>
    </div>
  );
}

function BottomTab({
  tab,
  active,
  onClick,
}: {
  tab: { icon: React.ReactNode; label: string; badge?: number };
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className={cn(
        "relative flex flex-col items-center gap-0.5 rounded-xl px-3 py-1.5 transition-colors duration-150",
        active ? "text-foreground" : "text-muted-foreground hover:text-foreground",
      )}
    >
      <span className="relative">
        {tab.icon}
        {tab.badge && (
          <Badge count={tab.badge} size="sm" className="absolute -right-2 -top-1.5" />
        )}
      </span>
      <span className="text-[10.5px] font-medium leading-none">{tab.label}</span>
      {active && (
        <motion.span
          layoutId="bottom-tab-dot"
          className="absolute -bottom-0.5 h-1 w-1 rounded-full bg-accent"
        />
      )}
    </button>
  );
}

/* ------------------------------ rail ------------------------------ */

/* The icon-only left rail for tools that live in the details, not
   the chrome. Hover reveals the label; the active tool carries the
   accent. Pairs with the top bar for a two-plane shell. */

const railItems = [
  { icon: <Home className="h-[18px] w-[18px]" />, label: "Home" },
  { icon: <Chat className="h-[18px] w-[18px]" />, label: "Threads", badge: 12 },
  { icon: <FileCode className="h-[18px] w-[18px]" />, label: "Snippets" },
  { icon: <Gauge className="h-[18px] w-[18px]" />, label: "Usage" },
  { icon: <Box className="h-[18px] w-[18px]" />, label: "Apps" },
];

export function NavbarRail() {
  const [active, setActive] = useState("Home");
  return (
    <div className="flex h-full min-h-[340px] bg-background">
      <aside className="flex w-14 flex-col items-center gap-1 border-r border-[var(--pollen-separator)] bg-card py-3">
        <span className="mb-3 flex h-8 w-8 items-center justify-center rounded-lg bg-foreground text-background">
          <Box className="h-4 w-4" />
        </span>
        {railItems.map((item) => {
          const isActive = active === item.label;
          return (
            <button
              key={item.label}
              type="button"
              onClick={() => setActive(item.label)}
              aria-label={item.label}
              className={cn(
                "group/rail relative flex h-9 w-9 items-center justify-center rounded-xl transition-colors duration-150",
                isActive
                  ? "bg-fill text-foreground"
                  : "text-faint hover:bg-fill/60 hover:text-foreground",
              )}
            >
              {item.icon}
              {item.badge && (
                <span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-accent" />
              )}
              <span className="pointer-events-none absolute left-11 z-20 whitespace-nowrap rounded-lg bg-foreground px-2 py-1 text-[11px] font-medium text-background opacity-0 shadow-[var(--pollen-shadow-sm)] transition-opacity duration-150 group-hover/rail:opacity-100">
                {item.label}
              </span>
            </button>
          );
        })}
        <div className="mt-auto flex flex-col items-center gap-1">
          <button
            type="button"
            aria-label="Settings"
            className="flex h-9 w-9 items-center justify-center rounded-xl text-faint transition-colors hover:bg-fill/60 hover:text-foreground"
          >
            <Settings className="h-[18px] w-[18px]" />
          </button>
          <Avatar size={26} fallback="RA" />
        </div>
      </aside>
      <div className="flex-1 p-6 opacity-60">
        <div className="grid grid-cols-3 gap-4">
          <div className="h-24 rounded-2xl bg-fill" />
          <div className="h-24 rounded-2xl bg-fill" />
          <div className="h-24 rounded-2xl bg-fill" />
        </div>
      </div>
    </div>
  );
}

/* ------------------------------ mega ------------------------------ */

/* A centered marketing header whose Product link opens a proper
   mega panel: grouped links with icons and a highlighted promo
   tile. Open state is real state - hover it. */

const megaGroups = [
  {
    heading: "Build",
    items: [
      { icon: <FileCode className="h-4 w-4" />, label: "Components", hint: "60+ primitives" },
      { icon: <Layers className="h-4 w-4" />, label: "Templates", hint: "Whole pages" },
      { icon: <TerminalSquare className="h-4 w-4" />, label: "CLI", hint: "One command" },
    ],
  },
  {
    heading: "Ship",
    items: [
      { icon: <Deploy className="h-4 w-4" />, label: "Deployments", hint: "Edge-first" },
      { icon: <Gauge className="h-4 w-4" />, label: "Observability", hint: "Traces, logs" },
      { icon: <Settings className="h-4 w-4" />, label: "Preview flags", hint: "Safe rolls" },
    ],
  },
];

export function NavbarMega() {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex h-full min-h-[360px] flex-col bg-background">
      <header className="relative z-20 flex h-16 items-center justify-between bg-card/80 px-8 shadow-[var(--pollen-shadow-xs)] backdrop-blur-xl">
        <span className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent text-[var(--pollen-accent-ink,#fff)]">
            <Layers className="h-4 w-4" />
          </span>
          <span className="text-[15px] font-semibold tracking-[-0.01em]">Northwind</span>
        </span>

        <nav aria-label="Main" className="hidden items-center gap-1 md:flex" onMouseLeave={() => setOpen(false)}>
          <button
            type="button"
            aria-expanded={open}
            onMouseEnter={() => setOpen(true)}
            onClick={() => setOpen((o) => !o)}
            className={cn(
              "flex items-center gap-1 rounded-full px-3.5 py-2 text-sm transition-colors duration-150",
              open ? "bg-fill font-medium text-foreground" : "text-muted-foreground hover:text-foreground",
            )}
          >
            Product
            <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.18 }}>
              <ChevronDown className="h-3.5 w-3.5" />
            </motion.span>
          </button>
          {["Pricing", "Docs", "Changelog"].map((link) => (
            <Link
              key={link}
              href="#"
              onClick={(e) => e.preventDefault()}
              className="rounded-full px-3.5 py-2 text-sm text-muted-foreground transition-colors duration-150 hover:text-foreground"
            >
              {link}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm">Sign in</Button>
          <Button size="sm">Start free</Button>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.16, ease: "easeOut" }}
            className="relative z-10 mx-auto -mt-1 w-[560px] max-w-[92%]"
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
          >
            <div className="mt-2 grid grid-cols-[1fr_220px] gap-0 overflow-hidden rounded-2xl bg-card shadow-[var(--pollen-shadow-lg)]">
              <div className="grid grid-cols-2 gap-6 p-5">
                {megaGroups.map((group) => (
                  <div key={group.heading}>
                    <p className="px-2 pb-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-faint">
                      {group.heading}
                    </p>
                    <div className="space-y-0.5">
                      {group.items.map((item) => (
                        <a
                          key={item.label}
                          href="#"
                          onClick={(e) => e.preventDefault()}
                          className="flex items-start gap-2.5 rounded-xl px-2 py-2 transition-colors duration-150 hover:bg-fill"
                        >
                          <span className="mt-0.5 text-faint">{item.icon}</span>
                          <span>
                            <span className="block text-[13.5px] font-medium leading-tight text-foreground">
                              {item.label}
                            </span>
                            <span className="block text-[11.5px] leading-tight text-faint">
                              {item.hint}
                            </span>
                          </span>
                        </a>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="relative flex flex-col justify-end bg-fill p-5">
                <Badge variant="accent" size="sm" className="absolute left-5 top-5">New</Badge>
                <p className="text-[13.5px] font-semibold leading-snug text-foreground">
                  Templates 2.0
                </p>
                <p className="mt-1 text-[12px] leading-snug text-muted-foreground">
                  Twelve whole-page layouts, theme-aware and copy-paste ready.
                </p>
                <Button size="sm" variant="secondary" className="mt-3 w-fit">
                  Browse
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 p-8 opacity-60">
        <div className="mx-auto max-w-md space-y-3">
          <div className="h-8 w-2/3 rounded-xl bg-fill" />
          <div className="h-4 w-full rounded-lg bg-fill" />
          <div className="h-4 w-5/6 rounded-lg bg-fill" />
        </div>
      </div>
    </div>
  );
}
