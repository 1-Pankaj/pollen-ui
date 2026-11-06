import type { Metadata } from "next";
import Link from "next/link";
import { TemplateFrame } from "@/components/site/template-frame";
import { IconArrowRight } from "pollen-ui";
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

export const metadata: Metadata = {
  title: "Templates",
  description:
    "Twenty-five production-ready heroes, navbars and page sections composed entirely from Pollen UI components - each with live theme, accent and radius controls.",
};

const categories = [
  { id: "navigation", label: "Navigation", count: 8 },
  { id: "heroes", label: "Heroes", count: 6 },
  { id: "sections", label: "Sections", count: 11 },
];

function CategoryHeading({
  id,
  eyebrow,
  title,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div id={id} className="scroll-mt-28">
      <p className="text-sm font-semibold text-accent">{eyebrow}</p>
      <h2 className="mt-3 text-balance text-3xl font-semibold leading-tight tracking-[-0.02em] sm:text-4xl">
        {title}
      </h2>
      <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">
        {children}
      </p>
    </div>
  );
}

export default function TemplatesPage() {
  return (
    <div className="mx-auto max-w-[1200px] px-6 pb-28">
      {/* Page intro */}
      <section className="pb-14 pt-16 sm:pt-20">
        <p className="text-sm font-semibold text-accent">Templates</p>
        <h1 className="mt-4 max-w-3xl text-balance text-5xl font-semibold leading-[1.04] tracking-[-0.035em] sm:text-6xl">
          Whole pages, prebuilt from the library
        </h1>
        <p className="mt-6 max-w-2xl text-balance text-lg leading-relaxed text-muted-foreground sm:text-xl">
          Twenty-five heroes, navbars and the sections that fill a
          real product site. Every template is composed from live
          Pollen UI components, and every preview carries its own
          studio: flip the theme, retint the accent, change the
          corner language, and judge it in place. Each one links to
          its own page with the complete, copyable source.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-2.5">
          <Link
            href="/templates/docs"
            className="inline-flex items-center gap-1.5 rounded-[10px] bg-foreground px-4 py-2 text-[13px] font-medium text-background transition-opacity hover:opacity-90"
          >
            Read the guide
            <IconArrowRight className="h-3.5 w-3.5" />
          </Link>
          <a
            href="#navigation"
            className="rounded-[10px] bg-fill px-4 py-2 text-[13px] font-medium text-foreground transition-colors hover:bg-fill-strong"
          >
            Browse templates
          </a>
        </div>
        <nav aria-label="Template categories" className="mt-6 flex flex-wrap gap-2">
          {categories.map((category) => (
            <a
              key={category.id}
              href={`#${category.id}`}
              className="rounded-full bg-card px-4 py-2 text-sm font-medium text-muted-foreground shadow-[var(--pollen-shadow-xs)] transition-colors duration-150 hover:text-foreground"
            >
              {category.label}
              <span className="ml-1.5 text-faint">{category.count}</span>
            </a>
          ))}
        </nav>
      </section>

      {/* Navigation */}
      <section className="space-y-10">
        <CategoryHeading
          id="navigation"
          eyebrow="Navigation"
          title="Eight ways to move around"
        >
          The same shell, eight personalities: the classic top bar, a
          command-first header, a floating pill, a desktop dock, a
          mobile tab bar, an icon rail, a centered mega menu, and the
          full sidebar dashboard.
        </CategoryHeading>

        <div className="grid gap-8 lg:grid-cols-2">
          <TemplateFrame
            id="navbar-top"
            sourceHref={`/templates/navbar-top`}
            title="Top bar"
            description="Logo, links, search and account. The default for marketing sites and apps alike."
            url="nimbus.app"
          >
            <NavbarTop />
          </TemplateFrame>

          <TemplateFrame
            id="navbar-sidebar"
            sourceHref={`/templates/navbar-sidebar`}
            title="Sidebar dashboard"
            description="Grouped sections, counts and a pinned account card. The workspace workhorse."
            url="app.atlas.dev"
            defaultTheme="dark"
          >
            <NavbarSidebar />
          </TemplateFrame>

          <TemplateFrame
            id="navbar-command"
            sourceHref={`/templates/navbar-command`}
            title="Command header"
            description="Search leads. The palette is the primary affordance, for tools your users live in."
            url="relay.dev"
            defaultTheme="dark"
            defaultAccent={1}
          >
            <NavbarCommand />
          </TemplateFrame>

          <TemplateFrame
            id="navbar-pill"
            sourceHref={`/templates/navbar-pill`}
            title="Floating pill"
            description="A detached, blurred pill that floats over the content. Confident and weightless."
            url="studio.pollen.design"
            defaultAccent={6}
          >
            <NavbarPill />
          </TemplateFrame>

          <TemplateFrame
            id="navbar-dock"
            sourceHref={`/templates/navbar-dock`}
            title="Bottom dock"
            description="Desktop-style dock with tooltips and unread counters. Playful without being a toy."
            url="os.nimbus.app"
            defaultAccent={2}
          >
            <NavbarDock />
          </TemplateFrame>

          <TemplateFrame
            id="navbar-bottom"
            sourceHref={`/templates/navbar-bottom`}
            title="Mobile tab bar"
            description="Five slots and a primary action, with the active tab lifted and dotted. Thumb-first shells."
            url="m.nimbus.app"
          >
            <NavbarBottom />
          </TemplateFrame>

          <TemplateFrame
            id="navbar-rail"
            sourceHref={`/templates/navbar-rail`}
            title="Icon rail"
            description="A 56px rail with hover labels and the avatar pinned last. For tools that live in the canvas."
            url="app.foundry.dev"
            defaultTheme="dark"
          >
            <NavbarRail />
          </TemplateFrame>

          <TemplateFrame
            id="navbar-mega"
            sourceHref={`/templates/navbar-mega`}
            title="Mega menu header"
            description="A centered marketing header whose Product link opens a real panel: grouped links and a promo tile. Hover it."
            url="northwind.dev"
          >
            <NavbarMega />
          </TemplateFrame>
        </div>
      </section>

      {/* Heroes */}
      <section className="space-y-10 pt-20">
        <CategoryHeading
          id="heroes"
          eyebrow="Heroes"
          title="Six ways to open a page"
        >
          A centered launch, a split product, a bold typographic
          statement, a waitlist capture, a metrics band with rolling
          counters, and a live application window. All composed from
          real components, never screenshots.
        </CategoryHeading>

        <div className="space-y-10">
          <TemplateFrame
            id="hero-centered"
            sourceHref={`/templates/hero-centered`}
            title="Centered launch"
            description="Badge, headline, pair of calls to action, and the avatar row that builds trust."
            url="nimbus.app/launch"
          >
            <HeroCentered />
          </TemplateFrame>

          <TemplateFrame
            id="hero-split"
            sourceHref={`/templates/hero-split`}
            title="Split product"
            description="Copy on the left, the product floating on soft depth to the right. Cards are real components, not screenshots."
            url="relay.dev/pipeline"
          >
            <HeroSplit />
          </TemplateFrame>

          <TemplateFrame
            id="hero-statement"
            sourceHref={`/templates/hero-statement`}
            title="Bold statement"
            description="Oversized type, one accent word, and the terminal command. For launches that want to be remembered."
            url="nimbus.dev"
            defaultTheme="dark"
          >
            <HeroStatement />
          </TemplateFrame>

          <TemplateFrame
            id="hero-waitlist"
            sourceHref={`/templates/hero-waitlist`}
            title="Waitlist capture"
            description="Promise, field, button, proof. The email capture that actually converts, with real field states."
            url="pending.nimbus.app"
            defaultAccent={4}
          >
            <HeroWaitlist />
          </TemplateFrame>

          <TemplateFrame
            id="hero-metrics"
            sourceHref={`/templates/hero-metrics`}
            title="Metrics band"
            description="Numbers that roll on mechanical Odometers while the copy stays short. Infrastructure-grade proof."
            url="edge.nimbus.app"
            defaultTheme="dark"
          >
            <HeroMetrics />
          </TemplateFrame>

          <TemplateFrame
            id="hero-appshot"
            sourceHref={`/templates/hero-appshot`}
            title="Application window"
            description="Copy left, a real deploy list right: toolbar, rows and status dots rendered from live components."
            url="atlas.dev"
          >
            <HeroAppShot />
          </TemplateFrame>
        </div>
      </section>

      {/* Sections */}
      <section className="space-y-10 pt-20">
        <CategoryHeading
          id="sections"
          eyebrow="Sections"
          title="The blocks between the heroes"
        >
          Pricing, authentication, stats, a bento feature grid, a
          logo band, testimonials with live ratings, an FAQ built on
          the new accordion, a changelog timeline, a newsletter,
          a closing banner and a footer. The recurring furniture of
          a product site, ready to compose.
        </CategoryHeading>

        <div className="space-y-10">
          <TemplateFrame
            id="section-pricing"
            sourceHref={`/templates/section-pricing`}
            title="Pricing"
            description="Three tiers with a highlighted plan and a billing toggle wired to a segmented control."
            url="nimbus.app/pricing"
          >
            <PricingSection />
          </TemplateFrame>

          <TemplateFrame
            id="section-logos"
            sourceHref={`/templates/section-logos`}
            title="Logo band"
            description="A slow, edge-faded marquee of customer wordmarks. Proof without the bragging."
            url="nimbus.app"
          >
            <LogoMarquee />
          </TemplateFrame>

          <TemplateFrame
            id="section-testimonials"
            sourceHref={`/templates/section-testimonials`}
            title="Testimonials"
            description="One large quote and two compact ones, with readOnly star ratings doing the scoring."
            url="nimbus.app/customers"
          >
            <Testimonials />
          </TemplateFrame>

          <div className="grid gap-8 lg:grid-cols-2">
            <TemplateFrame
              id="section-auth"
              sourceHref={`/templates/section-auth`}
              title="Auth card"
              description="Providers, a divider, the form, and the fine print. Everything a sign-in needs, nothing it does not."
              url="app.nimbus.app/signin"
              defaultTheme="dark"
            >
              <AuthCard />
            </TemplateFrame>

            <TemplateFrame
              id="section-stats"
              sourceHref={`/templates/section-stats`}
              title="Stats band"
              description="Four quiet numbers with accent suffixes. Proof, stated calmly."
              url="nimbus.app/about"
            >
              <StatsBand />
            </TemplateFrame>
          </div>

          <TemplateFrame
            id="section-bento"
            sourceHref={`/templates/section-bento`}
            title="Bento feature grid"
            description="A wide panel with a live preview plus two stacked cards. The rhythm every modern landing page wants."
            url="nimbus.app/features"
          >
            <FeatureGrid />
          </TemplateFrame>

          <div className="grid gap-8 lg:grid-cols-2">
            <TemplateFrame
              id="section-faq"
              sourceHref={`/templates/section-faq`}
              title="FAQ"
              description="The four questions every evaluation asks, on the new flush accordion with plus glyphs."
              url="nimbus.app/faq"
            >
              <FAQSection />
            </TemplateFrame>

            <TemplateFrame
              id="section-newsletter"
              sourceHref={`/templates/section-newsletter`}
              title="Newsletter band"
              description="Badge, promise, and a real form with icon field and submit. The quietest conversion on the page."
              url="letter.nimbus.app"
              defaultAccent={5}
            >
              <NewsletterBand />
            </TemplateFrame>
          </div>

          <TemplateFrame
            id="section-changelog"
            sourceHref={`/templates/section-changelog`}
            title="Changelog timeline"
            description="Every release dated, tagged and plain. The accent node tracks the rail."
            url="nimbus.app/changelog"
          >
            <ChangelogTimeline />
          </TemplateFrame>

          <TemplateFrame
            id="section-cta"
            sourceHref={`/templates/section-cta`}
            title="Closing banner"
            description="An inverted surface with a soft halo. The last thing on the page and the first thing they click."
            url="nimbus.app"
            defaultTheme="dark"
          >
            <CtaBanner />
          </TemplateFrame>

          <TemplateFrame
            id="section-footer"
            sourceHref={`/templates/section-footer`}
            title="Footer"
            description="Brand column, three link columns, and the quiet bottom bar with the search hint."
            url="nimbus.app"
          >
            <FooterTemplate />
          </TemplateFrame>
        </div>
      </section>

      {/* Outro note */}
      <section className="mt-20 rounded-3xl bg-fill/50 p-8 sm:p-10">
        <h2 className="text-xl font-semibold tracking-[-0.01em]">
          Copying a template into your project
        </h2>
        <p className="mt-3 max-w-3xl text-[15px] leading-relaxed text-muted-foreground">
          Every template above has its own page with the complete
          source: open it, hit Copy, paste it into your project. Each
          page also carries a TypeScript/JavaScript switch, the list
          of Pollen components the template is composed of with links
          to their docs, and an AI-agent prompt with the same source
          inline. The code is plain React and Tailwind - no hidden
          CSS, no private helpers - and it carries your theme, accent
          and radius automatically, because those are CSS variables,
          nothing more.
        </p>
        <Link
          href="/templates/docs"
          className="group mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-foreground transition-colors hover:text-accent"
        >
          Read the full templates guide
          <IconArrowRight className="h-3.5 w-3.5 transition-transform duration-150 group-hover:translate-x-0.5" />
        </Link>
      </section>
    </div>
  );
}
