/**
 * Copies the CSS entrypoints into dist. A node script instead of `cp`
 * so `npm run build` works on Windows, where `cp` does not exist.
 */
import { copyFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");
mkdirSync(dist, { recursive: true });

for (const file of ["pollen.css", "theme.css"]) {
  copyFileSync(join(root, "src", "css", file), join(dist, file));
  console.log(`copied src/css/${file} -> dist/${file}`);
}
