# Pollen UI

React components for Next.js. Careful typography, spring-based motion, and light and dark themes out of the box.

63 components in five families: the everyday set (buttons, inputs, selects, modals, drawers, tooltips, dropdown menus, a command palette, toasts, tabs, tables) and a shelf of signatures you will not find pasted from tutorials - a dock with real magnification physics, an odometer, kinetic headlines, text that decodes, cards that tilt, tickets that tear, a full chat surface, slide to confirm, and pressable cards. Every one is typed and styled with Tailwind utilities on top of CSS variable design tokens.

## Icons included

The library ships with its own hand-drawn icon set (103 glyphs on a 24px grid, one stroke weight, a recurring seed motif) and has **zero icon dependencies**. Nothing to install, nothing to tree-shake around:

```tsx
import { IconSeed, IconDeploy, IconPetal } from "pollen-ui";
```

Every component renders these glyphs internally, so replacing lucide-react or any other icon pack is a deletion, not a migration.

## Install

From npm, once a release is published:

```bash
npm install pollen-ui
```

Or build and install from the monorepo:

```bash
npm run build:lib
npm install ./packages/pollen-ui
```

Import the stylesheet once in your app entry:

```tsx
// app/layout.tsx
import "pollen-ui/styles.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

Then use any component:

```tsx
import { Button } from "pollen-ui";

export default function Page() {
  return <Button>Ship it</Button>;
}
```

## Tailwind setup

Components use Tailwind utilities on top of the Pollen tokens. Two imports and one source directive:

```css
/* app/globals.css */
@import "tailwindcss";
@import "pollen-ui/styles.css";
@import "pollen-ui/theme.css";
@source "../node_modules/pollen-ui/dist";
```

`styles.css` carries the design tokens, focus styles and keyframes. `theme.css` maps Tailwind utilities (`bg-card`, `text-faint`, `bg-fill-strong`, `text-accent`, ...) onto those tokens, so component colors follow light and dark automatically. `@source` points your Tailwind build at the installed package so its classes get compiled.

## Requirements

- React 18 or newer (React 19 supported, including Server Components - every client component ships with a `"use client"` directive)
- Tailwind CSS 4
- Next.js App Router, Pages Router, Vite, Remix or any React setup with Tailwind 4

Recommended: pair it with [Geist](https://vercel.com/font), the typeface the system is designed on. The library falls back to your system UI font without it.

## Theming

Every color and shadow is a CSS variable. Light is the default; add the `dark` class on `<html>` (or `data-theme="dark"`) for dark mode.

```css
:root {
  --pollen-accent: #0070f3; /* your accent */
  --pollen-card: #ffffff; /* your raised surface */
}

.dark {
  --pollen-accent: #3291ff;
  --pollen-card: #161619;
}
```

The palette is achromatic by design: near-black text, white surfaces that lift with soft shadows, and one blue accent used like punctuation. Status colors (success, warning, danger) show up in icons and small tints, rarely in large surfaces. Nothing on screen is drawn with a hard outline; surfaces separate through elevation, and internal dividers are 7 percent ink.

## Motion

The animation rules are deliberate and small:

- Entrances and exits use ease-out. Nothing starts slow.
- UI motion stays under 300ms.
- Springs are reserved for interruptible interactions: toggles, drags, stacks.
- Overlays scale from their trigger edge, modals from center, and nothing animates from scale zero.

The presets are exported if you want to stay consistent:

```tsx
import { spring, EASE_OUT } from "pollen-ui";
```

## Components

**Primitives**: Button, Badge, Input, Textarea, Label, Select, Combobox, Checkbox, Radio Group, Switch, Slider, Rating, Tag Input, Toggle Group, OTP Input, Pagination

**Overlays**: Modal, Drawer, Popover, Tooltip, Dropdown Menu, Context Menu, Command, Toast, Toast Pile

**Display**: Tabs, Breadcrumb, Accordion, Avatar, Alert, Skeleton, Spinner, Progress, Progress Ring, Kbd, Table, Card, Code Block, Segmented Control, Steps, Timeline, Stat, Empty State

**Motion**: Reveal, Text Reveal, Marquee, Scroll Progress, Parallax, Number Ticker, Typewriter

**Signatures**: Dock, Kinetic Headline, Magnetic Button, Odometer, Scramble Text, Slide to Confirm, Chat, Pressable Card, Tilt Card, Ticket Card

## Accessibility

Focus rings everywhere, arrow keys in menus, select lists, radio groups and toggle groups, roving tabindex, labelled dialogs with focus traps and focus return, native hidden inputs for form submission, Escape on every overlay, semantic roles throughout, and `prefers-reduced-motion` respected in the stylesheet and in every animated component, including the JS-driven ones.

## Contributing

Issues and pull requests are welcome. Keep new components consistent with the system: tokens over hex values, elevation over outlines, ease-out entrances under 300ms, springs only for interruptible interactions. See CONTRIBUTING.md for the full guide.

## License

MIT. Free for personal and commercial use.
