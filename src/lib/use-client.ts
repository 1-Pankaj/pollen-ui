/**
 * Next.js App Router needs "use client" on any module that renders
 * interactive components. The React variant of a snippet is the plain
 * code; the Next.js variant is the same code with the directive added.
 *
 * Lives in a plain (non-client) module so server components can call
 * it while building the docs pages.
 */
export function withUseClient(code: string): string {
  if (/^\s*['"]use client['"]/.test(code)) return code;
  return `"use client";\n\n${code}`;
}
