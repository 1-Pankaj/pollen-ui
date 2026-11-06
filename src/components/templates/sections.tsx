"use client";

import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Avatar,
  Badge,
  Button,
  Checkbox,
  IconArrowRight as ArrowRight,
  IconBars as Chart,
  IconBolt as Bolt,
  IconCheck as Check,
  IconGithub as Github,
  IconLayers as Layers,
  IconLock as Lock,
  IconMail as Mail,
  IconOdometer as Odometer,
  IconSwatches as Palette,
  IconUser as User,
  IconWindow as AppWindow,
  Input,
  Kbd,
  Label,
  Marquee,
  Progress,
  Rating,
  SegmentedControl,
  cn,
} from "pollen-ui";

/* ------------------------------------------------------------------
   Section templates. The recurring building blocks of a marketing
   site and a product shell, composed only from the library. They
   respond to the width of their frame (container queries), not the
   viewport, so half-width previews stay intact.
   ------------------------------------------------------------------ */

/* ---------------------------- pricing ---------------------------- */

const tiers = [
  {
    name: "Hobby",
    price: "$0",
    cadence: "forever",
    blurb: "For the weekend project that deserves real polish.",
    features: ["Up to 3 projects", "Community support", "Core component set", "Light and dark themes"],
    cta: "Start free",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$24",
    cadence: "per editor / month",
    blurb: "For product teams shipping to customers every week.",
    features: [
      "Unlimited projects",
      "Priority support, 4h first response",
      "Every component and template",
      "Figma kit with tokens",
    ],
    cta: "Start 14-day trial",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    cadence: "annual",
    blurb: "For platform teams with compliance and scale needs.",
    features: ["SSO and SCIM", "Dedicated success engineer", "Security review and DPA", "On-premise builds"],
    cta: "Talk to sales",
    highlighted: false,
  },
];

export function PricingSection() {
  return (
    <div className="bg-background px-8 py-14">
      <div className="text-center">
        <p className="text-sm font-semibold text-accent">Pricing</p>
        <h2 className="mt-3 text-balance text-4xl font-semibold tracking-[-0.03em]">
          Start free, scale when it ships
        </h2>
        <div className="mt-7 flex justify-center">
          <SegmentedControl
            defaultValue="monthly"
            aria-label="Billing period"
            options={[
              { value: "monthly", label: "Monthly" },
              { value: "yearly", label: "Yearly", badge: "2mo" },
            ]}
          />
        </div>
      </div>
      <div className="mx-auto mt-10 grid max-w-4xl gap-4 @2xl:grid-cols-3">
        {tiers.map((tier) => (
          <div
            key={tier.name}
            className={cn(
              "relative flex flex-col rounded-3xl bg-card p-7",
              tier.highlighted
                ? "shadow-[var(--pollen-shadow-lg)] ring-1 ring-[color-mix(in_srgb,var(--pollen-accent)_35%,transparent)]"
                : "shadow-[var(--pollen-shadow-sm)]",
            )}
          >
            {tier.highlighted && (
              <Badge variant="accent" className="absolute -top-2.5 left-6 shadow-[var(--pollen-shadow-xs)]">
                Most popular
              </Badge>
            )}
            <p className="text-[15px] font-semibold text-foreground">{tier.name}</p>
            <p className="mt-1 min-h-10 text-[13.5px] leading-snug text-muted-foreground">{tier.blurb}</p>
            <p className="mt-4 flex items-baseline gap-1.5">
              <span className="text-4xl font-semibold tracking-[-0.03em] text-foreground">{tier.price}</span>
              <span className="text-[13px] text-faint">{tier.cadence}</span>
            </p>
            <ul className="mt-6 flex-1 space-y-2.5">
              {tier.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2.5 text-[13.5px] leading-snug text-muted-foreground">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                  {feature}
                </li>
              ))}
            </ul>
            <Button
              className="mt-7"
              variant={tier.highlighted ? "accent" : "secondary"}
              fullWidth
            >
              {tier.cta}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------ auth ----------------------------- */

export function AuthCard() {
  return (
    <div className="flex h-full min-h-[440px] items-center justify-center bg-background px-8 py-14">
      <div className="w-full max-w-[400px] rounded-3xl bg-card p-8 shadow-[var(--pollen-shadow-md)]">
        <div className="flex flex-col items-center text-center">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-foreground text-background">
            <Layers className="h-5 w-5" />
          </span>
          <h2 className="mt-5 text-2xl font-semibold tracking-[-0.02em]">Welcome back</h2>
          <p className="mt-1.5 text-[14.5px] text-muted-foreground">
            Sign in to your workspace
          </p>
        </div>

        <div className="mt-7 grid grid-cols-2 gap-2.5">
          <Button variant="secondary" fullWidth>
            <Github className="h-4 w-4" />
            GitHub
          </Button>
          <Button variant="secondary" fullWidth>
            <Mail className="h-4 w-4" />
            Google
          </Button>
        </div>

        <div className="my-6 flex items-center gap-3">
          <span className="h-px flex-1 bg-[var(--pollen-separator)]" />
          <span className="text-xs text-faint">or with email</span>
          <span className="h-px flex-1 bg-[var(--pollen-separator)]" />
        </div>

        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div className="space-y-1.5">
            <Label htmlFor="tpl-email">Email</Label>
            <Input id="tpl-email" type="email" placeholder="you@company.com" />
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="tpl-password">Password</Label>
              <Link href="#" onClick={(e) => e.preventDefault()} className="text-xs text-accent hover:underline">
                Forgot?
              </Link>
            </div>
            <Input id="tpl-password" type="password" placeholder="••••••••" />
          </div>
          <Checkbox size="sm" defaultChecked>Keep me signed in</Checkbox>
          <Button type="submit" fullWidth size="lg">
            <Lock className="h-4 w-4" />
            Sign in
          </Button>
        </form>

        <p className="mt-6 text-center text-[13px] text-muted-foreground">
          New here?{" "}
          <Link href="#" onClick={(e) => e.preventDefault()} className="font-medium text-accent hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}

/* ----------------------------- footer ---------------------------- */

const footerColumns = [
  { heading: "Product", links: ["Components", "Templates", "Playground", "Changelog"] },
  { heading: "Resources", links: ["Documentation", "Guides", "Figma kit", "Roadmap"] },
  { heading: "Company", links: ["About", "Blog", "Careers", "Contact"] },
];

export function FooterTemplate() {
  return (
    <div className="bg-background px-8 pb-8 pt-14">
      <div className="mx-auto max-w-4xl">
        <div className="grid gap-10 @xl:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <span className="flex items-center gap-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-foreground text-background">
                <Layers className="h-4 w-4" />
              </span>
              <span className="text-[15px] font-semibold tracking-[-0.01em]">Nimbus</span>
            </span>
            <p className="mt-3.5 max-w-[220px] text-[13.5px] leading-relaxed text-muted-foreground">
              The open component library for teams that care about the
              last 10 percent.
            </p>
          </div>
          {footerColumns.map((column) => (
            <div key={column.heading}>
              <p className="text-[13px] font-semibold text-foreground">{column.heading}</p>
              <ul className="mt-3 space-y-2">
                {column.links.map((link) => (
                  <li key={link}>
                    <Link
                      href="#"
                      onClick={(e) => e.preventDefault()}
                      className="text-[13.5px] text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-[var(--pollen-separator)] pt-6 @xl:flex-row">
          <p className="text-[12.5px] text-faint">© 2026 Nimbus Labs. MIT licensed.</p>
          <div className="flex items-center gap-2 text-[12.5px] text-faint">
            Press
            <Kbd className="bg-fill">⌘</Kbd>
            <Kbd className="bg-fill">K</Kbd>
            to search
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------ stats ---------------------------- */

const stats = [
  { icon: <Odometer className="h-5 w-5" />, value: "54", suffix: "k", label: "GitHub stars" },
  { icon: <AppWindow className="h-5 w-5" />, value: "1.2", suffix: "M", label: "Weekly installs" },
  { icon: <Layers className="h-5 w-5" />, value: "54", suffix: "", label: "Components" },
  { icon: <Bolt className="h-5 w-5" />, value: "99.98", suffix: "%", label: "Docs uptime" },
];

export function StatsBand() {
  return (
    <div className="bg-background px-8 py-14">
      <div className="mx-auto grid max-w-4xl grid-cols-2 gap-4 @2xl:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-3xl bg-card p-6 text-center shadow-[var(--pollen-shadow-sm)]"
          >
            <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-2xl bg-fill text-foreground">
              {stat.icon}
            </span>
            <p className="mt-4 text-3xl font-semibold tabular-nums tracking-[-0.03em] text-foreground">
              {stat.value}
              <span className="text-accent">{stat.suffix}</span>
            </p>
            <p className="mt-1 text-[13px] text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------ bento ---------------------------- */

export function FeatureGrid() {
  return (
    <div className="bg-background px-8 py-14">
      <div className="mx-auto grid max-w-4xl gap-4 @xl:grid-cols-3">
        <div className="rounded-3xl bg-card p-7 shadow-[var(--pollen-shadow-sm)] @xl:col-span-2">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-fill text-foreground">
            <Chart className="h-5 w-5" />
          </span>
          <h3 className="mt-5 text-xl font-semibold tracking-[-0.01em]">Real-time dashboards</h3>
          <p className="mt-2 max-w-md text-[15px] leading-relaxed text-muted-foreground">
            Stream live data into components tuned for constant change:
            numbers that roll, bars that ease, sparklines that breathe.
          </p>
          <div className="mt-6 space-y-3 rounded-2xl bg-fill/60 p-4">
            <div className="flex items-center justify-between text-[13px]">
              <span className="font-medium text-foreground">API latency</span>
              <span className="tabular-nums text-muted-foreground">84ms</span>
            </div>
            <Progress value={30} color="success" showValue />
            <div className="flex items-center justify-between text-[13px]">
              <span className="font-medium text-foreground">Error rate</span>
              <span className="tabular-nums text-muted-foreground">0.4%</span>
            </div>
            <Progress value={4} color="danger" showValue />
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex-1 rounded-3xl bg-card p-7 shadow-[var(--pollen-shadow-sm)]">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-fill text-foreground">
              <Palette className="h-5 w-5" />
            </span>
            <h3 className="mt-5 text-lg font-semibold tracking-[-0.01em]">Token theming</h3>
            <p className="mt-2 text-[14.5px] leading-relaxed text-muted-foreground">
              Rebrand in one file. Every color, radius and shadow is a
              CSS variable.
            </p>
          </div>
          <div className="flex-1 rounded-3xl bg-card p-7 shadow-[var(--pollen-shadow-sm)]">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-fill text-foreground">
              <User className="h-5 w-5" />
            </span>
            <h3 className="mt-5 text-lg font-semibold tracking-[-0.01em]">Built-in presence</h3>
            <p className="mt-2 text-[14.5px] leading-relaxed text-muted-foreground">
              Avatars, status dots and typing indicators ready for
              collaborative surfaces.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------- cta ----------------------------- */

export function CtaBanner() {
  return (
    <div className="bg-background px-8 py-14">
      <div className="relative mx-auto max-w-4xl overflow-hidden rounded-[32px] bg-foreground px-8 py-16 text-center text-background shadow-[var(--pollen-shadow-lg)]">
        <div
          aria-hidden="true"
          className="absolute left-1/2 top-[-140px] h-[320px] w-[560px] -translate-x-1/2 rounded-[100%] bg-[radial-gradient(closest-side,rgba(255,255,255,0.14),transparent)]"
        />
        <h2 className="relative text-balance text-4xl font-semibold tracking-[-0.03em]">
          Your next release starts here
        </h2>
        <p className="relative mx-auto mt-4 max-w-md text-balance text-[17px] leading-relaxed text-background/70">
          One install away from the polish your product deserves.
        </p>
        <div className="relative mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button
            size="lg"
            className="bg-background text-foreground hover:bg-background/90"
          >
            Get started
            <ArrowRight className="h-4 w-4" />
          </Button>
          <Button
            size="lg"
            variant="ghost"
            className="text-background hover:bg-white/10"
          >
            <Github className="h-4 w-4" />
            View source
          </Button>
        </div>
      </div>
    </div>
  );
}

/* --------------------------- logo band ---------------------------- */

const customerMarks = [
  "Halcyon", "Northwind", "Atlas", "Relay", "Vercelia", "Quill",
  "Meridian", "Foundry", "Cobalt", "Lumen",
];

export function LogoMarquee() {
  return (
    <div className="bg-background px-8 py-12">
      <p className="text-center text-[13px] font-medium text-faint">
        Trusted by product teams at
      </p>
      <div className="mx-auto mt-6 max-w-4xl">
        <Marquee pauseOnHover className="opacity-70">
          {customerMarks.map((mark) => (
            <span
              key={mark}
              className="mx-7 select-none whitespace-nowrap text-lg font-semibold tracking-[-0.01em] text-muted-foreground"
            >
              {mark}
            </span>
          ))}
        </Marquee>
      </div>
    </div>
  );
}

/* -------------------------- testimonials -------------------------- */

const quotes = [
  {
    quote:
      "We replaced six months of interface work with an afternoon. The springs alone are worth the install.",
    name: "Mia Torres",
    role: "Head of Design, Halcyon",
    avatar: "/avatars/grace.jpg",
    featured: true,
  },
  {
    quote: "Finally a library where dark mode is not an afterthought.",
    name: "Leo Park",
    role: "Staff Engineer, Relay",
    avatar: "/avatars/leo.jpg",
    featured: false,
    rating: 5,
  },
  {
    quote: "Our designers stopped filing pixel tickets. That is the review.",
    name: "Ada Quinn",
    role: "Product Lead, Foundry",
    avatar: "/avatars/mia.jpg",
    featured: false,
    rating: 4.5,
  },
];

export function Testimonials() {
  return (
    <div className="bg-background px-8 py-14">
      <div className="mx-auto max-w-4xl">
        <h2 className="text-balance text-center text-4xl font-semibold tracking-[-0.03em]">
          Teams ship faster with Pollen
        </h2>
        <div className="mt-10 grid gap-4 @xl:grid-cols-2">
          {quotes.map((q) =>
            q.featured ? (
              <figure
                key={q.name}
                className="flex flex-col justify-between rounded-3xl bg-card p-8 shadow-[var(--pollen-shadow-sm)] @xl:row-span-2"
              >
                <blockquote className="text-balance text-2xl font-medium leading-snug tracking-[-0.015em] text-foreground">
                  “{q.quote}”
                </blockquote>
                <figcaption className="mt-8 flex items-center gap-3">
                  <Avatar size={40} src={q.avatar} fallback={q.name} />
                  <div>
                    <p className="text-[14.5px] font-medium text-foreground">{q.name}</p>
                    <p className="text-[12.5px] text-muted-foreground">{q.role}</p>
                  </div>
                </figcaption>
              </figure>
            ) : (
              <figure
                key={q.name}
                className="rounded-3xl bg-card p-6 shadow-[var(--pollen-shadow-sm)]"
              >
                <Rating value={q.rating ?? 5} readOnly size="sm" />
                <blockquote className="mt-3.5 text-[15px] leading-relaxed text-foreground">
                  “{q.quote}”
                </blockquote>
                <figcaption className="mt-5 flex items-center gap-2.5">
                  <Avatar size={30} src={q.avatar} fallback={q.name} />
                  <div>
                    <p className="text-[13px] font-medium text-foreground">{q.name}</p>
                    <p className="text-[11.5px] text-muted-foreground">{q.role}</p>
                  </div>
                </figcaption>
              </figure>
            ),
          )}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------ faq ------------------------------ */

const faqs = [
  {
    q: "Can I use Pollen in a commercial product?",
    a: "Yes. Pollen is MIT licensed, so it ships inside client work, internal tools and paid products with no attribution required.",
  },
  {
    q: "Does it work with my existing Tailwind setup?",
    a: "Pollen targets Tailwind v4 and ships its tokens as CSS variables. Import the stylesheet once, then use the components alongside your own classes.",
  },
  {
    q: "How do themes work?",
    a: "Light and dark are two token sets under .light and .dark. Every component reads the same variables, so a rebrand is one file and a dark mode is one class.",
  },
  {
    q: "What about accessibility?",
    a: "Every interactive component is keyboard operable, labelled, and respects prefers-reduced-motion by falling back to instant states.",
  },
];

export function FAQSection() {
  return (
    <div className="bg-background px-8 py-14">
      <div className="mx-auto grid max-w-4xl gap-10 @xl:grid-cols-[280px_1fr]">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-accent">FAQ</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-[-0.025em]">
            Answers, before the email
          </h2>
          <p className="mt-3 text-[14.5px] leading-relaxed text-muted-foreground">
            The four questions every evaluation asks. Still curious?
            The docs search knows the rest.
          </p>
        </div>
        <Accordion
          type="single"
          defaultValue={["faq-1"]}
          variant="flush"
          icon="plus"
          className="min-w-0"
        >
          {faqs.map((item, i) => (
            <AccordionItem key={item.q} value={`faq-${i + 1}`}>
              <AccordionTrigger value={`faq-${i + 1}`}>{item.q}</AccordionTrigger>
              <AccordionContent value={`faq-${i + 1}`}>{item.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}

/* ---------------------------- changelog --------------------------- */

const releases = [
  {
    version: "4.0",
    date: "Nov 2025",
    tag: "Major" as const,
    title: "Premium set: chat, toasts, slide to confirm",
    items: ["Full chat surface with reactions", "Stacking toast pile", "Pressable cards and dock"],
  },
  {
    version: "3.2",
    date: "Sep 2025",
    tag: "Minor" as const,
    title: "Templates and the theme studio",
    items: ["Twelve page templates", "Live theme studio", "Radius and accent tokens"],
  },
  {
    version: "3.1",
    date: "Jul 2025",
    tag: "Patch" as const,
    title: "Motion polish and fixes",
    items: ["Spring presets unified", "Reduced-motion fallbacks everywhere"],
  },
];

export function ChangelogTimeline() {
  return (
    <div className="bg-background px-8 py-14">
      <div className="mx-auto max-w-3xl">
        <h2 className="text-balance text-center text-4xl font-semibold tracking-[-0.03em]">
          Changelog
        </h2>
        <p className="mx-auto mt-3 max-w-md text-balance text-center text-[15px] text-muted-foreground">
          Every release, dated and plain. No surprise majors.
        </p>
        <div className="relative mt-10 space-y-8 before:absolute before:bottom-2 before:left-[7px] before:top-2 before:w-px before:bg-[var(--pollen-separator)]">
          {releases.map((release) => (
            <div key={release.version} className="relative pl-8">
              <span className="absolute left-0 top-1.5 h-[15px] w-[15px] rounded-full border-[3px] border-background bg-accent shadow-[0_0_0_1px_var(--pollen-separator)]" />
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="text-[15px] font-semibold text-foreground">
                  v{release.version}
                </span>
                <Badge
                  variant={
                    release.tag === "Major"
                      ? "accent"
                      : release.tag === "Minor"
                        ? "success"
                        : "neutral"
                  }
                  size="sm"
                >
                  {release.tag}
                </Badge>
                <span className="text-[12.5px] text-faint">{release.date}</span>
              </div>
              <p className="mt-1.5 text-[14.5px] font-medium text-foreground">
                {release.title}
              </p>
              <ul className="mt-2 space-y-1">
                {release.items.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2 text-[13.5px] leading-snug text-muted-foreground"
                  >
                    <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-faint" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* --------------------------- newsletter --------------------------- */

export function NewsletterBand() {
  return (
    <div className="bg-background px-8 py-14">
      <div className="mx-auto flex max-w-4xl flex-col items-start gap-8 rounded-3xl bg-card p-8 shadow-[var(--pollen-shadow-sm)] sm:p-10 @2xl:flex-row @2xl:items-center">
        <div className="min-w-0 flex-1">
          <Badge variant="accent" size="sm">Monthly</Badge>
          <h3 className="mt-3 text-2xl font-semibold tracking-[-0.02em]">
            The Pollen letter
          </h3>
          <p className="mt-2 max-w-sm text-[14.5px] leading-relaxed text-muted-foreground">
            One email a month: new components, motion recipes, and the
            occasional deep dive. Unsubscribe any time.
          </p>
        </div>
        <form
          className="w-full max-w-sm shrink-0 space-y-2.5"
          onSubmit={(e) => e.preventDefault()}
        >
          <Input
            type="email"
            required
            placeholder="you@company.com"
            aria-label="Email address"
            icon={<Mail className="h-4 w-4" />}
          />
          <Button type="submit" fullWidth>
            Subscribe
            <ArrowRight className="h-4 w-4" />
          </Button>
          <p className="text-center text-[12px] text-faint">
            12,906 subscribers · No sponsors, no filler
          </p>
        </form>
      </div>
    </div>
  );
}
