import Link from "next/link";
import { LogoMark } from "./logo";
import { componentIndex } from "@/lib/registry";

const GITHUB_URL = "https://github.com/1-Pankaj/pollen-ui";

const libraryLinks = [
  { href: "/docs", label: "Introduction" },
  { href: "/playground", label: "Playground" },
  { href: "/docs/installation", label: "Installation" },
  { href: "/docs/theming", label: "Theming" },
];

const projectLinks = [
  { href: GITHUB_URL, label: "GitHub", external: true },
  { href: `${GITHUB_URL}/releases`, label: "Releases", external: true },
  { href: `${GITHUB_URL}/issues`, label: "Issues", external: true },
  { href: `${GITHUB_URL}/blob/main/LICENSE`, label: "MIT License", external: true },
];

export function SiteFooter() {
  const popular = componentIndex.slice(0, 6);

  return (
    <footer className="mt-8 bg-card">
      <div className="mx-auto max-w-[1200px] px-6 py-14">
        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2">
              <LogoMark />
              <span className="text-[15px] font-semibold tracking-tight text-foreground">
                Pollen UI
              </span>
            </div>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">
              React components for Next.js, built to be relied on. Open
              source under the MIT license. Designed and maintained by
              Pankaj Israni.
            </p>
          </div>

          <nav aria-label="Library">
            <h3 className="text-sm font-semibold text-foreground">Library</h3>
            <ul className="mt-3 space-y-2.5">
              {libraryLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Components">
            <h3 className="text-sm font-semibold text-foreground">Components</h3>
            <ul className="mt-3 space-y-2.5">
              {popular.map((entry) => (
                <li key={entry.slug}>
                  <Link
                    href={`/docs/${entry.slug}`}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {entry.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Project">
            <h3 className="text-sm font-semibold text-foreground">Project</h3>
            <ul className="mt-3 space-y-2.5">
              {projectLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-14 flex flex-col gap-2 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            © 2026{" "}
            <a
              href="https://github.com/1-Pankaj"
              target="_blank"
              rel="noreferrer"
              className="transition-colors hover:text-foreground"
            >
              Pankaj Israni
            </a>
          </p>
          <p>Released under the MIT License</p>
        </div>
      </div>
    </footer>
  );
}
