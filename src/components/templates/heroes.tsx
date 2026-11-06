"use client";

import Link from "next/link";
import {
  Avatar,
  AvatarGroup,
  Badge,
  Button,
  CodeBlock,
  IconArrowRight as ArrowRight,
  IconCheck as Check,
  IconGithub as Github,
  IconSwatches as Palette,
  IconTerminalSquare as TerminalSquare,
  Input,
  Kbd,
  Odometer,
  Progress,
  cn,
} from "pollen-ui";

/* ------------------------------------------------------------------
   Hero templates. Three marketing-grade openings, each assembled
   only from the library, each fully theme aware.
   ------------------------------------------------------------------ */

export function HeroCentered() {
  return (
    <div className="flex h-full min-h-[440px] flex-col items-center justify-center bg-background px-8 py-16 text-center">
      <Badge variant="accent" icon={<Palette className="h-3 w-3" />}>
        Introducing v2.0
      </Badge>
      <h1 className="mt-6 max-w-2xl text-balance text-5xl font-semibold leading-[1.05] tracking-[-0.035em]">
        Ship your product, not your UI kit
      </h1>
      <p className="mt-5 max-w-lg text-balance text-lg leading-relaxed text-muted-foreground">
        One install gives your team every control, surface and motion
        curve it needs, in light and dark, from day one.
      </p>
      <div className="mt-8 flex items-center gap-3">
        <Button size="lg">
          Start building
          <ArrowRight className="h-4 w-4" />
        </Button>
        <Button size="lg" variant="secondary">
          <Github className="h-4 w-4" />
          Star on GitHub
        </Button>
      </div>
      <div className="mt-10 flex items-center gap-3">
        <AvatarGroup
          max={4}
          className="[--avatar-ring:var(--pollen-background)]"
        >
          <Avatar size={28} src="/avatars/grace.jpg" fallback="Mia Torres" />
          <Avatar size={28} src="/avatars/leo.jpg" fallback="Leo Park" />
          <Avatar size={28} src="/avatars/mia.jpg" fallback="Ada Quinn" />
          <Avatar size={28} src="/avatars/leo.jpg" fallback="Ben Sato" />
          <Avatar size={28} src="/avatars/alan.jpg" fallback="Zoe Marsh" />
        </AvatarGroup>
        <p className="text-[13.5px] text-muted-foreground">
          Loved by <span className="font-medium text-foreground">12,400+</span> product teams
        </p>
      </div>
    </div>
  );
}

/* ----------------------------- split ----------------------------- */

function InvoiceCard() {
  return (
    <div className="w-[240px] rounded-2xl bg-card p-4 shadow-[var(--pollen-shadow-md)]">
      <div className="flex items-center justify-between">
        <p className="text-[13px] font-semibold text-foreground">Invoice #0042</p>
        <Badge variant="success" dot size="sm">Paid</Badge>
      </div>
      <p className="mt-2.5 text-2xl font-semibold tabular-nums tracking-[-0.02em] text-foreground">
        $2,480.00
      </p>
      <div className="mt-3.5 space-y-2.5">
        <Progress value={72} color="accent" />
        <div className="flex justify-between text-[11.5px] text-faint">
          <span>Milestones 5 of 7</span>
          <span>72%</span>
        </div>
      </div>
    </div>
  );
}

function DeployCard() {
  return (
    <div className="w-[230px] rounded-2xl bg-card p-4 shadow-[var(--pollen-shadow-lg)]">
      <div className="flex items-center gap-2.5">
        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[color-mix(in_srgb,var(--pollen-success)_13%,transparent)] text-success">
          <Check className="h-4 w-4" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-medium leading-tight text-foreground">Deployed to prod</p>
          <p className="text-[11.5px] leading-tight text-faint">edge network · 34 regions</p>
        </div>
      </div>
      <div className="mt-3 flex items-center gap-1.5 rounded-lg bg-fill px-2.5 py-1.5 font-mono text-[11px] text-muted-foreground">
        <span className="h-1.5 w-1.5 rounded-full bg-success" />
        build 4m 12s
        <Kbd className="ml-auto bg-card">⌘D</Kbd>
      </div>
    </div>
  );
}

export function HeroSplit() {
  return (
    <div className="@container grid h-full min-h-[440px] items-center gap-10 bg-background px-8 py-14 @xl:grid-cols-2 @2xl:px-14">
      <div>
        <Badge dot variant="success">All systems operational</Badge>
        <h1 className="mt-5 text-balance text-4xl font-semibold leading-[1.06] tracking-[-0.03em] sm:text-5xl">
          The control room for your release pipeline
        </h1>
        <p className="mt-5 max-w-md text-lg leading-relaxed text-muted-foreground">
          Watch every build, flag and invoice in one calm surface. Built
          for teams that ship several times a day.
        </p>
        <div className="mt-8 flex items-center gap-3">
          <Button size="lg">Get started free</Button>
          <Button size="lg" variant="ghost">
            Book a demo
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
        <p className="mt-6 text-[13px] text-faint">
          Free for 14 days · No card required
        </p>
      </div>

      {/* The product, floating on soft depth. Real components only. */}
      <div className="relative mx-auto flex min-h-[320px] w-full max-w-[420px] items-center justify-center">
        <div className="absolute left-0 top-2 -rotate-2 [transform-style:preserve-3d]">
          <DeployCard />
        </div>
        <div className="relative ml-auto mt-16 rotate-1">
          <InvoiceCard />
        </div>
        <div className="absolute -bottom-2 left-8 right-8 h-6 rounded-[50%] bg-black/10 blur-xl dark:bg-black/40" />
      </div>
    </div>
  );
}

/* --------------------------- statement --------------------------- */

export function HeroStatement() {
  return (
    <div className="flex h-full min-h-[440px] flex-col items-center justify-center bg-background px-8 py-16 text-center">
      <h1 className="max-w-3xl text-balance text-6xl font-semibold leading-[0.98] tracking-[-0.045em] sm:text-7xl">
        Build at the speed
        <br />
        of a <span className="text-accent">thought</span>
      </h1>
      <p className="mt-6 max-w-md text-balance text-lg leading-relaxed text-muted-foreground">
        Copy one command. Paste one line. Your first component is on
        screen before your coffee cools.
      </p>
      <div className="mt-9 w-full max-w-[360px]">
        <CodeBlock
          filename="terminal"
          language="bash"
          code="npm install @nimbus/core"
        />
      </div>
      <div className="mt-7 flex items-center gap-2 text-[13px] text-muted-foreground">
        <TerminalSquare className="h-4 w-4 text-faint" />
        Works with <Kbd className="mx-0.5">npm</Kbd>
        <Kbd className="mx-0.5">pnpm</Kbd>
        <Kbd className="mx-0.5">bun</Kbd>
      </div>
    </div>
  );
}

/* --------------------------- waitlist ----------------------------- */

/* The launch-page hero: promise up top, capture in the middle,
   proof at the bottom. The field is a real Input with the
   keyboard hint; the button carries the loading state. */

export function HeroWaitlist() {
  return (
    <div className="flex h-full min-h-[440px] flex-col items-center justify-center bg-background px-8 py-16 text-center">
      <Badge variant="accent" dot>
        Cohort 3 opens in March
      </Badge>
      <h1 className="mt-6 max-w-xl text-balance text-5xl font-semibold leading-[1.05] tracking-[-0.035em]">
        The roadmap tool your whole team will actually open
      </h1>
      <p className="mt-5 max-w-md text-balance text-lg leading-relaxed text-muted-foreground">
        One line per week from every team, one calm board for the
        whole company. Join the waitlist and get the first month free.
      </p>
      <form
        className="mt-8 flex w-full max-w-md items-center gap-2"
        onSubmit={(e) => e.preventDefault()}
      >
        <Input
          type="email"
          required
          placeholder="you@company.com"
          aria-label="Work email"
          className="flex-1"
        />
        <Button type="submit" size="lg" className="shrink-0">
          Join waitlist
        </Button>
      </form>
      <p className="mt-3.5 text-[13px] text-faint">
        8,214 in line · No spam, one email when your seat opens
      </p>
    </div>
  );
}

/* ---------------------------- metrics ----------------------------- */

/* Proof-first hero for infrastructure products: the numbers roll
   on real Odometers while the copy stays short. Dark-ready. */

function Metric({
  label,
  value,
  suffix,
  precision,
}: {
  label: string;
  value: number;
  suffix?: string;
  precision?: number;
}) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <span className="flex items-baseline text-3xl font-semibold tabular-nums tracking-[-0.02em]">
        <Odometer
          value={value}
          digits={Math.max(2, String(Math.floor(value)).length)}
          precision={precision}
          className="text-foreground"
        />
        {suffix && <span className="ml-1 text-xl text-muted-foreground">{suffix}</span>}
      </span>
      <span className="text-[12.5px] text-muted-foreground">{label}</span>
    </div>
  );
}

export function HeroMetrics() {
  return (
    <div className="flex h-full min-h-[440px] flex-col items-center justify-center bg-background px-8 py-16 text-center">
      <Badge dot variant="success">All regions operational</Badge>
      <h1 className="mt-6 max-w-2xl text-balance text-5xl font-semibold leading-[1.05] tracking-[-0.035em]">
        Storage that sits closer to your users
      </h1>
      <p className="mt-5 max-w-lg text-balance text-lg leading-relaxed text-muted-foreground">
        Object storage with a global cache, transparent egress pricing and
        an API your scripts already speak.
      </p>
      <div className="mt-9 grid w-full max-w-xl grid-cols-3 gap-6 rounded-2xl bg-card px-6 py-5 shadow-[var(--pollen-shadow-sm)]">
        <Metric label="Objects served / s" value={940} suffix="k" />
        <Metric label="P99 latency" value={38} suffix="ms" />
        <Metric label="Uptime, 12 mo" value={99.99} precision={2} suffix="%" />
      </div>
      <div className="mt-8 flex items-center gap-3">
        <Button size="lg">Start storing</Button>
        <Button size="lg" variant="secondary">
          Read the docs
        </Button>
      </div>
    </div>
  );
}

/* --------------------------- app-shot ----------------------------- */

/* Copy left, a real application window right: sidebar, toolbar and
   table composed from live components, floating on soft depth. */

function AppWindow() {
  const rows = [
    { name: "atlas-web", env: "prod", status: "Ready", tone: "success" as const },
    { name: "atlas-api", env: "prod", status: "Building", tone: "accent" as const },
    { name: "docs", env: "preview", status: "Ready", tone: "success" as const },
  ];
  return (
    <div className="w-[340px] overflow-hidden rounded-2xl bg-card shadow-[var(--pollen-shadow-lg)]">
      <div className="flex items-center gap-2 border-b border-[var(--pollen-separator)] px-4 py-2.5">
        <span className="flex gap-1.5">
          <span className="h-2 w-2 rounded-full bg-fill-strong" />
          <span className="h-2 w-2 rounded-full bg-fill-strong" />
          <span className="h-2 w-2 rounded-full bg-fill-strong" />
        </span>
        <span className="mx-auto text-[11px] text-faint">atlas.dev/deploys</span>
      </div>
      <div className="p-3.5">
        <div className="flex items-center justify-between pb-3">
          <p className="text-[13px] font-semibold text-foreground">Deployments</p>
          <Button size="sm" variant="secondary">New</Button>
        </div>
        <div className="space-y-1.5">
          {rows.map((row) => (
            <div
              key={row.name}
              className="flex items-center gap-2.5 rounded-xl bg-fill/60 px-3 py-2"
            >
              <span
                className={cn(
                  "h-1.5 w-1.5 shrink-0 rounded-full",
                  row.tone === "success" ? "bg-success" : "bg-accent",
                )}
              />
              <span className="font-mono text-[12px] text-foreground">{row.name}</span>
              <span className="text-[11px] text-faint">{row.env}</span>
              <span className="ml-auto text-[11.5px] font-medium text-muted-foreground">
                {row.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function HeroAppShot() {
  return (
    <div className="@container grid h-full min-h-[440px] items-center gap-10 bg-background px-8 py-14 @xl:grid-cols-2 @2xl:px-14">
      <div>
        <Badge variant="neutral">v3 · now with rollbacks</Badge>
        <h1 className="mt-5 text-balance text-4xl font-semibold leading-[1.06] tracking-[-0.03em] sm:text-5xl">
          Deploys your whole team can read
        </h1>
        <p className="mt-5 max-w-md text-lg leading-relaxed text-muted-foreground">
          Every build, preview and rollback in one calm list. No
          dashboard archery, no wall of logs unless you ask for them.
        </p>
        <div className="mt-8 flex items-center gap-3">
          <Button size="lg">
            Deploy your first app
            <ArrowRight className="h-4 w-4" />
          </Button>
          <Button size="lg" variant="ghost">
            View changelog
          </Button>
        </div>
      </div>
      <div className="relative flex justify-center lg:justify-end">
        <div className="relative">
          <AppWindow />
          <div className="absolute -bottom-4 left-6 right-6 h-6 rounded-[50%] bg-black/10 blur-xl dark:bg-black/40" />
        </div>
      </div>
    </div>
  );
}
