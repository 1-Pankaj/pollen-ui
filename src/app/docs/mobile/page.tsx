import type { Metadata } from "next";
import { CodeBlock, Reveal, Alert } from "pollen-ui";

export const metadata: Metadata = {
  title: "Mobile and touch",
  description:
    "What Pollen UI does on phones: safe-area toasts, no focus zoom, expanded hit areas, dvh overlays and contained scrolling.",
};

const viewportCode = `// app/layout.tsx — Next.js App Router
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover", // let content reach the notch edges
};`;

export default function MobilePage() {
  return (
    <article className="max-w-2xl">
      <h1 className="text-4xl font-semibold tracking-tight">
        Mobile and touch
      </h1>
      <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
        The library is built to hold up on Android and iOS, not just shrink
        on them. These behaviours are on by default — nothing to configure —
        but knowing them explains what you will see on a phone.
      </p>

      <Reveal className="mt-12">
        <h2 className="text-2xl font-semibold tracking-tight">
          No focus zoom
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          iOS Safari zooms the page when a field with text smaller than 16 px
          takes focus. Every text-entry surface — Input, Textarea, OTP input,
          tag input and the combobox field — renders at 16 px when the
          pointer is coarse (a real touch device) while keeping its designed
          14–15 px on desktop. No broken zoom, no layout shift.
        </p>
      </Reveal>

      <Reveal className="mt-12">
        <h2 className="text-2xl font-semibold tracking-tight">
          Safe areas respected
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Toasts anchor to the viewport edges — exactly where notches, punch
          holes and home indicators live. All six Toaster positions and every
          ToastPile anchor add the device safe-area inset on top of their
          normal offset, so cards never slide under system UI on either
          platform.
        </p>
      </Reveal>

      <Reveal className="mt-12">
        <h2 className="text-2xl font-semibold tracking-tight">
          Touch-sized targets
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Small controls keep their visual size but receive invisible
          expanded hit areas on coarse pointers: the 28 px toast close
          buttons and the 24 px input clear button both stretch to roughly a
          40 px target. Thumbs hit them; nothing moves on screen.
        </p>
      </Reveal>

      <Reveal className="mt-12">
        <h2 className="text-2xl font-semibold tracking-tight">
          Overlays fit short screens
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Modals, drawers and the command palette size themselves with the
          dynamic viewport height (<code className="rounded bg-fill px-1.5 py-0.5 font-mono text-xs">dvh</code>),
          so iOS collapsing toolbars never push content out of reach. The
          bottom-sheet drawer caps at 85 dvh, tall modal content scrolls
          inside the panel, and every scrollable surface inside an overlay
          uses <code className="rounded bg-fill px-1.5 py-0.5 font-mono text-xs">overscroll-behavior: contain</code>{" "}
          so a flick at the end of a list does not scroll the page behind it.
        </p>
      </Reveal>

      <Reveal className="mt-12">
        <h2 className="text-2xl font-semibold tracking-tight">
          Drag where drag is natural
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Slide-to-confirm and toast dismissal are real drag gestures with
          touch-action handled for you. A swipe in any direction dismisses a
          toast; the slide control only releases when it passes its
          threshold, otherwise it springs back.
        </p>
      </Reveal>

      <Reveal className="mt-12">
        <h2 className="text-2xl font-semibold tracking-tight">
          One thing to set: the viewport meta
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Next.js App Router generates a sensible viewport for you. If you
          want edge-to-edge toasts behind the notch, opt in to{" "}
          <code className="rounded bg-fill px-1.5 py-0.5 font-mono text-xs">viewportFit: &quot;cover&quot;</code>:
        </p>
        <div className="mt-4">
          <CodeBlock filename="app/layout.tsx" language="tsx" code={viewportCode} />
        </div>
        <Alert className="mt-4">
          Without <code>viewportFit: &quot;cover&quot;</code> the safe-area
          insets resolve to zero and everything still works — you just lose
          the edge-to-edge effect.
        </Alert>
      </Reveal>

      <Reveal className="mt-12">
        <h2 className="text-2xl font-semibold tracking-tight">
          How it was verified
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          The whole docs site is swept at iPhone (390 × 844) and Android
          (360 × 800) viewports in both themes for horizontal overflow;
          computed styles are asserted for the focus-zoom and safe-area
          behaviours above; modal, drawer, toast and select interactions are
          exercised with touch input, not just resized screenshots.
        </p>
      </Reveal>
    </article>
  );
}
