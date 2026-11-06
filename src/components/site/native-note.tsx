import Link from "next/link";

/**
 * The sixteen components that ship in @pollen-ui/native today. Everything
 * else is web-only for now - the banner and the code panes state that
 * plainly instead of showing placeholder snippets.
 */
export const NATIVE_SHIPPED = [
  { slug: "button", label: "Button" },
  { slug: "input", label: "Input" },
  { slug: "badge", label: "Badge" },
  { slug: "avatar", label: "Avatar" },
  { slug: "switch", label: "Switch" },
  { slug: "slider", label: "Slider" },
  { slug: "progress", label: "Progress" },
  { slug: "skeleton", label: "Skeleton" },
  { slug: "card", label: "Card" },
  { slug: "checkbox", label: "Checkbox" },
  { slug: "radio-group", label: "RadioGroup" },
  { slug: "textarea", label: "Textarea" },
  { slug: "segmented-control", label: "SegmentedControl" },
  { slug: "otp-input", label: "PinInput" },
  { slug: "rating", label: "Rating" },
  { slug: "stepper", label: "Stepper" },
] as const;

/**
 * The "not on native yet" state. Shown inside a demo's code
 * pane when the React Native stack is selected for a component that
 * @pollen-ui/native does not ship yet.
 */
export function NativePendingNote({ title }: { title: string }) {
  return (
    <div className="rounded-xl bg-fill/60 px-5 py-4 ring-1 ring-[var(--pollen-border)]">
      <p className="text-sm font-medium text-foreground">
        {title} is web-only right now
      </p>
      <p className="mt-1.5 text-[13.5px] leading-relaxed text-muted-foreground">
        @pollen-ui/native ships the design language on iOS and Android
        with sixteen primitives today. The rest of the library is on the
        native roadmap; until then, compose this piece from the shipped
        primitives or style it with the shared tokens in{" "}
        <span className="font-mono text-[12.5px] text-foreground">@pollen-ui/tokens</span>.
      </p>
      <p className="mt-3 flex flex-wrap items-center gap-1.5 text-[12px] text-muted-foreground">
        <span className="font-medium text-foreground">Ships today:</span>
        {NATIVE_SHIPPED.map((c) => (
          <Link
            key={c.slug}
            href={`/docs/${c.slug}`}
            className="rounded-md bg-card px-2 py-1 font-mono text-[11px] text-foreground ring-1 ring-[var(--pollen-border)] transition-colors hover:text-accent"
          >
            {c.label}
          </Link>
        ))}
      </p>
    </div>
  );
}
