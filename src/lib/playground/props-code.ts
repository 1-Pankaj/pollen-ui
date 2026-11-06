import type { PlaygroundSpec } from "../registry/types";

/**
 * Turns the playground's prop values into a snippet a user can paste.
 * Booleans render bare when true and disappear when false (or use the
 * control's `attr` for richer JSX), numbers use curly braces, and a
 * control named children becomes the content. The result is a full
 * module with a default export, so it compiles in the sandbox and
 * pastes cleanly into a real project.
 */
export function generatePlaygroundCode(
  spec: PlaygroundSpec,
  values: Record<string, string | boolean | number>,
): string {
  const attrs: string[] = [];
  let children = "";

  for (const control of spec.controls) {
    const value = values[control.prop];

    if (control.prop === "children") {
      if (typeof value === "string" && value.length > 0) children = value;
      continue;
    }
    if (value === false || value === "" || value === undefined) continue;
    if (value === true) {
      if (control.kind === "boolean" && control.attr) {
        attrs.push(control.attr);
      } else {
        attrs.push(control.prop);
      }
    } else if (typeof value === "number") {
      attrs.push(`${control.prop}={${value}}`);
    } else {
      attrs.push(`${control.prop}="${value}"`);
    }
  }

  if (spec.attrs) attrs.push(spec.attrs);

  const attrText = attrs.length > 0 ? ` ${attrs.join(" ")}` : "";
  if (children) {
    return `<${spec.component}${attrText}>${children}</${spec.component}>`;
  }
  return `<${spec.component}${attrText} />`;
}

export function playgroundSnippet(
  spec: PlaygroundSpec,
  values: Record<string, string | boolean | number>,
): string {
  const names = [spec.component, ...(spec.imports ?? [])];
  const lines: string[] = [];
  lines.push(`import { ${names.join(", ")} } from "pollen-ui";`);
  lines.push("");
  if (spec.prelude) {
    lines.push(...spec.prelude.split("\n"));
    lines.push("");
  }
  lines.push("export default function Demo() {");
  lines.push("  return (");
  for (const line of generatePlaygroundCode(spec, values).split("\n")) {
    lines.push(`    ${line}`);
  }
  lines.push("  );");
  lines.push("}");
  return lines.join("\n");
}
