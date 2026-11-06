/**
 * Generates src/lib/docs-data.generated.ts from the real sources:
 *
 *  1. slug -> export-name map for every registry entry (validated: every
 *     entry title must normalize onto exactly one exported library name).
 *  2. Per-template metadata (parsed from the gallery page) and the complete,
 *     copy-pasteable source of each of the 25 templates: the exported
 *     component plus every module-level helper it references (transitive),
 *     with the exact import block recomputed from the identifiers the code
 *     actually uses (react hooks, next/link, framer-motion, pollen-ui).
 *  3. A syntax check of every emitted snippet via Sucrase.
 *  4. A check that the hand-written @pollen/native usage snippets in
 *     src/lib/native-usage.ts only import names the native package really
 *     exports.
 *
 * Run: node scripts/generate-docs-data.mjs   (also wired as npm prebuild)
 */
import fs from "node:fs";
import path from "node:path";
import ts from "typescript";
import sucrase from "sucrase";

const ROOT = process.cwd();
const OUT = path.join(ROOT, "src/lib/docs-data.generated.ts");
const read = (p) => fs.readFileSync(path.join(ROOT, p), "utf8");
const fail = (msg) => {
  console.error(`generate-docs-data: ${msg}`);
  process.exit(1);
};
const { transform } = sucrase;

/* ------------------------------------------------------------------ */
/* 1. Library export names (values used in code, incl. icons and cn)   */
/* ------------------------------------------------------------------ */

const libIndex = read("packages/pollen-ui/src/index.ts");
const libExports = new Set();
for (const m of libIndex.matchAll(/export\s*(?:type\s*)?\{([^}]+)\}\s*from/g)) {
  for (let raw of m[1].split(",")) {
    raw = raw.trim();
    if (!raw) continue;
    raw = raw.replace(/^type\s+/, "");
    const parts = raw.split(/\s+as\s+/);
    const name = (parts[1] ?? parts[0]).trim();
    if (/^[A-Za-z_$][\w$]*$/.test(name)) libExports.add(name);
  }
}
for (const m of libIndex.matchAll(
  /export\s+(?:async\s+)?(?:const|function|class)\s+([A-Za-z_$][\w$]*)/g,
)) {
  libExports.add(m[1]);
}
if (libExports.size < 150) {
  fail(`only ${libExports.size} library exports found - parser is stale`);
}

const isTypeish = (n) =>
  /Props$/.test(n) || /^(Button|Badge|Input|Textarea|Select|Checkbox|RadioGroup|Radio|Switch|Slider|Spinner|Combobox|Pagination|Rating|Avatar|Progress|Skeleton|Modal|Drawer|Tooltip|Popover|Tabs|Accordion|Table|Card|Toast|Command|Alert|Kbd)(Variant|Size|Tone|Shape|Color|Effect|Align|Direction|Option|Glyph|Depth|Side|Field|Textarea|Badge|Avatar|Switch|Slider|Progress|Skeleton|Rating|Tag|Step)/.test(n);

/* ------------------------------------------------------------------ */
/* 2. Registry entries: slug + title                                   */
/* ------------------------------------------------------------------ */

const registryFiles = [
  "primitives",
  "overlays",
  "expanded",
  "display",
  "motion",
  "signatures",
].map((f) => `src/lib/registry/${f}.tsx`);

const slugTitle = new Map();
const entryDemos = new Map(); // slug -> [{ title, code }]
for (const file of registryFiles) {
  const sf = ts.createSourceFile(
    file,
    read(file),
    ts.ScriptTarget.Latest,
    true,
  );
  const visit = (node) => {
    if (ts.isObjectLiteralExpression(node)) {
      const props = node.properties.filter(ts.isPropertyAssignment);
      const slugP = props.find(
        (p) => ts.isIdentifier(p.name) && p.name.text === "slug",
      );
      if (slugP && ts.isStringLiteral(slugP.initializer)) {
        const slug = slugP.initializer.text;
        const titleP = props.find(
          (p) => ts.isIdentifier(p.name) && p.name.text === "title",
        );
        if (titleP && ts.isStringLiteral(titleP.initializer)) {
          slugTitle.set(slug, titleP.initializer.text);
        }
        const demosP = props.find(
          (p) => ts.isIdentifier(p.name) && p.name.text === "demos",
        );
        if (demosP && ts.isArrayLiteralExpression(demosP.initializer)) {
          const demos = [];
          for (const el of demosP.initializer.elements) {
            if (!ts.isObjectLiteralExpression(el)) continue;
            const dp = el.properties.filter(ts.isPropertyAssignment);
            const t = dp.find(
              (p) => ts.isIdentifier(p.name) && p.name.text === "title",
            );
            const c = dp.find(
              (p) => ts.isIdentifier(p.name) && p.name.text === "code",
            );
            if (
              t &&
              ts.isStringLiteral(t.initializer) &&
              c &&
              ts.isTemplateLiteral(c.initializer)
            ) {
              demos.push({
                title: t.initializer.text,
                code: c.initializer.getText().slice(1, -1),
              });
            }
          }
          if (demos.length) entryDemos.set(slug, demos);
        }
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(sf);
}
if (slugTitle.size < 55) {
  fail(`only ${slugTitle.size} registry entries found - parser is stale`);
}

const norm = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
const byNorm = new Map();
for (const n of libExports) {
  if (n.startsWith("Icon") || isTypeish(n) || n === "cn") continue;
  const k = norm(n);
  if (!byNorm.has(k)) byNorm.set(k, n);
}

const slugToExport = {};
const missing = [];
// Titles that name a family rather than one export get an explicit primary.
const EXPORT_OVERRIDES = { chat: "ChatThread" };
for (const [slug, title] of slugTitle) {
  const hit = byNorm.get(norm(title));
  if (hit) slugToExport[slug] = hit;
  else if (EXPORT_OVERRIDES[slug] && libExports.has(EXPORT_OVERRIDES[slug])) {
    slugToExport[slug] = EXPORT_OVERRIDES[slug];
  } else missing.push(`${slug} (title "${title}")`);
}
if (missing.length) fail(`no export matches: ${missing.join(", ")}`);
const dupes = Object.values(slugToExport).filter(
  (v, i, a) => a.indexOf(v) !== i,
);
if (dupes.length) fail(`two slugs map to the same export: ${dupes.join(", ")}`);
const exportToSlug = Object.fromEntries(
  Object.entries(slugToExport).map(([s, e]) => [e, s]),
);
// Companion exports documented on their parent component's page.
const COMPANIONS = {
  AvatarGroup: "avatar",
  AccordionItem: "accordion",
  AccordionTrigger: "accordion",
  AccordionContent: "accordion",
  Radio: "radio-group",
};
for (const [exp, slug] of Object.entries(COMPANIONS)) {
  if (libExports.has(exp) && slugToExport[slug]) exportToSlug[exp] = slug;
}

/* Identifier -> export name. The codebase aliases icons on import
   (IconLayers as Layers), so a bare "Layers" must resolve to IconLayers. */
const identToExport = new Map();
for (const n of libExports) {
  if (isTypeish(n) || n.startsWith("Icon")) continue;
  if (!identToExport.has(n)) identToExport.set(n, n);
}
for (const n of libExports) {
  if (!n.startsWith("Icon") || n.length <= 4) continue;
  const stripped = n.slice(4);
  if (!identToExport.has(stripped)) identToExport.set(stripped, n);
}
if (!identToExport.has("cn")) identToExport.set("cn", "cn");

/* ------------------------------------------------------------------ */
/* 3. Templates metadata from the gallery page                         */
/* ------------------------------------------------------------------ */

const pageSf = ts.createSourceFile(
  "src/app/templates/page.tsx",
  read("src/app/templates/page.tsx"),
  ts.ScriptTarget.Latest,
  true,
);

function attrValue(el, name) {
  const a = el.attributes.properties
    .filter(ts.isJsxAttribute)
    .find((x) => x.name.text === name);
  if (!a || !a.initializer) return undefined;
  const init = a.initializer;
  if (ts.isStringLiteral(init)) return init.text;
  if (
    ts.isJsxExpression(init) &&
    init.expression &&
    ts.isNumericLiteral(init.expression)
  ) {
    return Number(init.expression.text);
  }
  return undefined;
}

const templates = [];
const walkJsx = (node) => {
  const isFrame =
    (ts.isJsxElement(node) &&
      node.openingElement.tagName.getText() === "TemplateFrame") ||
    (ts.isJsxSelfClosingElement(node) &&
      node.tagName.getText() === "TemplateFrame");
  if (isFrame) {
    const el = ts.isJsxElement(node) ? node.openingElement : node;
    const child = ts.isJsxElement(node)
      ? node.children.find(ts.isJsxSelfClosingElement)
      : undefined;
    templates.push({
      id: attrValue(el, "id"),
      title: attrValue(el, "title"),
      description: attrValue(el, "description"),
      url: attrValue(el, "url"),
      defaultTheme: attrValue(el, "defaultTheme") ?? "light",
      defaultAccent: attrValue(el, "defaultAccent") ?? 0,
      component: child ? child.tagName.getText() : undefined,
    });
  }
  ts.forEachChild(node, walkJsx);
};
walkJsx(pageSf);

if (templates.length !== 25) {
  fail(`expected 25 templates on the gallery page, found ${templates.length}`);
}
for (const t of templates) {
  for (const key of ["id", "title", "description", "url", "component"]) {
    if (!t[key]) fail(`template missing ${key}: ${JSON.stringify(t)}`);
  }
}
const categoryOf = (id) =>
  id.startsWith("navbar")
    ? "navigation"
    : id.startsWith("hero")
      ? "heroes"
      : "sections";

/* ------------------------------------------------------------------ */
/* 4. Per-template source extraction                                   */
/* ------------------------------------------------------------------ */

const templateFiles = [
  "src/components/templates/navbars.tsx",
  "src/components/templates/heroes.tsx",
  "src/components/templates/sections.tsx",
];

function collectDecls(file) {
  const sf = ts.createSourceFile(file, read(file), ts.ScriptTarget.Latest, true);
  const order = [];
  const decls = new Map();
  for (const st of sf.statements) {
    if (ts.isImportDeclaration(st)) continue;
    if (ts.isFunctionDeclaration(st) && st.name) {
      order.push(st.name.text);
      decls.set(st.name.text, st.getText(sf));
    } else if (ts.isVariableStatement(st)) {
      for (const d of st.declarationList.declarations) {
        if (ts.isIdentifier(d.name)) {
          order.push(d.name.text);
          decls.set(d.name.text, st.getText(sf));
        }
      }
    }
  }
  return { order, decls };
}

function identifiersOf(text) {
  const sf = ts.createSourceFile("snippet.tsx", text, ts.ScriptTarget.Latest, true);
  const ids = new Set();
  const visit = (node) => {
    if (
      node.kind === ts.SyntaxKind.Identifier ||
      node.kind === ts.SyntaxKind.JsxIdentifier
    ) {
      ids.add(String(node.escapedText ?? node.text));
    }
    ts.forEachChild(node, visit);
  };
  visit(sf);
  return ids;
}

function closure(startName, order, decls) {
  const included = new Set([startName]);
  let grew = true;
  while (grew) {
    grew = false;
    const text = order.filter((n) => included.has(n)).map((n) => decls.get(n)).join("\n\n");
    const ids = identifiersOf(text);
    for (const name of order) {
      if (!included.has(name) && ids.has(name)) {
        included.add(name);
        grew = true;
      }
    }
  }
  return order.filter((n) => included.has(n));
}

const HOOKS = [
  "useState",
  "useEffect",
  "useRef",
  "useMemo",
  "useCallback",
  "useId",
  "useReducer",
  "useContext",
];

function buildSnippet(componentName) {
  const file = templateFiles.find((f) => collectDeclsCache.has(f) && collectDeclsCache.get(f).decls.has(componentName));
  if (!file) fail(`template component ${componentName} not found`);
  const { order, decls } = collectDeclsCache.get(file);
  const chain = closure(componentName, order, decls);
  const body = chain.map((n) => decls.get(n)).join("\n\n");
  const ids = identifiersOf(body);

  const used = [...identToExport.entries()]
    .filter(([ident]) => ids.has(ident))
    .map(([, n]) => n)
    .sort();
  const hooks = HOOKS.filter((h) => ids.has(h));
  const usesLink = /<Link\b/.test(body);
  const fmNames = ["AnimatePresence", "motion"].filter((n) => ids.has(n)).sort();

  const lines = [];
  if (hooks.length) lines.push('"use client";', "");
  if (hooks.length) lines.push(`import { ${hooks.join(", ")} } from "react";`);
  if (usesLink) lines.push(`import Link from "next/link";`);
  if (fmNames.length) lines.push(`import { ${fmNames.join(", ")} } from "framer-motion";`);
  if (used.length) lines.push(`import { ${used.join(", ")} } from "pollen-ui";`);

  const code = [...lines, "", body.trimEnd()].join("\n") + "\n";
  if (!used.length) fail(`${componentName}: no pollen-ui imports detected`);
  if (/<Link\b/.test(body) && !usesLink) fail(`${componentName}: Link used but not detected`);

  // Syntax gate: the snippet must parse as TSX.
  try {
    transform(code, { transforms: ["typescript", "jsx"] });
  } catch (err) {
    fail(`${componentName}: snippet does not parse - ${err.message}`);
  }

  const usedComponents = used.filter((n) => !n.startsWith("Icon") && n !== "cn");
  const deps = [];
  if (usesLink) deps.push("next/link");
  if (fmNames.length) deps.push("framer-motion");

  return { code, used, usedComponents, deps, hooks: hooks.length > 0 };
}

const collectDeclsCache = new Map();
for (const f of templateFiles) collectDeclsCache.set(f, collectDecls(f));

const templateCode = {};
const templateUsed = {};
const templateDeps = {};
const templateHasState = {};
for (const t of templates) {
  const snap = buildSnippet(t.component);
  if (snap.code.length < 200) fail(`${t.id}: snippet suspiciously short`);
  templateCode[t.id] = snap.code;
  templateUsed[t.id] = snap.usedComponents;
  templateDeps[t.id] = snap.deps;
  templateHasState[t.id] = snap.hooks;
  const unknown = snap.usedComponents.filter((n) => !exportToSlug[n]);
  if (unknown.length) {
    console.warn(
      `warn: ${t.id} uses components without a docs page: ${unknown.join(", ")}`,
    );
  }
}

/* ------------------------------------------------------------------ */
/* 4b. Build-time TypeScript -> JavaScript variants                    */
/* ------------------------------------------------------------------ */
/* Sucrase cannot strip types while keeping JSX, and TypeScript's      */
/* transpileModule merges adjacent top-level JSX elements into one     */
/* comma expression (grammar recovery). Both are handled here: JSX is  */
/* preserved via JsxEmit.Preserve, and merged statements are split by  */
/* splicing an empty statement between the leaf elements before        */
/* re-transpiling. Everything is precomputed so the docs client never  */
/* ships a transpiler.                                                 */

const TRANSPILE_OPTIONS = {
  compilerOptions: {
    jsx: ts.JsxEmit.Preserve,
    target: ts.ScriptTarget.ESNext,
    module: ts.ModuleKind.ESNext,
  },
  fileName: "snippet.tsx",
};

function spliceMergedJsx(code, sf) {
  const ranges = [];
  for (const st of sf.statements) {
    if (
      ts.isExpressionStatement(st) &&
      ts.isBinaryExpression(st.expression) &&
      st.expression.operatorToken.kind === ts.SyntaxKind.CommaToken
    ) {
      const leaves = [];
      const walk = (n) => {
        // TS recovers from adjacent top-level JSX by building an operator
        // chain (comma or less-than) whose leaves are the elements; any
        // nested JSX stays inside its leaf's range.
        if (ts.isBinaryExpression(n)) {
          walk(n.left);
          walk(n.right);
        } else {
          leaves.push(n);
        }
      };
      walk(st.expression);
      const jsxLeaf = (n) =>
        ts.isJsxElement(n) || ts.isJsxSelfClosingElement(n) || ts.isJsxFragment(n);
      if (leaves.length > 1 && leaves.every(jsxLeaf)) {
        ranges.push({
          start: st.getStart(sf),
          end: st.getEnd(),
          leaves: leaves.map((l) => ({ start: l.getStart(sf), end: l.getEnd() })),
        });
      }
    }
  }
  let out = "";
  let pos = 0;
  for (const r of ranges) {
    out +=
      code.slice(pos, r.start) +
      r.leaves.map((l) => code.slice(l.start, l.end)).join("\n;\n") +
      "\n;\n";
    pos = r.end;
  }
  return out + code.slice(pos);
}

function toJsSnippet(code) {
  const sf = ts.createSourceFile("snippet.tsx", code, ts.ScriptTarget.Latest, true);
  let src = code;
  const merged = (sf.parseDiagnostics ?? []).some((d) =>
    ts.flattenDiagnosticMessageText(d.messageText, " ").includes(
      "one parent element",
    ),
  );
  if (merged) {
    src = spliceMergedJsx(code, sf);
    const sf2 = ts.createSourceFile("snippet2.tsx", src, ts.ScriptTarget.Latest, true);
    const still = (sf2.parseDiagnostics ?? []).some((d) =>
      ts.flattenDiagnosticMessageText(d.messageText, " ").includes(
        "one parent element",
      ),
    );
    if (still) fail(`snippet could not be split for JS variant: ${code.slice(0, 60)}...`);
  }
  let out = ts.transpileModule(src, TRANSPILE_OPTIONS).outputText.trim();
  // transpileModule prefixes snippets that begin with bare JSX with a
  // "use strict" prologue - correct for a module, but noise in a copy
  // pane. The web library is ESM either way.
  out = out.replace(/^"use strict";\s*/, "");
  // The splice marks separations with lone ";" lines; drop them.
  out = out
    .split("\n")
    .filter((line) => line.trim() !== ";")
    .join("\n");
  if (out.includes("createElement(")) {
    fail(`JS variant was JSX-transformed, not preserved: ${code.slice(0, 60)}...`);
  }
  if (out.replace(/\s/g, "").length < 10) {
    fail(`JS variant is empty: ${code.slice(0, 60)}...`);
  }
  return out + "\n";
}

const demoJs = {};
for (const [slug, demos] of entryDemos) {
  for (const d of demos) {
    demoJs[`${slug}::${d.title}`] = toJsSnippet(d.code);
  }
}
const templateCodeJs = {};
for (const t of templates) {
  templateCodeJs[t.id] = toJsSnippet(templateCode[t.id]);
}

/* ------------------------------------------------------------------ */
/* 5. Hand-written native snippets must only use real native exports   */
/* ------------------------------------------------------------------ */
const nativeIndex = read("packages/native/src/index.ts");
const nativeExports = new Set();
for (const m of nativeIndex.matchAll(/export\s*(?:type\s*)?\{([^}]+)\}\s*from/g)) {
  for (let raw of m[1].split(",")) {
    raw = raw.trim();
    if (!raw) continue;
    raw = raw.replace(/^type\s+/, "");
    const parts = raw.split(/\s+as\s+/);
    const name = (parts[1] ?? parts[0]).trim();
    if (/^[A-Za-z_$][\w$]*$/.test(name)) nativeExports.add(name);
  }
}
const nativeUsageSrc = read("src/lib/native-usage.ts");
for (const m of nativeUsageSrc.matchAll(/import\s*\{([^}]+)\}\s*from\s*"@pollen\/native"/g)) {
  for (let raw of m[1].split(",")) {
    raw = raw.trim().replace(/^type\s+/, "");
    const parts = raw.split(/\s+as\s+/);
    const name = (parts[1] ?? parts[0]).trim();
    if (name && !nativeExports.has(name)) {
      fail(`native-usage.ts imports "${name}" which @pollen/native does not export`);
    }
  }
}

/* ------------------------------------------------------------------ */
/* 6. Emit                                                             */
/* ------------------------------------------------------------------ */

const J = JSON.stringify;
const out = `// Generated by scripts/generate-docs-data.mjs - do not edit by hand.
// Run \`npm run generate\` after changing the templates, the gallery page or
// the registry; \`npm run build\` regenerates this file automatically.

export interface TemplateInfo {
  id: string;
  title: string;
  description: string;
  url: string;
  category: "navigation" | "heroes" | "sections";
  component: string;
  defaultTheme: "light" | "dark";
  defaultAccent: number;
}

export const templates: TemplateInfo[] = ${J(
  templates.map((t) => ({
    ...t,
    category: categoryOf(t.id),
  })),
)};

export const templateCode: Record<string, string> = ${J(templateCode)};

/** Non-icon library components each template is composed of. */
export const templateUsed: Record<string, string[]> = ${J(templateUsed)};

/** Extra npm packages (beyond pollen-ui) each template needs. */
export const templateDeps: Record<string, string[]> = ${J(templateDeps)};

/** Whether the template uses React state (needs "use client"). */
export const templateHasState: Record<string, boolean> = ${J(templateHasState)};

/** Registry slug + demo title -> precomputed JavaScript variant. */
export const demoJs: Record<string, string> = ${J(demoJs)};

/** Template id -> precomputed JavaScript variant. */
export const templateCodeJs: Record<string, string> = ${J(templateCodeJs)};

/** Registry slug -> library export name, validated against the index. */
export const slugToExport: Record<string, string> = ${J(slugToExport)};

export const exportToSlug: Record<string, string> = ${J(exportToSlug)};
`;

fs.writeFileSync(OUT, out);
console.log(
  `generate-docs-data: ${Object.keys(slugToExport).length} slugs, ${templates.length} templates, wrote ${path.relative(ROOT, OUT)}`,
);
for (const t of templates) {
  console.log(
    `  ${t.id.padEnd(22)} ${String(templateCode[t.id].length).padStart(6)} bytes  deps: ${templateDeps[t.id].join(", ") || "-"}`,
  );
}
