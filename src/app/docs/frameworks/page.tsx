import type { Metadata } from "next";
import { CodeBlock, Reveal, Alert } from "pollen-ui";

export const metadata: Metadata = {
  title: "Frameworks",
  description:
    "Wire Pollen UI into Vite, Remix (React Router) and Astro. Same package, same stylesheet, small differences per stack.",
};

const viteCss = `/* src/index.css */
@import "tailwindcss";
@import "pollen-ui/styles.css";
@import "pollen-ui/theme.css";
@source "../node_modules/pollen-ui/dist";`;

const viteDark = `// useDarkMode.ts — no provider needed
import { useEffect, useState } from "react";

export function useDarkMode() {
  const [dark, setDark] = useState(
    () => document.documentElement.classList.contains("dark"),
  );

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  return [dark, setDark] as const;
}`;

const remixCss = `// app/app.css
@import "tailwindcss";
@import "pollen-ui/styles.css";
@import "pollen-ui/theme.css";
@source "../node_modules/pollen-ui/dist";

// app/root.tsx
import "./app.css";`;

const astroSetup = `npx astro add react
npm install pollen-ui`;

const astroCss = `/* src/styles/global.css */
@import "tailwindcss";
@import "pollen-ui/styles.css";
@import "pollen-ui/theme.css";
@source "../node_modules/pollen-ui/dist";`;

const astroIsland = `---
// src/pages/index.astro
import { Button } from "pollen-ui";
import SignupForm from "../components/SignupForm";
---

<Button client:load>Deploy</Button>
<SignupForm client:visible />`;

const astroDark = `<script is:inline>
  // Before paint: honour the OS preference and any stored choice.
  const stored = localStorage.getItem("pollen-theme");
  const dark = stored
    ? stored === "dark"
    : matchMedia("(prefers-color-scheme: dark)").matches;
  document.documentElement.classList.toggle("dark", dark);
</script>`;

export default function FrameworksPage() {
  return (
    <article className="max-w-2xl">
      <h1 className="text-4xl font-semibold tracking-tight">Frameworks</h1>
      <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
        The package is a set of client components with zero framework
        imports — no <code className="rounded bg-fill px-1.5 py-0.5 font-mono text-xs">next/*</code>,
        no router, no server code. Anything that renders React can render
        Pollen UI. Setup differs per stack in exactly two places: the
        stylesheet wiring and dark-mode management.
      </p>

      <Reveal className="mt-12">
        <h2 className="text-2xl font-semibold tracking-tight">Vite</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Install the package, wire the three stylesheet imports in your CSS
          entry, and point Tailwind&apos;s source scanner at the compiled
          package so its utility classes get generated:
        </p>
        <div className="mt-4">
          <CodeBlock filename="src/index.css" language="css" code={viteCss} />
        </div>
        <Alert className="mt-4">
          The <code>@source</code> path is relative to the CSS file. With the
          stylesheet at <code>src/index.css</code>, one level up reaches{" "}
          <code>node_modules</code>.
        </Alert>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          Vite has no server components, so the <code>&quot;use client&quot;</code>{" "}
          banners are inert and every component just works. Dark mode is a{" "}
          <code>dark</code> class on the html element — manage it with a
          two-line hook:
        </p>
        <div className="mt-4">
          <CodeBlock filename="useDarkMode.ts" language="ts" code={viteDark} />
        </div>
      </Reveal>

      <Reveal className="mt-12">
        <h2 className="text-2xl font-semibold tracking-tight">
          Remix / React Router
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Same three imports, linked from the root route. The compiled
          components carry their own <code>&quot;use client&quot;</code>{" "}
          directives, which browser bundles ignore and server bundles honour,
          so no extra configuration is needed:
        </p>
        <div className="mt-4">
          <CodeBlock filename="app/app.css + app/root.tsx" language="css" code={remixCss} />
        </div>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          For dark mode without a flash, set the class on{" "}
          <code>&lt;html&gt;</code> in the root route before hydration — the
          same blocking-script pattern the Astro example below shows.
        </p>
      </Reveal>

      <Reveal className="mt-12">
        <h2 className="text-2xl font-semibold tracking-tight">Astro</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Astro renders React islands. Add the React integration, install the
          package, and wire the stylesheet once globally:
        </p>
        <div className="mt-4">
          <CodeBlock filename="terminal" language="bash" code={astroSetup} />
        </div>
        <div className="mt-4">
          <CodeBlock filename="src/styles/global.css" language="css" code={astroCss} />
        </div>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Components only ship to the browser where you opt in with a client
          directive — which keeps pages fast by default:
        </p>
        <div className="mt-4">
          <CodeBlock filename="index.astro" language="astro" code={astroIsland} />
        </div>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Put this inline script in your head to pick the theme before first
          paint, so there is no dark-mode flash:
        </p>
        <div className="mt-4">
          <CodeBlock filename="Layout.astro" language="astro" code={astroDark} />
        </div>
      </Reveal>

      <Reveal className="mt-12">
        <h2 className="text-2xl font-semibold tracking-tight">What carries over</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Everywhere: the tokens stylesheet, the Tailwind bridge, the dark
          class convention, and the components themselves. There is no
          provider to mount in any stack — stateful components such as
          toasts, modals and the command palette manage their own portals.
        </p>
      </Reveal>

      <Reveal className="mt-12">
        <h2 className="text-2xl font-semibold tracking-tight">Beyond the browser</h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          React Native ships as its own package, @pollen/native: sixteen
          primitives implemented with platform APIs, sharing the same tokens.
          The{" "}
          <a
            href="/docs/react-native"
            className="font-medium text-foreground underline underline-offset-2 hover:text-accent"
          >
            React Native guide
          </a>{" "}
          covers install, the full component list with usage, and what ships
          today.
        </p>
      </Reveal>
    </article>
  );
}
