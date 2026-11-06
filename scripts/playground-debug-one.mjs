// Debug one entry's normalization + compile result.
import { register } from "node:module";
import { pathToFileURL } from "node:url";
register("./lib-sucrase-loader.mjs", pathToFileURL("./scripts/").href);
const { allEntries } = await import("../src/lib/registry/index.ts");
const { toPlaygroundSource } = await import("../src/lib/playground/normalize.ts");
const { compile } = await import("../src/lib/playground/compile.ts");
const slug = process.argv[2] ?? "code-block";
const demoIndex = Number(process.argv[3] ?? 0);
const e = allEntries.find((x) => x.slug === slug);
const src = toPlaygroundSource(e.demos[demoIndex].code);
console.log("===NORMALIZED===");
console.log(src);
console.log("===COMPILE===");
const r = compile(src);
console.log({ ok: r.ok, error: r.error, hasComponent: !!r.Component });
