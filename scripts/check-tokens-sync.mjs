/**
 * Token sync guard.
 *
 * Three copies of the design tokens must agree at all times:
 *
 *   1. packages/pollen-ui/src/css/pollen.css   (visual source of truth)
 *   2. packages/pollen-ui/src/tokens.ts        (pollen-ui/tokens subpath)
 *   3. packages/tokens/src/index.ts            (@pollen-ui/tokens)
 *
 * This script bundles (2) and (3) with esbuild, imports them, parses
 * the custom properties out of (1) for the :root and .dark blocks, and
 * deep-compares everything. It also checks the spring presets against
 * packages/pollen-ui/src/lib/springs.ts. Exits 1 with a report on any
 * drift. Wired into CI.
 */
import { build } from "esbuild";
import { readFileSync, writeFileSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const root = resolve(import.meta.dirname, "..");
const problems = [];

const bundle = async (entry) => {
  const outDir = mkdtempSync(join(tmpdir(), "pollen-tokens-"));
  const outFile = join(outDir, "tokens.mjs");
  await build({
    entryPoints: [entry],
    bundle: true,
    format: "esm",
    outfile: outFile,
    logLevel: "silent",
  });
  const mod = await import(pathToFileURL(outFile).href);
  rmSync(outDir, { recursive: true, force: true });
  return mod;
};

// --- parse pollen.css ----------------------------------------------------
const css = readFileSync(
  join(root, "packages/pollen-ui/src/css/pollen.css"),
  "utf8",
);

const parseBlock = (name) => {
  const start = css.indexOf(name);
  if (start === -1) throw new Error(`block ${name} not found in pollen.css`);
  const open = css.indexOf("{", start);
  let depth = 1;
  let end = open;
  for (let i = open + 1; i < css.length && depth > 0; i++) {
    if (css[i] === "{") depth++;
    if (css[i] === "}") depth--;
    end = i;
  }
  const body = css.slice(open + 1, end);
  const vars = {};
  for (const m of body.matchAll(/--pollen-([a-z-]+)\s*:\s*([^;]+);/g)) {
    vars[m[1]] = m[2].replace(/\s+/g, " ").trim();
  }
  return vars;
};

const cssLight = parseBlock(":root");
const cssDark = parseBlock(".dark,\n[data-theme=\"dark\"]");

// The dark block inherits the light values it does not override.
const cssDarkFull = { ...cssLight, ...cssDark };

// --- map token module -> css names ---------------------------------------
const camelToKebab = (s) => s.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);

const compareTheme = (label, theme, cssVars) => {
  for (const [key, value] of Object.entries(theme.colors)) {
    const cssName = camelToKebab(key);
    const cssValue = cssVars[cssName];
    if (cssValue === undefined) {
      problems.push(`${label}: --pollen-${cssName} missing from pollen.css`);
    } else if (cssValue !== value) {
      problems.push(
        `${label}: colors.${key} = "${value}" but pollen.css says "${cssValue}"`,
      );
    }
  }
  for (const [key, value] of Object.entries(theme.shadows)) {
    const cssName = `shadow-${key}`;
    const cssValue = cssVars[cssName];
    if (cssValue === undefined) {
      problems.push(`${label}: --pollen-${cssName} missing from pollen.css`);
    } else if (cssValue !== value.replace(/\s+/g, " ").trim()) {
      problems.push(
        `${label}: shadows.${key} differs from --pollen-${cssName}`,
      );
    }
  }
};

// --- load both TS token modules ------------------------------------------
const libTokens = await bundle(
  join(root, "packages/pollen-ui/src/tokens.ts"),
);
const pkgTokens = await bundle(join(root, "packages/tokens/src/index.ts"));

const defaultOf = (m) => m.default ?? m;

const a = defaultOf(libTokens);
const b = defaultOf(pkgTokens);

if (JSON.stringify(a) !== JSON.stringify(b)) {
  problems.push(
    "pollen-ui/src/tokens.ts and packages/tokens/src/index.ts differ — they must be identical",
  );
}

compareTheme("light", a.light, cssLight);
compareTheme("dark", a.dark, cssDarkFull);

// --- springs vs lib/springs.ts -------------------------------------------
const springsSource = readFileSync(
  join(root, "packages/pollen-ui/src/lib/springs.ts"),
  "utf8",
);
const springs = [
  ["springSoft", a.springSoft],
  ["springSnappy", a.springSnappy],
  ["springGentle", a.springGentle],
];
for (const [name, preset] of springs) {
  for (const [k, v] of Object.entries(preset)) {
    const re = new RegExp(`${name}\\s*[^}]*${k}\\s*:\\s*([\\d.]+)`);
    const m = springsSource.match(re);
    if (!m) {
      problems.push(`springs.ts: cannot find ${name}.${k}`);
    } else if (Number(m[1]) !== v) {
      problems.push(
        `spring ${name}.${k} = ${v} in tokens but ${m[1]} in lib/springs.ts`,
      );
    }
  }
}

// --- report --------------------------------------------------------------
if (problems.length > 0) {
  console.error("Token sync check FAILED:");
  for (const p of problems) console.error(`  - ${p}`);
  process.exit(1);
}

console.log(
  `Token sync OK: pollen.css <-> pollen-ui/tokens <-> @pollen-ui/tokens agree (${Object.keys(cssLight).length} light vars, ${Object.keys(cssDark).length} dark overrides, 3 spring presets).`,
);
