import type { Metadata } from "next";
import Link from "next/link";
import { Reveal, CodeBlock } from "pollen-ui";
import { NATIVE_SHIPPED } from "@/components/site/native-note";
import { nativeUsage } from "@/lib/native-usage";
import { registry } from "@/lib/registry";

export const metadata: Metadata = {
  title: "React Native",
  description:
    "The Pollen design language on iOS and Android: install steps, usage for every component @pollen/native ships, and what is web-only today.",
};

const INSTALL_SNIPPET = `npm install @pollen/native

# Peer dependencies (Expo resolves the matching versions):
npx expo install react-native-reanimated react-native-gesture-handler

# Optional, for the className passthrough:
npm install nativewind tailwindcss`;

const COMPONENT_NOTES: Record<string, string> = {
  button: "Four variants, loading state, icon slots, press springs.",
  input: "Label, helper and error lines, password reveal.",
  badge: "Counts, dots and labels in six variants.",
  avatar: "Status dot, initials fallback, overflow chip in groups.",
  switch: "Spring-driven thumb and track tint.",
  slider: "Press-to-jump, drag and step snapping through gesture-handler.",
  progress: "Determinate bar with value readout.",
  skeleton: "Pulse and shimmer effects that respect reduced motion.",
  card: "Surface plus Header, Title, Description, Content and Footer parts.",
  checkbox: "Spring check, indeterminate dash, selectable card option.",
  "radio-group": "Group owns the value; the dot fills on the snappy spring.",
  textarea: "Multiline field with helper states and a live character count.",
  "segmented-control": "Fraction-sized thumb like UISegmentedControl, RTL-aware.",
  "otp-input": "One real TextInput behind the cells: paste and OTP autofill work.",
  rating: 'role="adjustable" so VoiceOver and TalkBack change the score.',
  stepper: "Plus and minus ends that grey out at min and max.",
};

const REQUIREMENTS = [
  ["React Native", "0.74 or newer (tested against 0.88)"],
  ["react-native-reanimated", "3.16 or newer"],
  ["react-native-gesture-handler", "2.20 or newer (Slider)"],
  ["NativeWind", "4 for the optional className passthrough"],
];

export default function ReactNativePage() {
  const shipped = NATIVE_SHIPPED.map((c) => {
    const entry = registry[c.slug];
    return {
      slug: c.slug,
      label: c.label,
      title: entry?.title ?? c.label,
      note: COMPONENT_NOTES[c.slug] ?? "",
      code: nativeUsage[c.slug]?.code ?? "",
    };
  });

  return (
    <div className="mx-auto max-w-[900px] px-6 pb-28">
      <section className="pt-14 sm:pt-16">
        <p className="text-sm font-semibold text-accent">React Native</p>
        <h1 className="mt-3 text-balance text-4xl font-semibold leading-[1.08] tracking-[-0.03em] sm:text-5xl">
          The design language on iOS and Android
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          @pollen/native ships sixteen primitives that share their colors,
          shadows, spacing and springs with the web library through
          @pollen/tokens. This page is the complete set: install steps,
          working native code for every component, and what is web-only
          today.
        </p>
      </section>

      {/* Install */}
      <Reveal className="mt-12">
        <h2 className="text-2xl font-semibold tracking-tight">Install</h2>
        <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
          The package ships TypeScript source that Metro and Expo compile
          directly - no build step, no native module of its own. The peers do
          the platform work: Reanimated for the springs, gesture-handler for
          the Slider.
        </p>
        <div className="mt-4">
          <CodeBlock code={INSTALL_SNIPPET} filename="terminal" language="bash" />
        </div>
      </Reveal>

      {/* Principles */}
      <Reveal className="mt-12">
        <h2 className="text-2xl font-semibold tracking-tight">
          Built on platform primitives
        </h2>
        <p className="mt-3 max-w-3xl text-[15px] leading-relaxed text-muted-foreground">
          Each primitive is implemented with platform APIs: press feedback is
          a scale spring instead of a hover state, elevation maps to
          shadowColor and shadowRadius per platform, and every control
          carries the roles the OS screen readers expect - checkbox,
          radiogroup, adjustable - so VoiceOver and TalkBack announce them
          natively. Colors, spacing and spring presets come from
          @pollen/tokens, so a native screen and its web counterpart read as
          the same product.
        </p>
      </Reveal>

      {/* The components */}
      <Reveal className="mt-12">
        <h2 className="text-2xl font-semibold tracking-tight">
          Every component, with native code
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Sixteen primitives. Each example below compiles against the real
          exports of the package - the same code appears on the component's
          docs page under its React Native section.
        </p>
        <div className="mt-6 space-y-5">
          {shipped.map((c) => (
            <div
              key={c.slug}
              className="overflow-hidden rounded-2xl bg-card shadow-[var(--pollen-shadow-sm)]"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2 bg-fill/60 px-5 py-3">
                <Link
                  href={`/docs/${c.slug}`}
                  className="text-[15px] font-medium text-foreground transition-colors hover:text-accent"
                >
                  {c.title}
                  <span className="ml-2 font-mono text-[12px] text-muted-foreground">
                    {c.label}
                  </span>
                </Link>
                <span className="text-[12.5px] text-muted-foreground">{c.note}</span>
              </div>
              {c.code && (
                <div className="p-4 sm:p-5">
                  <CodeBlock code={c.code} filename="App.tsx" language="tsx" />
                </div>
              )}
            </div>
          ))}
        </div>
      </Reveal>

      {/* Requirements */}
      <Reveal className="mt-12">
        <h2 className="text-2xl font-semibold tracking-tight">Requirements</h2>
        <div className="mt-4 overflow-hidden rounded-2xl bg-card shadow-[var(--pollen-shadow-sm)]">
          {REQUIREMENTS.map(([name, req], i) => (
            <div
              key={name}
              className={`grid gap-1 px-5 py-3.5 sm:grid-cols-[260px_1fr] sm:gap-6 ${
                i > 0 ? "border-t border-[var(--pollen-border)]" : ""
              }`}
            >
              <p className="font-mono text-[13px] font-medium text-foreground">{name}</p>
              <p className="text-[13.5px] text-muted-foreground">{req}</p>
            </div>
          ))}
        </div>
      </Reveal>

      {/* Coverage */}
      <Reveal className="mt-12">
        <h2 className="text-2xl font-semibold tracking-tight">
          What is not on native yet
        </h2>
        <p className="mt-3 max-w-3xl text-[15px] leading-relaxed text-muted-foreground">
          The rest of the web library - Modal, Command, Combobox, the tables,
          the motion set - has no native implementation yet. Selecting React
          Native on those docs pages shows a note instead of placeholder
          code. The primitives above are the complete surface of
          @pollen/native today; new components are added where native
          implementations add the most value.
        </p>
        <p className="mt-4 text-sm leading-relaxed text-faint">
          Building a web-only surface in React Native? Compose it from the
          sixteen primitives and style it with the shared tokens in{" "}
          <span className="font-mono text-[12.5px]">@pollen/tokens</span> - the
          same foundation the native package builds on.
        </p>
      </Reveal>
    </div>
  );
}
