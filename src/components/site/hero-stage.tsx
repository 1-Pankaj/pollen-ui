"use client";

import { useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import {
  IconArrowDownRight as ArrowDownRight,
  IconArrowUpRight as ArrowUpRight,
  IconCircleCheck as CheckCircle2,
  IconCommand as CommandIcon,
  IconDatabase as Database,
  IconGlobe as Globe,
  IconDeploy as Rocket,
  IconSearch as Search,
  IconTerminal as Terminal,
  IconUserPlus as UserPlus,
} from "pollen-ui";
import {
  Avatar,
  AvatarGroup,
  Badge,
  Button,
  Kbd,
  NumberTicker,
  Progress,
  SegmentedControl,
  Switch,
  toast,
} from "pollen-ui";

/* ------------------------------------------------------------------
   Deterministic, hand-tuned series. One per range so flipping the
   segmented control redraws the chart with a spring.
   ------------------------------------------------------------------ */

const seriesByRange: Record<string, number[]> = {
  "24h": [14, 18, 17, 23, 28, 27, 34, 41, 39, 47, 53, 51, 59, 66, 64, 72, 78, 86],
  "7d": [22, 30, 27, 36, 42, 40, 48, 56, 53, 61, 67, 64, 72, 78, 75, 83, 88, 96],
  "30d": [18, 26, 34, 31, 42, 50, 47, 44, 56, 63, 60, 70, 78, 74, 84, 90, 96, 104],
};

const requestsByRange: Record<string, number> = {
  "24h": 2412093,
  "7d": 15784201,
  "30d": 64089222,
};

const statsByRange: Record<
  string,
  { label: string; value: string; delta: string; dir: "up" | "down"; good: boolean }[]
> = {
  "24h": [
    { label: "p99 latency", value: "182 ms", delta: "8.1%", dir: "down", good: true },
    { label: "Error rate", value: "0.31%", delta: "0.04pt", dir: "down", good: true },
  ],
  "7d": [
    { label: "p99 latency", value: "174 ms", delta: "2.3%", dir: "down", good: true },
    { label: "Error rate", value: "0.28%", delta: "0.01pt", dir: "down", good: true },
  ],
  "30d": [
    { label: "p99 latency", value: "191 ms", delta: "3.4%", dir: "up", good: false },
    { label: "Error rate", value: "0.33%", delta: "0.05pt", dir: "up", good: false },
  ],
};

const W = 640;
const H = 170;
const PAD = 12;

function buildPath(values: number[]) {
  const max = Math.max(...values) * 1.18;
  const stepX = (W - PAD * 2) / (values.length - 1);
  const pts = values.map((v, i) => ({
    x: PAD + i * stepX,
    y: H - PAD - (v / max) * (H - PAD * 2),
  }));
  let d = `M ${pts[0].x.toFixed(1)},${pts[0].y.toFixed(1)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(i - 1, 0)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(i + 2, pts.length - 1)];
    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${c1x.toFixed(1)},${c1y.toFixed(1)} ${c2x.toFixed(1)},${c2y.toFixed(1)} ${p2.x.toFixed(1)},${p2.y.toFixed(1)}`;
  }
  const area = `${d} L ${pts[pts.length - 1].x.toFixed(1)},${H - PAD} L ${pts[0].x.toFixed(1)},${H - PAD} Z`;
  return { line: d, area, last: pts[pts.length - 1] };
}

const eventRows = [
  { icon: CheckCircle2, tone: "success", text: "Deploy succeeded", context: "pollen-web · production", time: "2m" },
  { icon: Database, tone: "warning", text: "Cache purged", context: "global edge network", time: "9m" },
  { icon: Globe, tone: "accent", text: "Domain connected", context: "pollen.dev", time: "1h" },
] as const;

const toneStyles: Record<string, string> = {
  success: "bg-success/15 text-success-ink",
  warning: "bg-warning/15 text-warning-ink",
  accent: "bg-accent/15 text-accent",
};

const commands = [
  { icon: Rocket, label: "Deploy to production", kbd: "⌘⏎" },
  { icon: Terminal, label: "View runtime logs", kbd: "⌘L" },
  { icon: UserPlus, label: "Invite teammate", kbd: "⌘I" },
];

/* ------------------------------------------------------------------ */

export function HeroStage() {
  const [range, setRange] = useState("24h");
  const [alerts, setAlerts] = useState(true);
  const reduce = useReducedMotion();
  const stageRef = useRef<HTMLDivElement>(null);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 55, damping: 16, mass: 0.6 });
  const sy = useSpring(my, { stiffness: 55, damping: 16, mass: 0.6 });

  const winX = useTransform(sx, (v) => v * 7);
  const winY = useTransform(sy, (v) => v * 5);
  const winRX = useTransform(sy, (v) => v * -1.1);
  const winRY = useTransform(sx, (v) => v * 1.1);
  const satX = useTransform(sx, (v) => v * -13);
  const satY = useTransform(sy, (v) => v * -9);
  const deepX = useTransform(sx, (v) => v * -20);
  const deepY = useTransform(sy, (v) => v * -13);

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (reduce) return;
    const rect = stageRef.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set(((e.clientX - rect.left) / rect.width - 0.5) * 2);
    my.set(((e.clientY - rect.top) / rect.height - 0.5) * 2);
  }

  function onPointerLeave() {
    mx.set(0);
    my.set(0);
  }

  const values = seriesByRange[range];
  const { line, area, last } = buildPath(values);
  const restStats = statsByRange[range];

  const enter = (delay: number) =>
    reduce
      ? { initial: { opacity: 1 }, animate: { opacity: 1 } }
      : {
          initial: { opacity: 0, y: 28, scale: 0.9 },
          whileInView: { opacity: 1, y: 0, scale: 1 },
          viewport: { once: true, margin: "-60px" },
          transition: { type: "spring" as const, stiffness: 210, damping: 20, delay },
        };

  return (
    <div
      ref={stageRef}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      className="relative mx-auto w-full max-w-5xl"
      style={{ perspective: 1400 }}
    >
      {/* Atmosphere behind the window */}
      <div
        aria-hidden="true"
        className="absolute inset-x-6 top-10 -z-10 h-[440px] rounded-[100%] bg-[radial-gradient(closest-side,color-mix(in_srgb,var(--pollen-accent)_16%,transparent),transparent)] blur-3xl"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-24 top-0 -z-10 h-[300px] rounded-[100%] bg-[radial-gradient(closest-side,color-mix(in_srgb,var(--pollen-fg)_7%,transparent),transparent)] blur-2xl"
      />

      {/* Product window */}
      <motion.div {...enter(0.05)} className="relative z-10">
        <motion.div
          style={
            reduce
              ? undefined
              : {
                  x: winX,
                  y: winY,
                  rotateX: winRX,
                  rotateY: winRY,
                  transformPerspective: 1400,
                }
          }
          className="rounded-[24px] bg-card p-4 text-left shadow-[var(--pollen-shadow-lg)] sm:rounded-[28px] sm:p-6"
        >
          {/* Toolbar */}
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="flex h-7 items-center rounded-lg bg-fill px-2.5 font-mono text-xs font-medium text-foreground">
              pollen.dev
            </span>
            <Badge variant="success">Live</Badge>
            <div className="ml-auto hidden items-center gap-2.5 sm:flex">
              <AvatarGroup max={3}>
                <Avatar size={28} src="/avatars/ada.jpg" fallback="Mia Holt" />
                <Avatar size={28} src="/avatars/grace.jpg" fallback="Leo Tan" />
                <Avatar size={28} src="/avatars/mia.jpg" fallback="Ada Cole" />
              </AvatarGroup>
            </div>
          </div>

          {/* KPI row */}
          <div className="mt-4 grid grid-cols-3 gap-2.5 sm:gap-3">
            <div className="rounded-xl bg-fill p-3.5 sm:px-4">
              <p className="truncate text-xs text-muted-foreground">Requests</p>
              <p className="mt-1.5 truncate text-lg font-semibold tabular-nums tracking-[-0.01em] text-foreground sm:text-[22px]">
                <NumberTicker value={requestsByRange[range]} className="tabular-nums" />
              </p>
              <p className="mt-1 flex items-center gap-0.5 text-xs font-medium tabular-nums text-success-ink">
                <ArrowUpRight className="h-3 w-3" />
                12.4%
              </p>
            </div>
            {restStats.map((stat) => (
              <motion.div
                key={`${range}-${stat.label}`}
                initial={reduce ? false : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: reduce ? 0 : 0.35, ease: "easeOut" }}
                className="rounded-xl bg-fill p-3.5 sm:px-4"
              >
                <p className="truncate text-xs text-muted-foreground">{stat.label}</p>
                <p className="mt-1.5 truncate text-lg font-semibold tabular-nums tracking-[-0.01em] text-foreground sm:text-[22px]">
                  {stat.value}
                </p>
                <p
                  className={`mt-1 flex items-center gap-0.5 text-xs font-medium tabular-nums ${
                    stat.good ? "text-success-ink" : "text-danger-ink"
                  }`}
                >
                  {stat.dir === "up" ? (
                    <ArrowUpRight className="h-3 w-3" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3" />
                  )}
                  {stat.delta}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Chart */}
          <div className="mt-2.5 rounded-xl bg-fill p-4 sm:mt-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-[13px] font-medium text-foreground">Requests per second</p>
              <SegmentedControl
                size="sm"
                aria-label="Time range"
                value={range}
                onValueChange={setRange}
                options={[
                  { value: "24h", label: "24h" },
                  { value: "7d", label: "7d" },
                  { value: "30d", label: "30d" },
                ]}
              />
            </div>
            <svg
              viewBox={`0 0 ${W} ${H}`}
              className="mt-3 h-[130px] w-full sm:h-[160px]"
              role="img"
              aria-label={`Requests over the past ${range}, trending up`}
            >
              <defs>
                <linearGradient id="pollen-hero-area" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--pollen-accent)" stopOpacity="0.22" />
                  <stop offset="100%" stopColor="var(--pollen-accent)" stopOpacity="0" />
                </linearGradient>
              </defs>
              {[0.25, 0.5, 0.75].map((t) => (
                <line
                  key={t}
                  x1={PAD}
                  x2={W - PAD}
                  y1={PAD + t * (H - PAD * 2)}
                  y2={PAD + t * (H - PAD * 2)}
                  stroke="var(--pollen-separator)"
                  strokeWidth="1"
                />
              ))}
              <motion.path
                key={`area-${range}`}
                d={area}
                fill="url(#pollen-hero-area)"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: reduce ? 0 : 0.8, delay: 0.3, ease: "easeOut" }}
              />
              <motion.path
                key={`line-${range}`}
                d={line}
                fill="none"
                stroke="var(--pollen-accent)"
                strokeWidth="2"
                strokeLinecap="round"
                initial={{ pathLength: reduce ? 1 : 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: reduce ? 0 : 1.1, ease: "easeOut" }}
              />
              <motion.circle
                key={`dot-${range}`}
                cx={last.x}
                cy={last.y}
                r="4"
                fill="var(--pollen-accent)"
                stroke="var(--pollen-fill)"
                strokeWidth="2"
                initial={{ scale: reduce ? 1 : 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={
                  reduce
                    ? { duration: 0 }
                    : { type: "spring", stiffness: 400, damping: 18, delay: 0.85 }
                }
                style={{ transformOrigin: `${last.x}px ${last.y}px` }}
              />
            </svg>
            <div className="mt-2 flex justify-between font-mono text-[10px] text-faint">
              <span>00:00</span>
              <span className="hidden sm:inline">06:00</span>
              <span>12:00</span>
              <span className="hidden sm:inline">18:00</span>
              <span>now</span>
            </div>
          </div>

          {/* Events + usage */}
          <div className="mt-2.5 grid gap-2.5 sm:mt-3 sm:grid-cols-[1.15fr_1fr]">
            <div className="rounded-xl bg-fill p-3.5 sm:p-4">
              <p className="text-[13px] font-medium text-foreground">Live events</p>
              <div className="mt-1.5 flex flex-col gap-0.5">
                {eventRows.map((event) => (
                  <div
                    key={event.text}
                    className="flex items-center gap-2.5 rounded-lg px-1.5 py-1.5 transition-colors hover:bg-card"
                  >
                    <span
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md ${toneStyles[event.tone]}`}
                    >
                      <event.icon className="h-3.5 w-3.5" />
                    </span>
                    <span className="truncate text-[13px] font-medium text-foreground">
                      {event.text}
                    </span>
                    <span className="hidden truncate text-xs text-muted-foreground md:inline">
                      {event.context}
                    </span>
                    <span className="ml-auto shrink-0 font-mono text-xs text-faint">
                      {event.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-3 rounded-xl bg-fill p-3.5 sm:p-4">
              <div>
                <div className="flex items-center justify-between text-[13px]">
                  <span className="font-medium text-foreground">Build minutes</span>
                  <span className="tabular-nums text-muted-foreground">72%</span>
                </div>
                <Progress value={72} className="mt-2.5" />
                <p className="mt-2 text-xs text-muted-foreground">820 min left this month</p>
              </div>
              <label className="mt-auto flex items-center justify-between gap-3">
                <span>
                  <span className="block text-[13px] font-medium text-foreground">
                    Anomaly alerts
                  </span>
                  <span className="block text-xs text-muted-foreground">
                    Notify the on-call channel
                  </span>
                </span>
                <Switch checked={alerts} onCheckedChange={setAlerts} aria-label="Anomaly alerts" />
              </label>
            </div>
          </div>

          {/* Working actions */}
          <div className="mt-2.5 flex items-center justify-between gap-3 rounded-xl bg-fill/70 p-2.5 sm:mt-3">
            <span className="hidden pl-1.5 text-xs text-faint min-[460px]:inline">
              Updated 30 seconds ago
            </span>
            <div className="ml-auto flex items-center gap-1.5">
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  toast("Log stream opened", {
                    description: "Following pollen-web, last 100 lines.",
                  })
                }
              >
                View logs
              </Button>
              <Button
                size="sm"
                onClick={() =>
                  toast.success("Deployment queued", {
                    description: "pollen-web is building on us-east-1.",
                  })
                }
              >
                New deploy
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Satellite: command palette */}
      <motion.div style={reduce ? undefined : { x: deepX, y: deepY }} className="absolute -top-12 right-1 z-20 hidden w-[272px] md:block lg:-right-8">
        <motion.div
          {...enter(0.32)}
          className="rotate-[1.4deg] rounded-2xl bg-card p-3 shadow-[var(--pollen-shadow-lg)]"
        >
          <div className="flex items-center gap-2 px-1 pb-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-fill text-muted-foreground">
              <CommandIcon className="h-3.5 w-3.5" />
            </span>
            <span className="text-[13px] font-medium text-foreground">Command</span>
            <span className="ml-auto flex gap-0.5">
              <Kbd>⌘</Kbd>
              <Kbd>K</Kbd>
            </span>
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-fill px-2.5 py-2">
            <Search className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-[13px] text-muted-foreground">dep</span>
            <span className="ml-auto font-mono text-[10px] text-faint">esc</span>
          </div>
          <div className="mt-1.5 flex flex-col gap-0.5">
            {commands.map((cmd, i) => (
              <div
                key={cmd.label}
                className={`flex items-center gap-2.5 rounded-lg px-2 py-1.5 text-[13px] ${
                  i === 0 ? "bg-fill text-foreground" : "text-muted-foreground"
                }`}
              >
                <cmd.icon className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">{cmd.label}</span>
                <Kbd className="ml-auto shrink-0">{cmd.kbd}</Kbd>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* Satellite: toast */}
      <motion.div style={reduce ? undefined : { x: satX, y: satY }} className="absolute -bottom-9 left-2 z-20 hidden md:block lg:-left-6">
        <motion.div
          {...enter(0.45)}
          className="flex rotate-[-1.6deg] items-center gap-3 rounded-2xl bg-card p-3.5 pr-5 shadow-[var(--pollen-shadow-lg)]"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-success/15 text-success-ink">
            <CheckCircle2 className="h-4.5 w-4.5" />
          </span>
          <span>
            <span className="block text-[13px] font-medium text-foreground">
              Deployment complete
            </span>
            <span className="block text-xs text-muted-foreground">
              pollen-web · production · 42s
            </span>
          </span>
        </motion.div>
      </motion.div>

      {/* Satellite: presence */}
      <motion.div style={reduce ? undefined : { x: satX, y: satY }} className="absolute -top-8 left-4 z-20 hidden md:block lg:-left-2">
        <motion.div
          {...enter(0.56)}
          className="flex rotate-[-1.2deg] items-center gap-3 rounded-2xl bg-card p-3 pr-4 shadow-[var(--pollen-shadow-md)]"
        >
          <AvatarGroup max={4}>
            <Avatar size={28} src="/avatars/alan.jpg" fallback="Ben Oz" />
            <Avatar size={28} src="/avatars/rae.jpg" fallback="Ada Cole" />
            <Avatar size={28} src="/avatars/mia.jpg" fallback="Mia Holt" />
            <Avatar size={28} src="/avatars/grace.jpg" fallback="Leo Tan" />
          </AvatarGroup>
          <span>
            <span className="block text-[13px] font-medium text-foreground">4 editing now</span>
            <span className="block text-xs text-muted-foreground">Live presence</span>
          </span>
        </motion.div>
      </motion.div>
    </div>
  );
}
