import { primitives } from "./primitives";
import { overlays } from "./overlays";
import { display } from "./display";
import { motionEntries } from "./motion";
import { expanded } from "./expanded";
import { signatures } from "./signatures";
import type { RegistryEntry } from "./types";

export type { Demo, PropRow, RegistryEntry } from "./types";

export const registry: Record<string, RegistryEntry> = Object.fromEntries(
  [
    ...primitives,
    ...overlays,
    ...display,
    ...motionEntries,
    ...expanded,
    ...signatures,
  ].map((entry) => [entry.slug, entry]),
);

export const allEntries: RegistryEntry[] = [
  ...primitives,
  ...overlays,
  ...display,
  ...motionEntries,
  ...expanded,
  ...signatures,
];

/** Lightweight index for the sidebar, header search and footer. */
export const componentIndex = allEntries.map((entry) => ({
  slug: entry.slug,
  title: entry.title,
  description: entry.description,
}));
