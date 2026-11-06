# Contributing to Pollen UI

Thanks for your interest in improving Pollen UI. This document covers
how to set the repo up, how the packages fit together, and the rules
that keep contributions reviewable.

## Development setup

Requirements: Node.js 20.9 or newer (CI runs on 22) and npm 10+.

```bash
git clone https://github.com/1-Pankaj/pollen-ui.git
cd pollen-ui
npm install
npm run dev
```

`npm run dev` starts the documentation site on http://localhost:3000.
The site consumes the library source directly, so component edits show
up on save without a build step.

## Repository layout

| Path | What it is |
| --- | --- |
| `packages/pollen-ui` | The component library (npm package `pollen-ui`). Components live in `src/components`, tokens and keyframes in `src/css/pollen.css`, icons in `src/icons.tsx`. |
| `packages/tokens` | `@pollen-ui/tokens` — the design tokens as TypeScript, shared by the web library and the native package. |
| `packages/native` | `@pollen-ui/native` — React Native primitives implementing the same design language. |
| `src` | The documentation site (Next.js App Router). Registry entries in `src/lib/registry` drive every docs page. |

## Common tasks

| Task | Command |
| --- | --- |
| Start the docs site | `npm run dev` |
| Build the library (`dist/`) | `npm run build:lib` |
| Type-check the site | `npm run typecheck` |
| Type-check the library | `npm run typecheck:lib` |
| Type-check the native package | `npm run typecheck --workspace @pollen-ui/native` |
| Lint everything | `npm run lint` |
| Rebuild `@pollen-ui/tokens` | `npm run build --workspace @pollen-ui/tokens` |
| Verify token agreement | `npm run check:tokens` |

Before opening a pull request, make sure all of the following pass:

```bash
npm run typecheck && npm run typecheck:lib
npm run lint
npm run build:lib
npm run build
```

## Pull request rules

1. **The design is frozen.** Pollen UI has a specific design language:
   an achromatic palette with one blue accent used sparingly, elevation
   through layered shadows instead of borders, Geist Sans/Mono plus
   Instrument Serif for display accents, ease-out entrances under
   300ms, and springs only where interruptions happen. Do not
   introduce new colors, new border treatments or new motion curves.
   Fixes must reproduce the current rendered output, or restore
   documented behavior of an existing variant.
2. **One component per pull request** where practical, with the demo
   and registry entry updated in the same PR. Every component needs a
   registry entry (`src/lib/registry`), at least one demo, and a props
   table if it takes props.
3. **Accessibility is not optional.** New interactive components need
   keyboard support, visible focus, correct roles and labels, and a
   `prefers-reduced-motion` story for anything animated. See the
   existing components for the house pattern.
4. **No new runtime dependencies in `pollen-ui`** without prior
   discussion in an issue. The library currently ships with
   `clsx`, `tailwind-merge`, `class-variance-authority` and
   `framer-motion`, and that list is deliberate.
5. **Keep the native package in sync conceptually.** If you change a
   token, run `npm run check:tokens` — `pollen.css`, the Tailwind
   bridge, `@pollen-ui/tokens` and the native package must agree.

## Commit conventions

Short imperative subject line ("Fix toast card fill in dark mode"),
blank line, then a body explaining the why if the subject does not
cover it. Reference issues with `#n` in the body.

## Reporting bugs

Open a bug report with the issue template. Screenshots (or a short
recording) plus the browser/OS make a fix dramatically faster. For
security issues, see `SECURITY.md` — please do not open a public issue.

## License

By contributing, you agree that your contributions will be licensed
under the [MIT license](LICENSE) that covers the project.
