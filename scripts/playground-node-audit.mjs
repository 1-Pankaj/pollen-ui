// Node-side playground audit: validates EVERY registry demo's code string
// (not just demos[0]) and EVERY playground spec/control combination through
// the real compile pipeline (toPlaygroundSource -> compile -> SSR render).
// Run: node scripts/playground-node-audit.mjs
import { register } from "node:module";
import { pathToFileURL } from "node:url";

register("./lib-sucrase-loader.mjs", pathToFileURL("./scripts/").href.replace(/scripts\/$/, "scripts/"));

const { allEntries } = await import("../src/lib/registry/index.ts");
const { compile } = await import("../src/lib/playground/compile.ts");
const { toPlaygroundSource } = await import("../src/lib/playground/normalize.ts");
const { playgroundSnippet } = await import("../src/lib/playground/props-code.ts");
const React = (await import("react")).default;
const { renderToStaticMarkup } = await import("react-dom/server");

const failures = [];
let checked = 0;

function check(label, source) {
  checked++;
  let result;
  try {
    result = compile(source);
  } catch (e) {
    failures.push({ label, stage: "compile-throw", error: String(e).slice(0, 200) });
    return;
  }
  if (!result.ok || !result.Component) {
    failures.push({ label, stage: "compile", error: result.error ?? "no component" });
    return;
  }
  try {
    renderToStaticMarkup(React.createElement(result.Component));
  } catch (e) {
    failures.push({ label, stage: "render", error: String(e).slice(0, 200) });
  }
}

// 1. Every demo of every entry.
for (const entry of allEntries) {
  entry.demos.forEach((demo, i) => {
    check(`${entry.slug} demo#${i} (${demo.title})`, toPlaygroundSource(demo.code));
  });
}

// 2. Every playground spec: defaults plus one mutation per control value.
for (const entry of allEntries) {
  const spec = entry.playground;
  if (!spec) continue;
  check(`${entry.slug} spec:defaults`, playgroundSnippet(spec, spec.values));
  for (const control of spec.controls) {
    let variants = [];
    if (control.kind === "select") variants = control.options.map((o) => o.value);
    else if (control.kind === "boolean") variants = [true, false];
    else if (control.kind === "number")
      variants = [control.min ?? 0, control.max ?? 10];
    else variants = [control.placeholder ?? "text"];
    for (const v of variants) {
      const values = { ...spec.values, [control.prop]: v };
      check(
        `${entry.slug} spec:${control.prop}=${String(v).slice(0, 24)}`,
        playgroundSnippet(spec, values),
      );
    }
  }
}

console.log(`\nchecked ${checked} snippets, ${failures.length} failures\n`);
const seen = new Set();
for (const f of failures) {
  const key = `${f.stage}|${f.error.slice(0, 80)}`;
  const dup = seen.has(key);
  seen.add(key);
  console.log(`FAIL [${f.stage}] ${f.label}\n   ${f.error}${dup ? "  (dup)" : ""}`);
}
console.log(
  failures.length === 0
    ? "ALL CLEAN"
    : `\n${failures.length} failures across ${new Set(failures.map((f) => f.label.split(" ")[0])).size} entries`,
);
