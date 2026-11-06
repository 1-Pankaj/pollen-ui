// Node module hooks so the playground audit can import the site's TSX
// (registry, playground libs) and the library source directly.
// Usage: import "node:module".register(...) via scripts/playground-node-audit.mjs
import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import { transform } from "sucrase";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");

function mapSpecifier(specifier, parentURL) {
  if (specifier === "pollen-ui") {
    return pathToFileURL(path.join(ROOT, "packages/pollen-ui/src/index.ts")).href;
  }
  if (specifier.startsWith("@/")) {
    const base = path.join(ROOT, "src", specifier.slice(2));
    if (path.extname(base)) return pathToFileURL(base).href;
    for (const cand of [`${base}.ts`, `${base}.tsx`, path.join(base, "index.ts"), path.join(base, "index.tsx")]) {
      if (existsSync(cand)) return pathToFileURL(cand).href;
    }
  }
  if (specifier.endsWith(".css")) return "about:blank-css";
  // Extensionless relative TS imports: ESM resolution calls this hook, so
  // try the .ts/.tsx/. /index variants the TypeScript codebase relies on.
  if ((specifier.startsWith("./") || specifier.startsWith("../")) && !path.extname(specifier)) {
    const base = fileURLToPath(new URL(specifier, parentURL));
    for (const cand of [`${base}.ts`, `${base}.tsx`, path.join(base, "index.ts"), path.join(base, "index.tsx")]) {
      if (existsSync(cand)) return pathToFileURL(cand).href;
    }
  }
  return null; // default resolution
}

export async function initialize(data) {}

export async function resolve(specifier, context, nextResolve) {
  try {
    const mapped = mapSpecifier(specifier, context.parentURL);
    if (mapped === "about:blank-css") {
      return { url: `css:${specifier}`, shortCircuit: true };
    }
    if (mapped) return { url: mapped, shortCircuit: true };
  } catch {
    // fall through to default
  }
  return nextResolve(specifier, context);
}

export async function load(url, context, nextLoad) {
  if (url.startsWith("css:")) {
    return { format: "module", source: "export default {};", shortCircuit: true };
  }
  if (url.endsWith(".tsx") || url.endsWith(".ts")) {
    const file = fileURLToPath(url);
    const source = await readFile(file, "utf8");
    const transformed = transform(source, {
      transforms: ["typescript", "jsx"],
      jsxRuntime: "automatic",
      production: true,
      filePath: file,
    }).code;
    return { format: "module", source: transformed, shortCircuit: true };
  }
  return nextLoad(url, context);
}
