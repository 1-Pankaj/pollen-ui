import type { Metadata } from "next";
import { CodeBlock, Reveal } from "pollen-ui";
import { Alert } from "pollen-ui";

export const metadata: Metadata = {
  title: "Installation",
  description: "Install Pollen UI in a Next.js project and render your first component.",
};

const installCode = `npm install pollen-ui
# or, from a checkout of the monorepo
npm run build:lib
npm install ./packages/pollen-ui`;

const stylesheetCode = `// app/layout.tsx
import "pollen-ui/styles.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}`;

const tailwindCode = `/* app/globals.css */
@import "tailwindcss";
@import "pollen-ui/styles.css";
@import "pollen-ui/theme.css";
@source "../node_modules/pollen-ui/dist";`;

const fontsCode = `// app/layout.tsx
import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

<html className={\`\${geistSans.variable} \${geistMono.variable}\`}>`;

const themeCode = `import { ThemeProvider } from "next-themes";

<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
  {children}
</ThemeProvider>`;

const firstComponentCode = `import { Button } from "pollen-ui";

export function Actions() {
  return (
    <div className="flex gap-2">
      <Button>Deploy</Button>
      <Button variant="secondary">Preview</Button>
    </div>
  );
}`;

export default function InstallationPage() {
  return (
    <article className="max-w-2xl">
      <h1 className="text-4xl font-semibold tracking-tight">Installation</h1>
      <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
        Pollen UI targets Next.js App Router projects with React 18 or
        newer and Tailwind CSS 4. Everything is typed and tree-shakeable.
      </p>

      <Reveal className="mt-12">
        <h2 className="text-2xl font-semibold tracking-tight">1. Install</h2>
        <p className="mt-3 text-sm text-muted-foreground">
          The package ships compiled ESM and CJS builds plus a stylesheet.
        </p>
        <div className="mt-4">
          <CodeBlock filename="terminal" language="bash" code={installCode} />
        </div>
      </Reveal>

      <Reveal className="mt-12">
        <h2 className="text-2xl font-semibold tracking-tight">2. Import the stylesheet</h2>
        <p className="mt-3 text-sm text-muted-foreground">
          One import brings the design tokens, focus styles and keyframes
          into your app. Do it once in the root layout.
        </p>
        <div className="mt-4">
          <CodeBlock filename="app/layout.tsx" language="tsx" code={stylesheetCode} />
        </div>
      </Reveal>

      <Reveal className="mt-12">
        <h2 className="text-2xl font-semibold tracking-tight">3. Configure Tailwind</h2>
        <p className="mt-3 text-sm text-muted-foreground">
          Components use Tailwind utility classes on top of the Pollen
          tokens. Import the bridge stylesheet and point your Tailwind CSS
          sources at the installed package so those classes get compiled:
        </p>
        <div className="mt-4">
          <CodeBlock filename="globals.css" language="css" code={tailwindCode} />
        </div>
        <Alert className="mt-4">
          <code>theme.css</code> is the Tailwind bridge: it maps utilities
          like <code>bg-card</code> and <code>text-faint</code> onto the
          Pollen tokens. Using the monorepo source directly? Point the
          source at packages/pollen-ui/src instead of the dist folder.
        </Alert>
      </Reveal>

      <Reveal className="mt-12">
        <h2 className="text-2xl font-semibold tracking-tight">4. Render something</h2>
        <p className="mt-3 text-sm text-muted-foreground">
          Import any component and use it. There is no provider to mount and
          no config file to touch:
        </p>
        <div className="mt-4">
          <CodeBlock filename="actions.tsx" language="tsx" code={firstComponentCode} />
        </div>
        <Alert variant="success" className="mt-4">
          That is the whole setup. Every component page starts from this
          state, so demos paste straight into your app.
        </Alert>
      </Reveal>

      <Reveal className="mt-12">
        <h2 className="text-2xl font-semibold tracking-tight">Recommended: Geist</h2>
        <p className="mt-3 text-sm text-muted-foreground">
          Pollen UI is designed on Geist Sans and Geist Mono, the typefaces
          behind Vercel and Next.js. Wire them up and the whole system
          locks in:
        </p>
        <div className="mt-4">
          <CodeBlock filename="app/layout.tsx" language="tsx" code={fontsCode} />
        </div>
        <p className="mt-3 text-sm text-muted-foreground">
          Without Geist the library falls back to your system UI font and
          keeps working.
        </p>
      </Reveal>

      <Reveal className="mt-12">
        <h2 className="text-2xl font-semibold tracking-tight">Recommended: dark mode</h2>
        <p className="mt-3 text-sm text-muted-foreground">
          The dark theme activates when the html element has the{" "}
          <code className="rounded bg-fill px-1.5 py-0.5 font-mono text-xs">dark</code>{" "}
          class. The simplest way to manage that is next-themes:
        </p>
        <div className="mt-4">
          <CodeBlock filename="app/layout.tsx" language="tsx" code={themeCode} />
        </div>
      </Reveal>
    </article>
  );
}
