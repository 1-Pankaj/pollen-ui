import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "pollen-ui";
import { IconArrowRight as ArrowRight } from "pollen-ui";
import { templates } from "@/lib/docs-data.generated";

export const metadata: Metadata = {
  title: "Templates guide",
  description:
    "How the Pollen UI templates are built, how to copy one into your project, how theming follows you, and the composition patterns behind the set.",
};

const STEPS = [
  {
    title: "Open the template's page",
    body: "Every card on the templates overview links to its own page with the complete source, a live preview, and the studio controls.",
  },
  {
    title: "Copy, in your language",
    body: "The TypeScript/JavaScript switch on that page rewrites the whole template, not just a fragment. Copy gives you exactly what the preview renders.",
  },
  {
    title: "Paste and adjust imports",
    body: "The code is plain React and Tailwind - no hidden CSS, no private helpers. The page lists every Pollen component the template uses, each chip linking to its docs, plus any extra dependencies with a note.",
  },
  {
    title: "Let the theme do the rest",
    body: "Colors, radius and shadows are CSS variables. The template picks up your accent, your corners and your dark mode automatically - nothing to edit.",
  },
];

const PAIRINGS = [
  {
    pair: "Top bar + Bottom dock",
    why: "One shell for pointer devices, one for thumbs. Both read the same active state, so switching feels like the same product.",
  },
  {
    pair: "Centered launch + Logo band + Testimonials",
    why: "The default landing arc: promise, proof, voices. The logo marquee sits quietly between two louder sections on purpose.",
  },
  {
    pair: "Metrics band + Stats band",
    why: "Odometers earn attention on a hero; static numbers suit an about page. Same data, different volume.",
  },
  {
    pair: "Pricing + FAQ + Closing banner",
    why: "The conversion path. Answer the evaluation questions one screen after the price, then close while the intent is warm.",
  },
  {
    pair: "Sidebar dashboard + Command header",
    why: "Workspace tools live in the sidebar; the command palette is the power user's shortcut. They share the same keyboard hints.",
  },
  {
    pair: "Auth card + Footer",
    why: "Sign-in screens still need an exit. A quiet footer keeps the page from feeling like a dead end.",
  },
];

const INSIGHTS = [
  {
    title: "Density before decoration",
    body: "The templates reuse one spacing rhythm: generous section gaps on marketing pages, tight padding inside cards. If a layout feels off, check the rhythm before adding new styles.",
  },
  {
    title: "One accent per screen",
    body: "Accent color marks the single most important element per view - a primary button, the active tab, the highlighted pricing tier. When everything is accent, nothing is.",
  },
  {
    title: "Motion is punctuation",
    body: "Reveal on scroll, springs on press, nothing that loops forever except the marquee. If a visitor notices the animation before the content, it is too loud.",
  },
  {
    title: "Dark is not inverted light",
    body: "Every template was checked in both themes through the frame's theme control - surfaces shift hue, not just brightness. Keep it that way when you edit.",
  },
  {
    title: "Hit targets before hover states",
    body: "Every tappable thing in the templates clears 40 by 40 pixels, because the set is used on phones first. A hover style is decoration; a reachable target is the interface.",
  },
  {
    title: "Empty and loading are designed states",
    body: "The templates ship empty-state and skeleton treatments next to their filled ones. A table that only looks right with ten rows in it is not finished.",
  },
  {
    title: "Focus goes where the eye went",
    body: "Modals move focus in, drawers return it, tabs rove. If you re-compose a template, keep the focus order matching the visual order - the keyboard is the real test.",
  },
  {
    title: "Copy is part of the component",
    body: "The templates write real sentences, not lorem: specific verbs, one idea per line, labels that say what the button does. Replace them with copy of the same length so the layout survives.",
  },
];

const PRACTICAL = [
  {
    title: "Accessibility is in the markup",
    body: "The templates use the library's semantics as-is: real buttons, labelled switches, radiogroups for exclusive choices, focus rings that stay visible. If you swap a component, check the role it hands to assistive tech before you restyle it.",
  },
  {
    title: "Responsive by re-composition",
    body: "The layouts reflow by hiding and restacking whole blocks - the dashboard collapses its sidebar into a dock, the pricing grid wraps to one column - rather than shrinking type. Copy that pattern: change the structure per breakpoint, keep the type scale.",
  },
  {
    title: "Performance comes from restraint",
    body: "The animated templates run on transform and opacity only, and the marquee pauses under prefers-reduced-motion. A template that janks after your edits almost certainly added a layout-affecting animation - move the effect back onto transform.",
  },
  {
    title: "Adding your own template",
    body: "Start from the closest existing one, keep its spacing rhythm and its empty/loading states, and wire every color through the CSS variables. The studio on each preview page retints your template automatically once nothing hard-codes a hex.",
  },
];

export default function TemplatesDocsPage() {
  const byCategory = ["navigation", "heroes", "sections"].map((category) => ({
    category,
    items: templates.filter((t) => t.category === category),
  }));

  return (
    <div className="mx-auto max-w-[1000px] px-6 pb-28">
      <section className="pt-14 sm:pt-16">
        <Link
          href="/templates"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          All templates
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
        <p className="mt-8 text-sm font-semibold text-accent">Guide</p>
        <h1 className="mt-3 text-balance text-4xl font-semibold leading-[1.08] tracking-[-0.03em] sm:text-5xl">
          How the templates work
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          Twenty-five production-ready layouts built entirely from live
          Pollen UI components. This page is the manual: how to copy one
          into your project, why theming carries over for free, and the
          composition patterns the set is built on.
        </p>
      </section>

      {/* Getting one into your project */}
      <Reveal className="mt-14">
        <h2 className="text-2xl font-semibold tracking-tight">
          Add one to your project
        </h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {STEPS.map((step, i) => (
            <div
              key={step.title}
              className="rounded-2xl bg-card p-5 shadow-[var(--pollen-shadow-sm)]"
            >
              <p className="flex items-center gap-2 text-[15px] font-medium text-foreground">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/12 font-mono text-[11px] font-semibold text-accent">
                  {i + 1}
                </span>
                {step.title}
              </p>
              <p className="mt-2.5 text-[13.5px] leading-relaxed text-muted-foreground">
                {step.body}
              </p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-sm leading-relaxed text-faint">
          Working with an AI coding agent? Every template page also carries a
          ready-to-paste prompt with the full source inline.
        </p>
      </Reveal>

      {/* Theming */}
      <Reveal className="mt-12">
        <h2 className="text-2xl font-semibold tracking-tight">
          Why your theme follows you
        </h2>
        <p className="mt-3 max-w-3xl text-[15px] leading-relaxed text-muted-foreground">
          The templates hard-code no colors. Every surface reads a CSS
          variable - background, card, fill, border, accent - and those
          variables flip with the theme and retint with the accent you pick
          in a preview's studio. That is why one snippet serves both themes
          and every accent: the code is the same, the variables change.
          Bring your own variables and it is your brand, not Pollen's.
        </p>
      </Reveal>

      {/* Composition */}
      <Reveal className="mt-12">
        <h2 className="text-2xl font-semibold tracking-tight">
          Composition patterns
        </h2>
        <p className="mt-3 max-w-3xl text-[15px] leading-relaxed text-muted-foreground">
          The set is designed as families, not isolated blocks. These are
          the pairings the templates were drawn for:
        </p>
        <div className="mt-5 overflow-hidden rounded-2xl bg-card shadow-[var(--pollen-shadow-sm)]">
          {PAIRINGS.map((p, i) => (
            <div
              key={p.pair}
              className={`grid gap-1 px-5 py-4 sm:grid-cols-[280px_1fr] sm:gap-6 ${
                i > 0 ? "border-t border-[var(--pollen-border)]" : ""
              }`}
            >
              <p className="font-mono text-[13px] font-medium text-foreground">
                {p.pair}
              </p>
              <p className="text-[13.5px] leading-relaxed text-muted-foreground">
                {p.why}
              </p>
            </div>
          ))}
        </div>
      </Reveal>

      {/* Insights */}
      <Reveal className="mt-12">
        <h2 className="text-2xl font-semibold tracking-tight">
          The rules behind the set
        </h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {INSIGHTS.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl bg-fill/50 p-5"
            >
              <p className="text-[15px] font-medium text-foreground">{item.title}</p>
              <p className="mt-2 text-[13.5px] leading-relaxed text-muted-foreground">
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </Reveal>

      {/* Practical notes */}
      <Reveal className="mt-12">
        <h2 className="text-2xl font-semibold tracking-tight">
          Practical notes for editing
        </h2>
        <p className="mt-3 max-w-3xl text-[15px] leading-relaxed text-muted-foreground">
          The rules above are the design contracts. These four are the
          engineering ones - what keeps a template accessible, responsive and
          fast after you have made it yours.
        </p>
        <div className="mt-5 overflow-hidden rounded-2xl bg-card shadow-[var(--pollen-shadow-sm)]">
          {PRACTICAL.map((item, i) => (
            <div
              key={item.title}
              className={`grid gap-1 px-5 py-4 sm:grid-cols-[280px_1fr] sm:gap-6 ${
                i > 0 ? "border-t border-[var(--pollen-border)]" : ""
              }`}
            >
              <p className="font-mono text-[13px] font-medium text-foreground">
                {item.title}
              </p>
              <p className="text-[13.5px] leading-relaxed text-muted-foreground">
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </Reveal>

      {/* Full index */}
      <Reveal className="mt-12">
        <h2 className="text-2xl font-semibold tracking-tight">Every template</h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          All twenty-five, each linking to its page with the complete,
          copyable source.
        </p>
        <div className="mt-5 space-y-8">
          {byCategory.map(({ category, items }) => (
            <div key={category}>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-faint">
                {category}
              </p>
              <div className="mt-2 overflow-hidden rounded-2xl bg-card shadow-[var(--pollen-shadow-sm)]">
                {items.map((t, i) => (
                  <Link
                    key={t.id}
                    href={`/templates/${t.id}`}
                    className={`group flex items-baseline justify-between gap-4 px-5 py-3.5 transition-colors hover:bg-fill/60 ${
                      i > 0 ? "border-t border-[var(--pollen-border)]" : ""
                    }`}
                  >
                    <span className="text-[14.5px] font-medium text-foreground">
                      {t.title}
                    </span>
                    <span className="hidden text-[13px] text-muted-foreground sm:block sm:truncate sm:max-w-[440px]">
                      {t.description}
                    </span>
                    <ArrowRight className="mt-1 h-3.5 w-3.5 shrink-0 self-center text-faint transition-transform duration-150 group-hover:translate-x-0.5 group-hover:text-foreground" />
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Reveal>
    </div>
  );
}
