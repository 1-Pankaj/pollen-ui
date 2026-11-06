import { defineConfig } from "tsup";

/**
 * Build config for @pollen/tokens.
 *
 * Declarations are NOT generated here (tsup's dts bundler needs the
 * TypeScript compiler API, which TypeScript 7 no longer ships); the
 * build script runs `tsc -p tsconfig.build.json` right after tsup.
 * There are no runtime dependencies, so nothing needs to stay external.
 */
export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  target: "es2020",
  sourcemap: true,
  clean: true,
  treeshake: true,
});
