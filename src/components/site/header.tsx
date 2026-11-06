"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  IconAlignLeft as AlignLeft,
  IconWindow as AppWindow,
  IconBell as Bell,
  IconBook as BookOpen,
  IconBox as Box,
  IconBars as ChartNoAxesColumn,
  IconChevronDown as ChevronDown,
  IconRadioDot as CircleDot,
  IconUser as CircleUserRound,
  IconCode as Code,
  IconCommand as CommandIcon,
  IconCard as CreditCard,
  IconDots as Ellipsis,
  IconEye as Eye,
  IconFileCode as FileCode2,
  IconFlask as FlaskConical,
  IconHash as Hash,
  IconHistory as History,
  IconInfo as Info,
  IconKeyboard as Keyboard,
  IconLayers as Layers,
  IconPanels as LayoutGrid,
  IconList as List,
  IconFilter as ListFilter,
  IconListOrdered as ListOrdered,
  IconLoader as Loader,
  IconMenu as Menu,
  IconChat as MessageSquare,
  IconCursorClick as MousePointerClick,
  IconPackage as PackageOpen,
  IconSwatches as Palette,
  IconPanels as PanelsTopLeft,
  IconPanelBottom as PanelBottom,
  IconPercent as Percent,
  IconRepeat as Repeat,
  IconRoute as Route,
  IconSearch as Search,
  IconSliders as SlidersHorizontal,
  IconSplit as Split,
  IconCheckSquare as SquareCheck,
  IconPopover as SquareMousePointer,
  IconTerminalSquare as SquareTerminal,
  IconPetal as Star,
  IconTable as TableIcon,
  IconTag as Tag,
  IconTags as Tags,
  IconLetter as Text,
  IconTextCursor as TextCursorInput,
  IconTextSelect as TextSelect,
  IconToggle as ToggleLeft,
  IconTrend as TrendingUp,
  IconType as Type,
  IconWind as Wind,
} from "pollen-ui";
import {
  Button,
  Command,
  Drawer,
  DrawerBody,
  DrawerClose,
  DrawerHeader,
  DrawerTitle,
  Kbd,
  cn,
  type CommandGroup,
} from "pollen-ui";
import { Logo } from "./logo";
import { ThemeToggle } from "./theme-toggle";
import { AccentPicker } from "./accent-picker";
import { componentIndex } from "@/lib/registry";

const NAV_LINKS = [
  { href: "/docs", label: "Docs" },
  { href: "/templates", label: "Templates" },
  { href: "/playground", label: "Playground" },
  { href: "/docs/installation", label: "Installation" },
];

const GITHUB_URL = "https://github.com/1-Pankaj/pollen-ui";

import { iconForSlug } from "./component-icons";

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setCommandOpen((open) => !open);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Close menus when navigation happens. Adjusting during render
  // (not in an effect) keeps the reset on the same commit as the
  // new location.
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setMenuOpen(false);
    setCommandOpen(false);
  }

  const go = (href: string) => router.push(href);

  const groups: CommandGroup[] = [
    {
      heading: "Getting started",
      items: [
        {
          label: "Introduction",
          icon: <BookOpen />,
          keywords: ["docs", "overview", "start"],
          onSelect: () => go("/docs"),
        },
        {
          label: "Templates",
          icon: <AppWindow />,
          keywords: ["templates", "hero", "navbar", "sections", "pricing", "auth", "footer", "layout"],
          onSelect: () => go("/templates"),
        },
        {
          label: "Playground",
          icon: <FlaskConical />,
          keywords: ["live", "editor", "code", "try", "sandbox", "preview"],
          onSelect: () => go("/playground"),
        },
        {
          label: "Installation",
          icon: <FileCode2 />,
          keywords: ["npm", "install", "setup"],
          onSelect: () => go("/docs/installation"),
        },
        {
          label: "Theming",
          icon: <Palette />,
          keywords: ["tokens", "colors", "dark mode", "css variables", "customize", "customization"],
          onSelect: () => go("/docs/theming"),
        },
      ],
    },
    {
      heading: "Components",
      items: componentIndex.map((entry) => ({
        label: entry.title,
        icon: iconForSlug(entry.slug),
        keywords: [entry.slug, entry.description],
        onSelect: () => go(`/docs/${entry.slug}`),
      })),
    },
  ];

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full transition-[background-color,box-shadow] duration-300",
        scrolled || pathname.startsWith("/docs")
          ? "bg-background/70 shadow-[0_1px_2px_rgba(18,18,26,0.04)] backdrop-blur-xl"
          : pathname === "/"
            ? "bg-transparent"
            : "bg-background",
      )}
    >
      <div className="mx-auto flex h-16 max-w-[1200px] items-center gap-5 px-4 sm:px-6">
        <Logo />

        <nav aria-label="Main" className="hidden items-center gap-0.5 md:flex">
          {NAV_LINKS.map((link) => {
            const active =
              link.href === "/docs"
                ? pathname === "/docs"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-full px-3.5 py-2 text-[15px] transition-colors duration-150",
                  active
                    ? "bg-fill text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setCommandOpen(true)}
            className="hidden h-9 w-60 items-center gap-2 rounded-full bg-fill px-4 text-sm text-faint transition-colors duration-150 hover:bg-fill-strong hover:text-muted-foreground sm:flex"
          >
            <Search className="h-3.5 w-3.5" />
            <span>Search</span>
            <span className="ml-auto flex gap-0.5">
              <Kbd className="bg-card">⌘</Kbd>
              <Kbd className="bg-card">K</Kbd>
            </span>
          </button>
          <button
            type="button"
            aria-label="Search"
            onClick={() => setCommandOpen(true)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-fill hover:text-foreground sm:hidden"
          >
            <Search className="h-4 w-4" />
          </button>

          <ThemeToggle />
          <AccentPicker />

          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub repository"
            className="inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-fill hover:text-foreground"
          >
            <svg viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4" aria-hidden="true">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
            </svg>
          </a>

          <Button size="sm" className="hidden md:inline-flex" onClick={() => go("/docs")}>
            Get Started
          </Button>

          <button
            type="button"
            aria-label="Open menu"
            onClick={() => setMenuOpen(true)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-fill hover:text-foreground md:hidden"
          >
            <Menu className="h-4 w-4" />
          </button>
        </div>
      </div>

      <Command
        open={commandOpen}
        onOpenChange={setCommandOpen}
        groups={groups}
        placeholder="Search documentation"
      />

      <Drawer open={menuOpen} onOpenChange={setMenuOpen}>
        <DrawerHeader>
          <DrawerTitle>Pollen UI</DrawerTitle>
          <DrawerClose onOpenChange={setMenuOpen} />
        </DrawerHeader>
        <DrawerBody>
          <nav aria-label="Mobile" className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-xl px-3 py-2.5 text-[15px] text-foreground transition-colors hover:bg-fill"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="mt-5 rounded-2xl bg-fill p-1.5">
            <p className="px-3 pb-1.5 pt-2 text-xs font-medium text-faint">Components</p>
            <div className="slim-scroll flex max-h-[50vh] flex-col gap-0.5 overflow-y-auto">
              {componentIndex.map((entry) => (
                <Link
                  key={entry.slug}
                  href={`/docs/${entry.slug}`}
                  className="rounded-xl px-3 py-2 text-[15px] text-muted-foreground transition-colors hover:bg-card hover:text-foreground"
                >
                  {entry.title}
                </Link>
              ))}
            </div>
          </div>
        </DrawerBody>
      </Drawer>
    </header>
  );
}
