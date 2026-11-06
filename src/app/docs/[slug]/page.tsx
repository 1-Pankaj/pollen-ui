import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  IconArrowLeft as ArrowLeft,
  IconArrowRight as ArrowRight,
} from "pollen-ui";
import { Reveal, Kbd, CodeBlock } from "pollen-ui";
import { DemoBlock } from "@/components/site/demo-block";
import {
  FrameworkProvider,
  FrameworkSwitch,
  NativeBanner,
} from "@/components/site/framework";
import { withUseClient } from "@/lib/use-client";
import { AiPrompt } from "@/components/site/ai-prompt";
import { buildComponentPrompt } from "@/lib/ai-prompt";
import { nativeUsage } from "@/lib/native-usage";
import { jsVariantOfDemo } from "@/lib/to-js";
import { ComponentPlayground } from "@/components/site/playground/component-playground";
import { toPlaygroundSource } from "@/lib/playground/normalize";
import { allEntries, registry } from "@/lib/registry";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "pollen-ui";

export function generateStaticParams() {
  return allEntries.map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const entry = registry[slug];
  if (!entry) return {};
  return { title: entry.title, description: entry.description };
}

export default async function ComponentPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = registry[slug];
  if (!entry) notFound();

  const index = allEntries.findIndex((e) => e.slug === slug);
  const prev = allEntries[index - 1];
  const next = allEntries[index + 1];
  const prompt = buildComponentPrompt(entry);
  const native = nativeUsage[slug];
  const demoZero = entry.demos[0];
  const reactTs = demoZero ? toPlaygroundSource(demoZero.code) : "";
  const reactJs = demoZero ? (jsVariantOfDemo(entry.slug, demoZero.title) ?? undefined) : undefined;
  const variants = {
    react: { tsx: reactTs, js: reactJs ? toPlaygroundSource(reactJs) : undefined },
    next: {
      tsx: withUseClient(reactTs),
      js: reactJs ? withUseClient(toPlaygroundSource(reactJs)) : undefined,
    },
  };

  return (
    <FrameworkProvider>
    <article className="max-w-2xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-4xl font-semibold tracking-tight">{entry.title}</h1>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            {entry.description}
          </p>
        </div>
        {entry.demos.length > 0 && (
          <a
            href="#playground"
            className="mt-2 inline-flex shrink-0 items-center gap-1.5 rounded-[10px] bg-fill px-3.5 py-2 text-[13px] font-medium text-foreground transition-colors hover:bg-fill-strong"
          >
            Playground
          </a>
        )}
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-2.5">
        {entry.demos.length > 0 && <FrameworkSwitch />}
        <AiPrompt
          prompt={prompt}
          intro="A ready-to-paste brief for Cursor, Copilot, Claude or any coding agent. It describes exactly what is published - import, props, keyboard behaviour, one example - so the agent uses the component instead of improvising one."
        />
        <NativeBanner />
      </div>

      {entry.demos.map((demo) => (
        <DemoBlock
          key={demo.title}
          title={demo.title}
          code={demo.code}
          jsCode={jsVariantOfDemo(entry.slug, demo.title)}
          nativeCode={native?.code ?? null}
          componentTitle={entry.title}
          align={demo.align}
        >
          {demo.component}
        </DemoBlock>
      ))}

      {entry.demos.length > 0 && (
        <ComponentPlayground
          slug={entry.slug}
          variants={variants}
          spec={entry.playground}
          nativeCode={native?.code ?? null}
          componentTitle={entry.title}
        />
      )}

      {native && (
        <Reveal className="mt-12 scroll-mt-24">
          <h2 id="react-native" className="scroll-mt-24 text-2xl font-semibold tracking-tight">React Native</h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            The same design language on iOS and Android. @pollen-ui/native ships
            this component with the shared tokens - colors, shadows, spacing
            and springs - from @pollen-ui/tokens. Requires react-native &gt;= 0.74
            and react-native-reanimated &gt;= 3.16; under Expo, NativeWind 4
            handles the className passthrough.
          </p>
          <div className="mt-4">
            <CodeBlock code={native.code} filename="App.tsx" language="tsx" />
          </div>
        </Reveal>
      )}

      {entry.keyboard && entry.keyboard.length > 0 && (
        <Reveal className="mt-12">
          <h2 className="text-2xl font-semibold tracking-tight">Keyboard</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Every interaction below is implemented and keyboard-testable.
          </p>
          <div className="mt-4 overflow-hidden rounded-2xl bg-card shadow-[var(--pollen-shadow-md)]">
            <Table>
              <TableBody>
                {entry.keyboard.map((row) => (
                  <TableRow key={row.keys}>
                    <TableCell className="w-[180px] whitespace-nowrap align-top">
                      <span className="flex flex-wrap gap-1">
                        {row.keys.split(" + ").map((key) => (
                          <Kbd key={key}>{key}</Kbd>
                        ))}
                      </span>
                    </TableCell>
                    <TableCell className="align-top text-sm text-muted-foreground">
                      {row.action}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Reveal>
      )}

      {entry.props && entry.props.length > 0 && (
        <Reveal className="mt-12">
          <h2 className="text-2xl font-semibold tracking-tight">Props</h2>
          <div className="mt-4 overflow-hidden rounded-2xl bg-card shadow-[var(--pollen-shadow-md)]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Prop</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Default</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {entry.props.map((prop, i) => (
                  <TableRow key={`${prop.name}-${i}`}>
                    <TableCell className="whitespace-nowrap align-top">
                      <code className="rounded bg-fill px-1.5 py-0.5 font-mono text-[13px] text-foreground">
                        {prop.name}
                      </code>
                      <p className="mt-1.5 max-w-[220px] text-xs leading-relaxed text-muted-foreground">
                        {prop.description}
                      </p>
                    </TableCell>
                    <TableCell className="align-top font-mono text-xs text-muted-foreground">
                      {prop.type}
                    </TableCell>
                    <TableCell className="whitespace-nowrap align-top font-mono text-xs text-muted-foreground">
                      {prop.default ?? "unset"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Reveal>
      )}

      <Reveal className="mt-14">
        <nav
          aria-label="Pagination"
          className="flex items-center justify-between pt-2"
        >
          {prev ? (
            <Link
              href={`/docs/${prev.slug}`}
              className="group flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
              {prev.title}
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link
              href={`/docs/${next.slug}`}
              className="group flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {next.title}
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          ) : (
            <span />
          )}
        </nav>
      </Reveal>
    </article>
    </FrameworkProvider>
  );
}
