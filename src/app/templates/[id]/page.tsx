import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import {
  IconArrowLeft as ArrowLeft,
  IconArrowRight as ArrowRight,
} from "pollen-ui";
import { TemplateFrame } from "@/components/site/template-frame";
import { FrameworkCodeCard } from "@/components/site/framework";
import { AiPrompt } from "@/components/site/ai-prompt";
import { buildTemplatePrompt } from "@/lib/ai-prompt";
import { jsVariantOfTemplate } from "@/lib/to-js";
import {
  templates,
  templateCode,
  templateUsed,
  templateDeps,
  templateHasState,
  exportToSlug,
} from "@/lib/docs-data.generated";
import { registry } from "@/lib/registry";
import {
  NavbarBottom,
  NavbarCommand,
  NavbarDock,
  NavbarMega,
  NavbarPill,
  NavbarRail,
  NavbarSidebar,
  NavbarTop,
} from "@/components/templates/navbars";
import {
  HeroAppShot,
  HeroCentered,
  HeroMetrics,
  HeroSplit,
  HeroStatement,
  HeroWaitlist,
} from "@/components/templates/heroes";
import {
  AuthCard,
  ChangelogTimeline,
  CtaBanner,
  FAQSection,
  FeatureGrid,
  FooterTemplate,
  LogoMarquee,
  NewsletterBand,
  PricingSection,
  StatsBand,
  Testimonials,
} from "@/components/templates/sections";

const live: Record<string, ReactNode> = {
  NavbarTop: <NavbarTop />,
  NavbarSidebar: <NavbarSidebar />,
  NavbarCommand: <NavbarCommand />,
  NavbarPill: <NavbarPill />,
  NavbarDock: <NavbarDock />,
  NavbarBottom: <NavbarBottom />,
  NavbarRail: <NavbarRail />,
  NavbarMega: <NavbarMega />,
  HeroCentered: <HeroCentered />,
  HeroSplit: <HeroSplit />,
  HeroStatement: <HeroStatement />,
  HeroWaitlist: <HeroWaitlist />,
  HeroMetrics: <HeroMetrics />,
  HeroAppShot: <HeroAppShot />,
  PricingSection: <PricingSection />,
  LogoMarquee: <LogoMarquee />,
  Testimonials: <Testimonials />,
  AuthCard: <AuthCard />,
  StatsBand: <StatsBand />,
  FeatureGrid: <FeatureGrid />,
  FAQSection: <FAQSection />,
  NewsletterBand: <NewsletterBand />,
  ChangelogTimeline: <ChangelogTimeline />,
  CtaBanner: <CtaBanner />,
  FooterTemplate: <FooterTemplate />,
};

const DEP_NOTES: Record<string, string> = {
  "next/link":
    "Link comes from next/link. Outside Next.js, swap it for your router's link component.",
  "framer-motion":
    "The spring animations run on framer-motion; keep it installed.",
};

export function generateStaticParams() {
  return templates.map((t) => ({ id: t.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const t = templates.find((x) => x.id === id);
  if (!t) return {};
  return {
    title: `${t.title} template`,
    description: t.description,
  };
}

export default async function TemplatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const t = templates.find((x) => x.id === id);
  if (!t) notFound();

  const index = templates.indexOf(t);
  const prev = templates[index - 1];
  const next = templates[index + 1];

  const code = templateCode[t.id];
  const used = templateUsed[t.id];
  const deps = templateDeps[t.id];
  // Avatar + AvatarGroup both document on the avatar page - dedupe chips.
  const usedSlugs = [...new Set(used.map((n) => exportToSlug[n]))].filter(
    (s) => s !== undefined,
  );
  const prompt = buildTemplatePrompt({
    title: t.title,
    description: t.description,
    code,
    used: [...new Set(used)],
    deps,
    hasState: templateHasState[t.id],
  });

  return (
    <div className="mx-auto max-w-[1000px] px-6 pb-28">
      <section className="pt-14 sm:pt-16">
        <Link
          href="/templates"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          All templates
        </Link>
        <p className="mt-8 text-sm font-semibold capitalize text-accent">
          {t.category}
        </p>
        <h1 className="mt-3 text-balance text-4xl font-semibold leading-tight tracking-[-0.03em] sm:text-5xl">
          {t.title}
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          {t.description}
        </p>
      </section>

      <section className="mt-10">
        <TemplateFrame
          title={t.title}
          description={t.description}
          url={t.url}
          defaultTheme={t.defaultTheme}
          defaultAccent={t.defaultAccent}
        >
          {live[t.component]}
        </TemplateFrame>
      </section>

      <section className="mt-14 grid gap-10 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div>
          <FrameworkCodeCard
            code={code}
            jsCode={jsVariantOfTemplate(t.id)}
            filename={`${t.id}.tsx`}
            label="Complete source"
          />
        </div>
        <aside>
          <h2 className="text-sm font-semibold uppercase tracking-[0.08em] text-faint">
            Components used
          </h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {usedSlugs.map((slug) => (
              <li key={slug}>
                <Link
                  href={`/docs/${slug}`}
                  className="inline-flex rounded-full bg-card px-3 py-1.5 text-[13px] font-medium text-muted-foreground shadow-[var(--pollen-shadow-xs)] transition-colors duration-150 hover:text-foreground"
                >
                  {registry[slug].title}
                </Link>
              </li>
            ))}
          </ul>
          {deps.length > 0 && (
            <>
              <h2 className="mt-8 text-sm font-semibold uppercase tracking-[0.08em] text-faint">
                Also requires
              </h2>
              <ul className="mt-3 space-y-2">
                {deps.map((dep) => (
                  <li
                    key={dep}
                    className="rounded-2xl bg-fill/50 px-4 py-3 text-[13px] leading-relaxed text-muted-foreground"
                  >
                    <code className="font-mono text-[12.5px] text-foreground">
                      {dep}
                    </code>
                    {" - "}
                    {DEP_NOTES[dep] ?? "install alongside pollen-ui."}
                  </li>
                ))}
              </ul>
            </>
          )}
        </aside>
      </section>

      <section className="mt-12 border-t border-fill pt-10">
        <AiPrompt
          prompt={prompt}
          intro="A ready-to-paste brief for any coding agent. It carries the full source, the components the template uses and the conventions to keep, so the agent recreates it faithfully instead of improvising."
          filename={`${t.id}-prompt.txt`}
        />
      </section>

      <nav
        aria-label="Template pagination"
        className="mt-14 flex items-center justify-between border-t border-fill pt-8"
      >
        {prev ? (
          <Link
            href={`/templates/${prev.id}`}
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
            href={`/templates/${next.id}`}
            className="group flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            {next.title}
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </div>
  );
}
