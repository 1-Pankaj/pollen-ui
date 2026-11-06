import { register } from "node:module";
import { pathToFileURL } from "node:url";
register("./lib-sucrase-loader.mjs", pathToFileURL("./scripts/").href);
const { allEntries } = await import("../src/lib/registry/index.ts");
const { toPlaygroundSource } = await import("../src/lib/playground/normalize.ts");
const entry = allEntries.find((e) => e.slug === "compare-slider");
const demo = entry.demos.find((d) => d.title.includes("Hover"));
const out = toPlaygroundSource(demo.code);
console.log(out.split("\n").slice(0, 24).map((l, i) => `${String(i + 1).padStart(2)} ${l}`).join("\n"));
