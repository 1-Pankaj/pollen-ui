import { demoJs, templateCodeJs } from "@/lib/docs-data.generated";

/**
 * JavaScript variants are precomputed at build time by
 * scripts/generate-docs-data.mjs (types stripped, JSX preserved), so
 * the language switch is a pure lookup - no transpiler ships to the
 * browser and switching is instant.
 */

/** Precomputed JavaScript variant of a registry demo (slug + demo title). */
export function jsVariantOfDemo(slug: string, title: string): string | null {
  return demoJs[`${slug}::${title}`] ?? null;
}

/** Precomputed JavaScript variant of a template's complete source. */
export function jsVariantOfTemplate(id: string): string | null {
  return templateCodeJs[id] ?? null;
}
