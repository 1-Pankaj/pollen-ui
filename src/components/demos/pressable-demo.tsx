"use client";

import { PressableCard, toast } from "pollen-ui";
import {
  IconDeploy as Rocket,
  IconGauge as Gauge,
  IconTrend as TrendingUp,
} from "pollen-ui";

export function PressableDemo() {
  return (
    <div className="grid w-full max-w-[460px] gap-3 sm:grid-cols-2">
      <PressableCard depth="md" onClick={() => toast("Deployments opened")}>
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-fill text-foreground">
          <Rocket className="h-4.5 w-4.5" />
        </span>
        <p className="mt-4 text-[15px] font-semibold tracking-[-0.01em] text-foreground">Deployments</p>
        <p className="mt-1 text-[13.5px] leading-relaxed text-muted-foreground">
          Press it. The card compresses into its shadow and springs back.
        </p>
      </PressableCard>
      <PressableCard depth="md" tilt={false}>
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-fill text-foreground">
          <Gauge className="h-4.5 w-4.5" />
        </span>
        <p className="mt-4 text-[15px] font-semibold tracking-[-0.01em] text-foreground">No tilt</p>
        <p className="mt-1 text-[13.5px] leading-relaxed text-muted-foreground">
          The spotlight stays; the physics turn off per block.
        </p>
      </PressableCard>
    </div>
  );
}

export function PressableRowDemo() {
  const blocks = [
    {
      title: "Pressable",
      body: "Tilts toward the cursor, compresses into its shadow on press.",
      onClick: () => toast("Deployments opened"),
    },
    {
      title: "Interactive",
      body: "Spotlight tracks the pointer; springs settle with overshoot.",
      onClick: () => toast("Analytics opened"),
    },
    {
      title: "Open source",
      body: "Every block on this page is MIT. Copy the source and ship it.",
      href: "/docs/pressable-card",
    },
  ];
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {blocks.map((b) =>
        b.href ? (
          <PressableCard key={b.title} depth="md" href={b.href}>
            <p className="text-[15px] font-semibold tracking-[-0.01em] text-foreground">{b.title}</p>
            <p className="mt-1 text-[13.5px] leading-relaxed text-muted-foreground">{b.body}</p>
          </PressableCard>
        ) : (
          <PressableCard key={b.title} depth="md" onClick={b.onClick}>
            <p className="text-[15px] font-semibold tracking-[-0.01em] text-foreground">{b.title}</p>
            <p className="mt-1 text-[13.5px] leading-relaxed text-muted-foreground">{b.body}</p>
          </PressableCard>
        ),
      )}
    </div>
  );
}

export function PressableTrendDemo() {
  return (
    <PressableCard depth="sm" className="p-5" onClick={() => toast("Revenue report opened")}>
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-fill text-foreground">
        <TrendingUp className="h-4 w-4" />
      </span>
      <p className="mt-3 text-[14px] font-semibold text-foreground">Revenue</p>
      <p className="text-[12.5px] text-muted-foreground">Small depth, same physics.</p>
    </PressableCard>
  );
}
