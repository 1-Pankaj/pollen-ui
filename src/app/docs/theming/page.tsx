import type { Metadata } from "next";
import { CodeBlock, Reveal, Alert } from "pollen-ui";
import { ThemeStudio } from "@/components/site/theme-studio";

export const metadata: Metadata = {
  title: "Theming",
  description:
    "Every color, radius and shadow in Pollen UI is a CSS variable. Override tokens to rebrand both themes from one file.",
};

const tokenCode = `:root {
  /* Surfaces */
  --pollen-bg: #f7f7f8;
  --pollen-card: #ffffff;
  --pollen-fill: #f0f0f2;

  /* Text */
  --pollen-fg: #17171a;
  --pollen-fg-muted: #61616c;
  --pollen-fg-faint: #8d8d98;

  /* Accents */
  --pollen-accent: #0070f3;
  --pollen-success: #29a383;
  --pollen-warning: #f5a623;
  --pollen-danger: #e5484d;

  /* Elevation */
  --pollen-shadow-md: 0 2px 4px rgba(18, 18, 26, 0.04),
    0 10px 28px -6px rgba(18, 18, 26, 0.1);
}

.dark {
  --pollen-bg: #0a0a0c;
  --pollen-card: #161619;
  --pollen-fill: #1f1f24;
  --pollen-fg: #f4f4f6;
  --pollen-accent: #3291ff;
}`;

const brandCode = `/* Rebrand: a calm green accent instead of blue */
:root {
  --pollen-accent: #0d9373;
}

.dark {
  --pollen-accent: #26c593;
}`;

const darkCode = `/* Dark mode with a class, or a data attribute */
<html class="dark">
<!-- or -->
<html data-theme="dark">`;

const tokenReference = [
  { token: "--pollen-bg", role: "Page background", light: "#f7f7f8", dark: "#0a0a0c" },
  { token: "--pollen-card", role: "Raised surface", light: "#ffffff", dark: "#161619" },
  { token: "--pollen-fill", role: "Quiet fill, hover states", light: "#f0f0f2", dark: "#1f1f24" },
  { token: "--pollen-fill-strong", role: "Pressed fill, strong tracks", light: "#e8e8eb", dark: "#2a2a30" },
  { token: "--pollen-fg", role: "Primary text", light: "#17171a", dark: "#f4f4f6" },
  { token: "--pollen-fg-muted", role: "Secondary text", light: "#61616c", dark: "#a4a4b0" },
  { token: "--pollen-fg-faint", role: "Placeholder, captions", light: "#8d8d98", dark: "#70707c" },
  { token: "--pollen-separator", role: "Hairline dividers", light: "7% ink", dark: "7% white" },
  { token: "--pollen-accent", role: "Links, focus, primary action", light: "#0070f3", dark: "#3291ff" },
  { token: "--pollen-success", role: "Success state", light: "#29a383", dark: "#3dd68c" },
  { token: "--pollen-warning", role: "Warning state", light: "#f5a623", dark: "#ffc163" },
  { token: "--pollen-danger", role: "Danger state", light: "#e5484d", dark: "#ff6369" },
];

export default function ThemingPage() {
  return (
    <article className="max-w-2xl">
      <h1 className="text-4xl font-semibold tracking-tight">Theming</h1>
      <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
        The palette is achromatic on purpose: near-black text, white
        surfaces that lift with soft shadows, and one blue accent used
        like punctuation. All of it is CSS variables, so a rebrand is
        one file.
      </p>

      <Reveal className="mt-12">
        <h2 className="text-2xl font-semibold tracking-tight">Tokens</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Light is the default theme, defined on{" "}
          <code className="rounded bg-fill px-1.5 py-0.5 font-mono text-xs">:root</code>.
          Dark overrides it under the{" "}
          <code className="rounded bg-fill px-1.5 py-0.5 font-mono text-xs">.dark</code>{" "}
          class. These are the defaults you get on install:
        </p>
        <div className="mt-4">
          <CodeBlock filename="tokens.css" language="css" code={tokenCode} />
        </div>
      </Reveal>

      <Reveal className="mt-12">
        <h2 className="text-2xl font-semibold tracking-tight">Token reference</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          The core set, with light and dark values side by side. Shadows,
          radii and code-surface tokens follow the same pattern in
          pollen.css.
        </p>
        <div className="mt-5 overflow-x-auto rounded-[12px] bg-card shadow-[var(--pollen-shadow-xs)]">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[var(--pollen-separator)] text-xs text-muted-foreground">
                <th className="px-4 py-3 font-medium">Token</th>
                <th className="px-4 py-3 font-medium">Role</th>
                <th className="px-4 py-3 font-medium">Light</th>
                <th className="px-4 py-3 font-medium">Dark</th>
              </tr>
            </thead>
            <tbody>
              {tokenReference.map((row) => (
                <tr
                  key={row.token}
                  className="border-b border-[var(--pollen-separator)] last:border-0"
                >
                  <td className="whitespace-nowrap px-4 py-2.5 font-mono text-xs text-foreground">
                    {row.token}
                  </td>
                  <td className="px-4 py-2.5 text-muted-foreground">{row.role}</td>
                  <td className="whitespace-nowrap px-4 py-2.5 font-mono text-xs text-muted-foreground">
                    {row.light}
                  </td>
                  <td className="whitespace-nowrap px-4 py-2.5 font-mono text-xs text-muted-foreground">
                    {row.dark}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Reveal>

      <Reveal className="mt-12">
        <h2 className="text-2xl font-semibold tracking-tight">Dark mode</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Add the class to your html element, directly or through a
          theme provider such as next-themes. The library also accepts a{" "}
          <code className="rounded bg-fill px-1.5 py-0.5 font-mono text-xs">data-theme=&quot;dark&quot;</code>{" "}
          attribute if you prefer data attributes:
        </p>
        <div className="mt-4">
          <CodeBlock filename="app/layout.tsx" language="tsx" code={darkCode} />
        </div>
        <div className="mt-4 flex items-center justify-between rounded-xl bg-fill p-4">
          <span className="text-sm font-medium">Try it live</span>
          <span className="text-sm text-muted-foreground">
            Use the sun and moon toggle in the header
          </span>
        </div>
      </Reveal>

      <Reveal className="mt-12">
        <h2 className="text-2xl font-semibold tracking-tight">Theme studio</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Try a rebrand without leaving this page. Pick an accent, tint the
          surfaces, change how deep the shadows carry. The preview and the
          generated CSS follow along, and everything stays scoped to this
          studio until you copy the code out.
        </p>
        <div className="mt-6">
          <ThemeStudio />
        </div>
      </Reveal>

      <Reveal className="mt-12">
        <h2 className="text-2xl font-semibold tracking-tight">Rebranding</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Override any token after the import and every component picks it
          up, in both themes. No rebuild, no plugin:
        </p>
        <div className="mt-4">
          <CodeBlock filename="globals.css" language="css" code={brandCode} />
        </div>
        <Alert title="Contrast first" className="mt-4">
          When you pick a new accent, check it against white text and
          against your background in both themes. The blue default passes
          AA on white at 14px and stays legible on black.
        </Alert>
      </Reveal>

      <Reveal className="mt-12">
        <h2 className="text-2xl font-semibold tracking-tight">Where color is allowed</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          The system keeps color scarce so it means something:
        </p>
        <ul className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground">
          <li>
            <span className="font-medium text-foreground">Blue</span> for links, focus
            rings, and information, nothing else.
          </li>
          <li>
            <span className="font-medium text-foreground">Green, amber and red</span> for
            status: success, warning and danger. Icons and small tints,
            rarely large surfaces.
          </li>
          <li>
            <span className="font-medium text-foreground">Black and white</span> do the
            heavy lifting: primary buttons invert with the theme, and
            fills stay gray.
          </li>
        </ul>
      </Reveal>
    </article>
  );
}
