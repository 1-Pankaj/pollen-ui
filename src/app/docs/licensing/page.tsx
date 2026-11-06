import type { Metadata } from "next";
import { Reveal, Table } from "pollen-ui";
import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "pollen-ui";

export const metadata: Metadata = {
  title: "Licensing",
  description:
    "Pollen UI is MIT licensed. Here is the full license stack of everything it ships and depends on, so you can clear it for your project.",
};

const deps: { name: string; license: string; role: string }[] = [
  { name: "pollen-ui", license: "MIT", role: "The library itself" },
  { name: "framer-motion", license: "MIT", role: "Library dependency — all motion" },
  { name: "clsx", license: "MIT", role: "Library dependency — class composition" },
  { name: "tailwind-merge", license: "MIT", role: "Library dependency — class merging" },
  { name: "class-variance-authority", license: "Apache-2.0", role: "Library dependency — variant typing" },
  { name: "react / react-dom", license: "MIT", role: "Peer dependency" },
  { name: "Geist (Sans + Mono)", license: "SIL OFL 1.1", role: "Designed-on typeface" },
  { name: "Instrument Serif", license: "SIL OFL 1.1", role: "Display accent typeface" },
  { name: "Next.js", license: "MIT", role: "Docs site framework" },
  { name: "Tailwind CSS 4", license: "MIT", role: "Styling engine" },
  { name: "CodeMirror 6", license: "MIT", role: "Docs site — playground editor" },
  { name: "Sucrase", license: "MIT", role: "Docs site — in-browser compilation" },
  { name: "next-themes", license: "MIT", role: "Docs site — theme switching" },
  { name: "React Native", license: "MIT", role: "@pollen/native runtime" },
  { name: "Reanimated", license: "MIT", role: "@pollen/native motion" },
  { name: "NativeWind", license: "MIT", role: "@pollen/native styling" },
];

export default function LicensingPage() {
  return (
    <article className="max-w-2xl">
      <h1 className="text-4xl font-semibold tracking-tight">Licensing</h1>
      <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
        Pollen UI is released under the{" "}
        <a
          className="text-foreground underline decoration-faint underline-offset-4 hover:decoration-foreground"
          href="https://github.com/1-Pankaj/pollen-ui/blob/main/LICENSE"
          target="_blank"
          rel="noreferrer"
        >
          MIT license
        </a>
        . Use it in commercial products, client work, open source — anywhere.
        Keep the copyright notice in the license file; that is the whole
        obligation.
      </p>

      <Reveal className="mt-12">
        <h2 className="text-2xl font-semibold tracking-tight">
          The dependency stack
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Everything below ships as a separate npm dependency — nothing is
          vendored into the source. Both licenses in the table are permissive
          and both are fine inside an MIT project.
        </p>
        <div className="mt-4 overflow-hidden rounded-2xl bg-card shadow-[var(--pollen-shadow-md)]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Package</TableHead>
                <TableHead>License</TableHead>
                <TableHead>Role</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {deps.map((dep) => (
                <TableRow key={dep.name}>
                  <TableCell className="whitespace-nowrap font-mono text-xs text-foreground">
                    {dep.name}
                  </TableCell>
                  <TableCell className="whitespace-nowrap font-mono text-xs text-muted-foreground">
                    {dep.license}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {dep.role}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Reveal>

      <Reveal className="mt-12">
        <h2 className="text-2xl font-semibold tracking-tight">
          About the fonts
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Geist and Instrument Serif are licensed under the SIL Open Font
          License 1.1. OFL fonts can be bundled, embedded and redistributed
          with software freely — including commercial software — as long as
          they are not sold as fonts and derivative versions do not use the
          reserved names. Loading them from Google Fonts or the{" "}
          <code className="rounded bg-fill px-1.5 py-0.5 font-mono text-xs">geist</code>{" "}
          npm package, as the setup guide shows, keeps you firmly inside the
          license.
        </p>
      </Reveal>

      <Reveal className="mt-12">
        <h2 className="text-2xl font-semibold tracking-tight">
          Why there is no GSAP here
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          GSAP is excellent, but its standard license is not an
          OSI-approved open source license, which complicates redistribution
          inside an MIT package. Every animation in Pollen UI is therefore
          built on CSS transitions and keyframes plus framer-motion — both
          MIT — and the signature motion (springs, magnetic pulls, drag
          physics) is implemented directly on those primitives.
        </p>
      </Reveal>

      <Reveal className="mt-12">
        <h2 className="text-2xl font-semibold tracking-tight">
          What this means for your project
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          You can ship apps built with Pollen UI under any license — MIT,
          Apache-2.0, proprietary — because library dependencies are used,
          not copied. If you fork the library itself, the MIT license
          applies to that code and the notice must stay. The docs site,
          templates and screenshots in this repository are under the same
          MIT unless a file states otherwise.
        </p>
      </Reveal>
    </article>
  );
}
