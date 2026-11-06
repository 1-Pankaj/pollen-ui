import { slugToExport } from "@/lib/docs-data.generated";
import type { RegistryEntry } from "@/lib/registry/types";

const REPO = "https://github.com/1-Pankaj/pollen-ui";
const HEADER = [
  "Pollen UI is a React 19 + Tailwind CSS 4 component library by Pankaj Israni.",
  `Source and docs: ${REPO}`,
  "Install: npm install pollen-ui",
].join("\n");

/**
 * A ready-to-paste brief for a coding agent, built from the same
 * registry data the docs page renders - import name, props, keyboard
 * behaviour and one exact example. Nothing here is invented.
 */
export function buildComponentPrompt(entry: RegistryEntry): string {
  const name = slugToExport[entry.slug] ?? entry.title;
  const lines: string[] = [];
  lines.push(`Add the ${name} component from Pollen UI to my app.`);
  lines.push("");
  lines.push(HEADER);
  lines.push("");
  lines.push("Import:");
  lines.push(`import { ${name} } from "pollen-ui";`);
  lines.push("");
  lines.push(`What it is: ${entry.description}`);
  if (entry.props?.length) {
    lines.push("");
    lines.push("Props:");
    for (const p of entry.props) {
      const def = p.default ? ` (default ${p.default})` : "";
      lines.push(`- ${p.name}: ${p.type}${def} - ${p.description}`);
    }
  }
  if (entry.keyboard?.length) {
    lines.push("");
    lines.push("Keyboard:");
    for (const k of entry.keyboard) lines.push(`- ${k.keys} - ${k.action}`);
  }
  const demo = entry.demos[0];
  if (demo) {
    lines.push("");
    lines.push("Example:");
    lines.push(demo.code.trimEnd());
  }
  lines.push("");
  lines.push("Rules:");
  lines.push(
    `- Use ${name} as published. Do not re-implement or restyle it from scratch.`,
  );
  lines.push("- Only use the props documented above; do not invent props.");
  lines.push(
    "- Theme with the library's light/dark classes and --pollen-* CSS variables, not one-off overrides.",
  );
  return lines.join("\n");
}

/**
 * Same idea for a template: what it is, which components compose it,
 * the complete source, and the conventions to keep.
 */
export function buildTemplatePrompt(input: {
  title: string;
  description: string;
  code: string;
  used: string[];
  deps: string[];
  hasState: boolean;
}): string {
  const { title, description, code, used, deps, hasState } = input;
  const lines: string[] = [];
  lines.push(`Recreate the "${title}" template from Pollen UI in my project.`);
  lines.push("");
  lines.push(HEADER);
  if (deps.length > 0) {
    lines.push(`Then also: npm install ${deps.join(" ")}`);
  }
  lines.push("");
  lines.push(`What it is: ${description}`);
  if (used.length > 0) {
    lines.push(
      `Composed of these Pollen UI components: ${used.join(", ")}. Each one is documented in the repository docs.`,
    );
  }
  lines.push("");
  lines.push("Full source:");
  lines.push(code.trimEnd());
  lines.push("");
  lines.push("Notes:");
  lines.push(
    hasState
      ? '- The file uses React state; keep the "use client" directive at the top in Next.js.'
      : "- The file has no state, so it works in server components as-is.",
  );
  if (deps.includes("next/link")) {
    lines.push(
      "- It imports Link from next/link. Outside Next.js, swap it for your router's link component.",
    );
  }
  if (deps.includes("framer-motion")) {
    lines.push(
      "- Animations use framer-motion springs; keep the dependency installed.",
    );
  }
  lines.push(
    "- Theme, accent colour and corner radius are CSS variables (--pollen-accent, --radius-*). Restyle by setting variables, not by editing the markup.",
  );
  lines.push(
    "- Compose from the Pollen UI components as published; do not replace them with custom recreations.",
  );
  return lines.join("\n");
}
