import { defineConfig } from "tsup";

/**
 * Build config for the pollen-ui package.
 *
 * - ESM + CJS from the public entries (src/index.ts for components,
 *   src/tokens.ts for the token subpath).
 * - Declarations are NOT generated here. tsup's dts bundler (rollup-plugin-dts)
 *   requires the TypeScript compiler API, which TypeScript 7 (native compiler)
 *   no longer ships; tsup 9.0.0 calls into it and crashes. Instead the build
 *   script runs `tsc -p tsconfig.build.json` right after tsup, emitting
 *   per-file declarations into dist/ (dist/index.d.ts re-exports from the
 *   mirrored tree, so package.json "types" keeps working). Without this
 *   split a rebuild would silently produce a dist with no index.d.ts while
 *   package.json points "types" at it.
 * - Everything listed under "dependencies" in package.json (clsx,
 *   framer-motion, tailwind-merge, class-variance-authority) stays
 *   external and is installed by consumers; react/react-dom are peerDeps and
 *   also external by default. Nothing else is bundled.
 *
 * "use client" banners are stripped by esbuild and re-prepended by
 * scripts/prepend-directive.mjs, which runs after this in the build script.
 */
export default defineConfig({
  entry: ["src/index.ts", "src/tokens.ts"],
  format: ["esm", "cjs"],
  target: "es2020",
  sourcemap: true,
  clean: true,
  treeshake: true,
});
