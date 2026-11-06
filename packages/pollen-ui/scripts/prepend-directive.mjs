// Post-build: esbuild strips "use client" directives while bundling,
// so we prepend one to the shipped JS bundles ourselves.
import { readFileSync, writeFileSync } from "node:fs";

for (const file of ["dist/index.js", "dist/index.cjs"]) {
  let src = readFileSync(file, "utf8");
  if (!src.startsWith('"use client"')) {
    src = '"use client";\n' + src;
    writeFileSync(file, src);
    console.log(`prepended directive to ${file}`);
  }
}
