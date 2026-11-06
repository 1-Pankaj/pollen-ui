/**
 * Turns the docs' demo snippets, which are sometimes bare JSX
 * fragments, into complete playground sources with a default
 * export. Import statements are preserved, everything else is
 * wrapped in a Demo component with a fragment around the JSX.
 *
 * Variant demos omit the import line on purpose (the intro demo
 * already showed it), but a playground snippet has to stand
 * alone, so missing `pollen-ui` names are injected here: every
 * capitalized JSX tag that Pollen exports and the snippet does
 * not import gets one import statement. The editor then shows
 * exactly the code a user would paste into a real project.
 */
import * as PollenUI from "pollen-ui";

const POLLEN_EXPORTS: ReadonlySet<string> = new Set(Object.keys(PollenUI));

const IMPORT_PATTERN = /import[\s\S]*?from\s*["'][^"']+["'];?/g;
const NAMED_IMPORT_PATTERN = /import\s*\{([^}]*?)\}\s*from\s*["']([^"']+)["']/g;
const JSX_TAG_PATTERN = /<([A-Z][A-Za-z0-9]*)(?=[\s/>])/g;

function indentBlock(source: string, pad = "    ") {
  return source
    .split("\n")
    .map((line) => (line.trim() ? pad + line : line))
    .join("\n");
}

/**
 * Char offset of the first JSX element that sits at brace depth
 * zero. A naive "first line that starts with <" scan would split in
 * the middle of a leading helper component whose own body contains
 * JSX; counting brackets keeps the split at the true top level.
 */
function topLevelJsxStart(body: string): number {
  const lines = body.split("\n");
  let depth = 0;
  let offset = 0;
  for (const line of lines) {
    if (depth === 0 && /^\s*</.test(line)) return offset;
    for (const ch of line) {
      if (ch === "{" || ch === "(" || ch === "[") depth++;
      else if (ch === "}" || ch === ")" || ch === "]") depth--;
    }
    offset += line.length + 1;
  }
  return -1;
}

/** Capitalized JSX tags the snippet uses but never imports. */
function missingPollenNames(source: string): string[] {
  const imported = new Set<string>();
  for (const m of source.matchAll(NAMED_IMPORT_PATTERN)) {
    for (const part of m[1].split(",")) {
      const local = part.trim().split(/\s+as\s+/).pop()?.trim();
      if (local) imported.add(local);
    }
  }
  const used = new Set<string>();
  for (const m of source.matchAll(JSX_TAG_PATTERN)) used.add(m[1]);
  return [...used].filter((name) => !imported.has(name) && POLLEN_EXPORTS.has(name)).sort();
}

/** Adds one import for the missing names, merged into an existing
    `pollen-ui` import when there is one. */
function withInjectedImports(code: string): string {
  const missing = missingPollenNames(code);
  if (missing.length === 0) return code;

  const pollenImport = code.match(/import\s*\{([^}]*?)\}\s*from\s*["']pollen-ui["'];?/);
  if (pollenImport) {
    const existing = pollenImport[1]
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const merged = [...new Set([...existing, ...missing])].sort();
    return code.replace(
      pollenImport[0],
      `import { ${merged.join(", ")} } from "pollen-ui";`,
    );
  }
  return `import { ${missing.join(", ")} } from "pollen-ui";\n\n${code}`;
}

export function toPlaygroundSource(input: string): string {
  const code = withInjectedImports(input);
  // Line-anchored: a sample string that merely contains the words
  // "export default" (say, inside a CodeBlock demo) must not count.
  if (/^\s*export\s+default\b/m.test(code)) return code;

  const imports = code.match(IMPORT_PATTERN) ?? [];
  let body = code.replace(IMPORT_PATTERN, "").trim();
  if (!body) return code;

  // Split leading declarations (const/let/function) from the JSX
  // so declarations can live inside the component and the JSX
  // becomes its return value. The split only counts JSX at the top
  // level, so helper components above it stay whole.
  const jsxStart = topLevelJsxStart(body);
  let declarations = "";
  if (jsxStart > 0) {
    declarations = body.slice(0, jsxStart).trim();
    body = body.slice(jsxStart).trim();
  }

  const hasJsx = jsxStart >= 0 || body.startsWith("<");
  if (!hasJsx) return code; // Plain code sample, leave untouched.

  const lines: string[] = [...imports];
  lines.push("", "export default function Demo() {");
  if (declarations) lines.push(indentBlock(declarations, "  "), "");
  lines.push("  return (");
  lines.push("    <>");
  lines.push(indentBlock(body, "      "));
  lines.push("    </>");
  lines.push("  );");
  lines.push("}");
  return lines.join("\n");
}
