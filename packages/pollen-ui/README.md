# Pollen UI

[![npm](https://img.shields.io/badge/npm-v5.0.0-0070f3.svg)](https://www.npmjs.com/package/pollen-ui)
[![MIT License](https://img.shields.io/badge/license-MIT-17171a.svg)](https://github.com/1-Pankaj/pollen-ui/blob/main/LICENSE)
[![React 18 | 19](https://img.shields.io/badge/React-18%20%7C%2019-17171a.svg)](https://react.dev)
[![Tailwind CSS 4](https://img.shields.io/badge/Tailwind_CSS-4-17171a.svg)](https://tailwindcss.com)

React components for Next.js. Careful typography, spring-based motion,
light and dark themes out of the box — plus a premium set: stacked
toasts, a full chat surface, slide to confirm, pressable cards, a
magnifying dock with four edge positions, and templates that theme
themselves.

- **Documentation**: <https://1-pankaj.github.io/pollen-ui/>
- **Playground**: <https://1-pankaj.github.io/pollen-ui/playground>
- **Source & issues**: <https://github.com/1-Pankaj/pollen-ui>

Every component is documented with a live demo, a props table and a
playground. The design language: achromatic surfaces with one blue
accent, elevation instead of outlines, and motion that only shows up
where things can be interrupted.

## Install

```bash
npm install pollen-ui
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

Components are styled with Tailwind utilities on top of CSS variable
design tokens. Two imports and one source directive:

```css
/* app/globals.css */
@import "tailwindcss";
@import "pollen-ui/styles.css";
@import "pollen-ui/theme.css";
@source "../node_modules/pollen-ui/dist";
```

`styles.css` carries the design tokens, focus styles and keyframes.
`theme.css` maps Tailwind utilities (`bg-card`, `text-faint`,
`bg-fill-strong`, `text-accent`, ...) onto those tokens, so component
colors follow light and dark automatically. `@source` points your
Tailwind build at the installed package so its classes get compiled.

## Requirements

- React 18 or 19 (Server Components supported — every client
  component ships with a `"use client"` directive)
- Tailwind CSS 4
- Next.js App Router, Pages Router, Vite, Remix or any React setup
  with Tailwind 4

Recommended: pair it with [Geist](https://vercel.com/font), the
typeface the system is designed on. The library falls back to your
system UI font without it.

## Theming

Every color and shadow is a CSS variable. Light is the default; add
the `dark` class on `<html>` (or `data-theme="dark"`) for dark mode.

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

The [Theme Studio](https://1-pankaj.github.io/pollen-ui/docs/theming)
generates a full rebrand live. Prefer the tokens in TypeScript? They
ship as data:

```tsx
import { light, dark, springSnappy } from "pollen-ui/tokens";
```

## Motion

The animation rules are deliberate and small:

- Entrances and exits use ease-out. Nothing starts slow.
- UI motion stays under 300ms.
- Springs are reserved for interruptible interactions: toggles, drags,
  stacks.
- Overlays scale from their trigger edge, modals from center, and
  nothing animates from scale zero.

The presets are exported if you want to stay consistent:

```tsx
import { spring, EASE_OUT } from "pollen-ui";
```

## Components

63 components in five families, plus 103 hand-drawn icons — zero icon
dependencies:

**Primitives**: Button, Badge, Input, Textarea, Label, Select,
Combobox, Checkbox, Radio Group, Switch, Slider, Rating, Tag Input,
Toggle Group, OTP Input, Pagination

**Overlays**: Modal, Drawer, Popover, Tooltip, Dropdown Menu, Context
Menu, Command, Toast, Toast Pile

**Display**: Tabs, Breadcrumb, Accordion, Avatar, Alert, Skeleton,
Spinner, Progress, Progress Ring, Kbd, Table, Card, Code Block,
Segmented Control, Steps, Timeline, Stat, Empty State

**Motion**: Reveal, Text Reveal, Marquee, Scroll Progress, Parallax,
Number Ticker, Typewriter

**Signatures**: Dock, Kinetic Headline, Magnetic Button, Odometer,
Scramble Text, Slide to Confirm, Chat, Pressable Card, Tilt Card,
Ticket Card

Full component index:
<https://1-pankaj.github.io/pollen-ui/docs>

## Accessibility

Focus rings everywhere, arrow keys in menus, select lists, radio
groups and toggle groups, roving tabindex, labelled dialogs with focus
traps and focus return, native hidden inputs for form submission,
Escape on every overlay, semantic roles throughout, and
`prefers-reduced-motion` respected in the stylesheet and in every
animated component, including the JS-driven ones.

## Contributing

Issues and pull requests are welcome at
<https://github.com/1-Pankaj/pollen-ui>. Keep new components
consistent with the system: tokens over hex values, elevation over
outlines, ease-out entrances under 300ms, springs only for
interruptible interactions. See
[CONTRIBUTING.md](https://github.com/1-Pankaj/pollen-ui/blob/main/CONTRIBUTING.md)
for the full guide.

## License

MIT. Free for personal and commercial use. Geist and Instrument Serif
are distributed under the SIL Open Font License and loaded through
Google Fonts / Fontsource.
