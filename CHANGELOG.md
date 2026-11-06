# Changelog

All notable changes to the Pollen UI packages are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [5.0.0] - 2026-11-05

The first public release of the reworked library. One version across all
three packages: `pollen-ui`, `@pollen-ui/tokens`, `@pollen-ui/native`.

### pollen-ui

- 60 components in five families (Primitives, Overlays, Display, Motion,
  Signatures) plus 104 icons, documented across 59 pages with a live demo
  and playground on every page.
- Single-line stylesheet import: `pollen-ui/styles.css` for the design
  tokens, focus styles and keyframes; `pollen-ui/theme.css` for the
  Tailwind CSS 4 bridge that maps utilities onto the tokens.
- React 19, Next.js 16, Tailwind CSS 4. Every client component carries
  its `"use client"` directive and works under RSC without wrapping.
- Accessibility pass: labelled modal and drawer dialogs, focus traps and
  focus return, listbox semantics with type-ahead for Select and
  Combobox, roving tabindex for Radio Group and Toggle Group, native
  hidden inputs on Checkbox and Radio Group for form submission,
  keyboard-reachable Input clear and reveal buttons, keyboard row
  activation on Table and TiltCard, an Escape-and-focus-return story for
  every floating panel.
- Reduced motion: every transition and spring in the library consults
  `prefers-reduced-motion`, including the JS-driven ones (dock
  magnification, slider bubble, slide-to-confirm nudge, progress
  indeterminate).
- Mobile and touch readiness: safe-area-aware toasts, 16px input text on
  touch pointers (no iOS focus zoom), enlarged hit areas for close and
  clear buttons under coarse pointers, `dvh` heights for Modal, Drawer
  and Command on mobile toolbars, overscroll containment.
- Input and Textarea variants: `fill`, `outline`, `underline` and `ghost`
  treatments, three sizes, label, helper, error and success lines,
  character count, clearable, loading, password reveal (Input) and
  auto-grow (Textarea).
- Bug fixes over the pre-release code: toast and toast-pile cards render
  filled instead of transparent, MagneticButton variants respond to
  hover and fire their shine sweep, SlideToConfirm accent tone is accent
  blue rather than green, PressableCard applies its large hover shadow,
  ProgressRing foreground variant is readable in dark mode, Odometer
  resumes from the interrupted position, TagInput keeps focus while the
  shake animation replays.

### @pollen-ui/tokens (new package)

- The design tokens behind the library as installable TypeScript:
  colors, surfaces, shadows, radii, spacing, type scale and the three
  spring presets, in light and dark. One source of truth shared by the
  web library, the docs site and the native package.

### @pollen-ui/native (new package)

- Eight primitives on React Native (Button, Badge, Input, Switch,
  Slider, Progress, Skeleton, SkeletonText, Avatar, AvatarGroup)
  implementing the same design language with Reanimated springs and
  shadow/elevation mappings derived from the shared tokens.
- Works with Expo; NativeWind passthrough on every component.

### Documentation site

- Playground on every component page: CodeMirror editor, in-browser
  Sucrase build of the real library, live props pane, phone-width
  preview, theme switch, syntax and runtime error panes, per-component
  local persistence.
- Theme Studio for accent, surface tint, shadow depth and dark mode with
  copyable CSS.
- Templates gallery: prebuilt heroes, navbars and page sections with
  per-preview light/dark switches.

[Unreleased]: https://github.com/1-Pankaj/pollen-ui/compare/v5.0.0...HEAD
[5.0.0]: https://github.com/1-Pankaj/pollen-ui/releases/tag/v5.0.0
