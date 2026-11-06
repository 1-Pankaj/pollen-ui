"use client";

import { useEffect, type CSSProperties } from "react";
import { useIsClient } from "@/lib/use-is-client";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import {
  Avatar,
  IconCheck as Check,
  IconSearch as Search,
  Kbd,
  SlideToConfirm,
  Slider,
  Switch,
} from "pollen-ui";
import { cn } from "pollen-ui";

/* ------------------------------------------------------------------
   The hero scene: the library, floating around its own headline.

   No WebGL and no abstract primitives. The backdrop is built from
   the actual components - a toast pile, a conversation, a slide to
   confirm, a settings card - arranged in a shallow perspective
   stage with real depth cues: near pieces are crisp with heavy
   shadows, far pieces sit smaller, softer and slightly blurred.
   The stage leans toward the pointer and each layer drifts at its
   own rate, so the space reads as genuinely three dimensional.

   Everything is deterministic: fixed positions, no clocks, no
   randomness, and every theme difference lives in CSS classes, so
   the server and the client always agree on the first paint.
   ------------------------------------------------------------------ */

const EASE_OUT = [0.22, 1, 0.36, 1] as const;

/* ---------------------------- specimens --------------------------- */

function ToastPile() {
  return (
    <div className="relative w-[280px]">
      {/* Two cards tucked under the front one, slightly rotated. */}
      <div className="absolute left-5 right-5 top-4 h-[62px] -rotate-2 rounded-2xl bg-card/55 shadow-[var(--pollen-shadow-sm)]" />
      <div className="absolute left-2.5 right-2.5 top-2 h-[62px] rotate-[0.7deg] rounded-2xl bg-card/85 shadow-[var(--pollen-shadow-md)]" />
      <div className="relative flex items-start gap-3 rounded-2xl bg-card p-3.5 shadow-[var(--pollen-shadow-lg)]">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--pollen-success)_14%,transparent)] text-success">
          <Check className="h-3.5 w-3.5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-medium leading-snug text-foreground">
            Deployed to production
          </p>
          <p className="mt-0.5 text-[12.5px] leading-snug text-faint">
            pollen-ui is live on the edge network
          </p>
        </div>
        <span className="mt-0.5 text-[11px] text-faint">now</span>
      </div>
      {/* Contact shadow: the pile sits above the page, not on it. */}
      <div className="absolute -bottom-3.5 left-6 right-6 h-5 rounded-[50%] bg-black/10 blur-lg dark:bg-black/45" />
    </div>
  );
}

function ReactionPill({ emoji, count }: { emoji: string; count: number }) {
  return (
    <span className="flex h-[22px] items-center gap-1 rounded-full bg-fill px-1.5 text-[11.5px] font-medium text-muted-foreground shadow-[var(--pollen-shadow-xs)]">
      <span className="text-[12px] leading-none">{emoji}</span>
      {count}
    </span>
  );
}

function ConversationCard() {
  return (
    <div className="w-[270px] rounded-2xl bg-card p-3.5 shadow-[var(--pollen-shadow-lg)]">
      <div className="flex items-center gap-2.5">
        <Avatar size={28} fallback="AC" />
        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-medium leading-tight text-foreground">Ava Chen</p>
          <p className="text-[11.5px] leading-tight text-faint">Product engineer</p>
        </div>
        <span className="text-[11px] text-faint">now</span>
      </div>
      <div className="mt-3 flex flex-col gap-1.5">
        <div className="max-w-[88%] self-start rounded-2xl rounded-bl-md bg-fill px-3 py-1.5 text-[13px] leading-snug text-foreground">
          The stacked toasts just landed.
        </div>
        <div className="max-w-[88%] self-end rounded-2xl rounded-br-md bg-[var(--pollen-accent)] px-3 py-1.5 text-[13px] leading-snug text-white">
          The pile physics feel great.
        </div>
      </div>
      <div className="mt-2.5 flex justify-end gap-1">
        <ReactionPill emoji="🔥" count={2} />
        <ReactionPill emoji="👍" count={4} />
      </div>
      <div className="absolute -bottom-3.5 left-6 right-6 h-4 rounded-[50%] bg-black/10 blur-lg dark:bg-black/45" />
    </div>
  );
}

function ControlsCard() {
  return (
    <div className="w-[224px] rounded-2xl bg-card/95 p-3.5 shadow-[var(--pollen-shadow-md)] backdrop-blur-md">
      <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-faint">
        Workspace
      </p>
      <div className="mt-3 flex items-center justify-between">
        <span className="text-[13px] text-foreground">Auto theme</span>
        <Switch defaultChecked />
      </div>
      <div className="mt-3 flex items-center justify-between">
        <span className="text-[13px] text-foreground">Radius</span>
        <span className="text-[12px] tabular-nums text-faint">38</span>
      </div>
      <Slider defaultValue={38} className="mt-2" />
    </div>
  );
}

/* ------------------------------ stage ----------------------------- */

interface PanelCfg {
  id: string;
  /** Tailwind position classes inside the stage. */
  className: string;
  /** 0 sits deep in the scene, 1 hugs the lens. Drives parallax. */
  depth: number;
  /** Baked depth scale. */
  scale?: number;
  /** Final opacity, lower for far pieces. */
  fade?: number;
  /** Depth of field: far pieces blur a little. */
  blur?: string;
  /** Entrance delay in seconds. */
  delay: number;
  floatDur: string;
  floatDelay: string;
  content: React.ReactNode;
}

const PANELS: PanelCfg[] = [
  {
    id: "search",
    className: "left-[4%] top-[12.5%]",
    depth: 0.25,
    scale: 0.94,
    fade: 0.85,
    blur: "blur-[1.5px]",
    delay: 0.85,
    floatDur: "11s",
    floatDelay: "-3s",
    content: (
      <div className="flex items-center gap-2.5 rounded-full bg-card/90 py-2 pl-3.5 pr-2 shadow-[var(--pollen-shadow-md)] backdrop-blur-md">
        <Search className="h-3.5 w-3.5 text-faint" />
        <span className="text-[13px] text-faint">Search the library</span>
        <Kbd>⌘K</Kbd>
      </div>
    ),
  },
  {
    id: "toasts",
    className: "right-[2.75%] top-[9%]",
    depth: 0.95,
    delay: 0.7,
    floatDur: "8.5s",
    floatDelay: "-1.5s",
    content: <ToastPile />,
  },
  {
    id: "chat",
    className: "left-[2.75%] bottom-[14%]",
    depth: 0.9,
    delay: 0.78,
    floatDur: "9.5s",
    floatDelay: "-5s",
    content: <ConversationCard />,
  },
  {
    id: "controls",
    className: "right-[3.5%] bottom-[12%]",
    depth: 0.4,
    scale: 0.96,
    fade: 0.92,
    blur: "blur-[0.8px]",
    delay: 0.92,
    floatDur: "10s",
    floatDelay: "-7s",
    content: <ControlsCard />,
  },
  {
    id: "reaction",
    className: "left-[1.6%] top-[46%]",
    depth: 0.35,
    scale: 0.95,
    fade: 0.9,
    blur: "blur-[1px]",
    delay: 1,
    floatDur: "7.5s",
    floatDelay: "-2s",
    content: (
      <div className="flex items-center gap-1.5 rounded-full bg-card py-1.5 pl-2.5 pr-3 shadow-[var(--pollen-shadow-md)]">
        <span className="text-[15px] leading-none">🔥</span>
        <span className="text-[12px] font-semibold tabular-nums text-foreground">12</span>
      </div>
    ),
  },
  {
    id: "slide",
    className: "right-[1.9%] top-[53%]",
    depth: 0.6,
    scale: 0.97,
    delay: 1.08,
    floatDur: "9s",
    floatDelay: "-4s",
    content: (
      <div className="w-[224px] rounded-2xl bg-card/95 p-2.5 shadow-[var(--pollen-shadow-md)] backdrop-blur-md">
        <SlideToConfirm onConfirm={() => {}} label="Slide to deploy" />
      </div>
    ),
  },
];

function Panel({
  cfg,
  sx,
  sy,
  reduce,
}: {
  cfg: PanelCfg;
  sx: MotionValue<number>;
  sy: MotionValue<number>;
  reduce: boolean;
}) {
  // Near layers travel farther than deep ones: that differential
  // drift is what sells the depth.
  const x = useTransform(sx, (v) => v * cfg.depth * 26);
  const y = useTransform(sy, (v) => v * cfg.depth * 16);

  return (
    <motion.div
      className={cn("absolute", cfg.className)}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 26, scale: 0.96 }}
      animate={{ opacity: cfg.fade ?? 1, y: 0, scale: 1 }}
      transition={
        reduce
          ? { duration: 0.3, delay: cfg.delay }
          : { duration: 0.9, ease: EASE_OUT, delay: cfg.delay }
      }
    >
      <motion.div className="will-change-transform" style={{ x, y }}>
        <div
          className={cn(cfg.blur)}
          style={{
            transform: cfg.scale ? `scale(${cfg.scale})` : undefined,
            ["--float-dur" as string]: cfg.floatDur,
            ["--float-delay" as string]: cfg.floatDelay,
          }}
        >
          <div className="hero-float">{cfg.content}</div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/**
 * Full-bleed hero backdrop. A soft accent halo and a faint dot grid
 * set the stage; real library components float around the headline
 * in a leaning perspective plane; scrims, grain and a vignette
 * finish the frame.
 */
export function HeroScene() {
  const reduce = !!useReducedMotion();
  const mounted = useIsClient();

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 50, damping: 20, mass: 0.6 });
  const sy = useSpring(my, { stiffness: 50, damping: 20, mass: 0.6 });

  useEffect(() => {
    if (reduce) return;
    const onMove = (e: PointerEvent) => {
      mx.set((e.clientX / window.innerWidth - 0.5) * 2);
      my.set((e.clientY / window.innerHeight - 0.5) * 2);
    };
    const onLeave = () => {
      mx.set(0);
      my.set(0);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
    };
  }, [reduce, mx, my]);

  // The whole stage leans a couple of degrees toward the pointer.
  const rotateX = useTransform(sy, (v) => v * -2.1);
  const rotateY = useTransform(sx, (v) => v * 3);

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Accent halo rising from the top of the frame. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(52% 40% at 50% 4%, color-mix(in srgb, var(--pollen-accent) 8%, transparent), transparent 72%)",
        }}
      />

      {/* Design-surface dot grid, fading out toward the edges. */}
      <div className="hero-grid absolute inset-0" />

      {/* The floating constellation, large screens only: below xl
          the headline owns the whole stage. */}
      {mounted && (
        <div className="absolute inset-0 hidden xl:block" style={{ perspective: 1500 }}>
          <motion.div
            className="absolute inset-0 [transform-style:preserve-3d]"
            style={{ rotateX, rotateY }}
          >
            {PANELS.map((cfg) => (
              <Panel key={cfg.id} cfg={cfg} sx={sx} sy={sy} reduce={reduce} />
            ))}
          </motion.div>
        </div>
      )}

      {/* Scrims keep the frame legible top and bottom. */}
      <div
        className="absolute inset-x-0 top-0 h-40"
        style={{ background: "linear-gradient(to bottom, var(--pollen-bg), transparent)" }}
      />
      <div
        className="absolute inset-x-0 bottom-0 h-52"
        style={{ background: "linear-gradient(to top, var(--pollen-bg), transparent)" }}
      />

      {/* Film grain and vignette. */}
      <div
        className="scene-grain absolute inset-0 opacity-[0.05] dark:opacity-[0.08]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          backgroundSize: "180px 180px",
        }}
      />
      <div className="scene-vignette absolute inset-0" />
    </div>
  );
}
