# Roadmap

Pollen UI is a React component library with a frozen design language:
achromatic palette, one blue accent, layered shadows instead of
borders, Geist and Instrument Serif typography, spring-based motion.
This file tracks where the project is heading. Nothing on this list has
a committed date.

## Shipped in 5.0

- 60 components in five families, plus 104 icons
- Docs site: 59 pages, live playground on every page, Theme Studio,
  templates gallery
- `@pollen-ui/tokens`: the design tokens as an installable TypeScript
  package, shared across web and native
- `@pollen-ui/native`: React Native primitives implementing the same
  design language (Button, Badge, Input, Switch, Slider, Progress,
  Skeleton, Avatar)
- Accessibility pass across overlays, menus, form controls and motion
- Mobile readiness: safe-area toasts, touch-pointer input sizing,
  `dvh` overlay heights

## Next

- **More native primitives.** Checkbox, Radio Group, OTP input, Rating,
  Tag Input and Toast for `@pollen-ui/native`, following the same
  tokens-first approach.
- **More entry points for the web library.** Per-family imports
  (`pollen-ui/overlays` and friends) to keep bundle sizes tight for
  apps that only need part of the library.
- **Framework guides.** Verified setup walkthroughs for Vite,
  Remix/React Router and Astro islands, with working example repos.
- **RTL support.** Direction-aware floating positioning for select
  lists, dropdowns, popovers and tooltips, plus logical-property
  coverage for the remaining components.

## Considering

- **Data display family for native.** Table equivalents for React
  Native with the same visual language.
- **A tokens playground.** Live editing of `@pollen-ui/tokens` values with
  a real-time preview across several components at once.
- **Figma library.** A component kit mirroring the package so designs
  and code speak the same language.

If you want something on this list to move, open a
[feature request](https://github.com/1-Pankaj/pollen-ui/issues/new?template=feature_request.yml)
— thumbs-up reactions on requests are genuinely how prioritization
happens here.
