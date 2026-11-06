"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "pollen-ui";
import { componentIndex } from "@/lib/registry";

const groups = [
  {
    heading: "Getting started",
    items: [
      { href: "/docs", label: "Introduction", exact: true },
      { href: "/playground", label: "Playground" },
      { href: "/templates", label: "Templates" },
      { href: "/docs/installation", label: "Installation" },
      { href: "/docs/frameworks", label: "Frameworks" },
      { href: "/docs/react-native", label: "React Native" },
      { href: "/docs/theming", label: "Theming" },
      { href: "/docs/mobile", label: "Mobile and touch" },
      { href: "/docs/licensing", label: "Licensing" },
    ],
  },
  {
    heading: "Components",
    items: componentIndex.map((entry) => ({
      href: `/docs/${entry.slug}`,
      label: entry.title,
      exact: false,
    })),
  },
];

export function DocsSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:block">
      <nav
        aria-label="Documentation"
        className="slim-scroll sticky top-14 max-h-[calc(100vh-3.5rem)] overflow-y-auto pb-10 pr-6 pt-10"
      >
        {groups.map((group) => (
          <div key={group.heading} className="mb-7 last:mb-0">
            <h3 className="px-2 pb-2 text-sm font-semibold text-foreground">
              {group.heading}
            </h3>
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const active = item.exact
                  ? pathname === item.href
                  : pathname.startsWith(item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "block rounded-md px-2 py-1.5 text-sm transition-colors duration-100",
                        active
                          ? "bg-fill font-medium text-foreground"
                          : "text-muted-foreground hover:bg-fill hover:text-foreground",
                      )}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}

export function DocsMobileNav() {
  const pathname = usePathname();

  return (
    <div className="lg:hidden">
      <label htmlFor="docs-jump" className="sr-only">
        Jump to a documentation page
      </label>
      <select
        id="docs-jump"
        value={pathname}
        onChange={(e) => {
          window.location.href = e.target.value;
        }}
        className="h-10 w-full rounded-[10px] bg-fill px-3.5 text-[15px] outline-none transition-[background-color,box-shadow] placeholder:text-faint focus:bg-card focus-visible:ring-[3px] focus-visible:ring-accent/20"
      >
        {groups.map((group) => (
          <optgroup key={group.heading} label={group.heading}>
            {group.items.map((item) => (
              <option key={item.href} value={item.href}>
                {item.label}
              </option>
            ))}
          </optgroup>
        ))}
      </select>
    </div>
  );
}
